<script>
  import { onMount, onDestroy } from 'svelte';
  import { layers, canvasSettings } from '../stores/canvas.js';
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
    const padding = window.innerWidth <= 768 ? 0 : 64;
    initStage(containerEl, width - padding, height - padding);

    resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        const padding = window.innerWidth <= 768 ? 0 : 64;
        resizeStage(width - padding, height - padding);
      }
    });
    resizeObserver.observe(wrapperEl);

    // Subscribe to store changes and re-render
    const unsubLayers   = layers.subscribe(() => renderAll());
    const unsubSettings = canvasSettings.subscribe(() => refreshBackground());
    const unsubTheme    = currentTheme.subscribe(() => refreshBackground());

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
    min-width: 0;
    min-height: 0;
  }

  .canvas-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    padding: 32px;
  }

  /* Konva container: canvas mounts here */
  .konva-container {
    outline: 1px solid #2A2A2A;
    cursor: default;
    flex-shrink: 0;
    /* Prevent browser handling of touch events (pinch-zoom, scroll) */
    touch-action: none;
    -webkit-user-select: none;
    user-select: none;
  }

  /* On mobile: remove padding, let canvas fill more of the screen */
  @media (max-width: 768px) {
    .canvas-wrapper {
      padding: 0;
    }

    .konva-container {
      outline: none;
    }
  }
</style>
