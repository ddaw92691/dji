package com.mall.api.modules.support.controller;

import com.mall.api.common.response.ApiResponse;
import com.mall.api.modules.merchant.entity.Merchant;
import com.mall.api.modules.merchant.mapper.MerchantMapper;
import com.mall.api.modules.order.entity.MallOrder;
import com.mall.api.modules.order.mapper.MallOrderMapper;
import com.mall.api.modules.product.entity.Product;
import com.mall.api.modules.product.mapper.ProductMapper;
import com.mall.api.modules.support.dto.CloseSessionRequest;
import com.mall.api.modules.support.dto.CreateSessionRequest;
import com.mall.api.modules.support.dto.SendMessageRequest;
import com.mall.api.modules.support.entity.SupportMessage;
import com.mall.api.modules.support.entity.SupportSession;
import com.mall.api.modules.support.service.SupportService;
import com.mall.api.modules.user.entity.User;
import com.mall.api.modules.user.mapper.UserMapper;
import com.mall.api.security.SecurityUtils;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/customer/support")
@Tag(name = "客户客服")
@PreAuthorize("isAuthenticated()")
public class CustomerSupportController {

    private final SupportService supportService;
    private final UserMapper userMapper;
    private final ProductMapper productMapper;
    private final MallOrderMapper orderMapper;
    private final MerchantMapper merchantMapper;

    public CustomerSupportController(SupportService supportService,
                                      UserMapper userMapper,
                                      ProductMapper productMapper,
                                      MallOrderMapper orderMapper,
                                      MerchantMapper merchantMapper) {
        this.supportService = supportService;
        this.userMapper = userMapper;
        this.productMapper = productMapper;
        this.orderMapper = orderMapper;
        this.merchantMapper = merchantMapper;
    }

    @PostMapping("/sessions")
    @Operation(summary = "创建客服会话")
    public ApiResponse<SupportSession> createSession(@RequestBody CreateSessionRequest request) {
        Long userId = SecurityUtils.getCurrentUserId();
        User user = userMapper.selectById(userId);

        Long merchantId = request.getMerchantId();
        Long merchantUserId = null;

        if (request.getRelatedProductId() != null) {
            Product product = productMapper.selectById(request.getRelatedProductId());
            if (product == null) {
                return ApiResponse.error(400, "关联商品不存在");
            }
            if (merchantId == null) {
                merchantId = product.getMerchantId();
            }
        }

        if (request.getRelatedOrderId() != null) {
            MallOrder order = orderMapper.selectById(request.getRelatedOrderId());
            if (order == null) {
                return ApiResponse.error(400, "关联订单不存在");
            }
            if (!userId.equals(order.getUserId())) {
                return ApiResponse.error(400, "订单不属于当前用户");
            }
            if (merchantId == null) {
                merchantId = order.getMerchantId();
            }
        }

        if (merchantId != null) {
            Merchant merchant = merchantMapper.selectById(merchantId);
            if (merchant != null) {
                merchantUserId = merchant.getUserId();
            }
        }

        SupportSession session = supportService.createSession(
                request.getSessionType() != null ? request.getSessionType() : "CUSTOMER_TO_MERCHANT",
                request.getTitle(),
                userId,
                merchantId,
                merchantUserId,
                request.getPriority(),
                request.getRelatedProductId(),
                request.getRelatedOrderId()
        );

        if (request.getFirstMessage() != null && !request.getFirstMessage().isBlank()) {
            supportService.sendMessage(
                    session.getId(),
                    userId,
                    user != null ? user.getRole() : "CUSTOMER",
                    user != null ? user.getNickname() : "Customer",
                    user != null ? user.getAvatar() : null,
                    "CUSTOMER",
                    request.getFirstMessage(),
                    "TEXT",
                    null
            );
        }

        return ApiResponse.success(session);
    }

    @GetMapping("/sessions")
    @Operation(summary = "我的客服会话列表")
    public ApiResponse<Map<String, Object>> getMySessions(
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int pageSize) {
        Long userId = SecurityUtils.getCurrentUserId();
        return ApiResponse.success(supportService.getCustomerSessions(userId, status, page, pageSize));
    }

    @GetMapping("/sessions/{id}")
    @Operation(summary = "会话详情")
    public ApiResponse<Map<String, Object>> getSessionDetail(@PathVariable Long id) {
        Long userId = SecurityUtils.getCurrentUserId();
        User user = userMapper.selectById(userId);
        return ApiResponse.success(supportService.getSessionDetail(id,
                user != null ? user.getRole() : "CUSTOMER", userId));
    }

    @PostMapping("/sessions/{id}/messages")
    @Operation(summary = "发送消息")
    public ApiResponse<SupportMessage> sendMessage(@PathVariable Long id,
                                                    @RequestBody SendMessageRequest request) {
        Long userId = SecurityUtils.getCurrentUserId();
        User user = userMapper.selectById(userId);
        SupportMessage message = supportService.sendMessage(
                id,
                userId,
                user != null ? user.getRole() : "CUSTOMER",
                user != null ? user.getNickname() : "Customer",
                user != null ? user.getAvatar() : null,
                "CUSTOMER",
                request.getContent(),
                request.getMessageType(),
                request.getAttachments()
        );
        return ApiResponse.success(message);
    }

    @GetMapping("/sessions/{id}/messages")
    public ApiResponse<List<SupportMessage>> getMessages(@PathVariable Long id) {
        Long userId = SecurityUtils.getCurrentUserId();
        User user = userMapper.selectById(userId);
        return ApiResponse.success(supportService.getMessages(id,
                user != null ? user.getRole() : "CUSTOMER", userId));
    }

    @PutMapping("/sessions/{id}/close")
    @Operation(summary = "关闭会话")
    public ApiResponse<Void> closeSession(@PathVariable Long id,
                                           @RequestBody(required = false) CloseSessionRequest request) {
        Long userId = SecurityUtils.getCurrentUserId();
        User user = userMapper.selectById(userId);
        supportService.closeSession(id, user != null ? user.getRole() : "CUSTOMER",
                userId, request != null ? request.getCloseReason() : null);
        return ApiResponse.success();
    }

    @PutMapping("/sessions/{id}/read")
    @Operation(summary = "标记已读")
    public ApiResponse<Void> markAsRead(@PathVariable Long id) {
        Long userId = SecurityUtils.getCurrentUserId();
        supportService.markAsRead(id, userId);
        return ApiResponse.success();
    }
}
