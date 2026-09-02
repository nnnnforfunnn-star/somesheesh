import { writable, derived } from 'svelte/store';

// Unique ID generator
let _idCounter = 0;
export function generateId() {
  return `layer_${Date.now()}_${_idCounter++}`;
}

// Canvas dimensions (fixed for social media carousels)
export const CANVAS_WIDTH = 1080;
export const CANVAS_HEIGHT = 1350;

// Layer type constants
export const LAYER_TYPES = {
  TEXT: 'text',
  IMAGE: 'image',
  REDACTION: 'redaction',
  SHAPE: 'shape',
  LINE: 'line',
};

// Active editing tool
export const activeTool = writable('select');

// Array of all layers on canvas. Each layer is a plain object.
/** @type {import('svelte/store').Writable<any[]>} */
export const layers = writable([]);

// Currently selected layer ID
/** @type {import('svelte/store').Writable<string|null>} */
export const selectedLayerId = writable(null);

// Canvas display scale (how the 1080x1350 canvas fits in the viewport)
export const canvasScale = writable(1);

// Global canvas settings
export const canvasSettings = writable({
  showTexture: true,
  textureOpacity: 0.18,
  showGrid: false,
  backgroundColor: '#121212',
});

// Computed: selected layer object
export const selectedLayer = derived(
  [layers, selectedLayerId],
  ([$layers, $id]) => $layers.find(l => l.id === $id) ?? null
);

// Computed: layers sorted by zIndex (bottom to top)
export const sortedLayers = derived(
  layers,
  $layers => [...$layers].sort((a, b) => a.zIndex - b.zIndex)
);

// --- Layer action helpers ---

export function addLayer(layer) {
  layers.update($layers => {
    const maxZ = $layers.length ? Math.max(...$layers.map(l => l.zIndex)) : 0;
    return [...$layers, { ...layer, id: generateId(), zIndex: maxZ + 1 }];
  });
}

export function updateLayer(id, patch) {
  layers.update($layers =>
    $layers.map(l => (l.id === id ? { ...l, ...patch } : l))
  );
}

export function removeLayer(id) {
  layers.update($layers => $layers.filter(l => l.id !== id));
  selectedLayerId.update($id => ($id === id ? null : $id));
}

export function bringForward(id) {
  layers.update($layers => {
    const sorted = [...$layers].sort((a, b) => a.zIndex - b.zIndex);
    const idx = sorted.findIndex(l => l.id === id);
    if (idx === sorted.length - 1) return $layers;
    // Swap z-indices with the layer above
    const above = sorted[idx + 1];
    const current = sorted[idx];
    return $layers.map(l => {
      if (l.id === current.id) return { ...l, zIndex: above.zIndex };
      if (l.id === above.id) return { ...l, zIndex: current.zIndex };
      return l;
    });
  });
}

export function sendBackward(id) {
  layers.update($layers => {
    const sorted = [...$layers].sort((a, b) => a.zIndex - b.zIndex);
    const idx = sorted.findIndex(l => l.id === id);
    if (idx === 0) return $layers;
    const below = sorted[idx - 1];
    const current = sorted[idx];
    return $layers.map(l => {
      if (l.id === current.id) return { ...l, zIndex: below.zIndex };
      if (l.id === below.id) return { ...l, zIndex: current.zIndex };
      return l;
    });
  });
}

export function duplicateLayer(id) {
  layers.update($layers => {
    const original = $layers.find(l => l.id === id);
    if (!original) return $layers;
    const maxZ = Math.max(...$layers.map(l => l.zIndex));
    const copy = {
      ...original,
      id: generateId(),
      x: original.x + 20,
      y: original.y + 20,
      zIndex: maxZ + 1,
    };
    return [...$layers, copy];
  });
}

export function clearCanvas() {
  layers.set([]);
  selectedLayerId.set(null);
}

// --- Default layer factory functions ---

export function makeTextLayer(overrides = {}) {
  return {
    type: LAYER_TYPES.TEXT,
    x: 100,
    y: 100,
    width: 500,
    height: 200,
    rotation: 0,
    visible: true,
    locked: false,
    zIndex: 1,
    // Text-specific
    text: 'ВВЕДИТЕ ТЕКСТ',
    fontSize: 48,
    fontFamily: 'Roboto Mono',
    fontStyle: 'normal',
    fontWeight: '400',
    color: '#E8E8E8',
    align: 'left',
    lineHeight: 1.4,
    letterSpacing: 0,
    autoFit: true,
    maxFontSize: 96,
    minFontSize: 10,
    ...overrides,
  };
}

export function makeImageLayer(overrides = {}) {
  return {
    type: LAYER_TYPES.IMAGE,
    x: 100,
    y: 100,
    width: 400,
    height: 400,
    rotation: 0,
    visible: true,
    locked: false,
    zIndex: 1,
    // Image-specific
    src: null,
    isPolaroid: false,
    polaroidRotation: 0,
    ...overrides,
  };
}

export function makeRedactionLayer(overrides = {}) {
  return {
    type: LAYER_TYPES.REDACTION,
    x: 100,
    y: 100,
    width: 300,
    height: 50,
    rotation: 0,
    visible: true,
    locked: false,
    zIndex: 10,
    fill: '#000000',
    ...overrides,
  };
}
