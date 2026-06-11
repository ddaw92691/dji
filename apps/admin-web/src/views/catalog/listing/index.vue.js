/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ref, reactive, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { catalogApi } from '@/api/catalog';
defineOptions({ name: 'CatalogListingView' });
const loading = ref(false);
const tableData = ref([]);
const total = ref(0);
const searchForm = reactive({
    merchantKeyword: '',
    platformProductId: '',
    status: '',
    page: 1,
    pageSize: 20,
});
async function fetchData() {
    loading.value = true;
    try {
        const { data: res } = await catalogApi.getListings({
            merchantKeyword: searchForm.merchantKeyword || undefined,
            platformProductId: searchForm.platformProductId || undefined,
            status: searchForm.status || undefined,
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
async function handleDelist(row) {
    try {
        const { data: res } = await catalogApi.disableListing(row.id);
        if (res.code === 200) {
            ElMessage.success('商品已下架');
            fetchData();
        }
        else {
            ElMessage.error(res.message || '下架失败');
        }
    }
    catch {
        ElMessage.error('下架失败');
    }
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
    ...{ class: "catalog-listing-page" },
});
/** @type {__VLS_StyleScopedClasses['catalog-listing-page']} */ ;
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
    modelValue: (__VLS_ctx.searchForm.merchantKeyword),
    placeholder: "商户名称",
    clearable: true,
}));
const __VLS_14 = __VLS_13({
    ...{ 'onClear': {} },
    ...{ 'onKeyup': {} },
    modelValue: (__VLS_ctx.searchForm.merchantKeyword),
    placeholder: "商户名称",
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
    modelValue: (__VLS_ctx.searchForm.platformProductId),
    placeholder: "平台商品ID",
    clearable: true,
}));
const __VLS_27 = __VLS_26({
    ...{ 'onClear': {} },
    ...{ 'onKeyup': {} },
    modelValue: (__VLS_ctx.searchForm.platformProductId),
    placeholder: "平台商品ID",
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
    modelValue: (__VLS_ctx.searchForm.status),
    placeholder: "状态",
    clearable: true,
}));
const __VLS_40 = __VLS_39({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.searchForm.status),
    placeholder: "状态",
    clearable: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_39));
let __VLS_43;
const __VLS_44 = {
    ...{ change: {} },
    onChange: (__VLS_ctx.handleSearch),
};
const { default: __VLS_45 } = __VLS_41.slots;
let __VLS_46;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_47 = __VLS_asFunctionalComponent1(__VLS_46, new __VLS_46({
    label: "在售",
    value: "ON_SALE",
}));
const __VLS_48 = __VLS_47({
    label: "在售",
    value: "ON_SALE",
}, ...__VLS_functionalComponentArgsRest(__VLS_47));
let __VLS_51;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_52 = __VLS_asFunctionalComponent1(__VLS_51, new __VLS_51({
    label: "已下架",
    value: "OFF_SALE",
}));
const __VLS_53 = __VLS_52({
    label: "已下架",
    value: "OFF_SALE",
}, ...__VLS_functionalComponentArgsRest(__VLS_52));
// @ts-ignore
[searchForm, handleSearch,];
var __VLS_41;
var __VLS_42;
// @ts-ignore
[];
var __VLS_35;
let __VLS_56;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_57 = __VLS_asFunctionalComponent1(__VLS_56, new __VLS_56({}));
const __VLS_58 = __VLS_57({}, ...__VLS_functionalComponentArgsRest(__VLS_57));
const { default: __VLS_61 } = __VLS_59.slots;
let __VLS_62;
/** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
elButton;
// @ts-ignore
const __VLS_63 = __VLS_asFunctionalComponent1(__VLS_62, new __VLS_62({
    ...{ 'onClick': {} },
    type: "primary",
}));
const __VLS_64 = __VLS_63({
    ...{ 'onClick': {} },
    type: "primary",
}, ...__VLS_functionalComponentArgsRest(__VLS_63));
let __VLS_67;
const __VLS_68 = {
    ...{ click: {} },
    onClick: (__VLS_ctx.handleSearch),
};
const { default: __VLS_69 } = __VLS_65.slots;
// @ts-ignore
[handleSearch,];
var __VLS_65;
var __VLS_66;
// @ts-ignore
[];
var __VLS_59;
// @ts-ignore
[];
var __VLS_3;
let __VLS_70;
/** @ts-ignore @type { | typeof __VLS_components.elTable | typeof __VLS_components.ElTable | typeof __VLS_components['el-table'] | typeof __VLS_components.elTable | typeof __VLS_components.ElTable | typeof __VLS_components['el-table']} */
elTable;
// @ts-ignore
const __VLS_71 = __VLS_asFunctionalComponent1(__VLS_70, new __VLS_70({
    data: (__VLS_ctx.tableData),
    border: true,
    stripe: true,
}));
const __VLS_72 = __VLS_71({
    data: (__VLS_ctx.tableData),
    border: true,
    stripe: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_71));
__VLS_asFunctionalDirective(__VLS_directives.vLoading, {})(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.loading) }, null, null);
const { default: __VLS_75 } = __VLS_73.slots;
let __VLS_76;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_77 = __VLS_asFunctionalComponent1(__VLS_76, new __VLS_76({
    type: "index",
    label: "#",
    width: "55",
}));
const __VLS_78 = __VLS_77({
    type: "index",
    label: "#",
    width: "55",
}, ...__VLS_functionalComponentArgsRest(__VLS_77));
let __VLS_81;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_82 = __VLS_asFunctionalComponent1(__VLS_81, new __VLS_81({
    prop: "merchantName",
    label: "商户",
    minWidth: "140",
    showOverflowTooltip: true,
}));
const __VLS_83 = __VLS_82({
    prop: "merchantName",
    label: "商户",
    minWidth: "140",
    showOverflowTooltip: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_82));
let __VLS_86;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_87 = __VLS_asFunctionalComponent1(__VLS_86, new __VLS_86({
    prop: "platformProductName",
    label: "平台商品",
    minWidth: "180",
    showOverflowTooltip: true,
}));
const __VLS_88 = __VLS_87({
    prop: "platformProductName",
    label: "平台商品",
    minWidth: "180",
    showOverflowTooltip: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_87));
const { default: __VLS_91 } = __VLS_89.slots;
{
    const { default: __VLS_92 } = __VLS_89.slots;
    const [{ row }] = __VLS_vSlot(__VLS_92);
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    (row.platformProductName || row.platformProductModel || '-');
    // @ts-ignore
    [tableData, vLoading, loading,];
}
// @ts-ignore
[];
var __VLS_89;
let __VLS_93;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_94 = __VLS_asFunctionalComponent1(__VLS_93, new __VLS_93({
    prop: "listingStatus",
    label: "状态",
    width: "110",
    align: "center",
}));
const __VLS_95 = __VLS_94({
    prop: "listingStatus",
    label: "状态",
    width: "110",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_94));
const { default: __VLS_98 } = __VLS_96.slots;
{
    const { default: __VLS_99 } = __VLS_96.slots;
    const [{ row }] = __VLS_vSlot(__VLS_99);
    let __VLS_100;
    /** @ts-ignore @type { | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag'] | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag']} */
    elTag;
    // @ts-ignore
    const __VLS_101 = __VLS_asFunctionalComponent1(__VLS_100, new __VLS_100({
        type: (row.listingStatus === 'ON_SALE' ? 'success' : 'warning'),
        size: "small",
    }));
    const __VLS_102 = __VLS_101({
        type: (row.listingStatus === 'ON_SALE' ? 'success' : 'warning'),
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_101));
    const { default: __VLS_105 } = __VLS_103.slots;
    (row.listingStatus === 'ON_SALE' ? 'On Sale' : 'Off Sale');
    // @ts-ignore
    [];
    var __VLS_103;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_96;
let __VLS_106;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_107 = __VLS_asFunctionalComponent1(__VLS_106, new __VLS_106({
    prop: "merchantStock",
    label: "库存",
    width: "80",
    align: "center",
}));
const __VLS_108 = __VLS_107({
    prop: "merchantStock",
    label: "库存",
    width: "80",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_107));
let __VLS_111;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_112 = __VLS_asFunctionalComponent1(__VLS_111, new __VLS_111({
    prop: "salePrice",
    label: "售价",
    width: "100",
    align: "right",
}));
const __VLS_113 = __VLS_112({
    prop: "salePrice",
    label: "售价",
    width: "100",
    align: "right",
}, ...__VLS_functionalComponentArgsRest(__VLS_112));
let __VLS_116;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_117 = __VLS_asFunctionalComponent1(__VLS_116, new __VLS_116({
    prop: "merchantPrice",
    label: "货款成本",
    width: "100",
    align: "right",
}));
const __VLS_118 = __VLS_117({
    prop: "merchantPrice",
    label: "货款成本",
    width: "100",
    align: "right",
}, ...__VLS_functionalComponentArgsRest(__VLS_117));
let __VLS_121;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_122 = __VLS_asFunctionalComponent1(__VLS_121, new __VLS_121({
    prop: "profitAmount",
    label: "利润",
    width: "90",
    align: "right",
}));
const __VLS_123 = __VLS_122({
    prop: "profitAmount",
    label: "利润",
    width: "90",
    align: "right",
}, ...__VLS_functionalComponentArgsRest(__VLS_122));
let __VLS_126;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_127 = __VLS_asFunctionalComponent1(__VLS_126, new __VLS_126({
    prop: "listedAt",
    label: "上架时间",
    width: "160",
}));
const __VLS_128 = __VLS_127({
    prop: "listedAt",
    label: "上架时间",
    width: "160",
}, ...__VLS_functionalComponentArgsRest(__VLS_127));
let __VLS_131;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_132 = __VLS_asFunctionalComponent1(__VLS_131, new __VLS_131({
    label: "操作",
    width: "120",
    fixed: "right",
}));
const __VLS_133 = __VLS_132({
    label: "操作",
    width: "120",
    fixed: "right",
}, ...__VLS_functionalComponentArgsRest(__VLS_132));
const { default: __VLS_136 } = __VLS_134.slots;
{
    const { default: __VLS_137 } = __VLS_134.slots;
    const [{ row }] = __VLS_vSlot(__VLS_137);
    let __VLS_138;
    /** @ts-ignore @type { | typeof __VLS_components.elPopconfirm | typeof __VLS_components.ElPopconfirm | typeof __VLS_components['el-popconfirm'] | typeof __VLS_components.elPopconfirm | typeof __VLS_components.ElPopconfirm | typeof __VLS_components['el-popconfirm']} */
    elPopconfirm;
    // @ts-ignore
    const __VLS_139 = __VLS_asFunctionalComponent1(__VLS_138, new __VLS_138({
        ...{ 'onConfirm': {} },
        title: "确定要强制下架该商品吗？",
        placement: "top",
        width: "200",
    }));
    const __VLS_140 = __VLS_139({
        ...{ 'onConfirm': {} },
        title: "确定要强制下架该商品吗？",
        placement: "top",
        width: "200",
    }, ...__VLS_functionalComponentArgsRest(__VLS_139));
    let __VLS_143;
    const __VLS_144 = {
        ...{ confirm: {} },
        onConfirm: (...[$event]) => {
            __VLS_ctx.handleDelist(row);
            // @ts-ignore
            [handleDelist,];
        },
    };
    const { default: __VLS_145 } = __VLS_141.slots;
    {
        const { reference: __VLS_146 } = __VLS_141.slots;
        let __VLS_147;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_148 = __VLS_asFunctionalComponent1(__VLS_147, new __VLS_147({
            link: true,
            type: "danger",
        }));
        const __VLS_149 = __VLS_148({
            link: true,
            type: "danger",
        }, ...__VLS_functionalComponentArgsRest(__VLS_148));
        __VLS_asFunctionalDirective(__VLS_directives.vPermission, {})(null, { ...__VLS_directiveBindingRestFields, value: ('admin:catalog:disable') }, null, null);
        const { default: __VLS_152 } = __VLS_150.slots;
        // @ts-ignore
        [vPermission,];
        var __VLS_150;
        // @ts-ignore
        [];
    }
    // @ts-ignore
    [];
    var __VLS_141;
    var __VLS_142;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_134;
// @ts-ignore
[];
var __VLS_73;
let __VLS_153;
/** @ts-ignore @type { | typeof __VLS_components.elPagination | typeof __VLS_components.ElPagination | typeof __VLS_components['el-pagination']} */
elPagination;
// @ts-ignore
const __VLS_154 = __VLS_asFunctionalComponent1(__VLS_153, new __VLS_153({
    ...{ 'onChange': {} },
    currentPage: (__VLS_ctx.searchForm.page),
    pageSize: (__VLS_ctx.searchForm.pageSize),
    total: (__VLS_ctx.total),
    pageSizes: ([10, 20, 50, 100]),
    layout: "total, sizes, prev, pager, next",
}));
const __VLS_155 = __VLS_154({
    ...{ 'onChange': {} },
    currentPage: (__VLS_ctx.searchForm.page),
    pageSize: (__VLS_ctx.searchForm.pageSize),
    total: (__VLS_ctx.total),
    pageSizes: ([10, 20, 50, 100]),
    layout: "total, sizes, prev, pager, next",
}, ...__VLS_functionalComponentArgsRest(__VLS_154));
let __VLS_158;
const __VLS_159 = {
    ...{ change: {} },
    onChange: (__VLS_ctx.fetchData),
};
var __VLS_156;
var __VLS_157;
// @ts-ignore
[searchForm, searchForm, total, fetchData,];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
