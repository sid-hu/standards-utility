<script lang="ts">
  import PieceEditor from "./screens/PieceEditor.svelte";
</script>

<main>
  <PieceEditor />
</main>

<style global lang="postcss">
  @tailwind base;
  @tailwind components;
  @tailwind utilities;

  * {
    box-sizing: border-box;
  }

  body, html, main {
    height: 100%;
    width: 100%;
    margin: 0;
  }

  input {
    @apply bg-transparent my-1 rounded-sm;
  }

  p, h1, h2, h3, h4, h5, h6 {
    @apply centered;
  }

  .centered {
    @apply flex items-center justify-center;
  }

  .as-slate-900 {
    filter: invert(6%)
      sepia(17%)
      saturate(4745%)
      hue-rotate(200deg)
      brightness(97%)
      contrast(94%);
  }
</style>
