package com.mall.api.modules.support.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.io.Serializable;

@Data
@Schema(description = "关闭会话请求")
public class CloseSessionRequest implements Serializable {

    private static final long serialVersionUID = 1L;

    @Schema(description = "关闭原因")
    private String closeReason;
}
