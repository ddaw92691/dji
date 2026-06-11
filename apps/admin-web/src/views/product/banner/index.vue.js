/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ref, reactive, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { bannerApi } from '@/api/banner';
import { uploadApi } from '@/api/upload';
defineOptions({ name: 'BannerView' });
const loading = ref(false);
const submitLoading = ref(false);
const transLoading = ref(false);
const uploading = ref(false);
const tableData = ref([]);
const total = ref(0);
const dialogVisible = ref(false);
const transDialogVisible = ref(false);
const isEdit = ref(false);
const editingId = ref(null);
const formRef = ref();
const transFormRef = ref();
const transEditingId = ref(null);
const searchForm = reactive({
    keyword: '',
    status: '',
    page: 1,
    pageSize: 20,
});
const form = reactive({
    title: '',
    subtitle: '',
    imageUrl: '',
    linkUrl: '',
    sort: 0,
    status: 'ENABLE',
});
const transForm = reactive({
    jaTitle: '',
    jaSubtitle: '',
    koTitle: '',
    koSubtitle: '',
    enTitle: '',
    enSubtitle: '',
});
const rules = {
    title: [{ required: true, message: 'Please enter title', trigger: 'blur' }],
    imageUrl: [{ required: true, message: 'Please enter image URL', trigger: 'blur' }],
    linkUrl: [{ required: true, message: 'Please enter link URL', trigger: 'blur' }],
};
async function fetchData() {
    loading.value = true;
    try {
        const { data: res } = await bannerApi.getBanners({
            keyword: searchForm.keyword || undefined,
            status: searchForm.status || undefined,
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
function handleSearch() {
    searchForm.page = 1;
    fetchData();
}
function handleCreate() {
    isEdit.value = false;
    editingId.value = null;
    Object.assign(form, {
        title: '',
        subtitle: '',
        imageUrl: '',
        linkUrl: '',
        sort: 0,
        status: 'ENABLE',
    });
    dialogVisible.value = true;
}
function handleEdit(row) {
    isEdit.value = true;
    editingId.value = row.id;
    Object.assign(form, {
        title: row.title,
        subtitle: row.subtitle,
        imageUrl: row.imageUrl,
        linkUrl: row.linkUrl,
        sort: row.sort,
        status: row.status,
    });
    dialogVisible.value = true;
}
async function handleSubmit() {
    if (!formRef.value)
        return;
    const valid = await formRef.value.validate().catch(() => false);
    if (!valid)
        return;
    submitLoading.value = true;
    try {
        const payload = { ...form };
        if (isEdit.value && editingId.value) {
            const { data: res } = await bannerApi.updateBanner(editingId.value, payload);
            if (res.code === 200) {
                ElMessage.success('更新成功');
                dialogVisible.value = false;
                fetchData();
            }
            else {
                ElMessage.error(res.message || '更新失败');
            }
        }
        else {
            const { data: res } = await bannerApi.createBanner(payload);
            if (res.code === 200) {
                ElMessage.success('新增成功');
                dialogVisible.value = false;
                fetchData();
            }
            else {
                ElMessage.error(res.message || '创建失败');
            }
        }
    }
    catch {
        ElMessage.error('操作失败');
    }
    finally {
        submitLoading.value = false;
    }
}
async function handleToggleStatus(row) {
    const newStatus = row.status === 'ENABLE' ? 'DISABLE' : 'ENABLE';
    try {
        const { data: res } = await bannerApi.updateBannerStatus(row.id, newStatus);
        if (res.code === 200) {
            ElMessage.success('状态已更新');
            fetchData();
        }
        else {
            ElMessage.error(res.message || '状态更新失败');
        }
    }
    catch {
        ElMessage.error('状态更新失败');
    }
}
async function handleDelete(row) {
    try {
        const { data: res } = await bannerApi.deleteBanner(row.id);
        if (res.code === 200) {
            ElMessage.success('删除成功');
            fetchData();
        }
        else {
            ElMessage.error(res.message || '删除失败');
        }
    }
    catch {
        ElMessage.error('删除失败');
    }
}
function handleOpenTranslations(row) {
    transEditingId.value = row.id;
    const jaT = row.translations?.find((t) => t.languageCode === 'ja');
    const koT = row.translations?.find((t) => t.languageCode === 'ko');
    const enT = row.translations?.find((t) => t.languageCode === 'en');
    transForm.jaTitle = jaT?.title || '';
    transForm.jaSubtitle = jaT?.subtitle || '';
    transForm.koTitle = koT?.title || '';
    transForm.koSubtitle = koT?.subtitle || '';
    transForm.enTitle = enT?.title || '';
    transForm.enSubtitle = enT?.subtitle || '';
    transDialogVisible.value = true;
}
async function handleSaveTranslations() {
    if (!transEditingId.value)
        return;
    transLoading.value = true;
    try {
        const payload = [
            { languageCode: 'ja', title: transForm.jaTitle, subtitle: transForm.jaSubtitle },
            { languageCode: 'ko', title: transForm.koTitle, subtitle: transForm.koSubtitle },
            { languageCode: 'en', title: transForm.enTitle, subtitle: transForm.enSubtitle },
        ];
        const { data: res } = await bannerApi.saveTranslations(transEditingId.value, payload);
        if (res.code === 200) {
            ElMessage.success('翻译已保存');
            transDialogVisible.value = false;
            fetchData();
        }
        else {
            ElMessage.error(res.message || '保存失败');
        }
    }
    catch {
        ElMessage.error('保存失败');
    }
    finally {
        transLoading.value = false;
    }
}
function resetForm() {
    formRef.value?.resetFields();
}
function resetTransForm() {
    transFormRef.value?.resetFields();
}
async function handleImageUpload(options) {
    uploading.value = true;
    try {
        const { data: res } = await uploadApi.postImage(options.file, 'banner');
        if (res.code === 200) {
            const url = res.data?.url || res.data;
            form.imageUrl = url;
            ElMessage.success('上传成功');
        }
        else {
            ElMessage.error(res.message || '上传失败');
        }
    }
    catch {
        ElMessage.error('上传失败');
    }
    finally {
        uploading.value = false;
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
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "product-page" },
});
/** @type {__VLS_StyleScopedClasses['product-page']} */ ;
let __VLS_0;
/** @ts-ignore @type { | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form'] | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form']} */
elForm;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    inline: (true),
    model: (__VLS_ctx.searchForm),
    ...{ class: "search-bar" },
}));
const __VLS_2 = __VLS_1({
    inline: (true),
    model: (__VLS_ctx.searchForm),
    ...{ class: "search-bar" },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
/** @type {__VLS_StyleScopedClasses['search-bar']} */ ;
const { default: __VLS_5 } = __VLS_3.slots;
let __VLS_6;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_7 = __VLS_asFunctionalComponent1(__VLS_6, new __VLS_6({}));
const __VLS_8 = __VLS_7({}, ...__VLS_functionalComponentArgsRest(__VLS_7));
const { default: __VLS_11 } = __VLS_9.slots;
let __VLS_12;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_13 = __VLS_asFunctionalComponent1(__VLS_12, new __VLS_12({
    ...{ 'onClear': {} },
    ...{ 'onKeyup': {} },
    modelValue: (__VLS_ctx.searchForm.keyword),
    placeholder: "关键词",
    clearable: true,
}));
const __VLS_14 = __VLS_13({
    ...{ 'onClear': {} },
    ...{ 'onKeyup': {} },
    modelValue: (__VLS_ctx.searchForm.keyword),
    placeholder: "关键词",
    clearable: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_13));
let __VLS_17;
const __VLS_18 = {
    ...{ clear: {} },
    onClear: (__VLS_ctx.handleSearch),
    ...{ keyup: {} },
    onKeyup: (__VLS_ctx.handleSearch),
};
var __VLS_15;
var __VLS_16;
// @ts-ignore
[searchForm, searchForm, handleSearch, handleSearch,];
var __VLS_9;
let __VLS_19;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_20 = __VLS_asFunctionalComponent1(__VLS_19, new __VLS_19({}));
const __VLS_21 = __VLS_20({}, ...__VLS_functionalComponentArgsRest(__VLS_20));
const { default: __VLS_24 } = __VLS_22.slots;
let __VLS_25;
/** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
elSelect;
// @ts-ignore
const __VLS_26 = __VLS_asFunctionalComponent1(__VLS_25, new __VLS_25({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.searchForm.status),
    placeholder: "状态",
    clearable: true,
}));
const __VLS_27 = __VLS_26({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.searchForm.status),
    placeholder: "状态",
    clearable: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_26));
let __VLS_30;
const __VLS_31 = {
    ...{ change: {} },
    onChange: (__VLS_ctx.handleSearch),
};
const { default: __VLS_32 } = __VLS_28.slots;
let __VLS_33;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_34 = __VLS_asFunctionalComponent1(__VLS_33, new __VLS_33({
    label: "已启用",
    value: "ENABLE",
}));
const __VLS_35 = __VLS_34({
    label: "已启用",
    value: "ENABLE",
}, ...__VLS_functionalComponentArgsRest(__VLS_34));
let __VLS_38;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_39 = __VLS_asFunctionalComponent1(__VLS_38, new __VLS_38({
    label: "已禁用",
    value: "DISABLE",
}));
const __VLS_40 = __VLS_39({
    label: "已禁用",
    value: "DISABLE",
}, ...__VLS_functionalComponentArgsRest(__VLS_39));
// @ts-ignore
[searchForm, handleSearch,];
var __VLS_28;
var __VLS_29;
// @ts-ignore
[];
var __VLS_22;
let __VLS_43;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_44 = __VLS_asFunctionalComponent1(__VLS_43, new __VLS_43({}));
const __VLS_45 = __VLS_44({}, ...__VLS_functionalComponentArgsRest(__VLS_44));
const { default: __VLS_48 } = __VLS_46.slots;
let __VLS_49;
/** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
elButton;
// @ts-ignore
const __VLS_50 = __VLS_asFunctionalComponent1(__VLS_49, new __VLS_49({
    ...{ 'onClick': {} },
    type: "primary",
}));
const __VLS_51 = __VLS_50({
    ...{ 'onClick': {} },
    type: "primary",
}, ...__VLS_functionalComponentArgsRest(__VLS_50));
let __VLS_54;
const __VLS_55 = {
    ...{ click: {} },
    onClick: (__VLS_ctx.handleSearch),
};
const { default: __VLS_56 } = __VLS_52.slots;
// @ts-ignore
[handleSearch,];
var __VLS_52;
var __VLS_53;
// @ts-ignore
[];
var __VLS_46;
let __VLS_57;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_58 = __VLS_asFunctionalComponent1(__VLS_57, new __VLS_57({}));
const __VLS_59 = __VLS_58({}, ...__VLS_functionalComponentArgsRest(__VLS_58));
const { default: __VLS_62 } = __VLS_60.slots;
let __VLS_63;
/** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
elButton;
// @ts-ignore
const __VLS_64 = __VLS_asFunctionalComponent1(__VLS_63, new __VLS_63({
    ...{ 'onClick': {} },
    type: "primary",
}));
const __VLS_65 = __VLS_64({
    ...{ 'onClick': {} },
    type: "primary",
}, ...__VLS_functionalComponentArgsRest(__VLS_64));
let __VLS_68;
const __VLS_69 = {
    ...{ click: {} },
    onClick: (__VLS_ctx.handleCreate),
};
__VLS_asFunctionalDirective(__VLS_directives.vPermission, {})(null, { ...__VLS_directiveBindingRestFields, value: ('product:banner:add') }, null, null);
const { default: __VLS_70 } = __VLS_66.slots;
// @ts-ignore
[handleCreate, vPermission,];
var __VLS_66;
var __VLS_67;
// @ts-ignore
[];
var __VLS_60;
// @ts-ignore
[];
var __VLS_3;
let __VLS_71;
/** @ts-ignore @type { | typeof __VLS_components.elTable | typeof __VLS_components.ElTable | typeof __VLS_components['el-table'] | typeof __VLS_components.elTable | typeof __VLS_components.ElTable | typeof __VLS_components['el-table']} */
elTable;
// @ts-ignore
const __VLS_72 = __VLS_asFunctionalComponent1(__VLS_71, new __VLS_71({
    data: (__VLS_ctx.tableData),
    border: true,
    stripe: true,
}));
const __VLS_73 = __VLS_72({
    data: (__VLS_ctx.tableData),
    border: true,
    stripe: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_72));
__VLS_asFunctionalDirective(__VLS_directives.vLoading, {})(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.loading) }, null, null);
const { default: __VLS_76 } = __VLS_74.slots;
let __VLS_77;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_78 = __VLS_asFunctionalComponent1(__VLS_77, new __VLS_77({
    label: "图片",
    width: "120",
    align: "center",
}));
const __VLS_79 = __VLS_78({
    label: "图片",
    width: "120",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_78));
const { default: __VLS_82 } = __VLS_80.slots;
{
    const { default: __VLS_83 } = __VLS_80.slots;
    const [{ row }] = __VLS_vSlot(__VLS_83);
    if (row.imageUrl) {
        let __VLS_84;
        /** @ts-ignore @type { | typeof __VLS_components.elImage | typeof __VLS_components.ElImage | typeof __VLS_components['el-image']} */
        elImage;
        // @ts-ignore
        const __VLS_85 = __VLS_asFunctionalComponent1(__VLS_84, new __VLS_84({
            src: (row.imageUrl),
            ...{ style: {} },
            fit: "cover",
        }));
        const __VLS_86 = __VLS_85({
            src: (row.imageUrl),
            ...{ style: {} },
            fit: "cover",
        }, ...__VLS_functionalComponentArgsRest(__VLS_85));
    }
    else {
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    }
    // @ts-ignore
    [tableData, vLoading, loading,];
}
// @ts-ignore
[];
var __VLS_80;
let __VLS_89;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_90 = __VLS_asFunctionalComponent1(__VLS_89, new __VLS_89({
    prop: "title",
    label: "标题",
    minWidth: "160",
    showOverflowTooltip: true,
}));
const __VLS_91 = __VLS_90({
    prop: "title",
    label: "标题",
    minWidth: "160",
    showOverflowTooltip: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_90));
let __VLS_94;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_95 = __VLS_asFunctionalComponent1(__VLS_94, new __VLS_94({
    label: "副标题",
    minWidth: "200",
    showOverflowTooltip: true,
}));
const __VLS_96 = __VLS_95({
    label: "副标题",
    minWidth: "200",
    showOverflowTooltip: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_95));
const { default: __VLS_99 } = __VLS_97.slots;
{
    const { default: __VLS_100 } = __VLS_97.slots;
    const [{ row }] = __VLS_vSlot(__VLS_100);
    (row.subtitle?.length > 40 ? row.subtitle.slice(0, 40) + '...' : row.subtitle);
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_97;
let __VLS_101;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_102 = __VLS_asFunctionalComponent1(__VLS_101, new __VLS_101({
    label: "链接地址",
    width: "150",
    showOverflowTooltip: true,
}));
const __VLS_103 = __VLS_102({
    label: "链接地址",
    width: "150",
    showOverflowTooltip: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_102));
const { default: __VLS_106 } = __VLS_104.slots;
{
    const { default: __VLS_107 } = __VLS_104.slots;
    const [{ row }] = __VLS_vSlot(__VLS_107);
    (row.linkUrl?.length > 25 ? row.linkUrl.slice(0, 25) + '...' : row.linkUrl);
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_104;
let __VLS_108;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_109 = __VLS_asFunctionalComponent1(__VLS_108, new __VLS_108({
    prop: "status",
    label: "状态",
    width: "100",
    align: "center",
}));
const __VLS_110 = __VLS_109({
    prop: "status",
    label: "状态",
    width: "100",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_109));
const { default: __VLS_113 } = __VLS_111.slots;
{
    const { default: __VLS_114 } = __VLS_111.slots;
    const [{ row }] = __VLS_vSlot(__VLS_114);
    let __VLS_115;
    /** @ts-ignore @type { | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag'] | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag']} */
    elTag;
    // @ts-ignore
    const __VLS_116 = __VLS_asFunctionalComponent1(__VLS_115, new __VLS_115({
        type: (row.status === 'ENABLE' ? 'success' : 'danger'),
    }));
    const __VLS_117 = __VLS_116({
        type: (row.status === 'ENABLE' ? 'success' : 'danger'),
    }, ...__VLS_functionalComponentArgsRest(__VLS_116));
    const { default: __VLS_120 } = __VLS_118.slots;
    (row.status === 'ENABLE' ? '已启用' : '已禁用');
    // @ts-ignore
    [];
    var __VLS_118;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_111;
let __VLS_121;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_122 = __VLS_asFunctionalComponent1(__VLS_121, new __VLS_121({
    prop: "sort",
    label: "排序",
    width: "70",
    align: "center",
}));
const __VLS_123 = __VLS_122({
    prop: "sort",
    label: "排序",
    width: "70",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_122));
let __VLS_126;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_127 = __VLS_asFunctionalComponent1(__VLS_126, new __VLS_126({
    prop: "createdAt",
    label: "创建时间",
    width: "180",
}));
const __VLS_128 = __VLS_127({
    prop: "createdAt",
    label: "创建时间",
    width: "180",
}, ...__VLS_functionalComponentArgsRest(__VLS_127));
let __VLS_131;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_132 = __VLS_asFunctionalComponent1(__VLS_131, new __VLS_131({
    label: "操作",
    width: "280",
    fixed: "right",
}));
const __VLS_133 = __VLS_132({
    label: "操作",
    width: "280",
    fixed: "right",
}, ...__VLS_functionalComponentArgsRest(__VLS_132));
const { default: __VLS_136 } = __VLS_134.slots;
{
    const { default: __VLS_137 } = __VLS_134.slots;
    const [{ row }] = __VLS_vSlot(__VLS_137);
    let __VLS_138;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_139 = __VLS_asFunctionalComponent1(__VLS_138, new __VLS_138({
        ...{ 'onClick': {} },
        link: true,
        type: "primary",
    }));
    const __VLS_140 = __VLS_139({
        ...{ 'onClick': {} },
        link: true,
        type: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_139));
    let __VLS_143;
    const __VLS_144 = {
        ...{ click: {} },
        onClick: (...[$event]) => {
            __VLS_ctx.handleEdit(row);
            // @ts-ignore
            [handleEdit,];
        },
    };
    __VLS_asFunctionalDirective(__VLS_directives.vPermission, {})(null, { ...__VLS_directiveBindingRestFields, value: ('product:banner:edit') }, null, null);
    const { default: __VLS_145 } = __VLS_141.slots;
    // @ts-ignore
    [vPermission,];
    var __VLS_141;
    var __VLS_142;
    let __VLS_146;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_147 = __VLS_asFunctionalComponent1(__VLS_146, new __VLS_146({
        ...{ 'onClick': {} },
        link: true,
        type: (row.status === 'ENABLE' ? 'warning' : 'success'),
    }));
    const __VLS_148 = __VLS_147({
        ...{ 'onClick': {} },
        link: true,
        type: (row.status === 'ENABLE' ? 'warning' : 'success'),
    }, ...__VLS_functionalComponentArgsRest(__VLS_147));
    let __VLS_151;
    const __VLS_152 = {
        ...{ click: {} },
        onClick: (...[$event]) => {
            __VLS_ctx.handleToggleStatus(row);
            // @ts-ignore
            [handleToggleStatus,];
        },
    };
    __VLS_asFunctionalDirective(__VLS_directives.vPermission, {})(null, { ...__VLS_directiveBindingRestFields, value: ('product:banner:edit') }, null, null);
    const { default: __VLS_153 } = __VLS_149.slots;
    (row.status === 'ENABLE' ? '禁用' : '启用');
    // @ts-ignore
    [vPermission,];
    var __VLS_149;
    var __VLS_150;
    let __VLS_154;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_155 = __VLS_asFunctionalComponent1(__VLS_154, new __VLS_154({
        ...{ 'onClick': {} },
        link: true,
        type: "info",
    }));
    const __VLS_156 = __VLS_155({
        ...{ 'onClick': {} },
        link: true,
        type: "info",
    }, ...__VLS_functionalComponentArgsRest(__VLS_155));
    let __VLS_159;
    const __VLS_160 = {
        ...{ click: {} },
        onClick: (...[$event]) => {
            __VLS_ctx.handleOpenTranslations(row);
            // @ts-ignore
            [handleOpenTranslations,];
        },
    };
    __VLS_asFunctionalDirective(__VLS_directives.vPermission, {})(null, { ...__VLS_directiveBindingRestFields, value: ('product:banner:edit') }, null, null);
    const { default: __VLS_161 } = __VLS_157.slots;
    // @ts-ignore
    [vPermission,];
    var __VLS_157;
    var __VLS_158;
    let __VLS_162;
    /** @ts-ignore @type { | typeof __VLS_components.elPopconfirm | typeof __VLS_components.ElPopconfirm | typeof __VLS_components['el-popconfirm'] | typeof __VLS_components.elPopconfirm | typeof __VLS_components.ElPopconfirm | typeof __VLS_components['el-popconfirm']} */
    elPopconfirm;
    // @ts-ignore
    const __VLS_163 = __VLS_asFunctionalComponent1(__VLS_162, new __VLS_162({
        ...{ 'onConfirm': {} },
        title: "确定要删除吗？",
    }));
    const __VLS_164 = __VLS_163({
        ...{ 'onConfirm': {} },
        title: "确定要删除吗？",
    }, ...__VLS_functionalComponentArgsRest(__VLS_163));
    let __VLS_167;
    const __VLS_168 = {
        ...{ confirm: {} },
        onConfirm: (...[$event]) => {
            __VLS_ctx.handleDelete(row);
            // @ts-ignore
            [handleDelete,];
        },
    };
    const { default: __VLS_169 } = __VLS_165.slots;
    {
        const { reference: __VLS_170 } = __VLS_165.slots;
        let __VLS_171;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_172 = __VLS_asFunctionalComponent1(__VLS_171, new __VLS_171({
            link: true,
            type: "danger",
        }));
        const __VLS_173 = __VLS_172({
            link: true,
            type: "danger",
        }, ...__VLS_functionalComponentArgsRest(__VLS_172));
        __VLS_asFunctionalDirective(__VLS_directives.vPermission, {})(null, { ...__VLS_directiveBindingRestFields, value: ('product:banner:delete') }, null, null);
        const { default: __VLS_176 } = __VLS_174.slots;
        // @ts-ignore
        [vPermission,];
        var __VLS_174;
        // @ts-ignore
        [];
    }
    // @ts-ignore
    [];
    var __VLS_165;
    var __VLS_166;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_134;
// @ts-ignore
[];
var __VLS_74;
let __VLS_177;
/** @ts-ignore @type { | typeof __VLS_components.elPagination | typeof __VLS_components.ElPagination | typeof __VLS_components['el-pagination']} */
elPagination;
// @ts-ignore
const __VLS_178 = __VLS_asFunctionalComponent1(__VLS_177, new __VLS_177({
    ...{ 'onChange': {} },
    currentPage: (__VLS_ctx.searchForm.page),
    pageSize: (__VLS_ctx.searchForm.pageSize),
    total: (__VLS_ctx.total),
    pageSizes: ([10, 20, 50, 100]),
    layout: "total, sizes, prev, pager, next",
}));
const __VLS_179 = __VLS_178({
    ...{ 'onChange': {} },
    currentPage: (__VLS_ctx.searchForm.page),
    pageSize: (__VLS_ctx.searchForm.pageSize),
    total: (__VLS_ctx.total),
    pageSizes: ([10, 20, 50, 100]),
    layout: "total, sizes, prev, pager, next",
}, ...__VLS_functionalComponentArgsRest(__VLS_178));
let __VLS_182;
const __VLS_183 = {
    ...{ change: {} },
    onChange: (__VLS_ctx.fetchData),
};
var __VLS_180;
var __VLS_181;
let __VLS_184;
/** @ts-ignore @type { | typeof __VLS_components.elDialog | typeof __VLS_components.ElDialog | typeof __VLS_components['el-dialog'] | typeof __VLS_components.elDialog | typeof __VLS_components.ElDialog | typeof __VLS_components['el-dialog']} */
elDialog;
// @ts-ignore
const __VLS_185 = __VLS_asFunctionalComponent1(__VLS_184, new __VLS_184({
    ...{ 'onClose': {} },
    modelValue: (__VLS_ctx.dialogVisible),
    title: (__VLS_ctx.isEdit ? '编辑轮播图' : '新增轮播图'),
    width: "650px",
}));
const __VLS_186 = __VLS_185({
    ...{ 'onClose': {} },
    modelValue: (__VLS_ctx.dialogVisible),
    title: (__VLS_ctx.isEdit ? '编辑轮播图' : '新增轮播图'),
    width: "650px",
}, ...__VLS_functionalComponentArgsRest(__VLS_185));
let __VLS_189;
const __VLS_190 = {
    ...{ close: {} },
    onClose: (__VLS_ctx.resetForm),
};
const { default: __VLS_191 } = __VLS_187.slots;
let __VLS_192;
/** @ts-ignore @type { | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form'] | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form']} */
elForm;
// @ts-ignore
const __VLS_193 = __VLS_asFunctionalComponent1(__VLS_192, new __VLS_192({
    ref: "formRef",
    model: (__VLS_ctx.form),
    rules: (__VLS_ctx.rules),
    labelWidth: "130px",
}));
const __VLS_194 = __VLS_193({
    ref: "formRef",
    model: (__VLS_ctx.form),
    rules: (__VLS_ctx.rules),
    labelWidth: "130px",
}, ...__VLS_functionalComponentArgsRest(__VLS_193));
var __VLS_197;
const { default: __VLS_199 } = __VLS_195.slots;
let __VLS_200;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_201 = __VLS_asFunctionalComponent1(__VLS_200, new __VLS_200({
    label: "标题",
    prop: "title",
}));
const __VLS_202 = __VLS_201({
    label: "标题",
    prop: "title",
}, ...__VLS_functionalComponentArgsRest(__VLS_201));
const { default: __VLS_205 } = __VLS_203.slots;
let __VLS_206;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_207 = __VLS_asFunctionalComponent1(__VLS_206, new __VLS_206({
    modelValue: (__VLS_ctx.form.title),
    placeholder: "横幅标题",
}));
const __VLS_208 = __VLS_207({
    modelValue: (__VLS_ctx.form.title),
    placeholder: "横幅标题",
}, ...__VLS_functionalComponentArgsRest(__VLS_207));
// @ts-ignore
[searchForm, searchForm, total, fetchData, dialogVisible, isEdit, resetForm, form, form, rules,];
var __VLS_203;
let __VLS_211;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_212 = __VLS_asFunctionalComponent1(__VLS_211, new __VLS_211({
    label: "副标题",
    prop: "subtitle",
}));
const __VLS_213 = __VLS_212({
    label: "副标题",
    prop: "subtitle",
}, ...__VLS_functionalComponentArgsRest(__VLS_212));
const { default: __VLS_216 } = __VLS_214.slots;
let __VLS_217;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_218 = __VLS_asFunctionalComponent1(__VLS_217, new __VLS_217({
    modelValue: (__VLS_ctx.form.subtitle),
    placeholder: "横幅副标题",
}));
const __VLS_219 = __VLS_218({
    modelValue: (__VLS_ctx.form.subtitle),
    placeholder: "横幅副标题",
}, ...__VLS_functionalComponentArgsRest(__VLS_218));
// @ts-ignore
[form,];
var __VLS_214;
let __VLS_222;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_223 = __VLS_asFunctionalComponent1(__VLS_222, new __VLS_222({
    label: "图片地址",
    prop: "imageUrl",
}));
const __VLS_224 = __VLS_223({
    label: "图片地址",
    prop: "imageUrl",
}, ...__VLS_functionalComponentArgsRest(__VLS_223));
const { default: __VLS_227 } = __VLS_225.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "upload-wrap" },
});
/** @type {__VLS_StyleScopedClasses['upload-wrap']} */ ;
let __VLS_228;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_229 = __VLS_asFunctionalComponent1(__VLS_228, new __VLS_228({
    modelValue: (__VLS_ctx.form.imageUrl),
    placeholder: "https://...",
    ...{ class: "input-with-upload" },
}));
const __VLS_230 = __VLS_229({
    modelValue: (__VLS_ctx.form.imageUrl),
    placeholder: "https://...",
    ...{ class: "input-with-upload" },
}, ...__VLS_functionalComponentArgsRest(__VLS_229));
/** @type {__VLS_StyleScopedClasses['input-with-upload']} */ ;
let __VLS_233;
/** @ts-ignore @type { | typeof __VLS_components.elUpload | typeof __VLS_components.ElUpload | typeof __VLS_components['el-upload'] | typeof __VLS_components.elUpload | typeof __VLS_components.ElUpload | typeof __VLS_components['el-upload']} */
elUpload;
// @ts-ignore
const __VLS_234 = __VLS_asFunctionalComponent1(__VLS_233, new __VLS_233({
    showFileList: (false),
    httpRequest: (__VLS_ctx.handleImageUpload),
    accept: "image/*",
}));
const __VLS_235 = __VLS_234({
    showFileList: (false),
    httpRequest: (__VLS_ctx.handleImageUpload),
    accept: "image/*",
}, ...__VLS_functionalComponentArgsRest(__VLS_234));
const { default: __VLS_238 } = __VLS_236.slots;
let __VLS_239;
/** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
elButton;
// @ts-ignore
const __VLS_240 = __VLS_asFunctionalComponent1(__VLS_239, new __VLS_239({
    type: "primary",
    loading: (__VLS_ctx.uploading),
}));
const __VLS_241 = __VLS_240({
    type: "primary",
    loading: (__VLS_ctx.uploading),
}, ...__VLS_functionalComponentArgsRest(__VLS_240));
const { default: __VLS_244 } = __VLS_242.slots;
// @ts-ignore
[form, handleImageUpload, uploading,];
var __VLS_242;
// @ts-ignore
[];
var __VLS_236;
if (__VLS_ctx.form.imageUrl) {
    let __VLS_245;
    /** @ts-ignore @type { | typeof __VLS_components.elImage | typeof __VLS_components.ElImage | typeof __VLS_components['el-image']} */
    elImage;
    // @ts-ignore
    const __VLS_246 = __VLS_asFunctionalComponent1(__VLS_245, new __VLS_245({
        src: (__VLS_ctx.form.imageUrl),
        ...{ style: {} },
        fit: "cover",
    }));
    const __VLS_247 = __VLS_246({
        src: (__VLS_ctx.form.imageUrl),
        ...{ style: {} },
        fit: "cover",
    }, ...__VLS_functionalComponentArgsRest(__VLS_246));
}
// @ts-ignore
[form, form,];
var __VLS_225;
let __VLS_250;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_251 = __VLS_asFunctionalComponent1(__VLS_250, new __VLS_250({
    label: "链接地址",
    prop: "linkUrl",
}));
const __VLS_252 = __VLS_251({
    label: "链接地址",
    prop: "linkUrl",
}, ...__VLS_functionalComponentArgsRest(__VLS_251));
const { default: __VLS_255 } = __VLS_253.slots;
let __VLS_256;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_257 = __VLS_asFunctionalComponent1(__VLS_256, new __VLS_256({
    modelValue: (__VLS_ctx.form.linkUrl),
    placeholder: "/products?category=1",
}));
const __VLS_258 = __VLS_257({
    modelValue: (__VLS_ctx.form.linkUrl),
    placeholder: "/products?category=1",
}, ...__VLS_functionalComponentArgsRest(__VLS_257));
// @ts-ignore
[form,];
var __VLS_253;
let __VLS_261;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_262 = __VLS_asFunctionalComponent1(__VLS_261, new __VLS_261({
    label: "排序",
    prop: "sort",
}));
const __VLS_263 = __VLS_262({
    label: "排序",
    prop: "sort",
}, ...__VLS_functionalComponentArgsRest(__VLS_262));
const { default: __VLS_266 } = __VLS_264.slots;
let __VLS_267;
/** @ts-ignore @type { | typeof __VLS_components.elInputNumber | typeof __VLS_components.ElInputNumber | typeof __VLS_components['el-input-number']} */
elInputNumber;
// @ts-ignore
const __VLS_268 = __VLS_asFunctionalComponent1(__VLS_267, new __VLS_267({
    modelValue: (__VLS_ctx.form.sort),
    min: (0),
    ...{ style: {} },
}));
const __VLS_269 = __VLS_268({
    modelValue: (__VLS_ctx.form.sort),
    min: (0),
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_268));
// @ts-ignore
[form,];
var __VLS_264;
let __VLS_272;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_273 = __VLS_asFunctionalComponent1(__VLS_272, new __VLS_272({
    label: "状态",
    prop: "status",
}));
const __VLS_274 = __VLS_273({
    label: "状态",
    prop: "status",
}, ...__VLS_functionalComponentArgsRest(__VLS_273));
const { default: __VLS_277 } = __VLS_275.slots;
let __VLS_278;
/** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
elSelect;
// @ts-ignore
const __VLS_279 = __VLS_asFunctionalComponent1(__VLS_278, new __VLS_278({
    modelValue: (__VLS_ctx.form.status),
    placeholder: "状态",
    ...{ style: {} },
}));
const __VLS_280 = __VLS_279({
    modelValue: (__VLS_ctx.form.status),
    placeholder: "状态",
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_279));
const { default: __VLS_283 } = __VLS_281.slots;
let __VLS_284;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_285 = __VLS_asFunctionalComponent1(__VLS_284, new __VLS_284({
    label: "已启用",
    value: "ENABLE",
}));
const __VLS_286 = __VLS_285({
    label: "已启用",
    value: "ENABLE",
}, ...__VLS_functionalComponentArgsRest(__VLS_285));
let __VLS_289;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_290 = __VLS_asFunctionalComponent1(__VLS_289, new __VLS_289({
    label: "已禁用",
    value: "DISABLE",
}));
const __VLS_291 = __VLS_290({
    label: "已禁用",
    value: "DISABLE",
}, ...__VLS_functionalComponentArgsRest(__VLS_290));
// @ts-ignore
[form,];
var __VLS_281;
// @ts-ignore
[];
var __VLS_275;
// @ts-ignore
[];
var __VLS_195;
{
    const { footer: __VLS_294 } = __VLS_187.slots;
    let __VLS_295;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_296 = __VLS_asFunctionalComponent1(__VLS_295, new __VLS_295({
        ...{ 'onClick': {} },
    }));
    const __VLS_297 = __VLS_296({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_296));
    let __VLS_300;
    const __VLS_301 = {
        ...{ click: {} },
        onClick: (...[$event]) => {
            __VLS_ctx.dialogVisible = false;
            // @ts-ignore
            [dialogVisible,];
        },
    };
    const { default: __VLS_302 } = __VLS_298.slots;
    // @ts-ignore
    [];
    var __VLS_298;
    var __VLS_299;
    let __VLS_303;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_304 = __VLS_asFunctionalComponent1(__VLS_303, new __VLS_303({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.submitLoading),
    }));
    const __VLS_305 = __VLS_304({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.submitLoading),
    }, ...__VLS_functionalComponentArgsRest(__VLS_304));
    let __VLS_308;
    const __VLS_309 = {
        ...{ click: {} },
        onClick: (__VLS_ctx.handleSubmit),
    };
    const { default: __VLS_310 } = __VLS_306.slots;
    // @ts-ignore
    [submitLoading, handleSubmit,];
    var __VLS_306;
    var __VLS_307;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_187;
var __VLS_188;
let __VLS_311;
/** @ts-ignore @type { | typeof __VLS_components.elDialog | typeof __VLS_components.ElDialog | typeof __VLS_components['el-dialog'] | typeof __VLS_components.elDialog | typeof __VLS_components.ElDialog | typeof __VLS_components['el-dialog']} */
elDialog;
// @ts-ignore
const __VLS_312 = __VLS_asFunctionalComponent1(__VLS_311, new __VLS_311({
    ...{ 'onClose': {} },
    modelValue: (__VLS_ctx.transDialogVisible),
    title: "横幅翻译",
    width: "550px",
}));
const __VLS_313 = __VLS_312({
    ...{ 'onClose': {} },
    modelValue: (__VLS_ctx.transDialogVisible),
    title: "横幅翻译",
    width: "550px",
}, ...__VLS_functionalComponentArgsRest(__VLS_312));
let __VLS_316;
const __VLS_317 = {
    ...{ close: {} },
    onClose: (__VLS_ctx.resetTransForm),
};
const { default: __VLS_318 } = __VLS_314.slots;
let __VLS_319;
/** @ts-ignore @type { | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form'] | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form']} */
elForm;
// @ts-ignore
const __VLS_320 = __VLS_asFunctionalComponent1(__VLS_319, new __VLS_319({
    ref: "transFormRef",
    model: (__VLS_ctx.transForm),
    labelWidth: "130px",
}));
const __VLS_321 = __VLS_320({
    ref: "transFormRef",
    model: (__VLS_ctx.transForm),
    labelWidth: "130px",
}, ...__VLS_functionalComponentArgsRest(__VLS_320));
var __VLS_324;
const { default: __VLS_326 } = __VLS_322.slots;
let __VLS_327;
/** @ts-ignore @type { | typeof __VLS_components.elDivider | typeof __VLS_components.ElDivider | typeof __VLS_components['el-divider'] | typeof __VLS_components.elDivider | typeof __VLS_components.ElDivider | typeof __VLS_components['el-divider']} */
elDivider;
// @ts-ignore
const __VLS_328 = __VLS_asFunctionalComponent1(__VLS_327, new __VLS_327({
    contentPosition: "left",
}));
const __VLS_329 = __VLS_328({
    contentPosition: "left",
}, ...__VLS_functionalComponentArgsRest(__VLS_328));
const { default: __VLS_332 } = __VLS_330.slots;
// @ts-ignore
[transDialogVisible, resetTransForm, transForm,];
var __VLS_330;
let __VLS_333;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_334 = __VLS_asFunctionalComponent1(__VLS_333, new __VLS_333({
    label: "标题",
}));
const __VLS_335 = __VLS_334({
    label: "标题",
}, ...__VLS_functionalComponentArgsRest(__VLS_334));
const { default: __VLS_338 } = __VLS_336.slots;
let __VLS_339;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_340 = __VLS_asFunctionalComponent1(__VLS_339, new __VLS_339({
    modelValue: (__VLS_ctx.transForm.jaTitle),
    placeholder: "日文标题",
}));
const __VLS_341 = __VLS_340({
    modelValue: (__VLS_ctx.transForm.jaTitle),
    placeholder: "日文标题",
}, ...__VLS_functionalComponentArgsRest(__VLS_340));
// @ts-ignore
[transForm,];
var __VLS_336;
let __VLS_344;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_345 = __VLS_asFunctionalComponent1(__VLS_344, new __VLS_344({
    label: "副标题",
}));
const __VLS_346 = __VLS_345({
    label: "副标题",
}, ...__VLS_functionalComponentArgsRest(__VLS_345));
const { default: __VLS_349 } = __VLS_347.slots;
let __VLS_350;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_351 = __VLS_asFunctionalComponent1(__VLS_350, new __VLS_350({
    modelValue: (__VLS_ctx.transForm.jaSubtitle),
    placeholder: "日文副标题",
}));
const __VLS_352 = __VLS_351({
    modelValue: (__VLS_ctx.transForm.jaSubtitle),
    placeholder: "日文副标题",
}, ...__VLS_functionalComponentArgsRest(__VLS_351));
// @ts-ignore
[transForm,];
var __VLS_347;
let __VLS_355;
/** @ts-ignore @type { | typeof __VLS_components.elDivider | typeof __VLS_components.ElDivider | typeof __VLS_components['el-divider'] | typeof __VLS_components.elDivider | typeof __VLS_components.ElDivider | typeof __VLS_components['el-divider']} */
elDivider;
// @ts-ignore
const __VLS_356 = __VLS_asFunctionalComponent1(__VLS_355, new __VLS_355({
    contentPosition: "left",
}));
const __VLS_357 = __VLS_356({
    contentPosition: "left",
}, ...__VLS_functionalComponentArgsRest(__VLS_356));
const { default: __VLS_360 } = __VLS_358.slots;
// @ts-ignore
[];
var __VLS_358;
let __VLS_361;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_362 = __VLS_asFunctionalComponent1(__VLS_361, new __VLS_361({
    label: "标题",
}));
const __VLS_363 = __VLS_362({
    label: "标题",
}, ...__VLS_functionalComponentArgsRest(__VLS_362));
const { default: __VLS_366 } = __VLS_364.slots;
let __VLS_367;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_368 = __VLS_asFunctionalComponent1(__VLS_367, new __VLS_367({
    modelValue: (__VLS_ctx.transForm.koTitle),
    placeholder: "韩文标题",
}));
const __VLS_369 = __VLS_368({
    modelValue: (__VLS_ctx.transForm.koTitle),
    placeholder: "韩文标题",
}, ...__VLS_functionalComponentArgsRest(__VLS_368));
// @ts-ignore
[transForm,];
var __VLS_364;
let __VLS_372;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_373 = __VLS_asFunctionalComponent1(__VLS_372, new __VLS_372({
    label: "副标题",
}));
const __VLS_374 = __VLS_373({
    label: "副标题",
}, ...__VLS_functionalComponentArgsRest(__VLS_373));
const { default: __VLS_377 } = __VLS_375.slots;
let __VLS_378;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_379 = __VLS_asFunctionalComponent1(__VLS_378, new __VLS_378({
    modelValue: (__VLS_ctx.transForm.koSubtitle),
    placeholder: "韩文副标题",
}));
const __VLS_380 = __VLS_379({
    modelValue: (__VLS_ctx.transForm.koSubtitle),
    placeholder: "韩文副标题",
}, ...__VLS_functionalComponentArgsRest(__VLS_379));
// @ts-ignore
[transForm,];
var __VLS_375;
let __VLS_383;
/** @ts-ignore @type { | typeof __VLS_components.elDivider | typeof __VLS_components.ElDivider | typeof __VLS_components['el-divider'] | typeof __VLS_components.elDivider | typeof __VLS_components.ElDivider | typeof __VLS_components['el-divider']} */
elDivider;
// @ts-ignore
const __VLS_384 = __VLS_asFunctionalComponent1(__VLS_383, new __VLS_383({
    contentPosition: "left",
}));
const __VLS_385 = __VLS_384({
    contentPosition: "left",
}, ...__VLS_functionalComponentArgsRest(__VLS_384));
const { default: __VLS_388 } = __VLS_386.slots;
// @ts-ignore
[];
var __VLS_386;
let __VLS_389;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_390 = __VLS_asFunctionalComponent1(__VLS_389, new __VLS_389({
    label: "标题",
}));
const __VLS_391 = __VLS_390({
    label: "标题",
}, ...__VLS_functionalComponentArgsRest(__VLS_390));
const { default: __VLS_394 } = __VLS_392.slots;
let __VLS_395;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_396 = __VLS_asFunctionalComponent1(__VLS_395, new __VLS_395({
    modelValue: (__VLS_ctx.transForm.enTitle),
    placeholder: "英文标题",
}));
const __VLS_397 = __VLS_396({
    modelValue: (__VLS_ctx.transForm.enTitle),
    placeholder: "英文标题",
}, ...__VLS_functionalComponentArgsRest(__VLS_396));
// @ts-ignore
[transForm,];
var __VLS_392;
let __VLS_400;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_401 = __VLS_asFunctionalComponent1(__VLS_400, new __VLS_400({
    label: "副标题",
}));
const __VLS_402 = __VLS_401({
    label: "副标题",
}, ...__VLS_functionalComponentArgsRest(__VLS_401));
const { default: __VLS_405 } = __VLS_403.slots;
let __VLS_406;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_407 = __VLS_asFunctionalComponent1(__VLS_406, new __VLS_406({
    modelValue: (__VLS_ctx.transForm.enSubtitle),
    placeholder: "英文副标题",
}));
const __VLS_408 = __VLS_407({
    modelValue: (__VLS_ctx.transForm.enSubtitle),
    placeholder: "英文副标题",
}, ...__VLS_functionalComponentArgsRest(__VLS_407));
// @ts-ignore
[transForm,];
var __VLS_403;
// @ts-ignore
[];
var __VLS_322;
{
    const { footer: __VLS_411 } = __VLS_314.slots;
    let __VLS_412;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_413 = __VLS_asFunctionalComponent1(__VLS_412, new __VLS_412({
        ...{ 'onClick': {} },
    }));
    const __VLS_414 = __VLS_413({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_413));
    let __VLS_417;
    const __VLS_418 = {
        ...{ click: {} },
        onClick: (...[$event]) => {
            __VLS_ctx.transDialogVisible = false;
            // @ts-ignore
            [transDialogVisible,];
        },
    };
    const { default: __VLS_419 } = __VLS_415.slots;
    // @ts-ignore
    [];
    var __VLS_415;
    var __VLS_416;
    let __VLS_420;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_421 = __VLS_asFunctionalComponent1(__VLS_420, new __VLS_420({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.transLoading),
    }));
    const __VLS_422 = __VLS_421({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.transLoading),
    }, ...__VLS_functionalComponentArgsRest(__VLS_421));
    let __VLS_425;
    const __VLS_426 = {
        ...{ click: {} },
        onClick: (__VLS_ctx.handleSaveTranslations),
    };
    const { default: __VLS_427 } = __VLS_423.slots;
    // @ts-ignore
    [transLoading, handleSaveTranslations,];
    var __VLS_423;
    var __VLS_424;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_314;
var __VLS_315;
// @ts-ignore
var __VLS_198 = __VLS_197, __VLS_325 = __VLS_324;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
