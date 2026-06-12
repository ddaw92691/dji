package com.mall.api.modules.finance;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.toolkit.IdWorker;
import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.mall.api.modules.finance.entity.MerchantFundReconciliation;
import com.mall.api.modules.finance.mapper.MerchantFundReconciliationMapper;
import com.mall.api.modules.merchant.entity.Merchant;
import com.mall.api.modules.merchant.entity.MerchantFundLog;
import com.mall.api.modules.merchant.mapper.MerchantFundLogMapper;
import com.mall.api.modules.merchant.mapper.MerchantMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class MerchantFundReconciliationService {

    private static final String STATUS_OK = "OK";
    private static final String STATUS_MISMATCH = "MISMATCH";

    private final MerchantMapper merchantMapper;
    private final MerchantFundLogMapper fundLogMapper;
    private final MerchantFundReconciliationMapper reconciliationMapper;

    public MerchantFundReconciliationService(MerchantMapper merchantMapper,
                                             MerchantFundLogMapper fundLogMapper,
                                             MerchantFundReconciliationMapper reconciliationMapper) {
        this.merchantMapper = merchantMapper;
        this.fundLogMapper = fundLogMapper;
        this.reconciliationMapper = reconciliationMapper;
    }

    @Transactional
    public Map<String, Object> run(LocalDate date) {
        LocalDate reconcileDate = date != null ? date : LocalDate.now().minusDays(1);
        List<Merchant> merchants = merchantMapper.selectList(Wrappers.<Merchant>lambdaQuery()
                .eq(Merchant::getDeleted, false));

        int ok = 0;
        int mismatch = 0;
        for (Merchant merchant : merchants) {
            MerchantFundReconciliation result = buildForMerchant(merchant, reconcileDate);
            result.setId(IdWorker.getId());
            reconciliationMapper.upsert(result);
            if (STATUS_MISMATCH.equals(result.getStatus())) {
                mismatch++;
            } else {
                ok++;
            }
        }

        Map<String, Object> summary = new LinkedHashMap<>();
        summary.put("date", reconcileDate);
        summary.put("total", merchants.size());
        summary.put("ok", ok);
        summary.put("mismatch", mismatch);
        return summary;
    }

    public Map<String, Object> page(LocalDate date, Long merchantId, String status, int page, int pageSize) {
        LambdaQueryWrapper<MerchantFundReconciliation> wrapper = Wrappers.<MerchantFundReconciliation>lambdaQuery()
                .eq(date != null, MerchantFundReconciliation::getReconcileDate, date)
                .eq(merchantId != null, MerchantFundReconciliation::getMerchantId, merchantId)
                .eq(status != null && !status.isBlank(), MerchantFundReconciliation::getStatus, status)
                .orderByDesc(MerchantFundReconciliation::getCheckedAt)
                .orderByDesc(MerchantFundReconciliation::getId);

        Page<MerchantFundReconciliation> pg = reconciliationMapper.selectPage(new Page<>(page, pageSize), wrapper);
        Map<Long, Merchant> merchantCache = new HashMap<>();
        List<Map<String, Object>> rows = new ArrayList<>();
        for (MerchantFundReconciliation item : pg.getRecords()) {
            Merchant merchant = merchantCache.computeIfAbsent(item.getMerchantId(), merchantMapper::selectById);
            rows.add(toMap(item, merchant));
        }

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("list", rows);
        result.put("total", pg.getTotal());
        result.put("page", page);
        result.put("pageSize", pageSize);
        return result;
    }

    public Map<String, Object> summary(LocalDate date) {
        LambdaQueryWrapper<MerchantFundReconciliation> base = Wrappers.<MerchantFundReconciliation>lambdaQuery()
                .eq(date != null, MerchantFundReconciliation::getReconcileDate, date);
        Long total = reconciliationMapper.selectCount(base);
        Long mismatch = reconciliationMapper.selectCount(Wrappers.<MerchantFundReconciliation>lambdaQuery()
                .eq(date != null, MerchantFundReconciliation::getReconcileDate, date)
                .eq(MerchantFundReconciliation::getStatus, STATUS_MISMATCH));

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("date", date);
        result.put("total", total);
        result.put("ok", Math.max(0, total - mismatch));
        result.put("mismatch", mismatch);
        return result;
    }

    private MerchantFundReconciliation buildForMerchant(Merchant merchant, LocalDate date) {
        LocalDateTime start = date.atStartOfDay();
        LocalDateTime end = date.plusDays(1).atStartOfDay();

        MerchantFundLog beforeLog = latestLogBefore(merchant.getId(), start);
        List<MerchantFundLog> dailyLogs = logsBetween(merchant.getId(), start, end);
        MerchantFundLog latestOverall = latestLogBefore(merchant.getId(), LocalDateTime.now().plusSeconds(1));

        BigDecimal openingBalance = openingAvailable(beforeLog, dailyLogs);
        BigDecimal openingFrozen = openingFrozen(beforeLog, dailyLogs);
        BigDecimal balanceIn = BigDecimal.ZERO;
        BigDecimal balanceOut = BigDecimal.ZERO;
        BigDecimal frozenIn = BigDecimal.ZERO;
        BigDecimal frozenOut = BigDecimal.ZERO;
        BigDecimal totalIn = BigDecimal.ZERO;
        BigDecimal totalOut = BigDecimal.ZERO;
        int issueCount = 0;
        List<String> issues = new ArrayList<>();

        BigDecimal expectedPrevBalance = openingBalance;
        BigDecimal expectedPrevFrozen = openingFrozen;
        for (MerchantFundLog log : dailyLogs) {
            BigDecimal before = safe(log.getBalanceBefore());
            BigDecimal after = safe(log.getBalanceAfter());
            BigDecimal frozenBefore = safe(log.getFrozenBalanceBefore());
            BigDecimal frozenAfter = safe(log.getFrozenBalanceAfter());

            if (before.compareTo(expectedPrevBalance) != 0 || frozenBefore.compareTo(expectedPrevFrozen) != 0) {
                issueCount++;
                issues.add("流水链路断裂: log#" + log.getId());
            }

            BigDecimal delta = after.subtract(before);
            if (delta.compareTo(BigDecimal.ZERO) >= 0) {
                balanceIn = balanceIn.add(delta);
            } else {
                balanceOut = balanceOut.add(delta.abs());
            }

            BigDecimal frozenDelta = frozenAfter.subtract(frozenBefore);
            if (frozenDelta.compareTo(BigDecimal.ZERO) >= 0) {
                frozenIn = frozenIn.add(frozenDelta);
            } else {
                frozenOut = frozenOut.add(frozenDelta.abs());
            }

            BigDecimal totalDelta = after.add(frozenAfter).subtract(before.add(frozenBefore));
            if (totalDelta.compareTo(BigDecimal.ZERO) >= 0) {
                totalIn = totalIn.add(totalDelta);
            } else {
                totalOut = totalOut.add(totalDelta.abs());
            }

            expectedPrevBalance = after;
            expectedPrevFrozen = frozenAfter;
        }

        BigDecimal expectedClosing = openingBalance.add(balanceIn).subtract(balanceOut);
        BigDecimal expectedFrozenClosing = openingFrozen.add(frozenIn).subtract(frozenOut);
        BigDecimal ledgerClosing = dailyLogs.isEmpty() ? openingBalance : safe(dailyLogs.get(dailyLogs.size() - 1).getBalanceAfter());
        BigDecimal ledgerFrozenClosing = dailyLogs.isEmpty() ? openingFrozen : safe(dailyLogs.get(dailyLogs.size() - 1).getFrozenBalanceAfter());

        BigDecimal formulaDiff = ledgerClosing.subtract(expectedClosing);
        BigDecimal frozenFormulaDiff = ledgerFrozenClosing.subtract(expectedFrozenClosing);
        if (formulaDiff.compareTo(BigDecimal.ZERO) != 0 || frozenFormulaDiff.compareTo(BigDecimal.ZERO) != 0) {
            issueCount++;
            issues.add("期初+入-出与期末不一致");
        }

        BigDecimal latestLedgerBalance = latestOverall == null ? BigDecimal.ZERO : safe(latestOverall.getBalanceAfter());
        BigDecimal latestLedgerFrozen = latestOverall == null ? BigDecimal.ZERO : safe(latestOverall.getFrozenBalanceAfter());
        BigDecimal actualBalance = safe(merchant.getBalance());
        BigDecimal actualFrozen = safe(merchant.getFrozenBalance());
        BigDecimal balanceDifference = actualBalance.subtract(latestLedgerBalance);
        BigDecimal frozenDifference = actualFrozen.subtract(latestLedgerFrozen);
        BigDecimal totalDifference = actualBalance.add(actualFrozen).subtract(latestLedgerBalance.add(latestLedgerFrozen));
        if (balanceDifference.compareTo(BigDecimal.ZERO) != 0
                || frozenDifference.compareTo(BigDecimal.ZERO) != 0
                || totalDifference.compareTo(BigDecimal.ZERO) != 0) {
            issueCount++;
            issues.add("商家余额与最新流水余额不一致");
        }

        MerchantFundReconciliation r = new MerchantFundReconciliation();
        LocalDateTime now = LocalDateTime.now();
        r.setReconcileDate(date);
        r.setMerchantId(merchant.getId());
        r.setOpeningBalance(openingBalance);
        r.setInflowAmount(balanceIn);
        r.setOutflowAmount(balanceOut);
        r.setExpectedClosingBalance(expectedClosing);
        r.setLedgerClosingBalance(ledgerClosing);
        r.setActualBalance(actualBalance);
        r.setBalanceDifference(balanceDifference);
        r.setOpeningFrozenBalance(openingFrozen);
        r.setFrozenInflowAmount(frozenIn);
        r.setFrozenOutflowAmount(frozenOut);
        r.setExpectedClosingFrozen(expectedFrozenClosing);
        r.setLedgerClosingFrozen(ledgerFrozenClosing);
        r.setActualFrozenBalance(actualFrozen);
        r.setFrozenDifference(frozenDifference);
        r.setOpeningTotalBalance(openingBalance.add(openingFrozen));
        r.setTotalInflowAmount(totalIn);
        r.setTotalOutflowAmount(totalOut);
        r.setExpectedClosingTotal(openingBalance.add(openingFrozen).add(totalIn).subtract(totalOut));
        r.setLedgerClosingTotal(ledgerClosing.add(ledgerFrozenClosing));
        r.setActualTotalBalance(actualBalance.add(actualFrozen));
        r.setTotalDifference(totalDifference);
        r.setLogCount(dailyLogs.size());
        r.setIssueCount(issueCount);
        r.setStatus(issueCount > 0 ? STATUS_MISMATCH : STATUS_OK);
        r.setIssueSummary(limitSummary(issues));
        r.setCheckedAt(now);
        r.setCreatedAt(now);
        r.setUpdatedAt(now);
        return r;
    }

    private BigDecimal openingAvailable(MerchantFundLog beforeLog, List<MerchantFundLog> dailyLogs) {
        if (beforeLog != null) return safe(beforeLog.getBalanceAfter());
        if (!dailyLogs.isEmpty()) return safe(dailyLogs.get(0).getBalanceBefore());
        return BigDecimal.ZERO;
    }

    private BigDecimal openingFrozen(MerchantFundLog beforeLog, List<MerchantFundLog> dailyLogs) {
        if (beforeLog != null) return safe(beforeLog.getFrozenBalanceAfter());
        if (!dailyLogs.isEmpty()) return safe(dailyLogs.get(0).getFrozenBalanceBefore());
        return BigDecimal.ZERO;
    }

    private MerchantFundLog latestLogBefore(Long merchantId, LocalDateTime time) {
        return fundLogMapper.selectOne(Wrappers.<MerchantFundLog>lambdaQuery()
                .eq(MerchantFundLog::getMerchantId, merchantId)
                .lt(MerchantFundLog::getCreatedAt, time)
                .orderByDesc(MerchantFundLog::getCreatedAt)
                .orderByDesc(MerchantFundLog::getId)
                .last("LIMIT 1"));
    }

    private List<MerchantFundLog> logsBetween(Long merchantId, LocalDateTime start, LocalDateTime end) {
        return fundLogMapper.selectList(Wrappers.<MerchantFundLog>lambdaQuery()
                .eq(MerchantFundLog::getMerchantId, merchantId)
                .ge(MerchantFundLog::getCreatedAt, start)
                .lt(MerchantFundLog::getCreatedAt, end)
                .orderByAsc(MerchantFundLog::getCreatedAt)
                .orderByAsc(MerchantFundLog::getId));
    }

    private Map<String, Object> toMap(MerchantFundReconciliation item, Merchant merchant) {
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("id", item.getId());
        map.put("reconcileDate", item.getReconcileDate());
        map.put("merchantId", item.getMerchantId());
        map.put("shopName", merchant != null ? merchant.getShopName() : null);
        map.put("merchantStatus", merchant != null ? merchant.getStatus() : null);
        map.put("openingBalance", item.getOpeningBalance());
        map.put("inflowAmount", item.getInflowAmount());
        map.put("outflowAmount", item.getOutflowAmount());
        map.put("expectedClosingBalance", item.getExpectedClosingBalance());
        map.put("ledgerClosingBalance", item.getLedgerClosingBalance());
        map.put("actualBalance", item.getActualBalance());
        map.put("balanceDifference", item.getBalanceDifference());
        map.put("openingFrozenBalance", item.getOpeningFrozenBalance());
        map.put("frozenInflowAmount", item.getFrozenInflowAmount());
        map.put("frozenOutflowAmount", item.getFrozenOutflowAmount());
        map.put("expectedClosingFrozen", item.getExpectedClosingFrozen());
        map.put("ledgerClosingFrozen", item.getLedgerClosingFrozen());
        map.put("actualFrozenBalance", item.getActualFrozenBalance());
        map.put("frozenDifference", item.getFrozenDifference());
        map.put("openingTotalBalance", item.getOpeningTotalBalance());
        map.put("totalInflowAmount", item.getTotalInflowAmount());
        map.put("totalOutflowAmount", item.getTotalOutflowAmount());
        map.put("expectedClosingTotal", item.getExpectedClosingTotal());
        map.put("ledgerClosingTotal", item.getLedgerClosingTotal());
        map.put("actualTotalBalance", item.getActualTotalBalance());
        map.put("totalDifference", item.getTotalDifference());
        map.put("logCount", item.getLogCount());
        map.put("issueCount", item.getIssueCount());
        map.put("status", item.getStatus());
        map.put("issueSummary", item.getIssueSummary());
        map.put("checkedAt", item.getCheckedAt());
        return map;
    }

    private String limitSummary(List<String> issues) {
        if (issues.isEmpty()) return null;
        String summary = String.join("; ", issues);
        return summary.length() > 1000 ? summary.substring(0, 1000) : summary;
    }

    private BigDecimal safe(BigDecimal value) {
        return value == null ? BigDecimal.ZERO : value;
    }
}
