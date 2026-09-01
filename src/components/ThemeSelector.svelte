<script>
  import { currentThemeId, THEMES, setTheme } from '../stores/theme.js';

  const themeList = Object.values(THEMES);
</script>

<div class="theme-selector">
  <p class="section-label">ТЕМА ОФОРМЛЕНИЯ</p>

  <div class="theme-list">
    {#each themeList as theme}
      <button
        class="theme-btn"
        class:theme-btn--active={$currentThemeId === theme.id}
        on:click={() => setTheme(theme.id)}
        title={theme.description}
      >
        <!-- Color swatch -->
        <span
          class="theme-swatch"
          style:background-color={theme.backgroundColor}
          style:border-color={theme.accentColor}
        ></span>
        <div class="theme-info">
          <span class="theme-name">{theme.label}</span>
          <span class="theme-desc">{theme.description}</span>
        </div>
        {#if $currentThemeId === theme.id}
          <svg class="theme-check" width="12" height="12" viewBox="0 0 24 24" fill="none">
            <polyline points="20 6 9 17 4 12" stroke="#8B0000" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        {/if}
      </button>
    {/each}
  </div>
</div>

<style>
  .theme-selector {
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

  .theme-list {
    display: flex;
    flex-direction: column;
    gap: 3px;
  }

  .theme-btn {
    display: flex;
    align-items: center;
    gap: 10px;
    height: 38px;
    padding: 0 10px;
    background-color: #252525;
    border: 1px solid #333333;
    color: #9A9A9A;
    cursor: pointer;
    transition: all 0.1s;
    text-align: left;
    width: 100%;
  }

  .theme-btn:hover {
    background-color: #2A2A2A;
    border-color: #444444;
    color: #E8E8E8;
  }

  .theme-btn--active {
    background-color: #1A0000;
    border-color: #8B0000;
    color: #E8E8E8;
  }

  .theme-swatch {
    width: 20px;
    height: 20px;
    flex-shrink: 0;
    border: 1px solid;
    display: block;
  }

  .theme-info {
    display: flex;
    flex-direction: column;
    gap: 2px;
    flex: 1;
  }

  .theme-name {
    font-family: "Roboto Mono", monospace;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.08em;
    color: inherit;
  }

  .theme-desc {
    font-family: "Roboto Mono", monospace;
    font-size: 9px;
    color: #666666;
    letter-spacing: 0.04em;
  }

  .theme-check {
    flex-shrink: 0;
  }
</style>
