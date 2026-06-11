/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import dayjs from 'dayjs';
// 定时器
let timer = null;
// 系统日志
const logs = ref([]);
// 日志预设
const logPresets = [
    'Gateway: Incoming request from 182.16.4.21',
    'Auth: Token validation successful',
    'Service: Node-14 reported latency > 200ms',
    'DB: Slow query detected (152ms)',
    'Cache: Purge successful for key: user_profile_882',
    'Security: Multiple login attempts detected',
];
// 定时添加日志
const addLog = () => {
    const level = (Math.random() > 0.85 ? (Math.random() > 0.5 ? 'WARN' : 'ERROR') : 'INFO');
    const randomContent = logPresets[Math.floor(Math.random() * logPresets.length)];
    logs.value.unshift({
        time: dayjs().format('HH:mm:ss.SSS'),
        level,
        content: randomContent || '',
    });
    if (logs.value.length > 50)
        logs.value.pop();
};
const tags = (level) => {
    switch (level) {
        case 'INFO':
            return 'bg-(--el-color-success)';
        case 'WARN':
            return 'bg-(--el-color-warning)';
        case 'ERROR':
            return 'bg-(--el-color-danger)';
        default:
            return 'bg-(--el-color-primary)';
    }
};
onMounted(() => {
    timer = setInterval(() => {
        addLog();
    }, 2000);
});
onUnmounted(() => {
    if (timer)
        clearInterval(timer);
});
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
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    title: "系统实时流水日志",
    titleIcon: "HOutline:DocumentTextIcon",
}));
const __VLS_2 = __VLS_1({
    title: "系统实时流水日志",
    titleIcon: "HOutline:DocumentTextIcon",
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_5;
const { default: __VLS_6 } = __VLS_3.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "bg-(--el-bg-color-page) p-3 rounded-2xl border border-(--el-border-color-extra-light)" },
});
/** @type {__VLS_StyleScopedClasses['bg-(--el-bg-color-page)']} */ ;
/** @type {__VLS_StyleScopedClasses['p-3']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-2xl']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-(--el-border-color-extra-light)']} */ ;
let __VLS_7;
/** @ts-ignore @type { | typeof __VLS_components.elScrollbar | typeof __VLS_components.ElScrollbar | typeof __VLS_components['el-scrollbar'] | typeof __VLS_components.elScrollbar | typeof __VLS_components.ElScrollbar | typeof __VLS_components['el-scrollbar']} */
elScrollbar;
// @ts-ignore
const __VLS_8 = __VLS_asFunctionalComponent1(__VLS_7, new __VLS_7({
    height: (280),
}));
const __VLS_9 = __VLS_8({
    height: (280),
}, ...__VLS_functionalComponentArgsRest(__VLS_8));
const { default: __VLS_12 } = __VLS_10.slots;
for (const [log, index] of __VLS_vFor((__VLS_ctx.logs))) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        key: (index),
        ...{ class: "flex items-center gap-3 text-sm text-(--el-text-color-secondary) hover:bg-(--el-bg-color-overlay) p-1.5 rounded-lg cursor-pointer" },
    });
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['items-center']} */ ;
    /** @type {__VLS_StyleScopedClasses['gap-3']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-(--el-text-color-secondary)']} */ ;
    /** @type {__VLS_StyleScopedClasses['hover:bg-(--el-bg-color-overlay)']} */ ;
    /** @type {__VLS_StyleScopedClasses['p-1.5']} */ ;
    /** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
    /** @type {__VLS_StyleScopedClasses['cursor-pointer']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "shrink-0" },
    });
    /** @type {__VLS_StyleScopedClasses['shrink-0']} */ ;
    (log.time);
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "text-xs text-white font-medium px-2 py-1 rounded-md uppercase" },
        ...{ class: (__VLS_ctx.tags(log.level)) },
    });
    /** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-white']} */ ;
    /** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
    /** @type {__VLS_StyleScopedClasses['px-2']} */ ;
    /** @type {__VLS_StyleScopedClasses['py-1']} */ ;
    /** @type {__VLS_StyleScopedClasses['rounded-md']} */ ;
    /** @type {__VLS_StyleScopedClasses['uppercase']} */ ;
    (log.level);
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "text-(--el-text-color-regular)" },
    });
    /** @type {__VLS_StyleScopedClasses['text-(--el-text-color-regular)']} */ ;
    (log.content);
    // @ts-ignore
    [logs, tags,];
}
// @ts-ignore
[];
var __VLS_10;
// @ts-ignore
[];
var __VLS_3;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
