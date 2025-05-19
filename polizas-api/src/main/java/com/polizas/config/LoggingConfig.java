package com.polizas.config;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import org.springframework.lang.NonNull;
import org.springframework.lang.Nullable;

@Configuration
@Slf4j
public class LoggingConfig implements WebMvcConfigurer {

    @Value("${app.logging.enable-request-logging:true}")
    private boolean enableRequestLogging;

    @Override
    public void addInterceptors(@NonNull InterceptorRegistry registry) {
        if (enableRequestLogging) {
            registry.addInterceptor(new RequestLoggingInterceptor());
        }
    }

    @Slf4j
    public static class RequestLoggingInterceptor implements HandlerInterceptor {
        @Override
        public boolean preHandle(
                @NonNull HttpServletRequest request,
                @NonNull HttpServletResponse response,
                @NonNull Object handler) {
            log.info("Request: {} {} from {}", request.getMethod(), request.getRequestURI(), request.getRemoteAddr());
            return true;
        }

        @Override
        public void afterCompletion(
                @NonNull HttpServletRequest request,
                @NonNull HttpServletResponse response,
                @NonNull Object handler,
                @Nullable Exception ex) {
            log.info("Response: {} {} - Status: {}", request.getMethod(), request.getRequestURI(),
                    response.getStatus());
        }
    }
}