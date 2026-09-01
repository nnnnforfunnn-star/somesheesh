<script>
  // Header component: app title bar
</script>

<header class="header">
  <div class="header-left">
    <svg class="logo-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" stroke="#8B0000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" stroke="#8B0000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      <line x1="12" y1="22.08" x2="12" y2="12" stroke="#8B0000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
    <span class="app-title">CASEFILE</span>
    <span class="app-subtitle">/ True Crime Post Constructor</span>
  </div>

  <div class="header-right">
    <span class="canvas-info">1080 x 1350 px</span>
    <div class="status-dot"></div>
  </div>
</header>

<style>
  .header {
    height: 44px;
    background-color: #1E1E1E;
    border-bottom: 1px solid #2A2A2A;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 16px;
    flex-shrink: 0;
    user-select: none;
  }

  .header-left {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .logo-icon {
    flex-shrink: 0;
  }

  .app-title {
    font-family: "Roboto Mono", monospace;
    font-size: 14px;
    font-weight: 700;
    color: #E8E8E8;
    letter-spacing: 0.15em;
  }

  .app-subtitle {
    font-family: "Roboto Mono", monospace;
    font-size: 11px;
    font-weight: 400;
    color: #555555;
    letter-spacing: 0.05em;
  }

  .header-right {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .canvas-info {
    font-family: "Roboto Mono", monospace;
    font-size: 11px;
    color: #555555;
    letter-spacing: 0.05em;
  }

  .status-dot {
    width: 6px;
    height: 6px;
    background-color: #8B0000;
    border-radius: 50%;
  }
</style>
