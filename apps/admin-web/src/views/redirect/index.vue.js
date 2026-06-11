/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
defineOptions({ name: 'RedirectComponent' });
const route = useRoute();
const router = useRouter();
const { params, query, hash } = route;
const path = params.path;
// 延迟一下，确保路由已完全加载
nextTick(() => {
    setTimeout(() => {
        router.replace({
            path: '/' + path,
            query,
            hash,
        });
    }, 100);
});
const __VLS_ctx = {};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "redirect-container" },
});
/** @type {__VLS_StyleScopedClasses['redirect-container']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "redirect-loading" },
});
/** @type {__VLS_StyleScopedClasses['redirect-loading']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.img)({
    src: "@/assets/logo.svg",
    alt: "logo",
    ...{ class: "loading-logo" },
});
/** @type {__VLS_StyleScopedClasses['loading-logo']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "loading-text" },
});
/** @type {__VLS_StyleScopedClasses['loading-text']} */ ;
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
