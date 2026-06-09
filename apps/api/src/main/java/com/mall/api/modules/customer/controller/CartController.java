package com.mall.api.modules.customer.controller;

import com.mall.api.common.response.ApiResponse;
import com.mall.api.modules.cart.CartService;
import com.mall.api.modules.cart.entity.CartItem;
import com.mall.api.security.SecurityUtils;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/customer/cart")
@Tag(name = "购物车")
@PreAuthorize("isAuthenticated()")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @GetMapping
    @Operation(summary = "获取购物车")
    public ApiResponse<List<Map<String, Object>>> getCart(
            @RequestHeader(value = "X-Country-Code", required = false) String countryCode,
            @RequestHeader(value = "X-Language-Code", required = false) String languageCode) {
        Long userId = SecurityUtils.getCurrentUserId();
        return ApiResponse.success(cartService.getCart(userId, countryCode, languageCode));
    }

    @PostMapping("/items")
    @Operation(summary = "添加商品到购物车")
    public ApiResponse<CartItem> addItem(@RequestParam Long productId, @RequestParam(defaultValue = "1") Integer quantity) {
        Long userId = SecurityUtils.getCurrentUserId();
        return ApiResponse.success(cartService.addItem(userId, productId, quantity));
    }

    @PutMapping("/items/{id}")
    @Operation(summary = "更新购物车项")
    public ApiResponse<Void> updateItem(@PathVariable Long id,
                                         @RequestParam(required = false) Integer quantity,
                                         @RequestParam(required = false) Boolean selected) {
        Long userId = SecurityUtils.getCurrentUserId();
        cartService.updateItem(userId, id, quantity, selected);
        return ApiResponse.success();
    }

    @DeleteMapping("/items/{id}")
    @Operation(summary = "删除购物车项")
    public ApiResponse<Void> deleteItem(@PathVariable Long id) {
        Long userId = SecurityUtils.getCurrentUserId();
        cartService.deleteItem(userId, id);
        return ApiResponse.success();
    }

    @DeleteMapping("/clear")
    @Operation(summary = "清空购物车")
    public ApiResponse<Void> clearCart() {
        Long userId = SecurityUtils.getCurrentUserId();
        cartService.clearCart(userId);
        return ApiResponse.success();
    }

    @PutMapping("/select-all")
    @Operation(summary = "全选/取消全选")
    public ApiResponse<Void> selectAll(@RequestParam Boolean selected) {
        Long userId = SecurityUtils.getCurrentUserId();
        cartService.selectAll(userId, selected);
        return ApiResponse.success();
    }
}
