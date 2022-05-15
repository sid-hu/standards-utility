<script lang="ts">
  import BoxComponent from "./Box.svelte";
  import Image from "./Image.svelte";
  import type { Page } from "../proto/local/data_pb";
  import { Box } from "../types/generic";

  export let page: Page;
  export let alt: string;

  const bounds = page.getMeasures()?.getBounds();
  const rows = page.getMeasures()?.getRowsList();
</script>

<div class="w-full h-full">
  <Image bytes={page.getImage_asU8()} {alt}>
    {#if bounds}
      <BoxComponent box={bounds}>
        {#if rows}
          {#each rows as r}
            {#each r.getLinesList() as l, i}
              {#if i > 0}
                <BoxComponent
                  className="bg-red-800 bg-opacity-50"
                  box={new Box({
                    x1: r.getLinesList()[i - 1],
                    y1: r.getOffset(),
                    x2: l,
                    y2: r.getOffset() + r.getThickness(),
                  })}
                />
              {/if}
            {/each}
          {/each}
        {/if}
      </BoxComponent>
    {/if}
  </Image>
</div>
