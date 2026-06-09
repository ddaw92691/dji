package com.mall.api.modules.auth.service;

import com.mall.api.modules.auth.dto.*;

public interface AuthService {

    LoginResponse login(LoginRequest request);

    LoginResponse register(RegisterRequest request);

    UserInfo getCurrentUser();

    PermissionsResponse getPermissions(String role);
}
