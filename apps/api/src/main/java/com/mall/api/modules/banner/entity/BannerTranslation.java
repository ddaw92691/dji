package com.mall.api.modules.banner.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.io.Serializable;
import java.time.LocalDateTime;

@Data
@TableName("banner_translation")
@Schema(description = "Banner翻译")
public class BannerTranslation implements Serializable {

    @Schema(description = "主键ID")
    private Long id;

    @Schema(description = "Banner ID")
    private Long bannerId;

    @Schema(description = "语言代码")
    private String languageCode;

    @Schema(description = "国家代码")
    private String countryCode;

    @Schema(description = "翻译标题")
    private String title;

    @Schema(description = "翻译副标题")
    private String subtitle;

    @Schema(description = "创建时间")
    private LocalDateTime createdAt;

    @Schema(description = "更新时间")
    private LocalDateTime updatedAt;
}
