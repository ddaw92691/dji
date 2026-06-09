package com.mall.api.modules.auth.service.impl;

import com.mall.api.common.enums.ResultCode;
import com.mall.api.common.exception.BusinessException;
import com.mall.api.modules.auth.dto.*;
import com.mall.api.modules.auth.service.AuthService;
import com.mall.api.modules.country.entity.Country;
import com.mall.api.modules.country.entity.CountryLanguage;
import com.mall.api.modules.country.mapper.CountryLanguageMapper;
import com.mall.api.modules.country.mapper.CountryMapper;
import com.mall.api.modules.language.entity.Language;
import com.mall.api.modules.language.mapper.LanguageMapper;
import com.mall.api.modules.system.PermissionService;
import com.mall.api.modules.user.entity.User;
import com.mall.api.modules.user.mapper.UserMapper;
import com.mall.api.security.JwtTokenProvider;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class AuthServiceImpl implements AuthService {

    private final UserMapper userMapper;
    private final JwtTokenProvider jwtTokenProvider;
    private final PasswordEncoder passwordEncoder;
    private final CountryMapper countryMapper;
    private final LanguageMapper languageMapper;
    private final CountryLanguageMapper countryLanguageMapper;
    private final PermissionService permissionService;

    private static final String CUSTOMER_ROLE = "CUSTOMER";

    public AuthServiceImpl(UserMapper userMapper, JwtTokenProvider jwtTokenProvider,
                           PasswordEncoder passwordEncoder, CountryMapper countryMapper,
                           LanguageMapper languageMapper, CountryLanguageMapper countryLanguageMapper,
                           PermissionService permissionService) {
        this.userMapper = userMapper;
        this.jwtTokenProvider = jwtTokenProvider;
        this.passwordEncoder = passwordEncoder;
        this.countryMapper = countryMapper;
        this.languageMapper = languageMapper;
        this.countryLanguageMapper = countryLanguageMapper;
        this.permissionService = permissionService;
    }

    @Override
    public LoginResponse login(LoginRequest request) {
        String account = request.getAccount();
        String password = request.getPassword();

        User user = userMapper.selectByEmail(account);
        if (user == null) user = userMapper.selectByPhone(account);
        if (user == null) user = userMapper.selectByUsername(account);

        // 账号不存在与密码错误返回同一文案，避免用户枚举
        if (user == null || !passwordEncoder.matches(password, user.getPassword())) {
            throw new BusinessException("error.auth.invalidCredentials");
        }
        // 通过身份校验后再提示停用，且空值安全（status 为 Integer）
        if (user.getStatus() != null && user.getStatus() == 0) {
            throw new BusinessException("error.auth.accountDisabled");
        }

        user.setLastLoginAt(LocalDateTime.now());
        userMapper.updateById(user);

        String token = jwtTokenProvider.createToken(user.getId(), user.getUsername(), user.getRole());

        return LoginResponse.builder()
                .token(token)
                .user(toUserInfo(user))
                .build();
    }

    @Override
    @Transactional
    public LoginResponse register(RegisterRequest request) {
        String account = request.getEmail() != null && !request.getEmail().isEmpty()
                ? request.getEmail() : request.getPhone();
        if (account == null || account.isEmpty()) {
            throw new BusinessException(ResultCode.BAD_REQUEST.getCode(), "邮箱或手机号不能为空");
        }

        if (request.getEmail() != null && !request.getEmail().isEmpty()) {
            User existUser = userMapper.selectByEmail(request.getEmail());
            if (existUser != null) {
                throw new BusinessException("error.auth.emailExists");
            }
        }

        if (request.getPhone() != null && !request.getPhone().isEmpty()
                && userMapper.selectByPhone(request.getPhone()) != null) {
            throw new BusinessException("error.auth.phoneExists");
        }
        if (userMapper.selectByUsername(account) != null) {
            throw new BusinessException("error.auth.usernameExists");
        }

        Country country = countryMapper.selectByCode(request.getCountryCode());
        if (country == null || !"ENABLE".equals(country.getStatus())) {
            throw new BusinessException("error.auth.invalidCountry");
        }

        String languageCode = request.getLanguageCode();
        if (languageCode == null || languageCode.isEmpty()) {
            languageCode = country.getDefaultLanguageCode();
        }

        User user = new User();
        user.setUsername(account);
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setNickname(account.contains("@") ? account.split("@")[0] : account);
        user.setRole(CUSTOMER_ROLE);
        user.setStatus(1);
        user.setCountryCode(request.getCountryCode());
        user.setLanguageCode(languageCode);
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());
        userMapper.insert(user);

        String token = jwtTokenProvider.createToken(user.getId(), user.getUsername(), CUSTOMER_ROLE);

        return LoginResponse.builder()
                .token(token)
                .user(toUserInfo(user))
                .build();
    }

    @Override
    public UserInfo getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()
                || "anonymousUser".equals(authentication.getPrincipal())) {
            throw new BusinessException(ResultCode.UNAUTHORIZED);
        }

        String username = authentication.getName();
        User user = userMapper.selectByUsername(username);
        if (user == null) {
            user = userMapper.selectByEmail(username);
        }
        if (user == null) {
            throw new BusinessException(ResultCode.USER_NOT_FOUND);
        }

        return toUserInfo(user);
    }

    @Override
    public PermissionsResponse getPermissions(String role) {
        return permissionService.getPermissionsByRole(role);
    }

    private UserInfo toUserInfo(User user) {
        return UserInfo.builder()
                .id(user.getId())
                .email(user.getEmail())
                .phone(user.getPhone())
                .role(user.getRole())
                .nickname(user.getNickname())
                .avatar(user.getAvatar())
                .countryCode(user.getCountryCode())
                .languageCode(user.getLanguageCode())
                .build();
    }
}
