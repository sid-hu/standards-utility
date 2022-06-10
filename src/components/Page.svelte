<script lang="ts">
  import BoxComponent from "./Box.svelte";
  import Image from "./Image.svelte";
  import type { Page } from "../proto/local/data";

  export let page: Page;
  export let alt: string;

  $: bounds = page.measures?.bounds;
  $: rows = page.measures?.rows;

  $: _measure = 0
  const renderMeasure = () => {
    _measure++
    return _measure
  }
</script>

<div class="w-full h-full">
  <Image bytes={page.image} {alt}>
    {#if bounds}
      <BoxComponent box={bounds}>
        {#if rows}
          {#each rows as r}
            <div>
              {#each r.lines as l, i}
                {#if i > 0}
                  <BoxComponent
                    box={{
                      x1: r.lines[i - 1],
                      y1: r.offset,
                      x2: l + 0.0001,
                      y2: r.offset + r.thickness,
                    }}
                  >
                    <slot measure={renderMeasure()} />
                  </BoxComponent>
                {/if}
              {/each}
            </div>
          {/each}
        {/if}
      </BoxComponent>
    {/if}
  </Image>
</div>
