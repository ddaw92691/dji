package com.mall.api.modules.system;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.mall.api.modules.system.entity.SystemSetting;
import com.mall.api.modules.system.mapper.SystemSettingMapper;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
public class SystemSettingService {

    private final SystemSettingMapper systemSettingMapper;

    public SystemSettingService(SystemSettingMapper systemSettingMapper) {
        this.systemSettingMapper = systemSettingMapper;
    }

    public String getSetting(String key) {
        LambdaQueryWrapper<SystemSetting> wrapper = Wrappers.<SystemSetting>lambdaQuery()
                .eq(SystemSetting::getSettingKey, key);
        SystemSetting setting = systemSettingMapper.selectOne(wrapper);
        return setting != null ? setting.getSettingValue() : null;
    }

    public BigDecimal getDefaultCommissionRate() {
        String val = getSetting("default_commission_rate");
        if (val != null) {
            try {
                return new BigDecimal(val);
            } catch (NumberFormatException ignored) {
            }
        }
        return new BigDecimal("0.05");
    }

    public BigDecimal getMinMerchantWithdrawal() {
        String val = getSetting("min_merchant_withdrawal");
        if (val != null) {
            try {
                return new BigDecimal(val);
            } catch (NumberFormatException ignored) {
            }
        }
        return new BigDecimal("10");
    }

    public BigDecimal getMinAgentWithdrawal() {
        String val = getSetting("min_agent_withdrawal");
        if (val != null) {
            try {
                return new BigDecimal(val);
            } catch (NumberFormatException ignored) {
            }
        }
        return new BigDecimal("10");
    }
}
