<script lang="ts">
  import { pieces } from "./store/pieces";
  import { db } from "./data/store";

  import Loader from "./Loader.svelte";
  import Home from "./Home.svelte";

  const piecesPromise = db.load();
  piecesPromise.then((loaded) => pieces.load(loaded));
</script>

<main>
  <Loader promise={piecesPromise} let:loaded>
    {#if loaded}
      <Home />
    {:else}
      <p>loading data...</p>
    {/if}
  </Loader>
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

  svg {
    @apply fill-slate-900;
  }

  .ellipses {
    @apply text-ellipsis overflow-hidden whitespace-nowrap;
  }

  .centered {
    @apply flex items-center justify-center;
  }

  .p-centered-x {
    @apply absolute left-1/2 translate-x-[-50%];
  }

  .p-centered-y {
    @apply absolute top-1/2 translate-y-[-50%];
  }

  .p-centered {
    @apply p-centered-x p-centered-y;
  }

  .spring {
    transition-timing-function: cubic-bezier(0, 1.18, 0.95, 1.18);
  }
</style>
