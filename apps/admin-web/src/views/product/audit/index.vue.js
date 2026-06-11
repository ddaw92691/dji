/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ref, reactive, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { productApi } from '@/api/product';
defineOptions({ name: 'ProductAuditView' });
const loading = ref(false);
const auditLoading = ref(false);
const tableData = ref([]);
const total = ref(0);
const auditVisible = ref(false);
const auditItem = ref(null);
const auditingId = ref(null);
const auditFormRef = ref();
const searchForm = reactive({
    keyword: '',
    merchantId: '',
    categoryId: '',
    page: 1,
    pageSize: 20,
});
const auditForm = reactive({
    auditRemark: '',
});
async function fetchData() {
    loading.value = true;
    try {
        const { data: res } = await productApi.getAuditList({
            keyword: searchForm.keyword || undefined,
            merchantId: searchForm.merchantId || undefined,
            categoryId: searchForm.categoryId || undefined,
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
async function handleOpenAudit(row) {
    try {
        const { data: res } = await productApi.getProductDetail(row.id);
        if (res.code === 200) {
            auditItem.value = res.data;
            auditingId.value = row.id;
            auditForm.auditRemark = '';
            auditVisible.value = true;
        }
        else {
            ElMessage.error(res.message || '加载详情失败');
        }
    }
    catch {
        ElMessage.error('加载详情失败');
    }
}
async function handleApprove() {
    await doAudit('APPROVED');
}
async function handleReject() {
    await doAudit('REJECTED');
}
async function doAudit(auditStatus) {
    if (!auditingId.value)
        return;
    auditLoading.value = true;
    try {
        const { data: res } = await productApi.auditProduct(auditingId.value, {
            auditStatus,
            auditRemark: auditForm.auditRemark || undefined,
        });
        if (res.code === 200) {
            ElMessage.success(auditStatus === 'APPROVED' ? 'Approved successfully' : 'Rejected');
            auditVisible.value = false;
            fetchData();
        }
        else {
            ElMessage.error(res.message || '审核失败');
        }
    }
    catch {
        ElMessage.error('审核失败');
    }
    finally {
        auditLoading.value = false;
    }
}
function resetAuditForm() {
    auditFormRef.value?.resetFields();
}
onMounted(() => {
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
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_39 = __VLS_asFunctionalComponent1(__VLS_38, new __VLS_38({
    ...{ 'onClear': {} },
    ...{ 'onKeyup': {} },
    modelValue: (__VLS_ctx.searchForm.categoryId),
    placeholder: "分类ID",
    clearable: true,
}));
const __VLS_40 = __VLS_39({
    ...{ 'onClear': {} },
    ...{ 'onKeyup': {} },
    modelValue: (__VLS_ctx.searchForm.categoryId),
    placeholder: "分类ID",
    clearable: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_39));
let __VLS_43;
const __VLS_44 = {
    ...{ clear: {} },
    onClear: (__VLS_ctx.handleSearch),
    ...{ keyup: {} },
    onKeyup: (__VLS_ctx.handleSearch),
};
var __VLS_41;
var __VLS_42;
// @ts-ignore
[searchForm, handleSearch, handleSearch,];
var __VLS_35;
let __VLS_45;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_46 = __VLS_asFunctionalComponent1(__VLS_45, new __VLS_45({}));
const __VLS_47 = __VLS_46({}, ...__VLS_functionalComponentArgsRest(__VLS_46));
const { default: __VLS_50 } = __VLS_48.slots;
let __VLS_51;
/** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
elButton;
// @ts-ignore
const __VLS_52 = __VLS_asFunctionalComponent1(__VLS_51, new __VLS_51({
    ...{ 'onClick': {} },
    type: "primary",
}));
const __VLS_53 = __VLS_52({
    ...{ 'onClick': {} },
    type: "primary",
}, ...__VLS_functionalComponentArgsRest(__VLS_52));
let __VLS_56;
const __VLS_57 = {
    ...{ click: {} },
    onClick: (__VLS_ctx.handleSearch),
};
const { default: __VLS_58 } = __VLS_54.slots;
// @ts-ignore
[handleSearch,];
var __VLS_54;
var __VLS_55;
// @ts-ignore
[];
var __VLS_48;
// @ts-ignore
[];
var __VLS_3;
let __VLS_59;
/** @ts-ignore @type { | typeof __VLS_components.elTable | typeof __VLS_components.ElTable | typeof __VLS_components['el-table'] | typeof __VLS_components.elTable | typeof __VLS_components.ElTable | typeof __VLS_components['el-table']} */
elTable;
// @ts-ignore
const __VLS_60 = __VLS_asFunctionalComponent1(__VLS_59, new __VLS_59({
    data: (__VLS_ctx.tableData),
    border: true,
    stripe: true,
}));
const __VLS_61 = __VLS_60({
    data: (__VLS_ctx.tableData),
    border: true,
    stripe: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_60));
__VLS_asFunctionalDirective(__VLS_directives.vLoading, {})(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.loading) }, null, null);
const { default: __VLS_64 } = __VLS_62.slots;
let __VLS_65;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_66 = __VLS_asFunctionalComponent1(__VLS_65, new __VLS_65({
    label: "封面",
    width: "90",
    align: "center",
}));
const __VLS_67 = __VLS_66({
    label: "封面",
    width: "90",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_66));
const { default: __VLS_70 } = __VLS_68.slots;
{
    const { default: __VLS_71 } = __VLS_68.slots;
    const [{ row }] = __VLS_vSlot(__VLS_71);
    if (row.coverImage) {
        let __VLS_72;
        /** @ts-ignore @type { | typeof __VLS_components.elImage | typeof __VLS_components.ElImage | typeof __VLS_components['el-image']} */
        elImage;
        // @ts-ignore
        const __VLS_73 = __VLS_asFunctionalComponent1(__VLS_72, new __VLS_72({
            src: (row.coverImage),
            ...{ style: {} },
            fit: "cover",
        }));
        const __VLS_74 = __VLS_73({
            src: (row.coverImage),
            ...{ style: {} },
            fit: "cover",
        }, ...__VLS_functionalComponentArgsRest(__VLS_73));
    }
    else {
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    }
    // @ts-ignore
    [tableData, vLoading, loading,];
}
// @ts-ignore
[];
var __VLS_68;
let __VLS_77;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_78 = __VLS_asFunctionalComponent1(__VLS_77, new __VLS_77({
    prop: "title",
    label: "标题",
    minWidth: "180",
    showOverflowTooltip: true,
}));
const __VLS_79 = __VLS_78({
    prop: "title",
    label: "标题",
    minWidth: "180",
    showOverflowTooltip: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_78));
let __VLS_82;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_83 = __VLS_asFunctionalComponent1(__VLS_82, new __VLS_82({
    prop: "merchantName",
    label: "商户",
    width: "130",
    showOverflowTooltip: true,
}));
const __VLS_84 = __VLS_83({
    prop: "merchantName",
    label: "商户",
    width: "130",
    showOverflowTooltip: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_83));
let __VLS_87;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_88 = __VLS_asFunctionalComponent1(__VLS_87, new __VLS_87({
    prop: "categoryName",
    label: "分类",
    width: "120",
    showOverflowTooltip: true,
}));
const __VLS_89 = __VLS_88({
    prop: "categoryName",
    label: "分类",
    width: "120",
    showOverflowTooltip: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_88));
let __VLS_92;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_93 = __VLS_asFunctionalComponent1(__VLS_92, new __VLS_92({
    prop: "price",
    label: "价格",
    width: "100",
    align: "right",
}));
const __VLS_94 = __VLS_93({
    prop: "price",
    label: "价格",
    width: "100",
    align: "right",
}, ...__VLS_functionalComponentArgsRest(__VLS_93));
let __VLS_97;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_98 = __VLS_asFunctionalComponent1(__VLS_97, new __VLS_97({
    prop: "auditStatus",
    label: "审核状态",
    width: "110",
    align: "center",
}));
const __VLS_99 = __VLS_98({
    prop: "auditStatus",
    label: "审核状态",
    width: "110",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_98));
const { default: __VLS_102 } = __VLS_100.slots;
{
    const { default: __VLS_103 } = __VLS_100.slots;
    const [{ row }] = __VLS_vSlot(__VLS_103);
    let __VLS_104;
    /** @ts-ignore @type { | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag'] | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag']} */
    elTag;
    // @ts-ignore
    const __VLS_105 = __VLS_asFunctionalComponent1(__VLS_104, new __VLS_104({
        type: (row.auditStatus === 'APPROVED' ? 'success' : row.auditStatus === 'REJECTED' ? 'danger' : row.auditStatus === 'PENDING' ? 'warning' : 'info'),
    }));
    const __VLS_106 = __VLS_105({
        type: (row.auditStatus === 'APPROVED' ? 'success' : row.auditStatus === 'REJECTED' ? 'danger' : row.auditStatus === 'PENDING' ? 'warning' : 'info'),
    }, ...__VLS_functionalComponentArgsRest(__VLS_105));
    const { default: __VLS_109 } = __VLS_107.slots;
    (row.auditStatus);
    // @ts-ignore
    [];
    var __VLS_107;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_100;
let __VLS_110;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_111 = __VLS_asFunctionalComponent1(__VLS_110, new __VLS_110({
    prop: "createdAt",
    label: "已提交",
    width: "180",
}));
const __VLS_112 = __VLS_111({
    prop: "createdAt",
    label: "已提交",
    width: "180",
}, ...__VLS_functionalComponentArgsRest(__VLS_111));
let __VLS_115;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_116 = __VLS_asFunctionalComponent1(__VLS_115, new __VLS_115({
    label: "操作",
    width: "130",
    fixed: "right",
}));
const __VLS_117 = __VLS_116({
    label: "操作",
    width: "130",
    fixed: "right",
}, ...__VLS_functionalComponentArgsRest(__VLS_116));
const { default: __VLS_120 } = __VLS_118.slots;
{
    const { default: __VLS_121 } = __VLS_118.slots;
    const [{ row }] = __VLS_vSlot(__VLS_121);
    let __VLS_122;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_123 = __VLS_asFunctionalComponent1(__VLS_122, new __VLS_122({
        ...{ 'onClick': {} },
        link: true,
        type: "primary",
    }));
    const __VLS_124 = __VLS_123({
        ...{ 'onClick': {} },
        link: true,
        type: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_123));
    let __VLS_127;
    const __VLS_128 = {
        ...{ click: {} },
        onClick: (...[$event]) => {
            __VLS_ctx.handleOpenAudit(row);
            // @ts-ignore
            [handleOpenAudit,];
        },
    };
    __VLS_asFunctionalDirective(__VLS_directives.vPermission, {})(null, { ...__VLS_directiveBindingRestFields, value: ('product:audit') }, null, null);
    const { default: __VLS_129 } = __VLS_125.slots;
    // @ts-ignore
    [vPermission,];
    var __VLS_125;
    var __VLS_126;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_118;
// @ts-ignore
[];
var __VLS_62;
let __VLS_130;
/** @ts-ignore @type { | typeof __VLS_components.elPagination | typeof __VLS_components.ElPagination | typeof __VLS_components['el-pagination']} */
elPagination;
// @ts-ignore
const __VLS_131 = __VLS_asFunctionalComponent1(__VLS_130, new __VLS_130({
    ...{ 'onChange': {} },
    currentPage: (__VLS_ctx.searchForm.page),
    pageSize: (__VLS_ctx.searchForm.pageSize),
    total: (__VLS_ctx.total),
    pageSizes: ([10, 20, 50, 100]),
    layout: "total, sizes, prev, pager, next",
}));
const __VLS_132 = __VLS_131({
    ...{ 'onChange': {} },
    currentPage: (__VLS_ctx.searchForm.page),
    pageSize: (__VLS_ctx.searchForm.pageSize),
    total: (__VLS_ctx.total),
    pageSizes: ([10, 20, 50, 100]),
    layout: "total, sizes, prev, pager, next",
}, ...__VLS_functionalComponentArgsRest(__VLS_131));
let __VLS_135;
const __VLS_136 = {
    ...{ change: {} },
    onChange: (__VLS_ctx.fetchData),
};
var __VLS_133;
var __VLS_134;
let __VLS_137;
/** @ts-ignore @type { | typeof __VLS_components.elDialog | typeof __VLS_components.ElDialog | typeof __VLS_components['el-dialog'] | typeof __VLS_components.elDialog | typeof __VLS_components.ElDialog | typeof __VLS_components['el-dialog']} */
elDialog;
// @ts-ignore
const __VLS_138 = __VLS_asFunctionalComponent1(__VLS_137, new __VLS_137({
    ...{ 'onClose': {} },
    modelValue: (__VLS_ctx.auditVisible),
    title: "商品审核",
    width: "800px",
}));
const __VLS_139 = __VLS_138({
    ...{ 'onClose': {} },
    modelValue: (__VLS_ctx.auditVisible),
    title: "商品审核",
    width: "800px",
}, ...__VLS_functionalComponentArgsRest(__VLS_138));
let __VLS_142;
const __VLS_143 = {
    ...{ close: {} },
    onClose: (__VLS_ctx.resetAuditForm),
};
const { default: __VLS_144 } = __VLS_140.slots;
if (__VLS_ctx.auditItem) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "audit-detail" },
    });
    /** @type {__VLS_StyleScopedClasses['audit-detail']} */ ;
    let __VLS_145;
    /** @ts-ignore @type { | typeof __VLS_components.elRow | typeof __VLS_components.ElRow | typeof __VLS_components['el-row'] | typeof __VLS_components.elRow | typeof __VLS_components.ElRow | typeof __VLS_components['el-row']} */
    elRow;
    // @ts-ignore
    const __VLS_146 = __VLS_asFunctionalComponent1(__VLS_145, new __VLS_145({
        gutter: (16),
    }));
    const __VLS_147 = __VLS_146({
        gutter: (16),
    }, ...__VLS_functionalComponentArgsRest(__VLS_146));
    const { default: __VLS_150 } = __VLS_148.slots;
    let __VLS_151;
    /** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
    elCol;
    // @ts-ignore
    const __VLS_152 = __VLS_asFunctionalComponent1(__VLS_151, new __VLS_151({
        span: (12),
    }));
    const __VLS_153 = __VLS_152({
        span: (12),
    }, ...__VLS_functionalComponentArgsRest(__VLS_152));
    const { default: __VLS_156 } = __VLS_154.slots;
    if (__VLS_ctx.auditItem.coverImage) {
        let __VLS_157;
        /** @ts-ignore @type { | typeof __VLS_components.elImage | typeof __VLS_components.ElImage | typeof __VLS_components['el-image']} */
        elImage;
        // @ts-ignore
        const __VLS_158 = __VLS_asFunctionalComponent1(__VLS_157, new __VLS_157({
            src: (__VLS_ctx.auditItem.coverImage),
            ...{ style: {} },
            fit: "cover",
        }));
        const __VLS_159 = __VLS_158({
            src: (__VLS_ctx.auditItem.coverImage),
            ...{ style: {} },
            fit: "cover",
        }, ...__VLS_functionalComponentArgsRest(__VLS_158));
    }
    // @ts-ignore
    [searchForm, searchForm, total, fetchData, auditVisible, resetAuditForm, auditItem, auditItem, auditItem,];
    var __VLS_154;
    let __VLS_162;
    /** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
    elCol;
    // @ts-ignore
    const __VLS_163 = __VLS_asFunctionalComponent1(__VLS_162, new __VLS_162({
        span: (12),
    }));
    const __VLS_164 = __VLS_163({
        span: (12),
    }, ...__VLS_functionalComponentArgsRest(__VLS_163));
    const { default: __VLS_167 } = __VLS_165.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({});
    (__VLS_ctx.auditItem.title);
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({});
    (__VLS_ctx.auditItem.description);
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({});
    (__VLS_ctx.auditItem.price);
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({});
    (__VLS_ctx.auditItem.originalPrice);
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({});
    (__VLS_ctx.auditItem.stock);
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({});
    (__VLS_ctx.auditItem.status);
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({});
    (__VLS_ctx.auditItem.auditStatus);
    if (__VLS_ctx.auditItem.merchantName) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({});
        __VLS_asFunctionalElement1(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({});
        (__VLS_ctx.auditItem.merchantName);
    }
    if (__VLS_ctx.auditItem.categoryName) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({});
        __VLS_asFunctionalElement1(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({});
        (__VLS_ctx.auditItem.categoryName);
    }
    // @ts-ignore
    [auditItem, auditItem, auditItem, auditItem, auditItem, auditItem, auditItem, auditItem, auditItem, auditItem, auditItem,];
    var __VLS_165;
    // @ts-ignore
    [];
    var __VLS_148;
    let __VLS_168;
    /** @ts-ignore @type { | typeof __VLS_components.elDivider | typeof __VLS_components.ElDivider | typeof __VLS_components['el-divider']} */
    elDivider;
    // @ts-ignore
    const __VLS_169 = __VLS_asFunctionalComponent1(__VLS_168, new __VLS_168({}));
    const __VLS_170 = __VLS_169({}, ...__VLS_functionalComponentArgsRest(__VLS_169));
    __VLS_asFunctionalElement1(__VLS_intrinsics.h4, __VLS_intrinsics.h4)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "image-gallery" },
    });
    /** @type {__VLS_StyleScopedClasses['image-gallery']} */ ;
    for (const [img] of __VLS_vFor((__VLS_ctx.auditItem.images))) {
        let __VLS_173;
        /** @ts-ignore @type { | typeof __VLS_components.elImage | typeof __VLS_components.ElImage | typeof __VLS_components['el-image']} */
        elImage;
        // @ts-ignore
        const __VLS_174 = __VLS_asFunctionalComponent1(__VLS_173, new __VLS_173({
            key: (img.id),
            src: (img.imageUrl),
            ...{ style: {} },
            fit: "cover",
        }));
        const __VLS_175 = __VLS_174({
            key: (img.id),
            src: (img.imageUrl),
            ...{ style: {} },
            fit: "cover",
        }, ...__VLS_functionalComponentArgsRest(__VLS_174));
        // @ts-ignore
        [auditItem,];
    }
    if (!__VLS_ctx.auditItem.images?.length) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    }
    let __VLS_178;
    /** @ts-ignore @type { | typeof __VLS_components.elDivider | typeof __VLS_components.ElDivider | typeof __VLS_components['el-divider']} */
    elDivider;
    // @ts-ignore
    const __VLS_179 = __VLS_asFunctionalComponent1(__VLS_178, new __VLS_178({}));
    const __VLS_180 = __VLS_179({}, ...__VLS_functionalComponentArgsRest(__VLS_179));
    __VLS_asFunctionalElement1(__VLS_intrinsics.h4, __VLS_intrinsics.h4)({});
    if (__VLS_ctx.auditItem.translations?.length) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
        for (const [pt] of __VLS_vFor((__VLS_ctx.auditItem.translations))) {
            let __VLS_183;
            /** @ts-ignore @type { | typeof __VLS_components.elDescriptions | typeof __VLS_components.ElDescriptions | typeof __VLS_components['el-descriptions'] | typeof __VLS_components.elDescriptions | typeof __VLS_components.ElDescriptions | typeof __VLS_components['el-descriptions']} */
            elDescriptions;
            // @ts-ignore
            const __VLS_184 = __VLS_asFunctionalComponent1(__VLS_183, new __VLS_183({
                key: (pt.id),
                title: (pt.languageCode),
                column: (1),
                border: true,
                size: "small",
                ...{ style: {} },
            }));
            const __VLS_185 = __VLS_184({
                key: (pt.id),
                title: (pt.languageCode),
                column: (1),
                border: true,
                size: "small",
                ...{ style: {} },
            }, ...__VLS_functionalComponentArgsRest(__VLS_184));
            const { default: __VLS_188 } = __VLS_186.slots;
            let __VLS_189;
            /** @ts-ignore @type { | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item'] | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item']} */
            elDescriptionsItem;
            // @ts-ignore
            const __VLS_190 = __VLS_asFunctionalComponent1(__VLS_189, new __VLS_189({
                label: "标题",
            }));
            const __VLS_191 = __VLS_190({
                label: "标题",
            }, ...__VLS_functionalComponentArgsRest(__VLS_190));
            const { default: __VLS_194 } = __VLS_192.slots;
            (pt.title);
            // @ts-ignore
            [auditItem, auditItem, auditItem,];
            var __VLS_192;
            let __VLS_195;
            /** @ts-ignore @type { | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item'] | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item']} */
            elDescriptionsItem;
            // @ts-ignore
            const __VLS_196 = __VLS_asFunctionalComponent1(__VLS_195, new __VLS_195({
                label: "描述",
            }));
            const __VLS_197 = __VLS_196({
                label: "描述",
            }, ...__VLS_functionalComponentArgsRest(__VLS_196));
            const { default: __VLS_200 } = __VLS_198.slots;
            (pt.description);
            // @ts-ignore
            [];
            var __VLS_198;
            // @ts-ignore
            [];
            var __VLS_186;
            // @ts-ignore
            [];
        }
    }
    else {
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    }
    let __VLS_201;
    /** @ts-ignore @type { | typeof __VLS_components.elDivider | typeof __VLS_components.ElDivider | typeof __VLS_components['el-divider']} */
    elDivider;
    // @ts-ignore
    const __VLS_202 = __VLS_asFunctionalComponent1(__VLS_201, new __VLS_201({}));
    const __VLS_203 = __VLS_202({}, ...__VLS_functionalComponentArgsRest(__VLS_202));
    let __VLS_206;
    /** @ts-ignore @type { | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form'] | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form']} */
    elForm;
    // @ts-ignore
    const __VLS_207 = __VLS_asFunctionalComponent1(__VLS_206, new __VLS_206({
        ref: "auditFormRef",
        model: (__VLS_ctx.auditForm),
        labelWidth: "130px",
    }));
    const __VLS_208 = __VLS_207({
        ref: "auditFormRef",
        model: (__VLS_ctx.auditForm),
        labelWidth: "130px",
    }, ...__VLS_functionalComponentArgsRest(__VLS_207));
    var __VLS_211;
    const { default: __VLS_213 } = __VLS_209.slots;
    let __VLS_214;
    /** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
    elFormItem;
    // @ts-ignore
    const __VLS_215 = __VLS_asFunctionalComponent1(__VLS_214, new __VLS_214({
        label: "审核备注",
        prop: "auditRemark",
    }));
    const __VLS_216 = __VLS_215({
        label: "审核备注",
        prop: "auditRemark",
    }, ...__VLS_functionalComponentArgsRest(__VLS_215));
    const { default: __VLS_219 } = __VLS_217.slots;
    let __VLS_220;
    /** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
    elInput;
    // @ts-ignore
    const __VLS_221 = __VLS_asFunctionalComponent1(__VLS_220, new __VLS_220({
        modelValue: (__VLS_ctx.auditForm.auditRemark),
        type: "textarea",
        rows: (3),
        placeholder: "审核备注（选填）",
    }));
    const __VLS_222 = __VLS_221({
        modelValue: (__VLS_ctx.auditForm.auditRemark),
        type: "textarea",
        rows: (3),
        placeholder: "审核备注（选填）",
    }, ...__VLS_functionalComponentArgsRest(__VLS_221));
    // @ts-ignore
    [auditForm, auditForm,];
    var __VLS_217;
    // @ts-ignore
    [];
    var __VLS_209;
}
{
    const { footer: __VLS_225 } = __VLS_140.slots;
    let __VLS_226;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_227 = __VLS_asFunctionalComponent1(__VLS_226, new __VLS_226({
        ...{ 'onClick': {} },
    }));
    const __VLS_228 = __VLS_227({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_227));
    let __VLS_231;
    const __VLS_232 = {
        ...{ click: {} },
        onClick: (...[$event]) => {
            __VLS_ctx.auditVisible = false;
            // @ts-ignore
            [auditVisible,];
        },
    };
    const { default: __VLS_233 } = __VLS_229.slots;
    // @ts-ignore
    [];
    var __VLS_229;
    var __VLS_230;
    let __VLS_234;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_235 = __VLS_asFunctionalComponent1(__VLS_234, new __VLS_234({
        ...{ 'onClick': {} },
        type: "danger",
        loading: (__VLS_ctx.auditLoading),
    }));
    const __VLS_236 = __VLS_235({
        ...{ 'onClick': {} },
        type: "danger",
        loading: (__VLS_ctx.auditLoading),
    }, ...__VLS_functionalComponentArgsRest(__VLS_235));
    let __VLS_239;
    const __VLS_240 = {
        ...{ click: {} },
        onClick: (__VLS_ctx.handleReject),
    };
    const { default: __VLS_241 } = __VLS_237.slots;
    // @ts-ignore
    [auditLoading, handleReject,];
    var __VLS_237;
    var __VLS_238;
    let __VLS_242;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_243 = __VLS_asFunctionalComponent1(__VLS_242, new __VLS_242({
        ...{ 'onClick': {} },
        type: "success",
        loading: (__VLS_ctx.auditLoading),
    }));
    const __VLS_244 = __VLS_243({
        ...{ 'onClick': {} },
        type: "success",
        loading: (__VLS_ctx.auditLoading),
    }, ...__VLS_functionalComponentArgsRest(__VLS_243));
    let __VLS_247;
    const __VLS_248 = {
        ...{ click: {} },
        onClick: (__VLS_ctx.handleApprove),
    };
    const { default: __VLS_249 } = __VLS_245.slots;
    // @ts-ignore
    [auditLoading, handleApprove,];
    var __VLS_245;
    var __VLS_246;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_140;
var __VLS_141;
// @ts-ignore
var __VLS_212 = __VLS_211;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
