/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { registerMap } from 'echarts/core';
import VChart from 'vue-echarts';
// 触发器变量（仅仅用来主题或者颜色变化时触发revenueProfitOption 更新的变量）
const colorTrigger = ref(0);
const svg = `
        <path class="path" d="
          M 30 15
          L 28 17
          M 25.61 25.61
          A 15 15, 0, 0, 1, 15 30
          A 15 15, 0, 1, 1, 27.99 7.5
          L 15 15
        " style="stroke-width: 4px; fill: rgba(0, 0, 0, 0)"/>
      `;
// 地图数据加载状态
const isMapRegistered = ref(false);
// ECharts 地图 (真实地理坐标)
const worldMapOption = computed(() => {
    void colorTrigger.value;
    const style = getComputedStyle(document.documentElement);
    return {
        tooltip: {
            trigger: 'item',
            formatter: '{b}',
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
        geo: {
            map: 'world', // 注意：项目中若无地图 JSON，这里会显示空白，实际开发需引入 registerMap
            roam: false,
            emphasis: {
                itemStyle: { areaColor: style.getPropertyValue('--el-border-color') },
                label: { show: false },
            },
            itemStyle: {
                areaColor: style.getPropertyValue('--el-bg-color-page'),
                borderColor: style.getPropertyValue('--el-border-color'),
                borderWidth: 1,
            },
            left: '10%',
            right: '10%',
            top: '5%',
            bottom: '5%',
        },
        series: [
            {
                name: 'Realtime Requests',
                type: 'effectScatter',
                coordinateSystem: 'geo',
                data: [
                    { name: 'Shanghai', value: [121.47, 31.23, 100] },
                    { name: 'San Francisco', value: [-122.41, 37.77, 80] },
                    { name: 'London', value: [-0.12, 51.5, 60] },
                    { name: 'Frankfurt', value: [8.68, 50.11, 40] },
                    { name: 'Singapore', value: [103.85, 1.28, 90] },
                ],
                symbolSize: (val) => val[2] / 8,
                showEffectOn: 'render',
                rippleEffect: { brushType: 'stroke', scale: 4 },
                itemStyle: {
                    color: style.getPropertyValue('--el-color-primary'),
                    shadowBlur: 10,
                    shadowColor: 'rgba(99, 102, 241, 0.5)',
                },
                zlevel: 1,
            },
        ],
    };
});
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
// 异步加载世界地图 GeoJSON
const initMap = async () => {
    try {
        await delay(2000);
        const response = await fetch('https://cdn.jsdelivr.net/npm/echarts@4.9.0/map/json/world.json');
        const worldJson = await response.json();
        registerMap('world', worldJson);
        isMapRegistered.value = true;
    }
    catch (error) {
        console.error('Failed to register world map:', error);
    }
};
// 触发颜色改变
const updateColorTrigger = () => colorTrigger.value++;
const __VLS_exposed = { updateColorTrigger };
defineExpose(__VLS_exposed);
onMounted(() => {
    initMap();
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
    title: "全球请求实时分布",
    titleIcon: "HOutline:GlobeAsiaAustraliaIcon",
}));
const __VLS_2 = __VLS_1({
    title: "全球请求实时分布",
    titleIcon: "HOutline:GlobeAsiaAustraliaIcon",
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_5;
const { default: __VLS_6 } = __VLS_3.slots;
{
    const { 'header-right': __VLS_7 } = __VLS_3.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex items-center gap-2 text-(--el-color-primary) font-semibold text-sm" },
    });
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['items-center']} */ ;
    /** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-(--el-color-primary)']} */ ;
    /** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "w-2 h-2 bg-(--el-color-primary) rounded-full pulsating" },
    });
    /** @type {__VLS_StyleScopedClasses['w-2']} */ ;
    /** @type {__VLS_StyleScopedClasses['h-2']} */ ;
    /** @type {__VLS_StyleScopedClasses['bg-(--el-color-primary)']} */ ;
    /** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
    /** @type {__VLS_StyleScopedClasses['pulsating']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
}
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "h-100" },
    'element-loading-text': "Loading...",
    'element-loading-spinner': (__VLS_ctx.svg),
    'element-loading-svg-view-box': "-10, -10, 50, 50",
});
__VLS_asFunctionalDirective(__VLS_directives.vLoading, {})(null, { ...__VLS_directiveBindingRestFields, value: (!__VLS_ctx.isMapRegistered) }, null, null);
/** @type {__VLS_StyleScopedClasses['h-100']} */ ;
if (__VLS_ctx.isMapRegistered) {
    let __VLS_8;
    /** @ts-ignore @type { | typeof __VLS_components.VChart} */
    VChart;
    // @ts-ignore
    const __VLS_9 = __VLS_asFunctionalComponent1(__VLS_8, new __VLS_8({
        ...{ class: "chart" },
        option: (__VLS_ctx.worldMapOption),
        autoresize: true,
    }));
    const __VLS_10 = __VLS_9({
        ...{ class: "chart" },
        option: (__VLS_ctx.worldMapOption),
        autoresize: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_9));
    /** @type {__VLS_StyleScopedClasses['chart']} */ ;
}
// @ts-ignore
[svg, vLoading, isMapRegistered, isMapRegistered, worldMapOption,];
var __VLS_3;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    setup: () => __VLS_exposed,
});
export default {};
