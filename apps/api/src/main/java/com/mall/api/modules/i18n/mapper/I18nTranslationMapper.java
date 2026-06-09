package com.mall.api.modules.i18n.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.mall.api.modules.i18n.entity.I18nTranslation;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface I18nTranslationMapper extends BaseMapper<I18nTranslation> {

    @Select("SELECT * FROM i18n_translation WHERE namespace_code = #{namespaceCode} AND language_code = #{languageCode} AND (country_code = #{countryCode} OR country_code IS NULL OR country_code = '') AND status = 'ENABLE' AND deleted = false")
    List<I18nTranslation> selectByNsAndLang(@Param("namespaceCode") String namespaceCode, @Param("languageCode") String languageCode, @Param("countryCode") String countryCode);

    @Select("SELECT * FROM i18n_translation WHERE namespace_code = #{namespaceCode} AND language_code = #{languageCode} AND country_code IS NULL AND status = 'ENABLE' AND deleted = false")
    List<I18nTranslation> selectByNsAndLangOnly(@Param("namespaceCode") String namespaceCode, @Param("languageCode") String languageCode);

    @Select("<script>SELECT * FROM i18n_translation WHERE namespace_code IN " +
        "<foreach collection='namespaceCodes' item='code' open='(' separator=',' close=')'>#{code}</foreach> " +
        "AND language_code = #{languageCode} " +
        "AND (country_code = #{countryCode} OR country_code IS NULL OR country_code = '') " +
        "AND status = 'ENABLE' AND deleted = false</script>")
    List<I18nTranslation> selectByNsListAndLang(@Param("namespaceCodes") List<String> namespaceCodes,
                                                @Param("languageCode") String languageCode,
                                                @Param("countryCode") String countryCode);

    @Select("<script>SELECT * FROM i18n_translation WHERE namespace_code IN " +
        "<foreach collection='namespaceCodes' item='code' open='(' separator=',' close=')'>#{code}</foreach> " +
        "AND language_code = #{languageCode} " +
        "AND (country_code IS NULL OR country_code = '') " +
        "AND status = 'ENABLE' AND deleted = false</script>")
    List<I18nTranslation> selectByNsListAndLangOnly(@Param("namespaceCodes") List<String> namespaceCodes,
                                                    @Param("languageCode") String languageCode);

    @Select("SELECT * FROM i18n_translation WHERE namespace_code = #{namespaceCode} AND translation_key = #{translationKey} AND language_code = #{languageCode} AND (country_code = #{countryCode} OR country_code IS NULL OR country_code = '') AND status = 'ENABLE' AND deleted = false ORDER BY country_code DESC NULLS LAST LIMIT 1")
    I18nTranslation selectOneByKey(@Param("namespaceCode") String namespaceCode, @Param("translationKey") String translationKey, @Param("languageCode") String languageCode, @Param("countryCode") String countryCode);
}
