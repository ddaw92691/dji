/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
const props = withDefaults(defineProps(), {
    // ---------------- 表单配置 --------------------
    gutter: 20,
    xl: 6,
    lg: 6,
    md: 12,
    sm: 12,
    xs: 24,
    formLabelWidth: 'auto',
    formLabelPosition: 'right',
    formCollapsible: true,
    formInitialVisibleCount: 3,
    formDefaultIsExpand: false,
    // ---------------- 表格配置 --------------------
    tableLoading: false,
    loadingDelay: 300,
    tableLoadingText: '数据加载中...',
    tableLoadingSpinner: `
        <path class="path" d="
          M 30 15
          L 28 17
          M 25.61 25.61
          A 15 15, 0, 0, 1, 15 30
          A 15 15, 0, 1, 1, 27.99 7.5
          L 15 15
        " style="stroke-width: 4px; fill: rgba(0, 0, 0, 0)"/>
      `,
    // ---------------- 页码配置 --------------------
    total: 0,
    paginationLayout: 'total, sizes, prev, pager, next, jumper',
    pageSizes: () => [10, 20, 30, 40, 50],
    // ---------------- 工具栏配置 --------------------
    showSearchToggle: true,
    showRefresh: true,
    showExport: true,
    showPrint: true,
    showSize: true,
    showColumn: true,
    showPagination: true,
});
const emits = defineEmits();
// 组件映射
const componentsMap = {
    elInput: ElInput,
    elInputNumber: ElInputNumber,
    elSelect: ElSelect,
    elDatePicker: ElDatePicker,
};
const menuStore = useMenuStore();
// 是否展示查询表单
const queryFormVisible = ref(true);
// 延迟显示 loading，避免闪屏
const delayedLoading = ref(false);
let loadingTimer = null;
// 监听 tableLoading 变化，实现延迟显示
watch(() => props.tableLoading, (newVal) => {
    if (newVal) {
        // 开始 loading，延迟显示
        loadingTimer = setTimeout(() => {
            delayedLoading.value = true;
        }, props.loadingDelay);
    }
    else {
        // 结束 loading，立即隐藏并清除定时器
        if (loadingTimer) {
            clearTimeout(loadingTimer);
            loadingTimer = null;
        }
        delayedLoading.value = false;
    }
}, { immediate: true });
// -----------------------  表单配置 -----------------------
// 查询表单form
const queryForm = ref({});
// 展开/收缩 状态
const isExpand = ref(props.formDefaultIsExpand);
// 显示的表单项
const visibleSearchConfig = computed(() => {
    // 如果不支持折叠 则返回所有表单项
    if (!props.formCollapsible)
        return props.formConfig;
    // 如果是展开状态 则返回所有表单项
    if (isExpand.value)
        return props.formConfig;
    // 如果是收起状态 则计算需要展示的表单项
    return props.formConfig?.slice(0, props.formInitialVisibleCount);
});
// 是否显示展开/收起按钮
const visibleIsExpandDiv = computed(() => {
    //如果没有传递formConfig 则隐藏
    if (!props.formConfig)
        return false;
    // 如果不支持折叠，则隐藏
    if (!props.formCollapsible)
        return false;
    // 如果支持折叠，并且formConfig长度大于formInitialVisibleCount 则显示
    if (props.formConfig?.length > props.formInitialVisibleCount)
        return true;
    return false;
});
// 初始化表单值（如果有默认值的情况下）
const initForm = () => {
    const form = {};
    props?.formConfig?.forEach((item) => {
        form[item.prop] = item.defaultValue ?? undefined;
    });
    queryForm.value = form;
};
const query = () => {
    emits('refresh', queryForm.value, currentPage.value, pageSize.value, sortField.value, sortOrder.value);
};
const reset = () => {
    // 重置表单
    initForm();
    emits('refresh', queryForm.value, currentPage.value, pageSize.value, sortField.value, sortOrder.value);
};
// -----------------------  表格和页码配置 -----------------------
// 表格尺寸
const tableSize = ref('default');
// 表格的column
const tableColumns = ref(props.columns.map((item) => ({
    ...item,
    visible: true,
})));
// 表格选择的数据
const tableSelectedList = ref([]);
// 当前页码
const currentPage = ref(1);
// 每页条数
const pageSize = ref(props.pageSizes[0] || 10);
// 排序字段
const sortField = ref('');
// 排序顺序
const sortOrder = ref('');
// 页码改变
const paginationChange = (page, pageSize) => {
    emits('refresh', queryForm.value, page, pageSize, sortField.value, sortOrder.value);
};
// 表格选择变化
const tableSelectionChange = (selection) => {
    tableSelectedList.value = selection;
    emits('selection-change', selection);
};
// 表格排序变化
const tableSortChange = ({ prop, order, }) => {
    sortField.value = prop || '';
    sortOrder.value = order === 'ascending' ? 'asc' : order === 'descending' ? 'desc' : '';
    emits('refresh', queryForm.value, 1, pageSize.value, sortField.value, sortOrder.value);
};
// 刷新（表格工具）
const refresh = () => {
    emits('refresh', queryForm.value, currentPage.value, pageSize.value, sortField.value, sortOrder.value);
};
/**
 * 刷新当前页（保持当前页码和查询条件）
 * 用于：编辑操作后刷新
 */
const refreshCurrentPage = () => {
    emits('refresh', queryForm.value, currentPage.value, pageSize.value, sortField.value, sortOrder.value);
};
/**
 * 智能刷新（删除操作专用）
 * @param deleteCount 删除的数据条数，默认为1
 * 逻辑：
 * 1. 计算删除后当前页剩余数据量
 * 2. 如果当前页数据会被删空且不是第1页，则回到上一页
 * 3. 否则刷新当前页
 * 用于：删除操作后刷新
 */
const refreshAfterDelete = (deleteCount = 1) => {
    // 计算删除后当前页剩余的数据量
    const remainingCount = props.tableData.length - deleteCount;
    // 如果删除后当前页没有数据了，且不是第1页，则回到上一页
    if (remainingCount <= 0 && currentPage.value > 1) {
        currentPage.value = currentPage.value - 1;
        emits('refresh', queryForm.value, currentPage.value, pageSize.value, sortField.value, sortOrder.value);
    }
    else {
        // 否则刷新当前页
        emits('refresh', queryForm.value, currentPage.value, pageSize.value, sortField.value, sortOrder.value);
    }
};
/**
 * 刷新到第一页（保持查询条件）
 * 用于：新增成功后刷新
 */
const refreshToFirstPage = () => {
    currentPage.value = 1;
    emits('refresh', queryForm.value, currentPage.value, pageSize.value, sortField.value, sortOrder.value);
};
/**
 * 重置并刷新（清空查询条件，回到第一页）
 * 用于：重置搜索
 */
const resetAndRefresh = () => {
    initForm();
    currentPage.value = 1;
    emits('refresh', queryForm.value, currentPage.value, pageSize.value, sortField.value, sortOrder.value);
};
// 暴露方法给父组件使用
const __VLS_exposed = {
    refreshCurrentPage, // 刷新当前页（编辑后使用）
    refreshAfterDelete, // 智能刷新（删除后使用）
    refreshToFirstPage, // 刷新到第一页（新增后使用）
    resetAndRefresh, // 重置并刷新
    queryForm, // 查询表单数据
    currentPage, // 当前页码
    pageSize, // 每页条数
    tableSelectedList, // 表格选择的数据
    sortField, // 排序字段
    sortOrder, // 排序顺序
};
defineExpose(__VLS_exposed);
onMounted(() => {
    // 初始化form
    initForm();
    // 当组件挂载时，直接触发一次refresh事件
    emits('refresh', queryForm.value, currentPage.value, pageSize.value, sortField.value, sortOrder.value);
});
const __VLS_defaults = {
    // ---------------- 表单配置 --------------------
    gutter: 20,
    xl: 6,
    lg: 6,
    md: 12,
    sm: 12,
    xs: 24,
    formLabelWidth: 'auto',
    formLabelPosition: 'right',
    formCollapsible: true,
    formInitialVisibleCount: 3,
    formDefaultIsExpand: false,
    // ---------------- 表格配置 --------------------
    tableLoading: false,
    loadingDelay: 300,
    tableLoadingText: '数据加载中...',
    tableLoadingSpinner: `
        <path class="path" d="
          M 30 15
          L 28 17
          M 25.61 25.61
          A 15 15, 0, 0, 1, 15 30
          A 15 15, 0, 1, 1, 27.99 7.5
          L 15 15
        " style="stroke-width: 4px; fill: rgba(0, 0, 0, 0)"/>
      `,
    // ---------------- 页码配置 --------------------
    total: 0,
    paginationLayout: 'total, sizes, prev, pager, next, jumper',
    pageSizes: () => [10, 20, 30, 40, 50],
    // ---------------- 工具栏配置 --------------------
    showSearchToggle: true,
    showRefresh: true,
    showExport: true,
    showPrint: true,
    showSize: true,
    showColumn: true,
    showPagination: true,
};
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
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
let __VLS_0;
/** @ts-ignore @type { | typeof __VLS_components.Transition | typeof __VLS_components.Transition} */
Transition;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    name: "zoom-in-top",
}));
const __VLS_2 = __VLS_1({
    name: "zoom-in-top",
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
const { default: __VLS_5 } = __VLS_3.slots;
if (__VLS_ctx.formConfig?.length && __VLS_ctx.queryFormVisible) {
    let __VLS_6;
    /** @ts-ignore @type { | typeof __VLS_components.BaseCard | typeof __VLS_components.BaseCard} */
    BaseCard;
    // @ts-ignore
    const __VLS_7 = __VLS_asFunctionalComponent1(__VLS_6, new __VLS_6({
        ...{ class: "query-card" },
    }));
    const __VLS_8 = __VLS_7({
        ...{ class: "query-card" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_7));
    /** @type {__VLS_StyleScopedClasses['query-card']} */ ;
    const { default: __VLS_11 } = __VLS_9.slots;
    let __VLS_12;
    /** @ts-ignore @type { | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form'] | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form']} */
    elForm;
    // @ts-ignore
    const __VLS_13 = __VLS_asFunctionalComponent1(__VLS_12, new __VLS_12({
        model: (__VLS_ctx.queryForm),
        labelWidth: (__VLS_ctx.formLabelWidth),
        labelPosition: (__VLS_ctx.formLabelPosition),
    }));
    const __VLS_14 = __VLS_13({
        model: (__VLS_ctx.queryForm),
        labelWidth: (__VLS_ctx.formLabelWidth),
        labelPosition: (__VLS_ctx.formLabelPosition),
    }, ...__VLS_functionalComponentArgsRest(__VLS_13));
    const { default: __VLS_17 } = __VLS_15.slots;
    let __VLS_18;
    /** @ts-ignore @type { | typeof __VLS_components.elRow | typeof __VLS_components.ElRow | typeof __VLS_components['el-row'] | typeof __VLS_components.elRow | typeof __VLS_components.ElRow | typeof __VLS_components['el-row']} */
    elRow;
    // @ts-ignore
    const __VLS_19 = __VLS_asFunctionalComponent1(__VLS_18, new __VLS_18({
        gutter: (__VLS_ctx.gutter),
    }));
    const __VLS_20 = __VLS_19({
        gutter: (__VLS_ctx.gutter),
    }, ...__VLS_functionalComponentArgsRest(__VLS_19));
    const { default: __VLS_23 } = __VLS_21.slots;
    for (const [col] of __VLS_vFor((__VLS_ctx.visibleSearchConfig))) {
        let __VLS_24;
        /** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
        elCol;
        // @ts-ignore
        const __VLS_25 = __VLS_asFunctionalComponent1(__VLS_24, new __VLS_24({
            xs: (__VLS_ctx.xs),
            sm: (__VLS_ctx.sm),
            md: (__VLS_ctx.md),
            lg: (__VLS_ctx.lg),
            xl: (__VLS_ctx.xl),
            key: (col.prop),
        }));
        const __VLS_26 = __VLS_25({
            xs: (__VLS_ctx.xs),
            sm: (__VLS_ctx.sm),
            md: (__VLS_ctx.md),
            lg: (__VLS_ctx.lg),
            xl: (__VLS_ctx.xl),
            key: (col.prop),
        }, ...__VLS_functionalComponentArgsRest(__VLS_25));
        const { default: __VLS_29 } = __VLS_27.slots;
        let __VLS_30;
        /** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
        elFormItem;
        // @ts-ignore
        const __VLS_31 = __VLS_asFunctionalComponent1(__VLS_30, new __VLS_30({
            label: (col.label),
        }));
        const __VLS_32 = __VLS_31({
            label: (col.label),
        }, ...__VLS_functionalComponentArgsRest(__VLS_31));
        const { default: __VLS_35 } = __VLS_33.slots;
        const __VLS_36 = (__VLS_ctx.componentsMap[col.type]);
        // @ts-ignore
        const __VLS_37 = __VLS_asFunctionalComponent1(__VLS_36, new __VLS_36({
            modelValue: (__VLS_ctx.queryForm[col.prop]),
            ...(col.attrs),
            ...{ style: {} },
        }));
        const __VLS_38 = __VLS_37({
            modelValue: (__VLS_ctx.queryForm[col.prop]),
            ...(col.attrs),
            ...{ style: {} },
        }, ...__VLS_functionalComponentArgsRest(__VLS_37));
        // @ts-ignore
        [formConfig, queryFormVisible, queryForm, queryForm, formLabelWidth, formLabelPosition, gutter, visibleSearchConfig, xs, sm, md, lg, xl, componentsMap,];
        var __VLS_33;
        // @ts-ignore
        [];
        var __VLS_27;
        // @ts-ignore
        [];
    }
    let __VLS_41;
    /** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
    elCol;
    // @ts-ignore
    const __VLS_42 = __VLS_asFunctionalComponent1(__VLS_41, new __VLS_41({
        xs: (__VLS_ctx.xs),
        sm: (__VLS_ctx.sm),
        md: (__VLS_ctx.md),
        lg: (__VLS_ctx.lg),
        xl: (__VLS_ctx.xl),
    }));
    const __VLS_43 = __VLS_42({
        xs: (__VLS_ctx.xs),
        sm: (__VLS_ctx.sm),
        md: (__VLS_ctx.md),
        lg: (__VLS_ctx.lg),
        xl: (__VLS_ctx.xl),
    }, ...__VLS_functionalComponentArgsRest(__VLS_42));
    const { default: __VLS_46 } = __VLS_44.slots;
    let __VLS_47;
    /** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
    elFormItem;
    // @ts-ignore
    const __VLS_48 = __VLS_asFunctionalComponent1(__VLS_47, new __VLS_47({
        labelWidth: "0",
    }));
    const __VLS_49 = __VLS_48({
        labelWidth: "0",
    }, ...__VLS_functionalComponentArgsRest(__VLS_48));
    const { default: __VLS_52 } = __VLS_50.slots;
    let __VLS_53;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_54 = __VLS_asFunctionalComponent1(__VLS_53, new __VLS_53({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.delayedLoading),
    }));
    const __VLS_55 = __VLS_54({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.delayedLoading),
    }, ...__VLS_functionalComponentArgsRest(__VLS_54));
    let __VLS_58;
    const __VLS_59 = {
        ...{ click: {} },
        onClick: (__VLS_ctx.query),
    };
    const { default: __VLS_60 } = __VLS_56.slots;
    // @ts-ignore
    [xs, sm, md, lg, xl, delayedLoading, query,];
    var __VLS_56;
    var __VLS_57;
    let __VLS_61;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_62 = __VLS_asFunctionalComponent1(__VLS_61, new __VLS_61({
        ...{ 'onClick': {} },
        loading: (__VLS_ctx.delayedLoading),
    }));
    const __VLS_63 = __VLS_62({
        ...{ 'onClick': {} },
        loading: (__VLS_ctx.delayedLoading),
    }, ...__VLS_functionalComponentArgsRest(__VLS_62));
    let __VLS_66;
    const __VLS_67 = {
        ...{ click: {} },
        onClick: (__VLS_ctx.reset),
    };
    const { default: __VLS_68 } = __VLS_64.slots;
    // @ts-ignore
    [delayedLoading, reset,];
    var __VLS_64;
    var __VLS_65;
    if (__VLS_ctx.visibleIsExpandDiv) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ onClick: (...[$event]) => {
                    if (!(__VLS_ctx.formConfig?.length && __VLS_ctx.queryFormVisible))
                        return;
                    if (!(__VLS_ctx.visibleIsExpandDiv))
                        return;
                    __VLS_ctx.isExpand = !__VLS_ctx.isExpand;
                    // @ts-ignore
                    [visibleIsExpandDiv, isExpand, isExpand,];
                } },
            ...{ class: "expand" },
        });
        /** @type {__VLS_StyleScopedClasses['expand']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
        (__VLS_ctx.isExpand ? '收起' : '展开');
        let __VLS_69;
        /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
        elIcon;
        // @ts-ignore
        const __VLS_70 = __VLS_asFunctionalComponent1(__VLS_69, new __VLS_69({
            ...{ class: "expand-icon" },
        }));
        const __VLS_71 = __VLS_70({
            ...{ class: "expand-icon" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_70));
        /** @type {__VLS_StyleScopedClasses['expand-icon']} */ ;
        const { default: __VLS_74 } = __VLS_72.slots;
        const __VLS_75 = (__VLS_ctx.menuStore.iconComponents[__VLS_ctx.isExpand ? 'Element:ArrowUp' : 'Element:ArrowDown']);
        // @ts-ignore
        const __VLS_76 = __VLS_asFunctionalComponent1(__VLS_75, new __VLS_75({}));
        const __VLS_77 = __VLS_76({}, ...__VLS_functionalComponentArgsRest(__VLS_76));
        // @ts-ignore
        [isExpand, isExpand, menuStore,];
        var __VLS_72;
    }
    // @ts-ignore
    [];
    var __VLS_50;
    // @ts-ignore
    [];
    var __VLS_44;
    // @ts-ignore
    [];
    var __VLS_21;
    // @ts-ignore
    [];
    var __VLS_15;
    // @ts-ignore
    [];
    var __VLS_9;
}
// @ts-ignore
[];
var __VLS_3;
let __VLS_80;
/** @ts-ignore @type { | typeof __VLS_components.BaseCard | typeof __VLS_components.BaseCard} */
BaseCard;
// @ts-ignore
const __VLS_81 = __VLS_asFunctionalComponent1(__VLS_80, new __VLS_80({
    ...{ class: "table-card" },
}));
const __VLS_82 = __VLS_81({
    ...{ class: "table-card" },
}, ...__VLS_functionalComponentArgsRest(__VLS_81));
/** @type {__VLS_StyleScopedClasses['table-card']} */ ;
const { default: __VLS_85 } = __VLS_83.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "table-operation" },
});
/** @type {__VLS_StyleScopedClasses['table-operation']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "operation-left" },
});
/** @type {__VLS_StyleScopedClasses['operation-left']} */ ;
var __VLS_86 = {};
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "operation-right" },
});
/** @type {__VLS_StyleScopedClasses['operation-right']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
var __VLS_88 = {};
if (__VLS_ctx.$slots.tableOperationRight) {
    let __VLS_90;
    /** @ts-ignore @type { | typeof __VLS_components.elDivider | typeof __VLS_components.ElDivider | typeof __VLS_components['el-divider']} */
    elDivider;
    // @ts-ignore
    const __VLS_91 = __VLS_asFunctionalComponent1(__VLS_90, new __VLS_90({
        direction: "vertical",
    }));
    const __VLS_92 = __VLS_91({
        direction: "vertical",
    }, ...__VLS_functionalComponentArgsRest(__VLS_91));
}
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "operation-tool" },
});
/** @type {__VLS_StyleScopedClasses['operation-tool']} */ ;
if (__VLS_ctx.formConfig?.length && __VLS_ctx.showSearchToggle) {
    let __VLS_95;
    /** @ts-ignore @type { | typeof __VLS_components.IconButton} */
    IconButton;
    // @ts-ignore
    const __VLS_96 = __VLS_asFunctionalComponent1(__VLS_95, new __VLS_95({
        ...{ 'onClick': {} },
        icon: "HOutline:MagnifyingGlassIcon",
        tooltip: (__VLS_ctx.queryFormVisible ? '隐藏搜索' : '显示搜索'),
        size: "1.75rem",
        iconSize: "18px",
        type: (__VLS_ctx.queryFormVisible ? 'primary' : 'default'),
    }));
    const __VLS_97 = __VLS_96({
        ...{ 'onClick': {} },
        icon: "HOutline:MagnifyingGlassIcon",
        tooltip: (__VLS_ctx.queryFormVisible ? '隐藏搜索' : '显示搜索'),
        size: "1.75rem",
        iconSize: "18px",
        type: (__VLS_ctx.queryFormVisible ? 'primary' : 'default'),
    }, ...__VLS_functionalComponentArgsRest(__VLS_96));
    let __VLS_100;
    const __VLS_101 = {
        ...{ click: {} },
        onClick: (...[$event]) => {
            if (!(__VLS_ctx.formConfig?.length && __VLS_ctx.showSearchToggle))
                return;
            __VLS_ctx.queryFormVisible = !__VLS_ctx.queryFormVisible;
            // @ts-ignore
            [formConfig, queryFormVisible, queryFormVisible, queryFormVisible, queryFormVisible, $slots, showSearchToggle,];
        },
    };
    var __VLS_98;
    var __VLS_99;
}
if (__VLS_ctx.showRefresh) {
    let __VLS_102;
    /** @ts-ignore @type { | typeof __VLS_components.IconButton} */
    IconButton;
    // @ts-ignore
    const __VLS_103 = __VLS_asFunctionalComponent1(__VLS_102, new __VLS_102({
        ...{ 'onClick': {} },
        icon: "HOutline:ArrowPathIcon",
        tooltip: "刷新",
        size: "1.75rem",
        iconSize: "18px",
        loading: (__VLS_ctx.delayedLoading),
    }));
    const __VLS_104 = __VLS_103({
        ...{ 'onClick': {} },
        icon: "HOutline:ArrowPathIcon",
        tooltip: "刷新",
        size: "1.75rem",
        iconSize: "18px",
        loading: (__VLS_ctx.delayedLoading),
    }, ...__VLS_functionalComponentArgsRest(__VLS_103));
    let __VLS_107;
    const __VLS_108 = {
        ...{ click: {} },
        onClick: (__VLS_ctx.refresh),
    };
    var __VLS_105;
    var __VLS_106;
}
if (__VLS_ctx.showExport) {
    let __VLS_109;
    /** @ts-ignore @type { | typeof __VLS_components.TableExport} */
    TableExport;
    // @ts-ignore
    const __VLS_110 = __VLS_asFunctionalComponent1(__VLS_109, new __VLS_109({
        columns: (__VLS_ctx.tableColumns),
        currentPageData: (__VLS_ctx.tableData),
        selectedData: (__VLS_ctx.tableSelectedList),
    }));
    const __VLS_111 = __VLS_110({
        columns: (__VLS_ctx.tableColumns),
        currentPageData: (__VLS_ctx.tableData),
        selectedData: (__VLS_ctx.tableSelectedList),
    }, ...__VLS_functionalComponentArgsRest(__VLS_110));
}
if (__VLS_ctx.showPrint) {
    let __VLS_114;
    /** @ts-ignore @type { | typeof __VLS_components.TablePrint} */
    TablePrint;
    // @ts-ignore
    const __VLS_115 = __VLS_asFunctionalComponent1(__VLS_114, new __VLS_114({
        columns: (__VLS_ctx.tableColumns),
        tableData: (__VLS_ctx.tableData),
        selectedData: (__VLS_ctx.tableSelectedList),
    }));
    const __VLS_116 = __VLS_115({
        columns: (__VLS_ctx.tableColumns),
        tableData: (__VLS_ctx.tableData),
        selectedData: (__VLS_ctx.tableSelectedList),
    }, ...__VLS_functionalComponentArgsRest(__VLS_115));
}
if (__VLS_ctx.showSize) {
    let __VLS_119;
    /** @ts-ignore @type { | typeof __VLS_components.TableSizeBtn} */
    TableSizeBtn;
    // @ts-ignore
    const __VLS_120 = __VLS_asFunctionalComponent1(__VLS_119, new __VLS_119({
        modelValue: (__VLS_ctx.tableSize),
    }));
    const __VLS_121 = __VLS_120({
        modelValue: (__VLS_ctx.tableSize),
    }, ...__VLS_functionalComponentArgsRest(__VLS_120));
}
if (__VLS_ctx.showColumn) {
    let __VLS_124;
    /** @ts-ignore @type { | typeof __VLS_components.TableColumnBtn} */
    TableColumnBtn;
    // @ts-ignore
    const __VLS_125 = __VLS_asFunctionalComponent1(__VLS_124, new __VLS_124({
        modelValue: (__VLS_ctx.tableColumns),
        originalColumns: (__VLS_ctx.columns),
    }));
    const __VLS_126 = __VLS_125({
        modelValue: (__VLS_ctx.tableColumns),
        originalColumns: (__VLS_ctx.columns),
    }, ...__VLS_functionalComponentArgsRest(__VLS_125));
}
let __VLS_129;
/** @ts-ignore @type { | typeof __VLS_components.elTable | typeof __VLS_components.ElTable | typeof __VLS_components['el-table'] | typeof __VLS_components.elTable | typeof __VLS_components.ElTable | typeof __VLS_components['el-table']} */
elTable;
// @ts-ignore
const __VLS_130 = __VLS_asFunctionalComponent1(__VLS_129, new __VLS_129({
    ...{ 'onSelectionChange': {} },
    ...{ 'onSortChange': {} },
    data: (__VLS_ctx.tableData),
    elementLoadingText: (__VLS_ctx.tableLoadingText),
    elementLoadingSvg: (__VLS_ctx.tableLoadingSpinner),
    elementLoadingSvgViewBox: "-10, -10, 50, 50",
    border: (true),
    size: (__VLS_ctx.tableSize),
    showOverflowTooltip: true,
    ...(__VLS_ctx.tableAttrs),
}));
const __VLS_131 = __VLS_130({
    ...{ 'onSelectionChange': {} },
    ...{ 'onSortChange': {} },
    data: (__VLS_ctx.tableData),
    elementLoadingText: (__VLS_ctx.tableLoadingText),
    elementLoadingSvg: (__VLS_ctx.tableLoadingSpinner),
    elementLoadingSvgViewBox: "-10, -10, 50, 50",
    border: (true),
    size: (__VLS_ctx.tableSize),
    showOverflowTooltip: true,
    ...(__VLS_ctx.tableAttrs),
}, ...__VLS_functionalComponentArgsRest(__VLS_130));
let __VLS_134;
const __VLS_135 = {
    ...{ selectionChange: {} },
    onSelectionChange: (__VLS_ctx.tableSelectionChange),
    ...{ sortChange: {} },
    onSortChange: (__VLS_ctx.tableSortChange),
};
__VLS_asFunctionalDirective(__VLS_directives.vLoading, {})(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.delayedLoading) }, null, null);
const { default: __VLS_136 } = __VLS_132.slots;
for (const [col] of __VLS_vFor((__VLS_ctx.tableColumns))) {
    __VLS_asFunctionalElement(__VLS_intrinsics.template)({
        key: (col.prop ? col.prop : col.type),
    });
    if (col.visible) {
        let __VLS_137;
        /** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
        elTableColumn;
        // @ts-ignore
        const __VLS_138 = __VLS_asFunctionalComponent1(__VLS_137, new __VLS_137({
            ...(col),
        }));
        const __VLS_139 = __VLS_138({
            ...(col),
        }, ...__VLS_functionalComponentArgsRest(__VLS_138));
        const { default: __VLS_142 } = __VLS_140.slots;
        if (__VLS_ctx.$slots[col.prop]) {
            {
                const { default: __VLS_143 } = __VLS_140.slots;
                const [scope] = __VLS_vSlot(__VLS_143);
                var __VLS_144 = {
                    ...(scope),
                };
                var __VLS_145 = __VLS_tryAsConstant(col.prop);
                // @ts-ignore
                [delayedLoading, delayedLoading, $slots, showRefresh, refresh, showExport, tableColumns, tableColumns, tableColumns, tableColumns, tableData, tableData, tableData, tableSelectedList, tableSelectedList, showPrint, showSize, tableSize, tableSize, showColumn, columns, tableLoadingText, tableLoadingSpinner, tableAttrs, tableSelectionChange, tableSortChange, vLoading,];
            }
        }
        // @ts-ignore
        [];
        var __VLS_140;
    }
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_132;
var __VLS_133;
if (__VLS_ctx.showPagination) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "pagination-wrap" },
    });
    /** @type {__VLS_StyleScopedClasses['pagination-wrap']} */ ;
    let __VLS_148;
    /** @ts-ignore @type { | typeof __VLS_components.elPagination | typeof __VLS_components.ElPagination | typeof __VLS_components['el-pagination']} */
    elPagination;
    // @ts-ignore
    const __VLS_149 = __VLS_asFunctionalComponent1(__VLS_148, new __VLS_148({
        ...{ 'onChange': {} },
        currentPage: (__VLS_ctx.currentPage),
        pageSize: (__VLS_ctx.pageSize),
        pageSizes: (__VLS_ctx.pageSizes),
        layout: (__VLS_ctx.paginationLayout),
        total: (__VLS_ctx.total),
        ...(__VLS_ctx.paginationAttrs),
    }));
    const __VLS_150 = __VLS_149({
        ...{ 'onChange': {} },
        currentPage: (__VLS_ctx.currentPage),
        pageSize: (__VLS_ctx.pageSize),
        pageSizes: (__VLS_ctx.pageSizes),
        layout: (__VLS_ctx.paginationLayout),
        total: (__VLS_ctx.total),
        ...(__VLS_ctx.paginationAttrs),
    }, ...__VLS_functionalComponentArgsRest(__VLS_149));
    let __VLS_153;
    const __VLS_154 = {
        ...{ change: {} },
        onChange: (__VLS_ctx.paginationChange),
    };
    var __VLS_151;
    var __VLS_152;
}
// @ts-ignore
[showPagination, currentPage, pageSize, pageSizes, paginationLayout, total, paginationAttrs, paginationChange,];
var __VLS_83;
// @ts-ignore
var __VLS_87 = __VLS_86, __VLS_89 = __VLS_88, __VLS_146 = __VLS_145, __VLS_147 = __VLS_144;
// @ts-ignore
[];
const __VLS_base = (await import('vue')).defineComponent({
    setup: () => __VLS_exposed,
    __typeEmits: {},
    __defaults: __VLS_defaults,
    __typeProps: {},
});
const __VLS_export = {};
export default {};
