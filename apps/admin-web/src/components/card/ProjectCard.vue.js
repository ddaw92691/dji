/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
const props = withDefaults(defineProps(), {
    descLine: 2,
    avatarLine: 3,
});
const menuStore = useMenuStore();
// 项目图标计算
const projectIconComputed = computed(() => {
    if (typeof props.project.icon === 'string')
        return menuStore.iconComponents[props.project.icon];
    return props.project.icon;
});
// 项目状态计算
const projectStatusComputed = computed(() => {
    switch (props.project.status) {
        case 'not_started':
            return { type: 'info', text: '待开始' };
        case 'in_progress':
            return { type: 'primary', text: '进行中' };
        case 'completed':
            return { type: 'success', text: '已完成' };
    }
});
// 项目成员计算
const projectMembersComputed = computed(() => {
    // 项目成员为空时返回空数组
    if (!props.project.members)
        return [];
    // 返回指定展示行数的成员
    return props.project.members.slice(0, props.avatarLine);
});
// 剩余成员数量
const extraCount = computed(() => {
    // 项目成员为空时返回0
    if (!props.project.members)
        return 0;
    // 剩余成员数量
    const count = props.project.members.length - props.avatarLine;
    return count > 0 ? count : 0;
});
const __VLS_defaults = {
    descLine: 2,
    avatarLine: 3,
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
/** @ts-ignore @type { | typeof __VLS_components.HoverAnimateWrapper | typeof __VLS_components.HoverAnimateWrapper} */
HoverAnimateWrapper;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    name: "lift",
}));
const __VLS_2 = __VLS_1({
    name: "lift",
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_5;
const { default: __VLS_6 } = __VLS_3.slots;
let __VLS_7;
/** @ts-ignore @type { | typeof __VLS_components.BaseCard | typeof __VLS_components.BaseCard} */
BaseCard;
// @ts-ignore
const __VLS_8 = __VLS_asFunctionalComponent1(__VLS_7, new __VLS_7({
    ...{ class: "project-card" },
}));
const __VLS_9 = __VLS_8({
    ...{ class: "project-card" },
}, ...__VLS_functionalComponentArgsRest(__VLS_8));
/** @type {__VLS_StyleScopedClasses['project-card']} */ ;
const { default: __VLS_12 } = __VLS_10.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "project-title" },
});
/** @type {__VLS_StyleScopedClasses['project-title']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "project-icon" },
    ...{ style: ({ backgroundColor: __VLS_ctx.project.color + '20' }) },
});
/** @type {__VLS_StyleScopedClasses['project-icon']} */ ;
let __VLS_13;
/** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
elIcon;
// @ts-ignore
const __VLS_14 = __VLS_asFunctionalComponent1(__VLS_13, new __VLS_13({
    size: "20",
}));
const __VLS_15 = __VLS_14({
    size: "20",
}, ...__VLS_functionalComponentArgsRest(__VLS_14));
const { default: __VLS_18 } = __VLS_16.slots;
const __VLS_19 = (__VLS_ctx.projectIconComputed);
// @ts-ignore
const __VLS_20 = __VLS_asFunctionalComponent1(__VLS_19, new __VLS_19({
    ...{ style: ({ color: __VLS_ctx.project.color }) },
}));
const __VLS_21 = __VLS_20({
    ...{ style: ({ color: __VLS_ctx.project.color }) },
}, ...__VLS_functionalComponentArgsRest(__VLS_20));
// @ts-ignore
[project, project, projectIconComputed,];
var __VLS_16;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "title" },
});
/** @type {__VLS_StyleScopedClasses['title']} */ ;
(__VLS_ctx.project.name);
let __VLS_24;
/** @ts-ignore @type { | typeof __VLS_components.BaseTag} */
BaseTag;
// @ts-ignore
const __VLS_25 = __VLS_asFunctionalComponent1(__VLS_24, new __VLS_24({
    text: (__VLS_ctx.projectStatusComputed.text),
    type: (__VLS_ctx.projectStatusComputed.type),
}));
const __VLS_26 = __VLS_25({
    text: (__VLS_ctx.projectStatusComputed.text),
    type: (__VLS_ctx.projectStatusComputed.type),
}, ...__VLS_functionalComponentArgsRest(__VLS_25));
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "project-description" },
});
/** @type {__VLS_StyleScopedClasses['project-description']} */ ;
let __VLS_29;
/** @ts-ignore @type { | typeof __VLS_components.TextEllipsis} */
TextEllipsis;
// @ts-ignore
const __VLS_30 = __VLS_asFunctionalComponent1(__VLS_29, new __VLS_29({
    text: (__VLS_ctx.project.desc),
    line: (__VLS_ctx.descLine),
}));
const __VLS_31 = __VLS_30({
    text: (__VLS_ctx.project.desc),
    line: (__VLS_ctx.descLine),
}, ...__VLS_functionalComponentArgsRest(__VLS_30));
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "project-progress" },
});
/** @type {__VLS_StyleScopedClasses['project-progress']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "project-progress-title" },
});
/** @type {__VLS_StyleScopedClasses['project-progress-title']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
(__VLS_ctx.project.progress);
let __VLS_34;
/** @ts-ignore @type { | typeof __VLS_components.elProgress | typeof __VLS_components.ElProgress | typeof __VLS_components['el-progress']} */
elProgress;
// @ts-ignore
const __VLS_35 = __VLS_asFunctionalComponent1(__VLS_34, new __VLS_34({
    percentage: (__VLS_ctx.project.progress),
    color: (__VLS_ctx.project.color),
    showText: (false),
    strokeWidth: (6),
}));
const __VLS_36 = __VLS_35({
    percentage: (__VLS_ctx.project.progress),
    color: (__VLS_ctx.project.color),
    showText: (false),
    strokeWidth: (6),
}, ...__VLS_functionalComponentArgsRest(__VLS_35));
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "project-footer" },
});
/** @type {__VLS_StyleScopedClasses['project-footer']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "project-member" },
});
/** @type {__VLS_StyleScopedClasses['project-member']} */ ;
for (const [avatar] of __VLS_vFor((__VLS_ctx.projectMembersComputed))) {
    let __VLS_39;
    /** @ts-ignore @type { | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar']} */
    elAvatar;
    // @ts-ignore
    const __VLS_40 = __VLS_asFunctionalComponent1(__VLS_39, new __VLS_39({
        key: (avatar.name),
        src: (avatar.avatar),
        size: (24),
        ...{ class: "avatar" },
    }));
    const __VLS_41 = __VLS_40({
        key: (avatar.name),
        src: (avatar.avatar),
        size: (24),
        ...{ class: "avatar" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_40));
    /** @type {__VLS_StyleScopedClasses['avatar']} */ ;
    // @ts-ignore
    [project, project, project, project, project, projectStatusComputed, projectStatusComputed, descLine, projectMembersComputed,];
}
if (__VLS_ctx.extraCount > 0) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
    (__VLS_ctx.extraCount);
}
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "project-time" },
});
/** @type {__VLS_StyleScopedClasses['project-time']} */ ;
(__VLS_ctx.project.time);
// @ts-ignore
[project, extraCount, extraCount,];
var __VLS_10;
// @ts-ignore
[];
var __VLS_3;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    __defaults: __VLS_defaults,
    __typeProps: {},
});
export default {};
