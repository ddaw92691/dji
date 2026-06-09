package com.mall.api.modules.withdrawal.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.mall.api.modules.withdrawal.entity.Withdrawal;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface WithdrawalMapper extends BaseMapper<Withdrawal> {
}
