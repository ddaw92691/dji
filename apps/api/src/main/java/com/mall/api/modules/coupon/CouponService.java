package com.mall.api.modules.coupon;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.mall.api.common.exception.BusinessException;
import com.mall.api.modules.coupon.entity.Coupon;
import com.mall.api.modules.coupon.entity.CouponTranslation;
import com.mall.api.modules.coupon.entity.UserCoupon;
import com.mall.api.modules.coupon.mapper.CouponMapper;
import com.mall.api.modules.coupon.mapper.CouponTranslationMapper;
import com.mall.api.modules.coupon.mapper.UserCouponMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class CouponService {

    private final CouponMapper couponMapper;
    private final CouponTranslationMapper couponTranslationMapper;
    private final UserCouponMapper userCouponMapper;

    public CouponService(CouponMapper couponMapper,
                         CouponTranslationMapper couponTranslationMapper,
                         UserCouponMapper userCouponMapper) {
        this.couponMapper = couponMapper;
        this.couponTranslationMapper = couponTranslationMapper;
        this.userCouponMapper = userCouponMapper;
    }

    public Map<String, Object> getAvailableCoupons(String countryCode, String languageCode, int page, int pageSize) {
        LocalDateTime now = LocalDateTime.now();
        LambdaQueryWrapper<Coupon> wrapper = Wrappers.<Coupon>lambdaQuery()
                .in(Coupon::getStatus, "ENABLE", "ACTIVE")
                .le(Coupon::getStartAt, now)
                .ge(Coupon::getEndAt, now)
                .eq(Coupon::getDeleted, false)
                .orderByDesc(Coupon::getCreatedAt);

        Page<Coupon> pg = couponMapper.selectPage(new Page<>(page, pageSize), wrapper);

        List<Map<String, Object>> list = new ArrayList<>();
        for (Coupon coupon : pg.getRecords()) {
            Map<String, Object> item = new HashMap<>();
            item.put("id", coupon.getId());
            item.put("name", coupon.getName());
            item.put("code", coupon.getCode());
            item.put("type", normalizeCouponType(coupon.getType()));
            item.put("amount", coupon.getAmount());
            item.put("discountRate", coupon.getDiscountRate());
            item.put("minSpend", coupon.getMinSpend());
            item.put("totalQuantity", coupon.getTotalQuantity());
            item.put("receivedQuantity", coupon.getReceivedQuantity());
            item.put("perUserLimit", coupon.getPerUserLimit());
            item.put("startAt", coupon.getStartAt());
            item.put("endAt", coupon.getEndAt());

            LambdaQueryWrapper<CouponTranslation> trWrapper = Wrappers.<CouponTranslation>lambdaQuery()
                    .eq(CouponTranslation::getCouponId, coupon.getId());

            List<CouponTranslation> translations = couponTranslationMapper.selectList(trWrapper);
            Map<String, String> translationMap = new HashMap<>();
            for (CouponTranslation t : translations) {
                String key = t.getLanguageCode() + "_" + t.getCountryCode();
                translationMap.put(key + "_name", t.getName());
                translationMap.put(key + "_description", t.getDescription());
            }
            item.put("translations", translationMap);

            if (countryCode != null && languageCode != null) {
                Optional<CouponTranslation> matched = translations.stream()
                        .filter(t -> languageCode.equals(t.getLanguageCode()))
                        .findFirst();
                if (matched.isPresent()) {
                    item.put("displayName", matched.get().getName());
                    item.put("displayDescription", matched.get().getDescription());
                }
            }

            list.add(item);
        }

        Map<String, Object> result = new HashMap<>();
        result.put("list", list);
        result.put("total", pg.getTotal());
        result.put("page", page);
        result.put("pageSize", pageSize);
        return result;
    }

    @Transactional
    public UserCoupon receiveCoupon(Long userId, Long couponId) {
        Coupon coupon = couponMapper.selectById(couponId);
        if (coupon == null || Boolean.TRUE.equals(coupon.getDeleted())) {
            throw new BusinessException(400, "优惠券不存在");
        }
        if (!isCouponEnabled(coupon.getStatus())) {
            throw new BusinessException(400, "优惠券已失效");
        }
        LocalDateTime now = LocalDateTime.now();
        if (now.isBefore(coupon.getStartAt()) || now.isAfter(coupon.getEndAt())) {
            throw new BusinessException(400, "不在优惠券有效期内");
        }
        if (coupon.getTotalQuantity() != null && coupon.getTotalQuantity() > 0
                && coupon.getReceivedQuantity() != null
                && coupon.getReceivedQuantity() >= coupon.getTotalQuantity()) {
            throw new BusinessException(400, "优惠券已被领完");
        }

        if (coupon.getPerUserLimit() != null && coupon.getPerUserLimit() > 0) {
            Long count = userCouponMapper.selectCount(
                    Wrappers.<UserCoupon>lambdaQuery()
                            .eq(UserCoupon::getUserId, userId)
                            .eq(UserCoupon::getCouponId, couponId));
            if (count >= coupon.getPerUserLimit()) {
                throw new BusinessException(400, "已达到领取上限");
            }
        }

        UserCoupon userCoupon = new UserCoupon();
        userCoupon.setUserId(userId);
        userCoupon.setCouponId(couponId);
        userCoupon.setStatus("UNUSED");
        userCoupon.setReceivedAt(now);
        userCoupon.setCreatedAt(now);
        userCoupon.setUpdatedAt(now);
        userCouponMapper.insert(userCoupon);

        coupon.setReceivedQuantity((coupon.getReceivedQuantity() != null ? coupon.getReceivedQuantity() : 0) + 1);
        coupon.setUpdatedAt(now);
        couponMapper.updateById(coupon);

        return userCoupon;
    }

    public Map<String, Object> getMyCoupons(Long userId, String status, int page, int pageSize) {
        LambdaQueryWrapper<UserCoupon> wrapper = Wrappers.<UserCoupon>lambdaQuery()
                .eq(UserCoupon::getUserId, userId)
                .orderByDesc(UserCoupon::getCreatedAt);
        if (status != null && !status.isBlank()) {
            wrapper.eq(UserCoupon::getStatus, status);
        }

        Page<UserCoupon> pg = userCouponMapper.selectPage(new Page<>(page, pageSize), wrapper);

        List<Map<String, Object>> list = new ArrayList<>();
        for (UserCoupon uc : pg.getRecords()) {
            Coupon coupon = couponMapper.selectById(uc.getCouponId());
            Map<String, Object> item = new HashMap<>();
            item.put("id", uc.getId());
            item.put("userId", uc.getUserId());
            item.put("couponId", uc.getCouponId());
            item.put("status", uc.getStatus());
            item.put("receivedAt", uc.getReceivedAt());
            item.put("usedAt", uc.getUsedAt());
            item.put("orderId", uc.getOrderId());
            if (coupon != null) {
                item.put("couponName", coupon.getName());
                item.put("couponType", normalizeCouponType(coupon.getType()));
                item.put("couponAmount", coupon.getAmount());
                item.put("couponDiscountRate", coupon.getDiscountRate());
                item.put("couponMinSpend", coupon.getMinSpend());
                item.put("couponEndAt", coupon.getEndAt());
                item.put("name", coupon.getName());
                item.put("code", coupon.getCode());
                item.put("type", normalizeCouponType(coupon.getType()));
                item.put("amount", coupon.getAmount());
                item.put("discountRate", coupon.getDiscountRate());
                item.put("minSpend", coupon.getMinSpend());
                item.put("endAt", coupon.getEndAt());
            }
            list.add(item);
        }

        Map<String, Object> result = new HashMap<>();
        result.put("list", list);
        result.put("total", pg.getTotal());
        result.put("page", page);
        result.put("pageSize", pageSize);
        return result;
    }

    public List<Map<String, Object>> getUsableCoupons(Long userId, BigDecimal orderAmount) {
        LocalDateTime now = LocalDateTime.now();
        LambdaQueryWrapper<UserCoupon> wrapper = Wrappers.<UserCoupon>lambdaQuery()
                .eq(UserCoupon::getUserId, userId)
                .eq(UserCoupon::getStatus, "UNUSED")
                .orderByDesc(UserCoupon::getCreatedAt);

        List<UserCoupon> userCoupons = userCouponMapper.selectList(wrapper);

        List<Map<String, Object>> list = new ArrayList<>();
        for (UserCoupon uc : userCoupons) {
            Coupon coupon = couponMapper.selectById(uc.getCouponId());
            if (coupon == null || Boolean.TRUE.equals(coupon.getDeleted())
                    || !isCouponEnabled(coupon.getStatus())
                    || now.isBefore(coupon.getStartAt()) || now.isAfter(coupon.getEndAt())) {
                continue;
            }
            if (coupon.getMinSpend() != null
                    && orderAmount.compareTo(coupon.getMinSpend()) < 0) {
                continue;
            }

            BigDecimal discountAmount = calculateDiscount(coupon, orderAmount);

            Map<String, Object> item = new HashMap<>();
            item.put("userCouponId", uc.getId());
            item.put("couponId", coupon.getId());
            item.put("name", coupon.getName());
            item.put("code", coupon.getCode());
            item.put("type", normalizeCouponType(coupon.getType()));
            item.put("amount", coupon.getAmount());
            item.put("discountRate", coupon.getDiscountRate());
            item.put("minSpend", coupon.getMinSpend());
            item.put("endAt", coupon.getEndAt());
            item.put("discountAmount", discountAmount);
            list.add(item);
        }

        return list;
    }

    private BigDecimal calculateDiscount(Coupon coupon, BigDecimal orderAmount) {
        String type = normalizeCouponType(coupon.getType());
        if ("FIXED_AMOUNT".equals(type)) {
            return coupon.getAmount() != null ? coupon.getAmount().min(orderAmount) : BigDecimal.ZERO;
        } else if ("PERCENTAGE".equals(type)) {
            if (coupon.getDiscountRate() != null) {
                return orderAmount.multiply(coupon.getDiscountRate())
                        .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP)
                        .setScale(2, RoundingMode.HALF_UP);
            }
        }
        return BigDecimal.ZERO;
    }

    @Transactional
    public void useCouponInOrder(Long userId, Long userCouponId, Long orderId) {
        UserCoupon userCoupon = userCouponMapper.selectById(userCouponId);
        if (userCoupon == null || !userCoupon.getUserId().equals(userId)) {
            throw new BusinessException(400, "优惠券不可用");
        }
        LocalDateTime now = LocalDateTime.now();
        // 原子核销：仅 UNUSED 可被占用，防并发重复使用
        int used = userCouponMapper.update(null, Wrappers.<UserCoupon>lambdaUpdate()
                .set(UserCoupon::getStatus, "USED")
                .set(UserCoupon::getUsedAt, now)
                .set(UserCoupon::getOrderId, orderId)
                .set(UserCoupon::getUpdatedAt, now)
                .eq(UserCoupon::getId, userCouponId)
                .eq(UserCoupon::getStatus, "UNUSED"));
        if (used == 0) {
            throw new BusinessException(400, "优惠券不可用");
        }
        Coupon coupon = couponMapper.selectById(userCoupon.getCouponId());
        if (coupon != null) {
            coupon.setUsedQuantity((coupon.getUsedQuantity() != null ? coupon.getUsedQuantity() : 0) + 1);
            coupon.setUpdatedAt(now);
            couponMapper.updateById(coupon);
        }
    }

    public BigDecimal calculateCouponAmount(Long userId, Long userCouponId, BigDecimal orderAmount) {
        if (userCouponId == null) return BigDecimal.ZERO;
        UserCoupon userCoupon = userCouponMapper.selectById(userCouponId);
        if (userCoupon == null || !userCoupon.getUserId().equals(userId)
                || !"UNUSED".equals(userCoupon.getStatus())) {
            throw new BusinessException(400, "优惠券不可用");
        }
        Coupon coupon = couponMapper.selectById(userCoupon.getCouponId());
        if (coupon == null || Boolean.TRUE.equals(coupon.getDeleted())
                || !isCouponEnabled(coupon.getStatus())) {
            throw new BusinessException(400, "优惠券不存在或已失效");
        }
        LocalDateTime now = LocalDateTime.now();
        if (now.isBefore(coupon.getStartAt()) || now.isAfter(coupon.getEndAt())) {
            throw new BusinessException(400, "优惠券已过期");
        }
        if (coupon.getMinSpend() != null && orderAmount.compareTo(coupon.getMinSpend()) < 0) {
            throw new BusinessException(400, "未达到最低消费金额");
        }
        return calculateDiscount(coupon, orderAmount);
    }

    @Transactional
    public void restoreCoupon(Long userCouponId) {
        if (userCouponId == null) return;
        UserCoupon userCoupon = userCouponMapper.selectById(userCouponId);
        if (userCoupon == null || !"USED".equals(userCoupon.getStatus())) return;

        Coupon coupon = couponMapper.selectById(userCoupon.getCouponId());
        LocalDateTime now = LocalDateTime.now();
        userCoupon.setStatus("UNUSED");
        userCoupon.setOrderId(null);
        userCoupon.setUsedAt(null);
        userCoupon.setUpdatedAt(now);
        userCouponMapper.updateById(userCoupon);

        if (coupon != null) {
            coupon.setUsedQuantity(Math.max(0, (coupon.getUsedQuantity() != null ? coupon.getUsedQuantity() : 1) - 1));
            coupon.setUpdatedAt(now);
            couponMapper.updateById(coupon);
        }
    }

    public Map<String, Object> getCouponsAdmin(String keyword, String type, String status, int page, int pageSize) {
        LambdaQueryWrapper<Coupon> wrapper = Wrappers.<Coupon>lambdaQuery()
                .eq(Coupon::getDeleted, false)
                .orderByDesc(Coupon::getCreatedAt);
        if (keyword != null && !keyword.isBlank()) {
            wrapper.and(w -> w.like(Coupon::getName, keyword).or().like(Coupon::getCode, keyword));
        }
        if (type != null && !type.isBlank()) {
            wrapper.in(Coupon::getType, couponTypeCandidates(type));
        }
        if (status != null && !status.isBlank()) {
            wrapper.in(Coupon::getStatus, couponStatusCandidates(status));
        }
        Page<Coupon> pg = couponMapper.selectPage(new Page<>(page, pageSize), wrapper);
        pg.getRecords().forEach(c -> {
            c.setStatus(normalizeCouponStatus(c.getStatus()));
            c.setType(normalizeCouponType(c.getType()));
        });

        Map<String, Object> result = new HashMap<>();
        result.put("list", pg.getRecords());
        result.put("total", pg.getTotal());
        result.put("page", page);
        result.put("pageSize", pageSize);
        return result;
    }

    @Transactional
    public Coupon createCoupon(Coupon coupon, List<Map<String, String>> translations) {
        LocalDateTime now = LocalDateTime.now();
        coupon.setReceivedQuantity(0);
        coupon.setUsedQuantity(0);
        coupon.setDeleted(false);
        coupon.setCreatedAt(now);
        coupon.setUpdatedAt(now);
        coupon.setType(normalizeCouponType(coupon.getType()));
        if (coupon.getStatus() == null) {
            coupon.setStatus("ENABLE");
        } else {
            coupon.setStatus(normalizeCouponStatus(coupon.getStatus()));
        }
        couponMapper.insert(coupon);

        if (translations != null) {
            for (Map<String, String> tr : translations) {
                CouponTranslation ct = new CouponTranslation();
                ct.setCouponId(coupon.getId());
                ct.setLanguageCode(tr.get("languageCode"));
                ct.setCountryCode(tr.get("countryCode"));
                ct.setName(tr.get("name"));
                ct.setDescription(tr.get("description"));
                ct.setCreatedAt(now);
                ct.setUpdatedAt(now);
                couponTranslationMapper.insert(ct);
            }
        }

        return coupon;
    }

    @Transactional
    public void updateCoupon(Long id, Coupon coupon) {
        Coupon existing = couponMapper.selectById(id);
        if (existing == null || Boolean.TRUE.equals(existing.getDeleted())) {
            throw new BusinessException(400, "优惠券不存在");
        }
        coupon.setId(id);
        if (coupon.getType() != null) {
            coupon.setType(normalizeCouponType(coupon.getType()));
        }
        if (coupon.getStatus() != null) {
            coupon.setStatus(normalizeCouponStatus(coupon.getStatus()));
        }
        coupon.setUpdatedAt(LocalDateTime.now());
        couponMapper.updateById(coupon);
    }

    @Transactional
    public void updateCouponStatus(Long id, String status) {
        Coupon coupon = couponMapper.selectById(id);
        if (coupon == null || Boolean.TRUE.equals(coupon.getDeleted())) {
            throw new BusinessException(400, "优惠券不存在");
        }
        coupon.setStatus(normalizeCouponStatus(status));
        coupon.setUpdatedAt(LocalDateTime.now());
        couponMapper.updateById(coupon);
    }

    @Transactional
    public void deleteCoupon(Long id) {
        Coupon coupon = couponMapper.selectById(id);
        if (coupon == null || Boolean.TRUE.equals(coupon.getDeleted())) {
            throw new BusinessException(400, "优惠券不存在");
        }
        coupon.setDeleted(true);
        coupon.setUpdatedAt(LocalDateTime.now());
        couponMapper.updateById(coupon);
    }

    public Map<String, Object> getCouponRecords(Long couponId, int page, int pageSize) {
        LambdaQueryWrapper<UserCoupon> wrapper = Wrappers.<UserCoupon>lambdaQuery()
                .eq(UserCoupon::getCouponId, couponId)
                .orderByDesc(UserCoupon::getCreatedAt);
        Page<UserCoupon> pg = userCouponMapper.selectPage(new Page<>(page, pageSize), wrapper);

        Map<String, Object> result = new HashMap<>();
        result.put("list", pg.getRecords());
        result.put("total", pg.getTotal());
        result.put("page", page);
        result.put("pageSize", pageSize);
        return result;
    }

    private boolean isCouponEnabled(String status) {
        return "ENABLE".equalsIgnoreCase(status) || "ACTIVE".equalsIgnoreCase(status);
    }

    private String normalizeCouponStatus(String status) {
        if ("ACTIVE".equalsIgnoreCase(status)) {
            return "ENABLE";
        }
        if ("DISABLED".equalsIgnoreCase(status)) {
            return "DISABLE";
        }
        return status;
    }

    private List<String> couponStatusCandidates(String status) {
        String normalized = normalizeCouponStatus(status);
        if ("ENABLE".equalsIgnoreCase(normalized)) {
            return List.of("ENABLE", "ACTIVE");
        }
        if ("DISABLE".equalsIgnoreCase(normalized)) {
            return List.of("DISABLE", "DISABLED");
        }
        return List.of(status);
    }

    private String normalizeCouponType(String type) {
        if ("AMOUNT".equalsIgnoreCase(type) || "FULL_REDUCTION".equalsIgnoreCase(type) || "CASH".equalsIgnoreCase(type)) {
            return "FIXED_AMOUNT";
        }
        if ("PERCENT".equalsIgnoreCase(type) || "DISCOUNT".equalsIgnoreCase(type)) {
            return "PERCENTAGE";
        }
        return type;
    }

    private List<String> couponTypeCandidates(String type) {
        String normalized = normalizeCouponType(type);
        if ("FIXED_AMOUNT".equalsIgnoreCase(normalized)) {
            return List.of("FIXED_AMOUNT", "AMOUNT", "FULL_REDUCTION", "CASH");
        }
        if ("PERCENTAGE".equalsIgnoreCase(normalized)) {
            return List.of("PERCENTAGE", "PERCENT", "DISCOUNT");
        }
        return List.of(type);
    }
}
