<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { fly } from "svelte/transition";
  import { classList, debounce, styleList } from "~/common/general";

  import Reset from "~/icons/Reset.svelte";
  import ThumbsDown from "~/icons/ThumbsDown.svelte";
  import ThumbsUp from "~/icons/ThumbsUp.svelte";

  const dispatcher = createEventDispatcher<{ drop: void }>();
  const onclick = debounce(() => {
    dispatcher("drop");
  });

  export let mode: "up" | "down" | "reset";

  let hovered = false;

  $: translateBy = hovered ? "140%" : "120%";
  $: direction = mode === "down" || mode === "reset" ? "down" : "up";
</script>

<div
  class={classList(
    "absolute top-0 left-0 w-full h-full -translate-x-1/2",
    "flex justify-center transition-all"
  )}
  style={styleList({
    transform:
      direction === "up"
        ? `translateY(-${translateBy})`
        : `translateY(${translateBy})`,
  })}
>
  <div
    class={classList(
      "absolute h-16 transition-all hover:cursor-pointer",
      `flex justify-center ${direction === "up" ? "items-end" : "items-start"}`,
      direction === "up" ? "bottom-0" : ""
    )}
    style={styleList({ width: "calc(100% + 20px)" })}
    on:mouseenter={() => (hovered = true)}
    on:mouseleave={() => (hovered = false)}
    on:click={onclick}
  >
    <div
      class="pointer-events-none transition-all"
      transition:fly={{ y: direction === "up" ? -10 : 10, duration: 300 }}
    >
      {#if mode === "up"}
        <ThumbsUp />
      {:else if mode === "down"}
        <ThumbsDown />
      {:else if mode === "reset"}
        <Reset />
      {/if}
    </div>
  </div>
</div>
