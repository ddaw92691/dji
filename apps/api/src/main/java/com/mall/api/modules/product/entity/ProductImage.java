package com.mall.api.modules.product.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.io.Serializable;
import java.time.LocalDateTime;

@Data
@TableName("product_image")
@Schema(description = "商品图片")
public class ProductImage implements Serializable {

    @Schema(description = "主键ID")
    private Long id;

    @Schema(description = "商品ID")
    private Long productId;

    @Schema(description = "图片URL")
    private String imageUrl;

    @Schema(description = "排序")
    private Integer sort;

    @Schema(description = "是否主图")
    private Boolean isMain;

    @Schema(description = "创建时间")
    private LocalDateTime createdAt;
}
