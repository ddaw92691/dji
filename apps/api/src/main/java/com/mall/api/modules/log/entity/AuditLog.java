package com.mall.api.modules.log.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.io.Serializable;
import java.time.LocalDateTime;

@Data
@TableName("audit_log")
@Schema(description = "操作日志")
public class AuditLog implements Serializable {
    @TableId(type = IdType.ASSIGN_ID)
    private Long id;
    private Long userId;
    private String username;
    private String module;
    private String action;
    private String description;
    private String method;
    private String requestUri;
    private String requestParams;
    private String responseBody;
    private String ip;
    private String userAgent;
    private Long executionTime;
    private String status;
    private String errorMessage;
    private LocalDateTime createdAt;
}
