package com.mall.api.modules.catalog.entity;

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
@TableName("platform_product")
@Schema(description = "平台商品")
public class PlatformProduct implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(type = IdType.ASSIGN_ID)
    @Schema(description = "主键ID")
    private Long id;

    @Schema(description = "品牌")
    private String brand;

    @Schema(description = "名称")
    private String name;

    @Schema(description = "型号")
    private String model;

    @TableField("category_id")
    @Schema(description = "分类ID")
    private Long categoryId;

    @TableField("merchant_price")
    @Schema(description = "商家成本价")
    private BigDecimal merchantPrice;

    @TableField("sale_price")
    @Schema(description = "销售价")
    private BigDecimal salePrice;

    @TableField("original_price")
    @Schema(description = "原价")
    private BigDecimal originalPrice;

    @TableField("profit_amount")
    @Schema(description = "利润金额")
    private BigDecimal profitAmount;

    @TableField("profit_rate")
    @Schema(description = "利润率")
    private BigDecimal profitRate;

    @Schema(description = "描述")
    private String description;

    @TableField("cover_image")
    @Schema(description = "封面图")
    private String coverImage;

    @TableField("stock_mode")
    @Schema(description = "库存模式: PLATFORM_GLOBAL/MERCHANT_STOCK")
    private String stockMode;

    @TableField("global_stock")
    @Schema(description = "全局库存")
    private Integer globalStock;

    @Schema(description = "排序")
    private Integer sort;

    @Schema(description = "状态: ENABLE/DISABLE")
    private String status;

    @TableField("created_by")
    @Schema(description = "创建人ID")
    private Long createdBy;

    @TableField("updated_by")
    @Schema(description = "更新人ID")
    private Long updatedBy;

    @Schema(description = "逻辑删除")
    private Boolean deleted;

    @Schema(description = "创建时间")
    private LocalDateTime createdAt;

    @Schema(description = "更新时间")
    private LocalDateTime updatedAt;
}
