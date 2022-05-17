<script lang="ts">
  import { Box } from "../types/generic";
  import type { Box as PBBox } from "../proto/local/generic_pb";
  import { classList } from "../common/general";

  export let box: PBBox;
  export let className: string | null = null;

  let _box = new Box(box.toObject());
</script>

<div
  class={classList("absolute", className ?? "")}
  style:top={`${box.getY1() * 100}%`}
  style:left={`${box.getX1() * 100}%`}
  style:width={`${_box.width * 100}%`}
  style:height={`${_box.height * 100}%`}
>
  <slot />
</div>
