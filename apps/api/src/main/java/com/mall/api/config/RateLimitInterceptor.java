package com.mall.api.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mall.api.common.response.ApiResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import java.util.Iterator;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class RateLimitInterceptor implements HandlerInterceptor {

    @Value("${rate-limit.enabled:true}")
    private boolean enabled;

    // 仅当部署在受信任反向代理后面时才置 true，否则 X-Forwarded-For 可被伪造
    @Value("${rate-limit.trust-forwarded-header:false}")
    private boolean trustForwardedHeader;

    private final ConcurrentHashMap<String, RateLimitBucket> buckets = new ConcurrentHashMap<>();
    private final ObjectMapper objectMapper = new ObjectMapper();

    private static final int DEFAULT_LIMIT = 300;
    private static final int LOGIN_LIMIT = 10;
    private static final int REGISTER_LIMIT = 5;
    private static final int UPLOAD_LIMIT = 30;
    private static final int PUBLIC_LIMIT = 120;
    private static final int SUPPORT_MSG_LIMIT = 60;
    private static final long WINDOW_MS = 60_000;
    private static final int MAX_BUCKETS = 50_000;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        if (!enabled) return true;

        long now = System.currentTimeMillis();
        // 容量保护 + 过期清理，避免无界增长导致 OOM
        if (buckets.size() > MAX_BUCKETS) {
            evictExpired(now);
        }

        String uri = request.getRequestURI();
        int limit = getLimit(uri);
        String key = buildKey(request, normalizePath(uri));

        RateLimitBucket bucket = buckets.computeIfAbsent(key, k -> new RateLimitBucket(now, 0));
        synchronized (bucket) {
            if (now - bucket.lastResetTime > WINDOW_MS) {
                bucket.lastResetTime = now;
                bucket.currentCount = 0;
            }
            bucket.currentCount++;
            if (bucket.currentCount > limit) {
                response.setStatus(429);
                response.setContentType("application/json;charset=UTF-8");
                ApiResponse<Void> err = ApiResponse.error(429, "Too many requests, please try again later");
                response.getWriter().write(objectMapper.writeValueAsString(err));
                return false;
            }
        }
        return true;
    }

    private void evictExpired(long now) {
        Iterator<Map.Entry<String, RateLimitBucket>> it = buckets.entrySet().iterator();
        while (it.hasNext()) {
            RateLimitBucket b = it.next().getValue();
            if (now - b.lastResetTime > WINDOW_MS) {
                it.remove();
            }
        }
    }

    // 把路径里的数字段归一，使 /api/x/1、/api/x/2 共用同一限流桶
    private String normalizePath(String uri) {
        return uri.replaceAll("/\\d+", "/{id}");
    }

    private int getLimit(String uri) {
        if (uri.startsWith("/api/auth/login")) return LOGIN_LIMIT;
        if (uri.startsWith("/api/auth/register")) return REGISTER_LIMIT;
        if (uri.startsWith("/api/upload/image")) return UPLOAD_LIMIT;
        if (uri.startsWith("/api/public/")) return PUBLIC_LIMIT;
        if (uri.contains("/support/") && uri.contains("/messages")) return SUPPORT_MSG_LIMIT;
        return DEFAULT_LIMIT;
    }

    private String buildKey(HttpServletRequest request, String normalizedUri) {
        String user = request.getRemoteUser();
        if (user != null) {
            return normalizedUri + ":" + user;
        }
        return normalizedUri + ":" + getClientIp(request);
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

    private static class RateLimitBucket {
        long lastResetTime;
        int currentCount;

        RateLimitBucket(long lastResetTime, int currentCount) {
            this.lastResetTime = lastResetTime;
            this.currentCount = currentCount;
        }
    }
}