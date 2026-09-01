<script>
  import { drawerOpen, activeMobileTab, closeDrawer } from '../stores/mobile.js';
  import { selectedLayer } from '../stores/canvas.js';

  import ToolBar from './ToolBar.svelte';
  import TextControls from './TextControls.svelte';
  import ImageUpload from './ImageUpload.svelte';
  import ThemeSelector from './ThemeSelector.svelte';
  import CanvasSettingsPanel from './CanvasSettingsPanel.svelte';
  import LayerList from './LayerList.svelte';
  import ExportControls from './ExportControls.svelte';

  // Drawer height as fraction of viewport
  const DRAWER_HEIGHT = '72vh';

  // Close on backdrop click
  function handleBackdropClick() {
    closeDrawer();
  }

  // Prevent touch events from propagating through drawer to canvas
  function stopPropagation(e) {
    e.stopPropagation();
  }

  // Tab -> section title mapping
  const tabTitles = {
    tools:  'ИНСТРУМЕНТЫ',
    text:   'ТЕКСТ',
    images: 'ИЗОБРАЖЕНИЯ',
    theme:  'ТЕМА И ХОЛСТ',
    layers: 'СЛОИ',
    export: 'ЭКСПОРТ',
  };
</script>

<!-- Backdrop -->
{#if $drawerOpen}
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div
    class="drawer-backdrop"
    on:click={handleBackdropClick}
    aria-hidden="true"
  ></div>
{/if}

<!-- Drawer panel -->
<div
  class="mobile-drawer"
  class:mobile-drawer--open={$drawerOpen}
  on:touchstart={stopPropagation}
  on:touchmove={stopPropagation}
  role="complementary"
  tabindex="-1"
  aria-label={tabTitles[$activeMobileTab] ?? 'Панель'}
>
  <!-- Drag handle -->
  <div class="drawer-handle-bar">
    <div class="drawer-handle"></div>
    <span class="drawer-title">{tabTitles[$activeMobileTab] ?? ''}</span>
    <button class="drawer-close" on:click={closeDrawer} aria-label="Закрыть панель">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
      </svg>
    </button>
  </div>

  <!-- Scrollable content -->
  <div class="drawer-content">
    {#if $activeMobileTab === 'tools'}
      <div class="drawer-section">
        <ToolBar />
      </div>
    {:else if $activeMobileTab === 'text'}
      <div class="drawer-section">
        {#if $selectedLayer?.type === 'text'}
          <TextControls />
        {:else}
          <p class="drawer-hint">
            Выберите текстовый слой на холсте или добавьте новый через инструмент ТЕКСТ.
          </p>
        {/if}
      </div>
    {:else if $activeMobileTab === 'images'}
      <div class="drawer-section">
        <ImageUpload />
      </div>
    {:else if $activeMobileTab === 'theme'}
      <div class="drawer-section">
        <ThemeSelector />
        <div class="drawer-divider"></div>
        <CanvasSettingsPanel />
      </div>
    {:else if $activeMobileTab === 'layers'}
      <div class="drawer-section drawer-section--layers">
        <LayerList />
      </div>
    {:else if $activeMobileTab === 'export'}
      <div class="drawer-section">
        <ExportControls />
      </div>
    {/if}
  </div>
</div>

<style>
  .drawer-backdrop {
    position: fixed;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 40;
    /* Backdrop appears only on mobile */
  }

  .mobile-drawer {
    position: fixed;
    left: 0;
    right: 0;
    /* Must match actual nav height including safe area on notched phones */
    bottom: calc(60px + env(safe-area-inset-bottom, 0px));
    height: 72dvh;
    background-color: #1E1E1E;
    border-top: 1px solid #333333;
    z-index: 50;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    transform: translateY(100%);
    transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .mobile-drawer--open {
    transform: translateY(0);
  }

  .drawer-handle-bar {
    display: flex;
    align-items: center;
    padding: 10px 14px 8px;
    flex-shrink: 0;
    gap: 10px;
    border-bottom: 1px solid #2A2A2A;
  }

  .drawer-handle {
    width: 36px;
    height: 3px;
    background-color: #444444;
    border-radius: 2px;
    flex-shrink: 0;
    /* Not using this as a drag handle currently, just decorative */
    display: none;
  }

  .drawer-title {
    flex: 1;
    font-family: "Roboto Mono", monospace;
    font-size: 11px;
    font-weight: 700;
    color: #8B0000;
    letter-spacing: 0.12em;
  }

  .drawer-close {
    background: none;
    border: none;
    color: #555555;
    cursor: pointer;
    padding: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    -webkit-tap-highlight-color: transparent;
    /* Override global mobile button min-height so the close button
       stays compact inside the handle bar */
    min-height: unset;
    height: 32px;
    width: 32px;
  }

  .drawer-close:active {
    color: #E8E8E8;
  }

  .drawer-content {
    flex: 1;
    overflow-y: auto;
    overscroll-behavior: contain;
    -webkit-overflow-scrolling: touch;
  }

  .drawer-section {
    padding: 14px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .drawer-section--layers {
    height: 100%;
    overflow: hidden;
  }

  .drawer-divider {
    height: 1px;
    background-color: #2A2A2A;
  }

  .drawer-hint {
    font-family: "Roboto Mono", monospace;
    font-size: 11px;
    color: #555555;
    line-height: 1.6;
    padding: 8px 0;
    text-align: center;
  }
</style>
