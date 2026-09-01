<script>
  import ControlPanel from './components/ControlPanel.svelte';
  import CanvasPanel from './components/CanvasPanel.svelte';
  import Header from './components/Header.svelte';
</script>

<div class="app-shell">
  <Header />
  <main class="workspace">
    <ControlPanel />
    <CanvasPanel />
  </main>
</div>

<style>
  .app-shell {
    display: flex;
    flex-direction: column;
    height: 100vh;
    width: 100vw;
    overflow: hidden;
    background-color: #121212;
  }

  .workspace {
    display: flex;
    flex: 1;
    overflow: hidden;
  }
</style>
