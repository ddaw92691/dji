/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import VChart from 'vue-echarts';
// 触发器变量（仅仅用来主题或者颜色变化时触发revenueProfitOption 更新的变量）
const colorTrigger = ref(0);
// 定时器
let timer = null;
// 吞吐量图表
const throughputData = ref(new Array(20).fill(0).map(() => Math.floor(Math.random() * 400 + 100)));
const throughputOption = computed(() => {
    void colorTrigger.value;
    const style = getComputedStyle(document.documentElement);
    return {
        grid: { left: '3%', right: '4%', bottom: '3%', top: '10%', containLabel: true },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: new Array(20).fill(''),
            axisLine: { show: false },
            axisTick: { show: false },
        },
        yAxis: {
            type: 'value',
            splitLine: {
                lineStyle: { color: style.getPropertyValue('--el-border-color'), type: 'dashed' },
            },
            axisLabel: { color: style.getPropertyValue('--el-text-color-regular') },
        },
        series: [
            {
                type: 'line',
                smooth: true,
                symbol: 'none',
                lineStyle: { width: 3, color: style.getPropertyValue('--el-color-primary') },
                areaStyle: {
                    color: {
                        type: 'linear',
                        x: 0,
                        y: 0,
                        x2: 0,
                        y2: 1,
                        colorStops: [
                            { offset: 0, color: style.getPropertyValue('--el-color-primary') },
                            { offset: 1, color: 'transparent' },
                        ],
                    },
                },
                data: throughputData.value,
            },
        ],
    };
});
onMounted(() => {
    timer = setInterval(() => {
        throughputData.value.push(Math.floor(Math.random() * 400 + 100));
        throughputData.value.shift();
    }, 2000);
});
onUnmounted(() => {
    if (timer)
        clearInterval(timer);
});
// 触发颜色改变
const updateColorTrigger = () => colorTrigger.value++;
const __VLS_exposed = { updateColorTrigger };
defineExpose(__VLS_exposed);
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
    title: "API 实时吞吐量 (Req/s)",
    titleIcon: "HOutline:ArrowTrendingUpIcon",
}));
const __VLS_2 = __VLS_1({
    title: "API 实时吞吐量 (Req/s)",
    titleIcon: "HOutline:ArrowTrendingUpIcon",
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_5;
const { default: __VLS_6 } = __VLS_3.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "h-76" },
});
/** @type {__VLS_StyleScopedClasses['h-76']} */ ;
let __VLS_7;
/** @ts-ignore @type { | typeof __VLS_components.VChart} */
VChart;
// @ts-ignore
const __VLS_8 = __VLS_asFunctionalComponent1(__VLS_7, new __VLS_7({
    ...{ class: "chart" },
    option: (__VLS_ctx.throughputOption),
    autoresize: true,
}));
const __VLS_9 = __VLS_8({
    ...{ class: "chart" },
    option: (__VLS_ctx.throughputOption),
    autoresize: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_8));
/** @type {__VLS_StyleScopedClasses['chart']} */ ;
// @ts-ignore
[throughputOption,];
var __VLS_3;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    setup: () => __VLS_exposed,
});
export default {};
