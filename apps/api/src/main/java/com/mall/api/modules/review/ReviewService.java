package com.mall.api.modules.review;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.mall.api.common.exception.BusinessException;
import com.mall.api.modules.notification.NotificationService;
import com.mall.api.modules.order.entity.MallOrder;
import com.mall.api.modules.order.entity.OrderItem;
import com.mall.api.modules.order.mapper.MallOrderMapper;
import com.mall.api.modules.order.mapper.OrderItemMapper;
import com.mall.api.modules.review.entity.ProductReview;
import com.mall.api.modules.review.mapper.ProductReviewMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class ReviewService {

    private final ProductReviewMapper reviewMapper;
    private final MallOrderMapper orderMapper;
    private final OrderItemMapper orderItemMapper;
    private final NotificationService notificationService;

    public ReviewService(ProductReviewMapper reviewMapper, MallOrderMapper orderMapper,
                         OrderItemMapper orderItemMapper, NotificationService notificationService) {
        this.reviewMapper = reviewMapper;
        this.orderMapper = orderMapper;
        this.orderItemMapper = orderItemMapper;
        this.notificationService = notificationService;
    }

    @Transactional
    public ProductReview createReview(Long userId, Long orderId, Long orderItemId,
                                       Integer rating, String content, String images) {
        if (rating == null || rating < 1 || rating > 5) {
            throw new BusinessException(400, "评分必须在1-5之间");
        }

        MallOrder order = orderMapper.selectById(orderId);
        if (order == null || !order.getUserId().equals(userId) || Boolean.TRUE.equals(order.getDeleted())) {
            throw new BusinessException(400, "订单不存在");
        }
        if (!"COMPLETED".equals(order.getStatus())) {
            throw new BusinessException(400, "只能评价已完成的订单");
        }

        OrderItem orderItem = orderItemMapper.selectById(orderItemId);
        if (orderItem == null || !orderItem.getOrderId().equals(orderId)) {
            throw new BusinessException(400, "订单项不存在");
        }

        LambdaQueryWrapper<ProductReview> checkWrapper = Wrappers.<ProductReview>lambdaQuery()
                .eq(ProductReview::getOrderId, orderId)
                .eq(ProductReview::getOrderItemId, orderItemId)
                .eq(ProductReview::getUserId, userId)
                .eq(ProductReview::getDeleted, false);
        if (reviewMapper.selectCount(checkWrapper) > 0) {
            throw new BusinessException(400, "该订单项已评价");
        }

        ProductReview review = new ProductReview();
        review.setOrderId(orderId);
        review.setOrderItemId(orderItemId);
        review.setProductId(orderItem.getProductId());
        review.setUserId(userId);
        review.setMerchantId(order.getMerchantId());
        review.setRating(rating);
        review.setContent(content);
        review.setImages(images);
        review.setStatus("VISIBLE");
        review.setCreatedAt(LocalDateTime.now());
        review.setUpdatedAt(LocalDateTime.now());
        review.setDeleted(false);
        reviewMapper.insert(review);

        if (order.getMerchantId() != null) {
            String title = "New product review #" + review.getId();
            String notifyContent = "Customer reviewed item in Order #" + order.getOrderNo() + " with rating " + rating;
            notificationService.createMerchantNotification(order.getMerchantId(), title, notifyContent,
                    "REVIEW", "product_review", review.getId());
        }

        return review;
    }

    public Map<String, Object> getProductReviews(Long productId, int page, int pageSize) {
        LambdaQueryWrapper<ProductReview> wrapper = Wrappers.<ProductReview>lambdaQuery()
                .eq(ProductReview::getProductId, productId)
                .eq(ProductReview::getStatus, "VISIBLE")
                .eq(ProductReview::getDeleted, false)
                .orderByDesc(ProductReview::getCreatedAt);
        Page<ProductReview> pg = reviewMapper.selectPage(new Page<>(page, pageSize), wrapper);

        Map<String, Object> result = new HashMap<>();
        result.put("list", pg.getRecords());
        result.put("total", pg.getTotal());
        result.put("page", page);
        result.put("pageSize", pageSize);
        return result;
    }

    public Map<String, Object> getMyReviews(Long userId, int page, int pageSize) {
        LambdaQueryWrapper<ProductReview> wrapper = Wrappers.<ProductReview>lambdaQuery()
                .eq(ProductReview::getUserId, userId)
                .eq(ProductReview::getDeleted, false)
                .orderByDesc(ProductReview::getCreatedAt);
        Page<ProductReview> pg = reviewMapper.selectPage(new Page<>(page, pageSize), wrapper);

        Map<String, Object> result = new HashMap<>();
        result.put("list", pg.getRecords());
        result.put("total", pg.getTotal());
        result.put("page", page);
        result.put("pageSize", pageSize);
        return result;
    }

    public Map<String, Object> getMerchantReviews(Long merchantId, Long productId, Integer rating,
                                                   int page, int pageSize) {
        LambdaQueryWrapper<ProductReview> wrapper = Wrappers.<ProductReview>lambdaQuery()
                .eq(ProductReview::getMerchantId, merchantId)
                .eq(ProductReview::getDeleted, false)
                .eq(productId != null, ProductReview::getProductId, productId)
                .eq(rating != null, ProductReview::getRating, rating)
                .orderByDesc(ProductReview::getCreatedAt);
        Page<ProductReview> pg = reviewMapper.selectPage(new Page<>(page, pageSize), wrapper);

        Map<String, Object> result = new HashMap<>();
        result.put("list", pg.getRecords());
        result.put("total", pg.getTotal());
        result.put("page", page);
        result.put("pageSize", pageSize);
        return result;
    }

    @Transactional
    public ProductReview replyReview(Long merchantId, Long reviewId, String replyContent) {
        ProductReview review = reviewMapper.selectById(reviewId);
        if (review == null || Boolean.TRUE.equals(review.getDeleted())) {
            throw new BusinessException(400, "评价不存在");
        }
        if (!review.getMerchantId().equals(merchantId)) {
            throw new BusinessException(400, "无权回复此评价");
        }
        review.setReplyContent(replyContent);
        review.setRepliedAt(LocalDateTime.now());
        review.setUpdatedAt(LocalDateTime.now());
        reviewMapper.updateById(review);

        if (review.getUserId() != null) {
            String title = "Reply to review #" + review.getId();
            String notifyContent = "Merchant replied to your review for Order #" + review.getOrderId();
            notificationService.createNotification(review.getUserId(), "CUSTOMER", title, notifyContent,
                    "REVIEW", "product_review", review.getId());
        }

        return review;
    }

    public Map<String, Object> getAdminReviews(String keyword, Long productId, Long userId, Long merchantId,
                                                Integer rating, String status, int page, int pageSize) {
        LambdaQueryWrapper<ProductReview> wrapper = Wrappers.<ProductReview>lambdaQuery()
                .eq(ProductReview::getDeleted, false)
                .eq(productId != null, ProductReview::getProductId, productId)
                .eq(userId != null, ProductReview::getUserId, userId)
                .eq(merchantId != null, ProductReview::getMerchantId, merchantId)
                .eq(rating != null, ProductReview::getRating, rating)
                .eq(status != null && !status.isBlank(), ProductReview::getStatus, status)
                .orderByDesc(ProductReview::getCreatedAt);

        if (keyword != null && !keyword.isBlank()) {
            wrapper.like(ProductReview::getContent, keyword);
        }

        Page<ProductReview> pg = reviewMapper.selectPage(new Page<>(page, pageSize), wrapper);

        Map<String, Object> result = new HashMap<>();
        result.put("list", pg.getRecords());
        result.put("total", pg.getTotal());
        result.put("page", page);
        result.put("pageSize", pageSize);
        return result;
    }

    @Transactional
    public void updateReviewStatus(Long reviewId, String status) {
        ProductReview review = reviewMapper.selectById(reviewId);
        if (review == null || Boolean.TRUE.equals(review.getDeleted())) {
            throw new BusinessException(400, "评价不存在");
        }
        review.setStatus(status);
        review.setUpdatedAt(LocalDateTime.now());
        reviewMapper.updateById(review);
    }

    @Transactional
    public void deleteReview(Long reviewId) {
        ProductReview review = reviewMapper.selectById(reviewId);
        if (review == null || Boolean.TRUE.equals(review.getDeleted())) {
            throw new BusinessException(400, "评价不存在");
        }
        review.setDeleted(true);
        review.setUpdatedAt(LocalDateTime.now());
        reviewMapper.updateById(review);
    }
}
