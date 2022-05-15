<script lang="ts">
  import CreatePiece from "./debug/CreatePiece.svelte";
</script>

<main>
  <CreatePiece />
</main>

<style global lang="postcss">
  @tailwind base;
  @tailwind components;
  @tailwind utilities;

  * {
    box-sizing: border-box;
  }

  body,
  html,
  main {
    height: 100%;
    width: 100%;
    margin: 0;
  }

  p,
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    @apply flex items-center text-slate-900;
  }

  .centered {
    @apply flex items-center justify-center;
  }

  .spring {
    transition-timing-function: cubic-bezier(0, 1.18, 0.95, 1.18);
  }
</style>
