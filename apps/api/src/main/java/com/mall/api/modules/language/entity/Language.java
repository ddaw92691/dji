package com.mall.api.modules.language.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import com.mall.api.common.entity.BaseEntity;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
@TableName("language")
@Schema(description = "语言")
public class Language extends BaseEntity {
    @Schema(description = "语言名称") private String name;
    @Schema(description = "本地名称") private String nativeName;
    @Schema(description = "语言代码") private String code;
    @Schema(description = "状态") private String status;
    @Schema(description = "排序") private Integer sort;
    @Schema(description = "逻辑删除") private Boolean deleted;
}
