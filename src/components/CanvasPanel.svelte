<script>
  import { onMount, onDestroy } from 'svelte';
  import { layers, canvasSettings, selectedLayerId } from '../stores/canvas.js';
  import { currentTheme } from '../stores/theme.js';
  import {
    initStage,
    renderAll,
    refreshBackground,
    destroyStage,
    resizeStage,
  } from '../canvas/stage.js';

  let containerEl;
  let wrapperEl;
  let resizeObserver;

  onMount(() => {
    const { width, height } = wrapperEl.getBoundingClientRect();
    initStage(containerEl, width - 64, height - 64);

    resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        resizeStage(width - 64, height - 64);
      }
    });
    resizeObserver.observe(wrapperEl);

    // Subscribe to store changes and re-render
    const unsubLayers = layers.subscribe(() => renderAll());
    const unsubSettings = canvasSettings.subscribe(() => refreshBackground());
    const unsubTheme = currentTheme.subscribe(() => {
      refreshBackground();
    });

    return () => {
      unsubLayers();
      unsubSettings();
      unsubTheme();
    };
  });

  onDestroy(() => {
    resizeObserver?.disconnect();
    destroyStage();
  });
</script>

<section class="canvas-panel" bind:this={wrapperEl}>
  <div class="canvas-wrapper">
    <div class="konva-container" bind:this={containerEl}></div>
  </div>
</section>

<style>
  .canvas-panel {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #121212;
    overflow: hidden;
    position: relative;
  }

  .canvas-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    padding: 32px;
  }

  .konva-container {
    /* Konva mounts its canvas inside this div */
    /* Outline shows canvas boundary */
    outline: 1px solid #2A2A2A;
    cursor: default;
    flex-shrink: 0;
  }

  /* Crosshair cursor when a drawing tool is active */
  :global(.tool-redact .konva-container) {
    cursor: crosshair;
  }
</style>
