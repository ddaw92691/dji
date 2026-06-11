/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { Loading, InfoFilled } from '@element-plus/icons-vue';
import { PhotoIcon } from '@heroicons/vue/24/outline';
import { useEventListener, useResizeObserver } from '@vueuse/core';
import { ElMessage } from 'element-plus';
defineOptions({ name: 'KonvaImageAnnotationEditor' });
const props = withDefaults(defineProps(), {
    loading: false,
    readonly: false,
    disabled: false,
    height: 600,
    minStageHeight: 600,
});
/** 组件双向绑定的标注数据。 */
const modelValue = defineModel({ required: true });
/** Element Plus CSS 变量在 Konva 配置中需要作为真实颜色值使用。 */
const getCssVar = (name, fallback) => {
    if (typeof window === 'undefined')
        return fallback;
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback;
};
const elementColors = computed(() => ({
    primary: getCssVar('--el-color-primary', '#409eff'),
    primaryLight: getCssVar('--el-color-primary-light-3', '#79bbff'),
    success: getCssVar('--el-color-success', '#67c23a'),
    successDark: getCssVar('--el-color-success-dark-2', '#529b2e'),
    warning: getCssVar('--el-color-warning', '#e6a23c'),
    warningDark: getCssVar('--el-color-warning-dark-2', '#b88230'),
    bg: getCssVar('--el-bg-color', '#ffffff'),
}));
/** Stage 实例引用。 */
const stageRef = ref();
/** Transformer 实例引用。 */
const transformerRef = ref();
/** 画布外层容器引用。 */
const stageWrapperRef = ref();
/** 当前加载完成的图片元素。 */
const imageElement = ref();
/** 当前激活的绘制工具。 */
const activeTool = ref('rect');
/** 当前选中的图形 id。 */
const selectedShapeId = ref();
/** 当前处于点位编辑模式的图形 id。 */
const editingShapeId = ref();
/** 线段拖拽时的临时偏移，用于保证视觉跟手。 */
const lineDragOffsetMap = ref({});
/** 组件内部维护的图形列表。 */
const shapes = ref([]);
/** 多边形绘制中的草稿点。 */
const polygonDraft = ref([]);
/** 鼠标当前在原图坐标系中的位置。 */
const currentPointer = ref();
/** 图片原始尺寸信息。 */
const imageMeta = reactive({
    width: 0,
    height: 0,
});
/** 画布容器尺寸信息。 */
const wrapperSize = reactive({
    width: 0,
    height: 0,
});
/** 矩形绘制过程中的草稿状态。 */
const rectDraft = reactive({
    start: null,
    current: null,
    isDrawing: false,
});
/** 标记当前 model 是否由组件内部主动回写，避免 watch 循环。 */
const syncingModelFromInner = ref(false);
/** 线段草稿的首点。 */
const lineDraftFirstPoint = ref(null);
/** 图形类型与按钮文案的映射。 */
const toolLabelMap = {
    line: '线段',
    rect: '矩形',
    polygon: '多边形',
};
/** 不同图形使用的 token 颜色。 */
const shapeColorMap = computed(() => ({
    line: {
        stroke: elementColors.value.primary,
        strokeActive: elementColors.value.primaryLight,
    },
    rect: {
        stroke: elementColors.value.success,
        strokeActive: elementColors.value.successDark,
        fill: 'rgba(82, 196, 26, 0.14)',
        fillActive: 'rgba(82, 196, 26, 0.24)',
        fillPreview: 'rgba(82, 196, 26, 0.12)',
    },
    polygon: {
        stroke: elementColors.value.warning,
        strokeActive: elementColors.value.warningDark,
        fill: 'rgba(250, 140, 22, 0.14)',
        fillActive: 'rgba(250, 140, 22, 0.24)',
    },
}));
/** 右侧显示的当前工具名称。 */
const activeToolLabel = computed(() => toolLabelMap[activeTool.value]);
/** 标注组件整体高度，优先使用外部传入的 height。 */
const editorHeight = computed(() => props.height || props.minStageHeight);
/** 标注组件整体高度的 CSS 值。 */
const editorHeightCssValue = computed(() => `${editorHeight.value}px`);
/** 根据容器尺寸和原图尺寸计算实际渲染参数。 */
const renderMetrics = computed(() => {
    const containerWidth = wrapperSize.width || 960;
    const containerHeight = wrapperSize.height || editorHeight.value;
    if (!imageMeta.width || !imageMeta.height) {
        return {
            stageWidth: containerWidth,
            stageHeight: containerHeight,
            renderWidth: 0,
            renderHeight: 0,
            scale: 1,
            offsetX: 0,
            offsetY: 0,
        };
    }
    const scale = Math.min(containerWidth / imageMeta.width, containerHeight / imageMeta.height);
    const renderWidth = imageMeta.width * scale;
    const renderHeight = imageMeta.height * scale;
    return {
        stageWidth: containerWidth,
        stageHeight: containerHeight,
        renderWidth,
        renderHeight,
        scale,
        offsetX: (containerWidth - renderWidth) / 2,
        offsetY: (containerHeight - renderHeight) / 2,
    };
});
/** Stage 的尺寸配置。 */
const stageConfig = computed(() => ({
    width: renderMetrics.value.stageWidth,
    height: renderMetrics.value.stageHeight,
}));
/** 图片节点配置。 */
const imageConfig = computed(() => ({
    image: imageElement.value,
    x: renderMetrics.value.offsetX,
    y: renderMetrics.value.offsetY,
    width: renderMetrics.value.renderWidth,
    height: renderMetrics.value.renderHeight,
    listening: false,
}));
/** Transformer 配置，当前只作为选中框与移动辅助，不开启缩放锚点。 */
const transformerConfig = computed(() => ({
    rotateEnabled: false,
    resizeEnabled: false,
    enabledAnchors: [],
    borderStroke: elementColors.value.primary,
    borderStrokeWidth: 1,
    borderDash: [6, 4],
    padding: 4,
    ignoreStroke: true,
}));
/** 是否可完成多边形闭合。 */
const canFinishPolygon = computed(() => polygonDraft.value.length >= 3);
/** 是否允许点击起点闭合多边形。 */
const canClosePolygonByStartPoint = computed(() => polygonDraft.value.length >= 3);
/** 当前是否允许撤销草稿点。 */
const canUndoDraft = computed(() => {
    if (activeTool.value === 'polygon')
        return polygonDraft.value.length > 0;
    if (activeTool.value === 'line')
        return !!lineDraftFirstPoint.value;
    if (activeTool.value === 'rect')
        return rectDraft.isDrawing || !!rectDraft.start;
    return false;
});
/** 当前未完成草稿的提示文案。 */
const pendingDraftMessage = computed(() => {
    if (polygonDraft.value.length > 0) {
        return `存在未闭合多边形草稿，提交前必须先闭合或撤销。当前点数：${polygonDraft.value.length}`;
    }
    if (lineDraftFirstPoint.value) {
        return '存在未完成线段草稿，提交前必须先完成或撤销。';
    }
    if (rectDraft.isDrawing || rectDraft.start) {
        return '存在未完成矩形草稿，提交前必须先完成或撤销。';
    }
    return '';
});
/** 编辑中的图形对象。 */
const editingShape = computed(() => {
    return shapes.value.find((item) => item.id === editingShapeId.value);
});
/** 右侧工具按钮列表。 */
const toolActions = computed(() => {
    const commonDisabled = props.disabled || props.readonly;
    return [
        {
            key: 'line',
            label: '线段工具',
            description: '点击两次落点生成一条线段。',
            disabled: commonDisabled,
            active: activeTool.value === 'line',
            onClick: () => setActiveTool('line'),
        },
        {
            key: 'rect',
            label: '矩形工具',
            description: '按下并拖拽生成矩形区域。',
            disabled: commonDisabled,
            active: activeTool.value === 'rect',
            onClick: () => setActiveTool('rect'),
        },
        {
            key: 'polygon',
            label: '多边形工具',
            description: '连续点击落点，点击起点或按 Enter 完成闭合。',
            disabled: commonDisabled,
            active: activeTool.value === 'polygon',
            onClick: () => setActiveTool('polygon'),
        },
    ];
});
/** 右侧命令按钮列表。 */
const commandActions = computed(() => {
    const commonDisabled = props.disabled || props.readonly;
    return [
        {
            key: 'edit',
            label: '编辑选中',
            description: '选中一个已绘制图形后，点击进入点位编辑模式，也可以通过双击图形进入编辑模式。',
            disabled: commonDisabled || !selectedShapeId.value,
            onClick: enterSelectedShapeEditMode,
        },
        {
            key: 'finish',
            label: '完成多边形',
            description: '当多边形已经有至少 3 个点时，手动执行闭合，也可以通过点击起点或按 Enter 键完成闭合。',
            disabled: commonDisabled || !canFinishPolygon.value,
            onClick: finishPolygon,
        },
        {
            key: 'undo',
            label: '撤销草稿',
            description: '撤销当前未完成绘制中的最后一步，也可以通过按 Esc 键触发。',
            disabled: commonDisabled || !canUndoDraft.value,
            onClick: undoCurrentDraft,
        },
        {
            key: 'delete',
            label: '删除选中',
            description: '删除当前选中的图形。',
            disabled: commonDisabled || !selectedShapeId.value,
            danger: true,
            onClick: removeSelectedShape,
        },
        {
            key: 'clear',
            label: '清空全部',
            description: '清空当前组件中的所有标注图形。',
            disabled: commonDisabled || shapes.value.length === 0,
            danger: true,
            onClick: clearAllShapes,
        },
    ];
});
/** 多边形草稿的可点击闭合点。 */
const polygonDraftHandles = computed(() => {
    return polygonDraft.value.map((point, index) => {
        const displayPoint = originalToDisplayPoint(point);
        const isStartPoint = index === 0;
        const canClose = isStartPoint && canClosePolygonByStartPoint.value;
        return {
            id: `polygon-draft-${index}`,
            index,
            x: displayPoint.x,
            y: displayPoint.y,
            radius: canClose ? 7 : 4,
            fill: canClose ? elementColors.value.warning : elementColors.value.warningDark,
            stroke: elementColors.value.bg,
            strokeWidth: canClose ? 2 : 1,
            listening: canClose,
        };
    });
});
/** 当前编辑模式下的顶点手柄列表。 */
const editableHandles = computed(() => {
    const shape = editingShape.value;
    if (!shape)
        return [];
    if (shape.type === 'line') {
        return shape.point.map((point, pointIndex) => {
            const displayPoint = originalToDisplayPoint(point);
            return {
                id: `${shape.id}-line-${pointIndex}`,
                shapeId: shape.id,
                kind: 'line-point',
                pointIndex,
                x: displayPoint.x,
                y: displayPoint.y,
                radius: 7,
                fill: elementColors.value.bg,
                stroke: elementColors.value.primary,
                strokeWidth: 2,
                draggable: !props.disabled && !props.readonly,
            };
        });
    }
    if (shape.type === 'polygon') {
        return shape.point.map((point, pointIndex) => {
            const displayPoint = originalToDisplayPoint(point);
            return {
                id: `${shape.id}-polygon-${pointIndex}`,
                shapeId: shape.id,
                kind: 'polygon-point',
                pointIndex,
                x: displayPoint.x,
                y: displayPoint.y,
                radius: 7,
                fill: elementColors.value.bg,
                stroke: elementColors.value.warning,
                strokeWidth: 2,
                draggable: !props.disabled && !props.readonly,
            };
        });
    }
    const rectBox = getRectBox(shape.point);
    const corners = [
        { corner: 'top-left', point: { x: rectBox.left, y: rectBox.top } },
        { corner: 'top-right', point: { x: rectBox.right, y: rectBox.top } },
        { corner: 'bottom-right', point: { x: rectBox.right, y: rectBox.bottom } },
        { corner: 'bottom-left', point: { x: rectBox.left, y: rectBox.bottom } },
    ];
    return corners.map((item) => {
        const displayPoint = originalToDisplayPoint(item.point);
        return {
            id: `${shape.id}-${item.corner}`,
            shapeId: shape.id,
            kind: 'rect-corner',
            corner: item.corner,
            x: displayPoint.x,
            y: displayPoint.y,
            radius: 7,
            fill: elementColors.value.bg,
            stroke: elementColors.value.success,
            strokeWidth: 2,
            draggable: !props.disabled && !props.readonly,
        };
    });
});
/** 线段绘制预览。 */
const linePreviewConfig = computed(() => {
    if (!lineDraftFirstPoint.value)
        return null;
    const start = originalToDisplayPoint(lineDraftFirstPoint.value);
    const end = originalToDisplayPoint(currentPointer.value || lineDraftFirstPoint.value);
    return {
        points: [start.x, start.y, end.x, end.y],
        stroke: elementColors.value.primary,
        strokeWidth: 2,
        dash: [8, 6],
        lineCap: 'round',
        lineJoin: 'round',
        listening: false,
    };
});
/** 矩形绘制预览。 */
const rectPreviewConfig = computed(() => {
    if (!rectDraft.start || !rectDraft.current)
        return null;
    const start = originalToDisplayPoint(rectDraft.start);
    const current = originalToDisplayPoint(rectDraft.current);
    return {
        x: Math.min(start.x, current.x),
        y: Math.min(start.y, current.y),
        width: Math.abs(current.x - start.x),
        height: Math.abs(current.y - start.y),
        stroke: elementColors.value.success,
        strokeWidth: 2,
        dash: [8, 6],
        fill: shapeColorMap.value.rect.fillPreview,
        listening: false,
    };
});
/** 多边形绘制预览。 */
const polygonPreviewConfig = computed(() => {
    if (!polygonDraft.value.length)
        return null;
    const previewPoints = [...polygonDraft.value];
    if (currentPointer.value)
        previewPoints.push(currentPointer.value);
    return {
        points: convertPointsToDisplayArray(previewPoints),
        stroke: elementColors.value.warning,
        strokeWidth: 2,
        dash: currentPointer.value ? [8, 6] : undefined,
        lineCap: 'round',
        lineJoin: 'round',
        closed: false,
        listening: false,
    };
});
/** 监听组件尺寸变化，以便重新计算图片绘制区域。 */
useResizeObserver(stageWrapperRef, (entries) => {
    const rect = entries[0]?.contentRect;
    if (!rect)
        return;
    wrapperSize.width = rect.width;
    wrapperSize.height = rect.height;
});
/** 监听外部的 v-model 变化并同步到内部 shapes。 */
watch(modelValue, (value) => {
    if (syncingModelFromInner.value) {
        syncingModelFromInner.value = false;
        return;
    }
    syncShapesFromModel(value || []);
}, { deep: true, immediate: true });
/** 监听图片地址变化并重新加载图片。 */
watch(() => props.imageSrc, async (value) => {
    await loadImageFromProp(value);
}, { immediate: true });
/** 切换工具时清空当前草稿，避免跨工具遗留状态。 */
watch(activeTool, () => {
    clearDraftState();
    editingShapeId.value = undefined;
});
/** 选中图形和编辑模式变化时，刷新 Transformer 绑定。 */
watch([selectedShapeId, editingShapeId, shapes], async () => {
    await nextTick();
    updateTransformer();
}, { deep: true });
/** 监听键盘快捷键，支持 Enter 完成多边形、Esc 撤销草稿或退出编辑。 */
useEventListener(window, 'keydown', (event) => {
    const target = event.target;
    const tagName = target?.tagName;
    const isEditableTarget = tagName === 'INPUT' || tagName === 'TEXTAREA' || target?.isContentEditable === true;
    if (isEditableTarget)
        return;
    if (event.key === 'Enter') {
        if (canFinishPolygon.value) {
            event.preventDefault();
            finishPolygon();
        }
        return;
    }
    if (event.key !== 'Escape')
        return;
    if (editingShapeId.value) {
        editingShapeId.value = undefined;
        return;
    }
    if (canUndoDraft.value) {
        undoCurrentDraft();
    }
});
/** 切换当前工具。 */
function setActiveTool(tool) {
    if (props.disabled || props.readonly)
        return;
    activeTool.value = tool;
}
/** 从外部图片地址加载原图。 */
async function loadImageFromProp(src) {
    if (!src) {
        imageElement.value = undefined;
        imageMeta.width = 0;
        imageMeta.height = 0;
        return;
    }
    try {
        const image = await loadImage(src);
        imageElement.value = image;
        imageMeta.width = image.naturalWidth || image.width;
        imageMeta.height = image.naturalHeight || image.height;
    }
    catch {
        imageElement.value = undefined;
        imageMeta.width = 0;
        imageMeta.height = 0;
        ElMessage.error('图片加载失败，请检查外部传入的 imageSrc');
    }
}
/** 处理画布按下事件，根据当前工具进入不同绘制分支。 */
function handleStagePointerDown(event) {
    if (props.disabled || props.readonly)
        return;
    const stage = stageRef.value?.getNode?.();
    if (event?.target !== stage)
        return;
    if (editingShapeId.value) {
        editingShapeId.value = undefined;
        selectedShapeId.value = undefined;
        return;
    }
    selectedShapeId.value = undefined;
    editingShapeId.value = undefined;
    const point = getCurrentOriginalPointer(false);
    if (!point || !imageElement.value)
        return;
    if (activeTool.value === 'line') {
        if (!lineDraftFirstPoint.value) {
            lineDraftFirstPoint.value = point;
            currentPointer.value = point;
            return;
        }
        if (!hasEnoughDistance(lineDraftFirstPoint.value, point))
            return;
        appendShape({
            type: 'line',
            point: [lineDraftFirstPoint.value, point],
        });
        lineDraftFirstPoint.value = null;
        currentPointer.value = undefined;
        return;
    }
    if (activeTool.value === 'polygon') {
        polygonDraft.value = [...polygonDraft.value, point];
        currentPointer.value = point;
        return;
    }
    rectDraft.isDrawing = true;
    rectDraft.start = point;
    rectDraft.current = point;
}
/** 处理画布移动事件，用于更新草稿预览。 */
function handleStagePointerMove() {
    const point = getCurrentOriginalPointer(false);
    currentPointer.value = point || undefined;
    if (!point)
        return;
    if (!rectDraft.isDrawing)
        return;
    rectDraft.current = point;
}
/** 处理画布抬起事件，用于完成矩形绘制。 */
function handleStagePointerUp() {
    if (!rectDraft.isDrawing || !rectDraft.start || !rectDraft.current) {
        resetRectDraft();
        return;
    }
    if (!hasEnoughDistance(rectDraft.start, rectDraft.current)) {
        resetRectDraft();
        return;
    }
    const rectBox = getRectBox([rectDraft.start, rectDraft.current]);
    appendShape({
        type: 'rect',
        point: [
            { x: rectBox.left, y: rectBox.top },
            { x: rectBox.right, y: rectBox.bottom },
        ],
    });
    resetRectDraft();
}
/** 鼠标离开画布时结束当前矩形草稿。 */
function handleStagePointerLeave() {
    currentPointer.value = undefined;
    if (rectDraft.isDrawing) {
        handleStagePointerUp();
    }
}
/** 点击多边形草稿起点时尝试闭合多边形。 */
function handlePolygonDraftHandleClick(handle) {
    if (handle.index !== 0)
        return;
    if (!canClosePolygonByStartPoint.value)
        return;
    finishPolygon();
}
/** 完成多边形闭合并写回图形列表。 */
function finishPolygon() {
    if (props.disabled || props.readonly)
        return;
    if (polygonDraft.value.length < 3) {
        ElMessage.warning('多边形至少需要 3 个点');
        return;
    }
    appendShape({
        type: 'polygon',
        point: [...polygonDraft.value],
    });
    polygonDraft.value = [];
    currentPointer.value = undefined;
}
/** 撤销当前工具对应的草稿步骤。 */
function undoCurrentDraft() {
    if (activeTool.value === 'polygon') {
        polygonDraft.value = polygonDraft.value.slice(0, -1);
        return;
    }
    if (activeTool.value === 'line') {
        lineDraftFirstPoint.value = null;
        currentPointer.value = undefined;
        return;
    }
    resetRectDraft();
}
/** 点击图形时切换选中态。 */
function handleShapeClick(shapeId) {
    selectedShapeId.value = shapeId;
}
/** 双击图形时进入点位编辑模式。 */
function handleShapeDoubleClick(shapeId) {
    if (props.disabled || props.readonly)
        return;
    selectedShapeId.value = shapeId;
    editingShapeId.value = shapeId;
}
/** 通过按钮进入当前选中图形的点位编辑模式。 */
function enterSelectedShapeEditMode() {
    if (!selectedShapeId.value)
        return;
    handleShapeDoubleClick(selectedShapeId.value);
}
/** 拖拽开始时同步选中图形。 */
function handleShapeDragStart(shapeId) {
    selectedShapeId.value = shapeId;
}
/** 处理线段拖拽中的临时偏移，使可见线实时跟手。 */
function handleLineDragMove(event, shapeId) {
    const target = event?.target;
    if (!target)
        return;
    lineDragOffsetMap.value = {
        ...lineDragOffsetMap.value,
        [shapeId]: {
            x: target.x(),
            y: target.y(),
        },
    };
}
/** 处理图形整体拖拽结束，将显示坐标换算回原图像素坐标。 */
function handleShapeDragEnd(event, shape) {
    const nextPoints = getDraggedShapePoints(event, shape);
    if (!nextPoints)
        return;
    updateShapePoints(shape.id, nextPoints);
    if (shape.type === 'line') {
        const rest = { ...lineDragOffsetMap.value };
        delete rest[shape.id];
        lineDragOffsetMap.value = rest;
    }
}
/** 处理编辑手柄拖拽，按图形类型更新具体点位。 */
function handleEditHandleDrag(event, handle) {
    const target = event?.target;
    if (!target)
        return;
    const nextPoint = displayToOriginalPoint({ x: target.x(), y: target.y() }, true);
    if (!nextPoint)
        return;
    const shape = shapes.value.find((item) => item.id === handle.shapeId);
    if (!shape)
        return;
    if (handle.kind === 'line-point' || handle.kind === 'polygon-point') {
        if (handle.pointIndex === undefined)
            return;
        updateShapePoints(shape.id, shape.point.map((point, index) => {
            return index === handle.pointIndex ? nextPoint : point;
        }));
        return;
    }
    updateRectCorner(shape.id, handle.corner, nextPoint);
}
/** 构造可见线段的配置。 */
function getLineConfig(shape, selected) {
    const offset = getLineDragOffset(shape.id);
    const palette = shapeColorMap.value.line;
    return {
        id: shape.id,
        points: convertPointsToDisplayArray(shape.point),
        x: offset.x,
        y: offset.y,
        stroke: selected ? palette.strokeActive : palette.stroke,
        strokeWidth: selected ? 4 : 3,
        lineCap: 'round',
        lineJoin: 'round',
        listening: false,
    };
}
/** 构造线段热区的配置，用于稳定点击和拖拽命中。 */
function getLineHitConfig(shape) {
    const offset = getLineDragOffset(shape.id);
    return {
        id: getTransformerTargetId(shape),
        points: convertPointsToDisplayArray(shape.point),
        x: offset.x,
        y: offset.y,
        stroke: elementColors.value.primary,
        opacity: 0.01,
        strokeWidth: 20,
        hitStrokeWidth: 28,
        strokeHitEnabled: true,
        lineCap: 'round',
        lineJoin: 'round',
        draggable: isShapeMovable(shape.id),
    };
}
/** 构造矩形配置。 */
function getRectConfig(shape, selected) {
    const rectBox = getRectBox(shape.point);
    const topLeft = originalToDisplayPoint({ x: rectBox.left, y: rectBox.top });
    const bottomRight = originalToDisplayPoint({ x: rectBox.right, y: rectBox.bottom });
    const palette = shapeColorMap.value.rect;
    return {
        id: shape.id,
        x: topLeft.x,
        y: topLeft.y,
        width: Math.abs(bottomRight.x - topLeft.x),
        height: Math.abs(bottomRight.y - topLeft.y),
        stroke: selected ? palette.strokeActive : palette.stroke,
        strokeWidth: selected ? 3 : 2,
        fill: selected ? palette.fillActive : palette.fill,
        draggable: isShapeMovable(shape.id),
    };
}
/** 构造多边形配置。 */
function getPolygonConfig(shape, selected) {
    const palette = shapeColorMap.value.polygon;
    return {
        id: shape.id,
        points: convertPointsToDisplayArray(shape.point),
        x: 0,
        y: 0,
        stroke: selected ? palette.strokeActive : palette.stroke,
        strokeWidth: selected ? 3 : 2,
        fill: selected ? palette.fillActive : palette.fill,
        closed: true,
        lineCap: 'round',
        lineJoin: 'round',
        draggable: isShapeMovable(shape.id),
    };
}
/** 计算图形整体拖拽后的新点位。 */
function getDraggedShapePoints(event, shape) {
    const target = event?.target;
    if (!target)
        return null;
    if (shape.type === 'rect') {
        const rectBox = getRectBox(shape.point);
        const topLeftDisplay = originalToDisplayPoint({ x: rectBox.left, y: rectBox.top });
        const offsetX = target.x() - topLeftDisplay.x;
        const offsetY = target.y() - topLeftDisplay.y;
        return translateShapePoints(shape.point, offsetX, offsetY);
    }
    const offsetX = target.x();
    const offsetY = target.y();
    target.position({ x: 0, y: 0 });
    return translateShapePoints(shape.point, offsetX, offsetY);
}
/** 根据显示位移量平移图形点位，并做原图边界约束。 */
function translateShapePoints(points, offsetX, offsetY) {
    const deltaX = offsetX / renderMetrics.value.scale;
    const deltaY = offsetY / renderMetrics.value.scale;
    const constrainedDelta = constrainShapeDelta(points, deltaX, deltaY);
    return points.map((point) => ({
        x: roundCoordinate(point.x + constrainedDelta.x),
        y: roundCoordinate(point.y + constrainedDelta.y),
    }));
}
/** 对图形移动增量做边界限制，避免拖出原图。 */
function constrainShapeDelta(points, deltaX, deltaY) {
    const xValues = points.map((point) => point.x);
    const yValues = points.map((point) => point.y);
    const minX = Math.min(...xValues);
    const maxX = Math.max(...xValues);
    const minY = Math.min(...yValues);
    const maxY = Math.max(...yValues);
    return {
        x: Math.min(imageMeta.width - maxX, Math.max(-minX, deltaX)),
        y: Math.min(imageMeta.height - maxY, Math.max(-minY, deltaY)),
    };
}
/** 更新矩形某个角点，并继续输出为左上与右下两个点。 */
function updateRectCorner(shapeId, corner, nextPoint) {
    if (!corner)
        return;
    const shape = shapes.value.find((item) => item.id === shapeId);
    if (!shape)
        return;
    const rectBox = getRectBox(shape.point);
    let left = rectBox.left;
    let right = rectBox.right;
    let top = rectBox.top;
    let bottom = rectBox.bottom;
    if (corner === 'top-left') {
        left = nextPoint.x;
        top = nextPoint.y;
    }
    if (corner === 'top-right') {
        right = nextPoint.x;
        top = nextPoint.y;
    }
    if (corner === 'bottom-right') {
        right = nextPoint.x;
        bottom = nextPoint.y;
    }
    if (corner === 'bottom-left') {
        left = nextPoint.x;
        bottom = nextPoint.y;
    }
    const normalizedLeft = Math.min(left, right);
    const normalizedRight = Math.max(left, right);
    const normalizedTop = Math.min(top, bottom);
    const normalizedBottom = Math.max(top, bottom);
    updateShapePoints(shapeId, [
        { x: normalizedLeft, y: normalizedTop },
        { x: normalizedRight, y: normalizedBottom },
    ]);
}
/** 将当前 shapes 写回 v-model。 */
function emitModelValue() {
    syncingModelFromInner.value = true;
    modelValue.value = shapes.value.map((shape) => ({
        type: shape.type,
        point: shape.point.map((point) => ({
            x: roundCoordinate(point.x),
            y: roundCoordinate(point.y),
        })),
    }));
}
/** 从外部 v-model 同步内部 shapes。 */
function syncShapesFromModel(value) {
    shapes.value = (value || []).map((item) => ({
        id: createShapeId(),
        type: item.type,
        point: item.point.map((point) => ({
            x: roundCoordinate(point.x),
            y: roundCoordinate(point.y),
        })),
    }));
    selectedShapeId.value = undefined;
    editingShapeId.value = undefined;
    lineDragOffsetMap.value = {};
}
/** 新增一个图形并立即写回外部 v-model。 */
function appendShape(shape) {
    const nextShape = {
        id: createShapeId(),
        type: shape.type,
        point: shape.point.map((point) => ({
            x: roundCoordinate(point.x),
            y: roundCoordinate(point.y),
        })),
    };
    shapes.value = [...shapes.value, nextShape];
    selectedShapeId.value = nextShape.id;
    emitModelValue();
}
/** 更新指定图形的点位并同步外部数据。 */
function updateShapePoints(shapeId, nextPoints) {
    const shapeIndex = shapes.value.findIndex((shape) => shape.id === shapeId);
    if (shapeIndex < 0)
        return;
    const currentShape = shapes.value[shapeIndex];
    if (!currentShape)
        return;
    const nextShapes = [...shapes.value];
    nextShapes.splice(shapeIndex, 1, {
        ...currentShape,
        point: nextPoints.map((point) => ({
            x: roundCoordinate(clamp(point.x, 0, imageMeta.width)),
            y: roundCoordinate(clamp(point.y, 0, imageMeta.height)),
        })),
    });
    shapes.value = nextShapes;
    emitModelValue();
}
/** 删除当前选中的图形。 */
function removeSelectedShape() {
    if (!selectedShapeId.value)
        return;
    shapes.value = shapes.value.filter((shape) => shape.id !== selectedShapeId.value);
    if (editingShapeId.value === selectedShapeId.value) {
        editingShapeId.value = undefined;
    }
    selectedShapeId.value = undefined;
    emitModelValue();
}
/** 清空所有图形和草稿状态。 */
function clearAllShapes() {
    shapes.value = [];
    selectedShapeId.value = undefined;
    editingShapeId.value = undefined;
    lineDragOffsetMap.value = {};
    clearDraftState();
    emitModelValue();
}
/** 校验当前是否允许提交。 */
function validateBeforeSubmit() {
    if (!pendingDraftMessage.value)
        return true;
    ElMessage.warning(pendingDraftMessage.value);
    return false;
}
/** 对外返回当前可提交的数据。 */
function getOutputData() {
    if (!validateBeforeSubmit())
        return null;
    return modelValue.value;
}
/** 根据选中状态刷新 Transformer 绑定。 */
function updateTransformer() {
    const transformerNode = transformerRef.value?.getNode?.();
    if (!transformerNode)
        return;
    if (!selectedShapeId.value || editingShapeId.value) {
        transformerNode.nodes([]);
        transformerNode.getLayer()?.batchDraw();
        return;
    }
    const stage = transformerNode.getStage();
    const selectedNode = stage?.findOne?.(`#${getTransformerTargetIdByShapeId(selectedShapeId.value)}`);
    transformerNode.nodes(selectedNode ? [selectedNode] : []);
    transformerNode.getLayer()?.batchDraw();
}
/** 判断指定图形当前是否允许整体拖拽。 */
function isShapeMovable(shapeId) {
    return !props.disabled && !props.readonly && editingShapeId.value !== shapeId;
}
/** 获取线段实时拖拽偏移。 */
function getLineDragOffset(shapeId) {
    return lineDragOffsetMap.value[shapeId] || { x: 0, y: 0 };
}
/** 通过图形对象获取 Transformer 绑定目标 id。 */
function getTransformerTargetId(shape) {
    return shape.type === 'line' ? `${shape.id}__hit` : shape.id;
}
/** 通过图形 id 获取 Transformer 绑定目标 id。 */
function getTransformerTargetIdByShapeId(shapeId) {
    const shape = shapes.value.find((item) => item.id === shapeId);
    return shape ? getTransformerTargetId(shape) : shapeId;
}
/** 把原图点位转换为画布显示坐标。 */
function originalToDisplayPoint(point) {
    if (!point) {
        return { x: renderMetrics.value.offsetX, y: renderMetrics.value.offsetY };
    }
    return {
        x: renderMetrics.value.offsetX + point.x * renderMetrics.value.scale,
        y: renderMetrics.value.offsetY + point.y * renderMetrics.value.scale,
    };
}
/** 把画布显示坐标转换回原图坐标。 */
function displayToOriginalPoint(point, clampToImage) {
    if (!imageMeta.width || !imageMeta.height)
        return null;
    const x = (point.x - renderMetrics.value.offsetX) / renderMetrics.value.scale;
    const y = (point.y - renderMetrics.value.offsetY) / renderMetrics.value.scale;
    if (clampToImage) {
        return {
            x: roundCoordinate(clamp(x, 0, imageMeta.width)),
            y: roundCoordinate(clamp(y, 0, imageMeta.height)),
        };
    }
    if (x < 0 || y < 0 || x > imageMeta.width || y > imageMeta.height)
        return null;
    return {
        x: roundCoordinate(x),
        y: roundCoordinate(y),
    };
}
/** 获取当前鼠标在原图坐标系中的位置。 */
function getCurrentOriginalPointer(clampToImage) {
    const stage = stageRef.value?.getNode?.();
    const pointer = stage?.getPointerPosition?.();
    if (!pointer)
        return null;
    return displayToOriginalPoint(pointer, clampToImage);
}
/** 把点位数组转换为 Konva Line 所需的一维数组。 */
function convertPointsToDisplayArray(points) {
    return points.flatMap((point) => {
        const displayPoint = originalToDisplayPoint(point);
        return [displayPoint.x, displayPoint.y];
    });
}
/** 计算矩形的左上和右下边界。 */
function getRectBox(points) {
    const [firstPoint, secondPoint] = points;
    const left = Math.min(firstPoint?.x || 0, secondPoint?.x || 0);
    const right = Math.max(firstPoint?.x || 0, secondPoint?.x || 0);
    const top = Math.min(firstPoint?.y || 0, secondPoint?.y || 0);
    const bottom = Math.max(firstPoint?.y || 0, secondPoint?.y || 0);
    return {
        left,
        right,
        top,
        bottom,
    };
}
/** 判断两个点之间的距离是否足够形成有效图形。 */
function hasEnoughDistance(start, end) {
    return Math.hypot(end.x - start.x, end.y - start.y) > 6;
}
/** 清空所有绘制草稿状态。 */
function clearDraftState() {
    polygonDraft.value = [];
    lineDraftFirstPoint.value = null;
    currentPointer.value = undefined;
    resetRectDraft();
}
/** 重置矩形绘制草稿。 */
function resetRectDraft() {
    rectDraft.isDrawing = false;
    rectDraft.start = null;
    rectDraft.current = null;
}
/** 加载图片元素。 */
function loadImage(src) {
    return new Promise((resolve, reject) => {
        const image = new window.Image();
        image.crossOrigin = 'anonymous';
        image.onload = () => resolve(image);
        image.onerror = () => reject(new Error('load failed'));
        image.src = src;
    });
}
/** 生成内部图形 id。 */
function createShapeId() {
    return `annotation-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}
/** 坐标统一保留为整数像素。 */
function roundCoordinate(value) {
    return Math.round(value);
}
/** 数值边界裁剪。 */
function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
}
/** 对外暴露提交前校验与数据读取方法。 */
const __VLS_exposed = {
    validateBeforeSubmit,
    getOutputData,
};
defineExpose(__VLS_exposed);
let __VLS_modelEmit;
const __VLS_defaults = {
    loading: false,
    readonly: false,
    disabled: false,
    height: 600,
    minStageHeight: 600,
};
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
/** @type {__VLS_StyleScopedClasses['annotation-editor__action-info']} */ ;
/** @type {__VLS_StyleScopedClasses['annotation-editor']} */ ;
(__VLS_ctx.editorHeightCssValue);
// @ts-ignore
[editorHeightCssValue,];
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "annotation-editor" },
});
/** @type {__VLS_StyleScopedClasses['annotation-editor']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "annotation-editor__stage-panel" },
});
/** @type {__VLS_StyleScopedClasses['annotation-editor__stage-panel']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ref: "stageWrapperRef",
    ...{ class: "annotation-editor__stage-wrapper" },
});
/** @type {__VLS_StyleScopedClasses['annotation-editor__stage-wrapper']} */ ;
if (props.loading) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "annotation-editor__empty" },
    });
    /** @type {__VLS_StyleScopedClasses['annotation-editor__empty']} */ ;
    let __VLS_0;
    /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
    elIcon;
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
        ...{ class: "is-loading" },
    }));
    const __VLS_2 = __VLS_1({
        ...{ class: "is-loading" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_1));
    /** @type {__VLS_StyleScopedClasses['is-loading']} */ ;
    const { default: __VLS_5 } = __VLS_3.slots;
    let __VLS_6;
    /** @ts-ignore @type { | typeof __VLS_components.Loading} */
    Loading;
    // @ts-ignore
    const __VLS_7 = __VLS_asFunctionalComponent1(__VLS_6, new __VLS_6({}));
    const __VLS_8 = __VLS_7({}, ...__VLS_functionalComponentArgsRest(__VLS_7));
    var __VLS_3;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "annotation-editor__empty-title" },
    });
    /** @type {__VLS_StyleScopedClasses['annotation-editor__empty-title']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "annotation-editor__empty-desc" },
    });
    /** @type {__VLS_StyleScopedClasses['annotation-editor__empty-desc']} */ ;
}
else if (!__VLS_ctx.imageElement || !props.imageSrc) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "annotation-editor__empty" },
    });
    /** @type {__VLS_StyleScopedClasses['annotation-editor__empty']} */ ;
    let __VLS_11;
    /** @ts-ignore @type { | typeof __VLS_components.PhotoIcon} */
    PhotoIcon;
    // @ts-ignore
    const __VLS_12 = __VLS_asFunctionalComponent1(__VLS_11, new __VLS_11({
        ...{ class: "annotation-editor__empty-icon" },
    }));
    const __VLS_13 = __VLS_12({
        ...{ class: "annotation-editor__empty-icon" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_12));
    /** @type {__VLS_StyleScopedClasses['annotation-editor__empty-icon']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "annotation-editor__empty-title" },
    });
    /** @type {__VLS_StyleScopedClasses['annotation-editor__empty-title']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "annotation-editor__empty-desc" },
    });
    /** @type {__VLS_StyleScopedClasses['annotation-editor__empty-desc']} */ ;
}
else {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "annotation-editor__stage-center" },
    });
    /** @type {__VLS_StyleScopedClasses['annotation-editor__stage-center']} */ ;
    let __VLS_16;
    /** @ts-ignore @type { | typeof __VLS_components.vStage | typeof __VLS_components.VStage | typeof __VLS_components['v-stage'] | typeof __VLS_components.vStage | typeof __VLS_components.VStage | typeof __VLS_components['v-stage']} */
    vStage;
    // @ts-ignore
    const __VLS_17 = __VLS_asFunctionalComponent1(__VLS_16, new __VLS_16({
        ...{ 'onMousedown': {} },
        ...{ 'onMousemove': {} },
        ...{ 'onMouseup': {} },
        ...{ 'onMouseleave': {} },
        ref: "stageRef",
        config: (__VLS_ctx.stageConfig),
    }));
    const __VLS_18 = __VLS_17({
        ...{ 'onMousedown': {} },
        ...{ 'onMousemove': {} },
        ...{ 'onMouseup': {} },
        ...{ 'onMouseleave': {} },
        ref: "stageRef",
        config: (__VLS_ctx.stageConfig),
    }, ...__VLS_functionalComponentArgsRest(__VLS_17));
    let __VLS_21;
    const __VLS_22 = {
        ...{ mousedown: {} },
        onMousedown: (__VLS_ctx.handleStagePointerDown),
        ...{ mousemove: {} },
        onMousemove: (__VLS_ctx.handleStagePointerMove),
        ...{ mouseup: {} },
        onMouseup: (__VLS_ctx.handleStagePointerUp),
        ...{ mouseleave: {} },
        onMouseleave: (__VLS_ctx.handleStagePointerLeave),
    };
    var __VLS_23;
    const { default: __VLS_25 } = __VLS_19.slots;
    let __VLS_26;
    /** @ts-ignore @type { | typeof __VLS_components.vLayer | typeof __VLS_components.VLayer | typeof __VLS_components['v-layer'] | typeof __VLS_components.vLayer | typeof __VLS_components.VLayer | typeof __VLS_components['v-layer']} */
    vLayer;
    // @ts-ignore
    const __VLS_27 = __VLS_asFunctionalComponent1(__VLS_26, new __VLS_26({}));
    const __VLS_28 = __VLS_27({}, ...__VLS_functionalComponentArgsRest(__VLS_27));
    const { default: __VLS_31 } = __VLS_29.slots;
    let __VLS_32;
    /** @ts-ignore @type { | typeof __VLS_components.vImage | typeof __VLS_components.VImage | typeof __VLS_components['v-image']} */
    vImage;
    // @ts-ignore
    const __VLS_33 = __VLS_asFunctionalComponent1(__VLS_32, new __VLS_32({
        config: (__VLS_ctx.imageConfig),
    }));
    const __VLS_34 = __VLS_33({
        config: (__VLS_ctx.imageConfig),
    }, ...__VLS_functionalComponentArgsRest(__VLS_33));
    for (const [shape] of __VLS_vFor((__VLS_ctx.shapes))) {
        __VLS_asFunctionalElement(__VLS_intrinsics.template)({
            key: (shape.id),
        });
        if (shape.type === 'line') {
            let __VLS_37;
            /** @ts-ignore @type { | typeof __VLS_components.vLine | typeof __VLS_components.VLine | typeof __VLS_components['v-line']} */
            vLine;
            // @ts-ignore
            const __VLS_38 = __VLS_asFunctionalComponent1(__VLS_37, new __VLS_37({
                ...{ 'onClick': {} },
                ...{ 'onDblclick': {} },
                ...{ 'onDragstart': {} },
                ...{ 'onDragmove': {} },
                ...{ 'onDragend': {} },
                config: (__VLS_ctx.getLineHitConfig(shape)),
            }));
            const __VLS_39 = __VLS_38({
                ...{ 'onClick': {} },
                ...{ 'onDblclick': {} },
                ...{ 'onDragstart': {} },
                ...{ 'onDragmove': {} },
                ...{ 'onDragend': {} },
                config: (__VLS_ctx.getLineHitConfig(shape)),
            }, ...__VLS_functionalComponentArgsRest(__VLS_38));
            let __VLS_42;
            const __VLS_43 = {
                ...{ click: {} },
                onClick: (...[$event]) => {
                    if (!!(props.loading))
                        return;
                    if (!!(!__VLS_ctx.imageElement || !props.imageSrc))
                        return;
                    if (!(shape.type === 'line'))
                        return;
                    __VLS_ctx.handleShapeClick(shape.id);
                    // @ts-ignore
                    [imageElement, stageConfig, handleStagePointerDown, handleStagePointerMove, handleStagePointerUp, handleStagePointerLeave, imageConfig, shapes, getLineHitConfig, handleShapeClick,];
                },
                ...{ dblclick: {} },
                onDblclick: (...[$event]) => {
                    if (!!(props.loading))
                        return;
                    if (!!(!__VLS_ctx.imageElement || !props.imageSrc))
                        return;
                    if (!(shape.type === 'line'))
                        return;
                    __VLS_ctx.handleShapeDoubleClick(shape.id);
                    // @ts-ignore
                    [handleShapeDoubleClick,];
                },
                ...{ dragstart: {} },
                onDragstart: (...[$event]) => {
                    if (!!(props.loading))
                        return;
                    if (!!(!__VLS_ctx.imageElement || !props.imageSrc))
                        return;
                    if (!(shape.type === 'line'))
                        return;
                    __VLS_ctx.handleShapeDragStart(shape.id);
                    // @ts-ignore
                    [handleShapeDragStart,];
                },
                ...{ dragmove: {} },
                onDragmove: (...[$event]) => {
                    if (!!(props.loading))
                        return;
                    if (!!(!__VLS_ctx.imageElement || !props.imageSrc))
                        return;
                    if (!(shape.type === 'line'))
                        return;
                    __VLS_ctx.handleLineDragMove($event, shape.id);
                    // @ts-ignore
                    [handleLineDragMove,];
                },
                ...{ dragend: {} },
                onDragend: (...[$event]) => {
                    if (!!(props.loading))
                        return;
                    if (!!(!__VLS_ctx.imageElement || !props.imageSrc))
                        return;
                    if (!(shape.type === 'line'))
                        return;
                    __VLS_ctx.handleShapeDragEnd($event, shape);
                    // @ts-ignore
                    [handleShapeDragEnd,];
                },
            };
            var __VLS_40;
            var __VLS_41;
            let __VLS_44;
            /** @ts-ignore @type { | typeof __VLS_components.vLine | typeof __VLS_components.VLine | typeof __VLS_components['v-line']} */
            vLine;
            // @ts-ignore
            const __VLS_45 = __VLS_asFunctionalComponent1(__VLS_44, new __VLS_44({
                config: (__VLS_ctx.getLineConfig(shape, shape.id === __VLS_ctx.selectedShapeId)),
            }));
            const __VLS_46 = __VLS_45({
                config: (__VLS_ctx.getLineConfig(shape, shape.id === __VLS_ctx.selectedShapeId)),
            }, ...__VLS_functionalComponentArgsRest(__VLS_45));
        }
        else if (shape.type === 'rect') {
            let __VLS_49;
            /** @ts-ignore @type { | typeof __VLS_components.vRect | typeof __VLS_components.VRect | typeof __VLS_components['v-rect']} */
            vRect;
            // @ts-ignore
            const __VLS_50 = __VLS_asFunctionalComponent1(__VLS_49, new __VLS_49({
                ...{ 'onClick': {} },
                ...{ 'onDblclick': {} },
                ...{ 'onDragstart': {} },
                ...{ 'onDragend': {} },
                config: (__VLS_ctx.getRectConfig(shape, shape.id === __VLS_ctx.selectedShapeId)),
            }));
            const __VLS_51 = __VLS_50({
                ...{ 'onClick': {} },
                ...{ 'onDblclick': {} },
                ...{ 'onDragstart': {} },
                ...{ 'onDragend': {} },
                config: (__VLS_ctx.getRectConfig(shape, shape.id === __VLS_ctx.selectedShapeId)),
            }, ...__VLS_functionalComponentArgsRest(__VLS_50));
            let __VLS_54;
            const __VLS_55 = {
                ...{ click: {} },
                onClick: (...[$event]) => {
                    if (!!(props.loading))
                        return;
                    if (!!(!__VLS_ctx.imageElement || !props.imageSrc))
                        return;
                    if (!!(shape.type === 'line'))
                        return;
                    if (!(shape.type === 'rect'))
                        return;
                    __VLS_ctx.handleShapeClick(shape.id);
                    // @ts-ignore
                    [handleShapeClick, getLineConfig, selectedShapeId, selectedShapeId, getRectConfig,];
                },
                ...{ dblclick: {} },
                onDblclick: (...[$event]) => {
                    if (!!(props.loading))
                        return;
                    if (!!(!__VLS_ctx.imageElement || !props.imageSrc))
                        return;
                    if (!!(shape.type === 'line'))
                        return;
                    if (!(shape.type === 'rect'))
                        return;
                    __VLS_ctx.handleShapeDoubleClick(shape.id);
                    // @ts-ignore
                    [handleShapeDoubleClick,];
                },
                ...{ dragstart: {} },
                onDragstart: (...[$event]) => {
                    if (!!(props.loading))
                        return;
                    if (!!(!__VLS_ctx.imageElement || !props.imageSrc))
                        return;
                    if (!!(shape.type === 'line'))
                        return;
                    if (!(shape.type === 'rect'))
                        return;
                    __VLS_ctx.handleShapeDragStart(shape.id);
                    // @ts-ignore
                    [handleShapeDragStart,];
                },
                ...{ dragend: {} },
                onDragend: (...[$event]) => {
                    if (!!(props.loading))
                        return;
                    if (!!(!__VLS_ctx.imageElement || !props.imageSrc))
                        return;
                    if (!!(shape.type === 'line'))
                        return;
                    if (!(shape.type === 'rect'))
                        return;
                    __VLS_ctx.handleShapeDragEnd($event, shape);
                    // @ts-ignore
                    [handleShapeDragEnd,];
                },
            };
            var __VLS_52;
            var __VLS_53;
        }
        else {
            let __VLS_56;
            /** @ts-ignore @type { | typeof __VLS_components.vLine | typeof __VLS_components.VLine | typeof __VLS_components['v-line']} */
            vLine;
            // @ts-ignore
            const __VLS_57 = __VLS_asFunctionalComponent1(__VLS_56, new __VLS_56({
                ...{ 'onClick': {} },
                ...{ 'onDblclick': {} },
                ...{ 'onDragstart': {} },
                ...{ 'onDragend': {} },
                config: (__VLS_ctx.getPolygonConfig(shape, shape.id === __VLS_ctx.selectedShapeId)),
            }));
            const __VLS_58 = __VLS_57({
                ...{ 'onClick': {} },
                ...{ 'onDblclick': {} },
                ...{ 'onDragstart': {} },
                ...{ 'onDragend': {} },
                config: (__VLS_ctx.getPolygonConfig(shape, shape.id === __VLS_ctx.selectedShapeId)),
            }, ...__VLS_functionalComponentArgsRest(__VLS_57));
            let __VLS_61;
            const __VLS_62 = {
                ...{ click: {} },
                onClick: (...[$event]) => {
                    if (!!(props.loading))
                        return;
                    if (!!(!__VLS_ctx.imageElement || !props.imageSrc))
                        return;
                    if (!!(shape.type === 'line'))
                        return;
                    if (!!(shape.type === 'rect'))
                        return;
                    __VLS_ctx.handleShapeClick(shape.id);
                    // @ts-ignore
                    [handleShapeClick, selectedShapeId, getPolygonConfig,];
                },
                ...{ dblclick: {} },
                onDblclick: (...[$event]) => {
                    if (!!(props.loading))
                        return;
                    if (!!(!__VLS_ctx.imageElement || !props.imageSrc))
                        return;
                    if (!!(shape.type === 'line'))
                        return;
                    if (!!(shape.type === 'rect'))
                        return;
                    __VLS_ctx.handleShapeDoubleClick(shape.id);
                    // @ts-ignore
                    [handleShapeDoubleClick,];
                },
                ...{ dragstart: {} },
                onDragstart: (...[$event]) => {
                    if (!!(props.loading))
                        return;
                    if (!!(!__VLS_ctx.imageElement || !props.imageSrc))
                        return;
                    if (!!(shape.type === 'line'))
                        return;
                    if (!!(shape.type === 'rect'))
                        return;
                    __VLS_ctx.handleShapeDragStart(shape.id);
                    // @ts-ignore
                    [handleShapeDragStart,];
                },
                ...{ dragend: {} },
                onDragend: (...[$event]) => {
                    if (!!(props.loading))
                        return;
                    if (!!(!__VLS_ctx.imageElement || !props.imageSrc))
                        return;
                    if (!!(shape.type === 'line'))
                        return;
                    if (!!(shape.type === 'rect'))
                        return;
                    __VLS_ctx.handleShapeDragEnd($event, shape);
                    // @ts-ignore
                    [handleShapeDragEnd,];
                },
            };
            var __VLS_59;
            var __VLS_60;
        }
        // @ts-ignore
        [];
    }
    if (__VLS_ctx.linePreviewConfig) {
        let __VLS_63;
        /** @ts-ignore @type { | typeof __VLS_components.vLine | typeof __VLS_components.VLine | typeof __VLS_components['v-line']} */
        vLine;
        // @ts-ignore
        const __VLS_64 = __VLS_asFunctionalComponent1(__VLS_63, new __VLS_63({
            config: (__VLS_ctx.linePreviewConfig),
        }));
        const __VLS_65 = __VLS_64({
            config: (__VLS_ctx.linePreviewConfig),
        }, ...__VLS_functionalComponentArgsRest(__VLS_64));
    }
    if (__VLS_ctx.rectPreviewConfig) {
        let __VLS_68;
        /** @ts-ignore @type { | typeof __VLS_components.vRect | typeof __VLS_components.VRect | typeof __VLS_components['v-rect']} */
        vRect;
        // @ts-ignore
        const __VLS_69 = __VLS_asFunctionalComponent1(__VLS_68, new __VLS_68({
            config: (__VLS_ctx.rectPreviewConfig),
        }));
        const __VLS_70 = __VLS_69({
            config: (__VLS_ctx.rectPreviewConfig),
        }, ...__VLS_functionalComponentArgsRest(__VLS_69));
    }
    if (__VLS_ctx.polygonPreviewConfig) {
        let __VLS_73;
        /** @ts-ignore @type { | typeof __VLS_components.vLine | typeof __VLS_components.VLine | typeof __VLS_components['v-line']} */
        vLine;
        // @ts-ignore
        const __VLS_74 = __VLS_asFunctionalComponent1(__VLS_73, new __VLS_73({
            config: (__VLS_ctx.polygonPreviewConfig),
        }));
        const __VLS_75 = __VLS_74({
            config: (__VLS_ctx.polygonPreviewConfig),
        }, ...__VLS_functionalComponentArgsRest(__VLS_74));
    }
    for (const [draftHandle] of __VLS_vFor((__VLS_ctx.polygonDraftHandles))) {
        let __VLS_78;
        /** @ts-ignore @type { | typeof __VLS_components.vCircle | typeof __VLS_components.VCircle | typeof __VLS_components['v-circle']} */
        vCircle;
        // @ts-ignore
        const __VLS_79 = __VLS_asFunctionalComponent1(__VLS_78, new __VLS_78({
            ...{ 'onClick': {} },
            key: (draftHandle.id),
            config: (draftHandle),
        }));
        const __VLS_80 = __VLS_79({
            ...{ 'onClick': {} },
            key: (draftHandle.id),
            config: (draftHandle),
        }, ...__VLS_functionalComponentArgsRest(__VLS_79));
        let __VLS_83;
        const __VLS_84 = {
            ...{ click: {} },
            onClick: (...[$event]) => {
                if (!!(props.loading))
                    return;
                if (!!(!__VLS_ctx.imageElement || !props.imageSrc))
                    return;
                __VLS_ctx.handlePolygonDraftHandleClick(draftHandle);
                // @ts-ignore
                [linePreviewConfig, linePreviewConfig, rectPreviewConfig, rectPreviewConfig, polygonPreviewConfig, polygonPreviewConfig, polygonDraftHandles, handlePolygonDraftHandleClick,];
            },
        };
        var __VLS_81;
        var __VLS_82;
        // @ts-ignore
        [];
    }
    for (const [editHandle] of __VLS_vFor((__VLS_ctx.editableHandles))) {
        let __VLS_85;
        /** @ts-ignore @type { | typeof __VLS_components.vCircle | typeof __VLS_components.VCircle | typeof __VLS_components['v-circle']} */
        vCircle;
        // @ts-ignore
        const __VLS_86 = __VLS_asFunctionalComponent1(__VLS_85, new __VLS_85({
            ...{ 'onDragmove': {} },
            ...{ 'onDragend': {} },
            key: (editHandle.id),
            config: (editHandle),
        }));
        const __VLS_87 = __VLS_86({
            ...{ 'onDragmove': {} },
            ...{ 'onDragend': {} },
            key: (editHandle.id),
            config: (editHandle),
        }, ...__VLS_functionalComponentArgsRest(__VLS_86));
        let __VLS_90;
        const __VLS_91 = {
            ...{ dragmove: {} },
            onDragmove: (...[$event]) => {
                if (!!(props.loading))
                    return;
                if (!!(!__VLS_ctx.imageElement || !props.imageSrc))
                    return;
                __VLS_ctx.handleEditHandleDrag($event, editHandle);
                // @ts-ignore
                [editableHandles, handleEditHandleDrag,];
            },
            ...{ dragend: {} },
            onDragend: (...[$event]) => {
                if (!!(props.loading))
                    return;
                if (!!(!__VLS_ctx.imageElement || !props.imageSrc))
                    return;
                __VLS_ctx.handleEditHandleDrag($event, editHandle);
                // @ts-ignore
                [handleEditHandleDrag,];
            },
        };
        var __VLS_88;
        var __VLS_89;
        // @ts-ignore
        [];
    }
    let __VLS_92;
    /** @ts-ignore @type { | typeof __VLS_components.vTransformer | typeof __VLS_components.VTransformer | typeof __VLS_components['v-transformer']} */
    vTransformer;
    // @ts-ignore
    const __VLS_93 = __VLS_asFunctionalComponent1(__VLS_92, new __VLS_92({
        ref: "transformerRef",
        config: (__VLS_ctx.transformerConfig),
    }));
    const __VLS_94 = __VLS_93({
        ref: "transformerRef",
        config: (__VLS_ctx.transformerConfig),
    }, ...__VLS_functionalComponentArgsRest(__VLS_93));
    var __VLS_97;
    var __VLS_95;
    // @ts-ignore
    [transformerConfig,];
    var __VLS_29;
    // @ts-ignore
    [];
    var __VLS_19;
    var __VLS_20;
}
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "annotation-editor__action-panel" },
});
/** @type {__VLS_StyleScopedClasses['annotation-editor__action-panel']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "annotation-editor__action-group" },
});
/** @type {__VLS_StyleScopedClasses['annotation-editor__action-group']} */ ;
for (const [action] of __VLS_vFor((__VLS_ctx.toolActions))) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        key: (action.key),
        ...{ class: "annotation-editor__action-row" },
    });
    /** @type {__VLS_StyleScopedClasses['annotation-editor__action-row']} */ ;
    let __VLS_99;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_100 = __VLS_asFunctionalComponent1(__VLS_99, new __VLS_99({
        ...{ 'onClick': {} },
        ...{ class: "annotation-editor__action-button" },
        type: (action.active ? 'primary' : action.danger ? 'danger' : 'default'),
        disabled: (action.disabled),
    }));
    const __VLS_101 = __VLS_100({
        ...{ 'onClick': {} },
        ...{ class: "annotation-editor__action-button" },
        type: (action.active ? 'primary' : action.danger ? 'danger' : 'default'),
        disabled: (action.disabled),
    }, ...__VLS_functionalComponentArgsRest(__VLS_100));
    let __VLS_104;
    const __VLS_105 = {
        ...{ click: {} },
        onClick: (action.onClick),
    };
    /** @type {__VLS_StyleScopedClasses['annotation-editor__action-button']} */ ;
    const { default: __VLS_106 } = __VLS_102.slots;
    (action.label);
    // @ts-ignore
    [toolActions,];
    var __VLS_102;
    var __VLS_103;
    let __VLS_107;
    /** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
    elTooltip;
    // @ts-ignore
    const __VLS_108 = __VLS_asFunctionalComponent1(__VLS_107, new __VLS_107({
        content: (action.description),
        placement: "top",
    }));
    const __VLS_109 = __VLS_108({
        content: (action.description),
        placement: "top",
    }, ...__VLS_functionalComponentArgsRest(__VLS_108));
    const { default: __VLS_112 } = __VLS_110.slots;
    let __VLS_113;
    /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
    elIcon;
    // @ts-ignore
    const __VLS_114 = __VLS_asFunctionalComponent1(__VLS_113, new __VLS_113({
        ...{ class: "annotation-editor__action-info" },
    }));
    const __VLS_115 = __VLS_114({
        ...{ class: "annotation-editor__action-info" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_114));
    /** @type {__VLS_StyleScopedClasses['annotation-editor__action-info']} */ ;
    const { default: __VLS_118 } = __VLS_116.slots;
    let __VLS_119;
    /** @ts-ignore @type { | typeof __VLS_components.InfoFilled} */
    InfoFilled;
    // @ts-ignore
    const __VLS_120 = __VLS_asFunctionalComponent1(__VLS_119, new __VLS_119({}));
    const __VLS_121 = __VLS_120({}, ...__VLS_functionalComponentArgsRest(__VLS_120));
    // @ts-ignore
    [];
    var __VLS_116;
    // @ts-ignore
    [];
    var __VLS_110;
    // @ts-ignore
    [];
}
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "annotation-editor__action-group" },
});
/** @type {__VLS_StyleScopedClasses['annotation-editor__action-group']} */ ;
for (const [action] of __VLS_vFor((__VLS_ctx.commandActions))) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        key: (action.key),
        ...{ class: "annotation-editor__action-row" },
    });
    /** @type {__VLS_StyleScopedClasses['annotation-editor__action-row']} */ ;
    let __VLS_124;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_125 = __VLS_asFunctionalComponent1(__VLS_124, new __VLS_124({
        ...{ 'onClick': {} },
        ...{ class: "annotation-editor__action-button" },
        type: (action.danger ? 'danger' : 'default'),
        disabled: (action.disabled),
    }));
    const __VLS_126 = __VLS_125({
        ...{ 'onClick': {} },
        ...{ class: "annotation-editor__action-button" },
        type: (action.danger ? 'danger' : 'default'),
        disabled: (action.disabled),
    }, ...__VLS_functionalComponentArgsRest(__VLS_125));
    let __VLS_129;
    const __VLS_130 = {
        ...{ click: {} },
        onClick: (action.onClick),
    };
    /** @type {__VLS_StyleScopedClasses['annotation-editor__action-button']} */ ;
    const { default: __VLS_131 } = __VLS_127.slots;
    (action.label);
    // @ts-ignore
    [commandActions,];
    var __VLS_127;
    var __VLS_128;
    let __VLS_132;
    /** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
    elTooltip;
    // @ts-ignore
    const __VLS_133 = __VLS_asFunctionalComponent1(__VLS_132, new __VLS_132({
        content: (action.description),
        placement: "top",
    }));
    const __VLS_134 = __VLS_133({
        content: (action.description),
        placement: "top",
    }, ...__VLS_functionalComponentArgsRest(__VLS_133));
    const { default: __VLS_137 } = __VLS_135.slots;
    let __VLS_138;
    /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
    elIcon;
    // @ts-ignore
    const __VLS_139 = __VLS_asFunctionalComponent1(__VLS_138, new __VLS_138({
        ...{ class: "annotation-editor__action-info" },
    }));
    const __VLS_140 = __VLS_139({
        ...{ class: "annotation-editor__action-info" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_139));
    /** @type {__VLS_StyleScopedClasses['annotation-editor__action-info']} */ ;
    const { default: __VLS_143 } = __VLS_141.slots;
    let __VLS_144;
    /** @ts-ignore @type { | typeof __VLS_components.InfoFilled} */
    InfoFilled;
    // @ts-ignore
    const __VLS_145 = __VLS_asFunctionalComponent1(__VLS_144, new __VLS_144({}));
    const __VLS_146 = __VLS_145({}, ...__VLS_functionalComponentArgsRest(__VLS_145));
    // @ts-ignore
    [];
    var __VLS_141;
    // @ts-ignore
    [];
    var __VLS_135;
    // @ts-ignore
    [];
}
let __VLS_149;
/** @ts-ignore @type { | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card'] | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card']} */
elCard;
// @ts-ignore
const __VLS_150 = __VLS_asFunctionalComponent1(__VLS_149, new __VLS_149({
    shadow: "never",
    ...{ class: "annotation-editor__card" },
}));
const __VLS_151 = __VLS_150({
    shadow: "never",
    ...{ class: "annotation-editor__card" },
}, ...__VLS_functionalComponentArgsRest(__VLS_150));
/** @type {__VLS_StyleScopedClasses['annotation-editor__card']} */ ;
const { default: __VLS_154 } = __VLS_152.slots;
{
    const { header: __VLS_155 } = __VLS_152.slots;
    // @ts-ignore
    [];
}
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "annotation-editor__status-list" },
});
/** @type {__VLS_StyleScopedClasses['annotation-editor__status-list']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
(__VLS_ctx.activeToolLabel);
if (props.loading) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
}
if (__VLS_ctx.imageMeta.width && __VLS_ctx.imageMeta.height) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
    (__VLS_ctx.imageMeta.width);
    (__VLS_ctx.imageMeta.height);
}
if (__VLS_ctx.renderMetrics.renderWidth && __VLS_ctx.renderMetrics.renderHeight) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
    (Math.round(__VLS_ctx.renderMetrics.renderWidth));
    (Math.round(__VLS_ctx.renderMetrics.renderHeight));
}
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
(__VLS_ctx.shapes.length);
// @ts-ignore
[shapes, activeToolLabel, imageMeta, imageMeta, imageMeta, imageMeta, renderMetrics, renderMetrics, renderMetrics, renderMetrics,];
var __VLS_152;
// @ts-ignore
var __VLS_24 = __VLS_23, __VLS_98 = __VLS_97;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    setup: () => __VLS_exposed,
    __typeEmits: {},
    __defaults: __VLS_defaults,
    __typeProps: {},
});
export default {};
