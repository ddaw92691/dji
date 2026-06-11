/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import IconSelectorDialog from '@/components/dialog/IconSelectorDialog.vue';
defineOptions({ name: 'IconSelectorView' });
const menuStore = useMenuStore();
const iconSelectorDialogRef = useTemplateRef('iconSelectorDialogRef');
const iconSelectorForm = ref({
    title: '图标选择',
    width: '900px',
    density: 'compact',
});
const currentIcon = ref('');
const currentIconComponent = shallowRef(null);
const openIconSelectorDialog = () => {
    iconSelectorDialogRef.value?.showDialog(currentIcon.value);
};
const handleSelectIcon = (iconName, iconComponent) => {
    currentIcon.value = iconName;
    currentIconComponent.value = iconComponent;
    ElMessage.success(`已选择图标：${iconName}`);
};
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "icon-selector-doc-container" },
});
/** @type {__VLS_StyleScopedClasses['icon-selector-doc-container']} */ ;
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
}
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "form-container" },
});
/** @type {__VLS_StyleScopedClasses['form-container']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "action-bar" },
});
/** @type {__VLS_StyleScopedClasses['action-bar']} */ ;
let __VLS_7;
/** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
elButton;
// @ts-ignore
const __VLS_8 = __VLS_asFunctionalComponent1(__VLS_7, new __VLS_7({
    ...{ 'onClick': {} },
    type: "primary",
    size: "large",
}));
const __VLS_9 = __VLS_8({
    ...{ 'onClick': {} },
    type: "primary",
    size: "large",
}, ...__VLS_functionalComponentArgsRest(__VLS_8));
let __VLS_12;
const __VLS_13 = {
    ...{ click: {} },
    onClick: (__VLS_ctx.openIconSelectorDialog),
};
const { default: __VLS_14 } = __VLS_10.slots;
// @ts-ignore
[openIconSelectorDialog,];
var __VLS_10;
var __VLS_11;
let __VLS_15;
/** @ts-ignore @type { | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form'] | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form']} */
elForm;
// @ts-ignore
const __VLS_16 = __VLS_asFunctionalComponent1(__VLS_15, new __VLS_15({
    model: (__VLS_ctx.iconSelectorForm),
    labelWidth: "auto",
}));
const __VLS_17 = __VLS_16({
    model: (__VLS_ctx.iconSelectorForm),
    labelWidth: "auto",
}, ...__VLS_functionalComponentArgsRest(__VLS_16));
const { default: __VLS_20 } = __VLS_18.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "form-section" },
});
/** @type {__VLS_StyleScopedClasses['form-section']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "section-title" },
});
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
let __VLS_21;
/** @ts-ignore @type { | typeof __VLS_components.elRow | typeof __VLS_components.ElRow | typeof __VLS_components['el-row'] | typeof __VLS_components.elRow | typeof __VLS_components.ElRow | typeof __VLS_components['el-row']} */
elRow;
// @ts-ignore
const __VLS_22 = __VLS_asFunctionalComponent1(__VLS_21, new __VLS_21({
    gutter: (20),
}));
const __VLS_23 = __VLS_22({
    gutter: (20),
}, ...__VLS_functionalComponentArgsRest(__VLS_22));
const { default: __VLS_26 } = __VLS_24.slots;
let __VLS_27;
/** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
elCol;
// @ts-ignore
const __VLS_28 = __VLS_asFunctionalComponent1(__VLS_27, new __VLS_27({
    xs: (24),
    sm: (12),
    md: (12),
    lg: (8),
    xl: (8),
}));
const __VLS_29 = __VLS_28({
    xs: (24),
    sm: (12),
    md: (12),
    lg: (8),
    xl: (8),
}, ...__VLS_functionalComponentArgsRest(__VLS_28));
const { default: __VLS_32 } = __VLS_30.slots;
let __VLS_33;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_34 = __VLS_asFunctionalComponent1(__VLS_33, new __VLS_33({
    label: "对话框标题",
    prop: "title",
}));
const __VLS_35 = __VLS_34({
    label: "对话框标题",
    prop: "title",
}, ...__VLS_functionalComponentArgsRest(__VLS_34));
const { default: __VLS_38 } = __VLS_36.slots;
let __VLS_39;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_40 = __VLS_asFunctionalComponent1(__VLS_39, new __VLS_39({
    modelValue: (__VLS_ctx.iconSelectorForm.title),
}));
const __VLS_41 = __VLS_40({
    modelValue: (__VLS_ctx.iconSelectorForm.title),
}, ...__VLS_functionalComponentArgsRest(__VLS_40));
// @ts-ignore
[iconSelectorForm, iconSelectorForm,];
var __VLS_36;
// @ts-ignore
[];
var __VLS_30;
let __VLS_44;
/** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
elCol;
// @ts-ignore
const __VLS_45 = __VLS_asFunctionalComponent1(__VLS_44, new __VLS_44({
    xs: (24),
    sm: (12),
    md: (12),
    lg: (8),
    xl: (8),
}));
const __VLS_46 = __VLS_45({
    xs: (24),
    sm: (12),
    md: (12),
    lg: (8),
    xl: (8),
}, ...__VLS_functionalComponentArgsRest(__VLS_45));
const { default: __VLS_49 } = __VLS_47.slots;
let __VLS_50;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_51 = __VLS_asFunctionalComponent1(__VLS_50, new __VLS_50({
    label: "对话框宽度",
    prop: "width",
}));
const __VLS_52 = __VLS_51({
    label: "对话框宽度",
    prop: "width",
}, ...__VLS_functionalComponentArgsRest(__VLS_51));
const { default: __VLS_55 } = __VLS_53.slots;
let __VLS_56;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_57 = __VLS_asFunctionalComponent1(__VLS_56, new __VLS_56({
    modelValue: (__VLS_ctx.iconSelectorForm.width),
}));
const __VLS_58 = __VLS_57({
    modelValue: (__VLS_ctx.iconSelectorForm.width),
}, ...__VLS_functionalComponentArgsRest(__VLS_57));
// @ts-ignore
[iconSelectorForm,];
var __VLS_53;
// @ts-ignore
[];
var __VLS_47;
let __VLS_61;
/** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
elCol;
// @ts-ignore
const __VLS_62 = __VLS_asFunctionalComponent1(__VLS_61, new __VLS_61({
    xs: (24),
    sm: (12),
    md: (12),
    lg: (8),
    xl: (8),
}));
const __VLS_63 = __VLS_62({
    xs: (24),
    sm: (12),
    md: (12),
    lg: (8),
    xl: (8),
}, ...__VLS_functionalComponentArgsRest(__VLS_62));
const { default: __VLS_66 } = __VLS_64.slots;
let __VLS_67;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_68 = __VLS_asFunctionalComponent1(__VLS_67, new __VLS_67({
    prop: "density",
}));
const __VLS_69 = __VLS_68({
    prop: "density",
}, ...__VLS_functionalComponentArgsRest(__VLS_68));
const { default: __VLS_72 } = __VLS_70.slots;
{
    const { label: __VLS_73 } = __VLS_70.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "label-with-tooltip" },
    });
    /** @type {__VLS_StyleScopedClasses['label-with-tooltip']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    let __VLS_74;
    /** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
    elTooltip;
    // @ts-ignore
    const __VLS_75 = __VLS_asFunctionalComponent1(__VLS_74, new __VLS_74({
        content: "compact：紧凑模式，图标较小，使用 tooltip 显示名称；spacious：宽松模式，图标较大，直接显示名称",
        placement: "top",
    }));
    const __VLS_76 = __VLS_75({
        content: "compact：紧凑模式，图标较小，使用 tooltip 显示名称；spacious：宽松模式，图标较大，直接显示名称",
        placement: "top",
    }, ...__VLS_functionalComponentArgsRest(__VLS_75));
    const { default: __VLS_79 } = __VLS_77.slots;
    let __VLS_80;
    /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
    elIcon;
    // @ts-ignore
    const __VLS_81 = __VLS_asFunctionalComponent1(__VLS_80, new __VLS_80({
        ...{ class: "label-tooltip-icon" },
    }));
    const __VLS_82 = __VLS_81({
        ...{ class: "label-tooltip-icon" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_81));
    /** @type {__VLS_StyleScopedClasses['label-tooltip-icon']} */ ;
    const { default: __VLS_85 } = __VLS_83.slots;
    const __VLS_86 = (__VLS_ctx.menuStore.iconComponents['HOutline:QuestionMarkCircleIcon']);
    // @ts-ignore
    const __VLS_87 = __VLS_asFunctionalComponent1(__VLS_86, new __VLS_86({}));
    const __VLS_88 = __VLS_87({}, ...__VLS_functionalComponentArgsRest(__VLS_87));
    // @ts-ignore
    [menuStore,];
    var __VLS_83;
    // @ts-ignore
    [];
    var __VLS_77;
    // @ts-ignore
    [];
}
let __VLS_91;
/** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
elSelect;
// @ts-ignore
const __VLS_92 = __VLS_asFunctionalComponent1(__VLS_91, new __VLS_91({
    modelValue: (__VLS_ctx.iconSelectorForm.density),
    ...{ style: {} },
}));
const __VLS_93 = __VLS_92({
    modelValue: (__VLS_ctx.iconSelectorForm.density),
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_92));
const { default: __VLS_96 } = __VLS_94.slots;
let __VLS_97;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_98 = __VLS_asFunctionalComponent1(__VLS_97, new __VLS_97({
    label: "紧凑模式",
    value: "compact",
}));
const __VLS_99 = __VLS_98({
    label: "紧凑模式",
    value: "compact",
}, ...__VLS_functionalComponentArgsRest(__VLS_98));
let __VLS_102;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_103 = __VLS_asFunctionalComponent1(__VLS_102, new __VLS_102({
    label: "宽松模式",
    value: "spacious",
}));
const __VLS_104 = __VLS_103({
    label: "宽松模式",
    value: "spacious",
}, ...__VLS_functionalComponentArgsRest(__VLS_103));
// @ts-ignore
[iconSelectorForm,];
var __VLS_94;
// @ts-ignore
[];
var __VLS_70;
// @ts-ignore
[];
var __VLS_64;
// @ts-ignore
[];
var __VLS_24;
// @ts-ignore
[];
var __VLS_18;
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
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "result-display" },
});
/** @type {__VLS_StyleScopedClasses['result-display']} */ ;
if (__VLS_ctx.currentIcon) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "result-item" },
    });
    /** @type {__VLS_StyleScopedClasses['result-item']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "result-label" },
    });
    /** @type {__VLS_StyleScopedClasses['result-label']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "result-icon" },
    });
    /** @type {__VLS_StyleScopedClasses['result-icon']} */ ;
    let __VLS_112;
    /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
    elIcon;
    // @ts-ignore
    const __VLS_113 = __VLS_asFunctionalComponent1(__VLS_112, new __VLS_112({
        size: (24),
    }));
    const __VLS_114 = __VLS_113({
        size: (24),
    }, ...__VLS_functionalComponentArgsRest(__VLS_113));
    const { default: __VLS_117 } = __VLS_115.slots;
    const __VLS_118 = (__VLS_ctx.currentIconComponent);
    // @ts-ignore
    const __VLS_119 = __VLS_asFunctionalComponent1(__VLS_118, new __VLS_118({}));
    const __VLS_120 = __VLS_119({}, ...__VLS_functionalComponentArgsRest(__VLS_119));
    // @ts-ignore
    [currentIcon, currentIconComponent,];
    var __VLS_115;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "result-label" },
    });
    /** @type {__VLS_StyleScopedClasses['result-label']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "result-value" },
    });
    /** @type {__VLS_StyleScopedClasses['result-value']} */ ;
    (__VLS_ctx.currentIcon);
}
if (!__VLS_ctx.currentIcon) {
    let __VLS_123;
    /** @ts-ignore @type { | typeof __VLS_components.elEmpty | typeof __VLS_components.ElEmpty | typeof __VLS_components['el-empty']} */
    elEmpty;
    // @ts-ignore
    const __VLS_124 = __VLS_asFunctionalComponent1(__VLS_123, new __VLS_123({
        description: "暂未选择图标，请点击上方按钮打开图标选择器",
        imageSize: (50),
    }));
    const __VLS_125 = __VLS_124({
        description: "暂未选择图标，请点击上方按钮打开图标选择器",
        imageSize: (50),
    }, ...__VLS_functionalComponentArgsRest(__VLS_124));
}
let __VLS_128;
/** @ts-ignore @type { | typeof __VLS_components.elDivider | typeof __VLS_components.ElDivider | typeof __VLS_components['el-divider']} */
elDivider;
// @ts-ignore
const __VLS_129 = __VLS_asFunctionalComponent1(__VLS_128, new __VLS_128({}));
const __VLS_130 = __VLS_129({}, ...__VLS_functionalComponentArgsRest(__VLS_129));
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
let __VLS_133;
/** @ts-ignore @type { | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag'] | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag']} */
elTag;
// @ts-ignore
const __VLS_134 = __VLS_asFunctionalComponent1(__VLS_133, new __VLS_133({
    type: "success",
    size: "small",
}));
const __VLS_135 = __VLS_134({
    type: "success",
    size: "small",
}, ...__VLS_functionalComponentArgsRest(__VLS_134));
const { default: __VLS_138 } = __VLS_136.slots;
// @ts-ignore
[currentIcon, currentIcon,];
var __VLS_136;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "event-label" },
});
/** @type {__VLS_StyleScopedClasses['event-label']} */ ;
let __VLS_139;
/** @ts-ignore @type { | typeof __VLS_components.elDivider | typeof __VLS_components.ElDivider | typeof __VLS_components['el-divider']} */
elDivider;
// @ts-ignore
const __VLS_140 = __VLS_asFunctionalComponent1(__VLS_139, new __VLS_139({}));
const __VLS_141 = __VLS_140({}, ...__VLS_functionalComponentArgsRest(__VLS_140));
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "method-section" },
});
/** @type {__VLS_StyleScopedClasses['method-section']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "section-title" },
});
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "method-list" },
});
/** @type {__VLS_StyleScopedClasses['method-list']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "method-item" },
});
/** @type {__VLS_StyleScopedClasses['method-item']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "method-name" },
});
/** @type {__VLS_StyleScopedClasses['method-name']} */ ;
let __VLS_144;
/** @ts-ignore @type { | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag'] | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag']} */
elTag;
// @ts-ignore
const __VLS_145 = __VLS_asFunctionalComponent1(__VLS_144, new __VLS_144({
    type: "primary",
    size: "small",
}));
const __VLS_146 = __VLS_145({
    type: "primary",
    size: "small",
}, ...__VLS_functionalComponentArgsRest(__VLS_145));
const { default: __VLS_149 } = __VLS_147.slots;
// @ts-ignore
[];
var __VLS_147;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "method-description" },
});
/** @type {__VLS_StyleScopedClasses['method-description']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "method-code" },
});
/** @type {__VLS_StyleScopedClasses['method-code']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.pre, __VLS_intrinsics.pre)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.code, __VLS_intrinsics.code)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "method-item" },
});
/** @type {__VLS_StyleScopedClasses['method-item']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "method-name" },
});
/** @type {__VLS_StyleScopedClasses['method-name']} */ ;
let __VLS_150;
/** @ts-ignore @type { | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag'] | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag']} */
elTag;
// @ts-ignore
const __VLS_151 = __VLS_asFunctionalComponent1(__VLS_150, new __VLS_150({
    type: "warning",
    size: "small",
}));
const __VLS_152 = __VLS_151({
    type: "warning",
    size: "small",
}, ...__VLS_functionalComponentArgsRest(__VLS_151));
const { default: __VLS_155 } = __VLS_153.slots;
// @ts-ignore
[];
var __VLS_153;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "method-description" },
});
/** @type {__VLS_StyleScopedClasses['method-description']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "method-code" },
});
/** @type {__VLS_StyleScopedClasses['method-code']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.pre, __VLS_intrinsics.pre)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.code, __VLS_intrinsics.code)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "method-item" },
});
/** @type {__VLS_StyleScopedClasses['method-item']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "method-name" },
});
/** @type {__VLS_StyleScopedClasses['method-name']} */ ;
let __VLS_156;
/** @ts-ignore @type { | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag'] | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag']} */
elTag;
// @ts-ignore
const __VLS_157 = __VLS_asFunctionalComponent1(__VLS_156, new __VLS_156({
    type: "info",
    size: "small",
}));
const __VLS_158 = __VLS_157({
    type: "info",
    size: "small",
}, ...__VLS_functionalComponentArgsRest(__VLS_157));
const { default: __VLS_161 } = __VLS_159.slots;
// @ts-ignore
[];
var __VLS_159;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "method-description" },
});
/** @type {__VLS_StyleScopedClasses['method-description']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "method-code" },
});
/** @type {__VLS_StyleScopedClasses['method-code']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.pre, __VLS_intrinsics.pre)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.code, __VLS_intrinsics.code)({});
const __VLS_162 = IconSelectorDialog;
// @ts-ignore
const __VLS_163 = __VLS_asFunctionalComponent1(__VLS_162, new __VLS_162({
    ...{ 'onSelectIcon': {} },
    title: (__VLS_ctx.iconSelectorForm.title),
    width: (__VLS_ctx.iconSelectorForm.width),
    density: (__VLS_ctx.iconSelectorForm.density),
    ref: "iconSelectorDialogRef",
}));
const __VLS_164 = __VLS_163({
    ...{ 'onSelectIcon': {} },
    title: (__VLS_ctx.iconSelectorForm.title),
    width: (__VLS_ctx.iconSelectorForm.width),
    density: (__VLS_ctx.iconSelectorForm.density),
    ref: "iconSelectorDialogRef",
}, ...__VLS_functionalComponentArgsRest(__VLS_163));
let __VLS_167;
const __VLS_168 = {
    ...{ selectIcon: {} },
    onSelectIcon: (__VLS_ctx.handleSelectIcon),
};
var __VLS_169;
var __VLS_165;
var __VLS_166;
// @ts-ignore
[iconSelectorForm, iconSelectorForm, iconSelectorForm, handleSelectIcon,];
var __VLS_3;
// @ts-ignore
var __VLS_170 = __VLS_169;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
