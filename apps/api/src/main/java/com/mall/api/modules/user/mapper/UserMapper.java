package com.mall.api.modules.user.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.mall.api.modules.user.entity.User;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

@Mapper
public interface UserMapper extends BaseMapper<User> {

    @Select("SELECT * FROM sys_user WHERE username = #{username} AND deleted = false")
    User selectByUsername(String username);

    @Select("SELECT * FROM sys_user WHERE email = #{email} AND deleted = false")
    User selectByEmail(String email);

    @Select("SELECT * FROM sys_user WHERE phone = #{phone} AND deleted = false")
    User selectByPhone(String phone);
}
