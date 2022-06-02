<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { classList } from "../common/general";
  import { useClose } from "../common/events";

  import Back from "../icons/Back.svelte";

  const dispatcher = createEventDispatcher<{ close: void }>();
  useClose(() => dispatcher("close"));
</script>

<div
  on:click={() => dispatcher("close")}
  class={classList(
    "absolute top-8 left-8 w-16 h-16 transition-all",
    "hover:scale-110 hover:cursor-pointer"
  )}
>
  <Back className="w-full h-full" />
</div>

<slot />
