/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
const props = withDefaults(defineProps(), {
    autoplay: false,
    muted: true,
    controls: true,
    hasAudio: false,
    hasVideo: true,
    poster: '',
    objectFit: 'cover',
    width: '100%',
    height: '100%',
});
const emit = defineEmits();
let pc = null;
const videoRef = useTemplateRef('videoRef');
const hasStarted = ref(props.autoplay);
const isPaused = ref(false);
const loading = ref(false);
const errorMessage = ref('');
const destroy = () => {
    if (pc) {
        pc.ontrack = null;
        pc.onconnectionstatechange = null;
        pc.close();
        pc = null;
    }
    if (videoRef.value?.srcObject) {
        const stream = videoRef.value.srcObject;
        stream.getTracks().forEach((track) => track.stop());
        videoRef.value.srcObject = null;
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
const waitIceComplete = (instance) => new Promise((resolve) => {
    if (instance.iceGatheringState === 'complete')
        return resolve();
    const onChange = () => {
        if (instance.iceGatheringState === 'complete') {
            instance.removeEventListener('icegatheringstatechange', onChange);
            resolve();
        }
    };
    instance.addEventListener('icegatheringstatechange', onChange);
});
const bindEvents = (instance) => {
    instance.ontrack = (event) => {
        if (!videoRef.value)
            return;
        const [stream] = event.streams;
        if (!stream)
            return;
        videoRef.value.srcObject = stream;
        videoRef.value.play().catch(() => { });
        loading.value = false;
        emit('ready');
    };
    instance.onconnectionstatechange = () => {
        if (!pc)
            return;
        if (pc.connectionState === 'connected') {
            loading.value = false;
            emit('play');
        }
        else if (pc.connectionState === 'failed' || pc.connectionState === 'disconnected') {
            showError('WebRTC 连接断开，请检查流地址或服务状态');
        }
    };
};
const parseAnswerSdp = (text) => {
    try {
        const json = JSON.parse(text);
        if (json.sdp)
            return json.sdp;
        if (json.code !== undefined && json.code !== 0)
            throw new Error(`服务端错误(code=${json.code}, msg=${json.msg ?? ''})`);
        return text;
    }
    catch (error) {
        if (error instanceof SyntaxError)
            return text;
        throw error;
    }
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
    if (typeof RTCPeerConnection === 'undefined')
        return showError('当前浏览器不支持 WebRTC 播放');
    try {
        pc = new RTCPeerConnection();
        if (props.hasVideo)
            pc.addTransceiver('video', { direction: 'recvonly' });
        if (props.hasAudio)
            pc.addTransceiver('audio', { direction: 'recvonly' });
        bindEvents(pc);
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        await waitIceComplete(pc);
        const response = await fetch(props.src, {
            method: 'POST',
            headers: { 'Content-Type': 'application/sdp', Accept: 'application/sdp, application/json' },
            body: pc.localDescription?.sdp,
        });
        if (!response.ok)
            throw new Error(`WebRTC 信令请求失败，HTTP 状态码：${response.status}`);
        const answerSdp = parseAnswerSdp(await response.text());
        await pc.setRemoteDescription({ type: 'answer', sdp: answerSdp });
    }
    catch (error) {
        showError(`WebRTC 视频流初始化失败：${error instanceof Error ? error.message : String(error)}`);
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
    autoplay: false,
    muted: true,
    controls: true,
    hasAudio: false,
    hasVideo: true,
    poster: '',
    objectFit: 'cover',
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
/** @type {__VLS_StyleScopedClasses['webrtc-mask']} */ ;
/** @type {__VLS_StyleScopedClasses['webrtc-player-btn']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ style: ({ width: __VLS_ctx.width, height: __VLS_ctx.height }) },
    ...{ class: "webrtc-player" },
});
/** @type {__VLS_StyleScopedClasses['webrtc-player']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.video)({
    ...{ onPause: (__VLS_ctx.onPause) },
    ...{ onPlay: (__VLS_ctx.onPlay) },
    ref: "videoRef",
    ...{ class: "webrtc-video" },
    controls: (__VLS_ctx.controls),
    muted: (__VLS_ctx.muted),
    autoplay: (__VLS_ctx.autoplay),
    poster: (__VLS_ctx.poster),
    playsinline: true,
    'webkit-playsinline': "true",
    'x5-playsinline': "true",
    ...{ style: ({ objectFit: __VLS_ctx.objectFit }) },
});
/** @type {__VLS_StyleScopedClasses['webrtc-video']} */ ;
if (!__VLS_ctx.src) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "webrtc-mask" },
    });
    /** @type {__VLS_StyleScopedClasses['webrtc-mask']} */ ;
}
else if (__VLS_ctx.loading) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "webrtc-mask" },
    });
    /** @type {__VLS_StyleScopedClasses['webrtc-mask']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div)({
        ...{ class: "webrtc-spinner" },
    });
    /** @type {__VLS_StyleScopedClasses['webrtc-spinner']} */ ;
}
else if (!__VLS_ctx.hasStarted || __VLS_ctx.isPaused) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ onClick: (__VLS_ctx.play) },
        ...{ class: "webrtc-mask webrtc-mask--play" },
    });
    /** @type {__VLS_StyleScopedClasses['webrtc-mask']} */ ;
    /** @type {__VLS_StyleScopedClasses['webrtc-mask--play']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "webrtc-player-btn" },
    });
    /** @type {__VLS_StyleScopedClasses['webrtc-player-btn']} */ ;
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
        ...{ class: "webrtc-mask webrtc-mask--error" },
    });
    /** @type {__VLS_StyleScopedClasses['webrtc-mask']} */ ;
    /** @type {__VLS_StyleScopedClasses['webrtc-mask--error']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
    (__VLS_ctx.errorMessage);
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "webrtc-mask-tip" },
    });
    /** @type {__VLS_StyleScopedClasses['webrtc-mask-tip']} */ ;
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
