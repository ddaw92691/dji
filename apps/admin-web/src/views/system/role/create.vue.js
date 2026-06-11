/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { useI18n } from 'vue-i18n';
import { createRole, roleInfo, updateRole } from '@/api/role';
import { menuPage } from '@/api/menu';
import { STATUS_OPTIONS } from '@/constants/dict';
defineOptions({ name: 'RoleCreate' });
const { t } = useI18n();
const emits = defineEmits(['refresh']);
const submitFormRef = useTemplateRef('submitFormRef');
const menuTreeRef = useTemplateRef('menuTreeRef');
// 对话框开关
const open = ref(false);
// 提交按钮加载状态
const submitLoading = ref(false);
// 菜单列表
const menuList = ref([]);
// 表单数据
const submitForm = ref({
    id: undefined,
    name: '',
    code: '',
    description: '',
    status: 'active',
    menuIds: [],
});
// 取消
const close = () => {
    open.value = false;
    menuTreeRef.value?.setCheckedKeys([]);
    submitFormRef.value?.resetFields();
    menuList.value = [];
    submitForm.value.menuIds = [];
};
// 确定
const confirm = async () => {
    await submitFormRef.value?.validate();
    const { data: res } = submitForm.value.id
        ? await updateRole(submitForm.value)
        : await createRole(submitForm.value);
    if (res.code !== 200)
        return;
    ElMessage.success(submitForm.value.id ? t('message.editSuccess') : t('message.addSuccess'));
    emits('refresh', submitForm.value.id ? 'update' : 'create');
    close();
};
// 获取菜单列表
const getMenuList = async () => {
    const { data: res } = await menuPage();
    if (res.code !== 200)
        return;
    menuList.value = res.data || [];
};
// 获取角色信息
const getRoleInfo = async () => {
    const { data: res } = await roleInfo(submitForm.value.id);
    if (res.code !== 200)
        return;
    const { id, name, code, description, status, menuIds } = res.data;
    submitForm.value = { id, name, code, description, status, menuIds: menuIds || [] };
    // 等待菜单列表和 DOM 都更新后设置选中的菜单
    await nextTick();
    // 确保菜单树已经渲染
    if (menuTreeRef.value && menuList.value.length > 0) {
        const menuIdsToSet = menuIds && menuIds.length > 0 ? menuIds : [];
        menuTreeRef.value.setCheckedKeys(menuIdsToSet);
    }
};
// 处理菜单选择
const handleMenuCheck = (data, checked) => {
    submitForm.value.menuIds = checked.checkedKeys;
};
// 表单验证规则
const formRules = {
    name: [{ required: true, message: t('role.namePlaceholder'), trigger: 'blur' }],
    code: [
        { required: true, message: t('role.codePlaceholder'), trigger: 'blur' },
        {
            pattern: /^[a-zA-Z][a-zA-Z0-9_]*$/,
            message: t('role.codePatternMessage'),
            trigger: 'blur',
        },
    ],
    status: [{ required: true, message: t('role.statusPlaceholder'), trigger: 'change' }],
};
// 显示对话框
const showDialog = async (id) => {
    submitForm.value.id = id;
    submitForm.value.menuIds = [];
    open.value = true;
    // 加载菜单列表
    await getMenuList();
    if (id)
        await getRoleInfo();
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
    title: (__VLS_ctx.submitForm.id ? __VLS_ctx.$t('role.editRole') : __VLS_ctx.$t('role.addRole')),
    width: "600",
    ...{ style: {} },
}));
const __VLS_2 = __VLS_1({
    ...{ 'onClose': {} },
    modelValue: (__VLS_ctx.open),
    title: (__VLS_ctx.submitForm.id ? __VLS_ctx.$t('role.editRole') : __VLS_ctx.$t('role.addRole')),
    width: "600",
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
let __VLS_5;
const __VLS_6 = {
    ...{ close: {} },
    onClose: (__VLS_ctx.close),
};
var __VLS_7;
const { default: __VLS_8 } = __VLS_3.slots;
let __VLS_9;
/** @ts-ignore @type { | typeof __VLS_components.elScrollbar | typeof __VLS_components.ElScrollbar | typeof __VLS_components['el-scrollbar'] | typeof __VLS_components.elScrollbar | typeof __VLS_components.ElScrollbar | typeof __VLS_components['el-scrollbar']} */
elScrollbar;
// @ts-ignore
const __VLS_10 = __VLS_asFunctionalComponent1(__VLS_9, new __VLS_9({}));
const __VLS_11 = __VLS_10({}, ...__VLS_functionalComponentArgsRest(__VLS_10));
const { default: __VLS_14 } = __VLS_12.slots;
let __VLS_15;
/** @ts-ignore @type { | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form'] | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form']} */
elForm;
// @ts-ignore
const __VLS_16 = __VLS_asFunctionalComponent1(__VLS_15, new __VLS_15({
    ref: "submitFormRef",
    model: (__VLS_ctx.submitForm),
    rules: (__VLS_ctx.formRules),
    labelWidth: "100px",
    labelPosition: "right",
}));
const __VLS_17 = __VLS_16({
    ref: "submitFormRef",
    model: (__VLS_ctx.submitForm),
    rules: (__VLS_ctx.formRules),
    labelWidth: "100px",
    labelPosition: "right",
}, ...__VLS_functionalComponentArgsRest(__VLS_16));
var __VLS_20;
const { default: __VLS_22 } = __VLS_18.slots;
let __VLS_23;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_24 = __VLS_asFunctionalComponent1(__VLS_23, new __VLS_23({
    label: (__VLS_ctx.$t('role.name')),
    prop: "name",
}));
const __VLS_25 = __VLS_24({
    label: (__VLS_ctx.$t('role.name')),
    prop: "name",
}, ...__VLS_functionalComponentArgsRest(__VLS_24));
const { default: __VLS_28 } = __VLS_26.slots;
let __VLS_29;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_30 = __VLS_asFunctionalComponent1(__VLS_29, new __VLS_29({
    modelValue: (__VLS_ctx.submitForm.name),
    placeholder: (__VLS_ctx.$t('role.namePlaceholder')),
}));
const __VLS_31 = __VLS_30({
    modelValue: (__VLS_ctx.submitForm.name),
    placeholder: (__VLS_ctx.$t('role.namePlaceholder')),
}, ...__VLS_functionalComponentArgsRest(__VLS_30));
// @ts-ignore
[open, submitForm, submitForm, submitForm, $t, $t, $t, $t, close, formRules,];
var __VLS_26;
let __VLS_34;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_35 = __VLS_asFunctionalComponent1(__VLS_34, new __VLS_34({
    label: (__VLS_ctx.$t('role.code')),
    prop: "code",
}));
const __VLS_36 = __VLS_35({
    label: (__VLS_ctx.$t('role.code')),
    prop: "code",
}, ...__VLS_functionalComponentArgsRest(__VLS_35));
const { default: __VLS_39 } = __VLS_37.slots;
let __VLS_40;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_41 = __VLS_asFunctionalComponent1(__VLS_40, new __VLS_40({
    modelValue: (__VLS_ctx.submitForm.code),
    placeholder: (__VLS_ctx.$t('role.codePlaceholder')),
    disabled: (!!__VLS_ctx.submitForm.id),
}));
const __VLS_42 = __VLS_41({
    modelValue: (__VLS_ctx.submitForm.code),
    placeholder: (__VLS_ctx.$t('role.codePlaceholder')),
    disabled: (!!__VLS_ctx.submitForm.id),
}, ...__VLS_functionalComponentArgsRest(__VLS_41));
// @ts-ignore
[submitForm, submitForm, $t, $t,];
var __VLS_37;
let __VLS_45;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_46 = __VLS_asFunctionalComponent1(__VLS_45, new __VLS_45({
    label: (__VLS_ctx.$t('role.description')),
    prop: "description",
}));
const __VLS_47 = __VLS_46({
    label: (__VLS_ctx.$t('role.description')),
    prop: "description",
}, ...__VLS_functionalComponentArgsRest(__VLS_46));
const { default: __VLS_50 } = __VLS_48.slots;
let __VLS_51;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_52 = __VLS_asFunctionalComponent1(__VLS_51, new __VLS_51({
    modelValue: (__VLS_ctx.submitForm.description),
    type: "textarea",
    rows: (3),
    placeholder: (__VLS_ctx.$t('role.descriptionPlaceholder')),
}));
const __VLS_53 = __VLS_52({
    modelValue: (__VLS_ctx.submitForm.description),
    type: "textarea",
    rows: (3),
    placeholder: (__VLS_ctx.$t('role.descriptionPlaceholder')),
}, ...__VLS_functionalComponentArgsRest(__VLS_52));
// @ts-ignore
[submitForm, $t, $t,];
var __VLS_48;
let __VLS_56;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_57 = __VLS_asFunctionalComponent1(__VLS_56, new __VLS_56({
    label: (__VLS_ctx.$t('role.status')),
    prop: "status",
}));
const __VLS_58 = __VLS_57({
    label: (__VLS_ctx.$t('role.status')),
    prop: "status",
}, ...__VLS_functionalComponentArgsRest(__VLS_57));
const { default: __VLS_61 } = __VLS_59.slots;
let __VLS_62;
/** @ts-ignore @type { | typeof __VLS_components.elRadioGroup | typeof __VLS_components.ElRadioGroup | typeof __VLS_components['el-radio-group'] | typeof __VLS_components.elRadioGroup | typeof __VLS_components.ElRadioGroup | typeof __VLS_components['el-radio-group']} */
elRadioGroup;
// @ts-ignore
const __VLS_63 = __VLS_asFunctionalComponent1(__VLS_62, new __VLS_62({
    modelValue: (__VLS_ctx.submitForm.status),
}));
const __VLS_64 = __VLS_63({
    modelValue: (__VLS_ctx.submitForm.status),
}, ...__VLS_functionalComponentArgsRest(__VLS_63));
const { default: __VLS_67 } = __VLS_65.slots;
for (const [item] of __VLS_vFor((__VLS_ctx.STATUS_OPTIONS))) {
    let __VLS_68;
    /** @ts-ignore @type { | typeof __VLS_components.elRadio | typeof __VLS_components.ElRadio | typeof __VLS_components['el-radio'] | typeof __VLS_components.elRadio | typeof __VLS_components.ElRadio | typeof __VLS_components['el-radio']} */
    elRadio;
    // @ts-ignore
    const __VLS_69 = __VLS_asFunctionalComponent1(__VLS_68, new __VLS_68({
        key: (item.value),
        label: (item.value),
    }));
    const __VLS_70 = __VLS_69({
        key: (item.value),
        label: (item.value),
    }, ...__VLS_functionalComponentArgsRest(__VLS_69));
    const { default: __VLS_73 } = __VLS_71.slots;
    (item.label);
    // @ts-ignore
    [submitForm, $t, STATUS_OPTIONS,];
    var __VLS_71;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_65;
// @ts-ignore
[];
var __VLS_59;
let __VLS_74;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_75 = __VLS_asFunctionalComponent1(__VLS_74, new __VLS_74({
    label: (__VLS_ctx.$t('role.menuPermissions')),
    prop: "menuIds",
}));
const __VLS_76 = __VLS_75({
    label: (__VLS_ctx.$t('role.menuPermissions')),
    prop: "menuIds",
}, ...__VLS_functionalComponentArgsRest(__VLS_75));
const { default: __VLS_79 } = __VLS_77.slots;
let __VLS_80;
/** @ts-ignore @type { | typeof __VLS_components.elTree | typeof __VLS_components.ElTree | typeof __VLS_components['el-tree']} */
elTree;
// @ts-ignore
const __VLS_81 = __VLS_asFunctionalComponent1(__VLS_80, new __VLS_80({
    ...{ 'onCheck': {} },
    ref: "menuTreeRef",
    data: (__VLS_ctx.menuList),
    props: ({ label: 'title', children: 'children' }),
    showCheckbox: true,
    defaultExpandAll: true,
    nodeKey: "id",
    ...{ style: {} },
}));
const __VLS_82 = __VLS_81({
    ...{ 'onCheck': {} },
    ref: "menuTreeRef",
    data: (__VLS_ctx.menuList),
    props: ({ label: 'title', children: 'children' }),
    showCheckbox: true,
    defaultExpandAll: true,
    nodeKey: "id",
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_81));
let __VLS_85;
const __VLS_86 = {
    ...{ check: {} },
    onCheck: (...[$event]) => {
        __VLS_ctx.handleMenuCheck;
        // @ts-ignore
        [$t, menuList, handleMenuCheck,];
    },
};
var __VLS_87;
var __VLS_83;
var __VLS_84;
// @ts-ignore
[];
var __VLS_77;
// @ts-ignore
[];
var __VLS_18;
// @ts-ignore
[];
var __VLS_12;
{
    const { footer: __VLS_89 } = __VLS_3.slots;
    let __VLS_90;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_91 = __VLS_asFunctionalComponent1(__VLS_90, new __VLS_90({
        ...{ 'onClick': {} },
    }));
    const __VLS_92 = __VLS_91({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_91));
    let __VLS_95;
    const __VLS_96 = {
        ...{ click: {} },
        onClick: (__VLS_ctx.close),
    };
    const { default: __VLS_97 } = __VLS_93.slots;
    (__VLS_ctx.$t('button.cancel'));
    // @ts-ignore
    [$t, close,];
    var __VLS_93;
    var __VLS_94;
    let __VLS_98;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_99 = __VLS_asFunctionalComponent1(__VLS_98, new __VLS_98({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.submitLoading),
    }));
    const __VLS_100 = __VLS_99({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.submitLoading),
    }, ...__VLS_functionalComponentArgsRest(__VLS_99));
    let __VLS_103;
    const __VLS_104 = {
        ...{ click: {} },
        onClick: (__VLS_ctx.confirm),
    };
    const { default: __VLS_105 } = __VLS_101.slots;
    (__VLS_ctx.$t('button.confirm'));
    // @ts-ignore
    [$t, submitLoading, confirm,];
    var __VLS_101;
    var __VLS_102;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_3;
var __VLS_4;
// @ts-ignore
var __VLS_21 = __VLS_20, __VLS_88 = __VLS_87;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    setup: () => __VLS_exposed,
    emits: {},
});
export default {};
