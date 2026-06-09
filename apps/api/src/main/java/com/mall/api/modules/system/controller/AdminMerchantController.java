package com.mall.api.modules.system.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.mall.api.common.enums.ResultCode;
import com.mall.api.common.exception.BusinessException;
import com.mall.api.common.response.ApiResponse;
import com.mall.api.modules.merchant.entity.Merchant;
import com.mall.api.modules.merchant.mapper.MerchantMapper;
import com.mall.api.modules.system.entity.SysRole;
import com.mall.api.modules.system.entity.SysUserRole;
import com.mall.api.modules.system.mapper.SysRoleMapper;
import com.mall.api.modules.system.mapper.SysUserRoleMapper;
import com.mall.api.modules.user.entity.User;
import com.mall.api.modules.user.mapper.UserMapper;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/admin/merchants")
@Tag(name = "Admin 商家管理")
@PreAuthorize("hasAnyRole('SUPER_ADMIN','ADMIN')")
public class AdminMerchantController {

    private final UserMapper userMapper;
    private final MerchantMapper merchantMapper;
    private final PasswordEncoder passwordEncoder;
    private final SysRoleMapper sysRoleMapper;
    private final SysUserRoleMapper sysUserRoleMapper;

    public AdminMerchantController(UserMapper userMapper, MerchantMapper merchantMapper,
                                   PasswordEncoder passwordEncoder, SysRoleMapper sysRoleMapper,
                                   SysUserRoleMapper sysUserRoleMapper) {
        this.userMapper = userMapper;
        this.merchantMapper = merchantMapper;
        this.passwordEncoder = passwordEncoder;
        this.sysRoleMapper = sysRoleMapper;
        this.sysUserRoleMapper = sysUserRoleMapper;
    }

    @GetMapping
    @Operation(summary = "商家列表")
    public ApiResponse<Map<String, Object>> list(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Long merchantId,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int pageSize) {
        LambdaQueryWrapper<Merchant> qw = new LambdaQueryWrapper<>();
        qw.eq(Merchant::getDeleted, false);
        if (merchantId != null) {
            qw.eq(Merchant::getId, merchantId);
        }
        if (status != null && !status.isBlank()) {
            qw.eq(Merchant::getStatus, status);
        }
        if (keyword != null && !keyword.isBlank()) {
            qw.like(Merchant::getShopName, keyword);
        }
        qw.orderByDesc(Merchant::getCreatedAt);

        Page<Merchant> pg = new Page<>(page, pageSize);
        pg = merchantMapper.selectPage(pg, qw);

        List<Map<String, Object>> enriched = new ArrayList<>();
        for (Merchant m : pg.getRecords()) {
            Map<String, Object> item = new LinkedHashMap<>();
            item.put("id", m.getId());
            item.put("merchantId", m.getId());
            item.put("userId", m.getUserId());
            item.put("shopName", m.getShopName());
            item.put("shopLogo", m.getShopLogo());
            item.put("shopDesc", m.getShopDesc());
            item.put("balance", m.getBalance());
            item.put("frozenBalance", m.getFrozenBalance());
            item.put("totalSales", m.getTotalSales());
            item.put("totalWithdrawn", m.getTotalWithdrawn());
            item.put("status", m.getStatus());
            item.put("createdAt", m.getCreatedAt());

            if (m.getUserId() != null) {
                User user = userMapper.selectById(m.getUserId());
                if (user != null) {
                    item.put("email", user.getEmail());
                    item.put("phone", user.getPhone());
                    item.put("nickname", user.getNickname());
                    item.put("userStatus", user.getStatus());
                }
            }
            enriched.add(item);
        }

        return ApiResponse.success(Map.of(
                "list", enriched, "total", pg.getTotal(), "page", page, "pageSize", pageSize));
    }

    @PostMapping
    @Operation(summary = "创建商家")
    @Transactional
    public ApiResponse<Map<String, Object>> create(@RequestBody Map<String, Object> body) {
        String email = (String) body.get("email");
        String password = (String) body.get("password");
        String shopName = (String) body.get("shopName");

        if (email == null || email.isEmpty()) {
            throw new BusinessException(ResultCode.BAD_REQUEST.getCode(), "邮箱不能为空");
        }
        if (password == null || password.isEmpty()) {
            throw new BusinessException(ResultCode.BAD_REQUEST.getCode(), "密码不能为空");
        }
        if (shopName == null || shopName.isEmpty()) {
            throw new BusinessException(ResultCode.BAD_REQUEST.getCode(), "店铺名称不能为空");
        }

        User exist = userMapper.selectByEmail(email);
        if (exist != null) {
            throw new BusinessException(ResultCode.BAD_REQUEST.getCode(), "邮箱已存在");
        }

        User user = new User();
        user.setUsername(email);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        user.setNickname(shopName);
        user.setRole("MERCHANT");
        user.setStatus(1);
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());
        userMapper.insert(user);

        Merchant merchant = new Merchant();
        merchant.setUserId(user.getId());
        merchant.setShopName(shopName);
        merchant.setBalance(BigDecimal.ZERO);
        merchant.setFrozenBalance(BigDecimal.ZERO);
        merchant.setTotalSales(BigDecimal.ZERO);
        merchant.setTotalWithdrawn(BigDecimal.ZERO);
        merchant.setStatus("ENABLE");
        merchant.setDeleted(false);
        merchant.setCreatedAt(LocalDateTime.now());
        merchant.setUpdatedAt(LocalDateTime.now());
        merchantMapper.insert(merchant);

        SysRole role = sysRoleMapper.selectOne(
                new LambdaQueryWrapper<SysRole>().eq(SysRole::getCode, "MERCHANT"));
        if (role != null) {
            SysUserRole userRole = new SysUserRole();
            userRole.setUserId(user.getId());
            userRole.setRoleId(role.getId());
            userRole.setCreatedAt(LocalDateTime.now());
            sysUserRoleMapper.insert(userRole);
        }

        return ApiResponse.success(Map.of("userId", user.getId(), "merchantId", merchant.getId()));
    }

    @PutMapping("/{id}")
    @Operation(summary = "编辑商家")
    public ApiResponse<Void> update(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        Merchant merchant = merchantMapper.selectById(id);
        if (merchant == null || Boolean.TRUE.equals(merchant.getDeleted())) {
            throw new BusinessException(ResultCode.NOT_FOUND.getCode(), "商家不存在");
        }
        if (body.containsKey("shopName")) merchant.setShopName((String) body.get("shopName"));
        if (body.containsKey("shopLogo")) merchant.setShopLogo((String) body.get("shopLogo"));
        if (body.containsKey("shopDesc")) merchant.setShopDesc((String) body.get("shopDesc"));
        merchant.setUpdatedAt(LocalDateTime.now());
        merchantMapper.updateById(merchant);

        if (merchant.getUserId() != null) {
            User user = userMapper.selectById(merchant.getUserId());
            if (user != null) {
                if (body.containsKey("email")) user.setEmail((String) body.get("email"));
                if (body.containsKey("phone")) user.setPhone((String) body.get("phone"));
                if (body.containsKey("nickname")) user.setNickname((String) body.get("nickname"));
                if (body.containsKey("status")) user.setStatus((Integer) body.get("status"));
                userMapper.updateById(user);
            }
        }
        return ApiResponse.success();
    }

    @PutMapping("/{id}/status")
    @Operation(summary = "启用/禁用商家")
    public ApiResponse<Void> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        Merchant merchant = merchantMapper.selectById(id);
        if (merchant == null || Boolean.TRUE.equals(merchant.getDeleted())) {
            throw new BusinessException(ResultCode.NOT_FOUND.getCode(), "商家不存在");
        }
        merchant.setStatus(body.get("status"));
        merchant.setUpdatedAt(LocalDateTime.now());
        merchantMapper.updateById(merchant);

        if (merchant.getUserId() != null) {
            User user = userMapper.selectById(merchant.getUserId());
            if (user != null) {
                user.setStatus("DISABLE".equals(body.get("status")) ? 0 : 1);
                userMapper.updateById(user);
            }
        }
        return ApiResponse.success();
    }
}
