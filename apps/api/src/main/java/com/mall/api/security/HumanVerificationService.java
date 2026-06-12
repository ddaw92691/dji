package com.mall.api.security;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.mall.api.common.exception.BusinessException;
import jakarta.annotation.PostConstruct;
import jakarta.servlet.http.HttpServletRequest;
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
            throw new IllegalStateException("human-verification.secret must be configured when human verification is enabled");
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
