/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
/**
 * HlsPlayer
 * 基于 hls.js 封装，用于播放 HLS .m3u8 点播或直播流。
 * Chrome/Edge/Firefox 通常依赖 hls.js + MSE，Safari 可直接走 video 原生 HLS 能力。
 */
import Hls from 'hls.js';
const props = withDefaults(defineProps(), { autoplay: false, muted: true, controls: true, poster: '', objectFit: 'cover', lowLatencyMode: true, width: '100%', height: '100%' });
const emit = defineEmits();
let player = null;
const videoRef = useTemplateRef('videoRef');
const hasStarted = ref(props.autoplay);
const isPaused = ref(false);
const loading = ref(false);
const errorMessage = ref('');
const destroy = () => {
    player?.destroy();
    player = null;
    if (videoRef.value) {
        videoRef.value.pause();
        videoRef.value.removeAttribute('src');
        videoRef.value.load();
    }
    loading.value = false;
    isPaused.value = false;
};
const showError = async (message) => {
    if (errorMessage.value)
        return;
    errorMessage.value = message;
    await nextTick();
    destroy();
};
const bindEvents = (instance) => {
    instance.on(Hls.Events.MANIFEST_PARSED, () => {
        loading.value = false;
        emit('ready');
        if (props.autoplay)
            videoRef.value?.play().catch(() => { });
    });
    instance.on(Hls.Events.ERROR, (_, data) => {
        if (!data.fatal)
            return;
        if (data.type === Hls.ErrorTypes.NETWORK_ERROR)
            return showError('HLS 网络错误，请检查 m3u8 地址或服务状态');
        if (data.type === Hls.ErrorTypes.MEDIA_ERROR)
            return showError('HLS 媒体错误，请检查视频编码格式');
        showError('HLS 播放器内部错误');
    });
};
const init = async () => {
    hasStarted.value = true;
    errorMessage.value = '';
    destroy();
    loading.value = true;
    if (!props.src)
        return showError('视频地址不能为空');
    if (!videoRef.value)
        return;
    try {
        if (Hls.isSupported()) {
            player = new Hls({ lowLatencyMode: props.lowLatencyMode, backBufferLength: 90 });
            bindEvents(player);
            player.loadSource(props.src);
            player.attachMedia(videoRef.value);
            return;
        }
        if (videoRef.value.canPlayType('application/vnd.apple.mpegurl')) {
            videoRef.value.src = props.src;
            videoRef.value.load();
            if (props.autoplay)
                await videoRef.value.play();
            return;
        }
        showError('当前浏览器不支持 HLS 播放');
    }
    catch {
        showError('HLS 视频流初始化失败，请检查流地址或服务状态');
    }
};
const play = () => (!hasStarted.value ? init() : videoRef.value?.play());
const reload = () => init();
const onReady = () => { loading.value = false; emit('ready'); };
const onPlay = () => { isPaused.value = false; loading.value = false; emit('play'); };
const onPause = () => { isPaused.value = true; emit('pause'); };
const onNativeError = () => { if (props.src)
    showError('视频加载失败，请检查流地址、跨域配置或编码格式'); };
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
const __VLS_defaults = { autoplay: false, muted: true, controls: true, poster: '', objectFit: 'cover', lowLatencyMode: true, width: '100%', height: '100%' };
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
/** @type {__VLS_StyleScopedClasses['hls-mask']} */ ;
/** @type {__VLS_StyleScopedClasses['hls-player-btn']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ style: ({ width: __VLS_ctx.width, height: __VLS_ctx.height }) },
    ...{ class: "hls-player" },
});
/** @type {__VLS_StyleScopedClasses['hls-player']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.video)({
    ...{ onCanplay: (__VLS_ctx.onReady) },
    ...{ onPause: (__VLS_ctx.onPause) },
    ...{ onPlay: (__VLS_ctx.onPlay) },
    ...{ onError: (__VLS_ctx.onNativeError) },
    ref: "videoRef",
    ...{ class: "hls-video" },
    controls: (__VLS_ctx.controls),
    muted: (__VLS_ctx.muted),
    autoplay: (__VLS_ctx.autoplay),
    poster: (__VLS_ctx.poster),
    playsinline: true,
    'webkit-playsinline': "true",
    'x5-playsinline': "true",
    ...{ style: ({ objectFit: __VLS_ctx.objectFit }) },
});
/** @type {__VLS_StyleScopedClasses['hls-video']} */ ;
if (!__VLS_ctx.src) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "hls-mask" },
    });
    /** @type {__VLS_StyleScopedClasses['hls-mask']} */ ;
}
else if (__VLS_ctx.loading) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "hls-mask" },
    });
    /** @type {__VLS_StyleScopedClasses['hls-mask']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div)({
        ...{ class: "hls-spinner" },
    });
    /** @type {__VLS_StyleScopedClasses['hls-spinner']} */ ;
}
else if (!__VLS_ctx.hasStarted || __VLS_ctx.isPaused) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ onClick: (__VLS_ctx.play) },
        ...{ class: "hls-mask hls-mask--play" },
    });
    /** @type {__VLS_StyleScopedClasses['hls-mask']} */ ;
    /** @type {__VLS_StyleScopedClasses['hls-mask--play']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "hls-player-btn" },
    });
    /** @type {__VLS_StyleScopedClasses['hls-player-btn']} */ ;
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
        ...{ class: "hls-mask hls-mask--error" },
    });
    /** @type {__VLS_StyleScopedClasses['hls-mask']} */ ;
    /** @type {__VLS_StyleScopedClasses['hls-mask--error']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
    (__VLS_ctx.errorMessage);
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "hls-mask-tip" },
    });
    /** @type {__VLS_StyleScopedClasses['hls-mask-tip']} */ ;
}
// @ts-ignore
[width, height, onReady, onPause, onPlay, onNativeError, controls, muted, autoplay, poster, objectFit, src, loading, hasStarted, isPaused, play, errorMessage, errorMessage, reload,];
const __VLS_export = (await import('vue')).defineComponent({
    setup: () => __VLS_exposed,
    __typeEmits: {},
    __defaults: __VLS_defaults,
    __typeProps: {},
});
export default {};
