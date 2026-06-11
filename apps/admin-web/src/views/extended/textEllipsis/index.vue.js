/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { CopyDocument } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
defineOptions({ name: 'TextEllipsisView' });
const menuStore = useMenuStore();
// 写死的文本内容
const fixedText = '在一个宁静而古老的小镇上，少年李安每天放学后都会经过那棵矗立在街角的古老橡树。这棵橡树已有百年历史，枝干粗壮，枝叶繁茂，仿佛一位沉默的守护者，见证着小镇的变迁。夕阳西下时，金色的光芒透过层层叠叠的叶片洒落下来，为整个街道蒙上一层温暖的光晕。一天傍晚，当李安像往常一样经过这里时，他突然注意到树根旁有一个闪着微光的木盒子，盒子表面雕刻着精美的花纹，在夕阳的照耀下显得格外神秘。李安小心翼翼地打开盒子，发现里面静静地躺着一张泛黄的旧地图和一把小巧精致的铜钥匙。地图上标注着一条蜿蜒的路线，最终指向小镇另一端的一座废弃磨坊。怀着强烈的好奇心，李安决定跟随地图的指引去探索这个秘密。他穿过几条熟悉的小巷，来到那座已经荒废多年的磨坊前。推开吱呀作响的大门，里面布满了厚厚的尘埃，阳光从破碎的窗户斜射进来，在空气中形成一道道明亮的光柱。在磨坊的角落里，李安发现了一个古朴的木箱子，箱子上有一个锁孔，正好与手中的钥匙匹配。当他转动钥匙，箱子缓缓打开的那一刻，一束阳光恰好透过窗户洒在箱子里的金色信封上，信封在光线下闪闪发光。李安颤抖着双手打开信封，里面是一张精美的信纸，上面用优雅的字体写着："勇敢的人，终会找到属于自己的奇迹。每一次探索都是成长的足迹，每一份勇气都会照亮前行的路。"读完这段话，李安心里涌起一股暖流，他深深明白，这次冒险的意义不仅在于发现了什么，更在于他敢于踏出第一步的勇气，以及在这个过程中收获的希望与成长。';
const ellipsisForm = ref({
    text: fixedText,
    line: 2,
    width: '100%',
    clickable: true,
    copyable: false,
    tooltipType: 'element',
    placement: 'top',
    effect: 'dark',
    showAfter: 0,
    hideAfter: 200,
    offset: 12,
});
// 组件属性表格数据
const propsTableData = [
    {
        name: 'text',
        type: 'string | number',
        default: '-',
        description: '要展示的文本内容（必需）',
    },
    {
        name: 'line',
        type: 'number',
        default: '1',
        description: '展示行数，超过此行数后省略',
    },
    {
        name: 'width',
        type: 'string | number',
        default: "'100%'",
        description: '宽度，超过此宽度后省略，支持字符串（vh, rem, px, 百分比）或数字（默认 px）',
    },
    {
        name: 'clickable',
        type: 'boolean',
        default: 'false',
        description: '是否允许点击展开/收起',
    },
    {
        name: 'copyable',
        type: 'boolean',
        default: 'false',
        description: '是否显示复制按钮',
    },
    {
        name: 'tooltipType',
        type: "'element' | 'native' | 'none'",
        default: "'element'",
        description: 'Tooltip 提示类型，element: Element Plus Tooltip（默认），native: 原生 title 属性，none: 不显示',
    },
];
// 生成代码字符串
const generateCode = () => {
    const { line, width, clickable, copyable, tooltipType, placement, effect, showAfter, hideAfter, offset, } = ellipsisForm.value;
    const props = [];
    // text 属性（使用示例）
    props.push(`text="你的文本内容"`);
    // 其他属性
    if (line !== 1) {
        props.push(`:line="${line}"`);
    }
    if (width !== '100%') {
        if (typeof width === 'number') {
            props.push(`:width="${width}"`);
        }
        else {
            props.push(`width="${width}"`);
        }
    }
    if (!clickable) {
        props.push(`:clickable="false"`);
    }
    if (copyable) {
        props.push(`:copyable="true"`);
    }
    if (tooltipType !== 'element') {
        props.push(`tooltip-type="${tooltipType}"`);
    }
    if (placement !== 'top') {
        props.push(`placement="${placement}"`);
    }
    if (effect !== 'dark') {
        props.push(`effect="${effect}"`);
    }
    if (showAfter !== 0) {
        props.push(`:show-after="${showAfter}"`);
    }
    if (hideAfter !== 200) {
        props.push(`:hide-after="${hideAfter}"`);
    }
    if (offset !== 12) {
        props.push(`:offset="${offset}"`);
    }
    return `<TextEllipsis ${props.join(' ')} />`;
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
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "text-ellipsis-doc-container" },
});
/** @type {__VLS_StyleScopedClasses['text-ellipsis-doc-container']} */ ;
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
        href: "https://element-plus.org/zh-CN/component/tooltip",
        target: "_blank",
        type: "primary",
        underline: (false),
    }));
    const __VLS_9 = __VLS_8({
        href: "https://element-plus.org/zh-CN/component/tooltip",
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
        href: "https://github.com/DFANNN/DFAN-Admin/blob/main/src/components/text/TextEllipsis.vue",
        target: "_blank",
        type: "primary",
        underline: (false),
    }));
    const __VLS_15 = __VLS_14({
        href: "https://github.com/DFANNN/DFAN-Admin/blob/main/src/components/text/TextEllipsis.vue",
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
let __VLS_27;
/** @ts-ignore @type { | typeof __VLS_components.TextEllipsis} */
TextEllipsis;
// @ts-ignore
const __VLS_28 = __VLS_asFunctionalComponent1(__VLS_27, new __VLS_27({
    text: (__VLS_ctx.ellipsisForm.text),
    line: (__VLS_ctx.ellipsisForm.line),
    width: (__VLS_ctx.ellipsisForm.width),
    clickable: (__VLS_ctx.ellipsisForm.clickable),
    copyable: (__VLS_ctx.ellipsisForm.copyable),
    tooltipType: (__VLS_ctx.ellipsisForm.tooltipType),
    placement: (__VLS_ctx.ellipsisForm.placement),
    effect: (__VLS_ctx.ellipsisForm.effect),
    showAfter: (__VLS_ctx.ellipsisForm.showAfter),
    hideAfter: (__VLS_ctx.ellipsisForm.hideAfter),
    offset: (__VLS_ctx.ellipsisForm.offset),
}));
const __VLS_29 = __VLS_28({
    text: (__VLS_ctx.ellipsisForm.text),
    line: (__VLS_ctx.ellipsisForm.line),
    width: (__VLS_ctx.ellipsisForm.width),
    clickable: (__VLS_ctx.ellipsisForm.clickable),
    copyable: (__VLS_ctx.ellipsisForm.copyable),
    tooltipType: (__VLS_ctx.ellipsisForm.tooltipType),
    placement: (__VLS_ctx.ellipsisForm.placement),
    effect: (__VLS_ctx.ellipsisForm.effect),
    showAfter: (__VLS_ctx.ellipsisForm.showAfter),
    hideAfter: (__VLS_ctx.ellipsisForm.hideAfter),
    offset: (__VLS_ctx.ellipsisForm.offset),
}, ...__VLS_functionalComponentArgsRest(__VLS_28));
let __VLS_32;
/** @ts-ignore @type { | typeof __VLS_components.elDivider | typeof __VLS_components.ElDivider | typeof __VLS_components['el-divider']} */
elDivider;
// @ts-ignore
const __VLS_33 = __VLS_asFunctionalComponent1(__VLS_32, new __VLS_32({}));
const __VLS_34 = __VLS_33({}, ...__VLS_functionalComponentArgsRest(__VLS_33));
let __VLS_37;
/** @ts-ignore @type { | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form'] | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form']} */
elForm;
// @ts-ignore
const __VLS_38 = __VLS_asFunctionalComponent1(__VLS_37, new __VLS_37({
    model: (__VLS_ctx.ellipsisForm),
    labelWidth: "auto",
}));
const __VLS_39 = __VLS_38({
    model: (__VLS_ctx.ellipsisForm),
    labelWidth: "auto",
}, ...__VLS_functionalComponentArgsRest(__VLS_38));
const { default: __VLS_42 } = __VLS_40.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "form-section" },
});
/** @type {__VLS_StyleScopedClasses['form-section']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "section-title" },
});
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
let __VLS_43;
/** @ts-ignore @type { | typeof __VLS_components.elRow | typeof __VLS_components.ElRow | typeof __VLS_components['el-row'] | typeof __VLS_components.elRow | typeof __VLS_components.ElRow | typeof __VLS_components['el-row']} */
elRow;
// @ts-ignore
const __VLS_44 = __VLS_asFunctionalComponent1(__VLS_43, new __VLS_43({
    gutter: (20),
}));
const __VLS_45 = __VLS_44({
    gutter: (20),
}, ...__VLS_functionalComponentArgsRest(__VLS_44));
const { default: __VLS_48 } = __VLS_46.slots;
let __VLS_49;
/** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
elCol;
// @ts-ignore
const __VLS_50 = __VLS_asFunctionalComponent1(__VLS_49, new __VLS_49({
    xs: (24),
    sm: (12),
    md: (12),
    lg: (6),
    xl: (6),
}));
const __VLS_51 = __VLS_50({
    xs: (24),
    sm: (12),
    md: (12),
    lg: (6),
    xl: (6),
}, ...__VLS_functionalComponentArgsRest(__VLS_50));
const { default: __VLS_54 } = __VLS_52.slots;
let __VLS_55;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_56 = __VLS_asFunctionalComponent1(__VLS_55, new __VLS_55({
    prop: "line",
}));
const __VLS_57 = __VLS_56({
    prop: "line",
}, ...__VLS_functionalComponentArgsRest(__VLS_56));
const { default: __VLS_60 } = __VLS_58.slots;
{
    const { label: __VLS_61 } = __VLS_58.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "label-with-tooltip" },
    });
    /** @type {__VLS_StyleScopedClasses['label-with-tooltip']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    let __VLS_62;
    /** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
    elTooltip;
    // @ts-ignore
    const __VLS_63 = __VLS_asFunctionalComponent1(__VLS_62, new __VLS_62({
        content: "超过此行数后省略，默认：1",
        placement: "top",
    }));
    const __VLS_64 = __VLS_63({
        content: "超过此行数后省略，默认：1",
        placement: "top",
    }, ...__VLS_functionalComponentArgsRest(__VLS_63));
    const { default: __VLS_67 } = __VLS_65.slots;
    let __VLS_68;
    /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
    elIcon;
    // @ts-ignore
    const __VLS_69 = __VLS_asFunctionalComponent1(__VLS_68, new __VLS_68({
        ...{ class: "label-tooltip-icon" },
    }));
    const __VLS_70 = __VLS_69({
        ...{ class: "label-tooltip-icon" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_69));
    /** @type {__VLS_StyleScopedClasses['label-tooltip-icon']} */ ;
    const { default: __VLS_73 } = __VLS_71.slots;
    const __VLS_74 = (__VLS_ctx.menuStore.iconComponents['HOutline:QuestionMarkCircleIcon']);
    // @ts-ignore
    const __VLS_75 = __VLS_asFunctionalComponent1(__VLS_74, new __VLS_74({}));
    const __VLS_76 = __VLS_75({}, ...__VLS_functionalComponentArgsRest(__VLS_75));
    // @ts-ignore
    [ellipsisForm, ellipsisForm, ellipsisForm, ellipsisForm, ellipsisForm, ellipsisForm, ellipsisForm, ellipsisForm, ellipsisForm, ellipsisForm, ellipsisForm, ellipsisForm, menuStore,];
    var __VLS_71;
    // @ts-ignore
    [];
    var __VLS_65;
    // @ts-ignore
    [];
}
let __VLS_79;
/** @ts-ignore @type { | typeof __VLS_components.elInputNumber | typeof __VLS_components.ElInputNumber | typeof __VLS_components['el-input-number']} */
elInputNumber;
// @ts-ignore
const __VLS_80 = __VLS_asFunctionalComponent1(__VLS_79, new __VLS_79({
    modelValue: (__VLS_ctx.ellipsisForm.line),
    min: (1),
    ...{ style: {} },
}));
const __VLS_81 = __VLS_80({
    modelValue: (__VLS_ctx.ellipsisForm.line),
    min: (1),
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_80));
// @ts-ignore
[ellipsisForm,];
var __VLS_58;
// @ts-ignore
[];
var __VLS_52;
let __VLS_84;
/** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
elCol;
// @ts-ignore
const __VLS_85 = __VLS_asFunctionalComponent1(__VLS_84, new __VLS_84({
    xs: (24),
    sm: (12),
    md: (12),
    lg: (6),
    xl: (6),
}));
const __VLS_86 = __VLS_85({
    xs: (24),
    sm: (12),
    md: (12),
    lg: (6),
    xl: (6),
}, ...__VLS_functionalComponentArgsRest(__VLS_85));
const { default: __VLS_89 } = __VLS_87.slots;
let __VLS_90;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_91 = __VLS_asFunctionalComponent1(__VLS_90, new __VLS_90({
    prop: "width",
}));
const __VLS_92 = __VLS_91({
    prop: "width",
}, ...__VLS_functionalComponentArgsRest(__VLS_91));
const { default: __VLS_95 } = __VLS_93.slots;
{
    const { label: __VLS_96 } = __VLS_93.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "label-with-tooltip" },
    });
    /** @type {__VLS_StyleScopedClasses['label-with-tooltip']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    let __VLS_97;
    /** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
    elTooltip;
    // @ts-ignore
    const __VLS_98 = __VLS_asFunctionalComponent1(__VLS_97, new __VLS_97({
        content: "支持字符串（vh, rem, px, 百分比）或数字（默认 px），默认：100%",
        placement: "top",
    }));
    const __VLS_99 = __VLS_98({
        content: "支持字符串（vh, rem, px, 百分比）或数字（默认 px），默认：100%",
        placement: "top",
    }, ...__VLS_functionalComponentArgsRest(__VLS_98));
    const { default: __VLS_102 } = __VLS_100.slots;
    let __VLS_103;
    /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
    elIcon;
    // @ts-ignore
    const __VLS_104 = __VLS_asFunctionalComponent1(__VLS_103, new __VLS_103({
        ...{ class: "label-tooltip-icon" },
    }));
    const __VLS_105 = __VLS_104({
        ...{ class: "label-tooltip-icon" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_104));
    /** @type {__VLS_StyleScopedClasses['label-tooltip-icon']} */ ;
    const { default: __VLS_108 } = __VLS_106.slots;
    const __VLS_109 = (__VLS_ctx.menuStore.iconComponents['HOutline:QuestionMarkCircleIcon']);
    // @ts-ignore
    const __VLS_110 = __VLS_asFunctionalComponent1(__VLS_109, new __VLS_109({}));
    const __VLS_111 = __VLS_110({}, ...__VLS_functionalComponentArgsRest(__VLS_110));
    // @ts-ignore
    [menuStore,];
    var __VLS_106;
    // @ts-ignore
    [];
    var __VLS_100;
    // @ts-ignore
    [];
}
let __VLS_114;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_115 = __VLS_asFunctionalComponent1(__VLS_114, new __VLS_114({
    modelValue: (__VLS_ctx.ellipsisForm.width),
    placeholder: "如：500px 或 500",
}));
const __VLS_116 = __VLS_115({
    modelValue: (__VLS_ctx.ellipsisForm.width),
    placeholder: "如：500px 或 500",
}, ...__VLS_functionalComponentArgsRest(__VLS_115));
// @ts-ignore
[ellipsisForm,];
var __VLS_93;
// @ts-ignore
[];
var __VLS_87;
let __VLS_119;
/** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
elCol;
// @ts-ignore
const __VLS_120 = __VLS_asFunctionalComponent1(__VLS_119, new __VLS_119({
    xs: (24),
    sm: (12),
    md: (12),
    lg: (6),
    xl: (6),
}));
const __VLS_121 = __VLS_120({
    xs: (24),
    sm: (12),
    md: (12),
    lg: (6),
    xl: (6),
}, ...__VLS_functionalComponentArgsRest(__VLS_120));
const { default: __VLS_124 } = __VLS_122.slots;
let __VLS_125;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_126 = __VLS_asFunctionalComponent1(__VLS_125, new __VLS_125({
    label: "是否可点击展开",
    prop: "clickable",
}));
const __VLS_127 = __VLS_126({
    label: "是否可点击展开",
    prop: "clickable",
}, ...__VLS_functionalComponentArgsRest(__VLS_126));
const { default: __VLS_130 } = __VLS_128.slots;
let __VLS_131;
/** @ts-ignore @type { | typeof __VLS_components.elSwitch | typeof __VLS_components.ElSwitch | typeof __VLS_components['el-switch']} */
elSwitch;
// @ts-ignore
const __VLS_132 = __VLS_asFunctionalComponent1(__VLS_131, new __VLS_131({
    modelValue: (__VLS_ctx.ellipsisForm.clickable),
}));
const __VLS_133 = __VLS_132({
    modelValue: (__VLS_ctx.ellipsisForm.clickable),
}, ...__VLS_functionalComponentArgsRest(__VLS_132));
// @ts-ignore
[ellipsisForm,];
var __VLS_128;
// @ts-ignore
[];
var __VLS_122;
let __VLS_136;
/** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
elCol;
// @ts-ignore
const __VLS_137 = __VLS_asFunctionalComponent1(__VLS_136, new __VLS_136({
    xs: (24),
    sm: (12),
    md: (12),
    lg: (6),
    xl: (6),
}));
const __VLS_138 = __VLS_137({
    xs: (24),
    sm: (12),
    md: (12),
    lg: (6),
    xl: (6),
}, ...__VLS_functionalComponentArgsRest(__VLS_137));
const { default: __VLS_141 } = __VLS_139.slots;
let __VLS_142;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_143 = __VLS_asFunctionalComponent1(__VLS_142, new __VLS_142({
    label: "是否可复制",
    prop: "copyable",
}));
const __VLS_144 = __VLS_143({
    label: "是否可复制",
    prop: "copyable",
}, ...__VLS_functionalComponentArgsRest(__VLS_143));
const { default: __VLS_147 } = __VLS_145.slots;
let __VLS_148;
/** @ts-ignore @type { | typeof __VLS_components.elSwitch | typeof __VLS_components.ElSwitch | typeof __VLS_components['el-switch']} */
elSwitch;
// @ts-ignore
const __VLS_149 = __VLS_asFunctionalComponent1(__VLS_148, new __VLS_148({
    modelValue: (__VLS_ctx.ellipsisForm.copyable),
}));
const __VLS_150 = __VLS_149({
    modelValue: (__VLS_ctx.ellipsisForm.copyable),
}, ...__VLS_functionalComponentArgsRest(__VLS_149));
// @ts-ignore
[ellipsisForm,];
var __VLS_145;
// @ts-ignore
[];
var __VLS_139;
let __VLS_153;
/** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
elCol;
// @ts-ignore
const __VLS_154 = __VLS_asFunctionalComponent1(__VLS_153, new __VLS_153({
    xs: (24),
    sm: (12),
    md: (12),
    lg: (6),
    xl: (6),
}));
const __VLS_155 = __VLS_154({
    xs: (24),
    sm: (12),
    md: (12),
    lg: (6),
    xl: (6),
}, ...__VLS_functionalComponentArgsRest(__VLS_154));
const { default: __VLS_158 } = __VLS_156.slots;
let __VLS_159;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_160 = __VLS_asFunctionalComponent1(__VLS_159, new __VLS_159({
    prop: "tooltipType",
}));
const __VLS_161 = __VLS_160({
    prop: "tooltipType",
}, ...__VLS_functionalComponentArgsRest(__VLS_160));
const { default: __VLS_164 } = __VLS_162.slots;
{
    const { label: __VLS_165 } = __VLS_162.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "label-with-tooltip" },
    });
    /** @type {__VLS_StyleScopedClasses['label-with-tooltip']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    let __VLS_166;
    /** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
    elTooltip;
    // @ts-ignore
    const __VLS_167 = __VLS_asFunctionalComponent1(__VLS_166, new __VLS_166({
        content: "element: Element Plus Tooltip（默认）; native: 原生 title 属性; none: 不显示",
        placement: "top",
    }));
    const __VLS_168 = __VLS_167({
        content: "element: Element Plus Tooltip（默认）; native: 原生 title 属性; none: 不显示",
        placement: "top",
    }, ...__VLS_functionalComponentArgsRest(__VLS_167));
    const { default: __VLS_171 } = __VLS_169.slots;
    let __VLS_172;
    /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
    elIcon;
    // @ts-ignore
    const __VLS_173 = __VLS_asFunctionalComponent1(__VLS_172, new __VLS_172({
        ...{ class: "label-tooltip-icon" },
    }));
    const __VLS_174 = __VLS_173({
        ...{ class: "label-tooltip-icon" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_173));
    /** @type {__VLS_StyleScopedClasses['label-tooltip-icon']} */ ;
    const { default: __VLS_177 } = __VLS_175.slots;
    const __VLS_178 = (__VLS_ctx.menuStore.iconComponents['HOutline:QuestionMarkCircleIcon']);
    // @ts-ignore
    const __VLS_179 = __VLS_asFunctionalComponent1(__VLS_178, new __VLS_178({}));
    const __VLS_180 = __VLS_179({}, ...__VLS_functionalComponentArgsRest(__VLS_179));
    // @ts-ignore
    [menuStore,];
    var __VLS_175;
    // @ts-ignore
    [];
    var __VLS_169;
    // @ts-ignore
    [];
}
let __VLS_183;
/** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
elSelect;
// @ts-ignore
const __VLS_184 = __VLS_asFunctionalComponent1(__VLS_183, new __VLS_183({
    modelValue: (__VLS_ctx.ellipsisForm.tooltipType),
}));
const __VLS_185 = __VLS_184({
    modelValue: (__VLS_ctx.ellipsisForm.tooltipType),
}, ...__VLS_functionalComponentArgsRest(__VLS_184));
const { default: __VLS_188 } = __VLS_186.slots;
let __VLS_189;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_190 = __VLS_asFunctionalComponent1(__VLS_189, new __VLS_189({
    label: "element",
    value: "element",
}));
const __VLS_191 = __VLS_190({
    label: "element",
    value: "element",
}, ...__VLS_functionalComponentArgsRest(__VLS_190));
let __VLS_194;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_195 = __VLS_asFunctionalComponent1(__VLS_194, new __VLS_194({
    label: "native",
    value: "native",
}));
const __VLS_196 = __VLS_195({
    label: "native",
    value: "native",
}, ...__VLS_functionalComponentArgsRest(__VLS_195));
let __VLS_199;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_200 = __VLS_asFunctionalComponent1(__VLS_199, new __VLS_199({
    label: "none",
    value: "none",
}));
const __VLS_201 = __VLS_200({
    label: "none",
    value: "none",
}, ...__VLS_functionalComponentArgsRest(__VLS_200));
// @ts-ignore
[ellipsisForm,];
var __VLS_186;
// @ts-ignore
[];
var __VLS_162;
// @ts-ignore
[];
var __VLS_156;
// @ts-ignore
[];
var __VLS_46;
let __VLS_204;
/** @ts-ignore @type { | typeof __VLS_components.elDivider | typeof __VLS_components.ElDivider | typeof __VLS_components['el-divider']} */
elDivider;
// @ts-ignore
const __VLS_205 = __VLS_asFunctionalComponent1(__VLS_204, new __VLS_204({}));
const __VLS_206 = __VLS_205({}, ...__VLS_functionalComponentArgsRest(__VLS_205));
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "form-section" },
});
/** @type {__VLS_StyleScopedClasses['form-section']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "section-title" },
});
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
let __VLS_209;
/** @ts-ignore @type { | typeof __VLS_components.elRow | typeof __VLS_components.ElRow | typeof __VLS_components['el-row'] | typeof __VLS_components.elRow | typeof __VLS_components.ElRow | typeof __VLS_components['el-row']} */
elRow;
// @ts-ignore
const __VLS_210 = __VLS_asFunctionalComponent1(__VLS_209, new __VLS_209({
    gutter: (20),
}));
const __VLS_211 = __VLS_210({
    gutter: (20),
}, ...__VLS_functionalComponentArgsRest(__VLS_210));
const { default: __VLS_214 } = __VLS_212.slots;
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
    prop: "placement",
}));
const __VLS_223 = __VLS_222({
    prop: "placement",
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
        content: "Tooltip 的出现位置，仅在 tooltipType 为 'element' 时生效",
        placement: "top",
    }));
    const __VLS_230 = __VLS_229({
        content: "Tooltip 的出现位置，仅在 tooltipType 为 'element' 时生效",
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
/** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
elSelect;
// @ts-ignore
const __VLS_246 = __VLS_asFunctionalComponent1(__VLS_245, new __VLS_245({
    modelValue: (__VLS_ctx.ellipsisForm.placement),
}));
const __VLS_247 = __VLS_246({
    modelValue: (__VLS_ctx.ellipsisForm.placement),
}, ...__VLS_functionalComponentArgsRest(__VLS_246));
const { default: __VLS_250 } = __VLS_248.slots;
let __VLS_251;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_252 = __VLS_asFunctionalComponent1(__VLS_251, new __VLS_251({
    label: "top",
    value: "top",
}));
const __VLS_253 = __VLS_252({
    label: "top",
    value: "top",
}, ...__VLS_functionalComponentArgsRest(__VLS_252));
let __VLS_256;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_257 = __VLS_asFunctionalComponent1(__VLS_256, new __VLS_256({
    label: "top-start",
    value: "top-start",
}));
const __VLS_258 = __VLS_257({
    label: "top-start",
    value: "top-start",
}, ...__VLS_functionalComponentArgsRest(__VLS_257));
let __VLS_261;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_262 = __VLS_asFunctionalComponent1(__VLS_261, new __VLS_261({
    label: "top-end",
    value: "top-end",
}));
const __VLS_263 = __VLS_262({
    label: "top-end",
    value: "top-end",
}, ...__VLS_functionalComponentArgsRest(__VLS_262));
let __VLS_266;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_267 = __VLS_asFunctionalComponent1(__VLS_266, new __VLS_266({
    label: "bottom",
    value: "bottom",
}));
const __VLS_268 = __VLS_267({
    label: "bottom",
    value: "bottom",
}, ...__VLS_functionalComponentArgsRest(__VLS_267));
let __VLS_271;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_272 = __VLS_asFunctionalComponent1(__VLS_271, new __VLS_271({
    label: "bottom-start",
    value: "bottom-start",
}));
const __VLS_273 = __VLS_272({
    label: "bottom-start",
    value: "bottom-start",
}, ...__VLS_functionalComponentArgsRest(__VLS_272));
let __VLS_276;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_277 = __VLS_asFunctionalComponent1(__VLS_276, new __VLS_276({
    label: "bottom-end",
    value: "bottom-end",
}));
const __VLS_278 = __VLS_277({
    label: "bottom-end",
    value: "bottom-end",
}, ...__VLS_functionalComponentArgsRest(__VLS_277));
let __VLS_281;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_282 = __VLS_asFunctionalComponent1(__VLS_281, new __VLS_281({
    label: "left",
    value: "left",
}));
const __VLS_283 = __VLS_282({
    label: "left",
    value: "left",
}, ...__VLS_functionalComponentArgsRest(__VLS_282));
let __VLS_286;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_287 = __VLS_asFunctionalComponent1(__VLS_286, new __VLS_286({
    label: "left-start",
    value: "left-start",
}));
const __VLS_288 = __VLS_287({
    label: "left-start",
    value: "left-start",
}, ...__VLS_functionalComponentArgsRest(__VLS_287));
let __VLS_291;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_292 = __VLS_asFunctionalComponent1(__VLS_291, new __VLS_291({
    label: "left-end",
    value: "left-end",
}));
const __VLS_293 = __VLS_292({
    label: "left-end",
    value: "left-end",
}, ...__VLS_functionalComponentArgsRest(__VLS_292));
let __VLS_296;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_297 = __VLS_asFunctionalComponent1(__VLS_296, new __VLS_296({
    label: "right",
    value: "right",
}));
const __VLS_298 = __VLS_297({
    label: "right",
    value: "right",
}, ...__VLS_functionalComponentArgsRest(__VLS_297));
let __VLS_301;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_302 = __VLS_asFunctionalComponent1(__VLS_301, new __VLS_301({
    label: "right-start",
    value: "right-start",
}));
const __VLS_303 = __VLS_302({
    label: "right-start",
    value: "right-start",
}, ...__VLS_functionalComponentArgsRest(__VLS_302));
let __VLS_306;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_307 = __VLS_asFunctionalComponent1(__VLS_306, new __VLS_306({
    label: "right-end",
    value: "right-end",
}));
const __VLS_308 = __VLS_307({
    label: "right-end",
    value: "right-end",
}, ...__VLS_functionalComponentArgsRest(__VLS_307));
// @ts-ignore
[ellipsisForm,];
var __VLS_248;
// @ts-ignore
[];
var __VLS_224;
// @ts-ignore
[];
var __VLS_218;
let __VLS_311;
/** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
elCol;
// @ts-ignore
const __VLS_312 = __VLS_asFunctionalComponent1(__VLS_311, new __VLS_311({
    xs: (24),
    sm: (12),
    md: (12),
    lg: (6),
    xl: (6),
}));
const __VLS_313 = __VLS_312({
    xs: (24),
    sm: (12),
    md: (12),
    lg: (6),
    xl: (6),
}, ...__VLS_functionalComponentArgsRest(__VLS_312));
const { default: __VLS_316 } = __VLS_314.slots;
let __VLS_317;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_318 = __VLS_asFunctionalComponent1(__VLS_317, new __VLS_317({
    prop: "effect",
}));
const __VLS_319 = __VLS_318({
    prop: "effect",
}, ...__VLS_functionalComponentArgsRest(__VLS_318));
const { default: __VLS_322 } = __VLS_320.slots;
{
    const { label: __VLS_323 } = __VLS_320.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "label-with-tooltip" },
    });
    /** @type {__VLS_StyleScopedClasses['label-with-tooltip']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    let __VLS_324;
    /** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
    elTooltip;
    // @ts-ignore
    const __VLS_325 = __VLS_asFunctionalComponent1(__VLS_324, new __VLS_324({
        content: "Tooltip 的主题样式，仅在 tooltipType 为 'element' 时生效",
        placement: "top",
    }));
    const __VLS_326 = __VLS_325({
        content: "Tooltip 的主题样式，仅在 tooltipType 为 'element' 时生效",
        placement: "top",
    }, ...__VLS_functionalComponentArgsRest(__VLS_325));
    const { default: __VLS_329 } = __VLS_327.slots;
    let __VLS_330;
    /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
    elIcon;
    // @ts-ignore
    const __VLS_331 = __VLS_asFunctionalComponent1(__VLS_330, new __VLS_330({
        ...{ class: "label-tooltip-icon" },
    }));
    const __VLS_332 = __VLS_331({
        ...{ class: "label-tooltip-icon" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_331));
    /** @type {__VLS_StyleScopedClasses['label-tooltip-icon']} */ ;
    const { default: __VLS_335 } = __VLS_333.slots;
    const __VLS_336 = (__VLS_ctx.menuStore.iconComponents['HOutline:QuestionMarkCircleIcon']);
    // @ts-ignore
    const __VLS_337 = __VLS_asFunctionalComponent1(__VLS_336, new __VLS_336({}));
    const __VLS_338 = __VLS_337({}, ...__VLS_functionalComponentArgsRest(__VLS_337));
    // @ts-ignore
    [menuStore,];
    var __VLS_333;
    // @ts-ignore
    [];
    var __VLS_327;
    // @ts-ignore
    [];
}
let __VLS_341;
/** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
elSelect;
// @ts-ignore
const __VLS_342 = __VLS_asFunctionalComponent1(__VLS_341, new __VLS_341({
    modelValue: (__VLS_ctx.ellipsisForm.effect),
}));
const __VLS_343 = __VLS_342({
    modelValue: (__VLS_ctx.ellipsisForm.effect),
}, ...__VLS_functionalComponentArgsRest(__VLS_342));
const { default: __VLS_346 } = __VLS_344.slots;
let __VLS_347;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_348 = __VLS_asFunctionalComponent1(__VLS_347, new __VLS_347({
    label: "dark",
    value: "dark",
}));
const __VLS_349 = __VLS_348({
    label: "dark",
    value: "dark",
}, ...__VLS_functionalComponentArgsRest(__VLS_348));
let __VLS_352;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_353 = __VLS_asFunctionalComponent1(__VLS_352, new __VLS_352({
    label: "light",
    value: "light",
}));
const __VLS_354 = __VLS_353({
    label: "light",
    value: "light",
}, ...__VLS_functionalComponentArgsRest(__VLS_353));
// @ts-ignore
[ellipsisForm,];
var __VLS_344;
// @ts-ignore
[];
var __VLS_320;
// @ts-ignore
[];
var __VLS_314;
let __VLS_357;
/** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
elCol;
// @ts-ignore
const __VLS_358 = __VLS_asFunctionalComponent1(__VLS_357, new __VLS_357({
    xs: (24),
    sm: (12),
    md: (12),
    lg: (6),
    xl: (6),
}));
const __VLS_359 = __VLS_358({
    xs: (24),
    sm: (12),
    md: (12),
    lg: (6),
    xl: (6),
}, ...__VLS_functionalComponentArgsRest(__VLS_358));
const { default: __VLS_362 } = __VLS_360.slots;
let __VLS_363;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_364 = __VLS_asFunctionalComponent1(__VLS_363, new __VLS_363({
    prop: "showAfter",
}));
const __VLS_365 = __VLS_364({
    prop: "showAfter",
}, ...__VLS_functionalComponentArgsRest(__VLS_364));
const { default: __VLS_368 } = __VLS_366.slots;
{
    const { label: __VLS_369 } = __VLS_366.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "label-with-tooltip" },
    });
    /** @type {__VLS_StyleScopedClasses['label-with-tooltip']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    let __VLS_370;
    /** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
    elTooltip;
    // @ts-ignore
    const __VLS_371 = __VLS_asFunctionalComponent1(__VLS_370, new __VLS_370({
        content: "Tooltip 出现前的延迟时间，仅在 tooltipType 为 'element' 时生效",
        placement: "top",
    }));
    const __VLS_372 = __VLS_371({
        content: "Tooltip 出现前的延迟时间，仅在 tooltipType 为 'element' 时生效",
        placement: "top",
    }, ...__VLS_functionalComponentArgsRest(__VLS_371));
    const { default: __VLS_375 } = __VLS_373.slots;
    let __VLS_376;
    /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
    elIcon;
    // @ts-ignore
    const __VLS_377 = __VLS_asFunctionalComponent1(__VLS_376, new __VLS_376({
        ...{ class: "label-tooltip-icon" },
    }));
    const __VLS_378 = __VLS_377({
        ...{ class: "label-tooltip-icon" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_377));
    /** @type {__VLS_StyleScopedClasses['label-tooltip-icon']} */ ;
    const { default: __VLS_381 } = __VLS_379.slots;
    const __VLS_382 = (__VLS_ctx.menuStore.iconComponents['HOutline:QuestionMarkCircleIcon']);
    // @ts-ignore
    const __VLS_383 = __VLS_asFunctionalComponent1(__VLS_382, new __VLS_382({}));
    const __VLS_384 = __VLS_383({}, ...__VLS_functionalComponentArgsRest(__VLS_383));
    // @ts-ignore
    [menuStore,];
    var __VLS_379;
    // @ts-ignore
    [];
    var __VLS_373;
    // @ts-ignore
    [];
}
let __VLS_387;
/** @ts-ignore @type { | typeof __VLS_components.elInputNumber | typeof __VLS_components.ElInputNumber | typeof __VLS_components['el-input-number']} */
elInputNumber;
// @ts-ignore
const __VLS_388 = __VLS_asFunctionalComponent1(__VLS_387, new __VLS_387({
    modelValue: (__VLS_ctx.ellipsisForm.showAfter),
    min: (0),
    ...{ style: {} },
}));
const __VLS_389 = __VLS_388({
    modelValue: (__VLS_ctx.ellipsisForm.showAfter),
    min: (0),
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_388));
// @ts-ignore
[ellipsisForm,];
var __VLS_366;
// @ts-ignore
[];
var __VLS_360;
let __VLS_392;
/** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
elCol;
// @ts-ignore
const __VLS_393 = __VLS_asFunctionalComponent1(__VLS_392, new __VLS_392({
    xs: (24),
    sm: (12),
    md: (12),
    lg: (6),
    xl: (6),
}));
const __VLS_394 = __VLS_393({
    xs: (24),
    sm: (12),
    md: (12),
    lg: (6),
    xl: (6),
}, ...__VLS_functionalComponentArgsRest(__VLS_393));
const { default: __VLS_397 } = __VLS_395.slots;
let __VLS_398;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_399 = __VLS_asFunctionalComponent1(__VLS_398, new __VLS_398({
    prop: "hideAfter",
}));
const __VLS_400 = __VLS_399({
    prop: "hideAfter",
}, ...__VLS_functionalComponentArgsRest(__VLS_399));
const { default: __VLS_403 } = __VLS_401.slots;
{
    const { label: __VLS_404 } = __VLS_401.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "label-with-tooltip" },
    });
    /** @type {__VLS_StyleScopedClasses['label-with-tooltip']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    let __VLS_405;
    /** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
    elTooltip;
    // @ts-ignore
    const __VLS_406 = __VLS_asFunctionalComponent1(__VLS_405, new __VLS_405({
        content: "Tooltip 消失前的延迟时间，仅在 tooltipType 为 'element' 时生效",
        placement: "top",
    }));
    const __VLS_407 = __VLS_406({
        content: "Tooltip 消失前的延迟时间，仅在 tooltipType 为 'element' 时生效",
        placement: "top",
    }, ...__VLS_functionalComponentArgsRest(__VLS_406));
    const { default: __VLS_410 } = __VLS_408.slots;
    let __VLS_411;
    /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
    elIcon;
    // @ts-ignore
    const __VLS_412 = __VLS_asFunctionalComponent1(__VLS_411, new __VLS_411({
        ...{ class: "label-tooltip-icon" },
    }));
    const __VLS_413 = __VLS_412({
        ...{ class: "label-tooltip-icon" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_412));
    /** @type {__VLS_StyleScopedClasses['label-tooltip-icon']} */ ;
    const { default: __VLS_416 } = __VLS_414.slots;
    const __VLS_417 = (__VLS_ctx.menuStore.iconComponents['HOutline:QuestionMarkCircleIcon']);
    // @ts-ignore
    const __VLS_418 = __VLS_asFunctionalComponent1(__VLS_417, new __VLS_417({}));
    const __VLS_419 = __VLS_418({}, ...__VLS_functionalComponentArgsRest(__VLS_418));
    // @ts-ignore
    [menuStore,];
    var __VLS_414;
    // @ts-ignore
    [];
    var __VLS_408;
    // @ts-ignore
    [];
}
let __VLS_422;
/** @ts-ignore @type { | typeof __VLS_components.elInputNumber | typeof __VLS_components.ElInputNumber | typeof __VLS_components['el-input-number']} */
elInputNumber;
// @ts-ignore
const __VLS_423 = __VLS_asFunctionalComponent1(__VLS_422, new __VLS_422({
    modelValue: (__VLS_ctx.ellipsisForm.hideAfter),
    min: (0),
    ...{ style: {} },
}));
const __VLS_424 = __VLS_423({
    modelValue: (__VLS_ctx.ellipsisForm.hideAfter),
    min: (0),
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_423));
// @ts-ignore
[ellipsisForm,];
var __VLS_401;
// @ts-ignore
[];
var __VLS_395;
let __VLS_427;
/** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
elCol;
// @ts-ignore
const __VLS_428 = __VLS_asFunctionalComponent1(__VLS_427, new __VLS_427({
    xs: (24),
    sm: (12),
    md: (12),
    lg: (6),
    xl: (6),
}));
const __VLS_429 = __VLS_428({
    xs: (24),
    sm: (12),
    md: (12),
    lg: (6),
    xl: (6),
}, ...__VLS_functionalComponentArgsRest(__VLS_428));
const { default: __VLS_432 } = __VLS_430.slots;
let __VLS_433;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_434 = __VLS_asFunctionalComponent1(__VLS_433, new __VLS_433({
    prop: "offset",
}));
const __VLS_435 = __VLS_434({
    prop: "offset",
}, ...__VLS_functionalComponentArgsRest(__VLS_434));
const { default: __VLS_438 } = __VLS_436.slots;
{
    const { label: __VLS_439 } = __VLS_436.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "label-with-tooltip" },
    });
    /** @type {__VLS_StyleScopedClasses['label-with-tooltip']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    let __VLS_440;
    /** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
    elTooltip;
    // @ts-ignore
    const __VLS_441 = __VLS_asFunctionalComponent1(__VLS_440, new __VLS_440({
        content: "Tooltip 出现位置的偏移量，仅在 tooltipType 为 'element' 时生效",
        placement: "top",
    }));
    const __VLS_442 = __VLS_441({
        content: "Tooltip 出现位置的偏移量，仅在 tooltipType 为 'element' 时生效",
        placement: "top",
    }, ...__VLS_functionalComponentArgsRest(__VLS_441));
    const { default: __VLS_445 } = __VLS_443.slots;
    let __VLS_446;
    /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
    elIcon;
    // @ts-ignore
    const __VLS_447 = __VLS_asFunctionalComponent1(__VLS_446, new __VLS_446({
        ...{ class: "label-tooltip-icon" },
    }));
    const __VLS_448 = __VLS_447({
        ...{ class: "label-tooltip-icon" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_447));
    /** @type {__VLS_StyleScopedClasses['label-tooltip-icon']} */ ;
    const { default: __VLS_451 } = __VLS_449.slots;
    const __VLS_452 = (__VLS_ctx.menuStore.iconComponents['HOutline:QuestionMarkCircleIcon']);
    // @ts-ignore
    const __VLS_453 = __VLS_asFunctionalComponent1(__VLS_452, new __VLS_452({}));
    const __VLS_454 = __VLS_453({}, ...__VLS_functionalComponentArgsRest(__VLS_453));
    // @ts-ignore
    [menuStore,];
    var __VLS_449;
    // @ts-ignore
    [];
    var __VLS_443;
    // @ts-ignore
    [];
}
let __VLS_457;
/** @ts-ignore @type { | typeof __VLS_components.elInputNumber | typeof __VLS_components.ElInputNumber | typeof __VLS_components['el-input-number']} */
elInputNumber;
// @ts-ignore
const __VLS_458 = __VLS_asFunctionalComponent1(__VLS_457, new __VLS_457({
    modelValue: (__VLS_ctx.ellipsisForm.offset),
    min: (0),
    ...{ style: {} },
}));
const __VLS_459 = __VLS_458({
    modelValue: (__VLS_ctx.ellipsisForm.offset),
    min: (0),
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_458));
// @ts-ignore
[ellipsisForm,];
var __VLS_436;
// @ts-ignore
[];
var __VLS_430;
// @ts-ignore
[];
var __VLS_212;
// @ts-ignore
[];
var __VLS_40;
let __VLS_462;
/** @ts-ignore @type { | typeof __VLS_components.elDivider | typeof __VLS_components.ElDivider | typeof __VLS_components['el-divider']} */
elDivider;
// @ts-ignore
const __VLS_463 = __VLS_asFunctionalComponent1(__VLS_462, new __VLS_462({}));
const __VLS_464 = __VLS_463({}, ...__VLS_functionalComponentArgsRest(__VLS_463));
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
let __VLS_467;
/** @ts-ignore @type { | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag'] | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag']} */
elTag;
// @ts-ignore
const __VLS_468 = __VLS_asFunctionalComponent1(__VLS_467, new __VLS_467({
    type: "primary",
    size: "small",
}));
const __VLS_469 = __VLS_468({
    type: "primary",
    size: "small",
}, ...__VLS_functionalComponentArgsRest(__VLS_468));
const { default: __VLS_472 } = __VLS_470.slots;
// @ts-ignore
[];
var __VLS_470;
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
let __VLS_473;
/** @ts-ignore @type { | typeof __VLS_components.elDivider | typeof __VLS_components.ElDivider | typeof __VLS_components['el-divider']} */
elDivider;
// @ts-ignore
const __VLS_474 = __VLS_asFunctionalComponent1(__VLS_473, new __VLS_473({}));
const __VLS_475 = __VLS_474({}, ...__VLS_functionalComponentArgsRest(__VLS_474));
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
let __VLS_478;
/** @ts-ignore @type { | typeof __VLS_components.elLink | typeof __VLS_components.ElLink | typeof __VLS_components['el-link'] | typeof __VLS_components.elLink | typeof __VLS_components.ElLink | typeof __VLS_components['el-link']} */
elLink;
// @ts-ignore
const __VLS_479 = __VLS_asFunctionalComponent1(__VLS_478, new __VLS_478({
    href: "https://element-plus.org/zh-CN/component/tooltip",
    target: "_blank",
    type: "primary",
    underline: (false),
}));
const __VLS_480 = __VLS_479({
    href: "https://element-plus.org/zh-CN/component/tooltip",
    target: "_blank",
    type: "primary",
    underline: (false),
}, ...__VLS_functionalComponentArgsRest(__VLS_479));
const { default: __VLS_483 } = __VLS_481.slots;
// @ts-ignore
[];
var __VLS_481;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "comparison-table" },
});
/** @type {__VLS_StyleScopedClasses['comparison-table']} */ ;
let __VLS_484;
/** @ts-ignore @type { | typeof __VLS_components.elTable | typeof __VLS_components.ElTable | typeof __VLS_components['el-table'] | typeof __VLS_components.elTable | typeof __VLS_components.ElTable | typeof __VLS_components['el-table']} */
elTable;
// @ts-ignore
const __VLS_485 = __VLS_asFunctionalComponent1(__VLS_484, new __VLS_484({
    data: (__VLS_ctx.propsTableData),
    border: true,
    ...{ style: {} },
}));
const __VLS_486 = __VLS_485({
    data: (__VLS_ctx.propsTableData),
    border: true,
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_485));
const { default: __VLS_489 } = __VLS_487.slots;
let __VLS_490;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_491 = __VLS_asFunctionalComponent1(__VLS_490, new __VLS_490({
    prop: "name",
    label: "属性名",
    width: "150",
}));
const __VLS_492 = __VLS_491({
    prop: "name",
    label: "属性名",
    width: "150",
}, ...__VLS_functionalComponentArgsRest(__VLS_491));
const { default: __VLS_495 } = __VLS_493.slots;
{
    const { default: __VLS_496 } = __VLS_493.slots;
    const [{ row }] = __VLS_vSlot(__VLS_496);
    __VLS_asFunctionalElement1(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({});
    (row.name);
    // @ts-ignore
    [propsTableData,];
}
// @ts-ignore
[];
var __VLS_493;
let __VLS_497;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_498 = __VLS_asFunctionalComponent1(__VLS_497, new __VLS_497({
    prop: "type",
    label: "类型",
    width: "200",
}));
const __VLS_499 = __VLS_498({
    prop: "type",
    label: "类型",
    width: "200",
}, ...__VLS_functionalComponentArgsRest(__VLS_498));
const { default: __VLS_502 } = __VLS_500.slots;
{
    const { default: __VLS_503 } = __VLS_500.slots;
    const [{ row }] = __VLS_vSlot(__VLS_503);
    __VLS_asFunctionalElement1(__VLS_intrinsics.code, __VLS_intrinsics.code)({});
    (row.type);
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_500;
let __VLS_504;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_505 = __VLS_asFunctionalComponent1(__VLS_504, new __VLS_504({
    prop: "default",
    label: "默认值",
    width: "120",
}));
const __VLS_506 = __VLS_505({
    prop: "default",
    label: "默认值",
    width: "120",
}, ...__VLS_functionalComponentArgsRest(__VLS_505));
const { default: __VLS_509 } = __VLS_507.slots;
{
    const { default: __VLS_510 } = __VLS_507.slots;
    const [{ row }] = __VLS_vSlot(__VLS_510);
    __VLS_asFunctionalElement1(__VLS_intrinsics.code, __VLS_intrinsics.code)({});
    (row.default);
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_507;
let __VLS_511;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_512 = __VLS_asFunctionalComponent1(__VLS_511, new __VLS_511({
    prop: "description",
    label: "说明",
    minWidth: "200",
}));
const __VLS_513 = __VLS_512({
    prop: "description",
    label: "说明",
    minWidth: "200",
}, ...__VLS_functionalComponentArgsRest(__VLS_512));
// @ts-ignore
[];
var __VLS_487;
// @ts-ignore
[];
var __VLS_3;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
