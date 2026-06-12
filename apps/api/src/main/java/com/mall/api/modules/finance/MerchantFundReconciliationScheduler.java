package com.mall.api.modules.finance;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Map;

@Component
public class MerchantFundReconciliationScheduler {

    private static final Logger log = LoggerFactory.getLogger(MerchantFundReconciliationScheduler.class);

    @Value("${finance.reconciliation.enabled:true}")
    private boolean enabled;

    @Value("${finance.reconciliation.zone:UTC}")
    private String zone;

    private final MerchantFundReconciliationService reconciliationService;

    public MerchantFundReconciliationScheduler(MerchantFundReconciliationService reconciliationService) {
        this.reconciliationService = reconciliationService;
    }

    @Scheduled(cron = "${finance.reconciliation.cron:0 15 0 * * *}", zone = "${finance.reconciliation.zone:UTC}")
    public void runDaily() {
        if (!enabled) {
            return;
        }
        LocalDate targetDate = LocalDate.now(ZoneId.of(zone)).minusDays(1);
        try {
            Map<String, Object> result = reconciliationService.run(targetDate);
            log.info("Merchant fund reconciliation completed: {}", result);
        } catch (Exception e) {
            log.error("Merchant fund reconciliation failed for date {}", targetDate, e);
        }
    }
}
