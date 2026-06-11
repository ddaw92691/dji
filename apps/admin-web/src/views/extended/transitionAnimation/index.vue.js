/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { CopyDocument } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
defineOptions({ name: 'TransitionAnimationView' });
const menuStore = useMenuStore();
const animationForm = ref({
    type: 'fade-slide',
    duration: 0.3,
    delay: 0,
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
    mode: 'default',
});
const showLogo = ref(true);
// CSS 变量属性表格数据
const cssVarsTableData = [
    {
        name: '--animation-duration',
        type: 'string',
        default: '0.3s',
        description: '动画持续时长，单位：秒（s），默认：0.3s',
    },
    {
        name: '--animation-delay',
        type: 'string',
        default: '0s',
        description: '动画开始前的延迟时间，单位：秒（s），默认：0s',
    },
    {
        name: '--animation-easing',
        type: 'string',
        default: 'cubic-bezier(0.4, 0, 0.2, 1)',
        description: '动画的缓动函数，控制动画的速度曲线，可以使用 CSS 缓动函数',
    },
];
// 计算动画样式，通过 CSS 变量传递动画参数
const animationStyle = computed(() => {
    return {
        '--animation-duration': `${animationForm.value.duration}s`,
        '--animation-delay': `${animationForm.value.delay}s`,
        '--animation-easing': animationForm.value.easing,
    };
});
const toggleLogo = () => {
    showLogo.value = !showLogo.value;
};
const resetAnimation = () => {
    showLogo.value = false;
    setTimeout(() => {
        showLogo.value = true;
    }, 100);
};
// 生成代码字符串
const generateCode = () => {
    const { type, duration, delay, easing, mode } = animationForm.value;
    // 构建 style 对象字符串
    const styleProps = [];
    if (duration !== 0.3) {
        styleProps.push(`'--animation-duration': '${duration}s'`);
    }
    if (delay !== 0) {
        styleProps.push(`'--animation-delay': '${delay}s'`);
    }
    if (easing !== 'cubic-bezier(0.4, 0, 0.2, 1)') {
        styleProps.push(`'--animation-easing': '${easing}'`);
    }
    const styleStr = styleProps.length > 0 ? ` :style="{ ${styleProps.join(', ')} }"` : '';
    const modeStr = mode !== 'default' ? ` mode="${mode}"` : '';
    return `<Transition name="${type}"${modeStr}${styleStr}>
    <div v-if="show">内容</div>
  </Transition>`;
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
    ...{ class: "transition-animation-doc-container" },
});
/** @type {__VLS_StyleScopedClasses['transition-animation-doc-container']} */ ;
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
    __VLS_asFunctionalElement1(__VLS_intrinsics.code, __VLS_intrinsics.code)({});
    let __VLS_7;
    /** @ts-ignore @type { | typeof __VLS_components.elLink | typeof __VLS_components.ElLink | typeof __VLS_components['el-link'] | typeof __VLS_components.elLink | typeof __VLS_components.ElLink | typeof __VLS_components['el-link']} */
    elLink;
    // @ts-ignore
    const __VLS_8 = __VLS_asFunctionalComponent1(__VLS_7, new __VLS_7({
        href: "https://cn.vuejs.org/guide/built-ins/transition.html",
        target: "_blank",
        type: "primary",
        underline: (false),
    }));
    const __VLS_9 = __VLS_8({
        href: "https://cn.vuejs.org/guide/built-ins/transition.html",
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
    let __VLS_13;
    /** @ts-ignore @type { | typeof __VLS_components.elLink | typeof __VLS_components.ElLink | typeof __VLS_components['el-link'] | typeof __VLS_components.elLink | typeof __VLS_components.ElLink | typeof __VLS_components['el-link']} */
    elLink;
    // @ts-ignore
    const __VLS_14 = __VLS_asFunctionalComponent1(__VLS_13, new __VLS_13({
        href: "https://github.com/DFANNN/DFAN-Admin/blob/main/src/styles/transitionAnimation.css",
        target: "_blank",
        type: "primary",
        underline: (false),
    }));
    const __VLS_15 = __VLS_14({
        href: "https://github.com/DFANNN/DFAN-Admin/blob/main/src/styles/transitionAnimation.css",
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
/** @ts-ignore @type { | typeof __VLS_components.Transition | typeof __VLS_components.Transition} */
Transition;
// @ts-ignore
const __VLS_28 = __VLS_asFunctionalComponent1(__VLS_27, new __VLS_27({
    name: (__VLS_ctx.animationForm.type),
    mode: (__VLS_ctx.animationForm.mode === 'default' ? undefined : __VLS_ctx.animationForm.mode),
    ...{ style: (__VLS_ctx.animationStyle) },
}));
const __VLS_29 = __VLS_28({
    name: (__VLS_ctx.animationForm.type),
    mode: (__VLS_ctx.animationForm.mode === 'default' ? undefined : __VLS_ctx.animationForm.mode),
    ...{ style: (__VLS_ctx.animationStyle) },
}, ...__VLS_functionalComponentArgsRest(__VLS_28));
const { default: __VLS_32 } = __VLS_30.slots;
if (__VLS_ctx.showLogo) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "logo-container" },
    });
    /** @type {__VLS_StyleScopedClasses['logo-container']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.img)({
        src: "@/assets/logo.svg",
        alt: "Logo",
        ...{ class: "preview-logo" },
    });
    /** @type {__VLS_StyleScopedClasses['preview-logo']} */ ;
}
// @ts-ignore
[animationForm, animationForm, animationForm, animationStyle, showLogo,];
var __VLS_30;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "preview-controls" },
});
/** @type {__VLS_StyleScopedClasses['preview-controls']} */ ;
let __VLS_33;
/** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
elButton;
// @ts-ignore
const __VLS_34 = __VLS_asFunctionalComponent1(__VLS_33, new __VLS_33({
    ...{ 'onClick': {} },
    type: "primary",
}));
const __VLS_35 = __VLS_34({
    ...{ 'onClick': {} },
    type: "primary",
}, ...__VLS_functionalComponentArgsRest(__VLS_34));
let __VLS_38;
const __VLS_39 = {
    ...{ click: {} },
    onClick: (__VLS_ctx.toggleLogo),
};
const { default: __VLS_40 } = __VLS_36.slots;
(__VLS_ctx.showLogo ? '隐藏 Logo' : '显示 Logo');
// @ts-ignore
[showLogo, toggleLogo,];
var __VLS_36;
var __VLS_37;
let __VLS_41;
/** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
elButton;
// @ts-ignore
const __VLS_42 = __VLS_asFunctionalComponent1(__VLS_41, new __VLS_41({
    ...{ 'onClick': {} },
}));
const __VLS_43 = __VLS_42({
    ...{ 'onClick': {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_42));
let __VLS_46;
const __VLS_47 = {
    ...{ click: {} },
    onClick: (__VLS_ctx.resetAnimation),
};
const { default: __VLS_48 } = __VLS_44.slots;
// @ts-ignore
[resetAnimation,];
var __VLS_44;
var __VLS_45;
let __VLS_49;
/** @ts-ignore @type { | typeof __VLS_components.elDivider | typeof __VLS_components.ElDivider | typeof __VLS_components['el-divider']} */
elDivider;
// @ts-ignore
const __VLS_50 = __VLS_asFunctionalComponent1(__VLS_49, new __VLS_49({}));
const __VLS_51 = __VLS_50({}, ...__VLS_functionalComponentArgsRest(__VLS_50));
let __VLS_54;
/** @ts-ignore @type { | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form'] | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form']} */
elForm;
// @ts-ignore
const __VLS_55 = __VLS_asFunctionalComponent1(__VLS_54, new __VLS_54({
    model: (__VLS_ctx.animationForm),
    labelWidth: "auto",
}));
const __VLS_56 = __VLS_55({
    model: (__VLS_ctx.animationForm),
    labelWidth: "auto",
}, ...__VLS_functionalComponentArgsRest(__VLS_55));
const { default: __VLS_59 } = __VLS_57.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "form-section" },
});
/** @type {__VLS_StyleScopedClasses['form-section']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "section-title" },
});
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
let __VLS_60;
/** @ts-ignore @type { | typeof __VLS_components.elRow | typeof __VLS_components.ElRow | typeof __VLS_components['el-row'] | typeof __VLS_components.elRow | typeof __VLS_components.ElRow | typeof __VLS_components['el-row']} */
elRow;
// @ts-ignore
const __VLS_61 = __VLS_asFunctionalComponent1(__VLS_60, new __VLS_60({
    gutter: (20),
}));
const __VLS_62 = __VLS_61({
    gutter: (20),
}, ...__VLS_functionalComponentArgsRest(__VLS_61));
const { default: __VLS_65 } = __VLS_63.slots;
let __VLS_66;
/** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
elCol;
// @ts-ignore
const __VLS_67 = __VLS_asFunctionalComponent1(__VLS_66, new __VLS_66({
    xs: (24),
    sm: (12),
    md: (12),
    lg: (8),
    xl: (8),
}));
const __VLS_68 = __VLS_67({
    xs: (24),
    sm: (12),
    md: (12),
    lg: (8),
    xl: (8),
}, ...__VLS_functionalComponentArgsRest(__VLS_67));
const { default: __VLS_71 } = __VLS_69.slots;
let __VLS_72;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_73 = __VLS_asFunctionalComponent1(__VLS_72, new __VLS_72({
    prop: "type",
}));
const __VLS_74 = __VLS_73({
    prop: "type",
}, ...__VLS_functionalComponentArgsRest(__VLS_73));
const { default: __VLS_77 } = __VLS_75.slots;
{
    const { label: __VLS_78 } = __VLS_75.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "label-with-tooltip" },
    });
    /** @type {__VLS_StyleScopedClasses['label-with-tooltip']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    let __VLS_79;
    /** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
    elTooltip;
    // @ts-ignore
    const __VLS_80 = __VLS_asFunctionalComponent1(__VLS_79, new __VLS_79({
        content: "选择要使用的动画效果类型，共 20 种内置动画可选",
        placement: "top",
    }));
    const __VLS_81 = __VLS_80({
        content: "选择要使用的动画效果类型，共 20 种内置动画可选",
        placement: "top",
    }, ...__VLS_functionalComponentArgsRest(__VLS_80));
    const { default: __VLS_84 } = __VLS_82.slots;
    let __VLS_85;
    /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
    elIcon;
    // @ts-ignore
    const __VLS_86 = __VLS_asFunctionalComponent1(__VLS_85, new __VLS_85({
        ...{ class: "label-tooltip-icon" },
    }));
    const __VLS_87 = __VLS_86({
        ...{ class: "label-tooltip-icon" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_86));
    /** @type {__VLS_StyleScopedClasses['label-tooltip-icon']} */ ;
    const { default: __VLS_90 } = __VLS_88.slots;
    const __VLS_91 = (__VLS_ctx.menuStore.iconComponents['HOutline:QuestionMarkCircleIcon']);
    // @ts-ignore
    const __VLS_92 = __VLS_asFunctionalComponent1(__VLS_91, new __VLS_91({}));
    const __VLS_93 = __VLS_92({}, ...__VLS_functionalComponentArgsRest(__VLS_92));
    // @ts-ignore
    [animationForm, menuStore,];
    var __VLS_88;
    // @ts-ignore
    [];
    var __VLS_82;
    // @ts-ignore
    [];
}
let __VLS_96;
/** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
elSelect;
// @ts-ignore
const __VLS_97 = __VLS_asFunctionalComponent1(__VLS_96, new __VLS_96({
    modelValue: (__VLS_ctx.animationForm.type),
    ...{ style: {} },
}));
const __VLS_98 = __VLS_97({
    modelValue: (__VLS_ctx.animationForm.type),
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_97));
const { default: __VLS_101 } = __VLS_99.slots;
let __VLS_102;
/** @ts-ignore @type { | typeof __VLS_components.elOptionGroup | typeof __VLS_components.ElOptionGroup | typeof __VLS_components['el-option-group'] | typeof __VLS_components.elOptionGroup | typeof __VLS_components.ElOptionGroup | typeof __VLS_components['el-option-group']} */
elOptionGroup;
// @ts-ignore
const __VLS_103 = __VLS_asFunctionalComponent1(__VLS_102, new __VLS_102({
    label: "基础动画",
}));
const __VLS_104 = __VLS_103({
    label: "基础动画",
}, ...__VLS_functionalComponentArgsRest(__VLS_103));
const { default: __VLS_107 } = __VLS_105.slots;
let __VLS_108;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_109 = __VLS_asFunctionalComponent1(__VLS_108, new __VLS_108({
    label: "fade-slide（淡入淡出 + 水平滑动）",
    value: "fade-slide",
}));
const __VLS_110 = __VLS_109({
    label: "fade-slide（淡入淡出 + 水平滑动）",
    value: "fade-slide",
}, ...__VLS_functionalComponentArgsRest(__VLS_109));
let __VLS_113;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_114 = __VLS_asFunctionalComponent1(__VLS_113, new __VLS_113({
    label: "fade（纯淡入淡出）",
    value: "fade",
}));
const __VLS_115 = __VLS_114({
    label: "fade（纯淡入淡出）",
    value: "fade",
}, ...__VLS_functionalComponentArgsRest(__VLS_114));
let __VLS_118;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_119 = __VLS_asFunctionalComponent1(__VLS_118, new __VLS_118({
    label: "slide-up（向上滑动）",
    value: "slide-up",
}));
const __VLS_120 = __VLS_119({
    label: "slide-up（向上滑动）",
    value: "slide-up",
}, ...__VLS_functionalComponentArgsRest(__VLS_119));
let __VLS_123;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_124 = __VLS_asFunctionalComponent1(__VLS_123, new __VLS_123({
    label: "slide-down（向下滑动）",
    value: "slide-down",
}));
const __VLS_125 = __VLS_124({
    label: "slide-down（向下滑动）",
    value: "slide-down",
}, ...__VLS_functionalComponentArgsRest(__VLS_124));
let __VLS_128;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_129 = __VLS_asFunctionalComponent1(__VLS_128, new __VLS_128({
    label: "slide-left（向左滑动）",
    value: "slide-left",
}));
const __VLS_130 = __VLS_129({
    label: "slide-left（向左滑动）",
    value: "slide-left",
}, ...__VLS_functionalComponentArgsRest(__VLS_129));
let __VLS_133;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_134 = __VLS_asFunctionalComponent1(__VLS_133, new __VLS_133({
    label: "slide-right（向右滑动）",
    value: "slide-right",
}));
const __VLS_135 = __VLS_134({
    label: "slide-right（向右滑动）",
    value: "slide-right",
}, ...__VLS_functionalComponentArgsRest(__VLS_134));
// @ts-ignore
[animationForm,];
var __VLS_105;
let __VLS_138;
/** @ts-ignore @type { | typeof __VLS_components.elOptionGroup | typeof __VLS_components.ElOptionGroup | typeof __VLS_components['el-option-group'] | typeof __VLS_components.elOptionGroup | typeof __VLS_components.ElOptionGroup | typeof __VLS_components['el-option-group']} */
elOptionGroup;
// @ts-ignore
const __VLS_139 = __VLS_asFunctionalComponent1(__VLS_138, new __VLS_138({
    label: "缩放动画",
}));
const __VLS_140 = __VLS_139({
    label: "缩放动画",
}, ...__VLS_functionalComponentArgsRest(__VLS_139));
const { default: __VLS_143 } = __VLS_141.slots;
let __VLS_144;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_145 = __VLS_asFunctionalComponent1(__VLS_144, new __VLS_144({
    label: "zoom（缩放效果）",
    value: "zoom",
}));
const __VLS_146 = __VLS_145({
    label: "zoom（缩放效果）",
    value: "zoom",
}, ...__VLS_functionalComponentArgsRest(__VLS_145));
let __VLS_149;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_150 = __VLS_asFunctionalComponent1(__VLS_149, new __VLS_149({
    label: "zoom-in-top（从顶部缩放进入）",
    value: "zoom-in-top",
}));
const __VLS_151 = __VLS_150({
    label: "zoom-in-top（从顶部缩放进入）",
    value: "zoom-in-top",
}, ...__VLS_functionalComponentArgsRest(__VLS_150));
let __VLS_154;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_155 = __VLS_asFunctionalComponent1(__VLS_154, new __VLS_154({
    label: "zoom-in-bottom（从底部缩放进入）",
    value: "zoom-in-bottom",
}));
const __VLS_156 = __VLS_155({
    label: "zoom-in-bottom（从底部缩放进入）",
    value: "zoom-in-bottom",
}, ...__VLS_functionalComponentArgsRest(__VLS_155));
let __VLS_159;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_160 = __VLS_asFunctionalComponent1(__VLS_159, new __VLS_159({
    label: "zoom-in-left（从左侧缩放进入）",
    value: "zoom-in-left",
}));
const __VLS_161 = __VLS_160({
    label: "zoom-in-left（从左侧缩放进入）",
    value: "zoom-in-left",
}, ...__VLS_functionalComponentArgsRest(__VLS_160));
let __VLS_164;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_165 = __VLS_asFunctionalComponent1(__VLS_164, new __VLS_164({
    label: "zoom-in-right（从右侧缩放进入）",
    value: "zoom-in-right",
}));
const __VLS_166 = __VLS_165({
    label: "zoom-in-right（从右侧缩放进入）",
    value: "zoom-in-right",
}, ...__VLS_functionalComponentArgsRest(__VLS_165));
let __VLS_169;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_170 = __VLS_asFunctionalComponent1(__VLS_169, new __VLS_169({
    label: "scale（缩放 + 淡入淡出）",
    value: "scale",
}));
const __VLS_171 = __VLS_170({
    label: "scale（缩放 + 淡入淡出）",
    value: "scale",
}, ...__VLS_functionalComponentArgsRest(__VLS_170));
// @ts-ignore
[];
var __VLS_141;
let __VLS_174;
/** @ts-ignore @type { | typeof __VLS_components.elOptionGroup | typeof __VLS_components.ElOptionGroup | typeof __VLS_components['el-option-group'] | typeof __VLS_components.elOptionGroup | typeof __VLS_components.ElOptionGroup | typeof __VLS_components['el-option-group']} */
elOptionGroup;
// @ts-ignore
const __VLS_175 = __VLS_asFunctionalComponent1(__VLS_174, new __VLS_174({
    label: "特效动画",
}));
const __VLS_176 = __VLS_175({
    label: "特效动画",
}, ...__VLS_functionalComponentArgsRest(__VLS_175));
const { default: __VLS_179 } = __VLS_177.slots;
let __VLS_180;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_181 = __VLS_asFunctionalComponent1(__VLS_180, new __VLS_180({
    label: "rotate（旋转效果）",
    value: "rotate",
}));
const __VLS_182 = __VLS_181({
    label: "rotate（旋转效果）",
    value: "rotate",
}, ...__VLS_functionalComponentArgsRest(__VLS_181));
let __VLS_185;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_186 = __VLS_asFunctionalComponent1(__VLS_185, new __VLS_185({
    label: "bounce（弹跳效果）",
    value: "bounce",
}));
const __VLS_187 = __VLS_186({
    label: "bounce（弹跳效果）",
    value: "bounce",
}, ...__VLS_functionalComponentArgsRest(__VLS_186));
let __VLS_190;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_191 = __VLS_asFunctionalComponent1(__VLS_190, new __VLS_190({
    label: "flip-3d（3D 翻转效果）",
    value: "flip-3d",
}));
const __VLS_192 = __VLS_191({
    label: "flip-3d（3D 翻转效果）",
    value: "flip-3d",
}, ...__VLS_functionalComponentArgsRest(__VLS_191));
let __VLS_195;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_196 = __VLS_asFunctionalComponent1(__VLS_195, new __VLS_195({
    label: "rotate-3d（3D 旋转效果）",
    value: "rotate-3d",
}));
const __VLS_197 = __VLS_196({
    label: "rotate-3d（3D 旋转效果）",
    value: "rotate-3d",
}, ...__VLS_functionalComponentArgsRest(__VLS_196));
let __VLS_200;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_201 = __VLS_asFunctionalComponent1(__VLS_200, new __VLS_200({
    label: "blur-fade（模糊淡入淡出）",
    value: "blur-fade",
}));
const __VLS_202 = __VLS_201({
    label: "blur-fade（模糊淡入淡出）",
    value: "blur-fade",
}, ...__VLS_functionalComponentArgsRest(__VLS_201));
let __VLS_205;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_206 = __VLS_asFunctionalComponent1(__VLS_205, new __VLS_205({
    label: "elastic（弹性效果）",
    value: "elastic",
}));
const __VLS_207 = __VLS_206({
    label: "elastic（弹性效果）",
    value: "elastic",
}, ...__VLS_functionalComponentArgsRest(__VLS_206));
let __VLS_210;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_211 = __VLS_asFunctionalComponent1(__VLS_210, new __VLS_210({
    label: "glow（发光效果）",
    value: "glow",
}));
const __VLS_212 = __VLS_211({
    label: "glow（发光效果）",
    value: "glow",
}, ...__VLS_functionalComponentArgsRest(__VLS_211));
// @ts-ignore
[];
var __VLS_177;
// @ts-ignore
[];
var __VLS_99;
// @ts-ignore
[];
var __VLS_75;
// @ts-ignore
[];
var __VLS_69;
let __VLS_215;
/** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
elCol;
// @ts-ignore
const __VLS_216 = __VLS_asFunctionalComponent1(__VLS_215, new __VLS_215({
    xs: (24),
    sm: (12),
    md: (12),
    lg: (8),
    xl: (8),
}));
const __VLS_217 = __VLS_216({
    xs: (24),
    sm: (12),
    md: (12),
    lg: (8),
    xl: (8),
}, ...__VLS_functionalComponentArgsRest(__VLS_216));
const { default: __VLS_220 } = __VLS_218.slots;
let __VLS_221;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_222 = __VLS_asFunctionalComponent1(__VLS_221, new __VLS_221({
    prop: "duration",
}));
const __VLS_223 = __VLS_222({
    prop: "duration",
}, ...__VLS_functionalComponentArgsRest(__VLS_222));
const { default: __VLS_226 } = __VLS_224.slots;
{
    const { label: __VLS_227 } = __VLS_224.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "label-with-tooltip" },
    });
    /** @type {__VLS_StyleScopedClasses['label-with-tooltip']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    let __VLS_228;
    /** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
    elTooltip;
    // @ts-ignore
    const __VLS_229 = __VLS_asFunctionalComponent1(__VLS_228, new __VLS_228({
        content: "动画持续的时间，单位：秒，默认：0.3",
        placement: "top",
    }));
    const __VLS_230 = __VLS_229({
        content: "动画持续的时间，单位：秒，默认：0.3",
        placement: "top",
    }, ...__VLS_functionalComponentArgsRest(__VLS_229));
    const { default: __VLS_233 } = __VLS_231.slots;
    let __VLS_234;
    /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
    elIcon;
    // @ts-ignore
    const __VLS_235 = __VLS_asFunctionalComponent1(__VLS_234, new __VLS_234({
        ...{ class: "label-tooltip-icon" },
    }));
    const __VLS_236 = __VLS_235({
        ...{ class: "label-tooltip-icon" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_235));
    /** @type {__VLS_StyleScopedClasses['label-tooltip-icon']} */ ;
    const { default: __VLS_239 } = __VLS_237.slots;
    const __VLS_240 = (__VLS_ctx.menuStore.iconComponents['HOutline:QuestionMarkCircleIcon']);
    // @ts-ignore
    const __VLS_241 = __VLS_asFunctionalComponent1(__VLS_240, new __VLS_240({}));
    const __VLS_242 = __VLS_241({}, ...__VLS_functionalComponentArgsRest(__VLS_241));
    // @ts-ignore
    [menuStore,];
    var __VLS_237;
    // @ts-ignore
    [];
    var __VLS_231;
    // @ts-ignore
    [];
}
let __VLS_245;
/** @ts-ignore @type { | typeof __VLS_components.elInputNumber | typeof __VLS_components.ElInputNumber | typeof __VLS_components['el-input-number']} */
elInputNumber;
// @ts-ignore
const __VLS_246 = __VLS_asFunctionalComponent1(__VLS_245, new __VLS_245({
    modelValue: (__VLS_ctx.animationForm.duration),
    min: (0.1),
    max: (5),
    step: (0.1),
    precision: (1),
    ...{ style: {} },
}));
const __VLS_247 = __VLS_246({
    modelValue: (__VLS_ctx.animationForm.duration),
    min: (0.1),
    max: (5),
    step: (0.1),
    precision: (1),
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_246));
// @ts-ignore
[animationForm,];
var __VLS_224;
// @ts-ignore
[];
var __VLS_218;
let __VLS_250;
/** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
elCol;
// @ts-ignore
const __VLS_251 = __VLS_asFunctionalComponent1(__VLS_250, new __VLS_250({
    xs: (24),
    sm: (12),
    md: (12),
    lg: (8),
    xl: (8),
}));
const __VLS_252 = __VLS_251({
    xs: (24),
    sm: (12),
    md: (12),
    lg: (8),
    xl: (8),
}, ...__VLS_functionalComponentArgsRest(__VLS_251));
const { default: __VLS_255 } = __VLS_253.slots;
let __VLS_256;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_257 = __VLS_asFunctionalComponent1(__VLS_256, new __VLS_256({
    prop: "delay",
}));
const __VLS_258 = __VLS_257({
    prop: "delay",
}, ...__VLS_functionalComponentArgsRest(__VLS_257));
const { default: __VLS_261 } = __VLS_259.slots;
{
    const { label: __VLS_262 } = __VLS_259.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "label-with-tooltip" },
    });
    /** @type {__VLS_StyleScopedClasses['label-with-tooltip']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    let __VLS_263;
    /** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
    elTooltip;
    // @ts-ignore
    const __VLS_264 = __VLS_asFunctionalComponent1(__VLS_263, new __VLS_263({
        content: "动画开始前的延迟时间，单位：秒，默认：0",
        placement: "top",
    }));
    const __VLS_265 = __VLS_264({
        content: "动画开始前的延迟时间，单位：秒，默认：0",
        placement: "top",
    }, ...__VLS_functionalComponentArgsRest(__VLS_264));
    const { default: __VLS_268 } = __VLS_266.slots;
    let __VLS_269;
    /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
    elIcon;
    // @ts-ignore
    const __VLS_270 = __VLS_asFunctionalComponent1(__VLS_269, new __VLS_269({
        ...{ class: "label-tooltip-icon" },
    }));
    const __VLS_271 = __VLS_270({
        ...{ class: "label-tooltip-icon" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_270));
    /** @type {__VLS_StyleScopedClasses['label-tooltip-icon']} */ ;
    const { default: __VLS_274 } = __VLS_272.slots;
    const __VLS_275 = (__VLS_ctx.menuStore.iconComponents['HOutline:QuestionMarkCircleIcon']);
    // @ts-ignore
    const __VLS_276 = __VLS_asFunctionalComponent1(__VLS_275, new __VLS_275({}));
    const __VLS_277 = __VLS_276({}, ...__VLS_functionalComponentArgsRest(__VLS_276));
    // @ts-ignore
    [menuStore,];
    var __VLS_272;
    // @ts-ignore
    [];
    var __VLS_266;
    // @ts-ignore
    [];
}
let __VLS_280;
/** @ts-ignore @type { | typeof __VLS_components.elInputNumber | typeof __VLS_components.ElInputNumber | typeof __VLS_components['el-input-number']} */
elInputNumber;
// @ts-ignore
const __VLS_281 = __VLS_asFunctionalComponent1(__VLS_280, new __VLS_280({
    modelValue: (__VLS_ctx.animationForm.delay),
    min: (0),
    max: (3),
    step: (0.1),
    precision: (1),
    ...{ style: {} },
}));
const __VLS_282 = __VLS_281({
    modelValue: (__VLS_ctx.animationForm.delay),
    min: (0),
    max: (3),
    step: (0.1),
    precision: (1),
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_281));
// @ts-ignore
[animationForm,];
var __VLS_259;
// @ts-ignore
[];
var __VLS_253;
let __VLS_285;
/** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
elCol;
// @ts-ignore
const __VLS_286 = __VLS_asFunctionalComponent1(__VLS_285, new __VLS_285({
    xs: (24),
    sm: (12),
    md: (12),
    lg: (8),
    xl: (8),
}));
const __VLS_287 = __VLS_286({
    xs: (24),
    sm: (12),
    md: (12),
    lg: (8),
    xl: (8),
}, ...__VLS_functionalComponentArgsRest(__VLS_286));
const { default: __VLS_290 } = __VLS_288.slots;
let __VLS_291;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_292 = __VLS_asFunctionalComponent1(__VLS_291, new __VLS_291({
    prop: "easing",
}));
const __VLS_293 = __VLS_292({
    prop: "easing",
}, ...__VLS_functionalComponentArgsRest(__VLS_292));
const { default: __VLS_296 } = __VLS_294.slots;
{
    const { label: __VLS_297 } = __VLS_294.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "label-with-tooltip" },
    });
    /** @type {__VLS_StyleScopedClasses['label-with-tooltip']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    let __VLS_298;
    /** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
    elTooltip;
    // @ts-ignore
    const __VLS_299 = __VLS_asFunctionalComponent1(__VLS_298, new __VLS_298({
        content: "控制动画的速度曲线，可以使用 CSS 缓动函数，默认：cubic-bezier(0.4, 0, 0.2, 1)",
        placement: "top",
    }));
    const __VLS_300 = __VLS_299({
        content: "控制动画的速度曲线，可以使用 CSS 缓动函数，默认：cubic-bezier(0.4, 0, 0.2, 1)",
        placement: "top",
    }, ...__VLS_functionalComponentArgsRest(__VLS_299));
    const { default: __VLS_303 } = __VLS_301.slots;
    let __VLS_304;
    /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
    elIcon;
    // @ts-ignore
    const __VLS_305 = __VLS_asFunctionalComponent1(__VLS_304, new __VLS_304({
        ...{ class: "label-tooltip-icon" },
    }));
    const __VLS_306 = __VLS_305({
        ...{ class: "label-tooltip-icon" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_305));
    /** @type {__VLS_StyleScopedClasses['label-tooltip-icon']} */ ;
    const { default: __VLS_309 } = __VLS_307.slots;
    const __VLS_310 = (__VLS_ctx.menuStore.iconComponents['HOutline:QuestionMarkCircleIcon']);
    // @ts-ignore
    const __VLS_311 = __VLS_asFunctionalComponent1(__VLS_310, new __VLS_310({}));
    const __VLS_312 = __VLS_311({}, ...__VLS_functionalComponentArgsRest(__VLS_311));
    // @ts-ignore
    [menuStore,];
    var __VLS_307;
    // @ts-ignore
    [];
    var __VLS_301;
    // @ts-ignore
    [];
}
let __VLS_315;
/** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
elSelect;
// @ts-ignore
const __VLS_316 = __VLS_asFunctionalComponent1(__VLS_315, new __VLS_315({
    modelValue: (__VLS_ctx.animationForm.easing),
    ...{ style: {} },
}));
const __VLS_317 = __VLS_316({
    modelValue: (__VLS_ctx.animationForm.easing),
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_316));
const { default: __VLS_320 } = __VLS_318.slots;
let __VLS_321;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_322 = __VLS_asFunctionalComponent1(__VLS_321, new __VLS_321({
    label: "cubic-bezier(0.4, 0, 0.2, 1)（默认）",
    value: "cubic-bezier(0.4, 0, 0.2, 1)",
}));
const __VLS_323 = __VLS_322({
    label: "cubic-bezier(0.4, 0, 0.2, 1)（默认）",
    value: "cubic-bezier(0.4, 0, 0.2, 1)",
}, ...__VLS_functionalComponentArgsRest(__VLS_322));
let __VLS_326;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_327 = __VLS_asFunctionalComponent1(__VLS_326, new __VLS_326({
    label: "cubic-bezier(0.68, -0.55, 0.265, 1.55)（弹性）",
    value: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
}));
const __VLS_328 = __VLS_327({
    label: "cubic-bezier(0.68, -0.55, 0.265, 1.55)（弹性）",
    value: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
}, ...__VLS_functionalComponentArgsRest(__VLS_327));
let __VLS_331;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_332 = __VLS_asFunctionalComponent1(__VLS_331, new __VLS_331({
    label: "ease（缓入缓出）",
    value: "ease",
}));
const __VLS_333 = __VLS_332({
    label: "ease（缓入缓出）",
    value: "ease",
}, ...__VLS_functionalComponentArgsRest(__VLS_332));
let __VLS_336;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_337 = __VLS_asFunctionalComponent1(__VLS_336, new __VLS_336({
    label: "ease-in（缓入）",
    value: "ease-in",
}));
const __VLS_338 = __VLS_337({
    label: "ease-in（缓入）",
    value: "ease-in",
}, ...__VLS_functionalComponentArgsRest(__VLS_337));
let __VLS_341;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_342 = __VLS_asFunctionalComponent1(__VLS_341, new __VLS_341({
    label: "ease-out（缓出）",
    value: "ease-out",
}));
const __VLS_343 = __VLS_342({
    label: "ease-out（缓出）",
    value: "ease-out",
}, ...__VLS_functionalComponentArgsRest(__VLS_342));
let __VLS_346;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_347 = __VLS_asFunctionalComponent1(__VLS_346, new __VLS_346({
    label: "ease-in-out（缓入缓出）",
    value: "ease-in-out",
}));
const __VLS_348 = __VLS_347({
    label: "ease-in-out（缓入缓出）",
    value: "ease-in-out",
}, ...__VLS_functionalComponentArgsRest(__VLS_347));
let __VLS_351;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_352 = __VLS_asFunctionalComponent1(__VLS_351, new __VLS_351({
    label: "linear（线性）",
    value: "linear",
}));
const __VLS_353 = __VLS_352({
    label: "linear（线性）",
    value: "linear",
}, ...__VLS_functionalComponentArgsRest(__VLS_352));
// @ts-ignore
[animationForm,];
var __VLS_318;
// @ts-ignore
[];
var __VLS_294;
// @ts-ignore
[];
var __VLS_288;
let __VLS_356;
/** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
elCol;
// @ts-ignore
const __VLS_357 = __VLS_asFunctionalComponent1(__VLS_356, new __VLS_356({
    xs: (24),
    sm: (12),
    md: (12),
    lg: (8),
    xl: (8),
}));
const __VLS_358 = __VLS_357({
    xs: (24),
    sm: (12),
    md: (12),
    lg: (8),
    xl: (8),
}, ...__VLS_functionalComponentArgsRest(__VLS_357));
const { default: __VLS_361 } = __VLS_359.slots;
let __VLS_362;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_363 = __VLS_asFunctionalComponent1(__VLS_362, new __VLS_362({
    prop: "mode",
}));
const __VLS_364 = __VLS_363({
    prop: "mode",
}, ...__VLS_functionalComponentArgsRest(__VLS_363));
const { default: __VLS_367 } = __VLS_365.slots;
{
    const { label: __VLS_368 } = __VLS_365.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "label-with-tooltip" },
    });
    /** @type {__VLS_StyleScopedClasses['label-with-tooltip']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    let __VLS_369;
    /** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
    elTooltip;
    // @ts-ignore
    const __VLS_370 = __VLS_asFunctionalComponent1(__VLS_369, new __VLS_369({
        content: "out-in: 先离开后进入；in-out: 先进入后离开；default: 同时进行",
        placement: "top",
    }));
    const __VLS_371 = __VLS_370({
        content: "out-in: 先离开后进入；in-out: 先进入后离开；default: 同时进行",
        placement: "top",
    }, ...__VLS_functionalComponentArgsRest(__VLS_370));
    const { default: __VLS_374 } = __VLS_372.slots;
    let __VLS_375;
    /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
    elIcon;
    // @ts-ignore
    const __VLS_376 = __VLS_asFunctionalComponent1(__VLS_375, new __VLS_375({
        ...{ class: "label-tooltip-icon" },
    }));
    const __VLS_377 = __VLS_376({
        ...{ class: "label-tooltip-icon" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_376));
    /** @type {__VLS_StyleScopedClasses['label-tooltip-icon']} */ ;
    const { default: __VLS_380 } = __VLS_378.slots;
    const __VLS_381 = (__VLS_ctx.menuStore.iconComponents['HOutline:QuestionMarkCircleIcon']);
    // @ts-ignore
    const __VLS_382 = __VLS_asFunctionalComponent1(__VLS_381, new __VLS_381({}));
    const __VLS_383 = __VLS_382({}, ...__VLS_functionalComponentArgsRest(__VLS_382));
    // @ts-ignore
    [menuStore,];
    var __VLS_378;
    // @ts-ignore
    [];
    var __VLS_372;
    // @ts-ignore
    [];
}
let __VLS_386;
/** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
elSelect;
// @ts-ignore
const __VLS_387 = __VLS_asFunctionalComponent1(__VLS_386, new __VLS_386({
    modelValue: (__VLS_ctx.animationForm.mode),
    ...{ style: {} },
}));
const __VLS_388 = __VLS_387({
    modelValue: (__VLS_ctx.animationForm.mode),
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_387));
const { default: __VLS_391 } = __VLS_389.slots;
let __VLS_392;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_393 = __VLS_asFunctionalComponent1(__VLS_392, new __VLS_392({
    label: "default（同时进行）",
    value: "default",
}));
const __VLS_394 = __VLS_393({
    label: "default（同时进行）",
    value: "default",
}, ...__VLS_functionalComponentArgsRest(__VLS_393));
let __VLS_397;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_398 = __VLS_asFunctionalComponent1(__VLS_397, new __VLS_397({
    label: "out-in（先离开后进入）",
    value: "out-in",
}));
const __VLS_399 = __VLS_398({
    label: "out-in（先离开后进入）",
    value: "out-in",
}, ...__VLS_functionalComponentArgsRest(__VLS_398));
let __VLS_402;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_403 = __VLS_asFunctionalComponent1(__VLS_402, new __VLS_402({
    label: "in-out（先进入后离开）",
    value: "in-out",
}));
const __VLS_404 = __VLS_403({
    label: "in-out（先进入后离开）",
    value: "in-out",
}, ...__VLS_functionalComponentArgsRest(__VLS_403));
// @ts-ignore
[animationForm,];
var __VLS_389;
// @ts-ignore
[];
var __VLS_365;
// @ts-ignore
[];
var __VLS_359;
// @ts-ignore
[];
var __VLS_63;
// @ts-ignore
[];
var __VLS_57;
let __VLS_407;
/** @ts-ignore @type { | typeof __VLS_components.elDivider | typeof __VLS_components.ElDivider | typeof __VLS_components['el-divider']} */
elDivider;
// @ts-ignore
const __VLS_408 = __VLS_asFunctionalComponent1(__VLS_407, new __VLS_407({}));
const __VLS_409 = __VLS_408({}, ...__VLS_functionalComponentArgsRest(__VLS_408));
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
__VLS_asFunctionalElement1(__VLS_intrinsics.code, __VLS_intrinsics.code)({});
let __VLS_412;
/** @ts-ignore @type { | typeof __VLS_components.elLink | typeof __VLS_components.ElLink | typeof __VLS_components['el-link'] | typeof __VLS_components.elLink | typeof __VLS_components.ElLink | typeof __VLS_components['el-link']} */
elLink;
// @ts-ignore
const __VLS_413 = __VLS_asFunctionalComponent1(__VLS_412, new __VLS_412({
    href: "https://cn.vuejs.org/guide/built-ins/transition.html",
    target: "_blank",
    type: "primary",
    underline: (false),
}));
const __VLS_414 = __VLS_413({
    href: "https://cn.vuejs.org/guide/built-ins/transition.html",
    target: "_blank",
    type: "primary",
    underline: (false),
}, ...__VLS_functionalComponentArgsRest(__VLS_413));
const { default: __VLS_417 } = __VLS_415.slots;
// @ts-ignore
[];
var __VLS_415;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "comparison-table" },
});
/** @type {__VLS_StyleScopedClasses['comparison-table']} */ ;
let __VLS_418;
/** @ts-ignore @type { | typeof __VLS_components.elTable | typeof __VLS_components.ElTable | typeof __VLS_components['el-table'] | typeof __VLS_components.elTable | typeof __VLS_components.ElTable | typeof __VLS_components['el-table']} */
elTable;
// @ts-ignore
const __VLS_419 = __VLS_asFunctionalComponent1(__VLS_418, new __VLS_418({
    data: (__VLS_ctx.cssVarsTableData),
    border: true,
    ...{ style: {} },
}));
const __VLS_420 = __VLS_419({
    data: (__VLS_ctx.cssVarsTableData),
    border: true,
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_419));
const { default: __VLS_423 } = __VLS_421.slots;
let __VLS_424;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_425 = __VLS_asFunctionalComponent1(__VLS_424, new __VLS_424({
    prop: "name",
    label: "CSS 变量名",
    width: "200",
}));
const __VLS_426 = __VLS_425({
    prop: "name",
    label: "CSS 变量名",
    width: "200",
}, ...__VLS_functionalComponentArgsRest(__VLS_425));
const { default: __VLS_429 } = __VLS_427.slots;
{
    const { default: __VLS_430 } = __VLS_427.slots;
    const [{ row }] = __VLS_vSlot(__VLS_430);
    __VLS_asFunctionalElement1(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({});
    (row.name);
    // @ts-ignore
    [cssVarsTableData,];
}
// @ts-ignore
[];
var __VLS_427;
let __VLS_431;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_432 = __VLS_asFunctionalComponent1(__VLS_431, new __VLS_431({
    prop: "type",
    label: "类型",
    width: "150",
}));
const __VLS_433 = __VLS_432({
    prop: "type",
    label: "类型",
    width: "150",
}, ...__VLS_functionalComponentArgsRest(__VLS_432));
const { default: __VLS_436 } = __VLS_434.slots;
{
    const { default: __VLS_437 } = __VLS_434.slots;
    const [{ row }] = __VLS_vSlot(__VLS_437);
    __VLS_asFunctionalElement1(__VLS_intrinsics.code, __VLS_intrinsics.code)({});
    (row.type);
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_434;
let __VLS_438;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_439 = __VLS_asFunctionalComponent1(__VLS_438, new __VLS_438({
    prop: "default",
    label: "默认值",
    width: "150",
}));
const __VLS_440 = __VLS_439({
    prop: "default",
    label: "默认值",
    width: "150",
}, ...__VLS_functionalComponentArgsRest(__VLS_439));
const { default: __VLS_443 } = __VLS_441.slots;
{
    const { default: __VLS_444 } = __VLS_441.slots;
    const [{ row }] = __VLS_vSlot(__VLS_444);
    __VLS_asFunctionalElement1(__VLS_intrinsics.code, __VLS_intrinsics.code)({});
    (row.default);
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_441;
let __VLS_445;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_446 = __VLS_asFunctionalComponent1(__VLS_445, new __VLS_445({
    prop: "description",
    label: "说明",
    minWidth: "200",
}));
const __VLS_447 = __VLS_446({
    prop: "description",
    label: "说明",
    minWidth: "200",
}, ...__VLS_functionalComponentArgsRest(__VLS_446));
// @ts-ignore
[];
var __VLS_421;
// @ts-ignore
[];
var __VLS_3;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
