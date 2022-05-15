<script lang="ts">
  import { Box } from "../types/generic";
  import type { Box as PBBox } from "../proto/local/generic_pb";

  export let box: PBBox;
  export let className: string | null = null;

  let _box = new Box(box.toObject());
</script>

<div
  class={className}
  style={[
    `top: ${box.getY1() * 100}%;`,
    `left: ${box.getX1() * 100}%;`,
    `width: ${_box.width * 100}%;`,
    `height: ${_box.height * 100}%;`,
    `position: absolute`,
  ].join(" ")}
>
  <slot />
</div>
