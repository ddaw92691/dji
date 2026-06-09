package com.mall.api.modules.customer.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.io.Serializable;
import java.time.LocalDateTime;

@Data
@TableName("customer_profile")
public class CustomerProfile implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(type = IdType.ASSIGN_ID)
    private Long id;

    @TableField("user_id")
    private Long userId;

    @TableField("invite_code")
    private String inviteCode;

    @TableField("invited_by")
    private Long invitedBy;

    @TableField("agent_id")
    private Long agentId;

    private Boolean deleted;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
