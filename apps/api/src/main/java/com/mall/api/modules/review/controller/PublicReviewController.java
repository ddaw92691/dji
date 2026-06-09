package com.mall.api.modules.review.controller;

import com.mall.api.common.response.ApiResponse;
import com.mall.api.modules.review.ReviewService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@Tag(name = "公开评价")
public class PublicReviewController {

    private final ReviewService reviewService;

    public PublicReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @GetMapping("/api/customer/products/{productId}/reviews")
    @Operation(summary = "商品评价列表(公开)")
    public ApiResponse<Map<String, Object>> getProductReviews(
            @PathVariable Long productId,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int pageSize) {
        return ApiResponse.success(reviewService.getProductReviews(productId, page, pageSize));
    }
}
