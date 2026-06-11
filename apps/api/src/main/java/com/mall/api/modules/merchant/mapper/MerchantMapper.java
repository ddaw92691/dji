package com.mall.api.modules.merchant.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.mall.api.modules.merchant.entity.Merchant;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import java.math.BigDecimal;

@Mapper
public interface MerchantMapper extends BaseMapper<Merchant> {

    // 提现：原子冻结（余额够才扣）
    @Update("UPDATE merchant SET balance = balance - #{amount}, frozen_balance = COALESCE(frozen_balance,0) + #{amount}, updated_at = NOW() " +
            "WHERE user_id = #{userId} AND balance >= #{amount}")
    int freezeForWithdrawal(@Param("userId") Long userId, @Param("amount") BigDecimal amount);

    @Select("SELECT * FROM merchant WHERE user_id = #{userId} AND deleted = false LIMIT 1")
    Merchant selectByUserId(Long userId);

    // 支付：货款进入冻结余额
    @Update("UPDATE merchant SET frozen_balance = COALESCE(frozen_balance,0) + #{amount}, updated_at = NOW() WHERE id = #{id}")
    int addFrozenBalance(@Param("id") Long id, @Param("amount") BigDecimal amount);

    // 确认收货：冻结结算到可用余额
    @Update("UPDATE merchant SET frozen_balance = COALESCE(frozen_balance,0) - #{amount}, balance = COALESCE(balance,0) + #{amount}, updated_at = NOW() WHERE id = #{id}")
    int settleFrozenToBalance(@Param("id") Long id, @Param("amount") BigDecimal amount);

    // 已支付订单取消：回退冻结余额
    @Update("UPDATE merchant SET frozen_balance = COALESCE(frozen_balance,0) - #{amount}, updated_at = NOW() WHERE id = #{id}")
    int reverseFrozenBalance(@Param("id") Long id, @Param("amount") BigDecimal amount);

    // 资金调整：增加可用余额
    @Update("UPDATE merchant SET balance = COALESCE(balance,0) + #{amount}, updated_at = NOW() WHERE id = #{id} AND deleted = false")
    int increaseBalance(@Param("id") Long id, @Param("amount") BigDecimal amount);

    // 资金调整：扣减可用余额（余额够才扣，原子防透支）
    @Update("UPDATE merchant SET balance = balance - #{amount}, updated_at = NOW() WHERE id = #{id} AND deleted = false AND balance >= #{amount}")
    int decreaseBalance(@Param("id") Long id, @Param("amount") BigDecimal amount);

    @Update("UPDATE merchant SET balance = COALESCE(balance,0) - #{amount}, frozen_balance = COALESCE(frozen_balance,0) + #{amount}, updated_at = NOW() WHERE id = #{id} AND deleted = false AND COALESCE(balance,0) >= #{amount}")
    int freezeBalance(@Param("id") Long id, @Param("amount") BigDecimal amount);

    @Update("UPDATE merchant SET frozen_balance = COALESCE(frozen_balance,0) - #{amount}, balance = COALESCE(balance,0) + #{amount}, updated_at = NOW() WHERE id = #{id} AND deleted = false AND COALESCE(frozen_balance,0) >= #{amount}")
    int unfreezeBalance(@Param("id") Long id, @Param("amount") BigDecimal amount);
}
