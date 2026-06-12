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

    // Withdrawal application: atomically freeze available balance.
    @Update("UPDATE merchant SET balance = COALESCE(balance,0) - #{amount}, frozen_balance = COALESCE(frozen_balance,0) + #{amount}, updated_at = NOW() " +
            "WHERE user_id = #{userId} AND deleted = false AND COALESCE(balance,0) >= #{amount}")
    int freezeForWithdrawal(@Param("userId") Long userId, @Param("amount") BigDecimal amount);

    @Select("SELECT * FROM merchant WHERE user_id = #{userId} AND deleted = false LIMIT 1")
    Merchant selectByUserId(Long userId);

    // Paid customer order funds enter frozen balance.
    @Update("UPDATE merchant SET frozen_balance = COALESCE(frozen_balance,0) + #{amount}, updated_at = NOW() " +
            "WHERE id = #{id} AND deleted = false")
    int addFrozenBalance(@Param("id") Long id, @Param("amount") BigDecimal amount);

    // Confirmed receipt: move frozen funds to available balance.
    @Update("UPDATE merchant SET frozen_balance = COALESCE(frozen_balance,0) - #{amount}, balance = COALESCE(balance,0) + #{amount}, updated_at = NOW() " +
            "WHERE id = #{id} AND deleted = false AND COALESCE(frozen_balance,0) >= #{amount}")
    int settleFrozenToBalance(@Param("id") Long id, @Param("amount") BigDecimal amount);

    // Approved withdrawal: consume frozen balance and increase withdrawn total.
    @Update("UPDATE merchant SET frozen_balance = COALESCE(frozen_balance,0) - #{amount}, total_withdrawn = COALESCE(total_withdrawn,0) + #{amount}, updated_at = NOW() " +
            "WHERE id = #{id} AND deleted = false AND COALESCE(frozen_balance,0) >= #{amount}")
    int settleFrozenWithdrawal(@Param("id") Long id, @Param("amount") BigDecimal amount);

    // Paid order cancellation: reverse frozen order funds.
    @Update("UPDATE merchant SET frozen_balance = COALESCE(frozen_balance,0) - #{amount}, updated_at = NOW() " +
            "WHERE id = #{id} AND deleted = false AND COALESCE(frozen_balance,0) >= #{amount}")
    int reverseFrozenBalance(@Param("id") Long id, @Param("amount") BigDecimal amount);

    @Update("UPDATE merchant SET balance = COALESCE(balance,0) + #{amount}, updated_at = NOW() " +
            "WHERE id = #{id} AND deleted = false")
    int increaseBalance(@Param("id") Long id, @Param("amount") BigDecimal amount);

    @Update("UPDATE merchant SET balance = COALESCE(balance,0) - #{amount}, updated_at = NOW() " +
            "WHERE id = #{id} AND deleted = false AND COALESCE(balance,0) >= #{amount}")
    int decreaseBalance(@Param("id") Long id, @Param("amount") BigDecimal amount);

    @Update("UPDATE merchant SET balance = COALESCE(balance,0) - #{amount}, frozen_balance = COALESCE(frozen_balance,0) + #{amount}, updated_at = NOW() " +
            "WHERE id = #{id} AND deleted = false AND COALESCE(balance,0) >= #{amount}")
    int freezeBalance(@Param("id") Long id, @Param("amount") BigDecimal amount);

    @Update("UPDATE merchant SET frozen_balance = COALESCE(frozen_balance,0) - #{amount}, balance = COALESCE(balance,0) + #{amount}, updated_at = NOW() " +
            "WHERE id = #{id} AND deleted = false AND COALESCE(frozen_balance,0) >= #{amount}")
    int unfreezeBalance(@Param("id") Long id, @Param("amount") BigDecimal amount);
}
