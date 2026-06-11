/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ref, reactive, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { i18nApi } from '@/api/i18n';
defineOptions({ name: 'I18nCountryLanguageView' });
const loading = ref(false);
const submitLoading = ref(false);
const tableData = ref([]);
const selectedCountryId = ref('');
const countryOptions = ref([]);
const languageOptions = ref([]);
const dialogVisible = ref(false);
const formRef = ref();
const form = reactive({
    countryId: null,
    languageId: null,
    isDefault: false,
});
const rules = {
    countryId: [{ required: true, message: '请选择国家', trigger: 'change' }],
    languageId: [{ required: true, message: '请选择语言', trigger: 'change' }],
};
async function loadCountries() {
    try {
        const { data: res } = await i18nApi.getCountries({ pageSize: 999, status: 'ENABLE' });
        if (res.code === 200) {
            countryOptions.value = res.data.list || [];
        }
    }
    catch {
        ElMessage.error('加载国家列表失败');
    }
}
async function loadLanguages() {
    try {
        const { data: res } = await i18nApi.getLanguages({ pageSize: 999, status: 'ENABLE' });
        if (res.code === 200) {
            languageOptions.value = res.data.list || [];
        }
    }
    catch {
        ElMessage.error('加载语言列表失败');
    }
}
async function fetchData() {
    if (!selectedCountryId.value) {
        tableData.value = [];
        return;
    }
    loading.value = true;
    try {
        const selectedCode = countryOptions.value.find((c) => c.id === selectedCountryId.value)?.code;
        const { data: res } = await i18nApi.getCountryLanguages({ countryCode: selectedCode });
        if (res.code === 200) {
            const item = res.data.find((it) => it.countryId === selectedCountryId.value) || res.data[0];
            tableData.value = item?.languages || [];
        }
        else {
            tableData.value = [];
            ElMessage.error(res.message || '获取数据失败');
        }
    }
    catch {
        ElMessage.error('获取数据失败');
    }
    finally {
        loading.value = false;
    }
}
function handleAddLanguage() {
    form.countryId = selectedCountryId.value ? selectedCountryId.value : null;
    form.languageId = null;
    form.isDefault = false;
    dialogVisible.value = true;
}
async function handleSubmit() {
    if (!formRef.value)
        return;
    const valid = await formRef.value.validate().catch(() => false);
    if (!valid)
        return;
    submitLoading.value = true;
    try {
        const { data: res } = await i18nApi.bindCountryLanguage({
            countryId: form.countryId,
            languageId: form.languageId,
            isDefault: form.isDefault,
        });
        if (res.code === 200) {
            ElMessage.success('语言绑定成功');
            dialogVisible.value = false;
            if (form.countryId) {
                selectedCountryId.value = form.countryId;
            }
            fetchData();
        }
        else {
            ElMessage.error(res.message || '绑定失败');
        }
    }
    catch {
        ElMessage.error('绑定失败');
    }
    finally {
        submitLoading.value = false;
    }
}
async function handleSetDefault(row) {
    try {
        const { data: res } = await i18nApi.setDefaultCountryLanguage(row.id);
        if (res.code === 200) {
            ElMessage.success('已设为默认语言');
            fetchData();
        }
        else {
            ElMessage.error(res.message || '设置默认失败');
        }
    }
    catch {
        ElMessage.error('设置默认失败');
    }
}
async function handleDelete(row) {
    try {
        const { data: res } = await i18nApi.deleteCountryLanguage(row.id);
        if (res.code === 200) {
            ElMessage.success('删除成功');
            fetchData();
        }
        else {
            ElMessage.error(res.message || '删除失败');
        }
    }
    catch {
        ElMessage.error('删除失败');
    }
}
function resetForm() {
    formRef.value?.resetFields();
}
onMounted(async () => {
    await Promise.all([loadCountries(), loadLanguages()]);
    const firstCountry = countryOptions.value[0];
    if (firstCountry) {
        selectedCountryId.value = firstCountry.id;
        fetchData();
    }
});
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "i18n-page" },
});
/** @type {__VLS_StyleScopedClasses['i18n-page']} */ ;
let __VLS_0;
/** @ts-ignore @type { | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form'] | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form']} */
elForm;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    inline: (true),
    ...{ class: "search-bar" },
}));
const __VLS_2 = __VLS_1({
    inline: (true),
    ...{ class: "search-bar" },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
/** @type {__VLS_StyleScopedClasses['search-bar']} */ ;
const { default: __VLS_5 } = __VLS_3.slots;
let __VLS_6;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_7 = __VLS_asFunctionalComponent1(__VLS_6, new __VLS_6({
    label: "国家",
}));
const __VLS_8 = __VLS_7({
    label: "国家",
}, ...__VLS_functionalComponentArgsRest(__VLS_7));
const { default: __VLS_11 } = __VLS_9.slots;
let __VLS_12;
/** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
elSelect;
// @ts-ignore
const __VLS_13 = __VLS_asFunctionalComponent1(__VLS_12, new __VLS_12({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.selectedCountryId),
    placeholder: "请选择国家",
    filterable: true,
    ...{ style: {} },
}));
const __VLS_14 = __VLS_13({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.selectedCountryId),
    placeholder: "请选择国家",
    filterable: true,
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_13));
let __VLS_17;
const __VLS_18 = {
    ...{ change: {} },
    onChange: (__VLS_ctx.fetchData),
};
const { default: __VLS_19 } = __VLS_15.slots;
for (const [c] of __VLS_vFor((__VLS_ctx.countryOptions))) {
    let __VLS_20;
    /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
    elOption;
    // @ts-ignore
    const __VLS_21 = __VLS_asFunctionalComponent1(__VLS_20, new __VLS_20({
        key: (c.id),
        label: (`${c.name} (${c.code})`),
        value: (c.id),
    }));
    const __VLS_22 = __VLS_21({
        key: (c.id),
        label: (`${c.name} (${c.code})`),
        value: (c.id),
    }, ...__VLS_functionalComponentArgsRest(__VLS_21));
    // @ts-ignore
    [selectedCountryId, fetchData, countryOptions,];
}
// @ts-ignore
[];
var __VLS_15;
var __VLS_16;
// @ts-ignore
[];
var __VLS_9;
let __VLS_25;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_26 = __VLS_asFunctionalComponent1(__VLS_25, new __VLS_25({}));
const __VLS_27 = __VLS_26({}, ...__VLS_functionalComponentArgsRest(__VLS_26));
const { default: __VLS_30 } = __VLS_28.slots;
let __VLS_31;
/** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
elButton;
// @ts-ignore
const __VLS_32 = __VLS_asFunctionalComponent1(__VLS_31, new __VLS_31({
    ...{ 'onClick': {} },
    type: "primary",
}));
const __VLS_33 = __VLS_32({
    ...{ 'onClick': {} },
    type: "primary",
}, ...__VLS_functionalComponentArgsRest(__VLS_32));
let __VLS_36;
const __VLS_37 = {
    ...{ click: {} },
    onClick: (__VLS_ctx.handleAddLanguage),
};
__VLS_asFunctionalDirective(__VLS_directives.vPermission, {})(null, { ...__VLS_directiveBindingRestFields, value: ('i18n:countryLanguage:add') }, null, null);
const { default: __VLS_38 } = __VLS_34.slots;
// @ts-ignore
[handleAddLanguage, vPermission,];
var __VLS_34;
var __VLS_35;
// @ts-ignore
[];
var __VLS_28;
// @ts-ignore
[];
var __VLS_3;
let __VLS_39;
/** @ts-ignore @type { | typeof __VLS_components.elTable | typeof __VLS_components.ElTable | typeof __VLS_components['el-table'] | typeof __VLS_components.elTable | typeof __VLS_components.ElTable | typeof __VLS_components['el-table']} */
elTable;
// @ts-ignore
const __VLS_40 = __VLS_asFunctionalComponent1(__VLS_39, new __VLS_39({
    data: (__VLS_ctx.tableData),
    border: true,
    stripe: true,
}));
const __VLS_41 = __VLS_40({
    data: (__VLS_ctx.tableData),
    border: true,
    stripe: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_40));
__VLS_asFunctionalDirective(__VLS_directives.vLoading, {})(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.loading) }, null, null);
const { default: __VLS_44 } = __VLS_42.slots;
let __VLS_45;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_46 = __VLS_asFunctionalComponent1(__VLS_45, new __VLS_45({
    prop: "code",
    label: "语言代码",
    width: "140",
}));
const __VLS_47 = __VLS_46({
    prop: "code",
    label: "语言代码",
    width: "140",
}, ...__VLS_functionalComponentArgsRest(__VLS_46));
let __VLS_50;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_51 = __VLS_asFunctionalComponent1(__VLS_50, new __VLS_50({
    prop: "name",
    label: "语言名称",
    minWidth: "140",
    showOverflowTooltip: true,
}));
const __VLS_52 = __VLS_51({
    prop: "name",
    label: "语言名称",
    minWidth: "140",
    showOverflowTooltip: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_51));
let __VLS_55;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_56 = __VLS_asFunctionalComponent1(__VLS_55, new __VLS_55({
    prop: "nativeName",
    label: "本地名称",
    minWidth: "140",
    showOverflowTooltip: true,
}));
const __VLS_57 = __VLS_56({
    prop: "nativeName",
    label: "本地名称",
    minWidth: "140",
    showOverflowTooltip: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_56));
let __VLS_60;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_61 = __VLS_asFunctionalComponent1(__VLS_60, new __VLS_60({
    prop: "isDefault",
    label: "默认语言",
    width: "100",
    align: "center",
}));
const __VLS_62 = __VLS_61({
    prop: "isDefault",
    label: "默认语言",
    width: "100",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_61));
const { default: __VLS_65 } = __VLS_63.slots;
{
    const { default: __VLS_66 } = __VLS_63.slots;
    const [{ row }] = __VLS_vSlot(__VLS_66);
    let __VLS_67;
    /** @ts-ignore @type { | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag'] | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag']} */
    elTag;
    // @ts-ignore
    const __VLS_68 = __VLS_asFunctionalComponent1(__VLS_67, new __VLS_67({
        type: (row.isDefault ? 'success' : 'info'),
    }));
    const __VLS_69 = __VLS_68({
        type: (row.isDefault ? 'success' : 'info'),
    }, ...__VLS_functionalComponentArgsRest(__VLS_68));
    const { default: __VLS_72 } = __VLS_70.slots;
    (row.isDefault ? '是' : '否');
    // @ts-ignore
    [tableData, vLoading, loading,];
    var __VLS_70;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_63;
let __VLS_73;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_74 = __VLS_asFunctionalComponent1(__VLS_73, new __VLS_73({
    label: "操作",
    width: "220",
    fixed: "right",
}));
const __VLS_75 = __VLS_74({
    label: "操作",
    width: "220",
    fixed: "right",
}, ...__VLS_functionalComponentArgsRest(__VLS_74));
const { default: __VLS_78 } = __VLS_76.slots;
{
    const { default: __VLS_79 } = __VLS_76.slots;
    const [{ row }] = __VLS_vSlot(__VLS_79);
    let __VLS_80;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_81 = __VLS_asFunctionalComponent1(__VLS_80, new __VLS_80({
        ...{ 'onClick': {} },
        link: true,
        type: "warning",
        disabled: (row.isDefault),
    }));
    const __VLS_82 = __VLS_81({
        ...{ 'onClick': {} },
        link: true,
        type: "warning",
        disabled: (row.isDefault),
    }, ...__VLS_functionalComponentArgsRest(__VLS_81));
    let __VLS_85;
    const __VLS_86 = {
        ...{ click: {} },
        onClick: (...[$event]) => {
            __VLS_ctx.handleSetDefault(row);
            // @ts-ignore
            [handleSetDefault,];
        },
    };
    __VLS_asFunctionalDirective(__VLS_directives.vPermission, {})(null, { ...__VLS_directiveBindingRestFields, value: ('i18n:countryLanguage:edit') }, null, null);
    const { default: __VLS_87 } = __VLS_83.slots;
    // @ts-ignore
    [vPermission,];
    var __VLS_83;
    var __VLS_84;
    let __VLS_88;
    /** @ts-ignore @type { | typeof __VLS_components.elPopconfirm | typeof __VLS_components.ElPopconfirm | typeof __VLS_components['el-popconfirm'] | typeof __VLS_components.elPopconfirm | typeof __VLS_components.ElPopconfirm | typeof __VLS_components['el-popconfirm']} */
    elPopconfirm;
    // @ts-ignore
    const __VLS_89 = __VLS_asFunctionalComponent1(__VLS_88, new __VLS_88({
        ...{ 'onConfirm': {} },
        title: "确定要删除该语言绑定吗？",
        confirmButtonText: "确认",
        cancelButtonText: "取消",
    }));
    const __VLS_90 = __VLS_89({
        ...{ 'onConfirm': {} },
        title: "确定要删除该语言绑定吗？",
        confirmButtonText: "确认",
        cancelButtonText: "取消",
    }, ...__VLS_functionalComponentArgsRest(__VLS_89));
    let __VLS_93;
    const __VLS_94 = {
        ...{ confirm: {} },
        onConfirm: (...[$event]) => {
            __VLS_ctx.handleDelete(row);
            // @ts-ignore
            [handleDelete,];
        },
    };
    const { default: __VLS_95 } = __VLS_91.slots;
    {
        const { reference: __VLS_96 } = __VLS_91.slots;
        let __VLS_97;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_98 = __VLS_asFunctionalComponent1(__VLS_97, new __VLS_97({
            link: true,
            type: "danger",
        }));
        const __VLS_99 = __VLS_98({
            link: true,
            type: "danger",
        }, ...__VLS_functionalComponentArgsRest(__VLS_98));
        __VLS_asFunctionalDirective(__VLS_directives.vPermission, {})(null, { ...__VLS_directiveBindingRestFields, value: ('i18n:countryLanguage:delete') }, null, null);
        const { default: __VLS_102 } = __VLS_100.slots;
        // @ts-ignore
        [vPermission,];
        var __VLS_100;
        // @ts-ignore
        [];
    }
    // @ts-ignore
    [];
    var __VLS_91;
    var __VLS_92;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_76;
{
    const { empty: __VLS_103 } = __VLS_42.slots;
    let __VLS_104;
    /** @ts-ignore @type { | typeof __VLS_components.elEmpty | typeof __VLS_components.ElEmpty | typeof __VLS_components['el-empty']} */
    elEmpty;
    // @ts-ignore
    const __VLS_105 = __VLS_asFunctionalComponent1(__VLS_104, new __VLS_104({
        description: "暂无数据",
    }));
    const __VLS_106 = __VLS_105({
        description: "暂无数据",
    }, ...__VLS_functionalComponentArgsRest(__VLS_105));
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_42;
let __VLS_109;
/** @ts-ignore @type { | typeof __VLS_components.elDialog | typeof __VLS_components.ElDialog | typeof __VLS_components['el-dialog'] | typeof __VLS_components.elDialog | typeof __VLS_components.ElDialog | typeof __VLS_components['el-dialog']} */
elDialog;
// @ts-ignore
const __VLS_110 = __VLS_asFunctionalComponent1(__VLS_109, new __VLS_109({
    ...{ 'onClose': {} },
    modelValue: (__VLS_ctx.dialogVisible),
    title: "绑定语言",
    width: "500px",
}));
const __VLS_111 = __VLS_110({
    ...{ 'onClose': {} },
    modelValue: (__VLS_ctx.dialogVisible),
    title: "绑定语言",
    width: "500px",
}, ...__VLS_functionalComponentArgsRest(__VLS_110));
let __VLS_114;
const __VLS_115 = {
    ...{ close: {} },
    onClose: (__VLS_ctx.resetForm),
};
const { default: __VLS_116 } = __VLS_112.slots;
let __VLS_117;
/** @ts-ignore @type { | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form'] | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form']} */
elForm;
// @ts-ignore
const __VLS_118 = __VLS_asFunctionalComponent1(__VLS_117, new __VLS_117({
    ref: "formRef",
    model: (__VLS_ctx.form),
    rules: (__VLS_ctx.rules),
    labelWidth: "100px",
}));
const __VLS_119 = __VLS_118({
    ref: "formRef",
    model: (__VLS_ctx.form),
    rules: (__VLS_ctx.rules),
    labelWidth: "100px",
}, ...__VLS_functionalComponentArgsRest(__VLS_118));
var __VLS_122;
const { default: __VLS_124 } = __VLS_120.slots;
let __VLS_125;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_126 = __VLS_asFunctionalComponent1(__VLS_125, new __VLS_125({
    label: "国家",
    prop: "countryId",
}));
const __VLS_127 = __VLS_126({
    label: "国家",
    prop: "countryId",
}, ...__VLS_functionalComponentArgsRest(__VLS_126));
const { default: __VLS_130 } = __VLS_128.slots;
let __VLS_131;
/** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
elSelect;
// @ts-ignore
const __VLS_132 = __VLS_asFunctionalComponent1(__VLS_131, new __VLS_131({
    modelValue: (__VLS_ctx.form.countryId),
    placeholder: "请选择国家",
    filterable: true,
    ...{ style: {} },
}));
const __VLS_133 = __VLS_132({
    modelValue: (__VLS_ctx.form.countryId),
    placeholder: "请选择国家",
    filterable: true,
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_132));
const { default: __VLS_136 } = __VLS_134.slots;
for (const [c] of __VLS_vFor((__VLS_ctx.countryOptions))) {
    let __VLS_137;
    /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
    elOption;
    // @ts-ignore
    const __VLS_138 = __VLS_asFunctionalComponent1(__VLS_137, new __VLS_137({
        key: (c.id),
        label: (`${c.name} (${c.code})`),
        value: (c.id),
    }));
    const __VLS_139 = __VLS_138({
        key: (c.id),
        label: (`${c.name} (${c.code})`),
        value: (c.id),
    }, ...__VLS_functionalComponentArgsRest(__VLS_138));
    // @ts-ignore
    [countryOptions, dialogVisible, resetForm, form, form, rules,];
}
// @ts-ignore
[];
var __VLS_134;
// @ts-ignore
[];
var __VLS_128;
let __VLS_142;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_143 = __VLS_asFunctionalComponent1(__VLS_142, new __VLS_142({
    label: "语言",
    prop: "languageId",
}));
const __VLS_144 = __VLS_143({
    label: "语言",
    prop: "languageId",
}, ...__VLS_functionalComponentArgsRest(__VLS_143));
const { default: __VLS_147 } = __VLS_145.slots;
let __VLS_148;
/** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
elSelect;
// @ts-ignore
const __VLS_149 = __VLS_asFunctionalComponent1(__VLS_148, new __VLS_148({
    modelValue: (__VLS_ctx.form.languageId),
    placeholder: "请选择语言",
    filterable: true,
    ...{ style: {} },
}));
const __VLS_150 = __VLS_149({
    modelValue: (__VLS_ctx.form.languageId),
    placeholder: "请选择语言",
    filterable: true,
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_149));
const { default: __VLS_153 } = __VLS_151.slots;
for (const [l] of __VLS_vFor((__VLS_ctx.languageOptions))) {
    let __VLS_154;
    /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
    elOption;
    // @ts-ignore
    const __VLS_155 = __VLS_asFunctionalComponent1(__VLS_154, new __VLS_154({
        key: (l.id),
        label: (`${l.name} (${l.code})`),
        value: (l.id),
    }));
    const __VLS_156 = __VLS_155({
        key: (l.id),
        label: (`${l.name} (${l.code})`),
        value: (l.id),
    }, ...__VLS_functionalComponentArgsRest(__VLS_155));
    // @ts-ignore
    [form, languageOptions,];
}
// @ts-ignore
[];
var __VLS_151;
// @ts-ignore
[];
var __VLS_145;
let __VLS_159;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_160 = __VLS_asFunctionalComponent1(__VLS_159, new __VLS_159({
    label: "默认语言",
}));
const __VLS_161 = __VLS_160({
    label: "默认语言",
}, ...__VLS_functionalComponentArgsRest(__VLS_160));
const { default: __VLS_164 } = __VLS_162.slots;
let __VLS_165;
/** @ts-ignore @type { | typeof __VLS_components.elCheckbox | typeof __VLS_components.ElCheckbox | typeof __VLS_components['el-checkbox'] | typeof __VLS_components.elCheckbox | typeof __VLS_components.ElCheckbox | typeof __VLS_components['el-checkbox']} */
elCheckbox;
// @ts-ignore
const __VLS_166 = __VLS_asFunctionalComponent1(__VLS_165, new __VLS_165({
    modelValue: (__VLS_ctx.form.isDefault),
}));
const __VLS_167 = __VLS_166({
    modelValue: (__VLS_ctx.form.isDefault),
}, ...__VLS_functionalComponentArgsRest(__VLS_166));
const { default: __VLS_170 } = __VLS_168.slots;
// @ts-ignore
[form,];
var __VLS_168;
// @ts-ignore
[];
var __VLS_162;
// @ts-ignore
[];
var __VLS_120;
{
    const { footer: __VLS_171 } = __VLS_112.slots;
    let __VLS_172;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_173 = __VLS_asFunctionalComponent1(__VLS_172, new __VLS_172({
        ...{ 'onClick': {} },
    }));
    const __VLS_174 = __VLS_173({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_173));
    let __VLS_177;
    const __VLS_178 = {
        ...{ click: {} },
        onClick: (...[$event]) => {
            __VLS_ctx.dialogVisible = false;
            // @ts-ignore
            [dialogVisible,];
        },
    };
    const { default: __VLS_179 } = __VLS_175.slots;
    // @ts-ignore
    [];
    var __VLS_175;
    var __VLS_176;
    let __VLS_180;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_181 = __VLS_asFunctionalComponent1(__VLS_180, new __VLS_180({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.submitLoading),
    }));
    const __VLS_182 = __VLS_181({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.submitLoading),
    }, ...__VLS_functionalComponentArgsRest(__VLS_181));
    let __VLS_185;
    const __VLS_186 = {
        ...{ click: {} },
        onClick: (__VLS_ctx.handleSubmit),
    };
    const { default: __VLS_187 } = __VLS_183.slots;
    // @ts-ignore
    [submitLoading, handleSubmit,];
    var __VLS_183;
    var __VLS_184;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_112;
var __VLS_113;
// @ts-ignore
var __VLS_123 = __VLS_122;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
