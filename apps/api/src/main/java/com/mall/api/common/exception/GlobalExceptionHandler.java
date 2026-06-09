package com.mall.api.common.exception;

import com.mall.api.common.enums.ResultCode;
import com.mall.api.common.response.ApiResponse;
import com.mall.api.modules.i18n.service.I18nService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.ConstraintViolationException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.validation.BindException;
import org.springframework.validation.FieldError;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.stream.Collectors;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    private final I18nService i18nService;

    public GlobalExceptionHandler(I18nService i18nService) {
        this.i18nService = i18nService;
    }

    @ExceptionHandler(BusinessException.class)
    public ApiResponse<Void> handleBusinessException(BusinessException e, HttpServletRequest request) {
        String countryCode = request.getHeader("X-Country-Code");
        String languageCode = request.getHeader("X-Language-Code");
        if (countryCode == null) countryCode = "US";
        if (languageCode == null) languageCode = "en";

        String message = e.getMessage();
        if (message != null && message.contains(".")) {
            message = i18nService.translate(message, countryCode, languageCode);
        }

        log.warn("[BusinessException] {} {} - code: {}, message: {}",
                request.getMethod(), request.getRequestURI(), e.getCode(), message);
        return ApiResponse.error(e.getCode() != null ? e.getCode() : 400, message);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ApiResponse<Void> handleMethodArgumentNotValid(MethodArgumentNotValidException e, HttpServletRequest request) {
        String message = e.getBindingResult().getFieldErrors().stream()
                .map(FieldError::getDefaultMessage)
                .collect(Collectors.joining("; "));
        log.warn("[Validation] {} {} - {}", request.getMethod(), request.getRequestURI(), message);
        return ApiResponse.error(400, message);
    }

    @ExceptionHandler(BindException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ApiResponse<Void> handleBindException(BindException e, HttpServletRequest request) {
        String message = e.getBindingResult().getFieldErrors().stream()
                .map(FieldError::getDefaultMessage)
                .collect(Collectors.joining("; "));
        log.warn("[Bind] {} {} - {}", request.getMethod(), request.getRequestURI(), message);
        return ApiResponse.error(400, message);
    }

    @ExceptionHandler(ConstraintViolationException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ApiResponse<Void> handleConstraintViolation(ConstraintViolationException e, HttpServletRequest request) {
        log.warn("[Constraint] {} {} - {}", request.getMethod(), request.getRequestURI(), e.getMessage());
        return ApiResponse.error(400, e.getMessage());
    }

    @ExceptionHandler(MissingServletRequestParameterException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ApiResponse<Void> handleMissingParameter(MissingServletRequestParameterException e, HttpServletRequest request) {
        log.warn("[MissingParam] {} {} - {}", request.getMethod(), request.getRequestURI(), e.getMessage());
        return ApiResponse.error(400, "Missing parameter: " + e.getParameterName());
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ApiResponse<Void> handleMessageNotReadable(HttpMessageNotReadableException e, HttpServletRequest request) {
        log.warn("[NotReadable] {} {} - {}", request.getMethod(), request.getRequestURI(), e.getMessage());
        return ApiResponse.error(400, "Request body is not readable");
    }

    @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
    @ResponseStatus(HttpStatus.METHOD_NOT_ALLOWED)
    public ApiResponse<Void> handleMethodNotSupported(HttpRequestMethodNotSupportedException e, HttpServletRequest request) {
        log.warn("[MethodNotAllowed] {} {} - {}", request.getMethod(), request.getRequestURI(), e.getMessage());
        return ApiResponse.error(405, "Method " + request.getMethod() + " not allowed");
    }

    @ExceptionHandler(BadCredentialsException.class)
    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    public ApiResponse<Void> handleBadCredentials(BadCredentialsException e, HttpServletRequest request) {
        log.warn("[BadCredentials] {} {}", request.getMethod(), request.getRequestURI());
        return resolveI18nError(request, "error.auth.invalidPassword", ResultCode.UNAUTHORIZED.getCode());
    }

    @ExceptionHandler(AuthenticationException.class)
    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    public ApiResponse<Void> handleAuthentication(AuthenticationException e, HttpServletRequest request) {
        log.warn("[Auth] {} {} - {}", request.getMethod(), request.getRequestURI(), e.getMessage());
        return resolveI18nError(request, "error.auth.unauthorized", ResultCode.UNAUTHORIZED.getCode());
    }

    @ExceptionHandler(AccessDeniedException.class)
    @ResponseStatus(HttpStatus.FORBIDDEN)
    public ApiResponse<Void> handleAccessDenied(AccessDeniedException e, HttpServletRequest request) {
        log.warn("[AccessDenied] {} {}", request.getMethod(), request.getRequestURI());
        return resolveI18nError(request, "error.permission.denied", ResultCode.FORBIDDEN.getCode());
    }

    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ApiResponse<Void> handleException(Exception e, HttpServletRequest request) {
        log.error("[Exception] {} {} -", request.getMethod(), request.getRequestURI(), e);
        return resolveI18nError(request, "error.system.internalError", ResultCode.INTERNAL_ERROR.getCode());
    }

    private ApiResponse<Void> resolveI18nError(HttpServletRequest request, String errorCode, Integer code) {
        String countryCode = request.getHeader("X-Country-Code");
        String languageCode = request.getHeader("X-Language-Code");
        if (countryCode == null) countryCode = "US";
        if (languageCode == null) languageCode = "en";

        String message = i18nService.translate(errorCode, countryCode, languageCode);
        return ApiResponse.error(code, message);
    }
}
