package com.mall.api.modules.i18n.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.mall.api.common.enums.ResultCode;
import com.mall.api.common.exception.BusinessException;
import com.mall.api.modules.country.entity.Country;
import com.mall.api.modules.country.entity.CountryLanguage;
import com.mall.api.modules.country.mapper.CountryLanguageMapper;
import com.mall.api.modules.country.mapper.CountryMapper;
import com.mall.api.modules.i18n.entity.I18nNamespace;
import com.mall.api.modules.i18n.entity.I18nTranslation;
import com.mall.api.modules.i18n.mapper.I18nNamespaceMapper;
import com.mall.api.modules.i18n.mapper.I18nTranslationMapper;
import com.mall.api.modules.language.entity.Language;
import com.mall.api.modules.language.mapper.LanguageMapper;
import com.mall.api.modules.user.entity.User;
import com.mall.api.modules.user.mapper.UserMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class AdminI18nService {

    private final CountryMapper countryMapper;
    private final LanguageMapper languageMapper;
    private final CountryLanguageMapper countryLanguageMapper;
    private final I18nNamespaceMapper namespaceMapper;
    private final I18nTranslationMapper translationMapper;
    private final I18nService i18nService;

    public AdminI18nService(CountryMapper countryMapper, LanguageMapper languageMapper,
                            CountryLanguageMapper countryLanguageMapper,
                            I18nNamespaceMapper namespaceMapper,
                            I18nTranslationMapper translationMapper,
                            I18nService i18nService) {
        this.countryMapper = countryMapper;
        this.languageMapper = languageMapper;
        this.countryLanguageMapper = countryLanguageMapper;
        this.namespaceMapper = namespaceMapper;
        this.translationMapper = translationMapper;
        this.i18nService = i18nService;
    }

    // ==================== Country ====================

    public Page<Country> getCountries(String keyword, String status, int page, int pageSize) {
        LambdaQueryWrapper<Country> qw = new LambdaQueryWrapper<>();
        qw.eq(Country::getDeleted, false);
        if (keyword != null && !keyword.isEmpty()) {
            qw.and(w -> w.like(Country::getName, keyword).or().like(Country::getCode, keyword));
        }
        if (status != null && !status.isEmpty()) {
            qw.eq(Country::getStatus, status);
        }
        qw.orderByAsc(Country::getSort);
        return countryMapper.selectPage(new Page<>(page, pageSize), qw);
    }

    @Transactional
    public Country createCountry(Country country) {
        Country exist = countryMapper.selectByCode(country.getCode());
        if (exist != null) throw new BusinessException(ResultCode.BAD_REQUEST.getCode(), "国家代码已存在");
        country.setId(System.currentTimeMillis());
        country.setCode(country.getCode().toUpperCase());
        country.setDeleted(false);
        country.setCreatedAt(LocalDateTime.now());
        country.setUpdatedAt(LocalDateTime.now());
        if (country.getStatus() == null) country.setStatus("ENABLE");
        countryMapper.insert(country);
        i18nService.clearCache();
        return country;
    }

    @Transactional
    public Country updateCountry(Long id, Country country) {
        Country exist = countryMapper.selectById(id);
        if (exist == null) throw new BusinessException(ResultCode.NOT_FOUND);
        if (country.getCode() != null && !country.getCode().isEmpty()) {
            Country codeExist = countryMapper.selectByCode(country.getCode().toUpperCase());
            if (codeExist != null && !codeExist.getId().equals(id)) {
                throw new BusinessException(ResultCode.BAD_REQUEST.getCode(), "国家代码已存在");
            }
            exist.setCode(country.getCode().toUpperCase());
        }
        if (country.getName() != null) exist.setName(country.getName());
        if (country.getFlagIcon() != null) exist.setFlagIcon(country.getFlagIcon());
        if (country.getPhoneCode() != null) exist.setPhoneCode(country.getPhoneCode());
        if (country.getCurrencyCode() != null) exist.setCurrencyCode(country.getCurrencyCode());
        if (country.getCurrencySymbol() != null) exist.setCurrencySymbol(country.getCurrencySymbol());
        if (country.getTimezone() != null) exist.setTimezone(country.getTimezone());
        if (country.getExchangeRate() != null) exist.setExchangeRate(country.getExchangeRate());
        if (country.getDefaultLanguageCode() != null) exist.setDefaultLanguageCode(country.getDefaultLanguageCode());
        if (country.getStatus() != null) exist.setStatus(country.getStatus());
        if (country.getSort() != null) exist.setSort(country.getSort());
        exist.setUpdatedAt(LocalDateTime.now());
        countryMapper.updateById(exist);
        i18nService.clearCache();
        return exist;
    }

    @Transactional
    public void updateCountryStatus(Long id, String status) {
        if (!"ENABLE".equals(status) && !"DISABLE".equals(status)) {
            throw new BusinessException(ResultCode.BAD_REQUEST.getCode(), "状态无效");
        }
        Country exist = countryMapper.selectById(id);
        if (exist == null) throw new BusinessException(ResultCode.NOT_FOUND);
        exist.setStatus(status);
        exist.setUpdatedAt(LocalDateTime.now());
        countryMapper.updateById(exist);
        i18nService.clearCache();
    }

    @Transactional
    public void deleteCountry(Long id) {
        Country exist = countryMapper.selectById(id);
        if (exist == null) throw new BusinessException(ResultCode.NOT_FOUND);
        exist.setDeleted(true);
        exist.setUpdatedAt(LocalDateTime.now());
        countryMapper.updateById(exist);
        countryLanguageMapper.delete(new LambdaQueryWrapper<CountryLanguage>().eq(CountryLanguage::getCountryId, id));
        i18nService.clearCache();
    }

    // ==================== Language ====================

    public Page<Language> getLanguages(String keyword, String status, int page, int pageSize) {
        LambdaQueryWrapper<Language> qw = new LambdaQueryWrapper<>();
        qw.eq(Language::getDeleted, false);
        if (keyword != null && !keyword.isEmpty()) {
            qw.and(w -> w.like(Language::getName, keyword).or().like(Language::getCode, keyword).or().like(Language::getNativeName, keyword));
        }
        if (status != null && !status.isEmpty()) qw.eq(Language::getStatus, status);
        qw.orderByAsc(Language::getSort);
        return languageMapper.selectPage(new Page<>(page, pageSize), qw);
    }

    @Transactional
    public Language createLanguage(Language language) {
        Language exist = languageMapper.selectByCode(language.getCode());
        if (exist != null) throw new BusinessException(ResultCode.BAD_REQUEST.getCode(), "语言代码已存在");
        language.setId(System.currentTimeMillis());
        language.setCode(language.getCode());
        language.setDeleted(false);
        language.setCreatedAt(LocalDateTime.now());
        language.setUpdatedAt(LocalDateTime.now());
        if (language.getStatus() == null) language.setStatus("ENABLE");
        languageMapper.insert(language);
        i18nService.clearCache();
        return language;
    }

    @Transactional
    public Language updateLanguage(Long id, Language language) {
        Language exist = languageMapper.selectById(id);
        if (exist == null) throw new BusinessException(ResultCode.NOT_FOUND);
        if (language.getCode() != null && !language.getCode().isEmpty()) {
            Language codeExist = languageMapper.selectByCode(language.getCode().toLowerCase());
            if (codeExist != null && !codeExist.getId().equals(id))
                throw new BusinessException(ResultCode.BAD_REQUEST.getCode(), "语言代码已存在");
            exist.setCode(language.getCode().toLowerCase());
        }
        if (language.getName() != null) exist.setName(language.getName());
        if (language.getNativeName() != null) exist.setNativeName(language.getNativeName());
        if (language.getStatus() != null) exist.setStatus(language.getStatus());
        if (language.getSort() != null) exist.setSort(language.getSort());
        exist.setUpdatedAt(LocalDateTime.now());
        languageMapper.updateById(exist);
        i18nService.clearCache();
        return exist;
    }

    @Transactional
    public void updateLanguageStatus(Long id, String status) {
        if (!"ENABLE".equals(status) && !"DISABLE".equals(status))
            throw new BusinessException(ResultCode.BAD_REQUEST.getCode(), "状态无效");
        Language exist = languageMapper.selectById(id);
        if (exist == null) throw new BusinessException(ResultCode.NOT_FOUND);
        exist.setStatus(status);
        exist.setUpdatedAt(LocalDateTime.now());
        languageMapper.updateById(exist);
        i18nService.clearCache();
    }

    @Transactional
    public void deleteLanguage(Long id) {
        Language exist = languageMapper.selectById(id);
        if (exist == null) throw new BusinessException(ResultCode.NOT_FOUND);
        exist.setDeleted(true);
        exist.setUpdatedAt(LocalDateTime.now());
        languageMapper.updateById(exist);
        i18nService.clearCache();
    }

    // ==================== Country-Language ====================

    public List<Map<String, Object>> getCountryLanguages(String countryCode) {
        LambdaQueryWrapper<Country> cq = new LambdaQueryWrapper<Country>().eq(Country::getDeleted, false);
        if (countryCode != null && !countryCode.isEmpty()) cq.eq(Country::getCode, countryCode.toUpperCase());
        List<Country> countries = countryMapper.selectList(cq.orderByAsc(Country::getSort));

        List<Map<String, Object>> result = new ArrayList<>();
        for (Country country : countries) {
            Map<String, Object> item = new LinkedHashMap<>();
            item.put("countryId", country.getId());
            item.put("countryCode", country.getCode());
            item.put("countryName", country.getName());
            List<CountryLanguage> cls = countryLanguageMapper.selectByCountryId(country.getId());
            List<Map<String, Object>> langs = new ArrayList<>();
            for (CountryLanguage cl : cls) {
                Language lang = languageMapper.selectById(cl.getLanguageId());
                if (lang != null) {
                    Map<String, Object> li = new LinkedHashMap<>();
                    li.put("id", cl.getId());
                    li.put("languageId", lang.getId());
                    li.put("code", lang.getCode());
                    li.put("name", lang.getName());
                    li.put("nativeName", lang.getNativeName());
                    li.put("isDefault", cl.getIsDefault());
                    langs.add(li);
                }
            }
            item.put("languages", langs);
            result.add(item);
        }
        return result;
    }

    @Transactional
    public CountryLanguage bindCountryLanguage(Long countryId, Long languageId, Boolean isDefault) {
        Country country = countryMapper.selectById(countryId);
        if (country == null) throw new BusinessException(ResultCode.NOT_FOUND.getCode(), "国家不存在");
        Language lang = languageMapper.selectById(languageId);
        if (lang == null) throw new BusinessException(ResultCode.NOT_FOUND.getCode(), "语言不存在");

        Long count = countryLanguageMapper.selectCount(new LambdaQueryWrapper<CountryLanguage>()
                .eq(CountryLanguage::getCountryId, countryId).eq(CountryLanguage::getLanguageId, languageId));
        if (count > 0) throw new BusinessException(ResultCode.BAD_REQUEST.getCode(), "该国家/地区已绑定此语言");

        CountryLanguage cl = new CountryLanguage();
        cl.setId(System.currentTimeMillis());
        cl.setCountryId(countryId);
        cl.setLanguageId(languageId);
        cl.setIsDefault(isDefault != null && isDefault);
        cl.setCreatedAt(LocalDateTime.now());
        countryLanguageMapper.insert(cl);

        if (Boolean.TRUE.equals(cl.getIsDefault())) {
            setDefaultCountryLanguageInternal(cl.getId(), countryId, lang.getCode());
        }
        i18nService.clearCache();
        return cl;
    }

    @Transactional
    public void setDefaultCountryLanguage(Long id) {
        CountryLanguage cl = countryLanguageMapper.selectById(id);
        if (cl == null) throw new BusinessException(ResultCode.NOT_FOUND);
        Language lang = languageMapper.selectById(cl.getLanguageId());
        if (lang == null) throw new BusinessException(ResultCode.NOT_FOUND);
        setDefaultCountryLanguageInternal(id, cl.getCountryId(), lang.getCode());
    }

    private void setDefaultCountryLanguageInternal(Long clId, Long countryId, String langCode) {
        List<CountryLanguage> all = countryLanguageMapper.selectByCountryId(countryId);
        for (CountryLanguage cl : all) {
            cl.setIsDefault(cl.getId().equals(clId));
            countryLanguageMapper.updateById(cl);
        }
        Country country = countryMapper.selectById(countryId);
        country.setDefaultLanguageCode(langCode);
        country.setUpdatedAt(LocalDateTime.now());
        countryMapper.updateById(country);
        i18nService.clearCache();
    }

    @Transactional
    public void deleteCountryLanguage(Long id) {
        CountryLanguage cl = countryLanguageMapper.selectById(id);
        if (cl == null) throw new BusinessException(ResultCode.NOT_FOUND);
        if (Boolean.TRUE.equals(cl.getIsDefault())) {
            throw new BusinessException(ResultCode.BAD_REQUEST.getCode(), "不能删除默认语言，请先设置其他默认语言");
        }
        countryLanguageMapper.deleteById(id);
        i18nService.clearCache();
    }

    // ==================== Namespace ====================

    public Page<I18nNamespace> getNamespaces(String keyword, String status, int page, int pageSize) {
        LambdaQueryWrapper<I18nNamespace> qw = new LambdaQueryWrapper<>();
        qw.eq(I18nNamespace::getDeleted, false);
        if (keyword != null && !keyword.isEmpty())
            qw.and(w -> w.like(I18nNamespace::getName, keyword).or().like(I18nNamespace::getCode, keyword));
        if (status != null && !status.isEmpty()) qw.eq(I18nNamespace::getStatus, status);
        qw.orderByAsc(I18nNamespace::getSort);
        return namespaceMapper.selectPage(new Page<>(page, pageSize), qw);
    }

    @Transactional
    public I18nNamespace createNamespace(I18nNamespace ns) {
        Long count = namespaceMapper.selectCount(new LambdaQueryWrapper<I18nNamespace>().eq(I18nNamespace::getCode, ns.getCode()));
        if (count > 0) throw new BusinessException(ResultCode.BAD_REQUEST.getCode(), "命名空间代码已存在");
        ns.setId(System.currentTimeMillis());
        ns.setCode(ns.getCode().toLowerCase());
        ns.setDeleted(false);
        ns.setCreatedAt(LocalDateTime.now());
        ns.setUpdatedAt(LocalDateTime.now());
        if (ns.getStatus() == null) ns.setStatus("ENABLE");
        namespaceMapper.insert(ns);
        i18nService.clearCache();
        return ns;
    }

    @Transactional
    public I18nNamespace updateNamespace(Long id, I18nNamespace ns) {
        I18nNamespace exist = namespaceMapper.selectById(id);
        if (exist == null) throw new BusinessException(ResultCode.NOT_FOUND);
        if (ns.getName() != null) exist.setName(ns.getName());
        if (ns.getCode() != null) exist.setCode(ns.getCode().toLowerCase());
        if (ns.getDescription() != null) exist.setDescription(ns.getDescription());
        if (ns.getStatus() != null) exist.setStatus(ns.getStatus());
        if (ns.getSort() != null) exist.setSort(ns.getSort());
        exist.setUpdatedAt(LocalDateTime.now());
        namespaceMapper.updateById(exist);
        i18nService.clearCache();
        return exist;
    }

    @Transactional
    public void updateNamespaceStatus(Long id, String status) {
        I18nNamespace exist = namespaceMapper.selectById(id);
        if (exist == null) throw new BusinessException(ResultCode.NOT_FOUND);
        exist.setStatus(status);
        exist.setUpdatedAt(LocalDateTime.now());
        namespaceMapper.updateById(exist);
        i18nService.clearCache();
    }

    @Transactional
    public void deleteNamespace(Long id) {
        I18nNamespace exist = namespaceMapper.selectById(id);
        if (exist == null) throw new BusinessException(ResultCode.NOT_FOUND);
        exist.setDeleted(true);
        exist.setUpdatedAt(LocalDateTime.now());
        namespaceMapper.updateById(exist);
        i18nService.clearCache();
    }

    // ==================== Translation ====================

    public Page<I18nTranslation> getTranslations(String keyword, String countryCode, String languageCode,
                                                  String namespaceCode, String status, int page, int pageSize) {
        LambdaQueryWrapper<I18nTranslation> qw = new LambdaQueryWrapper<>();
        qw.eq(I18nTranslation::getDeleted, false);
        if (keyword != null && !keyword.isEmpty())
            qw.and(w -> w.like(I18nTranslation::getTranslationKey, keyword).or().like(I18nTranslation::getTextValue, keyword));
        if (countryCode != null && !countryCode.isEmpty()) qw.eq(I18nTranslation::getCountryCode, countryCode);
        if (languageCode != null && !languageCode.isEmpty()) qw.eq(I18nTranslation::getLanguageCode, languageCode);
        if (namespaceCode != null && !namespaceCode.isEmpty()) qw.eq(I18nTranslation::getNamespaceCode, namespaceCode);
        if (status != null && !status.isEmpty()) qw.eq(I18nTranslation::getStatus, status);
        qw.orderByAsc(I18nTranslation::getNamespaceCode, I18nTranslation::getTranslationKey);
        return translationMapper.selectPage(new Page<>(page, pageSize), qw);
    }

    /**
     * 按 (模块 + key + 国家) 透视分组的翻译列表：一行一个 key，values 里按语言聚合所有翻译。
     * 用于总后台「矩阵编辑」视图，一次配置多语言。注意不按 languageCode 过滤（需要拿到该 key 的全部语言）。
     */
    public Map<String, Object> getGroupedTranslations(String keyword, String countryCode, String namespaceCode,
                                                      String status, int page, int pageSize) {
        LambdaQueryWrapper<I18nTranslation> qw = new LambdaQueryWrapper<>();
        qw.eq(I18nTranslation::getDeleted, false);
        if (keyword != null && !keyword.isEmpty())
            qw.and(w -> w.like(I18nTranslation::getTranslationKey, keyword).or().like(I18nTranslation::getTextValue, keyword));
        if (countryCode != null && !countryCode.isEmpty()) qw.eq(I18nTranslation::getCountryCode, countryCode);
        if (namespaceCode != null && !namespaceCode.isEmpty()) qw.eq(I18nTranslation::getNamespaceCode, namespaceCode);
        if (status != null && !status.isEmpty()) qw.eq(I18nTranslation::getStatus, status);
        qw.orderByAsc(I18nTranslation::getNamespaceCode, I18nTranslation::getTranslationKey);
        List<I18nTranslation> rows = translationMapper.selectList(qw);

        LinkedHashMap<String, Map<String, Object>> groups = new LinkedHashMap<>();
        for (I18nTranslation t : rows) {
            String cc = t.getCountryCode() == null ? "" : t.getCountryCode();
            String gk = t.getNamespaceCode() + " " + t.getTranslationKey() + " " + cc;
            Map<String, Object> g = groups.computeIfAbsent(gk, k -> {
                Map<String, Object> m = new LinkedHashMap<>();
                m.put("namespaceCode", t.getNamespaceCode());
                m.put("translationKey", t.getTranslationKey());
                m.put("countryCode", t.getCountryCode());
                m.put("description", t.getDescription());
                m.put("updatedAt", t.getUpdatedAt());
                m.put("values", new LinkedHashMap<String, Object>());
                return m;
            });
            @SuppressWarnings("unchecked")
            Map<String, Object> values = (Map<String, Object>) g.get("values");
            Map<String, Object> cell = new LinkedHashMap<>();
            cell.put("id", t.getId());
            cell.put("textValue", t.getTextValue());
            cell.put("status", t.getStatus());
            values.put(t.getLanguageCode(), cell);
            if (t.getDescription() != null && !t.getDescription().isBlank()) g.put("description", t.getDescription());
        }

        List<Map<String, Object>> all = new ArrayList<>(groups.values());
        int total = all.size();
        int from = Math.max(0, (page - 1) * pageSize);
        int to = Math.min(total, from + pageSize);
        List<Map<String, Object>> pageList = from >= total ? Collections.emptyList() : new ArrayList<>(all.subList(from, to));

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("list", pageList);
        result.put("total", total);
        result.put("page", page);
        result.put("pageSize", pageSize);
        return result;
    }

    @Transactional
    public I18nTranslation createTranslation(I18nTranslation t) {
        if (t.getNamespaceCode() == null || t.getNamespaceCode().isBlank()) throw new BusinessException(ResultCode.BAD_REQUEST.getCode(), "模块不能为空");
        if (t.getTranslationKey() == null || t.getTranslationKey().isBlank()) throw new BusinessException(ResultCode.BAD_REQUEST.getCode(), "翻译 key 不能为空");
        if (t.getLanguageCode() == null || t.getLanguageCode().isBlank()) throw new BusinessException(ResultCode.BAD_REQUEST.getCode(), "语言不能为空");
        if (t.getTextValue() == null) t.setTextValue("");
        if (t.getCountryCode() != null && t.getCountryCode().isBlank()) t.setCountryCode(null);
        I18nTranslation duplicate = findExistingTranslation(t.getNamespaceCode(), t.getTranslationKey(), t.getLanguageCode(), t.getCountryCode());
        if (duplicate != null) throw new BusinessException(ResultCode.BAD_REQUEST.getCode(), "同一模块、key、语言和地区的翻译已存在");
        t.setId(System.currentTimeMillis());
        t.setDeleted(false);
        t.setCreatedAt(LocalDateTime.now());
        t.setUpdatedAt(LocalDateTime.now());
        if (t.getStatus() == null) t.setStatus("ENABLE");
        translationMapper.insert(t);
        i18nService.clearCache();
        return t;
    }

    @Transactional
    public I18nTranslation updateTranslation(Long id, I18nTranslation t) {
        I18nTranslation exist = translationMapper.selectById(id);
        if (exist == null) throw new BusinessException(ResultCode.NOT_FOUND);
        if (t.getTextValue() != null) exist.setTextValue(t.getTextValue());
        if (t.getDescription() != null) exist.setDescription(t.getDescription());
        if (t.getStatus() != null) exist.setStatus(t.getStatus());
        if (t.getCountryCode() != null) exist.setCountryCode(t.getCountryCode());
        exist.setUpdatedAt(LocalDateTime.now());
        translationMapper.updateById(exist);
        i18nService.clearCache();
        return exist;
    }

    @Transactional
    public void updateTranslationStatus(Long id, String status) {
        I18nTranslation exist = translationMapper.selectById(id);
        if (exist == null) throw new BusinessException(ResultCode.NOT_FOUND);
        exist.setStatus(status);
        exist.setUpdatedAt(LocalDateTime.now());
        translationMapper.updateById(exist);
        i18nService.clearCache();
    }

    @Transactional
    public void deleteTranslation(Long id) {
        I18nTranslation exist = translationMapper.selectById(id);
        if (exist == null) throw new BusinessException(ResultCode.NOT_FOUND);
        exist.setDeleted(true);
        exist.setUpdatedAt(LocalDateTime.now());
        translationMapper.updateById(exist);
        i18nService.clearCache();
    }

    @Transactional
    public Map<String, Integer> importTranslations(String countryCode, String languageCode, String namespaceCode,
                                                    boolean overwrite, Map<String, String> messages) {
        int created = 0, updated = 0, skipped = 0;
        for (Map.Entry<String, String> entry : messages.entrySet()) {
            String key = entry.getKey();
            String value = entry.getValue();
            LambdaQueryWrapper<I18nTranslation> qw = new LambdaQueryWrapper<I18nTranslation>()
                    .eq(I18nTranslation::getNamespaceCode, namespaceCode)
                    .eq(I18nTranslation::getTranslationKey, key)
                    .eq(I18nTranslation::getLanguageCode, languageCode)
                    .eq(I18nTranslation::getDeleted, false);
            if (countryCode != null && !countryCode.isEmpty()) qw.eq(I18nTranslation::getCountryCode, countryCode);
            else qw.isNull(I18nTranslation::getCountryCode);

            I18nTranslation exist = translationMapper.selectOne(qw);
            if (exist != null) {
                if (overwrite) {
                    exist.setTextValue(value);
                    exist.setUpdatedAt(LocalDateTime.now());
                    translationMapper.updateById(exist);
                    updated++;
                } else {
                    skipped++;
                }
            } else {
                I18nTranslation nt = new I18nTranslation();
                nt.setId(System.currentTimeMillis());
                nt.setNamespaceCode(namespaceCode);
                nt.setTranslationKey(key);
                nt.setLanguageCode(languageCode);
                nt.setCountryCode(countryCode != null && !countryCode.isEmpty() ? countryCode : null);
                nt.setTextValue(value);
                nt.setDescription("");
                nt.setStatus("ENABLE");
                nt.setDeleted(false);
                nt.setCreatedAt(LocalDateTime.now());
                nt.setUpdatedAt(LocalDateTime.now());
                translationMapper.insert(nt);
                created++;
            }
        }
        Map<String, Integer> result = new LinkedHashMap<>();
        result.put("created", created);
        result.put("updated", updated);
        result.put("skipped", skipped);
        result.put("failed", 0);
        i18nService.clearCache();
        return result;
    }

    public Map<String, Object> exportTranslations(String countryCode, String languageCode, String namespaceCode) {
        LambdaQueryWrapper<I18nTranslation> qw = new LambdaQueryWrapper<I18nTranslation>()
                .eq(I18nTranslation::getLanguageCode, languageCode)
                .eq(I18nTranslation::getStatus, "ENABLE")
                .eq(I18nTranslation::getDeleted, false);
        if (namespaceCode != null && !namespaceCode.isEmpty()) qw.eq(I18nTranslation::getNamespaceCode, namespaceCode);
        if (countryCode != null && !countryCode.isEmpty()) qw.eq(I18nTranslation::getCountryCode, countryCode);

        List<I18nTranslation> list = translationMapper.selectList(qw);
        Map<String, String> messages = new LinkedHashMap<>();
        for (I18nTranslation t : list) {
            messages.put(t.getNamespaceCode() + "." + t.getTranslationKey(), t.getTextValue());
        }

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("countryCode", countryCode != null ? countryCode : "");
        result.put("languageCode", languageCode);
        result.put("namespaceCode", namespaceCode);
        result.put("messages", messages);
        return result;
    }

    @Transactional
    public Map<String, Integer> batchSaveTranslations(Map<String, Object> body) {
        int created = 0, updated = 0, skipped = 0, failed = 0;
        Object entriesObj = body.get("entries");
        if (entriesObj instanceof List<?> entries) {
            for (Object obj : entries) {
                if (!(obj instanceof Map<?, ?> raw)) { failed++; continue; }
                try {
                    I18nTranslation item = mapToTranslation(raw);
                    if (item.getNamespaceCode() == null || item.getNamespaceCode().isBlank()
                            || item.getTranslationKey() == null || item.getTranslationKey().isBlank()
                            || item.getLanguageCode() == null || item.getLanguageCode().isBlank()) {
                        failed++;
                        continue;
                    }
                    I18nTranslation exist = findExistingTranslation(item.getNamespaceCode(), item.getTranslationKey(), item.getLanguageCode(), item.getCountryCode());
                    if (exist == null) {
                        item.setId(System.currentTimeMillis() + created + updated + failed);
                        item.setStatus(item.getStatus() == null || item.getStatus().isBlank() ? "ENABLE" : item.getStatus());
                        item.setDeleted(false);
                        item.setCreatedAt(LocalDateTime.now());
                        item.setUpdatedAt(LocalDateTime.now());
                        translationMapper.insert(item);
                        created++;
                    } else {
                        exist.setTextValue(item.getTextValue());
                        if (item.getDescription() != null) exist.setDescription(item.getDescription());
                        if (item.getStatus() != null && !item.getStatus().isBlank()) exist.setStatus(item.getStatus());
                        exist.setUpdatedAt(LocalDateTime.now());
                        translationMapper.updateById(exist);
                        updated++;
                    }
                } catch (Exception e) {
                    failed++;
                }
            }
        } else {
            @SuppressWarnings("unchecked")
            Map<String, String> messages = (Map<String, String>) body.get("messages");
            String countryCode = stringOf(body.get("countryCode"));
            String languageCode = stringOf(body.get("languageCode"));
            String namespaceCode = stringOf(body.getOrDefault("module", body.get("namespaceCode")));
            if (messages != null) {
                Map<String, Integer> res = importTranslations(countryCode, languageCode, namespaceCode, true, messages);
                created += res.getOrDefault("created", 0);
                updated += res.getOrDefault("updated", 0);
                skipped += res.getOrDefault("skipped", 0);
                failed += res.getOrDefault("failed", 0);
            }
        }
        Map<String, Integer> result = new LinkedHashMap<>();
        result.put("created", created);
        result.put("updated", updated);
        result.put("skipped", skipped);
        result.put("failed", failed);
        i18nService.clearCache();
        return result;
    }

    private I18nTranslation mapToTranslation(Map<?, ?> raw) {
        I18nTranslation t = new I18nTranslation();
        t.setNamespaceCode(stringOf(firstNonBlank(raw.get("module"), raw.get("namespaceCode"), "common")));
        t.setTranslationKey(stringOf(firstNonBlank(raw.get("key"), raw.get("translationKey"), "")));
        t.setLanguageCode(stringOf(raw.get("languageCode")));
        t.setCountryCode(normalizeBlank(stringOf(raw.get("countryCode"))));
        t.setTextValue(stringOf(firstNonBlank(raw.get("value"), raw.get("textValue"), "")));
        t.setDescription(stringOf(raw.get("description")));
        if (raw.get("status") != null) t.setStatus(stringOf(raw.get("status")));
        else if (raw.get("enabled") != null) t.setStatus(Boolean.TRUE.equals(raw.get("enabled")) ? "ENABLE" : "DISABLE");
        return t;
    }

    private Object firstNonBlank(Object... values) {
        for (Object value : values) {
            if (value != null && !String.valueOf(value).isBlank()) return value;
        }
        return "";
    }

    private I18nTranslation findExistingTranslation(String namespaceCode, String translationKey, String languageCode, String countryCode) {
        LambdaQueryWrapper<I18nTranslation> qw = new LambdaQueryWrapper<I18nTranslation>()
                .eq(I18nTranslation::getNamespaceCode, namespaceCode)
                .eq(I18nTranslation::getTranslationKey, translationKey)
                .eq(I18nTranslation::getLanguageCode, languageCode)
                .eq(I18nTranslation::getDeleted, false);
        if (countryCode == null || countryCode.isBlank()) qw.and(w -> w.isNull(I18nTranslation::getCountryCode).or().eq(I18nTranslation::getCountryCode, ""));
        else qw.eq(I18nTranslation::getCountryCode, countryCode);
        List<I18nTranslation> list = translationMapper.selectList(qw);
        return list.isEmpty() ? null : list.get(0);
    }

    private String stringOf(Object value) {
        return value == null ? "" : String.valueOf(value).trim();
    }

    private String normalizeBlank(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }

}
