/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import dayjs from 'dayjs';
import VChart from 'vue-echarts';
import LottieAnimation from '@/components/animation/LottieAnimation.vue';
import workTimeLottie from '@/assets/lotties/welcome.json';
const userStore = useUserStore();
const menuStore = useMenuStore();
// 当前日期
const currentDate = ref('');
// 创建小折线图
const createMiniLineChart = (data, color) => {
    return {
        grid: { left: 0, right: 0, top: 10, bottom: 0 },
        xAxis: { type: 'category', show: false },
        yAxis: { type: 'value', show: false },
        series: [
            {
                data,
                type: 'line',
                smooth: true,
                symbol: 'none',
                lineStyle: { color, width: 2 },
                areaStyle: {
                    color: {
                        type: 'linear',
                        x: 0,
                        y: 0,
                        x2: 0,
                        y2: 1,
                        colorStops: [
                            { offset: 0, color: color + '30' },
                            { offset: 1, color: 'transparent' },
                        ],
                    },
                },
            },
        ],
    };
};
// 核心指标小卡片数据
const statCards = computed(() => [
    {
        label: '本周任务完成',
        value: '52',
        trend: '+12%',
        trendType: 'up',
        color: '#6366f1',
        icon: 'HOutline:CheckCircleIcon',
        chartOption: createMiniLineChart([30, 40, 35, 50, 49, 60, 52], '#6366f1'),
    },
    {
        label: '项目活跃度',
        value: '84%',
        trend: '+5%',
        trendType: 'up',
        color: '#10b981',
        icon: 'HOutline:ArrowTrendingUpIcon',
        chartOption: createMiniLineChart([70, 75, 72, 80, 78, 85, 84], '#10b981'),
    },
    {
        label: '待办处理率',
        value: '92%',
        trend: '-2%',
        trendType: 'down',
        color: '#f59e0b',
        icon: 'HOutline:ClipboardDocumentListIcon',
        chartOption: createMiniLineChart([95, 94, 96, 92, 93, 91, 92], '#f59e0b'),
    },
    {
        label: '团队协作值',
        value: '76',
        trend: '+18%',
        trendType: 'up',
        color: '#ef4444',
        icon: 'HOutline:UserGroupIcon',
        chartOption: createMiniLineChart([50, 55, 60, 65, 70, 75, 76], '#ef4444'),
    },
]);
// 获取当前日期
const getCurrentDate = () => {
    currentDate.value = dayjs().format('YYYY-MM-DD');
};
onMounted(() => {
    getCurrentDate();
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
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({}));
const __VLS_2 = __VLS_1({}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_5;
const { default: __VLS_6 } = __VLS_3.slots;
let __VLS_7;
/** @ts-ignore @type { | typeof __VLS_components.elScrollbar | typeof __VLS_components.ElScrollbar | typeof __VLS_components['el-scrollbar'] | typeof __VLS_components.elScrollbar | typeof __VLS_components.ElScrollbar | typeof __VLS_components['el-scrollbar']} */
elScrollbar;
// @ts-ignore
const __VLS_8 = __VLS_asFunctionalComponent1(__VLS_7, new __VLS_7({
    maxHeight: (620),
}));
const __VLS_9 = __VLS_8({
    maxHeight: (620),
}, ...__VLS_functionalComponentArgsRest(__VLS_8));
const { default: __VLS_12 } = __VLS_10.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex flex-col xl:flex-row justify-between p-6 lg:p-8" },
});
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['xl:flex-row']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['p-6']} */ ;
/** @type {__VLS_StyleScopedClasses['lg:p-8']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex-1" },
});
/** @type {__VLS_StyleScopedClasses['flex-1']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex flex-col lg:flex-row items-center lg:items-start xl:items-center gap-6" },
});
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['lg:flex-row']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['lg:items-start']} */ ;
/** @type {__VLS_StyleScopedClasses['xl:items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-6']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "relative shrink-0" },
});
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['shrink-0']} */ ;
let __VLS_13;
/** @ts-ignore @type { | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar']} */
elAvatar;
// @ts-ignore
const __VLS_14 = __VLS_asFunctionalComponent1(__VLS_13, new __VLS_13({
    size: (110),
    src: (__VLS_ctx.userStore.userInfo?.avatar),
}));
const __VLS_15 = __VLS_14({
    size: (110),
    src: (__VLS_ctx.userStore.userInfo?.avatar),
}, ...__VLS_functionalComponentArgsRest(__VLS_14));
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "absolute h-5 w-5 bottom-2 right-2 rounded-full border-3 border-(--el-bg-color) bg-(--el-color-success)" },
});
/** @type {__VLS_StyleScopedClasses['absolute']} */ ;
/** @type {__VLS_StyleScopedClasses['h-5']} */ ;
/** @type {__VLS_StyleScopedClasses['w-5']} */ ;
/** @type {__VLS_StyleScopedClasses['bottom-2']} */ ;
/** @type {__VLS_StyleScopedClasses['right-2']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['border-3']} */ ;
/** @type {__VLS_StyleScopedClasses['border-(--el-bg-color)']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-(--el-color-success)']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex flex-col gap-4 items-center lg:items-start text-center lg:text-left" },
});
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-4']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['lg:items-start']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['lg:text-left']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.h2, __VLS_intrinsics.h2)({
    ...{ class: "flex text-2xl md:text-3xl font-black text-(--el-text-color-primary) cursor-pointer" },
});
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['text-2xl']} */ ;
/** @type {__VLS_StyleScopedClasses['md:text-3xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-black']} */ ;
/** @type {__VLS_StyleScopedClasses['text-(--el-text-color-primary)']} */ ;
/** @type {__VLS_StyleScopedClasses['cursor-pointer']} */ ;
let __VLS_18;
/** @ts-ignore @type { | typeof __VLS_components.TextEllipsis} */
TextEllipsis;
// @ts-ignore
const __VLS_19 = __VLS_asFunctionalComponent1(__VLS_18, new __VLS_18({
    text: (`${__VLS_ctx.userStore.userInfo?.name || __VLS_ctx.userStore.userInfo?.username}，欢迎回来！`),
    clickable: (false),
    ...{ class: "text-2xl md:text-3xl font-black text-(--el-text-color-primary)" },
}));
const __VLS_20 = __VLS_19({
    text: (`${__VLS_ctx.userStore.userInfo?.name || __VLS_ctx.userStore.userInfo?.username}，欢迎回来！`),
    clickable: (false),
    ...{ class: "text-2xl md:text-3xl font-black text-(--el-text-color-primary)" },
}, ...__VLS_functionalComponentArgsRest(__VLS_19));
/** @type {__VLS_StyleScopedClasses['text-2xl']} */ ;
/** @type {__VLS_StyleScopedClasses['md:text-3xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-black']} */ ;
/** @type {__VLS_StyleScopedClasses['text-(--el-text-color-primary)']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
let __VLS_23;
/** @ts-ignore @type { | typeof __VLS_components.TextEllipsis} */
TextEllipsis;
// @ts-ignore
const __VLS_24 = __VLS_asFunctionalComponent1(__VLS_23, new __VLS_23({
    text: (`“ ${__VLS_ctx.userStore.userInfo?.bio} ”`),
    ...{ class: "text-(--el-text-color-regular) italic text-sm md:base cursor-pointer" },
}));
const __VLS_25 = __VLS_24({
    text: (`“ ${__VLS_ctx.userStore.userInfo?.bio} ”`),
    ...{ class: "text-(--el-text-color-regular) italic text-sm md:base cursor-pointer" },
}, ...__VLS_functionalComponentArgsRest(__VLS_24));
/** @type {__VLS_StyleScopedClasses['text-(--el-text-color-regular)']} */ ;
/** @type {__VLS_StyleScopedClasses['italic']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['md:base']} */ ;
/** @type {__VLS_StyleScopedClasses['cursor-pointer']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex flex-wrap justify-center lg:justify-start items-center gap-3" },
});
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-wrap']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['lg:justify-start']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-3']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex items-center gap-2 text-xs font-semibold px-3 py-2 text-(--el-text-color-primary) bg-(--el-bg-color-page) rounded-lg" },
});
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['px-3']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-(--el-text-color-primary)']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-(--el-bg-color-page)']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
let __VLS_28;
/** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
elIcon;
// @ts-ignore
const __VLS_29 = __VLS_asFunctionalComponent1(__VLS_28, new __VLS_28({}));
const __VLS_30 = __VLS_29({}, ...__VLS_functionalComponentArgsRest(__VLS_29));
const { default: __VLS_33 } = __VLS_31.slots;
const __VLS_34 = (__VLS_ctx.menuStore.iconComponents['Element:Orange']);
// @ts-ignore
const __VLS_35 = __VLS_asFunctionalComponent1(__VLS_34, new __VLS_34({
    ...{ class: "text-orange-500" },
}));
const __VLS_36 = __VLS_35({
    ...{ class: "text-orange-500" },
}, ...__VLS_functionalComponentArgsRest(__VLS_35));
/** @type {__VLS_StyleScopedClasses['text-orange-500']} */ ;
// @ts-ignore
[userStore, userStore, userStore, userStore, menuStore,];
var __VLS_31;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex items-center gap-2 text-xs font-semibold px-3 py-2 text-(--el-text-color-primary) bg-(--el-bg-color-page) rounded-lg" },
});
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['px-3']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-(--el-text-color-primary)']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-(--el-bg-color-page)']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
let __VLS_39;
/** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
elIcon;
// @ts-ignore
const __VLS_40 = __VLS_asFunctionalComponent1(__VLS_39, new __VLS_39({}));
const __VLS_41 = __VLS_40({}, ...__VLS_functionalComponentArgsRest(__VLS_40));
const { default: __VLS_44 } = __VLS_42.slots;
const __VLS_45 = (__VLS_ctx.menuStore.iconComponents['Element:Monitor']);
// @ts-ignore
const __VLS_46 = __VLS_asFunctionalComponent1(__VLS_45, new __VLS_45({
    ...{ class: "text-indigo-500" },
}));
const __VLS_47 = __VLS_46({
    ...{ class: "text-indigo-500" },
}, ...__VLS_functionalComponentArgsRest(__VLS_46));
/** @type {__VLS_StyleScopedClasses['text-indigo-500']} */ ;
// @ts-ignore
[menuStore,];
var __VLS_42;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
(__VLS_ctx.userStore.address.country);
(__VLS_ctx.userStore.address.region);
(__VLS_ctx.userStore.address.city);
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex items-center gap-2 text-xs font-semibold px-3 py-2 text-(--el-text-color-primary) bg-(--el-bg-color-page) rounded-lg" },
});
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['px-3']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-(--el-text-color-primary)']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-(--el-bg-color-page)']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
let __VLS_50;
/** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
elIcon;
// @ts-ignore
const __VLS_51 = __VLS_asFunctionalComponent1(__VLS_50, new __VLS_50({}));
const __VLS_52 = __VLS_51({}, ...__VLS_functionalComponentArgsRest(__VLS_51));
const { default: __VLS_55 } = __VLS_53.slots;
const __VLS_56 = (__VLS_ctx.menuStore.iconComponents['Element:Calendar']);
// @ts-ignore
const __VLS_57 = __VLS_asFunctionalComponent1(__VLS_56, new __VLS_56({
    ...{ class: "text-emerald-500" },
}));
const __VLS_58 = __VLS_57({
    ...{ class: "text-emerald-500" },
}, ...__VLS_functionalComponentArgsRest(__VLS_57));
/** @type {__VLS_StyleScopedClasses['text-emerald-500']} */ ;
// @ts-ignore
[userStore, userStore, userStore, menuStore,];
var __VLS_53;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
(__VLS_ctx.currentDate);
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex-1 flex justify-center lg:justify-end xl:justify-center" },
});
/** @type {__VLS_StyleScopedClasses['flex-1']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['lg:justify-end']} */ ;
/** @type {__VLS_StyleScopedClasses['xl:justify-center']} */ ;
const __VLS_61 = LottieAnimation;
// @ts-ignore
const __VLS_62 = __VLS_asFunctionalComponent1(__VLS_61, new __VLS_61({
    animationData: (__VLS_ctx.workTimeLottie),
    width: (180),
    height: (140),
    ...{ class: "hidden lg:block" },
}));
const __VLS_63 = __VLS_62({
    animationData: (__VLS_ctx.workTimeLottie),
    width: (180),
    height: (140),
    ...{ class: "hidden lg:block" },
}, ...__VLS_functionalComponentArgsRest(__VLS_62));
/** @type {__VLS_StyleScopedClasses['hidden']} */ ;
/** @type {__VLS_StyleScopedClasses['lg:block']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex flex-col md:flex-row px-2 md:px-6 py-6 md:py-10 items-center gap-6 md:gap-0" },
});
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['md:flex-row']} */ ;
/** @type {__VLS_StyleScopedClasses['px-2']} */ ;
/** @type {__VLS_StyleScopedClasses['md:px-6']} */ ;
/** @type {__VLS_StyleScopedClasses['py-6']} */ ;
/** @type {__VLS_StyleScopedClasses['md:py-10']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-6']} */ ;
/** @type {__VLS_StyleScopedClasses['md:gap-0']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex w-full md:flex-1 flex-col gap-2" },
});
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['md:flex-1']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "text-xs font-semibold text-(--el-text-color-secondary)" },
});
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-(--el-text-color-secondary)']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex items-center gap-2" },
});
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex items-center gap-2 shrink-0" },
});
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['shrink-0']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "text-xl font-extrabold text-(--el-color-primary)" },
});
/** @type {__VLS_StyleScopedClasses['text-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-extrabold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-(--el-color-primary)']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "text-sm font-semibold text-(--el-text-color-secondary)" },
});
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-(--el-text-color-secondary)']} */ ;
let __VLS_66;
/** @ts-ignore @type { | typeof __VLS_components.elProgress | typeof __VLS_components.ElProgress | typeof __VLS_components['el-progress']} */
elProgress;
// @ts-ignore
const __VLS_67 = __VLS_asFunctionalComponent1(__VLS_66, new __VLS_66({
    percentage: (75),
    strokeWidth: (8),
    ...{ class: "flex-1" },
}));
const __VLS_68 = __VLS_67({
    percentage: (75),
    strokeWidth: (8),
    ...{ class: "flex-1" },
}, ...__VLS_functionalComponentArgsRest(__VLS_67));
/** @type {__VLS_StyleScopedClasses['flex-1']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "hidden md:block mx-7" },
});
/** @type {__VLS_StyleScopedClasses['hidden']} */ ;
/** @type {__VLS_StyleScopedClasses['md:block']} */ ;
/** @type {__VLS_StyleScopedClasses['mx-7']} */ ;
let __VLS_71;
/** @ts-ignore @type { | typeof __VLS_components.elDivider | typeof __VLS_components.ElDivider | typeof __VLS_components['el-divider']} */
elDivider;
// @ts-ignore
const __VLS_72 = __VLS_asFunctionalComponent1(__VLS_71, new __VLS_71({
    direction: "vertical",
}));
const __VLS_73 = __VLS_72({
    direction: "vertical",
}, ...__VLS_functionalComponentArgsRest(__VLS_72));
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex w-full md:flex-1 flex-col gap-2" },
});
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['md:flex-1']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "text-xs font-semibold text-(--el-text-color-secondary)" },
});
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-(--el-text-color-secondary)']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex items-center gap-2" },
});
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex items-center gap-2 shrink-0" },
});
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['shrink-0']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "text-xl font-extrabold text-(--el-color-primary)" },
});
/** @type {__VLS_StyleScopedClasses['text-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-extrabold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-(--el-color-primary)']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "text-sm font-semibold text-(--el-text-color-secondary)" },
});
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-(--el-text-color-secondary)']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex items-center" },
});
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
let __VLS_76;
/** @ts-ignore @type { | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar']} */
elAvatar;
// @ts-ignore
const __VLS_77 = __VLS_asFunctionalComponent1(__VLS_76, new __VLS_76({
    size: (20),
    src: "https://api.dicebear.com/7.x/avataaars/svg?seed=1",
    ...{ class: "border-2 rounded-full shadow-xl" },
}));
const __VLS_78 = __VLS_77({
    size: (20),
    src: "https://api.dicebear.com/7.x/avataaars/svg?seed=1",
    ...{ class: "border-2 rounded-full shadow-xl" },
}, ...__VLS_functionalComponentArgsRest(__VLS_77));
/** @type {__VLS_StyleScopedClasses['border-2']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-xl']} */ ;
let __VLS_81;
/** @ts-ignore @type { | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar']} */
elAvatar;
// @ts-ignore
const __VLS_82 = __VLS_asFunctionalComponent1(__VLS_81, new __VLS_81({
    size: (20),
    src: "https://api.dicebear.com/7.x/avataaars/svg?seed=2",
    ...{ class: "border-2 rounded-full shadow-xl -ml-2" },
}));
const __VLS_83 = __VLS_82({
    size: (20),
    src: "https://api.dicebear.com/7.x/avataaars/svg?seed=2",
    ...{ class: "border-2 rounded-full shadow-xl -ml-2" },
}, ...__VLS_functionalComponentArgsRest(__VLS_82));
/** @type {__VLS_StyleScopedClasses['border-2']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['-ml-2']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "text-xs ml-1 font-semibold text-(--el-text-color-secondary)" },
});
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['ml-1']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-(--el-text-color-secondary)']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "hidden md:block mx-7" },
});
/** @type {__VLS_StyleScopedClasses['hidden']} */ ;
/** @type {__VLS_StyleScopedClasses['md:block']} */ ;
/** @type {__VLS_StyleScopedClasses['mx-7']} */ ;
let __VLS_86;
/** @ts-ignore @type { | typeof __VLS_components.elDivider | typeof __VLS_components.ElDivider | typeof __VLS_components['el-divider']} */
elDivider;
// @ts-ignore
const __VLS_87 = __VLS_asFunctionalComponent1(__VLS_86, new __VLS_86({
    direction: "vertical",
}));
const __VLS_88 = __VLS_87({
    direction: "vertical",
}, ...__VLS_functionalComponentArgsRest(__VLS_87));
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex w-full md:flex-1 flex-col gap-2" },
});
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['md:flex-1']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "text-xs font-semibold text-(--el-text-color-secondary)" },
});
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-(--el-text-color-secondary)']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex items-center gap-2" },
});
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "text-xl font-extrabold text-(--el-color-primary)" },
});
/** @type {__VLS_StyleScopedClasses['text-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-extrabold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-(--el-color-primary)']} */ ;
let __VLS_91;
/** @ts-ignore @type { | typeof __VLS_components.BaseTag} */
BaseTag;
// @ts-ignore
const __VLS_92 = __VLS_asFunctionalComponent1(__VLS_91, new __VLS_91({
    text: "High",
    type: "success",
}));
const __VLS_93 = __VLS_92({
    text: "High",
    type: "success",
}, ...__VLS_functionalComponentArgsRest(__VLS_92));
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "hidden xl:block mx-7 my-6" },
});
/** @type {__VLS_StyleScopedClasses['hidden']} */ ;
/** @type {__VLS_StyleScopedClasses['xl:block']} */ ;
/** @type {__VLS_StyleScopedClasses['mx-7']} */ ;
/** @type {__VLS_StyleScopedClasses['my-6']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "w-px h-full border-(--el-border-color) border-l" },
});
/** @type {__VLS_StyleScopedClasses['w-px']} */ ;
/** @type {__VLS_StyleScopedClasses['h-full']} */ ;
/** @type {__VLS_StyleScopedClasses['border-(--el-border-color)']} */ ;
/** @type {__VLS_StyleScopedClasses['border-l']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex-1 xl:flex-[0.8] grid grid-cols-1 sm:grid-cols-2 gap-4" },
});
/** @type {__VLS_StyleScopedClasses['flex-1']} */ ;
/** @type {__VLS_StyleScopedClasses['xl:flex-[0.8]']} */ ;
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['grid-cols-1']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:grid-cols-2']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-4']} */ ;
for (const [item] of __VLS_vFor((__VLS_ctx.statCards))) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        key: (item.label),
        ...{ class: "flex flex-col justify-between p-4 rounded-2xl relative transition-all duration-300 cursor-pointer hover:shadow-xl hover:-translate-y-1" },
    });
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
    /** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
    /** @type {__VLS_StyleScopedClasses['p-4']} */ ;
    /** @type {__VLS_StyleScopedClasses['rounded-2xl']} */ ;
    /** @type {__VLS_StyleScopedClasses['relative']} */ ;
    /** @type {__VLS_StyleScopedClasses['transition-all']} */ ;
    /** @type {__VLS_StyleScopedClasses['duration-300']} */ ;
    /** @type {__VLS_StyleScopedClasses['cursor-pointer']} */ ;
    /** @type {__VLS_StyleScopedClasses['hover:shadow-xl']} */ ;
    /** @type {__VLS_StyleScopedClasses['hover:-translate-y-1']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex items-center justify-center w-9 h-9 rounded-[10px] p-2 mb-3" },
        ...{ style: ({ color: item.color, backgroundColor: item.color + '10' }) },
    });
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['items-center']} */ ;
    /** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
    /** @type {__VLS_StyleScopedClasses['w-9']} */ ;
    /** @type {__VLS_StyleScopedClasses['h-9']} */ ;
    /** @type {__VLS_StyleScopedClasses['rounded-[10px]']} */ ;
    /** @type {__VLS_StyleScopedClasses['p-2']} */ ;
    /** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
    let __VLS_96;
    /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
    elIcon;
    // @ts-ignore
    const __VLS_97 = __VLS_asFunctionalComponent1(__VLS_96, new __VLS_96({
        size: "18",
    }));
    const __VLS_98 = __VLS_97({
        size: "18",
    }, ...__VLS_functionalComponentArgsRest(__VLS_97));
    const { default: __VLS_101 } = __VLS_99.slots;
    const __VLS_102 = (__VLS_ctx.menuStore.iconComponents[item.icon]);
    // @ts-ignore
    const __VLS_103 = __VLS_asFunctionalComponent1(__VLS_102, new __VLS_102({}));
    const __VLS_104 = __VLS_103({}, ...__VLS_functionalComponentArgsRest(__VLS_103));
    // @ts-ignore
    [menuStore, currentDate, workTimeLottie, statCards,];
    var __VLS_99;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "text-[13px] font-semibold text-(--el-text-color-secondary) mb-1" },
    });
    /** @type {__VLS_StyleScopedClasses['text-[13px]']} */ ;
    /** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-(--el-text-color-secondary)']} */ ;
    /** @type {__VLS_StyleScopedClasses['mb-1']} */ ;
    (item.label);
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex items-baseline gap-2" },
    });
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['items-baseline']} */ ;
    /** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "text-[20px] font-extrabold text-(--el-text-color-primary)" },
    });
    /** @type {__VLS_StyleScopedClasses['text-[20px]']} */ ;
    /** @type {__VLS_StyleScopedClasses['font-extrabold']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-(--el-text-color-primary)']} */ ;
    (item.value);
    let __VLS_107;
    /** @ts-ignore @type { | typeof __VLS_components.BaseTag} */
    BaseTag;
    // @ts-ignore
    const __VLS_108 = __VLS_asFunctionalComponent1(__VLS_107, new __VLS_107({
        text: (item.trend),
        type: (item.trendType === 'up' ? 'success' : 'danger'),
    }));
    const __VLS_109 = __VLS_108({
        text: (item.trend),
        type: (item.trendType === 'up' ? 'success' : 'danger'),
    }, ...__VLS_functionalComponentArgsRest(__VLS_108));
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "w-20 h-10 opacity-60 absolute -bottom-1 -right-1" },
    });
    /** @type {__VLS_StyleScopedClasses['w-20']} */ ;
    /** @type {__VLS_StyleScopedClasses['h-10']} */ ;
    /** @type {__VLS_StyleScopedClasses['opacity-60']} */ ;
    /** @type {__VLS_StyleScopedClasses['absolute']} */ ;
    /** @type {__VLS_StyleScopedClasses['-bottom-1']} */ ;
    /** @type {__VLS_StyleScopedClasses['-right-1']} */ ;
    let __VLS_112;
    /** @ts-ignore @type { | typeof __VLS_components.VChart} */
    VChart;
    // @ts-ignore
    const __VLS_113 = __VLS_asFunctionalComponent1(__VLS_112, new __VLS_112({
        ...{ class: "w-full h-full" },
        option: (item.chartOption),
        autoresize: true,
    }));
    const __VLS_114 = __VLS_113({
        ...{ class: "w-full h-full" },
        option: (item.chartOption),
        autoresize: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_113));
    /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
    /** @type {__VLS_StyleScopedClasses['h-full']} */ ;
    // @ts-ignore
    [];
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
