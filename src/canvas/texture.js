/**
 * texture.js
 * Generates a procedural paper texture as an ImageBitmap.
 * No external assets required — pure canvas API math.
 * Uses multiply blend mode for organic overlay effect.
 */

// Cache so we only generate once per session
let _textureCache = null;

/**
 * Generates a grainy paper texture using canvas noise algorithms.
 * Returns an HTMLCanvasElement that Konva can use as image source.
 *
 * @param {number} width
 * @param {number} height
 * @returns {HTMLCanvasElement}
 */
export function generatePaperTexture(width, height) {
  if (_textureCache) return _textureCache;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');

  // Base warm parchment fill
  ctx.fillStyle = '#C8A882';
  ctx.fillRect(0, 0, width, height);

  // Grain noise overlay using ImageData for pixel-level control
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;

  // Seeded deterministic noise using a simple LCG (Linear Congruential Generator)
  // This avoids Math.random() for reproducibility
  let seed = 0xDEADBEEF;

  function lcgNext() {
    seed = (seed * 1664525 + 1013904223) & 0xFFFFFFFF;
    return (seed >>> 0) / 0xFFFFFFFF;
  }

  for (let i = 0; i < data.length; i += 4) {
    const noise = (lcgNext() - 0.5) * 60;
    data[i]     = Math.min(255, Math.max(0, data[i]     + noise));
    data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise * 0.9));
    data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise * 0.7));
    // Alpha stays at 255
  }

  ctx.putImageData(imageData, 0, 0);

  // Horizontal fiber lines for paper texture
  ctx.globalAlpha = 0.04;
  for (let y = 0; y < height; y += 3) {
    const shade = lcgNext() > 0.5 ? '#000000' : '#FFFFFF';
    ctx.strokeStyle = shade;
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y + (lcgNext() - 0.5) * 4);
    ctx.stroke();
  }

  // Vertical fiber lines
  ctx.globalAlpha = 0.02;
  for (let x = 0; x < width; x += 8) {
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 0.3;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x + (lcgNext() - 0.5) * 3, height);
    ctx.stroke();
  }

  ctx.globalAlpha = 1;
  _textureCache = canvas;
  return canvas;
}

/**
 * Resets the texture cache (call if canvas size changes).
 */
export function resetTextureCache() {
  _textureCache = null;
}
