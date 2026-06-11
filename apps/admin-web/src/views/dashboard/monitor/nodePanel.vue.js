/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
// 定时器
let timer = null;
// 初始化节点数组
const nodes = ref([]);
// 计算各状态节点数量
const successCount = computed(() => nodes.value.filter((node) => node.status === 'success').length);
const warningCount = computed(() => nodes.value.filter((node) => node.status === 'warning').length);
const dangerCount = computed(() => nodes.value.filter((node) => node.status === 'danger').length);
/**
 * 随机生成节点状态
 */
const generateNodes = () => {
    nodes.value = Array.from({ length: 96 }, (_, i) => {
        const rand = Math.random();
        let status = 'success';
        if (rand > 0.85)
            status = 'warning'; // 约 10%
        if (rand > 0.95)
            status = 'danger'; // 约 5%
        return { id: i, status };
    });
};
onMounted(() => {
    generateNodes();
    timer = setInterval(generateNodes, 5000);
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
    title: "服务集群健康状态",
    titleIcon: "HOutline:Squares2X2Icon",
}));
const __VLS_2 = __VLS_1({
    title: "服务集群健康状态",
    titleIcon: "HOutline:Squares2X2Icon",
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_5;
const { default: __VLS_6 } = __VLS_3.slots;
{
    const { 'header-right': __VLS_7 } = __VLS_3.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "text-sm font-semibold text-(--el-color-primary)" },
    });
    /** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
    /** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-(--el-color-primary)']} */ ;
    (__VLS_ctx.nodes.length);
    // @ts-ignore
    [nodes,];
}
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
let __VLS_8;
/** @ts-ignore @type { | typeof __VLS_components.elScrollbar | typeof __VLS_components.ElScrollbar | typeof __VLS_components['el-scrollbar'] | typeof __VLS_components.elScrollbar | typeof __VLS_components.ElScrollbar | typeof __VLS_components['el-scrollbar']} */
elScrollbar;
// @ts-ignore
const __VLS_9 = __VLS_asFunctionalComponent1(__VLS_8, new __VLS_8({
    height: (347),
}));
const __VLS_10 = __VLS_9({
    height: (347),
}, ...__VLS_functionalComponentArgsRest(__VLS_9));
const { default: __VLS_13 } = __VLS_11.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "grid grid-cols-[repeat(auto-fill,minmax(45px,1fr))] gap-2.5" },
});
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['grid-cols-[repeat(auto-fill,minmax(45px,1fr))]']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2.5']} */ ;
for (const [item] of __VLS_vFor((__VLS_ctx.nodes))) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        key: (item.id),
        ...{ class: "aspect-square rounded-lg transition-all duration-300" },
        ...{ class: ([
                item.status === 'success' && 'bg-(--el-color-success)',
                item.status === 'warning' && 'bg-(--el-color-warning)',
                item.status === 'danger' && 'bg-(--el-color-danger) danger-blink',
            ]) },
    });
    /** @type {__VLS_StyleScopedClasses['aspect-square']} */ ;
    /** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
    /** @type {__VLS_StyleScopedClasses['transition-all']} */ ;
    /** @type {__VLS_StyleScopedClasses['duration-300']} */ ;
    // @ts-ignore
    [nodes,];
}
// @ts-ignore
[];
var __VLS_11;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "mt-4 pt-5 text-(--el-text-color-secondary) font-semibold flex justify-center gap-4 border-t border-dashed border-(--el-border-color-light)" },
});
/** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
/** @type {__VLS_StyleScopedClasses['pt-5']} */ ;
/** @type {__VLS_StyleScopedClasses['text-(--el-text-color-secondary)']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-4']} */ ;
/** @type {__VLS_StyleScopedClasses['border-t']} */ ;
/** @type {__VLS_StyleScopedClasses['border-dashed']} */ ;
/** @type {__VLS_StyleScopedClasses['border-(--el-border-color-light)']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "flex gap-2 items-center text-xs" },
});
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.i, __VLS_intrinsics.i)({
    ...{ class: "w-2 h-2 rounded-full bg-(--el-color-success)" },
});
/** @type {__VLS_StyleScopedClasses['w-2']} */ ;
/** @type {__VLS_StyleScopedClasses['h-2']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-(--el-color-success)']} */ ;
(__VLS_ctx.successCount);
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "flex gap-2 items-center text-xs" },
});
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.i, __VLS_intrinsics.i)({
    ...{ class: "w-2 h-2 rounded-full bg-(--el-color-warning)" },
});
/** @type {__VLS_StyleScopedClasses['w-2']} */ ;
/** @type {__VLS_StyleScopedClasses['h-2']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-(--el-color-warning)']} */ ;
(__VLS_ctx.warningCount);
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "flex gap-2 items-center text-xs" },
});
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.i, __VLS_intrinsics.i)({
    ...{ class: "w-2 h-2 rounded-full bg-(--el-color-danger)" },
});
/** @type {__VLS_StyleScopedClasses['w-2']} */ ;
/** @type {__VLS_StyleScopedClasses['h-2']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-(--el-color-danger)']} */ ;
(__VLS_ctx.dangerCount);
// @ts-ignore
[successCount, warningCount, dangerCount,];
var __VLS_3;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
