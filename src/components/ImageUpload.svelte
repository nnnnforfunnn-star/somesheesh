<script>
  import { addLayer, makeImageLayer, layers } from '../stores/canvas.js';
  import { getPolaroidRotation } from '../canvas/polaroid.js';

  let fileInputEl;
  let evidenceModeActive = false;

  function triggerFileInput() {
    fileInputEl.click();
  }

  function onFileSelected(e) {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      if (!file.type.startsWith('image/')) return;

      const reader = new FileReader();
      reader.onload = (ev) => {
        const src = ev.target.result;
        addLayer(makeImageLayer({
          src,
          x:          100 + Math.random() * 200,
          y:          100 + Math.random() * 200,
          width:      380,
          height:     380,
          isPolaroid: evidenceModeActive,
          text:       file.name.replace(/\.[^.]+$/, ''),
        }));
      };
      reader.readAsDataURL(file);
    });

    // Reset input so the same file can be re-selected
    e.target.value = '';
  }

  function toggleEvidenceMode() {
    evidenceModeActive = !evidenceModeActive;
  }

  // Apply/remove Evidence Board to all existing image layers
  function applyEvidenceBoard() {
    layers.update($layers =>
      $layers.map(l => {
        if (l.type !== 'image') return l;
        const rot = getPolaroidRotation(l.id);
        return {
          ...l,
          isPolaroid:       evidenceModeActive,
          polaroidRotation: evidenceModeActive ? rot : 0,
        };
      })
    );
  }

  $: if (typeof evidenceModeActive !== 'undefined') {
    // Reactive: when mode changes apply to all layers
    applyEvidenceBoard();
  }
</script>

<div class="image-upload">
  <p class="section-label">ИЗОБРАЖЕНИЯ</p>

  <!-- Hidden file input -->
  <input
    bind:this={fileInputEl}
    type="file"
    accept="image/*"
    multiple
    class="hidden-input"
    on:change={onFileSelected}
  />

  <!-- Upload button -->
  <button class="upload-btn" on:click={triggerFileInput}>
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      <polyline points="17 8 12 3 7 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      <line x1="12" y1="3" x2="12" y2="15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
    ЗАГРУЗИТЬ ФОТО
  </button>

  <!-- Evidence Board toggle -->
  <div class="evidence-toggle">
    <button
      class="evidence-btn"
      class:evidence-btn--active={evidenceModeActive}
      on:click={toggleEvidenceMode}
      title="Включить режим доски улик: Polaroid рамки + случайный наклон + красная нить"
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="3" y="3" width="18" height="18" rx="1" stroke="currentColor" stroke-width="1.5"/>
        <rect x="6" y="6" width="12" height="10" stroke="currentColor" stroke-width="1"/>
        <line x1="6" y1="19" x2="18" y2="19" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      </svg>
      ДОСКА УЛИК
      <span class="evidence-status">{evidenceModeActive ? 'ВКЛ' : 'ВЫКЛ'}</span>
    </button>
  </div>
</div>

<style>
  .image-upload {
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

  .hidden-input {
    display: none;
  }

  .upload-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    height: 34px;
    width: 100%;
    background-color: #252525;
    border: 1px dashed #444444;
    color: #9A9A9A;
    font-family: "Roboto Mono", monospace;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.08em;
    cursor: pointer;
    transition: all 0.1s;
  }

  .upload-btn:hover {
    background-color: #2A2A2A;
    color: #E8E8E8;
    border-color: #8B0000;
  }

  .evidence-toggle {
    display: flex;
  }

  .evidence-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    height: 30px;
    width: 100%;
    padding: 0 10px;
    background-color: #252525;
    border: 1px solid #333333;
    color: #9A9A9A;
    font-family: "Roboto Mono", monospace;
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.08em;
    cursor: pointer;
    transition: all 0.1s;
  }

  .evidence-btn:hover {
    background-color: #2A2A2A;
    color: #E8E8E8;
  }

  .evidence-btn--active {
    background-color: #1A0000;
    border-color: #8B0000;
    color: #D2B48C;
  }

  .evidence-status {
    margin-left: auto;
    font-size: 9px;
    color: inherit;
    opacity: 0.7;
  }
</style>
