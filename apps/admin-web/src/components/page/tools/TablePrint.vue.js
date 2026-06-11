/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import dayjs from 'dayjs';
import printJS from 'print-js';
import { useCloned } from '@vueuse/core';
import { VueDraggable } from 'vue-draggable-plus';
import { ElMessage } from 'element-plus';
import { formatExportExcelData } from '@/utils/exportExcel';
const props = defineProps();
const menuStore = useMenuStore();
const printFormRef = useTemplateRef('printFormRef');
// 选择要打印的字段
const { cloned: fieldsList } = useCloned(() => props.columns.filter((col) => col.type !== 'selection' && col.prop !== 'operation'));
// dialog开关
const open = ref(false);
// 打印form
const printForm = ref({
    title: '',
    data: 'current',
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
    fieldsList.value = fieldsList.value.map((item) => ({ ...item, visible: value }));
};
// 恢复默认
const resetFields = () => {
    fieldsList.value = props.columns
        .filter((col) => col.type !== 'selection' && col.prop !== 'operation')
        .map((col) => ({ ...col }));
};
// 打开打印对话框
const openDialog = () => {
    // 赋值默认标题
    printForm.value.title = `打印数据_${dayjs().format('YYYY-MM-DD HH:mm:ss')}`;
    open.value = true;
};
// 关闭dialog
const close = () => {
    // 重置表单
    printFormRef.value?.resetFields();
    // 恢复默认字段选择
    resetFields();
};
// 打印
const handlePrint = () => {
    // 获取选中的字段
    const selectedFields = fieldsList.value.filter((item) => item.visible);
    if (selectedFields.length === 0) {
        ElMessage.warning('请至少选择一个字段');
        return;
    }
    // 获取要打印的数据
    let dataToPrint = [];
    switch (printForm.value.data) {
        case 'current':
            dataToPrint = props.tableData || [];
            break;
        case 'selected':
            dataToPrint = props.selectedData || [];
            if (dataToPrint.length === 0) {
                ElMessage.warning('没有选中的数据');
                return;
            }
            break;
    }
    if (dataToPrint.length === 0) {
        ElMessage.warning('没有可打印的数据');
        return;
    }
    // 格式化数据
    const { mapExcelData: mapPrintData } = formatExportExcelData(dataToPrint, selectedFields);
    // 格式化打印表格的表头
    const printTableHeader = selectedFields.map((item) => item.label);
    // 调用printJS打印
    printJS({
        printable: mapPrintData,
        type: 'json',
        properties: printTableHeader,
        header: printForm.value.title,
    });
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
    icon: "HOutline:PrinterIcon",
    size: "1.75rem",
    iconSize: "18px",
    tooltip: "打印",
}));
const __VLS_2 = __VLS_1({
    ...{ 'onClick': {} },
    icon: "HOutline:PrinterIcon",
    size: "1.75rem",
    iconSize: "18px",
    tooltip: "打印",
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
    title: "打印",
    width: "500",
}));
const __VLS_9 = __VLS_8({
    ...{ 'onConfirm': {} },
    ...{ 'onClose': {} },
    modelValue: (__VLS_ctx.open),
    title: "打印",
    width: "500",
}, ...__VLS_functionalComponentArgsRest(__VLS_8));
let __VLS_12;
const __VLS_13 = {
    ...{ confirm: {} },
    onConfirm: (__VLS_ctx.handlePrint),
    ...{ close: {} },
    onClose: (__VLS_ctx.close),
};
const { default: __VLS_14 } = __VLS_10.slots;
let __VLS_15;
/** @ts-ignore @type { | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form'] | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form']} */
elForm;
// @ts-ignore
const __VLS_16 = __VLS_asFunctionalComponent1(__VLS_15, new __VLS_15({
    model: (__VLS_ctx.printForm),
    labelWidth: "100px",
    labelPosition: "right",
    ref: "printFormRef",
}));
const __VLS_17 = __VLS_16({
    model: (__VLS_ctx.printForm),
    labelWidth: "100px",
    labelPosition: "right",
    ref: "printFormRef",
}, ...__VLS_functionalComponentArgsRest(__VLS_16));
var __VLS_20;
const { default: __VLS_22 } = __VLS_18.slots;
let __VLS_23;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_24 = __VLS_asFunctionalComponent1(__VLS_23, new __VLS_23({
    label: "打印标题",
    prop: "title",
}));
const __VLS_25 = __VLS_24({
    label: "打印标题",
    prop: "title",
}, ...__VLS_functionalComponentArgsRest(__VLS_24));
const { default: __VLS_28 } = __VLS_26.slots;
let __VLS_29;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_30 = __VLS_asFunctionalComponent1(__VLS_29, new __VLS_29({
    modelValue: (__VLS_ctx.printForm.title),
    placeholder: "请输入打印标题",
}));
const __VLS_31 = __VLS_30({
    modelValue: (__VLS_ctx.printForm.title),
    placeholder: "请输入打印标题",
}, ...__VLS_functionalComponentArgsRest(__VLS_30));
// @ts-ignore
[openDialog, open, handlePrint, close, printForm, printForm,];
var __VLS_26;
let __VLS_34;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_35 = __VLS_asFunctionalComponent1(__VLS_34, new __VLS_34({
    label: "选择数据",
    prop: "data",
}));
const __VLS_36 = __VLS_35({
    label: "选择数据",
    prop: "data",
}, ...__VLS_functionalComponentArgsRest(__VLS_35));
const { default: __VLS_39 } = __VLS_37.slots;
let __VLS_40;
/** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
elSelect;
// @ts-ignore
const __VLS_41 = __VLS_asFunctionalComponent1(__VLS_40, new __VLS_40({
    modelValue: (__VLS_ctx.printForm.data),
    placeholder: "请选择数据",
}));
const __VLS_42 = __VLS_41({
    modelValue: (__VLS_ctx.printForm.data),
    placeholder: "请选择数据",
}, ...__VLS_functionalComponentArgsRest(__VLS_41));
const { default: __VLS_45 } = __VLS_43.slots;
let __VLS_46;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_47 = __VLS_asFunctionalComponent1(__VLS_46, new __VLS_46({
    label: "当前页数据",
    value: "current",
}));
const __VLS_48 = __VLS_47({
    label: "当前页数据",
    value: "current",
}, ...__VLS_functionalComponentArgsRest(__VLS_47));
let __VLS_51;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_52 = __VLS_asFunctionalComponent1(__VLS_51, new __VLS_51({
    label: "选中数据",
    value: "selected",
}));
const __VLS_53 = __VLS_52({
    label: "选中数据",
    value: "selected",
}, ...__VLS_functionalComponentArgsRest(__VLS_52));
// @ts-ignore
[printForm,];
var __VLS_43;
// @ts-ignore
[];
var __VLS_37;
let __VLS_56;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_57 = __VLS_asFunctionalComponent1(__VLS_56, new __VLS_56({
    label: "选择字段",
    prop: "fields",
}));
const __VLS_58 = __VLS_57({
    label: "选择字段",
    prop: "fields",
}, ...__VLS_functionalComponentArgsRest(__VLS_57));
const { default: __VLS_61 } = __VLS_59.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "fields-wrap" },
});
/** @type {__VLS_StyleScopedClasses['fields-wrap']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "fields-header" },
});
/** @type {__VLS_StyleScopedClasses['fields-header']} */ ;
let __VLS_62;
/** @ts-ignore @type { | typeof __VLS_components.elCheckbox | typeof __VLS_components.ElCheckbox | typeof __VLS_components['el-checkbox'] | typeof __VLS_components.elCheckbox | typeof __VLS_components.ElCheckbox | typeof __VLS_components['el-checkbox']} */
elCheckbox;
// @ts-ignore
const __VLS_63 = __VLS_asFunctionalComponent1(__VLS_62, new __VLS_62({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.isAllSelected),
    indeterminate: (__VLS_ctx.isIndeterminate),
}));
const __VLS_64 = __VLS_63({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.isAllSelected),
    indeterminate: (__VLS_ctx.isIndeterminate),
}, ...__VLS_functionalComponentArgsRest(__VLS_63));
let __VLS_67;
const __VLS_68 = {
    ...{ change: {} },
    onChange: (__VLS_ctx.handleCheckAll),
};
const { default: __VLS_69 } = __VLS_65.slots;
// @ts-ignore
[isAllSelected, isIndeterminate, handleCheckAll,];
var __VLS_65;
var __VLS_66;
let __VLS_70;
/** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
elButton;
// @ts-ignore
const __VLS_71 = __VLS_asFunctionalComponent1(__VLS_70, new __VLS_70({
    ...{ 'onClick': {} },
    type: "primary",
    link: true,
}));
const __VLS_72 = __VLS_71({
    ...{ 'onClick': {} },
    type: "primary",
    link: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_71));
let __VLS_75;
const __VLS_76 = {
    ...{ click: {} },
    onClick: (__VLS_ctx.resetFields),
};
const { default: __VLS_77 } = __VLS_73.slots;
// @ts-ignore
[resetFields,];
var __VLS_73;
var __VLS_74;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "fields-content" },
});
/** @type {__VLS_StyleScopedClasses['fields-content']} */ ;
let __VLS_78;
/** @ts-ignore @type { | typeof __VLS_components.VueDraggable | typeof __VLS_components.VueDraggable} */
VueDraggable;
// @ts-ignore
const __VLS_79 = __VLS_asFunctionalComponent1(__VLS_78, new __VLS_78({
    modelValue: (__VLS_ctx.fieldsList),
    animation: (150),
    handle: ".handle",
}));
const __VLS_80 = __VLS_79({
    modelValue: (__VLS_ctx.fieldsList),
    animation: (150),
    handle: ".handle",
}, ...__VLS_functionalComponentArgsRest(__VLS_79));
const { default: __VLS_83 } = __VLS_81.slots;
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
    let __VLS_84;
    /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
    elIcon;
    // @ts-ignore
    const __VLS_85 = __VLS_asFunctionalComponent1(__VLS_84, new __VLS_84({
        size: "16",
        ...{ class: "drag-wrap handle" },
    }));
    const __VLS_86 = __VLS_85({
        size: "16",
        ...{ class: "drag-wrap handle" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_85));
    /** @type {__VLS_StyleScopedClasses['drag-wrap']} */ ;
    /** @type {__VLS_StyleScopedClasses['handle']} */ ;
    const { default: __VLS_89 } = __VLS_87.slots;
    const __VLS_90 = (__VLS_ctx.menuStore.iconComponents['HSolid:Bars3Icon']);
    // @ts-ignore
    const __VLS_91 = __VLS_asFunctionalComponent1(__VLS_90, new __VLS_90({}));
    const __VLS_92 = __VLS_91({}, ...__VLS_functionalComponentArgsRest(__VLS_91));
    // @ts-ignore
    [fieldsList, fieldsList, menuStore,];
    var __VLS_87;
    let __VLS_95;
    /** @ts-ignore @type { | typeof __VLS_components.elCheckbox | typeof __VLS_components.ElCheckbox | typeof __VLS_components['el-checkbox'] | typeof __VLS_components.elCheckbox | typeof __VLS_components.ElCheckbox | typeof __VLS_components['el-checkbox']} */
    elCheckbox;
    // @ts-ignore
    const __VLS_96 = __VLS_asFunctionalComponent1(__VLS_95, new __VLS_95({
        modelValue: (item.visible),
    }));
    const __VLS_97 = __VLS_96({
        modelValue: (item.visible),
    }, ...__VLS_functionalComponentArgsRest(__VLS_96));
    const { default: __VLS_100 } = __VLS_98.slots;
    (item.label);
    // @ts-ignore
    [];
    var __VLS_98;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_81;
// @ts-ignore
[];
var __VLS_59;
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
