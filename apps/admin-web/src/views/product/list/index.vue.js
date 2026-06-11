/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ref, reactive, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { productApi } from '@/api/product';
import { categoryApi } from '@/api/category';
defineOptions({ name: 'ProductListView' });
const loading = ref(false);
const tableData = ref([]);
const total = ref(0);
const detailVisible = ref(false);
const detailItem = ref(null);
const categoryOptions = ref([]);
const searchForm = reactive({
    keyword: '',
    merchantId: '',
    categoryId: null,
    status: '',
    auditStatus: '',
    page: 1,
    pageSize: 20,
});
async function loadCategories() {
    try {
        const { data: res } = await categoryApi.getCategories({ page: 1, pageSize: 999 });
        if (res.code === 200)
            categoryOptions.value = res.data.list || [];
    }
    catch { /* ignore */ }
}
async function fetchData() {
    loading.value = true;
    try {
        const { data: res } = await productApi.getProducts({
            keyword: searchForm.keyword || undefined,
            merchantId: searchForm.merchantId || undefined,
            categoryId: searchForm.categoryId || undefined,
            status: searchForm.status || undefined,
            auditStatus: searchForm.auditStatus || undefined,
            page: searchForm.page,
            pageSize: searchForm.pageSize,
        });
        if (res.code === 200) {
            tableData.value = res.data.list;
            total.value = res.data.total;
        }
        else {
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
function handleSearch() {
    searchForm.page = 1;
    fetchData();
}
async function handleViewDetail(row) {
    try {
        const { data: res } = await productApi.getProductDetail(row.id);
        if (res.code === 200) {
            detailItem.value = res.data;
            detailVisible.value = true;
        }
        else {
            ElMessage.error(res.message || '加载详情失败');
        }
    }
    catch {
        ElMessage.error('加载详情失败');
    }
}
async function handleToggleStatus(row) {
    const newStatus = row.status === 'ON_SALE' ? 'OFF_SALE' : 'ON_SALE';
    try {
        const { data: res } = await productApi.updateProductStatus(row.id, newStatus);
        if (res.code === 200) {
            ElMessage.success('状态已更新');
            fetchData();
        }
        else {
            ElMessage.error(res.message || '状态更新失败');
        }
    }
    catch {
        ElMessage.error('状态更新失败');
    }
}
onMounted(async () => {
    await loadCategories();
    fetchData();
});
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "product-page" },
});
/** @type {__VLS_StyleScopedClasses['product-page']} */ ;
let __VLS_0;
/** @ts-ignore @type { | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form'] | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form']} */
elForm;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    inline: (true),
    model: (__VLS_ctx.searchForm),
    ...{ class: "search-bar" },
}));
const __VLS_2 = __VLS_1({
    inline: (true),
    model: (__VLS_ctx.searchForm),
    ...{ class: "search-bar" },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
/** @type {__VLS_StyleScopedClasses['search-bar']} */ ;
const { default: __VLS_5 } = __VLS_3.slots;
let __VLS_6;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_7 = __VLS_asFunctionalComponent1(__VLS_6, new __VLS_6({}));
const __VLS_8 = __VLS_7({}, ...__VLS_functionalComponentArgsRest(__VLS_7));
const { default: __VLS_11 } = __VLS_9.slots;
let __VLS_12;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_13 = __VLS_asFunctionalComponent1(__VLS_12, new __VLS_12({
    ...{ 'onClear': {} },
    ...{ 'onKeyup': {} },
    modelValue: (__VLS_ctx.searchForm.keyword),
    placeholder: "关键词",
    clearable: true,
}));
const __VLS_14 = __VLS_13({
    ...{ 'onClear': {} },
    ...{ 'onKeyup': {} },
    modelValue: (__VLS_ctx.searchForm.keyword),
    placeholder: "关键词",
    clearable: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_13));
let __VLS_17;
const __VLS_18 = {
    ...{ clear: {} },
    onClear: (__VLS_ctx.handleSearch),
    ...{ keyup: {} },
    onKeyup: (__VLS_ctx.handleSearch),
};
var __VLS_15;
var __VLS_16;
// @ts-ignore
[searchForm, searchForm, handleSearch, handleSearch,];
var __VLS_9;
let __VLS_19;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_20 = __VLS_asFunctionalComponent1(__VLS_19, new __VLS_19({}));
const __VLS_21 = __VLS_20({}, ...__VLS_functionalComponentArgsRest(__VLS_20));
const { default: __VLS_24 } = __VLS_22.slots;
let __VLS_25;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_26 = __VLS_asFunctionalComponent1(__VLS_25, new __VLS_25({
    ...{ 'onClear': {} },
    ...{ 'onKeyup': {} },
    modelValue: (__VLS_ctx.searchForm.merchantId),
    placeholder: "商户ID",
    clearable: true,
}));
const __VLS_27 = __VLS_26({
    ...{ 'onClear': {} },
    ...{ 'onKeyup': {} },
    modelValue: (__VLS_ctx.searchForm.merchantId),
    placeholder: "商户ID",
    clearable: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_26));
let __VLS_30;
const __VLS_31 = {
    ...{ clear: {} },
    onClear: (__VLS_ctx.handleSearch),
    ...{ keyup: {} },
    onKeyup: (__VLS_ctx.handleSearch),
};
var __VLS_28;
var __VLS_29;
// @ts-ignore
[searchForm, handleSearch, handleSearch,];
var __VLS_22;
let __VLS_32;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_33 = __VLS_asFunctionalComponent1(__VLS_32, new __VLS_32({}));
const __VLS_34 = __VLS_33({}, ...__VLS_functionalComponentArgsRest(__VLS_33));
const { default: __VLS_37 } = __VLS_35.slots;
let __VLS_38;
/** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
elSelect;
// @ts-ignore
const __VLS_39 = __VLS_asFunctionalComponent1(__VLS_38, new __VLS_38({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.searchForm.categoryId),
    placeholder: "分类",
    clearable: true,
}));
const __VLS_40 = __VLS_39({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.searchForm.categoryId),
    placeholder: "分类",
    clearable: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_39));
let __VLS_43;
const __VLS_44 = {
    ...{ change: {} },
    onChange: (__VLS_ctx.handleSearch),
};
const { default: __VLS_45 } = __VLS_41.slots;
for (const [c] of __VLS_vFor((__VLS_ctx.categoryOptions))) {
    let __VLS_46;
    /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
    elOption;
    // @ts-ignore
    const __VLS_47 = __VLS_asFunctionalComponent1(__VLS_46, new __VLS_46({
        key: (c.id),
        label: (c.name),
        value: (c.id),
    }));
    const __VLS_48 = __VLS_47({
        key: (c.id),
        label: (c.name),
        value: (c.id),
    }, ...__VLS_functionalComponentArgsRest(__VLS_47));
    // @ts-ignore
    [searchForm, handleSearch, categoryOptions,];
}
// @ts-ignore
[];
var __VLS_41;
var __VLS_42;
// @ts-ignore
[];
var __VLS_35;
let __VLS_51;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_52 = __VLS_asFunctionalComponent1(__VLS_51, new __VLS_51({}));
const __VLS_53 = __VLS_52({}, ...__VLS_functionalComponentArgsRest(__VLS_52));
const { default: __VLS_56 } = __VLS_54.slots;
let __VLS_57;
/** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
elSelect;
// @ts-ignore
const __VLS_58 = __VLS_asFunctionalComponent1(__VLS_57, new __VLS_57({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.searchForm.status),
    placeholder: "状态",
    clearable: true,
}));
const __VLS_59 = __VLS_58({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.searchForm.status),
    placeholder: "状态",
    clearable: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_58));
let __VLS_62;
const __VLS_63 = {
    ...{ change: {} },
    onChange: (__VLS_ctx.handleSearch),
};
const { default: __VLS_64 } = __VLS_60.slots;
let __VLS_65;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_66 = __VLS_asFunctionalComponent1(__VLS_65, new __VLS_65({
    label: "在售",
    value: "ON_SALE",
}));
const __VLS_67 = __VLS_66({
    label: "在售",
    value: "ON_SALE",
}, ...__VLS_functionalComponentArgsRest(__VLS_66));
let __VLS_70;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_71 = __VLS_asFunctionalComponent1(__VLS_70, new __VLS_70({
    label: "已下架",
    value: "OFF_SALE",
}));
const __VLS_72 = __VLS_71({
    label: "已下架",
    value: "OFF_SALE",
}, ...__VLS_functionalComponentArgsRest(__VLS_71));
let __VLS_75;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_76 = __VLS_asFunctionalComponent1(__VLS_75, new __VLS_75({
    label: "草稿",
    value: "DRAFT",
}));
const __VLS_77 = __VLS_76({
    label: "草稿",
    value: "DRAFT",
}, ...__VLS_functionalComponentArgsRest(__VLS_76));
// @ts-ignore
[searchForm, handleSearch,];
var __VLS_60;
var __VLS_61;
// @ts-ignore
[];
var __VLS_54;
let __VLS_80;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_81 = __VLS_asFunctionalComponent1(__VLS_80, new __VLS_80({}));
const __VLS_82 = __VLS_81({}, ...__VLS_functionalComponentArgsRest(__VLS_81));
const { default: __VLS_85 } = __VLS_83.slots;
let __VLS_86;
/** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
elSelect;
// @ts-ignore
const __VLS_87 = __VLS_asFunctionalComponent1(__VLS_86, new __VLS_86({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.searchForm.auditStatus),
    placeholder: "审核状态",
    clearable: true,
}));
const __VLS_88 = __VLS_87({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.searchForm.auditStatus),
    placeholder: "审核状态",
    clearable: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_87));
let __VLS_91;
const __VLS_92 = {
    ...{ change: {} },
    onChange: (__VLS_ctx.handleSearch),
};
const { default: __VLS_93 } = __VLS_89.slots;
let __VLS_94;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_95 = __VLS_asFunctionalComponent1(__VLS_94, new __VLS_94({
    label: "草稿",
    value: "DRAFT",
}));
const __VLS_96 = __VLS_95({
    label: "草稿",
    value: "DRAFT",
}, ...__VLS_functionalComponentArgsRest(__VLS_95));
let __VLS_99;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_100 = __VLS_asFunctionalComponent1(__VLS_99, new __VLS_99({
    label: "待处理",
    value: "PENDING",
}));
const __VLS_101 = __VLS_100({
    label: "待处理",
    value: "PENDING",
}, ...__VLS_functionalComponentArgsRest(__VLS_100));
let __VLS_104;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_105 = __VLS_asFunctionalComponent1(__VLS_104, new __VLS_104({
    label: "已通过",
    value: "APPROVED",
}));
const __VLS_106 = __VLS_105({
    label: "已通过",
    value: "APPROVED",
}, ...__VLS_functionalComponentArgsRest(__VLS_105));
let __VLS_109;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_110 = __VLS_asFunctionalComponent1(__VLS_109, new __VLS_109({
    label: "已拒绝",
    value: "REJECTED",
}));
const __VLS_111 = __VLS_110({
    label: "已拒绝",
    value: "REJECTED",
}, ...__VLS_functionalComponentArgsRest(__VLS_110));
// @ts-ignore
[searchForm, handleSearch,];
var __VLS_89;
var __VLS_90;
// @ts-ignore
[];
var __VLS_83;
let __VLS_114;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_115 = __VLS_asFunctionalComponent1(__VLS_114, new __VLS_114({}));
const __VLS_116 = __VLS_115({}, ...__VLS_functionalComponentArgsRest(__VLS_115));
const { default: __VLS_119 } = __VLS_117.slots;
let __VLS_120;
/** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
elButton;
// @ts-ignore
const __VLS_121 = __VLS_asFunctionalComponent1(__VLS_120, new __VLS_120({
    ...{ 'onClick': {} },
    type: "primary",
}));
const __VLS_122 = __VLS_121({
    ...{ 'onClick': {} },
    type: "primary",
}, ...__VLS_functionalComponentArgsRest(__VLS_121));
let __VLS_125;
const __VLS_126 = {
    ...{ click: {} },
    onClick: (__VLS_ctx.handleSearch),
};
const { default: __VLS_127 } = __VLS_123.slots;
// @ts-ignore
[handleSearch,];
var __VLS_123;
var __VLS_124;
// @ts-ignore
[];
var __VLS_117;
// @ts-ignore
[];
var __VLS_3;
let __VLS_128;
/** @ts-ignore @type { | typeof __VLS_components.elTable | typeof __VLS_components.ElTable | typeof __VLS_components['el-table'] | typeof __VLS_components.elTable | typeof __VLS_components.ElTable | typeof __VLS_components['el-table']} */
elTable;
// @ts-ignore
const __VLS_129 = __VLS_asFunctionalComponent1(__VLS_128, new __VLS_128({
    data: (__VLS_ctx.tableData),
    border: true,
    stripe: true,
}));
const __VLS_130 = __VLS_129({
    data: (__VLS_ctx.tableData),
    border: true,
    stripe: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_129));
__VLS_asFunctionalDirective(__VLS_directives.vLoading, {})(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.loading) }, null, null);
const { default: __VLS_133 } = __VLS_131.slots;
let __VLS_134;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_135 = __VLS_asFunctionalComponent1(__VLS_134, new __VLS_134({
    label: "封面",
    width: "90",
    align: "center",
}));
const __VLS_136 = __VLS_135({
    label: "封面",
    width: "90",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_135));
const { default: __VLS_139 } = __VLS_137.slots;
{
    const { default: __VLS_140 } = __VLS_137.slots;
    const [{ row }] = __VLS_vSlot(__VLS_140);
    if (row.coverImage) {
        let __VLS_141;
        /** @ts-ignore @type { | typeof __VLS_components.elImage | typeof __VLS_components.ElImage | typeof __VLS_components['el-image']} */
        elImage;
        // @ts-ignore
        const __VLS_142 = __VLS_asFunctionalComponent1(__VLS_141, new __VLS_141({
            src: (row.coverImage),
            ...{ style: {} },
            fit: "cover",
        }));
        const __VLS_143 = __VLS_142({
            src: (row.coverImage),
            ...{ style: {} },
            fit: "cover",
        }, ...__VLS_functionalComponentArgsRest(__VLS_142));
    }
    else {
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    }
    // @ts-ignore
    [tableData, vLoading, loading,];
}
// @ts-ignore
[];
var __VLS_137;
let __VLS_146;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_147 = __VLS_asFunctionalComponent1(__VLS_146, new __VLS_146({
    prop: "title",
    label: "标题",
    minWidth: "180",
    showOverflowTooltip: true,
}));
const __VLS_148 = __VLS_147({
    prop: "title",
    label: "标题",
    minWidth: "180",
    showOverflowTooltip: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_147));
let __VLS_151;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_152 = __VLS_asFunctionalComponent1(__VLS_151, new __VLS_151({
    prop: "merchantName",
    label: "商户",
    width: "130",
    showOverflowTooltip: true,
}));
const __VLS_153 = __VLS_152({
    prop: "merchantName",
    label: "商户",
    width: "130",
    showOverflowTooltip: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_152));
let __VLS_156;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_157 = __VLS_asFunctionalComponent1(__VLS_156, new __VLS_156({
    prop: "categoryName",
    label: "分类",
    width: "120",
    showOverflowTooltip: true,
}));
const __VLS_158 = __VLS_157({
    prop: "categoryName",
    label: "分类",
    width: "120",
    showOverflowTooltip: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_157));
let __VLS_161;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_162 = __VLS_asFunctionalComponent1(__VLS_161, new __VLS_161({
    prop: "price",
    label: "价格",
    width: "100",
    align: "right",
}));
const __VLS_163 = __VLS_162({
    prop: "price",
    label: "价格",
    width: "100",
    align: "right",
}, ...__VLS_functionalComponentArgsRest(__VLS_162));
let __VLS_166;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_167 = __VLS_asFunctionalComponent1(__VLS_166, new __VLS_166({
    prop: "stock",
    label: "库存",
    width: "80",
    align: "center",
}));
const __VLS_168 = __VLS_167({
    prop: "stock",
    label: "库存",
    width: "80",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_167));
let __VLS_171;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_172 = __VLS_asFunctionalComponent1(__VLS_171, new __VLS_171({
    prop: "salesCount",
    label: "销售额",
    width: "80",
    align: "center",
}));
const __VLS_173 = __VLS_172({
    prop: "salesCount",
    label: "销售额",
    width: "80",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_172));
let __VLS_176;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_177 = __VLS_asFunctionalComponent1(__VLS_176, new __VLS_176({
    prop: "status",
    label: "状态",
    width: "100",
    align: "center",
}));
const __VLS_178 = __VLS_177({
    prop: "status",
    label: "状态",
    width: "100",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_177));
const { default: __VLS_181 } = __VLS_179.slots;
{
    const { default: __VLS_182 } = __VLS_179.slots;
    const [{ row }] = __VLS_vSlot(__VLS_182);
    let __VLS_183;
    /** @ts-ignore @type { | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag'] | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag']} */
    elTag;
    // @ts-ignore
    const __VLS_184 = __VLS_asFunctionalComponent1(__VLS_183, new __VLS_183({
        type: (row.status === 'ON_SALE' ? 'success' : row.status === 'OFF_SALE' ? 'warning' : 'info'),
    }));
    const __VLS_185 = __VLS_184({
        type: (row.status === 'ON_SALE' ? 'success' : row.status === 'OFF_SALE' ? 'warning' : 'info'),
    }, ...__VLS_functionalComponentArgsRest(__VLS_184));
    const { default: __VLS_188 } = __VLS_186.slots;
    (row.status === 'ON_SALE' ? 'On Sale' : row.status === 'OFF_SALE' ? 'Off Sale' : row.status);
    // @ts-ignore
    [];
    var __VLS_186;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_179;
let __VLS_189;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_190 = __VLS_asFunctionalComponent1(__VLS_189, new __VLS_189({
    prop: "auditStatus",
    label: "审核",
    width: "100",
    align: "center",
}));
const __VLS_191 = __VLS_190({
    prop: "auditStatus",
    label: "审核",
    width: "100",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_190));
const { default: __VLS_194 } = __VLS_192.slots;
{
    const { default: __VLS_195 } = __VLS_192.slots;
    const [{ row }] = __VLS_vSlot(__VLS_195);
    let __VLS_196;
    /** @ts-ignore @type { | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag'] | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag']} */
    elTag;
    // @ts-ignore
    const __VLS_197 = __VLS_asFunctionalComponent1(__VLS_196, new __VLS_196({
        type: (row.auditStatus === 'APPROVED' ? 'success' : row.auditStatus === 'REJECTED' ? 'danger' : row.auditStatus === 'PENDING' ? 'warning' : 'info'),
    }));
    const __VLS_198 = __VLS_197({
        type: (row.auditStatus === 'APPROVED' ? 'success' : row.auditStatus === 'REJECTED' ? 'danger' : row.auditStatus === 'PENDING' ? 'warning' : 'info'),
    }, ...__VLS_functionalComponentArgsRest(__VLS_197));
    const { default: __VLS_201 } = __VLS_199.slots;
    (row.auditStatus);
    // @ts-ignore
    [];
    var __VLS_199;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_192;
let __VLS_202;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_203 = __VLS_asFunctionalComponent1(__VLS_202, new __VLS_202({
    prop: "createdAt",
    label: "创建时间",
    width: "180",
}));
const __VLS_204 = __VLS_203({
    prop: "createdAt",
    label: "创建时间",
    width: "180",
}, ...__VLS_functionalComponentArgsRest(__VLS_203));
let __VLS_207;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_208 = __VLS_asFunctionalComponent1(__VLS_207, new __VLS_207({
    label: "操作",
    width: "180",
    fixed: "right",
}));
const __VLS_209 = __VLS_208({
    label: "操作",
    width: "180",
    fixed: "right",
}, ...__VLS_functionalComponentArgsRest(__VLS_208));
const { default: __VLS_212 } = __VLS_210.slots;
{
    const { default: __VLS_213 } = __VLS_210.slots;
    const [{ row }] = __VLS_vSlot(__VLS_213);
    let __VLS_214;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_215 = __VLS_asFunctionalComponent1(__VLS_214, new __VLS_214({
        ...{ 'onClick': {} },
        link: true,
        type: "primary",
    }));
    const __VLS_216 = __VLS_215({
        ...{ 'onClick': {} },
        link: true,
        type: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_215));
    let __VLS_219;
    const __VLS_220 = {
        ...{ click: {} },
        onClick: (...[$event]) => {
            __VLS_ctx.handleViewDetail(row);
            // @ts-ignore
            [handleViewDetail,];
        },
    };
    __VLS_asFunctionalDirective(__VLS_directives.vPermission, {})(null, { ...__VLS_directiveBindingRestFields, value: ('product:view') }, null, null);
    const { default: __VLS_221 } = __VLS_217.slots;
    // @ts-ignore
    [vPermission,];
    var __VLS_217;
    var __VLS_218;
    let __VLS_222;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_223 = __VLS_asFunctionalComponent1(__VLS_222, new __VLS_222({
        ...{ 'onClick': {} },
        link: true,
        type: (row.status === 'ON_SALE' ? 'warning' : 'success'),
    }));
    const __VLS_224 = __VLS_223({
        ...{ 'onClick': {} },
        link: true,
        type: (row.status === 'ON_SALE' ? 'warning' : 'success'),
    }, ...__VLS_functionalComponentArgsRest(__VLS_223));
    let __VLS_227;
    const __VLS_228 = {
        ...{ click: {} },
        onClick: (...[$event]) => {
            __VLS_ctx.handleToggleStatus(row);
            // @ts-ignore
            [handleToggleStatus,];
        },
    };
    __VLS_asFunctionalDirective(__VLS_directives.vPermission, {})(null, { ...__VLS_directiveBindingRestFields, value: ('product:edit') }, null, null);
    const { default: __VLS_229 } = __VLS_225.slots;
    (row.status === 'ON_SALE' ? 'Off Sale' : 'On Sale');
    // @ts-ignore
    [vPermission,];
    var __VLS_225;
    var __VLS_226;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_210;
// @ts-ignore
[];
var __VLS_131;
let __VLS_230;
/** @ts-ignore @type { | typeof __VLS_components.elPagination | typeof __VLS_components.ElPagination | typeof __VLS_components['el-pagination']} */
elPagination;
// @ts-ignore
const __VLS_231 = __VLS_asFunctionalComponent1(__VLS_230, new __VLS_230({
    ...{ 'onChange': {} },
    currentPage: (__VLS_ctx.searchForm.page),
    pageSize: (__VLS_ctx.searchForm.pageSize),
    total: (__VLS_ctx.total),
    pageSizes: ([10, 20, 50, 100]),
    layout: "total, sizes, prev, pager, next",
}));
const __VLS_232 = __VLS_231({
    ...{ 'onChange': {} },
    currentPage: (__VLS_ctx.searchForm.page),
    pageSize: (__VLS_ctx.searchForm.pageSize),
    total: (__VLS_ctx.total),
    pageSizes: ([10, 20, 50, 100]),
    layout: "total, sizes, prev, pager, next",
}, ...__VLS_functionalComponentArgsRest(__VLS_231));
let __VLS_235;
const __VLS_236 = {
    ...{ change: {} },
    onChange: (__VLS_ctx.fetchData),
};
var __VLS_233;
var __VLS_234;
let __VLS_237;
/** @ts-ignore @type { | typeof __VLS_components.elDialog | typeof __VLS_components.ElDialog | typeof __VLS_components['el-dialog'] | typeof __VLS_components.elDialog | typeof __VLS_components.ElDialog | typeof __VLS_components['el-dialog']} */
elDialog;
// @ts-ignore
const __VLS_238 = __VLS_asFunctionalComponent1(__VLS_237, new __VLS_237({
    modelValue: (__VLS_ctx.detailVisible),
    title: "商品详情",
    width: "750px",
}));
const __VLS_239 = __VLS_238({
    modelValue: (__VLS_ctx.detailVisible),
    title: "商品详情",
    width: "750px",
}, ...__VLS_functionalComponentArgsRest(__VLS_238));
const { default: __VLS_242 } = __VLS_240.slots;
if (__VLS_ctx.detailItem) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "product-detail" },
    });
    /** @type {__VLS_StyleScopedClasses['product-detail']} */ ;
    let __VLS_243;
    /** @ts-ignore @type { | typeof __VLS_components.elRow | typeof __VLS_components.ElRow | typeof __VLS_components['el-row'] | typeof __VLS_components.elRow | typeof __VLS_components.ElRow | typeof __VLS_components['el-row']} */
    elRow;
    // @ts-ignore
    const __VLS_244 = __VLS_asFunctionalComponent1(__VLS_243, new __VLS_243({
        gutter: (16),
    }));
    const __VLS_245 = __VLS_244({
        gutter: (16),
    }, ...__VLS_functionalComponentArgsRest(__VLS_244));
    const { default: __VLS_248 } = __VLS_246.slots;
    let __VLS_249;
    /** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
    elCol;
    // @ts-ignore
    const __VLS_250 = __VLS_asFunctionalComponent1(__VLS_249, new __VLS_249({
        span: (12),
    }));
    const __VLS_251 = __VLS_250({
        span: (12),
    }, ...__VLS_functionalComponentArgsRest(__VLS_250));
    const { default: __VLS_254 } = __VLS_252.slots;
    if (__VLS_ctx.detailItem.coverImage) {
        let __VLS_255;
        /** @ts-ignore @type { | typeof __VLS_components.elImage | typeof __VLS_components.ElImage | typeof __VLS_components['el-image']} */
        elImage;
        // @ts-ignore
        const __VLS_256 = __VLS_asFunctionalComponent1(__VLS_255, new __VLS_255({
            src: (__VLS_ctx.detailItem.coverImage),
            ...{ style: {} },
            fit: "cover",
        }));
        const __VLS_257 = __VLS_256({
            src: (__VLS_ctx.detailItem.coverImage),
            ...{ style: {} },
            fit: "cover",
        }, ...__VLS_functionalComponentArgsRest(__VLS_256));
    }
    // @ts-ignore
    [searchForm, searchForm, total, fetchData, detailVisible, detailItem, detailItem, detailItem,];
    var __VLS_252;
    let __VLS_260;
    /** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
    elCol;
    // @ts-ignore
    const __VLS_261 = __VLS_asFunctionalComponent1(__VLS_260, new __VLS_260({
        span: (12),
    }));
    const __VLS_262 = __VLS_261({
        span: (12),
    }, ...__VLS_functionalComponentArgsRest(__VLS_261));
    const { default: __VLS_265 } = __VLS_263.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({});
    (__VLS_ctx.detailItem.title);
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({});
    (__VLS_ctx.detailItem.description);
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({});
    (__VLS_ctx.detailItem.price);
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({});
    (__VLS_ctx.detailItem.originalPrice);
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({});
    (__VLS_ctx.detailItem.stock);
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({});
    (__VLS_ctx.detailItem.salesCount);
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({});
    (__VLS_ctx.detailItem.status);
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({});
    (__VLS_ctx.detailItem.auditStatus);
    if (__VLS_ctx.detailItem.merchantName) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({});
        __VLS_asFunctionalElement1(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({});
        (__VLS_ctx.detailItem.merchantName);
    }
    if (__VLS_ctx.detailItem.categoryName) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({});
        __VLS_asFunctionalElement1(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({});
        (__VLS_ctx.detailItem.categoryName);
    }
    // @ts-ignore
    [detailItem, detailItem, detailItem, detailItem, detailItem, detailItem, detailItem, detailItem, detailItem, detailItem, detailItem, detailItem,];
    var __VLS_263;
    // @ts-ignore
    [];
    var __VLS_246;
    let __VLS_266;
    /** @ts-ignore @type { | typeof __VLS_components.elDivider | typeof __VLS_components.ElDivider | typeof __VLS_components['el-divider']} */
    elDivider;
    // @ts-ignore
    const __VLS_267 = __VLS_asFunctionalComponent1(__VLS_266, new __VLS_266({}));
    const __VLS_268 = __VLS_267({}, ...__VLS_functionalComponentArgsRest(__VLS_267));
    __VLS_asFunctionalElement1(__VLS_intrinsics.h4, __VLS_intrinsics.h4)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "image-gallery" },
    });
    /** @type {__VLS_StyleScopedClasses['image-gallery']} */ ;
    for (const [img] of __VLS_vFor((__VLS_ctx.detailItem.images))) {
        let __VLS_271;
        /** @ts-ignore @type { | typeof __VLS_components.elImage | typeof __VLS_components.ElImage | typeof __VLS_components['el-image']} */
        elImage;
        // @ts-ignore
        const __VLS_272 = __VLS_asFunctionalComponent1(__VLS_271, new __VLS_271({
            key: (img.id),
            src: (img.imageUrl),
            ...{ style: {} },
            fit: "cover",
        }));
        const __VLS_273 = __VLS_272({
            key: (img.id),
            src: (img.imageUrl),
            ...{ style: {} },
            fit: "cover",
        }, ...__VLS_functionalComponentArgsRest(__VLS_272));
        // @ts-ignore
        [detailItem,];
    }
    let __VLS_276;
    /** @ts-ignore @type { | typeof __VLS_components.elDivider | typeof __VLS_components.ElDivider | typeof __VLS_components['el-divider']} */
    elDivider;
    // @ts-ignore
    const __VLS_277 = __VLS_asFunctionalComponent1(__VLS_276, new __VLS_276({}));
    const __VLS_278 = __VLS_277({}, ...__VLS_functionalComponentArgsRest(__VLS_277));
    __VLS_asFunctionalElement1(__VLS_intrinsics.h4, __VLS_intrinsics.h4)({});
    if (__VLS_ctx.detailItem.translations?.length) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
        for (const [pt] of __VLS_vFor((__VLS_ctx.detailItem.translations))) {
            let __VLS_281;
            /** @ts-ignore @type { | typeof __VLS_components.elDescriptions | typeof __VLS_components.ElDescriptions | typeof __VLS_components['el-descriptions'] | typeof __VLS_components.elDescriptions | typeof __VLS_components.ElDescriptions | typeof __VLS_components['el-descriptions']} */
            elDescriptions;
            // @ts-ignore
            const __VLS_282 = __VLS_asFunctionalComponent1(__VLS_281, new __VLS_281({
                key: (pt.id),
                title: (pt.languageCode),
                column: (1),
                border: true,
                size: "small",
                ...{ style: {} },
            }));
            const __VLS_283 = __VLS_282({
                key: (pt.id),
                title: (pt.languageCode),
                column: (1),
                border: true,
                size: "small",
                ...{ style: {} },
            }, ...__VLS_functionalComponentArgsRest(__VLS_282));
            const { default: __VLS_286 } = __VLS_284.slots;
            let __VLS_287;
            /** @ts-ignore @type { | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item'] | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item']} */
            elDescriptionsItem;
            // @ts-ignore
            const __VLS_288 = __VLS_asFunctionalComponent1(__VLS_287, new __VLS_287({
                label: "标题",
            }));
            const __VLS_289 = __VLS_288({
                label: "标题",
            }, ...__VLS_functionalComponentArgsRest(__VLS_288));
            const { default: __VLS_292 } = __VLS_290.slots;
            (pt.title);
            // @ts-ignore
            [detailItem, detailItem,];
            var __VLS_290;
            let __VLS_293;
            /** @ts-ignore @type { | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item'] | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item']} */
            elDescriptionsItem;
            // @ts-ignore
            const __VLS_294 = __VLS_asFunctionalComponent1(__VLS_293, new __VLS_293({
                label: "描述",
            }));
            const __VLS_295 = __VLS_294({
                label: "描述",
            }, ...__VLS_functionalComponentArgsRest(__VLS_294));
            const { default: __VLS_298 } = __VLS_296.slots;
            (pt.description);
            // @ts-ignore
            [];
            var __VLS_296;
            // @ts-ignore
            [];
            var __VLS_284;
            // @ts-ignore
            [];
        }
    }
    else {
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    }
}
{
    const { footer: __VLS_299 } = __VLS_240.slots;
    let __VLS_300;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_301 = __VLS_asFunctionalComponent1(__VLS_300, new __VLS_300({
        ...{ 'onClick': {} },
    }));
    const __VLS_302 = __VLS_301({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_301));
    let __VLS_305;
    const __VLS_306 = {
        ...{ click: {} },
        onClick: (...[$event]) => {
            __VLS_ctx.detailVisible = false;
            // @ts-ignore
            [detailVisible,];
        },
    };
    const { default: __VLS_307 } = __VLS_303.slots;
    // @ts-ignore
    [];
    var __VLS_303;
    var __VLS_304;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_240;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
