package com.mall.api.modules.finance.controller;

import com.mall.api.common.response.ApiResponse;
import com.mall.api.modules.commission.CommissionService;
import com.mall.api.modules.finance.FinanceService;
import com.mall.api.modules.withdrawal.WithdrawalService;
import com.mall.api.modules.withdrawal.entity.Withdrawal;
import com.mall.api.security.SecurityUtils;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Map;

@RestController
@RequestMapping("/api/merchant/finance")
@Tag(name = "商户/代理财务管理")
@PreAuthorize("hasAnyRole('MERCHANT','AGENT')")
public class MerchantFinanceController {

    private final FinanceService financeService;
    private final CommissionService commissionService;
    private final WithdrawalService withdrawalService;

    public MerchantFinanceController(FinanceService financeService,
                                      CommissionService commissionService,
                                      WithdrawalService withdrawalService) {
        this.financeService = financeService;
        this.commissionService = commissionService;
        this.withdrawalService = withdrawalService;
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
