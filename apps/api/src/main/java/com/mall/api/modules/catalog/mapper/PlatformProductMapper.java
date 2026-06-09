package com.mall.api.modules.catalog.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.mall.api.modules.catalog.entity.PlatformProduct;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Update;

@Mapper
public interface PlatformProductMapper extends BaseMapper<PlatformProduct> {

    @Update("UPDATE platform_product SET global_stock = global_stock - #{qty} " +
            "WHERE id = #{id} AND deleted = false AND global_stock >= #{qty}")
    int deductGlobalStock(@Param("id") Long id, @Param("qty") int qty);

    @Update("UPDATE platform_product SET global_stock = global_stock + #{qty} WHERE id = #{id}")
    int restoreGlobalStock(@Param("id") Long id, @Param("qty") int qty);
}