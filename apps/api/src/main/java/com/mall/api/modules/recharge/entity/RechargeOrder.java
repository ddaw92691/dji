package com.mall.api.modules.recharge.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@TableName("recharge_order")
public class RechargeOrder implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(type = IdType.ASSIGN_ID)
    private Long id;

    @TableField("recharge_no")
    private String rechargeNo;

    @TableField("merchant_id")
    private Long merchantId;

    @TableField("user_id")
    private Long userId;

    private BigDecimal amount;
    private String currency;
    private String method;

    @TableField("proof_url")
    private String proofUrl;

    /** PENDING / PAID / REJECTED */
    private String status;

    private String remark;

    @TableField("reject_reason")
    private String rejectReason;

    @TableField("reviewed_by")
    private Long reviewedBy;

    @TableField("reviewed_at")
    private LocalDateTime reviewedAt;

    private Boolean deleted;

    @TableField("created_at")
    private LocalDateTime createdAt;

    @TableField("updated_at")
    private LocalDateTime updatedAt;
}
