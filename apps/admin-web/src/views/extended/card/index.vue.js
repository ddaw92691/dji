/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
defineOptions({ name: 'CardView' });
const cardPropsTableData = [
    {
        name: 'title',
        type: 'string',
        default: "''",
        description: '卡片标题；当未使用 header 插槽时，会展示默认头部标题',
    },
    {
        name: 'titleIcon',
        type: 'string | Component',
        default: '-',
        description: '标题图标；支持传入图标名称字符串，或直接传入图标组件',
    },
    {
        name: 'titleIconSize',
        type: 'string | number',
        default: '20',
        description: '标题图标尺寸，会透传给 el-icon 的 size 属性',
    },
    {
        name: 'shadow',
        type: "'never' | 'always' | 'hover'",
        default: "'never'",
        description: '卡片阴影显示时机，继承自 el-card',
    },
    {
        name: 'bordered',
        type: 'boolean',
        default: 'false',
        description: '是否显示卡片边框，默认不显示',
    },
    {
        name: 'borderRadius',
        type: 'string',
        default: "'1rem'",
        description: '自定义卡片圆角，例如 12px、0.75rem、var(--card-radius)',
    },
];
const cardSlotsTableData = [
    {
        name: 'default',
        description: '卡片主体内容区域',
    },
    {
        name: 'header',
        description: '自定义整个头部区域；使用后会覆盖默认的标题 + 图标 + header-right 布局',
    },
    {
        name: 'header-right',
        description: '默认头部右侧操作区，适合放操作按钮、状态信息、筛选器等内容',
    },
    {
        name: 'footer',
        description: '卡片底部区域，适合放表单按钮、补充说明或统计信息',
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
    ...{ class: "card-doc-container" },
});
/** @type {__VLS_StyleScopedClasses['card-doc-container']} */ ;
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
    __VLS_asFunctionalElement1(__VLS_intrinsics.code, __VLS_intrinsics.code)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.code, __VLS_intrinsics.code)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.code, __VLS_intrinsics.code)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        ...{ class: "description-text" },
    });
    /** @type {__VLS_StyleScopedClasses['description-text']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.code, __VLS_intrinsics.code)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.code, __VLS_intrinsics.code)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.code, __VLS_intrinsics.code)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.code, __VLS_intrinsics.code)({});
    let __VLS_7;
    /** @ts-ignore @type { | typeof __VLS_components.elLink | typeof __VLS_components.ElLink | typeof __VLS_components['el-link'] | typeof __VLS_components.elLink | typeof __VLS_components.ElLink | typeof __VLS_components['el-link']} */
    elLink;
    // @ts-ignore
    const __VLS_8 = __VLS_asFunctionalComponent1(__VLS_7, new __VLS_7({
        href: "https://github.com/DFANNN/DFAN-Admin/blob/main/src/components/card/BaseCard.vue",
        target: "_blank",
        type: "primary",
        underline: (false),
    }));
    const __VLS_9 = __VLS_8({
        href: "https://github.com/DFANNN/DFAN-Admin/blob/main/src/components/card/BaseCard.vue",
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
    ...{ class: "preview-showcase" },
});
/** @type {__VLS_StyleScopedClasses['preview-showcase']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "preview-grid" },
});
/** @type {__VLS_StyleScopedClasses['preview-grid']} */ ;
let __VLS_13;
/** @ts-ignore @type { | typeof __VLS_components.BaseCard | typeof __VLS_components.BaseCard} */
BaseCard;
// @ts-ignore
const __VLS_14 = __VLS_asFunctionalComponent1(__VLS_13, new __VLS_13({
    title: "基础卡片",
    titleIcon: "HOutline:RectangleGroupIcon",
}));
const __VLS_15 = __VLS_14({
    title: "基础卡片",
    titleIcon: "HOutline:RectangleGroupIcon",
}, ...__VLS_functionalComponentArgsRest(__VLS_14));
const { default: __VLS_18 } = __VLS_16.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "demo-content" },
});
/** @type {__VLS_StyleScopedClasses['demo-content']} */ ;
var __VLS_16;
let __VLS_19;
/** @ts-ignore @type { | typeof __VLS_components.BaseCard | typeof __VLS_components.BaseCard} */
BaseCard;
// @ts-ignore
const __VLS_20 = __VLS_asFunctionalComponent1(__VLS_19, new __VLS_19({
    title: "带边框卡片",
    titleIcon: "HOutline:Square2StackIcon",
    bordered: true,
}));
const __VLS_21 = __VLS_20({
    title: "带边框卡片",
    titleIcon: "HOutline:Square2StackIcon",
    bordered: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_20));
const { default: __VLS_24 } = __VLS_22.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "demo-content" },
});
/** @type {__VLS_StyleScopedClasses['demo-content']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.code, __VLS_intrinsics.code)({});
var __VLS_22;
let __VLS_25;
/** @ts-ignore @type { | typeof __VLS_components.BaseCard | typeof __VLS_components.BaseCard} */
BaseCard;
// @ts-ignore
const __VLS_26 = __VLS_asFunctionalComponent1(__VLS_25, new __VLS_25({
    title: "带操作区卡片",
    titleIcon: "HOutline:AdjustmentsHorizontalIcon",
    shadow: "hover",
}));
const __VLS_27 = __VLS_26({
    title: "带操作区卡片",
    titleIcon: "HOutline:AdjustmentsHorizontalIcon",
    shadow: "hover",
}, ...__VLS_functionalComponentArgsRest(__VLS_26));
const { default: __VLS_30 } = __VLS_28.slots;
{
    const { 'header-right': __VLS_31 } = __VLS_28.slots;
    let __VLS_32;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_33 = __VLS_asFunctionalComponent1(__VLS_32, new __VLS_32({
        type: "primary",
        link: true,
    }));
    const __VLS_34 = __VLS_33({
        type: "primary",
        link: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_33));
    const { default: __VLS_37 } = __VLS_35.slots;
    var __VLS_35;
    let __VLS_38;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_39 = __VLS_asFunctionalComponent1(__VLS_38, new __VLS_38({
        type: "danger",
        link: true,
    }));
    const __VLS_40 = __VLS_39({
        type: "danger",
        link: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_39));
    const { default: __VLS_43 } = __VLS_41.slots;
    var __VLS_41;
}
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "demo-content" },
});
/** @type {__VLS_StyleScopedClasses['demo-content']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.code, __VLS_intrinsics.code)({});
var __VLS_28;
let __VLS_44;
/** @ts-ignore @type { | typeof __VLS_components.BaseCard | typeof __VLS_components.BaseCard} */
BaseCard;
// @ts-ignore
const __VLS_45 = __VLS_asFunctionalComponent1(__VLS_44, new __VLS_44({
    title: "自定义圆角",
    borderRadius: "0.5rem",
    titleIcon: "HOutline:SparklesIcon",
}));
const __VLS_46 = __VLS_45({
    title: "自定义圆角",
    borderRadius: "0.5rem",
    titleIcon: "HOutline:SparklesIcon",
}, ...__VLS_functionalComponentArgsRest(__VLS_45));
const { default: __VLS_49 } = __VLS_47.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "demo-content" },
});
/** @type {__VLS_StyleScopedClasses['demo-content']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.code, __VLS_intrinsics.code)({});
var __VLS_47;
let __VLS_50;
/** @ts-ignore @type { | typeof __VLS_components.BaseCard | typeof __VLS_components.BaseCard} */
BaseCard;
// @ts-ignore
const __VLS_51 = __VLS_asFunctionalComponent1(__VLS_50, new __VLS_50({
    title: "带页脚卡片",
    titleIcon: "HOutline:DocumentTextIcon",
}));
const __VLS_52 = __VLS_51({
    title: "带页脚卡片",
    titleIcon: "HOutline:DocumentTextIcon",
}, ...__VLS_functionalComponentArgsRest(__VLS_51));
const { default: __VLS_55 } = __VLS_53.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "demo-content" },
});
/** @type {__VLS_StyleScopedClasses['demo-content']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.code, __VLS_intrinsics.code)({});
{
    const { footer: __VLS_56 } = __VLS_53.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "footer-actions" },
    });
    /** @type {__VLS_StyleScopedClasses['footer-actions']} */ ;
    let __VLS_57;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_58 = __VLS_asFunctionalComponent1(__VLS_57, new __VLS_57({}));
    const __VLS_59 = __VLS_58({}, ...__VLS_functionalComponentArgsRest(__VLS_58));
    const { default: __VLS_62 } = __VLS_60.slots;
    var __VLS_60;
    let __VLS_63;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_64 = __VLS_asFunctionalComponent1(__VLS_63, new __VLS_63({
        type: "primary",
    }));
    const __VLS_65 = __VLS_64({
        type: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_64));
    const { default: __VLS_68 } = __VLS_66.slots;
    var __VLS_66;
}
var __VLS_53;
let __VLS_69;
/** @ts-ignore @type { | typeof __VLS_components.elDivider | typeof __VLS_components.ElDivider | typeof __VLS_components['el-divider']} */
elDivider;
// @ts-ignore
const __VLS_70 = __VLS_asFunctionalComponent1(__VLS_69, new __VLS_69({}));
const __VLS_71 = __VLS_70({}, ...__VLS_functionalComponentArgsRest(__VLS_70));
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
let __VLS_74;
/** @ts-ignore @type { | typeof __VLS_components.elDivider | typeof __VLS_components.ElDivider | typeof __VLS_components['el-divider']} */
elDivider;
// @ts-ignore
const __VLS_75 = __VLS_asFunctionalComponent1(__VLS_74, new __VLS_74({}));
const __VLS_76 = __VLS_75({}, ...__VLS_functionalComponentArgsRest(__VLS_75));
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
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "comparison-table" },
});
/** @type {__VLS_StyleScopedClasses['comparison-table']} */ ;
let __VLS_79;
/** @ts-ignore @type { | typeof __VLS_components.elTable | typeof __VLS_components.ElTable | typeof __VLS_components['el-table'] | typeof __VLS_components.elTable | typeof __VLS_components.ElTable | typeof __VLS_components['el-table']} */
elTable;
// @ts-ignore
const __VLS_80 = __VLS_asFunctionalComponent1(__VLS_79, new __VLS_79({
    data: (__VLS_ctx.cardPropsTableData),
    border: true,
    ...{ style: {} },
}));
const __VLS_81 = __VLS_80({
    data: (__VLS_ctx.cardPropsTableData),
    border: true,
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_80));
const { default: __VLS_84 } = __VLS_82.slots;
let __VLS_85;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_86 = __VLS_asFunctionalComponent1(__VLS_85, new __VLS_85({
    prop: "name",
    label: "属性名",
    width: "160",
}));
const __VLS_87 = __VLS_86({
    prop: "name",
    label: "属性名",
    width: "160",
}, ...__VLS_functionalComponentArgsRest(__VLS_86));
const { default: __VLS_90 } = __VLS_88.slots;
{
    const { default: __VLS_91 } = __VLS_88.slots;
    const [{ row }] = __VLS_vSlot(__VLS_91);
    __VLS_asFunctionalElement1(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({});
    (row.name);
    // @ts-ignore
    [cardPropsTableData,];
}
// @ts-ignore
[];
var __VLS_88;
let __VLS_92;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_93 = __VLS_asFunctionalComponent1(__VLS_92, new __VLS_92({
    prop: "type",
    label: "类型",
    width: "220",
}));
const __VLS_94 = __VLS_93({
    prop: "type",
    label: "类型",
    width: "220",
}, ...__VLS_functionalComponentArgsRest(__VLS_93));
const { default: __VLS_97 } = __VLS_95.slots;
{
    const { default: __VLS_98 } = __VLS_95.slots;
    const [{ row }] = __VLS_vSlot(__VLS_98);
    __VLS_asFunctionalElement1(__VLS_intrinsics.code, __VLS_intrinsics.code)({});
    (row.type);
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_95;
let __VLS_99;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_100 = __VLS_asFunctionalComponent1(__VLS_99, new __VLS_99({
    prop: "default",
    label: "默认值",
    width: "140",
}));
const __VLS_101 = __VLS_100({
    prop: "default",
    label: "默认值",
    width: "140",
}, ...__VLS_functionalComponentArgsRest(__VLS_100));
const { default: __VLS_104 } = __VLS_102.slots;
{
    const { default: __VLS_105 } = __VLS_102.slots;
    const [{ row }] = __VLS_vSlot(__VLS_105);
    __VLS_asFunctionalElement1(__VLS_intrinsics.code, __VLS_intrinsics.code)({});
    (row.default);
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_102;
let __VLS_106;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_107 = __VLS_asFunctionalComponent1(__VLS_106, new __VLS_106({
    prop: "description",
    label: "说明",
    minWidth: "280",
}));
const __VLS_108 = __VLS_107({
    prop: "description",
    label: "说明",
    minWidth: "280",
}, ...__VLS_functionalComponentArgsRest(__VLS_107));
// @ts-ignore
[];
var __VLS_82;
let __VLS_111;
/** @ts-ignore @type { | typeof __VLS_components.elDivider | typeof __VLS_components.ElDivider | typeof __VLS_components['el-divider']} */
elDivider;
// @ts-ignore
const __VLS_112 = __VLS_asFunctionalComponent1(__VLS_111, new __VLS_111({}));
const __VLS_113 = __VLS_112({}, ...__VLS_functionalComponentArgsRest(__VLS_112));
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
let __VLS_116;
/** @ts-ignore @type { | typeof __VLS_components.elTable | typeof __VLS_components.ElTable | typeof __VLS_components['el-table'] | typeof __VLS_components.elTable | typeof __VLS_components.ElTable | typeof __VLS_components['el-table']} */
elTable;
// @ts-ignore
const __VLS_117 = __VLS_asFunctionalComponent1(__VLS_116, new __VLS_116({
    data: (__VLS_ctx.cardSlotsTableData),
    border: true,
    ...{ style: {} },
}));
const __VLS_118 = __VLS_117({
    data: (__VLS_ctx.cardSlotsTableData),
    border: true,
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_117));
const { default: __VLS_121 } = __VLS_119.slots;
let __VLS_122;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_123 = __VLS_asFunctionalComponent1(__VLS_122, new __VLS_122({
    prop: "name",
    label: "插槽名",
    width: "180",
}));
const __VLS_124 = __VLS_123({
    prop: "name",
    label: "插槽名",
    width: "180",
}, ...__VLS_functionalComponentArgsRest(__VLS_123));
const { default: __VLS_127 } = __VLS_125.slots;
{
    const { default: __VLS_128 } = __VLS_125.slots;
    const [{ row }] = __VLS_vSlot(__VLS_128);
    __VLS_asFunctionalElement1(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({});
    (row.name);
    // @ts-ignore
    [cardSlotsTableData,];
}
// @ts-ignore
[];
var __VLS_125;
let __VLS_129;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_130 = __VLS_asFunctionalComponent1(__VLS_129, new __VLS_129({
    prop: "description",
    label: "说明",
    minWidth: "400",
}));
const __VLS_131 = __VLS_130({
    prop: "description",
    label: "说明",
    minWidth: "400",
}, ...__VLS_functionalComponentArgsRest(__VLS_130));
// @ts-ignore
[];
var __VLS_119;
// @ts-ignore
[];
var __VLS_3;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
