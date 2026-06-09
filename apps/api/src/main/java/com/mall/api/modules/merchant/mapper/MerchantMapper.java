package com.mall.api.modules.merchant.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.mall.api.modules.merchant.entity.Merchant;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Update;

import java.math.BigDecimal;

@Mapper
public interface MerchantMapper extends BaseMapper<Merchant> {

    // 提现：原子冻结（余额够才扣）
    @Update("UPDATE merchant SET balance = balance - #{amount}, frozen_balance = COALESCE(frozen_balance,0) + #{amount}, updated_at = NOW() " +
            "WHERE user_id = #{userId} AND balance >= #{amount}")
    int freezeForWithdrawal(@Param("userId") Long userId, @Param("amount") BigDecimal amount);

    // 支付：货款进入冻结余额
    @Update("UPDATE merchant SET frozen_balance = COALESCE(frozen_balance,0) + #{amount}, updated_at = NOW() WHERE id = #{id}")
    int addFrozenBalance(@Param("id") Long id, @Param("amount") BigDecimal amount);

    // 确认收货：冻结结算到可用余额
    @Update("UPDATE merchant SET frozen_balance = COALESCE(frozen_balance,0) - #{amount}, balance = COALESCE(balance,0) + #{amount}, updated_at = NOW() WHERE id = #{id}")
    int settleFrozenToBalance(@Param("id") Long id, @Param("amount") BigDecimal amount);

    // 已支付订单取消：回退冻结余额
    @Update("UPDATE merchant SET frozen_balance = COALESCE(frozen_balance,0) - #{amount}, updated_at = NOW() WHERE id = #{id}")
    int reverseFrozenBalance(@Param("id") Long id, @Param("amount") BigDecimal amount);
}