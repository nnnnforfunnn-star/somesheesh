<script>
  import { canvasSettings } from '../stores/canvas.js';

  function toggle(field) {
    canvasSettings.update(s => ({ ...s, [field]: !s[field] }));
  }

  function setOpacity(e) {
    canvasSettings.update(s => ({ ...s, textureOpacity: Number(e.target.value) }));
  }
</script>

<div class="canvas-settings">
  <p class="section-label">НАСТРОЙКИ ХОЛСТА</p>

  <!-- Texture toggle -->
  <div class="setting-row">
    <span class="setting-label">ТЕКСТУРА БУМАГИ</span>
    <button
      class="toggle-btn"
      class:toggle-btn--on={$canvasSettings.showTexture}
      on:click={() => toggle('showTexture')}
    >
      {$canvasSettings.showTexture ? 'ВКЛ' : 'ВЫКЛ'}
    </button>
  </div>

  <!-- Texture opacity (only shown when texture is on) -->
  {#if $canvasSettings.showTexture}
    <div class="setting-row setting-row--col">
      <span class="setting-label">ПРОЗРАЧНОСТЬ ТЕКСТУРЫ</span>
      <div class="range-row">
        <input
          type="range"
          min="0"
          max="0.5"
          step="0.01"
          value={$canvasSettings.textureOpacity}
          on:input={setOpacity}
          class="range-input"
        />
        <span class="range-val">{Math.round($canvasSettings.textureOpacity * 100)}%</span>
      </div>
    </div>
  {/if}
</div>

<style>
  .canvas-settings {
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

  .setting-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
  }

  .setting-row--col {
    flex-direction: column;
    align-items: flex-start;
  }

  .setting-label {
    font-family: "Roboto Mono", monospace;
    font-size: 10px;
    color: #9A9A9A;
    letter-spacing: 0.06em;
  }

  .toggle-btn {
    height: 24px;
    padding: 0 12px;
    background-color: #252525;
    border: 1px solid #333333;
    color: #9A9A9A;
    font-family: "Roboto Mono", monospace;
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.08em;
    cursor: pointer;
    transition: all 0.1s;
    flex-shrink: 0;
  }

  .toggle-btn--on {
    background-color: #8B0000;
    border-color: #8B0000;
    color: #E8E8E8;
  }

  .range-row {
    display: flex;
    align-items: center;
    gap: 8px;
    width: 100%;
  }

  .range-input {
    flex: 1;
    accent-color: #8B0000;
    cursor: pointer;
  }

  .range-val {
    font-family: "Roboto Mono", monospace;
    font-size: 10px;
    color: #666666;
    min-width: 32px;
    text-align: right;
  }
</style>
