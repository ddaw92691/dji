package com.mall.api.modules.publicapi.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "公开地区语言配置")
public class PublicLocale {
    private String locale;
    private String country;
    private String language;
    private String countryCode;
    private String languageCode;
    private String region;
    private Boolean enabled;
    private Boolean isDefault;
    private Integer sortOrder;

    @Schema(description = "前端 locale id")
    public String getId() {
        return locale;
    }
}
