/**
 * redThread.js
 * Draws connecting lines between Polaroid image layers (Evidence Board preset).
 * Simulates the "red string" conspiracy board aesthetic using Konva.Line.
 * Lines connect center-points of adjacent Polaroid groups in order of zIndex.
 */

import Konva from 'konva';

const THREAD_COLOR  = '#8B0000';
const THREAD_WIDTH  = 2.5;
const PIN_RADIUS    = 6;
const PIN_COLOR     = '#D2B48C';
const PIN_STROKE    = '#8B0000';

/**
 * Builds a Konva.Group containing all red thread lines and pin circles
 * connecting the center points of the provided layer data array.
 *
 * @param {Array<{x: number, y: number, width: number, height: number, rotation: number}>} layerPositions
 * @returns {Konva.Group}
 */
export function buildRedThreadGroup(layerPositions) {
  const group = new Konva.Group({
    name: 'red-thread-group',
    listening: false,
  });

  if (layerPositions.length < 2) return group;

  // Calculate center points in canvas coordinates
  const centers = layerPositions.map(layer => getCenterPoint(layer));

  // Draw lines between consecutive centers
  for (let i = 0; i < centers.length - 1; i++) {
    const a = centers[i];
    const b = centers[i + 1];

    // Main thread line
    const line = new Konva.Line({
      points: [a.x, a.y, b.x, b.y],
      stroke: THREAD_COLOR,
      strokeWidth: THREAD_WIDTH,
      lineCap: 'round',
      lineJoin: 'round',
      // Slight sag: insert midpoint drooped down (catenary approximation)
      tension: 0.3,
    });

    group.add(line);
  }

  // Draw pins at each center point
  for (const center of centers) {
    const pin = new Konva.Circle({
      x: center.x,
      y: center.y,
      radius: PIN_RADIUS,
      fill: PIN_COLOR,
      stroke: PIN_STROKE,
      strokeWidth: 1.5,
    });
    group.add(pin);
  }

  return group;
}

/**
 * Calculates center point of a layer (accounting for its offset position).
 * For simplicity, uses top-left + half-width/height (no rotation compensation).
 *
 * @param {{x: number, y: number, width: number, height: number}} layer
 * @returns {{x: number, y: number}}
 */
function getCenterPoint(layer) {
  return {
    x: layer.x + layer.width / 2,
    y: layer.y + layer.height / 2,
  };
}
