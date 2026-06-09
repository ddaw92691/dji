package com.mall.api.modules.country.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.mall.api.modules.country.entity.Country;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

@Mapper
public interface CountryMapper extends BaseMapper<Country> {

    @Select("SELECT * FROM country WHERE code = #{code} AND status = 'ENABLE' AND deleted = false")
    Country selectByCode(String code);
}
