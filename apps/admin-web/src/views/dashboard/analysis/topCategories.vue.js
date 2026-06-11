/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import VChart from 'vue-echarts';
// 触发器变量（仅仅用来主题或者颜色变化时触发revenueProfitOption 更新的变量）
const colorTrigger = ref(0);
// 4. 热销品类柱状图
const topCategoriesOption = computed(() => {
    void colorTrigger.value;
    const style = getComputedStyle(document.documentElement);
    return {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow',
                label: { backgroundColor: style.getPropertyValue('--el-color-primary') },
            },
            backgroundColor: style.getPropertyValue('--el-text-color-primary'),
            borderWidth: 0,
            borderRadius: 8,
            boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
            textStyle: {
                color: style.getPropertyValue('--el-bg-color'),
                fontWeight: 400,
                fontSize: 12,
            },
        },
        grid: { left: '3%', right: '8%', bottom: '3%', top: '5%', containLabel: true },
        xAxis: {
            type: 'value',
            axisLine: { show: false },
            splitLine: {
                lineStyle: { type: 'dashed', color: style.getPropertyValue('--el-border-color') },
            },
            axisLabel: { color: style.getPropertyValue('--el-text-color-regular') },
        },
        yAxis: {
            type: 'category',
            data: ['电子产品', '户外运动', '居家生活', '美妆个护', '服装鞋帽'],
            axisLine: { show: false },
            axisTick: { show: false },
            axisLabel: { color: style.getPropertyValue('--el-text-color-regular') },
        },
        series: [
            {
                name: '销量 (k)',
                type: 'bar',
                barWidth: '40%',
                itemStyle: {
                    borderRadius: [0, 20, 20, 0],
                    color: style.getPropertyValue('--el-color-primary'),
                },
                data: [820, 732, 601, 534, 490],
            },
        ],
    };
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
    title: "热销商品类目 TOP 5",
}));
const __VLS_2 = __VLS_1({
    title: "热销商品类目 TOP 5",
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_5;
const { default: __VLS_6 } = __VLS_3.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "h-65 w-full" },
});
/** @type {__VLS_StyleScopedClasses['h-65']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
let __VLS_7;
/** @ts-ignore @type { | typeof __VLS_components.VChart} */
VChart;
// @ts-ignore
const __VLS_8 = __VLS_asFunctionalComponent1(__VLS_7, new __VLS_7({
    option: (__VLS_ctx.topCategoriesOption),
    autoresize: true,
}));
const __VLS_9 = __VLS_8({
    option: (__VLS_ctx.topCategoriesOption),
    autoresize: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_8));
// @ts-ignore
[topCategoriesOption,];
var __VLS_3;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    setup: () => __VLS_exposed,
});
export default {};
