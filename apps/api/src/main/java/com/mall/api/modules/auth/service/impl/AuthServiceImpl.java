package com.mall.api.modules.auth.service.impl;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
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
import com.mall.api.modules.merchant.entity.MerchantApplication;
import com.mall.api.modules.merchant.mapper.MerchantApplicationMapper;
import com.mall.api.modules.system.PermissionService;
import com.mall.api.modules.user.entity.User;
import com.mall.api.modules.user.mapper.UserMapper;
import com.mall.api.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
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
    private final MerchantApplicationMapper merchantApplicationMapper;
    private final ObjectMapper objectMapper;

    @Value("${google.client-id:}")
    private String googleClientId;

    private static final String CUSTOMER_ROLE = "CUSTOMER";
    private static final String PENDING_STATUS = "PENDING";

    public AuthServiceImpl(UserMapper userMapper, JwtTokenProvider jwtTokenProvider,
                           PasswordEncoder passwordEncoder, CountryMapper countryMapper,
                           LanguageMapper languageMapper, CountryLanguageMapper countryLanguageMapper,
                           PermissionService permissionService,
                           MerchantApplicationMapper merchantApplicationMapper,
                           ObjectMapper objectMapper) {
        this.userMapper = userMapper;
        this.jwtTokenProvider = jwtTokenProvider;
        this.passwordEncoder = passwordEncoder;
        this.countryMapper = countryMapper;
        this.languageMapper = languageMapper;
        this.countryLanguageMapper = countryLanguageMapper;
        this.permissionService = permissionService;
        this.merchantApplicationMapper = merchantApplicationMapper;
        this.objectMapper = objectMapper;
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
    public LoginResponse googleLogin(GoogleLoginRequest request) {
        JsonNode payload = verifyGoogleCredential(request.getCredential());
        String email = payload.path("email").asText("");
        boolean emailVerified = "true".equalsIgnoreCase(payload.path("email_verified").asText("false"));
        if (email.isBlank() || !emailVerified) {
            throw new BusinessException(ResultCode.UNAUTHORIZED.getCode(), "Google email is not verified");
        }

        User user = userMapper.selectByEmail(email);
        if (user == null) {
            String nickname = payload.path("name").asText(email.split("@")[0]);
            user = new User();
            user.setUsername(uniqueUsername(email));
            user.setPassword(passwordEncoder.encode(UUID.randomUUID().toString()));
            user.setEmail(email);
            user.setNickname(nickname);
            user.setAvatar(payload.path("picture").asText(null));
            user.setRole(CUSTOMER_ROLE);
            user.setStatus(1);
            user.setCountryCode(resolveCountryCode(request.getCountryCode()));
            user.setLanguageCode(resolveLanguageCode(request.getLanguageCode(), user.getCountryCode()));
            user.setCreatedAt(LocalDateTime.now());
            user.setUpdatedAt(LocalDateTime.now());
            userMapper.insert(user);
        } else if (user.getStatus() != null && user.getStatus() == 0) {
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
    public MerchantApplicationResponse submitMerchantApplication(MerchantApplicationRequest request) {
        if (userMapper.selectByEmail(request.getEmail()) != null) {
            throw new BusinessException(ResultCode.BAD_REQUEST.getCode(), "This email is already registered");
        }
        if (userMapper.selectByPhone(request.getPhone()) != null) {
            throw new BusinessException(ResultCode.BAD_REQUEST.getCode(), "This phone number is already registered");
        }

        MerchantApplication latest = merchantApplicationMapper.selectLatestByEmail(request.getEmail());
        if (latest != null && PENDING_STATUS.equals(latest.getStatus())) {
            throw new BusinessException(ResultCode.BAD_REQUEST.getCode(), "A pending application already exists for this email");
        }

        boolean hasIdCard = hasText(request.getIdCardFrontUrl()) && hasText(request.getIdCardBackUrl());
        boolean hasPassport = hasText(request.getPassportPageUrl());
        boolean hasDriverLicense = hasText(request.getDriverLicenseUrl());
        if (!hasIdCard && !hasPassport && !hasDriverLicense) {
            throw new BusinessException(ResultCode.BAD_REQUEST.getCode(), "Please upload ID card front/back, passport page, or driver license");
        }

        MerchantApplication application = new MerchantApplication();
        application.setEmail(request.getEmail());
        application.setPhone(request.getPhone());
        application.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        application.setFullName(request.getFullName());
        application.setAge(request.getAge());
        application.setHomeAddress(request.getHomeAddress());
        application.setIdCardFrontUrl(request.getIdCardFrontUrl());
        application.setIdCardBackUrl(request.getIdCardBackUrl());
        application.setPassportPageUrl(request.getPassportPageUrl());
        application.setDriverLicenseUrl(request.getDriverLicenseUrl());
        application.setHandheldDocumentVideoUrl(request.getHandheldDocumentVideoUrl());
        application.setStatus(PENDING_STATUS);
        application.setDeleted(false);
        application.setCreatedAt(LocalDateTime.now());
        application.setUpdatedAt(LocalDateTime.now());
        merchantApplicationMapper.insert(application);

        return MerchantApplicationResponse.builder()
                .id(application.getId())
                .status(application.getStatus())
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

    private JsonNode verifyGoogleCredential(String credential) {
        try {
            String encoded = URLEncoder.encode(credential, StandardCharsets.UTF_8);
            HttpRequest verifyRequest = HttpRequest.newBuilder()
                    .uri(URI.create("https://oauth2.googleapis.com/tokeninfo?id_token=" + encoded))
                    .GET()
                    .build();
            HttpResponse<String> response = HttpClient.newHttpClient()
                    .send(verifyRequest, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() < 200 || response.statusCode() >= 300) {
                throw new BusinessException(ResultCode.UNAUTHORIZED.getCode(), "Invalid Google credential");
            }
            JsonNode payload = objectMapper.readTree(response.body());
            String audience = payload.path("aud").asText("");
            if (googleClientId != null && !googleClientId.isBlank() && !googleClientId.equals(audience)) {
                throw new BusinessException(ResultCode.UNAUTHORIZED.getCode(), "Invalid Google client");
            }
            return payload;
        } catch (BusinessException e) {
            throw e;
        } catch (Exception e) {
            throw new BusinessException(ResultCode.UNAUTHORIZED.getCode(), "Failed to verify Google credential");
        }
    }

    private String uniqueUsername(String email) {
        if (userMapper.selectByUsername(email) == null) {
            return email;
        }
        String localPart = email.contains("@") ? email.substring(0, email.indexOf("@")) : email;
        String username;
        do {
            username = localPart + "_" + UUID.randomUUID().toString().substring(0, 8);
        } while (userMapper.selectByUsername(username) != null);
        return username;
    }

    private String resolveCountryCode(String countryCode) {
        String candidate = hasText(countryCode) ? countryCode : "JP";
        Country country = countryMapper.selectByCode(candidate);
        if (country != null && "ENABLE".equals(country.getStatus())) {
            return candidate;
        }
        return "JP";
    }

    private String resolveLanguageCode(String languageCode, String countryCode) {
        if (hasText(languageCode)) {
            return languageCode;
        }
        Country country = countryMapper.selectByCode(countryCode);
        if (country != null && hasText(country.getDefaultLanguageCode())) {
            return country.getDefaultLanguageCode();
        }
        return "ja";
    }

    private boolean hasText(String value) {
        return value != null && !value.isBlank();
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
