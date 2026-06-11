/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
const userStore = useUserStore();
const list = [
    ...Array.from({ length: 100 }, (_, index) => ({
        device: `设备${index + 1}`,
        browser: `浏览器${index + 1}`,
        ip: `192.168.1.${index + 1}`,
        location: `位置${index + 1}`,
        time: `2026-01-01 12:00:00`,
        status: index % 2 === 0 ? 'success' : 'danger',
    })),
];
console.log(list);
// 表格列配置
const columns = ref([
    { type: 'selection', width: 55 },
    { type: 'index', label: '序号', width: 55, fixed: 'left' },
    { prop: 'device', label: '设备型号', minWidth: 150 },
    { prop: 'browser', label: '浏览器/版本', minWidth: 200 },
    { prop: 'ip', label: 'IP 地址', minWidth: 150 },
    { prop: 'location', label: '地理位置', minWidth: 180 },
    { prop: 'time', label: '登录时间', minWidth: 170 },
    { prop: 'status', label: '结果', width: 100 },
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
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({}));
const __VLS_2 = __VLS_1({}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_5;
const { default: __VLS_6 } = __VLS_3.slots;
if (!__VLS_ctx.userStore.userInfo?.loginLogs?.length) {
    let __VLS_7;
    /** @ts-ignore @type { | typeof __VLS_components.elEmpty | typeof __VLS_components.ElEmpty | typeof __VLS_components['el-empty']} */
    elEmpty;
    // @ts-ignore
    const __VLS_8 = __VLS_asFunctionalComponent1(__VLS_7, new __VLS_7({
        description: "暂无登录日志",
    }));
    const __VLS_9 = __VLS_8({
        description: "暂无登录日志",
    }, ...__VLS_functionalComponentArgsRest(__VLS_8));
}
else {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
    let __VLS_12;
    /** @ts-ignore @type { | typeof __VLS_components.BasePage | typeof __VLS_components.BasePage} */
    BasePage;
    // @ts-ignore
    const __VLS_13 = __VLS_asFunctionalComponent1(__VLS_12, new __VLS_12({
        tableData: (__VLS_ctx.userStore.userInfo?.loginLogs),
        columns: (__VLS_ctx.columns),
        showPagination: (false),
    }));
    const __VLS_14 = __VLS_13({
        tableData: (__VLS_ctx.userStore.userInfo?.loginLogs),
        columns: (__VLS_ctx.columns),
        showPagination: (false),
    }, ...__VLS_functionalComponentArgsRest(__VLS_13));
    const { default: __VLS_17 } = __VLS_15.slots;
    {
        const { status: __VLS_18 } = __VLS_15.slots;
        const [{ row }] = __VLS_vSlot(__VLS_18);
        let __VLS_19;
        /** @ts-ignore @type { | typeof __VLS_components.BaseTag} */
        BaseTag;
        // @ts-ignore
        const __VLS_20 = __VLS_asFunctionalComponent1(__VLS_19, new __VLS_19({
            type: (row.status),
            text: (row.status === 'success' ? '成功' : '失败'),
        }));
        const __VLS_21 = __VLS_20({
            type: (row.status),
            text: (row.status === 'success' ? '成功' : '失败'),
        }, ...__VLS_functionalComponentArgsRest(__VLS_20));
        // @ts-ignore
        [userStore, userStore, columns,];
    }
    // @ts-ignore
    [];
    var __VLS_15;
}
// @ts-ignore
[];
var __VLS_3;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
