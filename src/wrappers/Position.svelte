<script lang="ts">
  import { classList, styleList } from "../common/general";

  type X = "left" | "middle" | "right";
  type Y = "top" | "middle" | "bottom";

  export let x: X;
  export let y: Y;

  export let margin = "32px";
  export let className = "";

  const style = styleList({
    left: x === "left" ? margin : null,
    right: x === "right" ? margin : null,
    top: y === "top" ? margin : null,
    bottom: y === "bottom" ? margin : null,
  });
</script>

<div
  class={classList(
    "fixed w-fit h-fit",
    className,
    x === "middle" ? "p-centered-x" : "",
    y === "middle" ? "p-centered-y" : ""
  )}
  {style}
>
  <slot />
</div>
