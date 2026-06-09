package com.mall.api.modules.product.entity;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableName;
import com.mall.api.common.entity.BaseEntity;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@EqualsAndHashCode(callSuper = true)
@TableName("product")
@Schema(description = "商品")
public class Product extends BaseEntity {

    @Schema(description = "商家ID")
    private Long merchantId;

    @Schema(description = "分类ID")
    private Long categoryId;

    @Schema(description = "商品标题")
    private String title;

    @Schema(description = "商品描述")
    private String description;

    @TableField("main_image")
    @Schema(description = "封面图")
    private String coverImage;

    @Schema(description = "售价")
    private BigDecimal price;

    @Schema(description = "原价")
    private BigDecimal originalPrice;

    @Schema(description = "库存")
    private Integer stock;

    @TableField("sales")
    @Schema(description = "销量")
    private Integer salesCount;

    @Schema(description = "状态: DRAFT/ON_SALE/OFF_SALE")
    private String status;

    @Schema(description = "审核状态: DRAFT/PENDING/APPROVED/REJECTED")
    private String auditStatus;

    @Schema(description = "审核备注")
    private String auditRemark;

    @Schema(description = "审核人ID")
    private Long auditBy;

    @Schema(description = "审核时间")
    private LocalDateTime auditAt;

    @TableField("platform_product_id")
    @Schema(description = "平台商品ID")
    private Long platformProductId;

    @TableField("listing_status")
    @Schema(description = "上架状态: DRAFT/ON_SALE/OFF_SALE")
    private String listingStatus;

    @TableField("merchant_stock")
    @Schema(description = "商家库存")
    private Integer merchantStock;

    @TableField("use_platform_price")
    @Schema(description = "是否使用平台定价")
    private Boolean usePlatformPrice;

    @TableField("listed_at")
    @Schema(description = "上架时间")
    private LocalDateTime listedAt;

    @Schema(description = "逻辑删除")
    private Boolean deleted;
}
