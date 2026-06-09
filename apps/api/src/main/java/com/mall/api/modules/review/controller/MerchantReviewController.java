package com.mall.api.modules.review.controller;

import com.mall.api.common.response.ApiResponse;
import com.mall.api.modules.review.ReviewService;
import com.mall.api.security.SecurityUtils;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/merchant/reviews")
@Tag(name = "商家评价管理")
@PreAuthorize("hasRole('MERCHANT')")
public class MerchantReviewController {

    private final ReviewService reviewService;

    public MerchantReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @GetMapping
    @Operation(summary = "评价列表")
    public ApiResponse<Map<String, Object>> getReviews(
            @RequestParam(required = false) Long productId,
            @RequestParam(required = false) Integer rating,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int pageSize) {
        Long merchantId = SecurityUtils.getCurrentUserId();
        return ApiResponse.success(reviewService.getMerchantReviews(merchantId, productId, rating, page, pageSize));
    }

    @PostMapping("/{id}/reply")
    @Operation(summary = "回复评价")
    public ApiResponse<Void> replyReview(@PathVariable Long id, @RequestBody Map<String, String> body) {
        Long merchantId = SecurityUtils.getCurrentUserId();
        reviewService.replyReview(merchantId, id, body.get("replyContent"));
        return ApiResponse.success();
    }
}
