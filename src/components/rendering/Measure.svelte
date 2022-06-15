<script lang="ts">
  import { fly } from "svelte/transition";

  import { classList } from "~/common/general";

  export let className = "";
  export let styleActionable = false;

  export let measure: number | undefined;
  export let displayEmpty = false;
  export let hidden = false
</script>

<div
  class={classList(
    "h-full bg-slate-800 bg-opacity-30",
    "border-[1px] border-slate-600",
    styleActionable ? "hover:bg-slate-700 hover:bg-opacity-50" : "",
    styleActionable ? "hover:cursor-pointer hover:border-2" : "",
    styleActionable ? "transition-colors" : "",
    hidden ? "hidden" : "",
    className
  )}
  on:click
  in:fly={{ y: 20 }}
/>

{#if measure}
  <div
    class="bg-slate-700 bg-opacity-50 backdrop-blur-lg"
    transition:fly|local={{ y: -10 }}
  >
    <p class={classList(
      "mx-1 italic font-semibold text-sm",
      displayEmpty ? "opacity-0" : ""
    )}>
      {measure}
    </p>
  </div>
{/if}
