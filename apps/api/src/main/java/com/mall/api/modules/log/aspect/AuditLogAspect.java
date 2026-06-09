package com.mall.api.modules.log.aspect;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mall.api.modules.log.annotation.Audit;
import com.mall.api.modules.log.entity.AuditLog;
import com.mall.api.modules.log.service.AuditLogService;
import jakarta.servlet.http.HttpServletRequest;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.lang.reflect.Method;
import java.util.Objects;

@Aspect
@Component
public class AuditLogAspect {

    private final AuditLogService auditLogService;
    private final ObjectMapper objectMapper;

    public AuditLogAspect(AuditLogService auditLogService, ObjectMapper objectMapper) {
        this.auditLogService = auditLogService;
        this.objectMapper = objectMapper;
    }

    @Around("@annotation(com.mall.api.modules.log.annotation.Audit)")
    public Object around(ProceedingJoinPoint joinPoint) throws Throwable {
        long start = System.currentTimeMillis();
        AuditLog log = new AuditLog();

        try {
            MethodSignature signature = (MethodSignature) joinPoint.getSignature();
            Method method = signature.getMethod();
            Audit audit = method.getAnnotation(Audit.class);

            log.setModule(audit.module());
            log.setAction(audit.action());
            log.setDescription(audit.description());

            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth != null && auth.isAuthenticated() && !"anonymousUser".equals(auth.getPrincipal())) {
                log.setUsername(auth.getName());
            }

            ServletRequestAttributes attrs = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
            if (attrs != null) {
                HttpServletRequest request = attrs.getRequest();
                log.setMethod(request.getMethod());
                log.setRequestUri(request.getRequestURI());
                log.setIp(request.getRemoteAddr());
                log.setUserAgent(request.getHeader("User-Agent"));
            }

            try {
                log.setRequestParams(objectMapper.writeValueAsString(joinPoint.getArgs()));
            } catch (Exception ignored) {}

            Object result = joinPoint.proceed();

            log.setStatus("SUCCESS");
            log.setExecutionTime(System.currentTimeMillis() - start);
            try {
                log.setResponseBody(objectMapper.writeValueAsString(result));
            } catch (Exception ignored) {}

            auditLogService.save(log);
            return result;
        } catch (Throwable e) {
            log.setStatus("FAILED");
            log.setErrorMessage(e.getMessage());
            log.setExecutionTime(System.currentTimeMillis() - start);
            auditLogService.save(log);
            throw e;
        }
    }
}
