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
@TableName("support_read_state")
@Schema(description = "客服已读状态")
public class SupportReadState implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(type = IdType.ASSIGN_ID)
    @Schema(description = "主键ID")
    private Long id;

    @TableField("session_id")
    @Schema(description = "会话ID")
    private Long sessionId;

    @TableField("user_id")
    @Schema(description = "用户ID")
    private Long userId;

    @TableField("last_read_message_id")
    @Schema(description = "最后已读消息ID")
    private Long lastReadMessageId;

    @TableField("unread_count")
    @Schema(description = "未读数")
    private Integer unreadCount;

    // support_read_state 库表无 created_at 列；标记为非持久化字段，避免标记已读时报列不存在
    @TableField(exist = false)
    @Schema(description = "创建时间")
    private LocalDateTime createdAt;

    @Schema(description = "更新时间")
    private LocalDateTime updatedAt;
}
