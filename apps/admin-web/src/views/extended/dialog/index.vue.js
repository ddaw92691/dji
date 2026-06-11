/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { Dialog } from '@/utils/dialog';
defineOptions({ name: 'DialogView' });
const menuStore = useMenuStore();
const open = ref(false);
const dialogForm = ref({
    title: 'Dialog Title',
    width: '500px',
    draggable: true,
    resizable: true,
    fullscreen: false,
    showConfirmLoading: true,
    showFullscreenButton: true,
    showClose: true,
    showFooter: true,
    showCancelButton: true,
    showConfirmButton: true,
    confirmText: '确定',
    cancelText: '取消',
    mobileAdaptive: true,
    mobileWidth: '90%',
    mobileBreakpoint: 992,
    closeIcon: 'HOutline:XMarkIcon',
    closeIconSize: '1.5rem',
    fullscreenIcon: 'HOutline:ArrowsPointingOutIcon',
    fullscreenIconSize: '1.25rem',
    exitFullscreenIcon: 'HOutline:ArrowsPointingInIcon',
    exitFullscreenIconSize: '1.25rem',
});
// 组件属性表格数据
const propsTableData = [
    {
        name: 'modelValue',
        type: 'boolean',
        default: '-',
        description: '是否打开对话框（必需，支持 v-model）',
    },
    {
        name: 'title',
        type: 'string',
        default: '-',
        description: '对话框标题',
    },
    {
        name: 'width',
        type: 'string | number',
        default: '-',
        description: '对话框宽度，支持字符串（如：500px、50%）或数字（默认 px）',
    },
    {
        name: 'fullscreen',
        type: 'boolean',
        default: 'false',
        description: '是否全屏展示',
    },
    {
        name: 'draggable',
        type: 'boolean',
        default: 'true',
        description: '是否支持拖拽移动',
    },
    {
        name: 'resizable',
        type: 'boolean',
        default: 'true',
        description: '是否支持拖拽调整大小',
    },
    {
        name: 'showFullscreenButton',
        type: 'boolean',
        default: 'true',
        description: '是否显示切换全屏按钮',
    },
    {
        name: 'showClose',
        type: 'boolean',
        default: 'true',
        description: '是否显示关闭按钮',
    },
    {
        name: 'showFooter',
        type: 'boolean',
        default: 'true',
        description: '是否显示页脚',
    },
    {
        name: 'showCancelButton',
        type: 'boolean',
        default: 'true',
        description: '是否显示页脚的取消按钮',
    },
    {
        name: 'showConfirmButton',
        type: 'boolean',
        default: 'true',
        description: '是否显示页脚的确定按钮',
    },
    {
        name: 'confirmText',
        type: 'string',
        default: "'确定'",
        description: '确定按钮文本',
    },
    {
        name: 'cancelText',
        type: 'string',
        default: "'取消'",
        description: '取消按钮文本',
    },
    {
        name: 'showConfirmLoading',
        type: 'boolean',
        default: 'true',
        description: '是否显示确认按钮加载状态（点击确定按钮时）',
    },
    {
        name: 'closeIcon',
        type: 'string | Component',
        default: "'HOutline:XMarkIcon'",
        description: '关闭按钮图标，支持字符串（从 menuStore.iconComponents 中获取）或直接传入图标组件',
    },
    {
        name: 'closeIconSize',
        type: 'string',
        default: "'1.5rem'",
        description: '关闭按钮图标尺寸',
    },
    {
        name: 'fullscreenIcon',
        type: 'string | Component',
        default: "'HOutline:ArrowsPointingOutIcon'",
        description: '全屏按钮图标，支持字符串（从 menuStore.iconComponents 中获取）或直接传入图标组件',
    },
    {
        name: 'fullscreenIconSize',
        type: 'string',
        default: "'1.25rem'",
        description: '全屏按钮图标尺寸',
    },
    {
        name: 'exitFullscreenIcon',
        type: 'string | Component',
        default: "'HOutline:ArrowsPointingInIcon'",
        description: '退出全屏按钮图标，支持字符串（从 menuStore.iconComponents 中获取）或直接传入图标组件',
    },
    {
        name: 'exitFullscreenIconSize',
        type: 'string',
        default: "'1.25rem'",
        description: '退出全屏按钮图标尺寸',
    },
    {
        name: 'mobileAdaptive',
        type: 'boolean',
        default: 'true',
        description: '是否支持移动端适配',
    },
    {
        name: 'mobileWidth',
        type: 'string | number',
        default: "'90%'",
        description: '移动端对话框宽度，支持百分比（如：90%）或固定像素值（如：320px）',
    },
    {
        name: 'mobileBreakpoint',
        type: 'number',
        default: '992',
        description: '移动端断点，屏幕宽度小于此值时视为移动端设备（单位：px）',
    },
];
// Dialog 快捷调用属性表格数据
const dialogCallPropsTableData = [
    {
        name: 'content',
        type: 'string | Component | (() => unknown)',
        default: '-',
        description: '对话框内容，支持字符串、Vue 组件或渲染函数',
    },
    {
        name: 'icon',
        type: 'string | Component',
        default: '-',
        description: '自定义图标，支持字符串（从 menuStore.iconComponents 中获取）或直接传入图标组件。如果不设置，会根据对话框类型自动使用默认图标',
    },
    {
        name: 'onClose',
        type: '() => void',
        default: '-',
        description: '关闭回调函数，在对话框关闭时触发（点击关闭按钮、取消按钮、遮罩层或 ESC 键）',
    },
    {
        name: 'onConfirm',
        type: '() => Promise<void> | void',
        default: '-',
        description: '确认回调函数，在点击确定按钮时触发。支持异步函数，如果返回 Promise，会在 Promise 完成后自动关闭对话框',
    },
];
const handleConfirm = async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    ElMessage.success('点击了确定按钮');
    open.value = false;
};
const handleClose = () => {
    ElMessage.success('关闭了对话框');
};
// Dialog 快捷调用演示
const showInfoDialog = () => {
    Dialog.info({
        title: '系统维护通知',
        content: '今晚 23:00 将进行例行维护，预计 2 小时。期间只读功能可用，写入操作将暂缓，请提前保存进度。',
        confirmText: '好的，知道了',
        onConfirm: () => {
            ElMessage.success('已知悉维护时间');
        },
    });
};
const showSuccessDialog = () => {
    Dialog.success({
        title: '批量任务完成',
        content: '批量清理完成：共处理 18 条记录，成功 17 条，跳过 1 条（已被锁定）。',
        confirmText: '查看日志',
        onConfirm: () => {
            ElMessage.success('已跳转到日志中心');
        },
    });
};
const showWarningDialog = () => {
    Dialog.warning({
        title: '数据异常提醒',
        content: '检测到 3 条待处理数据存在缺失字段，后续导出可能失败。建议先修复后再继续操作，是否忽略并继续？',
        showCancelButton: true,
        confirmText: '仍要继续',
        onConfirm: () => {
            ElMessage.success('选择继续执行');
        },
        onClose: () => {
            ElMessage.info('已返回修复数据');
        },
    });
};
const showErrorDialog = () => {
    Dialog.error({
        title: '导出失败',
        content: '导出失败：网络连接异常（超时 15s）。请检查网络后重试，或切换到“异步导出”模式稍后下载。',
        confirmText: '重试',
        showCancelButton: true,
        onConfirm: () => {
            ElMessage.success('已开始重试导出');
        },
        onClose: () => {
            ElMessage.info('已取消导出');
        },
    });
};
const showConfirmDialog = () => {
    Dialog.confirm({
        title: '删除确认',
        content: '确定要删除选中的 5 条数据吗？删除后无法恢复，相关报表将重新统计。',
        confirmText: '确认删除',
        cancelText: '再想想',
        showCancelButton: true,
        onConfirm: async () => {
            await new Promise((resolve) => setTimeout(resolve, 500));
            ElMessage.success('已删除并重新统计');
        },
        onClose: () => ElMessage.info('已取消删除'),
    });
};
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "dialog-doc-container" },
});
/** @type {__VLS_StyleScopedClasses['dialog-doc-container']} */ ;
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
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        ...{ class: "description-text" },
    });
    /** @type {__VLS_StyleScopedClasses['description-text']} */ ;
    let __VLS_7;
    /** @ts-ignore @type { | typeof __VLS_components.elLink | typeof __VLS_components.ElLink | typeof __VLS_components['el-link'] | typeof __VLS_components.elLink | typeof __VLS_components.ElLink | typeof __VLS_components['el-link']} */
    elLink;
    // @ts-ignore
    const __VLS_8 = __VLS_asFunctionalComponent1(__VLS_7, new __VLS_7({
        href: "https://element-plus.org/zh-CN/component/dialog",
        target: "_blank",
        type: "primary",
        underline: (false),
    }));
    const __VLS_9 = __VLS_8({
        href: "https://element-plus.org/zh-CN/component/dialog",
        target: "_blank",
        type: "primary",
        underline: (false),
    }, ...__VLS_functionalComponentArgsRest(__VLS_8));
    const { default: __VLS_12 } = __VLS_10.slots;
    var __VLS_10;
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
    let __VLS_13;
    /** @ts-ignore @type { | typeof __VLS_components.elLink | typeof __VLS_components.ElLink | typeof __VLS_components['el-link'] | typeof __VLS_components.elLink | typeof __VLS_components.ElLink | typeof __VLS_components['el-link']} */
    elLink;
    // @ts-ignore
    const __VLS_14 = __VLS_asFunctionalComponent1(__VLS_13, new __VLS_13({
        href: "https://github.com/DFANNN/DFAN-Admin/blob/main/src/components/dialog/BaseDialog.vue",
        target: "_blank",
        type: "primary",
        underline: (false),
    }));
    const __VLS_15 = __VLS_14({
        href: "https://github.com/DFANNN/DFAN-Admin/blob/main/src/components/dialog/BaseDialog.vue",
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
    ...{ class: "action-bar" },
});
/** @type {__VLS_StyleScopedClasses['action-bar']} */ ;
let __VLS_19;
/** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
elButton;
// @ts-ignore
const __VLS_20 = __VLS_asFunctionalComponent1(__VLS_19, new __VLS_19({
    ...{ 'onClick': {} },
    type: "primary",
    size: "large",
}));
const __VLS_21 = __VLS_20({
    ...{ 'onClick': {} },
    type: "primary",
    size: "large",
}, ...__VLS_functionalComponentArgsRest(__VLS_20));
let __VLS_24;
const __VLS_25 = {
    ...{ click: {} },
    onClick: (...[$event]) => {
        __VLS_ctx.open = true;
        // @ts-ignore
        [open,];
    },
};
const { default: __VLS_26 } = __VLS_22.slots;
// @ts-ignore
[];
var __VLS_22;
var __VLS_23;
let __VLS_27;
/** @ts-ignore @type { | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form'] | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form']} */
elForm;
// @ts-ignore
const __VLS_28 = __VLS_asFunctionalComponent1(__VLS_27, new __VLS_27({
    model: (__VLS_ctx.dialogForm),
    labelWidth: "auto",
}));
const __VLS_29 = __VLS_28({
    model: (__VLS_ctx.dialogForm),
    labelWidth: "auto",
}, ...__VLS_functionalComponentArgsRest(__VLS_28));
const { default: __VLS_32 } = __VLS_30.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "form-section" },
});
/** @type {__VLS_StyleScopedClasses['form-section']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "section-title" },
});
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
let __VLS_33;
/** @ts-ignore @type { | typeof __VLS_components.elRow | typeof __VLS_components.ElRow | typeof __VLS_components['el-row'] | typeof __VLS_components.elRow | typeof __VLS_components.ElRow | typeof __VLS_components['el-row']} */
elRow;
// @ts-ignore
const __VLS_34 = __VLS_asFunctionalComponent1(__VLS_33, new __VLS_33({
    gutter: (20),
}));
const __VLS_35 = __VLS_34({
    gutter: (20),
}, ...__VLS_functionalComponentArgsRest(__VLS_34));
const { default: __VLS_38 } = __VLS_36.slots;
let __VLS_39;
/** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
elCol;
// @ts-ignore
const __VLS_40 = __VLS_asFunctionalComponent1(__VLS_39, new __VLS_39({
    xs: (24),
    sm: (12),
    md: (12),
    lg: (6),
    xl: (6),
}));
const __VLS_41 = __VLS_40({
    xs: (24),
    sm: (12),
    md: (12),
    lg: (6),
    xl: (6),
}, ...__VLS_functionalComponentArgsRest(__VLS_40));
const { default: __VLS_44 } = __VLS_42.slots;
let __VLS_45;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_46 = __VLS_asFunctionalComponent1(__VLS_45, new __VLS_45({
    label: "对话框标题",
    prop: "title",
}));
const __VLS_47 = __VLS_46({
    label: "对话框标题",
    prop: "title",
}, ...__VLS_functionalComponentArgsRest(__VLS_46));
const { default: __VLS_50 } = __VLS_48.slots;
let __VLS_51;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_52 = __VLS_asFunctionalComponent1(__VLS_51, new __VLS_51({
    modelValue: (__VLS_ctx.dialogForm.title),
}));
const __VLS_53 = __VLS_52({
    modelValue: (__VLS_ctx.dialogForm.title),
}, ...__VLS_functionalComponentArgsRest(__VLS_52));
// @ts-ignore
[dialogForm, dialogForm,];
var __VLS_48;
// @ts-ignore
[];
var __VLS_42;
let __VLS_56;
/** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
elCol;
// @ts-ignore
const __VLS_57 = __VLS_asFunctionalComponent1(__VLS_56, new __VLS_56({
    xs: (24),
    sm: (12),
    md: (12),
    lg: (6),
    xl: (6),
}));
const __VLS_58 = __VLS_57({
    xs: (24),
    sm: (12),
    md: (12),
    lg: (6),
    xl: (6),
}, ...__VLS_functionalComponentArgsRest(__VLS_57));
const { default: __VLS_61 } = __VLS_59.slots;
let __VLS_62;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_63 = __VLS_asFunctionalComponent1(__VLS_62, new __VLS_62({
    label: "对话框宽度",
    prop: "width",
}));
const __VLS_64 = __VLS_63({
    label: "对话框宽度",
    prop: "width",
}, ...__VLS_functionalComponentArgsRest(__VLS_63));
const { default: __VLS_67 } = __VLS_65.slots;
let __VLS_68;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_69 = __VLS_asFunctionalComponent1(__VLS_68, new __VLS_68({
    modelValue: (__VLS_ctx.dialogForm.width),
}));
const __VLS_70 = __VLS_69({
    modelValue: (__VLS_ctx.dialogForm.width),
}, ...__VLS_functionalComponentArgsRest(__VLS_69));
// @ts-ignore
[dialogForm,];
var __VLS_65;
// @ts-ignore
[];
var __VLS_59;
let __VLS_73;
/** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
elCol;
// @ts-ignore
const __VLS_74 = __VLS_asFunctionalComponent1(__VLS_73, new __VLS_73({
    xs: (24),
    sm: (12),
    md: (12),
    lg: (6),
    xl: (6),
}));
const __VLS_75 = __VLS_74({
    xs: (24),
    sm: (12),
    md: (12),
    lg: (6),
    xl: (6),
}, ...__VLS_functionalComponentArgsRest(__VLS_74));
const { default: __VLS_78 } = __VLS_76.slots;
let __VLS_79;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_80 = __VLS_asFunctionalComponent1(__VLS_79, new __VLS_79({
    label: "确定按钮文本",
    prop: "confirmText",
}));
const __VLS_81 = __VLS_80({
    label: "确定按钮文本",
    prop: "confirmText",
}, ...__VLS_functionalComponentArgsRest(__VLS_80));
const { default: __VLS_84 } = __VLS_82.slots;
let __VLS_85;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_86 = __VLS_asFunctionalComponent1(__VLS_85, new __VLS_85({
    modelValue: (__VLS_ctx.dialogForm.confirmText),
}));
const __VLS_87 = __VLS_86({
    modelValue: (__VLS_ctx.dialogForm.confirmText),
}, ...__VLS_functionalComponentArgsRest(__VLS_86));
// @ts-ignore
[dialogForm,];
var __VLS_82;
// @ts-ignore
[];
var __VLS_76;
let __VLS_90;
/** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
elCol;
// @ts-ignore
const __VLS_91 = __VLS_asFunctionalComponent1(__VLS_90, new __VLS_90({
    xs: (24),
    sm: (12),
    md: (12),
    lg: (6),
    xl: (6),
}));
const __VLS_92 = __VLS_91({
    xs: (24),
    sm: (12),
    md: (12),
    lg: (6),
    xl: (6),
}, ...__VLS_functionalComponentArgsRest(__VLS_91));
const { default: __VLS_95 } = __VLS_93.slots;
let __VLS_96;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_97 = __VLS_asFunctionalComponent1(__VLS_96, new __VLS_96({
    label: "取消按钮文本",
    prop: "cancelText",
}));
const __VLS_98 = __VLS_97({
    label: "取消按钮文本",
    prop: "cancelText",
}, ...__VLS_functionalComponentArgsRest(__VLS_97));
const { default: __VLS_101 } = __VLS_99.slots;
let __VLS_102;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_103 = __VLS_asFunctionalComponent1(__VLS_102, new __VLS_102({
    modelValue: (__VLS_ctx.dialogForm.cancelText),
}));
const __VLS_104 = __VLS_103({
    modelValue: (__VLS_ctx.dialogForm.cancelText),
}, ...__VLS_functionalComponentArgsRest(__VLS_103));
// @ts-ignore
[dialogForm,];
var __VLS_99;
// @ts-ignore
[];
var __VLS_93;
// @ts-ignore
[];
var __VLS_36;
let __VLS_107;
/** @ts-ignore @type { | typeof __VLS_components.elDivider | typeof __VLS_components.ElDivider | typeof __VLS_components['el-divider']} */
elDivider;
// @ts-ignore
const __VLS_108 = __VLS_asFunctionalComponent1(__VLS_107, new __VLS_107({}));
const __VLS_109 = __VLS_108({}, ...__VLS_functionalComponentArgsRest(__VLS_108));
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "form-section" },
});
/** @type {__VLS_StyleScopedClasses['form-section']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "section-title" },
});
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
let __VLS_112;
/** @ts-ignore @type { | typeof __VLS_components.elRow | typeof __VLS_components.ElRow | typeof __VLS_components['el-row'] | typeof __VLS_components.elRow | typeof __VLS_components.ElRow | typeof __VLS_components['el-row']} */
elRow;
// @ts-ignore
const __VLS_113 = __VLS_asFunctionalComponent1(__VLS_112, new __VLS_112({
    gutter: (20),
}));
const __VLS_114 = __VLS_113({
    gutter: (20),
}, ...__VLS_functionalComponentArgsRest(__VLS_113));
const { default: __VLS_117 } = __VLS_115.slots;
let __VLS_118;
/** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
elCol;
// @ts-ignore
const __VLS_119 = __VLS_asFunctionalComponent1(__VLS_118, new __VLS_118({
    xs: (24),
    sm: (12),
    md: (12),
    lg: (6),
    xl: (6),
}));
const __VLS_120 = __VLS_119({
    xs: (24),
    sm: (12),
    md: (12),
    lg: (6),
    xl: (6),
}, ...__VLS_functionalComponentArgsRest(__VLS_119));
const { default: __VLS_123 } = __VLS_121.slots;
let __VLS_124;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_125 = __VLS_asFunctionalComponent1(__VLS_124, new __VLS_124({
    label: "是否启用拖拽移动",
    prop: "draggable",
}));
const __VLS_126 = __VLS_125({
    label: "是否启用拖拽移动",
    prop: "draggable",
}, ...__VLS_functionalComponentArgsRest(__VLS_125));
const { default: __VLS_129 } = __VLS_127.slots;
let __VLS_130;
/** @ts-ignore @type { | typeof __VLS_components.elSwitch | typeof __VLS_components.ElSwitch | typeof __VLS_components['el-switch']} */
elSwitch;
// @ts-ignore
const __VLS_131 = __VLS_asFunctionalComponent1(__VLS_130, new __VLS_130({
    modelValue: (__VLS_ctx.dialogForm.draggable),
}));
const __VLS_132 = __VLS_131({
    modelValue: (__VLS_ctx.dialogForm.draggable),
}, ...__VLS_functionalComponentArgsRest(__VLS_131));
// @ts-ignore
[dialogForm,];
var __VLS_127;
// @ts-ignore
[];
var __VLS_121;
let __VLS_135;
/** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
elCol;
// @ts-ignore
const __VLS_136 = __VLS_asFunctionalComponent1(__VLS_135, new __VLS_135({
    xs: (24),
    sm: (12),
    md: (12),
    lg: (6),
    xl: (6),
}));
const __VLS_137 = __VLS_136({
    xs: (24),
    sm: (12),
    md: (12),
    lg: (6),
    xl: (6),
}, ...__VLS_functionalComponentArgsRest(__VLS_136));
const { default: __VLS_140 } = __VLS_138.slots;
let __VLS_141;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_142 = __VLS_asFunctionalComponent1(__VLS_141, new __VLS_141({
    prop: "resizable",
}));
const __VLS_143 = __VLS_142({
    prop: "resizable",
}, ...__VLS_functionalComponentArgsRest(__VLS_142));
const { default: __VLS_146 } = __VLS_144.slots;
{
    const { label: __VLS_147 } = __VLS_144.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "label-with-tooltip" },
    });
    /** @type {__VLS_StyleScopedClasses['label-with-tooltip']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    let __VLS_148;
    /** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
    elTooltip;
    // @ts-ignore
    const __VLS_149 = __VLS_asFunctionalComponent1(__VLS_148, new __VLS_148({
        content: "启用后，用户可以通过拖拽对话框边缘来调整对话框的大小",
        placement: "top",
    }));
    const __VLS_150 = __VLS_149({
        content: "启用后，用户可以通过拖拽对话框边缘来调整对话框的大小",
        placement: "top",
    }, ...__VLS_functionalComponentArgsRest(__VLS_149));
    const { default: __VLS_153 } = __VLS_151.slots;
    let __VLS_154;
    /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
    elIcon;
    // @ts-ignore
    const __VLS_155 = __VLS_asFunctionalComponent1(__VLS_154, new __VLS_154({
        ...{ class: "label-tooltip-icon" },
    }));
    const __VLS_156 = __VLS_155({
        ...{ class: "label-tooltip-icon" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_155));
    /** @type {__VLS_StyleScopedClasses['label-tooltip-icon']} */ ;
    const { default: __VLS_159 } = __VLS_157.slots;
    const __VLS_160 = (__VLS_ctx.menuStore.iconComponents['HOutline:QuestionMarkCircleIcon']);
    // @ts-ignore
    const __VLS_161 = __VLS_asFunctionalComponent1(__VLS_160, new __VLS_160({}));
    const __VLS_162 = __VLS_161({}, ...__VLS_functionalComponentArgsRest(__VLS_161));
    // @ts-ignore
    [menuStore,];
    var __VLS_157;
    // @ts-ignore
    [];
    var __VLS_151;
    // @ts-ignore
    [];
}
let __VLS_165;
/** @ts-ignore @type { | typeof __VLS_components.elSwitch | typeof __VLS_components.ElSwitch | typeof __VLS_components['el-switch']} */
elSwitch;
// @ts-ignore
const __VLS_166 = __VLS_asFunctionalComponent1(__VLS_165, new __VLS_165({
    modelValue: (__VLS_ctx.dialogForm.resizable),
}));
const __VLS_167 = __VLS_166({
    modelValue: (__VLS_ctx.dialogForm.resizable),
}, ...__VLS_functionalComponentArgsRest(__VLS_166));
// @ts-ignore
[dialogForm,];
var __VLS_144;
// @ts-ignore
[];
var __VLS_138;
let __VLS_170;
/** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
elCol;
// @ts-ignore
const __VLS_171 = __VLS_asFunctionalComponent1(__VLS_170, new __VLS_170({
    xs: (24),
    sm: (12),
    md: (12),
    lg: (6),
    xl: (6),
}));
const __VLS_172 = __VLS_171({
    xs: (24),
    sm: (12),
    md: (12),
    lg: (6),
    xl: (6),
}, ...__VLS_functionalComponentArgsRest(__VLS_171));
const { default: __VLS_175 } = __VLS_173.slots;
let __VLS_176;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_177 = __VLS_asFunctionalComponent1(__VLS_176, new __VLS_176({
    label: "是否全屏展示",
    prop: "fullscreen",
}));
const __VLS_178 = __VLS_177({
    label: "是否全屏展示",
    prop: "fullscreen",
}, ...__VLS_functionalComponentArgsRest(__VLS_177));
const { default: __VLS_181 } = __VLS_179.slots;
let __VLS_182;
/** @ts-ignore @type { | typeof __VLS_components.elSwitch | typeof __VLS_components.ElSwitch | typeof __VLS_components['el-switch']} */
elSwitch;
// @ts-ignore
const __VLS_183 = __VLS_asFunctionalComponent1(__VLS_182, new __VLS_182({
    modelValue: (__VLS_ctx.dialogForm.fullscreen),
}));
const __VLS_184 = __VLS_183({
    modelValue: (__VLS_ctx.dialogForm.fullscreen),
}, ...__VLS_functionalComponentArgsRest(__VLS_183));
// @ts-ignore
[dialogForm,];
var __VLS_179;
// @ts-ignore
[];
var __VLS_173;
// @ts-ignore
[];
var __VLS_115;
let __VLS_187;
/** @ts-ignore @type { | typeof __VLS_components.elDivider | typeof __VLS_components.ElDivider | typeof __VLS_components['el-divider']} */
elDivider;
// @ts-ignore
const __VLS_188 = __VLS_asFunctionalComponent1(__VLS_187, new __VLS_187({}));
const __VLS_189 = __VLS_188({}, ...__VLS_functionalComponentArgsRest(__VLS_188));
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "form-section" },
});
/** @type {__VLS_StyleScopedClasses['form-section']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "section-title" },
});
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
let __VLS_192;
/** @ts-ignore @type { | typeof __VLS_components.elRow | typeof __VLS_components.ElRow | typeof __VLS_components['el-row'] | typeof __VLS_components.elRow | typeof __VLS_components.ElRow | typeof __VLS_components['el-row']} */
elRow;
// @ts-ignore
const __VLS_193 = __VLS_asFunctionalComponent1(__VLS_192, new __VLS_192({
    gutter: (20),
}));
const __VLS_194 = __VLS_193({
    gutter: (20),
}, ...__VLS_functionalComponentArgsRest(__VLS_193));
const { default: __VLS_197 } = __VLS_195.slots;
let __VLS_198;
/** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
elCol;
// @ts-ignore
const __VLS_199 = __VLS_asFunctionalComponent1(__VLS_198, new __VLS_198({
    xs: (24),
    sm: (12),
    md: (12),
    lg: (6),
    xl: (6),
}));
const __VLS_200 = __VLS_199({
    xs: (24),
    sm: (12),
    md: (12),
    lg: (6),
    xl: (6),
}, ...__VLS_functionalComponentArgsRest(__VLS_199));
const { default: __VLS_203 } = __VLS_201.slots;
let __VLS_204;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_205 = __VLS_asFunctionalComponent1(__VLS_204, new __VLS_204({
    label: "是否显示全屏按钮",
    prop: "showFullscreenButton",
}));
const __VLS_206 = __VLS_205({
    label: "是否显示全屏按钮",
    prop: "showFullscreenButton",
}, ...__VLS_functionalComponentArgsRest(__VLS_205));
const { default: __VLS_209 } = __VLS_207.slots;
let __VLS_210;
/** @ts-ignore @type { | typeof __VLS_components.elSwitch | typeof __VLS_components.ElSwitch | typeof __VLS_components['el-switch']} */
elSwitch;
// @ts-ignore
const __VLS_211 = __VLS_asFunctionalComponent1(__VLS_210, new __VLS_210({
    modelValue: (__VLS_ctx.dialogForm.showFullscreenButton),
}));
const __VLS_212 = __VLS_211({
    modelValue: (__VLS_ctx.dialogForm.showFullscreenButton),
}, ...__VLS_functionalComponentArgsRest(__VLS_211));
// @ts-ignore
[dialogForm,];
var __VLS_207;
// @ts-ignore
[];
var __VLS_201;
let __VLS_215;
/** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
elCol;
// @ts-ignore
const __VLS_216 = __VLS_asFunctionalComponent1(__VLS_215, new __VLS_215({
    xs: (24),
    sm: (12),
    md: (12),
    lg: (6),
    xl: (6),
}));
const __VLS_217 = __VLS_216({
    xs: (24),
    sm: (12),
    md: (12),
    lg: (6),
    xl: (6),
}, ...__VLS_functionalComponentArgsRest(__VLS_216));
const { default: __VLS_220 } = __VLS_218.slots;
let __VLS_221;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_222 = __VLS_asFunctionalComponent1(__VLS_221, new __VLS_221({
    label: "是否显示关闭按钮",
    prop: "showClose",
}));
const __VLS_223 = __VLS_222({
    label: "是否显示关闭按钮",
    prop: "showClose",
}, ...__VLS_functionalComponentArgsRest(__VLS_222));
const { default: __VLS_226 } = __VLS_224.slots;
let __VLS_227;
/** @ts-ignore @type { | typeof __VLS_components.elSwitch | typeof __VLS_components.ElSwitch | typeof __VLS_components['el-switch']} */
elSwitch;
// @ts-ignore
const __VLS_228 = __VLS_asFunctionalComponent1(__VLS_227, new __VLS_227({
    modelValue: (__VLS_ctx.dialogForm.showClose),
}));
const __VLS_229 = __VLS_228({
    modelValue: (__VLS_ctx.dialogForm.showClose),
}, ...__VLS_functionalComponentArgsRest(__VLS_228));
// @ts-ignore
[dialogForm,];
var __VLS_224;
// @ts-ignore
[];
var __VLS_218;
let __VLS_232;
/** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
elCol;
// @ts-ignore
const __VLS_233 = __VLS_asFunctionalComponent1(__VLS_232, new __VLS_232({
    xs: (24),
    sm: (12),
    md: (12),
    lg: (6),
    xl: (6),
}));
const __VLS_234 = __VLS_233({
    xs: (24),
    sm: (12),
    md: (12),
    lg: (6),
    xl: (6),
}, ...__VLS_functionalComponentArgsRest(__VLS_233));
const { default: __VLS_237 } = __VLS_235.slots;
let __VLS_238;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_239 = __VLS_asFunctionalComponent1(__VLS_238, new __VLS_238({
    label: "是否显示页脚",
    prop: "showFooter",
}));
const __VLS_240 = __VLS_239({
    label: "是否显示页脚",
    prop: "showFooter",
}, ...__VLS_functionalComponentArgsRest(__VLS_239));
const { default: __VLS_243 } = __VLS_241.slots;
let __VLS_244;
/** @ts-ignore @type { | typeof __VLS_components.elSwitch | typeof __VLS_components.ElSwitch | typeof __VLS_components['el-switch']} */
elSwitch;
// @ts-ignore
const __VLS_245 = __VLS_asFunctionalComponent1(__VLS_244, new __VLS_244({
    modelValue: (__VLS_ctx.dialogForm.showFooter),
}));
const __VLS_246 = __VLS_245({
    modelValue: (__VLS_ctx.dialogForm.showFooter),
}, ...__VLS_functionalComponentArgsRest(__VLS_245));
// @ts-ignore
[dialogForm,];
var __VLS_241;
// @ts-ignore
[];
var __VLS_235;
let __VLS_249;
/** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
elCol;
// @ts-ignore
const __VLS_250 = __VLS_asFunctionalComponent1(__VLS_249, new __VLS_249({
    xs: (24),
    sm: (12),
    md: (12),
    lg: (6),
    xl: (6),
}));
const __VLS_251 = __VLS_250({
    xs: (24),
    sm: (12),
    md: (12),
    lg: (6),
    xl: (6),
}, ...__VLS_functionalComponentArgsRest(__VLS_250));
const { default: __VLS_254 } = __VLS_252.slots;
let __VLS_255;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_256 = __VLS_asFunctionalComponent1(__VLS_255, new __VLS_255({
    label: "是否显示取消按钮",
    prop: "showCancelButton",
}));
const __VLS_257 = __VLS_256({
    label: "是否显示取消按钮",
    prop: "showCancelButton",
}, ...__VLS_functionalComponentArgsRest(__VLS_256));
const { default: __VLS_260 } = __VLS_258.slots;
let __VLS_261;
/** @ts-ignore @type { | typeof __VLS_components.elSwitch | typeof __VLS_components.ElSwitch | typeof __VLS_components['el-switch']} */
elSwitch;
// @ts-ignore
const __VLS_262 = __VLS_asFunctionalComponent1(__VLS_261, new __VLS_261({
    modelValue: (__VLS_ctx.dialogForm.showCancelButton),
}));
const __VLS_263 = __VLS_262({
    modelValue: (__VLS_ctx.dialogForm.showCancelButton),
}, ...__VLS_functionalComponentArgsRest(__VLS_262));
// @ts-ignore
[dialogForm,];
var __VLS_258;
// @ts-ignore
[];
var __VLS_252;
let __VLS_266;
/** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
elCol;
// @ts-ignore
const __VLS_267 = __VLS_asFunctionalComponent1(__VLS_266, new __VLS_266({
    xs: (24),
    sm: (12),
    md: (12),
    lg: (6),
    xl: (6),
}));
const __VLS_268 = __VLS_267({
    xs: (24),
    sm: (12),
    md: (12),
    lg: (6),
    xl: (6),
}, ...__VLS_functionalComponentArgsRest(__VLS_267));
const { default: __VLS_271 } = __VLS_269.slots;
let __VLS_272;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_273 = __VLS_asFunctionalComponent1(__VLS_272, new __VLS_272({
    label: "是否显示确定按钮",
    prop: "showConfirmButton",
}));
const __VLS_274 = __VLS_273({
    label: "是否显示确定按钮",
    prop: "showConfirmButton",
}, ...__VLS_functionalComponentArgsRest(__VLS_273));
const { default: __VLS_277 } = __VLS_275.slots;
let __VLS_278;
/** @ts-ignore @type { | typeof __VLS_components.elSwitch | typeof __VLS_components.ElSwitch | typeof __VLS_components['el-switch']} */
elSwitch;
// @ts-ignore
const __VLS_279 = __VLS_asFunctionalComponent1(__VLS_278, new __VLS_278({
    modelValue: (__VLS_ctx.dialogForm.showConfirmButton),
}));
const __VLS_280 = __VLS_279({
    modelValue: (__VLS_ctx.dialogForm.showConfirmButton),
}, ...__VLS_functionalComponentArgsRest(__VLS_279));
// @ts-ignore
[dialogForm,];
var __VLS_275;
// @ts-ignore
[];
var __VLS_269;
let __VLS_283;
/** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
elCol;
// @ts-ignore
const __VLS_284 = __VLS_asFunctionalComponent1(__VLS_283, new __VLS_283({
    xs: (24),
    sm: (12),
    md: (12),
    lg: (6),
    xl: (6),
}));
const __VLS_285 = __VLS_284({
    xs: (24),
    sm: (12),
    md: (12),
    lg: (6),
    xl: (6),
}, ...__VLS_functionalComponentArgsRest(__VLS_284));
const { default: __VLS_288 } = __VLS_286.slots;
let __VLS_289;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_290 = __VLS_asFunctionalComponent1(__VLS_289, new __VLS_289({
    prop: "showConfirmLoading",
}));
const __VLS_291 = __VLS_290({
    prop: "showConfirmLoading",
}, ...__VLS_functionalComponentArgsRest(__VLS_290));
const { default: __VLS_294 } = __VLS_292.slots;
{
    const { label: __VLS_295 } = __VLS_292.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "label-with-tooltip" },
    });
    /** @type {__VLS_StyleScopedClasses['label-with-tooltip']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    let __VLS_296;
    /** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
    elTooltip;
    // @ts-ignore
    const __VLS_297 = __VLS_asFunctionalComponent1(__VLS_296, new __VLS_296({
        content: "启用后，点击确定按钮时会显示加载状态，防止重复提交",
        placement: "top",
    }));
    const __VLS_298 = __VLS_297({
        content: "启用后，点击确定按钮时会显示加载状态，防止重复提交",
        placement: "top",
    }, ...__VLS_functionalComponentArgsRest(__VLS_297));
    const { default: __VLS_301 } = __VLS_299.slots;
    let __VLS_302;
    /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
    elIcon;
    // @ts-ignore
    const __VLS_303 = __VLS_asFunctionalComponent1(__VLS_302, new __VLS_302({
        ...{ class: "label-tooltip-icon" },
    }));
    const __VLS_304 = __VLS_303({
        ...{ class: "label-tooltip-icon" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_303));
    /** @type {__VLS_StyleScopedClasses['label-tooltip-icon']} */ ;
    const { default: __VLS_307 } = __VLS_305.slots;
    const __VLS_308 = (__VLS_ctx.menuStore.iconComponents['HOutline:QuestionMarkCircleIcon']);
    // @ts-ignore
    const __VLS_309 = __VLS_asFunctionalComponent1(__VLS_308, new __VLS_308({}));
    const __VLS_310 = __VLS_309({}, ...__VLS_functionalComponentArgsRest(__VLS_309));
    // @ts-ignore
    [menuStore,];
    var __VLS_305;
    // @ts-ignore
    [];
    var __VLS_299;
    // @ts-ignore
    [];
}
let __VLS_313;
/** @ts-ignore @type { | typeof __VLS_components.elSwitch | typeof __VLS_components.ElSwitch | typeof __VLS_components['el-switch']} */
elSwitch;
// @ts-ignore
const __VLS_314 = __VLS_asFunctionalComponent1(__VLS_313, new __VLS_313({
    modelValue: (__VLS_ctx.dialogForm.showConfirmLoading),
}));
const __VLS_315 = __VLS_314({
    modelValue: (__VLS_ctx.dialogForm.showConfirmLoading),
}, ...__VLS_functionalComponentArgsRest(__VLS_314));
// @ts-ignore
[dialogForm,];
var __VLS_292;
// @ts-ignore
[];
var __VLS_286;
let __VLS_318;
/** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
elCol;
// @ts-ignore
const __VLS_319 = __VLS_asFunctionalComponent1(__VLS_318, new __VLS_318({
    xs: (24),
    sm: (12),
    md: (12),
    lg: (6),
    xl: (6),
}));
const __VLS_320 = __VLS_319({
    xs: (24),
    sm: (12),
    md: (12),
    lg: (6),
    xl: (6),
}, ...__VLS_functionalComponentArgsRest(__VLS_319));
const { default: __VLS_323 } = __VLS_321.slots;
let __VLS_324;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_325 = __VLS_asFunctionalComponent1(__VLS_324, new __VLS_324({
    prop: "closeIcon",
}));
const __VLS_326 = __VLS_325({
    prop: "closeIcon",
}, ...__VLS_functionalComponentArgsRest(__VLS_325));
const { default: __VLS_329 } = __VLS_327.slots;
{
    const { label: __VLS_330 } = __VLS_327.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "label-with-tooltip" },
    });
    /** @type {__VLS_StyleScopedClasses['label-with-tooltip']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    let __VLS_331;
    /** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
    elTooltip;
    // @ts-ignore
    const __VLS_332 = __VLS_asFunctionalComponent1(__VLS_331, new __VLS_331({
        content: "支持传递字符串（从 menuStore.iconComponents 中获取）或直接传入图标组件",
        placement: "top",
    }));
    const __VLS_333 = __VLS_332({
        content: "支持传递字符串（从 menuStore.iconComponents 中获取）或直接传入图标组件",
        placement: "top",
    }, ...__VLS_functionalComponentArgsRest(__VLS_332));
    const { default: __VLS_336 } = __VLS_334.slots;
    let __VLS_337;
    /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
    elIcon;
    // @ts-ignore
    const __VLS_338 = __VLS_asFunctionalComponent1(__VLS_337, new __VLS_337({
        ...{ class: "label-tooltip-icon" },
    }));
    const __VLS_339 = __VLS_338({
        ...{ class: "label-tooltip-icon" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_338));
    /** @type {__VLS_StyleScopedClasses['label-tooltip-icon']} */ ;
    const { default: __VLS_342 } = __VLS_340.slots;
    const __VLS_343 = (__VLS_ctx.menuStore.iconComponents['HOutline:QuestionMarkCircleIcon']);
    // @ts-ignore
    const __VLS_344 = __VLS_asFunctionalComponent1(__VLS_343, new __VLS_343({}));
    const __VLS_345 = __VLS_344({}, ...__VLS_functionalComponentArgsRest(__VLS_344));
    // @ts-ignore
    [menuStore,];
    var __VLS_340;
    // @ts-ignore
    [];
    var __VLS_334;
    // @ts-ignore
    [];
}
let __VLS_348;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_349 = __VLS_asFunctionalComponent1(__VLS_348, new __VLS_348({
    modelValue: (__VLS_ctx.dialogForm.closeIcon),
    placeholder: "如：HOutline:XMarkIcon",
}));
const __VLS_350 = __VLS_349({
    modelValue: (__VLS_ctx.dialogForm.closeIcon),
    placeholder: "如：HOutline:XMarkIcon",
}, ...__VLS_functionalComponentArgsRest(__VLS_349));
// @ts-ignore
[dialogForm,];
var __VLS_327;
// @ts-ignore
[];
var __VLS_321;
let __VLS_353;
/** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
elCol;
// @ts-ignore
const __VLS_354 = __VLS_asFunctionalComponent1(__VLS_353, new __VLS_353({
    xs: (24),
    sm: (12),
    md: (12),
    lg: (6),
    xl: (6),
}));
const __VLS_355 = __VLS_354({
    xs: (24),
    sm: (12),
    md: (12),
    lg: (6),
    xl: (6),
}, ...__VLS_functionalComponentArgsRest(__VLS_354));
const { default: __VLS_358 } = __VLS_356.slots;
let __VLS_359;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_360 = __VLS_asFunctionalComponent1(__VLS_359, new __VLS_359({
    label: "关闭按钮图标尺寸",
    prop: "closeIconSize",
}));
const __VLS_361 = __VLS_360({
    label: "关闭按钮图标尺寸",
    prop: "closeIconSize",
}, ...__VLS_functionalComponentArgsRest(__VLS_360));
const { default: __VLS_364 } = __VLS_362.slots;
let __VLS_365;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_366 = __VLS_asFunctionalComponent1(__VLS_365, new __VLS_365({
    modelValue: (__VLS_ctx.dialogForm.closeIconSize),
    placeholder: "如：1.5rem",
}));
const __VLS_367 = __VLS_366({
    modelValue: (__VLS_ctx.dialogForm.closeIconSize),
    placeholder: "如：1.5rem",
}, ...__VLS_functionalComponentArgsRest(__VLS_366));
// @ts-ignore
[dialogForm,];
var __VLS_362;
// @ts-ignore
[];
var __VLS_356;
let __VLS_370;
/** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
elCol;
// @ts-ignore
const __VLS_371 = __VLS_asFunctionalComponent1(__VLS_370, new __VLS_370({
    xs: (24),
    sm: (12),
    md: (12),
    lg: (6),
    xl: (6),
}));
const __VLS_372 = __VLS_371({
    xs: (24),
    sm: (12),
    md: (12),
    lg: (6),
    xl: (6),
}, ...__VLS_functionalComponentArgsRest(__VLS_371));
const { default: __VLS_375 } = __VLS_373.slots;
let __VLS_376;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_377 = __VLS_asFunctionalComponent1(__VLS_376, new __VLS_376({
    prop: "fullscreenIcon",
}));
const __VLS_378 = __VLS_377({
    prop: "fullscreenIcon",
}, ...__VLS_functionalComponentArgsRest(__VLS_377));
const { default: __VLS_381 } = __VLS_379.slots;
{
    const { label: __VLS_382 } = __VLS_379.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "label-with-tooltip" },
    });
    /** @type {__VLS_StyleScopedClasses['label-with-tooltip']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    let __VLS_383;
    /** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
    elTooltip;
    // @ts-ignore
    const __VLS_384 = __VLS_asFunctionalComponent1(__VLS_383, new __VLS_383({
        content: "支持传递字符串（从 menuStore.iconComponents 中获取）或直接传入图标组件",
        placement: "top",
    }));
    const __VLS_385 = __VLS_384({
        content: "支持传递字符串（从 menuStore.iconComponents 中获取）或直接传入图标组件",
        placement: "top",
    }, ...__VLS_functionalComponentArgsRest(__VLS_384));
    const { default: __VLS_388 } = __VLS_386.slots;
    let __VLS_389;
    /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
    elIcon;
    // @ts-ignore
    const __VLS_390 = __VLS_asFunctionalComponent1(__VLS_389, new __VLS_389({
        ...{ class: "label-tooltip-icon" },
    }));
    const __VLS_391 = __VLS_390({
        ...{ class: "label-tooltip-icon" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_390));
    /** @type {__VLS_StyleScopedClasses['label-tooltip-icon']} */ ;
    const { default: __VLS_394 } = __VLS_392.slots;
    const __VLS_395 = (__VLS_ctx.menuStore.iconComponents['HOutline:QuestionMarkCircleIcon']);
    // @ts-ignore
    const __VLS_396 = __VLS_asFunctionalComponent1(__VLS_395, new __VLS_395({}));
    const __VLS_397 = __VLS_396({}, ...__VLS_functionalComponentArgsRest(__VLS_396));
    // @ts-ignore
    [menuStore,];
    var __VLS_392;
    // @ts-ignore
    [];
    var __VLS_386;
    // @ts-ignore
    [];
}
let __VLS_400;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_401 = __VLS_asFunctionalComponent1(__VLS_400, new __VLS_400({
    modelValue: (__VLS_ctx.dialogForm.fullscreenIcon),
    placeholder: "如：HOutline:ArrowsPointingOutIcon",
}));
const __VLS_402 = __VLS_401({
    modelValue: (__VLS_ctx.dialogForm.fullscreenIcon),
    placeholder: "如：HOutline:ArrowsPointingOutIcon",
}, ...__VLS_functionalComponentArgsRest(__VLS_401));
// @ts-ignore
[dialogForm,];
var __VLS_379;
// @ts-ignore
[];
var __VLS_373;
let __VLS_405;
/** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
elCol;
// @ts-ignore
const __VLS_406 = __VLS_asFunctionalComponent1(__VLS_405, new __VLS_405({
    xs: (24),
    sm: (12),
    md: (12),
    lg: (6),
    xl: (6),
}));
const __VLS_407 = __VLS_406({
    xs: (24),
    sm: (12),
    md: (12),
    lg: (6),
    xl: (6),
}, ...__VLS_functionalComponentArgsRest(__VLS_406));
const { default: __VLS_410 } = __VLS_408.slots;
let __VLS_411;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_412 = __VLS_asFunctionalComponent1(__VLS_411, new __VLS_411({
    label: "全屏按钮图标尺寸",
    prop: "fullscreenIconSize",
}));
const __VLS_413 = __VLS_412({
    label: "全屏按钮图标尺寸",
    prop: "fullscreenIconSize",
}, ...__VLS_functionalComponentArgsRest(__VLS_412));
const { default: __VLS_416 } = __VLS_414.slots;
let __VLS_417;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_418 = __VLS_asFunctionalComponent1(__VLS_417, new __VLS_417({
    modelValue: (__VLS_ctx.dialogForm.fullscreenIconSize),
    placeholder: "如：1.25rem",
}));
const __VLS_419 = __VLS_418({
    modelValue: (__VLS_ctx.dialogForm.fullscreenIconSize),
    placeholder: "如：1.25rem",
}, ...__VLS_functionalComponentArgsRest(__VLS_418));
// @ts-ignore
[dialogForm,];
var __VLS_414;
// @ts-ignore
[];
var __VLS_408;
let __VLS_422;
/** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
elCol;
// @ts-ignore
const __VLS_423 = __VLS_asFunctionalComponent1(__VLS_422, new __VLS_422({
    xs: (24),
    sm: (12),
    md: (12),
    lg: (6),
    xl: (6),
}));
const __VLS_424 = __VLS_423({
    xs: (24),
    sm: (12),
    md: (12),
    lg: (6),
    xl: (6),
}, ...__VLS_functionalComponentArgsRest(__VLS_423));
const { default: __VLS_427 } = __VLS_425.slots;
let __VLS_428;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_429 = __VLS_asFunctionalComponent1(__VLS_428, new __VLS_428({
    prop: "exitFullscreenIcon",
}));
const __VLS_430 = __VLS_429({
    prop: "exitFullscreenIcon",
}, ...__VLS_functionalComponentArgsRest(__VLS_429));
const { default: __VLS_433 } = __VLS_431.slots;
{
    const { label: __VLS_434 } = __VLS_431.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "label-with-tooltip" },
    });
    /** @type {__VLS_StyleScopedClasses['label-with-tooltip']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    let __VLS_435;
    /** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
    elTooltip;
    // @ts-ignore
    const __VLS_436 = __VLS_asFunctionalComponent1(__VLS_435, new __VLS_435({
        content: "支持传递字符串（从 menuStore.iconComponents 中获取）或直接传入图标组件",
        placement: "top",
    }));
    const __VLS_437 = __VLS_436({
        content: "支持传递字符串（从 menuStore.iconComponents 中获取）或直接传入图标组件",
        placement: "top",
    }, ...__VLS_functionalComponentArgsRest(__VLS_436));
    const { default: __VLS_440 } = __VLS_438.slots;
    let __VLS_441;
    /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
    elIcon;
    // @ts-ignore
    const __VLS_442 = __VLS_asFunctionalComponent1(__VLS_441, new __VLS_441({
        ...{ class: "label-tooltip-icon" },
    }));
    const __VLS_443 = __VLS_442({
        ...{ class: "label-tooltip-icon" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_442));
    /** @type {__VLS_StyleScopedClasses['label-tooltip-icon']} */ ;
    const { default: __VLS_446 } = __VLS_444.slots;
    const __VLS_447 = (__VLS_ctx.menuStore.iconComponents['HOutline:QuestionMarkCircleIcon']);
    // @ts-ignore
    const __VLS_448 = __VLS_asFunctionalComponent1(__VLS_447, new __VLS_447({}));
    const __VLS_449 = __VLS_448({}, ...__VLS_functionalComponentArgsRest(__VLS_448));
    // @ts-ignore
    [menuStore,];
    var __VLS_444;
    // @ts-ignore
    [];
    var __VLS_438;
    // @ts-ignore
    [];
}
let __VLS_452;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_453 = __VLS_asFunctionalComponent1(__VLS_452, new __VLS_452({
    modelValue: (__VLS_ctx.dialogForm.exitFullscreenIcon),
    placeholder: "如：HOutline:ArrowsPointingInIcon",
}));
const __VLS_454 = __VLS_453({
    modelValue: (__VLS_ctx.dialogForm.exitFullscreenIcon),
    placeholder: "如：HOutline:ArrowsPointingInIcon",
}, ...__VLS_functionalComponentArgsRest(__VLS_453));
// @ts-ignore
[dialogForm,];
var __VLS_431;
// @ts-ignore
[];
var __VLS_425;
let __VLS_457;
/** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
elCol;
// @ts-ignore
const __VLS_458 = __VLS_asFunctionalComponent1(__VLS_457, new __VLS_457({
    xs: (24),
    sm: (12),
    md: (12),
    lg: (6),
    xl: (6),
}));
const __VLS_459 = __VLS_458({
    xs: (24),
    sm: (12),
    md: (12),
    lg: (6),
    xl: (6),
}, ...__VLS_functionalComponentArgsRest(__VLS_458));
const { default: __VLS_462 } = __VLS_460.slots;
let __VLS_463;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_464 = __VLS_asFunctionalComponent1(__VLS_463, new __VLS_463({
    label: "退出全屏按钮图标尺寸",
    prop: "exitFullscreenIconSize",
}));
const __VLS_465 = __VLS_464({
    label: "退出全屏按钮图标尺寸",
    prop: "exitFullscreenIconSize",
}, ...__VLS_functionalComponentArgsRest(__VLS_464));
const { default: __VLS_468 } = __VLS_466.slots;
let __VLS_469;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_470 = __VLS_asFunctionalComponent1(__VLS_469, new __VLS_469({
    modelValue: (__VLS_ctx.dialogForm.exitFullscreenIconSize),
    placeholder: "如：1.25rem",
}));
const __VLS_471 = __VLS_470({
    modelValue: (__VLS_ctx.dialogForm.exitFullscreenIconSize),
    placeholder: "如：1.25rem",
}, ...__VLS_functionalComponentArgsRest(__VLS_470));
// @ts-ignore
[dialogForm,];
var __VLS_466;
// @ts-ignore
[];
var __VLS_460;
// @ts-ignore
[];
var __VLS_195;
let __VLS_474;
/** @ts-ignore @type { | typeof __VLS_components.elDivider | typeof __VLS_components.ElDivider | typeof __VLS_components['el-divider']} */
elDivider;
// @ts-ignore
const __VLS_475 = __VLS_asFunctionalComponent1(__VLS_474, new __VLS_474({}));
const __VLS_476 = __VLS_475({}, ...__VLS_functionalComponentArgsRest(__VLS_475));
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "form-section" },
});
/** @type {__VLS_StyleScopedClasses['form-section']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "section-title" },
});
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
let __VLS_479;
/** @ts-ignore @type { | typeof __VLS_components.elRow | typeof __VLS_components.ElRow | typeof __VLS_components['el-row'] | typeof __VLS_components.elRow | typeof __VLS_components.ElRow | typeof __VLS_components['el-row']} */
elRow;
// @ts-ignore
const __VLS_480 = __VLS_asFunctionalComponent1(__VLS_479, new __VLS_479({
    gutter: (20),
}));
const __VLS_481 = __VLS_480({
    gutter: (20),
}, ...__VLS_functionalComponentArgsRest(__VLS_480));
const { default: __VLS_484 } = __VLS_482.slots;
let __VLS_485;
/** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
elCol;
// @ts-ignore
const __VLS_486 = __VLS_asFunctionalComponent1(__VLS_485, new __VLS_485({
    xs: (24),
    sm: (12),
    md: (12),
    lg: (6),
    xl: (6),
}));
const __VLS_487 = __VLS_486({
    xs: (24),
    sm: (12),
    md: (12),
    lg: (6),
    xl: (6),
}, ...__VLS_functionalComponentArgsRest(__VLS_486));
const { default: __VLS_490 } = __VLS_488.slots;
let __VLS_491;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_492 = __VLS_asFunctionalComponent1(__VLS_491, new __VLS_491({
    prop: "mobileAdaptive",
}));
const __VLS_493 = __VLS_492({
    prop: "mobileAdaptive",
}, ...__VLS_functionalComponentArgsRest(__VLS_492));
const { default: __VLS_496 } = __VLS_494.slots;
{
    const { label: __VLS_497 } = __VLS_494.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "label-with-tooltip" },
    });
    /** @type {__VLS_StyleScopedClasses['label-with-tooltip']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    let __VLS_498;
    /** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
    elTooltip;
    // @ts-ignore
    const __VLS_499 = __VLS_asFunctionalComponent1(__VLS_498, new __VLS_498({
        content: "启用后，当屏幕宽度小于移动端断点时，对话框宽度会自动调整为移动端宽度",
        placement: "top",
    }));
    const __VLS_500 = __VLS_499({
        content: "启用后，当屏幕宽度小于移动端断点时，对话框宽度会自动调整为移动端宽度",
        placement: "top",
    }, ...__VLS_functionalComponentArgsRest(__VLS_499));
    const { default: __VLS_503 } = __VLS_501.slots;
    let __VLS_504;
    /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
    elIcon;
    // @ts-ignore
    const __VLS_505 = __VLS_asFunctionalComponent1(__VLS_504, new __VLS_504({
        ...{ class: "label-tooltip-icon" },
    }));
    const __VLS_506 = __VLS_505({
        ...{ class: "label-tooltip-icon" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_505));
    /** @type {__VLS_StyleScopedClasses['label-tooltip-icon']} */ ;
    const { default: __VLS_509 } = __VLS_507.slots;
    const __VLS_510 = (__VLS_ctx.menuStore.iconComponents['HOutline:QuestionMarkCircleIcon']);
    // @ts-ignore
    const __VLS_511 = __VLS_asFunctionalComponent1(__VLS_510, new __VLS_510({}));
    const __VLS_512 = __VLS_511({}, ...__VLS_functionalComponentArgsRest(__VLS_511));
    // @ts-ignore
    [menuStore,];
    var __VLS_507;
    // @ts-ignore
    [];
    var __VLS_501;
    // @ts-ignore
    [];
}
let __VLS_515;
/** @ts-ignore @type { | typeof __VLS_components.elSwitch | typeof __VLS_components.ElSwitch | typeof __VLS_components['el-switch']} */
elSwitch;
// @ts-ignore
const __VLS_516 = __VLS_asFunctionalComponent1(__VLS_515, new __VLS_515({
    modelValue: (__VLS_ctx.dialogForm.mobileAdaptive),
}));
const __VLS_517 = __VLS_516({
    modelValue: (__VLS_ctx.dialogForm.mobileAdaptive),
}, ...__VLS_functionalComponentArgsRest(__VLS_516));
// @ts-ignore
[dialogForm,];
var __VLS_494;
// @ts-ignore
[];
var __VLS_488;
let __VLS_520;
/** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
elCol;
// @ts-ignore
const __VLS_521 = __VLS_asFunctionalComponent1(__VLS_520, new __VLS_520({
    xs: (24),
    sm: (12),
    md: (12),
    lg: (6),
    xl: (6),
}));
const __VLS_522 = __VLS_521({
    xs: (24),
    sm: (12),
    md: (12),
    lg: (6),
    xl: (6),
}, ...__VLS_functionalComponentArgsRest(__VLS_521));
const { default: __VLS_525 } = __VLS_523.slots;
let __VLS_526;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_527 = __VLS_asFunctionalComponent1(__VLS_526, new __VLS_526({
    prop: "mobileWidth",
}));
const __VLS_528 = __VLS_527({
    prop: "mobileWidth",
}, ...__VLS_functionalComponentArgsRest(__VLS_527));
const { default: __VLS_531 } = __VLS_529.slots;
{
    const { label: __VLS_532 } = __VLS_529.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "label-with-tooltip" },
    });
    /** @type {__VLS_StyleScopedClasses['label-with-tooltip']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    let __VLS_533;
    /** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
    elTooltip;
    // @ts-ignore
    const __VLS_534 = __VLS_asFunctionalComponent1(__VLS_533, new __VLS_533({
        content: "在移动端设备上对话框的宽度，支持百分比（如：90%）或固定像素值（如：320px）",
        placement: "top",
    }));
    const __VLS_535 = __VLS_534({
        content: "在移动端设备上对话框的宽度，支持百分比（如：90%）或固定像素值（如：320px）",
        placement: "top",
    }, ...__VLS_functionalComponentArgsRest(__VLS_534));
    const { default: __VLS_538 } = __VLS_536.slots;
    let __VLS_539;
    /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
    elIcon;
    // @ts-ignore
    const __VLS_540 = __VLS_asFunctionalComponent1(__VLS_539, new __VLS_539({
        ...{ class: "label-tooltip-icon" },
    }));
    const __VLS_541 = __VLS_540({
        ...{ class: "label-tooltip-icon" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_540));
    /** @type {__VLS_StyleScopedClasses['label-tooltip-icon']} */ ;
    const { default: __VLS_544 } = __VLS_542.slots;
    const __VLS_545 = (__VLS_ctx.menuStore.iconComponents['HOutline:QuestionMarkCircleIcon']);
    // @ts-ignore
    const __VLS_546 = __VLS_asFunctionalComponent1(__VLS_545, new __VLS_545({}));
    const __VLS_547 = __VLS_546({}, ...__VLS_functionalComponentArgsRest(__VLS_546));
    // @ts-ignore
    [menuStore,];
    var __VLS_542;
    // @ts-ignore
    [];
    var __VLS_536;
    // @ts-ignore
    [];
}
let __VLS_550;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_551 = __VLS_asFunctionalComponent1(__VLS_550, new __VLS_550({
    modelValue: (__VLS_ctx.dialogForm.mobileWidth),
}));
const __VLS_552 = __VLS_551({
    modelValue: (__VLS_ctx.dialogForm.mobileWidth),
}, ...__VLS_functionalComponentArgsRest(__VLS_551));
// @ts-ignore
[dialogForm,];
var __VLS_529;
// @ts-ignore
[];
var __VLS_523;
let __VLS_555;
/** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
elCol;
// @ts-ignore
const __VLS_556 = __VLS_asFunctionalComponent1(__VLS_555, new __VLS_555({
    xs: (24),
    sm: (12),
    md: (12),
    lg: (6),
    xl: (6),
}));
const __VLS_557 = __VLS_556({
    xs: (24),
    sm: (12),
    md: (12),
    lg: (6),
    xl: (6),
}, ...__VLS_functionalComponentArgsRest(__VLS_556));
const { default: __VLS_560 } = __VLS_558.slots;
let __VLS_561;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_562 = __VLS_asFunctionalComponent1(__VLS_561, new __VLS_561({
    prop: "mobileBreakpoint",
}));
const __VLS_563 = __VLS_562({
    prop: "mobileBreakpoint",
}, ...__VLS_functionalComponentArgsRest(__VLS_562));
const { default: __VLS_566 } = __VLS_564.slots;
{
    const { label: __VLS_567 } = __VLS_564.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "label-with-tooltip" },
    });
    /** @type {__VLS_StyleScopedClasses['label-with-tooltip']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    let __VLS_568;
    /** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
    elTooltip;
    // @ts-ignore
    const __VLS_569 = __VLS_asFunctionalComponent1(__VLS_568, new __VLS_568({
        content: "屏幕宽度小于此值时视为移动端设备，对话框会使用移动端宽度（单位：px，默认：992）",
        placement: "top",
    }));
    const __VLS_570 = __VLS_569({
        content: "屏幕宽度小于此值时视为移动端设备，对话框会使用移动端宽度（单位：px，默认：992）",
        placement: "top",
    }, ...__VLS_functionalComponentArgsRest(__VLS_569));
    const { default: __VLS_573 } = __VLS_571.slots;
    let __VLS_574;
    /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
    elIcon;
    // @ts-ignore
    const __VLS_575 = __VLS_asFunctionalComponent1(__VLS_574, new __VLS_574({
        ...{ class: "label-tooltip-icon" },
    }));
    const __VLS_576 = __VLS_575({
        ...{ class: "label-tooltip-icon" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_575));
    /** @type {__VLS_StyleScopedClasses['label-tooltip-icon']} */ ;
    const { default: __VLS_579 } = __VLS_577.slots;
    const __VLS_580 = (__VLS_ctx.menuStore.iconComponents['HOutline:QuestionMarkCircleIcon']);
    // @ts-ignore
    const __VLS_581 = __VLS_asFunctionalComponent1(__VLS_580, new __VLS_580({}));
    const __VLS_582 = __VLS_581({}, ...__VLS_functionalComponentArgsRest(__VLS_581));
    // @ts-ignore
    [menuStore,];
    var __VLS_577;
    // @ts-ignore
    [];
    var __VLS_571;
    // @ts-ignore
    [];
}
let __VLS_585;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_586 = __VLS_asFunctionalComponent1(__VLS_585, new __VLS_585({
    modelValue: (__VLS_ctx.dialogForm.mobileBreakpoint),
}));
const __VLS_587 = __VLS_586({
    modelValue: (__VLS_ctx.dialogForm.mobileBreakpoint),
}, ...__VLS_functionalComponentArgsRest(__VLS_586));
// @ts-ignore
[dialogForm,];
var __VLS_564;
// @ts-ignore
[];
var __VLS_558;
// @ts-ignore
[];
var __VLS_482;
// @ts-ignore
[];
var __VLS_30;
let __VLS_590;
/** @ts-ignore @type { | typeof __VLS_components.elDivider | typeof __VLS_components.ElDivider | typeof __VLS_components['el-divider']} */
elDivider;
// @ts-ignore
const __VLS_591 = __VLS_asFunctionalComponent1(__VLS_590, new __VLS_590({}));
const __VLS_592 = __VLS_591({}, ...__VLS_functionalComponentArgsRest(__VLS_591));
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "event-section" },
});
/** @type {__VLS_StyleScopedClasses['event-section']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "section-title" },
});
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "event-item" },
});
/** @type {__VLS_StyleScopedClasses['event-item']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "event-name" },
});
/** @type {__VLS_StyleScopedClasses['event-name']} */ ;
let __VLS_595;
/** @ts-ignore @type { | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag'] | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag']} */
elTag;
// @ts-ignore
const __VLS_596 = __VLS_asFunctionalComponent1(__VLS_595, new __VLS_595({
    type: "danger",
    size: "small",
}));
const __VLS_597 = __VLS_596({
    type: "danger",
    size: "small",
}, ...__VLS_functionalComponentArgsRest(__VLS_596));
const { default: __VLS_600 } = __VLS_598.slots;
// @ts-ignore
[];
var __VLS_598;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "event-label" },
});
/** @type {__VLS_StyleScopedClasses['event-label']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "event-item" },
});
/** @type {__VLS_StyleScopedClasses['event-item']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "event-name" },
});
/** @type {__VLS_StyleScopedClasses['event-name']} */ ;
let __VLS_601;
/** @ts-ignore @type { | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag'] | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag']} */
elTag;
// @ts-ignore
const __VLS_602 = __VLS_asFunctionalComponent1(__VLS_601, new __VLS_601({
    type: "success",
    size: "small",
}));
const __VLS_603 = __VLS_602({
    type: "success",
    size: "small",
}, ...__VLS_functionalComponentArgsRest(__VLS_602));
const { default: __VLS_606 } = __VLS_604.slots;
// @ts-ignore
[];
var __VLS_604;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "event-label" },
});
/** @type {__VLS_StyleScopedClasses['event-label']} */ ;
let __VLS_607;
/** @ts-ignore @type { | typeof __VLS_components.elDivider | typeof __VLS_components.ElDivider | typeof __VLS_components['el-divider']} */
elDivider;
// @ts-ignore
const __VLS_608 = __VLS_asFunctionalComponent1(__VLS_607, new __VLS_607({}));
const __VLS_609 = __VLS_608({}, ...__VLS_functionalComponentArgsRest(__VLS_608));
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "slot-section" },
});
/** @type {__VLS_StyleScopedClasses['slot-section']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "section-title" },
});
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "slot-info" },
});
/** @type {__VLS_StyleScopedClasses['slot-info']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
    ...{ class: "slot-description" },
});
/** @type {__VLS_StyleScopedClasses['slot-description']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "slot-list" },
});
/** @type {__VLS_StyleScopedClasses['slot-list']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "slot-item" },
});
/** @type {__VLS_StyleScopedClasses['slot-item']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "slot-name" },
});
/** @type {__VLS_StyleScopedClasses['slot-name']} */ ;
let __VLS_612;
/** @ts-ignore @type { | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag'] | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag']} */
elTag;
// @ts-ignore
const __VLS_613 = __VLS_asFunctionalComponent1(__VLS_612, new __VLS_612({
    type: "primary",
    size: "small",
}));
const __VLS_614 = __VLS_613({
    type: "primary",
    size: "small",
}, ...__VLS_functionalComponentArgsRest(__VLS_613));
const { default: __VLS_617 } = __VLS_615.slots;
// @ts-ignore
[];
var __VLS_615;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "slot-label" },
});
/** @type {__VLS_StyleScopedClasses['slot-label']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "slot-code" },
});
/** @type {__VLS_StyleScopedClasses['slot-code']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.pre, __VLS_intrinsics.pre)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.code, __VLS_intrinsics.code)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "slot-item" },
});
/** @type {__VLS_StyleScopedClasses['slot-item']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "slot-name" },
});
/** @type {__VLS_StyleScopedClasses['slot-name']} */ ;
let __VLS_618;
/** @ts-ignore @type { | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag'] | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag']} */
elTag;
// @ts-ignore
const __VLS_619 = __VLS_asFunctionalComponent1(__VLS_618, new __VLS_618({
    type: "success",
    size: "small",
}));
const __VLS_620 = __VLS_619({
    type: "success",
    size: "small",
}, ...__VLS_functionalComponentArgsRest(__VLS_619));
const { default: __VLS_623 } = __VLS_621.slots;
// @ts-ignore
[];
var __VLS_621;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "slot-label" },
});
/** @type {__VLS_StyleScopedClasses['slot-label']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "slot-code" },
});
/** @type {__VLS_StyleScopedClasses['slot-code']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.pre, __VLS_intrinsics.pre)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.code, __VLS_intrinsics.code)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "slot-item" },
});
/** @type {__VLS_StyleScopedClasses['slot-item']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "slot-name" },
});
/** @type {__VLS_StyleScopedClasses['slot-name']} */ ;
let __VLS_624;
/** @ts-ignore @type { | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag'] | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag']} */
elTag;
// @ts-ignore
const __VLS_625 = __VLS_asFunctionalComponent1(__VLS_624, new __VLS_624({
    type: "warning",
    size: "small",
}));
const __VLS_626 = __VLS_625({
    type: "warning",
    size: "small",
}, ...__VLS_functionalComponentArgsRest(__VLS_625));
const { default: __VLS_629 } = __VLS_627.slots;
// @ts-ignore
[];
var __VLS_627;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "slot-label" },
});
/** @type {__VLS_StyleScopedClasses['slot-label']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "slot-code" },
});
/** @type {__VLS_StyleScopedClasses['slot-code']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.pre, __VLS_intrinsics.pre)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.code, __VLS_intrinsics.code)({});
let __VLS_630;
/** @ts-ignore @type { | typeof __VLS_components.elDivider | typeof __VLS_components.ElDivider | typeof __VLS_components['el-divider']} */
elDivider;
// @ts-ignore
const __VLS_631 = __VLS_asFunctionalComponent1(__VLS_630, new __VLS_630({}));
const __VLS_632 = __VLS_631({}, ...__VLS_functionalComponentArgsRest(__VLS_631));
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
__VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
    ...{ class: "usage-description" },
});
/** @type {__VLS_StyleScopedClasses['usage-description']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.code, __VLS_intrinsics.code)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.code, __VLS_intrinsics.code)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.code, __VLS_intrinsics.code)({});
let __VLS_635;
/** @ts-ignore @type { | typeof __VLS_components.elLink | typeof __VLS_components.ElLink | typeof __VLS_components['el-link'] | typeof __VLS_components.elLink | typeof __VLS_components.ElLink | typeof __VLS_components['el-link']} */
elLink;
// @ts-ignore
const __VLS_636 = __VLS_asFunctionalComponent1(__VLS_635, new __VLS_635({
    href: "https://element-plus.org/zh-CN/component/dialog",
    target: "_blank",
    type: "primary",
    underline: (false),
}));
const __VLS_637 = __VLS_636({
    href: "https://element-plus.org/zh-CN/component/dialog",
    target: "_blank",
    type: "primary",
    underline: (false),
}, ...__VLS_functionalComponentArgsRest(__VLS_636));
const { default: __VLS_640 } = __VLS_638.slots;
// @ts-ignore
[];
var __VLS_638;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "comparison-table" },
});
/** @type {__VLS_StyleScopedClasses['comparison-table']} */ ;
let __VLS_641;
/** @ts-ignore @type { | typeof __VLS_components.elTable | typeof __VLS_components.ElTable | typeof __VLS_components['el-table'] | typeof __VLS_components.elTable | typeof __VLS_components.ElTable | typeof __VLS_components['el-table']} */
elTable;
// @ts-ignore
const __VLS_642 = __VLS_asFunctionalComponent1(__VLS_641, new __VLS_641({
    data: (__VLS_ctx.propsTableData),
    border: true,
    ...{ style: {} },
}));
const __VLS_643 = __VLS_642({
    data: (__VLS_ctx.propsTableData),
    border: true,
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_642));
const { default: __VLS_646 } = __VLS_644.slots;
let __VLS_647;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_648 = __VLS_asFunctionalComponent1(__VLS_647, new __VLS_647({
    prop: "name",
    label: "属性名",
    width: "180",
}));
const __VLS_649 = __VLS_648({
    prop: "name",
    label: "属性名",
    width: "180",
}, ...__VLS_functionalComponentArgsRest(__VLS_648));
const { default: __VLS_652 } = __VLS_650.slots;
{
    const { default: __VLS_653 } = __VLS_650.slots;
    const [{ row }] = __VLS_vSlot(__VLS_653);
    __VLS_asFunctionalElement1(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({});
    (row.name);
    // @ts-ignore
    [propsTableData,];
}
// @ts-ignore
[];
var __VLS_650;
let __VLS_654;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_655 = __VLS_asFunctionalComponent1(__VLS_654, new __VLS_654({
    prop: "type",
    label: "类型",
    width: "200",
}));
const __VLS_656 = __VLS_655({
    prop: "type",
    label: "类型",
    width: "200",
}, ...__VLS_functionalComponentArgsRest(__VLS_655));
const { default: __VLS_659 } = __VLS_657.slots;
{
    const { default: __VLS_660 } = __VLS_657.slots;
    const [{ row }] = __VLS_vSlot(__VLS_660);
    __VLS_asFunctionalElement1(__VLS_intrinsics.code, __VLS_intrinsics.code)({});
    (row.type);
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_657;
let __VLS_661;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_662 = __VLS_asFunctionalComponent1(__VLS_661, new __VLS_661({
    prop: "default",
    label: "默认值",
    width: "120",
}));
const __VLS_663 = __VLS_662({
    prop: "default",
    label: "默认值",
    width: "120",
}, ...__VLS_functionalComponentArgsRest(__VLS_662));
const { default: __VLS_666 } = __VLS_664.slots;
{
    const { default: __VLS_667 } = __VLS_664.slots;
    const [{ row }] = __VLS_vSlot(__VLS_667);
    __VLS_asFunctionalElement1(__VLS_intrinsics.code, __VLS_intrinsics.code)({});
    (row.default);
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_664;
let __VLS_668;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_669 = __VLS_asFunctionalComponent1(__VLS_668, new __VLS_668({
    prop: "description",
    label: "说明",
    minWidth: "200",
}));
const __VLS_670 = __VLS_669({
    prop: "description",
    label: "说明",
    minWidth: "200",
}, ...__VLS_functionalComponentArgsRest(__VLS_669));
// @ts-ignore
[];
var __VLS_644;
let __VLS_673;
/** @ts-ignore @type { | typeof __VLS_components.elDivider | typeof __VLS_components.ElDivider | typeof __VLS_components['el-divider']} */
elDivider;
// @ts-ignore
const __VLS_674 = __VLS_asFunctionalComponent1(__VLS_673, new __VLS_673({}));
const __VLS_675 = __VLS_674({}, ...__VLS_functionalComponentArgsRest(__VLS_674));
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "form-section" },
});
/** @type {__VLS_StyleScopedClasses['form-section']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "section-title" },
});
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "dialog-demo-buttons" },
});
/** @type {__VLS_StyleScopedClasses['dialog-demo-buttons']} */ ;
let __VLS_678;
/** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
elButton;
// @ts-ignore
const __VLS_679 = __VLS_asFunctionalComponent1(__VLS_678, new __VLS_678({
    ...{ 'onClick': {} },
}));
const __VLS_680 = __VLS_679({
    ...{ 'onClick': {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_679));
let __VLS_683;
const __VLS_684 = {
    ...{ click: {} },
    onClick: (__VLS_ctx.showInfoDialog),
};
const { default: __VLS_685 } = __VLS_681.slots;
// @ts-ignore
[showInfoDialog,];
var __VLS_681;
var __VLS_682;
let __VLS_686;
/** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
elButton;
// @ts-ignore
const __VLS_687 = __VLS_asFunctionalComponent1(__VLS_686, new __VLS_686({
    ...{ 'onClick': {} },
}));
const __VLS_688 = __VLS_687({
    ...{ 'onClick': {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_687));
let __VLS_691;
const __VLS_692 = {
    ...{ click: {} },
    onClick: (__VLS_ctx.showSuccessDialog),
};
const { default: __VLS_693 } = __VLS_689.slots;
// @ts-ignore
[showSuccessDialog,];
var __VLS_689;
var __VLS_690;
let __VLS_694;
/** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
elButton;
// @ts-ignore
const __VLS_695 = __VLS_asFunctionalComponent1(__VLS_694, new __VLS_694({
    ...{ 'onClick': {} },
}));
const __VLS_696 = __VLS_695({
    ...{ 'onClick': {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_695));
let __VLS_699;
const __VLS_700 = {
    ...{ click: {} },
    onClick: (__VLS_ctx.showWarningDialog),
};
const { default: __VLS_701 } = __VLS_697.slots;
// @ts-ignore
[showWarningDialog,];
var __VLS_697;
var __VLS_698;
let __VLS_702;
/** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
elButton;
// @ts-ignore
const __VLS_703 = __VLS_asFunctionalComponent1(__VLS_702, new __VLS_702({
    ...{ 'onClick': {} },
}));
const __VLS_704 = __VLS_703({
    ...{ 'onClick': {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_703));
let __VLS_707;
const __VLS_708 = {
    ...{ click: {} },
    onClick: (__VLS_ctx.showErrorDialog),
};
const { default: __VLS_709 } = __VLS_705.slots;
// @ts-ignore
[showErrorDialog,];
var __VLS_705;
var __VLS_706;
let __VLS_710;
/** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
elButton;
// @ts-ignore
const __VLS_711 = __VLS_asFunctionalComponent1(__VLS_710, new __VLS_710({
    ...{ 'onClick': {} },
}));
const __VLS_712 = __VLS_711({
    ...{ 'onClick': {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_711));
let __VLS_715;
const __VLS_716 = {
    ...{ click: {} },
    onClick: (__VLS_ctx.showConfirmDialog),
};
const { default: __VLS_717 } = __VLS_713.slots;
// @ts-ignore
[showConfirmDialog,];
var __VLS_713;
var __VLS_714;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "dialog-demo-description" },
});
/** @type {__VLS_StyleScopedClasses['dialog-demo-description']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.code, __VLS_intrinsics.code)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.code, __VLS_intrinsics.code)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.code, __VLS_intrinsics.code)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.code, __VLS_intrinsics.code)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.code, __VLS_intrinsics.code)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.pre, __VLS_intrinsics.pre)({
    ...{ class: "code-example" },
});
/** @type {__VLS_StyleScopedClasses['code-example']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.code, __VLS_intrinsics.code)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
    ...{ class: "description-text" },
});
/** @type {__VLS_StyleScopedClasses['description-text']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.code, __VLS_intrinsics.code)({});
let __VLS_718;
/** @ts-ignore @type { | typeof __VLS_components.elLink | typeof __VLS_components.ElLink | typeof __VLS_components['el-link'] | typeof __VLS_components.elLink | typeof __VLS_components.ElLink | typeof __VLS_components['el-link']} */
elLink;
// @ts-ignore
const __VLS_719 = __VLS_asFunctionalComponent1(__VLS_718, new __VLS_718({
    href: "https://github.com/DFANNN/DFAN-Admin/blob/main/src/utils/dialog.ts",
    target: "_blank",
    type: "primary",
    underline: (false),
}));
const __VLS_720 = __VLS_719({
    href: "https://github.com/DFANNN/DFAN-Admin/blob/main/src/utils/dialog.ts",
    target: "_blank",
    type: "primary",
    underline: (false),
}, ...__VLS_functionalComponentArgsRest(__VLS_719));
const { default: __VLS_723 } = __VLS_721.slots;
// @ts-ignore
[];
var __VLS_721;
let __VLS_724;
/** @ts-ignore @type { | typeof __VLS_components.elDivider | typeof __VLS_components.ElDivider | typeof __VLS_components['el-divider']} */
elDivider;
// @ts-ignore
const __VLS_725 = __VLS_asFunctionalComponent1(__VLS_724, new __VLS_724({}));
const __VLS_726 = __VLS_725({}, ...__VLS_functionalComponentArgsRest(__VLS_725));
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
__VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
    ...{ class: "usage-description" },
});
/** @type {__VLS_StyleScopedClasses['usage-description']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "comparison-table" },
});
/** @type {__VLS_StyleScopedClasses['comparison-table']} */ ;
let __VLS_729;
/** @ts-ignore @type { | typeof __VLS_components.elTable | typeof __VLS_components.ElTable | typeof __VLS_components['el-table'] | typeof __VLS_components.elTable | typeof __VLS_components.ElTable | typeof __VLS_components['el-table']} */
elTable;
// @ts-ignore
const __VLS_730 = __VLS_asFunctionalComponent1(__VLS_729, new __VLS_729({
    data: (__VLS_ctx.dialogCallPropsTableData),
    border: true,
    ...{ style: {} },
}));
const __VLS_731 = __VLS_730({
    data: (__VLS_ctx.dialogCallPropsTableData),
    border: true,
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_730));
const { default: __VLS_734 } = __VLS_732.slots;
let __VLS_735;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_736 = __VLS_asFunctionalComponent1(__VLS_735, new __VLS_735({
    prop: "name",
    label: "属性名",
    width: "150",
}));
const __VLS_737 = __VLS_736({
    prop: "name",
    label: "属性名",
    width: "150",
}, ...__VLS_functionalComponentArgsRest(__VLS_736));
const { default: __VLS_740 } = __VLS_738.slots;
{
    const { default: __VLS_741 } = __VLS_738.slots;
    const [{ row }] = __VLS_vSlot(__VLS_741);
    __VLS_asFunctionalElement1(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({});
    (row.name);
    // @ts-ignore
    [dialogCallPropsTableData,];
}
// @ts-ignore
[];
var __VLS_738;
let __VLS_742;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_743 = __VLS_asFunctionalComponent1(__VLS_742, new __VLS_742({
    prop: "type",
    label: "类型",
    width: "250",
}));
const __VLS_744 = __VLS_743({
    prop: "type",
    label: "类型",
    width: "250",
}, ...__VLS_functionalComponentArgsRest(__VLS_743));
const { default: __VLS_747 } = __VLS_745.slots;
{
    const { default: __VLS_748 } = __VLS_745.slots;
    const [{ row }] = __VLS_vSlot(__VLS_748);
    __VLS_asFunctionalElement1(__VLS_intrinsics.code, __VLS_intrinsics.code)({});
    (row.type);
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_745;
let __VLS_749;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_750 = __VLS_asFunctionalComponent1(__VLS_749, new __VLS_749({
    prop: "default",
    label: "默认值",
    width: "120",
}));
const __VLS_751 = __VLS_750({
    prop: "default",
    label: "默认值",
    width: "120",
}, ...__VLS_functionalComponentArgsRest(__VLS_750));
const { default: __VLS_754 } = __VLS_752.slots;
{
    const { default: __VLS_755 } = __VLS_752.slots;
    const [{ row }] = __VLS_vSlot(__VLS_755);
    __VLS_asFunctionalElement1(__VLS_intrinsics.code, __VLS_intrinsics.code)({});
    (row.default);
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_752;
let __VLS_756;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_757 = __VLS_asFunctionalComponent1(__VLS_756, new __VLS_756({
    prop: "description",
    label: "说明",
    minWidth: "250",
}));
const __VLS_758 = __VLS_757({
    prop: "description",
    label: "说明",
    minWidth: "250",
}, ...__VLS_functionalComponentArgsRest(__VLS_757));
// @ts-ignore
[];
var __VLS_732;
let __VLS_761;
/** @ts-ignore @type { | typeof __VLS_components.BaseDialog | typeof __VLS_components.BaseDialog} */
BaseDialog;
// @ts-ignore
const __VLS_762 = __VLS_asFunctionalComponent1(__VLS_761, new __VLS_761({
    ...{ 'onConfirm': {} },
    ...{ 'onClose': {} },
    modelValue: (__VLS_ctx.open),
    title: (__VLS_ctx.dialogForm.title),
    width: (__VLS_ctx.dialogForm.width),
    draggable: (__VLS_ctx.dialogForm.draggable),
    resizable: (__VLS_ctx.dialogForm.resizable),
    fullscreen: (__VLS_ctx.dialogForm.fullscreen),
    showFullscreenButton: (__VLS_ctx.dialogForm.showFullscreenButton),
    showClose: (__VLS_ctx.dialogForm.showClose),
    showFooter: (__VLS_ctx.dialogForm.showFooter),
    showCancelButton: (__VLS_ctx.dialogForm.showCancelButton),
    showConfirmButton: (__VLS_ctx.dialogForm.showConfirmButton),
    confirmText: (__VLS_ctx.dialogForm.confirmText),
    cancelText: (__VLS_ctx.dialogForm.cancelText),
    showConfirmLoading: (__VLS_ctx.dialogForm.showConfirmLoading),
    closeIcon: (__VLS_ctx.dialogForm.closeIcon),
    closeIconSize: (__VLS_ctx.dialogForm.closeIconSize),
    fullscreenIcon: (__VLS_ctx.dialogForm.fullscreenIcon),
    fullscreenIconSize: (__VLS_ctx.dialogForm.fullscreenIconSize),
    exitFullscreenIcon: (__VLS_ctx.dialogForm.exitFullscreenIcon),
    exitFullscreenIconSize: (__VLS_ctx.dialogForm.exitFullscreenIconSize),
}));
const __VLS_763 = __VLS_762({
    ...{ 'onConfirm': {} },
    ...{ 'onClose': {} },
    modelValue: (__VLS_ctx.open),
    title: (__VLS_ctx.dialogForm.title),
    width: (__VLS_ctx.dialogForm.width),
    draggable: (__VLS_ctx.dialogForm.draggable),
    resizable: (__VLS_ctx.dialogForm.resizable),
    fullscreen: (__VLS_ctx.dialogForm.fullscreen),
    showFullscreenButton: (__VLS_ctx.dialogForm.showFullscreenButton),
    showClose: (__VLS_ctx.dialogForm.showClose),
    showFooter: (__VLS_ctx.dialogForm.showFooter),
    showCancelButton: (__VLS_ctx.dialogForm.showCancelButton),
    showConfirmButton: (__VLS_ctx.dialogForm.showConfirmButton),
    confirmText: (__VLS_ctx.dialogForm.confirmText),
    cancelText: (__VLS_ctx.dialogForm.cancelText),
    showConfirmLoading: (__VLS_ctx.dialogForm.showConfirmLoading),
    closeIcon: (__VLS_ctx.dialogForm.closeIcon),
    closeIconSize: (__VLS_ctx.dialogForm.closeIconSize),
    fullscreenIcon: (__VLS_ctx.dialogForm.fullscreenIcon),
    fullscreenIconSize: (__VLS_ctx.dialogForm.fullscreenIconSize),
    exitFullscreenIcon: (__VLS_ctx.dialogForm.exitFullscreenIcon),
    exitFullscreenIconSize: (__VLS_ctx.dialogForm.exitFullscreenIconSize),
}, ...__VLS_functionalComponentArgsRest(__VLS_762));
let __VLS_766;
const __VLS_767 = {
    ...{ confirm: {} },
    onConfirm: (__VLS_ctx.handleConfirm),
    ...{ close: {} },
    onClose: (__VLS_ctx.handleClose),
};
const { default: __VLS_768 } = __VLS_764.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "dialog-content" },
});
/** @type {__VLS_StyleScopedClasses['dialog-content']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "feature-list" },
});
/** @type {__VLS_StyleScopedClasses['feature-list']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.h4, __VLS_intrinsics.h4)({
    ...{ style: {} },
});
__VLS_asFunctionalElement1(__VLS_intrinsics.ul, __VLS_intrinsics.ul)({
    ...{ style: {} },
});
__VLS_asFunctionalElement1(__VLS_intrinsics.li, __VLS_intrinsics.li)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.li, __VLS_intrinsics.li)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.li, __VLS_intrinsics.li)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.li, __VLS_intrinsics.li)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.li, __VLS_intrinsics.li)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.li, __VLS_intrinsics.li)({});
// @ts-ignore
[open, dialogForm, dialogForm, dialogForm, dialogForm, dialogForm, dialogForm, dialogForm, dialogForm, dialogForm, dialogForm, dialogForm, dialogForm, dialogForm, dialogForm, dialogForm, dialogForm, dialogForm, dialogForm, dialogForm, handleConfirm, handleClose,];
var __VLS_764;
var __VLS_765;
// @ts-ignore
[];
var __VLS_3;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
