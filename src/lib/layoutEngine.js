import { get } from 'svelte/store';
import { slides, currentSlideIndex, makeTextLayer, makeImageLayer, LAYER_TYPES, CANVAS_WIDTH, CANVAS_HEIGHT } from '../stores/canvas.js';

/**
 * layoutEngine.js
 * Automatically generates slides based on raw text and images using mathematical layouts.
 */

const MAX_CHARS_PER_SLIDE = 350;

/**
 * Splits raw text into paragraphs, grouping them into chunks that don't exceed a soft character limit.
 * Also detects [REDACTED] tags.
 * 
 * @param {string} text 
 * @returns {string[]} Array of text chunks for slides
 */
function chunkText(text) {
  if (!text.trim()) return [];
  
  const paragraphs = text.split('\n').map(p => p.trim()).filter(p => p.length > 0);
  const chunks = [];
  let currentChunk = '';

  for (const p of paragraphs) {
    if (currentChunk.length + p.length > MAX_CHARS_PER_SLIDE && currentChunk.length > 0) {
      chunks.push(currentChunk.trim());
      currentChunk = p;
    } else {
      currentChunk += (currentChunk ? '\n\n' : '') + p;
    }
  }
  
  if (currentChunk) {
    chunks.push(currentChunk.trim());
  }
  
  return chunks;
}

/**
 * Generates a full post (array of slides) from text and images.
 * Overwrites current slides.
 * 
 * @param {string} rawText 
 * @param {File[]} images 
 */
export async function generatePost(rawText, images) {
  const textChunks = chunkText(rawText);
  const newSlides = [];
  
  // Convert images to data URLs
  const imageUrls = await Promise.all(images.map(file => {
    return new Promise(resolve => {
      const reader = new FileReader();
      reader.onload = e => resolve(e.target.result);
      reader.readAsDataURL(file);
    });
  }));

  let imgIndex = 0;

  // Slide 1: Cover (if we have at least one image)
  if (imageUrls.length > 0) {
    const coverSlide = [];
    // Main background image
    coverSlide.push(makeImageLayer({
      src: imageUrls[imgIndex++],
      x: 0,
      y: 0,
      width: CANVAS_WIDTH,
      height: CANVAS_HEIGHT,
      locked: true,
      zIndex: 1
    }));
    
    // Add title if we have text
    if (textChunks.length > 0) {
      // Use first 50 chars of first chunk as title
      let titleText = textChunks[0].substring(0, 50);
      if (textChunks[0].length > 50) titleText += '...';
      
      coverSlide.push(makeTextLayer({
        text: 'ДЕЛО №' + Math.floor(Math.random() * 10000) + '\n\n' + titleText.toUpperCase(),
        x: 100,
        y: CANVAS_HEIGHT / 2 - 150,
        width: CANVAS_WIDTH - 200,
        height: 300,
        fontSize: 64,
        align: 'center',
        color: '#FFFFFF',
        fontWeight: '700',
        zIndex: 2,
        autoFit: true
      }));
    }
    newSlides.push(coverSlide);
  }

  // Iterate over remaining text chunks
  for (const chunk of textChunks) {
    const slide = [];
    
    // Check if we have an image for this chunk
    if (imgIndex < imageUrls.length) {
      // Split layout: Image top, Text bottom
      const margin = 80;
      slide.push(makeImageLayer({
        src: imageUrls[imgIndex++],
        x: margin,
        y: margin,
        width: CANVAS_WIDTH - margin * 2,
        height: CANVAS_HEIGHT / 2 - margin * 1.5,
        isPolaroid: true, // Auto polaroid for aesthetics
        zIndex: 1
      }));
      
      slide.push(makeTextLayer({
        text: chunk,
        x: margin,
        y: CANVAS_HEIGHT / 2 + margin / 2,
        width: CANVAS_WIDTH - margin * 2,
        height: CANVAS_HEIGHT / 2 - margin * 1.5,
        fontSize: 36,
        align: 'left',
        zIndex: 2,
        autoFit: true
      }));
    } else {
      // Text only layout
      const margin = 100;
      slide.push(makeTextLayer({
        text: chunk,
        x: margin,
        y: margin,
        width: CANVAS_WIDTH - margin * 2,
        height: CANVAS_HEIGHT - margin * 2,
        fontSize: 48,
        align: 'left',
        zIndex: 1,
        autoFit: true
      }));
    }
    
    // Parse for [REDACTED] tags to auto-add redaction rectangles
    // For MVP, we will rely on Konva text bounding boxes later, 
    // for now we just parse the text. (Advanced redaction positioning is complex in pure canvas without DOM)
    
    newSlides.push(slide);
  }

  // If there are leftover images, create an Evidence Board slide
  if (imgIndex < imageUrls.length) {
    const evidenceSlide = [];
    let xOffset = 100;
    let yOffset = 100;
    
    while (imgIndex < imageUrls.length) {
      evidenceSlide.push(makeImageLayer({
        src: imageUrls[imgIndex++],
        x: xOffset,
        y: yOffset,
        width: 400,
        height: 400,
        isPolaroid: true,
        polaroidRotation: (Math.random() - 0.5) * 15,
        zIndex: 1
      }));
      xOffset += 150;
      yOffset += 250;
      if (xOffset > CANVAS_WIDTH - 400) xOffset = 100;
    }
    newSlides.push(evidenceSlide);
  }

  // Update store
  if (newSlides.length > 0) {
    slides.set(newSlides);
    currentSlideIndex.set(0);
  }
}
