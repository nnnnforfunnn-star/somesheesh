/**
 * stage.js
 * Konva stage singleton manager.
 * Bridges Svelte stores to Konva rendering.
 * Follows unidirectional data flow:
 *   Store changes -> renderAll() -> Konva
 *   Konva events  -> store action functions -> Store
 */

import Konva from 'konva';
import { get } from 'svelte/store';
import {
  layers,
  selectedLayerId,
  canvasScale,
  canvasSettings,
  updateLayer,
  removeLayer,
  LAYER_TYPES,
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
} from '../stores/canvas.js';
import { currentTheme } from '../stores/theme.js';
import { calculateFitFontSize } from './textFit.js';
import { generatePaperTexture } from './texture.js';
import { buildRedThreadGroup } from './redThread.js';
import { createPolaroidGroup, getPolaroidRotation } from './polaroid.js';

// Module-level Konva instances (singletons)
let stage = null;
let bgLayer = null;        // Background color + texture
let mainLayer = null;      // All user layers
let threadLayer = null;    // Red thread lines (rendered below main in evidence mode)
let transformer = null;    // Selection handles
let selectionRect = null;  // Drag-to-select rectangle

// Map from layer ID -> Konva node for O(1) lookups
const nodeMap = new Map();

// Image cache: src URL/dataURL -> HTMLImageElement
const imageCache = new Map();

/**
 * Initialize the Konva stage inside a container element.
 * Called once from CanvasPanel.svelte onMount.
 *
 * @param {HTMLElement} container - DOM element to mount stage into
 * @param {number} containerWidth - Available width of container
 * @param {number} containerHeight - Available height of container
 */
export function initStage(container, containerWidth, containerHeight) {
  // Calculate scale to fit 1080x1350 in container
  const scaleX = containerWidth / CANVAS_WIDTH;
  const scaleY = containerHeight / CANVAS_HEIGHT;
  const scale = Math.min(scaleX, scaleY, 1);

  canvasScale.set(scale);

  stage = new Konva.Stage({
    container,
    width: CANVAS_WIDTH * scale,
    height: CANVAS_HEIGHT * scale,
    scaleX: scale,
    scaleY: scale,
  });

  // Layer order (bottom to top): bg, threads, main
  bgLayer     = new Konva.Layer({ listening: false });
  threadLayer = new Konva.Layer({ listening: false });
  mainLayer   = new Konva.Layer();

  stage.add(bgLayer);
  stage.add(threadLayer);
  stage.add(mainLayer);

  // Transformer for resize/rotate handles
  transformer = new Konva.Transformer({
    borderStroke: '#8B0000',
    borderStrokeWidth: 1.5,
    anchorFill: '#1E1E1E',
    anchorStroke: '#8B0000',
    anchorSize: 8,
    rotateAnchorOffset: 28,
    enabledAnchors: [
      'top-left', 'top-center', 'top-right',
      'middle-right', 'middle-left',
      'bottom-left', 'bottom-center', 'bottom-right',
    ],
    keepRatio: false,
    boundBoxFunc: (oldBox, newBox) => {
      // Minimum size constraint
      if (newBox.width < 20 || newBox.height < 20) return oldBox;
      return newBox;
    },
  });
  mainLayer.add(transformer);

  // Click on empty area -> deselect
  stage.on('click tap', (e) => {
    if (e.target === stage || e.target.name() === 'bg-rect') {
      deselectAll();
    }
  });

  // Keyboard shortcuts
  window.addEventListener('keydown', handleKeyDown);

  renderBackground();
  renderAll();
}

/**
 * Renders background color and paper texture.
 */
function renderBackground() {
  bgLayer.destroyChildren();

  const theme = get(currentTheme);
  const settings = get(canvasSettings);

  // Background rectangle
  const bg = new Konva.Rect({
    x: 0,
    y: 0,
    width: CANVAS_WIDTH,
    height: CANVAS_HEIGHT,
    fill: theme.backgroundColor,
    name: 'bg-rect',
  });
  bgLayer.add(bg);

  // Paper texture overlay with multiply blend mode
  if (settings.showTexture) {
    const textureCanvas = generatePaperTexture(CANVAS_WIDTH, CANVAS_HEIGHT);
    const textureImg = new Konva.Image({
      x: 0,
      y: 0,
      width: CANVAS_WIDTH,
      height: CANVAS_HEIGHT,
      image: textureCanvas,
      opacity: settings.textureOpacity,
      globalCompositeOperation: 'multiply',
    });
    bgLayer.add(textureImg);
  }

  bgLayer.batchDraw();
}

/**
 * Full re-render: syncs all Svelte store layers to Konva nodes.
 * Adds, updates, or removes nodes as needed.
 */
export function renderAll() {
  if (!mainLayer) return;

  const $layers = get(layers);
  const sorted = [...$layers].sort((a, b) => a.zIndex - b.zIndex);
  const currentIds = new Set($layers.map(l => l.id));

  // Remove nodes for deleted layers
  for (const [id, node] of nodeMap) {
    if (!currentIds.has(id)) {
      node.destroy();
      nodeMap.delete(id);
    }
  }

  // Add or update nodes
  for (const layer of sorted) {
    if (nodeMap.has(layer.id)) {
      updateKonvaNode(layer);
    } else {
      createKonvaNode(layer);
    }
  }

  // Re-render red thread if in evidence mode
  renderRedThread(sorted);

  // Re-render red thread if in evidence mode
  renderRedThread(sorted);

  syncZIndex();
}

/**
 * Synchronizes Konva node z-index with store z-index.
 * Called during renderAll and after async images load.
 */
function syncZIndex() {
  if (!mainLayer) return;
  const $layers = get(layers);
  const sorted = [...$layers].sort((a, b) => a.zIndex - b.zIndex);
  
  for (const layer of sorted) {
    const node = nodeMap.get(layer.id);
    if (node) node.moveToTop();
  }
  if (transformer) transformer.moveToTop();
  mainLayer.batchDraw();
}

/**
 * Creates a new Konva node for a layer and registers event listeners.
 */
function createKonvaNode(layer) {
  let node;

  switch (layer.type) {
    case LAYER_TYPES.TEXT:
      node = createTextNode(layer);
      break;
    case LAYER_TYPES.IMAGE:
      node = createImageNode(layer);
      return; // async: node is created after image loads
    case LAYER_TYPES.REDACTION:
      node = createRedactionNode(layer);
      break;
    default:
      return;
  }

  attachNodeEvents(node, layer.id);
  mainLayer.add(node);
  nodeMap.set(layer.id, node);
  mainLayer.batchDraw();
}

/**
 * Updates an existing Konva node's properties from layer data.
 */
function updateKonvaNode(layer) {
  const node = nodeMap.get(layer.id);
  if (!node) return;

  node.x(layer.x);
  node.y(layer.y);
  node.rotation(layer.rotation ?? 0);
  node.visible(layer.visible !== false);

  if (layer.type === LAYER_TYPES.TEXT) {
    const fontSize = layer.autoFit
      ? calculateFitFontSize(
          layer.text,
          layer.width,
          layer.height,
          layer.fontFamily,
          layer.maxFontSize,
          layer.minFontSize,
          layer.lineHeight
        )
      : layer.fontSize;

    node.setAttrs({
      text:        layer.text,
      fontSize,
      fontFamily:  layer.fontFamily,
      fontStyle:   layer.fontStyle,
      fill:        layer.color,
      width:       layer.width,
      height:      layer.height,
      align:       layer.align,
      lineHeight:  layer.lineHeight,
    });
  }

  if (layer.type === LAYER_TYPES.REDACTION) {
    node.setAttrs({
      width:   layer.width,
      height:  layer.height,
      fill:    layer.fill ?? '#000000',
      opacity: layer.opacity ?? 1,
    });
  }
}

/**
 * Creates a Konva.Text node.
 */
function createTextNode(layer) {
  const fontSize = layer.autoFit
    ? calculateFitFontSize(
        layer.text, layer.width, layer.height,
        layer.fontFamily, layer.maxFontSize, layer.minFontSize, layer.lineHeight
      )
    : layer.fontSize;

  return new Konva.Text({
    id: layer.id,
    x: layer.x,
    y: layer.y,
    width: layer.width,
    height: layer.height,
    rotation: layer.rotation ?? 0,
    text: layer.text,
    fontSize,
    fontFamily: layer.fontFamily ?? 'Roboto Mono',
    fontStyle: layer.fontStyle ?? 'normal',
    fill: layer.color ?? '#E8E8E8',
    align: layer.align ?? 'left',
    lineHeight: layer.lineHeight ?? 1.4,
    wrap: 'word',
    visible: layer.visible !== false,
    draggable: !layer.locked,
    name: 'layer-node',
  });
}

/**
 * Creates a Konva.Image node asynchronously.
 * Handles both Polaroid and regular image modes.
 */
function createImageNode(layer) {
  if (!layer.src) return;

  const onImageLoaded = (imageEl) => {
    let node;

    if (layer.isPolaroid) {
      const rotation = layer.polaroidRotation ?? getPolaroidRotation(layer.id);
      node = createPolaroidGroup({
        imageEl,
        x: layer.x,
        y: layer.y,
        width: layer.width,
        height: layer.height,
        rotation,
        id: layer.id,
        label: layer.text ?? '',
      });
    } else {
      node = new Konva.Image({
        id: layer.id,
        x: layer.x,
        y: layer.y,
        width: layer.width,
        height: layer.height,
        rotation: layer.rotation ?? 0,
        image: imageEl,
        visible: layer.visible !== false,
        draggable: !layer.locked,
        name: 'layer-node',
      });
    }

    if (!layer.isPolaroid) {
      node.draggable(!layer.locked);
    }

    attachNodeEvents(node, layer.id);
    mainLayer.add(node);
    nodeMap.set(layer.id, node);
    syncZIndex();
  };

  if (imageCache.has(layer.src)) {
    onImageLoaded(imageCache.get(layer.src));
  } else {
    const img = new Image();
    img.onload = () => {
      imageCache.set(layer.src, img);
      onImageLoaded(img);
    };
    img.src = layer.src;
  }
}

/**
 * Creates a Konva.Rect for redaction (black bar).
 */
function createRedactionNode(layer) {
  return new Konva.Rect({
    id: layer.id,
    x: layer.x,
    y: layer.y,
    width: layer.width,
    height: layer.height,
    rotation: layer.rotation ?? 0,
    fill: layer.fill ?? '#000000',
    opacity: layer.opacity ?? 1,
    visible: layer.visible !== false,
    draggable: !layer.locked,
    name: 'layer-node',
  });
}

/**
 * Attaches drag/click events to a Konva node.
 * Pushes updates back to Svelte store.
 */
function attachNodeEvents(node, layerId) {
  node.on('click tap', (e) => {
    e.cancelBubble = true;
    selectLayer(layerId);
  });

  node.on('dragend', () => {
    updateLayer(layerId, { x: node.x(), y: node.y() });
  });

  node.on('transformend', () => {
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();
    node.scaleX(1);
    node.scaleY(1);
    updateLayer(layerId, {
      x:        node.x(),
      y:        node.y(),
      width:    Math.max(20, node.width()  * scaleX),
      height:   Math.max(20, node.height() * scaleY),
      rotation: node.rotation(),
    });
  });
}

/**
 * Renders red thread lines between all Polaroid layers.
 */
function renderRedThread(sortedLayers) {
  threadLayer.destroyChildren();

  const polaroids = sortedLayers.filter(l => l.type === LAYER_TYPES.IMAGE && l.isPolaroid);
  if (polaroids.length < 2) return;

  const group = buildRedThreadGroup(polaroids);
  threadLayer.add(group);
  threadLayer.batchDraw();
}

/**
 * Selects a layer by ID: updates store and attaches transformer.
 */
export function selectLayer(id) {
  selectedLayerId.set(id);
  const node = nodeMap.get(id);
  if (node && transformer) {
    transformer.nodes([node]);
    mainLayer.batchDraw();
  }
}

/**
 * Deselects all layers.
 */
export function deselectAll() {
  selectedLayerId.set(null);
  if (transformer) {
    transformer.nodes([]);
    mainLayer.batchDraw();
  }
}

/**
 * Keyboard shortcuts handler.
 */
function handleKeyDown(e) {
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

  // Delete or Backspace removes the selected layer
  if ((e.key === 'Delete' || e.key === 'Backspace') && get(selectedLayerId)) {
    removeLayer(get(selectedLayerId));
    deselectAll();
  }

  // Escape -> deselect
  if (e.key === 'Escape') deselectAll();
}

/**
 * Refreshes the background (called when theme or texture settings change).
 */
export function refreshBackground() {
  renderBackground();
}

/**
 * Returns the stage instance (for export functions).
 */
export function getStage() {
  return stage;
}

/**
 * Returns the current display scale.
 */
export function getDisplayScale() {
  return stage ? stage.scaleX() : 1;
}

/**
 * Resizes stage when container changes.
 */
export function resizeStage(containerWidth, containerHeight) {
  if (!stage) return;

  const scaleX = containerWidth / CANVAS_WIDTH;
  const scaleY = containerHeight / CANVAS_HEIGHT;
  const scale = Math.min(scaleX, scaleY, 1);

  canvasScale.set(scale);
  stage.width(CANVAS_WIDTH * scale);
  stage.height(CANVAS_HEIGHT * scale);
  stage.scaleX(scale);
  stage.scaleY(scale);
  stage.batchDraw();
}

/**
 * Cleans up stage and event listeners.
 * Called from CanvasPanel onDestroy.
 */
export function destroyStage() {
  window.removeEventListener('keydown', handleKeyDown);
  nodeMap.clear();
  imageCache.clear();
  if (stage) {
    stage.destroy();
    stage = null;
  }
}
