package com.mall.api.modules.customer.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.mall.api.modules.customer.entity.CustomerProfile;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface CustomerProfileMapper extends BaseMapper<CustomerProfile> {
}
