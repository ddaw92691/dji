import axios from 'axios';
import { ElMessage } from 'element-plus';
import router from '@/router';
import { useLangStore } from '@/stores/lang';
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
    const langStore = useLangStore();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    // 将当前应用语言统一传给后端
    // Accept-Language 是标准 HTTP 头，后端通常可以直接识别。
    // X-Locale 是额外补充的业务头，便于后端在需要时做更明确的自定义处理。
    // 这里统一传递 langStore.currentLang，避免请求层与 i18n 层使用不同的语言参数。
    config.headers['Accept-Language'] = langStore.currentLang;
    config.headers['X-Locale'] = langStore.currentLang;
    config.headers['X-Country-Code'] = storage.get(STORAGE_KEYS.COUNTRY_CODE) || 'US';
    config.headers['X-Language-Code'] = storage.get(STORAGE_KEYS.LANGUAGE_CODE) || 'en';
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
