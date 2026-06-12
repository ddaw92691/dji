import axios from 'axios';
import { ElMessage } from 'element-plus';
import router from '@/router';
import { STORAGE_KEYS, storage } from '@/utils/storage';
// 创建 axios 实例
const service = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json;charset=UTF-8',
    },
});
// 请求拦截器
service.interceptors.request.use((config) => {
    const token = storage.get(STORAGE_KEYS.TOKEN);
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    // 总后台固定简体中文：请求头也固定传 zh-Hans，避免后端错误提示回退英文。
    config.headers['Accept-Language'] = 'zh-CN';
    config.headers['X-Locale'] = 'zh-CN';
    config.headers['X-Country-Code'] = 'CN';
    config.headers['X-Language-Code'] = 'zh-Hans';
    return config;
}, (error) => {
    return Promise.reject(error);
});
// 响应拦截器
service.interceptors.response.use((response) => {
    const { code, message } = response.data;
    // 业务层错误码（HTTP 200 但 body.code 表示异常）
    if (code === 401) {
        ElMessage.error('登录已过期，请重新登录');
        storage.remove(STORAGE_KEYS.TOKEN);
        router.push('/login');
    }
    else if (code === 403) {
        ElMessage.error('没有权限访问');
    }
    else if (code === 500) {
        ElMessage.error(message || '服务器异常，请稍后重试');
    }
    return response;
}, (error) => {
    let errorMessage = '请求失败';
    if (error.response) {
        const backendMsg = error.response.data?.message;
        switch (error.response.status) {
            case 401:
                errorMessage = '登录已过期，请重新登录';
                storage.remove(STORAGE_KEYS.TOKEN);
                router.push('/login');
                break;
            case 403:
                errorMessage = '没有权限访问';
                break;
            case 404:
                errorMessage = '接口不存在';
                break;
            case 500:
                errorMessage = backendMsg || '服务器异常，请稍后重试';
                break;
            default:
                errorMessage = backendMsg || `请求失败(${error.response.status})`;
        }
    }
    else if (error.request) {
        errorMessage = '网络连接失败，请检查服务是否正常';
    }
    else {
        errorMessage = error.message || '请求失败';
    }
    ElMessage.error(errorMessage);
    return Promise.reject(error);
});
// 请求方法对象
const request = {
    /**
     * GET 请求
     * @param url 请求地址
     * @param config 请求配置（可选）
     * @returns Promise<AxiosResponse>
     */
    get(url, config) {
        return service.get(url, config);
    },
    /**
     * POST 请求
     * @param url 请求地址
     * @param data 请求体数据（可选）
     * @param config 请求配置（可选）
     * @returns Promise<AxiosResponse>
     */
    post(url, data, config) {
        return service.post(url, data, config);
    },
    /**
     * PUT 请求
     * @param url 请求地址
     * @param data 请求体数据（可选）
     * @param config 请求配置（可选）
     * @returns Promise<AxiosResponse>
     */
    put(url, data, config) {
        return service.put(url, data, config);
    },
    /**
     * DELETE 请求
     * @param url 请求地址
     * @param config 请求配置（可选）
     * @returns Promise<AxiosResponse>
     */
    delete(url, config) {
        return service.delete(url, config);
    },
};
export default request;
export { service };
