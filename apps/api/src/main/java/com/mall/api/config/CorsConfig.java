package com.mall.api.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Configuration
public class CorsConfig {

    @Value("${cors.allowed-origins:#{null}}")
    private String allowedOrigins;

    /**
     * 暴露为 CorsConfigurationSource，供 Spring Security 在过滤器链「最前面」统一处理 CORS。
     *
     * 之前这里返回的是独立的 CorsFilter Bean，但没有在 SecurityConfig 里调用 http.cors()，
     * 该过滤器会被注册在 Spring Security 过滤器链之后。对于受保护的 /api/admin/** 接口，
     * 浏览器发出的预检 OPTIONS 请求不带 token，会先被 Security 鉴权拦截返回 401/403，
     * 根本到不了 CorsFilter，导致总后台所有跨域的增删查改（含携带 Authorization 头的 GET）
     * 预检失败、全部不可用。改为 CorsConfigurationSource + http.cors() 后，CORS 在鉴权之前处理。
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        if (allowedOrigins != null && !allowedOrigins.isEmpty()) {
            List<String> origins = Arrays.stream(allowedOrigins.split(","))
                    .map(String::trim)
                    .filter(s -> !s.isEmpty())
                    .collect(Collectors.toList());
            config.setAllowedOrigins(origins);
        } else {
            // 未配置白名单时退化为允许任意来源（仅用于本地/调试，生产务必配置 CORS_ALLOWED_ORIGINS）
            config.addAllowedOriginPattern("*");
        }
        config.addAllowedMethod("*");
        config.addAllowedHeader("*");
        config.setExposedHeaders(List.of("Authorization"));
        config.setAllowCredentials(true);
        config.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
