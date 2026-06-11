/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ElMessage } from 'element-plus';
defineOptions({ name: 'BasePageView' });
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const sourceData = Array.from({ length: 24 }, (_, index) => ({
    id: index + 1,
    username: `user_${String(index + 1).padStart(2, '0')}`,
    nickname: `演示用户${index + 1}`,
    status: index % 3 === 0 ? 'inactive' : 'active',
    age: 20 + (index % 10),
    createTime: `2026-04-${String((index % 28) + 1).padStart(2, '0')} 10:${String(index % 60).padStart(2, '0')}:00`,
}));
const searchFormConfig = ref([
    { label: '用户名', prop: 'username', type: 'elInput', attrs: { placeholder: '请输入用户名' } },
    { label: '昵称', prop: 'nickname', type: 'elInput', attrs: { placeholder: '请输入昵称' } },
    {
        label: '状态',
        prop: 'status',
        type: 'elSelect',
        attrs: {
            placeholder: '请选择状态',
            clearable: true,
            options: [
                { label: '启用', value: 'active' },
                { label: '禁用', value: 'inactive' },
            ],
        },
    },
]);
const columns = ref([
    { type: 'selection', width: 55 },
    { type: 'index', label: '序号', width: 60 },
    { prop: 'username', label: '用户名', minWidth: 160 },
    { prop: 'nickname', label: '昵称', minWidth: 140 },
    { prop: 'age', label: '年龄', width: 100 },
    { prop: 'status', label: '状态', width: 100 },
    { prop: 'createTime', label: '创建时间', minWidth: 180, sortable: 'custom' },
    { prop: 'operation', label: '操作', width: 140, fixed: 'right' },
]);
const tableData = ref([]);
const total = ref(0);
const loading = ref(false);
const selectedIds = ref([]);
const getList = async (queryForm, page, pageSize, sortField, sortOrder) => {
    loading.value = true;
    try {
        await delay(500);
        let list = [...sourceData];
        if (queryForm.username)
            list = list.filter((item) => item.username.includes(String(queryForm.username)));
        if (queryForm.nickname)
            list = list.filter((item) => item.nickname.includes(String(queryForm.nickname)));
        if (queryForm.status)
            list = list.filter((item) => item.status === queryForm.status);
        if (sortField === 'createTime' && sortOrder) {
            list.sort((a, b) => {
                const timeA = new Date(a.createTime).getTime();
                const timeB = new Date(b.createTime).getTime();
                return sortOrder === 'asc' ? timeA - timeB : timeB - timeA;
            });
        }
        total.value = list.length;
        tableData.value = list.slice((page - 1) * pageSize, page * pageSize);
    }
    finally {
        loading.value = false;
    }
};
const handleSelectionChange = (rows) => {
    selectedIds.value = rows.map((item) => Number(item.id));
};
const handleCreate = () => ElMessage.success('这里可以打开新增弹窗');
const handleEdit = (row) => ElMessage.success(`模拟编辑：${row.username}`);
const handleDelete = (row) => ElMessage.success(`模拟删除：${row.username}`);
const handleBatchDelete = () => ElMessage.success(`当前选中了 ${selectedIds.value.length} 条数据`);
const eventsTableData = [
    {
        name: 'refresh',
        params: 'queryForm(当前的form表单数据), page(当前页码), pageSize(每页条数), sortField(排序字段), sortOrder(排序方向)',
        description: '组件挂载、点击查询/重置/刷新、分页变化、表格排序变化时触发，通常用于统一请求列表数据',
    },
    {
        name: 'selection-change',
        params: 'selection(当前选中的行数据数组)',
        description: '表格勾选项变化时触发，返回当前选中的行数据数组',
    },
];
const slotsTableData = [
    {
        name: 'tableOperationLeft',
        params: '-',
        description: '表格顶部工具栏左侧区域，通常放新增、批量删除等操作按钮',
    },
    {
        name: 'tableOperationRight',
        params: '-',
        description: '表格顶部工具栏右侧自定义区域，位于内置工具按钮左侧',
    },
    {
        name: '[列 prop 名]',
        params: 'scope',
        description: "表格列插槽，插槽名与列配置中的 prop 对应，例如列配置为 { prop: 'status', label: '状态' } 时，可使用 <template #status=\"{ row }\">...</template> 自定义该列内容",
    },
];
const methodsTableData = [
    {
        name: 'refreshCurrentPage',
        params: '-',
        description: '保持当前查询条件、页码和排序状态刷新，适合编辑成功后使用',
    },
    {
        name: 'refreshAfterDelete',
        params: 'deleteCount = 1',
        description: '删除后智能刷新；如果当前页删空且不是第一页，会自动回退到上一页',
    },
    {
        name: 'refreshToFirstPage',
        params: '-',
        description: '回到第一页并刷新，适合新增成功后使用',
    },
    {
        name: 'resetAndRefresh',
        params: '-',
        description: '重置查询条件，回到第一页并刷新',
    },
];
const formConfigTableData = [
    {
        name: 'label',
        type: 'string',
        default: '-',
        description: '表单项 label 文本',
    },
    {
        name: 'type',
        type: "'elInput' | 'elInputNumber' | 'elSelect' | 'elDatePicker'",
        default: '-',
        description: '当前查询项要渲染的组件类型',
    },
    {
        name: 'prop',
        type: 'string',
        default: '-',
        description: '字段名，对应 queryForm 中的 key',
    },
    {
        name: 'defaultValue',
        type: 'unknown',
        default: '-',
        description: '字段默认值，不传则初始化为 undefined',
    },
    {
        name: 'attrs',
        type: 'Record<string, unknown>',
        default: '{}',
        description: '透传给当前表单组件的属性，支持透传 elInput | elInputNumber | elSelect | elDatePicker 的组件属性，例如 placeholder、clearable、options 等',
    },
];
const columnsTableData = [
    {
        name: 'visible',
        type: 'boolean',
        default: 'true',
        description: '当前列是否显示，BasePage 内部会为每列补充该字段用于列显隐控制',
    },
    {
        name: 'prop',
        type: 'string',
        default: '-',
        description: '列字段名；如果需要自定义单元格插槽，插槽名通常与该字段一致',
    },
    {
        name: 'type',
        type: 'string',
        default: '-',
        description: '列类型，如 selection（选择列）、index（序号列）、expand（展开列）等',
    },
    {
        name: 'fixed',
        type: "'left' | 'right' | boolean",
        default: 'false',
        description: '列是否固定在左侧或右侧',
    },
    {
        name: 'label',
        type: 'string',
        default: '-',
        description: '列表头显示文本',
    },
    {
        name: 'width',
        type: 'number',
        default: '-',
        description: '列宽度',
    },
    {
        name: '[key: string]',
        type: 'unknown',
        default: '-',
        description: '支持继续传入其他 el-table-column 属性，如 minWidth、sortable、align 等',
    },
];
const propsTableData = [
    {
        name: 'formConfig',
        type: 'IFormConfig[]',
        default: '-',
        description: '查询表单配置，不传则不展示搜索表单',
    },
    {
        name: 'tableData',
        type: 'Record<string, unknown>[]',
        default: '-',
        description: '表格数据源（必传）',
    },
    {
        name: 'columns',
        type: 'Record<string, unknown>[]',
        default: '-',
        description: '表格列配置（必传）',
    },
    { name: 'tableLoading', type: 'boolean', default: 'false', description: '表格加载状态' },
    { name: 'loadingDelay', type: 'number', default: '300', description: 'loading 延迟显示时间' },
    { name: 'total', type: 'number', default: '0', description: '分页总条数' },
    {
        name: 'pageSizes',
        type: 'number[]',
        default: '[10, 20, 30, 40, 50]',
        description: '分页器每页条数选项',
    },
    {
        name: 'tableAttrs',
        type: 'Record<string, unknown>',
        default: '{}',
        description: '透传 el-table 属性',
    },
    {
        name: 'paginationAttrs',
        type: 'Record<string, unknown>',
        default: '{}',
        description: '透传 el-pagination 属性',
    },
    {
        name: 'formCollapsible',
        type: 'boolean',
        default: 'true',
        description: '搜索表单是否支持展开/收起',
    },
    {
        name: 'formInitialVisibleCount',
        type: 'number',
        default: '3',
        description: '搜索表单收起时显示的查询项数量',
    },
    {
        name: 'showSearchToggle',
        type: 'boolean',
        default: 'true',
        description: '是否显示搜索显隐按钮',
    },
    { name: 'showRefresh', type: 'boolean', default: 'true', description: '是否显示刷新按钮' },
    { name: 'showExport', type: 'boolean', default: 'true', description: '是否显示导出按钮' },
    { name: 'showPrint', type: 'boolean', default: 'true', description: '是否显示打印按钮' },
    { name: 'showSize', type: 'boolean', default: 'true', description: '是否显示密度切换按钮' },
    { name: 'showColumn', type: 'boolean', default: 'true', description: '是否显示列设置按钮' },
    { name: 'showPagination', type: 'boolean', default: 'true', description: '是否显示分页器' },
];
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "base-page-doc-container" },
});
/** @type {__VLS_StyleScopedClasses['base-page-doc-container']} */ ;
let __VLS_0;
/** @ts-ignore @type { | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card'] | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card']} */
elCard;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    shadow: "never",
}));
const __VLS_2 = __VLS_1({
    shadow: "never",
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
const { default: __VLS_5 } = __VLS_3.slots;
{
    const { header: __VLS_6 } = __VLS_3.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "card-header" },
    });
    /** @type {__VLS_StyleScopedClasses['card-header']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "card-title" },
    });
    /** @type {__VLS_StyleScopedClasses['card-title']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "card-description" },
    });
    /** @type {__VLS_StyleScopedClasses['card-description']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.code, __VLS_intrinsics.code)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        ...{ class: "description-text" },
    });
    /** @type {__VLS_StyleScopedClasses['description-text']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.code, __VLS_intrinsics.code)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.code, __VLS_intrinsics.code)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.code, __VLS_intrinsics.code)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.code, __VLS_intrinsics.code)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.code, __VLS_intrinsics.code)({});
}
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "form-container" },
});
/** @type {__VLS_StyleScopedClasses['form-container']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "section-title" },
});
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
    ...{ class: "preview-description" },
});
/** @type {__VLS_StyleScopedClasses['preview-description']} */ ;
let __VLS_7;
/** @ts-ignore @type { | typeof __VLS_components.BasePage | typeof __VLS_components.BasePage} */
BasePage;
// @ts-ignore
const __VLS_8 = __VLS_asFunctionalComponent1(__VLS_7, new __VLS_7({
    ...{ 'onRefresh': {} },
    ...{ 'onSelectionChange': {} },
    ref: "basePageRef",
    formConfig: (__VLS_ctx.searchFormConfig),
    formInitialVisibleCount: (2),
    tableData: (__VLS_ctx.tableData),
    columns: (__VLS_ctx.columns),
    total: (__VLS_ctx.total),
    tableLoading: (__VLS_ctx.loading),
}));
const __VLS_9 = __VLS_8({
    ...{ 'onRefresh': {} },
    ...{ 'onSelectionChange': {} },
    ref: "basePageRef",
    formConfig: (__VLS_ctx.searchFormConfig),
    formInitialVisibleCount: (2),
    tableData: (__VLS_ctx.tableData),
    columns: (__VLS_ctx.columns),
    total: (__VLS_ctx.total),
    tableLoading: (__VLS_ctx.loading),
}, ...__VLS_functionalComponentArgsRest(__VLS_8));
let __VLS_12;
const __VLS_13 = {
    ...{ refresh: {} },
    onRefresh: (__VLS_ctx.getList),
    ...{ selectionChange: {} },
    onSelectionChange: (__VLS_ctx.handleSelectionChange),
};
var __VLS_14;
const { default: __VLS_16 } = __VLS_10.slots;
{
    const { tableOperationLeft: __VLS_17 } = __VLS_10.slots;
    let __VLS_18;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_19 = __VLS_asFunctionalComponent1(__VLS_18, new __VLS_18({
        ...{ 'onClick': {} },
        type: "primary",
    }));
    const __VLS_20 = __VLS_19({
        ...{ 'onClick': {} },
        type: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_19));
    let __VLS_23;
    const __VLS_24 = {
        ...{ click: {} },
        onClick: (__VLS_ctx.handleCreate),
    };
    const { default: __VLS_25 } = __VLS_21.slots;
    // @ts-ignore
    [searchFormConfig, tableData, columns, total, loading, getList, handleSelectionChange, handleCreate,];
    var __VLS_21;
    var __VLS_22;
    let __VLS_26;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_27 = __VLS_asFunctionalComponent1(__VLS_26, new __VLS_26({
        ...{ 'onClick': {} },
        type: "danger",
        disabled: (!__VLS_ctx.selectedIds.length),
    }));
    const __VLS_28 = __VLS_27({
        ...{ 'onClick': {} },
        type: "danger",
        disabled: (!__VLS_ctx.selectedIds.length),
    }, ...__VLS_functionalComponentArgsRest(__VLS_27));
    let __VLS_31;
    const __VLS_32 = {
        ...{ click: {} },
        onClick: (__VLS_ctx.handleBatchDelete),
    };
    const { default: __VLS_33 } = __VLS_29.slots;
    // @ts-ignore
    [selectedIds, handleBatchDelete,];
    var __VLS_29;
    var __VLS_30;
    // @ts-ignore
    [];
}
{
    const { tableOperationRight: __VLS_34 } = __VLS_10.slots;
    let __VLS_35;
    /** @ts-ignore @type { | typeof __VLS_components.BaseTag} */
    BaseTag;
    // @ts-ignore
    const __VLS_36 = __VLS_asFunctionalComponent1(__VLS_35, new __VLS_35({
        type: "info",
        text: (`已选 ${__VLS_ctx.selectedIds.length} 项`),
    }));
    const __VLS_37 = __VLS_36({
        type: "info",
        text: (`已选 ${__VLS_ctx.selectedIds.length} 项`),
    }, ...__VLS_functionalComponentArgsRest(__VLS_36));
    // @ts-ignore
    [selectedIds,];
}
{
    const { status: __VLS_40 } = __VLS_10.slots;
    const [{ row }] = __VLS_vSlot(__VLS_40);
    let __VLS_41;
    /** @ts-ignore @type { | typeof __VLS_components.BaseTag} */
    BaseTag;
    // @ts-ignore
    const __VLS_42 = __VLS_asFunctionalComponent1(__VLS_41, new __VLS_41({
        type: (row.status === 'active' ? 'success' : 'danger'),
        text: (row.status === 'active' ? '启用' : '禁用'),
    }));
    const __VLS_43 = __VLS_42({
        type: (row.status === 'active' ? 'success' : 'danger'),
        text: (row.status === 'active' ? '启用' : '禁用'),
    }, ...__VLS_functionalComponentArgsRest(__VLS_42));
    // @ts-ignore
    [];
}
{
    const { operation: __VLS_46 } = __VLS_10.slots;
    const [{ row }] = __VLS_vSlot(__VLS_46);
    let __VLS_47;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_48 = __VLS_asFunctionalComponent1(__VLS_47, new __VLS_47({
        ...{ 'onClick': {} },
        link: true,
        type: "primary",
    }));
    const __VLS_49 = __VLS_48({
        ...{ 'onClick': {} },
        link: true,
        type: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_48));
    let __VLS_52;
    const __VLS_53 = {
        ...{ click: {} },
        onClick: (...[$event]) => {
            __VLS_ctx.handleEdit(row);
            // @ts-ignore
            [handleEdit,];
        },
    };
    const { default: __VLS_54 } = __VLS_50.slots;
    // @ts-ignore
    [];
    var __VLS_50;
    var __VLS_51;
    let __VLS_55;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_56 = __VLS_asFunctionalComponent1(__VLS_55, new __VLS_55({
        ...{ 'onClick': {} },
        link: true,
        type: "danger",
    }));
    const __VLS_57 = __VLS_56({
        ...{ 'onClick': {} },
        link: true,
        type: "danger",
    }, ...__VLS_functionalComponentArgsRest(__VLS_56));
    let __VLS_60;
    const __VLS_61 = {
        ...{ click: {} },
        onClick: (...[$event]) => {
            __VLS_ctx.handleDelete(row);
            // @ts-ignore
            [handleDelete,];
        },
    };
    const { default: __VLS_62 } = __VLS_58.slots;
    // @ts-ignore
    [];
    var __VLS_58;
    var __VLS_59;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_10;
var __VLS_11;
let __VLS_63;
/** @ts-ignore @type { | typeof __VLS_components.elDivider | typeof __VLS_components.ElDivider | typeof __VLS_components['el-divider']} */
elDivider;
// @ts-ignore
const __VLS_64 = __VLS_asFunctionalComponent1(__VLS_63, new __VLS_63({}));
const __VLS_65 = __VLS_64({}, ...__VLS_functionalComponentArgsRest(__VLS_64));
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "usage-section" },
});
/** @type {__VLS_StyleScopedClasses['usage-section']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "section-title" },
});
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "usage-code" },
});
/** @type {__VLS_StyleScopedClasses['usage-code']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.pre, __VLS_intrinsics.pre)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.code, __VLS_intrinsics.code)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
    ...{ class: "usage-description" },
});
/** @type {__VLS_StyleScopedClasses['usage-description']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.code, __VLS_intrinsics.code)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.code, __VLS_intrinsics.code)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.code, __VLS_intrinsics.code)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "usage-code" },
});
/** @type {__VLS_StyleScopedClasses['usage-code']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.pre, __VLS_intrinsics.pre)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.code, __VLS_intrinsics.code)({});
let __VLS_68;
/** @ts-ignore @type { | typeof __VLS_components.elDivider | typeof __VLS_components.ElDivider | typeof __VLS_components['el-divider']} */
elDivider;
// @ts-ignore
const __VLS_69 = __VLS_asFunctionalComponent1(__VLS_68, new __VLS_68({}));
const __VLS_70 = __VLS_69({}, ...__VLS_functionalComponentArgsRest(__VLS_69));
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "usage-section" },
});
/** @type {__VLS_StyleScopedClasses['usage-section']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "section-title" },
});
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
    ...{ class: "usage-description" },
});
/** @type {__VLS_StyleScopedClasses['usage-description']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.code, __VLS_intrinsics.code)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "comparison-table" },
});
/** @type {__VLS_StyleScopedClasses['comparison-table']} */ ;
let __VLS_73;
/** @ts-ignore @type { | typeof __VLS_components.elTable | typeof __VLS_components.ElTable | typeof __VLS_components['el-table'] | typeof __VLS_components.elTable | typeof __VLS_components.ElTable | typeof __VLS_components['el-table']} */
elTable;
// @ts-ignore
const __VLS_74 = __VLS_asFunctionalComponent1(__VLS_73, new __VLS_73({
    data: (__VLS_ctx.eventsTableData),
    border: true,
    ...{ style: {} },
}));
const __VLS_75 = __VLS_74({
    data: (__VLS_ctx.eventsTableData),
    border: true,
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_74));
const { default: __VLS_78 } = __VLS_76.slots;
let __VLS_79;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_80 = __VLS_asFunctionalComponent1(__VLS_79, new __VLS_79({
    prop: "name",
    label: "事件名",
    width: "180",
}));
const __VLS_81 = __VLS_80({
    prop: "name",
    label: "事件名",
    width: "180",
}, ...__VLS_functionalComponentArgsRest(__VLS_80));
const { default: __VLS_84 } = __VLS_82.slots;
{
    const { default: __VLS_85 } = __VLS_82.slots;
    const [{ row }] = __VLS_vSlot(__VLS_85);
    __VLS_asFunctionalElement1(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({});
    (row.name);
    // @ts-ignore
    [eventsTableData,];
}
// @ts-ignore
[];
var __VLS_82;
let __VLS_86;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_87 = __VLS_asFunctionalComponent1(__VLS_86, new __VLS_86({
    prop: "params",
    label: "回调参数",
    minWidth: "280",
}));
const __VLS_88 = __VLS_87({
    prop: "params",
    label: "回调参数",
    minWidth: "280",
}, ...__VLS_functionalComponentArgsRest(__VLS_87));
const { default: __VLS_91 } = __VLS_89.slots;
{
    const { default: __VLS_92 } = __VLS_89.slots;
    const [{ row }] = __VLS_vSlot(__VLS_92);
    __VLS_asFunctionalElement1(__VLS_intrinsics.code, __VLS_intrinsics.code)({});
    (row.params);
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_89;
let __VLS_93;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_94 = __VLS_asFunctionalComponent1(__VLS_93, new __VLS_93({
    prop: "description",
    label: "说明",
    minWidth: "260",
}));
const __VLS_95 = __VLS_94({
    prop: "description",
    label: "说明",
    minWidth: "260",
}, ...__VLS_functionalComponentArgsRest(__VLS_94));
// @ts-ignore
[];
var __VLS_76;
let __VLS_98;
/** @ts-ignore @type { | typeof __VLS_components.elDivider | typeof __VLS_components.ElDivider | typeof __VLS_components['el-divider']} */
elDivider;
// @ts-ignore
const __VLS_99 = __VLS_asFunctionalComponent1(__VLS_98, new __VLS_98({}));
const __VLS_100 = __VLS_99({}, ...__VLS_functionalComponentArgsRest(__VLS_99));
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "usage-section" },
});
/** @type {__VLS_StyleScopedClasses['usage-section']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "section-title" },
});
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
    ...{ class: "usage-description" },
});
/** @type {__VLS_StyleScopedClasses['usage-description']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.code, __VLS_intrinsics.code)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "comparison-table" },
});
/** @type {__VLS_StyleScopedClasses['comparison-table']} */ ;
let __VLS_103;
/** @ts-ignore @type { | typeof __VLS_components.elTable | typeof __VLS_components.ElTable | typeof __VLS_components['el-table'] | typeof __VLS_components.elTable | typeof __VLS_components.ElTable | typeof __VLS_components['el-table']} */
elTable;
// @ts-ignore
const __VLS_104 = __VLS_asFunctionalComponent1(__VLS_103, new __VLS_103({
    data: (__VLS_ctx.slotsTableData),
    border: true,
    ...{ style: {} },
}));
const __VLS_105 = __VLS_104({
    data: (__VLS_ctx.slotsTableData),
    border: true,
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_104));
const { default: __VLS_108 } = __VLS_106.slots;
let __VLS_109;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_110 = __VLS_asFunctionalComponent1(__VLS_109, new __VLS_109({
    prop: "name",
    label: "插槽名",
    width: "180",
}));
const __VLS_111 = __VLS_110({
    prop: "name",
    label: "插槽名",
    width: "180",
}, ...__VLS_functionalComponentArgsRest(__VLS_110));
const { default: __VLS_114 } = __VLS_112.slots;
{
    const { default: __VLS_115 } = __VLS_112.slots;
    const [{ row }] = __VLS_vSlot(__VLS_115);
    __VLS_asFunctionalElement1(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({});
    (row.name);
    // @ts-ignore
    [slotsTableData,];
}
// @ts-ignore
[];
var __VLS_112;
let __VLS_116;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_117 = __VLS_asFunctionalComponent1(__VLS_116, new __VLS_116({
    prop: "params",
    label: "插槽参数",
    width: "220",
}));
const __VLS_118 = __VLS_117({
    prop: "params",
    label: "插槽参数",
    width: "220",
}, ...__VLS_functionalComponentArgsRest(__VLS_117));
const { default: __VLS_121 } = __VLS_119.slots;
{
    const { default: __VLS_122 } = __VLS_119.slots;
    const [{ row }] = __VLS_vSlot(__VLS_122);
    __VLS_asFunctionalElement1(__VLS_intrinsics.code, __VLS_intrinsics.code)({});
    (row.params);
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_119;
let __VLS_123;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_124 = __VLS_asFunctionalComponent1(__VLS_123, new __VLS_123({
    prop: "description",
    label: "说明",
    minWidth: "320",
}));
const __VLS_125 = __VLS_124({
    prop: "description",
    label: "说明",
    minWidth: "320",
}, ...__VLS_functionalComponentArgsRest(__VLS_124));
// @ts-ignore
[];
var __VLS_106;
let __VLS_128;
/** @ts-ignore @type { | typeof __VLS_components.elDivider | typeof __VLS_components.ElDivider | typeof __VLS_components['el-divider']} */
elDivider;
// @ts-ignore
const __VLS_129 = __VLS_asFunctionalComponent1(__VLS_128, new __VLS_128({}));
const __VLS_130 = __VLS_129({}, ...__VLS_functionalComponentArgsRest(__VLS_129));
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "usage-section" },
});
/** @type {__VLS_StyleScopedClasses['usage-section']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "section-title" },
});
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
    ...{ class: "usage-description" },
});
/** @type {__VLS_StyleScopedClasses['usage-description']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.code, __VLS_intrinsics.code)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.code, __VLS_intrinsics.code)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "comparison-table" },
});
/** @type {__VLS_StyleScopedClasses['comparison-table']} */ ;
let __VLS_133;
/** @ts-ignore @type { | typeof __VLS_components.elTable | typeof __VLS_components.ElTable | typeof __VLS_components['el-table'] | typeof __VLS_components.elTable | typeof __VLS_components.ElTable | typeof __VLS_components['el-table']} */
elTable;
// @ts-ignore
const __VLS_134 = __VLS_asFunctionalComponent1(__VLS_133, new __VLS_133({
    data: (__VLS_ctx.methodsTableData),
    border: true,
    ...{ style: {} },
}));
const __VLS_135 = __VLS_134({
    data: (__VLS_ctx.methodsTableData),
    border: true,
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_134));
const { default: __VLS_138 } = __VLS_136.slots;
let __VLS_139;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_140 = __VLS_asFunctionalComponent1(__VLS_139, new __VLS_139({
    prop: "name",
    label: "方法名",
    width: "220",
}));
const __VLS_141 = __VLS_140({
    prop: "name",
    label: "方法名",
    width: "220",
}, ...__VLS_functionalComponentArgsRest(__VLS_140));
const { default: __VLS_144 } = __VLS_142.slots;
{
    const { default: __VLS_145 } = __VLS_142.slots;
    const [{ row }] = __VLS_vSlot(__VLS_145);
    __VLS_asFunctionalElement1(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({});
    (row.name);
    // @ts-ignore
    [methodsTableData,];
}
// @ts-ignore
[];
var __VLS_142;
let __VLS_146;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_147 = __VLS_asFunctionalComponent1(__VLS_146, new __VLS_146({
    prop: "params",
    label: "参数",
    width: "180",
}));
const __VLS_148 = __VLS_147({
    prop: "params",
    label: "参数",
    width: "180",
}, ...__VLS_functionalComponentArgsRest(__VLS_147));
const { default: __VLS_151 } = __VLS_149.slots;
{
    const { default: __VLS_152 } = __VLS_149.slots;
    const [{ row }] = __VLS_vSlot(__VLS_152);
    __VLS_asFunctionalElement1(__VLS_intrinsics.code, __VLS_intrinsics.code)({});
    (row.params);
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_149;
let __VLS_153;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_154 = __VLS_asFunctionalComponent1(__VLS_153, new __VLS_153({
    prop: "description",
    label: "说明",
    minWidth: "300",
}));
const __VLS_155 = __VLS_154({
    prop: "description",
    label: "说明",
    minWidth: "300",
}, ...__VLS_functionalComponentArgsRest(__VLS_154));
// @ts-ignore
[];
var __VLS_136;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "usage-code" },
});
/** @type {__VLS_StyleScopedClasses['usage-code']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.pre, __VLS_intrinsics.pre)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.code, __VLS_intrinsics.code)({});
let __VLS_158;
/** @ts-ignore @type { | typeof __VLS_components.elDivider | typeof __VLS_components.ElDivider | typeof __VLS_components['el-divider']} */
elDivider;
// @ts-ignore
const __VLS_159 = __VLS_asFunctionalComponent1(__VLS_158, new __VLS_158({}));
const __VLS_160 = __VLS_159({}, ...__VLS_functionalComponentArgsRest(__VLS_159));
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "usage-section" },
});
/** @type {__VLS_StyleScopedClasses['usage-section']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "section-title" },
});
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
    ...{ class: "usage-description" },
});
/** @type {__VLS_StyleScopedClasses['usage-description']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.code, __VLS_intrinsics.code)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.code, __VLS_intrinsics.code)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "comparison-table" },
});
/** @type {__VLS_StyleScopedClasses['comparison-table']} */ ;
let __VLS_163;
/** @ts-ignore @type { | typeof __VLS_components.elTable | typeof __VLS_components.ElTable | typeof __VLS_components['el-table'] | typeof __VLS_components.elTable | typeof __VLS_components.ElTable | typeof __VLS_components['el-table']} */
elTable;
// @ts-ignore
const __VLS_164 = __VLS_asFunctionalComponent1(__VLS_163, new __VLS_163({
    data: (__VLS_ctx.formConfigTableData),
    border: true,
    ...{ style: {} },
}));
const __VLS_165 = __VLS_164({
    data: (__VLS_ctx.formConfigTableData),
    border: true,
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_164));
const { default: __VLS_168 } = __VLS_166.slots;
let __VLS_169;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_170 = __VLS_asFunctionalComponent1(__VLS_169, new __VLS_169({
    prop: "name",
    label: "属性名",
    width: "180",
}));
const __VLS_171 = __VLS_170({
    prop: "name",
    label: "属性名",
    width: "180",
}, ...__VLS_functionalComponentArgsRest(__VLS_170));
const { default: __VLS_174 } = __VLS_172.slots;
{
    const { default: __VLS_175 } = __VLS_172.slots;
    const [{ row }] = __VLS_vSlot(__VLS_175);
    __VLS_asFunctionalElement1(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({});
    (row.name);
    // @ts-ignore
    [formConfigTableData,];
}
// @ts-ignore
[];
var __VLS_172;
let __VLS_176;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_177 = __VLS_asFunctionalComponent1(__VLS_176, new __VLS_176({
    prop: "type",
    label: "类型",
    width: "220",
}));
const __VLS_178 = __VLS_177({
    prop: "type",
    label: "类型",
    width: "220",
}, ...__VLS_functionalComponentArgsRest(__VLS_177));
const { default: __VLS_181 } = __VLS_179.slots;
{
    const { default: __VLS_182 } = __VLS_179.slots;
    const [{ row }] = __VLS_vSlot(__VLS_182);
    __VLS_asFunctionalElement1(__VLS_intrinsics.code, __VLS_intrinsics.code)({});
    (row.type);
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_179;
let __VLS_183;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_184 = __VLS_asFunctionalComponent1(__VLS_183, new __VLS_183({
    prop: "default",
    label: "默认值",
    width: "150",
}));
const __VLS_185 = __VLS_184({
    prop: "default",
    label: "默认值",
    width: "150",
}, ...__VLS_functionalComponentArgsRest(__VLS_184));
const { default: __VLS_188 } = __VLS_186.slots;
{
    const { default: __VLS_189 } = __VLS_186.slots;
    const [{ row }] = __VLS_vSlot(__VLS_189);
    __VLS_asFunctionalElement1(__VLS_intrinsics.code, __VLS_intrinsics.code)({});
    (row.default);
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_186;
let __VLS_190;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_191 = __VLS_asFunctionalComponent1(__VLS_190, new __VLS_190({
    prop: "description",
    label: "说明",
    minWidth: "240",
}));
const __VLS_192 = __VLS_191({
    prop: "description",
    label: "说明",
    minWidth: "240",
}, ...__VLS_functionalComponentArgsRest(__VLS_191));
// @ts-ignore
[];
var __VLS_166;
let __VLS_195;
/** @ts-ignore @type { | typeof __VLS_components.elDivider | typeof __VLS_components.ElDivider | typeof __VLS_components['el-divider']} */
elDivider;
// @ts-ignore
const __VLS_196 = __VLS_asFunctionalComponent1(__VLS_195, new __VLS_195({}));
const __VLS_197 = __VLS_196({}, ...__VLS_functionalComponentArgsRest(__VLS_196));
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "usage-section" },
});
/** @type {__VLS_StyleScopedClasses['usage-section']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "section-title" },
});
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
    ...{ class: "usage-description" },
});
/** @type {__VLS_StyleScopedClasses['usage-description']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.code, __VLS_intrinsics.code)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.code, __VLS_intrinsics.code)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.code, __VLS_intrinsics.code)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "comparison-table" },
});
/** @type {__VLS_StyleScopedClasses['comparison-table']} */ ;
let __VLS_200;
/** @ts-ignore @type { | typeof __VLS_components.elTable | typeof __VLS_components.ElTable | typeof __VLS_components['el-table'] | typeof __VLS_components.elTable | typeof __VLS_components.ElTable | typeof __VLS_components['el-table']} */
elTable;
// @ts-ignore
const __VLS_201 = __VLS_asFunctionalComponent1(__VLS_200, new __VLS_200({
    data: (__VLS_ctx.columnsTableData),
    border: true,
    ...{ style: {} },
}));
const __VLS_202 = __VLS_201({
    data: (__VLS_ctx.columnsTableData),
    border: true,
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_201));
const { default: __VLS_205 } = __VLS_203.slots;
let __VLS_206;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_207 = __VLS_asFunctionalComponent1(__VLS_206, new __VLS_206({
    prop: "name",
    label: "属性名",
    width: "180",
}));
const __VLS_208 = __VLS_207({
    prop: "name",
    label: "属性名",
    width: "180",
}, ...__VLS_functionalComponentArgsRest(__VLS_207));
const { default: __VLS_211 } = __VLS_209.slots;
{
    const { default: __VLS_212 } = __VLS_209.slots;
    const [{ row }] = __VLS_vSlot(__VLS_212);
    __VLS_asFunctionalElement1(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({});
    (row.name);
    // @ts-ignore
    [columnsTableData,];
}
// @ts-ignore
[];
var __VLS_209;
let __VLS_213;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_214 = __VLS_asFunctionalComponent1(__VLS_213, new __VLS_213({
    prop: "type",
    label: "类型",
    width: "220",
}));
const __VLS_215 = __VLS_214({
    prop: "type",
    label: "类型",
    width: "220",
}, ...__VLS_functionalComponentArgsRest(__VLS_214));
const { default: __VLS_218 } = __VLS_216.slots;
{
    const { default: __VLS_219 } = __VLS_216.slots;
    const [{ row }] = __VLS_vSlot(__VLS_219);
    __VLS_asFunctionalElement1(__VLS_intrinsics.code, __VLS_intrinsics.code)({});
    (row.type);
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_216;
let __VLS_220;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_221 = __VLS_asFunctionalComponent1(__VLS_220, new __VLS_220({
    prop: "default",
    label: "默认值",
    width: "150",
}));
const __VLS_222 = __VLS_221({
    prop: "default",
    label: "默认值",
    width: "150",
}, ...__VLS_functionalComponentArgsRest(__VLS_221));
const { default: __VLS_225 } = __VLS_223.slots;
{
    const { default: __VLS_226 } = __VLS_223.slots;
    const [{ row }] = __VLS_vSlot(__VLS_226);
    __VLS_asFunctionalElement1(__VLS_intrinsics.code, __VLS_intrinsics.code)({});
    (row.default);
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_223;
let __VLS_227;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_228 = __VLS_asFunctionalComponent1(__VLS_227, new __VLS_227({
    prop: "description",
    label: "说明",
    minWidth: "240",
}));
const __VLS_229 = __VLS_228({
    prop: "description",
    label: "说明",
    minWidth: "240",
}, ...__VLS_functionalComponentArgsRest(__VLS_228));
// @ts-ignore
[];
var __VLS_203;
let __VLS_232;
/** @ts-ignore @type { | typeof __VLS_components.elDivider | typeof __VLS_components.ElDivider | typeof __VLS_components['el-divider']} */
elDivider;
// @ts-ignore
const __VLS_233 = __VLS_asFunctionalComponent1(__VLS_232, new __VLS_232({}));
const __VLS_234 = __VLS_233({}, ...__VLS_functionalComponentArgsRest(__VLS_233));
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "usage-section" },
});
/** @type {__VLS_StyleScopedClasses['usage-section']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "section-title" },
});
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "comparison-table" },
});
/** @type {__VLS_StyleScopedClasses['comparison-table']} */ ;
let __VLS_237;
/** @ts-ignore @type { | typeof __VLS_components.elTable | typeof __VLS_components.ElTable | typeof __VLS_components['el-table'] | typeof __VLS_components.elTable | typeof __VLS_components.ElTable | typeof __VLS_components['el-table']} */
elTable;
// @ts-ignore
const __VLS_238 = __VLS_asFunctionalComponent1(__VLS_237, new __VLS_237({
    data: (__VLS_ctx.propsTableData),
    border: true,
    ...{ style: {} },
}));
const __VLS_239 = __VLS_238({
    data: (__VLS_ctx.propsTableData),
    border: true,
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_238));
const { default: __VLS_242 } = __VLS_240.slots;
let __VLS_243;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_244 = __VLS_asFunctionalComponent1(__VLS_243, new __VLS_243({
    prop: "name",
    label: "属性名",
    width: "180",
}));
const __VLS_245 = __VLS_244({
    prop: "name",
    label: "属性名",
    width: "180",
}, ...__VLS_functionalComponentArgsRest(__VLS_244));
const { default: __VLS_248 } = __VLS_246.slots;
{
    const { default: __VLS_249 } = __VLS_246.slots;
    const [{ row }] = __VLS_vSlot(__VLS_249);
    __VLS_asFunctionalElement1(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({});
    (row.name);
    // @ts-ignore
    [propsTableData,];
}
// @ts-ignore
[];
var __VLS_246;
let __VLS_250;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_251 = __VLS_asFunctionalComponent1(__VLS_250, new __VLS_250({
    prop: "type",
    label: "类型",
    width: "220",
}));
const __VLS_252 = __VLS_251({
    prop: "type",
    label: "类型",
    width: "220",
}, ...__VLS_functionalComponentArgsRest(__VLS_251));
const { default: __VLS_255 } = __VLS_253.slots;
{
    const { default: __VLS_256 } = __VLS_253.slots;
    const [{ row }] = __VLS_vSlot(__VLS_256);
    __VLS_asFunctionalElement1(__VLS_intrinsics.code, __VLS_intrinsics.code)({});
    (row.type);
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_253;
let __VLS_257;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_258 = __VLS_asFunctionalComponent1(__VLS_257, new __VLS_257({
    prop: "default",
    label: "默认值",
    width: "150",
}));
const __VLS_259 = __VLS_258({
    prop: "default",
    label: "默认值",
    width: "150",
}, ...__VLS_functionalComponentArgsRest(__VLS_258));
const { default: __VLS_262 } = __VLS_260.slots;
{
    const { default: __VLS_263 } = __VLS_260.slots;
    const [{ row }] = __VLS_vSlot(__VLS_263);
    __VLS_asFunctionalElement1(__VLS_intrinsics.code, __VLS_intrinsics.code)({});
    (row.default);
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_260;
let __VLS_264;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_265 = __VLS_asFunctionalComponent1(__VLS_264, new __VLS_264({
    prop: "description",
    label: "说明",
    minWidth: "240",
}));
const __VLS_266 = __VLS_265({
    prop: "description",
    label: "说明",
    minWidth: "240",
}, ...__VLS_functionalComponentArgsRest(__VLS_265));
// @ts-ignore
[];
var __VLS_240;
// @ts-ignore
[];
var __VLS_3;
// @ts-ignore
var __VLS_15 = __VLS_14;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
