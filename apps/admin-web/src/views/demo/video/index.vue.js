/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import MpegtsPlayer from './MpegtsPlayer.vue';
import WebRtcPlayer from './WebRtcPlayer.vue';
import HlsPlayer from './HlsPlayer.vue';
import NativeVideoPlayer from './NativeVideoPlayer.vue';
defineOptions({ name: 'VideoView' });
const playerList = reactive([
    {
        key: 'mpegts',
        title: 'MpegtsPlayer',
        library: 'mpegts.js',
        description: '基于 mpegts.js 封装，通过 MSE 将 FLV/MPEG-TS 流交给 video 播放。',
        usage: '主要适用于 HTTP-FLV、MPEG-TS 直播流，例如监控直播、直播转封装后的低延迟播放。',
        placeholder: '请输入 http(s)://example.com/live.flv 或 .ts 地址',
        inputUrl: '',
        playUrl: '',
        component: MpegtsPlayer,
    },
    {
        key: 'webrtc',
        title: 'WebRtcPlayer',
        library: 'WebRTC API',
        description: '基于浏览器原生 RTCPeerConnection 封装，通过 WHEP 信令拉取实时流。',
        usage: '主要适用于 WHEP WebRTC 低延迟直播流，不适合直接播放 mp4、flv、m3u8 文件地址。',
        placeholder: '请输入 WHEP 地址，例如 http(s)://example.com/whep/stream',
        inputUrl: '',
        playUrl: '',
        component: WebRtcPlayer,
    },
    {
        key: 'hls',
        title: 'HlsPlayer',
        library: 'hls.js',
        description: '基于 hls.js 封装，在非 Safari 浏览器中通过 MSE 播放 HLS。',
        usage: '主要适用于 HLS 的 .m3u8 点播或直播流，兼容性好，但通常延迟高于 WebRTC/HTTP-FLV。',
        placeholder: '请输入 http(s)://example.com/live/index.m3u8',
        inputUrl: '',
        playUrl: '',
        component: HlsPlayer,
    },
    {
        key: 'native',
        title: 'NativeVideoPlayer',
        library: 'HTMLVideoElement',
        description: '基于浏览器原生 video 标签封装，不引入第三方播放器内核。',
        usage: '主要适用于 mp4、webm、ogg 等浏览器原生支持的视频文件；Safari 可播放部分原生 HLS。',
        placeholder: '请输入 http(s)://example.com/video.mp4',
        inputUrl: '',
        playUrl: '',
        component: NativeVideoPlayer,
    },
]);
const play = (item) => {
    item.playUrl = item.inputUrl.trim();
};
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['video-card-header']} */ ;
/** @type {__VLS_StyleScopedClasses['video-control']} */ ;
/** @type {__VLS_StyleScopedClasses['video-control']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "video-demo-page" },
});
/** @type {__VLS_StyleScopedClasses['video-demo-page']} */ ;
let __VLS_0;
/** @ts-ignore @type { | typeof __VLS_components.elRow | typeof __VLS_components.ElRow | typeof __VLS_components['el-row'] | typeof __VLS_components.elRow | typeof __VLS_components.ElRow | typeof __VLS_components['el-row']} */
elRow;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    gutter: (20),
}));
const __VLS_2 = __VLS_1({
    gutter: (20),
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
const { default: __VLS_5 } = __VLS_3.slots;
for (const [item] of __VLS_vFor((__VLS_ctx.playerList))) {
    let __VLS_6;
    /** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
    elCol;
    // @ts-ignore
    const __VLS_7 = __VLS_asFunctionalComponent1(__VLS_6, new __VLS_6({
        key: (item.key),
        xs: (24),
        lg: (12),
    }));
    const __VLS_8 = __VLS_7({
        key: (item.key),
        xs: (24),
        lg: (12),
    }, ...__VLS_functionalComponentArgsRest(__VLS_7));
    const { default: __VLS_11 } = __VLS_9.slots;
    let __VLS_12;
    /** @ts-ignore @type { | typeof __VLS_components.BaseCard | typeof __VLS_components.BaseCard} */
    BaseCard;
    // @ts-ignore
    const __VLS_13 = __VLS_asFunctionalComponent1(__VLS_12, new __VLS_12({
        ...{ class: "video-demo-card" },
    }));
    const __VLS_14 = __VLS_13({
        ...{ class: "video-demo-card" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_13));
    /** @type {__VLS_StyleScopedClasses['video-demo-card']} */ ;
    const { default: __VLS_17 } = __VLS_15.slots;
    {
        const { header: __VLS_18 } = __VLS_15.slots;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "video-card-header" },
        });
        /** @type {__VLS_StyleScopedClasses['video-card-header']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "video-card-title" },
        });
        /** @type {__VLS_StyleScopedClasses['video-card-title']} */ ;
        (item.title);
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "video-card-desc" },
        });
        /** @type {__VLS_StyleScopedClasses['video-card-desc']} */ ;
        (item.description);
        let __VLS_19;
        /** @ts-ignore @type { | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag'] | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag']} */
        elTag;
        // @ts-ignore
        const __VLS_20 = __VLS_asFunctionalComponent1(__VLS_19, new __VLS_19({
            type: "primary",
            effect: "plain",
        }));
        const __VLS_21 = __VLS_20({
            type: "primary",
            effect: "plain",
        }, ...__VLS_functionalComponentArgsRest(__VLS_20));
        const { default: __VLS_24 } = __VLS_22.slots;
        (item.library);
        // @ts-ignore
        [playerList,];
        var __VLS_22;
        // @ts-ignore
        [];
    }
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "video-player-wrap" },
    });
    /** @type {__VLS_StyleScopedClasses['video-player-wrap']} */ ;
    const __VLS_25 = (item.component);
    // @ts-ignore
    const __VLS_26 = __VLS_asFunctionalComponent1(__VLS_25, new __VLS_25({
        src: (item.playUrl),
        height: "320px",
        autoplay: (false),
    }));
    const __VLS_27 = __VLS_26({
        src: (item.playUrl),
        height: "320px",
        autoplay: (false),
    }, ...__VLS_functionalComponentArgsRest(__VLS_26));
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "video-control" },
    });
    /** @type {__VLS_StyleScopedClasses['video-control']} */ ;
    let __VLS_30;
    /** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input'] | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
    elInput;
    // @ts-ignore
    const __VLS_31 = __VLS_asFunctionalComponent1(__VLS_30, new __VLS_30({
        ...{ 'onKeyup': {} },
        modelValue: (item.inputUrl),
        clearable: true,
        placeholder: (item.placeholder),
    }));
    const __VLS_32 = __VLS_31({
        ...{ 'onKeyup': {} },
        modelValue: (item.inputUrl),
        clearable: true,
        placeholder: (item.placeholder),
    }, ...__VLS_functionalComponentArgsRest(__VLS_31));
    let __VLS_35;
    const __VLS_36 = {
        ...{ keyup: {} },
        onKeyup: (...[$event]) => {
            __VLS_ctx.play(item);
            // @ts-ignore
            [play,];
        },
    };
    const { default: __VLS_37 } = __VLS_33.slots;
    {
        const { prepend: __VLS_38 } = __VLS_33.slots;
        // @ts-ignore
        [];
    }
    // @ts-ignore
    [];
    var __VLS_33;
    var __VLS_34;
    let __VLS_39;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_40 = __VLS_asFunctionalComponent1(__VLS_39, new __VLS_39({
        ...{ 'onClick': {} },
        type: "primary",
    }));
    const __VLS_41 = __VLS_40({
        ...{ 'onClick': {} },
        type: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_40));
    let __VLS_44;
    const __VLS_45 = {
        ...{ click: {} },
        onClick: (...[$event]) => {
            __VLS_ctx.play(item);
            // @ts-ignore
            [play,];
        },
    };
    const { default: __VLS_46 } = __VLS_42.slots;
    // @ts-ignore
    [];
    var __VLS_42;
    var __VLS_43;
    let __VLS_47;
    /** @ts-ignore @type { | typeof __VLS_components.elAlert | typeof __VLS_components.ElAlert | typeof __VLS_components['el-alert']} */
    elAlert;
    // @ts-ignore
    const __VLS_48 = __VLS_asFunctionalComponent1(__VLS_47, new __VLS_47({
        title: (item.usage),
        type: "info",
        closable: (false),
        showIcon: true,
    }));
    const __VLS_49 = __VLS_48({
        title: (item.usage),
        type: "info",
        closable: (false),
        showIcon: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_48));
    // @ts-ignore
    [];
    var __VLS_15;
    // @ts-ignore
    [];
    var __VLS_9;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_3;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
