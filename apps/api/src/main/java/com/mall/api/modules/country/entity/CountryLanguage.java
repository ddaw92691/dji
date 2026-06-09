package com.mall.api.modules.country.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.io.Serializable;
import java.time.LocalDateTime;

@Data
@TableName("country_language")
@Schema(description = "国家语言关联")
public class CountryLanguage implements Serializable {
    private Long id;
    private Long countryId;
    private Long languageId;
    private Boolean isDefault;
    private LocalDateTime createdAt;
}
