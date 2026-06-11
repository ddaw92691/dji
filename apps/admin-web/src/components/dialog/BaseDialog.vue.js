/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { useAttrs } from 'vue';
import { useWindowSize } from '@vueuse/core';
import IconButton from '@/components/button/IconButton.vue';
// 禁用自动属性继承，手动控制属性透传
defineOptions({
    inheritAttrs: false,
});
const props = withDefaults(defineProps(), {
    fullscreen: false,
    showFullscreenButton: true,
    showClose: true,
    showFooter: true,
    cancelText: '取消',
    confirmText: '确定',
    resizable: true,
    closeIcon: 'HOutline:XMarkIcon',
    closeIconSize: '1.5rem',
    fullscreenIcon: 'HOutline:ArrowsPointingOutIcon',
    fullscreenIconSize: '1.25rem',
    exitFullscreenIcon: 'HOutline:ArrowsPointingInIcon',
    exitFullscreenIconSize: '1.25rem',
    showConfirmLoading: true,
    mobileAdaptive: true,
    mobileWidth: '90%',
    mobileBreakpoint: 992,
    draggable: true,
    showCancelButton: true,
    showConfirmButton: true,
});
const emits = defineEmits();
// 组件属性（未被props和emits定义的属性）
const attrs = useAttrs();
// 确定按钮加载状态
const confirmLoading = ref(false);
// 内部维护全屏状态
const fullscreenValue = ref(false);
watchEffect(() => {
    fullscreenValue.value = props.fullscreen ?? false;
});
// 响应式监听窗口宽度
const { width: windowWidth } = useWindowSize();
// 是否为移动端
const isMobile = computed(() => windowWidth.value < props.mobileBreakpoint);
// 计算宽度
const computedWidth = computed(() => {
    if (props.mobileAdaptive && isMobile.value) {
        return props.mobileWidth;
    }
    return props.width;
});
// 获取 before-close 函数（从 attrs 中获取，支持 kebab-case 和 camelCase）
// 注意：before-close 会通过 attrs 传递给 el-dialog，让 el-dialog 处理 ESC 和点击遮罩层的情况
const beforeClose = computed(() => {
    return (attrs.beforeClose || attrs['before-close']);
});
// 处理关闭逻辑，支持 before-close
// 用于自定义关闭按钮（header 中的 X 按钮和 footer 中的取消按钮）
const close = () => {
    const doClose = () => {
        emits('update:modelValue', false);
        emits('close');
    };
    // 如果存在 before-close 函数，则调用它
    if (beforeClose.value) {
        beforeClose.value(doClose);
    }
    else {
        // 否则直接关闭
        doClose();
    }
};
// 处理对话框更新事件(用于监听esc和点击遮罩层关闭)
// 注意：当 el-dialog 通过 ESC 或点击遮罩层关闭时，如果存在 before-close，
// el-dialog 会先调用 before-close，只有 before-close 调用 done() 后才会触发此事件
const handleDialogUpdate = (value) => {
    // 如果值没有变化，不处理（防止重复触发）
    if (props.modelValue === value)
        return;
    // 更新值到外部
    emits('update:modelValue', value);
    // 当对话框关闭时，也触发外部 close 事件
    if (!value)
        emits('close');
};
/**
 * 确定按钮点击事件(自带加载状态)
 * 利用attrs拿到onConfirm事件，并执行
 * 不能用emit，因为emit是组件内部事件，并且不是同步执行的
 */
const confirm = async () => {
    // 只有当 showConfirmLoading 不为 false 时才显示 loading
    if (props.showConfirmLoading)
        confirmLoading.value = true;
    try {
        const onConfirm = attrs.onConfirm;
        if (onConfirm)
            await onConfirm();
    }
    finally {
        if (props.showConfirmLoading)
            confirmLoading.value = false;
    }
};
const __VLS_defaults = {
    fullscreen: false,
    showFullscreenButton: true,
    showClose: true,
    showFooter: true,
    cancelText: '取消',
    confirmText: '确定',
    resizable: true,
    closeIcon: 'HOutline:XMarkIcon',
    closeIconSize: '1.5rem',
    fullscreenIcon: 'HOutline:ArrowsPointingOutIcon',
    fullscreenIconSize: '1.25rem',
    exitFullscreenIcon: 'HOutline:ArrowsPointingInIcon',
    exitFullscreenIconSize: '1.25rem',
    showConfirmLoading: true,
    mobileAdaptive: true,
    mobileWidth: '90%',
    mobileBreakpoint: 992,
    draggable: true,
    showCancelButton: true,
    showConfirmButton: true,
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
/** @ts-ignore @type { | typeof __VLS_components.elDialog | typeof __VLS_components.ElDialog | typeof __VLS_components['el-dialog'] | typeof __VLS_components.elDialog | typeof __VLS_components.ElDialog | typeof __VLS_components['el-dialog']} */
elDialog;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    ...{ 'onUpdate:modelValue': {} },
    modelValue: (__VLS_ctx.modelValue),
    width: (__VLS_ctx.computedWidth),
    showClose: (false),
    fullscreen: (__VLS_ctx.fullscreenValue),
    draggable: (__VLS_ctx.draggable),
    ...{ class: "base-dialog" },
    ...{ class: ({ 'is-resizable': __VLS_ctx.resizable }) },
    ...(__VLS_ctx.attrs),
}));
const __VLS_2 = __VLS_1({
    ...{ 'onUpdate:modelValue': {} },
    modelValue: (__VLS_ctx.modelValue),
    width: (__VLS_ctx.computedWidth),
    showClose: (false),
    fullscreen: (__VLS_ctx.fullscreenValue),
    draggable: (__VLS_ctx.draggable),
    ...{ class: "base-dialog" },
    ...{ class: ({ 'is-resizable': __VLS_ctx.resizable }) },
    ...(__VLS_ctx.attrs),
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
let __VLS_5;
const __VLS_6 = {
    ...{ 'update:modelValue': {} },
    'onUpdate:modelValue': (__VLS_ctx.handleDialogUpdate),
};
var __VLS_7;
/** @type {__VLS_StyleScopedClasses['base-dialog']} */ ;
/** @type {__VLS_StyleScopedClasses['is-resizable']} */ ;
const { default: __VLS_8 } = __VLS_3.slots;
{
    const { header: __VLS_9 } = __VLS_3.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "base-dialog-header" },
    });
    /** @type {__VLS_StyleScopedClasses['base-dialog-header']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "base-dialog-header-title" },
    });
    /** @type {__VLS_StyleScopedClasses['base-dialog-header-title']} */ ;
    var __VLS_10 = {};
    (__VLS_ctx.title);
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "base-dialog-header-buttons" },
    });
    /** @type {__VLS_StyleScopedClasses['base-dialog-header-buttons']} */ ;
    if (__VLS_ctx.showFullscreenButton) {
        if (!__VLS_ctx.fullscreenValue) {
            const __VLS_12 = IconButton;
            // @ts-ignore
            const __VLS_13 = __VLS_asFunctionalComponent1(__VLS_12, new __VLS_12({
                ...{ 'onClick': {} },
                icon: (__VLS_ctx.fullscreenIcon),
                iconSize: (__VLS_ctx.fullscreenIconSize),
            }));
            const __VLS_14 = __VLS_13({
                ...{ 'onClick': {} },
                icon: (__VLS_ctx.fullscreenIcon),
                iconSize: (__VLS_ctx.fullscreenIconSize),
            }, ...__VLS_functionalComponentArgsRest(__VLS_13));
            let __VLS_17;
            const __VLS_18 = {
                ...{ click: {} },
                onClick: (...[$event]) => {
                    if (!(__VLS_ctx.showFullscreenButton))
                        return;
                    if (!(!__VLS_ctx.fullscreenValue))
                        return;
                    __VLS_ctx.fullscreenValue = true;
                    // @ts-ignore
                    [modelValue, computedWidth, fullscreenValue, fullscreenValue, fullscreenValue, draggable, resizable, attrs, handleDialogUpdate, title, showFullscreenButton, fullscreenIcon, fullscreenIconSize,];
                },
            };
            var __VLS_15;
            var __VLS_16;
        }
        else {
            const __VLS_19 = IconButton;
            // @ts-ignore
            const __VLS_20 = __VLS_asFunctionalComponent1(__VLS_19, new __VLS_19({
                ...{ 'onClick': {} },
                icon: (__VLS_ctx.exitFullscreenIcon),
                iconSize: (__VLS_ctx.exitFullscreenIconSize),
            }));
            const __VLS_21 = __VLS_20({
                ...{ 'onClick': {} },
                icon: (__VLS_ctx.exitFullscreenIcon),
                iconSize: (__VLS_ctx.exitFullscreenIconSize),
            }, ...__VLS_functionalComponentArgsRest(__VLS_20));
            let __VLS_24;
            const __VLS_25 = {
                ...{ click: {} },
                onClick: (...[$event]) => {
                    if (!(__VLS_ctx.showFullscreenButton))
                        return;
                    if (!!(!__VLS_ctx.fullscreenValue))
                        return;
                    __VLS_ctx.fullscreenValue = false;
                    // @ts-ignore
                    [fullscreenValue, exitFullscreenIcon, exitFullscreenIconSize,];
                },
            };
            var __VLS_22;
            var __VLS_23;
        }
    }
    if (__VLS_ctx.showClose) {
        const __VLS_26 = IconButton;
        // @ts-ignore
        const __VLS_27 = __VLS_asFunctionalComponent1(__VLS_26, new __VLS_26({
            ...{ 'onClick': {} },
            icon: (__VLS_ctx.closeIcon),
            iconSize: (__VLS_ctx.closeIconSize),
        }));
        const __VLS_28 = __VLS_27({
            ...{ 'onClick': {} },
            icon: (__VLS_ctx.closeIcon),
            iconSize: (__VLS_ctx.closeIconSize),
        }, ...__VLS_functionalComponentArgsRest(__VLS_27));
        let __VLS_31;
        const __VLS_32 = {
            ...{ click: {} },
            onClick: (__VLS_ctx.close),
        };
        var __VLS_29;
        var __VLS_30;
    }
    // @ts-ignore
    [showClose, closeIcon, closeIconSize, close,];
}
var __VLS_33 = {};
{
    const { footer: __VLS_35 } = __VLS_3.slots;
    var __VLS_36 = {};
    if (__VLS_ctx.showFooter) {
        if (__VLS_ctx.showCancelButton) {
            let __VLS_38;
            /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
            elButton;
            // @ts-ignore
            const __VLS_39 = __VLS_asFunctionalComponent1(__VLS_38, new __VLS_38({
                ...{ 'onClick': {} },
            }));
            const __VLS_40 = __VLS_39({
                ...{ 'onClick': {} },
            }, ...__VLS_functionalComponentArgsRest(__VLS_39));
            let __VLS_43;
            const __VLS_44 = {
                ...{ click: {} },
                onClick: (__VLS_ctx.close),
            };
            const { default: __VLS_45 } = __VLS_41.slots;
            (__VLS_ctx.cancelText);
            // @ts-ignore
            [close, showFooter, showCancelButton, cancelText,];
            var __VLS_41;
            var __VLS_42;
        }
        if (__VLS_ctx.showConfirmButton) {
            let __VLS_46;
            /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
            elButton;
            // @ts-ignore
            const __VLS_47 = __VLS_asFunctionalComponent1(__VLS_46, new __VLS_46({
                ...{ 'onClick': {} },
                type: "primary",
                loading: (__VLS_ctx.showConfirmLoading ? __VLS_ctx.confirmLoading : false),
            }));
            const __VLS_48 = __VLS_47({
                ...{ 'onClick': {} },
                type: "primary",
                loading: (__VLS_ctx.showConfirmLoading ? __VLS_ctx.confirmLoading : false),
            }, ...__VLS_functionalComponentArgsRest(__VLS_47));
            let __VLS_51;
            const __VLS_52 = {
                ...{ click: {} },
                onClick: (__VLS_ctx.confirm),
            };
            const { default: __VLS_53 } = __VLS_49.slots;
            (__VLS_ctx.confirmText);
            // @ts-ignore
            [showConfirmButton, showConfirmLoading, confirmLoading, confirm, confirmText,];
            var __VLS_49;
            var __VLS_50;
        }
    }
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_3;
var __VLS_4;
// @ts-ignore
var __VLS_11 = __VLS_10, __VLS_34 = __VLS_33, __VLS_37 = __VLS_36;
// @ts-ignore
[];
const __VLS_base = (await import('vue')).defineComponent({
    __typeEmits: {},
    __defaults: __VLS_defaults,
    __typeProps: {},
});
const __VLS_export = {};
export default {};
