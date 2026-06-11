/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import Lottie from 'lottie-web';
const props = withDefaults(defineProps(), {
    autoplay: true,
    loop: true,
    renderer: 'svg',
});
// lottie 容器
const lottieRef = useTemplateRef('lottieRef');
// 动画实例
const animation = ref(null);
// 计算样式
const style = computed(() => ({
    width: typeof props.width === 'number' ? `${props.width}px` : props.width,
    height: typeof props.height === 'number' ? `${props.height}px` : props.height,
}));
// 初始化动画
onMounted(() => {
    animation.value = Lottie.loadAnimation({
        container: lottieRef.value,
        renderer: props.renderer,
        loop: props.loop,
        autoplay: props.autoplay,
        animationData: props.animationData,
        path: props.path,
    });
});
// 销毁动画
onUnmounted(() => {
    animation.value?.destroy();
});
// 暴露动画实例
const __VLS_exposed = {
    // 播放动画
    play: () => animation.value?.play(),
    // 停止动画
    stop: () => animation.value?.stop(),
    // 暂停动画
    pause: () => animation.value?.pause(),
};
defineExpose(__VLS_exposed);
const __VLS_defaults = {
    autoplay: true,
    loop: true,
    renderer: 'svg',
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
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ref: "lottieRef",
    ...{ style: (__VLS_ctx.style) },
});
// @ts-ignore
[style,];
const __VLS_export = (await import('vue')).defineComponent({
    setup: () => __VLS_exposed,
    __defaults: __VLS_defaults,
    __typeProps: {},
});
export default {};
