<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { classList } from "../common/general";
  import { useClose } from "../common/events";

  import Back from "../icons/Back.svelte";
  import Position from "./Position.svelte";

  const dispatcher = createEventDispatcher<{ close: void }>();
  useClose(() => dispatcher("close"));
</script>

<Position x="left" y="top">
  <div
    on:click={() => dispatcher("close")}
    class={classList(
      "w-16 h-16 transition-all",
      "hover:scale-110 hover:cursor-pointer"
    )}
  >
    <Back className="w-full h-full" />
  </div>
</Position>

<slot />
