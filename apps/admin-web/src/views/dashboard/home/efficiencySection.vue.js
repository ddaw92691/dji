/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import VChart from 'vue-echarts';
const stats = ref([
    { label: '任务完成率', value: '92%', percentage: 92, color: '#6366f1' },
    { label: '代码质量评分', value: 'A+', percentage: 88, color: '#10b981' },
]);
// 效能图表配置 (雷达图更适合展示多维度效能)
const efficiencyOption = computed(() => ({
    radar: {
        indicator: [
            { name: '代码质量', max: 100 },
            { name: '交付速度', max: 100 },
            { name: '沟通协作', max: 100 },
            { name: '技术深度', max: 100 },
            { name: '业务理解', max: 100 },
        ],
        splitArea: { show: false },
        axisLine: { lineStyle: { color: '#e2e8f0' } },
    },
    series: [
        {
            type: 'radar',
            data: [
                {
                    value: [85, 90, 80, 95, 88],
                    name: '个人能力',
                    itemStyle: {
                        color: getComputedStyle(document.documentElement)
                            .getPropertyValue('--el-color-primary')
                            .trim(),
                    },
                    areaStyle: {
                        color: getComputedStyle(document.documentElement)
                            .getPropertyValue('--el-color-primary')
                            .trim() + '33',
                    },
                },
            ],
        },
    ],
}));
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
    title: "本周工作效能",
    titleIcon: "HOutline:PresentationChartBarIcon",
}));
const __VLS_2 = __VLS_1({
    title: "本周工作效能",
    titleIcon: "HOutline:PresentationChartBarIcon",
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_5;
const { default: __VLS_6 } = __VLS_3.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "h-70 w-full mb-5" },
});
/** @type {__VLS_StyleScopedClasses['h-70']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-5']} */ ;
let __VLS_7;
/** @ts-ignore @type { | typeof __VLS_components.VChart} */
VChart;
// @ts-ignore
const __VLS_8 = __VLS_asFunctionalComponent1(__VLS_7, new __VLS_7({
    ...{ class: "chart" },
    option: (__VLS_ctx.efficiencyOption),
    autoresize: true,
}));
const __VLS_9 = __VLS_8({
    ...{ class: "chart" },
    option: (__VLS_ctx.efficiencyOption),
    autoresize: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_8));
/** @type {__VLS_StyleScopedClasses['chart']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "py-2 flex flex-col gap-4" },
});
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-4']} */ ;
for (const [item] of __VLS_vFor((__VLS_ctx.stats))) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        key: (item.label),
    });
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex justify-between mb-2" },
    });
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
    /** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "text-[13px] font-medium text-(--el-text-color-regular)" },
    });
    /** @type {__VLS_StyleScopedClasses['text-[13px]']} */ ;
    /** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-(--el-text-color-regular)']} */ ;
    (item.label);
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "text-xs font-bold" },
    });
    /** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
    /** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
    (item.value);
    let __VLS_12;
    /** @ts-ignore @type { | typeof __VLS_components.elProgress | typeof __VLS_components.ElProgress | typeof __VLS_components['el-progress']} */
    elProgress;
    // @ts-ignore
    const __VLS_13 = __VLS_asFunctionalComponent1(__VLS_12, new __VLS_12({
        percentage: (item.percentage),
        color: (item.color),
        showText: (false),
    }));
    const __VLS_14 = __VLS_13({
        percentage: (item.percentage),
        color: (item.color),
        showText: (false),
    }, ...__VLS_functionalComponentArgsRest(__VLS_13));
    // @ts-ignore
    [efficiencyOption, stats,];
}
// @ts-ignore
[];
var __VLS_3;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
