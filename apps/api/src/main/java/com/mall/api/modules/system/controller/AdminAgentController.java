package com.mall.api.modules.system.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.mall.api.common.enums.ResultCode;
import com.mall.api.common.exception.BusinessException;
import com.mall.api.common.response.ApiResponse;
import com.mall.api.modules.agent.entity.Agent;
import com.mall.api.modules.agent.mapper.AgentMapper;
import com.mall.api.modules.commission.entity.Commission;
import com.mall.api.modules.commission.mapper.CommissionMapper;
import com.mall.api.modules.system.entity.SysRole;
import com.mall.api.modules.system.entity.SysUserRole;
import com.mall.api.modules.system.mapper.SysRoleMapper;
import com.mall.api.modules.system.mapper.SysUserRoleMapper;
import com.mall.api.modules.user.entity.User;
import com.mall.api.modules.user.mapper.UserMapper;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/admin/agents")
@Tag(name = "Admin 代理管理")
@PreAuthorize("hasAnyRole('SUPER_ADMIN','ADMIN')")
public class AdminAgentController {

    private final UserMapper userMapper;
    private final AgentMapper agentMapper;
    private final CommissionMapper commissionMapper;
    private final PasswordEncoder passwordEncoder;
    private final SysRoleMapper sysRoleMapper;
    private final SysUserRoleMapper sysUserRoleMapper;

    public AdminAgentController(UserMapper userMapper, AgentMapper agentMapper,
                                CommissionMapper commissionMapper, PasswordEncoder passwordEncoder,
                                SysRoleMapper sysRoleMapper, SysUserRoleMapper sysUserRoleMapper) {
        this.userMapper = userMapper;
        this.agentMapper = agentMapper;
        this.commissionMapper = commissionMapper;
        this.passwordEncoder = passwordEncoder;
        this.sysRoleMapper = sysRoleMapper;
        this.sysUserRoleMapper = sysUserRoleMapper;
    }

    @GetMapping
    @Operation(summary = "代理列表")
    @PreAuthorize("@perm.has('admin:user:agent:view')")
    public ApiResponse<Map<String, Object>> list(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Long agentId,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int pageSize) {
        LambdaQueryWrapper<Agent> qw = new LambdaQueryWrapper<>();
        qw.eq(Agent::getDeleted, false);
        if (agentId != null) {
            qw.eq(Agent::getId, agentId);
        }
        if (status != null && !status.isBlank()) {
            qw.eq(Agent::getStatus, status);
        }
        if (keyword != null && !keyword.isBlank()) {
            List<Long> userIds = userMapper.selectList(new LambdaQueryWrapper<User>()
                            .like(User::getEmail, keyword)
                            .or()
                            .like(User::getPhone, keyword)
                            .or()
                            .like(User::getNickname, keyword))
                    .stream()
                    .map(User::getId)
                    .toList();
            if (userIds.isEmpty()) {
                return ApiResponse.success(Map.of("list", List.of(), "total", 0, "page", page, "pageSize", pageSize));
            }
            qw.in(Agent::getUserId, userIds);
        }
        qw.orderByDesc(Agent::getCreatedAt);

        Page<Agent> pg = new Page<>(page, pageSize);
        pg = agentMapper.selectPage(pg, qw);

        List<Map<String, Object>> enriched = new ArrayList<>();
        for (Agent a : pg.getRecords()) {
            Map<String, Object> item = new LinkedHashMap<>();
            item.put("id", a.getId());
            item.put("agentId", a.getId());
            item.put("userId", a.getUserId());
            item.put("inviteCode", a.getInviteCode());
            item.put("parentAgentId", a.getParentAgentId());
            item.put("level", a.getLevel());
            item.put("commissionRate", a.getCommissionRate());
            item.put("balance", a.getBalance());
            item.put("frozenBalance", a.getFrozenBalance());
            item.put("totalCommission", a.getTotalCommission());
            item.put("totalWithdrawn", a.getTotalWithdrawn());
            item.put("status", a.getStatus());
            item.put("createdAt", a.getCreatedAt());

            if (a.getUserId() != null) {
                User user = userMapper.selectById(a.getUserId());
                if (user != null) {
                    item.put("email", user.getEmail());
                    item.put("phone", user.getPhone());
                    item.put("nickname", user.getNickname());
                    item.put("userStatus", user.getStatus());
                }
            }
            enriched.add(item);
        }

        return ApiResponse.success(Map.of(
                "list", enriched, "total", pg.getTotal(), "page", page, "pageSize", pageSize));
    }

    @PostMapping
    @Operation(summary = "创建代理")
    @PreAuthorize("@perm.has('admin:user:agent:add')")
    @Transactional
    public ApiResponse<Map<String, Object>> create(@RequestBody Map<String, Object> body) {
        String email = (String) body.get("email");
        String password = (String) body.get("password");
        String inviteCode = (String) body.get("inviteCode");

        if (email == null || email.isEmpty()) {
            throw new BusinessException(ResultCode.BAD_REQUEST.getCode(), "邮箱不能为空");
        }
        if (password == null || password.isEmpty()) {
            throw new BusinessException(ResultCode.BAD_REQUEST.getCode(), "密码不能为空");
        }

        User exist = userMapper.selectByEmail(email);
        if (exist != null) {
            throw new BusinessException(ResultCode.BAD_REQUEST.getCode(), "邮箱已存在");
        }

        if (inviteCode == null || inviteCode.isEmpty()) {
            inviteCode = UUID.randomUUID().toString().replace("-", "").substring(0, 8).toUpperCase();
        }

        User user = new User();
        user.setUsername(email);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        user.setNickname((String) body.getOrDefault("nickname", email.split("@")[0]));
        user.setRole("AGENT");
        user.setStatus(1);
        user.setInviteCode(inviteCode);
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());
        userMapper.insert(user);

        Agent agent = new Agent();
        agent.setUserId(user.getId());
        agent.setInviteCode(inviteCode);
        agent.setLevel(1);
        agent.setCommissionRate(new BigDecimal(body.getOrDefault("commissionRate", "0.00").toString()));
        agent.setBalance(BigDecimal.ZERO);
        agent.setFrozenBalance(BigDecimal.ZERO);
        agent.setTotalCommission(BigDecimal.ZERO);
        agent.setTotalWithdrawn(BigDecimal.ZERO);
        agent.setStatus("ENABLE");
        agent.setDeleted(false);
        agent.setCreatedAt(LocalDateTime.now());
        agent.setUpdatedAt(LocalDateTime.now());
        agentMapper.insert(agent);

        SysRole role = sysRoleMapper.selectOne(
                new LambdaQueryWrapper<SysRole>().eq(SysRole::getCode, "AGENT"));
        if (role != null) {
            SysUserRole userRole = new SysUserRole();
            userRole.setUserId(user.getId());
            userRole.setRoleId(role.getId());
            userRole.setCreatedAt(LocalDateTime.now());
            sysUserRoleMapper.insert(userRole);
        }

        return ApiResponse.success(Map.of("userId", user.getId(), "agentId", agent.getId(), "inviteCode", inviteCode));
    }

    @PutMapping("/{id}")
    @Operation(summary = "编辑代理")
    @PreAuthorize("@perm.has('admin:user:agent:edit')")
    public ApiResponse<Void> update(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        Agent agent = agentMapper.selectById(id);
        if (agent == null || Boolean.TRUE.equals(agent.getDeleted())) {
            throw new BusinessException(ResultCode.NOT_FOUND.getCode(), "代理不存在");
        }
        if (body.containsKey("commissionRate")) agent.setCommissionRate(new BigDecimal(body.get("commissionRate").toString()));
        if (body.containsKey("level")) agent.setLevel((Integer) body.get("level"));
        agent.setUpdatedAt(LocalDateTime.now());
        agentMapper.updateById(agent);

        if (agent.getUserId() != null) {
            User user = userMapper.selectById(agent.getUserId());
            if (user != null) {
                if (body.containsKey("email")) user.setEmail((String) body.get("email"));
                if (body.containsKey("phone")) user.setPhone((String) body.get("phone"));
                if (body.containsKey("nickname")) user.setNickname((String) body.get("nickname"));
                if (body.containsKey("inviteCode")) user.setInviteCode((String) body.get("inviteCode"));
                userMapper.updateById(user);
            }
        }
        return ApiResponse.success();
    }

    @PutMapping("/{id}/status")
    @Operation(summary = "启用/禁用代理")
    @PreAuthorize("@perm.has('admin:user:agent:disable')")
    public ApiResponse<Void> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        Agent agent = agentMapper.selectById(id);
        if (agent == null || Boolean.TRUE.equals(agent.getDeleted())) {
            throw new BusinessException(ResultCode.NOT_FOUND.getCode(), "代理不存在");
        }
        agent.setStatus(body.get("status"));
        agent.setUpdatedAt(LocalDateTime.now());
        agentMapper.updateById(agent);

        if (agent.getUserId() != null) {
            User user = userMapper.selectById(agent.getUserId());
            if (user != null) {
                user.setStatus("DISABLE".equals(body.get("status")) ? 0 : 1);
                userMapper.updateById(user);
            }
        }
        return ApiResponse.success();
    }

    @GetMapping("/{id}/customers")
    @Operation(summary = "代理邀请的客户")
    @PreAuthorize("@perm.has('admin:user:agent:view')")
    public ApiResponse<Map<String, Object>> customers(
            @PathVariable Long id,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int pageSize) {
        Agent agent = agentMapper.selectById(id);
        if (agent == null) {
            throw new BusinessException(ResultCode.NOT_FOUND.getCode(), "代理不存在");
        }
        LambdaQueryWrapper<User> qw = new LambdaQueryWrapper<>();
        qw.eq(User::getInvitedBy, agent.getUserId()).eq(User::getDeleted, false);
        qw.orderByDesc(User::getCreatedAt);
        Page<User> pg = new Page<>(page, pageSize);
        pg = userMapper.selectPage(pg, qw);
        return ApiResponse.success(Map.of(
                "list", pg.getRecords(), "total", pg.getTotal(), "page", page, "pageSize", pageSize));
    }

    @GetMapping("/{id}/commissions")
    @Operation(summary = "代理佣金记录")
    @PreAuthorize("@perm.has('admin:user:agent:view')")
    public ApiResponse<Map<String, Object>> commissions(
            @PathVariable Long id,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int pageSize) {
        Agent agent = agentMapper.selectById(id);
        if (agent == null) {
            throw new BusinessException(ResultCode.NOT_FOUND.getCode(), "代理不存在");
        }
        LambdaQueryWrapper<Commission> qw = new LambdaQueryWrapper<>();
        qw.eq(Commission::getAgentId, id).orderByDesc(Commission::getCreatedAt);
        Page<Commission> pg = new Page<>(page, pageSize);
        pg = commissionMapper.selectPage(pg, qw);
        return ApiResponse.success(Map.of(
                "list", pg.getRecords(), "total", pg.getTotal(), "page", page, "pageSize", pageSize));
    }
}
