/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import ResourcePanel from '@/views/dashboard/monitor/resourcePanel.vue';
import logsPanel from '@/views/dashboard/monitor/logsPanel.vue';
import ThroughputPanel from '@/views/dashboard/monitor/throughputPanel.vue';
import NodePanel from '@/views/dashboard/monitor/nodePanel.vue';
import MapPanel from '@/views/dashboard/monitor/mapPanel.vue';
defineOptions({ name: 'MonitorView' });
const themeStore = useThemeStore();
const mapPanelRef = useTemplateRef('mapPanelRef');
const resourcePanelRef = useTemplateRef('resourcePanelRef');
const throughputPanelRef = useTemplateRef('throughputPanelRef');
//  监听主题色和主题模式变化，更新图表颜色
watch([() => themeStore.themeConfig.themeMode, () => themeStore.themeConfig.primaryColor], async () => {
    await nextTick();
    mapPanelRef.value?.updateColorTrigger();
    resourcePanelRef.value?.updateColorTrigger();
    throughputPanelRef.value?.updateColorTrigger();
}, { immediate: true });
const __VLS_ctx = {};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex flex-col gap-4" },
});
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-4']} */ ;
const __VLS_0 = ResourcePanel;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    ref: "resourcePanelRef",
}));
const __VLS_2 = __VLS_1({
    ref: "resourcePanelRef",
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_5;
var __VLS_3;
let __VLS_7;
/** @ts-ignore @type { | typeof __VLS_components.elRow | typeof __VLS_components.ElRow | typeof __VLS_components['el-row'] | typeof __VLS_components.elRow | typeof __VLS_components.ElRow | typeof __VLS_components['el-row']} */
elRow;
// @ts-ignore
const __VLS_8 = __VLS_asFunctionalComponent1(__VLS_7, new __VLS_7({
    gutter: (20),
}));
const __VLS_9 = __VLS_8({
    gutter: (20),
}, ...__VLS_functionalComponentArgsRest(__VLS_8));
const { default: __VLS_12 } = __VLS_10.slots;
let __VLS_13;
/** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
elCol;
// @ts-ignore
const __VLS_14 = __VLS_asFunctionalComponent1(__VLS_13, new __VLS_13({
    lg: (16),
}));
const __VLS_15 = __VLS_14({
    lg: (16),
}, ...__VLS_functionalComponentArgsRest(__VLS_14));
const { default: __VLS_18 } = __VLS_16.slots;
const __VLS_19 = MapPanel;
// @ts-ignore
const __VLS_20 = __VLS_asFunctionalComponent1(__VLS_19, new __VLS_19({
    ref: "mapPanelRef",
}));
const __VLS_21 = __VLS_20({
    ref: "mapPanelRef",
}, ...__VLS_functionalComponentArgsRest(__VLS_20));
var __VLS_24;
var __VLS_22;
var __VLS_16;
let __VLS_26;
/** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
elCol;
// @ts-ignore
const __VLS_27 = __VLS_asFunctionalComponent1(__VLS_26, new __VLS_26({
    lg: (8),
    ...{ class: "mt-4 min-[1200px]:mt-0" },
}));
const __VLS_28 = __VLS_27({
    lg: (8),
    ...{ class: "mt-4 min-[1200px]:mt-0" },
}, ...__VLS_functionalComponentArgsRest(__VLS_27));
/** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
/** @type {__VLS_StyleScopedClasses['min-[1200px]:mt-0']} */ ;
const { default: __VLS_31 } = __VLS_29.slots;
const __VLS_32 = NodePanel;
// @ts-ignore
const __VLS_33 = __VLS_asFunctionalComponent1(__VLS_32, new __VLS_32({}));
const __VLS_34 = __VLS_33({}, ...__VLS_functionalComponentArgsRest(__VLS_33));
var __VLS_29;
var __VLS_10;
let __VLS_37;
/** @ts-ignore @type { | typeof __VLS_components.elRow | typeof __VLS_components.ElRow | typeof __VLS_components['el-row'] | typeof __VLS_components.elRow | typeof __VLS_components.ElRow | typeof __VLS_components['el-row']} */
elRow;
// @ts-ignore
const __VLS_38 = __VLS_asFunctionalComponent1(__VLS_37, new __VLS_37({
    gutter: (20),
}));
const __VLS_39 = __VLS_38({
    gutter: (20),
}, ...__VLS_functionalComponentArgsRest(__VLS_38));
const { default: __VLS_42 } = __VLS_40.slots;
let __VLS_43;
/** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
elCol;
// @ts-ignore
const __VLS_44 = __VLS_asFunctionalComponent1(__VLS_43, new __VLS_43({
    lg: (16),
}));
const __VLS_45 = __VLS_44({
    lg: (16),
}, ...__VLS_functionalComponentArgsRest(__VLS_44));
const { default: __VLS_48 } = __VLS_46.slots;
const __VLS_49 = logsPanel;
// @ts-ignore
const __VLS_50 = __VLS_asFunctionalComponent1(__VLS_49, new __VLS_49({}));
const __VLS_51 = __VLS_50({}, ...__VLS_functionalComponentArgsRest(__VLS_50));
var __VLS_46;
let __VLS_54;
/** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
elCol;
// @ts-ignore
const __VLS_55 = __VLS_asFunctionalComponent1(__VLS_54, new __VLS_54({
    lg: (8),
    ...{ class: "mt-4 min-[1200px]:mt-0" },
}));
const __VLS_56 = __VLS_55({
    lg: (8),
    ...{ class: "mt-4 min-[1200px]:mt-0" },
}, ...__VLS_functionalComponentArgsRest(__VLS_55));
/** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
/** @type {__VLS_StyleScopedClasses['min-[1200px]:mt-0']} */ ;
const { default: __VLS_59 } = __VLS_57.slots;
const __VLS_60 = ThroughputPanel;
// @ts-ignore
const __VLS_61 = __VLS_asFunctionalComponent1(__VLS_60, new __VLS_60({
    ref: "throughputPanelRef",
}));
const __VLS_62 = __VLS_61({
    ref: "throughputPanelRef",
}, ...__VLS_functionalComponentArgsRest(__VLS_61));
var __VLS_65;
var __VLS_63;
var __VLS_57;
var __VLS_40;
// @ts-ignore
var __VLS_6 = __VLS_5, __VLS_25 = __VLS_24, __VLS_66 = __VLS_65;
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
