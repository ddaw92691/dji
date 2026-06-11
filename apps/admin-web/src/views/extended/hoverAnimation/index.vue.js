/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { CopyDocument } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
defineOptions({ name: 'HoverAnimationView' });
const menuStore = useMenuStore();
const animationForm = ref({
    type: 'scale',
    duration: 300,
    intensity: 'normal',
    tag: 'div',
});
// 组件属性表格数据
const propsTableData = [
    {
        name: 'name',
        type: 'HoverAnimationName',
        default: "'scale'",
        description: '动画类型名称，可选值：jelly、bounce、rubber、elastic、scale、lift、tilt、rotate、flip、pulse、shake、wobble、swing、bell、magnet、squeeze、float',
    },
    {
        name: 'tag',
        type: 'string',
        default: "'div'",
        description: '组件渲染的 HTML 标签类型，如 div、span、button、a 等',
    },
    {
        name: 'duration',
        type: 'number',
        default: '300',
        description: '动画持续时长，单位：毫秒（ms）',
    },
    {
        name: 'intensity',
        type: "'light' | 'normal' | 'strong'",
        default: "'normal'",
        description: '动画强度，light 为轻微，normal 为正常，strong 为强烈',
    },
];
// 生成代码字符串
const generateCode = () => {
    const { type, duration, intensity, tag } = animationForm.value;
    const props = [`name="${type}"`];
    if (duration !== 300) {
        props.push(`:duration="${duration}"`);
    }
    if (intensity !== 'normal') {
        props.push(`intensity="${intensity}"`);
    }
    if (tag !== 'div') {
        props.push(`tag="${tag}"`);
    }
    return `<HoverAnimateWrapper ${props.join(' ')}>
  <div>内容</div>
</HoverAnimateWrapper>`;
};
// 复制代码到剪贴板
const copyCode = async () => {
    const code = generateCode();
    try {
        await navigator.clipboard.writeText(code);
        ElMessage.success('代码已复制到剪贴板');
    }
    catch {
        // 降级方案：使用传统方法
        const textarea = document.createElement('textarea');
        textarea.value = code;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        try {
            document.execCommand('copy');
            ElMessage.success('代码已复制到剪贴板');
        }
        catch {
            ElMessage.error('复制失败，请手动复制');
        }
        document.body.removeChild(textarea);
    }
};
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
    ...{ class: "hover-animation-doc-container" },
});
/** @type {__VLS_StyleScopedClasses['hover-animation-doc-container']} */ ;
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
    let __VLS_7;
    /** @ts-ignore @type { | typeof __VLS_components.elLink | typeof __VLS_components.ElLink | typeof __VLS_components['el-link'] | typeof __VLS_components.elLink | typeof __VLS_components.ElLink | typeof __VLS_components['el-link']} */
    elLink;
    // @ts-ignore
    const __VLS_8 = __VLS_asFunctionalComponent1(__VLS_7, new __VLS_7({
        href: "https://motion.vueuse.org/",
        target: "_blank",
        type: "primary",
        underline: (false),
    }));
    const __VLS_9 = __VLS_8({
        href: "https://motion.vueuse.org/",
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
    __VLS_asFunctionalElement1(__VLS_intrinsics.br)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.code, __VLS_intrinsics.code)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.code, __VLS_intrinsics.code)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.br)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.br)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        ...{ class: "description-text" },
    });
    /** @type {__VLS_StyleScopedClasses['description-text']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.code, __VLS_intrinsics.code)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.code, __VLS_intrinsics.code)({});
    let __VLS_13;
    /** @ts-ignore @type { | typeof __VLS_components.elLink | typeof __VLS_components.ElLink | typeof __VLS_components['el-link'] | typeof __VLS_components.elLink | typeof __VLS_components.ElLink | typeof __VLS_components['el-link']} */
    elLink;
    // @ts-ignore
    const __VLS_14 = __VLS_asFunctionalComponent1(__VLS_13, new __VLS_13({
        href: "https://github.com/DFANNN/DFAN-Admin/blob/main/src/components/animation/HoverAnimateWrapper.vue",
        target: "_blank",
        type: "primary",
        underline: (false),
    }));
    const __VLS_15 = __VLS_14({
        href: "https://github.com/DFANNN/DFAN-Admin/blob/main/src/components/animation/HoverAnimateWrapper.vue",
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
let __VLS_19;
/** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
elButton;
// @ts-ignore
const __VLS_20 = __VLS_asFunctionalComponent1(__VLS_19, new __VLS_19({
    ...{ 'onClick': {} },
    type: "primary",
    size: "small",
    icon: (__VLS_ctx.CopyDocument),
    ...{ style: {} },
}));
const __VLS_21 = __VLS_20({
    ...{ 'onClick': {} },
    type: "primary",
    size: "small",
    icon: (__VLS_ctx.CopyDocument),
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_20));
let __VLS_24;
const __VLS_25 = {
    ...{ click: {} },
    onClick: (__VLS_ctx.copyCode),
};
const { default: __VLS_26 } = __VLS_22.slots;
// @ts-ignore
[CopyDocument, copyCode,];
var __VLS_22;
var __VLS_23;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "preview-content" },
});
/** @type {__VLS_StyleScopedClasses['preview-content']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "preview-wrapper" },
});
/** @type {__VLS_StyleScopedClasses['preview-wrapper']} */ ;
let __VLS_27;
/** @ts-ignore @type { | typeof __VLS_components.HoverAnimateWrapper | typeof __VLS_components.HoverAnimateWrapper} */
HoverAnimateWrapper;
// @ts-ignore
const __VLS_28 = __VLS_asFunctionalComponent1(__VLS_27, new __VLS_27({
    name: (__VLS_ctx.animationForm.type),
    duration: (__VLS_ctx.animationForm.duration),
    intensity: (__VLS_ctx.animationForm.intensity),
    tag: (__VLS_ctx.animationForm.tag),
}));
const __VLS_29 = __VLS_28({
    name: (__VLS_ctx.animationForm.type),
    duration: (__VLS_ctx.animationForm.duration),
    intensity: (__VLS_ctx.animationForm.intensity),
    tag: (__VLS_ctx.animationForm.tag),
}, ...__VLS_functionalComponentArgsRest(__VLS_28));
const { default: __VLS_32 } = __VLS_30.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "preview-svg-container" },
});
/** @type {__VLS_StyleScopedClasses['preview-svg-container']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.img)({
    src: "@/assets/logo.svg",
    alt: "Logo",
    ...{ class: "preview-logo" },
});
/** @type {__VLS_StyleScopedClasses['preview-logo']} */ ;
// @ts-ignore
[animationForm, animationForm, animationForm, animationForm,];
var __VLS_30;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "preview-hint" },
});
/** @type {__VLS_StyleScopedClasses['preview-hint']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({});
let __VLS_33;
/** @ts-ignore @type { | typeof __VLS_components.elDivider | typeof __VLS_components.ElDivider | typeof __VLS_components['el-divider']} */
elDivider;
// @ts-ignore
const __VLS_34 = __VLS_asFunctionalComponent1(__VLS_33, new __VLS_33({}));
const __VLS_35 = __VLS_34({}, ...__VLS_functionalComponentArgsRest(__VLS_34));
let __VLS_38;
/** @ts-ignore @type { | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form'] | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form']} */
elForm;
// @ts-ignore
const __VLS_39 = __VLS_asFunctionalComponent1(__VLS_38, new __VLS_38({
    model: (__VLS_ctx.animationForm),
    labelWidth: "auto",
}));
const __VLS_40 = __VLS_39({
    model: (__VLS_ctx.animationForm),
    labelWidth: "auto",
}, ...__VLS_functionalComponentArgsRest(__VLS_39));
const { default: __VLS_43 } = __VLS_41.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "form-section" },
});
/** @type {__VLS_StyleScopedClasses['form-section']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "section-title" },
});
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
let __VLS_44;
/** @ts-ignore @type { | typeof __VLS_components.elRow | typeof __VLS_components.ElRow | typeof __VLS_components['el-row'] | typeof __VLS_components.elRow | typeof __VLS_components.ElRow | typeof __VLS_components['el-row']} */
elRow;
// @ts-ignore
const __VLS_45 = __VLS_asFunctionalComponent1(__VLS_44, new __VLS_44({
    gutter: (20),
}));
const __VLS_46 = __VLS_45({
    gutter: (20),
}, ...__VLS_functionalComponentArgsRest(__VLS_45));
const { default: __VLS_49 } = __VLS_47.slots;
let __VLS_50;
/** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
elCol;
// @ts-ignore
const __VLS_51 = __VLS_asFunctionalComponent1(__VLS_50, new __VLS_50({
    xs: (24),
    sm: (12),
    md: (12),
    lg: (8),
    xl: (8),
}));
const __VLS_52 = __VLS_51({
    xs: (24),
    sm: (12),
    md: (12),
    lg: (8),
    xl: (8),
}, ...__VLS_functionalComponentArgsRest(__VLS_51));
const { default: __VLS_55 } = __VLS_53.slots;
let __VLS_56;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_57 = __VLS_asFunctionalComponent1(__VLS_56, new __VLS_56({
    prop: "type",
}));
const __VLS_58 = __VLS_57({
    prop: "type",
}, ...__VLS_functionalComponentArgsRest(__VLS_57));
const { default: __VLS_61 } = __VLS_59.slots;
{
    const { label: __VLS_62 } = __VLS_59.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "label-with-tooltip" },
    });
    /** @type {__VLS_StyleScopedClasses['label-with-tooltip']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    let __VLS_63;
    /** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
    elTooltip;
    // @ts-ignore
    const __VLS_64 = __VLS_asFunctionalComponent1(__VLS_63, new __VLS_63({
        content: "选择要使用的动画效果类型，共 17 种内置动画可选",
        placement: "top",
    }));
    const __VLS_65 = __VLS_64({
        content: "选择要使用的动画效果类型，共 17 种内置动画可选",
        placement: "top",
    }, ...__VLS_functionalComponentArgsRest(__VLS_64));
    const { default: __VLS_68 } = __VLS_66.slots;
    let __VLS_69;
    /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
    elIcon;
    // @ts-ignore
    const __VLS_70 = __VLS_asFunctionalComponent1(__VLS_69, new __VLS_69({
        ...{ class: "label-tooltip-icon" },
    }));
    const __VLS_71 = __VLS_70({
        ...{ class: "label-tooltip-icon" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_70));
    /** @type {__VLS_StyleScopedClasses['label-tooltip-icon']} */ ;
    const { default: __VLS_74 } = __VLS_72.slots;
    const __VLS_75 = (__VLS_ctx.menuStore.iconComponents['HOutline:QuestionMarkCircleIcon']);
    // @ts-ignore
    const __VLS_76 = __VLS_asFunctionalComponent1(__VLS_75, new __VLS_75({}));
    const __VLS_77 = __VLS_76({}, ...__VLS_functionalComponentArgsRest(__VLS_76));
    // @ts-ignore
    [animationForm, menuStore,];
    var __VLS_72;
    // @ts-ignore
    [];
    var __VLS_66;
    // @ts-ignore
    [];
}
let __VLS_80;
/** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
elSelect;
// @ts-ignore
const __VLS_81 = __VLS_asFunctionalComponent1(__VLS_80, new __VLS_80({
    modelValue: (__VLS_ctx.animationForm.type),
    ...{ style: {} },
}));
const __VLS_82 = __VLS_81({
    modelValue: (__VLS_ctx.animationForm.type),
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_81));
const { default: __VLS_85 } = __VLS_83.slots;
let __VLS_86;
/** @ts-ignore @type { | typeof __VLS_components.elOptionGroup | typeof __VLS_components.ElOptionGroup | typeof __VLS_components['el-option-group'] | typeof __VLS_components.elOptionGroup | typeof __VLS_components.ElOptionGroup | typeof __VLS_components['el-option-group']} */
elOptionGroup;
// @ts-ignore
const __VLS_87 = __VLS_asFunctionalComponent1(__VLS_86, new __VLS_86({
    label: "基础动画",
}));
const __VLS_88 = __VLS_87({
    label: "基础动画",
}, ...__VLS_functionalComponentArgsRest(__VLS_87));
const { default: __VLS_91 } = __VLS_89.slots;
let __VLS_92;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_93 = __VLS_asFunctionalComponent1(__VLS_92, new __VLS_92({
    label: "scale（缩放效果）",
    value: "scale",
}));
const __VLS_94 = __VLS_93({
    label: "scale（缩放效果）",
    value: "scale",
}, ...__VLS_functionalComponentArgsRest(__VLS_93));
let __VLS_97;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_98 = __VLS_asFunctionalComponent1(__VLS_97, new __VLS_97({
    label: "lift（抬起效果）",
    value: "lift",
}));
const __VLS_99 = __VLS_98({
    label: "lift（抬起效果）",
    value: "lift",
}, ...__VLS_functionalComponentArgsRest(__VLS_98));
let __VLS_102;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_103 = __VLS_asFunctionalComponent1(__VLS_102, new __VLS_102({
    label: "tilt（倾斜效果）",
    value: "tilt",
}));
const __VLS_104 = __VLS_103({
    label: "tilt（倾斜效果）",
    value: "tilt",
}, ...__VLS_functionalComponentArgsRest(__VLS_103));
let __VLS_107;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_108 = __VLS_asFunctionalComponent1(__VLS_107, new __VLS_107({
    label: "rotate（旋转效果）",
    value: "rotate",
}));
const __VLS_109 = __VLS_108({
    label: "rotate（旋转效果）",
    value: "rotate",
}, ...__VLS_functionalComponentArgsRest(__VLS_108));
let __VLS_112;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_113 = __VLS_asFunctionalComponent1(__VLS_112, new __VLS_112({
    label: "flip（翻转效果）",
    value: "flip",
}));
const __VLS_114 = __VLS_113({
    label: "flip（翻转效果）",
    value: "flip",
}, ...__VLS_functionalComponentArgsRest(__VLS_113));
// @ts-ignore
[animationForm,];
var __VLS_89;
let __VLS_117;
/** @ts-ignore @type { | typeof __VLS_components.elOptionGroup | typeof __VLS_components.ElOptionGroup | typeof __VLS_components['el-option-group'] | typeof __VLS_components.elOptionGroup | typeof __VLS_components.ElOptionGroup | typeof __VLS_components['el-option-group']} */
elOptionGroup;
// @ts-ignore
const __VLS_118 = __VLS_asFunctionalComponent1(__VLS_117, new __VLS_117({
    label: "弹性动画",
}));
const __VLS_119 = __VLS_118({
    label: "弹性动画",
}, ...__VLS_functionalComponentArgsRest(__VLS_118));
const { default: __VLS_122 } = __VLS_120.slots;
let __VLS_123;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_124 = __VLS_asFunctionalComponent1(__VLS_123, new __VLS_123({
    label: "jelly（果冻效果）",
    value: "jelly",
}));
const __VLS_125 = __VLS_124({
    label: "jelly（果冻效果）",
    value: "jelly",
}, ...__VLS_functionalComponentArgsRest(__VLS_124));
let __VLS_128;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_129 = __VLS_asFunctionalComponent1(__VLS_128, new __VLS_128({
    label: "bounce（弹跳效果）",
    value: "bounce",
}));
const __VLS_130 = __VLS_129({
    label: "bounce（弹跳效果）",
    value: "bounce",
}, ...__VLS_functionalComponentArgsRest(__VLS_129));
let __VLS_133;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_134 = __VLS_asFunctionalComponent1(__VLS_133, new __VLS_133({
    label: "rubber（橡胶效果）",
    value: "rubber",
}));
const __VLS_135 = __VLS_134({
    label: "rubber（橡胶效果）",
    value: "rubber",
}, ...__VLS_functionalComponentArgsRest(__VLS_134));
let __VLS_138;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_139 = __VLS_asFunctionalComponent1(__VLS_138, new __VLS_138({
    label: "elastic（弹性效果）",
    value: "elastic",
}));
const __VLS_140 = __VLS_139({
    label: "elastic（弹性效果）",
    value: "elastic",
}, ...__VLS_functionalComponentArgsRest(__VLS_139));
// @ts-ignore
[];
var __VLS_120;
let __VLS_143;
/** @ts-ignore @type { | typeof __VLS_components.elOptionGroup | typeof __VLS_components.ElOptionGroup | typeof __VLS_components['el-option-group'] | typeof __VLS_components.elOptionGroup | typeof __VLS_components.ElOptionGroup | typeof __VLS_components['el-option-group']} */
elOptionGroup;
// @ts-ignore
const __VLS_144 = __VLS_asFunctionalComponent1(__VLS_143, new __VLS_143({
    label: "动感动画",
}));
const __VLS_145 = __VLS_144({
    label: "动感动画",
}, ...__VLS_functionalComponentArgsRest(__VLS_144));
const { default: __VLS_148 } = __VLS_146.slots;
let __VLS_149;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_150 = __VLS_asFunctionalComponent1(__VLS_149, new __VLS_149({
    label: "pulse（脉冲效果）",
    value: "pulse",
}));
const __VLS_151 = __VLS_150({
    label: "pulse（脉冲效果）",
    value: "pulse",
}, ...__VLS_functionalComponentArgsRest(__VLS_150));
let __VLS_154;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_155 = __VLS_asFunctionalComponent1(__VLS_154, new __VLS_154({
    label: "shake（震动效果）",
    value: "shake",
}));
const __VLS_156 = __VLS_155({
    label: "shake（震动效果）",
    value: "shake",
}, ...__VLS_functionalComponentArgsRest(__VLS_155));
let __VLS_159;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_160 = __VLS_asFunctionalComponent1(__VLS_159, new __VLS_159({
    label: "wobble（摆动效果）",
    value: "wobble",
}));
const __VLS_161 = __VLS_160({
    label: "wobble（摆动效果）",
    value: "wobble",
}, ...__VLS_functionalComponentArgsRest(__VLS_160));
let __VLS_164;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_165 = __VLS_asFunctionalComponent1(__VLS_164, new __VLS_164({
    label: "swing（摇摆效果）",
    value: "swing",
}));
const __VLS_166 = __VLS_165({
    label: "swing（摇摆效果）",
    value: "swing",
}, ...__VLS_functionalComponentArgsRest(__VLS_165));
let __VLS_169;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_170 = __VLS_asFunctionalComponent1(__VLS_169, new __VLS_169({
    label: "bell（摇铃效果）",
    value: "bell",
}));
const __VLS_171 = __VLS_170({
    label: "bell（摇铃效果）",
    value: "bell",
}, ...__VLS_functionalComponentArgsRest(__VLS_170));
let __VLS_174;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_175 = __VLS_asFunctionalComponent1(__VLS_174, new __VLS_174({
    label: "magnet（磁吸效果）",
    value: "magnet",
}));
const __VLS_176 = __VLS_175({
    label: "magnet（磁吸效果）",
    value: "magnet",
}, ...__VLS_functionalComponentArgsRest(__VLS_175));
let __VLS_179;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_180 = __VLS_asFunctionalComponent1(__VLS_179, new __VLS_179({
    label: "squeeze（挤压效果）",
    value: "squeeze",
}));
const __VLS_181 = __VLS_180({
    label: "squeeze（挤压效果）",
    value: "squeeze",
}, ...__VLS_functionalComponentArgsRest(__VLS_180));
let __VLS_184;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_185 = __VLS_asFunctionalComponent1(__VLS_184, new __VLS_184({
    label: "float（漂浮效果）",
    value: "float",
}));
const __VLS_186 = __VLS_185({
    label: "float（漂浮效果）",
    value: "float",
}, ...__VLS_functionalComponentArgsRest(__VLS_185));
// @ts-ignore
[];
var __VLS_146;
// @ts-ignore
[];
var __VLS_83;
// @ts-ignore
[];
var __VLS_59;
// @ts-ignore
[];
var __VLS_53;
let __VLS_189;
/** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
elCol;
// @ts-ignore
const __VLS_190 = __VLS_asFunctionalComponent1(__VLS_189, new __VLS_189({
    xs: (24),
    sm: (12),
    md: (12),
    lg: (8),
    xl: (8),
}));
const __VLS_191 = __VLS_190({
    xs: (24),
    sm: (12),
    md: (12),
    lg: (8),
    xl: (8),
}, ...__VLS_functionalComponentArgsRest(__VLS_190));
const { default: __VLS_194 } = __VLS_192.slots;
let __VLS_195;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_196 = __VLS_asFunctionalComponent1(__VLS_195, new __VLS_195({
    prop: "duration",
}));
const __VLS_197 = __VLS_196({
    prop: "duration",
}, ...__VLS_functionalComponentArgsRest(__VLS_196));
const { default: __VLS_200 } = __VLS_198.slots;
{
    const { label: __VLS_201 } = __VLS_198.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "label-with-tooltip" },
    });
    /** @type {__VLS_StyleScopedClasses['label-with-tooltip']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    let __VLS_202;
    /** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
    elTooltip;
    // @ts-ignore
    const __VLS_203 = __VLS_asFunctionalComponent1(__VLS_202, new __VLS_202({
        content: "动画持续的时间，单位：毫秒，默认：300",
        placement: "top",
    }));
    const __VLS_204 = __VLS_203({
        content: "动画持续的时间，单位：毫秒，默认：300",
        placement: "top",
    }, ...__VLS_functionalComponentArgsRest(__VLS_203));
    const { default: __VLS_207 } = __VLS_205.slots;
    let __VLS_208;
    /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
    elIcon;
    // @ts-ignore
    const __VLS_209 = __VLS_asFunctionalComponent1(__VLS_208, new __VLS_208({
        ...{ class: "label-tooltip-icon" },
    }));
    const __VLS_210 = __VLS_209({
        ...{ class: "label-tooltip-icon" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_209));
    /** @type {__VLS_StyleScopedClasses['label-tooltip-icon']} */ ;
    const { default: __VLS_213 } = __VLS_211.slots;
    const __VLS_214 = (__VLS_ctx.menuStore.iconComponents['HOutline:QuestionMarkCircleIcon']);
    // @ts-ignore
    const __VLS_215 = __VLS_asFunctionalComponent1(__VLS_214, new __VLS_214({}));
    const __VLS_216 = __VLS_215({}, ...__VLS_functionalComponentArgsRest(__VLS_215));
    // @ts-ignore
    [menuStore,];
    var __VLS_211;
    // @ts-ignore
    [];
    var __VLS_205;
    // @ts-ignore
    [];
}
let __VLS_219;
/** @ts-ignore @type { | typeof __VLS_components.elInputNumber | typeof __VLS_components.ElInputNumber | typeof __VLS_components['el-input-number']} */
elInputNumber;
// @ts-ignore
const __VLS_220 = __VLS_asFunctionalComponent1(__VLS_219, new __VLS_219({
    modelValue: (__VLS_ctx.animationForm.duration),
    min: (100),
    max: (2000),
    step: (50),
    ...{ style: {} },
}));
const __VLS_221 = __VLS_220({
    modelValue: (__VLS_ctx.animationForm.duration),
    min: (100),
    max: (2000),
    step: (50),
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_220));
// @ts-ignore
[animationForm,];
var __VLS_198;
// @ts-ignore
[];
var __VLS_192;
let __VLS_224;
/** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
elCol;
// @ts-ignore
const __VLS_225 = __VLS_asFunctionalComponent1(__VLS_224, new __VLS_224({
    xs: (24),
    sm: (12),
    md: (12),
    lg: (8),
    xl: (8),
}));
const __VLS_226 = __VLS_225({
    xs: (24),
    sm: (12),
    md: (12),
    lg: (8),
    xl: (8),
}, ...__VLS_functionalComponentArgsRest(__VLS_225));
const { default: __VLS_229 } = __VLS_227.slots;
let __VLS_230;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_231 = __VLS_asFunctionalComponent1(__VLS_230, new __VLS_230({
    prop: "intensity",
}));
const __VLS_232 = __VLS_231({
    prop: "intensity",
}, ...__VLS_functionalComponentArgsRest(__VLS_231));
const { default: __VLS_235 } = __VLS_233.slots;
{
    const { label: __VLS_236 } = __VLS_233.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "label-with-tooltip" },
    });
    /** @type {__VLS_StyleScopedClasses['label-with-tooltip']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    let __VLS_237;
    /** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
    elTooltip;
    // @ts-ignore
    const __VLS_238 = __VLS_asFunctionalComponent1(__VLS_237, new __VLS_237({
        content: "控制动画的强度，light: 轻微，normal: 正常，strong: 强烈，默认：normal",
        placement: "top",
    }));
    const __VLS_239 = __VLS_238({
        content: "控制动画的强度，light: 轻微，normal: 正常，strong: 强烈，默认：normal",
        placement: "top",
    }, ...__VLS_functionalComponentArgsRest(__VLS_238));
    const { default: __VLS_242 } = __VLS_240.slots;
    let __VLS_243;
    /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
    elIcon;
    // @ts-ignore
    const __VLS_244 = __VLS_asFunctionalComponent1(__VLS_243, new __VLS_243({
        ...{ class: "label-tooltip-icon" },
    }));
    const __VLS_245 = __VLS_244({
        ...{ class: "label-tooltip-icon" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_244));
    /** @type {__VLS_StyleScopedClasses['label-tooltip-icon']} */ ;
    const { default: __VLS_248 } = __VLS_246.slots;
    const __VLS_249 = (__VLS_ctx.menuStore.iconComponents['HOutline:QuestionMarkCircleIcon']);
    // @ts-ignore
    const __VLS_250 = __VLS_asFunctionalComponent1(__VLS_249, new __VLS_249({}));
    const __VLS_251 = __VLS_250({}, ...__VLS_functionalComponentArgsRest(__VLS_250));
    // @ts-ignore
    [menuStore,];
    var __VLS_246;
    // @ts-ignore
    [];
    var __VLS_240;
    // @ts-ignore
    [];
}
let __VLS_254;
/** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
elSelect;
// @ts-ignore
const __VLS_255 = __VLS_asFunctionalComponent1(__VLS_254, new __VLS_254({
    modelValue: (__VLS_ctx.animationForm.intensity),
    ...{ style: {} },
}));
const __VLS_256 = __VLS_255({
    modelValue: (__VLS_ctx.animationForm.intensity),
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_255));
const { default: __VLS_259 } = __VLS_257.slots;
let __VLS_260;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_261 = __VLS_asFunctionalComponent1(__VLS_260, new __VLS_260({
    label: "light（轻微）",
    value: "light",
}));
const __VLS_262 = __VLS_261({
    label: "light（轻微）",
    value: "light",
}, ...__VLS_functionalComponentArgsRest(__VLS_261));
let __VLS_265;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_266 = __VLS_asFunctionalComponent1(__VLS_265, new __VLS_265({
    label: "normal（正常）",
    value: "normal",
}));
const __VLS_267 = __VLS_266({
    label: "normal（正常）",
    value: "normal",
}, ...__VLS_functionalComponentArgsRest(__VLS_266));
let __VLS_270;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_271 = __VLS_asFunctionalComponent1(__VLS_270, new __VLS_270({
    label: "strong（强烈）",
    value: "strong",
}));
const __VLS_272 = __VLS_271({
    label: "strong（强烈）",
    value: "strong",
}, ...__VLS_functionalComponentArgsRest(__VLS_271));
// @ts-ignore
[animationForm,];
var __VLS_257;
// @ts-ignore
[];
var __VLS_233;
// @ts-ignore
[];
var __VLS_227;
let __VLS_275;
/** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
elCol;
// @ts-ignore
const __VLS_276 = __VLS_asFunctionalComponent1(__VLS_275, new __VLS_275({
    xs: (24),
    sm: (12),
    md: (12),
    lg: (8),
    xl: (8),
}));
const __VLS_277 = __VLS_276({
    xs: (24),
    sm: (12),
    md: (12),
    lg: (8),
    xl: (8),
}, ...__VLS_functionalComponentArgsRest(__VLS_276));
const { default: __VLS_280 } = __VLS_278.slots;
let __VLS_281;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_282 = __VLS_asFunctionalComponent1(__VLS_281, new __VLS_281({
    prop: "tag",
}));
const __VLS_283 = __VLS_282({
    prop: "tag",
}, ...__VLS_functionalComponentArgsRest(__VLS_282));
const { default: __VLS_286 } = __VLS_284.slots;
{
    const { label: __VLS_287 } = __VLS_284.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "label-with-tooltip" },
    });
    /** @type {__VLS_StyleScopedClasses['label-with-tooltip']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    let __VLS_288;
    /** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
    elTooltip;
    // @ts-ignore
    const __VLS_289 = __VLS_asFunctionalComponent1(__VLS_288, new __VLS_288({
        content: "组件渲染的 HTML 标签类型，默认：div",
        placement: "top",
    }));
    const __VLS_290 = __VLS_289({
        content: "组件渲染的 HTML 标签类型，默认：div",
        placement: "top",
    }, ...__VLS_functionalComponentArgsRest(__VLS_289));
    const { default: __VLS_293 } = __VLS_291.slots;
    let __VLS_294;
    /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
    elIcon;
    // @ts-ignore
    const __VLS_295 = __VLS_asFunctionalComponent1(__VLS_294, new __VLS_294({
        ...{ class: "label-tooltip-icon" },
    }));
    const __VLS_296 = __VLS_295({
        ...{ class: "label-tooltip-icon" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_295));
    /** @type {__VLS_StyleScopedClasses['label-tooltip-icon']} */ ;
    const { default: __VLS_299 } = __VLS_297.slots;
    const __VLS_300 = (__VLS_ctx.menuStore.iconComponents['HOutline:QuestionMarkCircleIcon']);
    // @ts-ignore
    const __VLS_301 = __VLS_asFunctionalComponent1(__VLS_300, new __VLS_300({}));
    const __VLS_302 = __VLS_301({}, ...__VLS_functionalComponentArgsRest(__VLS_301));
    // @ts-ignore
    [menuStore,];
    var __VLS_297;
    // @ts-ignore
    [];
    var __VLS_291;
    // @ts-ignore
    [];
}
let __VLS_305;
/** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
elSelect;
// @ts-ignore
const __VLS_306 = __VLS_asFunctionalComponent1(__VLS_305, new __VLS_305({
    modelValue: (__VLS_ctx.animationForm.tag),
    ...{ style: {} },
}));
const __VLS_307 = __VLS_306({
    modelValue: (__VLS_ctx.animationForm.tag),
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_306));
const { default: __VLS_310 } = __VLS_308.slots;
let __VLS_311;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_312 = __VLS_asFunctionalComponent1(__VLS_311, new __VLS_311({
    label: "div",
    value: "div",
}));
const __VLS_313 = __VLS_312({
    label: "div",
    value: "div",
}, ...__VLS_functionalComponentArgsRest(__VLS_312));
let __VLS_316;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_317 = __VLS_asFunctionalComponent1(__VLS_316, new __VLS_316({
    label: "span",
    value: "span",
}));
const __VLS_318 = __VLS_317({
    label: "span",
    value: "span",
}, ...__VLS_functionalComponentArgsRest(__VLS_317));
let __VLS_321;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_322 = __VLS_asFunctionalComponent1(__VLS_321, new __VLS_321({
    label: "button",
    value: "button",
}));
const __VLS_323 = __VLS_322({
    label: "button",
    value: "button",
}, ...__VLS_functionalComponentArgsRest(__VLS_322));
let __VLS_326;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_327 = __VLS_asFunctionalComponent1(__VLS_326, new __VLS_326({
    label: "a",
    value: "a",
}));
const __VLS_328 = __VLS_327({
    label: "a",
    value: "a",
}, ...__VLS_functionalComponentArgsRest(__VLS_327));
// @ts-ignore
[animationForm,];
var __VLS_308;
// @ts-ignore
[];
var __VLS_284;
// @ts-ignore
[];
var __VLS_278;
// @ts-ignore
[];
var __VLS_47;
// @ts-ignore
[];
var __VLS_41;
let __VLS_331;
/** @ts-ignore @type { | typeof __VLS_components.elDivider | typeof __VLS_components.ElDivider | typeof __VLS_components['el-divider']} */
elDivider;
// @ts-ignore
const __VLS_332 = __VLS_asFunctionalComponent1(__VLS_331, new __VLS_331({}));
const __VLS_333 = __VLS_332({}, ...__VLS_functionalComponentArgsRest(__VLS_332));
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
__VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
    ...{ class: "usage-description" },
});
/** @type {__VLS_StyleScopedClasses['usage-description']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.code, __VLS_intrinsics.code)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.code, __VLS_intrinsics.code)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.code, __VLS_intrinsics.code)({});
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
    ...{ class: "comparison-table" },
});
/** @type {__VLS_StyleScopedClasses['comparison-table']} */ ;
let __VLS_336;
/** @ts-ignore @type { | typeof __VLS_components.elTable | typeof __VLS_components.ElTable | typeof __VLS_components['el-table'] | typeof __VLS_components.elTable | typeof __VLS_components.ElTable | typeof __VLS_components['el-table']} */
elTable;
// @ts-ignore
const __VLS_337 = __VLS_asFunctionalComponent1(__VLS_336, new __VLS_336({
    data: (__VLS_ctx.propsTableData),
    border: true,
    ...{ style: {} },
}));
const __VLS_338 = __VLS_337({
    data: (__VLS_ctx.propsTableData),
    border: true,
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_337));
const { default: __VLS_341 } = __VLS_339.slots;
let __VLS_342;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_343 = __VLS_asFunctionalComponent1(__VLS_342, new __VLS_342({
    prop: "name",
    label: "属性名",
    width: "120",
}));
const __VLS_344 = __VLS_343({
    prop: "name",
    label: "属性名",
    width: "120",
}, ...__VLS_functionalComponentArgsRest(__VLS_343));
const { default: __VLS_347 } = __VLS_345.slots;
{
    const { default: __VLS_348 } = __VLS_345.slots;
    const [{ row }] = __VLS_vSlot(__VLS_348);
    __VLS_asFunctionalElement1(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({});
    (row.name);
    // @ts-ignore
    [propsTableData,];
}
// @ts-ignore
[];
var __VLS_345;
let __VLS_349;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_350 = __VLS_asFunctionalComponent1(__VLS_349, new __VLS_349({
    prop: "type",
    label: "类型",
    width: "200",
}));
const __VLS_351 = __VLS_350({
    prop: "type",
    label: "类型",
    width: "200",
}, ...__VLS_functionalComponentArgsRest(__VLS_350));
const { default: __VLS_354 } = __VLS_352.slots;
{
    const { default: __VLS_355 } = __VLS_352.slots;
    const [{ row }] = __VLS_vSlot(__VLS_355);
    __VLS_asFunctionalElement1(__VLS_intrinsics.code, __VLS_intrinsics.code)({});
    (row.type);
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_352;
let __VLS_356;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_357 = __VLS_asFunctionalComponent1(__VLS_356, new __VLS_356({
    prop: "default",
    label: "默认值",
    width: "120",
}));
const __VLS_358 = __VLS_357({
    prop: "default",
    label: "默认值",
    width: "120",
}, ...__VLS_functionalComponentArgsRest(__VLS_357));
const { default: __VLS_361 } = __VLS_359.slots;
{
    const { default: __VLS_362 } = __VLS_359.slots;
    const [{ row }] = __VLS_vSlot(__VLS_362);
    __VLS_asFunctionalElement1(__VLS_intrinsics.code, __VLS_intrinsics.code)({});
    (row.default);
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_359;
let __VLS_363;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_364 = __VLS_asFunctionalComponent1(__VLS_363, new __VLS_363({
    prop: "description",
    label: "说明",
    minWidth: "200",
}));
const __VLS_365 = __VLS_364({
    prop: "description",
    label: "说明",
    minWidth: "200",
}, ...__VLS_functionalComponentArgsRest(__VLS_364));
// @ts-ignore
[];
var __VLS_339;
// @ts-ignore
[];
var __VLS_3;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
