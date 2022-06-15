<script context="module">
  export const key = Symbol();
</script>

<script lang="ts">
  import { setContext } from "svelte";
  import { classList } from "~/common/general";

  let message: string | undefined;

  setContext(key, {
    showMessage: (m: string | undefined) => {
      message = m;
    },
  });
</script>

<slot />

{#if message}
  <div
    class={classList(
      "fixed top-0 left-0 w-[100vw] h-[100vh]",
      "backdrop-blur-md centered"
    )}
  >
    <h2 class="text-2xl italic font-semibold">
      {message}
    </h2>
  </div>
{/if}
