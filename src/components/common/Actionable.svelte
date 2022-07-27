<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { isTouch } from "~/common/platform";

  const dispatcher = createEventDispatcher<{ click: void }>();
  let hovered = false;
</script>

<div
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
