/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ElMessage, ElMessageBox } from 'element-plus';
import { defineComponent, h } from 'vue';
import { merchantApplicationApi } from '@/api/merchantApplication';
defineOptions({ name: 'MerchantApplicationView' });
const FileAction = defineComponent({
    props: {
        file: Object,
    },
    emits: ['open'],
    setup(props, { emit }) {
        return () => {
            if (!props.file?.accessUrl)
                return h('span', '-');
            return h('button', {
                class: 'file-action',
                type: 'button',
                onClick: () => emit('open', props.file),
            }, props.file.originalName || '查看文件');
        };
    },
});
const query = reactive({
    keyword: '',
    status: '',
});
const tableData = ref([]);
const detail = ref(null);
const page = ref(1);
const pageSize = ref(10);
const total = ref(0);
const loading = ref(false);
const detailVisible = ref(false);
const approveVisible = ref(false);
const submitLoading = ref(false);
const currentRow = ref(null);
const approveForm = reactive({
    shopName: '',
    reviewRemark: '',
});
const statusText = (status) => {
    const map = {
        PENDING: '待审核',
        APPROVED: '已通过',
        REJECTED: '已拒绝',
    };
    return map[status] || status || '-';
};
const statusType = (status) => {
    const map = {
        PENDING: 'warning',
        APPROVED: 'success',
        REJECTED: 'danger',
    };
    return map[status] || 'info';
};
const documentTypeText = (type) => {
    const map = {
        id_card: '身份证',
        passport: '护照',
        driver_license: '驾驶证',
    };
    return map[type] || '-';
};
const fetchData = async () => {
    loading.value = true;
    try {
        const { data: res } = await merchantApplicationApi.getApplications({
            ...query,
            page: page.value,
            pageSize: pageSize.value,
        });
        if (res.code === 200) {
            tableData.value = res.data?.list || [];
            total.value = res.data?.total || 0;
        }
    }
    finally {
        loading.value = false;
    }
};
const resetQuery = () => {
    query.keyword = '';
    query.status = '';
    page.value = 1;
    fetchData();
};
const openDetail = async (row) => {
    const { data: res } = await merchantApplicationApi.getApplication(row.id);
    if (res.code === 200) {
        detail.value = res.data;
        detailVisible.value = true;
    }
};
const openFile = async (file) => {
    if (!file.accessUrl)
        return;
    const { data } = await merchantApplicationApi.downloadFile(file.accessUrl);
    const blobUrl = URL.createObjectURL(data);
    window.open(blobUrl, '_blank', 'noopener,noreferrer');
    setTimeout(() => URL.revokeObjectURL(blobUrl), 60_000);
};
const openApprove = (row) => {
    currentRow.value = row;
    approveForm.shopName = row.fullName || '';
    approveForm.reviewRemark = '';
    approveVisible.value = true;
};
const handleApprove = async () => {
    if (!currentRow.value)
        return;
    try {
        await ElMessageBox.confirm('确认通过该商家申请吗？通过后会创建商家登录账号。', '审核确认', {
            confirmButtonText: '确认通过',
            cancelButtonText: '取消',
            type: 'warning',
        });
    }
    catch {
        return;
    }
    submitLoading.value = true;
    try {
        const { data: res } = await merchantApplicationApi.approveApplication(currentRow.value.id, {
            shopName: approveForm.shopName,
            reviewRemark: approveForm.reviewRemark,
        });
        if (res.code === 200) {
            ElMessage.success('商家申请已通过');
            approveVisible.value = false;
            fetchData();
        }
        else {
            ElMessage.error(res.message || '操作失败');
        }
    }
    finally {
        submitLoading.value = false;
    }
};
const openReject = async (row) => {
    try {
        const { value } = await ElMessageBox.prompt('请输入拒绝原因', '拒绝商家申请', {
            confirmButtonText: '继续',
            cancelButtonText: '取消',
            inputType: 'textarea',
            inputPlaceholder: '拒绝原因',
            inputValidator: (val) => Boolean(val && val.trim()) || '拒绝原因不能为空',
        });
        await ElMessageBox.confirm('确认拒绝该商家申请吗？', '审核确认', {
            confirmButtonText: '确认拒绝',
            cancelButtonText: '取消',
            type: 'warning',
        });
        const { data: res } = await merchantApplicationApi.rejectApplication(row.id, {
            reviewRemark: value,
        });
        if (res.code === 200) {
            ElMessage.success('商家申请已拒绝');
            fetchData();
        }
        else {
            ElMessage.error(res.message || '操作失败');
        }
    }
    catch {
        /* canceled */
    }
};
onMounted(fetchData);
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "merchant-application-page" },
});
/** @type {__VLS_StyleScopedClasses['merchant-application-page']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "page-toolbar" },
});
/** @type {__VLS_StyleScopedClasses['page-toolbar']} */ ;
let __VLS_0;
/** @ts-ignore @type { | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form'] | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form']} */
elForm;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    inline: (true),
    model: (__VLS_ctx.query),
    ...{ class: "query-form" },
}));
const __VLS_2 = __VLS_1({
    inline: (true),
    model: (__VLS_ctx.query),
    ...{ class: "query-form" },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
/** @type {__VLS_StyleScopedClasses['query-form']} */ ;
const { default: __VLS_5 } = __VLS_3.slots;
let __VLS_6;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_7 = __VLS_asFunctionalComponent1(__VLS_6, new __VLS_6({
    label: "关键词",
}));
const __VLS_8 = __VLS_7({
    label: "关键词",
}, ...__VLS_functionalComponentArgsRest(__VLS_7));
const { default: __VLS_11 } = __VLS_9.slots;
let __VLS_12;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_13 = __VLS_asFunctionalComponent1(__VLS_12, new __VLS_12({
    ...{ 'onKeyup': {} },
    modelValue: (__VLS_ctx.query.keyword),
    placeholder: "邮箱 / 手机号 / 姓名",
    clearable: true,
}));
const __VLS_14 = __VLS_13({
    ...{ 'onKeyup': {} },
    modelValue: (__VLS_ctx.query.keyword),
    placeholder: "邮箱 / 手机号 / 姓名",
    clearable: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_13));
let __VLS_17;
const __VLS_18 = {
    ...{ keyup: {} },
    onKeyup: (__VLS_ctx.fetchData),
};
var __VLS_15;
var __VLS_16;
// @ts-ignore
[query, query, fetchData,];
var __VLS_9;
let __VLS_19;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_20 = __VLS_asFunctionalComponent1(__VLS_19, new __VLS_19({
    label: "状态",
}));
const __VLS_21 = __VLS_20({
    label: "状态",
}, ...__VLS_functionalComponentArgsRest(__VLS_20));
const { default: __VLS_24 } = __VLS_22.slots;
let __VLS_25;
/** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
elSelect;
// @ts-ignore
const __VLS_26 = __VLS_asFunctionalComponent1(__VLS_25, new __VLS_25({
    modelValue: (__VLS_ctx.query.status),
    placeholder: "全部",
    clearable: true,
    ...{ style: {} },
}));
const __VLS_27 = __VLS_26({
    modelValue: (__VLS_ctx.query.status),
    placeholder: "全部",
    clearable: true,
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_26));
const { default: __VLS_30 } = __VLS_28.slots;
let __VLS_31;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_32 = __VLS_asFunctionalComponent1(__VLS_31, new __VLS_31({
    label: "待审核",
    value: "PENDING",
}));
const __VLS_33 = __VLS_32({
    label: "待审核",
    value: "PENDING",
}, ...__VLS_functionalComponentArgsRest(__VLS_32));
let __VLS_36;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_37 = __VLS_asFunctionalComponent1(__VLS_36, new __VLS_36({
    label: "已通过",
    value: "APPROVED",
}));
const __VLS_38 = __VLS_37({
    label: "已通过",
    value: "APPROVED",
}, ...__VLS_functionalComponentArgsRest(__VLS_37));
let __VLS_41;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_42 = __VLS_asFunctionalComponent1(__VLS_41, new __VLS_41({
    label: "已拒绝",
    value: "REJECTED",
}));
const __VLS_43 = __VLS_42({
    label: "已拒绝",
    value: "REJECTED",
}, ...__VLS_functionalComponentArgsRest(__VLS_42));
// @ts-ignore
[query,];
var __VLS_28;
// @ts-ignore
[];
var __VLS_22;
let __VLS_46;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_47 = __VLS_asFunctionalComponent1(__VLS_46, new __VLS_46({}));
const __VLS_48 = __VLS_47({}, ...__VLS_functionalComponentArgsRest(__VLS_47));
const { default: __VLS_51 } = __VLS_49.slots;
let __VLS_52;
/** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
elButton;
// @ts-ignore
const __VLS_53 = __VLS_asFunctionalComponent1(__VLS_52, new __VLS_52({
    ...{ 'onClick': {} },
    type: "primary",
}));
const __VLS_54 = __VLS_53({
    ...{ 'onClick': {} },
    type: "primary",
}, ...__VLS_functionalComponentArgsRest(__VLS_53));
let __VLS_57;
const __VLS_58 = {
    ...{ click: {} },
    onClick: (__VLS_ctx.fetchData),
};
const { default: __VLS_59 } = __VLS_55.slots;
// @ts-ignore
[fetchData,];
var __VLS_55;
var __VLS_56;
let __VLS_60;
/** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
elButton;
// @ts-ignore
const __VLS_61 = __VLS_asFunctionalComponent1(__VLS_60, new __VLS_60({
    ...{ 'onClick': {} },
}));
const __VLS_62 = __VLS_61({
    ...{ 'onClick': {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_61));
let __VLS_65;
const __VLS_66 = {
    ...{ click: {} },
    onClick: (__VLS_ctx.resetQuery),
};
const { default: __VLS_67 } = __VLS_63.slots;
// @ts-ignore
[resetQuery,];
var __VLS_63;
var __VLS_64;
// @ts-ignore
[];
var __VLS_49;
// @ts-ignore
[];
var __VLS_3;
let __VLS_68;
/** @ts-ignore @type { | typeof __VLS_components.elTable | typeof __VLS_components.ElTable | typeof __VLS_components['el-table'] | typeof __VLS_components.elTable | typeof __VLS_components.ElTable | typeof __VLS_components['el-table']} */
elTable;
// @ts-ignore
const __VLS_69 = __VLS_asFunctionalComponent1(__VLS_68, new __VLS_68({
    data: (__VLS_ctx.tableData),
    border: true,
}));
const __VLS_70 = __VLS_69({
    data: (__VLS_ctx.tableData),
    border: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_69));
__VLS_asFunctionalDirective(__VLS_directives.vLoading, {})(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.loading) }, null, null);
const { default: __VLS_73 } = __VLS_71.slots;
let __VLS_74;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_75 = __VLS_asFunctionalComponent1(__VLS_74, new __VLS_74({
    prop: "id",
    label: "申请编号",
    width: "180",
}));
const __VLS_76 = __VLS_75({
    prop: "id",
    label: "申请编号",
    width: "180",
}, ...__VLS_functionalComponentArgsRest(__VLS_75));
let __VLS_79;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_80 = __VLS_asFunctionalComponent1(__VLS_79, new __VLS_79({
    prop: "fullName",
    label: "姓名",
    minWidth: "120",
}));
const __VLS_81 = __VLS_80({
    prop: "fullName",
    label: "姓名",
    minWidth: "120",
}, ...__VLS_functionalComponentArgsRest(__VLS_80));
let __VLS_84;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_85 = __VLS_asFunctionalComponent1(__VLS_84, new __VLS_84({
    prop: "email",
    label: "邮箱",
    minWidth: "180",
}));
const __VLS_86 = __VLS_85({
    prop: "email",
    label: "邮箱",
    minWidth: "180",
}, ...__VLS_functionalComponentArgsRest(__VLS_85));
let __VLS_89;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_90 = __VLS_asFunctionalComponent1(__VLS_89, new __VLS_89({
    prop: "phone",
    label: "手机号",
    minWidth: "140",
}));
const __VLS_91 = __VLS_90({
    prop: "phone",
    label: "手机号",
    minWidth: "140",
}, ...__VLS_functionalComponentArgsRest(__VLS_90));
let __VLS_94;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_95 = __VLS_asFunctionalComponent1(__VLS_94, new __VLS_94({
    prop: "age",
    label: "年龄",
    width: "80",
}));
const __VLS_96 = __VLS_95({
    prop: "age",
    label: "年龄",
    width: "80",
}, ...__VLS_functionalComponentArgsRest(__VLS_95));
let __VLS_99;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_100 = __VLS_asFunctionalComponent1(__VLS_99, new __VLS_99({
    label: "证件类型",
    width: "120",
}));
const __VLS_101 = __VLS_100({
    label: "证件类型",
    width: "120",
}, ...__VLS_functionalComponentArgsRest(__VLS_100));
const { default: __VLS_104 } = __VLS_102.slots;
{
    const { default: __VLS_105 } = __VLS_102.slots;
    const [{ row }] = __VLS_vSlot(__VLS_105);
    (__VLS_ctx.documentTypeText(row.documentType));
    // @ts-ignore
    [tableData, vLoading, loading, documentTypeText,];
}
// @ts-ignore
[];
var __VLS_102;
let __VLS_106;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_107 = __VLS_asFunctionalComponent1(__VLS_106, new __VLS_106({
    prop: "status",
    label: "申请状态",
    width: "110",
}));
const __VLS_108 = __VLS_107({
    prop: "status",
    label: "申请状态",
    width: "110",
}, ...__VLS_functionalComponentArgsRest(__VLS_107));
const { default: __VLS_111 } = __VLS_109.slots;
{
    const { default: __VLS_112 } = __VLS_109.slots;
    const [{ row }] = __VLS_vSlot(__VLS_112);
    let __VLS_113;
    /** @ts-ignore @type { | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag'] | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag']} */
    elTag;
    // @ts-ignore
    const __VLS_114 = __VLS_asFunctionalComponent1(__VLS_113, new __VLS_113({
        type: (__VLS_ctx.statusType(row.status)),
    }));
    const __VLS_115 = __VLS_114({
        type: (__VLS_ctx.statusType(row.status)),
    }, ...__VLS_functionalComponentArgsRest(__VLS_114));
    const { default: __VLS_118 } = __VLS_116.slots;
    (__VLS_ctx.statusText(row.status));
    // @ts-ignore
    [statusType, statusText,];
    var __VLS_116;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_109;
let __VLS_119;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_120 = __VLS_asFunctionalComponent1(__VLS_119, new __VLS_119({
    prop: "createdAt",
    label: "申请时间",
    minWidth: "170",
}));
const __VLS_121 = __VLS_120({
    prop: "createdAt",
    label: "申请时间",
    minWidth: "170",
}, ...__VLS_functionalComponentArgsRest(__VLS_120));
let __VLS_124;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_125 = __VLS_asFunctionalComponent1(__VLS_124, new __VLS_124({
    prop: "reviewedAt",
    label: "审核时间",
    minWidth: "170",
}));
const __VLS_126 = __VLS_125({
    prop: "reviewedAt",
    label: "审核时间",
    minWidth: "170",
}, ...__VLS_functionalComponentArgsRest(__VLS_125));
let __VLS_129;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_130 = __VLS_asFunctionalComponent1(__VLS_129, new __VLS_129({
    label: "操作",
    width: "220",
    fixed: "right",
}));
const __VLS_131 = __VLS_130({
    label: "操作",
    width: "220",
    fixed: "right",
}, ...__VLS_functionalComponentArgsRest(__VLS_130));
const { default: __VLS_134 } = __VLS_132.slots;
{
    const { default: __VLS_135 } = __VLS_132.slots;
    const [{ row }] = __VLS_vSlot(__VLS_135);
    let __VLS_136;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_137 = __VLS_asFunctionalComponent1(__VLS_136, new __VLS_136({
        ...{ 'onClick': {} },
        link: true,
        type: "primary",
    }));
    const __VLS_138 = __VLS_137({
        ...{ 'onClick': {} },
        link: true,
        type: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_137));
    let __VLS_141;
    const __VLS_142 = {
        ...{ click: {} },
        onClick: (...[$event]) => {
            __VLS_ctx.openDetail(row);
            // @ts-ignore
            [openDetail,];
        },
    };
    const { default: __VLS_143 } = __VLS_139.slots;
    // @ts-ignore
    [];
    var __VLS_139;
    var __VLS_140;
    if (row.status === 'PENDING') {
        let __VLS_144;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_145 = __VLS_asFunctionalComponent1(__VLS_144, new __VLS_144({
            ...{ 'onClick': {} },
            link: true,
            type: "success",
        }));
        const __VLS_146 = __VLS_145({
            ...{ 'onClick': {} },
            link: true,
            type: "success",
        }, ...__VLS_functionalComponentArgsRest(__VLS_145));
        let __VLS_149;
        const __VLS_150 = {
            ...{ click: {} },
            onClick: (...[$event]) => {
                if (!(row.status === 'PENDING'))
                    return;
                __VLS_ctx.openApprove(row);
                // @ts-ignore
                [openApprove,];
            },
        };
        __VLS_asFunctionalDirective(__VLS_directives.vPermission, {})(null, { ...__VLS_directiveBindingRestFields, value: ('admin:merchantApplication:approve') }, null, null);
        const { default: __VLS_151 } = __VLS_147.slots;
        // @ts-ignore
        [vPermission,];
        var __VLS_147;
        var __VLS_148;
    }
    if (row.status === 'PENDING') {
        let __VLS_152;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_153 = __VLS_asFunctionalComponent1(__VLS_152, new __VLS_152({
            ...{ 'onClick': {} },
            link: true,
            type: "danger",
        }));
        const __VLS_154 = __VLS_153({
            ...{ 'onClick': {} },
            link: true,
            type: "danger",
        }, ...__VLS_functionalComponentArgsRest(__VLS_153));
        let __VLS_157;
        const __VLS_158 = {
            ...{ click: {} },
            onClick: (...[$event]) => {
                if (!(row.status === 'PENDING'))
                    return;
                __VLS_ctx.openReject(row);
                // @ts-ignore
                [openReject,];
            },
        };
        __VLS_asFunctionalDirective(__VLS_directives.vPermission, {})(null, { ...__VLS_directiveBindingRestFields, value: ('admin:merchantApplication:reject') }, null, null);
        const { default: __VLS_159 } = __VLS_155.slots;
        // @ts-ignore
        [vPermission,];
        var __VLS_155;
        var __VLS_156;
    }
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_132;
// @ts-ignore
[];
var __VLS_71;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "pagination-wrap" },
});
/** @type {__VLS_StyleScopedClasses['pagination-wrap']} */ ;
let __VLS_160;
/** @ts-ignore @type { | typeof __VLS_components.elPagination | typeof __VLS_components.ElPagination | typeof __VLS_components['el-pagination']} */
elPagination;
// @ts-ignore
const __VLS_161 = __VLS_asFunctionalComponent1(__VLS_160, new __VLS_160({
    ...{ 'onSizeChange': {} },
    ...{ 'onCurrentChange': {} },
    currentPage: (__VLS_ctx.page),
    pageSize: (__VLS_ctx.pageSize),
    total: (__VLS_ctx.total),
    pageSizes: ([10, 20, 50, 100]),
    layout: "total, sizes, prev, pager, next, jumper",
}));
const __VLS_162 = __VLS_161({
    ...{ 'onSizeChange': {} },
    ...{ 'onCurrentChange': {} },
    currentPage: (__VLS_ctx.page),
    pageSize: (__VLS_ctx.pageSize),
    total: (__VLS_ctx.total),
    pageSizes: ([10, 20, 50, 100]),
    layout: "total, sizes, prev, pager, next, jumper",
}, ...__VLS_functionalComponentArgsRest(__VLS_161));
let __VLS_165;
const __VLS_166 = {
    ...{ sizeChange: {} },
    onSizeChange: (__VLS_ctx.fetchData),
    ...{ currentChange: {} },
    onCurrentChange: (__VLS_ctx.fetchData),
};
var __VLS_163;
var __VLS_164;
let __VLS_167;
/** @ts-ignore @type { | typeof __VLS_components.elDrawer | typeof __VLS_components.ElDrawer | typeof __VLS_components['el-drawer'] | typeof __VLS_components.elDrawer | typeof __VLS_components.ElDrawer | typeof __VLS_components['el-drawer']} */
elDrawer;
// @ts-ignore
const __VLS_168 = __VLS_asFunctionalComponent1(__VLS_167, new __VLS_167({
    modelValue: (__VLS_ctx.detailVisible),
    title: "商家申请详情",
    size: "560px",
}));
const __VLS_169 = __VLS_168({
    modelValue: (__VLS_ctx.detailVisible),
    title: "商家申请详情",
    size: "560px",
}, ...__VLS_functionalComponentArgsRest(__VLS_168));
const { default: __VLS_172 } = __VLS_170.slots;
if (__VLS_ctx.detail) {
    let __VLS_173;
    /** @ts-ignore @type { | typeof __VLS_components.elDescriptions | typeof __VLS_components.ElDescriptions | typeof __VLS_components['el-descriptions'] | typeof __VLS_components.elDescriptions | typeof __VLS_components.ElDescriptions | typeof __VLS_components['el-descriptions']} */
    elDescriptions;
    // @ts-ignore
    const __VLS_174 = __VLS_asFunctionalComponent1(__VLS_173, new __VLS_173({
        column: (1),
        border: true,
    }));
    const __VLS_175 = __VLS_174({
        column: (1),
        border: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_174));
    const { default: __VLS_178 } = __VLS_176.slots;
    let __VLS_179;
    /** @ts-ignore @type { | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item'] | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item']} */
    elDescriptionsItem;
    // @ts-ignore
    const __VLS_180 = __VLS_asFunctionalComponent1(__VLS_179, new __VLS_179({
        label: "申请编号",
    }));
    const __VLS_181 = __VLS_180({
        label: "申请编号",
    }, ...__VLS_functionalComponentArgsRest(__VLS_180));
    const { default: __VLS_184 } = __VLS_182.slots;
    (__VLS_ctx.detail.id);
    // @ts-ignore
    [fetchData, fetchData, page, pageSize, total, detailVisible, detail, detail,];
    var __VLS_182;
    let __VLS_185;
    /** @ts-ignore @type { | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item'] | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item']} */
    elDescriptionsItem;
    // @ts-ignore
    const __VLS_186 = __VLS_asFunctionalComponent1(__VLS_185, new __VLS_185({
        label: "申请状态",
    }));
    const __VLS_187 = __VLS_186({
        label: "申请状态",
    }, ...__VLS_functionalComponentArgsRest(__VLS_186));
    const { default: __VLS_190 } = __VLS_188.slots;
    let __VLS_191;
    /** @ts-ignore @type { | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag'] | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag']} */
    elTag;
    // @ts-ignore
    const __VLS_192 = __VLS_asFunctionalComponent1(__VLS_191, new __VLS_191({
        type: (__VLS_ctx.statusType(__VLS_ctx.detail.status)),
    }));
    const __VLS_193 = __VLS_192({
        type: (__VLS_ctx.statusType(__VLS_ctx.detail.status)),
    }, ...__VLS_functionalComponentArgsRest(__VLS_192));
    const { default: __VLS_196 } = __VLS_194.slots;
    (__VLS_ctx.statusText(__VLS_ctx.detail.status));
    // @ts-ignore
    [statusType, statusText, detail, detail,];
    var __VLS_194;
    // @ts-ignore
    [];
    var __VLS_188;
    let __VLS_197;
    /** @ts-ignore @type { | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item'] | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item']} */
    elDescriptionsItem;
    // @ts-ignore
    const __VLS_198 = __VLS_asFunctionalComponent1(__VLS_197, new __VLS_197({
        label: "邮箱",
    }));
    const __VLS_199 = __VLS_198({
        label: "邮箱",
    }, ...__VLS_functionalComponentArgsRest(__VLS_198));
    const { default: __VLS_202 } = __VLS_200.slots;
    (__VLS_ctx.detail.email);
    // @ts-ignore
    [detail,];
    var __VLS_200;
    let __VLS_203;
    /** @ts-ignore @type { | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item'] | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item']} */
    elDescriptionsItem;
    // @ts-ignore
    const __VLS_204 = __VLS_asFunctionalComponent1(__VLS_203, new __VLS_203({
        label: "手机号",
    }));
    const __VLS_205 = __VLS_204({
        label: "手机号",
    }, ...__VLS_functionalComponentArgsRest(__VLS_204));
    const { default: __VLS_208 } = __VLS_206.slots;
    (__VLS_ctx.detail.phone);
    // @ts-ignore
    [detail,];
    var __VLS_206;
    let __VLS_209;
    /** @ts-ignore @type { | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item'] | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item']} */
    elDescriptionsItem;
    // @ts-ignore
    const __VLS_210 = __VLS_asFunctionalComponent1(__VLS_209, new __VLS_209({
        label: "姓名",
    }));
    const __VLS_211 = __VLS_210({
        label: "姓名",
    }, ...__VLS_functionalComponentArgsRest(__VLS_210));
    const { default: __VLS_214 } = __VLS_212.slots;
    (__VLS_ctx.detail.fullName);
    // @ts-ignore
    [detail,];
    var __VLS_212;
    let __VLS_215;
    /** @ts-ignore @type { | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item'] | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item']} */
    elDescriptionsItem;
    // @ts-ignore
    const __VLS_216 = __VLS_asFunctionalComponent1(__VLS_215, new __VLS_215({
        label: "年龄",
    }));
    const __VLS_217 = __VLS_216({
        label: "年龄",
    }, ...__VLS_functionalComponentArgsRest(__VLS_216));
    const { default: __VLS_220 } = __VLS_218.slots;
    (__VLS_ctx.detail.age);
    // @ts-ignore
    [detail,];
    var __VLS_218;
    let __VLS_221;
    /** @ts-ignore @type { | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item'] | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item']} */
    elDescriptionsItem;
    // @ts-ignore
    const __VLS_222 = __VLS_asFunctionalComponent1(__VLS_221, new __VLS_221({
        label: "家庭地址",
    }));
    const __VLS_223 = __VLS_222({
        label: "家庭地址",
    }, ...__VLS_functionalComponentArgsRest(__VLS_222));
    const { default: __VLS_226 } = __VLS_224.slots;
    (__VLS_ctx.detail.homeAddress);
    // @ts-ignore
    [detail,];
    var __VLS_224;
    let __VLS_227;
    /** @ts-ignore @type { | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item'] | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item']} */
    elDescriptionsItem;
    // @ts-ignore
    const __VLS_228 = __VLS_asFunctionalComponent1(__VLS_227, new __VLS_227({
        label: "证件类型",
    }));
    const __VLS_229 = __VLS_228({
        label: "证件类型",
    }, ...__VLS_functionalComponentArgsRest(__VLS_228));
    const { default: __VLS_232 } = __VLS_230.slots;
    (__VLS_ctx.documentTypeText(__VLS_ctx.detail.documentType));
    // @ts-ignore
    [documentTypeText, detail,];
    var __VLS_230;
    let __VLS_233;
    /** @ts-ignore @type { | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item'] | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item']} */
    elDescriptionsItem;
    // @ts-ignore
    const __VLS_234 = __VLS_asFunctionalComponent1(__VLS_233, new __VLS_233({
        label: "身份证正面照",
    }));
    const __VLS_235 = __VLS_234({
        label: "身份证正面照",
    }, ...__VLS_functionalComponentArgsRest(__VLS_234));
    const { default: __VLS_238 } = __VLS_236.slots;
    let __VLS_239;
    /** @ts-ignore @type { | typeof __VLS_components.FileAction} */
    FileAction;
    // @ts-ignore
    const __VLS_240 = __VLS_asFunctionalComponent1(__VLS_239, new __VLS_239({
        ...{ 'onOpen': {} },
        file: (__VLS_ctx.detail.idCardFrontFile),
    }));
    const __VLS_241 = __VLS_240({
        ...{ 'onOpen': {} },
        file: (__VLS_ctx.detail.idCardFrontFile),
    }, ...__VLS_functionalComponentArgsRest(__VLS_240));
    let __VLS_244;
    const __VLS_245 = {
        ...{ open: {} },
        onOpen: (__VLS_ctx.openFile),
    };
    var __VLS_242;
    var __VLS_243;
    // @ts-ignore
    [detail, openFile,];
    var __VLS_236;
    let __VLS_246;
    /** @ts-ignore @type { | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item'] | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item']} */
    elDescriptionsItem;
    // @ts-ignore
    const __VLS_247 = __VLS_asFunctionalComponent1(__VLS_246, new __VLS_246({
        label: "身份证反面照",
    }));
    const __VLS_248 = __VLS_247({
        label: "身份证反面照",
    }, ...__VLS_functionalComponentArgsRest(__VLS_247));
    const { default: __VLS_251 } = __VLS_249.slots;
    let __VLS_252;
    /** @ts-ignore @type { | typeof __VLS_components.FileAction} */
    FileAction;
    // @ts-ignore
    const __VLS_253 = __VLS_asFunctionalComponent1(__VLS_252, new __VLS_252({
        ...{ 'onOpen': {} },
        file: (__VLS_ctx.detail.idCardBackFile),
    }));
    const __VLS_254 = __VLS_253({
        ...{ 'onOpen': {} },
        file: (__VLS_ctx.detail.idCardBackFile),
    }, ...__VLS_functionalComponentArgsRest(__VLS_253));
    let __VLS_257;
    const __VLS_258 = {
        ...{ open: {} },
        onOpen: (__VLS_ctx.openFile),
    };
    var __VLS_255;
    var __VLS_256;
    // @ts-ignore
    [detail, openFile,];
    var __VLS_249;
    let __VLS_259;
    /** @ts-ignore @type { | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item'] | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item']} */
    elDescriptionsItem;
    // @ts-ignore
    const __VLS_260 = __VLS_asFunctionalComponent1(__VLS_259, new __VLS_259({
        label: "护照首页",
    }));
    const __VLS_261 = __VLS_260({
        label: "护照首页",
    }, ...__VLS_functionalComponentArgsRest(__VLS_260));
    const { default: __VLS_264 } = __VLS_262.slots;
    let __VLS_265;
    /** @ts-ignore @type { | typeof __VLS_components.FileAction} */
    FileAction;
    // @ts-ignore
    const __VLS_266 = __VLS_asFunctionalComponent1(__VLS_265, new __VLS_265({
        ...{ 'onOpen': {} },
        file: (__VLS_ctx.detail.passportFile),
    }));
    const __VLS_267 = __VLS_266({
        ...{ 'onOpen': {} },
        file: (__VLS_ctx.detail.passportFile),
    }, ...__VLS_functionalComponentArgsRest(__VLS_266));
    let __VLS_270;
    const __VLS_271 = {
        ...{ open: {} },
        onOpen: (__VLS_ctx.openFile),
    };
    var __VLS_268;
    var __VLS_269;
    // @ts-ignore
    [detail, openFile,];
    var __VLS_262;
    let __VLS_272;
    /** @ts-ignore @type { | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item'] | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item']} */
    elDescriptionsItem;
    // @ts-ignore
    const __VLS_273 = __VLS_asFunctionalComponent1(__VLS_272, new __VLS_272({
        label: "驾驶证",
    }));
    const __VLS_274 = __VLS_273({
        label: "驾驶证",
    }, ...__VLS_functionalComponentArgsRest(__VLS_273));
    const { default: __VLS_277 } = __VLS_275.slots;
    let __VLS_278;
    /** @ts-ignore @type { | typeof __VLS_components.FileAction} */
    FileAction;
    // @ts-ignore
    const __VLS_279 = __VLS_asFunctionalComponent1(__VLS_278, new __VLS_278({
        ...{ 'onOpen': {} },
        file: (__VLS_ctx.detail.driverLicenseFile),
    }));
    const __VLS_280 = __VLS_279({
        ...{ 'onOpen': {} },
        file: (__VLS_ctx.detail.driverLicenseFile),
    }, ...__VLS_functionalComponentArgsRest(__VLS_279));
    let __VLS_283;
    const __VLS_284 = {
        ...{ open: {} },
        onOpen: (__VLS_ctx.openFile),
    };
    var __VLS_281;
    var __VLS_282;
    // @ts-ignore
    [detail, openFile,];
    var __VLS_275;
    let __VLS_285;
    /** @ts-ignore @type { | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item'] | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item']} */
    elDescriptionsItem;
    // @ts-ignore
    const __VLS_286 = __VLS_asFunctionalComponent1(__VLS_285, new __VLS_285({
        label: "手持证件视频",
    }));
    const __VLS_287 = __VLS_286({
        label: "手持证件视频",
    }, ...__VLS_functionalComponentArgsRest(__VLS_286));
    const { default: __VLS_290 } = __VLS_288.slots;
    let __VLS_291;
    /** @ts-ignore @type { | typeof __VLS_components.FileAction} */
    FileAction;
    // @ts-ignore
    const __VLS_292 = __VLS_asFunctionalComponent1(__VLS_291, new __VLS_291({
        ...{ 'onOpen': {} },
        file: (__VLS_ctx.detail.handheldVideoFile),
    }));
    const __VLS_293 = __VLS_292({
        ...{ 'onOpen': {} },
        file: (__VLS_ctx.detail.handheldVideoFile),
    }, ...__VLS_functionalComponentArgsRest(__VLS_292));
    let __VLS_296;
    const __VLS_297 = {
        ...{ open: {} },
        onOpen: (__VLS_ctx.openFile),
    };
    var __VLS_294;
    var __VLS_295;
    // @ts-ignore
    [detail, openFile,];
    var __VLS_288;
    let __VLS_298;
    /** @ts-ignore @type { | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item'] | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item']} */
    elDescriptionsItem;
    // @ts-ignore
    const __VLS_299 = __VLS_asFunctionalComponent1(__VLS_298, new __VLS_298({
        label: "拒绝原因",
    }));
    const __VLS_300 = __VLS_299({
        label: "拒绝原因",
    }, ...__VLS_functionalComponentArgsRest(__VLS_299));
    const { default: __VLS_303 } = __VLS_301.slots;
    (__VLS_ctx.detail.reviewRemark || '-');
    // @ts-ignore
    [detail,];
    var __VLS_301;
    let __VLS_304;
    /** @ts-ignore @type { | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item'] | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item']} */
    elDescriptionsItem;
    // @ts-ignore
    const __VLS_305 = __VLS_asFunctionalComponent1(__VLS_304, new __VLS_304({
        label: "审核人",
    }));
    const __VLS_306 = __VLS_305({
        label: "审核人",
    }, ...__VLS_functionalComponentArgsRest(__VLS_305));
    const { default: __VLS_309 } = __VLS_307.slots;
    (__VLS_ctx.detail.reviewedBy || '-');
    // @ts-ignore
    [detail,];
    var __VLS_307;
    let __VLS_310;
    /** @ts-ignore @type { | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item'] | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item']} */
    elDescriptionsItem;
    // @ts-ignore
    const __VLS_311 = __VLS_asFunctionalComponent1(__VLS_310, new __VLS_310({
        label: "审核时间",
    }));
    const __VLS_312 = __VLS_311({
        label: "审核时间",
    }, ...__VLS_functionalComponentArgsRest(__VLS_311));
    const { default: __VLS_315 } = __VLS_313.slots;
    (__VLS_ctx.detail.reviewedAt || '-');
    // @ts-ignore
    [detail,];
    var __VLS_313;
    // @ts-ignore
    [];
    var __VLS_176;
}
// @ts-ignore
[];
var __VLS_170;
let __VLS_316;
/** @ts-ignore @type { | typeof __VLS_components.elDialog | typeof __VLS_components.ElDialog | typeof __VLS_components['el-dialog'] | typeof __VLS_components.elDialog | typeof __VLS_components.ElDialog | typeof __VLS_components['el-dialog']} */
elDialog;
// @ts-ignore
const __VLS_317 = __VLS_asFunctionalComponent1(__VLS_316, new __VLS_316({
    modelValue: (__VLS_ctx.approveVisible),
    title: "通过商家申请",
    width: "520px",
}));
const __VLS_318 = __VLS_317({
    modelValue: (__VLS_ctx.approveVisible),
    title: "通过商家申请",
    width: "520px",
}, ...__VLS_functionalComponentArgsRest(__VLS_317));
const { default: __VLS_321 } = __VLS_319.slots;
let __VLS_322;
/** @ts-ignore @type { | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form'] | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form']} */
elForm;
// @ts-ignore
const __VLS_323 = __VLS_asFunctionalComponent1(__VLS_322, new __VLS_322({
    model: (__VLS_ctx.approveForm),
    labelWidth: "100px",
}));
const __VLS_324 = __VLS_323({
    model: (__VLS_ctx.approveForm),
    labelWidth: "100px",
}, ...__VLS_functionalComponentArgsRest(__VLS_323));
const { default: __VLS_327 } = __VLS_325.slots;
let __VLS_328;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_329 = __VLS_asFunctionalComponent1(__VLS_328, new __VLS_328({
    label: "店铺名称",
}));
const __VLS_330 = __VLS_329({
    label: "店铺名称",
}, ...__VLS_functionalComponentArgsRest(__VLS_329));
const { default: __VLS_333 } = __VLS_331.slots;
let __VLS_334;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_335 = __VLS_asFunctionalComponent1(__VLS_334, new __VLS_334({
    modelValue: (__VLS_ctx.approveForm.shopName),
    placeholder: "默认使用申请人姓名",
}));
const __VLS_336 = __VLS_335({
    modelValue: (__VLS_ctx.approveForm.shopName),
    placeholder: "默认使用申请人姓名",
}, ...__VLS_functionalComponentArgsRest(__VLS_335));
// @ts-ignore
[approveVisible, approveForm, approveForm,];
var __VLS_331;
let __VLS_339;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_340 = __VLS_asFunctionalComponent1(__VLS_339, new __VLS_339({
    label: "审核备注",
}));
const __VLS_341 = __VLS_340({
    label: "审核备注",
}, ...__VLS_functionalComponentArgsRest(__VLS_340));
const { default: __VLS_344 } = __VLS_342.slots;
let __VLS_345;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_346 = __VLS_asFunctionalComponent1(__VLS_345, new __VLS_345({
    modelValue: (__VLS_ctx.approveForm.reviewRemark),
    type: "textarea",
    rows: (3),
}));
const __VLS_347 = __VLS_346({
    modelValue: (__VLS_ctx.approveForm.reviewRemark),
    type: "textarea",
    rows: (3),
}, ...__VLS_functionalComponentArgsRest(__VLS_346));
// @ts-ignore
[approveForm,];
var __VLS_342;
// @ts-ignore
[];
var __VLS_325;
{
    const { footer: __VLS_350 } = __VLS_319.slots;
    let __VLS_351;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_352 = __VLS_asFunctionalComponent1(__VLS_351, new __VLS_351({
        ...{ 'onClick': {} },
    }));
    const __VLS_353 = __VLS_352({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_352));
    let __VLS_356;
    const __VLS_357 = {
        ...{ click: {} },
        onClick: (...[$event]) => {
            __VLS_ctx.approveVisible = false;
            // @ts-ignore
            [approveVisible,];
        },
    };
    const { default: __VLS_358 } = __VLS_354.slots;
    // @ts-ignore
    [];
    var __VLS_354;
    var __VLS_355;
    let __VLS_359;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_360 = __VLS_asFunctionalComponent1(__VLS_359, new __VLS_359({
        ...{ 'onClick': {} },
        type: "success",
        loading: (__VLS_ctx.submitLoading),
    }));
    const __VLS_361 = __VLS_360({
        ...{ 'onClick': {} },
        type: "success",
        loading: (__VLS_ctx.submitLoading),
    }, ...__VLS_functionalComponentArgsRest(__VLS_360));
    let __VLS_364;
    const __VLS_365 = {
        ...{ click: {} },
        onClick: (__VLS_ctx.handleApprove),
    };
    const { default: __VLS_366 } = __VLS_362.slots;
    // @ts-ignore
    [submitLoading, handleApprove,];
    var __VLS_362;
    var __VLS_363;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_319;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
