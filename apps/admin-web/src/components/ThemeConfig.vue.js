/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { Sunny, Moon, Grid, Menu, Brush, View } from '@element-plus/icons-vue';
defineOptions({ name: 'ThemeConfig' });
const themeStore = useThemeStore();
const menuStore = useMenuStore();
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['el-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['preview-header']} */ ;
/** @type {__VLS_StyleScopedClasses['preview-main']} */ ;
/** @type {__VLS_StyleScopedClasses['layout-label']} */ ;
/** @type {__VLS_StyleScopedClasses['active']} */ ;
/** @type {__VLS_StyleScopedClasses['layout-label']} */ ;
/** @type {__VLS_StyleScopedClasses['active']} */ ;
/** @type {__VLS_StyleScopedClasses['el-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['el-radio-button__inner']} */ ;
let __VLS_0;
/** @ts-ignore @type { | typeof __VLS_components.elDrawer | typeof __VLS_components.ElDrawer | typeof __VLS_components['el-drawer'] | typeof __VLS_components.elDrawer | typeof __VLS_components.ElDrawer | typeof __VLS_components['el-drawer']} */
elDrawer;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    modelValue: (__VLS_ctx.themeStore.themeConfigDrawerOpen),
    size: (380),
    title: "主题配置",
}));
const __VLS_2 = __VLS_1({
    modelValue: (__VLS_ctx.themeStore.themeConfigDrawerOpen),
    size: (380),
    title: "主题配置",
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_5;
const { default: __VLS_6 } = __VLS_3.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "config-section" },
});
/** @type {__VLS_StyleScopedClasses['config-section']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "section-title" },
});
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
let __VLS_7;
/** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
elIcon;
// @ts-ignore
const __VLS_8 = __VLS_asFunctionalComponent1(__VLS_7, new __VLS_7({}));
const __VLS_9 = __VLS_8({}, ...__VLS_functionalComponentArgsRest(__VLS_8));
const { default: __VLS_12 } = __VLS_10.slots;
let __VLS_13;
/** @ts-ignore @type { | typeof __VLS_components.Sunny} */
Sunny;
// @ts-ignore
const __VLS_14 = __VLS_asFunctionalComponent1(__VLS_13, new __VLS_13({}));
const __VLS_15 = __VLS_14({}, ...__VLS_functionalComponentArgsRest(__VLS_14));
// @ts-ignore
[themeStore,];
var __VLS_10;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "section-content" },
});
/** @type {__VLS_StyleScopedClasses['section-content']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "mode-chip-group" },
});
/** @type {__VLS_StyleScopedClasses['mode-chip-group']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.themeStore.toggleThemeMode('light');
            // @ts-ignore
            [themeStore,];
        } },
    ...{ class: "mode-chip" },
    ...{ class: ({ active: __VLS_ctx.themeStore.themeConfig.themeMode === 'light' }) },
});
/** @type {__VLS_StyleScopedClasses['mode-chip']} */ ;
/** @type {__VLS_StyleScopedClasses['active']} */ ;
let __VLS_18;
/** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
elIcon;
// @ts-ignore
const __VLS_19 = __VLS_asFunctionalComponent1(__VLS_18, new __VLS_18({}));
const __VLS_20 = __VLS_19({}, ...__VLS_functionalComponentArgsRest(__VLS_19));
const { default: __VLS_23 } = __VLS_21.slots;
let __VLS_24;
/** @ts-ignore @type { | typeof __VLS_components.Sunny} */
Sunny;
// @ts-ignore
const __VLS_25 = __VLS_asFunctionalComponent1(__VLS_24, new __VLS_24({}));
const __VLS_26 = __VLS_25({}, ...__VLS_functionalComponentArgsRest(__VLS_25));
// @ts-ignore
[themeStore,];
var __VLS_21;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.themeStore.toggleThemeMode('dark');
            // @ts-ignore
            [themeStore,];
        } },
    ...{ class: "mode-chip" },
    ...{ class: ({ active: __VLS_ctx.themeStore.themeConfig.themeMode === 'dark' }) },
});
/** @type {__VLS_StyleScopedClasses['mode-chip']} */ ;
/** @type {__VLS_StyleScopedClasses['active']} */ ;
let __VLS_29;
/** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
elIcon;
// @ts-ignore
const __VLS_30 = __VLS_asFunctionalComponent1(__VLS_29, new __VLS_29({}));
const __VLS_31 = __VLS_30({}, ...__VLS_functionalComponentArgsRest(__VLS_30));
const { default: __VLS_34 } = __VLS_32.slots;
let __VLS_35;
/** @ts-ignore @type { | typeof __VLS_components.Moon} */
Moon;
// @ts-ignore
const __VLS_36 = __VLS_asFunctionalComponent1(__VLS_35, new __VLS_35({}));
const __VLS_37 = __VLS_36({}, ...__VLS_functionalComponentArgsRest(__VLS_36));
// @ts-ignore
[themeStore,];
var __VLS_32;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "config-section" },
});
/** @type {__VLS_StyleScopedClasses['config-section']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "section-title" },
});
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
let __VLS_40;
/** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
elIcon;
// @ts-ignore
const __VLS_41 = __VLS_asFunctionalComponent1(__VLS_40, new __VLS_40({}));
const __VLS_42 = __VLS_41({}, ...__VLS_functionalComponentArgsRest(__VLS_41));
const { default: __VLS_45 } = __VLS_43.slots;
let __VLS_46;
/** @ts-ignore @type { | typeof __VLS_components.Grid} */
Grid;
// @ts-ignore
const __VLS_47 = __VLS_asFunctionalComponent1(__VLS_46, new __VLS_46({}));
const __VLS_48 = __VLS_47({}, ...__VLS_functionalComponentArgsRest(__VLS_47));
// @ts-ignore
[];
var __VLS_43;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "section-content" },
});
/** @type {__VLS_StyleScopedClasses['section-content']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "layout-preview-group" },
});
/** @type {__VLS_StyleScopedClasses['layout-preview-group']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.themeStore.toggleLayout('leftMode');
            // @ts-ignore
            [themeStore,];
        } },
    ...{ class: "layout-preview-item" },
    ...{ class: ({ active: __VLS_ctx.themeStore.themeConfig.layout === 'leftMode' }) },
});
/** @type {__VLS_StyleScopedClasses['layout-preview-item']} */ ;
/** @type {__VLS_StyleScopedClasses['active']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "layout-preview left-layout" },
});
/** @type {__VLS_StyleScopedClasses['layout-preview']} */ ;
/** @type {__VLS_StyleScopedClasses['left-layout']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "preview-sidebar" },
});
/** @type {__VLS_StyleScopedClasses['preview-sidebar']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "preview-content" },
});
/** @type {__VLS_StyleScopedClasses['preview-content']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "preview-header" },
});
/** @type {__VLS_StyleScopedClasses['preview-header']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "preview-main" },
});
/** @type {__VLS_StyleScopedClasses['preview-main']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "layout-label" },
});
/** @type {__VLS_StyleScopedClasses['layout-label']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ onClick: (...[$event]) => {
            (__VLS_ctx.themeStore.toggleLayout('topMode'), (__VLS_ctx.menuStore.isCollapse = false));
            // @ts-ignore
            [themeStore, themeStore, menuStore,];
        } },
    ...{ class: "layout-preview-item" },
    ...{ class: ({ active: __VLS_ctx.themeStore.themeConfig.layout === 'topMode' }) },
});
/** @type {__VLS_StyleScopedClasses['layout-preview-item']} */ ;
/** @type {__VLS_StyleScopedClasses['active']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "layout-preview top-layout" },
});
/** @type {__VLS_StyleScopedClasses['layout-preview']} */ ;
/** @type {__VLS_StyleScopedClasses['top-layout']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "preview-header" },
});
/** @type {__VLS_StyleScopedClasses['preview-header']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "preview-main" },
});
/** @type {__VLS_StyleScopedClasses['preview-main']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "layout-label" },
});
/** @type {__VLS_StyleScopedClasses['layout-label']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "config-section" },
});
/** @type {__VLS_StyleScopedClasses['config-section']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "section-title" },
});
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
let __VLS_51;
/** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
elIcon;
// @ts-ignore
const __VLS_52 = __VLS_asFunctionalComponent1(__VLS_51, new __VLS_51({}));
const __VLS_53 = __VLS_52({}, ...__VLS_functionalComponentArgsRest(__VLS_52));
const { default: __VLS_56 } = __VLS_54.slots;
let __VLS_57;
/** @ts-ignore @type { | typeof __VLS_components.Brush} */
Brush;
// @ts-ignore
const __VLS_58 = __VLS_asFunctionalComponent1(__VLS_57, new __VLS_57({}));
const __VLS_59 = __VLS_58({}, ...__VLS_functionalComponentArgsRest(__VLS_58));
// @ts-ignore
[themeStore,];
var __VLS_54;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "section-content theme-color-content" },
});
/** @type {__VLS_StyleScopedClasses['section-content']} */ ;
/** @type {__VLS_StyleScopedClasses['theme-color-content']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "color-chip-group" },
});
/** @type {__VLS_StyleScopedClasses['color-chip-group']} */ ;
for (const [color] of __VLS_vFor((__VLS_ctx.themeStore.primaryColorOptions))) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ onClick: (...[$event]) => {
                __VLS_ctx.themeStore.togglePrimaryColor(color.value);
                // @ts-ignore
                [themeStore, themeStore,];
            } },
        key: (color.value),
        ...{ class: "color-chip" },
        ...{ class: ({ active: __VLS_ctx.themeStore.themeConfig.primaryColor === color.value }) },
    });
    /** @type {__VLS_StyleScopedClasses['color-chip']} */ ;
    /** @type {__VLS_StyleScopedClasses['active']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "chip-dot" },
        ...{ style: ({ backgroundColor: color.value }) },
    });
    /** @type {__VLS_StyleScopedClasses['chip-dot']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "chip-name" },
    });
    /** @type {__VLS_StyleScopedClasses['chip-name']} */ ;
    (color.name);
    // @ts-ignore
    [themeStore,];
}
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "custom-color" },
});
/** @type {__VLS_StyleScopedClasses['custom-color']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
let __VLS_62;
/** @ts-ignore @type { | typeof __VLS_components.elColorPicker | typeof __VLS_components.ElColorPicker | typeof __VLS_components['el-color-picker']} */
elColorPicker;
// @ts-ignore
const __VLS_63 = __VLS_asFunctionalComponent1(__VLS_62, new __VLS_62({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.themeStore.themeConfig.primaryColor),
    showAlpha: true,
}));
const __VLS_64 = __VLS_63({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.themeStore.themeConfig.primaryColor),
    showAlpha: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_63));
let __VLS_67;
const __VLS_68 = {
    ...{ change: {} },
    onChange: ((value) => __VLS_ctx.themeStore.togglePrimaryColor(value)),
};
var __VLS_65;
var __VLS_66;
let __VLS_69;
/** @ts-ignore @type { | typeof __VLS_components.Transition | typeof __VLS_components.Transition} */
Transition;
// @ts-ignore
const __VLS_70 = __VLS_asFunctionalComponent1(__VLS_69, new __VLS_69({
    name: "slide-left",
}));
const __VLS_71 = __VLS_70({
    name: "slide-left",
}, ...__VLS_functionalComponentArgsRest(__VLS_70));
const { default: __VLS_74 } = __VLS_72.slots;
if (__VLS_ctx.themeStore.themeConfig.themeMode !== 'dark' && __VLS_ctx.themeStore.themeConfig.layout !== 'topMode') {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "config-section" },
    });
    /** @type {__VLS_StyleScopedClasses['config-section']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "section-title" },
    });
    /** @type {__VLS_StyleScopedClasses['section-title']} */ ;
    let __VLS_75;
    /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
    elIcon;
    // @ts-ignore
    const __VLS_76 = __VLS_asFunctionalComponent1(__VLS_75, new __VLS_75({}));
    const __VLS_77 = __VLS_76({}, ...__VLS_functionalComponentArgsRest(__VLS_76));
    const { default: __VLS_80 } = __VLS_78.slots;
    let __VLS_81;
    /** @ts-ignore @type { | typeof __VLS_components.Menu} */
    Menu;
    // @ts-ignore
    const __VLS_82 = __VLS_asFunctionalComponent1(__VLS_81, new __VLS_81({}));
    const __VLS_83 = __VLS_82({}, ...__VLS_functionalComponentArgsRest(__VLS_82));
    // @ts-ignore
    [themeStore, themeStore, themeStore, themeStore,];
    var __VLS_78;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "section-content" },
    });
    /** @type {__VLS_StyleScopedClasses['section-content']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "dual-item" },
    });
    /** @type {__VLS_StyleScopedClasses['dual-item']} */ ;
    let __VLS_86;
    /** @ts-ignore @type { | typeof __VLS_components.elRadioGroup | typeof __VLS_components.ElRadioGroup | typeof __VLS_components['el-radio-group'] | typeof __VLS_components.elRadioGroup | typeof __VLS_components.ElRadioGroup | typeof __VLS_components['el-radio-group']} */
    elRadioGroup;
    // @ts-ignore
    const __VLS_87 = __VLS_asFunctionalComponent1(__VLS_86, new __VLS_86({
        modelValue: (__VLS_ctx.themeStore.themeConfig.sidebarMode),
        ...{ class: "mode-radio-group" },
    }));
    const __VLS_88 = __VLS_87({
        modelValue: (__VLS_ctx.themeStore.themeConfig.sidebarMode),
        ...{ class: "mode-radio-group" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_87));
    /** @type {__VLS_StyleScopedClasses['mode-radio-group']} */ ;
    const { default: __VLS_91 } = __VLS_89.slots;
    let __VLS_92;
    /** @ts-ignore @type { | typeof __VLS_components.elRadioButton | typeof __VLS_components.ElRadioButton | typeof __VLS_components['el-radio-button'] | typeof __VLS_components.elRadioButton | typeof __VLS_components.ElRadioButton | typeof __VLS_components['el-radio-button']} */
    elRadioButton;
    // @ts-ignore
    const __VLS_93 = __VLS_asFunctionalComponent1(__VLS_92, new __VLS_92({
        value: "light",
    }));
    const __VLS_94 = __VLS_93({
        value: "light",
    }, ...__VLS_functionalComponentArgsRest(__VLS_93));
    const { default: __VLS_97 } = __VLS_95.slots;
    // @ts-ignore
    [themeStore,];
    var __VLS_95;
    let __VLS_98;
    /** @ts-ignore @type { | typeof __VLS_components.elRadioButton | typeof __VLS_components.ElRadioButton | typeof __VLS_components['el-radio-button'] | typeof __VLS_components.elRadioButton | typeof __VLS_components.ElRadioButton | typeof __VLS_components['el-radio-button']} */
    elRadioButton;
    // @ts-ignore
    const __VLS_99 = __VLS_asFunctionalComponent1(__VLS_98, new __VLS_98({
        value: "dark",
    }));
    const __VLS_100 = __VLS_99({
        value: "dark",
    }, ...__VLS_functionalComponentArgsRest(__VLS_99));
    const { default: __VLS_103 } = __VLS_101.slots;
    // @ts-ignore
    [];
    var __VLS_101;
    // @ts-ignore
    [];
    var __VLS_89;
}
// @ts-ignore
[];
var __VLS_72;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "config-section" },
});
/** @type {__VLS_StyleScopedClasses['config-section']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "section-title" },
});
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
let __VLS_104;
/** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
elIcon;
// @ts-ignore
const __VLS_105 = __VLS_asFunctionalComponent1(__VLS_104, new __VLS_104({}));
const __VLS_106 = __VLS_105({}, ...__VLS_functionalComponentArgsRest(__VLS_105));
const { default: __VLS_109 } = __VLS_107.slots;
let __VLS_110;
/** @ts-ignore @type { | typeof __VLS_components.View} */
View;
// @ts-ignore
const __VLS_111 = __VLS_asFunctionalComponent1(__VLS_110, new __VLS_110({}));
const __VLS_112 = __VLS_111({}, ...__VLS_functionalComponentArgsRest(__VLS_111));
// @ts-ignore
[];
var __VLS_107;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "section-content toggles-row" },
});
/** @type {__VLS_StyleScopedClasses['section-content']} */ ;
/** @type {__VLS_StyleScopedClasses['toggles-row']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "toggle-item" },
});
/** @type {__VLS_StyleScopedClasses['toggle-item']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
let __VLS_115;
/** @ts-ignore @type { | typeof __VLS_components.elSwitch | typeof __VLS_components.ElSwitch | typeof __VLS_components['el-switch']} */
elSwitch;
// @ts-ignore
const __VLS_116 = __VLS_asFunctionalComponent1(__VLS_115, new __VLS_115({
    modelValue: (__VLS_ctx.themeStore.themeConfig.showLogo),
}));
const __VLS_117 = __VLS_116({
    modelValue: (__VLS_ctx.themeStore.themeConfig.showLogo),
}, ...__VLS_functionalComponentArgsRest(__VLS_116));
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "toggle-item" },
});
/** @type {__VLS_StyleScopedClasses['toggle-item']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
let __VLS_120;
/** @ts-ignore @type { | typeof __VLS_components.elSwitch | typeof __VLS_components.ElSwitch | typeof __VLS_components['el-switch']} */
elSwitch;
// @ts-ignore
const __VLS_121 = __VLS_asFunctionalComponent1(__VLS_120, new __VLS_120({
    modelValue: (__VLS_ctx.themeStore.themeConfig.showTabs),
}));
const __VLS_122 = __VLS_121({
    modelValue: (__VLS_ctx.themeStore.themeConfig.showTabs),
}, ...__VLS_functionalComponentArgsRest(__VLS_121));
{
    const { footer: __VLS_125 } = __VLS_3.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "config-footer" },
    });
    /** @type {__VLS_StyleScopedClasses['config-footer']} */ ;
    let __VLS_126;
    /** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
    elTooltip;
    // @ts-ignore
    const __VLS_127 = __VLS_asFunctionalComponent1(__VLS_126, new __VLS_126({
        placement: "top",
    }));
    const __VLS_128 = __VLS_127({
        placement: "top",
    }, ...__VLS_functionalComponentArgsRest(__VLS_127));
    const { default: __VLS_131 } = __VLS_129.slots;
    {
        const { content: __VLS_132 } = __VLS_129.slots;
        __VLS_asFunctionalElement1(__VLS_intrinsics.br)({});
        __VLS_asFunctionalElement1(__VLS_intrinsics.br)({});
        // @ts-ignore
        [themeStore, themeStore,];
    }
    let __VLS_133;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_134 = __VLS_asFunctionalComponent1(__VLS_133, new __VLS_133({
        ...{ 'onClick': {} },
        type: "primary",
        plain: true,
    }));
    const __VLS_135 = __VLS_134({
        ...{ 'onClick': {} },
        type: "primary",
        plain: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_134));
    let __VLS_138;
    const __VLS_139 = {
        ...{ click: {} },
        onClick: (__VLS_ctx.themeStore.copyThemeConfig),
    };
    const { default: __VLS_140 } = __VLS_136.slots;
    // @ts-ignore
    [themeStore,];
    var __VLS_136;
    var __VLS_137;
    // @ts-ignore
    [];
    var __VLS_129;
    let __VLS_141;
    /** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
    elTooltip;
    // @ts-ignore
    const __VLS_142 = __VLS_asFunctionalComponent1(__VLS_141, new __VLS_141({
        content: "恢复为项目默认主题配置",
        placement: "top",
    }));
    const __VLS_143 = __VLS_142({
        content: "恢复为项目默认主题配置",
        placement: "top",
    }, ...__VLS_functionalComponentArgsRest(__VLS_142));
    const { default: __VLS_146 } = __VLS_144.slots;
    let __VLS_147;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_148 = __VLS_asFunctionalComponent1(__VLS_147, new __VLS_147({
        ...{ 'onClick': {} },
        type: "info",
        plain: true,
    }));
    const __VLS_149 = __VLS_148({
        ...{ 'onClick': {} },
        type: "info",
        plain: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_148));
    let __VLS_152;
    const __VLS_153 = {
        ...{ click: {} },
        onClick: (__VLS_ctx.themeStore.resetThemeConfig),
    };
    const { default: __VLS_154 } = __VLS_150.slots;
    // @ts-ignore
    [themeStore,];
    var __VLS_150;
    var __VLS_151;
    // @ts-ignore
    [];
    var __VLS_144;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_3;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
