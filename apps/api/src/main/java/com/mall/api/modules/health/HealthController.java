package com.mall.api.modules.health;

import com.mall.api.common.response.ApiResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.sql.DataSource;
import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/health")
public class HealthController {

    @Autowired(required = false)
    private DataSource dataSource;

    @GetMapping
    public ApiResponse<Map<String, Object>> health() {
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("status", "UP");
        result.put("time", LocalDateTime.now().toString());
        try {
            if (dataSource != null) {
                dataSource.getConnection().close();
                result.put("database", "UP");
            }
        } catch (Exception e) {
            result.put("database", "DOWN");
        }
        result.put("version", "1.0.0");
        return ApiResponse.success(result);
    }
}
