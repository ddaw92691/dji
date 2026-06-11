/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import VChart from 'vue-echarts';
// 触发器变量（仅仅用来主题或者颜色变化时触发revenueProfitOption 更新的变量）
const colorTrigger = ref(0);
let timer = null;
/**
 * 创建迷你仪表盘图表配置
 * @param value  值
 * @param color  颜色
 */
const createMiniGauge = (value, color) => {
    const style = getComputedStyle(document.documentElement);
    return {
        series: [
            {
                type: 'gauge',
                startAngle: 90,
                endAngle: -270,
                pointer: { show: false },
                progress: {
                    show: true,
                    overlap: false,
                    roundCap: true,
                    clip: false,
                    itemStyle: { color: style.getPropertyValue(color) },
                },
                axisLine: {
                    lineStyle: { width: 8, color: [[1, style.getPropertyValue('--el-bg-color-page')]] },
                },
                splitLine: { show: false },
                axisTick: { show: false },
                axisLabel: { show: false },
                data: [{ value }],
                detail: { show: false },
            },
        ],
    };
};
// 资源仪表盘(现代风格)
const resourceStats = ref([
    { label: 'CPU Usage', value: 38.01, unit: '%', color: '--el-color-primary', trend: '+2.1%' },
    { label: 'Memory', value: 62.45, unit: '%', color: '--el-color-success', trend: '-0.5%' },
    { label: 'Network', value: 75.01, unit: 'Mbps', color: '--el-color-warning', trend: '+12.4' },
    {
        label: 'Active Tasks',
        value: 12,
        unit: 'Proc',
        color: '--el-color-danger',
        trend: 'Stable',
    },
]);
//  动态创建图表配置
const resourceStatsWithOption = computed(() => {
    void colorTrigger.value;
    return resourceStats.value.map((item) => ({
        ...item,
        option: createMiniGauge(item.value, item.color),
    }));
});
// 随机改变数值
const generateValue = () => {
    resourceStats.value = resourceStats.value.map((item) => {
        const oldValue = item.value;
        const newValue = Number((Math.random() * 100).toFixed(2));
        // 根据变化计算趋势
        let trend = '';
        const diff = Number((newValue - oldValue).toFixed(2));
        if (diff > 0)
            trend = `+${diff}%`;
        else if (diff < 0)
            trend = `${diff}%`;
        else
            trend = 'Stable';
        return {
            ...item,
            value: newValue,
            trend,
        };
    });
};
// 触发颜色改变
const updateColorTrigger = () => colorTrigger.value++;
const __VLS_exposed = { updateColorTrigger };
defineExpose(__VLS_exposed);
onMounted(() => {
    timer = setInterval(generateValue, 5000);
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
/** @ts-ignore @type { | typeof __VLS_components.elRow | typeof __VLS_components.ElRow | typeof __VLS_components['el-row'] | typeof __VLS_components.elRow | typeof __VLS_components.ElRow | typeof __VLS_components['el-row']} */
elRow;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    gutter: (20),
}));
const __VLS_2 = __VLS_1({
    gutter: (20),
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_5;
const { default: __VLS_6 } = __VLS_3.slots;
for (const [item] of __VLS_vFor((__VLS_ctx.resourceStatsWithOption))) {
    let __VLS_7;
    /** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
    elCol;
    // @ts-ignore
    const __VLS_8 = __VLS_asFunctionalComponent1(__VLS_7, new __VLS_7({
        sm: (12),
        lg: (6),
        key: (item.label),
        ...{ class: "mt-4" },
    }));
    const __VLS_9 = __VLS_8({
        sm: (12),
        lg: (6),
        key: (item.label),
        ...{ class: "mt-4" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_8));
    /** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
    const { default: __VLS_12 } = __VLS_10.slots;
    let __VLS_13;
    /** @ts-ignore @type { | typeof __VLS_components.BaseCard | typeof __VLS_components.BaseCard} */
    BaseCard;
    // @ts-ignore
    const __VLS_14 = __VLS_asFunctionalComponent1(__VLS_13, new __VLS_13({}));
    const __VLS_15 = __VLS_14({}, ...__VLS_functionalComponentArgsRest(__VLS_14));
    const { default: __VLS_18 } = __VLS_16.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex items-center justify-between" },
    });
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['items-center']} */ ;
    /** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex flex-col gap-3" },
    });
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
    /** @type {__VLS_StyleScopedClasses['gap-3']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "text-sm font-medium text-(--el-text-color-regular)" },
    });
    /** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
    /** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-(--el-text-color-regular)']} */ ;
    (item.label);
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex items-baseline gap-1" },
    });
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['items-baseline']} */ ;
    /** @type {__VLS_StyleScopedClasses['gap-1']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "text-2xl font-extrabold" },
    });
    /** @type {__VLS_StyleScopedClasses['text-2xl']} */ ;
    /** @type {__VLS_StyleScopedClasses['font-extrabold']} */ ;
    (item.value);
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "text-sm font-semibold text-(--el-text-color-secondary)" },
    });
    /** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
    /** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-(--el-text-color-secondary)']} */ ;
    (item.unit);
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex gap-2 text-xs" },
    });
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "font-bold" },
        ...{ class: (item.trend.startsWith('+')
                ? 'text-(--el-color-success)'
                : 'text-(--el-color-danger)') },
    });
    /** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
    (item.trend);
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "text-(--el-text-color-secondary)" },
    });
    /** @type {__VLS_StyleScopedClasses['text-(--el-text-color-secondary)']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "h-23 w-23" },
    });
    /** @type {__VLS_StyleScopedClasses['h-23']} */ ;
    /** @type {__VLS_StyleScopedClasses['w-23']} */ ;
    let __VLS_19;
    /** @ts-ignore @type { | typeof __VLS_components.VChart} */
    VChart;
    // @ts-ignore
    const __VLS_20 = __VLS_asFunctionalComponent1(__VLS_19, new __VLS_19({
        option: (item.option),
    }));
    const __VLS_21 = __VLS_20({
        option: (item.option),
    }, ...__VLS_functionalComponentArgsRest(__VLS_20));
    // @ts-ignore
    [resourceStatsWithOption,];
    var __VLS_16;
    // @ts-ignore
    [];
    var __VLS_10;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_3;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    setup: () => __VLS_exposed,
});
export default {};
