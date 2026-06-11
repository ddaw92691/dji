/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ElMessage } from 'element-plus';
defineOptions({ name: 'ButtonView' });
const menuStore = useMenuStore();
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
// IconButton loading 状态
const refreshLoading = ref(false);
const downloadLoading = ref(false);
const deleteLoading = ref(false);
const customLoading = ref(false);
// IconButton 事件处理
const handleClick = async (type) => {
    await delay(600);
    ElMessage.success(`${type} 操作完成`);
};
const handleRefresh = async () => {
    refreshLoading.value = true;
    try {
        await delay(2000);
        ElMessage.success('刷新完成');
    }
    finally {
        refreshLoading.value = false;
    }
};
const handleDownload = async () => {
    downloadLoading.value = true;
    try {
        await delay(2000);
        ElMessage.success('下载完成');
    }
    finally {
        downloadLoading.value = false;
    }
};
const handleDelete = async () => {
    deleteLoading.value = true;
    try {
        await delay(2000);
        ElMessage.success('删除完成');
    }
    finally {
        deleteLoading.value = false;
    }
};
const handleCustom = async () => {
    customLoading.value = true;
    try {
        await delay(2000);
        ElMessage.success('自定义操作完成');
    }
    finally {
        customLoading.value = false;
    }
};
// LoadingButton 事件处理
const handleAsyncClick = async () => {
    await delay(2000);
    ElMessage.success('异步操作完成');
};
const handleQuickClick = async () => {
    await delay(500);
    ElMessage.success('快速操作完成');
};
// IconButton 组件属性表格数据
const iconButtonPropsTableData = [
    {
        name: 'icon',
        type: 'string | Component',
        default: '-',
        description: '图标：可以是字符串（从 iconComponents 中获取）或直接传入图标组件（必需）',
    },
    {
        name: 'tooltip',
        type: 'string',
        default: '-',
        description: 'Tooltip 提示内容（可选，不传则不显示 tooltip）',
    },
    {
        name: 'placement',
        type: "'top' | 'bottom' | 'left' | 'right'",
        default: "'bottom'",
        description: 'Tooltip 位置',
    },
    {
        name: 'effect',
        type: "'dark' | 'light'",
        default: "'dark'",
        description: 'Tooltip 主题',
    },
    {
        name: 'showAfter',
        type: 'number',
        default: '200',
        description: 'Tooltip 显示延迟时间（毫秒）',
    },
    {
        name: 'size',
        type: 'string',
        default: "'2rem'",
        description: '按钮尺寸（默认：2rem / 32px）',
    },
    {
        name: 'iconSize',
        type: 'string',
        default: "'1.25rem'",
        description: '图标尺寸（默认：1.25rem）',
    },
    {
        name: 'disabled',
        type: 'boolean',
        default: 'false',
        description: '是否禁用',
    },
    {
        name: 'type',
        type: "'default' | 'primary' | 'success' | 'warning' | 'danger'",
        default: "'default'",
        description: '按钮类型',
    },
    {
        name: 'loading',
        type: 'boolean',
        default: 'false',
        description: '是否加载中',
    },
    {
        name: 'loadingIcon',
        type: 'string | Component',
        default: "'HOutline:ArrowPathIcon'",
        description: '加载图标（可选，默认使用 ArrowPathIcon）',
    },
];
// LoadingButton 组件属性表格数据
const loadingButtonPropsTableData = [
    {
        name: 'loadingDelay',
        type: 'number',
        default: '0',
        description: '延迟显示 loading 的时间（毫秒）。如果异步操作在延迟时间内完成，则不显示 loading。这可以避免快速操作时出现闪烁的 loading 状态',
    },
];
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "button-doc-container" },
});
/** @type {__VLS_StyleScopedClasses['button-doc-container']} */ ;
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
    __VLS_asFunctionalElement1(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        ...{ class: "description-text" },
    });
    /** @type {__VLS_StyleScopedClasses['description-text']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        ...{ class: "description-text" },
    });
    /** @type {__VLS_StyleScopedClasses['description-text']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.code, __VLS_intrinsics.code)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.code, __VLS_intrinsics.code)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.code, __VLS_intrinsics.code)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.code, __VLS_intrinsics.code)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.code, __VLS_intrinsics.code)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.code, __VLS_intrinsics.code)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.code, __VLS_intrinsics.code)({});
    let __VLS_7;
    /** @ts-ignore @type { | typeof __VLS_components.elLink | typeof __VLS_components.ElLink | typeof __VLS_components['el-link'] | typeof __VLS_components.elLink | typeof __VLS_components.ElLink | typeof __VLS_components['el-link']} */
    elLink;
    // @ts-ignore
    const __VLS_8 = __VLS_asFunctionalComponent1(__VLS_7, new __VLS_7({
        href: "https://github.com/DFANNN/DFAN-Admin/blob/main/src/components/button/IconButton.vue",
        target: "_blank",
        type: "primary",
        underline: (false),
    }));
    const __VLS_9 = __VLS_8({
        href: "https://github.com/DFANNN/DFAN-Admin/blob/main/src/components/button/IconButton.vue",
        target: "_blank",
        type: "primary",
        underline: (false),
    }, ...__VLS_functionalComponentArgsRest(__VLS_8));
    const { default: __VLS_12 } = __VLS_10.slots;
    var __VLS_10;
    let __VLS_13;
    /** @ts-ignore @type { | typeof __VLS_components.elLink | typeof __VLS_components.ElLink | typeof __VLS_components['el-link'] | typeof __VLS_components.elLink | typeof __VLS_components.ElLink | typeof __VLS_components['el-link']} */
    elLink;
    // @ts-ignore
    const __VLS_14 = __VLS_asFunctionalComponent1(__VLS_13, new __VLS_13({
        href: "https://github.com/DFANNN/DFAN-Admin/blob/main/src/components/button/LoadingButton.vue",
        target: "_blank",
        type: "primary",
        underline: (false),
    }));
    const __VLS_15 = __VLS_14({
        href: "https://github.com/DFANNN/DFAN-Admin/blob/main/src/components/button/LoadingButton.vue",
        target: "_blank",
        type: "primary",
        underline: (false),
    }, ...__VLS_functionalComponentArgsRest(__VLS_14));
    const { default: __VLS_18 } = __VLS_16.slots;
    var __VLS_16;
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
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
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
    ...{ class: "demo-buttons" },
});
/** @type {__VLS_StyleScopedClasses['demo-buttons']} */ ;
let __VLS_19;
/** @ts-ignore @type { | typeof __VLS_components.IconButton} */
IconButton;
// @ts-ignore
const __VLS_20 = __VLS_asFunctionalComponent1(__VLS_19, new __VLS_19({
    icon: "HOutline:HandRaisedIcon",
    tooltip: "默认类型",
    type: "default",
}));
const __VLS_21 = __VLS_20({
    icon: "HOutline:HandRaisedIcon",
    tooltip: "默认类型",
    type: "default",
}, ...__VLS_functionalComponentArgsRest(__VLS_20));
let __VLS_24;
/** @ts-ignore @type { | typeof __VLS_components.IconButton} */
IconButton;
// @ts-ignore
const __VLS_25 = __VLS_asFunctionalComponent1(__VLS_24, new __VLS_24({
    icon: "HOutline:HandRaisedIcon",
    tooltip: "主要类型",
    type: "primary",
}));
const __VLS_26 = __VLS_25({
    icon: "HOutline:HandRaisedIcon",
    tooltip: "主要类型",
    type: "primary",
}, ...__VLS_functionalComponentArgsRest(__VLS_25));
let __VLS_29;
/** @ts-ignore @type { | typeof __VLS_components.IconButton} */
IconButton;
// @ts-ignore
const __VLS_30 = __VLS_asFunctionalComponent1(__VLS_29, new __VLS_29({
    icon: "HOutline:HandRaisedIcon",
    tooltip: "成功类型",
    type: "success",
}));
const __VLS_31 = __VLS_30({
    icon: "HOutline:HandRaisedIcon",
    tooltip: "成功类型",
    type: "success",
}, ...__VLS_functionalComponentArgsRest(__VLS_30));
let __VLS_34;
/** @ts-ignore @type { | typeof __VLS_components.IconButton} */
IconButton;
// @ts-ignore
const __VLS_35 = __VLS_asFunctionalComponent1(__VLS_34, new __VLS_34({
    icon: "HOutline:HandRaisedIcon",
    tooltip: "警告类型",
    type: "warning",
}));
const __VLS_36 = __VLS_35({
    icon: "HOutline:HandRaisedIcon",
    tooltip: "警告类型",
    type: "warning",
}, ...__VLS_functionalComponentArgsRest(__VLS_35));
let __VLS_39;
/** @ts-ignore @type { | typeof __VLS_components.IconButton} */
IconButton;
// @ts-ignore
const __VLS_40 = __VLS_asFunctionalComponent1(__VLS_39, new __VLS_39({
    icon: "HOutline:HandRaisedIcon",
    tooltip: "危险类型",
    type: "danger",
}));
const __VLS_41 = __VLS_40({
    icon: "HOutline:HandRaisedIcon",
    tooltip: "危险类型",
    type: "danger",
}, ...__VLS_functionalComponentArgsRest(__VLS_40));
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "demo-group" },
});
/** @type {__VLS_StyleScopedClasses['demo-group']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "demo-label" },
});
/** @type {__VLS_StyleScopedClasses['demo-label']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "demo-buttons" },
});
/** @type {__VLS_StyleScopedClasses['demo-buttons']} */ ;
let __VLS_44;
/** @ts-ignore @type { | typeof __VLS_components.IconButton} */
IconButton;
// @ts-ignore
const __VLS_45 = __VLS_asFunctionalComponent1(__VLS_44, new __VLS_44({
    ...{ 'onClick': {} },
    icon: "HOutline:ArrowPathIcon",
    tooltip: "刷新",
    type: "primary",
}));
const __VLS_46 = __VLS_45({
    ...{ 'onClick': {} },
    icon: "HOutline:ArrowPathIcon",
    tooltip: "刷新",
    type: "primary",
}, ...__VLS_functionalComponentArgsRest(__VLS_45));
let __VLS_49;
const __VLS_50 = {
    ...{ click: {} },
    onClick: (...[$event]) => {
        __VLS_ctx.handleClick('refresh');
        // @ts-ignore
        [handleClick,];
    },
};
var __VLS_47;
var __VLS_48;
let __VLS_51;
/** @ts-ignore @type { | typeof __VLS_components.IconButton} */
IconButton;
// @ts-ignore
const __VLS_52 = __VLS_asFunctionalComponent1(__VLS_51, new __VLS_51({
    ...{ 'onClick': {} },
    icon: "HOutline:TrashIcon",
    tooltip: "删除",
    type: "danger",
}));
const __VLS_53 = __VLS_52({
    ...{ 'onClick': {} },
    icon: "HOutline:TrashIcon",
    tooltip: "删除",
    type: "danger",
}, ...__VLS_functionalComponentArgsRest(__VLS_52));
let __VLS_56;
const __VLS_57 = {
    ...{ click: {} },
    onClick: (...[$event]) => {
        __VLS_ctx.handleClick('delete');
        // @ts-ignore
        [handleClick,];
    },
};
var __VLS_54;
var __VLS_55;
let __VLS_58;
/** @ts-ignore @type { | typeof __VLS_components.IconButton} */
IconButton;
// @ts-ignore
const __VLS_59 = __VLS_asFunctionalComponent1(__VLS_58, new __VLS_58({
    ...{ 'onClick': {} },
    icon: "HOutline:CheckCircleIcon",
    tooltip: "确认",
    type: "success",
}));
const __VLS_60 = __VLS_59({
    ...{ 'onClick': {} },
    icon: "HOutline:CheckCircleIcon",
    tooltip: "确认",
    type: "success",
}, ...__VLS_functionalComponentArgsRest(__VLS_59));
let __VLS_63;
const __VLS_64 = {
    ...{ click: {} },
    onClick: (...[$event]) => {
        __VLS_ctx.handleClick('confirm');
        // @ts-ignore
        [handleClick,];
    },
};
var __VLS_61;
var __VLS_62;
let __VLS_65;
/** @ts-ignore @type { | typeof __VLS_components.IconButton} */
IconButton;
// @ts-ignore
const __VLS_66 = __VLS_asFunctionalComponent1(__VLS_65, new __VLS_65({
    ...{ 'onClick': {} },
    icon: "HOutline:ExclamationTriangleIcon",
    tooltip: "警告",
    type: "warning",
}));
const __VLS_67 = __VLS_66({
    ...{ 'onClick': {} },
    icon: "HOutline:ExclamationTriangleIcon",
    tooltip: "警告",
    type: "warning",
}, ...__VLS_functionalComponentArgsRest(__VLS_66));
let __VLS_70;
const __VLS_71 = {
    ...{ click: {} },
    onClick: (...[$event]) => {
        __VLS_ctx.handleClick('warning');
        // @ts-ignore
        [handleClick,];
    },
};
var __VLS_68;
var __VLS_69;
let __VLS_72;
/** @ts-ignore @type { | typeof __VLS_components.IconButton} */
IconButton;
// @ts-ignore
const __VLS_73 = __VLS_asFunctionalComponent1(__VLS_72, new __VLS_72({
    ...{ 'onClick': {} },
    disabled: (true),
    icon: "HOutline:HandRaisedIcon",
    tooltip: "禁用状态",
    type: "primary",
}));
const __VLS_74 = __VLS_73({
    ...{ 'onClick': {} },
    disabled: (true),
    icon: "HOutline:HandRaisedIcon",
    tooltip: "禁用状态",
    type: "primary",
}, ...__VLS_functionalComponentArgsRest(__VLS_73));
let __VLS_77;
const __VLS_78 = {
    ...{ click: {} },
    onClick: (...[$event]) => {
        __VLS_ctx.handleClick('disabled');
        // @ts-ignore
        [handleClick,];
    },
};
var __VLS_75;
var __VLS_76;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "demo-group" },
});
/** @type {__VLS_StyleScopedClasses['demo-group']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "demo-label" },
});
/** @type {__VLS_StyleScopedClasses['demo-label']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "demo-buttons" },
});
/** @type {__VLS_StyleScopedClasses['demo-buttons']} */ ;
let __VLS_79;
/** @ts-ignore @type { | typeof __VLS_components.IconButton} */
IconButton;
// @ts-ignore
const __VLS_80 = __VLS_asFunctionalComponent1(__VLS_79, new __VLS_79({
    ...{ 'onClick': {} },
    icon: "HOutline:ArrowPathIcon",
    tooltip: "刷新",
    type: "primary",
    loading: (__VLS_ctx.refreshLoading),
}));
const __VLS_81 = __VLS_80({
    ...{ 'onClick': {} },
    icon: "HOutline:ArrowPathIcon",
    tooltip: "刷新",
    type: "primary",
    loading: (__VLS_ctx.refreshLoading),
}, ...__VLS_functionalComponentArgsRest(__VLS_80));
let __VLS_84;
const __VLS_85 = {
    ...{ click: {} },
    onClick: (__VLS_ctx.handleRefresh),
};
var __VLS_82;
var __VLS_83;
let __VLS_86;
/** @ts-ignore @type { | typeof __VLS_components.IconButton} */
IconButton;
// @ts-ignore
const __VLS_87 = __VLS_asFunctionalComponent1(__VLS_86, new __VLS_86({
    ...{ 'onClick': {} },
    icon: "HOutline:ArrowDownTrayIcon",
    tooltip: "下载",
    type: "success",
    loading: (__VLS_ctx.downloadLoading),
}));
const __VLS_88 = __VLS_87({
    ...{ 'onClick': {} },
    icon: "HOutline:ArrowDownTrayIcon",
    tooltip: "下载",
    type: "success",
    loading: (__VLS_ctx.downloadLoading),
}, ...__VLS_functionalComponentArgsRest(__VLS_87));
let __VLS_91;
const __VLS_92 = {
    ...{ click: {} },
    onClick: (__VLS_ctx.handleDownload),
};
var __VLS_89;
var __VLS_90;
let __VLS_93;
/** @ts-ignore @type { | typeof __VLS_components.IconButton} */
IconButton;
// @ts-ignore
const __VLS_94 = __VLS_asFunctionalComponent1(__VLS_93, new __VLS_93({
    ...{ 'onClick': {} },
    icon: "HOutline:TrashIcon",
    tooltip: "删除",
    type: "danger",
    loading: (__VLS_ctx.deleteLoading),
}));
const __VLS_95 = __VLS_94({
    ...{ 'onClick': {} },
    icon: "HOutline:TrashIcon",
    tooltip: "删除",
    type: "danger",
    loading: (__VLS_ctx.deleteLoading),
}, ...__VLS_functionalComponentArgsRest(__VLS_94));
let __VLS_98;
const __VLS_99 = {
    ...{ click: {} },
    onClick: (__VLS_ctx.handleDelete),
};
var __VLS_96;
var __VLS_97;
let __VLS_100;
/** @ts-ignore @type { | typeof __VLS_components.IconButton} */
IconButton;
// @ts-ignore
const __VLS_101 = __VLS_asFunctionalComponent1(__VLS_100, new __VLS_100({
    ...{ 'onClick': {} },
    icon: "HOutline:ArrowPathIcon",
    tooltip: "自定义加载图标",
    type: "warning",
    loading: (__VLS_ctx.customLoading),
    loadingIcon: "HOutline:SparklesIcon",
}));
const __VLS_102 = __VLS_101({
    ...{ 'onClick': {} },
    icon: "HOutline:ArrowPathIcon",
    tooltip: "自定义加载图标",
    type: "warning",
    loading: (__VLS_ctx.customLoading),
    loadingIcon: "HOutline:SparklesIcon",
}, ...__VLS_functionalComponentArgsRest(__VLS_101));
let __VLS_105;
const __VLS_106 = {
    ...{ click: {} },
    onClick: (__VLS_ctx.handleCustom),
};
var __VLS_103;
var __VLS_104;
let __VLS_107;
/** @ts-ignore @type { | typeof __VLS_components.elDivider | typeof __VLS_components.ElDivider | typeof __VLS_components['el-divider']} */
elDivider;
// @ts-ignore
const __VLS_108 = __VLS_asFunctionalComponent1(__VLS_107, new __VLS_107({}));
const __VLS_109 = __VLS_108({}, ...__VLS_functionalComponentArgsRest(__VLS_108));
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "preview-section" },
});
/** @type {__VLS_StyleScopedClasses['preview-section']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "section-title" },
});
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
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
    ...{ class: "demo-buttons" },
});
/** @type {__VLS_StyleScopedClasses['demo-buttons']} */ ;
let __VLS_112;
/** @ts-ignore @type { | typeof __VLS_components.LoadingButton | typeof __VLS_components.LoadingButton} */
LoadingButton;
// @ts-ignore
const __VLS_113 = __VLS_asFunctionalComponent1(__VLS_112, new __VLS_112({
    ...{ 'onClick': {} },
    type: "primary",
}));
const __VLS_114 = __VLS_113({
    ...{ 'onClick': {} },
    type: "primary",
}, ...__VLS_functionalComponentArgsRest(__VLS_113));
let __VLS_117;
const __VLS_118 = {
    ...{ click: {} },
    onClick: (__VLS_ctx.handleAsyncClick),
};
const { default: __VLS_119 } = __VLS_115.slots;
// @ts-ignore
[refreshLoading, handleRefresh, downloadLoading, handleDownload, deleteLoading, handleDelete, customLoading, handleCustom, handleAsyncClick,];
var __VLS_115;
var __VLS_116;
let __VLS_120;
/** @ts-ignore @type { | typeof __VLS_components.LoadingButton | typeof __VLS_components.LoadingButton} */
LoadingButton;
// @ts-ignore
const __VLS_121 = __VLS_asFunctionalComponent1(__VLS_120, new __VLS_120({
    ...{ 'onClick': {} },
    type: "success",
}));
const __VLS_122 = __VLS_121({
    ...{ 'onClick': {} },
    type: "success",
}, ...__VLS_functionalComponentArgsRest(__VLS_121));
let __VLS_125;
const __VLS_126 = {
    ...{ click: {} },
    onClick: (__VLS_ctx.handleAsyncClick),
};
const { default: __VLS_127 } = __VLS_123.slots;
// @ts-ignore
[handleAsyncClick,];
var __VLS_123;
var __VLS_124;
let __VLS_128;
/** @ts-ignore @type { | typeof __VLS_components.LoadingButton | typeof __VLS_components.LoadingButton} */
LoadingButton;
// @ts-ignore
const __VLS_129 = __VLS_asFunctionalComponent1(__VLS_128, new __VLS_128({
    ...{ 'onClick': {} },
    type: "warning",
}));
const __VLS_130 = __VLS_129({
    ...{ 'onClick': {} },
    type: "warning",
}, ...__VLS_functionalComponentArgsRest(__VLS_129));
let __VLS_133;
const __VLS_134 = {
    ...{ click: {} },
    onClick: (__VLS_ctx.handleAsyncClick),
};
const { default: __VLS_135 } = __VLS_131.slots;
// @ts-ignore
[handleAsyncClick,];
var __VLS_131;
var __VLS_132;
let __VLS_136;
/** @ts-ignore @type { | typeof __VLS_components.LoadingButton | typeof __VLS_components.LoadingButton} */
LoadingButton;
// @ts-ignore
const __VLS_137 = __VLS_asFunctionalComponent1(__VLS_136, new __VLS_136({
    ...{ 'onClick': {} },
    type: "danger",
}));
const __VLS_138 = __VLS_137({
    ...{ 'onClick': {} },
    type: "danger",
}, ...__VLS_functionalComponentArgsRest(__VLS_137));
let __VLS_141;
const __VLS_142 = {
    ...{ click: {} },
    onClick: (__VLS_ctx.handleAsyncClick),
};
const { default: __VLS_143 } = __VLS_139.slots;
// @ts-ignore
[handleAsyncClick,];
var __VLS_139;
var __VLS_140;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "demo-group" },
});
/** @type {__VLS_StyleScopedClasses['demo-group']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "demo-label" },
});
/** @type {__VLS_StyleScopedClasses['demo-label']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ style: {} },
});
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "demo-buttons" },
});
/** @type {__VLS_StyleScopedClasses['demo-buttons']} */ ;
let __VLS_144;
/** @ts-ignore @type { | typeof __VLS_components.LoadingButton | typeof __VLS_components.LoadingButton} */
LoadingButton;
// @ts-ignore
const __VLS_145 = __VLS_asFunctionalComponent1(__VLS_144, new __VLS_144({
    ...{ 'onClick': {} },
    type: "primary",
    loadingDelay: (100),
}));
const __VLS_146 = __VLS_145({
    ...{ 'onClick': {} },
    type: "primary",
    loadingDelay: (100),
}, ...__VLS_functionalComponentArgsRest(__VLS_145));
let __VLS_149;
const __VLS_150 = {
    ...{ click: {} },
    onClick: (__VLS_ctx.handleQuickClick),
};
const { default: __VLS_151 } = __VLS_147.slots;
// @ts-ignore
[handleQuickClick,];
var __VLS_147;
var __VLS_148;
let __VLS_152;
/** @ts-ignore @type { | typeof __VLS_components.LoadingButton | typeof __VLS_components.LoadingButton} */
LoadingButton;
// @ts-ignore
const __VLS_153 = __VLS_asFunctionalComponent1(__VLS_152, new __VLS_152({
    ...{ 'onClick': {} },
    type: "primary",
    loadingDelay: (500),
}));
const __VLS_154 = __VLS_153({
    ...{ 'onClick': {} },
    type: "primary",
    loadingDelay: (500),
}, ...__VLS_functionalComponentArgsRest(__VLS_153));
let __VLS_157;
const __VLS_158 = {
    ...{ click: {} },
    onClick: (__VLS_ctx.handleQuickClick),
};
const { default: __VLS_159 } = __VLS_155.slots;
// @ts-ignore
[handleQuickClick,];
var __VLS_155;
var __VLS_156;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "demo-group" },
});
/** @type {__VLS_StyleScopedClasses['demo-group']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "demo-label" },
});
/** @type {__VLS_StyleScopedClasses['demo-label']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "demo-buttons" },
});
/** @type {__VLS_StyleScopedClasses['demo-buttons']} */ ;
let __VLS_160;
/** @ts-ignore @type { | typeof __VLS_components.LoadingButton | typeof __VLS_components.LoadingButton} */
LoadingButton;
// @ts-ignore
const __VLS_161 = __VLS_asFunctionalComponent1(__VLS_160, new __VLS_160({
    ...{ 'onClick': {} },
    type: "primary",
}));
const __VLS_162 = __VLS_161({
    ...{ 'onClick': {} },
    type: "primary",
}, ...__VLS_functionalComponentArgsRest(__VLS_161));
let __VLS_165;
const __VLS_166 = {
    ...{ click: {} },
    onClick: (__VLS_ctx.handleAsyncClick),
};
const { default: __VLS_167 } = __VLS_163.slots;
{
    const { icon: __VLS_168 } = __VLS_163.slots;
    let __VLS_169;
    /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
    elIcon;
    // @ts-ignore
    const __VLS_170 = __VLS_asFunctionalComponent1(__VLS_169, new __VLS_169({}));
    const __VLS_171 = __VLS_170({}, ...__VLS_functionalComponentArgsRest(__VLS_170));
    const { default: __VLS_174 } = __VLS_172.slots;
    const __VLS_175 = (__VLS_ctx.menuStore.iconComponents['HOutline:HandRaisedIcon']);
    // @ts-ignore
    const __VLS_176 = __VLS_asFunctionalComponent1(__VLS_175, new __VLS_175({}));
    const __VLS_177 = __VLS_176({}, ...__VLS_functionalComponentArgsRest(__VLS_176));
    // @ts-ignore
    [handleAsyncClick, menuStore,];
    var __VLS_172;
    // @ts-ignore
    [];
}
{
    const { loading: __VLS_180 } = __VLS_163.slots;
    let __VLS_181;
    /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
    elIcon;
    // @ts-ignore
    const __VLS_182 = __VLS_asFunctionalComponent1(__VLS_181, new __VLS_181({
        ...{ class: "is-loading" },
    }));
    const __VLS_183 = __VLS_182({
        ...{ class: "is-loading" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_182));
    /** @type {__VLS_StyleScopedClasses['is-loading']} */ ;
    const { default: __VLS_186 } = __VLS_184.slots;
    const __VLS_187 = (__VLS_ctx.menuStore.iconComponents['HOutline:ArrowPathIcon']);
    // @ts-ignore
    const __VLS_188 = __VLS_asFunctionalComponent1(__VLS_187, new __VLS_187({}));
    const __VLS_189 = __VLS_188({}, ...__VLS_functionalComponentArgsRest(__VLS_188));
    // @ts-ignore
    [menuStore,];
    var __VLS_184;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_163;
var __VLS_164;
let __VLS_192;
/** @ts-ignore @type { | typeof __VLS_components.elDivider | typeof __VLS_components.ElDivider | typeof __VLS_components['el-divider']} */
elDivider;
// @ts-ignore
const __VLS_193 = __VLS_asFunctionalComponent1(__VLS_192, new __VLS_192({}));
const __VLS_194 = __VLS_193({}, ...__VLS_functionalComponentArgsRest(__VLS_193));
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
let __VLS_197;
/** @ts-ignore @type { | typeof __VLS_components.elDivider | typeof __VLS_components.ElDivider | typeof __VLS_components['el-divider']} */
elDivider;
// @ts-ignore
const __VLS_198 = __VLS_asFunctionalComponent1(__VLS_197, new __VLS_197({}));
const __VLS_199 = __VLS_198({}, ...__VLS_functionalComponentArgsRest(__VLS_198));
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
let __VLS_202;
/** @ts-ignore @type { | typeof __VLS_components.elLink | typeof __VLS_components.ElLink | typeof __VLS_components['el-link'] | typeof __VLS_components.elLink | typeof __VLS_components.ElLink | typeof __VLS_components['el-link']} */
elLink;
// @ts-ignore
const __VLS_203 = __VLS_asFunctionalComponent1(__VLS_202, new __VLS_202({
    href: "https://element-plus.org/zh-CN/component/tooltip",
    target: "_blank",
    type: "primary",
    underline: (false),
}));
const __VLS_204 = __VLS_203({
    href: "https://element-plus.org/zh-CN/component/tooltip",
    target: "_blank",
    type: "primary",
    underline: (false),
}, ...__VLS_functionalComponentArgsRest(__VLS_203));
const { default: __VLS_207 } = __VLS_205.slots;
// @ts-ignore
[];
var __VLS_205;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "comparison-table" },
});
/** @type {__VLS_StyleScopedClasses['comparison-table']} */ ;
let __VLS_208;
/** @ts-ignore @type { | typeof __VLS_components.elTable | typeof __VLS_components.ElTable | typeof __VLS_components['el-table'] | typeof __VLS_components.elTable | typeof __VLS_components.ElTable | typeof __VLS_components['el-table']} */
elTable;
// @ts-ignore
const __VLS_209 = __VLS_asFunctionalComponent1(__VLS_208, new __VLS_208({
    data: (__VLS_ctx.iconButtonPropsTableData),
    border: true,
    ...{ style: {} },
}));
const __VLS_210 = __VLS_209({
    data: (__VLS_ctx.iconButtonPropsTableData),
    border: true,
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_209));
const { default: __VLS_213 } = __VLS_211.slots;
let __VLS_214;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_215 = __VLS_asFunctionalComponent1(__VLS_214, new __VLS_214({
    prop: "name",
    label: "属性名",
    width: "150",
}));
const __VLS_216 = __VLS_215({
    prop: "name",
    label: "属性名",
    width: "150",
}, ...__VLS_functionalComponentArgsRest(__VLS_215));
const { default: __VLS_219 } = __VLS_217.slots;
{
    const { default: __VLS_220 } = __VLS_217.slots;
    const [{ row }] = __VLS_vSlot(__VLS_220);
    __VLS_asFunctionalElement1(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({});
    (row.name);
    // @ts-ignore
    [iconButtonPropsTableData,];
}
// @ts-ignore
[];
var __VLS_217;
let __VLS_221;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_222 = __VLS_asFunctionalComponent1(__VLS_221, new __VLS_221({
    prop: "type",
    label: "类型",
    width: "200",
}));
const __VLS_223 = __VLS_222({
    prop: "type",
    label: "类型",
    width: "200",
}, ...__VLS_functionalComponentArgsRest(__VLS_222));
const { default: __VLS_226 } = __VLS_224.slots;
{
    const { default: __VLS_227 } = __VLS_224.slots;
    const [{ row }] = __VLS_vSlot(__VLS_227);
    __VLS_asFunctionalElement1(__VLS_intrinsics.code, __VLS_intrinsics.code)({});
    (row.type);
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_224;
let __VLS_228;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_229 = __VLS_asFunctionalComponent1(__VLS_228, new __VLS_228({
    prop: "default",
    label: "默认值",
    width: "120",
}));
const __VLS_230 = __VLS_229({
    prop: "default",
    label: "默认值",
    width: "120",
}, ...__VLS_functionalComponentArgsRest(__VLS_229));
const { default: __VLS_233 } = __VLS_231.slots;
{
    const { default: __VLS_234 } = __VLS_231.slots;
    const [{ row }] = __VLS_vSlot(__VLS_234);
    __VLS_asFunctionalElement1(__VLS_intrinsics.code, __VLS_intrinsics.code)({});
    (row.default);
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_231;
let __VLS_235;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_236 = __VLS_asFunctionalComponent1(__VLS_235, new __VLS_235({
    prop: "description",
    label: "说明",
    minWidth: "200",
}));
const __VLS_237 = __VLS_236({
    prop: "description",
    label: "说明",
    minWidth: "200",
}, ...__VLS_functionalComponentArgsRest(__VLS_236));
// @ts-ignore
[];
var __VLS_211;
let __VLS_240;
/** @ts-ignore @type { | typeof __VLS_components.elDivider | typeof __VLS_components.ElDivider | typeof __VLS_components['el-divider']} */
elDivider;
// @ts-ignore
const __VLS_241 = __VLS_asFunctionalComponent1(__VLS_240, new __VLS_240({}));
const __VLS_242 = __VLS_241({}, ...__VLS_functionalComponentArgsRest(__VLS_241));
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
    ...{ class: "usage-description" },
    ...{ style: {} },
});
/** @type {__VLS_StyleScopedClasses['usage-description']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "usage-code" },
});
/** @type {__VLS_StyleScopedClasses['usage-code']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.pre, __VLS_intrinsics.pre)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.code, __VLS_intrinsics.code)({});
let __VLS_245;
/** @ts-ignore @type { | typeof __VLS_components.elDivider | typeof __VLS_components.ElDivider | typeof __VLS_components['el-divider']} */
elDivider;
// @ts-ignore
const __VLS_246 = __VLS_asFunctionalComponent1(__VLS_245, new __VLS_245({}));
const __VLS_247 = __VLS_246({}, ...__VLS_functionalComponentArgsRest(__VLS_246));
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
__VLS_asFunctionalElement1(__VLS_intrinsics.code, __VLS_intrinsics.code)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.code, __VLS_intrinsics.code)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.code, __VLS_intrinsics.code)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.code, __VLS_intrinsics.code)({});
let __VLS_250;
/** @ts-ignore @type { | typeof __VLS_components.elLink | typeof __VLS_components.ElLink | typeof __VLS_components['el-link'] | typeof __VLS_components.elLink | typeof __VLS_components.ElLink | typeof __VLS_components['el-link']} */
elLink;
// @ts-ignore
const __VLS_251 = __VLS_asFunctionalComponent1(__VLS_250, new __VLS_250({
    href: "https://element-plus.org/zh-CN/component/button",
    target: "_blank",
    type: "primary",
    underline: (false),
}));
const __VLS_252 = __VLS_251({
    href: "https://element-plus.org/zh-CN/component/button",
    target: "_blank",
    type: "primary",
    underline: (false),
}, ...__VLS_functionalComponentArgsRest(__VLS_251));
const { default: __VLS_255 } = __VLS_253.slots;
// @ts-ignore
[];
var __VLS_253;
__VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
    ...{ class: "usage-description" },
});
/** @type {__VLS_StyleScopedClasses['usage-description']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.code, __VLS_intrinsics.code)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.code, __VLS_intrinsics.code)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
    ...{ class: "usage-description" },
});
/** @type {__VLS_StyleScopedClasses['usage-description']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.code, __VLS_intrinsics.code)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.code, __VLS_intrinsics.code)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.code, __VLS_intrinsics.code)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "comparison-table" },
});
/** @type {__VLS_StyleScopedClasses['comparison-table']} */ ;
let __VLS_256;
/** @ts-ignore @type { | typeof __VLS_components.elTable | typeof __VLS_components.ElTable | typeof __VLS_components['el-table'] | typeof __VLS_components.elTable | typeof __VLS_components.ElTable | typeof __VLS_components['el-table']} */
elTable;
// @ts-ignore
const __VLS_257 = __VLS_asFunctionalComponent1(__VLS_256, new __VLS_256({
    data: (__VLS_ctx.loadingButtonPropsTableData),
    border: true,
    ...{ style: {} },
}));
const __VLS_258 = __VLS_257({
    data: (__VLS_ctx.loadingButtonPropsTableData),
    border: true,
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_257));
const { default: __VLS_261 } = __VLS_259.slots;
let __VLS_262;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_263 = __VLS_asFunctionalComponent1(__VLS_262, new __VLS_262({
    prop: "name",
    label: "属性名",
    width: "150",
}));
const __VLS_264 = __VLS_263({
    prop: "name",
    label: "属性名",
    width: "150",
}, ...__VLS_functionalComponentArgsRest(__VLS_263));
const { default: __VLS_267 } = __VLS_265.slots;
{
    const { default: __VLS_268 } = __VLS_265.slots;
    const [{ row }] = __VLS_vSlot(__VLS_268);
    __VLS_asFunctionalElement1(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({});
    (row.name);
    // @ts-ignore
    [loadingButtonPropsTableData,];
}
// @ts-ignore
[];
var __VLS_265;
let __VLS_269;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_270 = __VLS_asFunctionalComponent1(__VLS_269, new __VLS_269({
    prop: "type",
    label: "类型",
    width: "200",
}));
const __VLS_271 = __VLS_270({
    prop: "type",
    label: "类型",
    width: "200",
}, ...__VLS_functionalComponentArgsRest(__VLS_270));
const { default: __VLS_274 } = __VLS_272.slots;
{
    const { default: __VLS_275 } = __VLS_272.slots;
    const [{ row }] = __VLS_vSlot(__VLS_275);
    __VLS_asFunctionalElement1(__VLS_intrinsics.code, __VLS_intrinsics.code)({});
    (row.type);
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_272;
let __VLS_276;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_277 = __VLS_asFunctionalComponent1(__VLS_276, new __VLS_276({
    prop: "default",
    label: "默认值",
    width: "120",
}));
const __VLS_278 = __VLS_277({
    prop: "default",
    label: "默认值",
    width: "120",
}, ...__VLS_functionalComponentArgsRest(__VLS_277));
const { default: __VLS_281 } = __VLS_279.slots;
{
    const { default: __VLS_282 } = __VLS_279.slots;
    const [{ row }] = __VLS_vSlot(__VLS_282);
    __VLS_asFunctionalElement1(__VLS_intrinsics.code, __VLS_intrinsics.code)({});
    (row.default);
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_279;
let __VLS_283;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_284 = __VLS_asFunctionalComponent1(__VLS_283, new __VLS_283({
    prop: "description",
    label: "说明",
    minWidth: "200",
}));
const __VLS_285 = __VLS_284({
    prop: "description",
    label: "说明",
    minWidth: "200",
}, ...__VLS_functionalComponentArgsRest(__VLS_284));
// @ts-ignore
[];
var __VLS_259;
// @ts-ignore
[];
var __VLS_3;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
