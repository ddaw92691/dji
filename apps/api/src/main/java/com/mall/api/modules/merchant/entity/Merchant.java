package com.mall.api.modules.merchant.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@TableName("merchant")
public class Merchant implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(type = IdType.ASSIGN_ID)
    private Long id;

    @TableField("user_id")
    private Long userId;

    @TableField("shop_name")
    private String shopName;

    @TableField("shop_logo")
    private String shopLogo;

    @TableField("shop_desc")
    private String shopDesc;

    private BigDecimal balance;

    @TableField("frozen_balance")
    private BigDecimal frozenBalance;

    @TableField("total_sales")
    private BigDecimal totalSales;

    @TableField("total_withdrawn")
    private BigDecimal totalWithdrawn;

    private String status;
    private Boolean deleted;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
