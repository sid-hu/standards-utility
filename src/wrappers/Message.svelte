<script lang="ts">
  import { fade } from "svelte/transition";

  import { setContext } from "svelte";
  import { classList } from "~/common/general";
  import { messageKey } from "~/globals";

  let message: string | undefined;

  setContext(messageKey, {
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
    transition:fade={{ duration: 150 }}
  >
    <h2 class="text-2xl italic font-semibold">
      {message}
    </h2>
  </div>
{/if}
