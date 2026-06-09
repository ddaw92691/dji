package com.mall.api.modules.system.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.mall.api.common.enums.ResultCode;
import com.mall.api.common.exception.BusinessException;
import com.mall.api.common.response.ApiResponse;
import com.mall.api.modules.customer.entity.CustomerProfile;
import com.mall.api.modules.customer.mapper.CustomerProfileMapper;
import com.mall.api.modules.order.entity.MallOrder;
import com.mall.api.modules.order.mapper.MallOrderMapper;
import com.mall.api.modules.user.entity.User;
import com.mall.api.modules.user.mapper.UserMapper;
import com.mall.api.security.SecurityUtils;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.*;

@RestController
@RequestMapping("/api/admin/customers")
@Tag(name = "Admin 客户管理")
@PreAuthorize("hasAnyRole('SUPER_ADMIN','ADMIN')")
public class AdminCustomerController {

    private final UserMapper userMapper;
    private final CustomerProfileMapper customerProfileMapper;
    private final MallOrderMapper mallOrderMapper;

    public AdminCustomerController(UserMapper userMapper, CustomerProfileMapper customerProfileMapper,
                                   MallOrderMapper mallOrderMapper) {
        this.userMapper = userMapper;
        this.customerProfileMapper = customerProfileMapper;
        this.mallOrderMapper = mallOrderMapper;
    }

    @GetMapping
    @Operation(summary = "客户列表")
    public ApiResponse<Map<String, Object>> list(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Integer status,
            @RequestParam(required = false) String country,
            @RequestParam(required = false) Boolean isVirtual,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int pageSize) {
        LambdaQueryWrapper<User> qw = new LambdaQueryWrapper<>();
        qw.eq(User::getDeleted, false).eq(User::getRole, "CUSTOMER");
        if (keyword != null && !keyword.isEmpty()) {
            qw.and(w -> w.like(User::getUsername, keyword)
                    .or().like(User::getEmail, keyword)
                    .or().like(User::getPhone, keyword)
                    .or().like(User::getNickname, keyword));
        }
        if (status != null) {
            qw.eq(User::getStatus, status);
        }
        if (country != null && !country.isBlank()) {
            qw.eq(User::getCountryCode, country);
        }
        if (isVirtual != null) {
            qw.eq(User::getIsVirtual, isVirtual);
        }
        qw.orderByDesc(User::getCreatedAt);

        Page<User> pg = new Page<>(page, pageSize);
        pg = userMapper.selectPage(pg, qw);

        List<Map<String, Object>> enriched = new ArrayList<>();
        for (User user : pg.getRecords()) {
            Map<String, Object> item = new LinkedHashMap<>();
            item.put("id", user.getId());
            item.put("username", user.getUsername());
            item.put("email", user.getEmail());
            item.put("phone", user.getPhone());
            item.put("nickname", user.getNickname());
            item.put("avatar", user.getAvatar());
            item.put("status", user.getStatus());
            BigDecimal totalSpent = calculateTotalSpent(user.getId());
            item.put("balance", BigDecimal.ZERO);
            item.put("countryCode", user.getCountryCode());
            item.put("country", user.getCountryCode());
            item.put("languageCode", user.getLanguageCode());
            item.put("language", user.getLanguageCode());
            item.put("isVirtual", user.getIsVirtual());
            item.put("virtualRemark", user.getVirtualRemark());
            item.put("inviteCode", user.getInviteCode());
            item.put("invitedBy", user.getInvitedBy());
            item.put("createdAt", user.getCreatedAt());

            Long orderCount = mallOrderMapper.selectCount(
                    new LambdaQueryWrapper<com.mall.api.modules.order.entity.MallOrder>()
                            .eq(com.mall.api.modules.order.entity.MallOrder::getUserId, user.getId()));
            item.put("orderCount", orderCount);
            item.put("totalSpent", totalSpent);

            enriched.add(item);
        }

        return ApiResponse.success(Map.of(
                "list", enriched, "total", pg.getTotal(), "page", page, "pageSize", pageSize));
    }

    @GetMapping("/{id}")
    @Operation(summary = "客户详情")
    public ApiResponse<Map<String, Object>> detail(@PathVariable Long id) {
        User user = userMapper.selectById(id);
        if (user == null || Boolean.TRUE.equals(user.getDeleted())) {
            throw new BusinessException(ResultCode.NOT_FOUND.getCode(), "用户不存在");
        }

        CustomerProfile profile = customerProfileMapper.selectOne(
                new LambdaQueryWrapper<CustomerProfile>().eq(CustomerProfile::getUserId, id));

        Long orderCount = mallOrderMapper.selectCount(
                new LambdaQueryWrapper<com.mall.api.modules.order.entity.MallOrder>()
                        .eq(com.mall.api.modules.order.entity.MallOrder::getUserId, id));

        Map<String, Object> data = new LinkedHashMap<>();
        data.put("id", user.getId());
        data.put("username", user.getUsername());
        data.put("email", user.getEmail());
        data.put("phone", user.getPhone());
        data.put("nickname", user.getNickname());
        data.put("avatar", user.getAvatar());
        data.put("status", user.getStatus());
        data.put("country", user.getCountryCode());
        data.put("language", user.getLanguageCode());
        data.put("countryCode", user.getCountryCode());
        data.put("languageCode", user.getLanguageCode());
        data.put("isVirtual", user.getIsVirtual());
        data.put("virtualRemark", user.getVirtualRemark());
        data.put("createdAt", user.getCreatedAt());
        data.put("profile", profile);
        data.put("orderCount", orderCount);
        data.put("totalSpent", calculateTotalSpent(id));
        return ApiResponse.success(data);
    }

    private BigDecimal calculateTotalSpent(Long userId) {
        return mallOrderMapper.selectList(
                new LambdaQueryWrapper<MallOrder>()
                        .select(MallOrder::getPayAmount)
                        .eq(MallOrder::getUserId, userId)
                        .eq(MallOrder::getPayStatus, "PAID")
                        .eq(MallOrder::getDeleted, false)
        ).stream()
                .map(MallOrder::getPayAmount)
                .filter(Objects::nonNull)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    @PutMapping("/{id}")
    @Operation(summary = "编辑客户")
    public ApiResponse<Void> update(@PathVariable Long id, @RequestBody User body) {
        User user = userMapper.selectById(id);
        if (user == null || Boolean.TRUE.equals(user.getDeleted())) {
            throw new BusinessException(ResultCode.NOT_FOUND.getCode(), "用户不存在");
        }
        if (body.getEmail() != null) user.setEmail(body.getEmail());
        if (body.getPhone() != null) user.setPhone(body.getPhone());
        if (body.getNickname() != null) user.setNickname(body.getNickname());
        if (body.getAvatar() != null) user.setAvatar(body.getAvatar());
        if (body.getCountryCode() != null) user.setCountryCode(body.getCountryCode());
        if (body.getLanguageCode() != null) user.setLanguageCode(body.getLanguageCode());
        if (body.getIsVirtual() != null) user.setIsVirtual(body.getIsVirtual());
        if (body.getVirtualRemark() != null) user.setVirtualRemark(body.getVirtualRemark());
        if (body.getStatus() != null) user.setStatus(body.getStatus());
        userMapper.updateById(user);
        return ApiResponse.success();
    }

    @PutMapping("/{id}/status")
    @Operation(summary = "启用/禁用客户")
    public ApiResponse<Void> updateStatus(@PathVariable Long id, @RequestBody Map<String, Integer> body) {
        User user = userMapper.selectById(id);
        if (user == null || Boolean.TRUE.equals(user.getDeleted())) {
            throw new BusinessException(ResultCode.NOT_FOUND.getCode(), "用户不存在");
        }
        user.setStatus(body.get("status"));
        userMapper.updateById(user);
        return ApiResponse.success();
    }

    @PostMapping("/virtual")
    @Operation(summary = "创建虚拟客户")
    public ApiResponse<User> createVirtualCustomer(@RequestBody Map<String, Object> body) {
        String nickname = (String) body.getOrDefault("nickname", "Virtual Customer");
        String virtualRemark = (String) body.get("virtualRemark");
        String countryCode = (String) body.getOrDefault("countryCode", "US");
        String languageCode = (String) body.getOrDefault("languageCode", "en");

        String username = "virtual_" + System.currentTimeMillis();

        User user = new User();
        user.setUsername(username);
        user.setNickname(nickname);
        user.setRole("CUSTOMER");
        user.setStatus(0);
        user.setIsVirtual(true);
        user.setVirtualRemark(virtualRemark);
        user.setCountryCode(countryCode);
        user.setLanguageCode(languageCode);
        user.setCreatedByAdmin(SecurityUtils.getCurrentUserId());
        user.setDeleted(false);
        userMapper.insert(user);

        return ApiResponse.success(user);
    }
}
