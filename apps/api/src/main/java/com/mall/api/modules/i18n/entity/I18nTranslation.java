package com.mall.api.modules.i18n.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import com.mall.api.common.entity.BaseEntity;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
@TableName("i18n_translation")
@Schema(description = "国际化翻译")
public class I18nTranslation extends BaseEntity {
    @Schema(description = "命名空间代码") private String namespaceCode;
    @Schema(description = "翻译键") private String translationKey;
    @Schema(description = "语言代码") private String languageCode;
    @Schema(description = "国家代码") private String countryCode;
    @Schema(description = "翻译文本") private String textValue;
    @Schema(description = "描述") private String description;
    @Schema(description = "状态") private String status;
    @Schema(description = "逻辑删除") private Boolean deleted;
}
