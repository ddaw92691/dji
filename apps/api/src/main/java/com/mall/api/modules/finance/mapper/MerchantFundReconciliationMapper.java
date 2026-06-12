package com.mall.api.modules.finance.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.mall.api.modules.finance.entity.MerchantFundReconciliation;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface MerchantFundReconciliationMapper extends BaseMapper<MerchantFundReconciliation> {

    @Insert("""
            INSERT INTO merchant_fund_reconciliation (
                id, reconcile_date, merchant_id,
                opening_balance, inflow_amount, outflow_amount, expected_closing_balance,
                ledger_closing_balance, actual_balance, balance_difference,
                opening_frozen_balance, frozen_inflow_amount, frozen_outflow_amount,
                expected_closing_frozen, ledger_closing_frozen, actual_frozen_balance, frozen_difference,
                opening_total_balance, total_inflow_amount, total_outflow_amount, expected_closing_total,
                ledger_closing_total, actual_total_balance, total_difference,
                log_count, issue_count, status, issue_summary, checked_at, created_at, updated_at
            ) VALUES (
                #{id}, #{reconcileDate}, #{merchantId},
                #{openingBalance}, #{inflowAmount}, #{outflowAmount}, #{expectedClosingBalance},
                #{ledgerClosingBalance}, #{actualBalance}, #{balanceDifference},
                #{openingFrozenBalance}, #{frozenInflowAmount}, #{frozenOutflowAmount},
                #{expectedClosingFrozen}, #{ledgerClosingFrozen}, #{actualFrozenBalance}, #{frozenDifference},
                #{openingTotalBalance}, #{totalInflowAmount}, #{totalOutflowAmount}, #{expectedClosingTotal},
                #{ledgerClosingTotal}, #{actualTotalBalance}, #{totalDifference},
                #{logCount}, #{issueCount}, #{status}, #{issueSummary}, #{checkedAt}, #{createdAt}, #{updatedAt}
            )
            ON CONFLICT (reconcile_date, merchant_id) DO UPDATE SET
                opening_balance = EXCLUDED.opening_balance,
                inflow_amount = EXCLUDED.inflow_amount,
                outflow_amount = EXCLUDED.outflow_amount,
                expected_closing_balance = EXCLUDED.expected_closing_balance,
                ledger_closing_balance = EXCLUDED.ledger_closing_balance,
                actual_balance = EXCLUDED.actual_balance,
                balance_difference = EXCLUDED.balance_difference,
                opening_frozen_balance = EXCLUDED.opening_frozen_balance,
                frozen_inflow_amount = EXCLUDED.frozen_inflow_amount,
                frozen_outflow_amount = EXCLUDED.frozen_outflow_amount,
                expected_closing_frozen = EXCLUDED.expected_closing_frozen,
                ledger_closing_frozen = EXCLUDED.ledger_closing_frozen,
                actual_frozen_balance = EXCLUDED.actual_frozen_balance,
                frozen_difference = EXCLUDED.frozen_difference,
                opening_total_balance = EXCLUDED.opening_total_balance,
                total_inflow_amount = EXCLUDED.total_inflow_amount,
                total_outflow_amount = EXCLUDED.total_outflow_amount,
                expected_closing_total = EXCLUDED.expected_closing_total,
                ledger_closing_total = EXCLUDED.ledger_closing_total,
                actual_total_balance = EXCLUDED.actual_total_balance,
                total_difference = EXCLUDED.total_difference,
                log_count = EXCLUDED.log_count,
                issue_count = EXCLUDED.issue_count,
                status = EXCLUDED.status,
                issue_summary = EXCLUDED.issue_summary,
                checked_at = EXCLUDED.checked_at,
                updated_at = EXCLUDED.updated_at
            """)
    int upsert(MerchantFundReconciliation reconciliation);
}
