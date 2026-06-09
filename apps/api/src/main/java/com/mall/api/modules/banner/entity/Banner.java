package com.mall.api.modules.banner.entity;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableName;
import com.mall.api.common.entity.BaseEntity;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
@TableName("banner")
@Schema(description = "横幅/Banner")
public class Banner extends BaseEntity {

    @Schema(description = "标题")
    private String title;

    @Schema(description = "副标题")
    private String subtitle;

    @TableField("image_url")
    @Schema(description = "图片URL")
    private String imageUrl;

    @Schema(description = "链接URL")
    private String linkUrl;

    @Schema(description = "链接类型: PRODUCT/CATEGORY/URL/NONE")
    private String linkType;

    @Schema(description = "排序")
    private Integer sort;

    @Schema(description = "位置: HOME_TOP/HOME_MIDDLE/SIDE")
    private String position;

    @Schema(description = "状态: ENABLED/DISABLED")
    private String status;

    @Schema(description = "逻辑删除")
    private Boolean deleted;
}
