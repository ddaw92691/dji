/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { useVModel } from '@vueuse/core';
import { VueDraggable } from 'vue-draggable-plus';
const props = defineProps();
const emits = defineEmits();
const menuStore = useMenuStore();
/**
 * 使用 useVModel 代理 props.modelValue
 * 当columnList 被重新赋值（排序）时，会自动触发 emits('update:modelValue', newValue)
 */
const columnList = useVModel(props, 'modelValue', emits);
// 全选状态计算
const isAllSelected = computed(() => props.modelValue.every((item) => item.visible));
const isIndeterminate = computed(() => {
    const checkedCount = props.modelValue.filter((item) => item.visible).length;
    return checkedCount > 0 && checkedCount < props.modelValue.length;
});
// 全选切换
const handleCheckAll = (val) => {
    const value = val;
    const newCols = props.modelValue.map((item) => ({ ...item, visible: value }));
    columnList.value = newCols;
};
// 切换固定列
const toggleFixed = (item, direction) => {
    const fixed = item.fixed;
    if (direction === 'left') {
        // 当前已经是 left（或 true）→ 取消
        if (fixed === 'left' || fixed === true) {
            item.fixed = false;
        }
        else {
            // 其他情况（未固定 / right）→ 固定到 left
            item.fixed = 'left';
        }
        return;
    }
    if (direction === 'right') {
        // 当前已经是 right → 取消
        if (fixed === 'right') {
            item.fixed = false;
        }
        else {
            // 其他情况（未固定 / left / true）→ 固定到 right
            item.fixed = 'right';
        }
    }
};
// 重置列
const resetColumns = () => {
    const columns = props.originalColumns.map((item) => {
        return {
            ...item,
            visible: true,
        };
    });
    columnList.value = columns;
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
let __VLS_0;
/** @ts-ignore @type { | typeof __VLS_components.elDropdown | typeof __VLS_components.ElDropdown | typeof __VLS_components['el-dropdown'] | typeof __VLS_components.elDropdown | typeof __VLS_components.ElDropdown | typeof __VLS_components['el-dropdown']} */
elDropdown;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    trigger: "click",
    showArrow: (false),
    placement: "bottom-end",
    popperClass: "table-column-dropdown-popper",
}));
const __VLS_2 = __VLS_1({
    trigger: "click",
    showArrow: (false),
    placement: "bottom-end",
    popperClass: "table-column-dropdown-popper",
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_5;
const { default: __VLS_6 } = __VLS_3.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
let __VLS_7;
/** @ts-ignore @type { | typeof __VLS_components.IconButton} */
IconButton;
// @ts-ignore
const __VLS_8 = __VLS_asFunctionalComponent1(__VLS_7, new __VLS_7({
    icon: "HOutline:AdjustmentsVerticalIcon",
    tooltip: "列设置",
    size: "1.75rem",
    iconSize: "20px",
}));
const __VLS_9 = __VLS_8({
    icon: "HOutline:AdjustmentsVerticalIcon",
    tooltip: "列设置",
    size: "1.75rem",
    iconSize: "20px",
}, ...__VLS_functionalComponentArgsRest(__VLS_8));
{
    const { dropdown: __VLS_12 } = __VLS_3.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "menu-wrap" },
    });
    /** @type {__VLS_StyleScopedClasses['menu-wrap']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "menu-item-top" },
    });
    /** @type {__VLS_StyleScopedClasses['menu-item-top']} */ ;
    let __VLS_13;
    /** @ts-ignore @type { | typeof __VLS_components.elCheckbox | typeof __VLS_components.ElCheckbox | typeof __VLS_components['el-checkbox'] | typeof __VLS_components.elCheckbox | typeof __VLS_components.ElCheckbox | typeof __VLS_components['el-checkbox']} */
    elCheckbox;
    // @ts-ignore
    const __VLS_14 = __VLS_asFunctionalComponent1(__VLS_13, new __VLS_13({
        ...{ 'onChange': {} },
        modelValue: (__VLS_ctx.isAllSelected),
        indeterminate: (__VLS_ctx.isIndeterminate),
    }));
    const __VLS_15 = __VLS_14({
        ...{ 'onChange': {} },
        modelValue: (__VLS_ctx.isAllSelected),
        indeterminate: (__VLS_ctx.isIndeterminate),
    }, ...__VLS_functionalComponentArgsRest(__VLS_14));
    let __VLS_18;
    const __VLS_19 = {
        ...{ change: {} },
        onChange: (__VLS_ctx.handleCheckAll),
    };
    const { default: __VLS_20 } = __VLS_16.slots;
    // @ts-ignore
    [isAllSelected, isIndeterminate, handleCheckAll,];
    var __VLS_16;
    var __VLS_17;
    let __VLS_21;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_22 = __VLS_asFunctionalComponent1(__VLS_21, new __VLS_21({
        ...{ 'onClick': {} },
        type: "primary",
        link: true,
    }));
    const __VLS_23 = __VLS_22({
        ...{ 'onClick': {} },
        type: "primary",
        link: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_22));
    let __VLS_26;
    const __VLS_27 = {
        ...{ click: {} },
        onClick: (__VLS_ctx.resetColumns),
    };
    const { default: __VLS_28 } = __VLS_24.slots;
    // @ts-ignore
    [resetColumns,];
    var __VLS_24;
    var __VLS_25;
    let __VLS_29;
    /** @ts-ignore @type { | typeof __VLS_components.VueDraggable | typeof __VLS_components.VueDraggable} */
    VueDraggable;
    // @ts-ignore
    const __VLS_30 = __VLS_asFunctionalComponent1(__VLS_29, new __VLS_29({
        modelValue: (__VLS_ctx.columnList),
        animation: (150),
        handle: ".handle",
    }));
    const __VLS_31 = __VLS_30({
        modelValue: (__VLS_ctx.columnList),
        animation: (150),
        handle: ".handle",
    }, ...__VLS_functionalComponentArgsRest(__VLS_30));
    const { default: __VLS_34 } = __VLS_32.slots;
    for (const [item] of __VLS_vFor((__VLS_ctx.columnList))) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "menu-item" },
            key: (item.prop ? item.prop : item.type),
        });
        /** @type {__VLS_StyleScopedClasses['menu-item']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "menu-item-left" },
        });
        /** @type {__VLS_StyleScopedClasses['menu-item-left']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "handle drag-wrap" },
        });
        /** @type {__VLS_StyleScopedClasses['handle']} */ ;
        /** @type {__VLS_StyleScopedClasses['drag-wrap']} */ ;
        let __VLS_35;
        /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
        elIcon;
        // @ts-ignore
        const __VLS_36 = __VLS_asFunctionalComponent1(__VLS_35, new __VLS_35({}));
        const __VLS_37 = __VLS_36({}, ...__VLS_functionalComponentArgsRest(__VLS_36));
        const { default: __VLS_40 } = __VLS_38.slots;
        const __VLS_41 = (__VLS_ctx.menuStore.iconComponents['HSolid:Bars3Icon']);
        // @ts-ignore
        const __VLS_42 = __VLS_asFunctionalComponent1(__VLS_41, new __VLS_41({}));
        const __VLS_43 = __VLS_42({}, ...__VLS_functionalComponentArgsRest(__VLS_42));
        // @ts-ignore
        [columnList, columnList, menuStore,];
        var __VLS_38;
        let __VLS_46;
        /** @ts-ignore @type { | typeof __VLS_components.elCheckbox | typeof __VLS_components.ElCheckbox | typeof __VLS_components['el-checkbox'] | typeof __VLS_components.elCheckbox | typeof __VLS_components.ElCheckbox | typeof __VLS_components['el-checkbox']} */
        elCheckbox;
        // @ts-ignore
        const __VLS_47 = __VLS_asFunctionalComponent1(__VLS_46, new __VLS_46({
            modelValue: (item.visible),
        }));
        const __VLS_48 = __VLS_47({
            modelValue: (item.visible),
        }, ...__VLS_functionalComponentArgsRest(__VLS_47));
        const { default: __VLS_51 } = __VLS_49.slots;
        (item.label ? item.label : item.type);
        // @ts-ignore
        [];
        var __VLS_49;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "menu-item-right" },
        });
        /** @type {__VLS_StyleScopedClasses['menu-item-right']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ onClick: (...[$event]) => {
                    __VLS_ctx.toggleFixed(item, 'left');
                    // @ts-ignore
                    [toggleFixed,];
                } },
            ...{ class: "fixed-wrap" },
            ...{ class: ({ 'is-active': item.fixed === 'left' || item.fixed === true }) },
        });
        /** @type {__VLS_StyleScopedClasses['fixed-wrap']} */ ;
        /** @type {__VLS_StyleScopedClasses['is-active']} */ ;
        let __VLS_52;
        /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
        elIcon;
        // @ts-ignore
        const __VLS_53 = __VLS_asFunctionalComponent1(__VLS_52, new __VLS_52({}));
        const __VLS_54 = __VLS_53({}, ...__VLS_functionalComponentArgsRest(__VLS_53));
        const { default: __VLS_57 } = __VLS_55.slots;
        const __VLS_58 = (__VLS_ctx.menuStore.iconComponents['HSolid:ChevronDoubleLeftIcon']);
        // @ts-ignore
        const __VLS_59 = __VLS_asFunctionalComponent1(__VLS_58, new __VLS_58({}));
        const __VLS_60 = __VLS_59({}, ...__VLS_functionalComponentArgsRest(__VLS_59));
        // @ts-ignore
        [menuStore,];
        var __VLS_55;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ onClick: (...[$event]) => {
                    __VLS_ctx.toggleFixed(item, 'right');
                    // @ts-ignore
                    [toggleFixed,];
                } },
            ...{ class: "fixed-wrap" },
            ...{ class: ({ 'is-active': item.fixed === 'right' }) },
        });
        /** @type {__VLS_StyleScopedClasses['fixed-wrap']} */ ;
        /** @type {__VLS_StyleScopedClasses['is-active']} */ ;
        let __VLS_63;
        /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
        elIcon;
        // @ts-ignore
        const __VLS_64 = __VLS_asFunctionalComponent1(__VLS_63, new __VLS_63({}));
        const __VLS_65 = __VLS_64({}, ...__VLS_functionalComponentArgsRest(__VLS_64));
        const { default: __VLS_68 } = __VLS_66.slots;
        const __VLS_69 = (__VLS_ctx.menuStore.iconComponents['HSolid:ChevronDoubleRightIcon']);
        // @ts-ignore
        const __VLS_70 = __VLS_asFunctionalComponent1(__VLS_69, new __VLS_69({}));
        const __VLS_71 = __VLS_70({}, ...__VLS_functionalComponentArgsRest(__VLS_70));
        // @ts-ignore
        [menuStore,];
        var __VLS_66;
        // @ts-ignore
        [];
    }
    // @ts-ignore
    [];
    var __VLS_32;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_3;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    __typeEmits: {},
    __typeProps: {},
});
export default {};
