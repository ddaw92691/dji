/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import OverviewHeader from '@/views/dashboard/analysis/overviewHeader.vue';
import RevenueProfitAnalysis from '@/views/dashboard/analysis/revenueProfitAnalysis.vue';
import MarketShare from '@/views/dashboard/analysis/marketShare.vue';
import TopCategories from '@/views/dashboard/analysis/topCategories.vue';
import GoalsAndTodayStart from '@/views/dashboard/analysis/goalsAndTodayStart.vue';
import ChannelSales from '@/views/dashboard/analysis/channelSales.vue';
import OperationalEvent from '@/views/dashboard/analysis/operationalEvent.vue';
defineOptions({ name: 'AnalysisView' });
const themeStore = useThemeStore();
const marketShareRef = useTemplateRef('marketShareRef');
const topCategoriesRef = useTemplateRef('topCategoriesRef');
const revenueProfitAnalysisRef = useTemplateRef('revenueProfitAnalysisRef');
//  监听主题色和主题模式变化，更新图表颜色
watch([() => themeStore.themeConfig.themeMode, () => themeStore.themeConfig.primaryColor], async () => {
    await nextTick();
    marketShareRef.value?.updateColorTrigger();
    topCategoriesRef.value?.updateColorTrigger();
    revenueProfitAnalysisRef.value?.updateColorTrigger();
}, { immediate: true });
const __VLS_ctx = {};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex-1 h-full flex flex-col gap-6" },
});
/** @type {__VLS_StyleScopedClasses['flex-1']} */ ;
/** @type {__VLS_StyleScopedClasses['h-full']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-6']} */ ;
const __VLS_0 = OverviewHeader;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({}));
const __VLS_2 = __VLS_1({}, ...__VLS_functionalComponentArgsRest(__VLS_1));
const __VLS_5 = RevenueProfitAnalysis;
// @ts-ignore
const __VLS_6 = __VLS_asFunctionalComponent1(__VLS_5, new __VLS_5({
    ref: "revenueProfitAnalysisRef",
}));
const __VLS_7 = __VLS_6({
    ref: "revenueProfitAnalysisRef",
}, ...__VLS_functionalComponentArgsRest(__VLS_6));
var __VLS_10;
var __VLS_8;
let __VLS_12;
/** @ts-ignore @type { | typeof __VLS_components.elRow | typeof __VLS_components.ElRow | typeof __VLS_components['el-row'] | typeof __VLS_components.elRow | typeof __VLS_components.ElRow | typeof __VLS_components['el-row']} */
elRow;
// @ts-ignore
const __VLS_13 = __VLS_asFunctionalComponent1(__VLS_12, new __VLS_12({
    gutter: (20),
}));
const __VLS_14 = __VLS_13({
    gutter: (20),
}, ...__VLS_functionalComponentArgsRest(__VLS_13));
const { default: __VLS_17 } = __VLS_15.slots;
let __VLS_18;
/** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
elCol;
// @ts-ignore
const __VLS_19 = __VLS_asFunctionalComponent1(__VLS_18, new __VLS_18({
    xs: (24),
    md: (12),
    lg: (8),
}));
const __VLS_20 = __VLS_19({
    xs: (24),
    md: (12),
    lg: (8),
}, ...__VLS_functionalComponentArgsRest(__VLS_19));
const { default: __VLS_23 } = __VLS_21.slots;
const __VLS_24 = MarketShare;
// @ts-ignore
const __VLS_25 = __VLS_asFunctionalComponent1(__VLS_24, new __VLS_24({
    ref: "marketShareRef",
}));
const __VLS_26 = __VLS_25({
    ref: "marketShareRef",
}, ...__VLS_functionalComponentArgsRest(__VLS_25));
var __VLS_29;
var __VLS_27;
var __VLS_21;
let __VLS_31;
/** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
elCol;
// @ts-ignore
const __VLS_32 = __VLS_asFunctionalComponent1(__VLS_31, new __VLS_31({
    xs: (24),
    md: (12),
    lg: (8),
    ...{ class: "mt-4 min-[992px]:mt-0" },
}));
const __VLS_33 = __VLS_32({
    xs: (24),
    md: (12),
    lg: (8),
    ...{ class: "mt-4 min-[992px]:mt-0" },
}, ...__VLS_functionalComponentArgsRest(__VLS_32));
/** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
/** @type {__VLS_StyleScopedClasses['min-[992px]:mt-0']} */ ;
const { default: __VLS_36 } = __VLS_34.slots;
const __VLS_37 = TopCategories;
// @ts-ignore
const __VLS_38 = __VLS_asFunctionalComponent1(__VLS_37, new __VLS_37({
    ref: "topCategoriesRef",
}));
const __VLS_39 = __VLS_38({
    ref: "topCategoriesRef",
}, ...__VLS_functionalComponentArgsRest(__VLS_38));
var __VLS_42;
var __VLS_40;
var __VLS_34;
let __VLS_44;
/** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
elCol;
// @ts-ignore
const __VLS_45 = __VLS_asFunctionalComponent1(__VLS_44, new __VLS_44({
    xs: (24),
    md: (24),
    lg: (8),
    ...{ class: "mt-4 min-[1200px]:mt-0" },
}));
const __VLS_46 = __VLS_45({
    xs: (24),
    md: (24),
    lg: (8),
    ...{ class: "mt-4 min-[1200px]:mt-0" },
}, ...__VLS_functionalComponentArgsRest(__VLS_45));
/** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
/** @type {__VLS_StyleScopedClasses['min-[1200px]:mt-0']} */ ;
const { default: __VLS_49 } = __VLS_47.slots;
const __VLS_50 = GoalsAndTodayStart;
// @ts-ignore
const __VLS_51 = __VLS_asFunctionalComponent1(__VLS_50, new __VLS_50({}));
const __VLS_52 = __VLS_51({}, ...__VLS_functionalComponentArgsRest(__VLS_51));
var __VLS_47;
var __VLS_15;
let __VLS_55;
/** @ts-ignore @type { | typeof __VLS_components.elRow | typeof __VLS_components.ElRow | typeof __VLS_components['el-row'] | typeof __VLS_components.elRow | typeof __VLS_components.ElRow | typeof __VLS_components['el-row']} */
elRow;
// @ts-ignore
const __VLS_56 = __VLS_asFunctionalComponent1(__VLS_55, new __VLS_55({
    gutter: (20),
}));
const __VLS_57 = __VLS_56({
    gutter: (20),
}, ...__VLS_functionalComponentArgsRest(__VLS_56));
const { default: __VLS_60 } = __VLS_58.slots;
let __VLS_61;
/** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
elCol;
// @ts-ignore
const __VLS_62 = __VLS_asFunctionalComponent1(__VLS_61, new __VLS_61({
    xs: (24),
    lg: (14),
}));
const __VLS_63 = __VLS_62({
    xs: (24),
    lg: (14),
}, ...__VLS_functionalComponentArgsRest(__VLS_62));
const { default: __VLS_66 } = __VLS_64.slots;
const __VLS_67 = ChannelSales;
// @ts-ignore
const __VLS_68 = __VLS_asFunctionalComponent1(__VLS_67, new __VLS_67({}));
const __VLS_69 = __VLS_68({}, ...__VLS_functionalComponentArgsRest(__VLS_68));
var __VLS_64;
let __VLS_72;
/** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
elCol;
// @ts-ignore
const __VLS_73 = __VLS_asFunctionalComponent1(__VLS_72, new __VLS_72({
    xs: (24),
    lg: (10),
    ...{ class: "mt-4 min-[1200px]:mt-0" },
}));
const __VLS_74 = __VLS_73({
    xs: (24),
    lg: (10),
    ...{ class: "mt-4 min-[1200px]:mt-0" },
}, ...__VLS_functionalComponentArgsRest(__VLS_73));
/** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
/** @type {__VLS_StyleScopedClasses['min-[1200px]:mt-0']} */ ;
const { default: __VLS_77 } = __VLS_75.slots;
const __VLS_78 = OperationalEvent;
// @ts-ignore
const __VLS_79 = __VLS_asFunctionalComponent1(__VLS_78, new __VLS_78({}));
const __VLS_80 = __VLS_79({}, ...__VLS_functionalComponentArgsRest(__VLS_79));
var __VLS_75;
var __VLS_58;
// @ts-ignore
var __VLS_11 = __VLS_10, __VLS_30 = __VLS_29, __VLS_43 = __VLS_42;
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
