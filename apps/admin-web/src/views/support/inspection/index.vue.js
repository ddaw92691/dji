/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ref, reactive, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { inspectionApi } from '@/api/support';
defineOptions({ name: 'InspectionManagementView' });
const loading = ref(false);
const tableData = ref([]);
const total = ref(0);
const createVisible = ref(false);
const creating = ref(false);
const detailVisible = ref(false);
const scoreVisible = ref(false);
const scoring = ref(false);
const detailMessages = ref([]);
const detailMsgRef = ref();
const scoringId = ref(null);
const merchantOptions = ref([]);
const searchForm = reactive({
    page: 1,
    pageSize: 20,
});
const createForm = reactive({
    merchantId: null,
    fakeCustomerName: '',
    customerUserId: '',
    productId: '',
    title: '',
    question: '',
    priority: 'MEDIUM',
});
const scoreForm = reactive({
    qualityScore: 0,
    qualityRemark: '',
});
async function fetchData() {
    loading.value = true;
    try {
        const { data: res } = await inspectionApi.getList({
            page: searchForm.page,
            pageSize: searchForm.pageSize,
        });
        if (res.code === 200) {
            tableData.value = res.data.list || [];
            total.value = res.data.total || 0;
        }
    }
    catch {
        /* ignore */
    }
    finally {
        loading.value = false;
    }
}
function openCreate() {
    createForm.merchantId = null;
    createForm.fakeCustomerName = '';
    createForm.customerUserId = '';
    createForm.productId = '';
    createForm.title = '';
    createForm.question = '';
    createForm.priority = 'MEDIUM';
    createVisible.value = true;
    loadMerchants();
}
async function loadMerchants() {
    try {
        const { default: request } = await import('@/utils/request');
        const { data: res } = await request.get('/admin/merchants', {
            params: { page: 1, pageSize: 200 },
        });
        if (res.code === 200) {
            merchantOptions.value = (res.data.list || []).map((m) => ({
                id: m.id,
                name: m.nickname || m.shopName || `ID:${m.id}`,
            }));
        }
    }
    catch {
        /* ignore */
    }
}
function resetCreateForm() { }
async function handleCreate() {
    if (!createForm.merchantId ||
        !createForm.fakeCustomerName.trim() ||
        !createForm.title.trim() ||
        !createForm.question.trim()) {
        ElMessage.warning('请填写必填项');
        return;
    }
    creating.value = true;
    try {
        const { data: res } = await inspectionApi.create({
            merchantId: createForm.merchantId,
            fakeCustomerName: createForm.fakeCustomerName,
            inspectionCustomerUserId: createForm.customerUserId
                ? Number(createForm.customerUserId)
                : undefined,
            relatedProductId: createForm.productId ? Number(createForm.productId) : undefined,
            title: createForm.title,
            question: createForm.question,
            priority: createForm.priority,
        });
        if (res.code === 200) {
            ElMessage.success('质检已创建');
            createVisible.value = false;
            fetchData();
        }
        else {
            ElMessage.error(res.message || '创建失败');
        }
    }
    catch {
        ElMessage.error('创建失败');
    }
    finally {
        creating.value = false;
    }
}
async function openDetail(row) {
    detailVisible.value = true;
    try {
        const { data: res } = await inspectionApi.getMessages(row.sessionId);
        if (res.code === 200) {
            detailMessages.value = res.data || [];
        }
    }
    catch {
        /* ignore */
    }
}
function openScore(row) {
    scoringId.value = row.id;
    scoreForm.qualityScore = row.qualityScore || 0;
    scoreForm.qualityRemark = row.qualityRemark || '';
    scoreVisible.value = true;
}
function resetScoreForm() {
    scoringId.value = null;
}
async function handleScore() {
    if (!scoringId.value)
        return;
    scoring.value = true;
    try {
        const { data: res } = await inspectionApi.score(scoringId.value, {
            qualityScore: scoreForm.qualityScore,
            qualityRemark: scoreForm.qualityRemark,
        });
        if (res.code === 200) {
            ElMessage.success('评分已保存');
            scoreVisible.value = false;
            fetchData();
        }
        else {
            ElMessage.error(res.message || '评分失败');
        }
    }
    catch {
        ElMessage.error('评分失败');
    }
    finally {
        scoring.value = false;
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
/** @type {__VLS_StyleScopedClasses['page-header']} */ ;
/** @type {__VLS_StyleScopedClasses['msg-item']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "inspection-page" },
});
/** @type {__VLS_StyleScopedClasses['inspection-page']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "page-header" },
});
/** @type {__VLS_StyleScopedClasses['page-header']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.h3, __VLS_intrinsics.h3)({});
let __VLS_0;
/** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
elButton;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    ...{ 'onClick': {} },
    type: "primary",
}));
const __VLS_2 = __VLS_1({
    ...{ 'onClick': {} },
    type: "primary",
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
let __VLS_5;
const __VLS_6 = {
    ...{ click: {} },
    onClick: (__VLS_ctx.openCreate),
};
const { default: __VLS_7 } = __VLS_3.slots;
// @ts-ignore
[openCreate,];
var __VLS_3;
var __VLS_4;
let __VLS_8;
/** @ts-ignore @type { | typeof __VLS_components.elTable | typeof __VLS_components.ElTable | typeof __VLS_components['el-table'] | typeof __VLS_components.elTable | typeof __VLS_components.ElTable | typeof __VLS_components['el-table']} */
elTable;
// @ts-ignore
const __VLS_9 = __VLS_asFunctionalComponent1(__VLS_8, new __VLS_8({
    data: (__VLS_ctx.tableData),
    border: true,
    stripe: true,
}));
const __VLS_10 = __VLS_9({
    data: (__VLS_ctx.tableData),
    border: true,
    stripe: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_9));
__VLS_asFunctionalDirective(__VLS_directives.vLoading, {})(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.loading) }, null, null);
const { default: __VLS_13 } = __VLS_11.slots;
let __VLS_14;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_15 = __VLS_asFunctionalComponent1(__VLS_14, new __VLS_14({
    type: "index",
    label: "#",
    width: "50",
}));
const __VLS_16 = __VLS_15({
    type: "index",
    label: "#",
    width: "50",
}, ...__VLS_functionalComponentArgsRest(__VLS_15));
let __VLS_19;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_20 = __VLS_asFunctionalComponent1(__VLS_19, new __VLS_19({
    prop: "merchantName",
    label: "商户",
    width: "120",
    showOverflowTooltip: true,
}));
const __VLS_21 = __VLS_20({
    prop: "merchantName",
    label: "商户",
    width: "120",
    showOverflowTooltip: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_20));
let __VLS_24;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_25 = __VLS_asFunctionalComponent1(__VLS_24, new __VLS_24({
    prop: "fakeCustomerName",
    label: "虚拟客户",
    width: "120",
    showOverflowTooltip: true,
}));
const __VLS_26 = __VLS_25({
    prop: "fakeCustomerName",
    label: "虚拟客户",
    width: "120",
    showOverflowTooltip: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_25));
let __VLS_29;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_30 = __VLS_asFunctionalComponent1(__VLS_29, new __VLS_29({
    label: "问题",
    minWidth: "180",
    showOverflowTooltip: true,
}));
const __VLS_31 = __VLS_30({
    label: "问题",
    minWidth: "180",
    showOverflowTooltip: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_30));
const { default: __VLS_34 } = __VLS_32.slots;
{
    const { default: __VLS_35 } = __VLS_32.slots;
    const [{ row }] = __VLS_vSlot(__VLS_35);
    (row.question?.length > 50 ? row.question.slice(0, 50) + '...' : row.question);
    // @ts-ignore
    [tableData, vLoading, loading,];
}
// @ts-ignore
[];
var __VLS_32;
let __VLS_36;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_37 = __VLS_asFunctionalComponent1(__VLS_36, new __VLS_36({
    label: "状态",
    width: "90",
    align: "center",
}));
const __VLS_38 = __VLS_37({
    label: "状态",
    width: "90",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_37));
const { default: __VLS_41 } = __VLS_39.slots;
{
    const { default: __VLS_42 } = __VLS_39.slots;
    const [{ row }] = __VLS_vSlot(__VLS_42);
    let __VLS_43;
    /** @ts-ignore @type { | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag'] | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag']} */
    elTag;
    // @ts-ignore
    const __VLS_44 = __VLS_asFunctionalComponent1(__VLS_43, new __VLS_43({
        type: (row.status === 'OPEN' ? 'success' : 'info'),
        size: "small",
    }));
    const __VLS_45 = __VLS_44({
        type: (row.status === 'OPEN' ? 'success' : 'info'),
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_44));
    const { default: __VLS_48 } = __VLS_46.slots;
    (row.status);
    // @ts-ignore
    [];
    var __VLS_46;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_39;
let __VLS_49;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_50 = __VLS_asFunctionalComponent1(__VLS_49, new __VLS_49({
    label: "优先级",
    width: "80",
    align: "center",
}));
const __VLS_51 = __VLS_50({
    label: "优先级",
    width: "80",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_50));
const { default: __VLS_54 } = __VLS_52.slots;
{
    const { default: __VLS_55 } = __VLS_52.slots;
    const [{ row }] = __VLS_vSlot(__VLS_55);
    let __VLS_56;
    /** @ts-ignore @type { | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag'] | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag']} */
    elTag;
    // @ts-ignore
    const __VLS_57 = __VLS_asFunctionalComponent1(__VLS_56, new __VLS_56({
        type: (row.priority === 'HIGH' ? 'danger' : row.priority === 'MEDIUM' ? 'warning' : 'info'),
        size: "small",
    }));
    const __VLS_58 = __VLS_57({
        type: (row.priority === 'HIGH' ? 'danger' : row.priority === 'MEDIUM' ? 'warning' : 'info'),
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_57));
    const { default: __VLS_61 } = __VLS_59.slots;
    (row.priority);
    // @ts-ignore
    [];
    var __VLS_59;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_52;
let __VLS_62;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_63 = __VLS_asFunctionalComponent1(__VLS_62, new __VLS_62({
    label: "回复",
    width: "100",
    align: "center",
}));
const __VLS_64 = __VLS_63({
    label: "回复",
    width: "100",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_63));
const { default: __VLS_67 } = __VLS_65.slots;
{
    const { default: __VLS_68 } = __VLS_65.slots;
    const [{ row }] = __VLS_vSlot(__VLS_68);
    if (row.firstResponseSeconds) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
        (row.firstResponseSeconds);
    }
    else {
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    }
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_65;
let __VLS_69;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_70 = __VLS_asFunctionalComponent1(__VLS_69, new __VLS_69({
    label: "评分",
    width: "100",
    align: "center",
}));
const __VLS_71 = __VLS_70({
    label: "评分",
    width: "100",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_70));
const { default: __VLS_74 } = __VLS_72.slots;
{
    const { default: __VLS_75 } = __VLS_72.slots;
    const [{ row }] = __VLS_vSlot(__VLS_75);
    if (row.qualityScore) {
        let __VLS_76;
        /** @ts-ignore @type { | typeof __VLS_components.elRate | typeof __VLS_components.ElRate | typeof __VLS_components['el-rate']} */
        elRate;
        // @ts-ignore
        const __VLS_77 = __VLS_asFunctionalComponent1(__VLS_76, new __VLS_76({
            modelValue: (row.qualityScore),
            disabled: true,
            size: "small",
        }));
        const __VLS_78 = __VLS_77({
            modelValue: (row.qualityScore),
            disabled: true,
            size: "small",
        }, ...__VLS_functionalComponentArgsRest(__VLS_77));
    }
    else {
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    }
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_72;
let __VLS_81;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_82 = __VLS_asFunctionalComponent1(__VLS_81, new __VLS_81({
    prop: "createdAt",
    label: "创建时间",
    width: "160",
}));
const __VLS_83 = __VLS_82({
    prop: "createdAt",
    label: "创建时间",
    width: "160",
}, ...__VLS_functionalComponentArgsRest(__VLS_82));
let __VLS_86;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_87 = __VLS_asFunctionalComponent1(__VLS_86, new __VLS_86({
    label: "操作",
    width: "200",
    fixed: "right",
}));
const __VLS_88 = __VLS_87({
    label: "操作",
    width: "200",
    fixed: "right",
}, ...__VLS_functionalComponentArgsRest(__VLS_87));
const { default: __VLS_91 } = __VLS_89.slots;
{
    const { default: __VLS_92 } = __VLS_89.slots;
    const [{ row }] = __VLS_vSlot(__VLS_92);
    let __VLS_93;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_94 = __VLS_asFunctionalComponent1(__VLS_93, new __VLS_93({
        ...{ 'onClick': {} },
        link: true,
        type: "primary",
    }));
    const __VLS_95 = __VLS_94({
        ...{ 'onClick': {} },
        link: true,
        type: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_94));
    let __VLS_98;
    const __VLS_99 = {
        ...{ click: {} },
        onClick: (...[$event]) => {
            __VLS_ctx.openDetail(row);
            // @ts-ignore
            [openDetail,];
        },
    };
    const { default: __VLS_100 } = __VLS_96.slots;
    // @ts-ignore
    [];
    var __VLS_96;
    var __VLS_97;
    let __VLS_101;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_102 = __VLS_asFunctionalComponent1(__VLS_101, new __VLS_101({
        ...{ 'onClick': {} },
        link: true,
        type: "warning",
    }));
    const __VLS_103 = __VLS_102({
        ...{ 'onClick': {} },
        link: true,
        type: "warning",
    }, ...__VLS_functionalComponentArgsRest(__VLS_102));
    let __VLS_106;
    const __VLS_107 = {
        ...{ click: {} },
        onClick: (...[$event]) => {
            __VLS_ctx.openScore(row);
            // @ts-ignore
            [openScore,];
        },
    };
    const { default: __VLS_108 } = __VLS_104.slots;
    // @ts-ignore
    [];
    var __VLS_104;
    var __VLS_105;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_89;
// @ts-ignore
[];
var __VLS_11;
let __VLS_109;
/** @ts-ignore @type { | typeof __VLS_components.elPagination | typeof __VLS_components.ElPagination | typeof __VLS_components['el-pagination']} */
elPagination;
// @ts-ignore
const __VLS_110 = __VLS_asFunctionalComponent1(__VLS_109, new __VLS_109({
    ...{ 'onChange': {} },
    currentPage: (__VLS_ctx.searchForm.page),
    pageSize: (__VLS_ctx.searchForm.pageSize),
    total: (__VLS_ctx.total),
    pageSizes: ([10, 20, 50]),
    layout: "total, sizes, prev, pager, next",
}));
const __VLS_111 = __VLS_110({
    ...{ 'onChange': {} },
    currentPage: (__VLS_ctx.searchForm.page),
    pageSize: (__VLS_ctx.searchForm.pageSize),
    total: (__VLS_ctx.total),
    pageSizes: ([10, 20, 50]),
    layout: "total, sizes, prev, pager, next",
}, ...__VLS_functionalComponentArgsRest(__VLS_110));
let __VLS_114;
const __VLS_115 = {
    ...{ change: {} },
    onChange: (__VLS_ctx.fetchData),
};
var __VLS_112;
var __VLS_113;
let __VLS_116;
/** @ts-ignore @type { | typeof __VLS_components.elDialog | typeof __VLS_components.ElDialog | typeof __VLS_components['el-dialog'] | typeof __VLS_components.elDialog | typeof __VLS_components.ElDialog | typeof __VLS_components['el-dialog']} */
elDialog;
// @ts-ignore
const __VLS_117 = __VLS_asFunctionalComponent1(__VLS_116, new __VLS_116({
    ...{ 'onClosed': {} },
    modelValue: (__VLS_ctx.createVisible),
    title: "新建质检",
    width: "550px",
}));
const __VLS_118 = __VLS_117({
    ...{ 'onClosed': {} },
    modelValue: (__VLS_ctx.createVisible),
    title: "新建质检",
    width: "550px",
}, ...__VLS_functionalComponentArgsRest(__VLS_117));
let __VLS_121;
const __VLS_122 = {
    ...{ closed: {} },
    onClosed: (__VLS_ctx.resetCreateForm),
};
const { default: __VLS_123 } = __VLS_119.slots;
let __VLS_124;
/** @ts-ignore @type { | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form'] | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form']} */
elForm;
// @ts-ignore
const __VLS_125 = __VLS_asFunctionalComponent1(__VLS_124, new __VLS_124({
    model: (__VLS_ctx.createForm),
    labelWidth: "140px",
}));
const __VLS_126 = __VLS_125({
    model: (__VLS_ctx.createForm),
    labelWidth: "140px",
}, ...__VLS_functionalComponentArgsRest(__VLS_125));
const { default: __VLS_129 } = __VLS_127.slots;
let __VLS_130;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_131 = __VLS_asFunctionalComponent1(__VLS_130, new __VLS_130({
    label: "商户",
    required: true,
}));
const __VLS_132 = __VLS_131({
    label: "商户",
    required: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_131));
const { default: __VLS_135 } = __VLS_133.slots;
let __VLS_136;
/** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
elSelect;
// @ts-ignore
const __VLS_137 = __VLS_asFunctionalComponent1(__VLS_136, new __VLS_136({
    modelValue: (__VLS_ctx.createForm.merchantId),
    filterable: true,
    placeholder: "请选择商户",
    ...{ style: {} },
}));
const __VLS_138 = __VLS_137({
    modelValue: (__VLS_ctx.createForm.merchantId),
    filterable: true,
    placeholder: "请选择商户",
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_137));
const { default: __VLS_141 } = __VLS_139.slots;
for (const [m] of __VLS_vFor((__VLS_ctx.merchantOptions))) {
    let __VLS_142;
    /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
    elOption;
    // @ts-ignore
    const __VLS_143 = __VLS_asFunctionalComponent1(__VLS_142, new __VLS_142({
        key: (m.id),
        label: (m.name),
        value: (m.id),
    }));
    const __VLS_144 = __VLS_143({
        key: (m.id),
        label: (m.name),
        value: (m.id),
    }, ...__VLS_functionalComponentArgsRest(__VLS_143));
    // @ts-ignore
    [searchForm, searchForm, total, fetchData, createVisible, resetCreateForm, createForm, createForm, merchantOptions,];
}
// @ts-ignore
[];
var __VLS_139;
// @ts-ignore
[];
var __VLS_133;
let __VLS_147;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_148 = __VLS_asFunctionalComponent1(__VLS_147, new __VLS_147({
    label: "虚拟客户名称",
    required: true,
}));
const __VLS_149 = __VLS_148({
    label: "虚拟客户名称",
    required: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_148));
const { default: __VLS_152 } = __VLS_150.slots;
let __VLS_153;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_154 = __VLS_asFunctionalComponent1(__VLS_153, new __VLS_153({
    modelValue: (__VLS_ctx.createForm.fakeCustomerName),
    placeholder: "例如：神秘顾客",
}));
const __VLS_155 = __VLS_154({
    modelValue: (__VLS_ctx.createForm.fakeCustomerName),
    placeholder: "例如：神秘顾客",
}, ...__VLS_functionalComponentArgsRest(__VLS_154));
// @ts-ignore
[createForm,];
var __VLS_150;
let __VLS_158;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_159 = __VLS_asFunctionalComponent1(__VLS_158, new __VLS_158({
    label: "客户用户ID",
}));
const __VLS_160 = __VLS_159({
    label: "客户用户ID",
}, ...__VLS_functionalComponentArgsRest(__VLS_159));
const { default: __VLS_163 } = __VLS_161.slots;
let __VLS_164;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_165 = __VLS_asFunctionalComponent1(__VLS_164, new __VLS_164({
    modelValue: (__VLS_ctx.createForm.customerUserId),
    placeholder: "选填",
}));
const __VLS_166 = __VLS_165({
    modelValue: (__VLS_ctx.createForm.customerUserId),
    placeholder: "选填",
}, ...__VLS_functionalComponentArgsRest(__VLS_165));
// @ts-ignore
[createForm,];
var __VLS_161;
let __VLS_169;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_170 = __VLS_asFunctionalComponent1(__VLS_169, new __VLS_169({
    label: "商品ID",
}));
const __VLS_171 = __VLS_170({
    label: "商品ID",
}, ...__VLS_functionalComponentArgsRest(__VLS_170));
const { default: __VLS_174 } = __VLS_172.slots;
let __VLS_175;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_176 = __VLS_asFunctionalComponent1(__VLS_175, new __VLS_175({
    modelValue: (__VLS_ctx.createForm.productId),
    placeholder: "选填",
}));
const __VLS_177 = __VLS_176({
    modelValue: (__VLS_ctx.createForm.productId),
    placeholder: "选填",
}, ...__VLS_functionalComponentArgsRest(__VLS_176));
// @ts-ignore
[createForm,];
var __VLS_172;
let __VLS_180;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_181 = __VLS_asFunctionalComponent1(__VLS_180, new __VLS_180({
    label: "标题",
    required: true,
}));
const __VLS_182 = __VLS_181({
    label: "标题",
    required: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_181));
const { default: __VLS_185 } = __VLS_183.slots;
let __VLS_186;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_187 = __VLS_asFunctionalComponent1(__VLS_186, new __VLS_186({
    modelValue: (__VLS_ctx.createForm.title),
    placeholder: "质检标题",
}));
const __VLS_188 = __VLS_187({
    modelValue: (__VLS_ctx.createForm.title),
    placeholder: "质检标题",
}, ...__VLS_functionalComponentArgsRest(__VLS_187));
// @ts-ignore
[createForm,];
var __VLS_183;
let __VLS_191;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_192 = __VLS_asFunctionalComponent1(__VLS_191, new __VLS_191({
    label: "问题",
    required: true,
}));
const __VLS_193 = __VLS_192({
    label: "问题",
    required: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_192));
const { default: __VLS_196 } = __VLS_194.slots;
let __VLS_197;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_198 = __VLS_asFunctionalComponent1(__VLS_197, new __VLS_197({
    modelValue: (__VLS_ctx.createForm.question),
    type: "textarea",
    rows: (4),
    placeholder: "向商户提出的问题…",
}));
const __VLS_199 = __VLS_198({
    modelValue: (__VLS_ctx.createForm.question),
    type: "textarea",
    rows: (4),
    placeholder: "向商户提出的问题…",
}, ...__VLS_functionalComponentArgsRest(__VLS_198));
// @ts-ignore
[createForm,];
var __VLS_194;
let __VLS_202;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_203 = __VLS_asFunctionalComponent1(__VLS_202, new __VLS_202({
    label: "优先级",
}));
const __VLS_204 = __VLS_203({
    label: "优先级",
}, ...__VLS_functionalComponentArgsRest(__VLS_203));
const { default: __VLS_207 } = __VLS_205.slots;
let __VLS_208;
/** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
elSelect;
// @ts-ignore
const __VLS_209 = __VLS_asFunctionalComponent1(__VLS_208, new __VLS_208({
    modelValue: (__VLS_ctx.createForm.priority),
    ...{ style: {} },
}));
const __VLS_210 = __VLS_209({
    modelValue: (__VLS_ctx.createForm.priority),
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_209));
const { default: __VLS_213 } = __VLS_211.slots;
let __VLS_214;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_215 = __VLS_asFunctionalComponent1(__VLS_214, new __VLS_214({
    label: "低",
    value: "LOW",
}));
const __VLS_216 = __VLS_215({
    label: "低",
    value: "LOW",
}, ...__VLS_functionalComponentArgsRest(__VLS_215));
let __VLS_219;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_220 = __VLS_asFunctionalComponent1(__VLS_219, new __VLS_219({
    label: "中",
    value: "MEDIUM",
}));
const __VLS_221 = __VLS_220({
    label: "中",
    value: "MEDIUM",
}, ...__VLS_functionalComponentArgsRest(__VLS_220));
let __VLS_224;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_225 = __VLS_asFunctionalComponent1(__VLS_224, new __VLS_224({
    label: "高",
    value: "HIGH",
}));
const __VLS_226 = __VLS_225({
    label: "高",
    value: "HIGH",
}, ...__VLS_functionalComponentArgsRest(__VLS_225));
// @ts-ignore
[createForm,];
var __VLS_211;
// @ts-ignore
[];
var __VLS_205;
// @ts-ignore
[];
var __VLS_127;
{
    const { footer: __VLS_229 } = __VLS_119.slots;
    let __VLS_230;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_231 = __VLS_asFunctionalComponent1(__VLS_230, new __VLS_230({
        ...{ 'onClick': {} },
    }));
    const __VLS_232 = __VLS_231({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_231));
    let __VLS_235;
    const __VLS_236 = {
        ...{ click: {} },
        onClick: (...[$event]) => {
            __VLS_ctx.createVisible = false;
            // @ts-ignore
            [createVisible,];
        },
    };
    const { default: __VLS_237 } = __VLS_233.slots;
    // @ts-ignore
    [];
    var __VLS_233;
    var __VLS_234;
    let __VLS_238;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_239 = __VLS_asFunctionalComponent1(__VLS_238, new __VLS_238({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.creating),
    }));
    const __VLS_240 = __VLS_239({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.creating),
    }, ...__VLS_functionalComponentArgsRest(__VLS_239));
    let __VLS_243;
    const __VLS_244 = {
        ...{ click: {} },
        onClick: (__VLS_ctx.handleCreate),
    };
    const { default: __VLS_245 } = __VLS_241.slots;
    // @ts-ignore
    [creating, handleCreate,];
    var __VLS_241;
    var __VLS_242;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_119;
var __VLS_120;
let __VLS_246;
/** @ts-ignore @type { | typeof __VLS_components.elDialog | typeof __VLS_components.ElDialog | typeof __VLS_components['el-dialog'] | typeof __VLS_components.elDialog | typeof __VLS_components.ElDialog | typeof __VLS_components['el-dialog']} */
elDialog;
// @ts-ignore
const __VLS_247 = __VLS_asFunctionalComponent1(__VLS_246, new __VLS_246({
    modelValue: (__VLS_ctx.detailVisible),
    title: "质检消息",
    width: "700px",
}));
const __VLS_248 = __VLS_247({
    modelValue: (__VLS_ctx.detailVisible),
    title: "质检消息",
    width: "700px",
}, ...__VLS_functionalComponentArgsRest(__VLS_247));
const { default: __VLS_251 } = __VLS_249.slots;
if (__VLS_ctx.detailMessages.length) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "msg-list" },
        ref: "detailMsgRef",
    });
    /** @type {__VLS_StyleScopedClasses['msg-list']} */ ;
    for (const [msg] of __VLS_vFor((__VLS_ctx.detailMessages))) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            key: (msg.id),
            ...{ class: "msg-item" },
        });
        /** @type {__VLS_StyleScopedClasses['msg-item']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "msg-side" },
            ...{ class: (msg.senderSide === 'CUSTOMER' ? 'side-customer' : 'side-merchant') },
        });
        /** @type {__VLS_StyleScopedClasses['msg-side']} */ ;
        (msg.senderSide);
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "msg-name" },
        });
        /** @type {__VLS_StyleScopedClasses['msg-name']} */ ;
        (msg.senderDisplayName);
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "msg-content" },
        });
        /** @type {__VLS_StyleScopedClasses['msg-content']} */ ;
        (msg.content);
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "msg-time" },
        });
        /** @type {__VLS_StyleScopedClasses['msg-time']} */ ;
        (msg.createdAt ? new Date(msg.createdAt).toLocaleString() : '');
        // @ts-ignore
        [detailVisible, detailMessages, detailMessages,];
    }
}
else {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "msg-empty" },
    });
    /** @type {__VLS_StyleScopedClasses['msg-empty']} */ ;
}
// @ts-ignore
[];
var __VLS_249;
let __VLS_252;
/** @ts-ignore @type { | typeof __VLS_components.elDialog | typeof __VLS_components.ElDialog | typeof __VLS_components['el-dialog'] | typeof __VLS_components.elDialog | typeof __VLS_components.ElDialog | typeof __VLS_components['el-dialog']} */
elDialog;
// @ts-ignore
const __VLS_253 = __VLS_asFunctionalComponent1(__VLS_252, new __VLS_252({
    ...{ 'onClosed': {} },
    modelValue: (__VLS_ctx.scoreVisible),
    title: "质量评分",
    width: "450px",
}));
const __VLS_254 = __VLS_253({
    ...{ 'onClosed': {} },
    modelValue: (__VLS_ctx.scoreVisible),
    title: "质量评分",
    width: "450px",
}, ...__VLS_functionalComponentArgsRest(__VLS_253));
let __VLS_257;
const __VLS_258 = {
    ...{ closed: {} },
    onClosed: (__VLS_ctx.resetScoreForm),
};
const { default: __VLS_259 } = __VLS_255.slots;
let __VLS_260;
/** @ts-ignore @type { | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form'] | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form']} */
elForm;
// @ts-ignore
const __VLS_261 = __VLS_asFunctionalComponent1(__VLS_260, new __VLS_260({
    model: (__VLS_ctx.scoreForm),
    labelWidth: "120px",
}));
const __VLS_262 = __VLS_261({
    model: (__VLS_ctx.scoreForm),
    labelWidth: "120px",
}, ...__VLS_functionalComponentArgsRest(__VLS_261));
const { default: __VLS_265 } = __VLS_263.slots;
let __VLS_266;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_267 = __VLS_asFunctionalComponent1(__VLS_266, new __VLS_266({
    label: "评分",
}));
const __VLS_268 = __VLS_267({
    label: "评分",
}, ...__VLS_functionalComponentArgsRest(__VLS_267));
const { default: __VLS_271 } = __VLS_269.slots;
let __VLS_272;
/** @ts-ignore @type { | typeof __VLS_components.elRate | typeof __VLS_components.ElRate | typeof __VLS_components['el-rate']} */
elRate;
// @ts-ignore
const __VLS_273 = __VLS_asFunctionalComponent1(__VLS_272, new __VLS_272({
    modelValue: (__VLS_ctx.scoreForm.qualityScore),
    max: (5),
    showScore: true,
}));
const __VLS_274 = __VLS_273({
    modelValue: (__VLS_ctx.scoreForm.qualityScore),
    max: (5),
    showScore: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_273));
// @ts-ignore
[scoreVisible, resetScoreForm, scoreForm, scoreForm,];
var __VLS_269;
let __VLS_277;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_278 = __VLS_asFunctionalComponent1(__VLS_277, new __VLS_277({
    label: "备注",
}));
const __VLS_279 = __VLS_278({
    label: "备注",
}, ...__VLS_functionalComponentArgsRest(__VLS_278));
const { default: __VLS_282 } = __VLS_280.slots;
let __VLS_283;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_284 = __VLS_asFunctionalComponent1(__VLS_283, new __VLS_283({
    modelValue: (__VLS_ctx.scoreForm.qualityRemark),
    type: "textarea",
    rows: (3),
    placeholder: "备注（选填）",
}));
const __VLS_285 = __VLS_284({
    modelValue: (__VLS_ctx.scoreForm.qualityRemark),
    type: "textarea",
    rows: (3),
    placeholder: "备注（选填）",
}, ...__VLS_functionalComponentArgsRest(__VLS_284));
// @ts-ignore
[scoreForm,];
var __VLS_280;
// @ts-ignore
[];
var __VLS_263;
{
    const { footer: __VLS_288 } = __VLS_255.slots;
    let __VLS_289;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_290 = __VLS_asFunctionalComponent1(__VLS_289, new __VLS_289({
        ...{ 'onClick': {} },
    }));
    const __VLS_291 = __VLS_290({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_290));
    let __VLS_294;
    const __VLS_295 = {
        ...{ click: {} },
        onClick: (...[$event]) => {
            __VLS_ctx.scoreVisible = false;
            // @ts-ignore
            [scoreVisible,];
        },
    };
    const { default: __VLS_296 } = __VLS_292.slots;
    // @ts-ignore
    [];
    var __VLS_292;
    var __VLS_293;
    let __VLS_297;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_298 = __VLS_asFunctionalComponent1(__VLS_297, new __VLS_297({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.scoring),
    }));
    const __VLS_299 = __VLS_298({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.scoring),
    }, ...__VLS_functionalComponentArgsRest(__VLS_298));
    let __VLS_302;
    const __VLS_303 = {
        ...{ click: {} },
        onClick: (__VLS_ctx.handleScore),
    };
    const { default: __VLS_304 } = __VLS_300.slots;
    // @ts-ignore
    [scoring, handleScore,];
    var __VLS_300;
    var __VLS_301;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_255;
var __VLS_256;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
