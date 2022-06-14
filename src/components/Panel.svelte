<script lang="ts">
  import { createEventDispatcher } from "svelte";

  import { classList } from "../common/general";
  import { isTouch } from "../common/platform";

  export let className = "";
  export let rounded = "rounded-md";

  export let styleActionable = false;
  export let bare = false;

  const dispatcher = createEventDispatcher<{ click: void }>();

  let hovered = false;
</script>

<div
  class={classList(
    "transition-all border-[1px] border-transparent",
    !bare ? "bg-slate-800 bg-opacity-20 shadow-lg" : "",
    !bare ? "border-slate-800 border-opacity-10" : "",
    !bare ? "backdrop-blur-sm" : "",
    styleActionable ? "hover:cursor-pointer hover:bg-opacity-30" : "",
    rounded,
    className
  )}
  on:click={() => {
    if (isTouch()) {
      hovered = !hovered;
    }
    dispatcher("click");
  }}
  on:mouseenter={() => {
    if (isTouch()) return;
    hovered = true;
  }}
  on:mouseleave={() => {
    if (isTouch()) return;
    hovered = false;
  }}
>
  <slot {hovered} />
</div>
