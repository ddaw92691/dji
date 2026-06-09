package com.mall.api.modules.admin.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.mall.api.common.response.ApiResponse;
import com.mall.api.modules.category.CategoryService;
import com.mall.api.modules.category.entity.Category;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/categories")
@Tag(name = "Admin分类管理")
@PreAuthorize("hasAnyRole('SUPER_ADMIN','ADMIN')")
public class AdminCategoryController {

    private final CategoryService categoryService;

    public AdminCategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @GetMapping
    @Operation(summary = "分类列表")
    public ApiResponse<Map<String, Object>> getCategories(
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int pageSize) {
        Page<Category> pg = categoryService.getCategories(status, page, pageSize);
        return ApiResponse.success(Map.of("list", pg.getRecords(), "total", pg.getTotal(), "page", page, "pageSize", pageSize));
    }

    @PostMapping
    @Operation(summary = "新增分类")
    public ApiResponse<Category> createCategory(@RequestBody Category category) {
        return ApiResponse.success(categoryService.createCategory(category));
    }

    @PutMapping("/{id}")
    @Operation(summary = "编辑分类")
    public ApiResponse<Category> updateCategory(@PathVariable Long id, @RequestBody Category category) {
        return ApiResponse.success(categoryService.updateCategory(id, category));
    }

    @PutMapping("/{id}/status")
    @Operation(summary = "启用/禁用分类")
    public ApiResponse<Void> updateCategoryStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        categoryService.updateCategoryStatus(id, body.get("status"));
        return ApiResponse.success();
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "删除分类")
    public ApiResponse<Void> deleteCategory(@PathVariable Long id) {
        categoryService.deleteCategory(id);
        return ApiResponse.success();
    }

    @PutMapping("/{id}/translations")
    @Operation(summary = "保存分类翻译")
    public ApiResponse<Void> saveTranslations(@PathVariable Long id,
                                               @RequestBody List<Map<String, String>> translations) {
        categoryService.saveTranslations(id, translations);
        return ApiResponse.success();
    }
}
