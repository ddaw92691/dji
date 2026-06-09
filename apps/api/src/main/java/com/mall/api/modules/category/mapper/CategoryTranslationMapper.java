package com.mall.api.modules.category.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.mall.api.modules.category.entity.CategoryTranslation;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface CategoryTranslationMapper extends BaseMapper<CategoryTranslation> {

    @Select("SELECT * FROM category_translation WHERE category_id = #{categoryId}")
    List<CategoryTranslation> selectByCategoryId(Long categoryId);
}
