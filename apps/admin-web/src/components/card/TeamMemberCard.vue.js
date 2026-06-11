/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
const menuStore = useMenuStore();
const __VLS_props = withDefaults(defineProps(), {
    title: '团队成员',
    titleIcon: 'HOutline:UserGroupIcon',
    height: '280',
});
const __VLS_defaults = {
    title: '团队成员',
    titleIcon: 'HOutline:UserGroupIcon',
    height: '280',
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
/** @ts-ignore @type { | typeof __VLS_components.BaseCard | typeof __VLS_components.BaseCard} */
BaseCard;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    title: (__VLS_ctx.title),
    titleIcon: (__VLS_ctx.titleIcon),
}));
const __VLS_2 = __VLS_1({
    title: (__VLS_ctx.title),
    titleIcon: (__VLS_ctx.titleIcon),
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_5;
const { default: __VLS_6 } = __VLS_3.slots;
let __VLS_7;
/** @ts-ignore @type { | typeof __VLS_components.elScrollbar | typeof __VLS_components.ElScrollbar | typeof __VLS_components['el-scrollbar'] | typeof __VLS_components.elScrollbar | typeof __VLS_components.ElScrollbar | typeof __VLS_components['el-scrollbar']} */
elScrollbar;
// @ts-ignore
const __VLS_8 = __VLS_asFunctionalComponent1(__VLS_7, new __VLS_7({
    height: (__VLS_ctx.height),
}));
const __VLS_9 = __VLS_8({
    height: (__VLS_ctx.height),
}, ...__VLS_functionalComponentArgsRest(__VLS_8));
const { default: __VLS_12 } = __VLS_10.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "team-list" },
});
/** @type {__VLS_StyleScopedClasses['team-list']} */ ;
for (const [item] of __VLS_vFor((__VLS_ctx.teamData))) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        key: (item.name),
    });
    let __VLS_13;
    /** @ts-ignore @type { | typeof __VLS_components.HoverAnimateWrapper | typeof __VLS_components.HoverAnimateWrapper} */
    HoverAnimateWrapper;
    // @ts-ignore
    const __VLS_14 = __VLS_asFunctionalComponent1(__VLS_13, new __VLS_13({
        name: "lift",
        ...{ style: {} },
        intensity: "light",
    }));
    const __VLS_15 = __VLS_14({
        name: "lift",
        ...{ style: {} },
        intensity: "light",
    }, ...__VLS_functionalComponentArgsRest(__VLS_14));
    const { default: __VLS_18 } = __VLS_16.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "team-item" },
    });
    /** @type {__VLS_StyleScopedClasses['team-item']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "avatar-wrap" },
    });
    /** @type {__VLS_StyleScopedClasses['avatar-wrap']} */ ;
    let __VLS_19;
    /** @ts-ignore @type { | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar']} */
    elAvatar;
    // @ts-ignore
    const __VLS_20 = __VLS_asFunctionalComponent1(__VLS_19, new __VLS_19({
        size: (40),
        src: (item.avatar),
    }));
    const __VLS_21 = __VLS_20({
        size: (40),
        src: (item.avatar),
    }, ...__VLS_functionalComponentArgsRest(__VLS_20));
    __VLS_asFunctionalElement1(__VLS_intrinsics.span)({
        ...{ class: "status-dot" },
        ...{ class: (item.status) },
    });
    /** @type {__VLS_StyleScopedClasses['status-dot']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "member-info" },
    });
    /** @type {__VLS_StyleScopedClasses['member-info']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "member-name" },
    });
    /** @type {__VLS_StyleScopedClasses['member-name']} */ ;
    (item.name);
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "member-role" },
    });
    /** @type {__VLS_StyleScopedClasses['member-role']} */ ;
    (item.role);
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "action" },
    });
    /** @type {__VLS_StyleScopedClasses['action']} */ ;
    let __VLS_24;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_25 = __VLS_asFunctionalComponent1(__VLS_24, new __VLS_24({
        circle: true,
        icon: (__VLS_ctx.menuStore.iconComponents['Element:ChatDotRound']),
    }));
    const __VLS_26 = __VLS_25({
        circle: true,
        icon: (__VLS_ctx.menuStore.iconComponents['Element:ChatDotRound']),
    }, ...__VLS_functionalComponentArgsRest(__VLS_25));
    // @ts-ignore
    [title, titleIcon, height, teamData, menuStore,];
    var __VLS_16;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
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
