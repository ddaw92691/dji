/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
/**
 * MpegtsPlayer
 * 基于 mpegts.js 封装，用于播放 HTTP-FLV、MPEG-TS 直播流。
 * 不直接支持 RTMP/RTSP，通常需要服务端先转成浏览器可播放的 FLV/MPEG-TS over HTTP。
 */
import mpegts from 'mpegts.js';
const props = withDefaults(defineProps(), {
    type: 'flv',
    autoplay: false,
    muted: true,
    controls: true,
    live: true,
    hasAudio: false,
    hasVideo: true,
    poster: '',
    objectFit: 'cover',
    enableWorker: true,
    width: '100%',
    height: '100%',
});
const emit = defineEmits();
let player = null;
const videoRef = useTemplateRef('videoRef');
const hasStarted = ref(props.autoplay);
const isPaused = ref(false);
const loading = ref(false);
const errorMessage = ref('');
const destroy = () => {
    if (player) {
        player.unload();
        player.detachMediaElement();
        player.destroy();
        player = null;
    }
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
    instance.on(mpegts.Events.ERROR, (type, detail, info) => {
        const data = typeof info === 'object' && info ? info : {};
        if (type === mpegts.ErrorTypes.NETWORK_ERROR) {
            showError(detail === mpegts.ErrorDetails.NETWORK_STATUS_CODE_INVALID ? `视频流请求失败，HTTP 状态码：${data.code ?? '未知'}` : '网络错误，请检查流地址或服务状态');
            return;
        }
        if (type === mpegts.ErrorTypes.MEDIA_ERROR) {
            showError('媒体错误，请检查 FLV/MPEG-TS 格式或编码');
            return;
        }
        showError(`播放器内部错误${data.msg ? `：${data.msg}` : ''}`);
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
    if (!mpegts.isSupported())
        return showError('当前浏览器不支持 FLV/MPEG-TS 播放');
    try {
        player = mpegts.createPlayer({ type: props.type, url: props.src, isLive: props.live, hasAudio: props.hasAudio, hasVideo: props.hasVideo }, { enableWorker: props.enableWorker, lazyLoad: false, autoCleanupSourceBuffer: true, liveBufferLatencyChasing: props.live });
        bindEvents(player);
        player.attachMediaElement(videoRef.value);
        player.load();
        await player.play();
        loading.value = false;
        emit('ready');
    }
    catch {
        showError('FLV/MPEG-TS 视频流初始化失败，请检查流地址或服务状态');
    }
};
const play = () => (!hasStarted.value ? init() : videoRef.value?.play());
const reload = () => init();
const onPlay = () => { isPaused.value = false; loading.value = false; emit('play'); };
const onPause = () => { isPaused.value = true; emit('pause'); };
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
const __VLS_defaults = {
    type: 'flv',
    autoplay: false,
    muted: true,
    controls: true,
    live: true,
    hasAudio: false,
    hasVideo: true,
    poster: '',
    objectFit: 'cover',
    enableWorker: true,
    width: '100%',
    height: '100%',
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
/** @type {__VLS_StyleScopedClasses['mpegts-mask']} */ ;
/** @type {__VLS_StyleScopedClasses['mpegts-player-btn']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ style: ({ width: __VLS_ctx.width, height: __VLS_ctx.height }) },
    ...{ class: "mpegts-player" },
});
/** @type {__VLS_StyleScopedClasses['mpegts-player']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.video)({
    ...{ onPause: (__VLS_ctx.onPause) },
    ...{ onPlay: (__VLS_ctx.onPlay) },
    ref: "videoRef",
    ...{ class: "mpegts-video" },
    controls: (__VLS_ctx.controls),
    muted: (__VLS_ctx.muted),
    autoplay: (__VLS_ctx.autoplay),
    poster: (__VLS_ctx.poster),
    playsinline: true,
    'webkit-playsinline': "true",
    'x5-playsinline': "true",
    ...{ style: ({ objectFit: __VLS_ctx.objectFit }) },
});
/** @type {__VLS_StyleScopedClasses['mpegts-video']} */ ;
if (!__VLS_ctx.src) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "mpegts-mask" },
    });
    /** @type {__VLS_StyleScopedClasses['mpegts-mask']} */ ;
}
else if (__VLS_ctx.loading) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "mpegts-mask" },
    });
    /** @type {__VLS_StyleScopedClasses['mpegts-mask']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div)({
        ...{ class: "mpegts-spinner" },
    });
    /** @type {__VLS_StyleScopedClasses['mpegts-spinner']} */ ;
}
else if (!__VLS_ctx.hasStarted || __VLS_ctx.isPaused) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ onClick: (__VLS_ctx.play) },
        ...{ class: "mpegts-mask mpegts-mask--play" },
    });
    /** @type {__VLS_StyleScopedClasses['mpegts-mask']} */ ;
    /** @type {__VLS_StyleScopedClasses['mpegts-mask--play']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "mpegts-player-btn" },
    });
    /** @type {__VLS_StyleScopedClasses['mpegts-player-btn']} */ ;
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
        ...{ class: "mpegts-mask mpegts-mask--error" },
    });
    /** @type {__VLS_StyleScopedClasses['mpegts-mask']} */ ;
    /** @type {__VLS_StyleScopedClasses['mpegts-mask--error']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
    (__VLS_ctx.errorMessage);
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "mpegts-mask-tip" },
    });
    /** @type {__VLS_StyleScopedClasses['mpegts-mask-tip']} */ ;
}
// @ts-ignore
[width, height, onPause, onPlay, controls, muted, autoplay, poster, objectFit, src, loading, hasStarted, isPaused, play, errorMessage, errorMessage, reload,];
const __VLS_export = (await import('vue')).defineComponent({
    setup: () => __VLS_exposed,
    __typeEmits: {},
    __defaults: __VLS_defaults,
    __typeProps: {},
});
export default {};
