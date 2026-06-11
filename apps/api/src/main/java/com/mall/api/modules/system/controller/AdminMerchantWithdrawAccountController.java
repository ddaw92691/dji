package com.mall.api.modules.system.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.update.LambdaUpdateWrapper;
import com.mall.api.common.enums.ResultCode;
import com.mall.api.common.exception.BusinessException;
import com.mall.api.common.response.ApiResponse;
import com.mall.api.modules.log.annotation.Audit;
import com.mall.api.modules.merchant.entity.Merchant;
import com.mall.api.modules.merchant.entity.WithdrawAccount;
import com.mall.api.modules.merchant.mapper.MerchantMapper;
import com.mall.api.modules.merchant.mapper.WithdrawAccountMapper;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

@RestController
@RequestMapping({"/api/admin/merchant-withdraw-accounts", "/api/v1/admin/merchant-withdraw-accounts"})
@Tag(name = "Admin Merchant Withdraw Accounts")
@PreAuthorize("hasAnyRole('SUPER_ADMIN','ADMIN')")
public class AdminMerchantWithdrawAccountController {

    private final MerchantMapper merchantMapper;
    private final WithdrawAccountMapper accountMapper;

    public AdminMerchantWithdrawAccountController(MerchantMapper merchantMapper,
                                                  WithdrawAccountMapper accountMapper) {
        this.merchantMapper = merchantMapper;
        this.accountMapper = accountMapper;
    }

    @GetMapping
    @PreAuthorize("@perm.has('admin:user:merchant:fund')")
    public ApiResponse<List<Map<String, Object>>> list(@RequestParam Long merchantId) {
        requireMerchant(merchantId);
        List<WithdrawAccount> accounts = accountMapper.selectList(new LambdaQueryWrapper<WithdrawAccount>()
                .eq(WithdrawAccount::getMerchantId, merchantId)
                .eq(WithdrawAccount::getDeleted, false)
                .orderByDesc(WithdrawAccount::getIsDefault)
                .orderByDesc(WithdrawAccount::getCreatedAt));
        return ApiResponse.success(accounts.stream().map(this::masked).toList());
    }

    @PostMapping
    @PreAuthorize("@perm.has('admin:user:merchant:fund')")
    @Audit(module = "Merchant", action = "Create withdraw account", description = "Admin creates merchant withdraw account")
    @Transactional
    public ApiResponse<Map<String, Object>> create(@RequestParam Long merchantId,
                                                   @RequestBody WithdrawAccount body) {
        Merchant merchant = requireMerchant(merchantId);
        validate(body);
        WithdrawAccount account = new WithdrawAccount();
        account.setMerchantId(merchant.getId());
        account.setUserId(merchant.getUserId());
        copy(body, account);
        account.setStatus(textOr(body.getStatus(), "ENABLE"));
        account.setDeleted(false);
        account.setIsDefault(Boolean.TRUE.equals(body.getIsDefault()));
        LocalDateTime now = LocalDateTime.now();
        account.setCreatedAt(now);
        account.setUpdatedAt(now);
        accountMapper.insert(account);
        if (Boolean.TRUE.equals(account.getIsDefault())) {
            clearOtherDefault(account.getMerchantId(), account.getId());
        }
        return ApiResponse.success(masked(account));
    }

    @PutMapping("/{accountId}")
    @PreAuthorize("@perm.has('admin:user:merchant:fund')")
    @Audit(module = "Merchant", action = "Update withdraw account", description = "Admin updates merchant withdraw account")
    @Transactional
    public ApiResponse<Map<String, Object>> update(@PathVariable Long accountId,
                                                   @RequestBody WithdrawAccount body) {
        WithdrawAccount account = requireAccount(accountId);
        validate(body);
        copy(body, account);
        if (body.getStatus() != null) {
            account.setStatus(body.getStatus());
        }
        if (body.getIsDefault() != null) {
            account.setIsDefault(body.getIsDefault());
        }
        account.setUpdatedAt(LocalDateTime.now());
        accountMapper.updateById(account);
        if (Boolean.TRUE.equals(account.getIsDefault())) {
            clearOtherDefault(account.getMerchantId(), account.getId());
        }
        return ApiResponse.success(masked(account));
    }

    @DeleteMapping("/{accountId}")
    @PreAuthorize("@perm.has('admin:user:merchant:fund')")
    @Audit(module = "Merchant", action = "Disable withdraw account", description = "Admin disables merchant withdraw account")
    public ApiResponse<Void> delete(@PathVariable Long accountId) {
        WithdrawAccount account = requireAccount(accountId);
        account.setDeleted(true);
        account.setStatus("DISABLE");
        account.setUpdatedAt(LocalDateTime.now());
        accountMapper.updateById(account);
        return ApiResponse.success();
    }

    private Merchant requireMerchant(Long merchantId) {
        Merchant merchant = merchantMapper.selectById(merchantId);
        if (merchant == null || Boolean.TRUE.equals(merchant.getDeleted())) {
            throw new BusinessException(ResultCode.NOT_FOUND.getCode(), "Merchant not found");
        }
        return merchant;
    }

    private WithdrawAccount requireAccount(Long accountId) {
        WithdrawAccount account = accountMapper.selectById(accountId);
        if (account == null || Boolean.TRUE.equals(account.getDeleted())) {
            throw new BusinessException(ResultCode.NOT_FOUND.getCode(), "Withdraw account not found");
        }
        return account;
    }

    private void validate(WithdrawAccount body) {
        if (body == null || blank(body.getType())) {
            throw new BusinessException(ResultCode.BAD_REQUEST.getCode(), "Withdraw account type is required");
        }
        if ("CRYPTO".equalsIgnoreCase(body.getType())) {
            if (blank(body.getChain()) || blank(body.getAddress()) || body.getAddress().trim().length() < 12) {
                throw new BusinessException(ResultCode.BAD_REQUEST.getCode(), "Crypto network and valid wallet address are required");
            }
        } else if ("BANK".equalsIgnoreCase(body.getType())) {
            if (blank(body.getBankName()) || blank(body.getAccountNo()) || blank(body.getAccountName())) {
                throw new BusinessException(ResultCode.BAD_REQUEST.getCode(), "Bank name, account number and account name are required");
            }
            if (body.getAccountNo().replaceAll("\\s+", "").length() < 6) {
                throw new BusinessException(ResultCode.BAD_REQUEST.getCode(), "Bank account number is invalid");
            }
        } else {
            throw new BusinessException(ResultCode.BAD_REQUEST.getCode(), "Withdraw account type is invalid");
        }
    }

    private void copy(WithdrawAccount from, WithdrawAccount to) {
        to.setType(from.getType().toUpperCase(Locale.ROOT));
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

    private Map<String, Object> masked(WithdrawAccount account) {
        Map<String, Object> item = new LinkedHashMap<>();
        item.put("id", account.getId());
        item.put("merchantId", account.getMerchantId());
        item.put("type", account.getType());
        item.put("chain", account.getChain());
        item.put("address", mask(account.getAddress(), 6, 4));
        item.put("bankName", account.getBankName());
        item.put("accountNo", mask(account.getAccountNo(), 4, 4));
        item.put("accountName", account.getAccountName());
        item.put("swiftCode", account.getSwiftCode());
        item.put("country", account.getCountry());
        item.put("remark", account.getRemark());
        item.put("isDefault", account.getIsDefault());
        item.put("status", account.getStatus());
        item.put("createdAt", account.getCreatedAt());
        item.put("updatedAt", account.getUpdatedAt());
        return item;
    }

    private String mask(String value, int prefix, int suffix) {
        if (value == null || value.isBlank()) return value;
        String text = value.trim();
        if (text.length() <= prefix + suffix) return "****";
        return text.substring(0, prefix) + "****" + text.substring(text.length() - suffix);
    }

    private String textOr(String value, String fallback) {
        return value == null || value.isBlank() ? fallback : value;
    }

    private boolean blank(String value) {
        return value == null || value.trim().isEmpty();
    }
}
