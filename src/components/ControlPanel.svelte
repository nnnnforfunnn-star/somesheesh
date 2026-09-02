<script>
  import ToolBar from './ToolBar.svelte';
  import TextControls from './TextControls.svelte';
  import ImageUpload from './ImageUpload.svelte';
  import ThemeSelector from './ThemeSelector.svelte';
  import CanvasSettingsPanel from './CanvasSettingsPanel.svelte';
  import LayerList from './LayerList.svelte';
  import ExportControls from './ExportControls.svelte';
  import SmartGenerator from './SmartGenerator.svelte';
  import { activeTool, selectedLayer } from '../stores/canvas.js';

  // Show text controls only when a text layer is selected or text tool is active
  $: showTextControls = $activeTool === 'text' || ($selectedLayer && $selectedLayer.type === 'text');
</script>

<aside class="control-panel">
  <!-- SMART GENERATOR -->
  <section class="panel-section" style="background-color: #1A0000; border-bottom: 2px solid #8B0000;">
    <SmartGenerator />
  </section>

  <!-- Tool selection -->
  <section class="panel-section">
    <ToolBar />
  </section>

  <div class="panel-divider"></div>

  <!-- Text controls (conditional) -->
  {#if showTextControls}
    <section class="panel-section">
      <TextControls />
    </section>
    <div class="panel-divider"></div>
  {/if}

  <!-- Image upload & Evidence Board preset -->
  <section class="panel-section">
    <ImageUpload />
  </section>

  <div class="panel-divider"></div>

  <!-- Theme selector -->
  <section class="panel-section">
    <ThemeSelector />
  </section>

  <div class="panel-divider"></div>

  <!-- Canvas texture/settings -->
  <section class="panel-section">
    <CanvasSettingsPanel />
  </section>

  <div class="panel-divider"></div>

  <!-- Layer list (scrollable, takes remaining space) -->
  <section class="panel-section panel-section--grow">
    <LayerList />
  </section>

  <div class="panel-divider"></div>

  <!-- Export -->
  <section class="panel-section">
    <ExportControls />
  </section>
</aside>

<style>
  .control-panel {
    width: 300px;
    min-width: 300px;
    height: 100%;
    background-color: #1E1E1E;
    border-right: 1px solid #2A2A2A;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    flex-shrink: 0;
  }

  .panel-section {
    padding: 12px 14px;
    flex-shrink: 0;
  }

  .panel-section--grow {
    flex: 1;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    min-height: 0;
  }

  .panel-divider {
    height: 1px;
    background-color: #2A2A2A;
    flex-shrink: 0;
  }
</style>
