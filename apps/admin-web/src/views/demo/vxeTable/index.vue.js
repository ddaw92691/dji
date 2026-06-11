/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import VxeTableCreate from '@/views/demo/vxeTable/create.vue';
import { useClipboard } from '@vueuse/core';
defineOptions({ name: 'VxeTableView' });
const menuStore = useMenuStore();
// 使用 VueUse 的复制功能
const { copy } = useClipboard();
const gridRef = useTemplateRef('gridRef');
const vxeTableCreateRef = useTemplateRef('vxeTableCreateRef');
// 性别选项
const sexOptions = [
    { label: '男', value: '0' },
    { label: '女', value: '1' },
];
// 年龄选项
const ageOptions = [
    { label: '大于18岁', value: 18 },
    { label: '大于30岁', value: 30 },
    { label: '大于50岁', value: 50 },
];
// 所有数据
const allData = ref([]);
const gridConfig = ref({
    // 虚拟滚动配置
    virtualYConfig: {
        enabled: true, // 是否启用虚拟滚动
        gt: 0, // 滚动阈值
    },
    // 自动监听父元素的变化去重新计算表格
    autoResize: true,
    loading: false,
    height: '100%', // 表格高度
    minHeight: 500, // 最小高度
    printConfig: {}, // 打印配置
    importConfig: {}, // 导入数据配置
    exportConfig: {}, // 导出数据配置
    // 工具栏配置
    toolbarConfig: {
        custom: true, // 自定义工具栏
        zoom: true, // 最大化显示
        print: true, // 打印
        import: true, // 导入数据
        export: true, // 导出数据
        refresh: true, // 刷新数据
        buttons: [
            { name: '新增', icon: 'vxe-icon-add', code: 'add', status: 'primary' }, // code 用于事件监听
            { name: '删除', icon: 'vxe-icon-delete', code: 'delete', status: 'error' },
        ],
        // 工具栏按钮自定义slot
        // slots: {
        //   buttons: 'operation-left', // 操作按钮自定义slot
        //   tools: 'operation-right', // 工具栏按钮自定义slot
        // },
    },
    // 右键菜单
    menuConfig: {
        body: {
            options: [
                [
                    {
                        code: 'copy',
                        name: '复制内容（Ctrl+C）',
                        prefixConfig: { icon: 'vxe-icon-copy' },
                        visible: true,
                        disabled: false,
                    },
                ],
                [
                    {
                        code: 'fixed',
                        name: '冻结列',
                        children: [
                            { code: 'cancelFixed', name: '取消冻结' },
                            {
                                code: 'fixedLeft',
                                name: '冻结在左侧',
                                prefixConfig: { icon: 'vxe-icon-fixed-left' },
                            },
                            {
                                code: 'fixedRight',
                                name: '冻结在右侧',
                                prefixConfig: { icon: 'vxe-icon-fixed-right' },
                            },
                        ],
                    },
                ],
            ],
        },
    },
    // 复选框配置
    checkboxConfig: {
        labelField: 'id', // 复选框的值
        highlight: true, // 高亮选中行
        range: true, // 支持范围选择
        isShiftKey: true, // 支持shift键选择
    },
    // 行配置
    rowConfig: {
        isHover: true, // 支持鼠标悬停
        drag: true, // 支持拖拽
    },
    // 分页配置
    pagerConfig: {
        currentPage: 1,
        pageSize: 20,
        total: 0,
        pageSizes: [20, 50, 200, 500, 1000],
    },
    // 代理配置
    proxyConfig: {
        // 是否自动加载查询数据
        autoLoad: true,
        ajax: {
            // 查询方法：当分页、排序、筛选改变时会自动调用
            query: async ({ page, form }) => {
                console.log(`output->query 被调用`, page, form);
                // 模拟接口延迟
                await new Promise((resolve) => setTimeout(resolve, 500));
                const { currentPage = 1, pageSize = 20 } = page;
                // 从所有数据中截取当前页的数据
                const result = allData.value.slice((currentPage - 1) * pageSize, currentPage * pageSize);
                // 必须返回 { result: 数据数组, page: { total: 总数 } } 格式
                return {
                    result: result,
                    page: {
                        total: allData.value.length,
                    },
                };
            },
            // 删除方法：当工具栏删除按钮被点击时会自动调用
            delete: async ({ body }) => {
                console.log(`output->delete 被调用`, body);
                // 模拟接口延迟
                await new Promise((resolve) => setTimeout(resolve, 500));
                // body.removeRecords 是要删除的记录数组
                const deleteIds = body.removeRecords.map((item) => item.id);
                // 从 allData 中删除这些记录
                allData.value = allData.value.filter((item) => !deleteIds.includes(item.id));
                ElMessage.success(`成功删除 ${deleteIds.length} 条数据`);
                // 返回 true 表示删除成功，VxeTable 会自动刷新数据
                return true;
            },
            // 可选：保存方法（用于行内编辑）
            save: async ({ body }) => {
                console.log(`output->save 被调用`, body);
                // 模拟接口延迟
                await new Promise((resolve) => setTimeout(resolve, 500));
                // body.insertRecords 是新增的记录
                // body.updateRecords 是修改的记录
                // body.removeRecords 是删除的记录
                if (body.insertRecords.length > 0) {
                    // 处理新增
                    allData.value.push(...body.insertRecords);
                    ElMessage.success(`成功新增 ${body.insertRecords.length} 条数据`);
                }
                if (body.updateRecords.length > 0) {
                    // 处理修改
                    body.updateRecords.forEach((record) => {
                        const index = allData.value.findIndex((item) => item.id === record.id);
                        if (index !== -1) {
                            allData.value[index] = record;
                        }
                    });
                    ElMessage.success(`成功修改 ${body.updateRecords.length} 条数据`);
                }
                return true;
            },
        },
    },
    // 表单
    formConfig: {
        data: {
            name: '',
            sex: '',
            age: undefined,
        },
        items: [
            { field: 'name', title: '姓名', itemRender: { name: 'VxeInput' } },
            { field: 'sex', title: '性别', itemRender: { name: 'VxeSelect', options: sexOptions } },
            {
                field: 'age',
                title: '年龄',
                itemRender: { name: 'VxeNumberInput', props: { controls: false } },
            },
            {
                itemRender: {
                    name: 'VxeButtonGroup',
                    options: [
                        { type: 'submit', content: '搜索', status: 'primary' },
                        { type: 'reset', content: '重置' },
                    ],
                },
            },
        ],
    },
    columns: [
        {
            type: 'seq',
            width: 50,
            fixed: 'left', // 固定在左侧
        },
        { type: 'checkbox', width: 140, title: 'ID' },
        {
            field: 'name',
            title: '姓名',
            sortable: true, // 支持排序
            dragSort: true, // 支持拖拽排序
            minWidth: 120,
            showOverflow: true,
        },
        {
            field: 'sex',
            title: '性别',
            filters: sexOptions, // 支持过滤
            filterMultiple: false, // 支持单选过滤
            minWidth: 120,
            // 格式化性别
            formatter({ cellValue }) {
                const item = sexOptions.find((item) => item.value === cellValue);
                return item ? item.label : '';
            },
        },
        {
            field: 'age',
            title: '年龄',
            sortable: true,
            filters: ageOptions,
            filterMultiple: false,
            filterMethod: ({ value, row }) => row.age >= value,
            minWidth: 120,
        },
        { field: 'address', title: '地址', minWidth: 120, showOverflow: true },
        {
            title: '操作',
            minWidth: 150,
            fixed: 'right',
            slots: {
                default: 'column-operation',
            },
        },
    ],
    data: [],
});
// 随机工具函数
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const roleOptions = ['Develop', 'Test', 'PM', 'Designer'];
const addressOptions = [
    'GuangzhouGuangzhouGuangzhouGuangzhouGuangzhouGuangzhou',
    'Shanghai',
    'Shenzhen',
    'Beijing',
    'Hangzhou',
    'Chengdu',
];
// 随机生成1000条数据
const generateData = (count = 1000) => {
    const list = new Array(count);
    for (let i = 0; i < count; i++) {
        list[i] = {
            id: i + 1,
            name: `Test${i + 1}`,
            role: roleOptions[randomInt(0, roleOptions.length - 1)],
            sex: Math.random() > 0.5 ? '0' : '1', // 0: 男, 1: 女
            age: randomInt(8, 60),
            address: addressOptions[randomInt(0, addressOptions.length - 1)],
        };
    }
    allData.value = list;
};
// 删除数据（行内删除按钮使用）
const deleteDataHandle = async (row) => {
    try {
        // 方法1: 通过 setCheckboxRow 选中该行（row: 要选中的行数据, checked: 是否选中）
        await gridRef.value?.setCheckboxRow(row, true);
        // 调用 commitProxy('delete') 会触发 proxyConfig.ajax.delete 方法（删除选中行）
        await gridRef.value?.commitProxy('delete');
    }
    catch (error) {
        console.error('删除失败:', error);
        ElMessage.error('删除失败');
    }
};
// 刷新
const refresh = (type, data) => {
    // 如果是新增，跳转到第一页
    if (type === 'create') {
        const pagerConfig = gridConfig.value.pagerConfig;
        if (pagerConfig) {
            pagerConfig.currentPage = 1;
        }
        const newData = {
            ...data,
            id: allData.value.length + 1,
        };
        allData.value.unshift(newData);
    }
    if (type === 'update') {
        const index = allData.value.findIndex((item) => item.id === data.id);
        if (index !== -1)
            allData.value[index] = data;
    }
    // 使用 commitProxy 重新查询数据
    gridRef.value?.commitProxy('query');
};
// 工具栏按钮点击
const toolbarButtonClick = async (params) => {
    if (params.code === 'add') {
        vxeTableCreateRef.value?.showDialog(undefined);
    }
};
// 右键菜单点击事件
const menuClick = ({ menu, row, column }) => {
    console.log('menuClick 参数：', { menu, row, column });
    if (menu.code === 'copy') {
        // 获取当前单元格的值
        const cellValue = row[column.field];
        if (cellValue !== null && cellValue !== undefined) {
            // 使用 VueUse 的 copy 方法复制内容
            copy(String(cellValue))
                .then(() => {
                ElMessage.success(`已复制: ${cellValue}`);
            })
                .catch(() => {
                ElMessage.error('复制失败');
            });
        }
        else {
            ElMessage.warning('该单元格没有内容');
        }
    }
};
// 表格事件(所有)
const gridEvents = {
    // 使用 proxyConfig 后，分页变化会自动触发 query，不需要手动处理 pageChange 事件
    // 工具栏按钮点击事件
    toolbarButtonClick: toolbarButtonClick,
    // 右键菜单点击事件
    menuClick: menuClick,
};
onMounted(() => {
    // 生成模拟数据
    generateData();
    // proxyConfig 设置了 autoLoad: true，会自动加载数据，不需要手动调用
});
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "vxe-table-view-container" },
});
/** @type {__VLS_StyleScopedClasses['vxe-table-view-container']} */ ;
let __VLS_0;
/** @ts-ignore @type { | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card'] | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card']} */
elCard;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    shadow: "never",
    ref: "vxeTableCardRef",
    ...{ class: "vxe-table-card" },
}));
const __VLS_2 = __VLS_1({
    shadow: "never",
    ref: "vxeTableCardRef",
    ...{ class: "vxe-table-card" },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_5;
/** @type {__VLS_StyleScopedClasses['vxe-table-card']} */ ;
const { default: __VLS_7 } = __VLS_3.slots;
let __VLS_8;
/** @ts-ignore @type { | typeof __VLS_components.vxeGrid | typeof __VLS_components.VxeGrid | typeof __VLS_components['vxe-grid'] | typeof __VLS_components.vxeGrid | typeof __VLS_components.VxeGrid | typeof __VLS_components['vxe-grid']} */
vxeGrid;
// @ts-ignore
const __VLS_9 = __VLS_asFunctionalComponent1(__VLS_8, new __VLS_8({
    ...(__VLS_ctx.gridConfig),
    ref: "gridRef",
}));
const __VLS_10 = __VLS_9({
    ...(__VLS_ctx.gridConfig),
    ref: "gridRef",
}, ...__VLS_functionalComponentArgsRest(__VLS_9));
(__VLS_ctx.gridEvents);
var __VLS_13;
const { default: __VLS_15 } = __VLS_11.slots;
{
    const { 'column-operation': __VLS_16 } = __VLS_11.slots;
    const [{ row }] = __VLS_vSlot(__VLS_16);
    let __VLS_17;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_18 = __VLS_asFunctionalComponent1(__VLS_17, new __VLS_17({
        ...{ 'onClick': {} },
        type: "primary",
        icon: (__VLS_ctx.menuStore.iconComponents.Edit),
        link: true,
    }));
    const __VLS_19 = __VLS_18({
        ...{ 'onClick': {} },
        type: "primary",
        icon: (__VLS_ctx.menuStore.iconComponents.Edit),
        link: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_18));
    let __VLS_22;
    const __VLS_23 = {
        ...{ click: {} },
        onClick: (...[$event]) => {
            __VLS_ctx.vxeTableCreateRef?.showDialog(row);
            // @ts-ignore
            [gridConfig, gridEvents, menuStore, vxeTableCreateRef,];
        },
    };
    __VLS_asFunctionalDirective(__VLS_directives.vPermission, {})(null, { ...__VLS_directiveBindingRestFields, value: (['role:edit']) }, null, null);
    const { default: __VLS_24 } = __VLS_20.slots;
    // @ts-ignore
    [vPermission,];
    var __VLS_20;
    var __VLS_21;
    let __VLS_25;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_26 = __VLS_asFunctionalComponent1(__VLS_25, new __VLS_25({
        ...{ 'onClick': {} },
        type: "danger",
        icon: (__VLS_ctx.menuStore.iconComponents.Delete),
        link: true,
    }));
    const __VLS_27 = __VLS_26({
        ...{ 'onClick': {} },
        type: "danger",
        icon: (__VLS_ctx.menuStore.iconComponents.Delete),
        link: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_26));
    let __VLS_30;
    const __VLS_31 = {
        ...{ click: {} },
        onClick: (...[$event]) => {
            __VLS_ctx.deleteDataHandle(row);
            // @ts-ignore
            [menuStore, deleteDataHandle,];
        },
    };
    const { default: __VLS_32 } = __VLS_28.slots;
    // @ts-ignore
    [];
    var __VLS_28;
    var __VLS_29;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_11;
const __VLS_33 = VxeTableCreate;
// @ts-ignore
const __VLS_34 = __VLS_asFunctionalComponent1(__VLS_33, new __VLS_33({
    ...{ 'onRefresh': {} },
    ref: "vxeTableCreateRef",
}));
const __VLS_35 = __VLS_34({
    ...{ 'onRefresh': {} },
    ref: "vxeTableCreateRef",
}, ...__VLS_functionalComponentArgsRest(__VLS_34));
let __VLS_38;
const __VLS_39 = {
    ...{ refresh: {} },
    onRefresh: (__VLS_ctx.refresh),
};
var __VLS_40;
var __VLS_36;
var __VLS_37;
// @ts-ignore
[refresh,];
var __VLS_3;
// @ts-ignore
var __VLS_6 = __VLS_5, __VLS_14 = __VLS_13, __VLS_41 = __VLS_40;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
