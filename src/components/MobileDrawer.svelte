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

  function handleBackdropClick() {
    closeDrawer();
  }

  function stopPropagation(e) {
    e.stopPropagation();
  }

  const tabTitles = {
    tools:  'ИНСТРУМЕНТЫ',
    text:   'ТЕКСТ',
    images: 'ИЗОБРАЖЕНИЯ',
    theme:  'ТЕМА И ХОЛСТ',
    layers: 'СЛОИ',
    export: 'ЭКСПОРТ',
  };
</script>

<!-- Backdrop: only rendered when open, only on mobile -->
{#if $drawerOpen}
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div class="drawer-backdrop" on:click={handleBackdropClick} aria-hidden="true"></div>
{/if}

<!-- Drawer: always in DOM, slides with transform -->
<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<aside
  class="mobile-drawer"
  class:mobile-drawer--open={$drawerOpen}
  on:touchstart={stopPropagation}
  on:touchmove={stopPropagation}
  aria-label={tabTitles[$activeMobileTab] ?? 'Панель'}
  aria-hidden={!$drawerOpen}
>
  <div class="drawer-handle-bar">
    <span class="drawer-title">{tabTitles[$activeMobileTab] ?? ''}</span>
    <button class="drawer-close" on:click={closeDrawer} aria-label="Закрыть панель">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
      </svg>
    </button>
  </div>

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
          <p class="drawer-hint">Выберите текстовый слой на холсте или добавьте новый через инструмент ТЕКСТ.</p>
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
</aside>

<style>
  /* Backdrop: hidden on desktop */
  .drawer-backdrop {
    display: none;
  }

  /* Drawer: hidden on desktop */
  .mobile-drawer {
    display: none;
  }

  @media (max-width: 768px) {
    .drawer-backdrop {
      display: block;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      /* Stop above the nav bar so backdrop does not cover it */
      bottom: calc(60px + env(safe-area-inset-bottom, 0px));
      background-color: rgba(0, 0, 0, 0.55);
      z-index: 40;
    }

    .mobile-drawer {
      display: flex;
      flex-direction: column;
      position: fixed;
      left: 0;
      right: 0;
      /* Sit directly above the nav bar */
      bottom: calc(60px + env(safe-area-inset-bottom, 0px));
      /* vh fallback first, then dvh override for browsers that support it */
      height: 72vh;
      height: 72dvh;
      background-color: #1E1E1E;
      border-top: 1px solid #333333;
      z-index: 50;
      overflow: hidden;
      /* Closed: pushed down by full height, invisible */
      transform: translateY(100%);
      transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .mobile-drawer--open {
      transform: translateY(0);
    }
  }

  .drawer-handle-bar {
    display: flex;
    align-items: center;
    padding: 10px 14px 8px;
    flex-shrink: 0;
    gap: 10px;
    border-bottom: 1px solid #2A2A2A;
    min-height: 44px;
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
    display: flex;
    align-items: center;
    justify-content: center;
    -webkit-tap-highlight-color: transparent;
    /* Immune to any global min-height rules */
    width: 32px !important;
    height: 32px !important;
    min-height: unset !important;
    padding: 4px;
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
