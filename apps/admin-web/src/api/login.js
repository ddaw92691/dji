import request from '@/utils/request';
export const login = (params) => {
    return request.post('/auth/login', params);
};
export const userPermissions = () => {
    return request.get('/auth/permissions');
};
export const userInfoRequest = () => {
    return request.get('/auth/me');
};
export const registerUser = (params) => {
    return request.post('/auth/register', params);
};
