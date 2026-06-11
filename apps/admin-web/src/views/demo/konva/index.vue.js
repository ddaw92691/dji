/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ElMessage } from 'element-plus';
import KonvaImageAnnotationEditor from './KonvaImageAnnotationEditor.vue';
defineOptions({ name: 'KonvaView' });
// 编辑器组件引用
const editorRef = useTemplateRef('editorRef');
// 当前加载的图片地址
const imageSrc = ref('');
// 画布上的所有标注数据
const annotations = ref([]);
// 用户选择的要还原的图形类型
const restoreShapeType = ref('line');
// 用户输入的点位 JSON 字符串
const restorePointsJson = ref('');
// 图片的 Object URL，用于在组件卸载时释放
let objectUrl = '';
// 图形类型配置选项
const shapeOptions = [
    {
        value: 'rect',
        label: '矩形',
        desc: '左上角 + 右下角',
        pointRule: '需要 2 个点',
    },
    {
        value: 'line',
        label: '线段',
        desc: '起点 + 终点',
        pointRule: '需要 2 个点',
    },
    {
        value: 'polygon',
        label: '多边形',
        desc: '按顺序连接并闭合',
        pointRule: '至少 3 个点',
    },
];
// 形状类型与标签的映射关系，用于在界面上显示中文名称
const shapeLabelMap = shapeOptions.reduce((map, item) => {
    map[item.value] = item.label;
    return map;
}, {});
/**
 * 计算当前画布中各类型图形的数量
 * @returns 包含 line、rect、polygon 三种类型数量的对象
 */
const shapeCountMap = computed(() => {
    return annotations.value.reduce((map, item) => {
        map[item.type] += 1;
        return map;
    }, { line: 0, rect: 0, polygon: 0 });
});
/**
 * 处理图片上传变化事件
 * @param uploadFile - Element Plus 上传组件返回的文件对象
 * 功能：
 * 1. 验证文件类型是否为图片
 * 2. 创建图片的 Object URL 用于预览
 * 3. 清空之前的标注数据
 * 4. 释放旧的 Object URL 避免内存泄漏
 */
const handleImageChange = (uploadFile) => {
    const file = uploadFile.raw;
    if (!file)
        return;
    if (!file.type.startsWith('image/')) {
        ElMessage.warning('请上传图片文件');
        return;
    }
    // 释放之前的 Object URL
    if (objectUrl)
        URL.revokeObjectURL(objectUrl);
    objectUrl = URL.createObjectURL(file);
    imageSrc.value = objectUrl;
    annotations.value = [];
    ElMessage.success('图片已加载，可以开始标注');
};
/**
 * 类型守卫：验证数据是否为有效的点位数组
 * @param value - 待验证的数据
 * @returns 如果是有效的点位数组返回 true，否则返回 false
 * 验证规则：
 * 1. 必须是数组
 * 2. 数组中每个元素必须是对象
 * 3. 每个对象必须包含 x 和 y 两个数字属性
 */
const isAnnotationPointList = (value) => {
    if (!Array.isArray(value))
        return false;
    return value.every((point) => {
        if (!point || typeof point !== 'object')
            return false;
        const data = point;
        return typeof data.x === 'number' && typeof data.y === 'number';
    });
};
/**
 * 验证点位数量是否符合图形类型要求
 * @param type - 图形类型（line、rect、polygon）
 * @param points - 点位数组
 * @returns 如果点位数量符合要求返回 true，否则返回 false
 * 规则：
 * - 矩形和线段：需要恰好 2 个点
 * - 多边形：至少需要 3 个点
 */
const isValidPointCount = (type, points) => {
    if (type === 'polygon')
        return points.length >= 3;
    return points.length === 2;
};
/**
 * 将用户输入的点位数据还原到画布上
 * 功能流程：
 * 1. 解析用户输入的 JSON 字符串
 * 2. 验证数据格式是否正确
 * 3. 验证点位数量是否符合所选图形类型
 * 4. 将新的标注添加到画布中
 * 错误处理：
 * - JSON 解析失败：提示格式错误
 * - 数据格式不正确：提示正确的格式
 * - 点位数量不符合：提示所需点位数量
 */
const restoreAnnotations = () => {
    try {
        const value = JSON.parse(restorePointsJson.value);
        if (!isAnnotationPointList(value)) {
            ElMessage.warning('点位数据格式不正确，请输入 [{x:1,y:2}] 这种数组格式');
            return;
        }
        if (!isValidPointCount(restoreShapeType.value, value)) {
            ElMessage.warning('矩形/线段需要 2 个点，多边形至少需要 3 个点');
            return;
        }
        annotations.value = [
            ...annotations.value,
            {
                type: restoreShapeType.value,
                point: value,
            },
        ];
        ElMessage.success('点位已添加到画布');
    }
    catch {
        ElMessage.error('JSON 解析失败，请检查格式');
    }
};
/**
 * 组件卸载时的清理工作
 * 释放通过 URL.createObjectURL 创建的 Object URL，避免内存泄漏
 */
onUnmounted(() => {
    if (objectUrl)
        URL.revokeObjectURL(objectUrl);
});
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['konva-demo-page']} */ ;
/** @type {__VLS_StyleScopedClasses['simple-data-panel']} */ ;
/** @type {__VLS_StyleScopedClasses['konva-demo-header']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "konva-demo-page" },
});
/** @type {__VLS_StyleScopedClasses['konva-demo-page']} */ ;
let __VLS_0;
/** @ts-ignore @type { | typeof __VLS_components.BaseCard | typeof __VLS_components.BaseCard} */
BaseCard;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    ...{ class: "konva-demo-card" },
}));
const __VLS_2 = __VLS_1({
    ...{ class: "konva-demo-card" },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
/** @type {__VLS_StyleScopedClasses['konva-demo-card']} */ ;
const { default: __VLS_5 } = __VLS_3.slots;
{
    const { header: __VLS_6 } = __VLS_3.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "konva-demo-header" },
    });
    /** @type {__VLS_StyleScopedClasses['konva-demo-header']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "konva-demo-title" },
    });
    /** @type {__VLS_StyleScopedClasses['konva-demo-title']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "konva-demo-desc" },
    });
    /** @type {__VLS_StyleScopedClasses['konva-demo-desc']} */ ;
    let __VLS_7;
    /** @ts-ignore @type { | typeof __VLS_components.elUpload | typeof __VLS_components.ElUpload | typeof __VLS_components['el-upload'] | typeof __VLS_components.elUpload | typeof __VLS_components.ElUpload | typeof __VLS_components['el-upload']} */
    elUpload;
    // @ts-ignore
    const __VLS_8 = __VLS_asFunctionalComponent1(__VLS_7, new __VLS_7({
        showFileList: (false),
        autoUpload: (false),
        accept: "image/*",
        onChange: (__VLS_ctx.handleImageChange),
    }));
    const __VLS_9 = __VLS_8({
        showFileList: (false),
        autoUpload: (false),
        accept: "image/*",
        onChange: (__VLS_ctx.handleImageChange),
    }, ...__VLS_functionalComponentArgsRest(__VLS_8));
    const { default: __VLS_12 } = __VLS_10.slots;
    let __VLS_13;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_14 = __VLS_asFunctionalComponent1(__VLS_13, new __VLS_13({
        type: "primary",
    }));
    const __VLS_15 = __VLS_14({
        type: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_14));
    const { default: __VLS_18 } = __VLS_16.slots;
    // @ts-ignore
    [handleImageChange,];
    var __VLS_16;
    // @ts-ignore
    [];
    var __VLS_10;
    // @ts-ignore
    [];
}
const __VLS_19 = KonvaImageAnnotationEditor;
// @ts-ignore
const __VLS_20 = __VLS_asFunctionalComponent1(__VLS_19, new __VLS_19({
    ref: "editorRef",
    modelValue: (__VLS_ctx.annotations),
    imageSrc: (__VLS_ctx.imageSrc),
    height: (630),
}));
const __VLS_21 = __VLS_20({
    ref: "editorRef",
    modelValue: (__VLS_ctx.annotations),
    imageSrc: (__VLS_ctx.imageSrc),
    height: (630),
}, ...__VLS_functionalComponentArgsRest(__VLS_20));
var __VLS_24;
var __VLS_22;
// @ts-ignore
[annotations, imageSrc,];
var __VLS_3;
let __VLS_26;
/** @ts-ignore @type { | typeof __VLS_components.BaseCard | typeof __VLS_components.BaseCard} */
BaseCard;
// @ts-ignore
const __VLS_27 = __VLS_asFunctionalComponent1(__VLS_26, new __VLS_26({
    ...{ class: "konva-data-card" },
}));
const __VLS_28 = __VLS_27({
    ...{ class: "konva-data-card" },
}, ...__VLS_functionalComponentArgsRest(__VLS_27));
/** @type {__VLS_StyleScopedClasses['konva-data-card']} */ ;
const { default: __VLS_31 } = __VLS_29.slots;
{
    const { header: __VLS_32 } = __VLS_29.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "konva-data-header" },
    });
    /** @type {__VLS_StyleScopedClasses['konva-data-header']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "konva-data-title" },
    });
    /** @type {__VLS_StyleScopedClasses['konva-data-title']} */ ;
    // @ts-ignore
    [];
}
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "simple-data-panel" },
});
/** @type {__VLS_StyleScopedClasses['simple-data-panel']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "data-input-section" },
});
/** @type {__VLS_StyleScopedClasses['data-input-section']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "section-header" },
});
/** @type {__VLS_StyleScopedClasses['section-header']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "section-title" },
});
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
let __VLS_33;
/** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
elButton;
// @ts-ignore
const __VLS_34 = __VLS_asFunctionalComponent1(__VLS_33, new __VLS_33({
    ...{ 'onClick': {} },
    type: "primary",
    size: "small",
}));
const __VLS_35 = __VLS_34({
    ...{ 'onClick': {} },
    type: "primary",
    size: "small",
}, ...__VLS_functionalComponentArgsRest(__VLS_34));
let __VLS_38;
const __VLS_39 = {
    ...{ click: {} },
    onClick: (__VLS_ctx.restoreAnnotations),
};
const { default: __VLS_40 } = __VLS_36.slots;
// @ts-ignore
[restoreAnnotations,];
var __VLS_36;
var __VLS_37;
let __VLS_41;
/** @ts-ignore @type { | typeof __VLS_components.elRadioGroup | typeof __VLS_components.ElRadioGroup | typeof __VLS_components['el-radio-group'] | typeof __VLS_components.elRadioGroup | typeof __VLS_components.ElRadioGroup | typeof __VLS_components['el-radio-group']} */
elRadioGroup;
// @ts-ignore
const __VLS_42 = __VLS_asFunctionalComponent1(__VLS_41, new __VLS_41({
    modelValue: (__VLS_ctx.restoreShapeType),
    size: "small",
}));
const __VLS_43 = __VLS_42({
    modelValue: (__VLS_ctx.restoreShapeType),
    size: "small",
}, ...__VLS_functionalComponentArgsRest(__VLS_42));
const { default: __VLS_46 } = __VLS_44.slots;
let __VLS_47;
/** @ts-ignore @type { | typeof __VLS_components.elRadioButton | typeof __VLS_components.ElRadioButton | typeof __VLS_components['el-radio-button'] | typeof __VLS_components.elRadioButton | typeof __VLS_components.ElRadioButton | typeof __VLS_components['el-radio-button']} */
elRadioButton;
// @ts-ignore
const __VLS_48 = __VLS_asFunctionalComponent1(__VLS_47, new __VLS_47({
    value: "line",
}));
const __VLS_49 = __VLS_48({
    value: "line",
}, ...__VLS_functionalComponentArgsRest(__VLS_48));
const { default: __VLS_52 } = __VLS_50.slots;
// @ts-ignore
[restoreShapeType,];
var __VLS_50;
let __VLS_53;
/** @ts-ignore @type { | typeof __VLS_components.elRadioButton | typeof __VLS_components.ElRadioButton | typeof __VLS_components['el-radio-button'] | typeof __VLS_components.elRadioButton | typeof __VLS_components.ElRadioButton | typeof __VLS_components['el-radio-button']} */
elRadioButton;
// @ts-ignore
const __VLS_54 = __VLS_asFunctionalComponent1(__VLS_53, new __VLS_53({
    value: "rect",
}));
const __VLS_55 = __VLS_54({
    value: "rect",
}, ...__VLS_functionalComponentArgsRest(__VLS_54));
const { default: __VLS_58 } = __VLS_56.slots;
// @ts-ignore
[];
var __VLS_56;
let __VLS_59;
/** @ts-ignore @type { | typeof __VLS_components.elRadioButton | typeof __VLS_components.ElRadioButton | typeof __VLS_components['el-radio-button'] | typeof __VLS_components.elRadioButton | typeof __VLS_components.ElRadioButton | typeof __VLS_components['el-radio-button']} */
elRadioButton;
// @ts-ignore
const __VLS_60 = __VLS_asFunctionalComponent1(__VLS_59, new __VLS_59({
    value: "polygon",
}));
const __VLS_61 = __VLS_60({
    value: "polygon",
}, ...__VLS_functionalComponentArgsRest(__VLS_60));
const { default: __VLS_64 } = __VLS_62.slots;
// @ts-ignore
[];
var __VLS_62;
// @ts-ignore
[];
var __VLS_44;
let __VLS_65;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_66 = __VLS_asFunctionalComponent1(__VLS_65, new __VLS_65({
    modelValue: (__VLS_ctx.restorePointsJson),
    type: "textarea",
    rows: (4),
    placeholder: '格式：[{"x":120,"y":100},{"x":360,"y":260}]',
}));
const __VLS_67 = __VLS_66({
    modelValue: (__VLS_ctx.restorePointsJson),
    type: "textarea",
    rows: (4),
    placeholder: '格式：[{"x":120,"y":100},{"x":360,"y":260}]',
}, ...__VLS_functionalComponentArgsRest(__VLS_66));
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "data-output-section" },
});
/** @type {__VLS_StyleScopedClasses['data-output-section']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "section-header" },
});
/** @type {__VLS_StyleScopedClasses['section-header']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "section-title" },
});
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "stats" },
});
/** @type {__VLS_StyleScopedClasses['stats']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
(__VLS_ctx.annotations.length);
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "stat-rect" },
});
/** @type {__VLS_StyleScopedClasses['stat-rect']} */ ;
(__VLS_ctx.shapeCountMap.rect);
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "stat-line" },
});
/** @type {__VLS_StyleScopedClasses['stat-line']} */ ;
(__VLS_ctx.shapeCountMap.line);
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "stat-polygon" },
});
/** @type {__VLS_StyleScopedClasses['stat-polygon']} */ ;
(__VLS_ctx.shapeCountMap.polygon);
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "output-list" },
});
/** @type {__VLS_StyleScopedClasses['output-list']} */ ;
if (!__VLS_ctx.annotations.length) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "empty-tip" },
    });
    /** @type {__VLS_StyleScopedClasses['empty-tip']} */ ;
}
for (const [item, index] of __VLS_vFor((__VLS_ctx.annotations))) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        key: (index),
        ...{ class: (['output-item', item.type]) },
    });
    /** @type {__VLS_StyleScopedClasses['output-item']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "item-label" },
    });
    /** @type {__VLS_StyleScopedClasses['item-label']} */ ;
    (__VLS_ctx.shapeLabelMap[item.type]);
    (index + 1);
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "item-points" },
    });
    /** @type {__VLS_StyleScopedClasses['item-points']} */ ;
    (JSON.stringify(item.point));
    // @ts-ignore
    [annotations, annotations, annotations, restorePointsJson, shapeCountMap, shapeCountMap, shapeCountMap, shapeLabelMap,];
}
// @ts-ignore
[];
var __VLS_29;
// @ts-ignore
var __VLS_25 = __VLS_24;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
