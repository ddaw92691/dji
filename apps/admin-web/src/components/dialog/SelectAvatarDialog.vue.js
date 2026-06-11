/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ElMessage } from 'element-plus';
import BaseDialog from '@/components/dialog/BaseDialog.vue';
defineOptions({ name: 'SelectAvatarDialog' });
const emits = defineEmits();
const menuStore = useMenuStore();
const open = ref(false);
// 当前选中的菜单
const activeMenu = ref('upload');
// 当前选中的头像id
const selectedAvatarId = ref(null);
// 当前选中的头像
const selectedAvatar = ref(null);
// 搜索框内容
const avatarSearchText = ref('');
// 获取所有头像
const allAvatars = ref(Array.from({ length: 100 }, (_, index) => {
    return {
        id: index + 1,
        title: String(index + 1),
        alt: String(index + 1),
        src: `https://api.dicebear.com/7.x/avataaars/svg?seed=${index + 1}`,
    };
}));
// 过滤后的头像列表
const filteredAvatars = computed(() => {
    if (!avatarSearchText.value) {
        return allAvatars.value;
    }
    const search = avatarSearchText.value.toLowerCase();
    return allAvatars.value.filter((avatar) => avatar.title.toLowerCase().includes(search));
});
// 切换菜单
const switchMenu = (menu) => {
    if (activeMenu.value === menu)
        return;
    activeMenu.value = menu;
    selectedAvatarId.value = null;
    selectedAvatar.value = null;
};
// 选择头像
const selectAvatar = (avatar) => {
    selectedAvatarId.value = avatar.id ?? null;
    selectedAvatar.value = avatar.src;
};
// 上传头像
const uploadFile = (uploadFile) => {
    const file = uploadFile.raw;
    if (!file)
        return;
    // 验证文件大小（2MB）
    const maxSize = 2 * 1024 * 1024;
    if (file.size > maxSize) {
        ElMessage.warning('图片大小不能超过 2MB');
        return;
    }
    const reader = new FileReader();
    reader.onload = () => {
        selectedAvatar.value = reader.result;
    };
    reader.readAsDataURL(file);
};
// 修改头像
const updateAvatar = async () => {
    if (!selectedAvatar.value)
        return;
    emits('getAvatar', selectedAvatar.value);
    close();
};
const close = () => {
    open.value = false;
    avatarSearchText.value = '';
    selectedAvatarId.value = null;
    selectedAvatar.value = null;
};
const showDialog = () => {
    open.value = true;
};
const __VLS_exposed = {
    showDialog,
};
defineExpose(__VLS_exposed);
const __VLS_ctx = {
    ...{},
    ...{},
    ...{},
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['avatar-menu']} */ ;
/** @type {__VLS_StyleScopedClasses['avatar-menu-item']} */ ;
/** @type {__VLS_StyleScopedClasses['avatar-content']} */ ;
/** @type {__VLS_StyleScopedClasses['active']} */ ;
const __VLS_0 = BaseDialog || BaseDialog;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    ...{ 'onClose': {} },
    modelValue: (__VLS_ctx.open),
    title: "修改头像",
    width: (__VLS_ctx.menuStore.isMobile ? '90%' : '800px'),
    closeOnClickModal: (false),
    ...{ style: {} },
}));
const __VLS_2 = __VLS_1({
    ...{ 'onClose': {} },
    modelValue: (__VLS_ctx.open),
    title: "修改头像",
    width: (__VLS_ctx.menuStore.isMobile ? '90%' : '800px'),
    closeOnClickModal: (false),
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
let __VLS_5;
const __VLS_6 = {
    ...{ close: {} },
    onClose: (__VLS_ctx.close),
};
var __VLS_7;
const { default: __VLS_8 } = __VLS_3.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "avatar-container" },
    ...{ class: ({ 'is-mobile': __VLS_ctx.menuStore.isMobile }) },
});
/** @type {__VLS_StyleScopedClasses['avatar-container']} */ ;
/** @type {__VLS_StyleScopedClasses['is-mobile']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "avatar-menu" },
});
/** @type {__VLS_StyleScopedClasses['avatar-menu']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.switchMenu('upload');
            // @ts-ignore
            [open, menuStore, menuStore, close, switchMenu,];
        } },
    ...{ class: "avatar-menu-item" },
    ...{ class: ({ active: __VLS_ctx.activeMenu === 'upload' }) },
});
/** @type {__VLS_StyleScopedClasses['avatar-menu-item']} */ ;
/** @type {__VLS_StyleScopedClasses['active']} */ ;
let __VLS_9;
/** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
elIcon;
// @ts-ignore
const __VLS_10 = __VLS_asFunctionalComponent1(__VLS_9, new __VLS_9({
    size: "20",
}));
const __VLS_11 = __VLS_10({
    size: "20",
}, ...__VLS_functionalComponentArgsRest(__VLS_10));
const { default: __VLS_14 } = __VLS_12.slots;
const __VLS_15 = (__VLS_ctx.menuStore.iconComponents['HSolid:CameraIcon']);
// @ts-ignore
const __VLS_16 = __VLS_asFunctionalComponent1(__VLS_15, new __VLS_15({}));
const __VLS_17 = __VLS_16({}, ...__VLS_functionalComponentArgsRest(__VLS_16));
// @ts-ignore
[menuStore, activeMenu,];
var __VLS_12;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.switchMenu('cat');
            // @ts-ignore
            [switchMenu,];
        } },
    ...{ class: "avatar-menu-item" },
    ...{ class: ({ active: __VLS_ctx.activeMenu === 'cat' }) },
});
/** @type {__VLS_StyleScopedClasses['avatar-menu-item']} */ ;
/** @type {__VLS_StyleScopedClasses['active']} */ ;
let __VLS_20;
/** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
elIcon;
// @ts-ignore
const __VLS_21 = __VLS_asFunctionalComponent1(__VLS_20, new __VLS_20({
    size: "20",
}));
const __VLS_22 = __VLS_21({
    size: "20",
}, ...__VLS_functionalComponentArgsRest(__VLS_21));
const { default: __VLS_25 } = __VLS_23.slots;
const __VLS_26 = (__VLS_ctx.menuStore.iconComponents['HSolid:SparklesIcon']);
// @ts-ignore
const __VLS_27 = __VLS_asFunctionalComponent1(__VLS_26, new __VLS_26({}));
const __VLS_28 = __VLS_27({}, ...__VLS_functionalComponentArgsRest(__VLS_27));
// @ts-ignore
[menuStore, activeMenu,];
var __VLS_23;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "avatar-content" },
});
/** @type {__VLS_StyleScopedClasses['avatar-content']} */ ;
let __VLS_31;
/** @ts-ignore @type { | typeof __VLS_components.transition | typeof __VLS_components.Transition | typeof __VLS_components.transition | typeof __VLS_components.Transition} */
transition;
// @ts-ignore
const __VLS_32 = __VLS_asFunctionalComponent1(__VLS_31, new __VLS_31({
    name: "fade-slide",
    mode: "out-in",
}));
const __VLS_33 = __VLS_32({
    name: "fade-slide",
    mode: "out-in",
}, ...__VLS_functionalComponentArgsRest(__VLS_32));
const { default: __VLS_36 } = __VLS_34.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    key: (__VLS_ctx.activeMenu),
    ...{ style: {} },
});
if (__VLS_ctx.activeMenu === 'upload') {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "upload-container" },
    });
    /** @type {__VLS_StyleScopedClasses['upload-container']} */ ;
    let __VLS_37;
    /** @ts-ignore @type { | typeof __VLS_components.elUpload | typeof __VLS_components.ElUpload | typeof __VLS_components['el-upload'] | typeof __VLS_components.elUpload | typeof __VLS_components.ElUpload | typeof __VLS_components['el-upload']} */
    elUpload;
    // @ts-ignore
    const __VLS_38 = __VLS_asFunctionalComponent1(__VLS_37, new __VLS_37({
        drag: true,
        accept: "image/*",
        showFileList: (false),
        autoUpload: (false),
        onChange: (__VLS_ctx.uploadFile),
        ...{ class: "upload-drag" },
    }));
    const __VLS_39 = __VLS_38({
        drag: true,
        accept: "image/*",
        showFileList: (false),
        autoUpload: (false),
        onChange: (__VLS_ctx.uploadFile),
        ...{ class: "upload-drag" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_38));
    /** @type {__VLS_StyleScopedClasses['upload-drag']} */ ;
    const { default: __VLS_42 } = __VLS_40.slots;
    if (!__VLS_ctx.selectedAvatar) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "upload-content" },
        });
        /** @type {__VLS_StyleScopedClasses['upload-content']} */ ;
        let __VLS_43;
        /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
        elIcon;
        // @ts-ignore
        const __VLS_44 = __VLS_asFunctionalComponent1(__VLS_43, new __VLS_43({
            ...{ class: "upload-icon" },
        }));
        const __VLS_45 = __VLS_44({
            ...{ class: "upload-icon" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_44));
        /** @type {__VLS_StyleScopedClasses['upload-icon']} */ ;
        const { default: __VLS_48 } = __VLS_46.slots;
        const __VLS_49 = (__VLS_ctx.menuStore.iconComponents['HSolid:PhotoIcon']);
        // @ts-ignore
        const __VLS_50 = __VLS_asFunctionalComponent1(__VLS_49, new __VLS_49({}));
        const __VLS_51 = __VLS_50({}, ...__VLS_functionalComponentArgsRest(__VLS_50));
        // @ts-ignore
        [menuStore, activeMenu, activeMenu, uploadFile, selectedAvatar,];
        var __VLS_46;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "upload-text" },
        });
        /** @type {__VLS_StyleScopedClasses['upload-text']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "upload-text-main" },
        });
        /** @type {__VLS_StyleScopedClasses['upload-text-main']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "upload-text-tip" },
        });
        /** @type {__VLS_StyleScopedClasses['upload-text-tip']} */ ;
    }
    else {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "upload-preview-content" },
        });
        /** @type {__VLS_StyleScopedClasses['upload-preview-content']} */ ;
        let __VLS_54;
        /** @ts-ignore @type { | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar']} */
        elAvatar;
        // @ts-ignore
        const __VLS_55 = __VLS_asFunctionalComponent1(__VLS_54, new __VLS_54({
            size: (180),
            src: (__VLS_ctx.selectedAvatar),
        }));
        const __VLS_56 = __VLS_55({
            size: (180),
            src: (__VLS_ctx.selectedAvatar),
        }, ...__VLS_functionalComponentArgsRest(__VLS_55));
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "preview-hint" },
        });
        /** @type {__VLS_StyleScopedClasses['preview-hint']} */ ;
    }
    // @ts-ignore
    [selectedAvatar,];
    var __VLS_40;
}
else if (__VLS_ctx.activeMenu === 'cat') {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "cat-container" },
    });
    /** @type {__VLS_StyleScopedClasses['cat-container']} */ ;
    let __VLS_59;
    /** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input'] | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
    elInput;
    // @ts-ignore
    const __VLS_60 = __VLS_asFunctionalComponent1(__VLS_59, new __VLS_59({
        modelValue: (__VLS_ctx.avatarSearchText),
        placeholder: "搜索头像名称",
        clearable: true,
    }));
    const __VLS_61 = __VLS_60({
        modelValue: (__VLS_ctx.avatarSearchText),
        placeholder: "搜索头像名称",
        clearable: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_60));
    const { default: __VLS_64 } = __VLS_62.slots;
    {
        const { prefix: __VLS_65 } = __VLS_62.slots;
        let __VLS_66;
        /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
        elIcon;
        // @ts-ignore
        const __VLS_67 = __VLS_asFunctionalComponent1(__VLS_66, new __VLS_66({}));
        const __VLS_68 = __VLS_67({}, ...__VLS_functionalComponentArgsRest(__VLS_67));
        const { default: __VLS_71 } = __VLS_69.slots;
        const __VLS_72 = (__VLS_ctx.menuStore.iconComponents['Search']);
        // @ts-ignore
        const __VLS_73 = __VLS_asFunctionalComponent1(__VLS_72, new __VLS_72({}));
        const __VLS_74 = __VLS_73({}, ...__VLS_functionalComponentArgsRest(__VLS_73));
        // @ts-ignore
        [menuStore, activeMenu, avatarSearchText,];
        var __VLS_69;
        // @ts-ignore
        [];
    }
    // @ts-ignore
    [];
    var __VLS_62;
    let __VLS_77;
    /** @ts-ignore @type { | typeof __VLS_components.elScrollbar | typeof __VLS_components.ElScrollbar | typeof __VLS_components['el-scrollbar'] | typeof __VLS_components.elScrollbar | typeof __VLS_components.ElScrollbar | typeof __VLS_components['el-scrollbar']} */
    elScrollbar;
    // @ts-ignore
    const __VLS_78 = __VLS_asFunctionalComponent1(__VLS_77, new __VLS_77({}));
    const __VLS_79 = __VLS_78({}, ...__VLS_functionalComponentArgsRest(__VLS_78));
    const { default: __VLS_82 } = __VLS_80.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "cat-avatar-list" },
    });
    /** @type {__VLS_StyleScopedClasses['cat-avatar-list']} */ ;
    for (const [cat] of __VLS_vFor((__VLS_ctx.filteredAvatars))) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ onClick: (...[$event]) => {
                    if (!!(__VLS_ctx.activeMenu === 'upload'))
                        return;
                    if (!(__VLS_ctx.activeMenu === 'cat'))
                        return;
                    __VLS_ctx.selectAvatar(cat);
                    // @ts-ignore
                    [filteredAvatars, selectAvatar,];
                } },
            ...{ class: "cat-avatar-item" },
            key: (cat.id),
            ...{ class: ({ active: __VLS_ctx.selectedAvatarId === cat.id }) },
        });
        /** @type {__VLS_StyleScopedClasses['cat-avatar-item']} */ ;
        /** @type {__VLS_StyleScopedClasses['active']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "cat-avatar-image" },
        });
        /** @type {__VLS_StyleScopedClasses['cat-avatar-image']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.img)({
            src: (cat.src),
            alt: (cat.alt),
        });
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "cat-avatar-name" },
        });
        /** @type {__VLS_StyleScopedClasses['cat-avatar-name']} */ ;
        (cat.title);
        // @ts-ignore
        [selectedAvatarId,];
    }
    // @ts-ignore
    [];
    var __VLS_80;
}
// @ts-ignore
[];
var __VLS_34;
{
    const { footer: __VLS_83 } = __VLS_3.slots;
    let __VLS_84;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_85 = __VLS_asFunctionalComponent1(__VLS_84, new __VLS_84({
        ...{ 'onClick': {} },
    }));
    const __VLS_86 = __VLS_85({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_85));
    let __VLS_89;
    const __VLS_90 = {
        ...{ click: {} },
        onClick: (__VLS_ctx.close),
    };
    const { default: __VLS_91 } = __VLS_87.slots;
    // @ts-ignore
    [close,];
    var __VLS_87;
    var __VLS_88;
    let __VLS_92;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_93 = __VLS_asFunctionalComponent1(__VLS_92, new __VLS_92({
        ...{ 'onClick': {} },
        type: "primary",
        disabled: (!__VLS_ctx.selectedAvatar),
    }));
    const __VLS_94 = __VLS_93({
        ...{ 'onClick': {} },
        type: "primary",
        disabled: (!__VLS_ctx.selectedAvatar),
    }, ...__VLS_functionalComponentArgsRest(__VLS_93));
    let __VLS_97;
    const __VLS_98 = {
        ...{ click: {} },
        onClick: (__VLS_ctx.updateAvatar),
    };
    const { default: __VLS_99 } = __VLS_95.slots;
    // @ts-ignore
    [selectedAvatar, updateAvatar,];
    var __VLS_95;
    var __VLS_96;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_3;
var __VLS_4;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    setup: () => __VLS_exposed,
    __typeEmits: {},
});
export default {};
