package com.mall.api.security;

import com.mall.api.modules.user.entity.User;
import com.mall.api.modules.user.mapper.UserMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.concurrent.ConcurrentHashMap;

@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {

    /** 缓存有效期：60 秒 */
    private static final long CACHE_TTL_MILLIS = 60_000L;

    private final UserMapper userMapper;

    /** 轻量级 TTL 缓存，避免每次鉴权都查库（禁用/改密后最长 60 秒生效）。 */
    private final ConcurrentHashMap<String, CacheEntry> cache = new ConcurrentHashMap<>();

    private record CacheEntry(UserDetails details, long expireAt) {
        boolean expired() {
            return System.currentTimeMillis() > expireAt;
        }
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        CacheEntry entry = cache.get(username);
        if (entry != null && !entry.expired()) {
            return entry.details();
        }
        UserDetails details = doLoad(username);
        cache.put(username, new CacheEntry(details, System.currentTimeMillis() + CACHE_TTL_MILLIS));
        return details;
    }

    /** 用户被禁用 / 修改密码后，可主动清除缓存使其立即生效。 */
    public void evict(String username) {
        cache.remove(username);
    }

    private UserDetails doLoad(String username) {
        User user = userMapper.selectByUsername(username);
        if (user == null) {
            user = userMapper.selectByEmail(username);
        }
        if (user == null) {
            throw new UsernameNotFoundException("User not found: " + username);
        }
        if (user.getStatus() != null && user.getStatus() == 0) {   // ← 顺手修了这里的拆箱 NPE
            throw new UsernameNotFoundException("User disabled: " + username);
        }
        return new UserPrincipal(user.getId(), user.getUsername(), user.getPassword(), user.getRole());
    }
}
