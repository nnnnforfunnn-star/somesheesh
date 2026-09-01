<script>
  import { onMount } from 'svelte';
  import ControlPanel from './components/ControlPanel.svelte';
  import CanvasPanel from './components/CanvasPanel.svelte';
  import Header from './components/Header.svelte';
  import MobileNav from './components/MobileNav.svelte';
  import MobileDrawer from './components/MobileDrawer.svelte';

  let isMobile = false;

  onMount(() => {
    const mql = window.matchMedia('(max-width: 768px)');
    isMobile = mql.matches;
    const handler = (e) => { isMobile = e.matches; };
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  });
</script>

<div class="app-shell">
  <Header />

  <div class="workspace">
    {#if !isMobile}
      <ControlPanel />
    {/if}
    <CanvasPanel {isMobile} />
  </div>

  {#if isMobile}
    <!-- Nav sits in normal document flow at the bottom — no fixed positioning needed -->
    <MobileNav />
    <!-- Drawer overlays the canvas — uses position:fixed -->
    <MobileDrawer />
  {/if}
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
</style>
