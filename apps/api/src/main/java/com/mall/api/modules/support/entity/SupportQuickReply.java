package com.mall.api.modules.support.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.io.Serializable;
import java.time.LocalDateTime;

@Data
@TableName("support_quick_reply")
@Schema(description = "客服快捷回复")
public class SupportQuickReply implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(type = IdType.ASSIGN_ID)
    @Schema(description = "主键ID")
    private Long id;

    @TableField("owner_type")
    @Schema(description = "所有者类型: PLATFORM/MERCHANT")
    private String ownerType;

    @TableField("owner_user_id")
    @Schema(description = "所有者用户ID")
    private Long ownerUserId;

    @TableField("owner_role")
    @Schema(description = "所有者角色")
    private String ownerRole;

    @Schema(description = "标题")
    private String title;

    @Schema(description = "内容")
    private String content;

    @TableField("language_code")
    @Schema(description = "语言代码")
    private String languageCode;

    @Schema(description = "状态")
    private String status;

    @Schema(description = "排序")
    private Integer sort;

    @Schema(description = "创建时间")
    private LocalDateTime createdAt;

    @Schema(description = "更新时间")
    private LocalDateTime updatedAt;
}
