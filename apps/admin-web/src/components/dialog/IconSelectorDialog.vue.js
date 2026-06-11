/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { POPCONFIRM_CONFIG } from '@/config/elementConfig';
defineOptions({ name: 'IconSelectorDialog', inheritAttrs: false });
const props = withDefaults(defineProps(), {
    title: '图标选择',
    width: '900px',
    density: 'compact',
});
const emits = defineEmits();
const open = ref(false);
const menuStore = useMenuStore();
// 当前选中的图标
const currentIcon = ref('');
// 搜索框的值
const searchValue = ref('');
// 当前选中的菜单
const activeMenu = ref('Element:');
// 菜单
const iconMenu = ref([
    { label: 'Element Plus', value: 'Element:', icon: 'Element:ElementPlus' },
    { label: 'HeroIcons Outline', value: 'HOutline:', icon: 'HOutline:ShieldCheckIcon' },
    { label: 'HeroIcons Solid', value: 'HSolid:', icon: 'HSolid:ShieldCheckIcon' },
]);
// 当前菜单的图标列表
const activeIconList = computed(() => {
    const allIcons = Object.keys(menuStore.iconComponents);
    return allIcons.filter((icon) => icon.startsWith(activeMenu.value));
});
// 过滤后的图标列表
const filteredIconList = computed(() => {
    if (!searchValue.value)
        return activeIconList.value;
    const search = searchValue.value.toLowerCase();
    return activeIconList.value.filter((name) => name.toLowerCase().includes(search));
});
const selectIcon = (icon) => {
    currentIcon.value = icon;
    emits('selectIcon', icon, menuStore.iconComponents[icon]);
    closeDialog();
};
/**
 * 打开图标选择器
 * @param currentIconValue 当前选中的图标
 */
const showDialog = (currentIconValue = '') => {
    currentIcon.value = currentIconValue;
    open.value = true;
};
/**
 * 关闭图标选择器
 */
const closeDialog = () => {
    open.value = false;
    searchValue.value = '';
};
/**
 * 清除数据
 */
const clearData = () => {
    currentIcon.value = '';
    searchValue.value = '';
    activeMenu.value = 'Element:';
};
const __VLS_exposed = {
    showDialog,
    closeDialog,
    clearData,
};
defineExpose(__VLS_exposed);
const __VLS_defaults = {
    title: '图标选择',
    width: '900px',
    density: 'compact',
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
/** @type {__VLS_StyleScopedClasses['active']} */ ;
/** @type {__VLS_StyleScopedClasses['icon-content']} */ ;
/** @type {__VLS_StyleScopedClasses['icon-list']} */ ;
/** @type {__VLS_StyleScopedClasses['icon-item']} */ ;
/** @type {__VLS_StyleScopedClasses['active']} */ ;
/** @type {__VLS_StyleScopedClasses['icon-name']} */ ;
/** @type {__VLS_StyleScopedClasses['icon-menu']} */ ;
/** @type {__VLS_StyleScopedClasses['item-menu-item']} */ ;
/** @type {__VLS_StyleScopedClasses['icon-content']} */ ;
let __VLS_0;
/** @ts-ignore @type { | typeof __VLS_components.BaseDialog | typeof __VLS_components.BaseDialog} */
BaseDialog;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    modelValue: (__VLS_ctx.open),
    title: (__VLS_ctx.title),
    width: (__VLS_ctx.width),
    showFooter: (false),
    ...{ style: {} },
}));
const __VLS_2 = __VLS_1({
    modelValue: (__VLS_ctx.open),
    title: (__VLS_ctx.title),
    width: (__VLS_ctx.width),
    showFooter: (false),
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_5;
const { default: __VLS_6 } = __VLS_3.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "icon-selector-dialog-container" },
    ...{ class: ({
            'is-mobile': __VLS_ctx.menuStore.isMobile,
            'is-spacious': props.density === 'spacious',
        }) },
    ref: "iconSelectorDialogContainerRef",
});
/** @type {__VLS_StyleScopedClasses['icon-selector-dialog-container']} */ ;
/** @type {__VLS_StyleScopedClasses['is-mobile']} */ ;
/** @type {__VLS_StyleScopedClasses['is-spacious']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "icon-menu" },
});
/** @type {__VLS_StyleScopedClasses['icon-menu']} */ ;
for (const [menu] of __VLS_vFor((__VLS_ctx.iconMenu))) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ onClick: (...[$event]) => {
                __VLS_ctx.activeMenu = menu.value;
                // @ts-ignore
                [open, title, width, menuStore, iconMenu, activeMenu,];
            } },
        ...{ class: "item-menu-item" },
        ...{ class: ({ active: __VLS_ctx.activeMenu === menu.value }) },
        key: (menu.value),
    });
    /** @type {__VLS_StyleScopedClasses['item-menu-item']} */ ;
    /** @type {__VLS_StyleScopedClasses['active']} */ ;
    let __VLS_7;
    /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
    elIcon;
    // @ts-ignore
    const __VLS_8 = __VLS_asFunctionalComponent1(__VLS_7, new __VLS_7({
        size: (20),
    }));
    const __VLS_9 = __VLS_8({
        size: (20),
    }, ...__VLS_functionalComponentArgsRest(__VLS_8));
    const { default: __VLS_12 } = __VLS_10.slots;
    const __VLS_13 = (__VLS_ctx.menuStore.iconComponents[menu.icon]);
    // @ts-ignore
    const __VLS_14 = __VLS_asFunctionalComponent1(__VLS_13, new __VLS_13({}));
    const __VLS_15 = __VLS_14({}, ...__VLS_functionalComponentArgsRest(__VLS_14));
    // @ts-ignore
    [menuStore, activeMenu,];
    var __VLS_10;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    (menu.label);
    // @ts-ignore
    [];
}
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "icon-content" },
});
/** @type {__VLS_StyleScopedClasses['icon-content']} */ ;
let __VLS_18;
/** @ts-ignore @type { | typeof __VLS_components.transition | typeof __VLS_components.Transition | typeof __VLS_components.transition | typeof __VLS_components.Transition} */
transition;
// @ts-ignore
const __VLS_19 = __VLS_asFunctionalComponent1(__VLS_18, new __VLS_18({
    name: "fade-slide",
    mode: "out-in",
}));
const __VLS_20 = __VLS_19({
    name: "fade-slide",
    mode: "out-in",
}, ...__VLS_functionalComponentArgsRest(__VLS_19));
const { default: __VLS_23 } = __VLS_21.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    key: (__VLS_ctx.activeMenu),
    ...{ style: {} },
});
let __VLS_24;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input'] | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_25 = __VLS_asFunctionalComponent1(__VLS_24, new __VLS_24({
    modelValue: (__VLS_ctx.searchValue),
    placeholder: "搜索图标名称",
    clearable: true,
}));
const __VLS_26 = __VLS_25({
    modelValue: (__VLS_ctx.searchValue),
    placeholder: "搜索图标名称",
    clearable: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_25));
const { default: __VLS_29 } = __VLS_27.slots;
{
    const { prefix: __VLS_30 } = __VLS_27.slots;
    let __VLS_31;
    /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
    elIcon;
    // @ts-ignore
    const __VLS_32 = __VLS_asFunctionalComponent1(__VLS_31, new __VLS_31({}));
    const __VLS_33 = __VLS_32({}, ...__VLS_functionalComponentArgsRest(__VLS_32));
    const { default: __VLS_36 } = __VLS_34.slots;
    const __VLS_37 = (__VLS_ctx.menuStore.iconComponents['Element:Search']);
    // @ts-ignore
    const __VLS_38 = __VLS_asFunctionalComponent1(__VLS_37, new __VLS_37({}));
    const __VLS_39 = __VLS_38({}, ...__VLS_functionalComponentArgsRest(__VLS_38));
    // @ts-ignore
    [menuStore, activeMenu, searchValue,];
    var __VLS_34;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_27;
let __VLS_42;
/** @ts-ignore @type { | typeof __VLS_components.elScrollbar | typeof __VLS_components.ElScrollbar | typeof __VLS_components['el-scrollbar'] | typeof __VLS_components.elScrollbar | typeof __VLS_components.ElScrollbar | typeof __VLS_components['el-scrollbar']} */
elScrollbar;
// @ts-ignore
const __VLS_43 = __VLS_asFunctionalComponent1(__VLS_42, new __VLS_42({
    ...{ class: (__VLS_ctx.menuStore.isMobile ? 'icon-list-scrollbar-mobile' : 'icon-list-scrollbar') },
}));
const __VLS_44 = __VLS_43({
    ...{ class: (__VLS_ctx.menuStore.isMobile ? 'icon-list-scrollbar-mobile' : 'icon-list-scrollbar') },
}, ...__VLS_functionalComponentArgsRest(__VLS_43));
const { default: __VLS_47 } = __VLS_45.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "icon-list" },
});
/** @type {__VLS_StyleScopedClasses['icon-list']} */ ;
for (const [icon] of __VLS_vFor((__VLS_ctx.filteredIconList))) {
    __VLS_asFunctionalElement(__VLS_intrinsics.template)({
        key: (icon),
    });
    if (props.density === 'compact') {
        let __VLS_48;
        /** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
        elTooltip;
        // @ts-ignore
        const __VLS_49 = __VLS_asFunctionalComponent1(__VLS_48, new __VLS_48({
            content: (icon),
            placement: (__VLS_ctx.POPCONFIRM_CONFIG.placement),
            width: (__VLS_ctx.POPCONFIRM_CONFIG.width),
            showAfter: (__VLS_ctx.POPCONFIRM_CONFIG.showAfter),
        }));
        const __VLS_50 = __VLS_49({
            content: (icon),
            placement: (__VLS_ctx.POPCONFIRM_CONFIG.placement),
            width: (__VLS_ctx.POPCONFIRM_CONFIG.width),
            showAfter: (__VLS_ctx.POPCONFIRM_CONFIG.showAfter),
        }, ...__VLS_functionalComponentArgsRest(__VLS_49));
        const { default: __VLS_53 } = __VLS_51.slots;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ onClick: (...[$event]) => {
                    if (!(props.density === 'compact'))
                        return;
                    __VLS_ctx.selectIcon(icon);
                    // @ts-ignore
                    [menuStore, filteredIconList, POPCONFIRM_CONFIG, POPCONFIRM_CONFIG, POPCONFIRM_CONFIG, selectIcon,];
                } },
            ...{ class: "icon-item" },
            ...{ class: ({ active: __VLS_ctx.currentIcon === icon }) },
        });
        /** @type {__VLS_StyleScopedClasses['icon-item']} */ ;
        /** @type {__VLS_StyleScopedClasses['active']} */ ;
        let __VLS_54;
        /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
        elIcon;
        // @ts-ignore
        const __VLS_55 = __VLS_asFunctionalComponent1(__VLS_54, new __VLS_54({
            size: (22),
        }));
        const __VLS_56 = __VLS_55({
            size: (22),
        }, ...__VLS_functionalComponentArgsRest(__VLS_55));
        const { default: __VLS_59 } = __VLS_57.slots;
        const __VLS_60 = (__VLS_ctx.menuStore.iconComponents[icon]);
        // @ts-ignore
        const __VLS_61 = __VLS_asFunctionalComponent1(__VLS_60, new __VLS_60({}));
        const __VLS_62 = __VLS_61({}, ...__VLS_functionalComponentArgsRest(__VLS_61));
        // @ts-ignore
        [menuStore, currentIcon,];
        var __VLS_57;
        // @ts-ignore
        [];
        var __VLS_51;
    }
    else {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ onClick: (...[$event]) => {
                    if (!!(props.density === 'compact'))
                        return;
                    __VLS_ctx.selectIcon(icon);
                    // @ts-ignore
                    [selectIcon,];
                } },
            ...{ class: "icon-item" },
            ...{ class: ({ active: __VLS_ctx.currentIcon === icon }) },
        });
        /** @type {__VLS_StyleScopedClasses['icon-item']} */ ;
        /** @type {__VLS_StyleScopedClasses['active']} */ ;
        let __VLS_65;
        /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
        elIcon;
        // @ts-ignore
        const __VLS_66 = __VLS_asFunctionalComponent1(__VLS_65, new __VLS_65({
            size: (24),
        }));
        const __VLS_67 = __VLS_66({
            size: (24),
        }, ...__VLS_functionalComponentArgsRest(__VLS_66));
        const { default: __VLS_70 } = __VLS_68.slots;
        const __VLS_71 = (__VLS_ctx.menuStore.iconComponents[icon]);
        // @ts-ignore
        const __VLS_72 = __VLS_asFunctionalComponent1(__VLS_71, new __VLS_71({}));
        const __VLS_73 = __VLS_72({}, ...__VLS_functionalComponentArgsRest(__VLS_72));
        // @ts-ignore
        [menuStore, currentIcon,];
        var __VLS_68;
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "icon-name" },
            title: (icon),
        });
        /** @type {__VLS_StyleScopedClasses['icon-name']} */ ;
        (icon);
    }
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_45;
// @ts-ignore
[];
var __VLS_21;
// @ts-ignore
[];
var __VLS_3;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    setup: () => __VLS_exposed,
    __typeEmits: {},
    __defaults: __VLS_defaults,
    __typeProps: {},
});
export default {};
