<script lang="ts">
  import { fly } from "svelte/transition";

  import { classList } from "../common/general";

  export let className = "";
  export let styleActionable = false;
</script>

<div
  class={classList(
    "bg-slate-800 bg-opacity-30",
    "border-[1px] border-slate-600 h-full",
    styleActionable ? "hover:bg-slate-700 hover:bg-opacity-50" : "",
    styleActionable ? "hover:cursor-pointer hover:border-2" : "",
    styleActionable ? "transition-colors" : "",
    className
  )}
  on:click
  in:fly={{ y: 20 }}
/>
