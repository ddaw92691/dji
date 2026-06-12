package com.mall.api.modules.finance.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@TableName("merchant_fund_reconciliation")
public class MerchantFundReconciliation implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(type = IdType.ASSIGN_ID)
    private Long id;

    @TableField("reconcile_date")
    private LocalDate reconcileDate;

    @TableField("merchant_id")
    private Long merchantId;

    @TableField("opening_balance")
    private BigDecimal openingBalance;

    @TableField("inflow_amount")
    private BigDecimal inflowAmount;

    @TableField("outflow_amount")
    private BigDecimal outflowAmount;

    @TableField("expected_closing_balance")
    private BigDecimal expectedClosingBalance;

    @TableField("ledger_closing_balance")
    private BigDecimal ledgerClosingBalance;

    @TableField("actual_balance")
    private BigDecimal actualBalance;

    @TableField("balance_difference")
    private BigDecimal balanceDifference;

    @TableField("opening_frozen_balance")
    private BigDecimal openingFrozenBalance;

    @TableField("frozen_inflow_amount")
    private BigDecimal frozenInflowAmount;

    @TableField("frozen_outflow_amount")
    private BigDecimal frozenOutflowAmount;

    @TableField("expected_closing_frozen")
    private BigDecimal expectedClosingFrozen;

    @TableField("ledger_closing_frozen")
    private BigDecimal ledgerClosingFrozen;

    @TableField("actual_frozen_balance")
    private BigDecimal actualFrozenBalance;

    @TableField("frozen_difference")
    private BigDecimal frozenDifference;

    @TableField("opening_total_balance")
    private BigDecimal openingTotalBalance;

    @TableField("total_inflow_amount")
    private BigDecimal totalInflowAmount;

    @TableField("total_outflow_amount")
    private BigDecimal totalOutflowAmount;

    @TableField("expected_closing_total")
    private BigDecimal expectedClosingTotal;

    @TableField("ledger_closing_total")
    private BigDecimal ledgerClosingTotal;

    @TableField("actual_total_balance")
    private BigDecimal actualTotalBalance;

    @TableField("total_difference")
    private BigDecimal totalDifference;

    @TableField("log_count")
    private Integer logCount;

    @TableField("issue_count")
    private Integer issueCount;

    private String status;

    @TableField("issue_summary")
    private String issueSummary;

    @TableField("checked_at")
    private LocalDateTime checkedAt;

    @TableField("created_at")
    private LocalDateTime createdAt;

    @TableField("updated_at")
    private LocalDateTime updatedAt;
}
