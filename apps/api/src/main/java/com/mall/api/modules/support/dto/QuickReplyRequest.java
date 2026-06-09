package com.mall.api.modules.support.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.io.Serializable;

@Data
@Schema(description = "快捷回复请求")
public class QuickReplyRequest implements Serializable {

    private static final long serialVersionUID = 1L;

    @Schema(description = "标题", requiredMode = Schema.RequiredMode.REQUIRED)
    private String title;

    @Schema(description = "内容", requiredMode = Schema.RequiredMode.REQUIRED)
    private String content;

    @Schema(description = "语言代码")
    private String languageCode;

    @Schema(description = "状态")
    private String status;

    @Schema(description = "排序")
    private Integer sort;
}
