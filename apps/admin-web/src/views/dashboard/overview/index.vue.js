/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { dashboardApi } from '@/api/dashboard';
import * as echarts from 'echarts';
defineOptions({ name: 'AdminDashboardOverviewView' });
const loading = ref(false);
const salesChartRef = ref(null);
const orderChartRef = ref(null);
const orderStatusChartRef = ref(null);
const userRoleChartRef = ref(null);
const summary = reactive({
    totalUsers: 0,
    totalCustomers: 0,
    totalMerchants: 0,
    totalAgents: 0,
    totalProducts: 0,
    pendingProducts: 0,
    totalOrders: 0,
    paidOrders: 0,
    completedOrders: 0,
    refundRequests: 0,
    pendingRefunds: 0,
    totalSales: 0,
    todayOrders: 0,
    todaySales: 0,
    totalCommission: 0,
    pendingWithdrawals: 0,
    recentOrders: [],
    recentRefunds: [],
});
const chartData = reactive({
    salesTrend: [],
    orderTrend: [],
    orderStatusDistribution: [],
    userRoleDistribution: [],
});
let salesChart = null;
let orderChart = null;
let orderStatusChart = null;
let userRoleChart = null;
function formatAmount(val) {
    return (val ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
function initSalesChart() {
    if (!salesChartRef.value)
        return;
    if (!salesChart)
        salesChart = echarts.init(salesChartRef.value);
    const days = chartData.salesTrend.map((item) => formatChartDate(item.date));
    salesChart.setOption({
        tooltip: { trigger: 'axis' },
        xAxis: { type: 'category', data: days },
        yAxis: { type: 'value' },
        series: [
            {
                name: '销售额',
                type: 'line',
                smooth: true,
                data: chartData.salesTrend.map((item) => Number(item.amount || 0)),
                itemStyle: { color: '#409EFF' },
            },
        ],
    });
}
function initOrderChart() {
    if (!orderChartRef.value)
        return;
    if (!orderChart)
        orderChart = echarts.init(orderChartRef.value);
    const days = chartData.orderTrend.map((item) => formatChartDate(item.date));
    orderChart.setOption({
        tooltip: { trigger: 'axis' },
        xAxis: { type: 'category', data: days },
        yAxis: { type: 'value' },
        series: [
            {
                name: '订单',
                type: 'bar',
                data: chartData.orderTrend.map((item) => Number(item.count || 0)),
                itemStyle: { color: '#67C23A' },
            },
        ],
    });
}
function initOrderStatusChart() {
    if (!orderStatusChartRef.value)
        return;
    if (!orderStatusChart)
        orderStatusChart = echarts.init(orderStatusChartRef.value);
    orderStatusChart.setOption({
        tooltip: { trigger: 'item' },
        series: [
            {
                type: 'pie',
                radius: ['40%', '70%'],
                data: chartData.orderStatusDistribution.map((item) => ({
                    name: translateOrderStatus(item.name),
                    value: Number(item.value || 0),
                })),
            },
        ],
    });
}
function initUserRoleChart() {
    if (!userRoleChartRef.value)
        return;
    if (!userRoleChart)
        userRoleChart = echarts.init(userRoleChartRef.value);
    userRoleChart.setOption({
        tooltip: { trigger: 'item' },
        series: [
            {
                type: 'pie',
                radius: '70%',
                data: chartData.userRoleDistribution
                    .filter((item) => item.name !== 'Agent')
                    .map((item) => ({
                    name: translateUserRole(item.name),
                    value: Number(item.value || 0),
                })),
            },
        ],
    });
}
function formatChartDate(date) {
    if (!date)
        return '';
    const parsed = new Date(date);
    if (Number.isNaN(parsed.getTime()))
        return date;
    return `${parsed.getMonth() + 1}/${parsed.getDate()}`;
}
function translateOrderStatus(status) {
    const map = {
        'Pending Payment': '待支付',
        Paid: '已支付',
        Shipped: '已发货',
        Completed: '已完成',
        Cancelled: '已取消',
    };
    return status ? map[status] || status : '-';
}
function translateUserRole(role) {
    const map = {
        Customer: '客户',
        Merchant: '商家',
        Admin: '管理员',
    };
    return role ? map[role] || role : '-';
}
function initCharts() {
    nextTick(() => {
        initSalesChart();
        initOrderChart();
        initOrderStatusChart();
        initUserRoleChart();
    });
}
window.addEventListener('resize', () => {
    salesChart?.resize();
    orderChart?.resize();
    orderStatusChart?.resize();
    userRoleChart?.resize();
});
async function fetchData() {
    loading.value = true;
    try {
        const [{ data: overviewRes }, { data: chartsRes }] = await Promise.all([
            dashboardApi.getOverview(),
            dashboardApi.getCharts(),
        ]);
        if (overviewRes.code === 200 && overviewRes.data) {
            Object.assign(summary, overviewRes.data);
        }
        if (chartsRes.code === 200 && chartsRes.data) {
            Object.assign(chartData, chartsRes.data);
        }
        initCharts();
    }
    finally {
        loading.value = false;
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
/** @type {__VLS_StyleScopedClasses['stat-value']} */ ;
/** @type {__VLS_StyleScopedClasses['stat-value']} */ ;
/** @type {__VLS_StyleScopedClasses['stat-value']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "dashboard-overview" },
});
/** @type {__VLS_StyleScopedClasses['dashboard-overview']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "page-header" },
});
/** @type {__VLS_StyleScopedClasses['page-header']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.h2, __VLS_intrinsics.h2)({});
let __VLS_0;
/** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
elButton;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    ...{ 'onClick': {} },
    type: "primary",
    loading: (__VLS_ctx.loading),
}));
const __VLS_2 = __VLS_1({
    ...{ 'onClick': {} },
    type: "primary",
    loading: (__VLS_ctx.loading),
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
let __VLS_5;
const __VLS_6 = {
    ...{ click: {} },
    onClick: (__VLS_ctx.fetchData),
};
const { default: __VLS_7 } = __VLS_3.slots;
// @ts-ignore
[loading, fetchData,];
var __VLS_3;
var __VLS_4;
let __VLS_8;
/** @ts-ignore @type { | typeof __VLS_components.elRow | typeof __VLS_components.ElRow | typeof __VLS_components['el-row'] | typeof __VLS_components.elRow | typeof __VLS_components.ElRow | typeof __VLS_components['el-row']} */
elRow;
// @ts-ignore
const __VLS_9 = __VLS_asFunctionalComponent1(__VLS_8, new __VLS_8({
    gutter: (16),
    ...{ class: "stats-row" },
}));
const __VLS_10 = __VLS_9({
    gutter: (16),
    ...{ class: "stats-row" },
}, ...__VLS_functionalComponentArgsRest(__VLS_9));
/** @type {__VLS_StyleScopedClasses['stats-row']} */ ;
const { default: __VLS_13 } = __VLS_11.slots;
let __VLS_14;
/** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
elCol;
// @ts-ignore
const __VLS_15 = __VLS_asFunctionalComponent1(__VLS_14, new __VLS_14({
    xs: (12),
    sm: (8),
    md: (4),
}));
const __VLS_16 = __VLS_15({
    xs: (12),
    sm: (8),
    md: (4),
}, ...__VLS_functionalComponentArgsRest(__VLS_15));
const { default: __VLS_19 } = __VLS_17.slots;
let __VLS_20;
/** @ts-ignore @type { | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card'] | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card']} */
elCard;
// @ts-ignore
const __VLS_21 = __VLS_asFunctionalComponent1(__VLS_20, new __VLS_20({
    shadow: "hover",
    ...{ class: "stat-card" },
}));
const __VLS_22 = __VLS_21({
    shadow: "hover",
    ...{ class: "stat-card" },
}, ...__VLS_functionalComponentArgsRest(__VLS_21));
/** @type {__VLS_StyleScopedClasses['stat-card']} */ ;
const { default: __VLS_25 } = __VLS_23.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "stat-label" },
});
/** @type {__VLS_StyleScopedClasses['stat-label']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "stat-value" },
});
/** @type {__VLS_StyleScopedClasses['stat-value']} */ ;
(__VLS_ctx.summary.totalUsers);
// @ts-ignore
[summary,];
var __VLS_23;
// @ts-ignore
[];
var __VLS_17;
let __VLS_26;
/** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
elCol;
// @ts-ignore
const __VLS_27 = __VLS_asFunctionalComponent1(__VLS_26, new __VLS_26({
    xs: (12),
    sm: (8),
    md: (4),
}));
const __VLS_28 = __VLS_27({
    xs: (12),
    sm: (8),
    md: (4),
}, ...__VLS_functionalComponentArgsRest(__VLS_27));
const { default: __VLS_31 } = __VLS_29.slots;
let __VLS_32;
/** @ts-ignore @type { | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card'] | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card']} */
elCard;
// @ts-ignore
const __VLS_33 = __VLS_asFunctionalComponent1(__VLS_32, new __VLS_32({
    shadow: "hover",
    ...{ class: "stat-card" },
}));
const __VLS_34 = __VLS_33({
    shadow: "hover",
    ...{ class: "stat-card" },
}, ...__VLS_functionalComponentArgsRest(__VLS_33));
/** @type {__VLS_StyleScopedClasses['stat-card']} */ ;
const { default: __VLS_37 } = __VLS_35.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "stat-label" },
});
/** @type {__VLS_StyleScopedClasses['stat-label']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "stat-value" },
});
/** @type {__VLS_StyleScopedClasses['stat-value']} */ ;
(__VLS_ctx.summary.totalCustomers);
// @ts-ignore
[summary,];
var __VLS_35;
// @ts-ignore
[];
var __VLS_29;
let __VLS_38;
/** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
elCol;
// @ts-ignore
const __VLS_39 = __VLS_asFunctionalComponent1(__VLS_38, new __VLS_38({
    xs: (12),
    sm: (8),
    md: (4),
}));
const __VLS_40 = __VLS_39({
    xs: (12),
    sm: (8),
    md: (4),
}, ...__VLS_functionalComponentArgsRest(__VLS_39));
const { default: __VLS_43 } = __VLS_41.slots;
let __VLS_44;
/** @ts-ignore @type { | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card'] | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card']} */
elCard;
// @ts-ignore
const __VLS_45 = __VLS_asFunctionalComponent1(__VLS_44, new __VLS_44({
    shadow: "hover",
    ...{ class: "stat-card" },
}));
const __VLS_46 = __VLS_45({
    shadow: "hover",
    ...{ class: "stat-card" },
}, ...__VLS_functionalComponentArgsRest(__VLS_45));
/** @type {__VLS_StyleScopedClasses['stat-card']} */ ;
const { default: __VLS_49 } = __VLS_47.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "stat-label" },
});
/** @type {__VLS_StyleScopedClasses['stat-label']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "stat-value" },
});
/** @type {__VLS_StyleScopedClasses['stat-value']} */ ;
(__VLS_ctx.summary.totalMerchants);
// @ts-ignore
[summary,];
var __VLS_47;
// @ts-ignore
[];
var __VLS_41;
let __VLS_50;
/** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
elCol;
// @ts-ignore
const __VLS_51 = __VLS_asFunctionalComponent1(__VLS_50, new __VLS_50({
    xs: (12),
    sm: (8),
    md: (4),
}));
const __VLS_52 = __VLS_51({
    xs: (12),
    sm: (8),
    md: (4),
}, ...__VLS_functionalComponentArgsRest(__VLS_51));
const { default: __VLS_55 } = __VLS_53.slots;
let __VLS_56;
/** @ts-ignore @type { | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card'] | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card']} */
elCard;
// @ts-ignore
const __VLS_57 = __VLS_asFunctionalComponent1(__VLS_56, new __VLS_56({
    shadow: "hover",
    ...{ class: "stat-card" },
}));
const __VLS_58 = __VLS_57({
    shadow: "hover",
    ...{ class: "stat-card" },
}, ...__VLS_functionalComponentArgsRest(__VLS_57));
/** @type {__VLS_StyleScopedClasses['stat-card']} */ ;
const { default: __VLS_61 } = __VLS_59.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "stat-label" },
});
/** @type {__VLS_StyleScopedClasses['stat-label']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "stat-value" },
});
/** @type {__VLS_StyleScopedClasses['stat-value']} */ ;
(__VLS_ctx.summary.todayOrders);
// @ts-ignore
[summary,];
var __VLS_59;
// @ts-ignore
[];
var __VLS_53;
let __VLS_62;
/** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
elCol;
// @ts-ignore
const __VLS_63 = __VLS_asFunctionalComponent1(__VLS_62, new __VLS_62({
    xs: (12),
    sm: (8),
    md: (4),
}));
const __VLS_64 = __VLS_63({
    xs: (12),
    sm: (8),
    md: (4),
}, ...__VLS_functionalComponentArgsRest(__VLS_63));
const { default: __VLS_67 } = __VLS_65.slots;
let __VLS_68;
/** @ts-ignore @type { | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card'] | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card']} */
elCard;
// @ts-ignore
const __VLS_69 = __VLS_asFunctionalComponent1(__VLS_68, new __VLS_68({
    shadow: "hover",
    ...{ class: "stat-card" },
}));
const __VLS_70 = __VLS_69({
    shadow: "hover",
    ...{ class: "stat-card" },
}, ...__VLS_functionalComponentArgsRest(__VLS_69));
/** @type {__VLS_StyleScopedClasses['stat-card']} */ ;
const { default: __VLS_73 } = __VLS_71.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "stat-label" },
});
/** @type {__VLS_StyleScopedClasses['stat-label']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "stat-value" },
});
/** @type {__VLS_StyleScopedClasses['stat-value']} */ ;
(__VLS_ctx.summary.totalProducts);
// @ts-ignore
[summary,];
var __VLS_71;
// @ts-ignore
[];
var __VLS_65;
let __VLS_74;
/** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
elCol;
// @ts-ignore
const __VLS_75 = __VLS_asFunctionalComponent1(__VLS_74, new __VLS_74({
    xs: (12),
    sm: (8),
    md: (4),
}));
const __VLS_76 = __VLS_75({
    xs: (12),
    sm: (8),
    md: (4),
}, ...__VLS_functionalComponentArgsRest(__VLS_75));
const { default: __VLS_79 } = __VLS_77.slots;
let __VLS_80;
/** @ts-ignore @type { | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card'] | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card']} */
elCard;
// @ts-ignore
const __VLS_81 = __VLS_asFunctionalComponent1(__VLS_80, new __VLS_80({
    shadow: "hover",
    ...{ class: "stat-card pending-card" },
}));
const __VLS_82 = __VLS_81({
    shadow: "hover",
    ...{ class: "stat-card pending-card" },
}, ...__VLS_functionalComponentArgsRest(__VLS_81));
/** @type {__VLS_StyleScopedClasses['stat-card']} */ ;
/** @type {__VLS_StyleScopedClasses['pending-card']} */ ;
const { default: __VLS_85 } = __VLS_83.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "stat-label" },
});
/** @type {__VLS_StyleScopedClasses['stat-label']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "stat-value" },
});
/** @type {__VLS_StyleScopedClasses['stat-value']} */ ;
(__VLS_ctx.summary.pendingProducts);
// @ts-ignore
[summary,];
var __VLS_83;
// @ts-ignore
[];
var __VLS_77;
// @ts-ignore
[];
var __VLS_11;
let __VLS_86;
/** @ts-ignore @type { | typeof __VLS_components.elRow | typeof __VLS_components.ElRow | typeof __VLS_components['el-row'] | typeof __VLS_components.elRow | typeof __VLS_components.ElRow | typeof __VLS_components['el-row']} */
elRow;
// @ts-ignore
const __VLS_87 = __VLS_asFunctionalComponent1(__VLS_86, new __VLS_86({
    gutter: (16),
    ...{ class: "stats-row" },
}));
const __VLS_88 = __VLS_87({
    gutter: (16),
    ...{ class: "stats-row" },
}, ...__VLS_functionalComponentArgsRest(__VLS_87));
/** @type {__VLS_StyleScopedClasses['stats-row']} */ ;
const { default: __VLS_91 } = __VLS_89.slots;
let __VLS_92;
/** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
elCol;
// @ts-ignore
const __VLS_93 = __VLS_asFunctionalComponent1(__VLS_92, new __VLS_92({
    xs: (12),
    sm: (6),
}));
const __VLS_94 = __VLS_93({
    xs: (12),
    sm: (6),
}, ...__VLS_functionalComponentArgsRest(__VLS_93));
const { default: __VLS_97 } = __VLS_95.slots;
let __VLS_98;
/** @ts-ignore @type { | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card'] | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card']} */
elCard;
// @ts-ignore
const __VLS_99 = __VLS_asFunctionalComponent1(__VLS_98, new __VLS_98({
    shadow: "hover",
    ...{ class: "stat-card" },
}));
const __VLS_100 = __VLS_99({
    shadow: "hover",
    ...{ class: "stat-card" },
}, ...__VLS_functionalComponentArgsRest(__VLS_99));
/** @type {__VLS_StyleScopedClasses['stat-card']} */ ;
const { default: __VLS_103 } = __VLS_101.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "stat-label" },
});
/** @type {__VLS_StyleScopedClasses['stat-label']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "stat-value" },
});
/** @type {__VLS_StyleScopedClasses['stat-value']} */ ;
(__VLS_ctx.summary.totalOrders);
// @ts-ignore
[summary,];
var __VLS_101;
// @ts-ignore
[];
var __VLS_95;
let __VLS_104;
/** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
elCol;
// @ts-ignore
const __VLS_105 = __VLS_asFunctionalComponent1(__VLS_104, new __VLS_104({
    xs: (12),
    sm: (6),
}));
const __VLS_106 = __VLS_105({
    xs: (12),
    sm: (6),
}, ...__VLS_functionalComponentArgsRest(__VLS_105));
const { default: __VLS_109 } = __VLS_107.slots;
let __VLS_110;
/** @ts-ignore @type { | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card'] | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card']} */
elCard;
// @ts-ignore
const __VLS_111 = __VLS_asFunctionalComponent1(__VLS_110, new __VLS_110({
    shadow: "hover",
    ...{ class: "stat-card" },
}));
const __VLS_112 = __VLS_111({
    shadow: "hover",
    ...{ class: "stat-card" },
}, ...__VLS_functionalComponentArgsRest(__VLS_111));
/** @type {__VLS_StyleScopedClasses['stat-card']} */ ;
const { default: __VLS_115 } = __VLS_113.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "stat-label" },
});
/** @type {__VLS_StyleScopedClasses['stat-label']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "stat-value" },
});
/** @type {__VLS_StyleScopedClasses['stat-value']} */ ;
(__VLS_ctx.summary.paidOrders);
// @ts-ignore
[summary,];
var __VLS_113;
// @ts-ignore
[];
var __VLS_107;
let __VLS_116;
/** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
elCol;
// @ts-ignore
const __VLS_117 = __VLS_asFunctionalComponent1(__VLS_116, new __VLS_116({
    xs: (12),
    sm: (6),
}));
const __VLS_118 = __VLS_117({
    xs: (12),
    sm: (6),
}, ...__VLS_functionalComponentArgsRest(__VLS_117));
const { default: __VLS_121 } = __VLS_119.slots;
let __VLS_122;
/** @ts-ignore @type { | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card'] | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card']} */
elCard;
// @ts-ignore
const __VLS_123 = __VLS_asFunctionalComponent1(__VLS_122, new __VLS_122({
    shadow: "hover",
    ...{ class: "stat-card" },
}));
const __VLS_124 = __VLS_123({
    shadow: "hover",
    ...{ class: "stat-card" },
}, ...__VLS_functionalComponentArgsRest(__VLS_123));
/** @type {__VLS_StyleScopedClasses['stat-card']} */ ;
const { default: __VLS_127 } = __VLS_125.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "stat-label" },
});
/** @type {__VLS_StyleScopedClasses['stat-label']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "stat-value" },
});
/** @type {__VLS_StyleScopedClasses['stat-value']} */ ;
(__VLS_ctx.summary.completedOrders);
// @ts-ignore
[summary,];
var __VLS_125;
// @ts-ignore
[];
var __VLS_119;
let __VLS_128;
/** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
elCol;
// @ts-ignore
const __VLS_129 = __VLS_asFunctionalComponent1(__VLS_128, new __VLS_128({
    xs: (12),
    sm: (6),
}));
const __VLS_130 = __VLS_129({
    xs: (12),
    sm: (6),
}, ...__VLS_functionalComponentArgsRest(__VLS_129));
const { default: __VLS_133 } = __VLS_131.slots;
let __VLS_134;
/** @ts-ignore @type { | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card'] | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card']} */
elCard;
// @ts-ignore
const __VLS_135 = __VLS_asFunctionalComponent1(__VLS_134, new __VLS_134({
    shadow: "hover",
    ...{ class: "stat-card warn-card" },
}));
const __VLS_136 = __VLS_135({
    shadow: "hover",
    ...{ class: "stat-card warn-card" },
}, ...__VLS_functionalComponentArgsRest(__VLS_135));
/** @type {__VLS_StyleScopedClasses['stat-card']} */ ;
/** @type {__VLS_StyleScopedClasses['warn-card']} */ ;
const { default: __VLS_139 } = __VLS_137.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "stat-label" },
});
/** @type {__VLS_StyleScopedClasses['stat-label']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "stat-value" },
});
/** @type {__VLS_StyleScopedClasses['stat-value']} */ ;
(__VLS_ctx.summary.refundRequests || __VLS_ctx.summary.pendingRefunds);
// @ts-ignore
[summary, summary,];
var __VLS_137;
// @ts-ignore
[];
var __VLS_131;
// @ts-ignore
[];
var __VLS_89;
let __VLS_140;
/** @ts-ignore @type { | typeof __VLS_components.elRow | typeof __VLS_components.ElRow | typeof __VLS_components['el-row'] | typeof __VLS_components.elRow | typeof __VLS_components.ElRow | typeof __VLS_components['el-row']} */
elRow;
// @ts-ignore
const __VLS_141 = __VLS_asFunctionalComponent1(__VLS_140, new __VLS_140({
    gutter: (16),
    ...{ class: "stats-row" },
}));
const __VLS_142 = __VLS_141({
    gutter: (16),
    ...{ class: "stats-row" },
}, ...__VLS_functionalComponentArgsRest(__VLS_141));
/** @type {__VLS_StyleScopedClasses['stats-row']} */ ;
const { default: __VLS_145 } = __VLS_143.slots;
let __VLS_146;
/** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
elCol;
// @ts-ignore
const __VLS_147 = __VLS_asFunctionalComponent1(__VLS_146, new __VLS_146({
    xs: (12),
    sm: (6),
}));
const __VLS_148 = __VLS_147({
    xs: (12),
    sm: (6),
}, ...__VLS_functionalComponentArgsRest(__VLS_147));
const { default: __VLS_151 } = __VLS_149.slots;
let __VLS_152;
/** @ts-ignore @type { | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card'] | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card']} */
elCard;
// @ts-ignore
const __VLS_153 = __VLS_asFunctionalComponent1(__VLS_152, new __VLS_152({
    shadow: "hover",
    ...{ class: "stat-card" },
}));
const __VLS_154 = __VLS_153({
    shadow: "hover",
    ...{ class: "stat-card" },
}, ...__VLS_functionalComponentArgsRest(__VLS_153));
/** @type {__VLS_StyleScopedClasses['stat-card']} */ ;
const { default: __VLS_157 } = __VLS_155.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "stat-label" },
});
/** @type {__VLS_StyleScopedClasses['stat-label']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "stat-value green" },
});
/** @type {__VLS_StyleScopedClasses['stat-value']} */ ;
/** @type {__VLS_StyleScopedClasses['green']} */ ;
(__VLS_ctx.formatAmount(__VLS_ctx.summary.totalSales));
// @ts-ignore
[summary, formatAmount,];
var __VLS_155;
// @ts-ignore
[];
var __VLS_149;
let __VLS_158;
/** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
elCol;
// @ts-ignore
const __VLS_159 = __VLS_asFunctionalComponent1(__VLS_158, new __VLS_158({
    xs: (12),
    sm: (6),
}));
const __VLS_160 = __VLS_159({
    xs: (12),
    sm: (6),
}, ...__VLS_functionalComponentArgsRest(__VLS_159));
const { default: __VLS_163 } = __VLS_161.slots;
let __VLS_164;
/** @ts-ignore @type { | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card'] | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card']} */
elCard;
// @ts-ignore
const __VLS_165 = __VLS_asFunctionalComponent1(__VLS_164, new __VLS_164({
    shadow: "hover",
    ...{ class: "stat-card" },
}));
const __VLS_166 = __VLS_165({
    shadow: "hover",
    ...{ class: "stat-card" },
}, ...__VLS_functionalComponentArgsRest(__VLS_165));
/** @type {__VLS_StyleScopedClasses['stat-card']} */ ;
const { default: __VLS_169 } = __VLS_167.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "stat-label" },
});
/** @type {__VLS_StyleScopedClasses['stat-label']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "stat-value" },
});
/** @type {__VLS_StyleScopedClasses['stat-value']} */ ;
(__VLS_ctx.formatAmount(__VLS_ctx.summary.todaySales));
// @ts-ignore
[summary, formatAmount,];
var __VLS_167;
// @ts-ignore
[];
var __VLS_161;
let __VLS_170;
/** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
elCol;
// @ts-ignore
const __VLS_171 = __VLS_asFunctionalComponent1(__VLS_170, new __VLS_170({
    xs: (12),
    sm: (6),
}));
const __VLS_172 = __VLS_171({
    xs: (12),
    sm: (6),
}, ...__VLS_functionalComponentArgsRest(__VLS_171));
const { default: __VLS_175 } = __VLS_173.slots;
let __VLS_176;
/** @ts-ignore @type { | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card'] | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card']} */
elCard;
// @ts-ignore
const __VLS_177 = __VLS_asFunctionalComponent1(__VLS_176, new __VLS_176({
    shadow: "hover",
    ...{ class: "stat-card" },
}));
const __VLS_178 = __VLS_177({
    shadow: "hover",
    ...{ class: "stat-card" },
}, ...__VLS_functionalComponentArgsRest(__VLS_177));
/** @type {__VLS_StyleScopedClasses['stat-card']} */ ;
const { default: __VLS_181 } = __VLS_179.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "stat-label" },
});
/** @type {__VLS_StyleScopedClasses['stat-label']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "stat-value" },
});
/** @type {__VLS_StyleScopedClasses['stat-value']} */ ;
(__VLS_ctx.formatAmount(__VLS_ctx.summary.totalCommission));
// @ts-ignore
[summary, formatAmount,];
var __VLS_179;
// @ts-ignore
[];
var __VLS_173;
let __VLS_182;
/** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
elCol;
// @ts-ignore
const __VLS_183 = __VLS_asFunctionalComponent1(__VLS_182, new __VLS_182({
    xs: (12),
    sm: (6),
}));
const __VLS_184 = __VLS_183({
    xs: (12),
    sm: (6),
}, ...__VLS_functionalComponentArgsRest(__VLS_183));
const { default: __VLS_187 } = __VLS_185.slots;
let __VLS_188;
/** @ts-ignore @type { | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card'] | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card']} */
elCard;
// @ts-ignore
const __VLS_189 = __VLS_asFunctionalComponent1(__VLS_188, new __VLS_188({
    shadow: "hover",
    ...{ class: "stat-card warn-card" },
}));
const __VLS_190 = __VLS_189({
    shadow: "hover",
    ...{ class: "stat-card warn-card" },
}, ...__VLS_functionalComponentArgsRest(__VLS_189));
/** @type {__VLS_StyleScopedClasses['stat-card']} */ ;
/** @type {__VLS_StyleScopedClasses['warn-card']} */ ;
const { default: __VLS_193 } = __VLS_191.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "stat-label" },
});
/** @type {__VLS_StyleScopedClasses['stat-label']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "stat-value" },
});
/** @type {__VLS_StyleScopedClasses['stat-value']} */ ;
(__VLS_ctx.summary.pendingWithdrawals);
// @ts-ignore
[summary,];
var __VLS_191;
// @ts-ignore
[];
var __VLS_185;
// @ts-ignore
[];
var __VLS_143;
let __VLS_194;
/** @ts-ignore @type { | typeof __VLS_components.elRow | typeof __VLS_components.ElRow | typeof __VLS_components['el-row'] | typeof __VLS_components.elRow | typeof __VLS_components.ElRow | typeof __VLS_components['el-row']} */
elRow;
// @ts-ignore
const __VLS_195 = __VLS_asFunctionalComponent1(__VLS_194, new __VLS_194({
    gutter: (16),
    ...{ class: "tables-row" },
}));
const __VLS_196 = __VLS_195({
    gutter: (16),
    ...{ class: "tables-row" },
}, ...__VLS_functionalComponentArgsRest(__VLS_195));
/** @type {__VLS_StyleScopedClasses['tables-row']} */ ;
const { default: __VLS_199 } = __VLS_197.slots;
let __VLS_200;
/** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
elCol;
// @ts-ignore
const __VLS_201 = __VLS_asFunctionalComponent1(__VLS_200, new __VLS_200({
    span: (12),
}));
const __VLS_202 = __VLS_201({
    span: (12),
}, ...__VLS_functionalComponentArgsRest(__VLS_201));
const { default: __VLS_205 } = __VLS_203.slots;
let __VLS_206;
/** @ts-ignore @type { | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card'] | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card']} */
elCard;
// @ts-ignore
const __VLS_207 = __VLS_asFunctionalComponent1(__VLS_206, new __VLS_206({
    shadow: "hover",
    ...{ class: "section-card" },
}));
const __VLS_208 = __VLS_207({
    shadow: "hover",
    ...{ class: "section-card" },
}, ...__VLS_functionalComponentArgsRest(__VLS_207));
/** @type {__VLS_StyleScopedClasses['section-card']} */ ;
const { default: __VLS_211 } = __VLS_209.slots;
{
    const { header: __VLS_212 } = __VLS_209.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "section-title" },
    });
    /** @type {__VLS_StyleScopedClasses['section-title']} */ ;
    // @ts-ignore
    [];
}
let __VLS_213;
/** @ts-ignore @type { | typeof __VLS_components.elTable | typeof __VLS_components.ElTable | typeof __VLS_components['el-table'] | typeof __VLS_components.elTable | typeof __VLS_components.ElTable | typeof __VLS_components['el-table']} */
elTable;
// @ts-ignore
const __VLS_214 = __VLS_asFunctionalComponent1(__VLS_213, new __VLS_213({
    data: (__VLS_ctx.summary.recentOrders || []),
    border: true,
    size: "small",
}));
const __VLS_215 = __VLS_214({
    data: (__VLS_ctx.summary.recentOrders || []),
    border: true,
    size: "small",
}, ...__VLS_functionalComponentArgsRest(__VLS_214));
const { default: __VLS_218 } = __VLS_216.slots;
let __VLS_219;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_220 = __VLS_asFunctionalComponent1(__VLS_219, new __VLS_219({
    prop: "orderNo",
    label: "订单号",
    minWidth: "140",
    showOverflowTooltip: true,
}));
const __VLS_221 = __VLS_220({
    prop: "orderNo",
    label: "订单号",
    minWidth: "140",
    showOverflowTooltip: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_220));
let __VLS_224;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_225 = __VLS_asFunctionalComponent1(__VLS_224, new __VLS_224({
    label: "客户",
    minWidth: "100",
    showOverflowTooltip: true,
}));
const __VLS_226 = __VLS_225({
    label: "客户",
    minWidth: "100",
    showOverflowTooltip: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_225));
const { default: __VLS_229 } = __VLS_227.slots;
{
    const { default: __VLS_230 } = __VLS_227.slots;
    const [{ row }] = __VLS_vSlot(__VLS_230);
    (row.userName || '-');
    // @ts-ignore
    [summary,];
}
// @ts-ignore
[];
var __VLS_227;
let __VLS_231;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_232 = __VLS_asFunctionalComponent1(__VLS_231, new __VLS_231({
    prop: "payAmount",
    label: "金额",
    width: "90",
    align: "right",
}));
const __VLS_233 = __VLS_232({
    prop: "payAmount",
    label: "金额",
    width: "90",
    align: "right",
}, ...__VLS_functionalComponentArgsRest(__VLS_232));
let __VLS_236;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_237 = __VLS_asFunctionalComponent1(__VLS_236, new __VLS_236({
    label: "状态",
    width: "100",
    align: "center",
}));
const __VLS_238 = __VLS_237({
    label: "状态",
    width: "100",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_237));
const { default: __VLS_241 } = __VLS_239.slots;
{
    const { default: __VLS_242 } = __VLS_239.slots;
    const [{ row }] = __VLS_vSlot(__VLS_242);
    let __VLS_243;
    /** @ts-ignore @type { | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag'] | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag']} */
    elTag;
    // @ts-ignore
    const __VLS_244 = __VLS_asFunctionalComponent1(__VLS_243, new __VLS_243({
        size: "small",
    }));
    const __VLS_245 = __VLS_244({
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_244));
    const { default: __VLS_248 } = __VLS_246.slots;
    (row.status);
    // @ts-ignore
    [];
    var __VLS_246;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_239;
let __VLS_249;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_250 = __VLS_asFunctionalComponent1(__VLS_249, new __VLS_249({
    prop: "createdAt",
    label: "创建时间",
    width: "160",
}));
const __VLS_251 = __VLS_250({
    prop: "createdAt",
    label: "创建时间",
    width: "160",
}, ...__VLS_functionalComponentArgsRest(__VLS_250));
// @ts-ignore
[];
var __VLS_216;
// @ts-ignore
[];
var __VLS_209;
// @ts-ignore
[];
var __VLS_203;
let __VLS_254;
/** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
elCol;
// @ts-ignore
const __VLS_255 = __VLS_asFunctionalComponent1(__VLS_254, new __VLS_254({
    span: (12),
}));
const __VLS_256 = __VLS_255({
    span: (12),
}, ...__VLS_functionalComponentArgsRest(__VLS_255));
const { default: __VLS_259 } = __VLS_257.slots;
let __VLS_260;
/** @ts-ignore @type { | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card'] | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card']} */
elCard;
// @ts-ignore
const __VLS_261 = __VLS_asFunctionalComponent1(__VLS_260, new __VLS_260({
    shadow: "hover",
    ...{ class: "section-card" },
}));
const __VLS_262 = __VLS_261({
    shadow: "hover",
    ...{ class: "section-card" },
}, ...__VLS_functionalComponentArgsRest(__VLS_261));
/** @type {__VLS_StyleScopedClasses['section-card']} */ ;
const { default: __VLS_265 } = __VLS_263.slots;
{
    const { header: __VLS_266 } = __VLS_263.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "section-title" },
    });
    /** @type {__VLS_StyleScopedClasses['section-title']} */ ;
    // @ts-ignore
    [];
}
let __VLS_267;
/** @ts-ignore @type { | typeof __VLS_components.elTable | typeof __VLS_components.ElTable | typeof __VLS_components['el-table'] | typeof __VLS_components.elTable | typeof __VLS_components.ElTable | typeof __VLS_components['el-table']} */
elTable;
// @ts-ignore
const __VLS_268 = __VLS_asFunctionalComponent1(__VLS_267, new __VLS_267({
    data: (__VLS_ctx.summary.recentRefunds || []),
    border: true,
    size: "small",
}));
const __VLS_269 = __VLS_268({
    data: (__VLS_ctx.summary.recentRefunds || []),
    border: true,
    size: "small",
}, ...__VLS_functionalComponentArgsRest(__VLS_268));
const { default: __VLS_272 } = __VLS_270.slots;
let __VLS_273;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_274 = __VLS_asFunctionalComponent1(__VLS_273, new __VLS_273({
    prop: "orderNo",
    label: "订单号",
    minWidth: "140",
    showOverflowTooltip: true,
}));
const __VLS_275 = __VLS_274({
    prop: "orderNo",
    label: "订单号",
    minWidth: "140",
    showOverflowTooltip: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_274));
let __VLS_278;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_279 = __VLS_asFunctionalComponent1(__VLS_278, new __VLS_278({
    label: "客户",
    minWidth: "100",
    showOverflowTooltip: true,
}));
const __VLS_280 = __VLS_279({
    label: "客户",
    minWidth: "100",
    showOverflowTooltip: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_279));
const { default: __VLS_283 } = __VLS_281.slots;
{
    const { default: __VLS_284 } = __VLS_281.slots;
    const [{ row }] = __VLS_vSlot(__VLS_284);
    (row.userName || '-');
    // @ts-ignore
    [summary,];
}
// @ts-ignore
[];
var __VLS_281;
let __VLS_285;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_286 = __VLS_asFunctionalComponent1(__VLS_285, new __VLS_285({
    prop: "refundAmount",
    label: "金额",
    width: "90",
    align: "right",
}));
const __VLS_287 = __VLS_286({
    prop: "refundAmount",
    label: "金额",
    width: "90",
    align: "right",
}, ...__VLS_functionalComponentArgsRest(__VLS_286));
let __VLS_290;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_291 = __VLS_asFunctionalComponent1(__VLS_290, new __VLS_290({
    label: "状态",
    width: "100",
    align: "center",
}));
const __VLS_292 = __VLS_291({
    label: "状态",
    width: "100",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_291));
const { default: __VLS_295 } = __VLS_293.slots;
{
    const { default: __VLS_296 } = __VLS_293.slots;
    const [{ row }] = __VLS_vSlot(__VLS_296);
    let __VLS_297;
    /** @ts-ignore @type { | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag'] | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag']} */
    elTag;
    // @ts-ignore
    const __VLS_298 = __VLS_asFunctionalComponent1(__VLS_297, new __VLS_297({
        size: "small",
        type: (row.refundStatus === 'REQUESTED'
            ? 'warning'
            : row.refundStatus === 'APPROVED'
                ? 'success'
                : 'danger'),
    }));
    const __VLS_299 = __VLS_298({
        size: "small",
        type: (row.refundStatus === 'REQUESTED'
            ? 'warning'
            : row.refundStatus === 'APPROVED'
                ? 'success'
                : 'danger'),
    }, ...__VLS_functionalComponentArgsRest(__VLS_298));
    const { default: __VLS_302 } = __VLS_300.slots;
    (row.refundStatus);
    // @ts-ignore
    [];
    var __VLS_300;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_293;
let __VLS_303;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_304 = __VLS_asFunctionalComponent1(__VLS_303, new __VLS_303({
    prop: "createdAt",
    label: "创建时间",
    width: "160",
}));
const __VLS_305 = __VLS_304({
    prop: "createdAt",
    label: "创建时间",
    width: "160",
}, ...__VLS_functionalComponentArgsRest(__VLS_304));
// @ts-ignore
[];
var __VLS_270;
// @ts-ignore
[];
var __VLS_263;
// @ts-ignore
[];
var __VLS_257;
// @ts-ignore
[];
var __VLS_197;
let __VLS_308;
/** @ts-ignore @type { | typeof __VLS_components.elRow | typeof __VLS_components.ElRow | typeof __VLS_components['el-row'] | typeof __VLS_components.elRow | typeof __VLS_components.ElRow | typeof __VLS_components['el-row']} */
elRow;
// @ts-ignore
const __VLS_309 = __VLS_asFunctionalComponent1(__VLS_308, new __VLS_308({
    gutter: (16),
    ...{ class: "charts-row" },
}));
const __VLS_310 = __VLS_309({
    gutter: (16),
    ...{ class: "charts-row" },
}, ...__VLS_functionalComponentArgsRest(__VLS_309));
/** @type {__VLS_StyleScopedClasses['charts-row']} */ ;
const { default: __VLS_313 } = __VLS_311.slots;
let __VLS_314;
/** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
elCol;
// @ts-ignore
const __VLS_315 = __VLS_asFunctionalComponent1(__VLS_314, new __VLS_314({
    span: (12),
}));
const __VLS_316 = __VLS_315({
    span: (12),
}, ...__VLS_functionalComponentArgsRest(__VLS_315));
const { default: __VLS_319 } = __VLS_317.slots;
let __VLS_320;
/** @ts-ignore @type { | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card'] | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card']} */
elCard;
// @ts-ignore
const __VLS_321 = __VLS_asFunctionalComponent1(__VLS_320, new __VLS_320({
    shadow: "hover",
    ...{ class: "section-card" },
}));
const __VLS_322 = __VLS_321({
    shadow: "hover",
    ...{ class: "section-card" },
}, ...__VLS_functionalComponentArgsRest(__VLS_321));
/** @type {__VLS_StyleScopedClasses['section-card']} */ ;
const { default: __VLS_325 } = __VLS_323.slots;
{
    const { header: __VLS_326 } = __VLS_323.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "section-title" },
    });
    /** @type {__VLS_StyleScopedClasses['section-title']} */ ;
    // @ts-ignore
    [];
}
__VLS_asFunctionalElement1(__VLS_intrinsics.div)({
    ref: "salesChartRef",
    ...{ class: "chart-box" },
});
/** @type {__VLS_StyleScopedClasses['chart-box']} */ ;
// @ts-ignore
[];
var __VLS_323;
// @ts-ignore
[];
var __VLS_317;
let __VLS_327;
/** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
elCol;
// @ts-ignore
const __VLS_328 = __VLS_asFunctionalComponent1(__VLS_327, new __VLS_327({
    span: (12),
}));
const __VLS_329 = __VLS_328({
    span: (12),
}, ...__VLS_functionalComponentArgsRest(__VLS_328));
const { default: __VLS_332 } = __VLS_330.slots;
let __VLS_333;
/** @ts-ignore @type { | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card'] | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card']} */
elCard;
// @ts-ignore
const __VLS_334 = __VLS_asFunctionalComponent1(__VLS_333, new __VLS_333({
    shadow: "hover",
    ...{ class: "section-card" },
}));
const __VLS_335 = __VLS_334({
    shadow: "hover",
    ...{ class: "section-card" },
}, ...__VLS_functionalComponentArgsRest(__VLS_334));
/** @type {__VLS_StyleScopedClasses['section-card']} */ ;
const { default: __VLS_338 } = __VLS_336.slots;
{
    const { header: __VLS_339 } = __VLS_336.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "section-title" },
    });
    /** @type {__VLS_StyleScopedClasses['section-title']} */ ;
    // @ts-ignore
    [];
}
__VLS_asFunctionalElement1(__VLS_intrinsics.div)({
    ref: "orderChartRef",
    ...{ class: "chart-box" },
});
/** @type {__VLS_StyleScopedClasses['chart-box']} */ ;
// @ts-ignore
[];
var __VLS_336;
// @ts-ignore
[];
var __VLS_330;
// @ts-ignore
[];
var __VLS_311;
let __VLS_340;
/** @ts-ignore @type { | typeof __VLS_components.elRow | typeof __VLS_components.ElRow | typeof __VLS_components['el-row'] | typeof __VLS_components.elRow | typeof __VLS_components.ElRow | typeof __VLS_components['el-row']} */
elRow;
// @ts-ignore
const __VLS_341 = __VLS_asFunctionalComponent1(__VLS_340, new __VLS_340({
    gutter: (16),
    ...{ class: "charts-row" },
}));
const __VLS_342 = __VLS_341({
    gutter: (16),
    ...{ class: "charts-row" },
}, ...__VLS_functionalComponentArgsRest(__VLS_341));
/** @type {__VLS_StyleScopedClasses['charts-row']} */ ;
const { default: __VLS_345 } = __VLS_343.slots;
let __VLS_346;
/** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
elCol;
// @ts-ignore
const __VLS_347 = __VLS_asFunctionalComponent1(__VLS_346, new __VLS_346({
    span: (12),
}));
const __VLS_348 = __VLS_347({
    span: (12),
}, ...__VLS_functionalComponentArgsRest(__VLS_347));
const { default: __VLS_351 } = __VLS_349.slots;
let __VLS_352;
/** @ts-ignore @type { | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card'] | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card']} */
elCard;
// @ts-ignore
const __VLS_353 = __VLS_asFunctionalComponent1(__VLS_352, new __VLS_352({
    shadow: "hover",
    ...{ class: "section-card" },
}));
const __VLS_354 = __VLS_353({
    shadow: "hover",
    ...{ class: "section-card" },
}, ...__VLS_functionalComponentArgsRest(__VLS_353));
/** @type {__VLS_StyleScopedClasses['section-card']} */ ;
const { default: __VLS_357 } = __VLS_355.slots;
{
    const { header: __VLS_358 } = __VLS_355.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "section-title" },
    });
    /** @type {__VLS_StyleScopedClasses['section-title']} */ ;
    // @ts-ignore
    [];
}
__VLS_asFunctionalElement1(__VLS_intrinsics.div)({
    ref: "orderStatusChartRef",
    ...{ class: "chart-box" },
});
/** @type {__VLS_StyleScopedClasses['chart-box']} */ ;
// @ts-ignore
[];
var __VLS_355;
// @ts-ignore
[];
var __VLS_349;
let __VLS_359;
/** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
elCol;
// @ts-ignore
const __VLS_360 = __VLS_asFunctionalComponent1(__VLS_359, new __VLS_359({
    span: (12),
}));
const __VLS_361 = __VLS_360({
    span: (12),
}, ...__VLS_functionalComponentArgsRest(__VLS_360));
const { default: __VLS_364 } = __VLS_362.slots;
let __VLS_365;
/** @ts-ignore @type { | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card'] | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card']} */
elCard;
// @ts-ignore
const __VLS_366 = __VLS_asFunctionalComponent1(__VLS_365, new __VLS_365({
    shadow: "hover",
    ...{ class: "section-card" },
}));
const __VLS_367 = __VLS_366({
    shadow: "hover",
    ...{ class: "section-card" },
}, ...__VLS_functionalComponentArgsRest(__VLS_366));
/** @type {__VLS_StyleScopedClasses['section-card']} */ ;
const { default: __VLS_370 } = __VLS_368.slots;
{
    const { header: __VLS_371 } = __VLS_368.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "section-title" },
    });
    /** @type {__VLS_StyleScopedClasses['section-title']} */ ;
    // @ts-ignore
    [];
}
__VLS_asFunctionalElement1(__VLS_intrinsics.div)({
    ref: "userRoleChartRef",
    ...{ class: "chart-box" },
});
/** @type {__VLS_StyleScopedClasses['chart-box']} */ ;
// @ts-ignore
[];
var __VLS_368;
// @ts-ignore
[];
var __VLS_362;
// @ts-ignore
[];
var __VLS_343;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
