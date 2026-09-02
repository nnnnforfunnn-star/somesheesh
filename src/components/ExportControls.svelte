<script>
  import { getStage, getDisplayScale } from '../canvas/stage.js';
  import { exportCanvasToFile } from '../canvas/exportCanvas.js';
  import { clearCanvas } from '../stores/canvas.js';

  let exporting = false;
  /** @type {'png'|'jpeg'} */
  let format = 'png';
  let filename = 'casefile_post';

  async function doExport() {
    const stage = getStage();
    if (!stage) return;

    exporting = true;
    try {
      await exportCanvasToFile(stage, {
        format,
        quality: 0.95,
        filename,
        nativeWidth:  1080,
        nativeHeight: 1350,
        displayScale: getDisplayScale(),
      });
    } finally {
      exporting = false;
    }
  }

  function handleClear() {
    if (confirm('Очистить весь холст? Это действие нельзя отменить.')) {
      clearCanvas();
    }
  }
</script>

<div class="export-controls">
  <p class="section-label">ЭКСПОРТ</p>

  <!-- Filename -->
  <div class="field">
    <label class="field-label" for="exp-filename">ИМЯ ФАЙЛА</label>
    <input
      id="exp-filename"
      class="field-input"
      type="text"
      bind:value={filename}
      placeholder="casefile_post"
    />
  </div>

  <!-- Format selector -->
  <div class="format-row">
    <button
      class="format-btn"
      class:format-btn--active={format === 'png'}
      on:click={() => format = 'png'}
    >PNG</button>
    <button
      class="format-btn"
      class:format-btn--active={format === 'jpeg'}
      on:click={() => format = 'jpeg'}
    >JPEG</button>
  </div>

  <!-- Export button -->
  <button
    class="export-btn"
    on:click={doExport}
    disabled={exporting}
  >
    {#if exporting}
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" class="spin-icon">
        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5" stroke-dasharray="31.4" stroke-dashoffset="10"/>
      </svg>
      ЭКСПОРТ...
    {:else}
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        <polyline points="7 10 12 15 17 10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        <line x1="12" y1="15" x2="12" y2="3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
      </svg>
      СКАЧАТЬ {format.toUpperCase()}
    {/if}
  </button>

  <!-- Clear canvas -->
  <button class="clear-btn" on:click={handleClear}>
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
      <polyline points="3 6 5 6 21 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
    </svg>
    ОЧИСТИТЬ ХОЛСТ
  </button>
</div>

<style>
  .export-controls {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .section-label {
    font-family: "Roboto Mono", monospace;
    font-size: 9px;
    font-weight: 600;
    color: #555555;
    letter-spacing: 0.12em;
  }

  .field {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .field-label {
    font-family: "Roboto Mono", monospace;
    font-size: 9px;
    color: #666666;
    letter-spacing: 0.08em;
  }

  .field-input {
    height: 28px;
    padding: 0 8px;
    background-color: #252525;
    border: 1px solid #333333;
    color: #E8E8E8;
    font-family: "Roboto Mono", monospace;
    font-size: 12px;
    width: 100%;
  }

  .field-input:focus {
    border-color: #8B0000;
    outline: none;
  }

  .format-row {
    display: flex;
    gap: 4px;
  }

  .format-btn {
    flex: 1;
    height: 26px;
    background-color: #252525;
    border: 1px solid #333333;
    color: #9A9A9A;
    font-family: "Roboto Mono", monospace;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.08em;
    cursor: pointer;
    transition: all 0.1s;
  }

  .format-btn:hover {
    color: #E8E8E8;
  }

  .format-btn--active {
    background-color: #333333;
    border-color: #555555;
    color: #E8E8E8;
  }

  .export-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    height: 36px;
    width: 100%;
    background-color: #8B0000;
    border: none;
    color: #E8E8E8;
    font-family: "Roboto Mono", monospace;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.1em;
    cursor: pointer;
    transition: background-color 0.1s;
  }

  .export-btn:hover:not(:disabled) {
    background-color: #A01010;
  }

  .export-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .clear-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    height: 26px;
    width: 100%;
    background-color: transparent;
    border: 1px solid #333333;
    color: #555555;
    font-family: "Roboto Mono", monospace;
    font-size: 10px;
    letter-spacing: 0.08em;
    cursor: pointer;
    transition: all 0.1s;
  }

  .clear-btn:hover {
    border-color: #8B0000;
    color: #8B0000;
  }

  @keyframes spin {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }

  .spin-icon {
    animation: spin 0.8s linear infinite;
  }
</style>
