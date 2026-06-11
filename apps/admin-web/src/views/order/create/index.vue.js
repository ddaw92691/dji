/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ref, reactive } from 'vue';
import { ElMessage } from 'element-plus';
import { customerApi } from '@/api/customer';
import { merchantApi } from '@/api/merchant';
defineOptions({ name: 'OrderCreateView' });
const orderFormRef = ref();
const submitLoading = ref(false);
const customerLoading = ref(false);
const merchantLoading = ref(false);
const customerOptions = ref([]);
const merchantOptions = ref([]);
const listingOptions = ref([]);
const merchantDialogVisible = ref(false);
const merchantDialogLoading = ref(false);
const merchantSearchKeyword = ref('');
const merchantDialogRows = ref([]);
const orderForm = reactive({
    customerId: null,
    merchantId: null,
    items: [],
    addressSnapshot: '',
    remark: '',
    markAsPaid: false,
});
const virtualDialogVisible = ref(false);
const virtualLoading = ref(false);
const virtualFormRef = ref();
const virtualForm = reactive({
    nickname: '',
    email: '',
    remark: '',
});
const resultVisible = ref(false);
const orderResult = ref(null);
async function searchClients(query) {
    if (!query)
        return;
    customerLoading.value = true;
    try {
        const { data: res } = await customerApi.getCustomers({ keyword: query, pageSize: 20 });
        if (res.code === 200) {
            customerOptions.value = res.data?.list || [];
        }
    }
    catch {
        /* ignore */
    }
    finally {
        customerLoading.value = false;
    }
}
async function searchMerchants(query) {
    merchantLoading.value = true;
    try {
        const { data: res } = await merchantApi.getMerchants({ keyword: query || undefined, pageSize: 20 });
        if (res.code === 200) {
            merchantOptions.value = (res.data?.list || []).map((m) => ({
                ...m,
                name: m.shopName || m.name || m.email || `ID:${m.id}`,
            }));
        }
    }
    catch {
        /* ignore */
    }
    finally {
        merchantLoading.value = false;
    }
}
function openMerchantDialog() {
    merchantDialogVisible.value = true;
}
async function loadMerchantDialog() {
    merchantDialogLoading.value = true;
    try {
        const { data: res } = await merchantApi.getMerchants({
            keyword: merchantSearchKeyword.value || undefined,
            pageSize: 50,
        });
        if (res.code === 200) {
            merchantDialogRows.value = (res.data?.list || []).map((m) => ({
                ...m,
                name: m.shopName || m.nickname || m.email || `ID:${m.id}`,
            }));
        }
        else {
            ElMessage.error(res.message || '获取商家失败');
        }
    }
    catch {
        ElMessage.error('获取商家失败');
    }
    finally {
        merchantDialogLoading.value = false;
    }
}
function chooseMerchant(row) {
    const merchant = {
        ...row,
        name: row.shopName || row.nickname || row.email || `ID:${row.id}`,
    };
    const exists = merchantOptions.value.some((item) => item.id === merchant.id);
    if (!exists)
        merchantOptions.value.unshift(merchant);
    orderForm.merchantId = merchant.id;
    merchantDialogVisible.value = false;
    onMerchantChange(merchant.id);
}
async function onMerchantChange(merchantId) {
    orderForm.items = [];
    if (!merchantId) {
        listingOptions.value = [];
        return;
    }
    try {
        const { default: request } = await import('@/utils/request');
        const { data: res } = await request.get('/admin/catalog/listings', {
            params: { merchantId, status: 'ON_SALE', pageSize: 999 },
        });
        if (res.code === 200) {
            listingOptions.value = res.data?.list || [];
        }
    }
    catch {
        listingOptions.value = [];
    }
}
function addItem() {
    orderForm.items.push({ platformProductId: null, price: 0, quantity: 1 });
}
function removeItem(idx) {
    orderForm.items.splice(idx, 1);
}
function onProductChange(idx) {
    const item = orderForm.items[idx];
    if (!item)
        return;
    const listing = listingOptions.value.find((l) => l.id === item.platformProductId);
    if (listing) {
        item.price = listing.salePrice;
        calcTotal();
    }
}
function calcTotal() {
    // reactive auto-updates
}
async function handleSubmit() {
    if (!orderForm.merchantId) {
        ElMessage.warning('请选择商户');
        return;
    }
    if (!orderForm.customerId) {
        ElMessage.warning('请选择客户');
        return;
    }
    if (!orderForm.items.length) {
        ElMessage.warning('请至少添加一个商品');
        return;
    }
    submitLoading.value = true;
    try {
        const payload = {
            customerId: orderForm.customerId,
            merchantId: orderForm.merchantId,
            items: orderForm.items.map((it) => ({
                productId: it.platformProductId,
                quantity: it.quantity,
            })),
            addressSnapshot: orderForm.addressSnapshot,
            remark: orderForm.remark,
            markAsPaid: orderForm.markAsPaid,
        };
        const { default: request } = await import('@/utils/request');
        const { data: res } = await request.post('/admin/orders/create-for-merchant', payload);
        if (res.code === 200) {
            orderResult.value = res.data;
            resultVisible.value = true;
            ElMessage.success('订单已创建，已通过 WebSocket 通知商户');
        }
        else {
            ElMessage.error(res.message || '创建订单失败');
        }
    }
    catch {
        ElMessage.error('创建订单失败');
    }
    finally {
        submitLoading.value = false;
    }
}
async function createVirtualCustomer() {
    if (!virtualForm.nickname) {
        ElMessage.warning('昵称为必填项');
        return;
    }
    virtualLoading.value = true;
    try {
        const { default: request } = await import('@/utils/request');
        const { data: res } = await request.post('/admin/customers/virtual', {
            nickname: virtualForm.nickname,
            email: virtualForm.email || undefined,
            virtualRemark: virtualForm.remark || undefined,
        });
        if (res.code === 200) {
            ElMessage.success('虚拟客户已创建');
            virtualDialogVisible.value = false;
            customerOptions.value.unshift(res.data);
            orderForm.customerId = res.data.id;
        }
        else {
            ElMessage.error(res.message || '创建失败');
        }
    }
    catch {
        ElMessage.error('创建虚拟客户失败');
    }
    finally {
        virtualLoading.value = false;
    }
}
function resetVirtualForm() {
    virtualForm.nickname = '';
    virtualForm.email = '';
    virtualForm.remark = '';
}
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "order-create-page" },
});
/** @type {__VLS_StyleScopedClasses['order-create-page']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.h2, __VLS_intrinsics.h2)({
    ...{ style: {} },
});
let __VLS_0;
/** @ts-ignore @type { | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form'] | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form']} */
elForm;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    ref: "orderFormRef",
    model: (__VLS_ctx.orderForm),
    labelWidth: "130px",
    ...{ style: {} },
}));
const __VLS_2 = __VLS_1({
    ref: "orderFormRef",
    model: (__VLS_ctx.orderForm),
    labelWidth: "130px",
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_5;
const { default: __VLS_7 } = __VLS_3.slots;
let __VLS_8;
/** @ts-ignore @type { | typeof __VLS_components.elDivider | typeof __VLS_components.ElDivider | typeof __VLS_components['el-divider'] | typeof __VLS_components.elDivider | typeof __VLS_components.ElDivider | typeof __VLS_components['el-divider']} */
elDivider;
// @ts-ignore
const __VLS_9 = __VLS_asFunctionalComponent1(__VLS_8, new __VLS_8({
    contentPosition: "left",
}));
const __VLS_10 = __VLS_9({
    contentPosition: "left",
}, ...__VLS_functionalComponentArgsRest(__VLS_9));
const { default: __VLS_13 } = __VLS_11.slots;
// @ts-ignore
[orderForm,];
var __VLS_11;
let __VLS_14;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_15 = __VLS_asFunctionalComponent1(__VLS_14, new __VLS_14({
    label: "客户",
}));
const __VLS_16 = __VLS_15({
    label: "客户",
}, ...__VLS_functionalComponentArgsRest(__VLS_15));
const { default: __VLS_19 } = __VLS_17.slots;
let __VLS_20;
/** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
elSelect;
// @ts-ignore
const __VLS_21 = __VLS_asFunctionalComponent1(__VLS_20, new __VLS_20({
    modelValue: (__VLS_ctx.orderForm.customerId),
    filterable: true,
    remote: true,
    remoteMethod: (__VLS_ctx.searchClients),
    loading: (__VLS_ctx.customerLoading),
    placeholder: "按昵称/邮箱搜索客户",
    ...{ style: {} },
}));
const __VLS_22 = __VLS_21({
    modelValue: (__VLS_ctx.orderForm.customerId),
    filterable: true,
    remote: true,
    remoteMethod: (__VLS_ctx.searchClients),
    loading: (__VLS_ctx.customerLoading),
    placeholder: "按昵称/邮箱搜索客户",
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_21));
const { default: __VLS_25 } = __VLS_23.slots;
for (const [c] of __VLS_vFor((__VLS_ctx.customerOptions))) {
    let __VLS_26;
    /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
    elOption;
    // @ts-ignore
    const __VLS_27 = __VLS_asFunctionalComponent1(__VLS_26, new __VLS_26({
        key: (c.id),
        label: (`${c.nickname || c.email || '#' + c.id}${c.isVirtual ? '（虚拟客户）' : ''}`),
        value: (c.id),
    }));
    const __VLS_28 = __VLS_27({
        key: (c.id),
        label: (`${c.nickname || c.email || '#' + c.id}${c.isVirtual ? '（虚拟客户）' : ''}`),
        value: (c.id),
    }, ...__VLS_functionalComponentArgsRest(__VLS_27));
    // @ts-ignore
    [orderForm, searchClients, customerLoading, customerOptions,];
}
// @ts-ignore
[];
var __VLS_23;
// @ts-ignore
[];
var __VLS_17;
let __VLS_31;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_32 = __VLS_asFunctionalComponent1(__VLS_31, new __VLS_31({}));
const __VLS_33 = __VLS_32({}, ...__VLS_functionalComponentArgsRest(__VLS_32));
const { default: __VLS_36 } = __VLS_34.slots;
let __VLS_37;
/** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
elButton;
// @ts-ignore
const __VLS_38 = __VLS_asFunctionalComponent1(__VLS_37, new __VLS_37({
    ...{ 'onClick': {} },
    type: "primary",
    plain: true,
}));
const __VLS_39 = __VLS_38({
    ...{ 'onClick': {} },
    type: "primary",
    plain: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_38));
let __VLS_42;
const __VLS_43 = {
    ...{ click: {} },
    onClick: (...[$event]) => {
        __VLS_ctx.virtualDialogVisible = true;
        // @ts-ignore
        [virtualDialogVisible,];
    },
};
const { default: __VLS_44 } = __VLS_40.slots;
// @ts-ignore
[];
var __VLS_40;
var __VLS_41;
// @ts-ignore
[];
var __VLS_34;
let __VLS_45;
/** @ts-ignore @type { | typeof __VLS_components.elDivider | typeof __VLS_components.ElDivider | typeof __VLS_components['el-divider'] | typeof __VLS_components.elDivider | typeof __VLS_components.ElDivider | typeof __VLS_components['el-divider']} */
elDivider;
// @ts-ignore
const __VLS_46 = __VLS_asFunctionalComponent1(__VLS_45, new __VLS_45({
    contentPosition: "left",
}));
const __VLS_47 = __VLS_46({
    contentPosition: "left",
}, ...__VLS_functionalComponentArgsRest(__VLS_46));
const { default: __VLS_50 } = __VLS_48.slots;
// @ts-ignore
[];
var __VLS_48;
let __VLS_51;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_52 = __VLS_asFunctionalComponent1(__VLS_51, new __VLS_51({
    label: "商户",
    required: true,
}));
const __VLS_53 = __VLS_52({
    label: "商户",
    required: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_52));
const { default: __VLS_56 } = __VLS_54.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "merchant-picker" },
});
/** @type {__VLS_StyleScopedClasses['merchant-picker']} */ ;
let __VLS_57;
/** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
elSelect;
// @ts-ignore
const __VLS_58 = __VLS_asFunctionalComponent1(__VLS_57, new __VLS_57({
    ...{ 'onFocus': {} },
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.orderForm.merchantId),
    filterable: true,
    remote: true,
    remoteMethod: (__VLS_ctx.searchMerchants),
    loading: (__VLS_ctx.merchantLoading),
    placeholder: "请选择商户",
    ...{ style: {} },
}));
const __VLS_59 = __VLS_58({
    ...{ 'onFocus': {} },
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.orderForm.merchantId),
    filterable: true,
    remote: true,
    remoteMethod: (__VLS_ctx.searchMerchants),
    loading: (__VLS_ctx.merchantLoading),
    placeholder: "请选择商户",
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_58));
let __VLS_62;
const __VLS_63 = {
    ...{ focus: {} },
    onFocus: (...[$event]) => {
        __VLS_ctx.searchMerchants('');
        // @ts-ignore
        [orderForm, searchMerchants, searchMerchants, merchantLoading,];
    },
    ...{ change: {} },
    onChange: (__VLS_ctx.onMerchantChange),
};
const { default: __VLS_64 } = __VLS_60.slots;
for (const [m] of __VLS_vFor((__VLS_ctx.merchantOptions))) {
    let __VLS_65;
    /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
    elOption;
    // @ts-ignore
    const __VLS_66 = __VLS_asFunctionalComponent1(__VLS_65, new __VLS_65({
        key: (m.id),
        label: (m.name),
        value: (m.id),
    }));
    const __VLS_67 = __VLS_66({
        key: (m.id),
        label: (m.name),
        value: (m.id),
    }, ...__VLS_functionalComponentArgsRest(__VLS_66));
    // @ts-ignore
    [onMerchantChange, merchantOptions,];
}
// @ts-ignore
[];
var __VLS_60;
var __VLS_61;
let __VLS_70;
/** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
elButton;
// @ts-ignore
const __VLS_71 = __VLS_asFunctionalComponent1(__VLS_70, new __VLS_70({
    ...{ 'onClick': {} },
}));
const __VLS_72 = __VLS_71({
    ...{ 'onClick': {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_71));
let __VLS_75;
const __VLS_76 = {
    ...{ click: {} },
    onClick: (__VLS_ctx.openMerchantDialog),
};
const { default: __VLS_77 } = __VLS_73.slots;
// @ts-ignore
[openMerchantDialog,];
var __VLS_73;
var __VLS_74;
// @ts-ignore
[];
var __VLS_54;
let __VLS_78;
/** @ts-ignore @type { | typeof __VLS_components.elDivider | typeof __VLS_components.ElDivider | typeof __VLS_components['el-divider'] | typeof __VLS_components.elDivider | typeof __VLS_components.ElDivider | typeof __VLS_components['el-divider']} */
elDivider;
// @ts-ignore
const __VLS_79 = __VLS_asFunctionalComponent1(__VLS_78, new __VLS_78({
    contentPosition: "left",
}));
const __VLS_80 = __VLS_79({
    contentPosition: "left",
}, ...__VLS_functionalComponentArgsRest(__VLS_79));
const { default: __VLS_83 } = __VLS_81.slots;
// @ts-ignore
[];
var __VLS_81;
if (__VLS_ctx.orderForm.merchantId && __VLS_ctx.listingOptions.length > 0) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
    for (const [item, idx] of __VLS_vFor((__VLS_ctx.orderForm.items))) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            key: (idx),
            ...{ class: "order-item-row" },
        });
        /** @type {__VLS_StyleScopedClasses['order-item-row']} */ ;
        let __VLS_84;
        /** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
        elSelect;
        // @ts-ignore
        const __VLS_85 = __VLS_asFunctionalComponent1(__VLS_84, new __VLS_84({
            ...{ 'onChange': {} },
            modelValue: (item.platformProductId),
            placeholder: "商品",
            filterable: true,
            ...{ style: {} },
        }));
        const __VLS_86 = __VLS_85({
            ...{ 'onChange': {} },
            modelValue: (item.platformProductId),
            placeholder: "商品",
            filterable: true,
            ...{ style: {} },
        }, ...__VLS_functionalComponentArgsRest(__VLS_85));
        let __VLS_89;
        const __VLS_90 = {
            ...{ change: {} },
            onChange: (...[$event]) => {
                if (!(__VLS_ctx.orderForm.merchantId && __VLS_ctx.listingOptions.length > 0))
                    return;
                __VLS_ctx.onProductChange(idx);
                // @ts-ignore
                [orderForm, orderForm, listingOptions, onProductChange,];
            },
        };
        const { default: __VLS_91 } = __VLS_87.slots;
        for (const [l] of __VLS_vFor((__VLS_ctx.listingOptions))) {
            let __VLS_92;
            /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
            elOption;
            // @ts-ignore
            const __VLS_93 = __VLS_asFunctionalComponent1(__VLS_92, new __VLS_92({
                key: (l.id),
                label: (l.platformProductName),
                value: (l.id),
            }));
            const __VLS_94 = __VLS_93({
                key: (l.id),
                label: (l.platformProductName),
                value: (l.id),
            }, ...__VLS_functionalComponentArgsRest(__VLS_93));
            // @ts-ignore
            [listingOptions,];
        }
        // @ts-ignore
        [];
        var __VLS_87;
        var __VLS_88;
        let __VLS_97;
        /** @ts-ignore @type { | typeof __VLS_components.elInputNumber | typeof __VLS_components.ElInputNumber | typeof __VLS_components['el-input-number']} */
        elInputNumber;
        // @ts-ignore
        const __VLS_98 = __VLS_asFunctionalComponent1(__VLS_97, new __VLS_97({
            ...{ 'onChange': {} },
            modelValue: (item.quantity),
            min: (1),
            placeholder: "数量",
            ...{ style: {} },
        }));
        const __VLS_99 = __VLS_98({
            ...{ 'onChange': {} },
            modelValue: (item.quantity),
            min: (1),
            placeholder: "数量",
            ...{ style: {} },
        }, ...__VLS_functionalComponentArgsRest(__VLS_98));
        let __VLS_102;
        const __VLS_103 = {
            ...{ change: {} },
            onChange: (__VLS_ctx.calcTotal),
        };
        var __VLS_100;
        var __VLS_101;
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ style: {} },
        });
        (item.price * item.quantity);
        let __VLS_104;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_105 = __VLS_asFunctionalComponent1(__VLS_104, new __VLS_104({
            ...{ 'onClick': {} },
            type: "danger",
            circle: true,
            size: "small",
        }));
        const __VLS_106 = __VLS_105({
            ...{ 'onClick': {} },
            type: "danger",
            circle: true,
            size: "small",
        }, ...__VLS_functionalComponentArgsRest(__VLS_105));
        let __VLS_109;
        const __VLS_110 = {
            ...{ click: {} },
            onClick: (...[$event]) => {
                if (!(__VLS_ctx.orderForm.merchantId && __VLS_ctx.listingOptions.length > 0))
                    return;
                __VLS_ctx.removeItem(idx);
                // @ts-ignore
                [calcTotal, removeItem,];
            },
        };
        const { default: __VLS_111 } = __VLS_107.slots;
        // @ts-ignore
        [];
        var __VLS_107;
        var __VLS_108;
        // @ts-ignore
        [];
    }
    let __VLS_112;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_113 = __VLS_asFunctionalComponent1(__VLS_112, new __VLS_112({
        ...{ 'onClick': {} },
        type: "primary",
        plain: true,
        ...{ style: {} },
    }));
    const __VLS_114 = __VLS_113({
        ...{ 'onClick': {} },
        type: "primary",
        plain: true,
        ...{ style: {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_113));
    let __VLS_117;
    const __VLS_118 = {
        ...{ click: {} },
        onClick: (__VLS_ctx.addItem),
    };
    const { default: __VLS_119 } = __VLS_115.slots;
    // @ts-ignore
    [addItem,];
    var __VLS_115;
    var __VLS_116;
}
else if (__VLS_ctx.orderForm.merchantId) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        ...{ style: {} },
    });
}
else {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        ...{ style: {} },
    });
}
let __VLS_120;
/** @ts-ignore @type { | typeof __VLS_components.elDivider | typeof __VLS_components.ElDivider | typeof __VLS_components['el-divider'] | typeof __VLS_components.elDivider | typeof __VLS_components.ElDivider | typeof __VLS_components['el-divider']} */
elDivider;
// @ts-ignore
const __VLS_121 = __VLS_asFunctionalComponent1(__VLS_120, new __VLS_120({
    contentPosition: "left",
}));
const __VLS_122 = __VLS_121({
    contentPosition: "left",
}, ...__VLS_functionalComponentArgsRest(__VLS_121));
const { default: __VLS_125 } = __VLS_123.slots;
// @ts-ignore
[orderForm,];
var __VLS_123;
let __VLS_126;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_127 = __VLS_asFunctionalComponent1(__VLS_126, new __VLS_126({
    label: "地址",
}));
const __VLS_128 = __VLS_127({
    label: "地址",
}, ...__VLS_functionalComponentArgsRest(__VLS_127));
const { default: __VLS_131 } = __VLS_129.slots;
let __VLS_132;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_133 = __VLS_asFunctionalComponent1(__VLS_132, new __VLS_132({
    modelValue: (__VLS_ctx.orderForm.addressSnapshot),
    type: "textarea",
    rows: (3),
    placeholder: "客户地址快照",
}));
const __VLS_134 = __VLS_133({
    modelValue: (__VLS_ctx.orderForm.addressSnapshot),
    type: "textarea",
    rows: (3),
    placeholder: "客户地址快照",
}, ...__VLS_functionalComponentArgsRest(__VLS_133));
// @ts-ignore
[orderForm,];
var __VLS_129;
let __VLS_137;
/** @ts-ignore @type { | typeof __VLS_components.elDivider | typeof __VLS_components.ElDivider | typeof __VLS_components['el-divider'] | typeof __VLS_components.elDivider | typeof __VLS_components.ElDivider | typeof __VLS_components['el-divider']} */
elDivider;
// @ts-ignore
const __VLS_138 = __VLS_asFunctionalComponent1(__VLS_137, new __VLS_137({
    contentPosition: "left",
}));
const __VLS_139 = __VLS_138({
    contentPosition: "left",
}, ...__VLS_functionalComponentArgsRest(__VLS_138));
const { default: __VLS_142 } = __VLS_140.slots;
// @ts-ignore
[];
var __VLS_140;
let __VLS_143;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_144 = __VLS_asFunctionalComponent1(__VLS_143, new __VLS_143({
    label: "备注",
}));
const __VLS_145 = __VLS_144({
    label: "备注",
}, ...__VLS_functionalComponentArgsRest(__VLS_144));
const { default: __VLS_148 } = __VLS_146.slots;
let __VLS_149;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_150 = __VLS_asFunctionalComponent1(__VLS_149, new __VLS_149({
    modelValue: (__VLS_ctx.orderForm.remark),
    type: "textarea",
    rows: (2),
    placeholder: "订单备注",
}));
const __VLS_151 = __VLS_150({
    modelValue: (__VLS_ctx.orderForm.remark),
    type: "textarea",
    rows: (2),
    placeholder: "订单备注",
}, ...__VLS_functionalComponentArgsRest(__VLS_150));
// @ts-ignore
[orderForm,];
var __VLS_146;
let __VLS_154;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_155 = __VLS_asFunctionalComponent1(__VLS_154, new __VLS_154({
    label: "标记为已支付",
}));
const __VLS_156 = __VLS_155({
    label: "标记为已支付",
}, ...__VLS_functionalComponentArgsRest(__VLS_155));
const { default: __VLS_159 } = __VLS_157.slots;
let __VLS_160;
/** @ts-ignore @type { | typeof __VLS_components.elCheckbox | typeof __VLS_components.ElCheckbox | typeof __VLS_components['el-checkbox']} */
elCheckbox;
// @ts-ignore
const __VLS_161 = __VLS_asFunctionalComponent1(__VLS_160, new __VLS_160({
    modelValue: (__VLS_ctx.orderForm.markAsPaid),
}));
const __VLS_162 = __VLS_161({
    modelValue: (__VLS_ctx.orderForm.markAsPaid),
}, ...__VLS_functionalComponentArgsRest(__VLS_161));
// @ts-ignore
[orderForm,];
var __VLS_157;
let __VLS_165;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_166 = __VLS_asFunctionalComponent1(__VLS_165, new __VLS_165({}));
const __VLS_167 = __VLS_166({}, ...__VLS_functionalComponentArgsRest(__VLS_166));
const { default: __VLS_170 } = __VLS_168.slots;
let __VLS_171;
/** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
elButton;
// @ts-ignore
const __VLS_172 = __VLS_asFunctionalComponent1(__VLS_171, new __VLS_171({
    ...{ 'onClick': {} },
    type: "primary",
    loading: (__VLS_ctx.submitLoading),
}));
const __VLS_173 = __VLS_172({
    ...{ 'onClick': {} },
    type: "primary",
    loading: (__VLS_ctx.submitLoading),
}, ...__VLS_functionalComponentArgsRest(__VLS_172));
let __VLS_176;
const __VLS_177 = {
    ...{ click: {} },
    onClick: (__VLS_ctx.handleSubmit),
};
const { default: __VLS_178 } = __VLS_174.slots;
// @ts-ignore
[submitLoading, handleSubmit,];
var __VLS_174;
var __VLS_175;
// @ts-ignore
[];
var __VLS_168;
// @ts-ignore
[];
var __VLS_3;
let __VLS_179;
/** @ts-ignore @type { | typeof __VLS_components.elDialog | typeof __VLS_components.ElDialog | typeof __VLS_components['el-dialog'] | typeof __VLS_components.elDialog | typeof __VLS_components.ElDialog | typeof __VLS_components['el-dialog']} */
elDialog;
// @ts-ignore
const __VLS_180 = __VLS_asFunctionalComponent1(__VLS_179, new __VLS_179({
    ...{ 'onClose': {} },
    modelValue: (__VLS_ctx.virtualDialogVisible),
    title: "新建虚拟客户",
    width: "500px",
}));
const __VLS_181 = __VLS_180({
    ...{ 'onClose': {} },
    modelValue: (__VLS_ctx.virtualDialogVisible),
    title: "新建虚拟客户",
    width: "500px",
}, ...__VLS_functionalComponentArgsRest(__VLS_180));
let __VLS_184;
const __VLS_185 = {
    ...{ close: {} },
    onClose: (__VLS_ctx.resetVirtualForm),
};
const { default: __VLS_186 } = __VLS_182.slots;
let __VLS_187;
/** @ts-ignore @type { | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form'] | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form']} */
elForm;
// @ts-ignore
const __VLS_188 = __VLS_asFunctionalComponent1(__VLS_187, new __VLS_187({
    ref: "virtualFormRef",
    model: (__VLS_ctx.virtualForm),
    labelWidth: "100px",
}));
const __VLS_189 = __VLS_188({
    ref: "virtualFormRef",
    model: (__VLS_ctx.virtualForm),
    labelWidth: "100px",
}, ...__VLS_functionalComponentArgsRest(__VLS_188));
var __VLS_192;
const { default: __VLS_194 } = __VLS_190.slots;
let __VLS_195;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_196 = __VLS_asFunctionalComponent1(__VLS_195, new __VLS_195({
    label: "昵称",
    required: true,
}));
const __VLS_197 = __VLS_196({
    label: "昵称",
    required: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_196));
const { default: __VLS_200 } = __VLS_198.slots;
let __VLS_201;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_202 = __VLS_asFunctionalComponent1(__VLS_201, new __VLS_201({
    modelValue: (__VLS_ctx.virtualForm.nickname),
    placeholder: "虚拟客户名称",
}));
const __VLS_203 = __VLS_202({
    modelValue: (__VLS_ctx.virtualForm.nickname),
    placeholder: "虚拟客户名称",
}, ...__VLS_functionalComponentArgsRest(__VLS_202));
// @ts-ignore
[virtualDialogVisible, resetVirtualForm, virtualForm, virtualForm,];
var __VLS_198;
let __VLS_206;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_207 = __VLS_asFunctionalComponent1(__VLS_206, new __VLS_206({
    label: "邮箱",
}));
const __VLS_208 = __VLS_207({
    label: "邮箱",
}, ...__VLS_functionalComponentArgsRest(__VLS_207));
const { default: __VLS_211 } = __VLS_209.slots;
let __VLS_212;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_213 = __VLS_asFunctionalComponent1(__VLS_212, new __VLS_212({
    modelValue: (__VLS_ctx.virtualForm.email),
    placeholder: "选填",
}));
const __VLS_214 = __VLS_213({
    modelValue: (__VLS_ctx.virtualForm.email),
    placeholder: "选填",
}, ...__VLS_functionalComponentArgsRest(__VLS_213));
// @ts-ignore
[virtualForm,];
var __VLS_209;
let __VLS_217;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_218 = __VLS_asFunctionalComponent1(__VLS_217, new __VLS_217({
    label: "备注",
}));
const __VLS_219 = __VLS_218({
    label: "备注",
}, ...__VLS_functionalComponentArgsRest(__VLS_218));
const { default: __VLS_222 } = __VLS_220.slots;
let __VLS_223;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_224 = __VLS_asFunctionalComponent1(__VLS_223, new __VLS_223({
    modelValue: (__VLS_ctx.virtualForm.remark),
    type: "textarea",
    rows: (2),
    placeholder: "虚拟客户备注",
}));
const __VLS_225 = __VLS_224({
    modelValue: (__VLS_ctx.virtualForm.remark),
    type: "textarea",
    rows: (2),
    placeholder: "虚拟客户备注",
}, ...__VLS_functionalComponentArgsRest(__VLS_224));
// @ts-ignore
[virtualForm,];
var __VLS_220;
// @ts-ignore
[];
var __VLS_190;
{
    const { footer: __VLS_228 } = __VLS_182.slots;
    let __VLS_229;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_230 = __VLS_asFunctionalComponent1(__VLS_229, new __VLS_229({
        ...{ 'onClick': {} },
    }));
    const __VLS_231 = __VLS_230({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_230));
    let __VLS_234;
    const __VLS_235 = {
        ...{ click: {} },
        onClick: (...[$event]) => {
            __VLS_ctx.virtualDialogVisible = false;
            // @ts-ignore
            [virtualDialogVisible,];
        },
    };
    const { default: __VLS_236 } = __VLS_232.slots;
    // @ts-ignore
    [];
    var __VLS_232;
    var __VLS_233;
    let __VLS_237;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_238 = __VLS_asFunctionalComponent1(__VLS_237, new __VLS_237({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.virtualLoading),
    }));
    const __VLS_239 = __VLS_238({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.virtualLoading),
    }, ...__VLS_functionalComponentArgsRest(__VLS_238));
    let __VLS_242;
    const __VLS_243 = {
        ...{ click: {} },
        onClick: (__VLS_ctx.createVirtualCustomer),
    };
    const { default: __VLS_244 } = __VLS_240.slots;
    // @ts-ignore
    [virtualLoading, createVirtualCustomer,];
    var __VLS_240;
    var __VLS_241;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_182;
var __VLS_183;
let __VLS_245;
/** @ts-ignore @type { | typeof __VLS_components.elDialog | typeof __VLS_components.ElDialog | typeof __VLS_components['el-dialog'] | typeof __VLS_components.elDialog | typeof __VLS_components.ElDialog | typeof __VLS_components['el-dialog']} */
elDialog;
// @ts-ignore
const __VLS_246 = __VLS_asFunctionalComponent1(__VLS_245, new __VLS_245({
    ...{ 'onOpen': {} },
    modelValue: (__VLS_ctx.merchantDialogVisible),
    title: "选择商家",
    width: "760px",
}));
const __VLS_247 = __VLS_246({
    ...{ 'onOpen': {} },
    modelValue: (__VLS_ctx.merchantDialogVisible),
    title: "选择商家",
    width: "760px",
}, ...__VLS_functionalComponentArgsRest(__VLS_246));
let __VLS_250;
const __VLS_251 = {
    ...{ open: {} },
    onOpen: (__VLS_ctx.loadMerchantDialog),
};
const { default: __VLS_252 } = __VLS_248.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "dialog-search" },
});
/** @type {__VLS_StyleScopedClasses['dialog-search']} */ ;
let __VLS_253;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_254 = __VLS_asFunctionalComponent1(__VLS_253, new __VLS_253({
    ...{ 'onKeyup': {} },
    ...{ 'onClear': {} },
    modelValue: (__VLS_ctx.merchantSearchKeyword),
    placeholder: "搜索商家账号 / 店铺 / 邮箱 / 手机号",
    clearable: true,
}));
const __VLS_255 = __VLS_254({
    ...{ 'onKeyup': {} },
    ...{ 'onClear': {} },
    modelValue: (__VLS_ctx.merchantSearchKeyword),
    placeholder: "搜索商家账号 / 店铺 / 邮箱 / 手机号",
    clearable: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_254));
let __VLS_258;
const __VLS_259 = {
    ...{ keyup: {} },
    onKeyup: (__VLS_ctx.loadMerchantDialog),
    ...{ clear: {} },
    onClear: (__VLS_ctx.loadMerchantDialog),
};
var __VLS_256;
var __VLS_257;
let __VLS_260;
/** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
elButton;
// @ts-ignore
const __VLS_261 = __VLS_asFunctionalComponent1(__VLS_260, new __VLS_260({
    ...{ 'onClick': {} },
    type: "primary",
    loading: (__VLS_ctx.merchantDialogLoading),
}));
const __VLS_262 = __VLS_261({
    ...{ 'onClick': {} },
    type: "primary",
    loading: (__VLS_ctx.merchantDialogLoading),
}, ...__VLS_functionalComponentArgsRest(__VLS_261));
let __VLS_265;
const __VLS_266 = {
    ...{ click: {} },
    onClick: (__VLS_ctx.loadMerchantDialog),
};
const { default: __VLS_267 } = __VLS_263.slots;
// @ts-ignore
[merchantDialogVisible, loadMerchantDialog, loadMerchantDialog, loadMerchantDialog, loadMerchantDialog, merchantSearchKeyword, merchantDialogLoading,];
var __VLS_263;
var __VLS_264;
let __VLS_268;
/** @ts-ignore @type { | typeof __VLS_components.elTable | typeof __VLS_components.ElTable | typeof __VLS_components['el-table'] | typeof __VLS_components.elTable | typeof __VLS_components.ElTable | typeof __VLS_components['el-table']} */
elTable;
// @ts-ignore
const __VLS_269 = __VLS_asFunctionalComponent1(__VLS_268, new __VLS_268({
    data: (__VLS_ctx.merchantDialogRows),
    border: true,
    stripe: true,
    maxHeight: "420",
}));
const __VLS_270 = __VLS_269({
    data: (__VLS_ctx.merchantDialogRows),
    border: true,
    stripe: true,
    maxHeight: "420",
}, ...__VLS_functionalComponentArgsRest(__VLS_269));
__VLS_asFunctionalDirective(__VLS_directives.vLoading, {})(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.merchantDialogLoading) }, null, null);
const { default: __VLS_273 } = __VLS_271.slots;
let __VLS_274;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_275 = __VLS_asFunctionalComponent1(__VLS_274, new __VLS_274({
    prop: "shopName",
    label: "店铺",
    minWidth: "140",
    showOverflowTooltip: true,
}));
const __VLS_276 = __VLS_275({
    prop: "shopName",
    label: "店铺",
    minWidth: "140",
    showOverflowTooltip: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_275));
let __VLS_279;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_280 = __VLS_asFunctionalComponent1(__VLS_279, new __VLS_279({
    prop: "email",
    label: "账号/邮箱",
    minWidth: "170",
    showOverflowTooltip: true,
}));
const __VLS_281 = __VLS_280({
    prop: "email",
    label: "账号/邮箱",
    minWidth: "170",
    showOverflowTooltip: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_280));
let __VLS_284;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_285 = __VLS_asFunctionalComponent1(__VLS_284, new __VLS_284({
    prop: "phone",
    label: "手机号",
    minWidth: "120",
    showOverflowTooltip: true,
}));
const __VLS_286 = __VLS_285({
    prop: "phone",
    label: "手机号",
    minWidth: "120",
    showOverflowTooltip: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_285));
let __VLS_289;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_290 = __VLS_asFunctionalComponent1(__VLS_289, new __VLS_289({
    prop: "status",
    label: "状态",
    width: "90",
    align: "center",
}));
const __VLS_291 = __VLS_290({
    prop: "status",
    label: "状态",
    width: "90",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_290));
const { default: __VLS_294 } = __VLS_292.slots;
{
    const { default: __VLS_295 } = __VLS_292.slots;
    const [{ row }] = __VLS_vSlot(__VLS_295);
    let __VLS_296;
    /** @ts-ignore @type { | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag'] | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag']} */
    elTag;
    // @ts-ignore
    const __VLS_297 = __VLS_asFunctionalComponent1(__VLS_296, new __VLS_296({
        type: (row.status === 'ENABLE' ? 'success' : 'danger'),
        size: "small",
    }));
    const __VLS_298 = __VLS_297({
        type: (row.status === 'ENABLE' ? 'success' : 'danger'),
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_297));
    const { default: __VLS_301 } = __VLS_299.slots;
    (row.status === 'ENABLE' ? '启用' : '禁用');
    // @ts-ignore
    [merchantDialogLoading, merchantDialogRows, vLoading,];
    var __VLS_299;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_292;
let __VLS_302;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_303 = __VLS_asFunctionalComponent1(__VLS_302, new __VLS_302({
    label: "操作",
    width: "90",
    align: "center",
    fixed: "right",
}));
const __VLS_304 = __VLS_303({
    label: "操作",
    width: "90",
    align: "center",
    fixed: "right",
}, ...__VLS_functionalComponentArgsRest(__VLS_303));
const { default: __VLS_307 } = __VLS_305.slots;
{
    const { default: __VLS_308 } = __VLS_305.slots;
    const [{ row }] = __VLS_vSlot(__VLS_308);
    let __VLS_309;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_310 = __VLS_asFunctionalComponent1(__VLS_309, new __VLS_309({
        ...{ 'onClick': {} },
        link: true,
        type: "primary",
    }));
    const __VLS_311 = __VLS_310({
        ...{ 'onClick': {} },
        link: true,
        type: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_310));
    let __VLS_314;
    const __VLS_315 = {
        ...{ click: {} },
        onClick: (...[$event]) => {
            __VLS_ctx.chooseMerchant(row);
            // @ts-ignore
            [chooseMerchant,];
        },
    };
    const { default: __VLS_316 } = __VLS_312.slots;
    // @ts-ignore
    [];
    var __VLS_312;
    var __VLS_313;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_305;
// @ts-ignore
[];
var __VLS_271;
// @ts-ignore
[];
var __VLS_248;
var __VLS_249;
let __VLS_317;
/** @ts-ignore @type { | typeof __VLS_components.elDialog | typeof __VLS_components.ElDialog | typeof __VLS_components['el-dialog'] | typeof __VLS_components.elDialog | typeof __VLS_components.ElDialog | typeof __VLS_components['el-dialog']} */
elDialog;
// @ts-ignore
const __VLS_318 = __VLS_asFunctionalComponent1(__VLS_317, new __VLS_317({
    modelValue: (__VLS_ctx.resultVisible),
    title: "订单已创建",
    width: "500px",
}));
const __VLS_319 = __VLS_318({
    modelValue: (__VLS_ctx.resultVisible),
    title: "订单已创建",
    width: "500px",
}, ...__VLS_functionalComponentArgsRest(__VLS_318));
const { default: __VLS_322 } = __VLS_320.slots;
if (__VLS_ctx.orderResult) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
    let __VLS_323;
    /** @ts-ignore @type { | typeof __VLS_components.elDescriptions | typeof __VLS_components.ElDescriptions | typeof __VLS_components['el-descriptions'] | typeof __VLS_components.elDescriptions | typeof __VLS_components.ElDescriptions | typeof __VLS_components['el-descriptions']} */
    elDescriptions;
    // @ts-ignore
    const __VLS_324 = __VLS_asFunctionalComponent1(__VLS_323, new __VLS_323({
        column: (1),
        border: true,
        size: "small",
    }));
    const __VLS_325 = __VLS_324({
        column: (1),
        border: true,
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_324));
    const { default: __VLS_328 } = __VLS_326.slots;
    let __VLS_329;
    /** @ts-ignore @type { | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item'] | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item']} */
    elDescriptionsItem;
    // @ts-ignore
    const __VLS_330 = __VLS_asFunctionalComponent1(__VLS_329, new __VLS_329({
        label: "订单号",
    }));
    const __VLS_331 = __VLS_330({
        label: "订单号",
    }, ...__VLS_functionalComponentArgsRest(__VLS_330));
    const { default: __VLS_334 } = __VLS_332.slots;
    (__VLS_ctx.orderResult.orderNo);
    // @ts-ignore
    [resultVisible, orderResult, orderResult,];
    var __VLS_332;
    let __VLS_335;
    /** @ts-ignore @type { | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item'] | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item']} */
    elDescriptionsItem;
    // @ts-ignore
    const __VLS_336 = __VLS_asFunctionalComponent1(__VLS_335, new __VLS_335({
        label: "合计",
    }));
    const __VLS_337 = __VLS_336({
        label: "合计",
    }, ...__VLS_functionalComponentArgsRest(__VLS_336));
    const { default: __VLS_340 } = __VLS_338.slots;
    (__VLS_ctx.orderResult.totalAmount);
    // @ts-ignore
    [orderResult,];
    var __VLS_338;
    let __VLS_341;
    /** @ts-ignore @type { | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item'] | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item']} */
    elDescriptionsItem;
    // @ts-ignore
    const __VLS_342 = __VLS_asFunctionalComponent1(__VLS_341, new __VLS_341({
        label: "状态",
    }));
    const __VLS_343 = __VLS_342({
        label: "状态",
    }, ...__VLS_functionalComponentArgsRest(__VLS_342));
    const { default: __VLS_346 } = __VLS_344.slots;
    (__VLS_ctx.orderResult.status);
    // @ts-ignore
    [orderResult,];
    var __VLS_344;
    // @ts-ignore
    [];
    var __VLS_326;
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        ...{ style: {} },
    });
}
{
    const { footer: __VLS_347 } = __VLS_320.slots;
    let __VLS_348;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_349 = __VLS_asFunctionalComponent1(__VLS_348, new __VLS_348({
        ...{ 'onClick': {} },
    }));
    const __VLS_350 = __VLS_349({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_349));
    let __VLS_353;
    const __VLS_354 = {
        ...{ click: {} },
        onClick: (...[$event]) => {
            __VLS_ctx.resultVisible = false;
            // @ts-ignore
            [resultVisible,];
        },
    };
    const { default: __VLS_355 } = __VLS_351.slots;
    // @ts-ignore
    [];
    var __VLS_351;
    var __VLS_352;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_320;
// @ts-ignore
var __VLS_6 = __VLS_5, __VLS_193 = __VLS_192;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
