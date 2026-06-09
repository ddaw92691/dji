package com.mall.api.modules.commission.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.mall.api.modules.commission.entity.Commission;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface CommissionMapper extends BaseMapper<Commission> {

    @Select("SELECT * FROM commission WHERE order_id = #{orderId}")
    List<Commission> selectByOrderId(Long orderId);

    @Select("SELECT * FROM commission WHERE agent_id = #{agentId} AND status = 'FROZEN'")
    List<Commission> selectFrozenByAgentId(Long agentId);
}
