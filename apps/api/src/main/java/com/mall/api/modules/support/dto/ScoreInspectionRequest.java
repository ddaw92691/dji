package com.mall.api.modules.support.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.io.Serializable;

@Data
@Schema(description = "评分请求")
public class ScoreInspectionRequest implements Serializable {

    private static final long serialVersionUID = 1L;

    @Schema(description = "质量评分", requiredMode = Schema.RequiredMode.REQUIRED)
    private Integer qualityScore;

    @Schema(description = "质量评分备注")
    private String qualityRemark;
}
