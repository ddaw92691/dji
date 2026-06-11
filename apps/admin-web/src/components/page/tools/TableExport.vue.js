/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import dayjs from 'dayjs';
import { useCloned } from '@vueuse/core';
import { VueDraggable } from 'vue-draggable-plus';
import { formatExportExcelData, exportToExcel } from '@/utils/exportExcel';
const props = defineProps();
const menuStore = useMenuStore();
const exportFormRef = useTemplateRef('exportFormRef');
// 选择要导出的字段
const { cloned: fieldsList } = useCloned(() => props.columns.filter((col) => col.type !== 'selection' && col.prop !== 'operation'));
// dialog开关
const open = ref(false);
// 导出form
const exportForm = ref({
    name: '',
    format: '.xlsx',
    data: 'current',
    fields: '',
});
// 全选状态计算
const isAllSelected = computed(() => fieldsList.value.every((item) => item.visible));
const isIndeterminate = computed(() => {
    const checkedCount = fieldsList.value.filter((item) => item.visible).length;
    return checkedCount > 0 && checkedCount < fieldsList.value.length;
});
// 全选切换
const handleCheckAll = (val) => {
    const value = val;
    const newCols = fieldsList.value.map((item) => ({ ...item, visible: value }));
    fieldsList.value = newCols;
};
// 恢复默认
const resetFields = () => {
    // 使用深拷贝，避免引用原始数据
    fieldsList.value = props.columns
        .filter((col) => col.type !== 'selection' && col.prop !== 'operation')
        .map((col) => ({ ...col }));
};
// 导出
const handleExport = async () => {
    await exportFormRef.value?.validate();
    // 获取要导出的字段
    const selectedFields = fieldsList.value.filter((item) => item.visible);
    if (selectedFields.length === 0) {
        ElMessage.warning('请至少选择一个字段');
        return;
    }
    // 获取要导出的数据
    let dataToExport = [];
    // 根据选择的数据类型获取数据
    switch (exportForm.value.data) {
        case 'current':
            dataToExport = props.currentPageData;
            break;
        case 'selected':
            dataToExport = props.selectedData || [];
            if (dataToExport.length === 0) {
                ElMessage.warning('没有选中的数据');
                return;
            }
            break;
    }
    if (dataToExport.length === 0) {
        ElMessage.warning('没有可导出的数据');
        return;
    }
    // 格式化数据
    const { mapExcelData, colWidth } = formatExportExcelData(dataToExport, selectedFields);
    // 导出Excel
    await exportToExcel(mapExcelData, exportForm.value.name, exportForm.value.format, colWidth);
    // 导出成功
    ElMessage.success('导出成功');
    // 关闭对话框
    open.value = false;
};
// 表单验证规则
const formRules = {
    name: [{ required: true, message: '请输入文件名称', trigger: 'blur' }],
};
// 打开导出对话框
const openDialog = () => {
    // 赋值默认文件名称
    exportForm.value.name = `导出数据_${dayjs().format('YYYYMMDDHHmmss')}`;
    open.value = true;
};
// 关闭对话框
const close = () => {
    // 重置表单
    exportFormRef.value?.resetFields();
    // 恢复默认字段选择
    resetFields();
};
const __VLS_ctx = {
    ...{},
    ...{},
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
let __VLS_0;
/** @ts-ignore @type { | typeof __VLS_components.IconButton} */
IconButton;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    ...{ 'onClick': {} },
    icon: "HOutline:DocumentArrowDownIcon",
    size: "1.75rem",
    iconSize: "18px",
    tooltip: "导出",
}));
const __VLS_2 = __VLS_1({
    ...{ 'onClick': {} },
    icon: "HOutline:DocumentArrowDownIcon",
    size: "1.75rem",
    iconSize: "18px",
    tooltip: "导出",
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
let __VLS_5;
const __VLS_6 = {
    ...{ click: {} },
    onClick: (__VLS_ctx.openDialog),
};
var __VLS_3;
var __VLS_4;
let __VLS_7;
/** @ts-ignore @type { | typeof __VLS_components.BaseDialog | typeof __VLS_components.BaseDialog} */
BaseDialog;
// @ts-ignore
const __VLS_8 = __VLS_asFunctionalComponent1(__VLS_7, new __VLS_7({
    ...{ 'onConfirm': {} },
    ...{ 'onClose': {} },
    modelValue: (__VLS_ctx.open),
    title: "导出",
    width: "500",
}));
const __VLS_9 = __VLS_8({
    ...{ 'onConfirm': {} },
    ...{ 'onClose': {} },
    modelValue: (__VLS_ctx.open),
    title: "导出",
    width: "500",
}, ...__VLS_functionalComponentArgsRest(__VLS_8));
let __VLS_12;
const __VLS_13 = {
    ...{ confirm: {} },
    onConfirm: (__VLS_ctx.handleExport),
    ...{ close: {} },
    onClose: (__VLS_ctx.close),
};
const { default: __VLS_14 } = __VLS_10.slots;
let __VLS_15;
/** @ts-ignore @type { | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form'] | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form']} */
elForm;
// @ts-ignore
const __VLS_16 = __VLS_asFunctionalComponent1(__VLS_15, new __VLS_15({
    model: (__VLS_ctx.exportForm),
    rules: (__VLS_ctx.formRules),
    ref: "exportFormRef",
    labelWidth: "100px",
    labelPosition: "right",
}));
const __VLS_17 = __VLS_16({
    model: (__VLS_ctx.exportForm),
    rules: (__VLS_ctx.formRules),
    ref: "exportFormRef",
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
    label: "文件名称",
    prop: "name",
}));
const __VLS_25 = __VLS_24({
    label: "文件名称",
    prop: "name",
}, ...__VLS_functionalComponentArgsRest(__VLS_24));
const { default: __VLS_28 } = __VLS_26.slots;
let __VLS_29;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_30 = __VLS_asFunctionalComponent1(__VLS_29, new __VLS_29({
    modelValue: (__VLS_ctx.exportForm.name),
    placeholder: "请输入文件名称",
}));
const __VLS_31 = __VLS_30({
    modelValue: (__VLS_ctx.exportForm.name),
    placeholder: "请输入文件名称",
}, ...__VLS_functionalComponentArgsRest(__VLS_30));
// @ts-ignore
[openDialog, open, handleExport, close, exportForm, exportForm, formRules,];
var __VLS_26;
let __VLS_34;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_35 = __VLS_asFunctionalComponent1(__VLS_34, new __VLS_34({
    label: "导出格式",
    prop: "format",
}));
const __VLS_36 = __VLS_35({
    label: "导出格式",
    prop: "format",
}, ...__VLS_functionalComponentArgsRest(__VLS_35));
const { default: __VLS_39 } = __VLS_37.slots;
let __VLS_40;
/** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
elSelect;
// @ts-ignore
const __VLS_41 = __VLS_asFunctionalComponent1(__VLS_40, new __VLS_40({
    modelValue: (__VLS_ctx.exportForm.format),
    placeholder: "请选择导出格式",
}));
const __VLS_42 = __VLS_41({
    modelValue: (__VLS_ctx.exportForm.format),
    placeholder: "请选择导出格式",
}, ...__VLS_functionalComponentArgsRest(__VLS_41));
const { default: __VLS_45 } = __VLS_43.slots;
let __VLS_46;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_47 = __VLS_asFunctionalComponent1(__VLS_46, new __VLS_46({
    label: "XLSX",
    value: ".xlsx",
}));
const __VLS_48 = __VLS_47({
    label: "XLSX",
    value: ".xlsx",
}, ...__VLS_functionalComponentArgsRest(__VLS_47));
let __VLS_51;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_52 = __VLS_asFunctionalComponent1(__VLS_51, new __VLS_51({
    label: "CSV",
    value: ".csv",
}));
const __VLS_53 = __VLS_52({
    label: "CSV",
    value: ".csv",
}, ...__VLS_functionalComponentArgsRest(__VLS_52));
let __VLS_56;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_57 = __VLS_asFunctionalComponent1(__VLS_56, new __VLS_56({
    label: "HTML",
    value: ".html",
}));
const __VLS_58 = __VLS_57({
    label: "HTML",
    value: ".html",
}, ...__VLS_functionalComponentArgsRest(__VLS_57));
// @ts-ignore
[exportForm,];
var __VLS_43;
// @ts-ignore
[];
var __VLS_37;
let __VLS_61;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_62 = __VLS_asFunctionalComponent1(__VLS_61, new __VLS_61({
    label: "选择数据",
    prop: "data",
}));
const __VLS_63 = __VLS_62({
    label: "选择数据",
    prop: "data",
}, ...__VLS_functionalComponentArgsRest(__VLS_62));
const { default: __VLS_66 } = __VLS_64.slots;
let __VLS_67;
/** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
elSelect;
// @ts-ignore
const __VLS_68 = __VLS_asFunctionalComponent1(__VLS_67, new __VLS_67({
    modelValue: (__VLS_ctx.exportForm.data),
    placeholder: "请选择数据",
}));
const __VLS_69 = __VLS_68({
    modelValue: (__VLS_ctx.exportForm.data),
    placeholder: "请选择数据",
}, ...__VLS_functionalComponentArgsRest(__VLS_68));
const { default: __VLS_72 } = __VLS_70.slots;
let __VLS_73;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_74 = __VLS_asFunctionalComponent1(__VLS_73, new __VLS_73({
    label: "当前页数据",
    value: "current",
}));
const __VLS_75 = __VLS_74({
    label: "当前页数据",
    value: "current",
}, ...__VLS_functionalComponentArgsRest(__VLS_74));
let __VLS_78;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_79 = __VLS_asFunctionalComponent1(__VLS_78, new __VLS_78({
    label: "选中数据",
    value: "selected",
}));
const __VLS_80 = __VLS_79({
    label: "选中数据",
    value: "selected",
}, ...__VLS_functionalComponentArgsRest(__VLS_79));
// @ts-ignore
[exportForm,];
var __VLS_70;
// @ts-ignore
[];
var __VLS_64;
let __VLS_83;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_84 = __VLS_asFunctionalComponent1(__VLS_83, new __VLS_83({
    label: "选择字段",
    prop: "fields",
}));
const __VLS_85 = __VLS_84({
    label: "选择字段",
    prop: "fields",
}, ...__VLS_functionalComponentArgsRest(__VLS_84));
const { default: __VLS_88 } = __VLS_86.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "fields-wrap" },
});
/** @type {__VLS_StyleScopedClasses['fields-wrap']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "fields-header" },
});
/** @type {__VLS_StyleScopedClasses['fields-header']} */ ;
let __VLS_89;
/** @ts-ignore @type { | typeof __VLS_components.elCheckbox | typeof __VLS_components.ElCheckbox | typeof __VLS_components['el-checkbox'] | typeof __VLS_components.elCheckbox | typeof __VLS_components.ElCheckbox | typeof __VLS_components['el-checkbox']} */
elCheckbox;
// @ts-ignore
const __VLS_90 = __VLS_asFunctionalComponent1(__VLS_89, new __VLS_89({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.isAllSelected),
    indeterminate: (__VLS_ctx.isIndeterminate),
}));
const __VLS_91 = __VLS_90({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.isAllSelected),
    indeterminate: (__VLS_ctx.isIndeterminate),
}, ...__VLS_functionalComponentArgsRest(__VLS_90));
let __VLS_94;
const __VLS_95 = {
    ...{ change: {} },
    onChange: (__VLS_ctx.handleCheckAll),
};
const { default: __VLS_96 } = __VLS_92.slots;
// @ts-ignore
[isAllSelected, isIndeterminate, handleCheckAll,];
var __VLS_92;
var __VLS_93;
let __VLS_97;
/** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
elButton;
// @ts-ignore
const __VLS_98 = __VLS_asFunctionalComponent1(__VLS_97, new __VLS_97({
    ...{ 'onClick': {} },
    type: "primary",
    link: true,
}));
const __VLS_99 = __VLS_98({
    ...{ 'onClick': {} },
    type: "primary",
    link: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_98));
let __VLS_102;
const __VLS_103 = {
    ...{ click: {} },
    onClick: (__VLS_ctx.resetFields),
};
const { default: __VLS_104 } = __VLS_100.slots;
// @ts-ignore
[resetFields,];
var __VLS_100;
var __VLS_101;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "fields-content" },
});
/** @type {__VLS_StyleScopedClasses['fields-content']} */ ;
let __VLS_105;
/** @ts-ignore @type { | typeof __VLS_components.VueDraggable | typeof __VLS_components.VueDraggable} */
VueDraggable;
// @ts-ignore
const __VLS_106 = __VLS_asFunctionalComponent1(__VLS_105, new __VLS_105({
    modelValue: (__VLS_ctx.fieldsList),
    animation: (150),
    handle: ".handle",
}));
const __VLS_107 = __VLS_106({
    modelValue: (__VLS_ctx.fieldsList),
    animation: (150),
    handle: ".handle",
}, ...__VLS_functionalComponentArgsRest(__VLS_106));
const { default: __VLS_110 } = __VLS_108.slots;
for (const [item] of __VLS_vFor((__VLS_ctx.fieldsList))) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "fields-item" },
        key: (item.prop ? item.prop : item.type),
    });
    /** @type {__VLS_StyleScopedClasses['fields-item']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "fields-item-left" },
    });
    /** @type {__VLS_StyleScopedClasses['fields-item-left']} */ ;
    let __VLS_111;
    /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
    elIcon;
    // @ts-ignore
    const __VLS_112 = __VLS_asFunctionalComponent1(__VLS_111, new __VLS_111({
        size: "16",
        ...{ class: "drag-wrap handle" },
    }));
    const __VLS_113 = __VLS_112({
        size: "16",
        ...{ class: "drag-wrap handle" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_112));
    /** @type {__VLS_StyleScopedClasses['drag-wrap']} */ ;
    /** @type {__VLS_StyleScopedClasses['handle']} */ ;
    const { default: __VLS_116 } = __VLS_114.slots;
    const __VLS_117 = (__VLS_ctx.menuStore.iconComponents['HSolid:Bars3Icon']);
    // @ts-ignore
    const __VLS_118 = __VLS_asFunctionalComponent1(__VLS_117, new __VLS_117({}));
    const __VLS_119 = __VLS_118({}, ...__VLS_functionalComponentArgsRest(__VLS_118));
    // @ts-ignore
    [fieldsList, fieldsList, menuStore,];
    var __VLS_114;
    let __VLS_122;
    /** @ts-ignore @type { | typeof __VLS_components.elCheckbox | typeof __VLS_components.ElCheckbox | typeof __VLS_components['el-checkbox'] | typeof __VLS_components.elCheckbox | typeof __VLS_components.ElCheckbox | typeof __VLS_components['el-checkbox']} */
    elCheckbox;
    // @ts-ignore
    const __VLS_123 = __VLS_asFunctionalComponent1(__VLS_122, new __VLS_122({
        modelValue: (item.visible),
    }));
    const __VLS_124 = __VLS_123({
        modelValue: (item.visible),
    }, ...__VLS_functionalComponentArgsRest(__VLS_123));
    const { default: __VLS_127 } = __VLS_125.slots;
    (item.label);
    // @ts-ignore
    [];
    var __VLS_125;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "fields-item-right" },
    });
    /** @type {__VLS_StyleScopedClasses['fields-item-right']} */ ;
    let __VLS_128;
    /** @ts-ignore @type { | typeof __VLS_components.elInputNumber | typeof __VLS_components.ElInputNumber | typeof __VLS_components['el-input-number']} */
    elInputNumber;
    // @ts-ignore
    const __VLS_129 = __VLS_asFunctionalComponent1(__VLS_128, new __VLS_128({
        modelValue: (item.width),
        placeholder: "列宽",
        controls: (false),
        size: "small",
        ...{ style: {} },
    }));
    const __VLS_130 = __VLS_129({
        modelValue: (item.width),
        placeholder: "列宽",
        controls: (false),
        size: "small",
        ...{ style: {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_129));
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_108;
// @ts-ignore
[];
var __VLS_86;
// @ts-ignore
[];
var __VLS_18;
// @ts-ignore
[];
var __VLS_10;
var __VLS_11;
// @ts-ignore
var __VLS_21 = __VLS_20;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    __typeProps: {},
});
export default {};
