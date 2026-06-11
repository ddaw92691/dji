/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
const props = defineProps(['item']);
const menuStore = useMenuStore();
const hasChildren = computed(() => props.item.children?.length);
const __VLS_ctx = {
    ...{},
    ...{},
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
if (__VLS_ctx.hasChildren) {
    let __VLS_0;
    /** @ts-ignore @type { | typeof __VLS_components.elSubMenu | typeof __VLS_components.ElSubMenu | typeof __VLS_components['el-sub-menu'] | typeof __VLS_components.elSubMenu | typeof __VLS_components.ElSubMenu | typeof __VLS_components['el-sub-menu']} */
    elSubMenu;
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
        index: (__VLS_ctx.item.id),
    }));
    const __VLS_2 = __VLS_1({
        index: (__VLS_ctx.item.id),
    }, ...__VLS_functionalComponentArgsRest(__VLS_1));
    var __VLS_5;
    const { default: __VLS_6 } = __VLS_3.slots;
    {
        const { title: __VLS_7 } = __VLS_3.slots;
        if (__VLS_ctx.item.icon) {
            let __VLS_8;
            /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
            elIcon;
            // @ts-ignore
            const __VLS_9 = __VLS_asFunctionalComponent1(__VLS_8, new __VLS_8({}));
            const __VLS_10 = __VLS_9({}, ...__VLS_functionalComponentArgsRest(__VLS_9));
            const { default: __VLS_13 } = __VLS_11.slots;
            const __VLS_14 = (__VLS_ctx.menuStore.iconComponents[__VLS_ctx.item.icon]);
            // @ts-ignore
            const __VLS_15 = __VLS_asFunctionalComponent1(__VLS_14, new __VLS_14({}));
            const __VLS_16 = __VLS_15({}, ...__VLS_functionalComponentArgsRest(__VLS_15));
            // @ts-ignore
            [hasChildren, item, item, item, menuStore,];
            var __VLS_11;
        }
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
        (__VLS_ctx.item.title);
        // @ts-ignore
        [item,];
    }
    for (const [child] of __VLS_vFor((__VLS_ctx.item.children))) {
        let __VLS_19;
        /** @ts-ignore @type { | typeof __VLS_components.MenuItem} */
        MenuItem;
        // @ts-ignore
        const __VLS_20 = __VLS_asFunctionalComponent1(__VLS_19, new __VLS_19({
            key: (child.path),
            item: (child),
        }));
        const __VLS_21 = __VLS_20({
            key: (child.path),
            item: (child),
        }, ...__VLS_functionalComponentArgsRest(__VLS_20));
        // @ts-ignore
        [item,];
    }
    // @ts-ignore
    [];
    var __VLS_3;
}
else {
    let __VLS_24;
    /** @ts-ignore @type { | typeof __VLS_components.elMenuItem | typeof __VLS_components.ElMenuItem | typeof __VLS_components['el-menu-item'] | typeof __VLS_components.elMenuItem | typeof __VLS_components.ElMenuItem | typeof __VLS_components['el-menu-item']} */
    elMenuItem;
    // @ts-ignore
    const __VLS_25 = __VLS_asFunctionalComponent1(__VLS_24, new __VLS_24({
        index: (__VLS_ctx.item.path),
    }));
    const __VLS_26 = __VLS_25({
        index: (__VLS_ctx.item.path),
    }, ...__VLS_functionalComponentArgsRest(__VLS_25));
    var __VLS_29;
    const { default: __VLS_30 } = __VLS_27.slots;
    if (__VLS_ctx.item.icon) {
        let __VLS_31;
        /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
        elIcon;
        // @ts-ignore
        const __VLS_32 = __VLS_asFunctionalComponent1(__VLS_31, new __VLS_31({}));
        const __VLS_33 = __VLS_32({}, ...__VLS_functionalComponentArgsRest(__VLS_32));
        const { default: __VLS_36 } = __VLS_34.slots;
        const __VLS_37 = (__VLS_ctx.menuStore.iconComponents[__VLS_ctx.item.icon]);
        // @ts-ignore
        const __VLS_38 = __VLS_asFunctionalComponent1(__VLS_37, new __VLS_37({}));
        const __VLS_39 = __VLS_38({}, ...__VLS_functionalComponentArgsRest(__VLS_38));
        // @ts-ignore
        [item, item, item, menuStore,];
        var __VLS_34;
    }
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    (__VLS_ctx.item.title);
    // @ts-ignore
    [item,];
    var __VLS_27;
}
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    props: ['item'],
});
export default {};
