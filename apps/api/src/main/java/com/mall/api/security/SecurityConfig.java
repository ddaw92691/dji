package com.mall.api.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mall.api.common.enums.ResultCode;
import com.mall.api.common.response.ApiResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.MediaType;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import java.io.IOException;
import java.nio.charset.StandardCharsets;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;
    private final ObjectMapper objectMapper;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter,
                          JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint,
                          ObjectMapper objectMapper) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
        this.jwtAuthenticationEntryPoint = jwtAuthenticationEntryPoint;
        this.objectMapper = objectMapper;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .exceptionHandling(ex -> ex
                        .authenticationEntryPoint(jwtAuthenticationEntryPoint)
                        .accessDeniedHandler(this::handleAccessDenied))
                .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/health").permitAll()
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers("/api/public/**").permitAll()
                        .requestMatchers("/api/customer/products/**").permitAll()
                        .requestMatchers("/api/customer/home").permitAll()
                        .requestMatchers("/api/customer/categories").permitAll()
                        .requestMatchers("/api/customer/products/*/reviews").permitAll()
                        .requestMatchers("/api/customer/support/**").authenticated()
                        .requestMatchers("/api/customer/cart/**", "/api/customer/addresses/**", "/api/customer/orders/**").authenticated()
                        .requestMatchers("/api/customer/coupons/**", "/api/customer/reviews/**").authenticated()
                        .requestMatchers("/api/merchant/profile", "/api/merchant/orders/**", "/api/merchant/products/**", "/api/merchant/catalog/**", "/api/merchant/tax/**").hasRole("MERCHANT")
                        .requestMatchers("/api/merchant/reviews/**").hasRole("MERCHANT")
                        .requestMatchers("/api/merchant/agent/**").hasRole("AGENT")
                        .requestMatchers("/api/merchant/finance/**").hasAnyRole("MERCHANT", "AGENT")
                        .requestMatchers("/api/merchant/dashboard").hasAnyRole("MERCHANT", "AGENT")
                        .requestMatchers("/api/merchant/support/**").hasAnyRole("MERCHANT", "AGENT")
                        .requestMatchers("/api/admin/admin-users/**", "/api/admin/roles/**", "/api/admin/menus/**").hasRole("SUPER_ADMIN")
                        .requestMatchers("/api/admin/users/**", "/api/admin/customers/**", "/api/admin/merchants/**", "/api/admin/agents/**").hasAnyRole("SUPER_ADMIN", "ADMIN")
                        .requestMatchers("/api/admin/finance/**").hasAnyRole("SUPER_ADMIN", "ADMIN")
                        .requestMatchers("/api/admin/withdrawals/**", "/api/admin/commissions/**").hasAnyRole("SUPER_ADMIN", "ADMIN")
                        .requestMatchers("/api/admin/orders/**", "/api/admin/payments/**").hasAnyRole("SUPER_ADMIN", "ADMIN")
                        .requestMatchers("/api/admin/products/**", "/api/admin/categories/**", "/api/admin/banners/**").hasAnyRole("SUPER_ADMIN", "ADMIN")
                        .requestMatchers("/api/admin/coupons/**", "/api/admin/refunds/**").hasAnyRole("SUPER_ADMIN", "ADMIN")
                        .requestMatchers("/api/admin/reviews/**", "/api/admin/settings/**").hasAnyRole("SUPER_ADMIN", "ADMIN")
                        .requestMatchers("/api/admin/audit-logs/**").hasAnyRole("SUPER_ADMIN", "ADMIN")
                        .requestMatchers("/api/admin/support/**", "/api/admin/catalog/**", "/api/admin/tax/**").hasAnyRole("SUPER_ADMIN", "ADMIN")
                        .requestMatchers("/api/admin/dashboard").hasAnyRole("SUPER_ADMIN", "ADMIN")
                        .requestMatchers("/api/notifications/**").authenticated()
                        .requestMatchers("/api/upload/**").authenticated()
                        .requestMatchers("/uploads/**").permitAll()
                        .requestMatchers("/doc.html").permitAll()
                        .requestMatchers("/v3/api-docs/**").permitAll()
                        .requestMatchers("/swagger-ui/**").permitAll()
                        .requestMatchers("/webjars/**").permitAll()
                        .requestMatchers("/ws/**").permitAll()
                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    private void handleAccessDenied(HttpServletRequest request,
                                    HttpServletResponse response,
                                    AccessDeniedException accessDeniedException) throws IOException {
        response.setStatus(HttpServletResponse.SC_FORBIDDEN);
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setCharacterEncoding(StandardCharsets.UTF_8.name());
        response.getWriter().write(objectMapper.writeValueAsString(
                ApiResponse.error(ResultCode.FORBIDDEN.getCode(), "Forbidden")
        ));
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}
