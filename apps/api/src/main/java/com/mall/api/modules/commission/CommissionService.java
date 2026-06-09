package com.mall.api.modules.commission;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.mall.api.common.exception.BusinessException;
import com.mall.api.modules.agent.entity.Agent;
import com.mall.api.modules.agent.mapper.AgentMapper;
import com.mall.api.modules.commission.entity.Commission;
import com.mall.api.modules.commission.mapper.CommissionMapper;
import com.mall.api.modules.customer.entity.CustomerProfile;
import com.mall.api.modules.customer.mapper.CustomerProfileMapper;
import com.mall.api.modules.order.entity.MallOrder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class CommissionService {

    private final CommissionMapper commissionMapper;
    private final AgentMapper agentMapper;
    private final CustomerProfileMapper customerProfileMapper;

    public CommissionService(CommissionMapper commissionMapper, AgentMapper agentMapper,
                             CustomerProfileMapper customerProfileMapper) {
        this.commissionMapper = commissionMapper;
        this.agentMapper = agentMapper;
        this.customerProfileMapper = customerProfileMapper;
    }

    @Transactional
    public Commission createFrozenCommission(MallOrder order) {
        LambdaQueryWrapper<CustomerProfile> profileWrapper = Wrappers.<CustomerProfile>lambdaQuery()
                .eq(CustomerProfile::getUserId, order.getUserId());
        CustomerProfile profile = customerProfileMapper.selectOne(profileWrapper);
        if (profile == null || profile.getInvitedBy() == null) {
            return null;
        }

        LambdaQueryWrapper<Agent> agentWrapper = Wrappers.<Agent>lambdaQuery()
                .eq(Agent::getUserId, profile.getInvitedBy());
        Agent agent = agentMapper.selectOne(agentWrapper);
        if (agent == null || !"ENABLE".equals(agent.getStatus())) {
            return null;
        }

        BigDecimal rate = agent.getCommissionRate() != null
                && agent.getCommissionRate().compareTo(BigDecimal.ZERO) > 0
                ? agent.getCommissionRate()
                : new BigDecimal("0.05");
        BigDecimal amount = order.getPayAmount().multiply(rate).setScale(2, RoundingMode.HALF_UP);

        Commission commission = new Commission();
        commission.setAgentId(agent.getId());
        commission.setOrderId(order.getId());
        commission.setOrderNo(order.getOrderNo());
        commission.setUserId(agent.getUserId());
        commission.setBuyerUserId(order.getUserId());
        commission.setAmount(amount);
        commission.setRate(rate);
        commission.setStatus("FROZEN");
        commission.setCreatedAt(LocalDateTime.now());
        commission.setUpdatedAt(LocalDateTime.now());
        commissionMapper.insert(commission);

        BigDecimal frozenBalance = agent.getFrozenBalance() != null
                ? agent.getFrozenBalance() : BigDecimal.ZERO;
        agent.setFrozenBalance(frozenBalance.add(amount));
        agent.setUpdatedAt(LocalDateTime.now());
        agentMapper.updateById(agent);

        return commission;
    }

    @Transactional
    public Commission settleCommission(Long orderId) {
        LambdaQueryWrapper<Commission> wrapper = Wrappers.<Commission>lambdaQuery()
                .eq(Commission::getOrderId, orderId)
                .eq(Commission::getStatus, "FROZEN");
        List<Commission> commissions = commissionMapper.selectList(wrapper);
        if (commissions.isEmpty()) {
            return null;
        }

        Commission commission = commissions.get(0);
        commission.setStatus("SETTLED");
        commission.setSettledAt(LocalDateTime.now());
        commission.setUpdatedAt(LocalDateTime.now());
        commissionMapper.updateById(commission);

        Agent agent = agentMapper.selectById(commission.getAgentId());
        if (agent != null) {
            BigDecimal frozenBalance = agent.getFrozenBalance() != null
                    ? agent.getFrozenBalance() : BigDecimal.ZERO;
            BigDecimal balance = agent.getBalance() != null
                    ? agent.getBalance() : BigDecimal.ZERO;
            BigDecimal totalCommission = agent.getTotalCommission() != null
                    ? agent.getTotalCommission() : BigDecimal.ZERO;

            agent.setFrozenBalance(frozenBalance.subtract(commission.getAmount()));
            agent.setBalance(balance.add(commission.getAmount()));
            agent.setTotalCommission(totalCommission.add(commission.getAmount()));
            agent.setUpdatedAt(LocalDateTime.now());
            agentMapper.updateById(agent);
        }

        return commission;
    }

    @Transactional
    public void cancelCommission(Long orderId) {
        LambdaQueryWrapper<Commission> wrapper = Wrappers.<Commission>lambdaQuery()
                .eq(Commission::getOrderId, orderId);
        List<Commission> commissions = commissionMapper.selectList(wrapper);

        for (Commission commission : commissions) {
            if ("FROZEN".equals(commission.getStatus())) {
                Agent agent = agentMapper.selectById(commission.getAgentId());
                if (agent != null) {
                    BigDecimal frozenBalance = agent.getFrozenBalance() != null
                            ? agent.getFrozenBalance() : BigDecimal.ZERO;
                    agent.setFrozenBalance(frozenBalance.subtract(commission.getAmount()));
                    agent.setUpdatedAt(LocalDateTime.now());
                    agentMapper.updateById(agent);
                }
                commission.setStatus("CANCELLED");
                commission.setCancelledAt(LocalDateTime.now());
                commission.setUpdatedAt(LocalDateTime.now());
                commissionMapper.updateById(commission);
            } else if ("SETTLED".equals(commission.getStatus())) {
                Agent agent = agentMapper.selectById(commission.getAgentId());
                if (agent != null) {
                    BigDecimal balance = agent.getBalance() != null
                            ? agent.getBalance() : BigDecimal.ZERO;
                    agent.setBalance(balance.subtract(commission.getAmount()));
                    agent.setUpdatedAt(LocalDateTime.now());
                    agentMapper.updateById(agent);
                }
                commission.setStatus("CANCELLED");
                commission.setCancelledAt(LocalDateTime.now());
                commission.setUpdatedAt(LocalDateTime.now());
                commissionMapper.updateById(commission);
            }
        }
    }

    public Map<String, Object> getCommissions(Long agentId, String status, String startDate,
                                               String endDate, int page, int pageSize) {
        LambdaQueryWrapper<Commission> wrapper = Wrappers.<Commission>lambdaQuery()
                .eq(agentId != null, Commission::getAgentId, agentId)
                .eq(status != null && !status.isBlank(), Commission::getStatus, status)
                .ge(startDate != null && !startDate.isBlank(), Commission::getCreatedAt, startDate)
                .le(endDate != null && !endDate.isBlank(), Commission::getCreatedAt, endDate)
                .orderByDesc(Commission::getCreatedAt);

        Page<Commission> pg = commissionMapper.selectPage(new Page<>(page, pageSize), wrapper);

        Map<String, Object> result = new HashMap<>();
        result.put("list", pg.getRecords());
        result.put("total", pg.getTotal());
        result.put("page", page);
        result.put("pageSize", pageSize);
        return result;
    }

    public Map<String, Object> getCommissionsAdmin(String keyword, Long agentId, String status,
                                                    String startDate, String endDate,
                                                    int page, int pageSize) {
        LambdaQueryWrapper<Commission> wrapper = Wrappers.<Commission>lambdaQuery()
                .eq(agentId != null, Commission::getAgentId, agentId)
                .eq(status != null && !status.isBlank(), Commission::getStatus, status)
                .ge(startDate != null && !startDate.isBlank(), Commission::getCreatedAt, startDate)
                .le(endDate != null && !endDate.isBlank(), Commission::getCreatedAt, endDate)
                .orderByDesc(Commission::getCreatedAt);

        if (keyword != null && !keyword.isBlank()) {
            wrapper.and(w -> w.like(Commission::getOrderNo, keyword));
        }

        Page<Commission> pg = commissionMapper.selectPage(new Page<>(page, pageSize), wrapper);

        Map<String, Object> result = new HashMap<>();
        result.put("list", pg.getRecords());
        result.put("total", pg.getTotal());
        result.put("page", page);
        result.put("pageSize", pageSize);
        return result;
    }
}
