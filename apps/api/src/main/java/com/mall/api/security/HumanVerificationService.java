package com.mall.api.security;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.mall.api.common.exception.BusinessException;
import jakarta.annotation.PostConstruct;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.util.StringUtils;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.time.Duration;
import java.util.List;

@Service
public class HumanVerificationService {

    private static final Logger log = LoggerFactory.getLogger(HumanVerificationService.class);

    @Value("${human-verification.enabled:false}")
    private boolean enabled;

    @Value("${human-verification.secret:}")
    private String secret;

    @Value("${human-verification.verify-url:https://challenges.cloudflare.com/turnstile/v0/siteverify}")
    private String verifyUrl;

    @Value("${human-verification.trust-forwarded-header:${rate-limit.trust-forwarded-header:false}}")
    private boolean trustForwardedHeader;

    private final RestTemplate restTemplate;

    public HumanVerificationService(RestTemplateBuilder builder) {
        this.restTemplate = builder
                .setConnectTimeout(Duration.ofSeconds(3))
                .setReadTimeout(Duration.ofSeconds(5))
                .build();
    }

    @PostConstruct
    public void validateConfig() {
        if (enabled && !StringUtils.hasText(secret)) {
            // 之前这里直接抛异常，会导致 authController 创建失败、整个应用上下文启动失败、后台彻底宕机。
            // 缺失验证码密钥属于「可选保护未配置」，不应让整个平台不可用 —— 降级为关闭人机验证并告警，
            // 保证服务可启动。需要强制验证码时配置 HUMAN_VERIFICATION_SECRET 即可。
            log.error("human-verification.enabled=true 但 human-verification.secret 未配置；" +
                    "已自动关闭人机验证以避免启动失败。如需启用，请设置环境变量 HUMAN_VERIFICATION_SECRET。");
            enabled = false;
        }
    }

    public void verify(HttpServletRequest request, String explicitToken) {
        if (!enabled) {
            return;
        }
        String token = firstNonBlank(
                explicitToken,
                request.getHeader("X-Captcha-Token"),
                request.getHeader("X-Turnstile-Token"),
                request.getHeader("X-Recaptcha-Token")
        );
        if (!StringUtils.hasText(token)) {
            throw new BusinessException(400, "Human verification is required");
        }

        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.add("secret", secret);
        body.add("response", token);
        String ip = getClientIp(request);
        if (StringUtils.hasText(ip)) {
            body.add("remoteip", ip);
        }

        VerificationResponse result;
        try {
            result = restTemplate.postForObject(verifyUrl, body, VerificationResponse.class);
        } catch (RestClientException e) {
            throw new BusinessException(400, "Human verification failed");
        }
        if (result == null || !result.success) {
            throw new BusinessException(400, "Human verification failed");
        }
    }

    private String firstNonBlank(String... values) {
        for (String value : values) {
            if (StringUtils.hasText(value)) {
                return value.trim();
            }
        }
        return null;
    }

    private String getClientIp(HttpServletRequest request) {
        if (trustForwardedHeader) {
            String xf = request.getHeader("X-Forwarded-For");
            if (StringUtils.hasText(xf) && !"unknown".equalsIgnoreCase(xf)) {
                return xf.split(",")[0].trim();
            }
            String xr = request.getHeader("X-Real-IP");
            if (StringUtils.hasText(xr) && !"unknown".equalsIgnoreCase(xr)) {
                return xr;
            }
        }
        return request.getRemoteAddr();
    }

    private static class VerificationResponse {
        public boolean success;

        @JsonProperty("error-codes")
        public List<String> errorCodes;
    }
}
