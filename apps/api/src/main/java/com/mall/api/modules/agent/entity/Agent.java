package com.mall.api.modules.agent.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@TableName("agent")
public class Agent implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(type = IdType.ASSIGN_ID)
    private Long id;

    @TableField("user_id")
    private Long userId;

    @TableField("invite_code")
    private String inviteCode;

    @TableField("parent_agent_id")
    private Long parentAgentId;

    private Integer level;

    @TableField("commission_rate")
    private BigDecimal commissionRate;

    private BigDecimal balance;

    @TableField("frozen_balance")
    private BigDecimal frozenBalance;

    @TableField("total_commission")
    private BigDecimal totalCommission;

    @TableField("total_withdrawn")
    private BigDecimal totalWithdrawn;

    private String status;
    private Boolean deleted;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
