/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import VChart from 'vue-echarts';
// 触发器变量（仅仅用来主题或者颜色变化时触发revenueProfitOption 更新的变量）
const colorTrigger = ref(0);
// 全球市场份额饼图
const marketShareOption = computed(() => {
    void colorTrigger.value;
    const style = getComputedStyle(document.documentElement);
    return {
        tooltip: {
            trigger: 'item',
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
            bottom: '5%',
            icon: 'circle',
            itemGap: 15,
            textStyle: { color: style.getPropertyValue('--el-text-color-regular') },
        },
        series: [
            {
                name: '市场份额',
                type: 'pie',
                radius: ['45%', '70%'],
                center: ['50%', '45%'],
                avoidLabelOverlap: false,
                itemStyle: {
                    borderRadius: 8,
                    borderColor: style.getPropertyValue('--el-bg-color-overlay'),
                    borderWidth: 4,
                },
                label: { show: false },
                emphasis: {
                    label: {
                        show: true,
                        fontSize: '14',
                        fontWeight: 'bold',
                        color: style.getPropertyValue('--el-text-color-regular'),
                    },
                },
                data: [
                    {
                        value: 45,
                        name: '北美地区',
                        itemStyle: { color: style.getPropertyValue('--el-color-primary') },
                    },
                    {
                        value: 25,
                        name: '欧洲市场',
                        itemStyle: { color: style.getPropertyValue('--el-color-warning') },
                    },
                    {
                        value: 20,
                        name: '亚太地区',
                        itemStyle: { color: style.getPropertyValue('--el-color-success') },
                    },
                    {
                        value: 10,
                        name: '其他',
                        itemStyle: { color: style.getPropertyValue('--el-color-info') },
                    },
                ],
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
    title: "全球市场份额分布",
}));
const __VLS_2 = __VLS_1({
    title: "全球市场份额分布",
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
    option: (__VLS_ctx.marketShareOption),
    autoresize: true,
}));
const __VLS_9 = __VLS_8({
    option: (__VLS_ctx.marketShareOption),
    autoresize: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_8));
// @ts-ignore
[marketShareOption,];
var __VLS_3;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    setup: () => __VLS_exposed,
});
export default {};
