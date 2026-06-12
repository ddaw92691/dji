package com.mall.api.modules.order;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mall.api.common.exception.BusinessException;
import com.mall.api.modules.address.entity.Address;
import com.mall.api.modules.address.mapper.AddressMapper;
import com.mall.api.modules.cart.entity.CartItem;
import com.mall.api.modules.cart.mapper.CartItemMapper;
import com.mall.api.modules.catalog.entity.PlatformProduct;
import com.mall.api.modules.catalog.mapper.PlatformProductMapper;
import com.mall.api.modules.commission.CommissionService;
import com.mall.api.modules.coupon.CouponService;
import com.mall.api.modules.merchant.entity.Merchant;
import com.mall.api.modules.merchant.mapper.MerchantMapper;
import com.mall.api.modules.merchant.service.MerchantFundService;
import com.mall.api.modules.notification.NotificationService;
import com.mall.api.modules.order.dto.CreateOrderRequest;
import com.mall.api.modules.order.dto.OrderResponse;
import com.mall.api.modules.order.entity.MallOrder;
import com.mall.api.modules.order.entity.OrderItem;
import com.mall.api.modules.order.entity.OrderSettlementRecord;
import com.mall.api.modules.order.mapper.MallOrderMapper;
import com.mall.api.modules.order.mapper.OrderItemMapper;
import com.mall.api.modules.order.mapper.OrderSettlementRecordMapper;
import com.mall.api.modules.payment.entity.Payment;
import com.mall.api.modules.payment.mapper.PaymentMapper;
import com.mall.api.modules.product.entity.Product;
import com.mall.api.modules.product.mapper.ProductMapper;
import com.mall.api.modules.realtime.RealtimeService;
import com.mall.api.modules.user.entity.User;
import com.mall.api.modules.user.mapper.UserMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.mall.api.modules.country.entity.Country;
import com.mall.api.modules.country.mapper.CountryMapper;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.concurrent.ThreadLocalRandom;
import java.util.stream.Collectors;

@Service
public class OrderService {

    private final MallOrderMapper orderMapper;
    private final OrderItemMapper orderItemMapper;
    private final CartItemMapper cartItemMapper;
    private final AddressMapper addressMapper;
    private final ProductMapper productMapper;
    private final PlatformProductMapper platformProductMapper;
    private final PaymentMapper paymentMapper;
    private final UserMapper userMapper;
    private final MerchantMapper merchantMapper;
    private final CommissionService commissionService;
    private final CouponService couponService;
    private final NotificationService notificationService;
    private final RealtimeService realtimeService;
    private final CountryMapper countryMapper;
    private final MerchantFundService merchantFundService;
    private final OrderSettlementRecordMapper settlementRecordMapper;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public OrderService(MallOrderMapper orderMapper, OrderItemMapper orderItemMapper,
                        CartItemMapper cartItemMapper, AddressMapper addressMapper,
                        ProductMapper productMapper, PlatformProductMapper platformProductMapper,
                        PaymentMapper paymentMapper, UserMapper userMapper,
                        MerchantMapper merchantMapper,
                        CommissionService commissionService, CouponService couponService,
                        NotificationService notificationService, RealtimeService realtimeService,
                        CountryMapper countryMapper, MerchantFundService merchantFundService,
                        OrderSettlementRecordMapper settlementRecordMapper) {
        this.orderMapper = orderMapper;
        this.orderItemMapper = orderItemMapper;
        this.cartItemMapper = cartItemMapper;
        this.addressMapper = addressMapper;
        this.productMapper = productMapper;
        this.platformProductMapper = platformProductMapper;
        this.paymentMapper = paymentMapper;
        this.userMapper = userMapper;
        this.merchantMapper = merchantMapper;
        this.commissionService = commissionService;
        this.couponService = couponService;
        this.notificationService = notificationService;
        this.realtimeService = realtimeService;
        this.countryMapper = countryMapper;
        this.merchantFundService = merchantFundService;
        this.settlementRecordMapper = settlementRecordMapper;
    }

    // ==================== CUSTOMER METHODS ====================

    @Transactional
    public OrderResponse createOrder(Long userId, CreateOrderRequest req) {
        Address address = addressMapper.selectById(req.getAddressId());
        if (address == null || !address.getUserId().equals(userId) || Boolean.TRUE.equals(address.getDeleted())) {
            throw new BusinessException(400, "error.address.notFound");
        }

        List<CartItem> cartItems;
        Long merchantId;
        BigDecimal totalAmount;
        BigDecimal shippingAmount = BigDecimal.ZERO;
        BigDecimal discountAmount = BigDecimal.ZERO;

        if ("BUY_NOW".equals(req.getSource())) {
            if (req.getProductId() == null || req.getQuantity() == null || req.getQuantity() <= 0) {
                throw new BusinessException(400, "请求参数错误");
            }
            Product product = validateProduct(req.getProductId(), req.getQuantity());
            merchantId = product.getMerchantId();

            totalAmount = product.getPrice().multiply(BigDecimal.valueOf(req.getQuantity()));

            CartItem temp = new CartItem();
            temp.setProductId(req.getProductId());
            temp.setQuantity(req.getQuantity());
            temp.setPriceSnapshot(product.getPrice());
            cartItems = List.of(temp);
        } else {
            LambdaQueryWrapper<CartItem> wrapper = Wrappers.<CartItem>lambdaQuery()
                    .eq(CartItem::getUserId, userId)
                    .eq(CartItem::getSelected, true);
            if (req.getCartItemIds() != null && !req.getCartItemIds().isEmpty()) {
                wrapper.in(CartItem::getId, req.getCartItemIds());
            }
            cartItems = cartItemMapper.selectList(wrapper);

            if (cartItems.isEmpty()) {
                throw new BusinessException(400, "error.cart.empty");
            }

            totalAmount = BigDecimal.ZERO;
            merchantId = null;

            for (CartItem ci : cartItems) {
                Product product = validateProduct(ci.getProductId(), ci.getQuantity());
                if (merchantId == null) {
                    merchantId = product.getMerchantId();
                } else if (!merchantId.equals(product.getMerchantId())) {
                    throw new BusinessException(400, "error.order.multiMerchantNotSupported");
                }
                totalAmount = totalAmount.add(product.getPrice().multiply(BigDecimal.valueOf(ci.getQuantity())));
            }
        }

        String orderNo = generateOrderNo();
        String addressJson = buildAddressSnapshot(address);

        BigDecimal couponAmount = couponService.calculateCouponAmount(userId, req.getUserCouponId(), totalAmount);

        MallOrder order = new MallOrder();
        order.setOrderNo(orderNo);
        order.setUserId(userId);
        order.setMerchantId(merchantId);
        order.setTotalAmount(totalAmount);
        order.setDiscountAmount(discountAmount);
        order.setShippingAmount(shippingAmount);
        order.setCouponAmount(couponAmount);
        BigDecimal pay = totalAmount.subtract(discountAmount).subtract(couponAmount).add(shippingAmount);
        order.setPayAmount(pay.max(BigDecimal.ZERO));
        order.setCurrency(resolveCurrency(userId));
        order.setStatus("PENDING_PAYMENT");
        order.setPayStatus("UNPAID");
        order.setAddressSnapshot(addressJson);
        order.setRemark(req.getRemark());
        order.setReceiverName(address.getReceiverName());
        order.setReceiverPhone(address.getReceiverPhone());
        order.setReceiverAddress(buildFullAddress(address));
        order.setRefundStatus("NONE");
        order.setDeleted(false);
        order.setCreatedAt(LocalDateTime.now());
        order.setUpdatedAt(LocalDateTime.now());
        orderMapper.insert(order);

        if (req.getUserCouponId() != null) {
            order.setUserCouponId(req.getUserCouponId());
            couponService.useCouponInOrder(userId, req.getUserCouponId(), order.getId());
        }

        List<OrderItem> orderItems = new ArrayList<>();
        for (CartItem ci : cartItems) {
            Product product = productMapper.selectById(ci.getProductId());
            BigDecimal itemPrice = product.getPrice();
            if (product.getPlatformProductId() != null) {
                PlatformProduct pp = platformProductMapper.selectById(product.getPlatformProductId());
                if (pp != null && !Boolean.TRUE.equals(pp.getDeleted()) && "ENABLE".equals(pp.getStatus())) {
                    itemPrice = pp.getSalePrice();
                }
            }
            OrderItem oi = new OrderItem();
            oi.setOrderId(order.getId());
            oi.setProductId(ci.getProductId());
            oi.setProductTitle(product.getTitle());
            oi.setProductImage(product.getCoverImage());
            oi.setPrice(itemPrice);
            oi.setQuantity(ci.getQuantity());
            oi.setTotalAmount(itemPrice.multiply(BigDecimal.valueOf(ci.getQuantity())));
            oi.setCreatedAt(LocalDateTime.now());
            orderItemMapper.insert(oi);
            orderItems.add(oi);
        }

        if (!"BUY_NOW".equals(req.getSource())) {
            for (CartItem ci : cartItems) {
                cartItemMapper.deleteById(ci.getId());
            }
        }

        OrderResponse response = new OrderResponse();
        response.setOrder(order);
        response.setItems(orderItems);
        response.setAddressSnapshot(parseAddressSnapshot(addressJson));
        return response;
    }

    public Map<String, Object> getOrders(Long userId, String status, int page, int pageSize) {
        LambdaQueryWrapper<MallOrder> wrapper = Wrappers.<MallOrder>lambdaQuery()
                .eq(MallOrder::getUserId, userId)
                .eq(MallOrder::getDeleted, false)
                .orderByDesc(MallOrder::getCreatedAt);
        if (status != null && !status.isBlank()) {
            wrapper.eq(MallOrder::getStatus, status);
        }
        Page<MallOrder> pg = orderMapper.selectPage(new Page<>(page, pageSize), wrapper);

        List<Map<String, Object>> list = buildOrderMaps(pg.getRecords());

        Map<String, Object> result = new HashMap<>();
        result.put("list", list);
        result.put("total", pg.getTotal());
        result.put("page", page);
        result.put("pageSize", pageSize);
        return result;
    }

    public OrderResponse getOrderDetail(Long userId, Long orderId) {
        MallOrder order = orderMapper.selectById(orderId);
        if (order == null || !order.getUserId().equals(userId) || Boolean.TRUE.equals(order.getDeleted())) {
            throw new BusinessException(400, "error.order.notFound");
        }
        return buildOrderResponse(order);
    }

    @Transactional
    public void cancelOrder(Long userId, Long orderId) {
        MallOrder order = orderMapper.selectById(orderId);
        if (order == null || !order.getUserId().equals(userId) || Boolean.TRUE.equals(order.getDeleted())) {
            throw new BusinessException(400, "error.order.notFound");
        }
        if (!"PENDING_PAYMENT".equals(order.getStatus())) {
            throw new BusinessException(400, "error.order.invalidStatus");
        }
        if (order.getUserCouponId() != null) {
            couponService.restoreCoupon(order.getUserCouponId());
        }
        order.setStatus("CANCELLED");
        order.setCancelledAt(LocalDateTime.now());
        order.setUpdatedAt(LocalDateTime.now());
        orderMapper.updateById(order);
    }

    @Transactional
    public Payment payOrder(Long userId, Long orderId, String method) {
        MallOrder order = orderMapper.selectById(orderId);
        if (order == null || !order.getUserId().equals(userId) || Boolean.TRUE.equals(order.getDeleted())) {
            throw new BusinessException(400, "error.order.notFound");
        }

        // 幂等 + 并发保护：只有处于待支付的订单才能被这一笔请求“领走”，否则视为已处理
        int claimed = orderMapper.update(null, com.baomidou.mybatisplus.core.toolkit.Wrappers.<MallOrder>lambdaUpdate()
                .set(MallOrder::getStatus, "PAID")
                .set(MallOrder::getPayStatus, "PAID")
                .set(MallOrder::getPaidAt, LocalDateTime.now())
                .set(MallOrder::getUpdatedAt, LocalDateTime.now())
                .eq(MallOrder::getId, orderId)
                .eq(MallOrder::getStatus, "PENDING_PAYMENT"));
        if (claimed == 0) {
            throw new BusinessException(400, "error.order.invalidStatus");
        }

        List<OrderItem> items = orderItemMapper.selectList(
                Wrappers.<OrderItem>lambdaQuery().eq(OrderItem::getOrderId, orderId));

        // 原子扣库存：任一不足则抛异常，整个事务回滚（含上面的领单），并发安全
        for (OrderItem oi : items) {
            Product product = productMapper.selectById(oi.getProductId());
            if (product == null || Boolean.TRUE.equals(product.getDeleted())) {
                throw new BusinessException(400, "商品已下架或删除");
            }
            deductStockForItem(product, oi.getQuantity());
        }

        // TODO: 这里是“模拟支付成功”。生产必须接入真实支付网关：创建支付单→跳转/回调→在回调中验签后才落 PAID。
        String paymentNo = "PAY" + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
        String transactionNo = "TXN" + System.currentTimeMillis();

        Payment payment = new Payment();
        payment.setPaymentNo(paymentNo);
        payment.setOrderId(orderId);
        payment.setUserId(userId);
        payment.setAmount(order.getPayAmount());
        payment.setCurrency(order.getCurrency());
        payment.setMethod(method);
        payment.setStatus("SUCCESS");
        payment.setTransactionNo(transactionNo);
        payment.setPaidAt(LocalDateTime.now());
        payment.setCreatedAt(LocalDateTime.now());
        payment.setUpdatedAt(LocalDateTime.now());
        paymentMapper.insert(payment);

        // 货款进入商家冻结余额（原子）
        if (order.getMerchantId() != null) {
            merchantMapper.addFrozenBalance(order.getMerchantId(), order.getPayAmount());
        }

        commissionService.createFrozenCommission(order);

        if (order.getMerchantId() != null) {
            String title = "Order #" + order.getOrderNo() + " has been paid";
            String notifyContent = "Customer paid " + order.getPayAmount() + " " + order.getCurrency() + " for Order #" + order.getOrderNo();
            notificationService.createMerchantNotification(order.getMerchantId(), title, notifyContent,
                    "ORDER_PAID", "order", order.getId());
        }

        return payment;
    }

    @Transactional
    public void confirmOrder(Long userId, Long orderId) {
        MallOrder order = orderMapper.selectById(orderId);
        if (order == null || !order.getUserId().equals(userId) || Boolean.TRUE.equals(order.getDeleted())) {
            throw new BusinessException(400, "error.order.notFound");
        }
        if (!"SHIPPED".equals(order.getStatus())) {
            throw new BusinessException(400, "error.order.invalidStatus");
        }
        order.setStatus("COMPLETED");
        order.setCompletedAt(LocalDateTime.now());
        order.setUpdatedAt(LocalDateTime.now());
        orderMapper.updateById(order);

        if (order.getMerchantId() != null) {
            merchantMapper.settleFrozenToBalance(order.getMerchantId(), order.getPayAmount());
        }

        // Settle commission
        commissionService.settleCommission(order.getId());
    }

    // ==================== MERCHANT METHODS ====================

    public Map<String, Object> getMerchantOrders(Long merchantId, String orderNo, String status, int page, int pageSize) {
        LambdaQueryWrapper<MallOrder> wrapper = Wrappers.<MallOrder>lambdaQuery()
                .eq(MallOrder::getMerchantId, merchantId)
                .eq(MallOrder::getDeleted, false)
                .orderByDesc(MallOrder::getCreatedAt);
        if (orderNo != null && !orderNo.isBlank()) {
            wrapper.like(MallOrder::getOrderNo, orderNo);
        }
        if (status != null && !status.isBlank()) {
            wrapper.eq(MallOrder::getStatus, status);
        }
        Page<MallOrder> pg = orderMapper.selectPage(new Page<>(page, pageSize), wrapper);

        List<Map<String, Object>> list = buildOrderMaps(pg.getRecords());

        Map<String, Object> result = new HashMap<>();
        result.put("list", list);
        result.put("total", pg.getTotal());
        result.put("page", page);
        result.put("pageSize", pageSize);
        return result;
    }

    public OrderResponse getMerchantOrderDetail(Long merchantId, Long orderId) {
        MallOrder order = orderMapper.selectById(orderId);
        if (order == null || !merchantId.equals(order.getMerchantId()) || Boolean.TRUE.equals(order.getDeleted())) {
            throw new BusinessException(400, "error.order.notFound");
        }
        return buildOrderResponse(order);
    }

    @Transactional
    public void shipOrder(Long merchantId, Long orderId, String logisticsCompany, String trackingNo) {
        MallOrder order = orderMapper.selectById(orderId);
        if (order == null || !merchantId.equals(order.getMerchantId()) || Boolean.TRUE.equals(order.getDeleted())) {
            throw new BusinessException(400, "error.order.notFound");
        }
        if (!"PAID".equals(order.getStatus())) {
            throw new BusinessException(400, "error.order.invalidStatus");
        }
        order.setStatus("SHIPPED");
        order.setLogisticsCompany(logisticsCompany);
        order.setTrackingNo(trackingNo);
        order.setShippedAt(LocalDateTime.now());
        order.setUpdatedAt(LocalDateTime.now());
        orderMapper.updateById(order);

        String title = "Order #" + order.getOrderNo() + " has been shipped";
        String notifyContent = "Your order has been shipped via " + logisticsCompany + ", tracking: " + trackingNo;
        notificationService.createNotification(order.getUserId(), "CUSTOMER", title, notifyContent,
                "ORDER_SHIPPED", "order", orderId);
    }

    /**
     * 商家垫付货款（双订单模型）：从商家可用余额扣除货款，标记已垫付并写入预计到货时间。
     * 仅对 order_source != CUSTOMER 的垫付单生效；真实客户单不走此流程。
     */
    @Transactional
    public void merchantPayGoods(Long merchantId, Long orderId, LocalDateTime expectedArrivalAt) {
        MallOrder order = orderMapper.selectById(orderId);
        if (order == null || !merchantId.equals(order.getMerchantId()) || Boolean.TRUE.equals(order.getDeleted())) {
            throw new BusinessException(400, "error.order.notFound");
        }
        if (!isMerchantAdvanceOrder(order)) {
            throw new BusinessException(400, "该订单不需要商家垫付货款");
        }
        if ("PAID".equals(order.getMerchantPaidStatus())) {
            throw new BusinessException(400, "货款已支付");
        }
        BigDecimal goodsCost = order.getGoodsCost() != null ? order.getGoodsCost() : BigDecimal.ZERO;
        if (goodsCost.compareTo(BigDecimal.ZERO) <= 0) {
            throw new BusinessException(400, "货款金额无效");
        }
        // 扣减商家可用余额（余额不足会抛出“可用余额不足”）并写资金流水
        merchantFundService.adjust(merchantId, goodsCost, false, "purchase_payment",
                "Pay goods cost for order #" + order.getOrderNo(), merchantId, "ORDER", order.getId());

        order.setMerchantPaidStatus("PAID");
        order.setMerchantPaidAt(LocalDateTime.now());
        order.setExpectedArrivalAt(expectedArrivalAt);
        order.setArrivalStatus("WAITING");
        order.setUpdatedAt(LocalDateTime.now());
        orderMapper.updateById(order);
    }

    private boolean isMerchantAdvanceOrder(MallOrder order) {
        return order.getOrderSource() != null && !"CUSTOMER".equals(order.getOrderSource());
    }

    // ==================== ADMIN METHODS ====================

    public Map<String, Object> getAllOrders(String orderNo, Long userId, Long merchantId, String status,
                                             int page, int pageSize) {
        LambdaQueryWrapper<MallOrder> wrapper = Wrappers.<MallOrder>lambdaQuery()
                .eq(MallOrder::getDeleted, false)
                .orderByDesc(MallOrder::getCreatedAt);
        if (orderNo != null && !orderNo.isBlank()) {
            wrapper.like(MallOrder::getOrderNo, orderNo);
        }
        if (userId != null) {
            wrapper.eq(MallOrder::getUserId, userId);
        }
        if (merchantId != null) {
            wrapper.eq(MallOrder::getMerchantId, merchantId);
        }
        if (status != null && !status.isBlank()) {
            wrapper.eq(MallOrder::getStatus, status);
        }
        Page<MallOrder> pg = orderMapper.selectPage(new Page<>(page, pageSize), wrapper);

        List<Map<String, Object>> list = buildOrderMaps(pg.getRecords());

        Map<String, Object> result = new HashMap<>();
        result.put("list", list);
        result.put("total", pg.getTotal());
        result.put("page", page);
        result.put("pageSize", pageSize);
        return result;
    }

    public OrderResponse getOrderDetailAdmin(Long orderId) {
        MallOrder order = orderMapper.selectById(orderId);
        if (order == null || Boolean.TRUE.equals(order.getDeleted())) {
            throw new BusinessException(400, "error.order.notFound");
        }
        return buildOrderResponse(order);
    }

    @Transactional
    public void updateOrderStatus(Long orderId, String status, String remark) {
        MallOrder order = orderMapper.selectById(orderId);
        if (order == null || Boolean.TRUE.equals(order.getDeleted())) {
            throw new BusinessException(400, "error.order.notFound");
        }

        String prevStatus = order.getStatus();

        boolean validTransition = switch (status) {
            case "PAID" -> "PENDING_PAYMENT".equals(order.getStatus());
            case "SHIPPED" -> "PAID".equals(order.getStatus());
            case "COMPLETED" -> "SHIPPED".equals(order.getStatus());
            case "CANCELLED" -> "PENDING_PAYMENT".equals(order.getStatus()) || "PAID".equals(order.getStatus());
            default -> false;
        };
        if (!validTransition) {
            throw new BusinessException(400, "error.order.invalidStatus");
        }

        order.setStatus(status);
        if (remark != null) {
            order.setRemark((order.getRemark() != null ? order.getRemark() : "") + "; admin: " + remark);
        }
        order.setUpdatedAt(LocalDateTime.now());

        switch (status) {
            case "CANCELLED" -> {
                order.setCancelledAt(LocalDateTime.now());
                if (order.getUserCouponId() != null) {
                    couponService.restoreCoupon(order.getUserCouponId());
                }
                // 已支付订单被取消：归还库存、回退商家冻结余额、作废佣金
                if ("PAID".equals(prevStatus)) {
                    restoreStockForOrder(order);
                    if (order.getMerchantId() != null) {
                        merchantMapper.reverseFrozenBalance(order.getMerchantId(), order.getPayAmount());
                    }
                    commissionService.cancelCommission(order.getId());
                }
            }
            case "COMPLETED" -> order.setCompletedAt(LocalDateTime.now());
        }
        orderMapper.updateById(order);
    }

    @Transactional
    public OrderResponse adminCreateOrder(Long adminId, Long customerId, Long merchantId,
                                           List<Map<String, Object>> items, Long addressId,
                                           boolean markAsPaid, String remark) {
        User customer = userMapper.selectById(customerId);
        if (customer == null || !"CUSTOMER".equals(customer.getRole())) {
            throw new BusinessException(400, "客户不存在或无效");
        }

        Merchant merchant = merchantMapper.selectById(merchantId);
        if (merchant == null || Boolean.TRUE.equals(merchant.getDeleted()) || !"ENABLE".equals(merchant.getStatus())) {
            throw new BusinessException(400, "商家不存在或无效");
        }

        if (markAsPaid) {
            BigDecimal totalAmount = BigDecimal.ZERO;
            List<OrderItem> orderItems = new ArrayList<>();

            String orderNo = generateOrderNo();
            BigDecimal shippingAmount = BigDecimal.ZERO;
            BigDecimal discountAmount = BigDecimal.ZERO;

            for (Map<String, Object> itemMap : items) {
                Long productId = readLong(itemMap.get("productId"));
                Long platformProductId = readLong(itemMap.get("platformProductId"));

                Product product = null;
                if (platformProductId != null) {
                    product = findMerchantListingByPlatformProduct(merchantId, platformProductId);
                } else if (productId != null) {
                    product = productMapper.selectById(productId);
                    // 前端历史版本曾把平台商品/上架记录 id 放在 productId 中。
                    // 如果不是该商家的商品，再按平台商品 id 尝试解析，避免误报“商品不属于指定商家”。
                    if (product == null || Boolean.TRUE.equals(product.getDeleted())
                            || product.getMerchantId() == null || !product.getMerchantId().equals(merchantId)) {
                        Product listing = findMerchantListingByPlatformProduct(merchantId, productId);
                        if (listing != null) {
                            product = listing;
                        }
                    }
                }

                if (product == null || Boolean.TRUE.equals(product.getDeleted())) {
                    throw new BusinessException(400, "商品不存在或未被该商家上架");
                }
                if (product.getMerchantId() == null || !product.getMerchantId().equals(merchantId)) {
                    throw new BusinessException(400, "商品不属于指定商家");
                }

                Object quantityValue = itemMap.get("quantity");
                if (!(quantityValue instanceof Number) || ((Number) quantityValue).intValue() <= 0) {
                    throw new BusinessException(400, "商品数量必须大于0");
                }
                int quantity = ((Number) quantityValue).intValue();
                productId = product.getId();

                BigDecimal price;
                if (product.getPlatformProductId() != null) {
                    PlatformProduct pp = platformProductMapper.selectById(product.getPlatformProductId());
                    if (pp == null || Boolean.TRUE.equals(pp.getDeleted()) || !"ENABLE".equals(pp.getStatus())) {
                        throw new BusinessException(400, "平台商品已下架: " + product.getId());
                    }
                    price = pp.getSalePrice();
                } else {
                    price = product.getPrice();
                }

                BigDecimal itemTotal = price.multiply(BigDecimal.valueOf(quantity));
                totalAmount = totalAmount.add(itemTotal);

                OrderItem oi = new OrderItem();
                oi.setProductId(productId);
                oi.setProductTitle(product.getTitle());
                oi.setProductImage(product.getCoverImage());
                oi.setPrice(price);
                oi.setQuantity(quantity);
                oi.setTotalAmount(itemTotal);
                oi.setCreatedAt(LocalDateTime.now());
                orderItems.add(oi);
            }

            MallOrder order = new MallOrder();
            order.setOrderNo(orderNo);
            order.setUserId(customerId);
            order.setMerchantId(merchantId);
            order.setTotalAmount(totalAmount);
            order.setDiscountAmount(discountAmount);
            order.setShippingAmount(shippingAmount);
            order.setPayAmount(totalAmount.subtract(discountAmount).add(shippingAmount));
            order.setCurrency(resolveMerchantCurrency(merchant));
            order.setStatus("PAID");
            order.setPayStatus("PAID");
            order.setRemark(remark);
            order.setReceiverName(customer.getNickname());
            order.setReceiverPhone(customer.getPhone());
            order.setRefundStatus("NONE");
            order.setOrderSource("ADMIN_CREATED");
            order.setCreatedByAdmin(adminId);
            order.setVirtualCustomerId(customer.getIsVirtual() != null && customer.getIsVirtual() ? customerId : null);
            // 双订单模型：管理员/虚拟单走商家垫付货款流程
            BigDecimal[] costProfit = computeGoodsCostAndProfit(orderItems);
            order.setGoodsCost(costProfit[0]);
            order.setMerchantProfit(costProfit[1]);
            order.setMerchantPaidStatus("UNPAID");
            order.setSettleStatus("NONE");
            order.setDeleted(false);
            order.setCreatedAt(LocalDateTime.now());
            order.setUpdatedAt(LocalDateTime.now());
            orderMapper.insert(order);

            for (OrderItem oi : orderItems) {
                oi.setOrderId(order.getId());
                orderItemMapper.insert(oi);
            }

            String paymentNo = "PAY" + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
            Payment payment = new Payment();
            payment.setPaymentNo(paymentNo);
            payment.setOrderId(order.getId());
            payment.setUserId(customerId);
            payment.setAmount(order.getPayAmount());
            payment.setCurrency(order.getCurrency());
            payment.setMethod("ADMIN");
            payment.setStatus("SUCCESS");
            payment.setPaidAt(LocalDateTime.now());
            payment.setCreatedAt(LocalDateTime.now());
            payment.setUpdatedAt(LocalDateTime.now());
            paymentMapper.insert(payment);

            for (OrderItem oi : orderItems) {
                Product product = productMapper.selectById(oi.getProductId());
                if (product == null) continue;
                deductStockForItem(product, oi.getQuantity());
            }

            // 垫付单不走客户付款经济模型：不冻结商家余额、不预生成佣金，
            // 货款由商家垫付、利润在总后台结算时返还。
            if (!isMerchantAdvanceOrder(order)) {
                if (merchantId != null) {
                    BigDecimal frozen = merchant.getFrozenBalance() != null ? merchant.getFrozenBalance() : BigDecimal.ZERO;
                    merchant.setFrozenBalance(frozen.add(order.getPayAmount()));
                    merchantMapper.updateById(merchant);
                }
                commissionService.createFrozenCommission(order);
            }

            if (merchantId != null) {
                String title = "Admin created Order #" + order.getOrderNo();
                notificationService.createMerchantNotification(merchantId, title,
                        "Admin created order for " + customer.getNickname() + ", amount: " + order.getPayAmount(),
                        "ORDER_CREATED", "order", order.getId());
            }

            realtimeService.sendToMerchant(merchantId, RealtimeService.RealtimeEvent.of("ORDER_CREATED",
                    "order", order.getId(), "管理员创建订单", "管理员为您创建了订单: " + order.getOrderNo(), null));

            OrderResponse response = new OrderResponse();
            response.setOrder(order);
            response.setItems(orderItems);
            response.setPayment(payment);
            return response;
        } else {
            throw new BusinessException(400, "暂不支持未支付的管理员创建订单");
        }
    }

    /**
     * 总后台结算：到货后把货款+利润返还商家可用余额。
     * 前置：该单为垫付单、商家已支付货款、尚未结算。
     */
    @Transactional
    public void setEstimatedArrival(Long orderId, LocalDateTime expectedArrivalAt) {
        MallOrder order = requireOrder(orderId);
        if (!isMerchantAdvanceOrder(order)) {
            throw new BusinessException(400, "Order does not require merchant advance payment");
        }
        if (!"PAID".equals(order.getMerchantPaidStatus())) {
            throw new BusinessException(400, "Merchant has not paid goods cost");
        }
        order.setExpectedArrivalAt(expectedArrivalAt);
        if (order.getArrivalStatus() == null) {
            order.setArrivalStatus("WAITING");
        }
        order.setUpdatedAt(LocalDateTime.now());
        orderMapper.updateById(order);
    }

    @Transactional
    public void markArrived(Long orderId) {
        MallOrder order = requireOrder(orderId);
        if (!isMerchantAdvanceOrder(order)) {
            throw new BusinessException(400, "Order does not require merchant advance payment");
        }
        if (!"PAID".equals(order.getMerchantPaidStatus())) {
            throw new BusinessException(400, "Merchant has not paid goods cost");
        }
        order.setArrivalStatus("ARRIVED");
        order.setArrivedAt(LocalDateTime.now());
        order.setUpdatedAt(LocalDateTime.now());
        orderMapper.updateById(order);
    }

    @Transactional
    public void settleToMerchant(Long orderId) {
        settleToMerchant(orderId, null, null);
    }

    @Transactional
    public void settleToMerchant(Long orderId, Long operatorId, String remark) {
        MallOrder order = orderMapper.selectById(orderId);
        if (order == null || Boolean.TRUE.equals(order.getDeleted())) {
            throw new BusinessException(400, "error.order.notFound");
        }
        if (!isMerchantAdvanceOrder(order)) {
            throw new BusinessException(400, "该订单不需要结算货款");
        }
        if (!"PAID".equals(order.getMerchantPaidStatus())) {
            throw new BusinessException(400, "商家尚未支付货款");
        }
        if ("SETTLED".equals(order.getSettleStatus())) {
            throw new BusinessException(400, "该订单已结算");
        }
        if (!"ARRIVED".equals(order.getArrivalStatus())) {
            throw new BusinessException(400, "Order has not arrived");
        }
        if (order.getMerchantId() == null) {
            throw new BusinessException(400, "订单未关联商家");
        }
        BigDecimal goodsCost = order.getGoodsCost() != null ? order.getGoodsCost() : BigDecimal.ZERO;
        BigDecimal profit = order.getMerchantProfit() != null ? order.getMerchantProfit() : BigDecimal.ZERO;
        BigDecimal payback = goodsCost.add(profit);
        if (payback.compareTo(BigDecimal.ZERO) > 0) {
            merchantFundService.adjust(order.getMerchantId(), payback, true, "order_settlement",
                    "Settle goods cost and profit for order #" + order.getOrderNo(), operatorId, "ORDER", order.getId());
        }
        order.setSettleStatus("SETTLED");
        order.setSettlementAmount(payback);
        order.setSettlementOperatorId(operatorId);
        order.setSettlementRemark(remark);
        order.setSettledAt(LocalDateTime.now());
        order.setUpdatedAt(LocalDateTime.now());
        orderMapper.updateById(order);

        OrderSettlementRecord record = new OrderSettlementRecord();
        record.setOrderId(order.getId());
        record.setMerchantId(order.getMerchantId());
        record.setGoodsCost(goodsCost);
        record.setMerchantProfit(profit);
        record.setSettlementAmount(payback);
        record.setStatus("SETTLED");
        record.setOperatorId(operatorId);
        record.setRemark(remark);
        record.setSettledAt(order.getSettledAt());
        record.setCreatedAt(LocalDateTime.now());
        record.setUpdatedAt(LocalDateTime.now());
        settlementRecordMapper.insert(record);

        String title = "Order #" + order.getOrderNo() + " settled";
        notificationService.createMerchantNotification(order.getMerchantId(), title,
                "货款+利润已结算到您的余额：" + payback + " " + order.getCurrency(),
                "ORDER_SETTLED", "order", order.getId());
    }

    public List<OrderSettlementRecord> getSettlementRecords(Long orderId) {
        return settlementRecordMapper.selectList(new LambdaQueryWrapper<OrderSettlementRecord>()
                .eq(OrderSettlementRecord::getOrderId, orderId)
                .orderByDesc(OrderSettlementRecord::getCreatedAt));
    }

    // ==================== HELPER METHODS ====================

    private MallOrder requireOrder(Long orderId) {
        MallOrder order = orderMapper.selectById(orderId);
        if (order == null || Boolean.TRUE.equals(order.getDeleted())) {
            throw new BusinessException(400, "error.order.notFound");
        }
        return order;
    }

    /** 根据订单明细计算货款（商家进货成本）与商家利润，来源于平台商品 merchant_price / sale_price。 */
    private BigDecimal[] computeGoodsCostAndProfit(List<OrderItem> items) {
        BigDecimal goodsCost = BigDecimal.ZERO;
        BigDecimal profit = BigDecimal.ZERO;
        for (OrderItem oi : items) {
            BigDecimal qty = BigDecimal.valueOf(oi.getQuantity());
            BigDecimal unitCost = null;
            BigDecimal unitSale = oi.getPrice();
            Product product = productMapper.selectById(oi.getProductId());
            if (product != null && product.getPlatformProductId() != null) {
                PlatformProduct pp = platformProductMapper.selectById(product.getPlatformProductId());
                if (pp != null) {
                    if (pp.getMerchantPrice() != null) unitCost = pp.getMerchantPrice();
                    if (pp.getSalePrice() != null) unitSale = pp.getSalePrice();
                }
            }
            if (unitCost == null) {
                // 无平台成本信息时，货款按售价计、利润为0（保守处理）
                unitCost = unitSale;
            }
            goodsCost = goodsCost.add(unitCost.multiply(qty));
            profit = profit.add(unitSale.subtract(unitCost).max(BigDecimal.ZERO).multiply(qty));
        }
        return new BigDecimal[]{goodsCost, profit};
    }

    private String generateOrderNo() {
        String ts = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmssSSS"));
        String rand = String.format("%04d", ThreadLocalRandom.current().nextInt(10000));
        return ts + rand;
    }

    private String buildAddressSnapshot(Address address) {
        Map<String, String> snapshot = new HashMap<>();
        snapshot.put("receiverName", address.getReceiverName());
        snapshot.put("receiverPhone", address.getReceiverPhone());
        snapshot.put("fullAddress", buildFullAddress(address));
        try {
            return objectMapper.writeValueAsString(snapshot);
        } catch (JsonProcessingException e) {
            return "{}";
        }
    }

    private String buildFullAddress(Address address) {
        StringBuilder sb = new StringBuilder();
        if (address.getCountry() != null) sb.append(address.getCountry());
        if (address.getProvince() != null) sb.append(address.getProvince());
        if (address.getCity() != null) sb.append(address.getCity());
        if (address.getDistrict() != null) sb.append(address.getDistrict());
        if (address.getDetail() != null) sb.append(address.getDetail());
        return sb.toString();
    }

    private Map<String, Object> parseAddressSnapshot(String json) {
        if (json == null) return new HashMap<>();
        try {
            return objectMapper.readValue(json, new TypeReference<Map<String, Object>>() {});
        } catch (JsonProcessingException e) {
            return new HashMap<>();
        }
    }

    private Product validateProduct(Long productId, Integer quantity) {
        Product product = productMapper.selectById(productId);
        if (product == null || Boolean.TRUE.equals(product.getDeleted())) {
            throw new BusinessException(400, "商品不存在");
        }
        if (!"APPROVED".equals(product.getAuditStatus())) {
            throw new BusinessException(400, "商品未通过审核");
        }

        if (product.getPlatformProductId() != null) {
            PlatformProduct pp = platformProductMapper.selectById(product.getPlatformProductId());
            if (pp == null || Boolean.TRUE.equals(pp.getDeleted()) || !"ENABLE".equals(pp.getStatus())) {
                throw new BusinessException(400, "平台商品已下架");
            }
            if (!"ON_SALE".equals(product.getListingStatus())) {
                throw new BusinessException(400, "商品已下架");
            }
            int availableStock = "PLATFORM_GLOBAL".equals(pp.getStockMode())
                    ? (pp.getGlobalStock() != null ? pp.getGlobalStock() : 0)
                    : (product.getMerchantStock() != null ? product.getMerchantStock() : 0);
            if (availableStock < quantity) {
                throw new BusinessException(400, "error.order.stockNotEnough");
            }
            product.setPrice(pp.getSalePrice());
        } else {
            if (!"ON_SALE".equals(product.getStatus())) {
                throw new BusinessException(400, "商品已下架");
            }
            if (product.getStock() < quantity) {
                throw new BusinessException(400, "error.order.stockNotEnough");
            }
        }
        return product;
    }

    private OrderResponse buildOrderResponse(MallOrder order) {
        LambdaQueryWrapper<OrderItem> itemWrapper = Wrappers.<OrderItem>lambdaQuery()
                .eq(OrderItem::getOrderId, order.getId());
        List<OrderItem> items = orderItemMapper.selectList(itemWrapper);

        LambdaQueryWrapper<Payment> payWrapper = Wrappers.<Payment>lambdaQuery()
                .eq(Payment::getOrderId, order.getId())
                .orderByDesc(Payment::getCreatedAt)
                .last("LIMIT 1");
        Payment payment = paymentMapper.selectOne(payWrapper);

        OrderResponse response = new OrderResponse();
        response.setOrder(order);
        response.setItems(items);
        response.setAddressSnapshot(parseAddressSnapshot(order.getAddressSnapshot()));
        response.setPayment(payment);
        return response;
    }

    private Map<String, Object> buildOrderBaseMap(MallOrder order) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", order.getId());
        map.put("orderNo", order.getOrderNo());
        map.put("userId", order.getUserId());
        map.put("merchantId", order.getMerchantId());
        map.put("totalAmount", order.getTotalAmount());
        map.put("discountAmount", order.getDiscountAmount());
        map.put("couponAmount", order.getCouponAmount());
        map.put("shippingAmount", order.getShippingAmount());
        map.put("payAmount", order.getPayAmount());
        map.put("currency", order.getCurrency());
        map.put("status", order.getStatus());
        map.put("payStatus", order.getPayStatus());
        map.put("remark", order.getRemark());
        map.put("logisticsCompany", order.getLogisticsCompany());
        map.put("trackingNo", order.getTrackingNo());
        map.put("receiverName", order.getReceiverName());
        map.put("receiverPhone", order.getReceiverPhone());
        map.put("receiverAddress", order.getReceiverAddress());
        map.put("paidAt", order.getPaidAt());
        map.put("shippedAt", order.getShippedAt());
        map.put("completedAt", order.getCompletedAt());
        map.put("cancelledAt", order.getCancelledAt());
        map.put("createdAt", order.getCreatedAt());
        map.put("couponId", order.getCouponId());
        map.put("userCouponId", order.getUserCouponId());
        map.put("refundStatus", order.getRefundStatus());
        map.put("refundAmount", order.getRefundAmount());
        map.put("refundedAt", order.getRefundedAt());
        map.put("orderSource", order.getOrderSource());
        map.put("goodsCost", order.getGoodsCost());
        map.put("merchantProfit", order.getMerchantProfit());
        map.put("merchantPaidStatus", order.getMerchantPaidStatus());
        map.put("merchantPaidAt", order.getMerchantPaidAt());
        map.put("expectedArrivalAt", order.getExpectedArrivalAt());
        map.put("arrivalStatus", order.getArrivalStatus());
        map.put("arrivedAt", order.getArrivedAt());
        map.put("settlementAmount", order.getSettlementAmount());
        map.put("settleStatus", order.getSettleStatus());
        map.put("settledAt", order.getSettledAt());
        map.put("settlementOperatorId", order.getSettlementOperatorId());
        map.put("settlementRemark", order.getSettlementRemark());
        return map;
    }

    private Map<String, Object> buildOrderMap(MallOrder order) {
        Map<String, Object> map = buildOrderBaseMap(order);
        map.put("items", orderItemMapper.selectList(
                Wrappers.<OrderItem>lambdaQuery().eq(OrderItem::getOrderId, order.getId())));
        return map;
    }

    private void deductStockForItem(Product product, int qty) {
        int rows;
        if (product.getPlatformProductId() != null) {
            PlatformProduct pp = platformProductMapper.selectById(product.getPlatformProductId());
            if (pp == null || Boolean.TRUE.equals(pp.getDeleted())) {
                throw new BusinessException(400, "平台商品已下架或删除");
            }
            if ("PLATFORM_GLOBAL".equals(pp.getStockMode())) {
                rows = platformProductMapper.deductGlobalStock(pp.getId(), qty);
                if (rows == 0) throw new BusinessException(400, "error.order.stockNotEnough");
                productMapper.increaseSales(product.getId(), qty);
            } else {
                rows = productMapper.deductMerchantStock(product.getId(), qty);
                if (rows == 0) throw new BusinessException(400, "error.order.stockNotEnough");
            }
        } else {
            rows = productMapper.deductStock(product.getId(), qty);
            if (rows == 0) throw new BusinessException(400, "error.order.stockNotEnough");
        }
    }

    private void restoreStockForOrder(MallOrder order) {
        List<OrderItem> items = orderItemMapper.selectList(
                Wrappers.<OrderItem>lambdaQuery().eq(OrderItem::getOrderId, order.getId()));
        for (OrderItem oi : items) {
            Product product = productMapper.selectById(oi.getProductId());
            if (product == null) continue;
            if (product.getPlatformProductId() != null) {
                PlatformProduct pp = platformProductMapper.selectById(product.getPlatformProductId());
                if (pp != null && "PLATFORM_GLOBAL".equals(pp.getStockMode())) {
                    platformProductMapper.restoreGlobalStock(pp.getId(), oi.getQuantity());
                    productMapper.decreaseSales(product.getId(), oi.getQuantity());
                } else {
                    productMapper.restoreMerchantStock(product.getId(), oi.getQuantity());
                }
            } else {
                productMapper.restoreStock(product.getId(), oi.getQuantity());
            }
        }
    }


    private Long readLong(Object value) {
        if (value == null || String.valueOf(value).isBlank()) {
            return null;
        }
        if (value instanceof Number n) {
            return n.longValue();
        }
        try {
            return Long.valueOf(String.valueOf(value));
        } catch (NumberFormatException e) {
            return null;
        }
    }

    private Product findMerchantListingByPlatformProduct(Long merchantId, Long platformProductId) {
        if (merchantId == null || platformProductId == null) {
            return null;
        }
        return productMapper.selectOne(Wrappers.<Product>lambdaQuery()
                .eq(Product::getMerchantId, merchantId)
                .eq(Product::getPlatformProductId, platformProductId)
                .eq(Product::getDeleted, false)
                .last("LIMIT 1"));
    }

    private String resolveMerchantCurrency(Merchant merchant) {
        if (merchant != null && merchant.getUserId() != null) {
            User merchantUser = userMapper.selectById(merchant.getUserId());
            if (merchantUser != null && merchantUser.getCountryCode() != null) {
                Country country = countryMapper.selectByCode(merchantUser.getCountryCode());
                if (country != null && country.getCurrencyCode() != null && !country.getCurrencyCode().isBlank()) {
                    return country.getCurrencyCode();
                }
            }
        }
        return "USD";
    }

    private String resolveCurrency(Long userId) {
        User user = userMapper.selectById(userId);
        if (user != null && user.getCountryCode() != null) {
            Country c = countryMapper.selectByCode(user.getCountryCode());
            if (c != null && c.getCurrencyCode() != null && !c.getCurrencyCode().isBlank()) {
                return c.getCurrencyCode();
            }
        }
        return "JPY";
    }

    // N+1 修复：一次 IN 查全部明细
    private List<Map<String, Object>> buildOrderMaps(List<MallOrder> orders) {
        List<Map<String, Object>> list = new ArrayList<>();
        if (orders == null || orders.isEmpty()) return list;
        List<Long> orderIds = orders.stream().map(MallOrder::getId).collect(Collectors.toList());
        Map<Long, List<OrderItem>> itemsByOrder = orderItemMapper.selectList(
                        Wrappers.<OrderItem>lambdaQuery().in(OrderItem::getOrderId, orderIds))
                .stream().collect(Collectors.groupingBy(OrderItem::getOrderId));
        for (MallOrder order : orders) {
            Map<String, Object> map = buildOrderBaseMap(order);
            map.put("items", itemsByOrder.getOrDefault(order.getId(), java.util.Collections.emptyList()));
            list.add(map);
        }
        return list;
    }
}
