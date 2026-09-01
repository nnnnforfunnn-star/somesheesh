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
    <div class="desktop-panel">
      <ControlPanel />
    </div>
    <CanvasPanel />
  </main>
  <MobileDrawer />
  <MobileNav />
</div>

<style>
  .app-shell {
    display: flex;
    flex-direction: column;
    height: 100vh;
    height: 100dvh;
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

  .desktop-panel {
    display: flex;
    height: 100%;
  }

  @media (max-width: 768px) {
    .desktop-panel {
      display: none;
    }

    /* Reserve space at bottom so canvas is not hidden under fixed nav */
    .workspace {
      padding-bottom: calc(60px + env(safe-area-inset-bottom, 0px));
    }
  }
</style>
