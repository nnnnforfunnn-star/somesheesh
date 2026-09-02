<script>
  import { slides, currentSlideIndex, addSlide, nextSlide, prevSlide, removeSlide } from '../stores/canvas.js';

  $: totalSlides = $slides.length;
  $: currentIndex = $currentSlideIndex;
</script>

<div class="slide-nav">
  <button class="nav-btn" on:click={prevSlide} disabled={currentIndex === 0} aria-label="Предыдущий слайд">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <polyline points="15 18 9 12 15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  </button>

  <span class="slide-counter">СЛАЙД {currentIndex + 1} / {totalSlides}</span>

  <button class="nav-btn" on:click={nextSlide} disabled={currentIndex === totalSlides - 1} aria-label="Следующий слайд">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <polyline points="9 18 15 12 9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  </button>

  <div class="divider"></div>

  <button class="action-btn" on:click={addSlide} aria-label="Новый слайд" title="Добавить слайд">
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    </svg>
    ДОБАВИТЬ
  </button>

  <button class="action-btn action-btn--danger" on:click={() => removeSlide(currentIndex)} disabled={totalSlides <= 1} aria-label="Удалить слайд" title="Удалить текущий слайд">
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    </svg>
    УДАЛИТЬ
  </button>
</div>

<style>
  .slide-nav {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 12px;
    background-color: #1E1E1E;
    border-top: 1px solid #2A2A2A;
    width: 100%;
    z-index: 10;
  }

  .nav-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    background-color: #252525;
    border: 1px solid #333333;
    color: #E8E8E8;
    cursor: pointer;
    transition: all 0.15s;
  }

  .nav-btn:hover:not(:disabled) {
    background-color: #8B0000;
    border-color: #8B0000;
  }

  .nav-btn:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }

  .slide-counter {
    font-family: "Roboto Mono", monospace;
    font-size: 11px;
    font-weight: 600;
    color: #9A9A9A;
    min-width: 90px;
    text-align: center;
    letter-spacing: 0.05em;
  }

  .divider {
    width: 1px;
    height: 20px;
    background-color: #333333;
    margin: 0 4px;
  }

  .action-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    height: 32px;
    padding: 0 12px;
    background-color: transparent;
    border: 1px solid #333333;
    color: #9A9A9A;
    font-family: "Roboto Mono", monospace;
    font-size: 10px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.15s;
  }

  .action-btn:hover:not(:disabled) {
    background-color: #252525;
    color: #E8E8E8;
    border-color: #555555;
  }

  .action-btn--danger:hover:not(:disabled) {
    background-color: #1A0000;
    color: #CC2222;
    border-color: #8B0000;
  }

  .action-btn:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
</style>
