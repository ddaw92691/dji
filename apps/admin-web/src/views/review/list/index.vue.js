/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ref, reactive, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { reviewApi } from '@/api/review';
defineOptions({ name: 'ReviewListView' });
const loading = ref(false);
const tableData = ref([]);
const total = ref(0);
const detailVisible = ref(false);
const detailRow = ref(null);
const searchForm = reactive({
    keyword: '',
    productId: '',
    userId: '',
    merchantId: '',
    rating: null,
    status: '',
    page: 1,
    pageSize: 20,
});
async function fetchData() {
    loading.value = true;
    try {
        const { data: res } = await reviewApi.getReviews({
            keyword: searchForm.keyword || undefined,
            productId: searchForm.productId || undefined,
            userId: searchForm.userId || undefined,
            merchantId: searchForm.merchantId || undefined,
            rating: searchForm.rating || undefined,
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
function handleDetail(row) {
    detailRow.value = row;
    detailVisible.value = true;
}
async function handleToggleStatus(row) {
    const newStatus = row.status === 'VISIBLE' ? 'HIDDEN' : 'VISIBLE';
    try {
        const { data: res } = await reviewApi.updateReviewStatus(row.id, newStatus);
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
async function handleDelete(row) {
    try {
        const { data: res } = await reviewApi.deleteReview(row.id);
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
/** @type {__VLS_StyleScopedClasses['review-images']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "review-page" },
});
/** @type {__VLS_StyleScopedClasses['review-page']} */ ;
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
    modelValue: (__VLS_ctx.searchForm.productId),
    placeholder: "商品ID",
    clearable: true,
    ...{ style: {} },
}));
const __VLS_27 = __VLS_26({
    ...{ 'onClear': {} },
    modelValue: (__VLS_ctx.searchForm.productId),
    placeholder: "商品ID",
    clearable: true,
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_26));
let __VLS_30;
const __VLS_31 = {
    ...{ clear: {} },
    onClear: (__VLS_ctx.handleSearch),
};
var __VLS_28;
var __VLS_29;
// @ts-ignore
[searchForm, handleSearch,];
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
    modelValue: (__VLS_ctx.searchForm.userId),
    placeholder: "用户ID",
    clearable: true,
    ...{ style: {} },
}));
const __VLS_40 = __VLS_39({
    ...{ 'onClear': {} },
    modelValue: (__VLS_ctx.searchForm.userId),
    placeholder: "用户ID",
    clearable: true,
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_39));
let __VLS_43;
const __VLS_44 = {
    ...{ clear: {} },
    onClear: (__VLS_ctx.handleSearch),
};
var __VLS_41;
var __VLS_42;
// @ts-ignore
[searchForm, handleSearch,];
var __VLS_35;
let __VLS_45;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_46 = __VLS_asFunctionalComponent1(__VLS_45, new __VLS_45({}));
const __VLS_47 = __VLS_46({}, ...__VLS_functionalComponentArgsRest(__VLS_46));
const { default: __VLS_50 } = __VLS_48.slots;
let __VLS_51;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_52 = __VLS_asFunctionalComponent1(__VLS_51, new __VLS_51({
    ...{ 'onClear': {} },
    modelValue: (__VLS_ctx.searchForm.merchantId),
    placeholder: "商户ID",
    clearable: true,
    ...{ style: {} },
}));
const __VLS_53 = __VLS_52({
    ...{ 'onClear': {} },
    modelValue: (__VLS_ctx.searchForm.merchantId),
    placeholder: "商户ID",
    clearable: true,
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_52));
let __VLS_56;
const __VLS_57 = {
    ...{ clear: {} },
    onClear: (__VLS_ctx.handleSearch),
};
var __VLS_54;
var __VLS_55;
// @ts-ignore
[searchForm, handleSearch,];
var __VLS_48;
let __VLS_58;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_59 = __VLS_asFunctionalComponent1(__VLS_58, new __VLS_58({}));
const __VLS_60 = __VLS_59({}, ...__VLS_functionalComponentArgsRest(__VLS_59));
const { default: __VLS_63 } = __VLS_61.slots;
let __VLS_64;
/** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
elSelect;
// @ts-ignore
const __VLS_65 = __VLS_asFunctionalComponent1(__VLS_64, new __VLS_64({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.searchForm.rating),
    placeholder: "评分",
    clearable: true,
    ...{ style: {} },
}));
const __VLS_66 = __VLS_65({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.searchForm.rating),
    placeholder: "评分",
    clearable: true,
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_65));
let __VLS_69;
const __VLS_70 = {
    ...{ change: {} },
    onChange: (__VLS_ctx.handleSearch),
};
const { default: __VLS_71 } = __VLS_67.slots;
let __VLS_72;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_73 = __VLS_asFunctionalComponent1(__VLS_72, new __VLS_72({
    label: "★5",
    value: (5),
}));
const __VLS_74 = __VLS_73({
    label: "★5",
    value: (5),
}, ...__VLS_functionalComponentArgsRest(__VLS_73));
let __VLS_77;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_78 = __VLS_asFunctionalComponent1(__VLS_77, new __VLS_77({
    label: "★4",
    value: (4),
}));
const __VLS_79 = __VLS_78({
    label: "★4",
    value: (4),
}, ...__VLS_functionalComponentArgsRest(__VLS_78));
let __VLS_82;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_83 = __VLS_asFunctionalComponent1(__VLS_82, new __VLS_82({
    label: "★3",
    value: (3),
}));
const __VLS_84 = __VLS_83({
    label: "★3",
    value: (3),
}, ...__VLS_functionalComponentArgsRest(__VLS_83));
let __VLS_87;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_88 = __VLS_asFunctionalComponent1(__VLS_87, new __VLS_87({
    label: "★2",
    value: (2),
}));
const __VLS_89 = __VLS_88({
    label: "★2",
    value: (2),
}, ...__VLS_functionalComponentArgsRest(__VLS_88));
let __VLS_92;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_93 = __VLS_asFunctionalComponent1(__VLS_92, new __VLS_92({
    label: "★1",
    value: (1),
}));
const __VLS_94 = __VLS_93({
    label: "★1",
    value: (1),
}, ...__VLS_functionalComponentArgsRest(__VLS_93));
// @ts-ignore
[searchForm, handleSearch,];
var __VLS_67;
var __VLS_68;
// @ts-ignore
[];
var __VLS_61;
let __VLS_97;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_98 = __VLS_asFunctionalComponent1(__VLS_97, new __VLS_97({}));
const __VLS_99 = __VLS_98({}, ...__VLS_functionalComponentArgsRest(__VLS_98));
const { default: __VLS_102 } = __VLS_100.slots;
let __VLS_103;
/** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
elSelect;
// @ts-ignore
const __VLS_104 = __VLS_asFunctionalComponent1(__VLS_103, new __VLS_103({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.searchForm.status),
    placeholder: "状态",
    clearable: true,
    ...{ style: {} },
}));
const __VLS_105 = __VLS_104({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.searchForm.status),
    placeholder: "状态",
    clearable: true,
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_104));
let __VLS_108;
const __VLS_109 = {
    ...{ change: {} },
    onChange: (__VLS_ctx.handleSearch),
};
const { default: __VLS_110 } = __VLS_106.slots;
let __VLS_111;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_112 = __VLS_asFunctionalComponent1(__VLS_111, new __VLS_111({
    label: "显示",
    value: "VISIBLE",
}));
const __VLS_113 = __VLS_112({
    label: "显示",
    value: "VISIBLE",
}, ...__VLS_functionalComponentArgsRest(__VLS_112));
let __VLS_116;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_117 = __VLS_asFunctionalComponent1(__VLS_116, new __VLS_116({
    label: "隐藏",
    value: "HIDDEN",
}));
const __VLS_118 = __VLS_117({
    label: "隐藏",
    value: "HIDDEN",
}, ...__VLS_functionalComponentArgsRest(__VLS_117));
// @ts-ignore
[searchForm, handleSearch,];
var __VLS_106;
var __VLS_107;
// @ts-ignore
[];
var __VLS_100;
let __VLS_121;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_122 = __VLS_asFunctionalComponent1(__VLS_121, new __VLS_121({}));
const __VLS_123 = __VLS_122({}, ...__VLS_functionalComponentArgsRest(__VLS_122));
const { default: __VLS_126 } = __VLS_124.slots;
let __VLS_127;
/** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
elButton;
// @ts-ignore
const __VLS_128 = __VLS_asFunctionalComponent1(__VLS_127, new __VLS_127({
    ...{ 'onClick': {} },
    type: "primary",
}));
const __VLS_129 = __VLS_128({
    ...{ 'onClick': {} },
    type: "primary",
}, ...__VLS_functionalComponentArgsRest(__VLS_128));
let __VLS_132;
const __VLS_133 = {
    ...{ click: {} },
    onClick: (__VLS_ctx.handleSearch),
};
const { default: __VLS_134 } = __VLS_130.slots;
// @ts-ignore
[handleSearch,];
var __VLS_130;
var __VLS_131;
// @ts-ignore
[];
var __VLS_124;
// @ts-ignore
[];
var __VLS_3;
let __VLS_135;
/** @ts-ignore @type { | typeof __VLS_components.elTable | typeof __VLS_components.ElTable | typeof __VLS_components['el-table'] | typeof __VLS_components.elTable | typeof __VLS_components.ElTable | typeof __VLS_components['el-table']} */
elTable;
// @ts-ignore
const __VLS_136 = __VLS_asFunctionalComponent1(__VLS_135, new __VLS_135({
    data: (__VLS_ctx.tableData),
    border: true,
    stripe: true,
}));
const __VLS_137 = __VLS_136({
    data: (__VLS_ctx.tableData),
    border: true,
    stripe: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_136));
__VLS_asFunctionalDirective(__VLS_directives.vLoading, {})(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.loading) }, null, null);
const { default: __VLS_140 } = __VLS_138.slots;
let __VLS_141;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_142 = __VLS_asFunctionalComponent1(__VLS_141, new __VLS_141({
    label: "商品",
    minWidth: "150",
    showOverflowTooltip: true,
}));
const __VLS_143 = __VLS_142({
    label: "商品",
    minWidth: "150",
    showOverflowTooltip: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_142));
const { default: __VLS_146 } = __VLS_144.slots;
{
    const { default: __VLS_147 } = __VLS_144.slots;
    const [{ row }] = __VLS_vSlot(__VLS_147);
    (row.productTitle || '-');
    // @ts-ignore
    [tableData, vLoading, loading,];
}
// @ts-ignore
[];
var __VLS_144;
let __VLS_148;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_149 = __VLS_asFunctionalComponent1(__VLS_148, new __VLS_148({
    label: "客户",
    width: "120",
    showOverflowTooltip: true,
}));
const __VLS_150 = __VLS_149({
    label: "客户",
    width: "120",
    showOverflowTooltip: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_149));
const { default: __VLS_153 } = __VLS_151.slots;
{
    const { default: __VLS_154 } = __VLS_151.slots;
    const [{ row }] = __VLS_vSlot(__VLS_154);
    (row.userName || `ID:${row.userId}`);
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_151;
let __VLS_155;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_156 = __VLS_asFunctionalComponent1(__VLS_155, new __VLS_155({
    label: "商户",
    width: "120",
    showOverflowTooltip: true,
}));
const __VLS_157 = __VLS_156({
    label: "商户",
    width: "120",
    showOverflowTooltip: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_156));
const { default: __VLS_160 } = __VLS_158.slots;
{
    const { default: __VLS_161 } = __VLS_158.slots;
    const [{ row }] = __VLS_vSlot(__VLS_161);
    (row.merchantName || `ID:${row.merchantId}`);
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_158;
let __VLS_162;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_163 = __VLS_asFunctionalComponent1(__VLS_162, new __VLS_162({
    label: "评分",
    width: "120",
    align: "center",
}));
const __VLS_164 = __VLS_163({
    label: "评分",
    width: "120",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_163));
const { default: __VLS_167 } = __VLS_165.slots;
{
    const { default: __VLS_168 } = __VLS_165.slots;
    const [{ row }] = __VLS_vSlot(__VLS_168);
    let __VLS_169;
    /** @ts-ignore @type { | typeof __VLS_components.elRate | typeof __VLS_components.ElRate | typeof __VLS_components['el-rate']} */
    elRate;
    // @ts-ignore
    const __VLS_170 = __VLS_asFunctionalComponent1(__VLS_169, new __VLS_169({
        modelValue: (row.rating),
        disabled: true,
        showScore: true,
        size: "small",
    }));
    const __VLS_171 = __VLS_170({
        modelValue: (row.rating),
        disabled: true,
        showScore: true,
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_170));
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_165;
let __VLS_174;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_175 = __VLS_asFunctionalComponent1(__VLS_174, new __VLS_174({
    label: "内容",
    minWidth: "180",
    showOverflowTooltip: true,
}));
const __VLS_176 = __VLS_175({
    label: "内容",
    minWidth: "180",
    showOverflowTooltip: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_175));
const { default: __VLS_179 } = __VLS_177.slots;
{
    const { default: __VLS_180 } = __VLS_177.slots;
    const [{ row }] = __VLS_vSlot(__VLS_180);
    (row.content?.length > 50 ? row.content.slice(0, 50) + '...' : row.content);
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_177;
let __VLS_181;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_182 = __VLS_asFunctionalComponent1(__VLS_181, new __VLS_181({
    label: "状态",
    width: "100",
    align: "center",
}));
const __VLS_183 = __VLS_182({
    label: "状态",
    width: "100",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_182));
const { default: __VLS_186 } = __VLS_184.slots;
{
    const { default: __VLS_187 } = __VLS_184.slots;
    const [{ row }] = __VLS_vSlot(__VLS_187);
    let __VLS_188;
    /** @ts-ignore @type { | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag'] | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag']} */
    elTag;
    // @ts-ignore
    const __VLS_189 = __VLS_asFunctionalComponent1(__VLS_188, new __VLS_188({
        type: (row.status === 'VISIBLE' ? 'success' : 'info'),
        size: "small",
    }));
    const __VLS_190 = __VLS_189({
        type: (row.status === 'VISIBLE' ? 'success' : 'info'),
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_189));
    const { default: __VLS_193 } = __VLS_191.slots;
    (row.status === 'VISIBLE' ? 'Visible' : 'Hidden');
    // @ts-ignore
    [];
    var __VLS_191;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_184;
let __VLS_194;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_195 = __VLS_asFunctionalComponent1(__VLS_194, new __VLS_194({
    prop: "createdAt",
    label: "创建时间",
    width: "160",
}));
const __VLS_196 = __VLS_195({
    prop: "createdAt",
    label: "创建时间",
    width: "160",
}, ...__VLS_functionalComponentArgsRest(__VLS_195));
let __VLS_199;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_200 = __VLS_asFunctionalComponent1(__VLS_199, new __VLS_199({
    label: "操作",
    width: "180",
    fixed: "right",
}));
const __VLS_201 = __VLS_200({
    label: "操作",
    width: "180",
    fixed: "right",
}, ...__VLS_functionalComponentArgsRest(__VLS_200));
const { default: __VLS_204 } = __VLS_202.slots;
{
    const { default: __VLS_205 } = __VLS_202.slots;
    const [{ row }] = __VLS_vSlot(__VLS_205);
    let __VLS_206;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_207 = __VLS_asFunctionalComponent1(__VLS_206, new __VLS_206({
        ...{ 'onClick': {} },
        link: true,
        type: "primary",
    }));
    const __VLS_208 = __VLS_207({
        ...{ 'onClick': {} },
        link: true,
        type: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_207));
    let __VLS_211;
    const __VLS_212 = {
        ...{ click: {} },
        onClick: (...[$event]) => {
            __VLS_ctx.handleDetail(row);
            // @ts-ignore
            [handleDetail,];
        },
    };
    const { default: __VLS_213 } = __VLS_209.slots;
    // @ts-ignore
    [];
    var __VLS_209;
    var __VLS_210;
    let __VLS_214;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_215 = __VLS_asFunctionalComponent1(__VLS_214, new __VLS_214({
        ...{ 'onClick': {} },
        link: true,
        type: (row.status === 'VISIBLE' ? 'warning' : 'success'),
    }));
    const __VLS_216 = __VLS_215({
        ...{ 'onClick': {} },
        link: true,
        type: (row.status === 'VISIBLE' ? 'warning' : 'success'),
    }, ...__VLS_functionalComponentArgsRest(__VLS_215));
    let __VLS_219;
    const __VLS_220 = {
        ...{ click: {} },
        onClick: (...[$event]) => {
            __VLS_ctx.handleToggleStatus(row);
            // @ts-ignore
            [handleToggleStatus,];
        },
    };
    const { default: __VLS_221 } = __VLS_217.slots;
    (row.status === 'VISIBLE' ? 'Hide' : 'Show');
    // @ts-ignore
    [];
    var __VLS_217;
    var __VLS_218;
    let __VLS_222;
    /** @ts-ignore @type { | typeof __VLS_components.elPopconfirm | typeof __VLS_components.ElPopconfirm | typeof __VLS_components['el-popconfirm'] | typeof __VLS_components.elPopconfirm | typeof __VLS_components.ElPopconfirm | typeof __VLS_components['el-popconfirm']} */
    elPopconfirm;
    // @ts-ignore
    const __VLS_223 = __VLS_asFunctionalComponent1(__VLS_222, new __VLS_222({
        ...{ 'onConfirm': {} },
        title: "确定要删除吗？",
    }));
    const __VLS_224 = __VLS_223({
        ...{ 'onConfirm': {} },
        title: "确定要删除吗？",
    }, ...__VLS_functionalComponentArgsRest(__VLS_223));
    let __VLS_227;
    const __VLS_228 = {
        ...{ confirm: {} },
        onConfirm: (...[$event]) => {
            __VLS_ctx.handleDelete(row);
            // @ts-ignore
            [handleDelete,];
        },
    };
    const { default: __VLS_229 } = __VLS_225.slots;
    {
        const { reference: __VLS_230 } = __VLS_225.slots;
        let __VLS_231;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_232 = __VLS_asFunctionalComponent1(__VLS_231, new __VLS_231({
            link: true,
            type: "danger",
        }));
        const __VLS_233 = __VLS_232({
            link: true,
            type: "danger",
        }, ...__VLS_functionalComponentArgsRest(__VLS_232));
        const { default: __VLS_236 } = __VLS_234.slots;
        // @ts-ignore
        [];
        var __VLS_234;
        // @ts-ignore
        [];
    }
    // @ts-ignore
    [];
    var __VLS_225;
    var __VLS_226;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_202;
// @ts-ignore
[];
var __VLS_138;
let __VLS_237;
/** @ts-ignore @type { | typeof __VLS_components.elPagination | typeof __VLS_components.ElPagination | typeof __VLS_components['el-pagination']} */
elPagination;
// @ts-ignore
const __VLS_238 = __VLS_asFunctionalComponent1(__VLS_237, new __VLS_237({
    ...{ 'onChange': {} },
    currentPage: (__VLS_ctx.searchForm.page),
    pageSize: (__VLS_ctx.searchForm.pageSize),
    total: (__VLS_ctx.total),
    pageSizes: ([10, 20, 50, 100]),
    layout: "total, sizes, prev, pager, next",
}));
const __VLS_239 = __VLS_238({
    ...{ 'onChange': {} },
    currentPage: (__VLS_ctx.searchForm.page),
    pageSize: (__VLS_ctx.searchForm.pageSize),
    total: (__VLS_ctx.total),
    pageSizes: ([10, 20, 50, 100]),
    layout: "total, sizes, prev, pager, next",
}, ...__VLS_functionalComponentArgsRest(__VLS_238));
let __VLS_242;
const __VLS_243 = {
    ...{ change: {} },
    onChange: (__VLS_ctx.fetchData),
};
var __VLS_240;
var __VLS_241;
let __VLS_244;
/** @ts-ignore @type { | typeof __VLS_components.elDialog | typeof __VLS_components.ElDialog | typeof __VLS_components['el-dialog'] | typeof __VLS_components.elDialog | typeof __VLS_components.ElDialog | typeof __VLS_components['el-dialog']} */
elDialog;
// @ts-ignore
const __VLS_245 = __VLS_asFunctionalComponent1(__VLS_244, new __VLS_244({
    modelValue: (__VLS_ctx.detailVisible),
    title: "评价详情",
    width: "600px",
}));
const __VLS_246 = __VLS_245({
    modelValue: (__VLS_ctx.detailVisible),
    title: "评价详情",
    width: "600px",
}, ...__VLS_functionalComponentArgsRest(__VLS_245));
const { default: __VLS_249 } = __VLS_247.slots;
if (__VLS_ctx.detailRow) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "review-detail" },
    });
    /** @type {__VLS_StyleScopedClasses['review-detail']} */ ;
    let __VLS_250;
    /** @ts-ignore @type { | typeof __VLS_components.elDescriptions | typeof __VLS_components.ElDescriptions | typeof __VLS_components['el-descriptions'] | typeof __VLS_components.elDescriptions | typeof __VLS_components.ElDescriptions | typeof __VLS_components['el-descriptions']} */
    elDescriptions;
    // @ts-ignore
    const __VLS_251 = __VLS_asFunctionalComponent1(__VLS_250, new __VLS_250({
        column: (2),
        border: true,
        size: "small",
    }));
    const __VLS_252 = __VLS_251({
        column: (2),
        border: true,
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_251));
    const { default: __VLS_255 } = __VLS_253.slots;
    let __VLS_256;
    /** @ts-ignore @type { | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item'] | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item']} */
    elDescriptionsItem;
    // @ts-ignore
    const __VLS_257 = __VLS_asFunctionalComponent1(__VLS_256, new __VLS_256({
        label: "商品",
    }));
    const __VLS_258 = __VLS_257({
        label: "商品",
    }, ...__VLS_functionalComponentArgsRest(__VLS_257));
    const { default: __VLS_261 } = __VLS_259.slots;
    (__VLS_ctx.detailRow.productTitle || '-');
    // @ts-ignore
    [searchForm, searchForm, total, fetchData, detailVisible, detailRow, detailRow,];
    var __VLS_259;
    let __VLS_262;
    /** @ts-ignore @type { | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item'] | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item']} */
    elDescriptionsItem;
    // @ts-ignore
    const __VLS_263 = __VLS_asFunctionalComponent1(__VLS_262, new __VLS_262({
        label: "客户",
    }));
    const __VLS_264 = __VLS_263({
        label: "客户",
    }, ...__VLS_functionalComponentArgsRest(__VLS_263));
    const { default: __VLS_267 } = __VLS_265.slots;
    (__VLS_ctx.detailRow.userName || '-');
    // @ts-ignore
    [detailRow,];
    var __VLS_265;
    let __VLS_268;
    /** @ts-ignore @type { | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item'] | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item']} */
    elDescriptionsItem;
    // @ts-ignore
    const __VLS_269 = __VLS_asFunctionalComponent1(__VLS_268, new __VLS_268({
        label: "商户",
    }));
    const __VLS_270 = __VLS_269({
        label: "商户",
    }, ...__VLS_functionalComponentArgsRest(__VLS_269));
    const { default: __VLS_273 } = __VLS_271.slots;
    (__VLS_ctx.detailRow.merchantName || '-');
    // @ts-ignore
    [detailRow,];
    var __VLS_271;
    let __VLS_274;
    /** @ts-ignore @type { | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item'] | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item']} */
    elDescriptionsItem;
    // @ts-ignore
    const __VLS_275 = __VLS_asFunctionalComponent1(__VLS_274, new __VLS_274({
        label: "状态",
    }));
    const __VLS_276 = __VLS_275({
        label: "状态",
    }, ...__VLS_functionalComponentArgsRest(__VLS_275));
    const { default: __VLS_279 } = __VLS_277.slots;
    let __VLS_280;
    /** @ts-ignore @type { | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag'] | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag']} */
    elTag;
    // @ts-ignore
    const __VLS_281 = __VLS_asFunctionalComponent1(__VLS_280, new __VLS_280({
        type: (__VLS_ctx.detailRow.status === 'VISIBLE' ? 'success' : 'info'),
        size: "small",
    }));
    const __VLS_282 = __VLS_281({
        type: (__VLS_ctx.detailRow.status === 'VISIBLE' ? 'success' : 'info'),
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_281));
    const { default: __VLS_285 } = __VLS_283.slots;
    (__VLS_ctx.detailRow.status);
    // @ts-ignore
    [detailRow, detailRow,];
    var __VLS_283;
    // @ts-ignore
    [];
    var __VLS_277;
    let __VLS_286;
    /** @ts-ignore @type { | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item'] | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item']} */
    elDescriptionsItem;
    // @ts-ignore
    const __VLS_287 = __VLS_asFunctionalComponent1(__VLS_286, new __VLS_286({
        label: "评分",
    }));
    const __VLS_288 = __VLS_287({
        label: "评分",
    }, ...__VLS_functionalComponentArgsRest(__VLS_287));
    const { default: __VLS_291 } = __VLS_289.slots;
    let __VLS_292;
    /** @ts-ignore @type { | typeof __VLS_components.elRate | typeof __VLS_components.ElRate | typeof __VLS_components['el-rate']} */
    elRate;
    // @ts-ignore
    const __VLS_293 = __VLS_asFunctionalComponent1(__VLS_292, new __VLS_292({
        modelValue: (__VLS_ctx.detailRow.rating),
        disabled: true,
        showScore: true,
        size: "small",
    }));
    const __VLS_294 = __VLS_293({
        modelValue: (__VLS_ctx.detailRow.rating),
        disabled: true,
        showScore: true,
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_293));
    // @ts-ignore
    [detailRow,];
    var __VLS_289;
    let __VLS_297;
    /** @ts-ignore @type { | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item'] | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item']} */
    elDescriptionsItem;
    // @ts-ignore
    const __VLS_298 = __VLS_asFunctionalComponent1(__VLS_297, new __VLS_297({
        label: "创建时间",
    }));
    const __VLS_299 = __VLS_298({
        label: "创建时间",
    }, ...__VLS_functionalComponentArgsRest(__VLS_298));
    const { default: __VLS_302 } = __VLS_300.slots;
    (__VLS_ctx.detailRow.createdAt);
    // @ts-ignore
    [detailRow,];
    var __VLS_300;
    let __VLS_303;
    /** @ts-ignore @type { | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item'] | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item']} */
    elDescriptionsItem;
    // @ts-ignore
    const __VLS_304 = __VLS_asFunctionalComponent1(__VLS_303, new __VLS_303({
        label: "内容",
        span: (2),
    }));
    const __VLS_305 = __VLS_304({
        label: "内容",
        span: (2),
    }, ...__VLS_functionalComponentArgsRest(__VLS_304));
    const { default: __VLS_308 } = __VLS_306.slots;
    (__VLS_ctx.detailRow.content);
    // @ts-ignore
    [detailRow,];
    var __VLS_306;
    if (__VLS_ctx.detailRow.replyContent) {
        let __VLS_309;
        /** @ts-ignore @type { | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item'] | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item']} */
        elDescriptionsItem;
        // @ts-ignore
        const __VLS_310 = __VLS_asFunctionalComponent1(__VLS_309, new __VLS_309({
            label: "回复",
            span: (2),
        }));
        const __VLS_311 = __VLS_310({
            label: "回复",
            span: (2),
        }, ...__VLS_functionalComponentArgsRest(__VLS_310));
        const { default: __VLS_314 } = __VLS_312.slots;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "reply-box" },
        });
        /** @type {__VLS_StyleScopedClasses['reply-box']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({});
        (__VLS_ctx.detailRow.replyContent);
        if (__VLS_ctx.detailRow.replyAt) {
            __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
                ...{ class: "reply-time" },
            });
            /** @type {__VLS_StyleScopedClasses['reply-time']} */ ;
            (__VLS_ctx.detailRow.replyAt);
        }
        // @ts-ignore
        [detailRow, detailRow, detailRow, detailRow,];
        var __VLS_312;
    }
    // @ts-ignore
    [];
    var __VLS_253;
    if (__VLS_ctx.detailRow.images?.length) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "review-images" },
        });
        /** @type {__VLS_StyleScopedClasses['review-images']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.h4, __VLS_intrinsics.h4)({});
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "image-list" },
        });
        /** @type {__VLS_StyleScopedClasses['image-list']} */ ;
        for (const [img, idx] of __VLS_vFor((__VLS_ctx.detailRow.images))) {
            let __VLS_315;
            /** @ts-ignore @type { | typeof __VLS_components.elImage | typeof __VLS_components.ElImage | typeof __VLS_components['el-image']} */
            elImage;
            // @ts-ignore
            const __VLS_316 = __VLS_asFunctionalComponent1(__VLS_315, new __VLS_315({
                key: (idx),
                src: (img),
                ...{ style: {} },
                fit: "cover",
                previewSrcList: (__VLS_ctx.detailRow.images),
                initialIndex: (idx),
            }));
            const __VLS_317 = __VLS_316({
                key: (idx),
                src: (img),
                ...{ style: {} },
                fit: "cover",
                previewSrcList: (__VLS_ctx.detailRow.images),
                initialIndex: (idx),
            }, ...__VLS_functionalComponentArgsRest(__VLS_316));
            // @ts-ignore
            [detailRow, detailRow, detailRow,];
        }
    }
}
// @ts-ignore
[];
var __VLS_247;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
