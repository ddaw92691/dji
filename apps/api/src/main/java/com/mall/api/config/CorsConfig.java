package com.mall.api.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.core.env.Profiles;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Configuration
public class CorsConfig {

    @Value("${cors.allowed-origins:}")
    private String allowedOrigins;

    @Value("${cors.fail-on-missing-allowed-origins:false}")
    private boolean failOnMissingAllowedOrigins;

    private final Environment environment;

    public CorsConfig(Environment environment) {
        this.environment = environment;
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        List<String> origins = parseOrigins();

        if (!origins.isEmpty()) {
            if (isProduction() && origins.stream().anyMatch("*"::equals)) {
                throw new IllegalStateException("Wildcard CORS origins are not allowed in production when credentials are enabled");
            }
            if (origins.stream().anyMatch("*"::equals)) {
                config.addAllowedOriginPattern("*");
            } else {
                config.setAllowedOrigins(origins);
            }
        } else {
            if (isProduction() || failOnMissingAllowedOrigins) {
                throw new IllegalStateException("CORS_ALLOWED_ORIGINS must be configured in production");
            }
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

    private List<String> parseOrigins() {
        if (allowedOrigins == null || allowedOrigins.isBlank()) {
            return List.of();
        }
        return Arrays.stream(allowedOrigins.split(","))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .collect(Collectors.toList());
    }

    private boolean isProduction() {
        return environment.acceptsProfiles(Profiles.of("prod", "production"));
    }
}
