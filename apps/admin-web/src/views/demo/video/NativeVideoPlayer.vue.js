/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
const props = withDefaults(defineProps(), { autoplay: false, muted: true, controls: true, poster: '', preload: 'metadata', objectFit: 'cover', width: '100%', height: '100%' });
const emit = defineEmits();
const videoRef = useTemplateRef('videoRef');
const activeSrc = ref('');
const hasStarted = ref(props.autoplay);
const isPaused = ref(false);
const loading = ref(false);
const errorMessage = ref('');
const destroy = () => {
    activeSrc.value = '';
    if (videoRef.value) {
        videoRef.value.pause();
        videoRef.value.removeAttribute('src');
        videoRef.value.load();
    }
    loading.value = false;
    isPaused.value = false;
};
const init = async () => {
    hasStarted.value = true;
    errorMessage.value = '';
    destroy();
    if (!props.src) {
        errorMessage.value = '视频地址不能为空';
        return;
    }
    loading.value = true;
    activeSrc.value = props.src;
    await nextTick();
    try {
        videoRef.value?.load();
        if (props.autoplay)
            await videoRef.value?.play();
    }
    catch {
        loading.value = false;
        errorMessage.value = '视频播放失败，请检查浏览器自动播放策略或视频地址';
    }
};
const play = () => (!hasStarted.value ? init() : videoRef.value?.play());
const reload = () => init();
const onReady = () => { loading.value = false; emit('ready'); };
const onPlay = () => { isPaused.value = false; loading.value = false; emit('play'); };
const onPause = () => { isPaused.value = true; emit('pause'); };
const onNativeError = () => { if (props.src) {
    loading.value = false;
    errorMessage.value = '视频加载失败，请确认地址是否可访问、格式是否被当前浏览器支持';
} };
watch(() => props.src, async (src) => {
    errorMessage.value = '';
    hasStarted.value = props.autoplay;
    if (src && props.autoplay) {
        await nextTick();
        init();
    }
    else if (!src) {
        destroy();
    }
}, { immediate: true });
onUnmounted(destroy);
const __VLS_exposed = { videoEl: videoRef, play: init, destroy };
defineExpose(__VLS_exposed);
const __VLS_defaults = { autoplay: false, muted: true, controls: true, poster: '', preload: 'metadata', objectFit: 'cover', width: '100%', height: '100%' };
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
/** @type {__VLS_StyleScopedClasses['native-video-mask']} */ ;
/** @type {__VLS_StyleScopedClasses['native-video-player-btn']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ style: ({ width: __VLS_ctx.width, height: __VLS_ctx.height }) },
    ...{ class: "native-video-player" },
});
/** @type {__VLS_StyleScopedClasses['native-video-player']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.video)({
    ...{ onCanplay: (__VLS_ctx.onReady) },
    ...{ onPause: (__VLS_ctx.onPause) },
    ...{ onPlay: (__VLS_ctx.onPlay) },
    ...{ onWaiting: (...[$event]) => {
            __VLS_ctx.loading = true;
            // @ts-ignore
            [width, height, onReady, onPause, onPlay, loading,];
        } },
    ...{ onError: (__VLS_ctx.onNativeError) },
    ref: "videoRef",
    ...{ class: "native-video" },
    src: (__VLS_ctx.activeSrc),
    controls: (__VLS_ctx.controls),
    muted: (__VLS_ctx.muted),
    autoplay: (__VLS_ctx.autoplay),
    poster: (__VLS_ctx.poster),
    preload: (__VLS_ctx.preload),
    playsinline: true,
    'webkit-playsinline': "true",
    'x5-playsinline': "true",
    ...{ style: ({ objectFit: __VLS_ctx.objectFit }) },
});
/** @type {__VLS_StyleScopedClasses['native-video']} */ ;
if (!__VLS_ctx.src) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "native-video-mask" },
    });
    /** @type {__VLS_StyleScopedClasses['native-video-mask']} */ ;
}
else if (__VLS_ctx.loading) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "native-video-mask" },
    });
    /** @type {__VLS_StyleScopedClasses['native-video-mask']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div)({
        ...{ class: "native-video-spinner" },
    });
    /** @type {__VLS_StyleScopedClasses['native-video-spinner']} */ ;
}
else if (!__VLS_ctx.hasStarted || __VLS_ctx.isPaused) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ onClick: (__VLS_ctx.play) },
        ...{ class: "native-video-mask native-video-mask--play" },
    });
    /** @type {__VLS_StyleScopedClasses['native-video-mask']} */ ;
    /** @type {__VLS_StyleScopedClasses['native-video-mask--play']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "native-video-player-btn" },
    });
    /** @type {__VLS_StyleScopedClasses['native-video-player-btn']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.svg, __VLS_intrinsics.svg)({
        viewBox: "0 0 24 24",
        fill: "currentColor",
        width: "36",
        height: "36",
    });
    __VLS_asFunctionalElement1(__VLS_intrinsics.path)({
        d: "M8 5v14l11-7z",
    });
}
else if (__VLS_ctx.errorMessage) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ onClick: (__VLS_ctx.reload) },
        ...{ class: "native-video-mask native-video-mask--error" },
    });
    /** @type {__VLS_StyleScopedClasses['native-video-mask']} */ ;
    /** @type {__VLS_StyleScopedClasses['native-video-mask--error']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
    (__VLS_ctx.errorMessage);
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "native-video-mask-tip" },
    });
    /** @type {__VLS_StyleScopedClasses['native-video-mask-tip']} */ ;
}
// @ts-ignore
[loading, onNativeError, activeSrc, controls, muted, autoplay, poster, preload, objectFit, src, hasStarted, isPaused, play, errorMessage, errorMessage, reload,];
const __VLS_export = (await import('vue')).defineComponent({
    setup: () => __VLS_exposed,
    __typeEmits: {},
    __defaults: __VLS_defaults,
    __typeProps: {},
});
export default {};
