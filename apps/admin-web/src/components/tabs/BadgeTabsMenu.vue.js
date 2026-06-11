/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
// 禁用自动属性继承，手动控制属性透传
defineOptions({ inheritAttrs: false });
const props = withDefaults(defineProps(), {
    badgeIsDot: false,
    badgeMax: 99,
    badgeShowZero: false,
    badgeType: 'danger',
    iconOnly: false,
});
const emits = defineEmits();
const menuStore = useMenuStore();
const attrs = useAttrs();
// 计算title icon 组件 (如果自己使用 可替换为自己的图标库 或者直接传递图标组件)
const titleIconComponent = (icon) => {
    if (typeof icon === 'string') {
        return menuStore.iconComponents[icon];
    }
    return icon;
};
// 计算 tabs item 高度
const tabsItemHeightComputed = computed(() => {
    const height = props.tabsItemHeight;
    if (typeof height === 'number') {
        // 数字直接加 px
        return `${height}px`;
    }
    else if (typeof height === 'string') {
        // 字符串，检查是否带单位
        // 简单正则判断结尾是否有单位，比如 px / em / rem / %
        const unitRegex = /(px|em|rem|%)$/i;
        return unitRegex.test(height) ? height : `${height}px`;
    }
    else {
        // 兜底
        return '40px';
    }
});
// 更新 modelValue
const handleUpdate = (value) => {
    emits('update:modelValue', value);
};
const __VLS_defaults = {
    badgeIsDot: false,
    badgeMax: 99,
    badgeShowZero: false,
    badgeType: 'danger',
    iconOnly: false,
};
const __VLS_ctx = {
    ...{},
    ...{},
    ...{},
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
(__VLS_ctx.tabsItemHeightComputed);
// @ts-ignore
[tabsItemHeightComputed,];
let __VLS_0;
/** @ts-ignore @type { | typeof __VLS_components.elTabs | typeof __VLS_components.ElTabs | typeof __VLS_components['el-tabs'] | typeof __VLS_components.elTabs | typeof __VLS_components.ElTabs | typeof __VLS_components['el-tabs']} */
elTabs;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    ...{ 'onUpdate:modelValue': {} },
    modelValue: (__VLS_ctx.modelValue),
    ...{ class: "badge-tabs-menu" },
    ...(__VLS_ctx.attrs),
}));
const __VLS_2 = __VLS_1({
    ...{ 'onUpdate:modelValue': {} },
    modelValue: (__VLS_ctx.modelValue),
    ...{ class: "badge-tabs-menu" },
    ...(__VLS_ctx.attrs),
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
let __VLS_5;
const __VLS_6 = {
    ...{ 'update:modelValue': {} },
    'onUpdate:modelValue': (__VLS_ctx.handleUpdate),
};
var __VLS_7;
/** @type {__VLS_StyleScopedClasses['badge-tabs-menu']} */ ;
const { default: __VLS_8 } = __VLS_3.slots;
for (const [tab] of __VLS_vFor((__VLS_ctx.tabsMenuData))) {
    let __VLS_9;
    /** @ts-ignore @type { | typeof __VLS_components.elTabPane | typeof __VLS_components.ElTabPane | typeof __VLS_components['el-tab-pane'] | typeof __VLS_components.elTabPane | typeof __VLS_components.ElTabPane | typeof __VLS_components['el-tab-pane']} */
    elTabPane;
    // @ts-ignore
    const __VLS_10 = __VLS_asFunctionalComponent1(__VLS_9, new __VLS_9({
        name: (tab.key),
        key: (tab.key),
        disabled: (tab.disabled),
    }));
    const __VLS_11 = __VLS_10({
        name: (tab.key),
        key: (tab.key),
        disabled: (tab.disabled),
    }, ...__VLS_functionalComponentArgsRest(__VLS_10));
    const { default: __VLS_14 } = __VLS_12.slots;
    {
        const { label: __VLS_15 } = __VLS_12.slots;
        let __VLS_16;
        /** @ts-ignore @type { | typeof __VLS_components.elBadge | typeof __VLS_components.ElBadge | typeof __VLS_components['el-badge'] | typeof __VLS_components.elBadge | typeof __VLS_components.ElBadge | typeof __VLS_components['el-badge']} */
        elBadge;
        // @ts-ignore
        const __VLS_17 = __VLS_asFunctionalComponent1(__VLS_16, new __VLS_16({
            value: (tab.badge),
            max: (__VLS_ctx.badgeMax),
            showZero: (__VLS_ctx.badgeShowZero),
            offset: ([10, 5]),
            isDot: (__VLS_ctx.badgeIsDot),
            type: (__VLS_ctx.badgeType),
        }));
        const __VLS_18 = __VLS_17({
            value: (tab.badge),
            max: (__VLS_ctx.badgeMax),
            showZero: (__VLS_ctx.badgeShowZero),
            offset: ([10, 5]),
            isDot: (__VLS_ctx.badgeIsDot),
            type: (__VLS_ctx.badgeType),
        }, ...__VLS_functionalComponentArgsRest(__VLS_17));
        const { default: __VLS_21 } = __VLS_19.slots;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "title-wrap" },
        });
        /** @type {__VLS_StyleScopedClasses['title-wrap']} */ ;
        if (tab.icon) {
            let __VLS_22;
            /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
            elIcon;
            // @ts-ignore
            const __VLS_23 = __VLS_asFunctionalComponent1(__VLS_22, new __VLS_22({
                size: "18",
            }));
            const __VLS_24 = __VLS_23({
                size: "18",
            }, ...__VLS_functionalComponentArgsRest(__VLS_23));
            const { default: __VLS_27 } = __VLS_25.slots;
            const __VLS_28 = (__VLS_ctx.titleIconComponent(tab.icon));
            // @ts-ignore
            const __VLS_29 = __VLS_asFunctionalComponent1(__VLS_28, new __VLS_28({}));
            const __VLS_30 = __VLS_29({}, ...__VLS_functionalComponentArgsRest(__VLS_29));
            // @ts-ignore
            [modelValue, attrs, handleUpdate, tabsMenuData, badgeMax, badgeShowZero, badgeIsDot, badgeType, titleIconComponent,];
            var __VLS_25;
        }
        if (!__VLS_ctx.iconOnly) {
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
            (tab.label);
        }
        // @ts-ignore
        [iconOnly,];
        var __VLS_19;
        // @ts-ignore
        [];
    }
    {
        const { default: __VLS_33 } = __VLS_12.slots;
        var __VLS_34 = {};
        var __VLS_35 = __VLS_tryAsConstant(tab.key);
        // @ts-ignore
        [];
    }
    // @ts-ignore
    [];
    var __VLS_12;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_3;
var __VLS_4;
// @ts-ignore
var __VLS_36 = __VLS_35, __VLS_37 = __VLS_34;
// @ts-ignore
[];
const __VLS_base = (await import('vue')).defineComponent({
    __typeEmits: {},
    __defaults: __VLS_defaults,
    __typeProps: {},
});
const __VLS_export = {};
export default {};
