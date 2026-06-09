package com.mall.api.modules.support.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.mall.api.modules.support.entity.SupportMessage;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface SupportMessageMapper extends BaseMapper<SupportMessage> {
}
