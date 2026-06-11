// 匹配所有 views 下的 vue 文件
const modules = import.meta.glob('@/views/**/*.vue');
// 组件名称
const componentName = (path) => {
    return (path
        .split('/')
        .filter(Boolean)
        .map((segment) => segment
        .split('-')
        .filter(Boolean)
        .map((part) => part.charAt(0).toUpperCase() + part.substring(1))
        .join(''))
        .join('') + 'View');
};
export const menuToRoute = (menuList) => {
    const dynamicRoute = [];
    menuList.forEach((menu) => {
        if (menu.type === 'menu') {
            // 删除path开头连续的/
            const path = menu.path.replace(/^\/+/, '');
            dynamicRoute.push({
                path,
                name: componentName(path),
                component: modules[`/src/views/${path}/index.vue`],
                meta: {
                    icon: menu.icon,
                    title: menu.title,
                    id: menu.id,
                    parentId: menu.parentId,
                    keepAlive: true,
                },
            });
        }
        if (menu.type === 'directory' && menu.children?.length) {
            dynamicRoute.push(...menuToRoute(menu.children));
        }
    });
    return dynamicRoute;
};
