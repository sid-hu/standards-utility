<script lang="ts">
  import BoxComponent from "./Box.svelte";
  import Image from "./Image.svelte";
  import type { Box } from "../proto/local/generic";

  export let image: Uint8Array;
  export let boxes: Box[];
  export let alt: string;
</script>

<div class="w-full h-full">
  <Image bytes={image} {alt}>
    {#each boxes as box}
      <BoxComponent className="bg-red-800 bg-opacity-50" {box} />
    {/each}
  </Image>
</div>
