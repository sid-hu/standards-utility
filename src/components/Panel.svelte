<script lang="ts">
  import { classList } from "../common/general";

  export let className = "";
  export let rounded = "rounded-md";

  let hovered = false;
</script>

<div
  class={classList(
    "bg-slate-800 bg-opacity-20 shadow-lg",
    "border-[1px] border-slate-800 border-opacity-10",
    `backdrop-blur-sm`,
    rounded,
    className
  )}
  on:click
  on:mouseenter={() => (hovered = true)}
  on:mouseleave={() => (hovered = false)}
>
  <slot {hovered} />
</div>
