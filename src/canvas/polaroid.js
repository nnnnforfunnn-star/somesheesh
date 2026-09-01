/**
 * polaroid.js
 * Draws Polaroid-style frames around image layers.
 * Adds random rotation within [-5, +5] degrees.
 * All math is deterministic based on layer ID hash.
 */

import Konva from 'konva';

// White border sizes for Polaroid frame
const BORDER_TOP    = 24;
const BORDER_SIDE   = 24;
const BORDER_BOTTOM = 80; // Wider bottom for Polaroid look

/**
 * Creates a Konva Group containing the Polaroid frame + image.
 *
 * @param {object} params
 * @param {HTMLImageElement} params.imageEl - Loaded image element
 * @param {number} params.x
 * @param {number} params.y
 * @param {number} params.width - Inner image width
 * @param {number} params.height - Inner image height
 * @param {number} params.rotation - Rotation in degrees
 * @param {string} params.id - Layer ID (used for deterministic rotation seed)
 * @param {string} params.label - Optional caption text
 * @returns {Konva.Group}
 */
export function createPolaroidGroup({ imageEl, x, y, width, height, rotation, id, label = '' }) {
  const totalWidth  = width  + BORDER_SIDE * 2;
  const totalHeight = height + BORDER_TOP + BORDER_BOTTOM;

  const group = new Konva.Group({
    id,
    x,
    y,
    width: totalWidth,
    height: totalHeight,
    rotation,
    draggable: true,
    name: 'layer-group',
  });

  // Outer frame (white Polaroid border)
  const frame = new Konva.Rect({
    x: 0,
    y: 0,
    width: totalWidth,
    height: totalHeight,
    fill: '#F0EDE8',
    listening: false,
  });

  // Inner image
  const image = new Konva.Image({
    x: BORDER_SIDE,
    y: BORDER_TOP,
    width,
    height,
    image: imageEl,
    listening: false,
  });

  // Caption text (optional, bottom area)
  const caption = new Konva.Text({
    x: BORDER_SIDE,
    y: height + BORDER_TOP + 18,
    width: width,
    height: BORDER_BOTTOM - 24,
    text: label || '',
    fontSize: 16,
    fontFamily: 'Roboto Mono',
    fill: '#2A2A2A',
    align: 'center',
    listening: false,
  });

  // Top-edge shadow line (simulates slight depth)
  const shadowLine = new Konva.Rect({
    x: 0,
    y: 0,
    width: totalWidth,
    height: 2,
    fill: '#C0BDB8',
    listening: false,
  });

  group.add(frame);
  group.add(image);
  group.add(caption);
  group.add(shadowLine);

  return group;
}

/**
 * Deterministic rotation for a Polaroid based on layer ID.
 * Range: -5 to +5 degrees, consistent per layer.
 *
 * @param {string} id - Layer ID string
 * @returns {number} Rotation in degrees
 */
export function getPolaroidRotation(id) {
  // Simple string hash to produce a stable value
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) & 0xFFFFFF;
  }
  // Map [0, 0xFFFFFF] -> [-5, +5]
  const normalized = (hash / 0xFFFFFF) * 10 - 5;
  return Math.round(normalized * 10) / 10;
}
