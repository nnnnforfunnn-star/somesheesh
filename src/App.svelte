<script>
  import ControlPanel from './components/ControlPanel.svelte';
  import CanvasPanel from './components/CanvasPanel.svelte';
  import Header from './components/Header.svelte';
  import MobileNav from './components/MobileNav.svelte';
  import MobileDrawer from './components/MobileDrawer.svelte';
</script>

<div class="app-shell">
  <Header />

  <main class="workspace">
    <!-- Desktop: side panel (hidden on mobile via CSS) -->
    <div class="desktop-panel">
      <ControlPanel />
    </div>

    <!-- Canvas: always visible -->
    <CanvasPanel />
  </main>

  <!-- Mobile: slide-up drawer + bottom nav (hidden on desktop via CSS) -->
  <div class="mobile-ui">
    <MobileDrawer />
    <MobileNav />
  </div>
</div>

<style>
  .app-shell {
    display: flex;
    flex-direction: column;
    height: 100dvh; /* dynamic viewport height for mobile browsers */
    width: 100vw;
    overflow: hidden;
    background-color: #121212;
  }

  .workspace {
    display: flex;
    flex: 1;
    overflow: hidden;
    min-height: 0;
  }

  /* Desktop panel: visible only above mobile breakpoint */
  .desktop-panel {
    display: flex;
    height: 100%;
  }

  /* Mobile UI: hidden on desktop */
  .mobile-ui {
    display: none;
    flex-direction: column;
    flex-shrink: 0;
  }

  /* --- Mobile breakpoint (portrait phones and small tablets) --- */
  @media (max-width: 768px) {
    .desktop-panel {
      display: none;
    }

    .mobile-ui {
      display: flex;
    }
  }
</style>
