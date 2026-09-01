<script>
  import { activeTool, addLayer, makeTextLayer, makeRedactionLayer } from '../stores/canvas.js';

  const tools = [
    {
      id: 'select',
      label: 'ВЫБОР',
      title: 'Инструмент выбора',
      // Arrow/cursor icon
      icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M5 3l14 9-7 1-4 7L5 3z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>`,
    },
    {
      id: 'text',
      label: 'ТЕКСТ',
      title: 'Добавить текстовый блок',
      // Type/text icon
      icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <polyline points="4 7 4 4 20 4 20 7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        <line x1="9" y1="20" x2="15" y2="20" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        <line x1="12" y1="4" x2="12" y2="20" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
      </svg>`,
    },
    {
      id: 'redact',
      label: 'МАРКЕР',
      title: 'Наложить цензуру (чёрный прямоугольник)',
      // Square/block icon
      icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="3" y="8" width="18" height="8" rx="1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        <line x1="7" y1="12" x2="17" y2="12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
      </svg>`,
    },
  ];

  function selectTool(id) {
    activeTool.set(id);
    // When switching to text tool, immediately add a text layer
    if (id === 'text') {
      addLayer(makeTextLayer({ x: 100, y: 200 }));
      activeTool.set('select');
    }
    // When switching to redact, add a redaction block
    if (id === 'redact') {
      addLayer(makeRedactionLayer({ x: 150, y: 300, width: 400, height: 48 }));
      activeTool.set('select');
    }
  }
</script>

<div class="toolbar">
  <p class="section-label">ИНСТРУМЕНТЫ</p>
  <div class="tool-buttons">
    {#each tools as tool}
      <button
        class="tool-btn"
        class:tool-btn--active={$activeTool === tool.id}
        title={tool.title}
        on:click={() => selectTool(tool.id)}
      >
        <span class="tool-icon">{@html tool.icon}</span>
        <span class="tool-label">{tool.label}</span>
      </button>
    {/each}
  </div>
</div>

<style>
  .toolbar {
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
    text-transform: uppercase;
  }

  .tool-buttons {
    display: flex;
    gap: 4px;
  }

  .tool-btn {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 5px;
    padding: 8px 4px;
    background-color: #252525;
    border: 1px solid #333333;
    color: #9A9A9A;
    cursor: pointer;
    transition: background-color 0.1s, color 0.1s, border-color 0.1s;
  }

  .tool-btn:hover {
    background-color: #2A2A2A;
    color: #E8E8E8;
    border-color: #444444;
  }

  .tool-btn--active {
    background-color: #8B0000;
    color: #E8E8E8;
    border-color: #8B0000;
  }

  .tool-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    color: currentColor;
  }

  .tool-label {
    font-family: "Roboto Mono", monospace;
    font-size: 9px;
    font-weight: 600;
    letter-spacing: 0.08em;
    color: currentColor;
  }
</style>
