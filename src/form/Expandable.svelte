<script lang="ts">
  import { classList } from "../common/general";
  import ArrowUp from "../icons/ArrowUp.svelte";

  export let label = "";
  export let className = "";
  export let grow = false;

  let expanded = false;
  let child: HTMLElement;
</script>

<div
  class={classList(
    "flex flex-col items-center",
    className,
    grow ? "w-full" : ""
  )}
>
  <div
    class="flex mb-2 hover:cursor-pointer"
    on:click={() => (expanded = !expanded)}
  >
    {#if label}
      <p class="font-semibold mr-1">{label}</p>
    {/if}
    <div
      class={classList(expanded ? "rotate-180" : "", "transition-all spring")}
    >
      <ArrowUp className="w-6 h-6 fill-slate-900" />
    </div>
  </div>
  <div
    class={classList(
      "overflow-hidden transition-all duration-300 spring",
      grow ? "w-full" : ""
    )}
    style={`height: ${expanded ? `${child.clientHeight}px` : "0px"}`}
  >
    <div class={classList(grow ? "w-full" : "", "h-fit")} bind:this={child}>
      <slot />
    </div>
  </div>
</div>
