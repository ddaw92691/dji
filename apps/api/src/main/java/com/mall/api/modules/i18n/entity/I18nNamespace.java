package com.mall.api.modules.i18n.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import com.mall.api.common.entity.BaseEntity;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
@TableName("i18n_namespace")
@Schema(description = "国际化命名空间")
public class I18nNamespace extends BaseEntity {
    @Schema(description = "名称") private String name;
    @Schema(description = "代码") private String code;
    @Schema(description = "描述") private String description;
    @Schema(description = "状态") private String status;
    @Schema(description = "排序") private Integer sort;
    @Schema(description = "逻辑删除") private Boolean deleted;
}
