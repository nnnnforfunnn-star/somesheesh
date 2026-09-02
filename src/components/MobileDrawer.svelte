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
  import SmartGenerator from './SmartGenerator.svelte';

  function handleBackdropClick() {
    closeDrawer();
  }

  /** @param {Event} e */
  function stopPropagation(e) {
    e.stopPropagation();
  }

  /** @type {Record<string, string>} */
  const tabTitles = {
    generate: 'СМАРТ-ГЕНЕРАТОР',
    tools:  'ИНСТРУМЕНТЫ',
    text:   'ТЕКСТ',
    images: 'ИЗОБРАЖЕНИЯ',
    theme:  'ТЕМА И ХОЛСТ',
    layers: 'СЛОИ',
    export: 'ЭКСПОРТ',
  };
</script>

<!--
  This component is only mounted by App.svelte when isMobile is true.
  Uses position:fixed to overlay the canvas when open.
  The drawer sits above the MobileNav (bottom: 60px).
-->

{#if $drawerOpen}
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div class="drawer-backdrop" on:click={handleBackdropClick} aria-hidden="true"></div>
{/if}

<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<aside
  class="mobile-drawer"
  class:mobile-drawer--open={$drawerOpen}
  on:touchstart={stopPropagation}
  on:touchmove={stopPropagation}
  aria-hidden={!$drawerOpen}
  aria-label={$activeMobileTab ? tabTitles[$activeMobileTab] : 'Панель'}
>
  <div class="drawer-handle-bar">
    <span class="drawer-title">{$activeMobileTab ? tabTitles[$activeMobileTab] : ''}</span>
    <button class="drawer-close" on:click={closeDrawer} aria-label="Закрыть">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      </svg>
    </button>
  </div>

  <div class="drawer-content">
    {#if $activeMobileTab === 'generate'}
      <div class="drawer-section" style="background-color: #1A0000;"><SmartGenerator /></div>
    {:else if $activeMobileTab === 'tools'}
      <div class="drawer-section"><ToolBar /></div>
    {:else if $activeMobileTab === 'text'}
      <div class="drawer-section">
        {#if $selectedLayer?.type === 'text'}
          <TextControls />
        {:else}
          <p class="drawer-hint">Выберите текстовый слой на холсте или добавьте новый через ИНСТРУМЕНТЫ.</p>
        {/if}
      </div>
    {:else if $activeMobileTab === 'images'}
      <div class="drawer-section"><ImageUpload /></div>
    {:else if $activeMobileTab === 'theme'}
      <div class="drawer-section">
        <ThemeSelector />
        <div class="drawer-divider"></div>
        <CanvasSettingsPanel />
      </div>
    {:else if $activeMobileTab === 'layers'}
      <div class="drawer-section drawer-section--layers"><LayerList /></div>
    {:else if $activeMobileTab === 'export'}
      <div class="drawer-section"><ExportControls /></div>
    {/if}
  </div>
</aside>

<style>
  /* Backdrop covers canvas but NOT the nav bar below */
  .drawer-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: calc(60px + env(safe-area-inset-bottom, 0px));
    background-color: rgba(0, 0, 0, 0.6);
    z-index: 40;
  }

  /*
    Drawer: fixed position, sits 60px from the bottom (above the nav bar).
    Uses vh as the primary unit — supported everywhere.
    dvh would be ideal but is not supported on all Android browsers.
  */
  .mobile-drawer {
    position: fixed;
    left: 0;
    right: 0;
    bottom: calc(60px + env(safe-area-inset-bottom, 0px));
    height: 70vh;
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
    padding: 12px 16px;
    flex-shrink: 0;
    gap: 10px;
    border-bottom: 1px solid #2A2A2A;
    background-color: #252525;
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
    color: #666666;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    -webkit-tap-highlight-color: transparent;
    width: 36px;
    height: 36px;
    padding: 8px;
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
    padding: 12px 0;
    text-align: center;
  }
</style>
