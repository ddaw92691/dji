package com.mall.api.modules.merchant.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.io.Serializable;
import java.time.LocalDateTime;

@Data
@TableName("withdraw_account")
public class WithdrawAccount implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(type = IdType.ASSIGN_ID)
    private Long id;

    @TableField("merchant_id")
    private Long merchantId;

    @TableField("user_id")
    private Long userId;

    /** CRYPTO / BANK */
    private String type;

    // 加密货币
    private String chain;
    private String address;

    // 银行
    @TableField("bank_name")
    private String bankName;

    @TableField("account_no")
    private String accountNo;

    @TableField("account_name")
    private String accountName;

    @TableField("swift_code")
    private String swiftCode;

    private String country;
    private String remark;

    @TableField("is_default")
    private Boolean isDefault;

    private String status;
    private Boolean deleted;

    @TableField("created_at")
    private LocalDateTime createdAt;

    @TableField("updated_at")
    private LocalDateTime updatedAt;
}
