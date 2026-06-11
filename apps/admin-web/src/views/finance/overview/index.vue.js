/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ref, reactive, onMounted } from 'vue';
import { financeApi } from '@/api/finance';
defineOptions({ name: 'FinanceOverviewView' });
const loading = ref(false);
const summary = reactive({
    totalSales: 0, todaySales: 0,
    totalMerchantBalance: 0, totalMerchantFrozenBalance: 0,
    totalAgentBalance: 0, totalAgentFrozenBalance: 0,
    totalCommission: 0, totalWithdrawn: 0,
    pendingWithdrawalAmount: 0, pendingWithdrawalCount: 0,
    paidOrderCount: 0, completedOrderCount: 0,
});
function formatAmount(val) {
    return (val ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
async function fetchData() {
    loading.value = true;
    try {
        const { data: res } = await financeApi.getOverview();
        if (res.code !== 200)
            return;
        if (res.data)
            Object.assign(summary, res.data);
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
    ...{ class: "finance-overview" },
});
/** @type {__VLS_StyleScopedClasses['finance-overview']} */ ;
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
    sm: (6),
}));
const __VLS_16 = __VLS_15({
    xs: (12),
    sm: (6),
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
(__VLS_ctx.formatAmount(__VLS_ctx.summary.totalSales));
// @ts-ignore
[formatAmount, summary,];
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
    sm: (6),
}));
const __VLS_28 = __VLS_27({
    xs: (12),
    sm: (6),
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
(__VLS_ctx.formatAmount(__VLS_ctx.summary.todaySales));
// @ts-ignore
[formatAmount, summary,];
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
    sm: (6),
}));
const __VLS_40 = __VLS_39({
    xs: (12),
    sm: (6),
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
(__VLS_ctx.summary.completedOrderCount);
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
    sm: (6),
}));
const __VLS_52 = __VLS_51({
    xs: (12),
    sm: (6),
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
(__VLS_ctx.summary.paidOrderCount);
// @ts-ignore
[summary,];
var __VLS_59;
// @ts-ignore
[];
var __VLS_53;
// @ts-ignore
[];
var __VLS_11;
let __VLS_62;
/** @ts-ignore @type { | typeof __VLS_components.elRow | typeof __VLS_components.ElRow | typeof __VLS_components['el-row'] | typeof __VLS_components.elRow | typeof __VLS_components.ElRow | typeof __VLS_components['el-row']} */
elRow;
// @ts-ignore
const __VLS_63 = __VLS_asFunctionalComponent1(__VLS_62, new __VLS_62({
    gutter: (16),
    ...{ class: "stats-row" },
}));
const __VLS_64 = __VLS_63({
    gutter: (16),
    ...{ class: "stats-row" },
}, ...__VLS_functionalComponentArgsRest(__VLS_63));
/** @type {__VLS_StyleScopedClasses['stats-row']} */ ;
const { default: __VLS_67 } = __VLS_65.slots;
let __VLS_68;
/** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
elCol;
// @ts-ignore
const __VLS_69 = __VLS_asFunctionalComponent1(__VLS_68, new __VLS_68({
    xs: (12),
    sm: (6),
}));
const __VLS_70 = __VLS_69({
    xs: (12),
    sm: (6),
}, ...__VLS_functionalComponentArgsRest(__VLS_69));
const { default: __VLS_73 } = __VLS_71.slots;
let __VLS_74;
/** @ts-ignore @type { | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card'] | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card']} */
elCard;
// @ts-ignore
const __VLS_75 = __VLS_asFunctionalComponent1(__VLS_74, new __VLS_74({
    shadow: "hover",
    ...{ class: "stat-card balance-card" },
}));
const __VLS_76 = __VLS_75({
    shadow: "hover",
    ...{ class: "stat-card balance-card" },
}, ...__VLS_functionalComponentArgsRest(__VLS_75));
/** @type {__VLS_StyleScopedClasses['stat-card']} */ ;
/** @type {__VLS_StyleScopedClasses['balance-card']} */ ;
const { default: __VLS_79 } = __VLS_77.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "stat-label" },
});
/** @type {__VLS_StyleScopedClasses['stat-label']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "stat-value green" },
});
/** @type {__VLS_StyleScopedClasses['stat-value']} */ ;
/** @type {__VLS_StyleScopedClasses['green']} */ ;
(__VLS_ctx.formatAmount(__VLS_ctx.summary.totalMerchantBalance));
// @ts-ignore
[formatAmount, summary,];
var __VLS_77;
// @ts-ignore
[];
var __VLS_71;
let __VLS_80;
/** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
elCol;
// @ts-ignore
const __VLS_81 = __VLS_asFunctionalComponent1(__VLS_80, new __VLS_80({
    xs: (12),
    sm: (6),
}));
const __VLS_82 = __VLS_81({
    xs: (12),
    sm: (6),
}, ...__VLS_functionalComponentArgsRest(__VLS_81));
const { default: __VLS_85 } = __VLS_83.slots;
let __VLS_86;
/** @ts-ignore @type { | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card'] | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card']} */
elCard;
// @ts-ignore
const __VLS_87 = __VLS_asFunctionalComponent1(__VLS_86, new __VLS_86({
    shadow: "hover",
    ...{ class: "stat-card balance-card" },
}));
const __VLS_88 = __VLS_87({
    shadow: "hover",
    ...{ class: "stat-card balance-card" },
}, ...__VLS_functionalComponentArgsRest(__VLS_87));
/** @type {__VLS_StyleScopedClasses['stat-card']} */ ;
/** @type {__VLS_StyleScopedClasses['balance-card']} */ ;
const { default: __VLS_91 } = __VLS_89.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "stat-label" },
});
/** @type {__VLS_StyleScopedClasses['stat-label']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "stat-value warn" },
});
/** @type {__VLS_StyleScopedClasses['stat-value']} */ ;
/** @type {__VLS_StyleScopedClasses['warn']} */ ;
(__VLS_ctx.formatAmount(__VLS_ctx.summary.totalMerchantFrozenBalance));
// @ts-ignore
[formatAmount, summary,];
var __VLS_89;
// @ts-ignore
[];
var __VLS_83;
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
    ...{ class: "stat-card balance-card" },
}));
const __VLS_100 = __VLS_99({
    shadow: "hover",
    ...{ class: "stat-card balance-card" },
}, ...__VLS_functionalComponentArgsRest(__VLS_99));
/** @type {__VLS_StyleScopedClasses['stat-card']} */ ;
/** @type {__VLS_StyleScopedClasses['balance-card']} */ ;
const { default: __VLS_103 } = __VLS_101.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "stat-label" },
});
/** @type {__VLS_StyleScopedClasses['stat-label']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "stat-value green" },
});
/** @type {__VLS_StyleScopedClasses['stat-value']} */ ;
/** @type {__VLS_StyleScopedClasses['green']} */ ;
(__VLS_ctx.formatAmount(__VLS_ctx.summary.totalAgentBalance));
// @ts-ignore
[formatAmount, summary,];
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
    ...{ class: "stat-card balance-card" },
}));
const __VLS_112 = __VLS_111({
    shadow: "hover",
    ...{ class: "stat-card balance-card" },
}, ...__VLS_functionalComponentArgsRest(__VLS_111));
/** @type {__VLS_StyleScopedClasses['stat-card']} */ ;
/** @type {__VLS_StyleScopedClasses['balance-card']} */ ;
const { default: __VLS_115 } = __VLS_113.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "stat-label" },
});
/** @type {__VLS_StyleScopedClasses['stat-label']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "stat-value warn" },
});
/** @type {__VLS_StyleScopedClasses['stat-value']} */ ;
/** @type {__VLS_StyleScopedClasses['warn']} */ ;
(__VLS_ctx.formatAmount(__VLS_ctx.summary.totalAgentFrozenBalance));
// @ts-ignore
[formatAmount, summary,];
var __VLS_113;
// @ts-ignore
[];
var __VLS_107;
// @ts-ignore
[];
var __VLS_65;
let __VLS_116;
/** @ts-ignore @type { | typeof __VLS_components.elRow | typeof __VLS_components.ElRow | typeof __VLS_components['el-row'] | typeof __VLS_components.elRow | typeof __VLS_components.ElRow | typeof __VLS_components['el-row']} */
elRow;
// @ts-ignore
const __VLS_117 = __VLS_asFunctionalComponent1(__VLS_116, new __VLS_116({
    gutter: (16),
    ...{ class: "stats-row" },
}));
const __VLS_118 = __VLS_117({
    gutter: (16),
    ...{ class: "stats-row" },
}, ...__VLS_functionalComponentArgsRest(__VLS_117));
/** @type {__VLS_StyleScopedClasses['stats-row']} */ ;
const { default: __VLS_121 } = __VLS_119.slots;
let __VLS_122;
/** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
elCol;
// @ts-ignore
const __VLS_123 = __VLS_asFunctionalComponent1(__VLS_122, new __VLS_122({
    xs: (12),
    sm: (6),
}));
const __VLS_124 = __VLS_123({
    xs: (12),
    sm: (6),
}, ...__VLS_functionalComponentArgsRest(__VLS_123));
const { default: __VLS_127 } = __VLS_125.slots;
let __VLS_128;
/** @ts-ignore @type { | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card'] | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card']} */
elCard;
// @ts-ignore
const __VLS_129 = __VLS_asFunctionalComponent1(__VLS_128, new __VLS_128({
    shadow: "hover",
    ...{ class: "stat-card" },
}));
const __VLS_130 = __VLS_129({
    shadow: "hover",
    ...{ class: "stat-card" },
}, ...__VLS_functionalComponentArgsRest(__VLS_129));
/** @type {__VLS_StyleScopedClasses['stat-card']} */ ;
const { default: __VLS_133 } = __VLS_131.slots;
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
[formatAmount, summary,];
var __VLS_131;
// @ts-ignore
[];
var __VLS_125;
let __VLS_134;
/** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
elCol;
// @ts-ignore
const __VLS_135 = __VLS_asFunctionalComponent1(__VLS_134, new __VLS_134({
    xs: (12),
    sm: (6),
}));
const __VLS_136 = __VLS_135({
    xs: (12),
    sm: (6),
}, ...__VLS_functionalComponentArgsRest(__VLS_135));
const { default: __VLS_139 } = __VLS_137.slots;
let __VLS_140;
/** @ts-ignore @type { | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card'] | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card']} */
elCard;
// @ts-ignore
const __VLS_141 = __VLS_asFunctionalComponent1(__VLS_140, new __VLS_140({
    shadow: "hover",
    ...{ class: "stat-card" },
}));
const __VLS_142 = __VLS_141({
    shadow: "hover",
    ...{ class: "stat-card" },
}, ...__VLS_functionalComponentArgsRest(__VLS_141));
/** @type {__VLS_StyleScopedClasses['stat-card']} */ ;
const { default: __VLS_145 } = __VLS_143.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "stat-label" },
});
/** @type {__VLS_StyleScopedClasses['stat-label']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "stat-value" },
});
/** @type {__VLS_StyleScopedClasses['stat-value']} */ ;
(__VLS_ctx.formatAmount(__VLS_ctx.summary.totalWithdrawn));
// @ts-ignore
[formatAmount, summary,];
var __VLS_143;
// @ts-ignore
[];
var __VLS_137;
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
    ...{ class: "stat-card pending-card" },
}));
const __VLS_154 = __VLS_153({
    shadow: "hover",
    ...{ class: "stat-card pending-card" },
}, ...__VLS_functionalComponentArgsRest(__VLS_153));
/** @type {__VLS_StyleScopedClasses['stat-card']} */ ;
/** @type {__VLS_StyleScopedClasses['pending-card']} */ ;
const { default: __VLS_157 } = __VLS_155.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "stat-label" },
});
/** @type {__VLS_StyleScopedClasses['stat-label']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "stat-value" },
});
/** @type {__VLS_StyleScopedClasses['stat-value']} */ ;
(__VLS_ctx.formatAmount(__VLS_ctx.summary.pendingWithdrawalAmount));
// @ts-ignore
[formatAmount, summary,];
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
    ...{ class: "stat-card pending-card" },
}));
const __VLS_166 = __VLS_165({
    shadow: "hover",
    ...{ class: "stat-card pending-card" },
}, ...__VLS_functionalComponentArgsRest(__VLS_165));
/** @type {__VLS_StyleScopedClasses['stat-card']} */ ;
/** @type {__VLS_StyleScopedClasses['pending-card']} */ ;
const { default: __VLS_169 } = __VLS_167.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "stat-label" },
});
/** @type {__VLS_StyleScopedClasses['stat-label']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "stat-value" },
});
/** @type {__VLS_StyleScopedClasses['stat-value']} */ ;
(__VLS_ctx.summary.pendingWithdrawalCount);
// @ts-ignore
[summary,];
var __VLS_167;
// @ts-ignore
[];
var __VLS_161;
// @ts-ignore
[];
var __VLS_119;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
