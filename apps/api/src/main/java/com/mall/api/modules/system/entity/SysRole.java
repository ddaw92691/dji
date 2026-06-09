package com.mall.api.modules.system.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import com.mall.api.common.entity.BaseEntity;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
@TableName("sys_role")
@Schema(description = "系统角色")
public class SysRole extends BaseEntity {

    private static final long serialVersionUID = 1L;

    @Schema(description = "角色名称")
    private String name;

    @Schema(description = "角色编码")
    private String code;

    @Schema(description = "角色描述")
    private String description;

    @Schema(description = "状态: ENABLE-启用, DISABLE-禁用")
    private String status;

    @Schema(description = "排序")
    private Integer sort;

    @Schema(description = "是否删除")
    private Boolean deleted;
}
