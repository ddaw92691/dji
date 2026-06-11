package com.mall.api.security;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

/**
 * 方法级权限检查器，配合 {@code @PreAuthorize("@perm.has('xxx')")} 使用。
 *
 * <p>规则：超级管理员(ROLE_SUPER_ADMIN)放行一切；其余用户必须在其角色被授权的
 * 菜单/按钮权限码(sys_role_menu → sys_menu.permission)中包含目标权限码，否则拒绝。
 * 权限码由 {@link UserDetailsServiceImpl} 加载进 {@link UserPrincipal} 的 authorities。</p>
 */
@Component("perm")
public class PermissionChecker {

    public boolean has(String code) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || code == null) {
            return false;
        }
        for (GrantedAuthority authority : auth.getAuthorities()) {
            String value = authority.getAuthority();
            if ("ROLE_SUPER_ADMIN".equals(value)) {
                return true;
            }
            if (code.equals(value)) {
                return true;
            }
        }
        return false;
    }

    public boolean hasAny(String... codes) {
        if (codes == null) {
            return false;
        }
        for (String code : codes) {
            if (has(code)) {
                return true;
            }
        }
        return false;
    }
}
