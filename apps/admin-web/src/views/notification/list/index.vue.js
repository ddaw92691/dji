/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ref, reactive, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { notificationApi } from '@/api/notification';
defineOptions({ name: 'NotificationListView' });
const loading = ref(false);
const markingAll = ref(false);
const tableData = ref([]);
const total = ref(0);
const unreadCount = ref(0);
const searchForm = reactive({
    page: 1,
    pageSize: 20,
});
async function fetchData() {
    loading.value = true;
    try {
        const { data: res } = await notificationApi.getNotifications({
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
async function fetchUnreadCount() {
    try {
        const { data: res } = await notificationApi.getUnreadCount();
        if (res.code === 200)
            unreadCount.value = res.data || 0;
    }
    catch { /* ignore */ }
}
async function handleRowClick(row) {
    if (row.isRead)
        return;
    try {
        await notificationApi.markAsRead(row.id);
        row.isRead = true;
        unreadCount.value = Math.max(0, unreadCount.value - 1);
    }
    catch {
        // ignore
    }
}
async function handleMarkAllAsRead() {
    markingAll.value = true;
    try {
        const { data: res } = await notificationApi.markAllAsRead();
        if (res.code === 200) {
            tableData.value.forEach((n) => (n.isRead = true));
            unreadCount.value = 0;
            ElMessage.success('已全部标为已读');
        }
        else {
            ElMessage.error(res.message || '操作失败');
        }
    }
    catch {
        ElMessage.error('操作失败');
    }
    finally {
        markingAll.value = false;
    }
}
onMounted(() => {
    fetchData();
    fetchUnreadCount();
});
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['page-header']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "notification-page" },
});
/** @type {__VLS_StyleScopedClasses['notification-page']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "page-header" },
});
/** @type {__VLS_StyleScopedClasses['page-header']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.h2, __VLS_intrinsics.h2)({});
let __VLS_0;
/** @ts-ignore @type { | typeof __VLS_components.elBadge | typeof __VLS_components.ElBadge | typeof __VLS_components['el-badge'] | typeof __VLS_components.elBadge | typeof __VLS_components.ElBadge | typeof __VLS_components['el-badge']} */
elBadge;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    value: (__VLS_ctx.unreadCount),
    hidden: (__VLS_ctx.unreadCount === 0),
    ...{ class: "unread-badge" },
}));
const __VLS_2 = __VLS_1({
    value: (__VLS_ctx.unreadCount),
    hidden: (__VLS_ctx.unreadCount === 0),
    ...{ class: "unread-badge" },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
/** @type {__VLS_StyleScopedClasses['unread-badge']} */ ;
const { default: __VLS_5 } = __VLS_3.slots;
let __VLS_6;
/** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
elButton;
// @ts-ignore
const __VLS_7 = __VLS_asFunctionalComponent1(__VLS_6, new __VLS_6({
    ...{ 'onClick': {} },
    type: "primary",
    loading: (__VLS_ctx.markingAll),
}));
const __VLS_8 = __VLS_7({
    ...{ 'onClick': {} },
    type: "primary",
    loading: (__VLS_ctx.markingAll),
}, ...__VLS_functionalComponentArgsRest(__VLS_7));
let __VLS_11;
const __VLS_12 = {
    ...{ click: {} },
    onClick: (__VLS_ctx.handleMarkAllAsRead),
};
const { default: __VLS_13 } = __VLS_9.slots;
// @ts-ignore
[unreadCount, unreadCount, markingAll, handleMarkAllAsRead,];
var __VLS_9;
var __VLS_10;
// @ts-ignore
[];
var __VLS_3;
let __VLS_14;
/** @ts-ignore @type { | typeof __VLS_components.elTable | typeof __VLS_components.ElTable | typeof __VLS_components['el-table'] | typeof __VLS_components.elTable | typeof __VLS_components.ElTable | typeof __VLS_components['el-table']} */
elTable;
// @ts-ignore
const __VLS_15 = __VLS_asFunctionalComponent1(__VLS_14, new __VLS_14({
    ...{ 'onRowClick': {} },
    data: (__VLS_ctx.tableData),
    border: true,
    stripe: true,
    ...{ style: {} },
}));
const __VLS_16 = __VLS_15({
    ...{ 'onRowClick': {} },
    data: (__VLS_ctx.tableData),
    border: true,
    stripe: true,
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_15));
let __VLS_19;
const __VLS_20 = {
    ...{ rowClick: {} },
    onRowClick: (__VLS_ctx.handleRowClick),
};
__VLS_asFunctionalDirective(__VLS_directives.vLoading, {})(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.loading) }, null, null);
const { default: __VLS_21 } = __VLS_17.slots;
let __VLS_22;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_23 = __VLS_asFunctionalComponent1(__VLS_22, new __VLS_22({
    prop: "title",
    label: "标题",
    minWidth: "160",
    showOverflowTooltip: true,
}));
const __VLS_24 = __VLS_23({
    prop: "title",
    label: "标题",
    minWidth: "160",
    showOverflowTooltip: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_23));
let __VLS_27;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_28 = __VLS_asFunctionalComponent1(__VLS_27, new __VLS_27({
    prop: "content",
    label: "内容",
    minWidth: "240",
    showOverflowTooltip: true,
}));
const __VLS_29 = __VLS_28({
    prop: "content",
    label: "内容",
    minWidth: "240",
    showOverflowTooltip: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_28));
let __VLS_32;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_33 = __VLS_asFunctionalComponent1(__VLS_32, new __VLS_32({
    label: "类型",
    width: "100",
    align: "center",
}));
const __VLS_34 = __VLS_33({
    label: "类型",
    width: "100",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_33));
const { default: __VLS_37 } = __VLS_35.slots;
{
    const { default: __VLS_38 } = __VLS_35.slots;
    const [{ row }] = __VLS_vSlot(__VLS_38);
    let __VLS_39;
    /** @ts-ignore @type { | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag'] | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag']} */
    elTag;
    // @ts-ignore
    const __VLS_40 = __VLS_asFunctionalComponent1(__VLS_39, new __VLS_39({
        size: "small",
    }));
    const __VLS_41 = __VLS_40({
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_40));
    const { default: __VLS_44 } = __VLS_42.slots;
    (row.type);
    // @ts-ignore
    [tableData, handleRowClick, vLoading, loading,];
    var __VLS_42;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_35;
let __VLS_45;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_46 = __VLS_asFunctionalComponent1(__VLS_45, new __VLS_45({
    label: "已读",
    width: "80",
    align: "center",
}));
const __VLS_47 = __VLS_46({
    label: "已读",
    width: "80",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_46));
const { default: __VLS_50 } = __VLS_48.slots;
{
    const { default: __VLS_51 } = __VLS_48.slots;
    const [{ row }] = __VLS_vSlot(__VLS_51);
    let __VLS_52;
    /** @ts-ignore @type { | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag'] | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag']} */
    elTag;
    // @ts-ignore
    const __VLS_53 = __VLS_asFunctionalComponent1(__VLS_52, new __VLS_52({
        type: (row.isRead ? 'success' : 'danger'),
        size: "small",
    }));
    const __VLS_54 = __VLS_53({
        type: (row.isRead ? 'success' : 'danger'),
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_53));
    const { default: __VLS_57 } = __VLS_55.slots;
    (row.isRead ? 'Read' : 'Unread');
    // @ts-ignore
    [];
    var __VLS_55;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_48;
let __VLS_58;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_59 = __VLS_asFunctionalComponent1(__VLS_58, new __VLS_58({
    label: "用户",
    width: "120",
    showOverflowTooltip: true,
}));
const __VLS_60 = __VLS_59({
    label: "用户",
    width: "120",
    showOverflowTooltip: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_59));
const { default: __VLS_63 } = __VLS_61.slots;
{
    const { default: __VLS_64 } = __VLS_61.slots;
    const [{ row }] = __VLS_vSlot(__VLS_64);
    (row.userName || `ID:${row.userId}`);
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_61;
let __VLS_65;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_66 = __VLS_asFunctionalComponent1(__VLS_65, new __VLS_65({
    prop: "createdAt",
    label: "创建时间",
    width: "160",
}));
const __VLS_67 = __VLS_66({
    prop: "createdAt",
    label: "创建时间",
    width: "160",
}, ...__VLS_functionalComponentArgsRest(__VLS_66));
// @ts-ignore
[];
var __VLS_17;
var __VLS_18;
let __VLS_70;
/** @ts-ignore @type { | typeof __VLS_components.elPagination | typeof __VLS_components.ElPagination | typeof __VLS_components['el-pagination']} */
elPagination;
// @ts-ignore
const __VLS_71 = __VLS_asFunctionalComponent1(__VLS_70, new __VLS_70({
    ...{ 'onChange': {} },
    currentPage: (__VLS_ctx.searchForm.page),
    pageSize: (__VLS_ctx.searchForm.pageSize),
    total: (__VLS_ctx.total),
    pageSizes: ([10, 20, 50, 100]),
    layout: "total, sizes, prev, pager, next",
}));
const __VLS_72 = __VLS_71({
    ...{ 'onChange': {} },
    currentPage: (__VLS_ctx.searchForm.page),
    pageSize: (__VLS_ctx.searchForm.pageSize),
    total: (__VLS_ctx.total),
    pageSizes: ([10, 20, 50, 100]),
    layout: "total, sizes, prev, pager, next",
}, ...__VLS_functionalComponentArgsRest(__VLS_71));
let __VLS_75;
const __VLS_76 = {
    ...{ change: {} },
    onChange: (__VLS_ctx.fetchData),
};
var __VLS_73;
var __VLS_74;
// @ts-ignore
[searchForm, searchForm, total, fetchData,];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
