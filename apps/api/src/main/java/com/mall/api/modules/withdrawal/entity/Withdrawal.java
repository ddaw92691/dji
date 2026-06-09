package com.mall.api.modules.withdrawal.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@TableName("withdrawal")
public class Withdrawal implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(type = IdType.ASSIGN_ID)
    private Long id;

    @TableField("user_id")
    private Long userId;

    private String role;

    private String type;

    @TableField("user_type")
    private String userType;

    private BigDecimal amount;

    private BigDecimal fee;

    @TableField("actual_amount")
    private BigDecimal actualAmount;

    private String currency;

    @TableField("bank_name")
    private String bankName;

    @TableField("bank_account")
    private String bankAccount;

    @TableField("account_name")
    private String accountName;

    private String method;

    @TableField("account_info")
    private String accountInfo;

    private String remark;

    @TableField("reject_reason")
    private String rejectReason;

    private String status;

    @TableField("reviewed_by")
    private Long reviewedBy;

    @TableField("reviewed_at")
    private LocalDateTime reviewedAt;

    @TableField("audit_remark")
    private String auditRemark;

    @TableField("audited_by")
    private Long auditedBy;

    @TableField("audited_at")
    private LocalDateTime auditedAt;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
