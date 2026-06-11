package com.mall.api.modules.finance.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.mall.api.common.enums.ResultCode;
import com.mall.api.common.exception.BusinessException;
import com.mall.api.common.response.ApiResponse;
import com.mall.api.modules.commission.CommissionService;
import com.mall.api.modules.finance.FinanceService;
import com.mall.api.modules.merchant.entity.Merchant;
import com.mall.api.modules.merchant.entity.MerchantFundLog;
import com.mall.api.modules.merchant.mapper.MerchantMapper;
import com.mall.api.modules.merchant.service.MerchantFundService;
import com.mall.api.modules.withdrawal.WithdrawalService;
import com.mall.api.modules.withdrawal.entity.Withdrawal;
import com.mall.api.security.SecurityUtils;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/merchant/finance")
@Tag(name = "商户/代理财务管理")
@PreAuthorize("hasAnyRole('MERCHANT','AGENT')")
public class MerchantFinanceController {

    private final FinanceService financeService;
    private final CommissionService commissionService;
    private final WithdrawalService withdrawalService;
    private final MerchantFundService merchantFundService;
    private final MerchantMapper merchantMapper;

    public MerchantFinanceController(FinanceService financeService,
                                      CommissionService commissionService,
                                      WithdrawalService withdrawalService,
                                      MerchantFundService merchantFundService,
                                      MerchantMapper merchantMapper) {
        this.financeService = financeService;
        this.commissionService = commissionService;
        this.withdrawalService = withdrawalService;
        this.merchantFundService = merchantFundService;
        this.merchantMapper = merchantMapper;
    }

    @GetMapping("/fund-logs")
    @Operation(summary = "我的资金流水")
    public ApiResponse<Map<String, Object>> getFundLogs(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int pageSize) {
        if (!SecurityUtils.hasRole("MERCHANT")) {
            throw new BusinessException(ResultCode.FORBIDDEN.getCode(), "仅商家可查看资金流水");
        }
        Long userId = SecurityUtils.getCurrentUserId();
        Merchant merchant = userId == null ? null : merchantMapper.selectByUserId(userId);
        if (merchant == null) {
            throw new BusinessException(ResultCode.FORBIDDEN.getCode(), "Merchant profile not found");
        }
        Page<MerchantFundLog> pg = merchantFundService.getFundLogs(merchant.getId(), page, pageSize);
        Map<String, Object> result = new HashMap<>();
        result.put("list", pg.getRecords());
        result.put("total", pg.getTotal());
        result.put("page", page);
        result.put("pageSize", pageSize);
        result.put("balance", merchant.getBalance());
        result.put("frozenBalance", merchant.getFrozenBalance());
        return ApiResponse.success(result);
    }

    @GetMapping("/summary")
    @Operation(summary = "财务概览")
    public ApiResponse<Map<String, Object>> getSummary() {
        Long userId = SecurityUtils.getCurrentUserId();
        if (SecurityUtils.hasRole("AGENT")) {
            return ApiResponse.success(financeService.getAgentSummary(userId));
        }
        return ApiResponse.success(financeService.getMerchantSummary(userId));
    }

    @GetMapping("/commissions")
    @Operation(summary = "佣金列表(代理)")
    public ApiResponse<Map<String, Object>> getCommissions(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int pageSize) {
        Long userId = SecurityUtils.getCurrentUserId();
        Long agentId = null;
        if (SecurityUtils.hasRole("AGENT")) {
            agentId = userId;
        }
        return ApiResponse.success(commissionService.getCommissions(agentId, status,
                startDate, endDate, page, pageSize));
    }

    @GetMapping("/withdrawals")
    @Operation(summary = "提现记录")
    public ApiResponse<Map<String, Object>> getWithdrawals(
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int pageSize) {
        Long userId = SecurityUtils.getCurrentUserId();
        return ApiResponse.success(withdrawalService.getWithdrawals(userId, status, page, pageSize));
    }

    @PostMapping("/withdrawals")
    @Operation(summary = "申请提现")
    public ApiResponse<Withdrawal> applyWithdrawal(@RequestBody Map<String, Object> body) {
        Long userId = SecurityUtils.getCurrentUserId();
        String role = SecurityUtils.hasRole("AGENT") ? "AGENT" : "MERCHANT";
        BigDecimal amount = new BigDecimal(body.get("amount").toString());
        String bankName = (String) body.get("bankName");
        String bankAccount = (String) body.get("bankAccount");
        String accountName = (String) body.get("accountName");
        String remark = (String) body.get("remark");

        Withdrawal withdrawal = withdrawalService.applyWithdrawal(
                userId, role, amount, bankName, bankAccount, accountName, remark);
        return ApiResponse.success(withdrawal);
    }
}
