package com.mall.api.modules.system.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.mall.api.common.enums.ResultCode;
import com.mall.api.common.exception.BusinessException;
import com.mall.api.common.response.ApiResponse;
import com.mall.api.modules.country.entity.Country;
import com.mall.api.modules.country.mapper.CountryMapper;
import com.mall.api.modules.language.entity.Language;
import com.mall.api.modules.language.mapper.LanguageMapper;
import com.mall.api.modules.log.annotation.Audit;
import com.mall.api.modules.merchant.entity.Merchant;
import com.mall.api.modules.merchant.entity.MerchantFundLog;
import com.mall.api.modules.merchant.entity.WithdrawAccount;
import com.mall.api.modules.merchant.mapper.MerchantMapper;
import com.mall.api.modules.merchant.mapper.WithdrawAccountMapper;
import com.mall.api.modules.merchant.service.MerchantFundService;
import com.mall.api.modules.system.entity.SysRole;
import com.mall.api.modules.system.entity.SysUserRole;
import com.mall.api.modules.system.mapper.SysRoleMapper;
import com.mall.api.modules.system.mapper.SysUserRoleMapper;
import com.mall.api.modules.user.entity.User;
import com.mall.api.modules.user.mapper.UserMapper;
import com.mall.api.security.SecurityUtils;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping({"/api/admin/merchants", "/api/v1/admin/merchants"})
@Tag(name = "Admin 商家管理")
@PreAuthorize("hasAnyRole('SUPER_ADMIN','ADMIN')")
public class AdminMerchantController {

    private final UserMapper userMapper;
    private final MerchantMapper merchantMapper;
    private final PasswordEncoder passwordEncoder;
    private final SysRoleMapper sysRoleMapper;
    private final SysUserRoleMapper sysUserRoleMapper;
    private final MerchantFundService merchantFundService;
    private final WithdrawAccountMapper withdrawAccountMapper;
    private final CountryMapper countryMapper;
    private final LanguageMapper languageMapper;

    public AdminMerchantController(UserMapper userMapper, MerchantMapper merchantMapper,
                                   PasswordEncoder passwordEncoder, SysRoleMapper sysRoleMapper,
                                   SysUserRoleMapper sysUserRoleMapper,
                                   MerchantFundService merchantFundService,
                                   WithdrawAccountMapper withdrawAccountMapper,
                                   CountryMapper countryMapper,
                                   LanguageMapper languageMapper) {
        this.userMapper = userMapper;
        this.merchantMapper = merchantMapper;
        this.passwordEncoder = passwordEncoder;
        this.sysRoleMapper = sysRoleMapper;
        this.sysUserRoleMapper = sysUserRoleMapper;
        this.merchantFundService = merchantFundService;
        this.withdrawAccountMapper = withdrawAccountMapper;
        this.countryMapper = countryMapper;
        this.languageMapper = languageMapper;
    }

    @GetMapping
    @Operation(summary = "商家列表")
    @PreAuthorize("@perm.has('admin:user:merchant:view')")
    public ApiResponse<Map<String, Object>> list(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Long merchantId,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String country,
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
                    item.put("countryCode", user.getCountryCode());
                    item.put("country", user.getCountryCode());
                    item.put("languageCode", user.getLanguageCode());
                    item.put("language", user.getLanguageCode());
                    Country countryInfo = user.getCountryCode() == null ? null : countryMapper.selectByCode(user.getCountryCode());
                    if (countryInfo != null) {
                        item.put("countryName", countryInfo.getName());
                        item.put("currencyCode", countryInfo.getCurrencyCode());
                        item.put("currencySymbol", countryInfo.getCurrencySymbol());
                        item.put("exchangeRate", countryInfo.getExchangeRate());
                    }
                    Language languageInfo = user.getLanguageCode() == null ? null : languageMapper.selectByCode(user.getLanguageCode());
                    if (languageInfo != null) {
                        item.put("languageName", languageInfo.getName());
                        item.put("languageNativeName", languageInfo.getNativeName());
                    }
                }
            }
            enriched.add(item);
        }

        return ApiResponse.success(Map.of(
                "list", enriched, "total", pg.getTotal(), "page", page, "pageSize", pageSize));
    }

    @PostMapping
    @Operation(summary = "创建商家")
    @PreAuthorize("@perm.has('admin:user:merchant:add')")
    @Transactional
    public ApiResponse<Map<String, Object>> create(@RequestBody Map<String, Object> body) {
        String email = (String) body.get("email");
        String password = (String) body.get("password");
        String shopName = (String) body.get("shopName");
        String countryCode = normalizeCode(text(body, "countryCode", "country"), true);
        String languageCode = normalizeCode(text(body, "languageCode", "language"), false);

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

        Country countryInfo = countryCode == null ? null : countryMapper.selectByCode(countryCode);
        if (countryCode != null && countryInfo == null) {
            throw new BusinessException(ResultCode.BAD_REQUEST.getCode(), "国家不存在或未启用");
        }
        if (languageCode != null && languageMapper.selectByCode(languageCode) == null) {
            throw new BusinessException(ResultCode.BAD_REQUEST.getCode(), "语言不存在或未启用");
        }

        User user = new User();
        user.setUsername(email);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        user.setNickname(shopName);
        user.setRole("MERCHANT");
        user.setStatus(1);
        user.setCountryCode(countryCode);
        user.setLanguageCode(languageCode != null ? languageCode : (countryInfo == null ? null : countryInfo.getDefaultLanguageCode()));
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
    @PreAuthorize("@perm.has('admin:user:merchant:edit')")
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
                String countryCode = normalizeCode(text(body, "countryCode", "country"), true);
                String languageCode = normalizeCode(text(body, "languageCode", "language"), false);
                if (countryCode != null) {
                    if (countryMapper.selectByCode(countryCode) == null) {
                        throw new BusinessException(ResultCode.BAD_REQUEST.getCode(), "国家不存在或未启用");
                    }
                    user.setCountryCode(countryCode);
                }
                if (languageCode != null) {
                    if (languageMapper.selectByCode(languageCode) == null) {
                        throw new BusinessException(ResultCode.BAD_REQUEST.getCode(), "语言不存在或未启用");
                    }
                    user.setLanguageCode(languageCode);
                }
                if (body.containsKey("status")) user.setStatus(toIntStatus(body.get("status")));
                userMapper.updateById(user);
            }
        }
        return ApiResponse.success();
    }

    @PutMapping("/{id}/status")
    @Operation(summary = "启用/禁用商家")
    @PreAuthorize("@perm.has('admin:user:merchant:disable')")
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

    @GetMapping("/{id}/fund-logs")
    @Operation(summary = "商家资金流水")
    @PreAuthorize("@perm.has('admin:user:merchant:fund')")
    public ApiResponse<Map<String, Object>> fundLogs(@PathVariable Long id,
                                                     @RequestParam(defaultValue = "1") int page,
                                                     @RequestParam(defaultValue = "10") int pageSize) {
        Merchant merchant = merchantMapper.selectById(id);
        if (merchant == null || Boolean.TRUE.equals(merchant.getDeleted())) {
            throw new BusinessException(ResultCode.NOT_FOUND.getCode(), "商家不存在");
        }
        Page<MerchantFundLog> pg = merchantFundService.getFundLogs(id, page, pageSize);
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("list", pg.getRecords());
        result.put("total", pg.getTotal());
        result.put("page", page);
        result.put("pageSize", pageSize);
        result.put("balance", merchant.getBalance());
        result.put("frozenBalance", merchant.getFrozenBalance());
        result.putAll(currencyInfo(id));
        return ApiResponse.success(result);
    }

    @PostMapping("/{id}/fund-adjust")
    @Operation(summary = "调整商家资金（增加/扣减）")
    @PreAuthorize("@perm.has('admin:user:merchant:fund')")
    @Audit(module = "商家管理", action = "调整资金", description = "总后台手动调整商家可用余额")
    public ApiResponse<MerchantFundLog> fundAdjust(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        BigDecimal amount = normalizeAdminFundAmount(id, body);
        String direction = String.valueOf(body.getOrDefault("direction", "INCREASE"));
        boolean increase = !"DECREASE".equalsIgnoreCase(direction);
        String remark = requireReason(body);
        String type = increase ? "admin_add" : "admin_subtract";
        MerchantFundLog log = merchantFundService.adjust(
                id, amount, increase, type, remark, SecurityUtils.getCurrentUserId(), "ADMIN_ADJUST", null);
        return ApiResponse.success(log);
    }

    @GetMapping("/{id}/wallet")
    @Operation(summary = "Wallet summary")
    @PreAuthorize("@perm.has('admin:user:merchant:fund')")
    public ApiResponse<Map<String, Object>> wallet(@PathVariable Long id) {
        Map<String, Object> summary = merchantFundService.walletSummary(id);
        summary.putAll(currencyInfo(id));
        return ApiResponse.success(summary);
    }

    @PostMapping("/{id}/wallet/add")
    @Operation(summary = "Admin add merchant funds")
    @PreAuthorize("@perm.has('admin:user:merchant:fund')")
    @Audit(module = "Merchant", action = "Add funds", description = "Admin adds available balance to merchant")
    public ApiResponse<MerchantFundLog> addWallet(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        MerchantFundLog log = merchantFundService.adjust(id, normalizeAdminFundAmount(id, body), true,
                "admin_add", requireReason(body), SecurityUtils.getCurrentUserId(), "ADMIN_ADJUST", null);
        return ApiResponse.success(log);
    }

    @PostMapping("/{id}/wallet/subtract")
    @Operation(summary = "Admin subtract merchant funds")
    @PreAuthorize("@perm.has('admin:user:merchant:fund')")
    @Audit(module = "Merchant", action = "Subtract funds", description = "Admin subtracts available balance from merchant")
    public ApiResponse<MerchantFundLog> subtractWallet(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        MerchantFundLog log = merchantFundService.adjust(id, normalizeAdminFundAmount(id, body), false,
                "admin_subtract", requireReason(body), SecurityUtils.getCurrentUserId(), "ADMIN_ADJUST", null);
        return ApiResponse.success(log);
    }

    @PostMapping("/{id}/wallet/freeze")
    @Operation(summary = "Admin freeze merchant funds")
    @PreAuthorize("@perm.has('admin:user:merchant:fund')")
    @Audit(module = "Merchant", action = "Freeze funds", description = "Admin freezes merchant available balance")
    public ApiResponse<MerchantFundLog> freezeWallet(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        MerchantFundLog log = merchantFundService.freeze(id, normalizeAdminFundAmount(id, body),
                "freeze", requireReason(body), SecurityUtils.getCurrentUserId(), "ADMIN_ADJUST", null);
        return ApiResponse.success(log);
    }

    @PostMapping("/{id}/wallet/unfreeze")
    @Operation(summary = "Admin unfreeze merchant funds")
    @PreAuthorize("@perm.has('admin:user:merchant:fund')")
    @Audit(module = "Merchant", action = "Unfreeze funds", description = "Admin unfreezes merchant frozen balance")
    public ApiResponse<MerchantFundLog> unfreezeWallet(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        MerchantFundLog log = merchantFundService.unfreeze(id, normalizeAdminFundAmount(id, body),
                "unfreeze", requireReason(body), SecurityUtils.getCurrentUserId(), "ADMIN_ADJUST", null);
        return ApiResponse.success(log);
    }

    @PutMapping("/{id}/login-password")
    @Operation(summary = "重置商家登录密码")
    @PreAuthorize("@perm.has('admin:user:merchant:resetPwd')")
    @Audit(module = "商家管理", action = "重置登录密码", description = "总后台重置商家登录密码")
    public ApiResponse<Void> resetLoginPassword(@PathVariable Long id, @RequestBody Map<String, String> body) {
        String password = body.get("password");
        if (password == null || password.length() < 6) {
            throw new BusinessException(ResultCode.BAD_REQUEST.getCode(), "密码长度至少6位");
        }
        Merchant merchant = merchantMapper.selectById(id);
        if (merchant == null || Boolean.TRUE.equals(merchant.getDeleted()) || merchant.getUserId() == null) {
            throw new BusinessException(ResultCode.NOT_FOUND.getCode(), "商家不存在");
        }
        User user = userMapper.selectById(merchant.getUserId());
        if (user == null) {
            throw new BusinessException(ResultCode.NOT_FOUND.getCode(), "商家账号不存在");
        }
        user.setPassword(passwordEncoder.encode(password));
        user.setUpdatedAt(LocalDateTime.now());
        userMapper.updateById(user);
        return ApiResponse.success();
    }

    @PutMapping("/{id}/withdraw-password")
    @Operation(summary = "重置商家提现密码")
    @PreAuthorize("@perm.has('admin:user:merchant:resetPwd')")
    @Audit(module = "商家管理", action = "重置提现密码", description = "总后台重置商家提现密码")
    public ApiResponse<Void> resetWithdrawPassword(@PathVariable Long id, @RequestBody Map<String, String> body) {
        String password = body.get("password");
        if (password == null || password.length() < 6) {
            throw new BusinessException(ResultCode.BAD_REQUEST.getCode(), "提现密码长度至少6位");
        }
        Merchant merchant = merchantMapper.selectById(id);
        if (merchant == null || Boolean.TRUE.equals(merchant.getDeleted())) {
            throw new BusinessException(ResultCode.NOT_FOUND.getCode(), "商家不存在");
        }
        merchant.setWithdrawPassword(passwordEncoder.encode(password));
        merchant.setUpdatedAt(LocalDateTime.now());
        merchantMapper.updateById(merchant);
        return ApiResponse.success();
    }

    @GetMapping("/{id}/withdraw-accounts")
    @Operation(summary = "商家提款账户（只读）")
    @PreAuthorize("@perm.has('admin:user:merchant:fund')")
    public ApiResponse<List<Map<String, Object>>> withdrawAccounts(@PathVariable Long id) {
        Merchant merchant = merchantMapper.selectById(id);
        if (merchant == null || Boolean.TRUE.equals(merchant.getDeleted())) {
            throw new BusinessException(ResultCode.NOT_FOUND.getCode(), "商家不存在");
        }
        List<WithdrawAccount> list = withdrawAccountMapper.selectList(new LambdaQueryWrapper<WithdrawAccount>()
                .eq(WithdrawAccount::getMerchantId, id)
                .eq(WithdrawAccount::getDeleted, false)
                .orderByDesc(WithdrawAccount::getIsDefault)
                .orderByDesc(WithdrawAccount::getCreatedAt));
        return ApiResponse.success(list.stream().map(account -> {
            Map<String, Object> item = new LinkedHashMap<>();
            item.put("id", account.getId());
            item.put("merchantId", account.getMerchantId());
            item.put("type", account.getType());
            item.put("chain", account.getChain());
            item.put("address", maskSensitive(account.getAddress(), 6, 4));
            item.put("bankName", account.getBankName());
            item.put("accountNo", maskSensitive(account.getAccountNo(), 4, 4));
            item.put("accountName", account.getAccountName());
            item.put("swiftCode", account.getSwiftCode());
            item.put("country", account.getCountry());
            item.put("remark", account.getRemark());
            item.put("isDefault", account.getIsDefault());
            item.put("status", account.getStatus());
            item.put("createdAt", account.getCreatedAt());
            return item;
        }).toList());
    }

    private BigDecimal toAmount(Object value) {
        if (value == null) {
            throw new BusinessException(ResultCode.BAD_REQUEST.getCode(), "金额不能为空");
        }
        try {
            BigDecimal amount = new BigDecimal(String.valueOf(value).trim());
            if (amount.compareTo(BigDecimal.ZERO) <= 0) {
                throw new BusinessException(ResultCode.BAD_REQUEST.getCode(), "Amount must be greater than 0");
            }
            return amount;
        } catch (NumberFormatException e) {
            throw new BusinessException(ResultCode.BAD_REQUEST.getCode(), "金额格式不正确");
        }
    }

    private String requireReason(Map<String, Object> body) {
        Object value = body == null ? null : body.getOrDefault("reason", body.get("remark"));
        String reason = value == null ? "" : String.valueOf(value).trim();
        if (reason.isEmpty()) {
            throw new BusinessException(ResultCode.BAD_REQUEST.getCode(), "Reason is required");
        }
        return reason;
    }

    private BigDecimal normalizeAdminFundAmount(Long merchantId, Map<String, Object> body) {
        BigDecimal amount = toAmount(body == null ? null : body.get("amount"));
        String amountCurrency = body == null || body.get("amountCurrency") == null
                ? "LOCAL"
                : String.valueOf(body.get("amountCurrency")).trim();
        if (!"USD".equalsIgnoreCase(amountCurrency)) {
            return amount;
        }
        Map<String, Object> currency = currencyInfo(merchantId);
        BigDecimal exchangeRate = currency.get("exchangeRate") instanceof BigDecimal rate ? rate : BigDecimal.ONE;
        if (exchangeRate.compareTo(BigDecimal.ZERO) <= 0) {
            throw new BusinessException(ResultCode.BAD_REQUEST.getCode(), "Exchange rate must be greater than 0");
        }
        return amount.multiply(exchangeRate).setScale(2, RoundingMode.HALF_UP);
    }

    private Map<String, Object> currencyInfo(Long merchantId) {
        Map<String, Object> data = new LinkedHashMap<>();
        data.put("currencyCode", "USD");
        data.put("currencySymbol", "$");
        data.put("exchangeRate", BigDecimal.ONE);
        data.put("countryCode", null);

        Merchant merchant = merchantMapper.selectById(merchantId);
        if (merchant == null || merchant.getUserId() == null) {
            return data;
        }
        User user = userMapper.selectById(merchant.getUserId());
        if (user == null || user.getCountryCode() == null || user.getCountryCode().isBlank()) {
            return data;
        }
        Country country = countryMapper.selectByCode(user.getCountryCode());
        data.put("countryCode", user.getCountryCode());
        if (country != null) {
            data.put("countryName", country.getName());
            data.put("currencyCode", country.getCurrencyCode() == null ? "USD" : country.getCurrencyCode());
            data.put("currencySymbol", country.getCurrencySymbol() == null ? "" : country.getCurrencySymbol());
            data.put("exchangeRate", country.getExchangeRate() == null ? BigDecimal.ONE : country.getExchangeRate());
        }
        return data;
    }

    private String maskSensitive(String value, int prefix, int suffix) {
        if (value == null || value.isBlank()) return value;
        String text = value.trim();
        if (text.length() <= prefix + suffix) return "****";
        return text.substring(0, prefix) + "****" + text.substring(text.length() - suffix);
    }

    private String text(Map<String, Object> body, String... keys) {
        if (body == null) return null;
        for (String key : keys) {
            Object value = body.get(key);
            if (value != null && !String.valueOf(value).trim().isEmpty()) {
                return String.valueOf(value).trim();
            }
        }
        return null;
    }

    private String normalizeCode(String value, boolean upper) {
        if (value == null || value.isBlank()) return null;
        String code = value.trim();
        return upper ? code.toUpperCase(Locale.ROOT) : code;
    }

    private Integer toIntStatus(Object value) {
        if (value == null) return null;
        if (value instanceof Number n) return n.intValue();
        String text = String.valueOf(value).trim();
        if ("ENABLE".equalsIgnoreCase(text)) return 1;
        if ("DISABLE".equalsIgnoreCase(text)) return 0;
        return Integer.parseInt(text);
    }
}
