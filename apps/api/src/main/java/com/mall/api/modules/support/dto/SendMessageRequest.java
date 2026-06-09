package com.mall.api.modules.support.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.io.Serializable;

@Data
@Schema(description = "发送消息请求")
public class SendMessageRequest implements Serializable {

    private static final long serialVersionUID = 1L;

    @Schema(description = "消息内容", requiredMode = Schema.RequiredMode.REQUIRED)
    private String content;

    @Schema(description = "消息类型: TEXT/IMAGE/FILE/SYSTEM", requiredMode = Schema.RequiredMode.REQUIRED)
    private String messageType;

    @Schema(description = "附件(JSON)")
    private String attachments;
}
