/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ElMessage } from 'element-plus';
defineOptions({ name: 'TagView' });
const menuStore = useMenuStore();
const handleClose = (type) => {
    ElMessage.success(`已关闭 ${type} 标签`);
};
const tagPropsTableData = [
    {
        name: 'text',
        type: 'string',
        default: "''",
        description: 'BaseTag 额外提供的文本属性；当未使用默认插槽时，会渲染该内容',
    },
    {
        name: 'type',
        type: "'success' | 'info' | 'warning' | 'danger' | 'primary'",
        default: "'primary'",
        description: '标签类型，继承自 el-tag',
    },
    {
        name: 'effect',
        type: "'dark' | 'light' | 'plain'",
        default: "'light'",
        description: '标签主题样式，继承自 el-tag',
    },
    {
        name: 'size',
        type: "'large' | 'default' | 'small'",
        default: "'default'",
        description: '标签尺寸，继承自 el-tag',
    },
    {
        name: 'round',
        type: 'boolean',
        default: 'false',
        description: '是否为圆角标签，继承自 el-tag',
    },
    {
        name: 'closable',
        type: 'boolean',
        default: 'false',
        description: '是否可关闭，继承自 el-tag',
    },
    {
        name: 'disable-transitions',
        type: 'boolean',
        default: 'false',
        description: '是否禁用渐变动画，继承自 el-tag',
    },
    {
        name: '...attrs',
        type: 'ElTag props / events / slots',
        default: '-',
        description: '其余未声明属性会自动透传给 el-tag，因此支持 el-tag 的所有能力',
    },
];
const tagEventsTableData = [
    {
        name: 'close',
        params: 'event: MouseEvent',
        description: '当 closable 为 true 且点击关闭按钮时触发，继承自 el-tag',
    },
];
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "tag-doc-container" },
});
/** @type {__VLS_StyleScopedClasses['tag-doc-container']} */ ;
let __VLS_0;
/** @ts-ignore @type { | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card'] | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card']} */
elCard;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    shadow: "never",
}));
const __VLS_2 = __VLS_1({
    shadow: "never",
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
const { default: __VLS_5 } = __VLS_3.slots;
{
    const { header: __VLS_6 } = __VLS_3.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "card-header" },
    });
    /** @type {__VLS_StyleScopedClasses['card-header']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "card-title" },
    });
    /** @type {__VLS_StyleScopedClasses['card-title']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "card-description" },
    });
    /** @type {__VLS_StyleScopedClasses['card-description']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.code, __VLS_intrinsics.code)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.code, __VLS_intrinsics.code)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        ...{ class: "description-text" },
    });
    /** @type {__VLS_StyleScopedClasses['description-text']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.code, __VLS_intrinsics.code)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        ...{ class: "description-text" },
    });
    /** @type {__VLS_StyleScopedClasses['description-text']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.code, __VLS_intrinsics.code)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.code, __VLS_intrinsics.code)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.code, __VLS_intrinsics.code)({});
    let __VLS_7;
    /** @ts-ignore @type { | typeof __VLS_components.elLink | typeof __VLS_components.ElLink | typeof __VLS_components['el-link'] | typeof __VLS_components.elLink | typeof __VLS_components.ElLink | typeof __VLS_components['el-link']} */
    elLink;
    // @ts-ignore
    const __VLS_8 = __VLS_asFunctionalComponent1(__VLS_7, new __VLS_7({
        href: "https://github.com/DFANNN/DFAN-Admin/blob/main/src/components/tag/BaseTag.vue",
        target: "_blank",
        type: "primary",
        underline: (false),
    }));
    const __VLS_9 = __VLS_8({
        href: "https://github.com/DFANNN/DFAN-Admin/blob/main/src/components/tag/BaseTag.vue",
        target: "_blank",
        type: "primary",
        underline: (false),
    }, ...__VLS_functionalComponentArgsRest(__VLS_8));
    const { default: __VLS_12 } = __VLS_10.slots;
    var __VLS_10;
}
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "form-container" },
});
/** @type {__VLS_StyleScopedClasses['form-container']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "preview-section" },
});
/** @type {__VLS_StyleScopedClasses['preview-section']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "section-title" },
});
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "preview-content" },
});
/** @type {__VLS_StyleScopedClasses['preview-content']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "demo-group" },
});
/** @type {__VLS_StyleScopedClasses['demo-group']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "demo-label" },
});
/** @type {__VLS_StyleScopedClasses['demo-label']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "demo-tags" },
});
/** @type {__VLS_StyleScopedClasses['demo-tags']} */ ;
let __VLS_13;
/** @ts-ignore @type { | typeof __VLS_components.BaseTag} */
BaseTag;
// @ts-ignore
const __VLS_14 = __VLS_asFunctionalComponent1(__VLS_13, new __VLS_13({
    text: "默认标签",
}));
const __VLS_15 = __VLS_14({
    text: "默认标签",
}, ...__VLS_functionalComponentArgsRest(__VLS_14));
let __VLS_18;
/** @ts-ignore @type { | typeof __VLS_components.BaseTag} */
BaseTag;
// @ts-ignore
const __VLS_19 = __VLS_asFunctionalComponent1(__VLS_18, new __VLS_18({
    type: "primary",
    text: "主要标签",
}));
const __VLS_20 = __VLS_19({
    type: "primary",
    text: "主要标签",
}, ...__VLS_functionalComponentArgsRest(__VLS_19));
let __VLS_23;
/** @ts-ignore @type { | typeof __VLS_components.BaseTag} */
BaseTag;
// @ts-ignore
const __VLS_24 = __VLS_asFunctionalComponent1(__VLS_23, new __VLS_23({
    type: "success",
    text: "成功标签",
}));
const __VLS_25 = __VLS_24({
    type: "success",
    text: "成功标签",
}, ...__VLS_functionalComponentArgsRest(__VLS_24));
let __VLS_28;
/** @ts-ignore @type { | typeof __VLS_components.BaseTag} */
BaseTag;
// @ts-ignore
const __VLS_29 = __VLS_asFunctionalComponent1(__VLS_28, new __VLS_28({
    type: "info",
    text: "信息标签",
}));
const __VLS_30 = __VLS_29({
    type: "info",
    text: "信息标签",
}, ...__VLS_functionalComponentArgsRest(__VLS_29));
let __VLS_33;
/** @ts-ignore @type { | typeof __VLS_components.BaseTag} */
BaseTag;
// @ts-ignore
const __VLS_34 = __VLS_asFunctionalComponent1(__VLS_33, new __VLS_33({
    type: "warning",
    text: "警告标签",
}));
const __VLS_35 = __VLS_34({
    type: "warning",
    text: "警告标签",
}, ...__VLS_functionalComponentArgsRest(__VLS_34));
let __VLS_38;
/** @ts-ignore @type { | typeof __VLS_components.BaseTag} */
BaseTag;
// @ts-ignore
const __VLS_39 = __VLS_asFunctionalComponent1(__VLS_38, new __VLS_38({
    type: "danger",
    text: "危险标签",
}));
const __VLS_40 = __VLS_39({
    type: "danger",
    text: "危险标签",
}, ...__VLS_functionalComponentArgsRest(__VLS_39));
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "demo-group" },
});
/** @type {__VLS_StyleScopedClasses['demo-group']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "demo-label" },
});
/** @type {__VLS_StyleScopedClasses['demo-label']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "demo-tags" },
});
/** @type {__VLS_StyleScopedClasses['demo-tags']} */ ;
let __VLS_43;
/** @ts-ignore @type { | typeof __VLS_components.BaseTag} */
BaseTag;
// @ts-ignore
const __VLS_44 = __VLS_asFunctionalComponent1(__VLS_43, new __VLS_43({
    type: "primary",
    effect: "dark",
    text: "dark",
}));
const __VLS_45 = __VLS_44({
    type: "primary",
    effect: "dark",
    text: "dark",
}, ...__VLS_functionalComponentArgsRest(__VLS_44));
let __VLS_48;
/** @ts-ignore @type { | typeof __VLS_components.BaseTag} */
BaseTag;
// @ts-ignore
const __VLS_49 = __VLS_asFunctionalComponent1(__VLS_48, new __VLS_48({
    type: "success",
    effect: "light",
    text: "light",
}));
const __VLS_50 = __VLS_49({
    type: "success",
    effect: "light",
    text: "light",
}, ...__VLS_functionalComponentArgsRest(__VLS_49));
let __VLS_53;
/** @ts-ignore @type { | typeof __VLS_components.BaseTag} */
BaseTag;
// @ts-ignore
const __VLS_54 = __VLS_asFunctionalComponent1(__VLS_53, new __VLS_53({
    type: "warning",
    effect: "plain",
    text: "plain",
}));
const __VLS_55 = __VLS_54({
    type: "warning",
    effect: "plain",
    text: "plain",
}, ...__VLS_functionalComponentArgsRest(__VLS_54));
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "demo-group" },
});
/** @type {__VLS_StyleScopedClasses['demo-group']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "demo-label" },
});
/** @type {__VLS_StyleScopedClasses['demo-label']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "demo-tags" },
});
/** @type {__VLS_StyleScopedClasses['demo-tags']} */ ;
let __VLS_58;
/** @ts-ignore @type { | typeof __VLS_components.BaseTag} */
BaseTag;
// @ts-ignore
const __VLS_59 = __VLS_asFunctionalComponent1(__VLS_58, new __VLS_58({
    round: true,
    text: "默认圆角",
}));
const __VLS_60 = __VLS_59({
    round: true,
    text: "默认圆角",
}, ...__VLS_functionalComponentArgsRest(__VLS_59));
let __VLS_63;
/** @ts-ignore @type { | typeof __VLS_components.BaseTag} */
BaseTag;
// @ts-ignore
const __VLS_64 = __VLS_asFunctionalComponent1(__VLS_63, new __VLS_63({
    round: true,
    type: "primary",
    text: "主要圆角",
}));
const __VLS_65 = __VLS_64({
    round: true,
    type: "primary",
    text: "主要圆角",
}, ...__VLS_functionalComponentArgsRest(__VLS_64));
let __VLS_68;
/** @ts-ignore @type { | typeof __VLS_components.BaseTag} */
BaseTag;
// @ts-ignore
const __VLS_69 = __VLS_asFunctionalComponent1(__VLS_68, new __VLS_68({
    round: true,
    type: "success",
    effect: "dark",
    text: "成功圆角",
}));
const __VLS_70 = __VLS_69({
    round: true,
    type: "success",
    effect: "dark",
    text: "成功圆角",
}, ...__VLS_functionalComponentArgsRest(__VLS_69));
let __VLS_73;
/** @ts-ignore @type { | typeof __VLS_components.BaseTag} */
BaseTag;
// @ts-ignore
const __VLS_74 = __VLS_asFunctionalComponent1(__VLS_73, new __VLS_73({
    round: true,
    type: "warning",
    effect: "plain",
    text: "警告圆角",
}));
const __VLS_75 = __VLS_74({
    round: true,
    type: "warning",
    effect: "plain",
    text: "警告圆角",
}, ...__VLS_functionalComponentArgsRest(__VLS_74));
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "demo-group" },
});
/** @type {__VLS_StyleScopedClasses['demo-group']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "demo-label" },
});
/** @type {__VLS_StyleScopedClasses['demo-label']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "demo-tags" },
});
/** @type {__VLS_StyleScopedClasses['demo-tags']} */ ;
let __VLS_78;
/** @ts-ignore @type { | typeof __VLS_components.BaseTag} */
BaseTag;
// @ts-ignore
const __VLS_79 = __VLS_asFunctionalComponent1(__VLS_78, new __VLS_78({
    ...{ 'onClose': {} },
    closable: true,
    type: "primary",
    text: "点击关闭",
}));
const __VLS_80 = __VLS_79({
    ...{ 'onClose': {} },
    closable: true,
    type: "primary",
    text: "点击关闭",
}, ...__VLS_functionalComponentArgsRest(__VLS_79));
let __VLS_83;
const __VLS_84 = {
    ...{ close: {} },
    onClose: (...[$event]) => {
        __VLS_ctx.handleClose('primary');
        // @ts-ignore
        [handleClose,];
    },
};
var __VLS_81;
var __VLS_82;
let __VLS_85;
/** @ts-ignore @type { | typeof __VLS_components.BaseTag} */
BaseTag;
// @ts-ignore
const __VLS_86 = __VLS_asFunctionalComponent1(__VLS_85, new __VLS_85({
    ...{ 'onClose': {} },
    closable: true,
    type: "success",
    text: "操作完成",
}));
const __VLS_87 = __VLS_86({
    ...{ 'onClose': {} },
    closable: true,
    type: "success",
    text: "操作完成",
}, ...__VLS_functionalComponentArgsRest(__VLS_86));
let __VLS_90;
const __VLS_91 = {
    ...{ close: {} },
    onClose: (...[$event]) => {
        __VLS_ctx.handleClose('success');
        // @ts-ignore
        [handleClose,];
    },
};
var __VLS_88;
var __VLS_89;
let __VLS_92;
/** @ts-ignore @type { | typeof __VLS_components.BaseTag} */
BaseTag;
// @ts-ignore
const __VLS_93 = __VLS_asFunctionalComponent1(__VLS_92, new __VLS_92({
    ...{ 'onClose': {} },
    closable: true,
    type: "warning",
    text: "待处理",
}));
const __VLS_94 = __VLS_93({
    ...{ 'onClose': {} },
    closable: true,
    type: "warning",
    text: "待处理",
}, ...__VLS_functionalComponentArgsRest(__VLS_93));
let __VLS_97;
const __VLS_98 = {
    ...{ close: {} },
    onClose: (...[$event]) => {
        __VLS_ctx.handleClose('warning');
        // @ts-ignore
        [handleClose,];
    },
};
var __VLS_95;
var __VLS_96;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "demo-group" },
});
/** @type {__VLS_StyleScopedClasses['demo-group']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "demo-label" },
});
/** @type {__VLS_StyleScopedClasses['demo-label']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "demo-tags" },
});
/** @type {__VLS_StyleScopedClasses['demo-tags']} */ ;
let __VLS_99;
/** @ts-ignore @type { | typeof __VLS_components.BaseTag | typeof __VLS_components.BaseTag} */
BaseTag;
// @ts-ignore
const __VLS_100 = __VLS_asFunctionalComponent1(__VLS_99, new __VLS_99({
    type: "primary",
}));
const __VLS_101 = __VLS_100({
    type: "primary",
}, ...__VLS_functionalComponentArgsRest(__VLS_100));
const { default: __VLS_104 } = __VLS_102.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "tag-content-with-icon" },
});
/** @type {__VLS_StyleScopedClasses['tag-content-with-icon']} */ ;
let __VLS_105;
/** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
elIcon;
// @ts-ignore
const __VLS_106 = __VLS_asFunctionalComponent1(__VLS_105, new __VLS_105({}));
const __VLS_107 = __VLS_106({}, ...__VLS_functionalComponentArgsRest(__VLS_106));
const { default: __VLS_110 } = __VLS_108.slots;
const __VLS_111 = (__VLS_ctx.menuStore.iconComponents['HOutline:SparklesIcon']);
// @ts-ignore
const __VLS_112 = __VLS_asFunctionalComponent1(__VLS_111, new __VLS_111({}));
const __VLS_113 = __VLS_112({}, ...__VLS_functionalComponentArgsRest(__VLS_112));
// @ts-ignore
[menuStore,];
var __VLS_108;
// @ts-ignore
[];
var __VLS_102;
let __VLS_116;
/** @ts-ignore @type { | typeof __VLS_components.BaseTag | typeof __VLS_components.BaseTag} */
BaseTag;
// @ts-ignore
const __VLS_117 = __VLS_asFunctionalComponent1(__VLS_116, new __VLS_116({
    type: "success",
}));
const __VLS_118 = __VLS_117({
    type: "success",
}, ...__VLS_functionalComponentArgsRest(__VLS_117));
const { default: __VLS_121 } = __VLS_119.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "tag-content-with-icon" },
});
/** @type {__VLS_StyleScopedClasses['tag-content-with-icon']} */ ;
let __VLS_122;
/** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
elIcon;
// @ts-ignore
const __VLS_123 = __VLS_asFunctionalComponent1(__VLS_122, new __VLS_122({}));
const __VLS_124 = __VLS_123({}, ...__VLS_functionalComponentArgsRest(__VLS_123));
const { default: __VLS_127 } = __VLS_125.slots;
const __VLS_128 = (__VLS_ctx.menuStore.iconComponents['HOutline:CheckBadgeIcon']);
// @ts-ignore
const __VLS_129 = __VLS_asFunctionalComponent1(__VLS_128, new __VLS_128({}));
const __VLS_130 = __VLS_129({}, ...__VLS_functionalComponentArgsRest(__VLS_129));
// @ts-ignore
[menuStore,];
var __VLS_125;
// @ts-ignore
[];
var __VLS_119;
let __VLS_133;
/** @ts-ignore @type { | typeof __VLS_components.BaseTag | typeof __VLS_components.BaseTag} */
BaseTag;
// @ts-ignore
const __VLS_134 = __VLS_asFunctionalComponent1(__VLS_133, new __VLS_133({
    type: "danger",
}));
const __VLS_135 = __VLS_134({
    type: "danger",
}, ...__VLS_functionalComponentArgsRest(__VLS_134));
const { default: __VLS_138 } = __VLS_136.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "tag-content-with-icon" },
});
/** @type {__VLS_StyleScopedClasses['tag-content-with-icon']} */ ;
let __VLS_139;
/** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
elIcon;
// @ts-ignore
const __VLS_140 = __VLS_asFunctionalComponent1(__VLS_139, new __VLS_139({}));
const __VLS_141 = __VLS_140({}, ...__VLS_functionalComponentArgsRest(__VLS_140));
const { default: __VLS_144 } = __VLS_142.slots;
const __VLS_145 = (__VLS_ctx.menuStore.iconComponents['HOutline:ExclamationCircleIcon']);
// @ts-ignore
const __VLS_146 = __VLS_asFunctionalComponent1(__VLS_145, new __VLS_145({}));
const __VLS_147 = __VLS_146({}, ...__VLS_functionalComponentArgsRest(__VLS_146));
// @ts-ignore
[menuStore,];
var __VLS_142;
// @ts-ignore
[];
var __VLS_136;
let __VLS_150;
/** @ts-ignore @type { | typeof __VLS_components.elDivider | typeof __VLS_components.ElDivider | typeof __VLS_components['el-divider']} */
elDivider;
// @ts-ignore
const __VLS_151 = __VLS_asFunctionalComponent1(__VLS_150, new __VLS_150({}));
const __VLS_152 = __VLS_151({}, ...__VLS_functionalComponentArgsRest(__VLS_151));
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "usage-section" },
});
/** @type {__VLS_StyleScopedClasses['usage-section']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "section-title" },
});
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "usage-info" },
});
/** @type {__VLS_StyleScopedClasses['usage-info']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "usage-item" },
});
/** @type {__VLS_StyleScopedClasses['usage-item']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.h4, __VLS_intrinsics.h4)({
    ...{ class: "usage-title" },
});
/** @type {__VLS_StyleScopedClasses['usage-title']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "usage-code" },
});
/** @type {__VLS_StyleScopedClasses['usage-code']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.pre, __VLS_intrinsics.pre)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.code, __VLS_intrinsics.code)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "usage-item" },
});
/** @type {__VLS_StyleScopedClasses['usage-item']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.h4, __VLS_intrinsics.h4)({
    ...{ class: "usage-title" },
});
/** @type {__VLS_StyleScopedClasses['usage-title']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "usage-code" },
});
/** @type {__VLS_StyleScopedClasses['usage-code']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.pre, __VLS_intrinsics.pre)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.code, __VLS_intrinsics.code)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "usage-item" },
});
/** @type {__VLS_StyleScopedClasses['usage-item']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.h4, __VLS_intrinsics.h4)({
    ...{ class: "usage-title" },
});
/** @type {__VLS_StyleScopedClasses['usage-title']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "usage-code" },
});
/** @type {__VLS_StyleScopedClasses['usage-code']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.pre, __VLS_intrinsics.pre)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.code, __VLS_intrinsics.code)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "usage-item" },
});
/** @type {__VLS_StyleScopedClasses['usage-item']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.h4, __VLS_intrinsics.h4)({
    ...{ class: "usage-title" },
});
/** @type {__VLS_StyleScopedClasses['usage-title']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "usage-code" },
});
/** @type {__VLS_StyleScopedClasses['usage-code']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.pre, __VLS_intrinsics.pre)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.code, __VLS_intrinsics.code)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
    ...{ class: "usage-description" },
});
/** @type {__VLS_StyleScopedClasses['usage-description']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.code, __VLS_intrinsics.code)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.code, __VLS_intrinsics.code)({});
let __VLS_155;
/** @ts-ignore @type { | typeof __VLS_components.elDivider | typeof __VLS_components.ElDivider | typeof __VLS_components['el-divider']} */
elDivider;
// @ts-ignore
const __VLS_156 = __VLS_asFunctionalComponent1(__VLS_155, new __VLS_155({}));
const __VLS_157 = __VLS_156({}, ...__VLS_functionalComponentArgsRest(__VLS_156));
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "usage-section" },
});
/** @type {__VLS_StyleScopedClasses['usage-section']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "section-title" },
});
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "usage-info" },
});
/** @type {__VLS_StyleScopedClasses['usage-info']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "usage-item" },
});
/** @type {__VLS_StyleScopedClasses['usage-item']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
    ...{ class: "usage-description" },
});
/** @type {__VLS_StyleScopedClasses['usage-description']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.code, __VLS_intrinsics.code)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.code, __VLS_intrinsics.code)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.code, __VLS_intrinsics.code)({});
let __VLS_160;
/** @ts-ignore @type { | typeof __VLS_components.elLink | typeof __VLS_components.ElLink | typeof __VLS_components['el-link'] | typeof __VLS_components.elLink | typeof __VLS_components.ElLink | typeof __VLS_components['el-link']} */
elLink;
// @ts-ignore
const __VLS_161 = __VLS_asFunctionalComponent1(__VLS_160, new __VLS_160({
    href: "https://element-plus.org/zh-CN/component/tag",
    target: "_blank",
    type: "primary",
    underline: (false),
}));
const __VLS_162 = __VLS_161({
    href: "https://element-plus.org/zh-CN/component/tag",
    target: "_blank",
    type: "primary",
    underline: (false),
}, ...__VLS_functionalComponentArgsRest(__VLS_161));
const { default: __VLS_165 } = __VLS_163.slots;
// @ts-ignore
[];
var __VLS_163;
__VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
    ...{ class: "usage-description" },
});
/** @type {__VLS_StyleScopedClasses['usage-description']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "comparison-table" },
});
/** @type {__VLS_StyleScopedClasses['comparison-table']} */ ;
let __VLS_166;
/** @ts-ignore @type { | typeof __VLS_components.elTable | typeof __VLS_components.ElTable | typeof __VLS_components['el-table'] | typeof __VLS_components.elTable | typeof __VLS_components.ElTable | typeof __VLS_components['el-table']} */
elTable;
// @ts-ignore
const __VLS_167 = __VLS_asFunctionalComponent1(__VLS_166, new __VLS_166({
    data: (__VLS_ctx.tagPropsTableData),
    border: true,
    ...{ style: {} },
}));
const __VLS_168 = __VLS_167({
    data: (__VLS_ctx.tagPropsTableData),
    border: true,
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_167));
const { default: __VLS_171 } = __VLS_169.slots;
let __VLS_172;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_173 = __VLS_asFunctionalComponent1(__VLS_172, new __VLS_172({
    prop: "name",
    label: "属性名",
    width: "160",
}));
const __VLS_174 = __VLS_173({
    prop: "name",
    label: "属性名",
    width: "160",
}, ...__VLS_functionalComponentArgsRest(__VLS_173));
const { default: __VLS_177 } = __VLS_175.slots;
{
    const { default: __VLS_178 } = __VLS_175.slots;
    const [{ row }] = __VLS_vSlot(__VLS_178);
    __VLS_asFunctionalElement1(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({});
    (row.name);
    // @ts-ignore
    [tagPropsTableData,];
}
// @ts-ignore
[];
var __VLS_175;
let __VLS_179;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_180 = __VLS_asFunctionalComponent1(__VLS_179, new __VLS_179({
    prop: "type",
    label: "类型",
    width: "220",
}));
const __VLS_181 = __VLS_180({
    prop: "type",
    label: "类型",
    width: "220",
}, ...__VLS_functionalComponentArgsRest(__VLS_180));
const { default: __VLS_184 } = __VLS_182.slots;
{
    const { default: __VLS_185 } = __VLS_182.slots;
    const [{ row }] = __VLS_vSlot(__VLS_185);
    __VLS_asFunctionalElement1(__VLS_intrinsics.code, __VLS_intrinsics.code)({});
    (row.type);
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_182;
let __VLS_186;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_187 = __VLS_asFunctionalComponent1(__VLS_186, new __VLS_186({
    prop: "default",
    label: "默认值",
    width: "140",
}));
const __VLS_188 = __VLS_187({
    prop: "default",
    label: "默认值",
    width: "140",
}, ...__VLS_functionalComponentArgsRest(__VLS_187));
const { default: __VLS_191 } = __VLS_189.slots;
{
    const { default: __VLS_192 } = __VLS_189.slots;
    const [{ row }] = __VLS_vSlot(__VLS_192);
    __VLS_asFunctionalElement1(__VLS_intrinsics.code, __VLS_intrinsics.code)({});
    (row.default);
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_189;
let __VLS_193;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_194 = __VLS_asFunctionalComponent1(__VLS_193, new __VLS_193({
    prop: "description",
    label: "说明",
    minWidth: "260",
}));
const __VLS_195 = __VLS_194({
    prop: "description",
    label: "说明",
    minWidth: "260",
}, ...__VLS_functionalComponentArgsRest(__VLS_194));
// @ts-ignore
[];
var __VLS_169;
let __VLS_198;
/** @ts-ignore @type { | typeof __VLS_components.elDivider | typeof __VLS_components.ElDivider | typeof __VLS_components['el-divider']} */
elDivider;
// @ts-ignore
const __VLS_199 = __VLS_asFunctionalComponent1(__VLS_198, new __VLS_198({}));
const __VLS_200 = __VLS_199({}, ...__VLS_functionalComponentArgsRest(__VLS_199));
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "usage-section" },
});
/** @type {__VLS_StyleScopedClasses['usage-section']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "section-title" },
});
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "usage-info" },
});
/** @type {__VLS_StyleScopedClasses['usage-info']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "comparison-table" },
});
/** @type {__VLS_StyleScopedClasses['comparison-table']} */ ;
let __VLS_203;
/** @ts-ignore @type { | typeof __VLS_components.elTable | typeof __VLS_components.ElTable | typeof __VLS_components['el-table'] | typeof __VLS_components.elTable | typeof __VLS_components.ElTable | typeof __VLS_components['el-table']} */
elTable;
// @ts-ignore
const __VLS_204 = __VLS_asFunctionalComponent1(__VLS_203, new __VLS_203({
    data: (__VLS_ctx.tagEventsTableData),
    border: true,
    ...{ style: {} },
}));
const __VLS_205 = __VLS_204({
    data: (__VLS_ctx.tagEventsTableData),
    border: true,
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_204));
const { default: __VLS_208 } = __VLS_206.slots;
let __VLS_209;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_210 = __VLS_asFunctionalComponent1(__VLS_209, new __VLS_209({
    prop: "name",
    label: "事件名",
    width: "180",
}));
const __VLS_211 = __VLS_210({
    prop: "name",
    label: "事件名",
    width: "180",
}, ...__VLS_functionalComponentArgsRest(__VLS_210));
const { default: __VLS_214 } = __VLS_212.slots;
{
    const { default: __VLS_215 } = __VLS_212.slots;
    const [{ row }] = __VLS_vSlot(__VLS_215);
    __VLS_asFunctionalElement1(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({});
    (row.name);
    // @ts-ignore
    [tagEventsTableData,];
}
// @ts-ignore
[];
var __VLS_212;
let __VLS_216;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_217 = __VLS_asFunctionalComponent1(__VLS_216, new __VLS_216({
    prop: "params",
    label: "回调参数",
    width: "200",
}));
const __VLS_218 = __VLS_217({
    prop: "params",
    label: "回调参数",
    width: "200",
}, ...__VLS_functionalComponentArgsRest(__VLS_217));
const { default: __VLS_221 } = __VLS_219.slots;
{
    const { default: __VLS_222 } = __VLS_219.slots;
    const [{ row }] = __VLS_vSlot(__VLS_222);
    __VLS_asFunctionalElement1(__VLS_intrinsics.code, __VLS_intrinsics.code)({});
    (row.params);
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_219;
let __VLS_223;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_224 = __VLS_asFunctionalComponent1(__VLS_223, new __VLS_223({
    prop: "description",
    label: "说明",
    minWidth: "320",
}));
const __VLS_225 = __VLS_224({
    prop: "description",
    label: "说明",
    minWidth: "320",
}, ...__VLS_functionalComponentArgsRest(__VLS_224));
// @ts-ignore
[];
var __VLS_206;
// @ts-ignore
[];
var __VLS_3;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
