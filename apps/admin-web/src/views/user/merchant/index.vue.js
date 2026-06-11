/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { merchantApi } from '@/api/merchant';
import { merchantApplicationApi } from '@/api/merchantApplication';
import { i18nApi } from '@/api/i18n';
import { POPCONFIRM_CONFIG } from '@/config/elementConfig';
import { STATUS_OPTIONS, getLabelByValue, getColorByValue } from '@/constants/dict';
defineOptions({ name: 'MerchantListView' });
const menuStore = useMenuStore();
const router = useRouter();
const basePageRef = useTemplateRef({});
const formRef = useTemplateRef('formRef');
const tableData = ref([]);
const total = ref(0);
const loading = ref(false);
const dialogVisible = ref(false);
const submitLoading = ref(false);
const applicationInfo = ref(null);
const pendingApplicationCount = ref(0);
const countryOptions = ref([]);
const languageOptions = ref([]);
const applicationButtonTip = computed(() => pendingApplicationCount.value > 0 ? `${pendingApplicationCount.value} 条新商家申请` : '有新商家申请');
// 资金管理
const fundVisible = ref(false);
const fundMerchant = reactive({
    id: '',
    shopName: '',
});
const fundForm = reactive({
    direction: 'INCREASE',
    amount: undefined,
    amountCurrency: 'LOCAL',
    remark: '',
});
const fundSubmitting = ref(false);
const fundLogs = ref([]);
const fundLoading = ref(false);
const fundPage = ref(1);
const fundPageSize = ref(10);
const fundTotal = ref(0);
const convertedFundAmount = computed(() => {
    const amount = Number(fundForm.amount || 0);
    if (!amount)
        return '0.00';
    const rate = Number(fundMerchant.exchangeRate || 1);
    const value = fundForm.amountCurrency === 'USD' ? amount * rate : amount;
    return value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
});
// 改密码
const pwdVisible = ref(false);
const pwdFormRef = useTemplateRef('pwdFormRef');
const pwdForm = reactive({
    id: '',
    type: 'LOGIN',
    password: '',
});
const pwdSubmitting = ref(false);
const pwdRules = {
    password: [
        { required: true, message: '请输入新密码', trigger: 'blur' },
        { min: 6, message: '密码长度至少6位', trigger: 'blur' },
    ],
};
// 提款账户（只读查看）
const accountsVisible = ref(false);
const accounts = ref([]);
const accountsLoading = ref(false);
const accountMerchantId = ref('');
const accountFormVisible = ref(false);
const accountSubmitting = ref(false);
const emptyAccountForm = () => ({
    id: '',
    type: 'CRYPTO',
    chain: '',
    address: '',
    bankName: '',
    accountNo: '',
    accountName: '',
    country: '',
    status: 'ENABLE',
    remark: '',
    isDefault: false,
});
const accountForm = reactive(emptyAccountForm());
const editForm = reactive({
    id: '',
    email: '',
    password: '',
    name: '',
    phone: '',
    country: '',
    language: '',
    contactName: '',
    contactPhone: '',
});
const formRules = {
    email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }],
    name: [{ required: true, message: '请输入店铺名称', trigger: 'blur' }],
    password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
};
const searchFormConfig = ref([
    {
        label: '关键词',
        prop: 'keyword',
        type: 'elInput',
        attrs: { placeholder: '请输入关键词', clearable: true },
    },
    {
        label: '状态',
        prop: 'status',
        type: 'elSelect',
        attrs: { placeholder: '请选择状态', options: STATUS_OPTIONS, clearable: true },
    },
    {
        label: '国家',
        prop: 'country',
        type: 'elInput',
        attrs: { placeholder: '国家', clearable: true },
    },
]);
const columns = ref([
    { type: 'index', label: '#', width: 55, fixed: 'left' },
    { prop: 'merchantId', label: '商家ID', minWidth: 100 },
    { prop: 'shopName', label: '店铺名称', minWidth: 150 },
    { prop: 'email', label: '邮箱', minWidth: 180 },
    { prop: 'phone', label: '手机号', minWidth: 130 },
    { prop: 'country', label: '国家', width: 90 },
    { prop: 'language', label: '语言', width: 90 },
    { prop: 'productCount', label: '商品数', width: 90 },
    { prop: 'totalSales', label: '总销售额', width: 110 },
    { prop: 'balance', label: '余额', width: 100 },
    { prop: 'frozenBalance', label: '冻结金额', width: 100 },
    { prop: 'status', label: '状态', width: 100 },
    { prop: 'createdAt', label: '创建时间', minWidth: 160 },
    { prop: 'operation', label: '操作', width: 300, fixed: 'right' },
]);
const fetchData = async (queryForm, page, pageSize) => {
    loading.value = true;
    try {
        const { data: res } = await merchantApi.getMerchants({ ...queryForm, page, pageSize });
        if (res.code === 200) {
            tableData.value = res.data?.list || [];
            total.value = res.data?.total || 0;
        }
    }
    catch {
        /* ignore */
    }
    finally {
        loading.value = false;
    }
};
const resetForm = () => {
    editForm.id = '';
    editForm.email = '';
    editForm.password = '';
    editForm.name = '';
    editForm.phone = '';
    editForm.country = '';
    editForm.language = '';
    editForm.contactName = '';
    editForm.contactPhone = '';
    formRef.value?.resetFields();
};
const loadApplication = async (merchantId) => {
    applicationInfo.value = null;
    if (!merchantId)
        return;
    try {
        const { data: res } = await merchantApplicationApi.getByMerchant(merchantId);
        if (res.code === 200 && res.data && res.data.id) {
            applicationInfo.value = res.data;
        }
    }
    catch {
        /* 无关联申请资料时忽略 */
    }
};
const loadPendingApplicationCount = async () => {
    try {
        const { data: res } = await merchantApplicationApi.getPendingCount();
        if (res.code === 200) {
            pendingApplicationCount.value = Number(res.data?.pendingCount || 0);
        }
    }
    catch {
        pendingApplicationCount.value = 0;
    }
};
const loadLocaleOptions = async () => {
    try {
        const [{ data: countryRes }, { data: languageRes }] = await Promise.all([
            i18nApi.getCountries({ status: 'ENABLE', page: 1, pageSize: 500 }),
            i18nApi.getLanguages({ status: 'ENABLE', page: 1, pageSize: 500 }),
        ]);
        if (countryRes.code === 200) {
            countryOptions.value = countryRes.data?.list || [];
        }
        if (languageRes.code === 200) {
            languageOptions.value = languageRes.data?.list || [];
        }
    }
    catch {
        countryOptions.value = [];
        languageOptions.value = [];
    }
};
const openCreate = () => {
    resetForm();
    applicationInfo.value = null;
    dialogVisible.value = true;
};
const goApplications = () => {
    router.push('/user/merchant-application');
};
const openEdit = async (row) => {
    try {
        const { data: res } = await merchantApi.getMerchants({
            merchantId: row.merchantId || row.id,
            page: 1,
            pageSize: 1,
        });
        const d = res.code === 200 && res.data?.list?.[0] ? res.data.list[0] : row;
        Object.assign(editForm, {
            id: d.id || row.id,
            email: d.email || row.email || '',
            name: d.shopName || d.name || row.shopName || '',
            phone: d.phone || row.phone || '',
            country: d.countryCode || d.country || row.countryCode || row.country || '',
            language: d.languageCode || d.language || row.languageCode || row.language || '',
            contactName: d.contactName || row.contactName || '',
            contactPhone: d.contactPhone || row.contactPhone || '',
        });
        loadApplication(d.merchantId || d.id || row.id);
        dialogVisible.value = true;
    }
    catch {
        Object.assign(editForm, {
            id: row.id,
            email: row.email || '',
            name: row.shopName || '',
            phone: row.phone || '',
            country: row.countryCode || row.country || '',
            language: row.languageCode || row.language || '',
        });
        loadApplication(row.merchantId || row.id);
        dialogVisible.value = true;
    }
};
const handleSubmit = async () => {
    await formRef.value?.validate();
    submitLoading.value = true;
    try {
        const payload = {
            email: editForm.email,
            shopName: editForm.name,
            nickname: editForm.name,
            phone: editForm.phone,
            countryCode: editForm.country,
            languageCode: editForm.language,
            country: editForm.country,
            language: editForm.language,
            contactName: editForm.contactName,
            contactPhone: editForm.contactPhone,
        };
        let res;
        if (editForm.id) {
            res = await merchantApi.updateMerchant(editForm.id, payload);
        }
        else {
            res = await merchantApi.createMerchant({ ...payload, password: editForm.password });
        }
        if (res.data.code === 200) {
            ElMessage.success(editForm.id ? '商家更新成功' : '商家创建成功');
            dialogVisible.value = false;
            editForm.id
                ? basePageRef.value?.refreshCurrentPage()
                : basePageRef.value?.refreshToFirstPage();
        }
        else {
            ElMessage.error(res.data.message || '操作失败');
        }
    }
    catch {
        ElMessage.error('操作失败');
    }
    finally {
        submitLoading.value = false;
    }
};
const openFund = (row) => {
    fundMerchant.id = row.merchantId || row.id;
    fundMerchant.shopName = row.shopName || '';
    fundMerchant.balance = row.balance;
    fundMerchant.frozenBalance = row.frozenBalance;
    fundMerchant.currencyCode = row.currencyCode || 'USD';
    fundMerchant.currencySymbol = row.currencySymbol || '';
    fundMerchant.exchangeRate = row.exchangeRate;
    fundForm.direction = 'INCREASE';
    fundForm.amount = undefined;
    fundForm.amountCurrency = 'LOCAL';
    fundForm.remark = '';
    fundPage.value = 1;
    fundVisible.value = true;
    loadFundLogs();
};
const loadFundLogs = async () => {
    if (!fundMerchant.id)
        return;
    fundLoading.value = true;
    try {
        const { data: res } = await merchantApi.getFundLogs(fundMerchant.id, {
            page: fundPage.value,
            pageSize: fundPageSize.value,
        });
        if (res.code === 200) {
            fundLogs.value = res.data?.list || [];
            fundTotal.value = res.data?.total || 0;
            fundMerchant.balance = res.data?.balance;
            fundMerchant.frozenBalance = res.data?.frozenBalance;
        }
    }
    catch {
        /* ignore */
    }
    finally {
        fundLoading.value = false;
    }
};
const handleAdjustFund = async () => {
    if (!fundForm.amount || fundForm.amount <= 0) {
        ElMessage.warning('请输入大于0的金额');
        return;
    }
    if (!fundForm.remark.trim()) {
        ElMessage.warning('请填写资金调整原因');
        return;
    }
    fundSubmitting.value = true;
    try {
        const payload = {
            amount: fundForm.amount,
            amountCurrency: fundForm.amountCurrency,
            reason: fundForm.remark,
            remark: fundForm.remark,
            direction: fundForm.direction,
        };
        const actionMap = {
            INCREASE: merchantApi.addFund,
            DECREASE: merchantApi.subtractFund,
            FREEZE: merchantApi.freezeFund,
            UNFREEZE: merchantApi.unfreezeFund,
        };
        const action = actionMap[fundForm.direction] || merchantApi.adjustFund;
        const { data: res } = await action(fundMerchant.id, payload);
        if (res.code === 200) {
            ElMessage.success('资金调整成功');
            fundForm.amount = undefined;
            fundForm.remark = '';
            fundPage.value = 1;
            loadFundLogs();
            basePageRef.value?.refreshCurrentPage();
        }
        else {
            ElMessage.error(res.message || '调整失败');
        }
    }
    catch {
        /* 错误已由拦截器提示 */
    }
    finally {
        fundSubmitting.value = false;
    }
};
const openPassword = (row) => {
    pwdForm.id = row.merchantId || row.id;
    pwdForm.type = 'LOGIN';
    pwdForm.password = '';
    pwdFormRef.value?.resetFields();
    pwdVisible.value = true;
};
const handleResetPassword = async () => {
    await pwdFormRef.value?.validate();
    pwdSubmitting.value = true;
    try {
        const { data: res } = pwdForm.type === 'WITHDRAW'
            ? await merchantApi.resetWithdrawPassword(pwdForm.id, pwdForm.password)
            : await merchantApi.resetLoginPassword(pwdForm.id, pwdForm.password);
        if (res.code === 200) {
            ElMessage.success(pwdForm.type === 'WITHDRAW' ? '提现密码已重置' : '登录密码已重置');
            pwdVisible.value = false;
        }
        else {
            ElMessage.error(res.message || '重置失败');
        }
    }
    catch {
        /* 校验失败或请求错误 */
    }
    finally {
        pwdSubmitting.value = false;
    }
};
const openAccounts = async (row) => {
    accounts.value = [];
    accountMerchantId.value = row.merchantId || row.id;
    accountsVisible.value = true;
    accountsLoading.value = true;
    try {
        const { data: res } = await merchantApi.getWithdrawAccounts(accountMerchantId.value);
        if (res.code === 200) {
            accounts.value = res.data || [];
        }
    }
    catch {
        /* ignore */
    }
    finally {
        accountsLoading.value = false;
    }
};
const openAccountCreate = () => {
    Object.assign(accountForm, emptyAccountForm());
    accountFormVisible.value = true;
};
const openAccountEdit = (row) => {
    Object.assign(accountForm, emptyAccountForm(), row, {
        address: '',
        accountNo: '',
    });
    accountFormVisible.value = true;
};
const handleSaveAccount = async () => {
    if (accountForm.type === 'CRYPTO' && (!accountForm.chain || !accountForm.address)) {
        ElMessage.warning('请填写链类型和钱包地址');
        return;
    }
    if (accountForm.type === 'BANK' && (!accountForm.bankName || !accountForm.accountNo || !accountForm.accountName)) {
        ElMessage.warning('请填写银行名称、银行卡号和开户名');
        return;
    }
    accountSubmitting.value = true;
    try {
        const payload = { ...accountForm };
        delete payload.id;
        const { data: res } = accountForm.id
            ? await merchantApi.updateWithdrawAccount(accountForm.id, payload)
            : await merchantApi.createWithdrawAccount(accountMerchantId.value, payload);
        if (res.code === 200) {
            ElMessage.success('提款账户已保存');
            accountFormVisible.value = false;
            const { data: listRes } = await merchantApi.getWithdrawAccounts(accountMerchantId.value);
            accounts.value = listRes.code === 200 ? listRes.data || [] : accounts.value;
        }
        else {
            ElMessage.error(res.message || '保存失败');
        }
    }
    finally {
        accountSubmitting.value = false;
    }
};
const handleDeleteAccount = async (row) => {
    const { data: res } = await merchantApi.deleteWithdrawAccount(row.id);
    if (res.code === 200) {
        ElMessage.success('提款账户已禁用');
        const { data: listRes } = await merchantApi.getWithdrawAccounts(accountMerchantId.value);
        accounts.value = listRes.code === 200 ? listRes.data || [] : accounts.value;
    }
    else {
        ElMessage.error(res.message || '禁用失败');
    }
};
const handleToggleStatus = async (row) => {
    const newStatus = row.status === 'ENABLE' ? 'DISABLE' : 'ENABLE';
    try {
        const { data: res } = await merchantApi.updateMerchantStatus(row.id, newStatus);
        if (res.code === 200) {
            ElMessage.success('状态已更新');
            basePageRef.value?.refreshCurrentPage();
        }
        else {
            ElMessage.error(res.message || '状态更新失败');
        }
    }
    catch {
        ElMessage.error('状态更新失败');
    }
};
onMounted(() => {
    loadPendingApplicationCount();
    loadLocaleOptions();
});
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
let __VLS_0;
/** @ts-ignore @type { | typeof __VLS_components.BasePage | typeof __VLS_components.BasePage} */
BasePage;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    ...{ 'onRefresh': {} },
    ref: "basePageRef",
    formConfig: (__VLS_ctx.searchFormConfig),
    tableData: (__VLS_ctx.tableData),
    columns: (__VLS_ctx.columns),
    total: (__VLS_ctx.total),
    tableLoading: (__VLS_ctx.loading),
}));
const __VLS_2 = __VLS_1({
    ...{ 'onRefresh': {} },
    ref: "basePageRef",
    formConfig: (__VLS_ctx.searchFormConfig),
    tableData: (__VLS_ctx.tableData),
    columns: (__VLS_ctx.columns),
    total: (__VLS_ctx.total),
    tableLoading: (__VLS_ctx.loading),
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
let __VLS_5;
const __VLS_6 = {
    ...{ refresh: {} },
    onRefresh: (__VLS_ctx.fetchData),
};
var __VLS_7;
const { default: __VLS_9 } = __VLS_3.slots;
{
    const { tableOperationLeft: __VLS_10 } = __VLS_3.slots;
    let __VLS_11;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_12 = __VLS_asFunctionalComponent1(__VLS_11, new __VLS_11({
        ...{ 'onClick': {} },
        type: "primary",
        icon: (__VLS_ctx.menuStore.iconComponents.Plus),
    }));
    const __VLS_13 = __VLS_12({
        ...{ 'onClick': {} },
        type: "primary",
        icon: (__VLS_ctx.menuStore.iconComponents.Plus),
    }, ...__VLS_functionalComponentArgsRest(__VLS_12));
    let __VLS_16;
    const __VLS_17 = {
        ...{ click: {} },
        onClick: (__VLS_ctx.openCreate),
    };
    __VLS_asFunctionalDirective(__VLS_directives.vPermission, {})(null, { ...__VLS_directiveBindingRestFields, value: (['admin:user:merchant:add']) }, null, null);
    const { default: __VLS_18 } = __VLS_14.slots;
    // @ts-ignore
    [searchFormConfig, tableData, columns, total, loading, fetchData, menuStore, openCreate, vPermission,];
    var __VLS_14;
    var __VLS_15;
    let __VLS_19;
    /** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
    elTooltip;
    // @ts-ignore
    const __VLS_20 = __VLS_asFunctionalComponent1(__VLS_19, new __VLS_19({
        disabled: (__VLS_ctx.pendingApplicationCount <= 0),
        content: (__VLS_ctx.applicationButtonTip),
        placement: "top",
    }));
    const __VLS_21 = __VLS_20({
        disabled: (__VLS_ctx.pendingApplicationCount <= 0),
        content: (__VLS_ctx.applicationButtonTip),
        placement: "top",
    }, ...__VLS_functionalComponentArgsRest(__VLS_20));
    const { default: __VLS_24 } = __VLS_22.slots;
    let __VLS_25;
    /** @ts-ignore @type { | typeof __VLS_components.elBadge | typeof __VLS_components.ElBadge | typeof __VLS_components['el-badge'] | typeof __VLS_components.elBadge | typeof __VLS_components.ElBadge | typeof __VLS_components['el-badge']} */
    elBadge;
    // @ts-ignore
    const __VLS_26 = __VLS_asFunctionalComponent1(__VLS_25, new __VLS_25({
        value: (__VLS_ctx.pendingApplicationCount),
        hidden: (__VLS_ctx.pendingApplicationCount <= 0),
    }));
    const __VLS_27 = __VLS_26({
        value: (__VLS_ctx.pendingApplicationCount),
        hidden: (__VLS_ctx.pendingApplicationCount <= 0),
    }, ...__VLS_functionalComponentArgsRest(__VLS_26));
    const { default: __VLS_30 } = __VLS_28.slots;
    let __VLS_31;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_32 = __VLS_asFunctionalComponent1(__VLS_31, new __VLS_31({
        ...{ 'onClick': {} },
        type: "success",
    }));
    const __VLS_33 = __VLS_32({
        ...{ 'onClick': {} },
        type: "success",
    }, ...__VLS_functionalComponentArgsRest(__VLS_32));
    let __VLS_36;
    const __VLS_37 = {
        ...{ click: {} },
        onClick: (__VLS_ctx.goApplications),
    };
    __VLS_asFunctionalDirective(__VLS_directives.vPermission, {})(null, { ...__VLS_directiveBindingRestFields, value: ('admin:merchantApplication:view') }, null, null);
    const { default: __VLS_38 } = __VLS_34.slots;
    // @ts-ignore
    [vPermission, pendingApplicationCount, pendingApplicationCount, pendingApplicationCount, applicationButtonTip, goApplications,];
    var __VLS_34;
    var __VLS_35;
    // @ts-ignore
    [];
    var __VLS_28;
    // @ts-ignore
    [];
    var __VLS_22;
    // @ts-ignore
    [];
}
{
    const { status: __VLS_39 } = __VLS_3.slots;
    const [{ row }] = __VLS_vSlot(__VLS_39);
    let __VLS_40;
    /** @ts-ignore @type { | typeof __VLS_components.BaseTag} */
    BaseTag;
    // @ts-ignore
    const __VLS_41 = __VLS_asFunctionalComponent1(__VLS_40, new __VLS_40({
        type: (__VLS_ctx.getColorByValue(__VLS_ctx.STATUS_OPTIONS, row.status)),
        text: (__VLS_ctx.getLabelByValue(__VLS_ctx.STATUS_OPTIONS, row.status)),
    }));
    const __VLS_42 = __VLS_41({
        type: (__VLS_ctx.getColorByValue(__VLS_ctx.STATUS_OPTIONS, row.status)),
        text: (__VLS_ctx.getLabelByValue(__VLS_ctx.STATUS_OPTIONS, row.status)),
    }, ...__VLS_functionalComponentArgsRest(__VLS_41));
    // @ts-ignore
    [getColorByValue, STATUS_OPTIONS, STATUS_OPTIONS, getLabelByValue,];
}
{
    const { operation: __VLS_45 } = __VLS_3.slots;
    const [{ row }] = __VLS_vSlot(__VLS_45);
    let __VLS_46;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_47 = __VLS_asFunctionalComponent1(__VLS_46, new __VLS_46({
        ...{ 'onClick': {} },
        type: "primary",
        link: true,
    }));
    const __VLS_48 = __VLS_47({
        ...{ 'onClick': {} },
        type: "primary",
        link: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_47));
    let __VLS_51;
    const __VLS_52 = {
        ...{ click: {} },
        onClick: (...[$event]) => {
            __VLS_ctx.openEdit(row);
            // @ts-ignore
            [openEdit,];
        },
    };
    __VLS_asFunctionalDirective(__VLS_directives.vPermission, {})(null, { ...__VLS_directiveBindingRestFields, value: (['admin:user:merchant:edit']) }, null, null);
    const { default: __VLS_53 } = __VLS_49.slots;
    // @ts-ignore
    [vPermission,];
    var __VLS_49;
    var __VLS_50;
    let __VLS_54;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_55 = __VLS_asFunctionalComponent1(__VLS_54, new __VLS_54({
        ...{ 'onClick': {} },
        type: "warning",
        link: true,
    }));
    const __VLS_56 = __VLS_55({
        ...{ 'onClick': {} },
        type: "warning",
        link: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_55));
    let __VLS_59;
    const __VLS_60 = {
        ...{ click: {} },
        onClick: (...[$event]) => {
            __VLS_ctx.openFund(row);
            // @ts-ignore
            [openFund,];
        },
    };
    __VLS_asFunctionalDirective(__VLS_directives.vPermission, {})(null, { ...__VLS_directiveBindingRestFields, value: ('admin:user:merchant:fund') }, null, null);
    const { default: __VLS_61 } = __VLS_57.slots;
    // @ts-ignore
    [vPermission,];
    var __VLS_57;
    var __VLS_58;
    let __VLS_62;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_63 = __VLS_asFunctionalComponent1(__VLS_62, new __VLS_62({
        ...{ 'onClick': {} },
        type: "info",
        link: true,
    }));
    const __VLS_64 = __VLS_63({
        ...{ 'onClick': {} },
        type: "info",
        link: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_63));
    let __VLS_67;
    const __VLS_68 = {
        ...{ click: {} },
        onClick: (...[$event]) => {
            __VLS_ctx.openPassword(row);
            // @ts-ignore
            [openPassword,];
        },
    };
    __VLS_asFunctionalDirective(__VLS_directives.vPermission, {})(null, { ...__VLS_directiveBindingRestFields, value: ('admin:user:merchant:resetPwd') }, null, null);
    const { default: __VLS_69 } = __VLS_65.slots;
    // @ts-ignore
    [vPermission,];
    var __VLS_65;
    var __VLS_66;
    let __VLS_70;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_71 = __VLS_asFunctionalComponent1(__VLS_70, new __VLS_70({
        ...{ 'onClick': {} },
        type: "primary",
        link: true,
    }));
    const __VLS_72 = __VLS_71({
        ...{ 'onClick': {} },
        type: "primary",
        link: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_71));
    let __VLS_75;
    const __VLS_76 = {
        ...{ click: {} },
        onClick: (...[$event]) => {
            __VLS_ctx.openAccounts(row);
            // @ts-ignore
            [openAccounts,];
        },
    };
    const { default: __VLS_77 } = __VLS_73.slots;
    // @ts-ignore
    [];
    var __VLS_73;
    var __VLS_74;
    let __VLS_78;
    /** @ts-ignore @type { | typeof __VLS_components.elPopconfirm | typeof __VLS_components.ElPopconfirm | typeof __VLS_components['el-popconfirm'] | typeof __VLS_components.elPopconfirm | typeof __VLS_components.ElPopconfirm | typeof __VLS_components['el-popconfirm']} */
    elPopconfirm;
    // @ts-ignore
    const __VLS_79 = __VLS_asFunctionalComponent1(__VLS_78, new __VLS_78({
        ...{ 'onConfirm': {} },
        title: (row.status === 'ENABLE' ? '确定要禁用该商家吗？' : '确定要启用该商家吗？'),
        placement: (__VLS_ctx.POPCONFIRM_CONFIG.placement),
        width: (__VLS_ctx.POPCONFIRM_CONFIG.width),
    }));
    const __VLS_80 = __VLS_79({
        ...{ 'onConfirm': {} },
        title: (row.status === 'ENABLE' ? '确定要禁用该商家吗？' : '确定要启用该商家吗？'),
        placement: (__VLS_ctx.POPCONFIRM_CONFIG.placement),
        width: (__VLS_ctx.POPCONFIRM_CONFIG.width),
    }, ...__VLS_functionalComponentArgsRest(__VLS_79));
    let __VLS_83;
    const __VLS_84 = {
        ...{ confirm: {} },
        onConfirm: (...[$event]) => {
            __VLS_ctx.handleToggleStatus(row);
            // @ts-ignore
            [POPCONFIRM_CONFIG, POPCONFIRM_CONFIG, handleToggleStatus,];
        },
    };
    const { default: __VLS_85 } = __VLS_81.slots;
    {
        const { reference: __VLS_86 } = __VLS_81.slots;
        let __VLS_87;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_88 = __VLS_asFunctionalComponent1(__VLS_87, new __VLS_87({
            link: true,
            type: (row.status === 'ENABLE' ? 'danger' : 'success'),
        }));
        const __VLS_89 = __VLS_88({
            link: true,
            type: (row.status === 'ENABLE' ? 'danger' : 'success'),
        }, ...__VLS_functionalComponentArgsRest(__VLS_88));
        __VLS_asFunctionalDirective(__VLS_directives.vPermission, {})(null, { ...__VLS_directiveBindingRestFields, value: (['admin:user:merchant:edit']) }, null, null);
        const { default: __VLS_92 } = __VLS_90.slots;
        (row.status === 'ENABLE' ? '禁用' : '启用');
        // @ts-ignore
        [vPermission,];
        var __VLS_90;
        // @ts-ignore
        [];
    }
    // @ts-ignore
    [];
    var __VLS_81;
    var __VLS_82;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_3;
var __VLS_4;
let __VLS_93;
/** @ts-ignore @type { | typeof __VLS_components.BaseDialog | typeof __VLS_components.BaseDialog} */
BaseDialog;
// @ts-ignore
const __VLS_94 = __VLS_asFunctionalComponent1(__VLS_93, new __VLS_93({
    ...{ 'onClose': {} },
    modelValue: (__VLS_ctx.dialogVisible),
    title: (__VLS_ctx.editForm.id ? '编辑商家' : '新增商家'),
    width: "600",
}));
const __VLS_95 = __VLS_94({
    ...{ 'onClose': {} },
    modelValue: (__VLS_ctx.dialogVisible),
    title: (__VLS_ctx.editForm.id ? '编辑商家' : '新增商家'),
    width: "600",
}, ...__VLS_functionalComponentArgsRest(__VLS_94));
let __VLS_98;
const __VLS_99 = {
    ...{ close: {} },
    onClose: (...[$event]) => {
        __VLS_ctx.dialogVisible = false;
        // @ts-ignore
        [dialogVisible, dialogVisible, editForm,];
    },
};
const { default: __VLS_100 } = __VLS_96.slots;
let __VLS_101;
/** @ts-ignore @type { | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form'] | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form']} */
elForm;
// @ts-ignore
const __VLS_102 = __VLS_asFunctionalComponent1(__VLS_101, new __VLS_101({
    ref: "formRef",
    model: (__VLS_ctx.editForm),
    rules: (__VLS_ctx.formRules),
    labelWidth: "120px",
}));
const __VLS_103 = __VLS_102({
    ref: "formRef",
    model: (__VLS_ctx.editForm),
    rules: (__VLS_ctx.formRules),
    labelWidth: "120px",
}, ...__VLS_functionalComponentArgsRest(__VLS_102));
var __VLS_106;
const { default: __VLS_108 } = __VLS_104.slots;
let __VLS_109;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_110 = __VLS_asFunctionalComponent1(__VLS_109, new __VLS_109({
    label: "邮箱",
    prop: "email",
}));
const __VLS_111 = __VLS_110({
    label: "邮箱",
    prop: "email",
}, ...__VLS_functionalComponentArgsRest(__VLS_110));
const { default: __VLS_114 } = __VLS_112.slots;
let __VLS_115;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_116 = __VLS_asFunctionalComponent1(__VLS_115, new __VLS_115({
    modelValue: (__VLS_ctx.editForm.email),
}));
const __VLS_117 = __VLS_116({
    modelValue: (__VLS_ctx.editForm.email),
}, ...__VLS_functionalComponentArgsRest(__VLS_116));
// @ts-ignore
[editForm, editForm, formRules,];
var __VLS_112;
if (!__VLS_ctx.editForm.id) {
    let __VLS_120;
    /** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
    elFormItem;
    // @ts-ignore
    const __VLS_121 = __VLS_asFunctionalComponent1(__VLS_120, new __VLS_120({
        label: "密码",
        prop: "password",
    }));
    const __VLS_122 = __VLS_121({
        label: "密码",
        prop: "password",
    }, ...__VLS_functionalComponentArgsRest(__VLS_121));
    const { default: __VLS_125 } = __VLS_123.slots;
    let __VLS_126;
    /** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
    elInput;
    // @ts-ignore
    const __VLS_127 = __VLS_asFunctionalComponent1(__VLS_126, new __VLS_126({
        modelValue: (__VLS_ctx.editForm.password),
        type: "password",
        showPassword: true,
    }));
    const __VLS_128 = __VLS_127({
        modelValue: (__VLS_ctx.editForm.password),
        type: "password",
        showPassword: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_127));
    // @ts-ignore
    [editForm, editForm,];
    var __VLS_123;
}
let __VLS_131;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_132 = __VLS_asFunctionalComponent1(__VLS_131, new __VLS_131({
    label: "店铺名称",
    prop: "name",
}));
const __VLS_133 = __VLS_132({
    label: "店铺名称",
    prop: "name",
}, ...__VLS_functionalComponentArgsRest(__VLS_132));
const { default: __VLS_136 } = __VLS_134.slots;
let __VLS_137;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_138 = __VLS_asFunctionalComponent1(__VLS_137, new __VLS_137({
    modelValue: (__VLS_ctx.editForm.name),
}));
const __VLS_139 = __VLS_138({
    modelValue: (__VLS_ctx.editForm.name),
}, ...__VLS_functionalComponentArgsRest(__VLS_138));
// @ts-ignore
[editForm,];
var __VLS_134;
let __VLS_142;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_143 = __VLS_asFunctionalComponent1(__VLS_142, new __VLS_142({
    label: "手机号",
    prop: "phone",
}));
const __VLS_144 = __VLS_143({
    label: "手机号",
    prop: "phone",
}, ...__VLS_functionalComponentArgsRest(__VLS_143));
const { default: __VLS_147 } = __VLS_145.slots;
let __VLS_148;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_149 = __VLS_asFunctionalComponent1(__VLS_148, new __VLS_148({
    modelValue: (__VLS_ctx.editForm.phone),
}));
const __VLS_150 = __VLS_149({
    modelValue: (__VLS_ctx.editForm.phone),
}, ...__VLS_functionalComponentArgsRest(__VLS_149));
// @ts-ignore
[editForm,];
var __VLS_145;
let __VLS_153;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_154 = __VLS_asFunctionalComponent1(__VLS_153, new __VLS_153({
    label: "国家",
    prop: "country",
}));
const __VLS_155 = __VLS_154({
    label: "国家",
    prop: "country",
}, ...__VLS_functionalComponentArgsRest(__VLS_154));
const { default: __VLS_158 } = __VLS_156.slots;
let __VLS_159;
/** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
elSelect;
// @ts-ignore
const __VLS_160 = __VLS_asFunctionalComponent1(__VLS_159, new __VLS_159({
    modelValue: (__VLS_ctx.editForm.country),
    filterable: true,
    clearable: true,
    placeholder: "请选择国家",
    ...{ style: {} },
}));
const __VLS_161 = __VLS_160({
    modelValue: (__VLS_ctx.editForm.country),
    filterable: true,
    clearable: true,
    placeholder: "请选择国家",
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_160));
const { default: __VLS_164 } = __VLS_162.slots;
for (const [country] of __VLS_vFor((__VLS_ctx.countryOptions))) {
    let __VLS_165;
    /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
    elOption;
    // @ts-ignore
    const __VLS_166 = __VLS_asFunctionalComponent1(__VLS_165, new __VLS_165({
        key: (country.code),
        label: (`${country.name}（${country.code}）`),
        value: (country.code),
    }));
    const __VLS_167 = __VLS_166({
        key: (country.code),
        label: (`${country.name}（${country.code}）`),
        value: (country.code),
    }, ...__VLS_functionalComponentArgsRest(__VLS_166));
    // @ts-ignore
    [editForm, countryOptions,];
}
// @ts-ignore
[];
var __VLS_162;
// @ts-ignore
[];
var __VLS_156;
let __VLS_170;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_171 = __VLS_asFunctionalComponent1(__VLS_170, new __VLS_170({
    label: "语言",
    prop: "language",
}));
const __VLS_172 = __VLS_171({
    label: "语言",
    prop: "language",
}, ...__VLS_functionalComponentArgsRest(__VLS_171));
const { default: __VLS_175 } = __VLS_173.slots;
let __VLS_176;
/** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
elSelect;
// @ts-ignore
const __VLS_177 = __VLS_asFunctionalComponent1(__VLS_176, new __VLS_176({
    modelValue: (__VLS_ctx.editForm.language),
    filterable: true,
    clearable: true,
    placeholder: "请选择语言",
    ...{ style: {} },
}));
const __VLS_178 = __VLS_177({
    modelValue: (__VLS_ctx.editForm.language),
    filterable: true,
    clearable: true,
    placeholder: "请选择语言",
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_177));
const { default: __VLS_181 } = __VLS_179.slots;
for (const [language] of __VLS_vFor((__VLS_ctx.languageOptions))) {
    let __VLS_182;
    /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
    elOption;
    // @ts-ignore
    const __VLS_183 = __VLS_asFunctionalComponent1(__VLS_182, new __VLS_182({
        key: (language.code),
        label: (`${language.name || language.nativeName}（${language.code}）`),
        value: (language.code),
    }));
    const __VLS_184 = __VLS_183({
        key: (language.code),
        label: (`${language.name || language.nativeName}（${language.code}）`),
        value: (language.code),
    }, ...__VLS_functionalComponentArgsRest(__VLS_183));
    // @ts-ignore
    [editForm, languageOptions,];
}
// @ts-ignore
[];
var __VLS_179;
// @ts-ignore
[];
var __VLS_173;
let __VLS_187;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_188 = __VLS_asFunctionalComponent1(__VLS_187, new __VLS_187({
    label: "联系人",
}));
const __VLS_189 = __VLS_188({
    label: "联系人",
}, ...__VLS_functionalComponentArgsRest(__VLS_188));
const { default: __VLS_192 } = __VLS_190.slots;
let __VLS_193;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_194 = __VLS_asFunctionalComponent1(__VLS_193, new __VLS_193({
    modelValue: (__VLS_ctx.editForm.contactName),
}));
const __VLS_195 = __VLS_194({
    modelValue: (__VLS_ctx.editForm.contactName),
}, ...__VLS_functionalComponentArgsRest(__VLS_194));
// @ts-ignore
[editForm,];
var __VLS_190;
let __VLS_198;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_199 = __VLS_asFunctionalComponent1(__VLS_198, new __VLS_198({
    label: "联系电话",
}));
const __VLS_200 = __VLS_199({
    label: "联系电话",
}, ...__VLS_functionalComponentArgsRest(__VLS_199));
const { default: __VLS_203 } = __VLS_201.slots;
let __VLS_204;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_205 = __VLS_asFunctionalComponent1(__VLS_204, new __VLS_204({
    modelValue: (__VLS_ctx.editForm.contactPhone),
}));
const __VLS_206 = __VLS_205({
    modelValue: (__VLS_ctx.editForm.contactPhone),
}, ...__VLS_functionalComponentArgsRest(__VLS_205));
// @ts-ignore
[editForm,];
var __VLS_201;
// @ts-ignore
[];
var __VLS_104;
if (__VLS_ctx.editForm.id && __VLS_ctx.applicationInfo) {
    let __VLS_209;
    /** @ts-ignore @type { | typeof __VLS_components.elDivider | typeof __VLS_components.ElDivider | typeof __VLS_components['el-divider'] | typeof __VLS_components.elDivider | typeof __VLS_components.ElDivider | typeof __VLS_components['el-divider']} */
    elDivider;
    // @ts-ignore
    const __VLS_210 = __VLS_asFunctionalComponent1(__VLS_209, new __VLS_209({
        contentPosition: "left",
    }));
    const __VLS_211 = __VLS_210({
        contentPosition: "left",
    }, ...__VLS_functionalComponentArgsRest(__VLS_210));
    const { default: __VLS_214 } = __VLS_212.slots;
    // @ts-ignore
    [editForm, applicationInfo,];
    var __VLS_212;
    let __VLS_215;
    /** @ts-ignore @type { | typeof __VLS_components.elDescriptions | typeof __VLS_components.ElDescriptions | typeof __VLS_components['el-descriptions'] | typeof __VLS_components.elDescriptions | typeof __VLS_components.ElDescriptions | typeof __VLS_components['el-descriptions']} */
    elDescriptions;
    // @ts-ignore
    const __VLS_216 = __VLS_asFunctionalComponent1(__VLS_215, new __VLS_215({
        column: (1),
        border: true,
        size: "small",
    }));
    const __VLS_217 = __VLS_216({
        column: (1),
        border: true,
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_216));
    const { default: __VLS_220 } = __VLS_218.slots;
    let __VLS_221;
    /** @ts-ignore @type { | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item'] | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item']} */
    elDescriptionsItem;
    // @ts-ignore
    const __VLS_222 = __VLS_asFunctionalComponent1(__VLS_221, new __VLS_221({
        label: "姓名",
    }));
    const __VLS_223 = __VLS_222({
        label: "姓名",
    }, ...__VLS_functionalComponentArgsRest(__VLS_222));
    const { default: __VLS_226 } = __VLS_224.slots;
    (__VLS_ctx.applicationInfo.fullName || '-');
    // @ts-ignore
    [applicationInfo,];
    var __VLS_224;
    let __VLS_227;
    /** @ts-ignore @type { | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item'] | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item']} */
    elDescriptionsItem;
    // @ts-ignore
    const __VLS_228 = __VLS_asFunctionalComponent1(__VLS_227, new __VLS_227({
        label: "年龄",
    }));
    const __VLS_229 = __VLS_228({
        label: "年龄",
    }, ...__VLS_functionalComponentArgsRest(__VLS_228));
    const { default: __VLS_232 } = __VLS_230.slots;
    (__VLS_ctx.applicationInfo.age ?? '-');
    // @ts-ignore
    [applicationInfo,];
    var __VLS_230;
    let __VLS_233;
    /** @ts-ignore @type { | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item'] | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item']} */
    elDescriptionsItem;
    // @ts-ignore
    const __VLS_234 = __VLS_asFunctionalComponent1(__VLS_233, new __VLS_233({
        label: "申请邮箱",
    }));
    const __VLS_235 = __VLS_234({
        label: "申请邮箱",
    }, ...__VLS_functionalComponentArgsRest(__VLS_234));
    const { default: __VLS_238 } = __VLS_236.slots;
    (__VLS_ctx.applicationInfo.email || '-');
    // @ts-ignore
    [applicationInfo,];
    var __VLS_236;
    let __VLS_239;
    /** @ts-ignore @type { | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item'] | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item']} */
    elDescriptionsItem;
    // @ts-ignore
    const __VLS_240 = __VLS_asFunctionalComponent1(__VLS_239, new __VLS_239({
        label: "申请手机号",
    }));
    const __VLS_241 = __VLS_240({
        label: "申请手机号",
    }, ...__VLS_functionalComponentArgsRest(__VLS_240));
    const { default: __VLS_244 } = __VLS_242.slots;
    (__VLS_ctx.applicationInfo.phone || '-');
    // @ts-ignore
    [applicationInfo,];
    var __VLS_242;
    let __VLS_245;
    /** @ts-ignore @type { | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item'] | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item']} */
    elDescriptionsItem;
    // @ts-ignore
    const __VLS_246 = __VLS_asFunctionalComponent1(__VLS_245, new __VLS_245({
        label: "家庭地址",
    }));
    const __VLS_247 = __VLS_246({
        label: "家庭地址",
    }, ...__VLS_functionalComponentArgsRest(__VLS_246));
    const { default: __VLS_250 } = __VLS_248.slots;
    (__VLS_ctx.applicationInfo.homeAddress || '-');
    // @ts-ignore
    [applicationInfo,];
    var __VLS_248;
    let __VLS_251;
    /** @ts-ignore @type { | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item'] | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item']} */
    elDescriptionsItem;
    // @ts-ignore
    const __VLS_252 = __VLS_asFunctionalComponent1(__VLS_251, new __VLS_251({
        label: "证件正面",
    }));
    const __VLS_253 = __VLS_252({
        label: "证件正面",
    }, ...__VLS_functionalComponentArgsRest(__VLS_252));
    const { default: __VLS_256 } = __VLS_254.slots;
    let __VLS_257;
    /** @ts-ignore @type { | typeof __VLS_components.MerchantAppFile} */
    MerchantAppFile;
    // @ts-ignore
    const __VLS_258 = __VLS_asFunctionalComponent1(__VLS_257, new __VLS_257({
        applicationId: (__VLS_ctx.applicationInfo.id),
        field: "idCardFront",
        has: (!!__VLS_ctx.applicationInfo.idCardFrontUrl),
        kind: "image",
    }));
    const __VLS_259 = __VLS_258({
        applicationId: (__VLS_ctx.applicationInfo.id),
        field: "idCardFront",
        has: (!!__VLS_ctx.applicationInfo.idCardFrontUrl),
        kind: "image",
    }, ...__VLS_functionalComponentArgsRest(__VLS_258));
    // @ts-ignore
    [applicationInfo, applicationInfo,];
    var __VLS_254;
    let __VLS_262;
    /** @ts-ignore @type { | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item'] | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item']} */
    elDescriptionsItem;
    // @ts-ignore
    const __VLS_263 = __VLS_asFunctionalComponent1(__VLS_262, new __VLS_262({
        label: "证件背面",
    }));
    const __VLS_264 = __VLS_263({
        label: "证件背面",
    }, ...__VLS_functionalComponentArgsRest(__VLS_263));
    const { default: __VLS_267 } = __VLS_265.slots;
    let __VLS_268;
    /** @ts-ignore @type { | typeof __VLS_components.MerchantAppFile} */
    MerchantAppFile;
    // @ts-ignore
    const __VLS_269 = __VLS_asFunctionalComponent1(__VLS_268, new __VLS_268({
        applicationId: (__VLS_ctx.applicationInfo.id),
        field: "idCardBack",
        has: (!!__VLS_ctx.applicationInfo.idCardBackUrl),
        kind: "image",
    }));
    const __VLS_270 = __VLS_269({
        applicationId: (__VLS_ctx.applicationInfo.id),
        field: "idCardBack",
        has: (!!__VLS_ctx.applicationInfo.idCardBackUrl),
        kind: "image",
    }, ...__VLS_functionalComponentArgsRest(__VLS_269));
    // @ts-ignore
    [applicationInfo, applicationInfo,];
    var __VLS_265;
    let __VLS_273;
    /** @ts-ignore @type { | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item'] | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item']} */
    elDescriptionsItem;
    // @ts-ignore
    const __VLS_274 = __VLS_asFunctionalComponent1(__VLS_273, new __VLS_273({
        label: "护照页",
    }));
    const __VLS_275 = __VLS_274({
        label: "护照页",
    }, ...__VLS_functionalComponentArgsRest(__VLS_274));
    const { default: __VLS_278 } = __VLS_276.slots;
    let __VLS_279;
    /** @ts-ignore @type { | typeof __VLS_components.MerchantAppFile} */
    MerchantAppFile;
    // @ts-ignore
    const __VLS_280 = __VLS_asFunctionalComponent1(__VLS_279, new __VLS_279({
        applicationId: (__VLS_ctx.applicationInfo.id),
        field: "passport",
        has: (!!__VLS_ctx.applicationInfo.passportPageUrl),
        kind: "image",
    }));
    const __VLS_281 = __VLS_280({
        applicationId: (__VLS_ctx.applicationInfo.id),
        field: "passport",
        has: (!!__VLS_ctx.applicationInfo.passportPageUrl),
        kind: "image",
    }, ...__VLS_functionalComponentArgsRest(__VLS_280));
    // @ts-ignore
    [applicationInfo, applicationInfo,];
    var __VLS_276;
    let __VLS_284;
    /** @ts-ignore @type { | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item'] | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item']} */
    elDescriptionsItem;
    // @ts-ignore
    const __VLS_285 = __VLS_asFunctionalComponent1(__VLS_284, new __VLS_284({
        label: "驾驶证",
    }));
    const __VLS_286 = __VLS_285({
        label: "驾驶证",
    }, ...__VLS_functionalComponentArgsRest(__VLS_285));
    const { default: __VLS_289 } = __VLS_287.slots;
    let __VLS_290;
    /** @ts-ignore @type { | typeof __VLS_components.MerchantAppFile} */
    MerchantAppFile;
    // @ts-ignore
    const __VLS_291 = __VLS_asFunctionalComponent1(__VLS_290, new __VLS_290({
        applicationId: (__VLS_ctx.applicationInfo.id),
        field: "driverLicense",
        has: (!!__VLS_ctx.applicationInfo.driverLicenseUrl),
        kind: "image",
    }));
    const __VLS_292 = __VLS_291({
        applicationId: (__VLS_ctx.applicationInfo.id),
        field: "driverLicense",
        has: (!!__VLS_ctx.applicationInfo.driverLicenseUrl),
        kind: "image",
    }, ...__VLS_functionalComponentArgsRest(__VLS_291));
    // @ts-ignore
    [applicationInfo, applicationInfo,];
    var __VLS_287;
    let __VLS_295;
    /** @ts-ignore @type { | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item'] | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item']} */
    elDescriptionsItem;
    // @ts-ignore
    const __VLS_296 = __VLS_asFunctionalComponent1(__VLS_295, new __VLS_295({
        label: "手持证件视频",
    }));
    const __VLS_297 = __VLS_296({
        label: "手持证件视频",
    }, ...__VLS_functionalComponentArgsRest(__VLS_296));
    const { default: __VLS_300 } = __VLS_298.slots;
    let __VLS_301;
    /** @ts-ignore @type { | typeof __VLS_components.MerchantAppFile} */
    MerchantAppFile;
    // @ts-ignore
    const __VLS_302 = __VLS_asFunctionalComponent1(__VLS_301, new __VLS_301({
        applicationId: (__VLS_ctx.applicationInfo.id),
        field: "handheldVideo",
        has: (!!__VLS_ctx.applicationInfo.handheldDocumentVideoUrl),
        kind: "video",
    }));
    const __VLS_303 = __VLS_302({
        applicationId: (__VLS_ctx.applicationInfo.id),
        field: "handheldVideo",
        has: (!!__VLS_ctx.applicationInfo.handheldDocumentVideoUrl),
        kind: "video",
    }, ...__VLS_functionalComponentArgsRest(__VLS_302));
    // @ts-ignore
    [applicationInfo, applicationInfo,];
    var __VLS_298;
    let __VLS_306;
    /** @ts-ignore @type { | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item'] | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item']} */
    elDescriptionsItem;
    // @ts-ignore
    const __VLS_307 = __VLS_asFunctionalComponent1(__VLS_306, new __VLS_306({
        label: "审核备注",
    }));
    const __VLS_308 = __VLS_307({
        label: "审核备注",
    }, ...__VLS_functionalComponentArgsRest(__VLS_307));
    const { default: __VLS_311 } = __VLS_309.slots;
    (__VLS_ctx.applicationInfo.reviewRemark || '-');
    // @ts-ignore
    [applicationInfo,];
    var __VLS_309;
    // @ts-ignore
    [];
    var __VLS_218;
}
{
    const { footer: __VLS_312 } = __VLS_96.slots;
    let __VLS_313;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_314 = __VLS_asFunctionalComponent1(__VLS_313, new __VLS_313({
        ...{ 'onClick': {} },
    }));
    const __VLS_315 = __VLS_314({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_314));
    let __VLS_318;
    const __VLS_319 = {
        ...{ click: {} },
        onClick: (...[$event]) => {
            __VLS_ctx.dialogVisible = false;
            // @ts-ignore
            [dialogVisible,];
        },
    };
    const { default: __VLS_320 } = __VLS_316.slots;
    // @ts-ignore
    [];
    var __VLS_316;
    var __VLS_317;
    let __VLS_321;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_322 = __VLS_asFunctionalComponent1(__VLS_321, new __VLS_321({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.submitLoading),
    }));
    const __VLS_323 = __VLS_322({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.submitLoading),
    }, ...__VLS_functionalComponentArgsRest(__VLS_322));
    let __VLS_326;
    const __VLS_327 = {
        ...{ click: {} },
        onClick: (__VLS_ctx.handleSubmit),
    };
    const { default: __VLS_328 } = __VLS_324.slots;
    // @ts-ignore
    [submitLoading, handleSubmit,];
    var __VLS_324;
    var __VLS_325;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_96;
var __VLS_97;
let __VLS_329;
/** @ts-ignore @type { | typeof __VLS_components.BaseDialog | typeof __VLS_components.BaseDialog} */
BaseDialog;
// @ts-ignore
const __VLS_330 = __VLS_asFunctionalComponent1(__VLS_329, new __VLS_329({
    ...{ 'onClose': {} },
    modelValue: (__VLS_ctx.fundVisible),
    title: "商家资金",
    width: "760",
}));
const __VLS_331 = __VLS_330({
    ...{ 'onClose': {} },
    modelValue: (__VLS_ctx.fundVisible),
    title: "商家资金",
    width: "760",
}, ...__VLS_functionalComponentArgsRest(__VLS_330));
let __VLS_334;
const __VLS_335 = {
    ...{ close: {} },
    onClose: (...[$event]) => {
        __VLS_ctx.fundVisible = false;
        // @ts-ignore
        [fundVisible, fundVisible,];
    },
};
const { default: __VLS_336 } = __VLS_332.slots;
let __VLS_337;
/** @ts-ignore @type { | typeof __VLS_components.elDescriptions | typeof __VLS_components.ElDescriptions | typeof __VLS_components['el-descriptions'] | typeof __VLS_components.elDescriptions | typeof __VLS_components.ElDescriptions | typeof __VLS_components['el-descriptions']} */
elDescriptions;
// @ts-ignore
const __VLS_338 = __VLS_asFunctionalComponent1(__VLS_337, new __VLS_337({
    column: (2),
    border: true,
    size: "small",
    ...{ style: {} },
}));
const __VLS_339 = __VLS_338({
    column: (2),
    border: true,
    size: "small",
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_338));
const { default: __VLS_342 } = __VLS_340.slots;
let __VLS_343;
/** @ts-ignore @type { | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item'] | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item']} */
elDescriptionsItem;
// @ts-ignore
const __VLS_344 = __VLS_asFunctionalComponent1(__VLS_343, new __VLS_343({
    label: "店铺",
}));
const __VLS_345 = __VLS_344({
    label: "店铺",
}, ...__VLS_functionalComponentArgsRest(__VLS_344));
const { default: __VLS_348 } = __VLS_346.slots;
(__VLS_ctx.fundMerchant.shopName);
// @ts-ignore
[fundMerchant,];
var __VLS_346;
let __VLS_349;
/** @ts-ignore @type { | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item'] | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item']} */
elDescriptionsItem;
// @ts-ignore
const __VLS_350 = __VLS_asFunctionalComponent1(__VLS_349, new __VLS_349({
    label: "结算货币",
}));
const __VLS_351 = __VLS_350({
    label: "结算货币",
}, ...__VLS_functionalComponentArgsRest(__VLS_350));
const { default: __VLS_354 } = __VLS_352.slots;
(__VLS_ctx.fundMerchant.currencyCode || 'USD');
if (__VLS_ctx.fundMerchant.exchangeRate) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    (__VLS_ctx.fundMerchant.exchangeRate);
    (__VLS_ctx.fundMerchant.currencyCode);
}
// @ts-ignore
[fundMerchant, fundMerchant, fundMerchant, fundMerchant,];
var __VLS_352;
let __VLS_355;
/** @ts-ignore @type { | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item'] | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item']} */
elDescriptionsItem;
// @ts-ignore
const __VLS_356 = __VLS_asFunctionalComponent1(__VLS_355, new __VLS_355({
    label: "可用余额",
}));
const __VLS_357 = __VLS_356({
    label: "可用余额",
}, ...__VLS_functionalComponentArgsRest(__VLS_356));
const { default: __VLS_360 } = __VLS_358.slots;
(__VLS_ctx.fundMerchant.currencySymbol || '');
(__VLS_ctx.fundMerchant.balance ?? 0);
// @ts-ignore
[fundMerchant, fundMerchant,];
var __VLS_358;
let __VLS_361;
/** @ts-ignore @type { | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item'] | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item']} */
elDescriptionsItem;
// @ts-ignore
const __VLS_362 = __VLS_asFunctionalComponent1(__VLS_361, new __VLS_361({
    label: "冻结余额",
}));
const __VLS_363 = __VLS_362({
    label: "冻结余额",
}, ...__VLS_functionalComponentArgsRest(__VLS_362));
const { default: __VLS_366 } = __VLS_364.slots;
(__VLS_ctx.fundMerchant.currencySymbol || '');
(__VLS_ctx.fundMerchant.frozenBalance ?? 0);
// @ts-ignore
[fundMerchant, fundMerchant,];
var __VLS_364;
// @ts-ignore
[];
var __VLS_340;
let __VLS_367;
/** @ts-ignore @type { | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form'] | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form']} */
elForm;
// @ts-ignore
const __VLS_368 = __VLS_asFunctionalComponent1(__VLS_367, new __VLS_367({
    inline: (true),
    model: (__VLS_ctx.fundForm),
    ...{ class: "fund-form" },
}));
const __VLS_369 = __VLS_368({
    inline: (true),
    model: (__VLS_ctx.fundForm),
    ...{ class: "fund-form" },
}, ...__VLS_functionalComponentArgsRest(__VLS_368));
/** @type {__VLS_StyleScopedClasses['fund-form']} */ ;
const { default: __VLS_372 } = __VLS_370.slots;
let __VLS_373;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_374 = __VLS_asFunctionalComponent1(__VLS_373, new __VLS_373({
    label: "方向",
}));
const __VLS_375 = __VLS_374({
    label: "方向",
}, ...__VLS_functionalComponentArgsRest(__VLS_374));
const { default: __VLS_378 } = __VLS_376.slots;
let __VLS_379;
/** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
elSelect;
// @ts-ignore
const __VLS_380 = __VLS_asFunctionalComponent1(__VLS_379, new __VLS_379({
    modelValue: (__VLS_ctx.fundForm.direction),
    ...{ style: {} },
}));
const __VLS_381 = __VLS_380({
    modelValue: (__VLS_ctx.fundForm.direction),
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_380));
const { default: __VLS_384 } = __VLS_382.slots;
let __VLS_385;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_386 = __VLS_asFunctionalComponent1(__VLS_385, new __VLS_385({
    label: "增加",
    value: "INCREASE",
}));
const __VLS_387 = __VLS_386({
    label: "增加",
    value: "INCREASE",
}, ...__VLS_functionalComponentArgsRest(__VLS_386));
let __VLS_390;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_391 = __VLS_asFunctionalComponent1(__VLS_390, new __VLS_390({
    label: "扣减",
    value: "DECREASE",
}));
const __VLS_392 = __VLS_391({
    label: "扣减",
    value: "DECREASE",
}, ...__VLS_functionalComponentArgsRest(__VLS_391));
let __VLS_395;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_396 = __VLS_asFunctionalComponent1(__VLS_395, new __VLS_395({
    label: "冻结",
    value: "FREEZE",
}));
const __VLS_397 = __VLS_396({
    label: "冻结",
    value: "FREEZE",
}, ...__VLS_functionalComponentArgsRest(__VLS_396));
let __VLS_400;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_401 = __VLS_asFunctionalComponent1(__VLS_400, new __VLS_400({
    label: "解冻",
    value: "UNFREEZE",
}));
const __VLS_402 = __VLS_401({
    label: "解冻",
    value: "UNFREEZE",
}, ...__VLS_functionalComponentArgsRest(__VLS_401));
// @ts-ignore
[fundForm, fundForm,];
var __VLS_382;
// @ts-ignore
[];
var __VLS_376;
let __VLS_405;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_406 = __VLS_asFunctionalComponent1(__VLS_405, new __VLS_405({
    label: "金额",
}));
const __VLS_407 = __VLS_406({
    label: "金额",
}, ...__VLS_functionalComponentArgsRest(__VLS_406));
const { default: __VLS_410 } = __VLS_408.slots;
let __VLS_411;
/** @ts-ignore @type { | typeof __VLS_components.elInputNumber | typeof __VLS_components.ElInputNumber | typeof __VLS_components['el-input-number']} */
elInputNumber;
// @ts-ignore
const __VLS_412 = __VLS_asFunctionalComponent1(__VLS_411, new __VLS_411({
    modelValue: (__VLS_ctx.fundForm.amount),
    min: (0.01),
    precision: (2),
    step: (100),
}));
const __VLS_413 = __VLS_412({
    modelValue: (__VLS_ctx.fundForm.amount),
    min: (0.01),
    precision: (2),
    step: (100),
}, ...__VLS_functionalComponentArgsRest(__VLS_412));
let __VLS_416;
/** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
elSelect;
// @ts-ignore
const __VLS_417 = __VLS_asFunctionalComponent1(__VLS_416, new __VLS_416({
    modelValue: (__VLS_ctx.fundForm.amountCurrency),
    ...{ style: {} },
}));
const __VLS_418 = __VLS_417({
    modelValue: (__VLS_ctx.fundForm.amountCurrency),
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_417));
const { default: __VLS_421 } = __VLS_419.slots;
let __VLS_422;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_423 = __VLS_asFunctionalComponent1(__VLS_422, new __VLS_422({
    label: (__VLS_ctx.fundMerchant.currencyCode || '本地货币'),
    value: "LOCAL",
}));
const __VLS_424 = __VLS_423({
    label: (__VLS_ctx.fundMerchant.currencyCode || '本地货币'),
    value: "LOCAL",
}, ...__VLS_functionalComponentArgsRest(__VLS_423));
let __VLS_427;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_428 = __VLS_asFunctionalComponent1(__VLS_427, new __VLS_427({
    label: "美元 USD",
    value: "USD",
}));
const __VLS_429 = __VLS_428({
    label: "美元 USD",
    value: "USD",
}, ...__VLS_functionalComponentArgsRest(__VLS_428));
// @ts-ignore
[fundMerchant, fundForm, fundForm,];
var __VLS_419;
// @ts-ignore
[];
var __VLS_408;
if (__VLS_ctx.fundForm.amount) {
    let __VLS_432;
    /** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
    elFormItem;
    // @ts-ignore
    const __VLS_433 = __VLS_asFunctionalComponent1(__VLS_432, new __VLS_432({
        label: "入账金额",
    }));
    const __VLS_434 = __VLS_433({
        label: "入账金额",
    }, ...__VLS_functionalComponentArgsRest(__VLS_433));
    const { default: __VLS_437 } = __VLS_435.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "currency-preview" },
    });
    /** @type {__VLS_StyleScopedClasses['currency-preview']} */ ;
    (__VLS_ctx.fundMerchant.currencySymbol || '');
    (__VLS_ctx.convertedFundAmount);
    (__VLS_ctx.fundMerchant.currencyCode || 'USD');
    // @ts-ignore
    [fundMerchant, fundMerchant, fundForm, convertedFundAmount,];
    var __VLS_435;
}
let __VLS_438;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_439 = __VLS_asFunctionalComponent1(__VLS_438, new __VLS_438({
    label: "备注",
}));
const __VLS_440 = __VLS_439({
    label: "备注",
}, ...__VLS_functionalComponentArgsRest(__VLS_439));
const { default: __VLS_443 } = __VLS_441.slots;
let __VLS_444;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_445 = __VLS_asFunctionalComponent1(__VLS_444, new __VLS_444({
    modelValue: (__VLS_ctx.fundForm.remark),
    placeholder: "必填，请填写资金调整原因",
    ...{ style: {} },
}));
const __VLS_446 = __VLS_445({
    modelValue: (__VLS_ctx.fundForm.remark),
    placeholder: "必填，请填写资金调整原因",
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_445));
// @ts-ignore
[fundForm,];
var __VLS_441;
let __VLS_449;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_450 = __VLS_asFunctionalComponent1(__VLS_449, new __VLS_449({}));
const __VLS_451 = __VLS_450({}, ...__VLS_functionalComponentArgsRest(__VLS_450));
const { default: __VLS_454 } = __VLS_452.slots;
let __VLS_455;
/** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
elButton;
// @ts-ignore
const __VLS_456 = __VLS_asFunctionalComponent1(__VLS_455, new __VLS_455({
    ...{ 'onClick': {} },
    type: "primary",
    loading: (__VLS_ctx.fundSubmitting),
}));
const __VLS_457 = __VLS_456({
    ...{ 'onClick': {} },
    type: "primary",
    loading: (__VLS_ctx.fundSubmitting),
}, ...__VLS_functionalComponentArgsRest(__VLS_456));
let __VLS_460;
const __VLS_461 = {
    ...{ click: {} },
    onClick: (__VLS_ctx.handleAdjustFund),
};
const { default: __VLS_462 } = __VLS_458.slots;
// @ts-ignore
[fundSubmitting, handleAdjustFund,];
var __VLS_458;
var __VLS_459;
// @ts-ignore
[];
var __VLS_452;
// @ts-ignore
[];
var __VLS_370;
let __VLS_463;
/** @ts-ignore @type { | typeof __VLS_components.elTable | typeof __VLS_components.ElTable | typeof __VLS_components['el-table'] | typeof __VLS_components.elTable | typeof __VLS_components.ElTable | typeof __VLS_components['el-table']} */
elTable;
// @ts-ignore
const __VLS_464 = __VLS_asFunctionalComponent1(__VLS_463, new __VLS_463({
    data: (__VLS_ctx.fundLogs),
    border: true,
    size: "small",
    maxHeight: "320",
}));
const __VLS_465 = __VLS_464({
    data: (__VLS_ctx.fundLogs),
    border: true,
    size: "small",
    maxHeight: "320",
}, ...__VLS_functionalComponentArgsRest(__VLS_464));
__VLS_asFunctionalDirective(__VLS_directives.vLoading, {})(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.fundLoading) }, null, null);
const { default: __VLS_468 } = __VLS_466.slots;
let __VLS_469;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_470 = __VLS_asFunctionalComponent1(__VLS_469, new __VLS_469({
    prop: "createdAt",
    label: "时间",
    minWidth: "160",
}));
const __VLS_471 = __VLS_470({
    prop: "createdAt",
    label: "时间",
    minWidth: "160",
}, ...__VLS_functionalComponentArgsRest(__VLS_470));
let __VLS_474;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_475 = __VLS_asFunctionalComponent1(__VLS_474, new __VLS_474({
    prop: "type",
    label: "类型",
    width: "140",
}));
const __VLS_476 = __VLS_475({
    prop: "type",
    label: "类型",
    width: "140",
}, ...__VLS_functionalComponentArgsRest(__VLS_475));
let __VLS_479;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_480 = __VLS_asFunctionalComponent1(__VLS_479, new __VLS_479({
    prop: "balanceBefore",
    label: "变动前",
    width: "110",
}));
const __VLS_481 = __VLS_480({
    prop: "balanceBefore",
    label: "变动前",
    width: "110",
}, ...__VLS_functionalComponentArgsRest(__VLS_480));
let __VLS_484;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_485 = __VLS_asFunctionalComponent1(__VLS_484, new __VLS_484({
    prop: "amount",
    label: "金额",
    width: "110",
}));
const __VLS_486 = __VLS_485({
    prop: "amount",
    label: "金额",
    width: "110",
}, ...__VLS_functionalComponentArgsRest(__VLS_485));
let __VLS_489;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_490 = __VLS_asFunctionalComponent1(__VLS_489, new __VLS_489({
    prop: "balanceAfter",
    label: "变动后余额",
    width: "120",
}));
const __VLS_491 = __VLS_490({
    prop: "balanceAfter",
    label: "变动后余额",
    width: "120",
}, ...__VLS_functionalComponentArgsRest(__VLS_490));
let __VLS_494;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_495 = __VLS_asFunctionalComponent1(__VLS_494, new __VLS_494({
    prop: "frozenBalanceBefore",
    label: "冻结前",
    width: "110",
}));
const __VLS_496 = __VLS_495({
    prop: "frozenBalanceBefore",
    label: "冻结前",
    width: "110",
}, ...__VLS_functionalComponentArgsRest(__VLS_495));
let __VLS_499;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_500 = __VLS_asFunctionalComponent1(__VLS_499, new __VLS_499({
    prop: "frozenBalanceAfter",
    label: "冻结后",
    width: "110",
}));
const __VLS_501 = __VLS_500({
    prop: "frozenBalanceAfter",
    label: "冻结后",
    width: "110",
}, ...__VLS_functionalComponentArgsRest(__VLS_500));
let __VLS_504;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_505 = __VLS_asFunctionalComponent1(__VLS_504, new __VLS_504({
    prop: "remark",
    label: "备注",
    minWidth: "140",
}));
const __VLS_506 = __VLS_505({
    prop: "remark",
    label: "备注",
    minWidth: "140",
}, ...__VLS_functionalComponentArgsRest(__VLS_505));
// @ts-ignore
[fundLogs, vLoading, fundLoading,];
var __VLS_466;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "fund-pager" },
});
/** @type {__VLS_StyleScopedClasses['fund-pager']} */ ;
let __VLS_509;
/** @ts-ignore @type { | typeof __VLS_components.elPagination | typeof __VLS_components.ElPagination | typeof __VLS_components['el-pagination']} */
elPagination;
// @ts-ignore
const __VLS_510 = __VLS_asFunctionalComponent1(__VLS_509, new __VLS_509({
    ...{ 'onCurrentChange': {} },
    currentPage: (__VLS_ctx.fundPage),
    pageSize: (__VLS_ctx.fundPageSize),
    total: (__VLS_ctx.fundTotal),
    layout: "total, prev, pager, next",
}));
const __VLS_511 = __VLS_510({
    ...{ 'onCurrentChange': {} },
    currentPage: (__VLS_ctx.fundPage),
    pageSize: (__VLS_ctx.fundPageSize),
    total: (__VLS_ctx.fundTotal),
    layout: "total, prev, pager, next",
}, ...__VLS_functionalComponentArgsRest(__VLS_510));
let __VLS_514;
const __VLS_515 = {
    ...{ currentChange: {} },
    onCurrentChange: (__VLS_ctx.loadFundLogs),
};
var __VLS_512;
var __VLS_513;
// @ts-ignore
[fundPage, fundPageSize, fundTotal, loadFundLogs,];
var __VLS_332;
var __VLS_333;
let __VLS_516;
/** @ts-ignore @type { | typeof __VLS_components.BaseDialog | typeof __VLS_components.BaseDialog} */
BaseDialog;
// @ts-ignore
const __VLS_517 = __VLS_asFunctionalComponent1(__VLS_516, new __VLS_516({
    ...{ 'onClose': {} },
    modelValue: (__VLS_ctx.pwdVisible),
    title: "修改商家密码",
    width: "480",
}));
const __VLS_518 = __VLS_517({
    ...{ 'onClose': {} },
    modelValue: (__VLS_ctx.pwdVisible),
    title: "修改商家密码",
    width: "480",
}, ...__VLS_functionalComponentArgsRest(__VLS_517));
let __VLS_521;
const __VLS_522 = {
    ...{ close: {} },
    onClose: (...[$event]) => {
        __VLS_ctx.pwdVisible = false;
        // @ts-ignore
        [pwdVisible, pwdVisible,];
    },
};
const { default: __VLS_523 } = __VLS_519.slots;
let __VLS_524;
/** @ts-ignore @type { | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form'] | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form']} */
elForm;
// @ts-ignore
const __VLS_525 = __VLS_asFunctionalComponent1(__VLS_524, new __VLS_524({
    ref: "pwdFormRef",
    model: (__VLS_ctx.pwdForm),
    rules: (__VLS_ctx.pwdRules),
    labelWidth: "110px",
}));
const __VLS_526 = __VLS_525({
    ref: "pwdFormRef",
    model: (__VLS_ctx.pwdForm),
    rules: (__VLS_ctx.pwdRules),
    labelWidth: "110px",
}, ...__VLS_functionalComponentArgsRest(__VLS_525));
var __VLS_529;
const { default: __VLS_531 } = __VLS_527.slots;
let __VLS_532;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_533 = __VLS_asFunctionalComponent1(__VLS_532, new __VLS_532({
    label: "密码类型",
    prop: "type",
}));
const __VLS_534 = __VLS_533({
    label: "密码类型",
    prop: "type",
}, ...__VLS_functionalComponentArgsRest(__VLS_533));
const { default: __VLS_537 } = __VLS_535.slots;
let __VLS_538;
/** @ts-ignore @type { | typeof __VLS_components.elRadioGroup | typeof __VLS_components.ElRadioGroup | typeof __VLS_components['el-radio-group'] | typeof __VLS_components.elRadioGroup | typeof __VLS_components.ElRadioGroup | typeof __VLS_components['el-radio-group']} */
elRadioGroup;
// @ts-ignore
const __VLS_539 = __VLS_asFunctionalComponent1(__VLS_538, new __VLS_538({
    modelValue: (__VLS_ctx.pwdForm.type),
}));
const __VLS_540 = __VLS_539({
    modelValue: (__VLS_ctx.pwdForm.type),
}, ...__VLS_functionalComponentArgsRest(__VLS_539));
const { default: __VLS_543 } = __VLS_541.slots;
let __VLS_544;
/** @ts-ignore @type { | typeof __VLS_components.elRadio | typeof __VLS_components.ElRadio | typeof __VLS_components['el-radio'] | typeof __VLS_components.elRadio | typeof __VLS_components.ElRadio | typeof __VLS_components['el-radio']} */
elRadio;
// @ts-ignore
const __VLS_545 = __VLS_asFunctionalComponent1(__VLS_544, new __VLS_544({
    label: "LOGIN",
}));
const __VLS_546 = __VLS_545({
    label: "LOGIN",
}, ...__VLS_functionalComponentArgsRest(__VLS_545));
const { default: __VLS_549 } = __VLS_547.slots;
// @ts-ignore
[pwdForm, pwdForm, pwdRules,];
var __VLS_547;
let __VLS_550;
/** @ts-ignore @type { | typeof __VLS_components.elRadio | typeof __VLS_components.ElRadio | typeof __VLS_components['el-radio'] | typeof __VLS_components.elRadio | typeof __VLS_components.ElRadio | typeof __VLS_components['el-radio']} */
elRadio;
// @ts-ignore
const __VLS_551 = __VLS_asFunctionalComponent1(__VLS_550, new __VLS_550({
    label: "WITHDRAW",
}));
const __VLS_552 = __VLS_551({
    label: "WITHDRAW",
}, ...__VLS_functionalComponentArgsRest(__VLS_551));
const { default: __VLS_555 } = __VLS_553.slots;
// @ts-ignore
[];
var __VLS_553;
// @ts-ignore
[];
var __VLS_541;
// @ts-ignore
[];
var __VLS_535;
let __VLS_556;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_557 = __VLS_asFunctionalComponent1(__VLS_556, new __VLS_556({
    label: "新密码",
    prop: "password",
}));
const __VLS_558 = __VLS_557({
    label: "新密码",
    prop: "password",
}, ...__VLS_functionalComponentArgsRest(__VLS_557));
const { default: __VLS_561 } = __VLS_559.slots;
let __VLS_562;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_563 = __VLS_asFunctionalComponent1(__VLS_562, new __VLS_562({
    modelValue: (__VLS_ctx.pwdForm.password),
    type: "password",
    showPassword: true,
    placeholder: "至少6位",
}));
const __VLS_564 = __VLS_563({
    modelValue: (__VLS_ctx.pwdForm.password),
    type: "password",
    showPassword: true,
    placeholder: "至少6位",
}, ...__VLS_functionalComponentArgsRest(__VLS_563));
// @ts-ignore
[pwdForm,];
var __VLS_559;
// @ts-ignore
[];
var __VLS_527;
{
    const { footer: __VLS_567 } = __VLS_519.slots;
    let __VLS_568;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_569 = __VLS_asFunctionalComponent1(__VLS_568, new __VLS_568({
        ...{ 'onClick': {} },
    }));
    const __VLS_570 = __VLS_569({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_569));
    let __VLS_573;
    const __VLS_574 = {
        ...{ click: {} },
        onClick: (...[$event]) => {
            __VLS_ctx.pwdVisible = false;
            // @ts-ignore
            [pwdVisible,];
        },
    };
    const { default: __VLS_575 } = __VLS_571.slots;
    // @ts-ignore
    [];
    var __VLS_571;
    var __VLS_572;
    let __VLS_576;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_577 = __VLS_asFunctionalComponent1(__VLS_576, new __VLS_576({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.pwdSubmitting),
    }));
    const __VLS_578 = __VLS_577({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.pwdSubmitting),
    }, ...__VLS_functionalComponentArgsRest(__VLS_577));
    let __VLS_581;
    const __VLS_582 = {
        ...{ click: {} },
        onClick: (__VLS_ctx.handleResetPassword),
    };
    const { default: __VLS_583 } = __VLS_579.slots;
    // @ts-ignore
    [pwdSubmitting, handleResetPassword,];
    var __VLS_579;
    var __VLS_580;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_519;
var __VLS_520;
let __VLS_584;
/** @ts-ignore @type { | typeof __VLS_components.BaseDialog | typeof __VLS_components.BaseDialog} */
BaseDialog;
// @ts-ignore
const __VLS_585 = __VLS_asFunctionalComponent1(__VLS_584, new __VLS_584({
    ...{ 'onClose': {} },
    modelValue: (__VLS_ctx.accountsVisible),
    title: "商家提款账户",
    width: "720",
}));
const __VLS_586 = __VLS_585({
    ...{ 'onClose': {} },
    modelValue: (__VLS_ctx.accountsVisible),
    title: "商家提款账户",
    width: "720",
}, ...__VLS_functionalComponentArgsRest(__VLS_585));
let __VLS_589;
const __VLS_590 = {
    ...{ close: {} },
    onClose: (...[$event]) => {
        __VLS_ctx.accountsVisible = false;
        // @ts-ignore
        [accountsVisible, accountsVisible,];
    },
};
const { default: __VLS_591 } = __VLS_587.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "account-toolbar" },
});
/** @type {__VLS_StyleScopedClasses['account-toolbar']} */ ;
let __VLS_592;
/** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
elButton;
// @ts-ignore
const __VLS_593 = __VLS_asFunctionalComponent1(__VLS_592, new __VLS_592({
    ...{ 'onClick': {} },
    type: "primary",
    size: "small",
}));
const __VLS_594 = __VLS_593({
    ...{ 'onClick': {} },
    type: "primary",
    size: "small",
}, ...__VLS_functionalComponentArgsRest(__VLS_593));
let __VLS_597;
const __VLS_598 = {
    ...{ click: {} },
    onClick: (__VLS_ctx.openAccountCreate),
};
const { default: __VLS_599 } = __VLS_595.slots;
// @ts-ignore
[openAccountCreate,];
var __VLS_595;
var __VLS_596;
let __VLS_600;
/** @ts-ignore @type { | typeof __VLS_components.elTable | typeof __VLS_components.ElTable | typeof __VLS_components['el-table'] | typeof __VLS_components.elTable | typeof __VLS_components.ElTable | typeof __VLS_components['el-table']} */
elTable;
// @ts-ignore
const __VLS_601 = __VLS_asFunctionalComponent1(__VLS_600, new __VLS_600({
    data: (__VLS_ctx.accounts),
    border: true,
    size: "small",
}));
const __VLS_602 = __VLS_601({
    data: (__VLS_ctx.accounts),
    border: true,
    size: "small",
}, ...__VLS_functionalComponentArgsRest(__VLS_601));
__VLS_asFunctionalDirective(__VLS_directives.vLoading, {})(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.accountsLoading) }, null, null);
const { default: __VLS_605 } = __VLS_603.slots;
let __VLS_606;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_607 = __VLS_asFunctionalComponent1(__VLS_606, new __VLS_606({
    prop: "type",
    label: "类型",
    width: "90",
}));
const __VLS_608 = __VLS_607({
    prop: "type",
    label: "类型",
    width: "90",
}, ...__VLS_functionalComponentArgsRest(__VLS_607));
const { default: __VLS_611 } = __VLS_609.slots;
{
    const { default: __VLS_612 } = __VLS_609.slots;
    const [{ row }] = __VLS_vSlot(__VLS_612);
    (row.type === 'CRYPTO' ? '加密货币' : '银行');
    // @ts-ignore
    [vLoading, accounts, accountsLoading,];
}
// @ts-ignore
[];
var __VLS_609;
let __VLS_613;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_614 = __VLS_asFunctionalComponent1(__VLS_613, new __VLS_613({
    label: "账户信息",
    minWidth: "280",
}));
const __VLS_615 = __VLS_614({
    label: "账户信息",
    minWidth: "280",
}, ...__VLS_functionalComponentArgsRest(__VLS_614));
const { default: __VLS_618 } = __VLS_616.slots;
{
    const { default: __VLS_619 } = __VLS_616.slots;
    const [{ row }] = __VLS_vSlot(__VLS_619);
    if (row.type === 'CRYPTO') {
        (row.chain);
        (row.address);
    }
    else {
        (row.bankName);
        (row.accountNo);
        (row.accountName);
    }
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_616;
let __VLS_620;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_621 = __VLS_asFunctionalComponent1(__VLS_620, new __VLS_620({
    label: "默认",
    width: "70",
}));
const __VLS_622 = __VLS_621({
    label: "默认",
    width: "70",
}, ...__VLS_functionalComponentArgsRest(__VLS_621));
const { default: __VLS_625 } = __VLS_623.slots;
{
    const { default: __VLS_626 } = __VLS_623.slots;
    const [{ row }] = __VLS_vSlot(__VLS_626);
    if (row.isDefault) {
        let __VLS_627;
        /** @ts-ignore @type { | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag'] | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag']} */
        elTag;
        // @ts-ignore
        const __VLS_628 = __VLS_asFunctionalComponent1(__VLS_627, new __VLS_627({
            type: "success",
            size: "small",
        }));
        const __VLS_629 = __VLS_628({
            type: "success",
            size: "small",
        }, ...__VLS_functionalComponentArgsRest(__VLS_628));
        const { default: __VLS_632 } = __VLS_630.slots;
        // @ts-ignore
        [];
        var __VLS_630;
    }
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_623;
let __VLS_633;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_634 = __VLS_asFunctionalComponent1(__VLS_633, new __VLS_633({
    prop: "remark",
    label: "备注",
    minWidth: "120",
}));
const __VLS_635 = __VLS_634({
    prop: "remark",
    label: "备注",
    minWidth: "120",
}, ...__VLS_functionalComponentArgsRest(__VLS_634));
let __VLS_638;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_639 = __VLS_asFunctionalComponent1(__VLS_638, new __VLS_638({
    label: "操作",
    width: "120",
    fixed: "right",
}));
const __VLS_640 = __VLS_639({
    label: "操作",
    width: "120",
    fixed: "right",
}, ...__VLS_functionalComponentArgsRest(__VLS_639));
const { default: __VLS_643 } = __VLS_641.slots;
{
    const { default: __VLS_644 } = __VLS_641.slots;
    const [{ row }] = __VLS_vSlot(__VLS_644);
    let __VLS_645;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_646 = __VLS_asFunctionalComponent1(__VLS_645, new __VLS_645({
        ...{ 'onClick': {} },
        link: true,
        type: "primary",
    }));
    const __VLS_647 = __VLS_646({
        ...{ 'onClick': {} },
        link: true,
        type: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_646));
    let __VLS_650;
    const __VLS_651 = {
        ...{ click: {} },
        onClick: (...[$event]) => {
            __VLS_ctx.openAccountEdit(row);
            // @ts-ignore
            [openAccountEdit,];
        },
    };
    const { default: __VLS_652 } = __VLS_648.slots;
    // @ts-ignore
    [];
    var __VLS_648;
    var __VLS_649;
    let __VLS_653;
    /** @ts-ignore @type { | typeof __VLS_components.elPopconfirm | typeof __VLS_components.ElPopconfirm | typeof __VLS_components['el-popconfirm'] | typeof __VLS_components.elPopconfirm | typeof __VLS_components.ElPopconfirm | typeof __VLS_components['el-popconfirm']} */
    elPopconfirm;
    // @ts-ignore
    const __VLS_654 = __VLS_asFunctionalComponent1(__VLS_653, new __VLS_653({
        ...{ 'onConfirm': {} },
        title: "确定禁用该提款账户吗？",
    }));
    const __VLS_655 = __VLS_654({
        ...{ 'onConfirm': {} },
        title: "确定禁用该提款账户吗？",
    }, ...__VLS_functionalComponentArgsRest(__VLS_654));
    let __VLS_658;
    const __VLS_659 = {
        ...{ confirm: {} },
        onConfirm: (...[$event]) => {
            __VLS_ctx.handleDeleteAccount(row);
            // @ts-ignore
            [handleDeleteAccount,];
        },
    };
    const { default: __VLS_660 } = __VLS_656.slots;
    {
        const { reference: __VLS_661 } = __VLS_656.slots;
        let __VLS_662;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_663 = __VLS_asFunctionalComponent1(__VLS_662, new __VLS_662({
            link: true,
            type: "danger",
        }));
        const __VLS_664 = __VLS_663({
            link: true,
            type: "danger",
        }, ...__VLS_functionalComponentArgsRest(__VLS_663));
        const { default: __VLS_667 } = __VLS_665.slots;
        // @ts-ignore
        [];
        var __VLS_665;
        // @ts-ignore
        [];
    }
    // @ts-ignore
    [];
    var __VLS_656;
    var __VLS_657;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_641;
// @ts-ignore
[];
var __VLS_603;
if (!__VLS_ctx.accountsLoading && __VLS_ctx.accounts.length === 0) {
    let __VLS_668;
    /** @ts-ignore @type { | typeof __VLS_components.elEmpty | typeof __VLS_components.ElEmpty | typeof __VLS_components['el-empty']} */
    elEmpty;
    // @ts-ignore
    const __VLS_669 = __VLS_asFunctionalComponent1(__VLS_668, new __VLS_668({
        description: "该商家暂未绑定提款账户",
    }));
    const __VLS_670 = __VLS_669({
        description: "该商家暂未绑定提款账户",
    }, ...__VLS_functionalComponentArgsRest(__VLS_669));
}
// @ts-ignore
[accounts, accountsLoading,];
var __VLS_587;
var __VLS_588;
let __VLS_673;
/** @ts-ignore @type { | typeof __VLS_components.BaseDialog | typeof __VLS_components.BaseDialog} */
BaseDialog;
// @ts-ignore
const __VLS_674 = __VLS_asFunctionalComponent1(__VLS_673, new __VLS_673({
    modelValue: (__VLS_ctx.accountFormVisible),
    title: (__VLS_ctx.accountForm.id ? '编辑提款账户' : '新增提款账户'),
    width: "560",
}));
const __VLS_675 = __VLS_674({
    modelValue: (__VLS_ctx.accountFormVisible),
    title: (__VLS_ctx.accountForm.id ? '编辑提款账户' : '新增提款账户'),
    width: "560",
}, ...__VLS_functionalComponentArgsRest(__VLS_674));
const { default: __VLS_678 } = __VLS_676.slots;
let __VLS_679;
/** @ts-ignore @type { | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form'] | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form']} */
elForm;
// @ts-ignore
const __VLS_680 = __VLS_asFunctionalComponent1(__VLS_679, new __VLS_679({
    model: (__VLS_ctx.accountForm),
    labelWidth: "110px",
}));
const __VLS_681 = __VLS_680({
    model: (__VLS_ctx.accountForm),
    labelWidth: "110px",
}, ...__VLS_functionalComponentArgsRest(__VLS_680));
const { default: __VLS_684 } = __VLS_682.slots;
let __VLS_685;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_686 = __VLS_asFunctionalComponent1(__VLS_685, new __VLS_685({
    label: "账户类型",
}));
const __VLS_687 = __VLS_686({
    label: "账户类型",
}, ...__VLS_functionalComponentArgsRest(__VLS_686));
const { default: __VLS_690 } = __VLS_688.slots;
let __VLS_691;
/** @ts-ignore @type { | typeof __VLS_components.elRadioGroup | typeof __VLS_components.ElRadioGroup | typeof __VLS_components['el-radio-group'] | typeof __VLS_components.elRadioGroup | typeof __VLS_components.ElRadioGroup | typeof __VLS_components['el-radio-group']} */
elRadioGroup;
// @ts-ignore
const __VLS_692 = __VLS_asFunctionalComponent1(__VLS_691, new __VLS_691({
    modelValue: (__VLS_ctx.accountForm.type),
}));
const __VLS_693 = __VLS_692({
    modelValue: (__VLS_ctx.accountForm.type),
}, ...__VLS_functionalComponentArgsRest(__VLS_692));
const { default: __VLS_696 } = __VLS_694.slots;
let __VLS_697;
/** @ts-ignore @type { | typeof __VLS_components.elRadio | typeof __VLS_components.ElRadio | typeof __VLS_components['el-radio'] | typeof __VLS_components.elRadio | typeof __VLS_components.ElRadio | typeof __VLS_components['el-radio']} */
elRadio;
// @ts-ignore
const __VLS_698 = __VLS_asFunctionalComponent1(__VLS_697, new __VLS_697({
    label: "CRYPTO",
}));
const __VLS_699 = __VLS_698({
    label: "CRYPTO",
}, ...__VLS_functionalComponentArgsRest(__VLS_698));
const { default: __VLS_702 } = __VLS_700.slots;
// @ts-ignore
[accountFormVisible, accountForm, accountForm, accountForm,];
var __VLS_700;
let __VLS_703;
/** @ts-ignore @type { | typeof __VLS_components.elRadio | typeof __VLS_components.ElRadio | typeof __VLS_components['el-radio'] | typeof __VLS_components.elRadio | typeof __VLS_components.ElRadio | typeof __VLS_components['el-radio']} */
elRadio;
// @ts-ignore
const __VLS_704 = __VLS_asFunctionalComponent1(__VLS_703, new __VLS_703({
    label: "BANK",
}));
const __VLS_705 = __VLS_704({
    label: "BANK",
}, ...__VLS_functionalComponentArgsRest(__VLS_704));
const { default: __VLS_708 } = __VLS_706.slots;
// @ts-ignore
[];
var __VLS_706;
// @ts-ignore
[];
var __VLS_694;
// @ts-ignore
[];
var __VLS_688;
if (__VLS_ctx.accountForm.type === 'CRYPTO') {
    let __VLS_709;
    /** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
    elFormItem;
    // @ts-ignore
    const __VLS_710 = __VLS_asFunctionalComponent1(__VLS_709, new __VLS_709({
        label: "链类型",
        required: true,
    }));
    const __VLS_711 = __VLS_710({
        label: "链类型",
        required: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_710));
    const { default: __VLS_714 } = __VLS_712.slots;
    let __VLS_715;
    /** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
    elInput;
    // @ts-ignore
    const __VLS_716 = __VLS_asFunctionalComponent1(__VLS_715, new __VLS_715({
        modelValue: (__VLS_ctx.accountForm.chain),
    }));
    const __VLS_717 = __VLS_716({
        modelValue: (__VLS_ctx.accountForm.chain),
    }, ...__VLS_functionalComponentArgsRest(__VLS_716));
    // @ts-ignore
    [accountForm, accountForm,];
    var __VLS_712;
    let __VLS_720;
    /** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
    elFormItem;
    // @ts-ignore
    const __VLS_721 = __VLS_asFunctionalComponent1(__VLS_720, new __VLS_720({
        label: "钱包地址",
        required: true,
    }));
    const __VLS_722 = __VLS_721({
        label: "钱包地址",
        required: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_721));
    const { default: __VLS_725 } = __VLS_723.slots;
    let __VLS_726;
    /** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
    elInput;
    // @ts-ignore
    const __VLS_727 = __VLS_asFunctionalComponent1(__VLS_726, new __VLS_726({
        modelValue: (__VLS_ctx.accountForm.address),
    }));
    const __VLS_728 = __VLS_727({
        modelValue: (__VLS_ctx.accountForm.address),
    }, ...__VLS_functionalComponentArgsRest(__VLS_727));
    // @ts-ignore
    [accountForm,];
    var __VLS_723;
}
else {
    let __VLS_731;
    /** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
    elFormItem;
    // @ts-ignore
    const __VLS_732 = __VLS_asFunctionalComponent1(__VLS_731, new __VLS_731({
        label: "银行名称",
        required: true,
    }));
    const __VLS_733 = __VLS_732({
        label: "银行名称",
        required: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_732));
    const { default: __VLS_736 } = __VLS_734.slots;
    let __VLS_737;
    /** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
    elInput;
    // @ts-ignore
    const __VLS_738 = __VLS_asFunctionalComponent1(__VLS_737, new __VLS_737({
        modelValue: (__VLS_ctx.accountForm.bankName),
    }));
    const __VLS_739 = __VLS_738({
        modelValue: (__VLS_ctx.accountForm.bankName),
    }, ...__VLS_functionalComponentArgsRest(__VLS_738));
    // @ts-ignore
    [accountForm,];
    var __VLS_734;
    let __VLS_742;
    /** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
    elFormItem;
    // @ts-ignore
    const __VLS_743 = __VLS_asFunctionalComponent1(__VLS_742, new __VLS_742({
        label: "银行卡号",
        required: true,
    }));
    const __VLS_744 = __VLS_743({
        label: "银行卡号",
        required: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_743));
    const { default: __VLS_747 } = __VLS_745.slots;
    let __VLS_748;
    /** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
    elInput;
    // @ts-ignore
    const __VLS_749 = __VLS_asFunctionalComponent1(__VLS_748, new __VLS_748({
        modelValue: (__VLS_ctx.accountForm.accountNo),
    }));
    const __VLS_750 = __VLS_749({
        modelValue: (__VLS_ctx.accountForm.accountNo),
    }, ...__VLS_functionalComponentArgsRest(__VLS_749));
    // @ts-ignore
    [accountForm,];
    var __VLS_745;
    let __VLS_753;
    /** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
    elFormItem;
    // @ts-ignore
    const __VLS_754 = __VLS_asFunctionalComponent1(__VLS_753, new __VLS_753({
        label: "开户名",
        required: true,
    }));
    const __VLS_755 = __VLS_754({
        label: "开户名",
        required: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_754));
    const { default: __VLS_758 } = __VLS_756.slots;
    let __VLS_759;
    /** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
    elInput;
    // @ts-ignore
    const __VLS_760 = __VLS_asFunctionalComponent1(__VLS_759, new __VLS_759({
        modelValue: (__VLS_ctx.accountForm.accountName),
    }));
    const __VLS_761 = __VLS_760({
        modelValue: (__VLS_ctx.accountForm.accountName),
    }, ...__VLS_functionalComponentArgsRest(__VLS_760));
    // @ts-ignore
    [accountForm,];
    var __VLS_756;
    let __VLS_764;
    /** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
    elFormItem;
    // @ts-ignore
    const __VLS_765 = __VLS_asFunctionalComponent1(__VLS_764, new __VLS_764({
        label: "国家/地区",
    }));
    const __VLS_766 = __VLS_765({
        label: "国家/地区",
    }, ...__VLS_functionalComponentArgsRest(__VLS_765));
    const { default: __VLS_769 } = __VLS_767.slots;
    let __VLS_770;
    /** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
    elInput;
    // @ts-ignore
    const __VLS_771 = __VLS_asFunctionalComponent1(__VLS_770, new __VLS_770({
        modelValue: (__VLS_ctx.accountForm.country),
    }));
    const __VLS_772 = __VLS_771({
        modelValue: (__VLS_ctx.accountForm.country),
    }, ...__VLS_functionalComponentArgsRest(__VLS_771));
    // @ts-ignore
    [accountForm,];
    var __VLS_767;
}
let __VLS_775;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_776 = __VLS_asFunctionalComponent1(__VLS_775, new __VLS_775({
    label: "状态",
}));
const __VLS_777 = __VLS_776({
    label: "状态",
}, ...__VLS_functionalComponentArgsRest(__VLS_776));
const { default: __VLS_780 } = __VLS_778.slots;
let __VLS_781;
/** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
elSelect;
// @ts-ignore
const __VLS_782 = __VLS_asFunctionalComponent1(__VLS_781, new __VLS_781({
    modelValue: (__VLS_ctx.accountForm.status),
    ...{ style: {} },
}));
const __VLS_783 = __VLS_782({
    modelValue: (__VLS_ctx.accountForm.status),
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_782));
const { default: __VLS_786 } = __VLS_784.slots;
let __VLS_787;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_788 = __VLS_asFunctionalComponent1(__VLS_787, new __VLS_787({
    label: "启用",
    value: "ENABLE",
}));
const __VLS_789 = __VLS_788({
    label: "启用",
    value: "ENABLE",
}, ...__VLS_functionalComponentArgsRest(__VLS_788));
let __VLS_792;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_793 = __VLS_asFunctionalComponent1(__VLS_792, new __VLS_792({
    label: "禁用",
    value: "DISABLE",
}));
const __VLS_794 = __VLS_793({
    label: "禁用",
    value: "DISABLE",
}, ...__VLS_functionalComponentArgsRest(__VLS_793));
// @ts-ignore
[accountForm,];
var __VLS_784;
// @ts-ignore
[];
var __VLS_778;
let __VLS_797;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_798 = __VLS_asFunctionalComponent1(__VLS_797, new __VLS_797({
    label: "设为默认",
}));
const __VLS_799 = __VLS_798({
    label: "设为默认",
}, ...__VLS_functionalComponentArgsRest(__VLS_798));
const { default: __VLS_802 } = __VLS_800.slots;
let __VLS_803;
/** @ts-ignore @type { | typeof __VLS_components.elSwitch | typeof __VLS_components.ElSwitch | typeof __VLS_components['el-switch']} */
elSwitch;
// @ts-ignore
const __VLS_804 = __VLS_asFunctionalComponent1(__VLS_803, new __VLS_803({
    modelValue: (__VLS_ctx.accountForm.isDefault),
}));
const __VLS_805 = __VLS_804({
    modelValue: (__VLS_ctx.accountForm.isDefault),
}, ...__VLS_functionalComponentArgsRest(__VLS_804));
// @ts-ignore
[accountForm,];
var __VLS_800;
let __VLS_808;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_809 = __VLS_asFunctionalComponent1(__VLS_808, new __VLS_808({
    label: "备注",
}));
const __VLS_810 = __VLS_809({
    label: "备注",
}, ...__VLS_functionalComponentArgsRest(__VLS_809));
const { default: __VLS_813 } = __VLS_811.slots;
let __VLS_814;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_815 = __VLS_asFunctionalComponent1(__VLS_814, new __VLS_814({
    modelValue: (__VLS_ctx.accountForm.remark),
}));
const __VLS_816 = __VLS_815({
    modelValue: (__VLS_ctx.accountForm.remark),
}, ...__VLS_functionalComponentArgsRest(__VLS_815));
// @ts-ignore
[accountForm,];
var __VLS_811;
// @ts-ignore
[];
var __VLS_682;
{
    const { footer: __VLS_819 } = __VLS_676.slots;
    let __VLS_820;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_821 = __VLS_asFunctionalComponent1(__VLS_820, new __VLS_820({
        ...{ 'onClick': {} },
    }));
    const __VLS_822 = __VLS_821({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_821));
    let __VLS_825;
    const __VLS_826 = {
        ...{ click: {} },
        onClick: (...[$event]) => {
            __VLS_ctx.accountFormVisible = false;
            // @ts-ignore
            [accountFormVisible,];
        },
    };
    const { default: __VLS_827 } = __VLS_823.slots;
    // @ts-ignore
    [];
    var __VLS_823;
    var __VLS_824;
    let __VLS_828;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_829 = __VLS_asFunctionalComponent1(__VLS_828, new __VLS_828({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.accountSubmitting),
    }));
    const __VLS_830 = __VLS_829({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.accountSubmitting),
    }, ...__VLS_functionalComponentArgsRest(__VLS_829));
    let __VLS_833;
    const __VLS_834 = {
        ...{ click: {} },
        onClick: (__VLS_ctx.handleSaveAccount),
    };
    const { default: __VLS_835 } = __VLS_831.slots;
    // @ts-ignore
    [accountSubmitting, handleSaveAccount,];
    var __VLS_831;
    var __VLS_832;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_676;
// @ts-ignore
var __VLS_8 = __VLS_7, __VLS_107 = __VLS_106, __VLS_530 = __VLS_529;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
