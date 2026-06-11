/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { useI18n } from 'vue-i18n';
import { menuPage, createMenu, updateMenu, menuInfo } from '@/api/menu';
import IconSelectorDialog from '@/components/dialog/IconSelectorDialog.vue';
import { STATUS_OPTIONS } from '@/constants/dict';
defineOptions({ name: 'MenuCreate' });
const { t } = useI18n();
const menuStore = useMenuStore();
const emits = defineEmits(['refresh']);
const submitFormRef = useTemplateRef('submitFormRef');
const iconSelectorDialogRef = useTemplateRef('iconSelectorDialogRef');
const open = ref(false);
const submitLoading = ref(false);
const menuList = ref([]);
const titleLabel = computed(() => {
    if (submitForm.value.type === 'directory')
        return t('menu.directoryTitle');
    if (submitForm.value.type === 'menu')
        return t('menu.menuTitle');
    if (submitForm.value.type === 'button')
        return t('menu.buttonTitle');
    return t('menu.menuTitle');
});
const submitForm = ref({
    id: undefined,
    type: 'directory',
    title: '',
    path: '',
    icon: '',
    parentId: null,
    order: 0,
    status: 'active',
    permission: '',
});
const close = () => {
    open.value = false;
    submitFormRef.value?.resetFields();
    submitLoading.value = false;
    menuList.value = [];
    submitForm.value = {
        id: undefined,
        type: 'directory',
        title: '',
        path: '',
        icon: '',
        parentId: null,
        order: 0,
        status: 'active',
        permission: '',
    };
};
const confirm = async () => {
    await submitFormRef.value?.validate();
    submitLoading.value = true;
    try {
        const { data: res } = submitForm.value.id
            ? await updateMenu(submitForm.value)
            : await createMenu(submitForm.value);
        if (res.code !== 200)
            return;
        ElMessage.success(submitForm.value.id ? t('message.editSuccess') : t('message.addSuccess'));
        emits('refresh');
        close();
    }
    finally {
        submitLoading.value = false;
    }
};
// 获取菜单列表
const getMenuList = async () => {
    const { data: res } = await menuPage();
    if (res.code !== 200)
        return;
    menuList.value = res.data || [];
};
// 获取用户选择的图标
const getSelectIcon = (iconName) => {
    submitForm.value.icon = iconName;
};
// 获取菜单详情
const getMenuInfo = async () => {
    const { data: res } = await menuInfo(submitForm.value.id);
    if (res.code !== 200)
        return;
    const { id, type, title, path, icon, parentId, order, status, permission } = res.data;
    submitForm.value = { id, type, title, path, icon, parentId, order, status, permission };
};
// 显示对话框
const showDialog = (id) => {
    getMenuList();
    submitForm.value.id = id;
    if (id)
        getMenuInfo();
    open.value = true;
};
// 标题验证器
const titleValidator = (_rule, value, callback) => {
    if (value === '') {
        callback(new Error(`${t('placeholder.input')}${titleLabel.value}`));
    }
    else {
        callback();
    }
};
const rules = {
    type: [{ required: true, message: t('menu.typePlaceholder'), trigger: 'blur' }],
    title: [{ required: true, validator: titleValidator, trigger: 'blur' }],
    path: [{ required: true, message: t('menu.pathPlaceholder'), trigger: 'blur' }],
    status: [{ required: true, message: t('menu.statusPlaceholder'), trigger: 'blur' }],
};
const __VLS_exposed = {
    showDialog,
};
defineExpose(__VLS_exposed);
const __VLS_ctx = {
    ...{},
    ...{},
    ...{},
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
let __VLS_0;
/** @ts-ignore @type { | typeof __VLS_components.BaseDialog | typeof __VLS_components.BaseDialog} */
BaseDialog;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    ...{ 'onClose': {} },
    modelValue: (__VLS_ctx.open),
    title: (__VLS_ctx.submitForm.id ? __VLS_ctx.$t('menu.editMenu') : __VLS_ctx.$t('menu.addMenu')),
    width: "600",
}));
const __VLS_2 = __VLS_1({
    ...{ 'onClose': {} },
    modelValue: (__VLS_ctx.open),
    title: (__VLS_ctx.submitForm.id ? __VLS_ctx.$t('menu.editMenu') : __VLS_ctx.$t('menu.addMenu')),
    width: "600",
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
let __VLS_5;
const __VLS_6 = {
    ...{ close: {} },
    onClose: (__VLS_ctx.close),
};
const { default: __VLS_7 } = __VLS_3.slots;
let __VLS_8;
/** @ts-ignore @type { | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form'] | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form']} */
elForm;
// @ts-ignore
const __VLS_9 = __VLS_asFunctionalComponent1(__VLS_8, new __VLS_8({
    ref: "submitFormRef",
    model: (__VLS_ctx.submitForm),
    rules: (__VLS_ctx.rules),
    labelWidth: "100px",
    labelPosition: "right",
}));
const __VLS_10 = __VLS_9({
    ref: "submitFormRef",
    model: (__VLS_ctx.submitForm),
    rules: (__VLS_ctx.rules),
    labelWidth: "100px",
    labelPosition: "right",
}, ...__VLS_functionalComponentArgsRest(__VLS_9));
var __VLS_13;
const { default: __VLS_15 } = __VLS_11.slots;
let __VLS_16;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_17 = __VLS_asFunctionalComponent1(__VLS_16, new __VLS_16({
    label: (__VLS_ctx.$t('menu.type')),
    prop: "type",
}));
const __VLS_18 = __VLS_17({
    label: (__VLS_ctx.$t('menu.type')),
    prop: "type",
}, ...__VLS_functionalComponentArgsRest(__VLS_17));
const { default: __VLS_21 } = __VLS_19.slots;
let __VLS_22;
/** @ts-ignore @type { | typeof __VLS_components.elRadioGroup | typeof __VLS_components.ElRadioGroup | typeof __VLS_components['el-radio-group'] | typeof __VLS_components.elRadioGroup | typeof __VLS_components.ElRadioGroup | typeof __VLS_components['el-radio-group']} */
elRadioGroup;
// @ts-ignore
const __VLS_23 = __VLS_asFunctionalComponent1(__VLS_22, new __VLS_22({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.submitForm.type),
}));
const __VLS_24 = __VLS_23({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.submitForm.type),
}, ...__VLS_functionalComponentArgsRest(__VLS_23));
let __VLS_27;
const __VLS_28 = {
    ...{ change: {} },
    onChange: (...[$event]) => {
        __VLS_ctx.submitFormRef?.clearValidate();
        // @ts-ignore
        [open, submitForm, submitForm, submitForm, $t, $t, $t, close, rules, submitFormRef,];
    },
};
const { default: __VLS_29 } = __VLS_25.slots;
let __VLS_30;
/** @ts-ignore @type { | typeof __VLS_components.elRadio | typeof __VLS_components.ElRadio | typeof __VLS_components['el-radio'] | typeof __VLS_components.elRadio | typeof __VLS_components.ElRadio | typeof __VLS_components['el-radio']} */
elRadio;
// @ts-ignore
const __VLS_31 = __VLS_asFunctionalComponent1(__VLS_30, new __VLS_30({
    label: "directory",
}));
const __VLS_32 = __VLS_31({
    label: "directory",
}, ...__VLS_functionalComponentArgsRest(__VLS_31));
const { default: __VLS_35 } = __VLS_33.slots;
(__VLS_ctx.$t('menu.directory'));
// @ts-ignore
[$t,];
var __VLS_33;
let __VLS_36;
/** @ts-ignore @type { | typeof __VLS_components.elRadio | typeof __VLS_components.ElRadio | typeof __VLS_components['el-radio'] | typeof __VLS_components.elRadio | typeof __VLS_components.ElRadio | typeof __VLS_components['el-radio']} */
elRadio;
// @ts-ignore
const __VLS_37 = __VLS_asFunctionalComponent1(__VLS_36, new __VLS_36({
    label: "menu",
}));
const __VLS_38 = __VLS_37({
    label: "menu",
}, ...__VLS_functionalComponentArgsRest(__VLS_37));
const { default: __VLS_41 } = __VLS_39.slots;
(__VLS_ctx.$t('menu.menu'));
// @ts-ignore
[$t,];
var __VLS_39;
let __VLS_42;
/** @ts-ignore @type { | typeof __VLS_components.elRadio | typeof __VLS_components.ElRadio | typeof __VLS_components['el-radio'] | typeof __VLS_components.elRadio | typeof __VLS_components.ElRadio | typeof __VLS_components['el-radio']} */
elRadio;
// @ts-ignore
const __VLS_43 = __VLS_asFunctionalComponent1(__VLS_42, new __VLS_42({
    label: "button",
}));
const __VLS_44 = __VLS_43({
    label: "button",
}, ...__VLS_functionalComponentArgsRest(__VLS_43));
const { default: __VLS_47 } = __VLS_45.slots;
(__VLS_ctx.$t('menu.button'));
// @ts-ignore
[$t,];
var __VLS_45;
// @ts-ignore
[];
var __VLS_25;
var __VLS_26;
// @ts-ignore
[];
var __VLS_19;
let __VLS_48;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_49 = __VLS_asFunctionalComponent1(__VLS_48, new __VLS_48({
    label: (__VLS_ctx.$t('menu.parentMenu')),
    prop: "parentId",
}));
const __VLS_50 = __VLS_49({
    label: (__VLS_ctx.$t('menu.parentMenu')),
    prop: "parentId",
}, ...__VLS_functionalComponentArgsRest(__VLS_49));
const { default: __VLS_53 } = __VLS_51.slots;
let __VLS_54;
/** @ts-ignore @type { | typeof __VLS_components.elTreeSelect | typeof __VLS_components.ElTreeSelect | typeof __VLS_components['el-tree-select']} */
elTreeSelect;
// @ts-ignore
const __VLS_55 = __VLS_asFunctionalComponent1(__VLS_54, new __VLS_54({
    modelValue: (__VLS_ctx.submitForm.parentId),
    data: (__VLS_ctx.menuList),
    props: ({ label: 'title', value: 'id', children: 'children' }),
    placeholder: (__VLS_ctx.$t('menu.parentMenuPlaceholder')),
    clearable: true,
    checkStrictly: true,
}));
const __VLS_56 = __VLS_55({
    modelValue: (__VLS_ctx.submitForm.parentId),
    data: (__VLS_ctx.menuList),
    props: ({ label: 'title', value: 'id', children: 'children' }),
    placeholder: (__VLS_ctx.$t('menu.parentMenuPlaceholder')),
    clearable: true,
    checkStrictly: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_55));
// @ts-ignore
[submitForm, $t, $t, menuList,];
var __VLS_51;
let __VLS_59;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_60 = __VLS_asFunctionalComponent1(__VLS_59, new __VLS_59({
    label: (__VLS_ctx.titleLabel),
    prop: "title",
}));
const __VLS_61 = __VLS_60({
    label: (__VLS_ctx.titleLabel),
    prop: "title",
}, ...__VLS_functionalComponentArgsRest(__VLS_60));
const { default: __VLS_64 } = __VLS_62.slots;
let __VLS_65;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_66 = __VLS_asFunctionalComponent1(__VLS_65, new __VLS_65({
    modelValue: (__VLS_ctx.submitForm.title),
    placeholder: (`${__VLS_ctx.$t('placeholder.input')}${__VLS_ctx.titleLabel}`),
}));
const __VLS_67 = __VLS_66({
    modelValue: (__VLS_ctx.submitForm.title),
    placeholder: (`${__VLS_ctx.$t('placeholder.input')}${__VLS_ctx.titleLabel}`),
}, ...__VLS_functionalComponentArgsRest(__VLS_66));
// @ts-ignore
[submitForm, $t, titleLabel, titleLabel,];
var __VLS_62;
if (__VLS_ctx.submitForm.type === 'menu') {
    let __VLS_70;
    /** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
    elFormItem;
    // @ts-ignore
    const __VLS_71 = __VLS_asFunctionalComponent1(__VLS_70, new __VLS_70({
        label: (__VLS_ctx.$t('menu.path')),
        prop: "path",
    }));
    const __VLS_72 = __VLS_71({
        label: (__VLS_ctx.$t('menu.path')),
        prop: "path",
    }, ...__VLS_functionalComponentArgsRest(__VLS_71));
    const { default: __VLS_75 } = __VLS_73.slots;
    let __VLS_76;
    /** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
    elInput;
    // @ts-ignore
    const __VLS_77 = __VLS_asFunctionalComponent1(__VLS_76, new __VLS_76({
        modelValue: (__VLS_ctx.submitForm.path),
        placeholder: (__VLS_ctx.$t('menu.pathPlaceholder')),
    }));
    const __VLS_78 = __VLS_77({
        modelValue: (__VLS_ctx.submitForm.path),
        placeholder: (__VLS_ctx.$t('menu.pathPlaceholder')),
    }, ...__VLS_functionalComponentArgsRest(__VLS_77));
    // @ts-ignore
    [submitForm, submitForm, $t, $t,];
    var __VLS_73;
}
if (__VLS_ctx.submitForm.type === 'button') {
    let __VLS_81;
    /** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
    elFormItem;
    // @ts-ignore
    const __VLS_82 = __VLS_asFunctionalComponent1(__VLS_81, new __VLS_81({
        label: (__VLS_ctx.$t('menu.permission')),
        prop: "permission",
    }));
    const __VLS_83 = __VLS_82({
        label: (__VLS_ctx.$t('menu.permission')),
        prop: "permission",
    }, ...__VLS_functionalComponentArgsRest(__VLS_82));
    const { default: __VLS_86 } = __VLS_84.slots;
    let __VLS_87;
    /** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
    elInput;
    // @ts-ignore
    const __VLS_88 = __VLS_asFunctionalComponent1(__VLS_87, new __VLS_87({
        modelValue: (__VLS_ctx.submitForm.permission),
        placeholder: (__VLS_ctx.$t('menu.permissionPlaceholder')),
    }));
    const __VLS_89 = __VLS_88({
        modelValue: (__VLS_ctx.submitForm.permission),
        placeholder: (__VLS_ctx.$t('menu.permissionPlaceholder')),
    }, ...__VLS_functionalComponentArgsRest(__VLS_88));
    // @ts-ignore
    [submitForm, submitForm, $t, $t,];
    var __VLS_84;
}
if (__VLS_ctx.submitForm.type !== 'button') {
    let __VLS_92;
    /** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
    elFormItem;
    // @ts-ignore
    const __VLS_93 = __VLS_asFunctionalComponent1(__VLS_92, new __VLS_92({
        label: (__VLS_ctx.$t('menu.icon')),
        prop: "icon",
    }));
    const __VLS_94 = __VLS_93({
        label: (__VLS_ctx.$t('menu.icon')),
        prop: "icon",
    }, ...__VLS_functionalComponentArgsRest(__VLS_93));
    const { default: __VLS_97 } = __VLS_95.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "icon-selector-wrapper" },
    });
    /** @type {__VLS_StyleScopedClasses['icon-selector-wrapper']} */ ;
    let __VLS_98;
    /** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input'] | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
    elInput;
    // @ts-ignore
    const __VLS_99 = __VLS_asFunctionalComponent1(__VLS_98, new __VLS_98({
        modelValue: (__VLS_ctx.submitForm.icon),
        placeholder: (__VLS_ctx.$t('menu.iconPlaceholder')),
        clearable: true,
    }));
    const __VLS_100 = __VLS_99({
        modelValue: (__VLS_ctx.submitForm.icon),
        placeholder: (__VLS_ctx.$t('menu.iconPlaceholder')),
        clearable: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_99));
    const { default: __VLS_103 } = __VLS_101.slots;
    {
        const { prefix: __VLS_104 } = __VLS_101.slots;
        if (__VLS_ctx.submitForm.icon && __VLS_ctx.menuStore.iconComponents[__VLS_ctx.submitForm.icon]) {
            let __VLS_105;
            /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
            elIcon;
            // @ts-ignore
            const __VLS_106 = __VLS_asFunctionalComponent1(__VLS_105, new __VLS_105({}));
            const __VLS_107 = __VLS_106({}, ...__VLS_functionalComponentArgsRest(__VLS_106));
            const { default: __VLS_110 } = __VLS_108.slots;
            const __VLS_111 = (__VLS_ctx.menuStore.iconComponents[__VLS_ctx.submitForm.icon]);
            // @ts-ignore
            const __VLS_112 = __VLS_asFunctionalComponent1(__VLS_111, new __VLS_111({}));
            const __VLS_113 = __VLS_112({}, ...__VLS_functionalComponentArgsRest(__VLS_112));
            // @ts-ignore
            [submitForm, submitForm, submitForm, submitForm, submitForm, $t, $t, menuStore, menuStore,];
            var __VLS_108;
        }
        // @ts-ignore
        [];
    }
    // @ts-ignore
    [];
    var __VLS_101;
    let __VLS_116;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_117 = __VLS_asFunctionalComponent1(__VLS_116, new __VLS_116({
        ...{ 'onClick': {} },
        icon: (__VLS_ctx.menuStore.iconComponents['Element:Search']),
    }));
    const __VLS_118 = __VLS_117({
        ...{ 'onClick': {} },
        icon: (__VLS_ctx.menuStore.iconComponents['Element:Search']),
    }, ...__VLS_functionalComponentArgsRest(__VLS_117));
    let __VLS_121;
    const __VLS_122 = {
        ...{ click: {} },
        onClick: (...[$event]) => {
            if (!(__VLS_ctx.submitForm.type !== 'button'))
                return;
            __VLS_ctx.iconSelectorDialogRef?.showDialog(__VLS_ctx.submitForm.icon);
            // @ts-ignore
            [submitForm, menuStore, iconSelectorDialogRef,];
        },
    };
    const { default: __VLS_123 } = __VLS_119.slots;
    if (!__VLS_ctx.menuStore.isMobile) {
        {
            const { default: __VLS_124 } = __VLS_119.slots;
            // @ts-ignore
            [menuStore,];
        }
    }
    // @ts-ignore
    [];
    var __VLS_119;
    var __VLS_120;
    // @ts-ignore
    [];
    var __VLS_95;
}
let __VLS_125;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_126 = __VLS_asFunctionalComponent1(__VLS_125, new __VLS_125({
    label: (__VLS_ctx.$t('menu.sort')),
    prop: "order",
}));
const __VLS_127 = __VLS_126({
    label: (__VLS_ctx.$t('menu.sort')),
    prop: "order",
}, ...__VLS_functionalComponentArgsRest(__VLS_126));
const { default: __VLS_130 } = __VLS_128.slots;
let __VLS_131;
/** @ts-ignore @type { | typeof __VLS_components.elInputNumber | typeof __VLS_components.ElInputNumber | typeof __VLS_components['el-input-number']} */
elInputNumber;
// @ts-ignore
const __VLS_132 = __VLS_asFunctionalComponent1(__VLS_131, new __VLS_131({
    modelValue: (__VLS_ctx.submitForm.order),
    min: (0),
    max: (999),
    ...{ style: {} },
}));
const __VLS_133 = __VLS_132({
    modelValue: (__VLS_ctx.submitForm.order),
    min: (0),
    max: (999),
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_132));
// @ts-ignore
[submitForm, $t,];
var __VLS_128;
let __VLS_136;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_137 = __VLS_asFunctionalComponent1(__VLS_136, new __VLS_136({
    label: (__VLS_ctx.$t('menu.status')),
    prop: "status",
}));
const __VLS_138 = __VLS_137({
    label: (__VLS_ctx.$t('menu.status')),
    prop: "status",
}, ...__VLS_functionalComponentArgsRest(__VLS_137));
const { default: __VLS_141 } = __VLS_139.slots;
let __VLS_142;
/** @ts-ignore @type { | typeof __VLS_components.elRadioGroup | typeof __VLS_components.ElRadioGroup | typeof __VLS_components['el-radio-group'] | typeof __VLS_components.elRadioGroup | typeof __VLS_components.ElRadioGroup | typeof __VLS_components['el-radio-group']} */
elRadioGroup;
// @ts-ignore
const __VLS_143 = __VLS_asFunctionalComponent1(__VLS_142, new __VLS_142({
    modelValue: (__VLS_ctx.submitForm.status),
}));
const __VLS_144 = __VLS_143({
    modelValue: (__VLS_ctx.submitForm.status),
}, ...__VLS_functionalComponentArgsRest(__VLS_143));
const { default: __VLS_147 } = __VLS_145.slots;
for (const [item] of __VLS_vFor((__VLS_ctx.STATUS_OPTIONS))) {
    let __VLS_148;
    /** @ts-ignore @type { | typeof __VLS_components.elRadio | typeof __VLS_components.ElRadio | typeof __VLS_components['el-radio'] | typeof __VLS_components.elRadio | typeof __VLS_components.ElRadio | typeof __VLS_components['el-radio']} */
    elRadio;
    // @ts-ignore
    const __VLS_149 = __VLS_asFunctionalComponent1(__VLS_148, new __VLS_148({
        key: (item.value),
        label: (item.value),
    }));
    const __VLS_150 = __VLS_149({
        key: (item.value),
        label: (item.value),
    }, ...__VLS_functionalComponentArgsRest(__VLS_149));
    const { default: __VLS_153 } = __VLS_151.slots;
    (item.label);
    // @ts-ignore
    [submitForm, $t, STATUS_OPTIONS,];
    var __VLS_151;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_145;
// @ts-ignore
[];
var __VLS_139;
// @ts-ignore
[];
var __VLS_11;
{
    const { footer: __VLS_154 } = __VLS_3.slots;
    let __VLS_155;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_156 = __VLS_asFunctionalComponent1(__VLS_155, new __VLS_155({
        ...{ 'onClick': {} },
    }));
    const __VLS_157 = __VLS_156({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_156));
    let __VLS_160;
    const __VLS_161 = {
        ...{ click: {} },
        onClick: (__VLS_ctx.close),
    };
    const { default: __VLS_162 } = __VLS_158.slots;
    (__VLS_ctx.$t('button.cancel'));
    // @ts-ignore
    [$t, close,];
    var __VLS_158;
    var __VLS_159;
    let __VLS_163;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_164 = __VLS_asFunctionalComponent1(__VLS_163, new __VLS_163({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.submitLoading),
    }));
    const __VLS_165 = __VLS_164({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.submitLoading),
    }, ...__VLS_functionalComponentArgsRest(__VLS_164));
    let __VLS_168;
    const __VLS_169 = {
        ...{ click: {} },
        onClick: (__VLS_ctx.confirm),
    };
    const { default: __VLS_170 } = __VLS_166.slots;
    (__VLS_ctx.$t('button.confirm'));
    // @ts-ignore
    [$t, submitLoading, confirm,];
    var __VLS_166;
    var __VLS_167;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_3;
var __VLS_4;
const __VLS_171 = IconSelectorDialog;
// @ts-ignore
const __VLS_172 = __VLS_asFunctionalComponent1(__VLS_171, new __VLS_171({
    ...{ 'onSelectIcon': {} },
    ref: "iconSelectorDialogRef",
}));
const __VLS_173 = __VLS_172({
    ...{ 'onSelectIcon': {} },
    ref: "iconSelectorDialogRef",
}, ...__VLS_functionalComponentArgsRest(__VLS_172));
let __VLS_176;
const __VLS_177 = {
    ...{ selectIcon: {} },
    onSelectIcon: (__VLS_ctx.getSelectIcon),
};
var __VLS_178;
var __VLS_174;
var __VLS_175;
// @ts-ignore
var __VLS_14 = __VLS_13, __VLS_179 = __VLS_178;
// @ts-ignore
[getSelectIcon,];
const __VLS_export = (await import('vue')).defineComponent({
    setup: () => __VLS_exposed,
    emits: {},
});
export default {};
