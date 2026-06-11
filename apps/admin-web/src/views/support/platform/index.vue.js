/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ref, reactive, onMounted, onUnmounted, nextTick } from 'vue';
import { ElMessage } from 'element-plus';
import { platformSupportApi } from '@/api/support';
defineOptions({ name: 'AdminPlatformSupportView' });
const loading = ref(false);
const tableData = ref([]);
const total = ref(0);
const sending = ref(false);
const chatSession = ref(null);
const chatMessages = ref([]);
const chatInput = ref('');
const chatMessagesRef = ref();
let chatTimer = null;
const searchForm = reactive({
    keyword: '',
    merchantId: '',
    status: '',
    page: 1,
    pageSize: 20,
});
async function fetchData() {
    loading.value = true;
    try {
        const { data: res } = await platformSupportApi.getSessions({
            keyword: searchForm.keyword || undefined,
            merchantId: searchForm.merchantId || undefined,
            status: searchForm.status || undefined,
            page: searchForm.page,
            pageSize: searchForm.pageSize,
        });
        if (res.code === 200) {
            tableData.value = res.data.list || [];
            total.value = res.data.total || 0;
            if (!chatSession.value && tableData.value.length) {
                await openReply(tableData.value[0]);
            }
        }
    }
    catch {
        ElMessage.error('获取会话失败');
    }
    finally {
        loading.value = false;
    }
}
function handleSearch() {
    searchForm.page = 1;
    chatSession.value = null;
    chatMessages.value = [];
    fetchData();
}
async function openReply(row) {
    chatSession.value = row;
    await loadMessages();
    restartPolling();
}
async function loadMessages() {
    if (!chatSession.value)
        return;
    try {
        const { data: res } = await platformSupportApi.getMessages(chatSession.value.id);
        if (res.code === 200) {
            chatMessages.value = res.data || [];
            await nextTick();
            scrollToBottom();
        }
    }
    catch {
        /* keep current messages */
    }
}
async function sendMessage() {
    const text = chatInput.value.trim();
    if (!text || !chatSession.value)
        return;
    sending.value = true;
    try {
        const { data: res } = await platformSupportApi.sendMessage(chatSession.value.id, { content: text, messageType: 'TEXT' });
        if (res.code === 200) {
            chatInput.value = '';
            await loadMessages();
            fetchData();
        }
        else {
            ElMessage.error(res.message || '发送失败');
        }
    }
    catch {
        ElMessage.error('发送失败');
    }
    finally {
        sending.value = false;
    }
}
async function handleClose(row) {
    try {
        const { data: res } = await platformSupportApi.closeSession(row.id);
        if (res.code === 200) {
            ElMessage.success('会话已关闭');
            await fetchData();
            if (chatSession.value?.id === row.id) {
                chatSession.value.status = 'CLOSED';
            }
        }
        else {
            ElMessage.error(res.message || '关闭失败');
        }
    }
    catch {
        ElMessage.error('关闭失败');
    }
}
function restartPolling() {
    if (chatTimer)
        clearInterval(chatTimer);
    chatTimer = setInterval(loadMessages, 5000);
}
function scrollToBottom() {
    if (chatMessagesRef.value) {
        chatMessagesRef.value.scrollTop = chatMessagesRef.value.scrollHeight;
    }
}
function formatTime(t) {
    if (!t)
        return '';
    return new Date(t).toLocaleString();
}
onMounted(() => {
    fetchData();
});
onUnmounted(() => {
    if (chatTimer)
        clearInterval(chatTimer);
});
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['session-item']} */ ;
/** @type {__VLS_StyleScopedClasses['session-title']} */ ;
/** @type {__VLS_StyleScopedClasses['session-last']} */ ;
/** @type {__VLS_StyleScopedClasses['session-meta']} */ ;
/** @type {__VLS_StyleScopedClasses['chat-msg-wrapper']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "admin-platform-support-page" },
});
/** @type {__VLS_StyleScopedClasses['admin-platform-support-page']} */ ;
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
    placeholder: "搜索商家 / 标题 / 消息",
    clearable: true,
    ...{ style: {} },
}));
const __VLS_14 = __VLS_13({
    ...{ 'onClear': {} },
    ...{ 'onKeyup': {} },
    modelValue: (__VLS_ctx.searchForm.keyword),
    placeholder: "搜索商家 / 标题 / 消息",
    clearable: true,
    ...{ style: {} },
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
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_26 = __VLS_asFunctionalComponent1(__VLS_25, new __VLS_25({
    ...{ 'onClear': {} },
    modelValue: (__VLS_ctx.searchForm.merchantId),
    placeholder: "商家ID",
    clearable: true,
    ...{ style: {} },
}));
const __VLS_27 = __VLS_26({
    ...{ 'onClear': {} },
    modelValue: (__VLS_ctx.searchForm.merchantId),
    placeholder: "商家ID",
    clearable: true,
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_26));
let __VLS_30;
const __VLS_31 = {
    ...{ clear: {} },
    onClear: (__VLS_ctx.handleSearch),
};
var __VLS_28;
var __VLS_29;
// @ts-ignore
[searchForm, handleSearch,];
var __VLS_22;
let __VLS_32;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_33 = __VLS_asFunctionalComponent1(__VLS_32, new __VLS_32({}));
const __VLS_34 = __VLS_33({}, ...__VLS_functionalComponentArgsRest(__VLS_33));
const { default: __VLS_37 } = __VLS_35.slots;
let __VLS_38;
/** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
elSelect;
// @ts-ignore
const __VLS_39 = __VLS_asFunctionalComponent1(__VLS_38, new __VLS_38({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.searchForm.status),
    placeholder: "状态",
    clearable: true,
    ...{ style: {} },
}));
const __VLS_40 = __VLS_39({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.searchForm.status),
    placeholder: "状态",
    clearable: true,
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_39));
let __VLS_43;
const __VLS_44 = {
    ...{ change: {} },
    onChange: (__VLS_ctx.handleSearch),
};
const { default: __VLS_45 } = __VLS_41.slots;
let __VLS_46;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_47 = __VLS_asFunctionalComponent1(__VLS_46, new __VLS_46({
    label: "进行中",
    value: "OPEN",
}));
const __VLS_48 = __VLS_47({
    label: "进行中",
    value: "OPEN",
}, ...__VLS_functionalComponentArgsRest(__VLS_47));
let __VLS_51;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_52 = __VLS_asFunctionalComponent1(__VLS_51, new __VLS_51({
    label: "已关闭",
    value: "CLOSED",
}));
const __VLS_53 = __VLS_52({
    label: "已关闭",
    value: "CLOSED",
}, ...__VLS_functionalComponentArgsRest(__VLS_52));
// @ts-ignore
[searchForm, handleSearch,];
var __VLS_41;
var __VLS_42;
// @ts-ignore
[];
var __VLS_35;
let __VLS_56;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_57 = __VLS_asFunctionalComponent1(__VLS_56, new __VLS_56({}));
const __VLS_58 = __VLS_57({}, ...__VLS_functionalComponentArgsRest(__VLS_57));
const { default: __VLS_61 } = __VLS_59.slots;
let __VLS_62;
/** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
elButton;
// @ts-ignore
const __VLS_63 = __VLS_asFunctionalComponent1(__VLS_62, new __VLS_62({
    ...{ 'onClick': {} },
    type: "primary",
}));
const __VLS_64 = __VLS_63({
    ...{ 'onClick': {} },
    type: "primary",
}, ...__VLS_functionalComponentArgsRest(__VLS_63));
let __VLS_67;
const __VLS_68 = {
    ...{ click: {} },
    onClick: (__VLS_ctx.handleSearch),
};
const { default: __VLS_69 } = __VLS_65.slots;
// @ts-ignore
[handleSearch,];
var __VLS_65;
var __VLS_66;
// @ts-ignore
[];
var __VLS_59;
// @ts-ignore
[];
var __VLS_3;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "support-workbench" },
});
__VLS_asFunctionalDirective(__VLS_directives.vLoading, {})(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.loading) }, null, null);
/** @type {__VLS_StyleScopedClasses['support-workbench']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.aside, __VLS_intrinsics.aside)({
    ...{ class: "session-list" },
});
/** @type {__VLS_StyleScopedClasses['session-list']} */ ;
for (const [session] of __VLS_vFor((__VLS_ctx.tableData))) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
        ...{ onClick: (...[$event]) => {
                __VLS_ctx.openReply(session);
                // @ts-ignore
                [vLoading, loading, tableData, openReply,];
            } },
        key: (session.id),
        ...{ class: "session-item" },
        ...{ class: ({ active: __VLS_ctx.chatSession?.id === session.id }) },
        type: "button",
    });
    /** @type {__VLS_StyleScopedClasses['session-item']} */ ;
    /** @type {__VLS_StyleScopedClasses['active']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "session-row" },
    });
    /** @type {__VLS_StyleScopedClasses['session-row']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({});
    (session.merchantName || '未知商家');
    if (session.merchantUnread) {
        let __VLS_70;
        /** @ts-ignore @type { | typeof __VLS_components.elBadge | typeof __VLS_components.ElBadge | typeof __VLS_components['el-badge']} */
        elBadge;
        // @ts-ignore
        const __VLS_71 = __VLS_asFunctionalComponent1(__VLS_70, new __VLS_70({
            value: (session.merchantUnread),
            type: "danger",
        }));
        const __VLS_72 = __VLS_71({
            value: (session.merchantUnread),
            type: "danger",
        }, ...__VLS_functionalComponentArgsRest(__VLS_71));
    }
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "session-title" },
    });
    /** @type {__VLS_StyleScopedClasses['session-title']} */ ;
    (session.title || session.sessionNo);
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "session-last" },
    });
    /** @type {__VLS_StyleScopedClasses['session-last']} */ ;
    (session.lastMessage || '暂无消息');
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "session-meta" },
    });
    /** @type {__VLS_StyleScopedClasses['session-meta']} */ ;
    let __VLS_75;
    /** @ts-ignore @type { | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag'] | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag']} */
    elTag;
    // @ts-ignore
    const __VLS_76 = __VLS_asFunctionalComponent1(__VLS_75, new __VLS_75({
        type: (session.status === 'OPEN' ? 'success' : 'info'),
        size: "small",
    }));
    const __VLS_77 = __VLS_76({
        type: (session.status === 'OPEN' ? 'success' : 'info'),
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_76));
    const { default: __VLS_80 } = __VLS_78.slots;
    (session.status === 'OPEN' ? '进行中' : '已关闭');
    // @ts-ignore
    [chatSession,];
    var __VLS_78;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    (__VLS_ctx.formatTime(session.lastMessageAt || session.createdAt));
    // @ts-ignore
    [formatTime,];
}
if (!__VLS_ctx.tableData.length) {
    let __VLS_81;
    /** @ts-ignore @type { | typeof __VLS_components.elEmpty | typeof __VLS_components.ElEmpty | typeof __VLS_components['el-empty']} */
    elEmpty;
    // @ts-ignore
    const __VLS_82 = __VLS_asFunctionalComponent1(__VLS_81, new __VLS_81({
        description: "暂无会话",
    }));
    const __VLS_83 = __VLS_82({
        description: "暂无会话",
    }, ...__VLS_functionalComponentArgsRest(__VLS_82));
}
let __VLS_86;
/** @ts-ignore @type { | typeof __VLS_components.elPagination | typeof __VLS_components.ElPagination | typeof __VLS_components['el-pagination']} */
elPagination;
// @ts-ignore
const __VLS_87 = __VLS_asFunctionalComponent1(__VLS_86, new __VLS_86({
    ...{ 'onChange': {} },
    currentPage: (__VLS_ctx.searchForm.page),
    pageSize: (__VLS_ctx.searchForm.pageSize),
    total: (__VLS_ctx.total),
    small: true,
    layout: "prev, pager, next",
}));
const __VLS_88 = __VLS_87({
    ...{ 'onChange': {} },
    currentPage: (__VLS_ctx.searchForm.page),
    pageSize: (__VLS_ctx.searchForm.pageSize),
    total: (__VLS_ctx.total),
    small: true,
    layout: "prev, pager, next",
}, ...__VLS_functionalComponentArgsRest(__VLS_87));
let __VLS_91;
const __VLS_92 = {
    ...{ change: {} },
    onChange: (__VLS_ctx.fetchData),
};
var __VLS_89;
var __VLS_90;
__VLS_asFunctionalElement1(__VLS_intrinsics.section, __VLS_intrinsics.section)({
    ...{ class: "chat-panel" },
});
/** @type {__VLS_StyleScopedClasses['chat-panel']} */ ;
if (__VLS_ctx.chatSession) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "chat-header" },
    });
    /** @type {__VLS_StyleScopedClasses['chat-header']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({});
    (__VLS_ctx.chatSession.merchantName || '未知商家');
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "chat-subtitle" },
    });
    /** @type {__VLS_StyleScopedClasses['chat-subtitle']} */ ;
    (__VLS_ctx.chatSession.title || __VLS_ctx.chatSession.sessionNo);
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "chat-actions" },
    });
    /** @type {__VLS_StyleScopedClasses['chat-actions']} */ ;
    let __VLS_93;
    /** @ts-ignore @type { | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag'] | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag']} */
    elTag;
    // @ts-ignore
    const __VLS_94 = __VLS_asFunctionalComponent1(__VLS_93, new __VLS_93({
        type: (__VLS_ctx.chatSession.status === 'OPEN' ? 'success' : 'info'),
        size: "small",
    }));
    const __VLS_95 = __VLS_94({
        type: (__VLS_ctx.chatSession.status === 'OPEN' ? 'success' : 'info'),
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_94));
    const { default: __VLS_98 } = __VLS_96.slots;
    (__VLS_ctx.chatSession.status === 'OPEN' ? '进行中' : '已关闭');
    // @ts-ignore
    [searchForm, searchForm, tableData, chatSession, chatSession, chatSession, chatSession, chatSession, chatSession, total, fetchData,];
    var __VLS_96;
    if (__VLS_ctx.chatSession.status === 'OPEN') {
        let __VLS_99;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_100 = __VLS_asFunctionalComponent1(__VLS_99, new __VLS_99({
            ...{ 'onClick': {} },
            link: true,
            type: "danger",
        }));
        const __VLS_101 = __VLS_100({
            ...{ 'onClick': {} },
            link: true,
            type: "danger",
        }, ...__VLS_functionalComponentArgsRest(__VLS_100));
        let __VLS_104;
        const __VLS_105 = {
            ...{ click: {} },
            onClick: (...[$event]) => {
                if (!(__VLS_ctx.chatSession))
                    return;
                if (!(__VLS_ctx.chatSession.status === 'OPEN'))
                    return;
                __VLS_ctx.handleClose(__VLS_ctx.chatSession);
                // @ts-ignore
                [chatSession, chatSession, handleClose,];
            },
        };
        const { default: __VLS_106 } = __VLS_102.slots;
        // @ts-ignore
        [];
        var __VLS_102;
        var __VLS_103;
    }
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "chat-messages" },
        ref: "chatMessagesRef",
    });
    /** @type {__VLS_StyleScopedClasses['chat-messages']} */ ;
    for (const [msg] of __VLS_vFor((__VLS_ctx.chatMessages))) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            key: (msg.id),
            ...{ class: "chat-msg-wrapper" },
            ...{ class: ({ 'is-admin': msg.senderSide === 'ADMIN' || msg.senderSide === 'PLATFORM' }) },
        });
        /** @type {__VLS_StyleScopedClasses['chat-msg-wrapper']} */ ;
        /** @type {__VLS_StyleScopedClasses['is-admin']} */ ;
        if (msg.messageType === 'SYSTEM') {
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "system-msg" },
            });
            /** @type {__VLS_StyleScopedClasses['system-msg']} */ ;
            (msg.content);
        }
        else {
            __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
                ...{ class: "msg-sender" },
            });
            /** @type {__VLS_StyleScopedClasses['msg-sender']} */ ;
            (msg.senderDisplayName || msg.senderSide);
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "msg-bubble" },
                ...{ class: ({
                        'admin-bubble': msg.senderSide === 'ADMIN' || msg.senderSide === 'PLATFORM',
                        'other-bubble': msg.senderSide !== 'ADMIN' && msg.senderSide !== 'PLATFORM',
                    }) },
            });
            /** @type {__VLS_StyleScopedClasses['msg-bubble']} */ ;
            /** @type {__VLS_StyleScopedClasses['admin-bubble']} */ ;
            /** @type {__VLS_StyleScopedClasses['other-bubble']} */ ;
            (msg.content);
            __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
                ...{ class: "msg-time" },
            });
            /** @type {__VLS_StyleScopedClasses['msg-time']} */ ;
            (__VLS_ctx.formatTime(msg.createdAt));
        }
        // @ts-ignore
        [formatTime, chatMessages,];
    }
    if (__VLS_ctx.chatSession.status === 'OPEN') {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "chat-input-area" },
        });
        /** @type {__VLS_StyleScopedClasses['chat-input-area']} */ ;
        let __VLS_107;
        /** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
        elInput;
        // @ts-ignore
        const __VLS_108 = __VLS_asFunctionalComponent1(__VLS_107, new __VLS_107({
            ...{ 'onKeyup': {} },
            modelValue: (__VLS_ctx.chatInput),
            placeholder: "输入消息",
            ...{ class: "chat-input" },
        }));
        const __VLS_109 = __VLS_108({
            ...{ 'onKeyup': {} },
            modelValue: (__VLS_ctx.chatInput),
            placeholder: "输入消息",
            ...{ class: "chat-input" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_108));
        let __VLS_112;
        const __VLS_113 = {
            ...{ keyup: {} },
            onKeyup: (__VLS_ctx.sendMessage),
        };
        /** @type {__VLS_StyleScopedClasses['chat-input']} */ ;
        var __VLS_110;
        var __VLS_111;
        let __VLS_114;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_115 = __VLS_asFunctionalComponent1(__VLS_114, new __VLS_114({
            ...{ 'onClick': {} },
            type: "primary",
            loading: (__VLS_ctx.sending),
        }));
        const __VLS_116 = __VLS_115({
            ...{ 'onClick': {} },
            type: "primary",
            loading: (__VLS_ctx.sending),
        }, ...__VLS_functionalComponentArgsRest(__VLS_115));
        let __VLS_119;
        const __VLS_120 = {
            ...{ click: {} },
            onClick: (__VLS_ctx.sendMessage),
        };
        const { default: __VLS_121 } = __VLS_117.slots;
        // @ts-ignore
        [chatSession, chatInput, sendMessage, sendMessage, sending,];
        var __VLS_117;
        var __VLS_118;
    }
    else {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "chat-closed-notice" },
        });
        /** @type {__VLS_StyleScopedClasses['chat-closed-notice']} */ ;
    }
}
else {
    let __VLS_122;
    /** @ts-ignore @type { | typeof __VLS_components.elEmpty | typeof __VLS_components.ElEmpty | typeof __VLS_components['el-empty']} */
    elEmpty;
    // @ts-ignore
    const __VLS_123 = __VLS_asFunctionalComponent1(__VLS_122, new __VLS_122({
        description: "请选择左侧商家会话",
    }));
    const __VLS_124 = __VLS_123({
        description: "请选择左侧商家会话",
    }, ...__VLS_functionalComponentArgsRest(__VLS_123));
}
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
