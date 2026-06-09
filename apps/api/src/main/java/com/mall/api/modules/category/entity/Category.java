package com.mall.api.modules.category.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import com.mall.api.common.entity.BaseEntity;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
@TableName("category")
@Schema(description = "分类")
public class Category extends BaseEntity {

    @Schema(description = "父级ID")
    private Long parentId;

    @Schema(description = "分类名称")
    private String name;

    @Schema(description = "图标")
    private String icon;

    @Schema(description = "图片")
    private String image;

    @Schema(description = "排序")
    private Integer sort;

    @Schema(description = "状态: ENABLED/DISABLED")
    private String status;

    @Schema(description = "逻辑删除")
    private Boolean deleted;
}
