/**
 * exportCanvas.js
 * Exports the Konva stage to PNG or JPEG at native 1080x1350 resolution.
 * Handles pixel ratio correctly so output matches the design resolution.
 */

/**
 * Downloads the canvas as an image file.
 *
 * @param {Konva.Stage} stage - The Konva stage instance
 * @param {object} options
 * @param {'png'|'jpeg'} options.format - Output format
 * @param {number} options.quality - JPEG quality 0-1 (ignored for PNG)
 * @param {string} options.filename - Output filename without extension
 * @param {number} options.nativeWidth - Canvas native width (1080)
 * @param {number} options.nativeHeight - Canvas native height (1350)
 * @param {number} options.displayScale - Current display scale of stage
 */
export async function exportCanvasToFile(stage, options = {}) {
  const {
    format = 'png',
    quality = 0.95,
    filename = 'casefile_post',
    nativeWidth = 1080,
    nativeHeight = 1350,
    displayScale = 1,
  } = options;

  // Hide transformer before export
  const transformer = stage.findOne('Transformer');
  let wasVisible = false;
  if (transformer) {
    wasVisible = transformer.visible();
    transformer.visible(false);
    stage.batchDraw();
  }

  // Compute pixel ratio to render at native resolution
  // Stage currently renders at displayScale, so we need to upscale
  const pixelRatio = (1 / displayScale);

  const mimeType = format === 'jpeg' ? 'image/jpeg' : 'image/png';

  const dataUrl = stage.toDataURL({
    mimeType,
    quality,
    pixelRatio,
    width: nativeWidth * displayScale,
    height: nativeHeight * displayScale,
    x: 0,
    y: 0,
  });

  // Restore transformer visibility
  if (transformer) {
    transformer.visible(wasVisible);
    stage.batchDraw();
  }

  // Trigger browser download
  const link = document.createElement('a');
  link.download = `${filename}.${format}`;
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Returns a Blob of the exported canvas (for programmatic use).
 *
 * @param {Konva.Stage} stage
 * @param {object} options
 * @returns {Promise<Blob>}
 */
export function exportCanvasToBlob(stage, options = {}) {
  const {
    format = 'png',
    quality = 0.95,
    displayScale = 1,
  } = options;

  const pixelRatio = 1 / displayScale;
  const mimeType = format === 'jpeg' ? 'image/jpeg' : 'image/png';

  const dataUrl = stage.toDataURL({ mimeType, quality, pixelRatio });

  return fetch(dataUrl).then(r => r.blob());
}
