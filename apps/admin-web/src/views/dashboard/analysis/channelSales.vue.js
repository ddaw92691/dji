/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
// 渠道销售数据
const channelSales = ref([
    {
        name: '移动端 App',
        owner: 'David Fan',
        revenue: '542,800',
        achievement: 92,
        status: '引领增长',
        statusType: 'success',
        color: '#8b5cf6',
    },
    {
        name: '天猫旗舰店',
        owner: 'Alice Zhang',
        revenue: '320,400',
        achievement: 88,
        status: '稳健运行',
        statusType: 'primary',
        color: '#ef4444',
    },
    {
        name: '抖音直播间',
        owner: 'Mike Lee',
        revenue: '281,000',
        achievement: 100,
        status: '爆发期',
        statusType: 'warning',
        color: '#f59e0b',
    },
    {
        name: '京东商城',
        owner: 'Lisa Wang',
        revenue: '240,000',
        achievement: 80,
        status: '新店开张',
        statusType: 'info',
        color: '#3b82f6',
    },
]);
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
let __VLS_0;
/** @ts-ignore @type { | typeof __VLS_components.BaseCard | typeof __VLS_components.BaseCard} */
BaseCard;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    title: "各渠道销售表现实时榜单",
}));
const __VLS_2 = __VLS_1({
    title: "各渠道销售表现实时榜单",
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_5;
const { default: __VLS_6 } = __VLS_3.slots;
let __VLS_7;
/** @ts-ignore @type { | typeof __VLS_components.elScrollbar | typeof __VLS_components.ElScrollbar | typeof __VLS_components['el-scrollbar'] | typeof __VLS_components.elScrollbar | typeof __VLS_components.ElScrollbar | typeof __VLS_components['el-scrollbar']} */
elScrollbar;
// @ts-ignore
const __VLS_8 = __VLS_asFunctionalComponent1(__VLS_7, new __VLS_7({
    height: (260),
}));
const __VLS_9 = __VLS_8({
    height: (260),
}, ...__VLS_functionalComponentArgsRest(__VLS_8));
const { default: __VLS_12 } = __VLS_10.slots;
let __VLS_13;
/** @ts-ignore @type { | typeof __VLS_components.elTable | typeof __VLS_components.ElTable | typeof __VLS_components['el-table'] | typeof __VLS_components.elTable | typeof __VLS_components.ElTable | typeof __VLS_components['el-table']} */
elTable;
// @ts-ignore
const __VLS_14 = __VLS_asFunctionalComponent1(__VLS_13, new __VLS_13({
    data: (__VLS_ctx.channelSales),
    ...{ style: {} },
}));
const __VLS_15 = __VLS_14({
    data: (__VLS_ctx.channelSales),
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_14));
const { default: __VLS_18 } = __VLS_16.slots;
let __VLS_19;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_20 = __VLS_asFunctionalComponent1(__VLS_19, new __VLS_19({
    label: "渠道名称",
    width: "250",
}));
const __VLS_21 = __VLS_20({
    label: "渠道名称",
    width: "250",
}, ...__VLS_functionalComponentArgsRest(__VLS_20));
const { default: __VLS_24 } = __VLS_22.slots;
{
    const { default: __VLS_25 } = __VLS_22.slots;
    const [{ row }] = __VLS_vSlot(__VLS_25);
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "profile-cell" },
    });
    /** @type {__VLS_StyleScopedClasses['profile-cell']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "project-icon" },
        ...{ style: ({ backgroundColor: row.color }) },
    });
    /** @type {__VLS_StyleScopedClasses['project-icon']} */ ;
    (row.name.charAt(0));
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "name-role" },
    });
    /** @type {__VLS_StyleScopedClasses['name-role']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "name" },
    });
    /** @type {__VLS_StyleScopedClasses['name']} */ ;
    (row.name);
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "role" },
    });
    /** @type {__VLS_StyleScopedClasses['role']} */ ;
    (row.owner);
    // @ts-ignore
    [channelSales,];
}
// @ts-ignore
[];
var __VLS_22;
let __VLS_26;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_27 = __VLS_asFunctionalComponent1(__VLS_26, new __VLS_26({
    prop: "revenue",
    label: "销售额",
    minWidth: "150",
}));
const __VLS_28 = __VLS_27({
    prop: "revenue",
    label: "销售额",
    minWidth: "150",
}, ...__VLS_functionalComponentArgsRest(__VLS_27));
const { default: __VLS_31 } = __VLS_29.slots;
{
    const { default: __VLS_32 } = __VLS_29.slots;
    const [{ row }] = __VLS_vSlot(__VLS_32);
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "font-bold" },
    });
    /** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
    (row.revenue);
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_29;
let __VLS_33;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_34 = __VLS_asFunctionalComponent1(__VLS_33, new __VLS_33({
    label: "达成率",
    minWidth: "180",
}));
const __VLS_35 = __VLS_34({
    label: "达成率",
    minWidth: "180",
}, ...__VLS_functionalComponentArgsRest(__VLS_34));
const { default: __VLS_38 } = __VLS_36.slots;
{
    const { default: __VLS_39 } = __VLS_36.slots;
    const [{ row }] = __VLS_vSlot(__VLS_39);
    let __VLS_40;
    /** @ts-ignore @type { | typeof __VLS_components.elProgress | typeof __VLS_components.ElProgress | typeof __VLS_components['el-progress']} */
    elProgress;
    // @ts-ignore
    const __VLS_41 = __VLS_asFunctionalComponent1(__VLS_40, new __VLS_40({
        percentage: (row.achievement),
        color: (row.achievement > 90 ? '#10b981' : '#5bbff9'),
    }));
    const __VLS_42 = __VLS_41({
        percentage: (row.achievement),
        color: (row.achievement > 90 ? '#10b981' : '#5bbff9'),
    }, ...__VLS_functionalComponentArgsRest(__VLS_41));
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_36;
let __VLS_45;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_46 = __VLS_asFunctionalComponent1(__VLS_45, new __VLS_45({
    prop: "status",
    label: "状态",
    minWidth: "100",
}));
const __VLS_47 = __VLS_46({
    prop: "status",
    label: "状态",
    minWidth: "100",
}, ...__VLS_functionalComponentArgsRest(__VLS_46));
const { default: __VLS_50 } = __VLS_48.slots;
{
    const { default: __VLS_51 } = __VLS_48.slots;
    const [{ row }] = __VLS_vSlot(__VLS_51);
    let __VLS_52;
    /** @ts-ignore @type { | typeof __VLS_components.BaseTag} */
    BaseTag;
    // @ts-ignore
    const __VLS_53 = __VLS_asFunctionalComponent1(__VLS_52, new __VLS_52({
        type: (row.statusType),
        effect: "dark",
        round: true,
        text: (row.status),
    }));
    const __VLS_54 = __VLS_53({
        type: (row.statusType),
        effect: "dark",
        round: true,
        text: (row.status),
    }, ...__VLS_functionalComponentArgsRest(__VLS_53));
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_48;
// @ts-ignore
[];
var __VLS_16;
// @ts-ignore
[];
var __VLS_10;
// @ts-ignore
[];
var __VLS_3;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
