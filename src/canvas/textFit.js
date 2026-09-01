/**
 * textFit.js
 * Auto-scaling algorithm: reduces font size until text fits in container.
 * Pure math, no DOM queries. Works with Konva.Text measurement.
 */

import Konva from 'konva';

/**
 * Calculate the optimal font size for a text to fit within a container.
 * Uses binary search for O(log n) performance.
 *
 * @param {string} text - The text content
 * @param {number} containerWidth - Max width in pixels
 * @param {number} containerHeight - Max height in pixels
 * @param {string} fontFamily - CSS font family string
 * @param {number} maxFontSize - Upper bound font size
 * @param {number} minFontSize - Lower bound font size
 * @param {number} lineHeight - Line height multiplier
 * @returns {number} Optimal font size in pixels
 */
export function calculateFitFontSize(
  text,
  containerWidth,
  containerHeight,
  fontFamily,
  maxFontSize = 96,
  minFontSize = 10,
  lineHeight = 1.4
) {
  if (!text || !containerWidth || !containerHeight) return minFontSize;

  let low = minFontSize;
  let high = maxFontSize;
  let result = minFontSize;

  // Binary search for the largest fitting size
  while (low <= high) {
    const mid = Math.floor((low + high) / 2);

    if (textFitsInContainer(text, containerWidth, containerHeight, fontFamily, mid, lineHeight)) {
      result = mid;
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }

  return result;
}

/**
 * Checks if a given font size allows text to fit in a container.
 * Uses Konva.Text for measurement to match actual render output.
 *
 * @param {string} text
 * @param {number} containerWidth
 * @param {number} containerHeight
 * @param {string} fontFamily
 * @param {number} fontSize
 * @param {number} lineHeight
 * @returns {boolean}
 */
function textFitsInContainer(text, containerWidth, containerHeight, fontFamily, fontSize, lineHeight) {
  // Use offscreen Konva.Text for measurement
  const probe = new Konva.Text({
    text,
    fontSize,
    fontFamily,
    lineHeight,
    width: containerWidth,
    wrap: 'word',
  });

  const measuredHeight = probe.height();
  probe.destroy();

  return measuredHeight <= containerHeight;
}

/**
 * Calculate character-per-line limit for a given font size and container width.
 * Approximation based on average character width in monospace fonts.
 *
 * @param {number} containerWidth
 * @param {number} fontSize
 * @returns {number} Estimated characters per line
 */
export function estimateCharsPerLine(containerWidth, fontSize) {
  // Monospace char width is approximately 0.6 * fontSize
  const charWidth = fontSize * 0.6;
  return Math.floor(containerWidth / charWidth);
}
