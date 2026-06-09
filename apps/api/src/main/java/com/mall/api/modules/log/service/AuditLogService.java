package com.mall.api.modules.log.service;

import com.mall.api.modules.log.entity.AuditLog;
import com.mall.api.modules.log.mapper.AuditLogMapper;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class AuditLogService {

    private final AuditLogMapper auditLogMapper;

    public AuditLogService(AuditLogMapper auditLogMapper) {
        this.auditLogMapper = auditLogMapper;
    }

    public void save(AuditLog log) {
        if (log.getCreatedAt() == null) log.setCreatedAt(LocalDateTime.now());
        if (log.getStatus() == null) log.setStatus("SUCCESS");
        auditLogMapper.insert(log);
    }
}
