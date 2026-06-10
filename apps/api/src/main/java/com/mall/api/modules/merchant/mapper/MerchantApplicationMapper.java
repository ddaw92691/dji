package com.mall.api.modules.merchant.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.mall.api.modules.merchant.entity.MerchantApplication;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

@Mapper
public interface MerchantApplicationMapper extends BaseMapper<MerchantApplication> {

    @Select("SELECT * FROM merchant_application WHERE email = #{email} AND deleted = false ORDER BY created_at DESC LIMIT 1")
    MerchantApplication selectLatestByEmail(String email);
}
