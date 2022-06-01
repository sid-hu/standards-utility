<script lang="ts">
  import BoxComponent from "../components/Box.svelte";
  import Image from "../components/Image.svelte";
  import type { Box } from "../types/generic";

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
