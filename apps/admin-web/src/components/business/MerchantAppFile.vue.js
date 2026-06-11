/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { computed, ref, onBeforeUnmount } from 'vue';
import { merchantApplicationApi } from '@/api/merchantApplication';
defineOptions({ name: 'MerchantAppFile' });
const props = withDefaults(defineProps(), { applicationId: null, has: true, kind: 'image' });
const objectUrl = ref('');
const loading = ref(false);
const error = ref(false);
const hasFile = computed(() => props.has !== false && !!props.applicationId);
const load = async () => {
    if (objectUrl.value || loading.value || !props.applicationId)
        return;
    loading.value = true;
    error.value = false;
    try {
        const res = await merchantApplicationApi.getFile(props.applicationId, props.field);
        objectUrl.value = URL.createObjectURL(res.data);
    }
    catch {
        error.value = true;
    }
    finally {
        loading.value = false;
    }
};
onBeforeUnmount(() => {
    if (objectUrl.value)
        URL.revokeObjectURL(objectUrl.value);
});
const __VLS_defaults = { applicationId: null, has: true, kind: 'image' };
const __VLS_ctx = {
    ...{},
    ...{},
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
if (!__VLS_ctx.hasFile) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "merchant-app-file__empty" },
    });
    /** @type {__VLS_StyleScopedClasses['merchant-app-file__empty']} */ ;
}
else {
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    if (!__VLS_ctx.objectUrl) {
        let __VLS_0;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
            ...{ 'onClick': {} },
            link: true,
            type: "primary",
            loading: (__VLS_ctx.loading),
        }));
        const __VLS_2 = __VLS_1({
            ...{ 'onClick': {} },
            link: true,
            type: "primary",
            loading: (__VLS_ctx.loading),
        }, ...__VLS_functionalComponentArgsRest(__VLS_1));
        let __VLS_5;
        const __VLS_6 = {
            ...{ click: {} },
            onClick: (__VLS_ctx.load),
        };
        const { default: __VLS_7 } = __VLS_3.slots;
        (__VLS_ctx.kind === 'video' ? '查看视频' : '查看');
        // @ts-ignore
        [hasFile, objectUrl, loading, load, kind,];
        var __VLS_3;
        var __VLS_4;
    }
    else {
        if (__VLS_ctx.kind === 'image') {
            let __VLS_8;
            /** @ts-ignore @type { | typeof __VLS_components.elImage | typeof __VLS_components.ElImage | typeof __VLS_components['el-image']} */
            elImage;
            // @ts-ignore
            const __VLS_9 = __VLS_asFunctionalComponent1(__VLS_8, new __VLS_8({
                src: (__VLS_ctx.objectUrl),
                previewSrcList: ([__VLS_ctx.objectUrl]),
                previewTeleported: (true),
                fit: "cover",
                ...{ class: "merchant-app-file__img" },
            }));
            const __VLS_10 = __VLS_9({
                src: (__VLS_ctx.objectUrl),
                previewSrcList: ([__VLS_ctx.objectUrl]),
                previewTeleported: (true),
                fit: "cover",
                ...{ class: "merchant-app-file__img" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_9));
            /** @type {__VLS_StyleScopedClasses['merchant-app-file__img']} */ ;
        }
        else {
            __VLS_asFunctionalElement1(__VLS_intrinsics.video)({
                src: (__VLS_ctx.objectUrl),
                controls: true,
                ...{ class: "merchant-app-file__video" },
            });
            /** @type {__VLS_StyleScopedClasses['merchant-app-file__video']} */ ;
        }
    }
    if (__VLS_ctx.error) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "merchant-app-file__error" },
        });
        /** @type {__VLS_StyleScopedClasses['merchant-app-file__error']} */ ;
    }
}
// @ts-ignore
[objectUrl, objectUrl, objectUrl, kind, error,];
const __VLS_export = (await import('vue')).defineComponent({
    __defaults: __VLS_defaults,
    __typeProps: {},
});
export default {};
