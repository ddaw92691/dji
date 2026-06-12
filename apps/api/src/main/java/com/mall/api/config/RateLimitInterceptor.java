package com.mall.api.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mall.api.common.response.ApiResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.script.DefaultRedisScript;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import java.util.Collections;

@Component
public class RateLimitInterceptor implements HandlerInterceptor {

    private static final DefaultRedisScript<Long> RATE_LIMIT_SCRIPT = new DefaultRedisScript<>("""
            local current = redis.call('INCR', KEYS[1])
            if current == 1 then
              redis.call('EXPIRE', KEYS[1], ARGV[1])
            end
            return current
            """, Long.class);

    @Value("${rate-limit.enabled:true}")
    private boolean enabled;

    @Value("${rate-limit.trust-forwarded-header:false}")
    private boolean trustForwardedHeader;

    @Value("${rate-limit.fail-open:false}")
    private boolean failOpen;

    @Value("${rate-limit.window-seconds:60}")
    private long windowSeconds;

    @Value("${rate-limit.default-limit:300}")
    private int defaultLimit;

    @Value("${rate-limit.login-limit:10}")
    private int loginLimit;

    @Value("${rate-limit.register-limit:5}")
    private int registerLimit;

    @Value("${rate-limit.upload-limit:30}")
    private int uploadLimit;

    @Value("${rate-limit.merchant-application-upload-limit:3}")
    private int merchantApplicationUploadLimit;

    @Value("${rate-limit.dealer-application-limit:3}")
    private int dealerApplicationLimit;

    @Value("${rate-limit.public-limit:120}")
    private int publicLimit;

    @Value("${rate-limit.support-message-limit:60}")
    private int supportMessageLimit;

    private final StringRedisTemplate redisTemplate;
    private final ObjectMapper objectMapper;

    public RateLimitInterceptor(StringRedisTemplate redisTemplate, ObjectMapper objectMapper) {
        this.redisTemplate = redisTemplate;
        this.objectMapper = objectMapper;
    }

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        if (!enabled) return true;

        String uri = request.getRequestURI();
        int limit = getLimit(request.getMethod(), uri);
        String key = buildKey(request, normalizePath(uri));

        Long current;
        try {
            current = redisTemplate.execute(
                    RATE_LIMIT_SCRIPT,
                    Collections.singletonList(key),
                    String.valueOf(windowSeconds)
            );
        } catch (RuntimeException e) {
            if (failOpen) {
                return true;
            }
            writeError(response, 503, "Rate limiter is temporarily unavailable");
            return false;
        }

        if (current != null && current > limit) {
            writeError(response, 429, "Too many requests, please try again later");
            return false;
        }
        return true;
    }

    private void writeError(HttpServletResponse response, int status, String message) throws Exception {
        response.setStatus(status);
        response.setContentType("application/json;charset=UTF-8");
        ApiResponse<Void> err = ApiResponse.error(status, message);
        response.getWriter().write(objectMapper.writeValueAsString(err));
    }

    private String normalizePath(String uri) {
        return uri.replaceAll("/\\d+", "/{id}");
    }

    private int getLimit(String method, String uri) {
        if ("POST".equals(method) && uri.startsWith("/api/auth/login")) return loginLimit;
        if ("POST".equals(method) && uri.startsWith("/api/auth/register")) return registerLimit;
        if ("POST".equals(method) && isMerchantApplicationUpload(uri)) return merchantApplicationUploadLimit;
        if ("POST".equals(method) && isDealerApplicationSubmit(uri)) return dealerApplicationLimit;
        if ("POST".equals(method) && uri.startsWith("/api/upload/image")) return uploadLimit;
        if (uri.startsWith("/api/public/")) return publicLimit;
        if (uri.contains("/support/") && uri.contains("/messages")) return supportMessageLimit;
        return defaultLimit;
    }

    private boolean isMerchantApplicationUpload(String uri) {
        return uri.startsWith("/api/v1/merchant/upload")
                || uri.startsWith("/api/auth/merchant-applications/files");
    }

    private boolean isDealerApplicationSubmit(String uri) {
        return uri.startsWith("/api/v1/merchant/dealer-applications")
                || uri.startsWith("/api/auth/merchant-applications");
    }

    private String buildKey(HttpServletRequest request, String normalizedUri) {
        String user = request.getRemoteUser();
        String actor = user != null ? "user:" + user : "ip:" + getClientIp(request);
        return "rate-limit:" + request.getMethod() + ":" + normalizedUri + ":" + actor;
    }

    private String getClientIp(HttpServletRequest request) {
        if (trustForwardedHeader) {
            String xf = request.getHeader("X-Forwarded-For");
            if (xf != null && !xf.isEmpty() && !"unknown".equalsIgnoreCase(xf)) {
                return xf.split(",")[0].trim();
            }
            String xr = request.getHeader("X-Real-IP");
            if (xr != null && !xr.isEmpty() && !"unknown".equalsIgnoreCase(xr)) {
                return xr;
            }
        }
        return request.getRemoteAddr();
    }
}
