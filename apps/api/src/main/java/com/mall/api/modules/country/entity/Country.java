package com.mall.api.modules.country.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import com.mall.api.common.entity.BaseEntity;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;

@Data
@EqualsAndHashCode(callSuper = true)
@TableName("country")
@Schema(description = "国家")
public class Country extends BaseEntity {
    @Schema(description = "国家名称") private String name;
    @Schema(description = "国家代码") private String code;
    @Schema(description = "旗帜图标") private String flagIcon;
    @Schema(description = "电话区号") private String phoneCode;
    @Schema(description = "默认语言代码") private String defaultLanguageCode;
    @Schema(description = "货币代码") private String currencyCode;
    @Schema(description = "货币符号") private String currencySymbol;
    @Schema(description = "时区") private String timezone;
    @Schema(description = "汇率") private BigDecimal exchangeRate;
    @Schema(description = "状态") private String status;
    @Schema(description = "排序") private Integer sort;
    @Schema(description = "逻辑删除") private Boolean deleted;
}
