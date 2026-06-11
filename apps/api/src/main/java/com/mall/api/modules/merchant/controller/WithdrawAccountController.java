package com.mall.api.modules.merchant.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.update.LambdaUpdateWrapper;
import com.mall.api.common.enums.ResultCode;
import com.mall.api.common.exception.BusinessException;
import com.mall.api.common.response.ApiResponse;
import com.mall.api.modules.merchant.entity.Merchant;
import com.mall.api.modules.merchant.entity.WithdrawAccount;
import com.mall.api.modules.merchant.mapper.MerchantMapper;
import com.mall.api.modules.merchant.mapper.WithdrawAccountMapper;
import com.mall.api.security.SecurityUtils;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping({"/api/merchant/withdraw-accounts", "/api/v1/merchant/withdraw-accounts"})
@Tag(name = "商家提款账户")
@PreAuthorize("hasRole('MERCHANT')")
public class WithdrawAccountController {

    private static final String TYPE_CRYPTO = "CRYPTO";
    private static final String TYPE_BANK = "BANK";

    private final WithdrawAccountMapper accountMapper;
    private final MerchantMapper merchantMapper;

    public WithdrawAccountController(WithdrawAccountMapper accountMapper, MerchantMapper merchantMapper) {
        this.accountMapper = accountMapper;
        this.merchantMapper = merchantMapper;
    }

    @GetMapping
    @Operation(summary = "提款账户列表")
    public ApiResponse<List<WithdrawAccount>> list() {
        Merchant merchant = currentMerchant();
        List<WithdrawAccount> list = accountMapper.selectList(new LambdaQueryWrapper<WithdrawAccount>()
                .eq(WithdrawAccount::getMerchantId, merchant.getId())
                .eq(WithdrawAccount::getDeleted, false)
                .orderByDesc(WithdrawAccount::getIsDefault)
                .orderByDesc(WithdrawAccount::getCreatedAt));
        return ApiResponse.success(list);
    }

    @PostMapping
    @Operation(summary = "新增提款账户")
    @Transactional
    public ApiResponse<WithdrawAccount> create(@RequestBody WithdrawAccount body) {
        Merchant merchant = currentMerchant();
        validate(body);

        WithdrawAccount account = new WithdrawAccount();
        account.setMerchantId(merchant.getId());
        account.setUserId(merchant.getUserId());
        copyFields(body, account);
        account.setStatus("ENABLE");
        account.setDeleted(false);
        account.setIsDefault(Boolean.TRUE.equals(body.getIsDefault()));
        LocalDateTime now = LocalDateTime.now();
        account.setCreatedAt(now);
        account.setUpdatedAt(now);
        accountMapper.insert(account);

        if (Boolean.TRUE.equals(account.getIsDefault())) {
            clearOtherDefault(merchant.getId(), account.getId());
        }
        return ApiResponse.success(account);
    }

    @PutMapping("/{id}")
    @Operation(summary = "编辑提款账户")
    @Transactional
    public ApiResponse<Void> update(@PathVariable Long id, @RequestBody WithdrawAccount body) {
        Merchant merchant = currentMerchant();
        WithdrawAccount account = requireOwned(id, merchant.getId());
        validate(body);
        copyFields(body, account);
        if (body.getIsDefault() != null) {
            account.setIsDefault(body.getIsDefault());
        }
        account.setUpdatedAt(LocalDateTime.now());
        accountMapper.updateById(account);
        if (Boolean.TRUE.equals(account.getIsDefault())) {
            clearOtherDefault(merchant.getId(), account.getId());
        }
        return ApiResponse.success();
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "删除提款账户")
    public ApiResponse<Void> delete(@PathVariable Long id) {
        Merchant merchant = currentMerchant();
        WithdrawAccount account = requireOwned(id, merchant.getId());
        account.setDeleted(true);
        account.setUpdatedAt(LocalDateTime.now());
        accountMapper.updateById(account);
        return ApiResponse.success();
    }

    @PutMapping("/{id}/default")
    @Operation(summary = "设为默认提款账户")
    @Transactional
    public ApiResponse<Void> setDefault(@PathVariable Long id) {
        Merchant merchant = currentMerchant();
        WithdrawAccount account = requireOwned(id, merchant.getId());
        account.setIsDefault(true);
        account.setUpdatedAt(LocalDateTime.now());
        accountMapper.updateById(account);
        clearOtherDefault(merchant.getId(), account.getId());
        return ApiResponse.success();
    }

    private void validate(WithdrawAccount body) {
        if (body == null || body.getType() == null) {
            throw new BusinessException(ResultCode.BAD_REQUEST.getCode(), "账户类型不能为空");
        }
        if (TYPE_CRYPTO.equals(body.getType())) {
            if (isBlank(body.getChain()) || isBlank(body.getAddress())) {
                throw new BusinessException(ResultCode.BAD_REQUEST.getCode(), "请填写链类型和钱包地址");
            }
            if (body.getAddress().trim().length() < 12) {
                throw new BusinessException(ResultCode.BAD_REQUEST.getCode(), "Wallet address is invalid");
            }
        } else if (TYPE_BANK.equals(body.getType())) {
            if (isBlank(body.getBankName()) || isBlank(body.getAccountNo()) || isBlank(body.getAccountName())) {
                throw new BusinessException(ResultCode.BAD_REQUEST.getCode(), "请填写银行名称、账号和户名");
            }
            if (body.getAccountNo().replaceAll("\\s+", "").length() < 6) {
                throw new BusinessException(ResultCode.BAD_REQUEST.getCode(), "Bank account number is invalid");
            }
        } else {
            throw new BusinessException(ResultCode.BAD_REQUEST.getCode(), "账户类型不合法");
        }
    }

    private void copyFields(WithdrawAccount from, WithdrawAccount to) {
        to.setType(from.getType());
        to.setChain(from.getChain());
        to.setAddress(from.getAddress());
        to.setBankName(from.getBankName());
        to.setAccountNo(from.getAccountNo());
        to.setAccountName(from.getAccountName());
        to.setSwiftCode(from.getSwiftCode());
        to.setCountry(from.getCountry());
        to.setRemark(from.getRemark());
    }

    private void clearOtherDefault(Long merchantId, Long keepId) {
        accountMapper.update(null, new LambdaUpdateWrapper<WithdrawAccount>()
                .eq(WithdrawAccount::getMerchantId, merchantId)
                .ne(WithdrawAccount::getId, keepId)
                .set(WithdrawAccount::getIsDefault, false));
    }

    private WithdrawAccount requireOwned(Long id, Long merchantId) {
        WithdrawAccount account = accountMapper.selectById(id);
        if (account == null || Boolean.TRUE.equals(account.getDeleted())
                || !merchantId.equals(account.getMerchantId())) {
            throw new BusinessException(ResultCode.NOT_FOUND.getCode(), "账户不存在");
        }
        return account;
    }

    private Merchant currentMerchant() {
        Long userId = SecurityUtils.getCurrentUserId();
        Merchant merchant = userId == null ? null : merchantMapper.selectByUserId(userId);
        if (merchant == null) {
            throw new BusinessException(ResultCode.FORBIDDEN.getCode(), "Merchant profile not found");
        }
        return merchant;
    }

    private boolean isBlank(String s) {
        return s == null || s.trim().isEmpty();
    }
}
