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
@TableName("support_message")
@Schema(description = "客服消息")
public class SupportMessage implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(type = IdType.ASSIGN_ID)
    @Schema(description = "主键ID")
    private Long id;

    @TableField("session_id")
    @Schema(description = "会话ID")
    private Long sessionId;

    @TableField("sender_user_id")
    @Schema(description = "发送人用户ID")
    private Long senderUserId;

    @TableField("sender_role")
    @Schema(description = "发送人角色")
    private String senderRole;

    @TableField("sender_display_name")
    @Schema(description = "发送人显示名称")
    private String senderDisplayName;

    @TableField("sender_avatar")
    @Schema(description = "发送人头像")
    private String senderAvatar;

    @TableField("sender_side")
    @Schema(description = "发送方: CUSTOMER/MERCHANT/ADMIN/SYSTEM")
    private String senderSide;

    @Schema(description = "消息内容")
    private String content;

    @TableField("message_type")
    @Schema(description = "消息类型: TEXT/IMAGE/FILE/SYSTEM")
    private String messageType;

    @Schema(description = "附件(JSON)")
    private String attachments;

    @TableField("read_at")
    @Schema(description = "已读时间")
    private LocalDateTime readAt;

    @Schema(description = "创建时间")
    private LocalDateTime createdAt;

    @Schema(description = "更新时间")
    private LocalDateTime updatedAt;
}
