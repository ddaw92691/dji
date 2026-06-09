package com.mall.api.modules.review.controller;

import com.mall.api.common.response.ApiResponse;
import com.mall.api.modules.review.ReviewService;
import com.mall.api.modules.review.entity.ProductReview;
import com.mall.api.security.SecurityUtils;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/customer/reviews")
@Tag(name = "用户评价")
@PreAuthorize("isAuthenticated()")
public class CustomerReviewController {

    private final ReviewService reviewService;

    public CustomerReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @PostMapping
    @Operation(summary = "创建评价")
    public ApiResponse<ProductReview> createReview(@RequestBody Map<String, Object> body) {
        Long userId = SecurityUtils.getCurrentUserId();
        Long orderId = body.get("orderId") != null ? Long.valueOf(body.get("orderId").toString()) : null;
        Long orderItemId = body.get("orderItemId") != null ? Long.valueOf(body.get("orderItemId").toString()) : null;
        Integer rating = body.get("rating") != null ? Integer.valueOf(body.get("rating").toString()) : null;
        String content = (String) body.get("content");
        String images = (String) body.get("images");
        return ApiResponse.success(reviewService.createReview(userId, orderId, orderItemId, rating, content, images));
    }

    @GetMapping
    @Operation(summary = "我的评价列表")
    public ApiResponse<Map<String, Object>> getMyReviews(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int pageSize) {
        Long userId = SecurityUtils.getCurrentUserId();
        return ApiResponse.success(reviewService.getMyReviews(userId, page, pageSize));
    }
}
