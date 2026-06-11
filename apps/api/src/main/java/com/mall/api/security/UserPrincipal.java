package com.mall.api.security;

import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

@Getter
public class UserPrincipal implements UserDetails {

    private final Long userId;
    private final String username;
    private final String password;
    private final Collection<? extends GrantedAuthority> authorities;

    public UserPrincipal(Long userId, String username, String password, String role) {
        this(userId, username, password, role, null);
    }

    public UserPrincipal(Long userId, String username, String password, String role,
                         Collection<String> permissions) {
        this.userId = userId;
        this.username = username;
        this.password = password;
        List<GrantedAuthority> auths = new ArrayList<>();
        auths.add(new SimpleGrantedAuthority("ROLE_" + role));
        if (permissions != null) {
            for (String permission : permissions) {
                if (permission != null && !permission.isBlank()) {
                    auths.add(new SimpleGrantedAuthority(permission));
                }
            }
        }
        this.authorities = auths;
    }

    @Override
    public boolean isAccountNonExpired() { return true; }

    @Override
    public boolean isAccountNonLocked() { return true; }

    @Override
    public boolean isCredentialsNonExpired() { return true; }

    @Override
    public boolean isEnabled() { return true; }
}
