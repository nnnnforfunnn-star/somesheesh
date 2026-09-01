<script>
  import { activeMobileTab, drawerOpen, toggleTab } from '../stores/mobile.js';
  import { layers, selectedLayer } from '../stores/canvas.js';

  const tabs = [
    {
      id: 'tools',
      label: 'ИНСТРУМ.',
      icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    },
    {
      id: 'text',
      label: 'ТЕКСТ',
      icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><polyline points="4 7 4 4 20 4 20 7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><line x1="9" y1="20" x2="15" y2="20" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><line x1="12" y1="4" x2="12" y2="20" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`,
    },
    {
      id: 'images',
      label: 'ФОТО',
      icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" stroke-width="1.5"/><circle cx="8.5" cy="8.5" r="1.5" stroke="currentColor" stroke-width="1.5"/><polyline points="21 15 16 10 5 21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    },
    {
      id: 'theme',
      label: 'ТЕМА',
      icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5"/><path d="M12 2a10 10 0 0 1 0 20" fill="currentColor" opacity="0.25"/></svg>`,
    },
    {
      id: 'layers',
      label: 'СЛОИ',
      icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><polygon points="12 2 2 7 12 12 22 7 12 2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><polyline points="2 17 12 22 22 17" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><polyline points="2 12 12 17 22 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    },
    {
      id: 'export',
      label: 'ЭКСПОРТ',
      icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><polyline points="7 10 12 15 17 10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><line x1="12" y1="15" x2="12" y2="3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`,
    },
  ];

  $: layerCount = $layers.length;
  $: hasTextSelected = $selectedLayer?.type === 'text';
</script>

<!--
  This component is only mounted by App.svelte when isMobile is true.
  No CSS show/hide needed — it is always visible when in the DOM.
  It sits at the bottom of the flex column in .app-shell.
-->
<nav class="mobile-nav" aria-label="Навигация по панелям">
  {#each tabs as tab}
    <button
      class="nav-tab"
      class:nav-tab--active={$activeMobileTab === tab.id && $drawerOpen}
      class:nav-tab--highlight={tab.id === 'text' && hasTextSelected}
      on:click={() => toggleTab(tab.id)}
      aria-label={tab.label}
      aria-pressed={$activeMobileTab === tab.id && $drawerOpen}
    >
      <span class="tab-icon">{@html tab.icon}</span>
      <span class="tab-label">{tab.label}</span>
      {#if tab.id === 'layers' && layerCount > 0}
        <span class="tab-badge">{layerCount}</span>
      {/if}
    </button>
  {/each}
</nav>

<style>
  .mobile-nav {
    display: flex;
    flex-shrink: 0;
    width: 100%;
    background-color: #1E1E1E;
    border-top: 2px solid #8B0000;
    /* Fixed 60px content height + safe area below for notched phones */
    padding-bottom: env(safe-area-inset-bottom, 0px);
  }

  .nav-tab {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 4px;
    background: none;
    border: none;
    color: #555555;
    cursor: pointer;
    position: relative;
    transition: color 0.15s, background-color 0.1s;
    padding: 10px 2px;
    height: 60px;
    min-height: 60px;
    -webkit-tap-highlight-color: transparent;
  }

  .nav-tab:active {
    background-color: #252525;
  }

  .nav-tab--active {
    color: #8B0000;
    background-color: #1A0000;
  }

  .nav-tab--active::after {
    content: '';
    position: absolute;
    top: 0;
    left: 8%;
    right: 8%;
    height: 2px;
    background-color: #8B0000;
  }

  .nav-tab--highlight {
    color: #D2B48C;
  }

  .tab-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    color: currentColor;
    flex-shrink: 0;
  }

  .tab-label {
    font-family: "Roboto Mono", monospace;
    font-size: 8px;
    font-weight: 600;
    letter-spacing: 0.04em;
    color: currentColor;
    white-space: nowrap;
    flex-shrink: 0;
    line-height: 1;
  }

  .tab-badge {
    position: absolute;
    top: 8px;
    right: calc(50% - 16px);
    background-color: #8B0000;
    color: #E8E8E8;
    font-family: "Roboto Mono", monospace;
    font-size: 8px;
    font-weight: 700;
    min-width: 14px;
    height: 14px;
    border-radius: 7px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 3px;
  }
</style>
