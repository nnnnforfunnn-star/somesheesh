<script>
  import {
    layers,
    sortedLayers,
    selectedLayerId,
    selectedLayer,
    removeLayer,
    updateLayer,
    bringForward,
    sendBackward,
    duplicateLayer,
    LAYER_TYPES,
  } from '../stores/canvas.js';
  import { selectLayer } from '../canvas/stage.js';

  const typeLabels = {
    [LAYER_TYPES.TEXT]:      'TXT',
    [LAYER_TYPES.IMAGE]:     'IMG',
    [LAYER_TYPES.REDACTION]: 'RDC',
    [LAYER_TYPES.SHAPE]:     'SHP',
    [LAYER_TYPES.LINE]:      'LNE',
  };

  function toggleVisibility(id, current) {
    updateLayer(id, { visible: !current });
  }

  function toggleLock(id, current) {
    updateLayer(id, { locked: !current });
  }

  // Derived: reversed so top layer shows first in list
  $: reversedLayers = [...$sortedLayers].reverse();
</script>

<div class="layer-list-wrapper">
  <p class="section-label">СЛОИ ({$layers.length})</p>

  <div class="layer-list">
    {#if $layers.length === 0}
      <p class="empty-msg">Холст пуст. Добавьте элементы.</p>
    {:else}
      {#each reversedLayers as layer (layer.id)}
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <div
          class="layer-item"
          class:layer-item--selected={$selectedLayerId === layer.id}
          class:layer-item--hidden={!layer.visible}
          role="option"
          aria-selected={$selectedLayerId === layer.id}
          tabindex="0"
          on:click={() => selectLayer(layer.id)}
          on:keydown={e => e.key === 'Enter' && selectLayer(layer.id)}
        >
          <!-- Type badge -->
          <span class="layer-type">{typeLabels[layer.type] ?? '???'}</span>

          <!-- Layer name / preview -->
          <span class="layer-name">
            {#if layer.type === LAYER_TYPES.TEXT}
              {layer.text?.slice(0, 20)}{layer.text?.length > 20 ? '...' : ''}
            {:else if layer.type === LAYER_TYPES.IMAGE}
              {layer.isPolaroid ? '[POL] ' : ''}{layer.text || 'Изображение'}
            {:else if layer.type === LAYER_TYPES.REDACTION}
              Цензура
            {:else}
              Слой
            {/if}
          </span>

          <!-- Controls -->
          <div class="layer-actions">
            <!-- Visibility toggle -->
            <button
              class="icon-btn"
              title={layer.visible ? 'Скрыть слой' : 'Показать слой'}
              on:click|stopPropagation={() => toggleVisibility(layer.id, layer.visible)}
            >
              {#if layer.visible}
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" stroke-width="1.5"/>
                  <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.5"/>
                </svg>
              {:else}
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                  <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                  <line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                </svg>
              {/if}
            </button>

            <!-- Lock toggle -->
            <button
              class="icon-btn"
              title={layer.locked ? 'Разблокировать' : 'Заблокировать'}
              on:click|stopPropagation={() => toggleLock(layer.id, layer.locked)}
            >
              {#if layer.locked}
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" stroke-width="1.5"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                </svg>
              {:else}
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" stroke-width="1.5"/>
                  <path d="M7 11V7a5 5 0 0 1 9.9-1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                </svg>
              {/if}
            </button>

            <!-- Bring forward -->
            <button
              class="icon-btn"
              title="Переместить вверх"
              on:click|stopPropagation={() => bringForward(layer.id)}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                <polyline points="18 15 12 9 6 15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>

            <!-- Send backward -->
            <button
              class="icon-btn"
              title="Переместить вниз"
              on:click|stopPropagation={() => sendBackward(layer.id)}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                <polyline points="6 9 12 15 18 9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>

            <!-- Duplicate -->
            <button
              class="icon-btn"
              title="Дублировать слой"
              on:click|stopPropagation={() => duplicateLayer(layer.id)}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                <rect x="9" y="9" width="13" height="13" rx="2" stroke="currentColor" stroke-width="1.5"/>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
            </button>

            <!-- Delete -->
            <button
              class="icon-btn icon-btn--danger"
              title="Удалить слой"
              on:click|stopPropagation={() => removeLayer(layer.id)}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                <polyline points="3 6 5 6 21 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                <path d="M10 11v6M14 11v6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
            </button>
          </div>
        </div>
      {/each}
    {/if}
  </div>
</div>

<style>
  .layer-list-wrapper {
    display: flex;
    flex-direction: column;
    gap: 8px;
    height: 100%;
    min-height: 0;
  }

  .section-label {
    font-family: "Roboto Mono", monospace;
    font-size: 9px;
    font-weight: 600;
    color: #555555;
    letter-spacing: 0.12em;
    flex-shrink: 0;
  }

  .layer-list {
    flex: 1;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-height: 0;
  }

  .empty-msg {
    font-family: "Roboto Mono", monospace;
    font-size: 11px;
    color: #444444;
    padding: 12px 0;
    text-align: center;
  }

  .layer-item {
    display: flex;
    align-items: center;
    gap: 6px;
    height: 30px;
    padding: 0 4px 0 8px;
    background-color: #252525;
    border: 1px solid transparent;
    cursor: pointer;
    transition: background-color 0.1s, border-color 0.1s;
    flex-shrink: 0;
  }

  .layer-item:hover {
    background-color: #2A2A2A;
    border-color: #333333;
  }

  .layer-item--selected {
    background-color: #1A0000;
    border-color: #8B0000;
  }

  .layer-item--hidden {
    opacity: 0.5;
  }

  .layer-type {
    font-family: "Roboto Mono", monospace;
    font-size: 9px;
    font-weight: 700;
    color: #8B0000;
    letter-spacing: 0.06em;
    min-width: 26px;
    flex-shrink: 0;
  }

  .layer-name {
    flex: 1;
    font-family: "Roboto Mono", monospace;
    font-size: 10px;
    color: #9A9A9A;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .layer-item--selected .layer-name {
    color: #E8E8E8;
  }

  .layer-actions {
    display: flex;
    gap: 1px;
    flex-shrink: 0;
  }

  .icon-btn {
    width: 22px;
    height: 22px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: none;
    border: none;
    color: #555555;
    cursor: pointer;
    transition: color 0.1s;
    padding: 0;
  }

  .icon-btn:hover {
    color: #E8E8E8;
  }

  .icon-btn--danger:hover {
    color: #8B0000;
  }
</style>
