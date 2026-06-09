package com.mall.api.modules.review.controller;

import com.mall.api.common.response.ApiResponse;
import com.mall.api.modules.review.ReviewService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin/reviews")
@Tag(name = "管理员评价管理")
@PreAuthorize("hasAnyRole('SUPER_ADMIN','ADMIN')")
public class AdminReviewController {

    private final ReviewService reviewService;

    public AdminReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @GetMapping
    @Operation(summary = "评价列表")
    public ApiResponse<Map<String, Object>> getReviews(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Long productId,
            @RequestParam(required = false) Long userId,
            @RequestParam(required = false) Long merchantId,
            @RequestParam(required = false) Integer rating,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int pageSize) {
        return ApiResponse.success(reviewService.getAdminReviews(
                keyword, productId, userId, merchantId, rating, status, page, pageSize));
    }

    @PutMapping("/{id}/status")
    @Operation(summary = "更新评价状态")
    public ApiResponse<Void> updateReviewStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        reviewService.updateReviewStatus(id, body.get("status"));
        return ApiResponse.success();
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "删除评价")
    public ApiResponse<Void> deleteReview(@PathVariable Long id) {
        reviewService.deleteReview(id);
        return ApiResponse.success();
    }
}
