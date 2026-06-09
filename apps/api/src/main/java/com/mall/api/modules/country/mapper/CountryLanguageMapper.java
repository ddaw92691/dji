package com.mall.api.modules.country.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.mall.api.modules.country.entity.CountryLanguage;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface CountryLanguageMapper extends BaseMapper<CountryLanguage> {

    @Select("SELECT cl.* FROM country_language cl WHERE cl.country_id = #{countryId}")
    List<CountryLanguage> selectByCountryId(Long countryId);
}
