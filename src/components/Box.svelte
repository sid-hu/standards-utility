<script lang="ts">
  import type { Box } from "../proto/local/generic"
  import { Wrap } from "../types/generic";
  import { classList } from "../common/general";

  export let box: Box;
  export let className: string | null = null;

  $: _box = Wrap.Box(box);
</script>

<div
  class={classList("absolute", className ?? "")}
  style:top={`${box.y1 * 100}%`}
  style:left={`${box.x1 * 100}%`}
  style:width={`${_box.width() * 100}%`}
  style:height={`${_box.height() * 100}%`}
>
  <slot />
</div>
