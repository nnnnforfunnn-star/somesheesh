/**
 * exportCanvas.js
 * Exports the Konva stage to PNG or JPEG at native 1080x1350 resolution.
 * Handles pixel ratio correctly so output matches the design resolution.
 */

import Konva from 'konva';

/**
 * @typedef {object} ExportOptions
 * @property {'png'|'jpeg'} [format='png'] - Output format
 * @property {number} [quality=0.95] - JPEG quality 0-1 (ignored for PNG)
 * @property {string} [filename='casefile_post'] - Output filename without extension
 * @property {number} [nativeWidth=1080] - Canvas native width in pixels
 * @property {number} [nativeHeight=1350] - Canvas native height in pixels
 * @property {number} [displayScale=1] - Current display scale of the stage
 */

/** @type {ExportOptions} */
const DEFAULT_OPTIONS = {
  format: 'png',
  quality: 0.95,
  filename: 'casefile_post',
  nativeWidth: 1080,
  nativeHeight: 1350,
  displayScale: 1,
};

/**
 * Downloads the canvas as an image file.
 *
 * @param {Konva.Stage} stage - The Konva stage instance
 * @param {ExportOptions} options
 * @returns {Promise<void>}
 */
export async function exportCanvasToFile(stage, options = DEFAULT_OPTIONS) {
  const {
    format        = 'png',
    quality       = 0.95,
    filename      = 'casefile_post',
    nativeWidth   = 1080,
    nativeHeight  = 1350,
    displayScale  = 1,
  } = options;

  // Hide transformer before export so it does not appear in the output image
  const transformer = stage.findOne('Transformer');
  let wasVisible = false;
  if (transformer) {
    wasVisible = transformer.visible();
    transformer.visible(false);
    stage.batchDraw();
  }

  // Pixel ratio: stage renders at displayScale, upscale to reach native resolution
  const pixelRatio = 1 / displayScale;

  const mimeType = format === 'jpeg' ? 'image/jpeg' : 'image/png';

  const dataUrl = stage.toDataURL({
    mimeType,
    quality,
    pixelRatio,
    width:  nativeWidth  * displayScale,
    height: nativeHeight * displayScale,
    x: 0,
    y: 0,
  });

  // Restore transformer visibility after capture
  if (transformer) {
    transformer.visible(wasVisible);
    stage.batchDraw();
  }

  // Trigger browser download via a temporary anchor element
  const link = document.createElement('a');
  link.download = `${filename}.${format}`;
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Returns a Blob of the exported canvas (for programmatic use, e.g. upload).
 *
 * @param {Konva.Stage} stage
 * @param {ExportOptions} options
 * @returns {Promise<Blob>}
 */
export function exportCanvasToBlob(stage, options = DEFAULT_OPTIONS) {
  const {
    format       = 'png',
    quality      = 0.95,
    displayScale = 1,
  } = options;

  const pixelRatio = 1 / displayScale;
  const mimeType = format === 'jpeg' ? 'image/jpeg' : 'image/png';

  const dataUrl = stage.toDataURL({ mimeType, quality, pixelRatio });

  return fetch(dataUrl).then(r => r.blob());
}
