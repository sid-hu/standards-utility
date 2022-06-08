<script lang="ts">
  import { fly } from "svelte/transition";
  import { flip } from "svelte/animate";
  import { classList } from "../common/general";

  import Add from "../icons/Add.svelte";
  import Remove from "../icons/Remove.svelte";
  import { createEventDispatcher } from "svelte";

  type T = $$Generic;

  const dispatcher = createEventDispatcher<{ update: T[] }>();

  export let elements: T[] = [];
  export let newElement: () => T;

  const clickable = classList(
    "w-6 h-6 transition-all",
    "hover:cursor-pointer hover:translate-y-[2px]",
    "active:translate-y-1"
  );
</script>

{#each elements as e, i (e)}
  <div
    class="flex items-center"
    in:fly={{ y: 10 }}
    animate:flip={{ duration: 300 }}
  >
    <slot {e} {i} />
    <div
      on:click={() => {
        elements = [...elements.slice(0, i), ...elements.slice(i + 1)];
        dispatcher("update", elements);
      }}
    >
      <Remove className={classList(clickable, "ml-4")} />
    </div>
  </div>
{/each}

<div class="flex justify-end">
  <div
    on:click={() => {
      elements = [...elements, newElement()];
      dispatcher("update", elements);
    }}
  >
    <Add className={clickable} />
  </div>
</div>
