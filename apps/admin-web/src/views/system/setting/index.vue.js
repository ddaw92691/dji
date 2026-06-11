/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ref, reactive, computed, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { settingApi } from '@/api/setting';
defineOptions({ name: 'SystemSettingView' });
const loading = ref(false);
const saving = ref(false);
const settings = ref([]);
const editValues = reactive({});
const changedKeys = reactive(new Set());
const GROUPS = {
    default_commission_rate: 'Finance',
    min_merchant_withdrawal_amount: 'Finance',
    min_agent_withdrawal_amount: 'Finance',
    upload_max_file_size_mb: 'Upload',
    upload_allowed_image_types: 'Upload',
    platform_name: 'Platform',
    platform_support_email: 'Platform',
    review_auto_visible: 'Review',
    export_max_rows: 'Export',
};
const groupedSettings = computed(() => {
    const groups = {};
    for (const setting of settings.value) {
        const group = GROUPS[setting.settingKey] || setting.groupName || 'Other';
        if (!groups[group])
            groups[group] = [];
        groups[group].push(setting);
    }
    return groups;
});
async function fetchData() {
    loading.value = true;
    try {
        const { data: res } = await settingApi.getSettings({ page: 1, pageSize: 999 });
        if (res.code === 200) {
            settings.value = res.data.list || [];
            settings.value.forEach((s) => {
                editValues[s.settingKey] = s.settingValue;
            });
            changedKeys.clear();
        }
        else {
            ElMessage.error(res.message || '获取设置失败');
        }
    }
    catch {
        ElMessage.error('获取设置失败');
    }
    finally {
        loading.value = false;
    }
}
function handleFieldChange(key, _value) {
    changedKeys.add(key);
}
async function handleSaveSingle(row) {
    saving.value = true;
    try {
        const { data: res } = await settingApi.updateSetting(row.settingKey, editValues[row.settingKey] ?? '', row.description);
        if (res.code === 200) {
            ElMessage.success('保存成功');
            changedKeys.delete(row.settingKey);
        }
        else {
            ElMessage.error(res.message || '保存失败');
        }
    }
    catch {
        ElMessage.error('保存失败');
    }
    finally {
        saving.value = false;
    }
}
async function handleSaveAll() {
    if (changedKeys.size === 0) {
        ElMessage.info('没有需要保存的修改');
        return;
    }
    saving.value = true;
    try {
        const batchSettings = Array.from(changedKeys).map((key) => ({
            key,
            value: editValues[key] ?? '',
        }));
        const { data: res } = await settingApi.batchUpdateSettings(batchSettings);
        if (res.code === 200) {
            ElMessage.success('全部设置已保存');
            changedKeys.clear();
        }
        else {
            ElMessage.error(res.message || '保存失败');
        }
    }
    catch {
        ElMessage.error('保存失败');
    }
    finally {
        saving.value = false;
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
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "setting-page" },
});
/** @type {__VLS_StyleScopedClasses['setting-page']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "page-header" },
});
/** @type {__VLS_StyleScopedClasses['page-header']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.h2, __VLS_intrinsics.h2)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "header-actions" },
});
/** @type {__VLS_StyleScopedClasses['header-actions']} */ ;
let __VLS_0;
/** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
elButton;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    ...{ 'onClick': {} },
    loading: (__VLS_ctx.loading),
}));
const __VLS_2 = __VLS_1({
    ...{ 'onClick': {} },
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
/** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
elButton;
// @ts-ignore
const __VLS_9 = __VLS_asFunctionalComponent1(__VLS_8, new __VLS_8({
    ...{ 'onClick': {} },
    type: "primary",
    loading: (__VLS_ctx.saving),
}));
const __VLS_10 = __VLS_9({
    ...{ 'onClick': {} },
    type: "primary",
    loading: (__VLS_ctx.saving),
}, ...__VLS_functionalComponentArgsRest(__VLS_9));
let __VLS_13;
const __VLS_14 = {
    ...{ click: {} },
    onClick: (__VLS_ctx.handleSaveAll),
};
const { default: __VLS_15 } = __VLS_11.slots;
// @ts-ignore
[saving, handleSaveAll,];
var __VLS_11;
var __VLS_12;
for (const [group, gName] of __VLS_vFor((__VLS_ctx.groupedSettings))) {
    let __VLS_16;
    /** @ts-ignore @type { | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card'] | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card']} */
    elCard;
    // @ts-ignore
    const __VLS_17 = __VLS_asFunctionalComponent1(__VLS_16, new __VLS_16({
        key: (gName),
        ...{ class: "group-card" },
        shadow: "hover",
    }));
    const __VLS_18 = __VLS_17({
        key: (gName),
        ...{ class: "group-card" },
        shadow: "hover",
    }, ...__VLS_functionalComponentArgsRest(__VLS_17));
    /** @type {__VLS_StyleScopedClasses['group-card']} */ ;
    const { default: __VLS_21 } = __VLS_19.slots;
    {
        const { header: __VLS_22 } = __VLS_19.slots;
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "group-title" },
        });
        /** @type {__VLS_StyleScopedClasses['group-title']} */ ;
        (gName);
        // @ts-ignore
        [groupedSettings,];
    }
    let __VLS_23;
    /** @ts-ignore @type { | typeof __VLS_components.elTable | typeof __VLS_components.ElTable | typeof __VLS_components['el-table'] | typeof __VLS_components.elTable | typeof __VLS_components.ElTable | typeof __VLS_components['el-table']} */
    elTable;
    // @ts-ignore
    const __VLS_24 = __VLS_asFunctionalComponent1(__VLS_23, new __VLS_23({
        data: (group),
        border: true,
        stripe: true,
        size: "small",
    }));
    const __VLS_25 = __VLS_24({
        data: (group),
        border: true,
        stripe: true,
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_24));
    const { default: __VLS_28 } = __VLS_26.slots;
    let __VLS_29;
    /** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
    elTableColumn;
    // @ts-ignore
    const __VLS_30 = __VLS_asFunctionalComponent1(__VLS_29, new __VLS_29({
        prop: "settingKey",
        label: "键",
        minWidth: "180",
        showOverflowTooltip: true,
    }));
    const __VLS_31 = __VLS_30({
        prop: "settingKey",
        label: "键",
        minWidth: "180",
        showOverflowTooltip: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_30));
    let __VLS_34;
    /** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
    elTableColumn;
    // @ts-ignore
    const __VLS_35 = __VLS_asFunctionalComponent1(__VLS_34, new __VLS_34({
        label: "值",
        minWidth: "200",
    }));
    const __VLS_36 = __VLS_35({
        label: "值",
        minWidth: "200",
    }, ...__VLS_functionalComponentArgsRest(__VLS_35));
    const { default: __VLS_39 } = __VLS_37.slots;
    {
        const { default: __VLS_40 } = __VLS_37.slots;
        const [{ row }] = __VLS_vSlot(__VLS_40);
        let __VLS_41;
        /** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
        elInput;
        // @ts-ignore
        const __VLS_42 = __VLS_asFunctionalComponent1(__VLS_41, new __VLS_41({
            ...{ 'onChange': {} },
            modelValue: (__VLS_ctx.editValues[row.settingKey]),
            size: "small",
            placeholder: "请输入值",
        }));
        const __VLS_43 = __VLS_42({
            ...{ 'onChange': {} },
            modelValue: (__VLS_ctx.editValues[row.settingKey]),
            size: "small",
            placeholder: "请输入值",
        }, ...__VLS_functionalComponentArgsRest(__VLS_42));
        let __VLS_46;
        const __VLS_47 = {
            ...{ change: {} },
            onChange: ((v) => __VLS_ctx.handleFieldChange(row.settingKey, v)),
        };
        var __VLS_44;
        var __VLS_45;
        // @ts-ignore
        [editValues, handleFieldChange,];
    }
    // @ts-ignore
    [];
    var __VLS_37;
    let __VLS_48;
    /** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
    elTableColumn;
    // @ts-ignore
    const __VLS_49 = __VLS_asFunctionalComponent1(__VLS_48, new __VLS_48({
        prop: "description",
        label: "描述",
        minWidth: "180",
        showOverflowTooltip: true,
    }));
    const __VLS_50 = __VLS_49({
        prop: "description",
        label: "描述",
        minWidth: "180",
        showOverflowTooltip: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_49));
    let __VLS_53;
    /** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
    elTableColumn;
    // @ts-ignore
    const __VLS_54 = __VLS_asFunctionalComponent1(__VLS_53, new __VLS_53({
        label: "操作",
        width: "100",
        align: "center",
    }));
    const __VLS_55 = __VLS_54({
        label: "操作",
        width: "100",
        align: "center",
    }, ...__VLS_functionalComponentArgsRest(__VLS_54));
    const { default: __VLS_58 } = __VLS_56.slots;
    {
        const { default: __VLS_59 } = __VLS_56.slots;
        const [{ row }] = __VLS_vSlot(__VLS_59);
        let __VLS_60;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_61 = __VLS_asFunctionalComponent1(__VLS_60, new __VLS_60({
            ...{ 'onClick': {} },
            link: true,
            type: "primary",
            size: "small",
        }));
        const __VLS_62 = __VLS_61({
            ...{ 'onClick': {} },
            link: true,
            type: "primary",
            size: "small",
        }, ...__VLS_functionalComponentArgsRest(__VLS_61));
        let __VLS_65;
        const __VLS_66 = {
            ...{ click: {} },
            onClick: (...[$event]) => {
                __VLS_ctx.handleSaveSingle(row);
                // @ts-ignore
                [handleSaveSingle,];
            },
        };
        const { default: __VLS_67 } = __VLS_63.slots;
        // @ts-ignore
        [];
        var __VLS_63;
        var __VLS_64;
        // @ts-ignore
        [];
    }
    // @ts-ignore
    [];
    var __VLS_56;
    // @ts-ignore
    [];
    var __VLS_26;
    // @ts-ignore
    [];
    var __VLS_19;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
