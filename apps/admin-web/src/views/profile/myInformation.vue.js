/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import ArchivesPanel from '@/views/profile/archivesPanel.vue';
import PersonalInfoPanel from '@/views/profile/personalInfoPanel.vue';
const team = ref([
    {
        name: 'Lucille Richards',
        role: 'UI Designer',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lucille',
        status: 'online',
    },
    {
        name: 'Ray Vaughn',
        role: 'Frontend Dev',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ray',
        status: 'online',
    },
    {
        name: 'Nellie Powers',
        role: 'Product Manager',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Nellie',
        status: 'online',
    },
    {
        name: 'Sallie Henderson',
        role: 'QA Engineer',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sallie',
        status: 'online',
    },
    {
        name: 'James Chen',
        role: '测试工程师',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James',
        status: 'offline',
    },
    {
        name: 'Lucy Wang',
        role: '前端开发',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lucy',
        status: 'offline',
    },
    {
        name: 'Tom Chen',
        role: '数据科学家',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Tom',
        status: 'offline',
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
/** @ts-ignore @type { | typeof __VLS_components.elRow | typeof __VLS_components.ElRow | typeof __VLS_components['el-row'] | typeof __VLS_components.elRow | typeof __VLS_components.ElRow | typeof __VLS_components['el-row']} */
elRow;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    gutter: (20),
}));
const __VLS_2 = __VLS_1({
    gutter: (20),
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_5;
const { default: __VLS_6 } = __VLS_3.slots;
let __VLS_7;
/** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
elCol;
// @ts-ignore
const __VLS_8 = __VLS_asFunctionalComponent1(__VLS_7, new __VLS_7({
    lg: (6),
}));
const __VLS_9 = __VLS_8({
    lg: (6),
}, ...__VLS_functionalComponentArgsRest(__VLS_8));
const { default: __VLS_12 } = __VLS_10.slots;
const __VLS_13 = ArchivesPanel;
// @ts-ignore
const __VLS_14 = __VLS_asFunctionalComponent1(__VLS_13, new __VLS_13({}));
const __VLS_15 = __VLS_14({}, ...__VLS_functionalComponentArgsRest(__VLS_14));
let __VLS_18;
/** @ts-ignore @type { | typeof __VLS_components.TeamMemberCard} */
TeamMemberCard;
// @ts-ignore
const __VLS_19 = __VLS_asFunctionalComponent1(__VLS_18, new __VLS_18({
    title: (`核心团队（${__VLS_ctx.team.length}）`),
    teamData: (__VLS_ctx.team),
    ...{ class: "mt-4" },
}));
const __VLS_20 = __VLS_19({
    title: (`核心团队（${__VLS_ctx.team.length}）`),
    teamData: (__VLS_ctx.team),
    ...{ class: "mt-4" },
}, ...__VLS_functionalComponentArgsRest(__VLS_19));
/** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
// @ts-ignore
[team, team,];
var __VLS_10;
let __VLS_23;
/** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
elCol;
// @ts-ignore
const __VLS_24 = __VLS_asFunctionalComponent1(__VLS_23, new __VLS_23({
    lg: (18),
    ...{ class: "mt-4 min-[1200px]:mt-0" },
}));
const __VLS_25 = __VLS_24({
    lg: (18),
    ...{ class: "mt-4 min-[1200px]:mt-0" },
}, ...__VLS_functionalComponentArgsRest(__VLS_24));
/** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
/** @type {__VLS_StyleScopedClasses['min-[1200px]:mt-0']} */ ;
const { default: __VLS_28 } = __VLS_26.slots;
const __VLS_29 = PersonalInfoPanel;
// @ts-ignore
const __VLS_30 = __VLS_asFunctionalComponent1(__VLS_29, new __VLS_29({}));
const __VLS_31 = __VLS_30({}, ...__VLS_functionalComponentArgsRest(__VLS_30));
// @ts-ignore
[];
var __VLS_26;
// @ts-ignore
[];
var __VLS_3;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
