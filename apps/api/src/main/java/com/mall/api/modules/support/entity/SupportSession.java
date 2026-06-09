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
@TableName("support_session")
@Schema(description = "客服会话")
public class SupportSession implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(type = IdType.ASSIGN_ID)
    @Schema(description = "主键ID")
    private Long id;

    @TableField("session_no")
    @Schema(description = "会话编号")
    private String sessionNo;

    @TableField("session_type")
    @Schema(description = "会话类型: CUSTOMER_TO_MERCHANT/MERCHANT_TO_PLATFORM/ADMIN_INSPECTION_TO_MERCHANT")
    private String sessionType;

    private String title;

    @Schema(description = "状态: OPEN/PENDING/CLOSED")
    private String status;

    @Schema(description = "优先级: LOW/NORMAL/HIGH/URGENT")
    private String priority;

    @TableField("customer_user_id")
    @Schema(description = "客户用户ID")
    private Long customerUserId;

    @TableField("merchant_id")
    @Schema(description = "商家ID")
    private Long merchantId;

    @TableField("merchant_user_id")
    @Schema(description = "商家用户ID")
    private Long merchantUserId;

    @TableField("admin_user_id")
    @Schema(description = "管理员用户ID")
    private Long adminUserId;

    @TableField("inspection_operator_id")
    @Schema(description = "巡检操作员ID")
    private Long inspectionOperatorId;

    @TableField("inspection_customer_user_id")
    @Schema(description = "巡检客户用户ID")
    private Long inspectionCustomerUserId;

    @TableField("related_product_id")
    @Schema(description = "关联商品ID")
    private Long relatedProductId;

    @TableField("related_order_id")
    @Schema(description = "关联订单ID")
    private Long relatedOrderId;

    @TableField("last_message")
    @Schema(description = "最后一条消息")
    private String lastMessage;

    @TableField("last_message_at")
    @Schema(description = "最后一条消息时间")
    private LocalDateTime lastMessageAt;

    @TableField("unread_customer_count")
    @Schema(description = "客户未读数")
    private Integer unreadCustomerCount;

    @TableField("unread_merchant_count")
    @Schema(description = "商家未读数")
    private Integer unreadMerchantCount;

    @TableField("unread_admin_count")
    @Schema(description = "管理员未读数")
    private Integer unreadAdminCount;

    @TableField("first_response_at")
    @Schema(description = "首次响应时间")
    private LocalDateTime firstResponseAt;

    @TableField("closed_at")
    @Schema(description = "关闭时间")
    private LocalDateTime closedAt;

    @TableField("close_reason")
    @Schema(description = "关闭原因")
    private String closeReason;

    @TableField("quality_score")
    @Schema(description = "质量评分")
    private Integer qualityScore;

    @TableField("quality_remark")
    @Schema(description = "质量评分备注")
    private String qualityRemark;

    private Boolean deleted;

    @Schema(description = "创建时间")
    private LocalDateTime createdAt;

    @Schema(description = "更新时间")
    private LocalDateTime updatedAt;
}
