/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import VChart from 'vue-echarts';
// 触发器变量（仅仅用来主题或者颜色变化时触发revenueProfitOption 更新的变量）
const colorTrigger = ref(0);
// 当前时间范围
const analysisTimeRange = ref('1y');
// 原始数据（示例）
const rawData = ref({
    '1y': {
        months: Array.from({ length: 12 }, (_, i) => `${i + 1}月`),
        revenue: [120, 132, 101, 134, 290, 230, 210, 250, 220, 280, 310, 330],
        profit: [80, 92, 70, 84, 150, 130, 110, 140, 120, 160, 190, 240],
        lastYear: [100, 110, 95, 120, 200, 180, 190, 210, 180, 230, 260, 300],
        profitRate: [66, 69, 69, 62, 52, 56, 52, 56, 54, 57, 61, 72],
    },
    '2y': {
        months: Array.from({ length: 24 }, (_, i) => `${i + 1}月`),
        revenue: Array.from({ length: 24 }, () => Math.floor(Math.random() * 300 + 50)),
        profit: Array.from({ length: 24 }, () => Math.floor(Math.random() * 200 + 50)),
        lastYear: Array.from({ length: 24 }, () => Math.floor(Math.random() * 250 + 50)),
        profitRate: Array.from({ length: 24 }, () => Math.floor(Math.random() * 100)),
    },
});
const revenueProfitOption = computed(() => {
    void colorTrigger.value;
    const style = getComputedStyle(document.documentElement);
    const data = rawData.value[analysisTimeRange.value];
    return {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
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
        legend: {
            data: ['年度营收', '净利润', '去年同期', '利润率'],
            bottom: 0,
            itemGap: 20,
            textStyle: { color: style.getPropertyValue('--el-text-color-regular') },
        },
        grid: { left: '3%', right: '4%', bottom: 60, top: '10%', containLabel: true },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: data?.months,
            axisLine: { lineStyle: { color: style.getPropertyValue('--el-text-color-regular') } },
            axisTick: { show: false },
            axisLabel: { color: style.getPropertyValue('--el-text-color-regular') },
        },
        // dataZoom: [
        //   {
        //     type: 'inside',
        //     xAxisIndex: 0,
        //     zoomOnMouseWheel: true,
        //     moveOnMouseMove: true,
        //     moveOnMouseWheel: true,
        //   },
        //   {
        //     type: 'slider',
        //     height: 20,
        //     // 滑块选中区域
        //     fillerColor: style.getPropertyValue('--el-color-primary-light-5'),
        //     // 文字
        //     textStyle: {
        //       color: style.getPropertyValue('--el-text-color-secondary'),
        //       fontSize: 12,
        //     },
        //   },
        // ],
        yAxis: [
            {
                type: 'value',
                name: '金额 (k)',
                axisLine: { show: false },
                splitLine: {
                    lineStyle: { type: 'dashed', color: style.getPropertyValue('--el-border-color') },
                },
                axisLabel: { color: style.getPropertyValue('--el-text-color-regular') },
                nameTextStyle: { color: style.getPropertyValue('--el-text-color-regular') },
            },
            {
                type: 'value',
                name: '利润率 (%)',
                min: 0,
                max: 100,
                axisLine: { show: false },
                splitLine: { show: false },
                axisLabel: { color: style.getPropertyValue('--el-text-color-regular') },
                nameTextStyle: { color: style.getPropertyValue('--el-text-color-regular') },
            },
        ],
        series: [
            {
                name: '年度营收',
                type: 'line',
                smooth: true,
                lineStyle: { width: 0 },
                showSymbol: false,
                areaStyle: {
                    opacity: 0.8,
                    color: {
                        type: 'linear',
                        x: 0,
                        y: 0,
                        x2: 0,
                        y2: 1,
                        colorStops: [
                            { offset: 0, color: style.getPropertyValue('--el-color-info') },
                            { offset: 1, color: style.getPropertyValue('--el-color-primary') },
                        ],
                    },
                },
                data: data?.revenue,
            },
            {
                name: '去年同期',
                type: 'line',
                symbol: 'none',
                lineStyle: {
                    type: 'dashed',
                    width: 2,
                    color: style.getPropertyValue('--el-text-color-placeholder'),
                },
                data: data?.lastYear,
            },
            {
                name: '净利润',
                type: 'line',
                smooth: true,
                lineStyle: { width: 4, color: style.getPropertyValue('--el-color-warning') },
                symbol: 'circle',
                symbolSize: 8,
                itemStyle: {
                    color: style.getPropertyValue('--el-color-warning'),
                    borderColor: style.getPropertyValue('--el-color-white'),
                    borderWidth: 2,
                },
                data: data?.profit,
            },
            {
                name: '利润率',
                type: 'line',
                yAxisIndex: 1,
                lineStyle: {
                    type: 'dashed',
                    color: style.getPropertyValue('--el-color-success'),
                    width: 2,
                },
                symbol: 'none',
                data: data?.profitRate,
            },
        ],
    };
});
// 刷新数据函数（模拟随机刷新）
const refreshData = () => {
    const range = analysisTimeRange.value;
    rawData.value[range] = {
        months: rawData.value[range].months,
        revenue: rawData.value[range].revenue.map((v) => v + Math.floor(Math.random() * 20 - 10)),
        profit: rawData.value[range].profit.map((v) => v + Math.floor(Math.random() * 10 - 5)),
        lastYear: rawData.value[range].lastYear.map((v) => v + Math.floor(Math.random() * 10 - 5)),
        profitRate: rawData.value[range].profitRate.map((v) => Math.min(100, Math.max(0, v + Math.floor(Math.random() * 5 - 2)))),
    };
};
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
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({}));
const __VLS_2 = __VLS_1({}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_5;
const { default: __VLS_6 } = __VLS_3.slots;
{
    const { header: __VLS_7 } = __VLS_3.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex items-center justify-between gap-2" },
    });
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['items-center']} */ ;
    /** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
    /** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex flex-1 items-center" },
    });
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['flex-1']} */ ;
    /** @type {__VLS_StyleScopedClasses['items-center']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "text-[18px] font-bold" },
    });
    /** @type {__VLS_StyleScopedClasses['text-[18px]']} */ ;
    /** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
    let __VLS_8;
    /** @ts-ignore @type { | typeof __VLS_components.TextEllipsis} */
    TextEllipsis;
    // @ts-ignore
    const __VLS_9 = __VLS_asFunctionalComponent1(__VLS_8, new __VLS_8({
        text: "年度营收与净利润增长深度分析",
        clickable: (false),
    }));
    const __VLS_10 = __VLS_9({
        text: "年度营收与净利润增长深度分析",
        clickable: (false),
    }, ...__VLS_functionalComponentArgsRest(__VLS_9));
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "ml-4 hidden sm:block" },
    });
    /** @type {__VLS_StyleScopedClasses['ml-4']} */ ;
    /** @type {__VLS_StyleScopedClasses['hidden']} */ ;
    /** @type {__VLS_StyleScopedClasses['sm:block']} */ ;
    let __VLS_13;
    /** @ts-ignore @type { | typeof __VLS_components.BaseTag} */
    BaseTag;
    // @ts-ignore
    const __VLS_14 = __VLS_asFunctionalComponent1(__VLS_13, new __VLS_13({
        text: "数据已脱敏",
    }));
    const __VLS_15 = __VLS_14({
        text: "数据已脱敏",
    }, ...__VLS_functionalComponentArgsRest(__VLS_14));
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex shrink-0 items-center sm:gap-2" },
    });
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['shrink-0']} */ ;
    /** @type {__VLS_StyleScopedClasses['items-center']} */ ;
    /** @type {__VLS_StyleScopedClasses['sm:gap-2']} */ ;
    let __VLS_18;
    /** @ts-ignore @type { | typeof __VLS_components.elRadioGroup | typeof __VLS_components.ElRadioGroup | typeof __VLS_components['el-radio-group'] | typeof __VLS_components.elRadioGroup | typeof __VLS_components.ElRadioGroup | typeof __VLS_components['el-radio-group']} */
    elRadioGroup;
    // @ts-ignore
    const __VLS_19 = __VLS_asFunctionalComponent1(__VLS_18, new __VLS_18({
        modelValue: (__VLS_ctx.analysisTimeRange),
        size: "small",
    }));
    const __VLS_20 = __VLS_19({
        modelValue: (__VLS_ctx.analysisTimeRange),
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_19));
    const { default: __VLS_23 } = __VLS_21.slots;
    let __VLS_24;
    /** @ts-ignore @type { | typeof __VLS_components.elRadioButton | typeof __VLS_components.ElRadioButton | typeof __VLS_components['el-radio-button'] | typeof __VLS_components.elRadioButton | typeof __VLS_components.ElRadioButton | typeof __VLS_components['el-radio-button']} */
    elRadioButton;
    // @ts-ignore
    const __VLS_25 = __VLS_asFunctionalComponent1(__VLS_24, new __VLS_24({
        label: "1y",
    }));
    const __VLS_26 = __VLS_25({
        label: "1y",
    }, ...__VLS_functionalComponentArgsRest(__VLS_25));
    const { default: __VLS_29 } = __VLS_27.slots;
    // @ts-ignore
    [analysisTimeRange,];
    var __VLS_27;
    let __VLS_30;
    /** @ts-ignore @type { | typeof __VLS_components.elRadioButton | typeof __VLS_components.ElRadioButton | typeof __VLS_components['el-radio-button'] | typeof __VLS_components.elRadioButton | typeof __VLS_components.ElRadioButton | typeof __VLS_components['el-radio-button']} */
    elRadioButton;
    // @ts-ignore
    const __VLS_31 = __VLS_asFunctionalComponent1(__VLS_30, new __VLS_30({
        label: "2y",
    }));
    const __VLS_32 = __VLS_31({
        label: "2y",
    }, ...__VLS_functionalComponentArgsRest(__VLS_31));
    const { default: __VLS_35 } = __VLS_33.slots;
    // @ts-ignore
    [];
    var __VLS_33;
    // @ts-ignore
    [];
    var __VLS_21;
    let __VLS_36;
    /** @ts-ignore @type { | typeof __VLS_components.elDivider | typeof __VLS_components.ElDivider | typeof __VLS_components['el-divider']} */
    elDivider;
    // @ts-ignore
    const __VLS_37 = __VLS_asFunctionalComponent1(__VLS_36, new __VLS_36({
        direction: "vertical",
    }));
    const __VLS_38 = __VLS_37({
        direction: "vertical",
    }, ...__VLS_functionalComponentArgsRest(__VLS_37));
    let __VLS_41;
    /** @ts-ignore @type { | typeof __VLS_components.IconButton} */
    IconButton;
    // @ts-ignore
    const __VLS_42 = __VLS_asFunctionalComponent1(__VLS_41, new __VLS_41({
        ...{ 'onClick': {} },
        icon: "HOutline:ArrowPathIcon",
        type: "primary",
    }));
    const __VLS_43 = __VLS_42({
        ...{ 'onClick': {} },
        icon: "HOutline:ArrowPathIcon",
        type: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_42));
    let __VLS_46;
    const __VLS_47 = {
        ...{ click: {} },
        onClick: (__VLS_ctx.refreshData),
    };
    var __VLS_44;
    var __VLS_45;
    // @ts-ignore
    [refreshData,];
}
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "h-113 w-full" },
});
/** @type {__VLS_StyleScopedClasses['h-113']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
let __VLS_48;
/** @ts-ignore @type { | typeof __VLS_components.VChart} */
VChart;
// @ts-ignore
const __VLS_49 = __VLS_asFunctionalComponent1(__VLS_48, new __VLS_48({
    option: (__VLS_ctx.revenueProfitOption),
    autoresize: true,
}));
const __VLS_50 = __VLS_49({
    option: (__VLS_ctx.revenueProfitOption),
    autoresize: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_49));
// @ts-ignore
[revenueProfitOption,];
var __VLS_3;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    setup: () => __VLS_exposed,
});
export default {};
