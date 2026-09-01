<script>
  import { selectedLayer, selectedLayerId, updateLayer } from '../stores/canvas.js';

  // Reactive shorthand
  $: layer = $selectedLayer;
  $: id = $selectedLayerId;

  function update(field, value) {
    if (!id) return;
    updateLayer(id, { [field]: value });
  }

  function onTextInput(e) {
    update('text', e.target.value);
  }

  const alignOptions = [
    { value: 'left',   label: 'L' },
    { value: 'center', label: 'C' },
    { value: 'right',  label: 'R' },
  ];

  const styleOptions = [
    { value: 'normal',      label: 'N' },
    { value: 'bold',        label: 'B' },
    { value: 'italic',      label: 'I' },
    { value: 'bold italic', label: 'BI' },
  ];
</script>

{#if layer && layer.type === 'text'}
<div class="text-controls">
  <p class="section-label">ТЕКСТОВЫЙ БЛОК</p>

  <!-- Text content area -->
  <div class="field">
    <label class="field-label" for="tc-text">СОДЕРЖАНИЕ</label>
    <textarea
      id="tc-text"
      class="field-textarea"
      rows="4"
      value={layer.text}
      on:input={onTextInput}
    ></textarea>
  </div>

  <!-- Font size + auto-fit toggle -->
  <div class="field-row">
    <div class="field field--half">
      <label class="field-label" for="tc-fontsize">РАЗМЕР (px)</label>
      <input
        id="tc-fontsize"
        class="field-input"
        type="number"
        min="8"
        max="200"
        value={layer.fontSize}
        disabled={layer.autoFit}
        on:change={e => update('fontSize', Number(e.target.value))}
      />
    </div>
    <div class="field field--half">
      <span class="field-label">АВТО-ФИТ</span>
      <button
        class="toggle-btn"
        class:toggle-btn--on={layer.autoFit}
        on:click={() => update('autoFit', !layer.autoFit)}
      >
        {layer.autoFit ? 'ВКЛ' : 'ВЫКЛ'}
      </button>
    </div>
  </div>

  <!-- Text color -->
  <div class="field">
    <label class="field-label" for="tc-color">ЦВЕТ ТЕКСТА</label>
    <div class="color-row">
      <input
        id="tc-color"
        type="color"
        class="color-picker"
        value={layer.color}
        on:input={e => update('color', e.target.value)}
      />
      <span class="color-value">{layer.color}</span>
    </div>
  </div>

  <!-- Alignment -->
  <div class="field">
    <span class="field-label">ВЫРАВНИВАНИЕ</span>
    <div class="btn-group">
      {#each alignOptions as opt}
        <button
          class="option-btn"
          class:option-btn--active={layer.align === opt.value}
          on:click={() => update('align', opt.value)}
        >{opt.label}</button>
      {/each}
    </div>
  </div>

  <!-- Font style -->
  <div class="field">
    <span class="field-label">НАЧЕРТАНИЕ</span>
    <div class="btn-group">
      {#each styleOptions as opt}
        <button
          class="option-btn"
          class:option-btn--active={layer.fontStyle === opt.value}
          on:click={() => update('fontStyle', opt.value)}
        >{opt.label}</button>
      {/each}
    </div>
  </div>

  <!-- Letter spacing -->
  <div class="field">
    <label class="field-label" for="tc-spacing">ИНТЕРВАЛ (px)</label>
    <input
      id="tc-spacing"
      class="field-input"
      type="range"
      min="-2"
      max="20"
      step="0.5"
      value={layer.letterSpacing ?? 0}
      on:input={e => update('letterSpacing', Number(e.target.value))}
    />
    <span class="range-value">{layer.letterSpacing ?? 0}</span>
  </div>
</div>
{/if}

<style>
  .text-controls {
    display: flex;
    flex-direction: column;
    gap: 10px;
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

  .field-row {
    display: flex;
    gap: 8px;
  }

  .field--half {
    flex: 1;
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

  .field-input:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  .field-textarea {
    resize: vertical;
    padding: 6px 8px;
    background-color: #252525;
    border: 1px solid #333333;
    color: #E8E8E8;
    font-family: "Roboto Mono", monospace;
    font-size: 12px;
    width: 100%;
    min-height: 64px;
    line-height: 1.5;
  }

  .field-textarea:focus {
    border-color: #8B0000;
    outline: none;
  }

  .color-row {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .color-picker {
    width: 36px;
    height: 28px;
    padding: 2px;
    background-color: #252525;
    border: 1px solid #333333;
    cursor: pointer;
  }

  .color-value {
    font-family: "Roboto Mono", monospace;
    font-size: 11px;
    color: #9A9A9A;
  }

  .toggle-btn {
    height: 28px;
    padding: 0 10px;
    background-color: #252525;
    border: 1px solid #333333;
    color: #9A9A9A;
    font-family: "Roboto Mono", monospace;
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.08em;
    cursor: pointer;
    width: 100%;
    transition: all 0.1s;
  }

  .toggle-btn--on {
    background-color: #8B0000;
    border-color: #8B0000;
    color: #E8E8E8;
  }

  .btn-group {
    display: flex;
    gap: 2px;
  }

  .option-btn {
    flex: 1;
    height: 28px;
    background-color: #252525;
    border: 1px solid #333333;
    color: #9A9A9A;
    font-family: "Roboto Mono", monospace;
    font-size: 11px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.1s;
  }

  .option-btn:hover {
    background-color: #2A2A2A;
    color: #E8E8E8;
  }

  .option-btn--active {
    background-color: #8B0000;
    border-color: #8B0000;
    color: #E8E8E8;
  }

  input[type="range"] {
    width: 100%;
    accent-color: #8B0000;
    height: 4px;
    cursor: pointer;
  }

  .range-value {
    font-family: "Roboto Mono", monospace;
    font-size: 10px;
    color: #666666;
  }
</style>
