package com.mall.api.modules.category.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.io.Serializable;
import java.time.LocalDateTime;

@Data
@TableName("category_translation")
@Schema(description = "分类翻译")
public class CategoryTranslation implements Serializable {

    @Schema(description = "主键ID")
    private Long id;

    @Schema(description = "分类ID")
    private Long categoryId;

    @Schema(description = "语言代码")
    private String languageCode;

    @Schema(description = "国家代码")
    private String countryCode;

    @Schema(description = "翻译名称")
    private String name;

    @Schema(description = "创建时间")
    private LocalDateTime createdAt;

    @Schema(description = "更新时间")
    private LocalDateTime updatedAt;
}
