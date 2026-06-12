package com.mall.api.security;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.Duration;
import java.util.Base64;
import java.util.Date;

@Service
public class JwtTokenBlacklistService {

    private static final String KEY_PREFIX = "auth:jwt:blacklist:";

    @Value("${jwt.blacklist.enabled:false}")
    private boolean enabled;

    @Value("${jwt.blacklist.fail-open:false}")
    private boolean failOpen;

    private final StringRedisTemplate redisTemplate;
    private final JwtTokenProvider jwtTokenProvider;

    public JwtTokenBlacklistService(StringRedisTemplate redisTemplate, JwtTokenProvider jwtTokenProvider) {
        this.redisTemplate = redisTemplate;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    public void blacklistCurrentToken(HttpServletRequest request) {
        String token = jwtTokenProvider.resolveToken(request);
        if (!StringUtils.hasText(token)) {
            return;
        }
        blacklist(token);
    }

    public void blacklist(String token) {
        if (!enabled || !StringUtils.hasText(token) || !jwtTokenProvider.validateToken(token)) {
            return;
        }
        Date expiration = jwtTokenProvider.getExpiration(token);
        long ttlMillis = expiration.getTime() - System.currentTimeMillis();
        if (ttlMillis <= 0) {
            return;
        }
        redisTemplate.opsForValue().set(key(token), "1", Duration.ofMillis(ttlMillis));
    }

    public boolean isBlacklisted(String token) {
        if (!enabled || !StringUtils.hasText(token)) {
            return false;
        }
        try {
            return Boolean.TRUE.equals(redisTemplate.hasKey(key(token)));
        } catch (RuntimeException e) {
            return !failOpen;
        }
    }

    private String key(String token) {
        return KEY_PREFIX + sha256(token);
    }

    private String sha256(String value) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] bytes = digest.digest(value.getBytes(StandardCharsets.UTF_8));
            return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("SHA-256 is not available", e);
        }
    }
}
