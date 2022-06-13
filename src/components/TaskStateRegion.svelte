<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { fly } from "svelte/transition";
  import { classList } from "../common/general";

  import Reset from "../icons/Reset.svelte";
  import ThumbsDown from "../icons/ThumbsDown.svelte";
  import ThumbsUp from "../icons/ThumbsUp.svelte";

  const dispatcher = createEventDispatcher<{ drop: void }>();

  export let mode: "up" | "down" | "reset-up" | "reset-down";

  let dragged = false;

  $: direction = mode === "up" || mode === "reset-up" ? "up" : "down";
</script>

<div
  class={classList(
    `absolute ${direction === "up" ? "-" : ""}translate-y-[80%] w-full h-16`,
    `flex justify-center ${direction === "up" ? "items-end" : "items-start"}`,
  )}
  on:dragover={(e) => {
    e.preventDefault();
    if (e.dataTransfer) {
      e.dataTransfer.dropEffect = "move";
    }
  }}
  on:dragenter={() => (dragged = true)}
  on:dragleave={() => (dragged = false)}
  on:drop={() => dispatcher("drop")}
>
  {#if dragged}
    <div
      class="pointer-events-none"
      transition:fly|local={{ y: direction === "up" ? -10 : 10, duration: 300 }}
    >
      {#if mode === "up"}
        <ThumbsUp />
      {:else if mode === "down"}
        <ThumbsDown />
      {:else if mode === "reset-up" || mode === "reset-down"}
        <Reset />
      {/if}
    </div>
  {/if}
</div>
