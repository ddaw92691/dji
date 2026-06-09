package com.mall.api.modules.realtime;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.mall.api.modules.merchant.entity.Merchant;
import com.mall.api.modules.merchant.mapper.MerchantMapper;
import com.mall.api.modules.user.entity.User;
import com.mall.api.modules.user.mapper.UserMapper;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class RealtimeService {

    private final SimpMessagingTemplate messagingTemplate;
    private final UserMapper userMapper;
    private final MerchantMapper merchantMapper;

    public RealtimeService(SimpMessagingTemplate messagingTemplate, UserMapper userMapper,
                           MerchantMapper merchantMapper) {
        this.messagingTemplate = messagingTemplate;
        this.userMapper = userMapper;
        this.merchantMapper = merchantMapper;
    }

    public void sendToUser(Long userId, RealtimeEvent event) {
        messagingTemplate.convertAndSendToUser(String.valueOf(userId), "/queue/events", event.toMap());
    }

    public void sendToMerchant(Long merchantId, RealtimeEvent event) {
        Merchant merchant = merchantMapper.selectById(merchantId);
        if (merchant != null && merchant.getUserId() != null && !Boolean.TRUE.equals(merchant.getDeleted())) {
            sendToUser(merchant.getUserId(), event);
        }
    }

    public void sendToRole(String role, RealtimeEvent event) {
        java.util.List<User> users = userMapper.selectList(
                Wrappers.<User>lambdaQuery()
                        .eq(User::getRole, role)
                        .eq(User::getDeleted, false));
        for (User user : users) {
            sendToUser(user.getId(), event);
        }
    }

    public void broadcast(RealtimeEvent event) {
        messagingTemplate.convertAndSend("/topic/events", event.toMap());
    }

    public static class RealtimeEvent {
        private String type;
        private String targetType;
        private Long targetId;
        private String title;
        private String message;
        private Map<String, Object> payload;
        private String createdAt;

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
            event.createdAt = java.time.LocalDateTime.now().toString();
            return event;
        }

        public Map<String, Object> toMap() {
            return Map.of(
                    "type", type != null ? type : "",
                    "targetType", targetType != null ? targetType : "",
                    "targetId", targetId != null ? targetId : 0,
                    "title", title != null ? title : "",
                    "message", message != null ? message : "",
                    "payload", payload != null ? payload : Map.of(),
                    "createdAt", createdAt != null ? createdAt : ""
            );
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
        public String getCreatedAt() { return createdAt; }
        public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }
    }
}
