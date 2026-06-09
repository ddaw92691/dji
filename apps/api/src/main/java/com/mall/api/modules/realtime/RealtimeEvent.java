package com.mall.api.modules.realtime;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.time.LocalDateTime;
import java.util.Map;

public class RealtimeEvent {

    private String type;
    private String targetType;
    private Long targetId;
    private String title;
    private String message;
    private Map<String, Object> payload;
    private LocalDateTime createdAt;

    private static final ObjectMapper objectMapper = new ObjectMapper();

    public RealtimeEvent() {
    }

    public static RealtimeEvent of(String type, String targetType, Long targetId,
                                    String title, String message, Map<String, Object> payload) {
        RealtimeEvent event = new RealtimeEvent();
        event.type = type;
        event.targetType = targetType;
        event.targetId = targetId;
        event.title = title;
        event.message = message;
        event.payload = payload != null ? payload : Map.of();
        event.createdAt = LocalDateTime.now();
        return event;
    }

    public String toJson() {
        try {
            return objectMapper.writeValueAsString(this);
        } catch (Exception e) {
            return "{}";
        }
    }

    public Map<String, Object> toMap() {
        try {
            return objectMapper.convertValue(this, new TypeReference<Map<String, Object>>() {});
        } catch (Exception e) {
            return Map.of();
        }
    }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public String getTargetType() { return targetType; }
    public void setTargetType(String targetType) { this.targetType = targetType; }
    public Long getTargetId() { return targetId; }
    public void setTargetId(Long targetId) { this.targetId = targetId; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    public Map<String, Object> getPayload() { return payload; }
    public void setPayload(Map<String, Object> payload) { this.payload = payload; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
