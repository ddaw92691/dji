package com.mall.api.modules.language.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.mall.api.modules.language.entity.Language;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

@Mapper
public interface LanguageMapper extends BaseMapper<Language> {

    @Select("SELECT * FROM language WHERE code = #{code} AND status = 'ENABLE' AND deleted = false")
    Language selectByCode(String code);
}
