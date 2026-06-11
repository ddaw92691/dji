/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
// 禁用自动属性继承，手动控制属性透传
defineOptions({
    inheritAttrs: false,
});
const props = withDefaults(defineProps(), {
    loadingDelay: 0,
});
// 读取到所有属性
const attrs = useAttrs();
/**
 * 获取按钮属性，去除onClick事件
 * 不然会触发两次点击事件
 */
const buttonAttrs = computed(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { onClick, ...args } = attrs;
    return args;
});
/**
 * 点击事件(自带加载状态)
 * 利用attrs拿到onClick事件，并执行
 * 不能用emit，因为emit是组件内部事件，并且不是同步执行的
 */
const handleClick = async (event) => {
    let loadingTimer = null;
    let hasShownLoading = false;
    // 延迟显示 loading
    loadingTimer = setTimeout(() => {
        loading.value = true;
        hasShownLoading = true;
    }, props.loadingDelay);
    try {
        const onClick = attrs.onClick;
        await onClick?.(event);
    }
    finally {
        // 清除定时器（如果接口在延迟时间内返回，定时器还未触发）
        if (loadingTimer) {
            clearTimeout(loadingTimer);
        }
        // 如果已经显示了 loading，则隐藏它
        if (hasShownLoading) {
            loading.value = false;
        }
    }
};
const loading = ref(false);
const __VLS_defaults = {
    loadingDelay: 0,
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
let __VLS_0;
/** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
elButton;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    ...{ 'onClick': {} },
    loading: (__VLS_ctx.loading),
    ...(__VLS_ctx.buttonAttrs),
}));
const __VLS_2 = __VLS_1({
    ...{ 'onClick': {} },
    loading: (__VLS_ctx.loading),
    ...(__VLS_ctx.buttonAttrs),
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
let __VLS_5;
const __VLS_6 = {
    ...{ click: {} },
    onClick: (__VLS_ctx.handleClick),
};
var __VLS_7;
const { default: __VLS_8 } = __VLS_3.slots;
for (const [_, name] of __VLS_vFor((__VLS_ctx.$slots))) {
    {
        const { [__VLS_tryAsConstant(name)]: __VLS_9 } = __VLS_3.slots;
        const [slotProps] = __VLS_vSlot(__VLS_9);
        var __VLS_10 = {
            loading: (__VLS_ctx.loading),
            ...(slotProps || {}),
        };
        var __VLS_11 = __VLS_tryAsConstant(name);
        // @ts-ignore
        [loading, loading, buttonAttrs, handleClick, $slots,];
    }
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_3;
var __VLS_4;
// @ts-ignore
var __VLS_12 = __VLS_11, __VLS_13 = __VLS_10;
// @ts-ignore
[];
const __VLS_base = (await import('vue')).defineComponent({
    __defaults: __VLS_defaults,
    __typeProps: {},
});
const __VLS_export = {};
export default {};
