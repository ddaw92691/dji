/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
const userStore = useUserStore();
// 技能标签
const skills = computed(() => {
    const tags = userStore.userInfo?.tags;
    if (!tags)
        return [];
    return tags.split(',').map((tag) => ({
        name: tag.trim(),
        // 随机type
        type: ['success', 'info', 'warning', 'danger', 'primary'][Math.floor(Math.random() * 5)],
    }));
});
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
let __VLS_0;
/** @ts-ignore @type { | typeof __VLS_components.BaseCard | typeof __VLS_components.BaseCard} */
BaseCard;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    title: "详细档案",
    titleIcon: "HOutline:IdentificationIcon",
}));
const __VLS_2 = __VLS_1({
    title: "详细档案",
    titleIcon: "HOutline:IdentificationIcon",
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_5;
const { default: __VLS_6 } = __VLS_3.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "info-cell" },
});
/** @type {__VLS_StyleScopedClasses['info-cell']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.label, __VLS_intrinsics.label)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
(__VLS_ctx.userStore.userInfo?.id);
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "info-cell" },
});
/** @type {__VLS_StyleScopedClasses['info-cell']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.label, __VLS_intrinsics.label)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
(__VLS_ctx.userStore.userInfo?.status === 'active' ? '启用' : '禁用');
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "info-cell" },
});
/** @type {__VLS_StyleScopedClasses['info-cell']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.label, __VLS_intrinsics.label)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
(__VLS_ctx.userStore.userInfo?.createTime);
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "info-cell" },
});
/** @type {__VLS_StyleScopedClasses['info-cell']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.label, __VLS_intrinsics.label)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
(__VLS_ctx.userStore.userInfo?.email || '暂无邮箱~');
let __VLS_7;
/** @ts-ignore @type { | typeof __VLS_components.elDivider | typeof __VLS_components.ElDivider | typeof __VLS_components['el-divider']} */
elDivider;
// @ts-ignore
const __VLS_8 = __VLS_asFunctionalComponent1(__VLS_7, new __VLS_7({}));
const __VLS_9 = __VLS_8({}, ...__VLS_functionalComponentArgsRest(__VLS_8));
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "text-sm font-bold text-(--el-text-color-secondary) mb-2" },
});
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-(--el-text-color-secondary)']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
if (__VLS_ctx.skills.length) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex flex-wrap gap-2" },
    });
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['flex-wrap']} */ ;
    /** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
    for (const [skill] of __VLS_vFor((__VLS_ctx.skills))) {
        let __VLS_12;
        /** @ts-ignore @type { | typeof __VLS_components.BaseTag} */
        BaseTag;
        // @ts-ignore
        const __VLS_13 = __VLS_asFunctionalComponent1(__VLS_12, new __VLS_12({
            key: (skill.name),
            type: (skill.type),
            text: (skill.name),
        }));
        const __VLS_14 = __VLS_13({
            key: (skill.name),
            type: (skill.type),
            text: (skill.name),
        }, ...__VLS_functionalComponentArgsRest(__VLS_13));
        // @ts-ignore
        [userStore, userStore, userStore, userStore, skills, skills,];
    }
}
else {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "text-sm" },
    });
    /** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
}
// @ts-ignore
[];
var __VLS_3;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
