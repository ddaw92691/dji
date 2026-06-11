// 统一管理所有 localStorage 的 key，避免业务代码中散落魔法字符串。
// localStorage 的 key
export const STORAGE_KEYS = {
    THEME_CONFIG: 'themeConfig', // 主题配置
    LANG: 'lang', // 当前语言
    TOKEN: 'Authorization', // 用户登录 token
    COUNTRY_CODE: 'countryCode',
    LANGUAGE_CODE: 'languageCode',
};
export const storage = {
    /**
     * 从 localStorage 读取数据
     * @param key 存储键名
     * @returns 解析后的数据，不存在时返回 null
     */
    get: (key) => {
        const val = localStorage.getItem(key);
        if (!val)
            return null;
        try {
            return JSON.parse(val);
        }
        catch {
            return val;
        }
    },
    /**
     * 将数据写入 localStorage
     * @param key 存储键名
     * @param value 要存储的数据（自动序列化为 JSON）
     */
    set: (key, value) => localStorage.setItem(key, JSON.stringify(value)),
    /**
     * 删除指定 localStorage 条目
     * @param key 存储键名
     */
    remove: (key) => localStorage.removeItem(key),
    /**
     * 清空所有 localStorage 数据
     */
    clear: () => localStorage.clear(),
};
