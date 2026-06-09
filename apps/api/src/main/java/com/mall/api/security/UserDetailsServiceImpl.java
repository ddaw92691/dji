package com.mall.api.security;

import com.mall.api.modules.user.entity.User;
import com.mall.api.modules.user.mapper.UserMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UserMapper userMapper;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userMapper.selectByUsername(username);
        if (user == null) {
            user = userMapper.selectByEmail(username);
        }
        if (user == null) {
            throw new UsernameNotFoundException("User not found: " + username);
        }

        if (user.getStatus() == 0) {
            throw new UsernameNotFoundException("User disabled: " + username);
        }

        return new UserPrincipal(user.getId(), user.getUsername(), user.getPassword(), user.getRole());
    }
}
