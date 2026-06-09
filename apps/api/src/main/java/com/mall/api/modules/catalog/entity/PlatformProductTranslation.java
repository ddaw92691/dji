package com.mall.api.modules.catalog.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.io.Serializable;
import java.time.LocalDateTime;

@Data
@TableName("platform_product_translation")
@Schema(description = "平台商品翻译")
public class PlatformProductTranslation implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(type = IdType.ASSIGN_ID)
    @Schema(description = "主键ID")
    private Long id;

    @TableField("platform_product_id")
    @Schema(description = "平台商品ID")
    private Long platformProductId;

    @TableField("language_code")
    @Schema(description = "语言代码")
    private String languageCode;

    @TableField("country_code")
    @Schema(description = "国家代码")
    private String countryCode;

    @Schema(description = "翻译名称")
    private String name;

    @Schema(description = "翻译描述")
    private String description;

    @Schema(description = "创建时间")
    private LocalDateTime createdAt;

    @Schema(description = "更新时间")
    private LocalDateTime updatedAt;
}
