package com.mall.api.modules.support.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.io.Serializable;
import java.time.LocalDateTime;

@Data
@TableName("support_inspection_log")
@Schema(description = "客服巡检日志")
public class SupportInspectionLog implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(type = IdType.ASSIGN_ID)
    @Schema(description = "主键ID")
    private Long id;

    @TableField("session_id")
    @Schema(description = "会话ID")
    private Long sessionId;

    @TableField("merchant_id")
    @Schema(description = "商家ID")
    private Long merchantId;

    @TableField("operator_user_id")
    @Schema(description = "操作员用户ID")
    private Long operatorUserId;

    @TableField("fake_customer_name")
    @Schema(description = "伪装客户名称")
    private String fakeCustomerName;

    @Schema(description = "问题内容")
    private String question;

    @TableField("first_response_seconds")
    @Schema(description = "首次响应秒数")
    private Integer firstResponseSeconds;

    @TableField("quality_score")
    @Schema(description = "质量评分")
    private Integer qualityScore;

    @TableField("quality_remark")
    @Schema(description = "质量评分备注")
    private String qualityRemark;

    @Schema(description = "状态: RUNNING/COMPLETED/CANCELLED")
    private String status;

    @Schema(description = "创建时间")
    private LocalDateTime createdAt;

    @Schema(description = "更新时间")
    private LocalDateTime updatedAt;
}
