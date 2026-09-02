<script>
  import { generatePost } from '../lib/layoutEngine.js';

  let rawText = '';
  /** @type {HTMLInputElement} */
  let fileInputEl;
  /** @type {File[]} */
  let selectedFiles = [];
  let isGenerating = false;

  /** @param {Event} e */
  function onFileSelected(e) {
    const target = /** @type {HTMLInputElement} */ (e.target);
    if (!target.files) return;
    selectedFiles = Array.from(target.files).filter(f => f.type.startsWith('image/'));
  }

  async function handleGenerate() {
    if (!rawText.trim() && selectedFiles.length === 0) return;
    
    isGenerating = true;
    try {
      await generatePost(rawText, selectedFiles);
      // Reset after generation
      rawText = '';
      selectedFiles = [];
      if (fileInputEl) fileInputEl.value = '';
    } catch (e) {
      console.error(e);
      alert('Ошибка при генерации поста');
    } finally {
      isGenerating = false;
    }
  }
</script>

<div class="smart-generator">
  <p class="section-label">СМАРТ-ГЕНЕРАТОР (АВТОМАТИКА)</p>
  
  <textarea
    class="raw-text-input"
    bind:value={rawText}
    placeholder="Вставьте весь текст дела сюда. Движок сам разобьет его на слайды..."
  ></textarea>

  <div class="file-row">
    <button class="file-btn" on:click={() => fileInputEl.click()}>
      ВЫБРАТЬ ФОТО ({selectedFiles.length})
    </button>
    <input
      bind:this={fileInputEl}
      type="file"
      accept="image/*"
      multiple
      class="hidden-input"
      on:change={onFileSelected}
    />
  </div>

  <button 
    class="generate-btn" 
    on:click={handleGenerate} 
    disabled={isGenerating || (!rawText.trim() && selectedFiles.length === 0)}
  >
    {isGenerating ? 'ГЕНЕРАЦИЯ...' : 'СОЗДАТЬ ПОСТ'}
  </button>
</div>

<style>
  .smart-generator {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding-bottom: 8px;
  }

  .section-label {
    font-family: "Roboto Mono", monospace;
    font-size: 9px;
    font-weight: 700;
    color: #D2B48C;
    letter-spacing: 0.12em;
  }

  .raw-text-input {
    min-height: 80px;
    background-color: #121212;
    border: 1px solid #333333;
    color: #E8E8E8;
    padding: 8px;
    font-size: 11px;
    resize: vertical;
  }

  .raw-text-input:focus {
    border-color: #D2B48C;
  }

  .hidden-input {
    display: none;
  }

  .file-row {
    display: flex;
  }

  .file-btn {
    flex: 1;
    height: 30px;
    background-color: #252525;
    border: 1px solid #333333;
    color: #9A9A9A;
    font-family: "Roboto Mono", monospace;
    font-size: 10px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.15s;
  }

  .file-btn:hover {
    background-color: #2A2A2A;
    color: #E8E8E8;
    border-color: #555555;
  }

  .generate-btn {
    height: 36px;
    background-color: #D2B48C;
    color: #121212;
    border: none;
    font-family: "Roboto Mono", monospace;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.08em;
    cursor: pointer;
    transition: all 0.15s;
  }

  .generate-btn:hover:not(:disabled) {
    background-color: #B89A72;
  }

  .generate-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
</style>
