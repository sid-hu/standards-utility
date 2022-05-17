<script lang="ts">
  import { classList } from "../common/general";

  export let className = "";
  export let rounded = "rounded-md";

  export let styleHover = false;
  export let bare = false;

  let hovered = false;
</script>

<div
  class={classList(
    !bare ? "bg-slate-800 bg-opacity-20 shadow-lg" : "",
    !bare ? "border-[1px] border-slate-800 border-opacity-10" : "",
    !bare ? "backdrop-blur-sm" : "",
    styleHover ? "transition-all hover:cursor-pointer hover:bg-opacity-30" : "",
    rounded,
    className
  )}
  on:click
  on:mouseenter={() => (hovered = true)}
  on:mouseleave={() => (hovered = false)}
>
  <slot {hovered} />
</div>
