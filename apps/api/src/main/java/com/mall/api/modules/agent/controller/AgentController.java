package com.mall.api.modules.agent.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.mall.api.common.enums.ResultCode;
import com.mall.api.common.exception.BusinessException;
import com.mall.api.common.response.ApiResponse;
import com.mall.api.modules.agent.entity.Agent;
import com.mall.api.modules.agent.mapper.AgentMapper;
import com.mall.api.modules.user.entity.User;
import com.mall.api.modules.user.mapper.UserMapper;
import com.mall.api.security.SecurityUtils;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/merchant/agent")
@Tag(name = "Agent 代理端")
@PreAuthorize("hasRole('AGENT')")
public class AgentController {

    private final UserMapper userMapper;
    private final AgentMapper agentMapper;

    public AgentController(UserMapper userMapper, AgentMapper agentMapper) {
        this.userMapper = userMapper;
        this.agentMapper = agentMapper;
    }

    @GetMapping("/invite")
    @Operation(summary = "邀请数据")
    public ApiResponse<Map<String, Object>> invite() {
        Long userId = SecurityUtils.getCurrentUserId();
        if (userId == null) {
            throw new BusinessException(ResultCode.UNAUTHORIZED);
        }
        User user = userMapper.selectById(userId);
        if (user == null) {
            throw new BusinessException(ResultCode.NOT_FOUND.getCode(), "用户不存在");
        }
        Agent agent = agentMapper.selectOne(
                new LambdaQueryWrapper<Agent>().eq(Agent::getUserId, userId));
        if (agent == null) {
            throw new BusinessException(ResultCode.NOT_FOUND.getCode(), "代理不存在");
        }

        Long invitedCustomerCount = userMapper.selectCount(
                new LambdaQueryWrapper<User>()
                        .eq(User::getInvitedBy, userId)
                        .eq(User::getDeleted, false));

        Map<String, Object> data = new LinkedHashMap<>();
        data.put("inviteCode", agent.getInviteCode());
        data.put("inviteLink", "/register?ref=" + agent.getInviteCode());
        data.put("invitedCustomerCount", invitedCustomerCount);
        data.put("totalCommission", agent.getTotalCommission() != null ? agent.getTotalCommission() : BigDecimal.ZERO);
        data.put("balance", agent.getBalance() != null ? agent.getBalance() : BigDecimal.ZERO);
        data.put("frozenBalance", agent.getFrozenBalance() != null ? agent.getFrozenBalance() : BigDecimal.ZERO);
        return ApiResponse.success(data);
    }

    @GetMapping("/customers")
    @Operation(summary = "邀请的客户列表")
    public ApiResponse<Map<String, Object>> customers(
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int pageSize) {
        Long userId = SecurityUtils.getCurrentUserId();
        if (userId == null) {
            throw new BusinessException(ResultCode.UNAUTHORIZED);
        }

        LambdaQueryWrapper<User> qw = new LambdaQueryWrapper<>();
        qw.eq(User::getInvitedBy, userId).eq(User::getDeleted, false);
        if (keyword != null && !keyword.isEmpty()) {
            qw.and(w -> w.like(User::getEmail, keyword)
                    .or().like(User::getPhone, keyword)
                    .or().like(User::getNickname, keyword));
        }
        qw.orderByDesc(User::getCreatedAt);

        Page<User> pg = new Page<>(page, pageSize);
        pg = userMapper.selectPage(pg, qw);
        return ApiResponse.success(Map.of(
                "list", pg.getRecords(), "total", pg.getTotal(), "page", page, "pageSize", pageSize));
    }

    @GetMapping("/team")
    @Operation(summary = "下级代理列表")
    public ApiResponse<List<Map<String, Object>>> team() {
        Long userId = SecurityUtils.getCurrentUserId();
        if (userId == null) {
            throw new BusinessException(ResultCode.UNAUTHORIZED);
        }
        Agent agent = agentMapper.selectOne(
                new LambdaQueryWrapper<Agent>().eq(Agent::getUserId, userId));

        List<Agent> subAgents;
        if (agent != null) {
            subAgents = agentMapper.selectList(
                    new LambdaQueryWrapper<Agent>()
                            .eq(Agent::getParentAgentId, agent.getId())
                            .eq(Agent::getDeleted, false));
        } else {
            subAgents = List.of();
        }

        List<Map<String, Object>> result = subAgents.stream().map(a -> {
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("id", a.getId());
            m.put("inviteCode", a.getInviteCode());
            m.put("level", a.getLevel());
            m.put("commissionRate", a.getCommissionRate());
            m.put("totalCommission", a.getTotalCommission());
            m.put("status", a.getStatus());
            m.put("createdAt", a.getCreatedAt());
            if (a.getUserId() != null) {
                User u = userMapper.selectById(a.getUserId());
                if (u != null) {
                    m.put("email", u.getEmail());
                    m.put("nickname", u.getNickname());
                }
            }
            return m;
        }).collect(Collectors.toList());

        return ApiResponse.success(result);
    }
}
