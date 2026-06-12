package com.mall.api.modules.agent.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.mall.api.modules.agent.entity.Agent;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Update;

import java.math.BigDecimal;

@Mapper
public interface AgentMapper extends BaseMapper<Agent> {

    @Update("UPDATE agent SET balance = COALESCE(balance,0) - #{amount}, frozen_balance = COALESCE(frozen_balance,0) + #{amount}, updated_at = NOW() " +
            "WHERE user_id = #{userId} AND deleted = false AND COALESCE(balance,0) >= #{amount}")
    int freezeForWithdrawal(@Param("userId") Long userId, @Param("amount") BigDecimal amount);

    @Update("UPDATE agent SET frozen_balance = COALESCE(frozen_balance,0) - #{amount}, total_withdrawn = COALESCE(total_withdrawn,0) + #{amount}, updated_at = NOW() " +
            "WHERE user_id = #{userId} AND deleted = false AND COALESCE(frozen_balance,0) >= #{amount}")
    int settleFrozenWithdrawal(@Param("userId") Long userId, @Param("amount") BigDecimal amount);

    @Update("UPDATE agent SET frozen_balance = COALESCE(frozen_balance,0) - #{amount}, balance = COALESCE(balance,0) + #{amount}, updated_at = NOW() " +
            "WHERE user_id = #{userId} AND deleted = false AND COALESCE(frozen_balance,0) >= #{amount}")
    int unfreezeWithdrawal(@Param("userId") Long userId, @Param("amount") BigDecimal amount);
}
