/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { useClipboard } from '@vueuse/core';
const props = withDefaults(defineProps(), {
    text: '',
    line: 1,
    clickable: true,
    tooltipType: 'element',
    width: '100%',
    copyable: false,
});
const attrs = useAttrs();
const menuStore = useMenuStore();
// 使用 VueUse 的复制功能
const { copy } = useClipboard();
// 省略状态
const isEllipsis = ref(false);
// 展开状态
const expanded = ref(false);
// 文本Ref
const textRef = useTemplateRef('textRef');
// 目标元素
const targetElement = ref('');
// 文本字符串
const textStr = computed(() => {
    return String(props.text);
});
// 宽度计算
const computedWidth = computed(() => {
    // 如果是数字，直接转换为 px
    if (typeof props.width === 'number') {
        return `${props.width}px`;
    }
    // 如果是字符串，检查是否为纯数字（不带单位）
    const widthStr = String(props.width).trim();
    // 使用正则判断是否为纯数字（可能包含小数点）
    if (/^\d+(\.\d+)?$/.test(widthStr)) {
        return `${widthStr}px`;
    }
    // 如果已经包含单位，直接返回
    return widthStr;
});
// 是否显示 tooltip
const showTooltip = computed(() => {
    return props.tooltipType !== 'none' && isEllipsis.value && !expanded.value;
});
// 省略样式
const ellipsisStyle = computed(() => {
    if (expanded.value) {
        return {};
    }
    return {
        '-webkit-line-clamp': String(props.line),
        'line-clamp': String(props.line),
    };
});
// 坚持当前文本是否可以省略
const checkEllipsis = async () => {
    await nextTick();
    if (textRef.value) {
        isEllipsis.value = textRef.value.scrollHeight > textRef.value.clientHeight;
    }
};
watch(() => [props.text, props.line], () => {
    checkEllipsis();
}, { immediate: true });
// 点击事件
const handleClick = () => {
    if (props.clickable && isEllipsis.value)
        expanded.value = !expanded.value;
};
// 复制事件
const handleCopy = async () => {
    try {
        await copy(textStr.value);
        ElMessage.success('复制成功');
    }
    catch {
        ElMessage.error('复制失败');
    }
};
onMounted(() => {
    targetElement.value = '.text-ellipsis-container';
});
const __VLS_defaults = {
    text: '',
    line: 1,
    clickable: true,
    tooltipType: 'element',
    width: '100%',
    copyable: false,
};
const __VLS_ctx = {
    ...{},
    ...{},
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['copy-button']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "text-ellipsis-container" },
    ...{ style: ({ width: __VLS_ctx.computedWidth }) },
});
/** @type {__VLS_StyleScopedClasses['text-ellipsis-container']} */ ;
if (__VLS_ctx.tooltipType === 'element') {
    let __VLS_0;
    /** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
    elTooltip;
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
        content: (__VLS_ctx.textStr),
        disabled: (!__VLS_ctx.showTooltip),
        appendTo: (__VLS_ctx.targetElement),
        ...(__VLS_ctx.attrs),
    }));
    const __VLS_2 = __VLS_1({
        content: (__VLS_ctx.textStr),
        disabled: (!__VLS_ctx.showTooltip),
        appendTo: (__VLS_ctx.targetElement),
        ...(__VLS_ctx.attrs),
    }, ...__VLS_functionalComponentArgsRest(__VLS_1));
    const { default: __VLS_5 } = __VLS_3.slots;
    {
        const { content: __VLS_6 } = __VLS_3.slots;
        var __VLS_7 = {};
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
        (__VLS_ctx.textStr);
        // @ts-ignore
        [computedWidth, tooltipType, textStr, textStr, showTooltip, targetElement, attrs,];
    }
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ onClick: (__VLS_ctx.handleClick) },
        ref: "textRef",
        ...{ class: "text-ellipsis-content" },
        ...{ class: ({ 'is-expanded': __VLS_ctx.expanded, 'is-clickable': __VLS_ctx.clickable && __VLS_ctx.isEllipsis }) },
        ...{ style: (__VLS_ctx.ellipsisStyle) },
    });
    /** @type {__VLS_StyleScopedClasses['text-ellipsis-content']} */ ;
    /** @type {__VLS_StyleScopedClasses['is-expanded']} */ ;
    /** @type {__VLS_StyleScopedClasses['is-clickable']} */ ;
    (__VLS_ctx.textStr);
    // @ts-ignore
    [textStr, handleClick, expanded, clickable, isEllipsis, ellipsisStyle,];
    var __VLS_3;
}
else {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ onClick: (__VLS_ctx.handleClick) },
        ref: "textRef",
        ...{ class: "text-ellipsis-content" },
        ...{ class: ({ 'is-expanded': __VLS_ctx.expanded, 'is-clickable': __VLS_ctx.clickable && __VLS_ctx.isEllipsis }) },
        ...{ style: (__VLS_ctx.ellipsisStyle) },
        title: (__VLS_ctx.tooltipType === 'native' && __VLS_ctx.showTooltip ? __VLS_ctx.textStr : undefined),
    });
    /** @type {__VLS_StyleScopedClasses['text-ellipsis-content']} */ ;
    /** @type {__VLS_StyleScopedClasses['is-expanded']} */ ;
    /** @type {__VLS_StyleScopedClasses['is-clickable']} */ ;
    (__VLS_ctx.textStr);
}
if (__VLS_ctx.copyable) {
    let __VLS_9;
    /** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
    elTooltip;
    // @ts-ignore
    const __VLS_10 = __VLS_asFunctionalComponent1(__VLS_9, new __VLS_9({
        content: "复制",
        placement: "top",
    }));
    const __VLS_11 = __VLS_10({
        content: "复制",
        placement: "top",
    }, ...__VLS_functionalComponentArgsRest(__VLS_10));
    const { default: __VLS_14 } = __VLS_12.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ onClick: (__VLS_ctx.handleCopy) },
        ...{ class: "copy-button" },
    });
    /** @type {__VLS_StyleScopedClasses['copy-button']} */ ;
    let __VLS_15;
    /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
    elIcon;
    // @ts-ignore
    const __VLS_16 = __VLS_asFunctionalComponent1(__VLS_15, new __VLS_15({}));
    const __VLS_17 = __VLS_16({}, ...__VLS_functionalComponentArgsRest(__VLS_16));
    const { default: __VLS_20 } = __VLS_18.slots;
    const __VLS_21 = (__VLS_ctx.menuStore.iconComponents['HOutline:ClipboardDocumentIcon']);
    // @ts-ignore
    const __VLS_22 = __VLS_asFunctionalComponent1(__VLS_21, new __VLS_21({}));
    const __VLS_23 = __VLS_22({}, ...__VLS_functionalComponentArgsRest(__VLS_22));
    // @ts-ignore
    [tooltipType, textStr, textStr, showTooltip, handleClick, expanded, clickable, isEllipsis, ellipsisStyle, copyable, handleCopy, menuStore,];
    var __VLS_18;
    // @ts-ignore
    [];
    var __VLS_12;
}
// @ts-ignore
var __VLS_8 = __VLS_7;
// @ts-ignore
[];
const __VLS_base = (await import('vue')).defineComponent({
    __defaults: __VLS_defaults,
    __typeProps: {},
});
const __VLS_export = {};
export default {};
