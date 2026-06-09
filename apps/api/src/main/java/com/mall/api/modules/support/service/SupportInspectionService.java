package com.mall.api.modules.support.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.mall.api.common.exception.BusinessException;
import com.mall.api.modules.support.entity.SupportInspectionLog;
import com.mall.api.modules.support.mapper.SupportInspectionLogMapper;
import org.springframework.stereotype.Service;

import java.util.LinkedHashMap;
import java.util.Map;

@Service
public class SupportInspectionService {

    private final SupportInspectionLogMapper inspectionLogMapper;

    public SupportInspectionService(SupportInspectionLogMapper inspectionLogMapper) {
        this.inspectionLogMapper = inspectionLogMapper;
    }

    public Map<String, Object> getInspectionLogs(String status, Long merchantId, int page, int pageSize) {
        LambdaQueryWrapper<SupportInspectionLog> wrapper = Wrappers.<SupportInspectionLog>lambdaQuery()
                .eq(status != null && !status.isBlank(), SupportInspectionLog::getStatus, status)
                .eq(merchantId != null, SupportInspectionLog::getMerchantId, merchantId)
                .orderByDesc(SupportInspectionLog::getCreatedAt);

        Page<SupportInspectionLog> pg = inspectionLogMapper.selectPage(new Page<>(page, pageSize), wrapper);

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("list", pg.getRecords());
        result.put("total", pg.getTotal());
        result.put("page", page);
        result.put("pageSize", pageSize);
        return result;
    }

    public SupportInspectionLog getInspectionLog(Long sessionId) {
        SupportInspectionLog log = inspectionLogMapper.selectOne(Wrappers.<SupportInspectionLog>lambdaQuery()
                .eq(SupportInspectionLog::getSessionId, sessionId));
        if (log == null) {
            throw new BusinessException(404, "巡检日志不存在");
        }
        return log;
    }
}
