package com.mall.api.modules.admin.controller;

import com.mall.api.common.response.ApiResponse;
import com.mall.api.modules.commission.CommissionService;
import com.mall.api.modules.export.ExportService;
import com.mall.api.modules.finance.FinanceService;
import com.mall.api.modules.payment.entity.Payment;
import com.mall.api.modules.payment.mapper.PaymentMapper;
import com.mall.api.modules.withdrawal.WithdrawalService;
import com.mall.api.modules.withdrawal.entity.Withdrawal;
import com.mall.api.security.SecurityUtils;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@Tag(name = "管理员财务管理")
@PreAuthorize("hasAnyRole('SUPER_ADMIN','ADMIN')")
public class AdminFinanceController {

    private final FinanceService financeService;
    private final WithdrawalService withdrawalService;
    private final CommissionService commissionService;
    private final PaymentMapper paymentMapper;
    private final ExportService exportService;

    public AdminFinanceController(FinanceService financeService,
                                   WithdrawalService withdrawalService,
                                   CommissionService commissionService,
                                   PaymentMapper paymentMapper,
                                   ExportService exportService) {
        this.financeService = financeService;
        this.withdrawalService = withdrawalService;
        this.commissionService = commissionService;
        this.paymentMapper = paymentMapper;
        this.exportService = exportService;
    }

    @GetMapping("/finance/overview")
    @Operation(summary = "平台财务概览")
    public ApiResponse<Map<String, Object>> getOverview() {
        return ApiResponse.success(financeService.getAdminOverview());
    }

    @GetMapping("/withdrawals")
    @Operation(summary = "提现列表")
    public ApiResponse<Map<String, Object>> getWithdrawals(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String role,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int pageSize) {
        return ApiResponse.success(withdrawalService.getWithdrawalsAdmin(
                keyword, role, type, status, startDate, endDate, page, pageSize));
    }

    @GetMapping("/withdrawals/{id}")
    @Operation(summary = "提现详情")
    public ApiResponse<Withdrawal> getWithdrawalDetail(@PathVariable Long id) {
        return ApiResponse.success(withdrawalService.getWithdrawalDetail(id));
    }

    @PutMapping("/withdrawals/{id}/approve")
    @Operation(summary = "审批通过提现")
    public ApiResponse<Withdrawal> approveWithdrawal(@PathVariable Long id) {
        Long reviewerUserId = SecurityUtils.getCurrentUserId();
        return ApiResponse.success(withdrawalService.approveWithdrawal(id, reviewerUserId));
    }

    @PutMapping("/withdrawals/{id}/reject")
    @Operation(summary = "拒绝提现")
    public ApiResponse<Withdrawal> rejectWithdrawal(@PathVariable Long id,
                                                     @RequestBody Map<String, String> body) {
        Long reviewerUserId = SecurityUtils.getCurrentUserId();
        String rejectReason = body.get("rejectReason");
        return ApiResponse.success(withdrawalService.rejectWithdrawal(id, reviewerUserId, rejectReason));
    }

    @GetMapping("/commissions")
    @Operation(summary = "佣金列表")
    public ApiResponse<Map<String, Object>> getCommissions(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Long agentId,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int pageSize) {
        return ApiResponse.success(commissionService.getCommissionsAdmin(
                keyword, agentId, status, startDate, endDate, page, pageSize));
    }

    @GetMapping("/payments")
    @Operation(summary = "支付记录列表")
    public ApiResponse<Map<String, Object>> getPayments(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Long userId,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int pageSize) {
        LambdaQueryWrapper<Payment> wrapper = Wrappers.<Payment>lambdaQuery()
                .eq(userId != null, Payment::getUserId, userId)
                .eq(status != null && !status.isBlank(), Payment::getStatus, status)
                .ge(startDate != null && !startDate.isBlank(), Payment::getCreatedAt, startDate)
                .le(endDate != null && !endDate.isBlank(), Payment::getCreatedAt, endDate)
                .orderByDesc(Payment::getCreatedAt);

        if (keyword != null && !keyword.isBlank()) {
            wrapper.and(w -> w.like(Payment::getPaymentNo, keyword)
                    .or().like(Payment::getTransactionNo, keyword));
        }

        Page<Payment> pg = paymentMapper.selectPage(new Page<>(page, pageSize), wrapper);

        Map<String, Object> result = new HashMap<>();
        result.put("list", pg.getRecords());
        result.put("total", pg.getTotal());
        result.put("page", page);
        result.put("pageSize", pageSize);
        return ApiResponse.success(result);
    }

    @GetMapping("/payments/export")
    @Operation(summary = "导出支付记录CSV")
    public void exportPayments(
            @RequestParam(required = false) Long userId,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate,
            HttpServletResponse response) {
        exportService.exportPayments(userId, status, startDate, endDate, response);
    }

    @GetMapping("/withdrawals/export")
    @Operation(summary = "导出提现记录CSV")
    public void exportWithdrawals(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String role,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate,
            HttpServletResponse response) {
        exportService.exportWithdrawals(keyword, role, type, status, startDate, endDate, response);
    }

    @GetMapping("/commissions/export")
    @Operation(summary = "导出佣金记录CSV")
    public void exportCommissions(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Long agentId,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate,
            HttpServletResponse response) {
        exportService.exportCommissions(keyword, agentId, status, startDate, endDate, response);
    }
}
