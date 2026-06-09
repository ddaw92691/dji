package com.mall.api.modules.tax.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@TableName("merchant_tax_notice")
@Schema(description = "商家税务通知")
public class MerchantTaxNotice implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(type = IdType.ASSIGN_ID)
    private Long id;

    @TableField("merchant_id")
    @Schema(description = "商家ID")
    private Long merchantId;

    @TableField("merchant_user_id")
    @Schema(description = "商家用户ID")
    private Long merchantUserId;

    @Schema(description = "标题")
    private String title;

    @Schema(description = "内容")
    private String content;

    @TableField("tax_type")
    @Schema(description = "税种")
    private String taxType;

    @Schema(description = "金额")
    private BigDecimal amount;

    @TableField("currency_code")
    @Schema(description = "币种代码")
    private String currencyCode;

    @Schema(description = "状态: PENDING/PAID/REJECTED/CANCELLED/OVERDUE")
    private String status;

    @TableField("force_popup")
    @Schema(description = "是否强制弹窗")
    private Boolean forcePopup;

    @TableField("block_until_paid")
    @Schema(description = "是否阻止操作直到支付")
    private Boolean blockUntilPaid;

    @TableField("due_at")
    @Schema(description = "截止日期")
    private LocalDateTime dueAt;

    @TableField("paid_at")
    @Schema(description = "支付时间")
    private LocalDateTime paidAt;

    @TableField("payment_method")
    @Schema(description = "支付方式")
    private String paymentMethod;

    @TableField("payment_proof")
    @Schema(description = "支付凭证")
    private String paymentProof;

    @TableField("reviewed_by")
    @Schema(description = "审核人ID")
    private Long reviewedBy;

    @TableField("reviewed_at")
    @Schema(description = "审核时间")
    private LocalDateTime reviewedAt;

    @TableField("reject_reason")
    @Schema(description = "拒绝原因")
    private String rejectReason;

    @TableField("created_by")
    @Schema(description = "创建人ID")
    private Long createdBy;

    @Schema(description = "逻辑删除")
    private Boolean deleted;

    @Schema(description = "创建时间")
    private LocalDateTime createdAt;

    @Schema(description = "更新时间")
    private LocalDateTime updatedAt;
}
