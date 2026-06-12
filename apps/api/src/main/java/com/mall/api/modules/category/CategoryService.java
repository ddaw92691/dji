package com.mall.api.modules.category;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.mall.api.modules.category.entity.Category;
import com.mall.api.modules.category.entity.CategoryTranslation;
import com.mall.api.modules.category.mapper.CategoryMapper;
import com.mall.api.modules.category.mapper.CategoryTranslationMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class CategoryService {

    private final CategoryMapper categoryMapper;
    private final CategoryTranslationMapper categoryTranslationMapper;

    public CategoryService(CategoryMapper categoryMapper, CategoryTranslationMapper categoryTranslationMapper) {
        this.categoryMapper = categoryMapper;
        this.categoryTranslationMapper = categoryTranslationMapper;
    }

    public Page<Category> getCategories(String keyword, String status, int page, int pageSize) {
        LambdaQueryWrapper<Category> wrapper = Wrappers.<Category>lambdaQuery()
                .eq(Category::getDeleted, false);
        if (keyword != null && !keyword.isBlank()) {
            wrapper.like(Category::getName, keyword.trim());
        }
        if (status != null && !status.isBlank()) {
            wrapper.in(Category::getStatus, statusCandidates(status));
        }
        wrapper.orderByAsc(Category::getSort);
        Page<Category> result = categoryMapper.selectPage(new Page<>(page, pageSize), wrapper);
        result.getRecords().forEach(c -> {
            c.setStatus(normalizeStatus(c.getStatus()));
            c.setTranslations(categoryTranslationMapper.selectList(
                    Wrappers.<CategoryTranslation>lambdaQuery().eq(CategoryTranslation::getCategoryId, c.getId())));
        });
        return result;
    }

    public List<Map<String, Object>> getEnabledCategories(String countryCode, String languageCode) {
        LambdaQueryWrapper<Category> wrapper = Wrappers.<Category>lambdaQuery()
                .eq(Category::getDeleted, false)
                .in(Category::getStatus, "ENABLE", "ENABLED")
                .orderByAsc(Category::getSort);
        List<Category> categories = categoryMapper.selectList(wrapper);
        List<Map<String, Object>> result = new ArrayList<>();
        for (Category cat : categories) {
            Map<String, Object> item = new HashMap<>();
            item.put("id", cat.getId());
            item.put("parentId", cat.getParentId());
            item.put("name", cat.getName());
            item.put("icon", cat.getIcon());
            item.put("image", cat.getImage());
            item.put("sort", cat.getSort());
            CategoryTranslation translation = findBestTranslation(cat.getId(), countryCode, languageCode);
            if (translation != null && translation.getName() != null && !translation.getName().isBlank()) {
                item.put("name", translation.getName());
            }
            result.add(item);
        }
        return result;
    }

    public List<Category> getEnabledCategories() {
        LambdaQueryWrapper<Category> wrapper = Wrappers.<Category>lambdaQuery()
                .eq(Category::getDeleted, false)
                .in(Category::getStatus, "ENABLE", "ENABLED")
                .orderByAsc(Category::getSort);
        List<Category> categories = categoryMapper.selectList(wrapper);
        categories.forEach(c -> c.setStatus(normalizeStatus(c.getStatus())));
        return categories;
    }

    @Transactional
    public Category createCategory(Category category) {
        if (category.getStatus() == null || category.getStatus().isBlank()) {
            category.setStatus("ENABLE");
        } else {
            category.setStatus(normalizeStatus(category.getStatus()));
        }
        categoryMapper.insert(category);
        return category;
    }

    @Transactional
    public Category updateCategory(Long id, Category category) {
        category.setId(id);
        if (category.getStatus() != null) {
            category.setStatus(normalizeStatus(category.getStatus()));
        }
        categoryMapper.updateById(category);
        Category updated = categoryMapper.selectById(id);
        if (updated != null) {
            updated.setStatus(normalizeStatus(updated.getStatus()));
        }
        return updated;
    }

    @Transactional
    public void updateCategoryStatus(Long id, String status) {
        Category category = categoryMapper.selectById(id);
        if (category != null) {
            category.setStatus(normalizeStatus(status));
            categoryMapper.updateById(category);
        }
    }

    @Transactional
    public void deleteCategory(Long id) {
        Category category = categoryMapper.selectById(id);
        if (category != null) {
            category.setDeleted(true);
            categoryMapper.updateById(category);
        }
    }

    @Transactional
    public void saveTranslations(Long categoryId, List<Map<String, String>> translations) {
        LambdaQueryWrapper<CategoryTranslation> wrapper = Wrappers.<CategoryTranslation>lambdaQuery()
                .eq(CategoryTranslation::getCategoryId, categoryId);
        categoryTranslationMapper.delete(wrapper);
        if (translations != null) {
            for (Map<String, String> t : translations) {
                String languageCode = normalizeLanguageCode(t.get("languageCode"));
                String name = t.get("name");
                if (languageCode == null || languageCode.isBlank() || name == null || name.isBlank()) {
                    continue;
                }
                CategoryTranslation ct = new CategoryTranslation();
                ct.setCategoryId(categoryId);
                ct.setLanguageCode(languageCode);
                String countryCode = t.get("countryCode");
                ct.setCountryCode(countryCode == null || countryCode.isBlank() ? null : countryCode.trim().toUpperCase());
                ct.setName(name.trim());
                ct.setCreatedAt(LocalDateTime.now());
                ct.setUpdatedAt(LocalDateTime.now());
                categoryTranslationMapper.insert(ct);
            }
        }
    }

    private CategoryTranslation findBestTranslation(Long categoryId, String countryCode, String languageCode) {
        if (categoryId == null || languageCode == null || languageCode.isBlank()) {
            return null;
        }
        String lang = normalizeLanguageCode(languageCode);
        String country = countryCode == null ? null : countryCode.trim().toUpperCase();
        if (country != null && !country.isBlank()) {
            CategoryTranslation exact = categoryTranslationMapper.selectOne(
                    Wrappers.<CategoryTranslation>lambdaQuery()
                            .eq(CategoryTranslation::getCategoryId, categoryId)
                            .eq(CategoryTranslation::getLanguageCode, lang)
                            .eq(CategoryTranslation::getCountryCode, country)
                            .last("LIMIT 1"));
            if (exact != null) return exact;
        }
        CategoryTranslation byLanguage = categoryTranslationMapper.selectOne(
                Wrappers.<CategoryTranslation>lambdaQuery()
                        .eq(CategoryTranslation::getCategoryId, categoryId)
                        .eq(CategoryTranslation::getLanguageCode, lang)
                        .and(w -> w.isNull(CategoryTranslation::getCountryCode).or().eq(CategoryTranslation::getCountryCode, ""))
                        .last("LIMIT 1"));
        if (byLanguage != null) return byLanguage;

        return categoryTranslationMapper.selectOne(
                Wrappers.<CategoryTranslation>lambdaQuery()
                        .eq(CategoryTranslation::getCategoryId, categoryId)
                        .eq(CategoryTranslation::getLanguageCode, lang)
                        .last("LIMIT 1"));
    }

    private String normalizeLanguageCode(String code) {
        if (code == null) return null;
        String[] parts = code.trim().replace('_', '-').split("-");
        for (int i = 0; i < parts.length; i++) {
            if (parts[i].isBlank()) continue;
            if (i == 0) {
                parts[i] = parts[i].toLowerCase();
            } else if (parts[i].length() == 2) {
                parts[i] = parts[i].toUpperCase();
            } else if (parts[i].length() == 4) {
                parts[i] = parts[i].substring(0, 1).toUpperCase() + parts[i].substring(1).toLowerCase();
            }
        }
        return String.join("-", parts);
    }

    private String normalizeStatus(String status) {
        if ("ENABLED".equalsIgnoreCase(status)) {
            return "ENABLE";
        }
        if ("DISABLED".equalsIgnoreCase(status)) {
            return "DISABLE";
        }
        return status;
    }

    private List<String> statusCandidates(String status) {
        String normalized = normalizeStatus(status);
        if ("ENABLE".equalsIgnoreCase(normalized)) {
            return List.of("ENABLE", "ENABLED");
        }
        if ("DISABLE".equalsIgnoreCase(normalized)) {
            return List.of("DISABLE", "DISABLED");
        }
        return List.of(status);
    }
}
