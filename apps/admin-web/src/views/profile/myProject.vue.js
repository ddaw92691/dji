/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
// 项目列表
const projects = ref([
    {
        id: 7,
        name: '企业数据仓库',
        desc: '统一企业级数据仓库，支持多源数据整合与高性能查询。',
        time: '2025-09-30',
        icon: 'HOutline:TruckIcon',
        color: '#6366f1',
        progress: 100,
        status: 'completed',
        members: [
            { name: 'Charlotte', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Charlotte0' },
            { name: 'Henry', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Henry1' },
            { name: 'Alexander', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alexander2' },
        ],
    },
    {
        id: 1,
        name: 'Vue Admin Next',
        desc: '基于 Vue 3 + Element Plus 的中后台管理系统，目前进入 Beta 测试阶段。基于 Vue 3 + Element Plus 的中后台管理系统，目前进入 Beta 测试阶段。',
        time: '2025-12-01',
        icon: 'HOutline:ComputerDesktopIcon',
        color: '#4f46e5',
        progress: 85,
        status: 'in_progress',
        members: [
            { name: 'Oliver', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Oliver0' },
            { name: 'Sophia', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sophia1' },
            { name: 'Liam', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Liam2' },
            { name: 'Emma', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma3' },
            { name: 'Alexander', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alexander2' },
            { name: 'Lucas', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lucas2' },
        ],
    },
    {
        id: 9,
        name: '智能客服系统',
        desc: '基于 AI 的智能客服平台，可自动回答用户问题并支持多语言。',
        time: '2026-02-01',
        icon: 'HOutline:BugAntIcon',
        color: '#f43f5e',
        progress: 0,
        status: 'not_started',
        members: [
            { name: 'Jack', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jack0' },
            { name: 'Luna', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Luna1' },
        ],
    },
    {
        id: 8,
        name: '新零售分析平台',
        desc: '基于大数据与 AI 的新零售智能分析平台，提升业务决策效率。',
        time: '2025-10-10',
        icon: 'HOutline:ChartBarIcon',
        color: '#22c55e',
        progress: 100,
        status: 'completed',
        members: [
            { name: 'Aria', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aria0' },
            { name: 'Benjamin', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Benjamin1' },
            { name: 'Ella', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ella2' },
        ],
    },
    {
        id: 2,
        name: 'AI 数据中心',
        desc: '利用 LLM 大模型进行深度数据清洗与多维度智能化分析平台。',
        time: '2026-01-05',
        icon: 'HOutline:RocketLaunchIcon',
        color: '#10b981',
        progress: 45,
        status: 'in_progress',
        members: [
            { name: 'Emma', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma0' },
            { name: 'Noah', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Noah1' },
            { name: 'Ava', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ava2' },
            { name: 'Charlotte', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Charlotte0' },
            { name: 'Henry', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Henry1' },
            { name: 'Alexander', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alexander2' },
        ],
    },
    {
        id: 10,
        name: '区块链身份验证',
        desc: '企业级区块链身份验证系统，保障数据安全与用户隐私。',
        time: '2026-03-01',
        icon: 'HOutline:ShieldCheckIcon',
        color: '#f59e0b',
        progress: 0,
        status: 'not_started',
        members: [
            { name: 'Leo', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Leo0' },
            { name: 'Nora', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Nora1' },
            { name: 'Ella', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ella2' },
        ],
    },
    {
        id: 3,
        name: 'DFAN 移动端',
        desc: '全新的 React Native 跨平台应用，完美适配 iOS 和 Android。',
        time: '2025-11-20',
        icon: 'HOutline:DevicePhoneMobileIcon',
        color: '#f59e0b',
        progress: 72,
        status: 'in_progress',
        members: [
            { name: 'Elijah', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elijah0' },
            { name: 'Isabella', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Isabella1' },
        ],
    },
    {
        id: 4,
        name: '自动化测试云',
        desc: '基于 Playwright 的云端自动化测试框架，大幅提升 CI/CD 交付效率。',
        time: '2026-01-08',
        icon: 'HOutline:Cog6ToothIcon',
        color: '#ef4444',
        progress: 94,
        status: 'in_progress',
        members: [
            { name: 'Mia', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mia0' },
            { name: 'Mason', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mason1' },
            { name: 'Amelia', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Amelia2' },
        ],
    },
    {
        id: 5,
        name: '低代码引擎',
        desc: '可视化图形化拖拽搭建工具，支持复杂业务逻辑配置。',
        time: '2025-10-15',
        icon: 'HOutline:RectangleStackIcon',
        color: '#8b5cf6',
        progress: 30,
        status: 'in_progress',
        members: [
            { name: 'Ethan', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ethan0' },
            { name: 'Harper', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Harper1' },
            { name: 'Logan', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Logan2' },
            { name: 'Emma', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma0' },
            { name: 'Noah', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Noah1' },
            { name: 'Ava', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ava2' },
            { name: 'Charlotte', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Charlotte0' },
            { name: 'Henry', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Henry1' },
            { name: 'Alexander', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alexander2' },
        ],
    },
    {
        id: 6,
        name: '监控告警 2.0',
        desc: '全方位分布式系统性能监控，支持毫秒级异常预警与链路追踪。',
        time: '2026-01-02',
        icon: 'HOutline:BellIcon',
        color: '#06b6d4',
        progress: 68,
        status: 'in_progress',
        members: [
            { name: 'Evelyn', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Evelyn0' },
            { name: 'James', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James1' },
            { name: 'Abigail', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Abigail2' },
        ],
    },
]);
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
let __VLS_0;
/** @ts-ignore @type { | typeof __VLS_components.BaseCard | typeof __VLS_components.BaseCard} */
BaseCard;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({}));
const __VLS_2 = __VLS_1({}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_5;
const { default: __VLS_6 } = __VLS_3.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-5" },
});
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['grid-cols-[repeat(auto-fill,minmax(300px,1fr))]']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-5']} */ ;
for (const [project] of __VLS_vFor((__VLS_ctx.projects))) {
    let __VLS_7;
    /** @ts-ignore @type { | typeof __VLS_components.ProjectCard} */
    ProjectCard;
    // @ts-ignore
    const __VLS_8 = __VLS_asFunctionalComponent1(__VLS_7, new __VLS_7({
        key: (project.id),
        project: (project),
    }));
    const __VLS_9 = __VLS_8({
        key: (project.id),
        project: (project),
    }, ...__VLS_functionalComponentArgsRest(__VLS_8));
    // @ts-ignore
    [projects,];
}
// @ts-ignore
[];
var __VLS_3;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
