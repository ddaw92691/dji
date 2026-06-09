package com.mall.api.modules.product.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.mall.api.modules.product.entity.Product;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Update;

@Mapper
public interface ProductMapper extends BaseMapper<Product> {

    // 原子扣减自有库存（条件成立才扣，rows==0 表示库存不足/不存在）
    @Update("UPDATE product SET stock = stock - #{qty}, sales_count = COALESCE(sales_count,0) + #{qty} " +
            "WHERE id = #{id} AND deleted = false AND stock >= #{qty}")
    int deductStock(@Param("id") Long id, @Param("qty") int qty);

    // 原子扣减商家侧平台库存
    @Update("UPDATE product SET merchant_stock = merchant_stock - #{qty}, sales_count = COALESCE(sales_count,0) + #{qty} " +
            "WHERE id = #{id} AND deleted = false AND merchant_stock >= #{qty}")
    int deductMerchantStock(@Param("id") Long id, @Param("qty") int qty);

    // 仅增加销量（用于平台全局库存场景，库存扣在 platform_product 上）
    @Update("UPDATE product SET sales_count = COALESCE(sales_count,0) + #{qty} WHERE id = #{id}")
    int increaseSales(@Param("id") Long id, @Param("qty") int qty);

    // 取消订单时归还库存并回退销量
    @Update("UPDATE product SET stock = stock + #{qty}, sales_count = GREATEST(COALESCE(sales_count,0) - #{qty}, 0) WHERE id = #{id}")
    int restoreStock(@Param("id") Long id, @Param("qty") int qty);

    @Update("UPDATE product SET merchant_stock = merchant_stock + #{qty}, sales_count = GREATEST(COALESCE(sales_count,0) - #{qty}, 0) WHERE id = #{id}")
    int restoreMerchantStock(@Param("id") Long id, @Param("qty") int qty);

    @Update("UPDATE product SET sales_count = GREATEST(COALESCE(sales_count,0) - #{qty}, 0) WHERE id = #{id}")
    int decreaseSales(@Param("id") Long id, @Param("qty") int qty);
}