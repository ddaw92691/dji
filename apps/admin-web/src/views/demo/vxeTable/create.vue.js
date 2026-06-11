/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { useCloned } from '@vueuse/core';
defineOptions({ name: 'VxeTableCreate' });
const emits = defineEmits(['refresh']);
const submitFormRef = useTemplateRef('submitFormRef');
const open = ref(false);
const submitLoading = ref(false);
const submitForm = ref({
    id: undefined,
    name: '',
    role: '',
    sex: '0',
    age: null,
    address: '',
});
const confirm = async () => {
    await submitFormRef.value?.validate();
    // 深拷贝数据
    const { cloned } = useCloned(submitForm.value);
    emits('refresh', submitForm.value.id ? 'update' : 'create', cloned.value);
    ElMessage.success(submitForm.value.id ? '编辑成功' : '新增成功');
    close();
};
const close = () => {
    submitFormRef.value?.resetFields();
    submitForm.value.id = undefined;
    submitForm.value = {
        id: undefined,
        name: '',
        role: '',
        sex: '0',
        age: null,
        address: '',
    };
    open.value = false;
};
// 表单验证规则
const formRules = {
    name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
    role: [{ required: true, message: '请输入角色', trigger: 'blur' }],
    sex: [{ required: true, message: '请选择性别', trigger: 'change' }],
    age: [{ required: true, message: '请输入年龄', trigger: 'blur' }],
    address: [{ required: true, message: '请输入地址', trigger: 'blur' }],
};
const showDialog = (data) => {
    if (data)
        submitForm.value = JSON.parse(JSON.stringify(data));
    open.value = true;
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
    title: (__VLS_ctx.submitForm.id ? '编辑数据' : '新增数据'),
    width: "600",
}));
const __VLS_2 = __VLS_1({
    ...{ 'onClose': {} },
    modelValue: (__VLS_ctx.open),
    title: (__VLS_ctx.submitForm.id ? '编辑数据' : '新增数据'),
    width: "600",
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
const __VLS_10 = __VLS_asFunctionalComponent1(__VLS_9, new __VLS_9({
    maxHeight: "60vh",
}));
const __VLS_11 = __VLS_10({
    maxHeight: "60vh",
}, ...__VLS_functionalComponentArgsRest(__VLS_10));
const { default: __VLS_14 } = __VLS_12.slots;
let __VLS_15;
/** @ts-ignore @type { | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form'] | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form']} */
elForm;
// @ts-ignore
const __VLS_16 = __VLS_asFunctionalComponent1(__VLS_15, new __VLS_15({
    ref: "submitFormRef",
    model: (__VLS_ctx.submitForm),
    labelWidth: "100px",
    labelPosition: "right",
    rules: (__VLS_ctx.formRules),
}));
const __VLS_17 = __VLS_16({
    ref: "submitFormRef",
    model: (__VLS_ctx.submitForm),
    labelWidth: "100px",
    labelPosition: "right",
    rules: (__VLS_ctx.formRules),
}, ...__VLS_functionalComponentArgsRest(__VLS_16));
var __VLS_20;
const { default: __VLS_22 } = __VLS_18.slots;
let __VLS_23;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_24 = __VLS_asFunctionalComponent1(__VLS_23, new __VLS_23({
    label: "姓名",
    prop: "name",
}));
const __VLS_25 = __VLS_24({
    label: "姓名",
    prop: "name",
}, ...__VLS_functionalComponentArgsRest(__VLS_24));
const { default: __VLS_28 } = __VLS_26.slots;
let __VLS_29;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_30 = __VLS_asFunctionalComponent1(__VLS_29, new __VLS_29({
    modelValue: (__VLS_ctx.submitForm.name),
    placeholder: "请输入姓名",
}));
const __VLS_31 = __VLS_30({
    modelValue: (__VLS_ctx.submitForm.name),
    placeholder: "请输入姓名",
}, ...__VLS_functionalComponentArgsRest(__VLS_30));
// @ts-ignore
[open, submitForm, submitForm, submitForm, close, formRules,];
var __VLS_26;
let __VLS_34;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_35 = __VLS_asFunctionalComponent1(__VLS_34, new __VLS_34({
    label: "角色",
    prop: "role",
}));
const __VLS_36 = __VLS_35({
    label: "角色",
    prop: "role",
}, ...__VLS_functionalComponentArgsRest(__VLS_35));
const { default: __VLS_39 } = __VLS_37.slots;
let __VLS_40;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_41 = __VLS_asFunctionalComponent1(__VLS_40, new __VLS_40({
    modelValue: (__VLS_ctx.submitForm.role),
    placeholder: "请输入角色",
}));
const __VLS_42 = __VLS_41({
    modelValue: (__VLS_ctx.submitForm.role),
    placeholder: "请输入角色",
}, ...__VLS_functionalComponentArgsRest(__VLS_41));
// @ts-ignore
[submitForm,];
var __VLS_37;
let __VLS_45;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_46 = __VLS_asFunctionalComponent1(__VLS_45, new __VLS_45({
    label: "性别",
    prop: "sex",
}));
const __VLS_47 = __VLS_46({
    label: "性别",
    prop: "sex",
}, ...__VLS_functionalComponentArgsRest(__VLS_46));
const { default: __VLS_50 } = __VLS_48.slots;
let __VLS_51;
/** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
elSelect;
// @ts-ignore
const __VLS_52 = __VLS_asFunctionalComponent1(__VLS_51, new __VLS_51({
    modelValue: (__VLS_ctx.submitForm.sex),
    placeholder: "请选择性别",
}));
const __VLS_53 = __VLS_52({
    modelValue: (__VLS_ctx.submitForm.sex),
    placeholder: "请选择性别",
}, ...__VLS_functionalComponentArgsRest(__VLS_52));
const { default: __VLS_56 } = __VLS_54.slots;
let __VLS_57;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_58 = __VLS_asFunctionalComponent1(__VLS_57, new __VLS_57({
    label: "男",
    value: "0",
}));
const __VLS_59 = __VLS_58({
    label: "男",
    value: "0",
}, ...__VLS_functionalComponentArgsRest(__VLS_58));
let __VLS_62;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_63 = __VLS_asFunctionalComponent1(__VLS_62, new __VLS_62({
    label: "女",
    value: "1",
}));
const __VLS_64 = __VLS_63({
    label: "女",
    value: "1",
}, ...__VLS_functionalComponentArgsRest(__VLS_63));
// @ts-ignore
[submitForm,];
var __VLS_54;
// @ts-ignore
[];
var __VLS_48;
let __VLS_67;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_68 = __VLS_asFunctionalComponent1(__VLS_67, new __VLS_67({
    label: "年龄",
    prop: "age",
}));
const __VLS_69 = __VLS_68({
    label: "年龄",
    prop: "age",
}, ...__VLS_functionalComponentArgsRest(__VLS_68));
const { default: __VLS_72 } = __VLS_70.slots;
let __VLS_73;
/** @ts-ignore @type { | typeof __VLS_components.elInputNumber | typeof __VLS_components.ElInputNumber | typeof __VLS_components['el-input-number']} */
elInputNumber;
// @ts-ignore
const __VLS_74 = __VLS_asFunctionalComponent1(__VLS_73, new __VLS_73({
    modelValue: (__VLS_ctx.submitForm.age),
    placeholder: "请输入年龄",
    controls: (false),
    ...{ style: {} },
    align: "left",
}));
const __VLS_75 = __VLS_74({
    modelValue: (__VLS_ctx.submitForm.age),
    placeholder: "请输入年龄",
    controls: (false),
    ...{ style: {} },
    align: "left",
}, ...__VLS_functionalComponentArgsRest(__VLS_74));
// @ts-ignore
[submitForm,];
var __VLS_70;
let __VLS_78;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_79 = __VLS_asFunctionalComponent1(__VLS_78, new __VLS_78({
    label: "地址",
    prop: "address",
}));
const __VLS_80 = __VLS_79({
    label: "地址",
    prop: "address",
}, ...__VLS_functionalComponentArgsRest(__VLS_79));
const { default: __VLS_83 } = __VLS_81.slots;
let __VLS_84;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_85 = __VLS_asFunctionalComponent1(__VLS_84, new __VLS_84({
    modelValue: (__VLS_ctx.submitForm.address),
    placeholder: "请输入地址",
}));
const __VLS_86 = __VLS_85({
    modelValue: (__VLS_ctx.submitForm.address),
    placeholder: "请输入地址",
}, ...__VLS_functionalComponentArgsRest(__VLS_85));
// @ts-ignore
[submitForm,];
var __VLS_81;
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
    // @ts-ignore
    [close,];
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
    // @ts-ignore
    [submitLoading, confirm,];
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
var __VLS_21 = __VLS_20;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    setup: () => __VLS_exposed,
    emits: {},
});
export default {};
