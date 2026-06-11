/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ArrowRight } from '@element-plus/icons-vue';
defineOptions({ name: 'BreadcrumbView' });
const props = withDefaults(defineProps(), {
    showIcon: true,
});
const route = useRoute();
const menuStore = useMenuStore();
// 从菜单列表中根据 path 递归查找节点
const findMenuByPath = (menus, path) => {
    for (const item of menus) {
        // 只匹配 type 为 'menu' 的项（实际页面路由）
        if (item.type === 'menu' && item.path === path) {
            return item;
        }
        // 递归查找子菜单
        if (item.children?.length) {
            const child = findMenuByPath(item.children, path);
            if (child)
                return child;
        }
    }
    return null;
};
// 查找首页菜单项（path 为 '/' 或 '/home'）
const findHomeMenu = (menus) => {
    for (const item of menus) {
        // 检查是否为首页（path 为 '/' 或 '/home'）
        if (item.type === 'menu' && (item.path === '/' || item.path === '/dashboard/home')) {
            return item;
        }
        // 递归查找子菜单
        if (item.children?.length) {
            const child = findHomeMenu(item.children);
            if (child)
                return child;
        }
    }
    return null;
};
// 构建 id -> menuItem 的映射，用于快速查找父节点
const buildMenuMap = (menus, map = new Map()) => {
    menus.forEach((item) => {
        map.set(item.id, item);
        if (item.children?.length) {
            buildMenuMap(item.children, map);
        }
    });
    return map;
};
// 根据 parentId 向上回溯，构建面包屑路径
const buildBreadcrumbPath = (current, menuMap) => {
    const path = [];
    let node = current;
    while (node) {
        // 只添加 type 为 'directory' 或 'menu' 的项到面包屑
        if (node.type === 'directory' || node.type === 'menu') {
            path.unshift({
                id: node.id,
                title: node.title,
                path: node.path || '#',
                icon: node.icon,
            });
        }
        // 向上查找父节点
        node = node.parentId && menuMap.has(node.parentId) ? menuMap.get(node.parentId) : null;
    }
    return path;
};
// 计算面包屑列表
const breadcrumbList = computed(() => {
    // 如果菜单列表为空，返回空数组
    if (!menuStore.menuList.length)
        return [];
    // 查找当前路由对应的菜单项
    const currentMenu = findMenuByPath(menuStore.menuList, route.path);
    // 如果找不到菜单项，尝试从路由 meta 中获取信息（处理不在菜单中的页面，如403、404、个人中心等）
    if (!currentMenu) {
        const path = [];
        // 查找首页菜单项
        const homeMenu = findHomeMenu(menuStore.menuList);
        // 如果找到首页，先添加首页
        if (homeMenu && route.path !== homeMenu.path) {
            path.push({
                id: homeMenu.id,
                title: homeMenu.title,
                path: homeMenu.path || '/',
                icon: homeMenu.icon,
            });
        }
        // 从路由 meta 中获取当前页面的标题
        const routeTitle = route.meta?.title;
        if (routeTitle) {
            path.push({
                id: route.name || route.path,
                title: routeTitle,
                path: route.path,
                icon: route.meta?.icon,
            });
        }
        return path;
    }
    // 构建菜单映射
    const menuMap = buildMenuMap(menuStore.menuList);
    // 构建面包屑路径
    const path = buildBreadcrumbPath(currentMenu, menuMap);
    // 查找首页菜单项
    const homeMenu = findHomeMenu(menuStore.menuList);
    // 如果找到首页且当前路径不是首页，则在开头添加首页
    if (homeMenu && route.path !== homeMenu.path) {
        // 检查面包屑路径中是否已包含首页（避免重复）
        const hasHome = path.some((item) => item.id === homeMenu.id);
        if (!hasHome) {
            path.unshift({
                id: homeMenu.id,
                title: homeMenu.title,
                path: homeMenu.path || '/',
                icon: homeMenu.icon,
            });
        }
    }
    return path;
});
const __VLS_defaults = {
    showIcon: true,
};
const __VLS_ctx = {
    ...{},
    ...{},
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
if (__VLS_ctx.breadcrumbList.length > 0) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "breadcrumb-container" },
    });
    /** @type {__VLS_StyleScopedClasses['breadcrumb-container']} */ ;
    let __VLS_0;
    /** @ts-ignore @type { | typeof __VLS_components.elBreadcrumb | typeof __VLS_components.ElBreadcrumb | typeof __VLS_components['el-breadcrumb'] | typeof __VLS_components.elBreadcrumb | typeof __VLS_components.ElBreadcrumb | typeof __VLS_components['el-breadcrumb']} */
    elBreadcrumb;
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
        separator: ">",
        separatorIcon: (__VLS_ctx.ArrowRight),
    }));
    const __VLS_2 = __VLS_1({
        separator: ">",
        separatorIcon: (__VLS_ctx.ArrowRight),
    }, ...__VLS_functionalComponentArgsRest(__VLS_1));
    const { default: __VLS_5 } = __VLS_3.slots;
    for (const [item, index] of __VLS_vFor((__VLS_ctx.breadcrumbList))) {
        let __VLS_6;
        /** @ts-ignore @type { | typeof __VLS_components.elBreadcrumbItem | typeof __VLS_components.ElBreadcrumbItem | typeof __VLS_components['el-breadcrumb-item'] | typeof __VLS_components.elBreadcrumbItem | typeof __VLS_components.ElBreadcrumbItem | typeof __VLS_components['el-breadcrumb-item']} */
        elBreadcrumbItem;
        // @ts-ignore
        const __VLS_7 = __VLS_asFunctionalComponent1(__VLS_6, new __VLS_6({
            key: (item.id),
            to: (index < __VLS_ctx.breadcrumbList.length - 1 ? { path: item.path } : undefined),
        }));
        const __VLS_8 = __VLS_7({
            key: (item.id),
            to: (index < __VLS_ctx.breadcrumbList.length - 1 ? { path: item.path } : undefined),
        }, ...__VLS_functionalComponentArgsRest(__VLS_7));
        const { default: __VLS_11 } = __VLS_9.slots;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "breadcrumb-item" },
        });
        /** @type {__VLS_StyleScopedClasses['breadcrumb-item']} */ ;
        if (props.showIcon && item.icon) {
            let __VLS_12;
            /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
            elIcon;
            // @ts-ignore
            const __VLS_13 = __VLS_asFunctionalComponent1(__VLS_12, new __VLS_12({
                ...{ class: "breadcrumb-icon" },
            }));
            const __VLS_14 = __VLS_13({
                ...{ class: "breadcrumb-icon" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_13));
            /** @type {__VLS_StyleScopedClasses['breadcrumb-icon']} */ ;
            const { default: __VLS_17 } = __VLS_15.slots;
            const __VLS_18 = (__VLS_ctx.menuStore.iconComponents[item.icon]);
            // @ts-ignore
            const __VLS_19 = __VLS_asFunctionalComponent1(__VLS_18, new __VLS_18({}));
            const __VLS_20 = __VLS_19({}, ...__VLS_functionalComponentArgsRest(__VLS_19));
            // @ts-ignore
            [breadcrumbList, breadcrumbList, breadcrumbList, ArrowRight, menuStore,];
            var __VLS_15;
        }
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
        (item.title);
        // @ts-ignore
        [];
        var __VLS_9;
        // @ts-ignore
        [];
    }
    // @ts-ignore
    [];
    var __VLS_3;
}
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    __defaults: __VLS_defaults,
    __typeProps: {},
});
export default {};
