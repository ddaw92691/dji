package com.mall.api.common.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum UserRole {

    SUPER_ADMIN("SUPER_ADMIN", "超级管理员"),
    ADMIN("ADMIN", "管理员"),
    MERCHANT("MERCHANT", "商家"),
    AGENT("AGENT", "代理商"),
    CUSTOMER("CUSTOMER", "客户");

    private final String code;
    private final String name;
}
