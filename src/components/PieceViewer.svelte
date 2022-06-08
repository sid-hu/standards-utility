<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { useKey } from "../common/hooks";
  import { classList } from "../common/general";
  import type { Piece } from "../proto/local/data";

  import BoxComponent from "./Box.svelte";
  import Panel from "../components/Panel.svelte";
  import ArrowUp from "../icons/ArrowUp.svelte";
  import Position from "../wrappers/Position.svelte";
  import Image from "./Image.svelte";

  const dispatcher = createEventDispatcher<{ page: number }>();

  export let piece: Piece;
  export let page = 0;

  const left = () => {
    if (page > 0) page--;
    dispatcher("page", page);
  };
  const right = () => {
    if (page < piece.pages.length - 1) page++;
    dispatcher("page", page);
  };

  useKey("ArrowLeft", left);
  useKey("ArrowRight", right);

  //page -> row -> line
  $: measures = (function () {
    const result: number[][][] = [];
    let current = 0;
    for (let p = 0; p < piece.pages.length; p++) {
      const page = piece.pages[p];
      if (!result[p]) {
        result[p] = [];
      }
      for (let r = 0; r < page.measures!.rows.length; r++) {
        const row = page.measures!.rows[r];
        if (!result[p][r]) {
          result[p][r] = [];
        }
        for (let l = 1; l < row.lines.length; l++) {
          current++;
          result[p][r][l] = current;
        }
      }
    }
    return result;
  })();
</script>

<div class="w-full h-full">
  <Image bytes={piece.pages[page].image} alt={`page ${page + 1}`}>
    {@const bounds = piece.pages[page].measures?.bounds}
    {@const rows = piece.pages[page].measures?.rows}
    {#if bounds && rows}
      <BoxComponent box={bounds}>
        {#each rows as r, ri}
          {#each r.lines as l, li}
            {#if li > 0}
              <BoxComponent
                box={{
                  x1: r.lines[li - 1],
                  y1: r.offset,
                  x2: l,
                  y2: r.offset + r.thickness,
                }}
              >
                <slot measure={measures[page][ri][li]} />
              </BoxComponent>
            {/if}
          {/each}
        {/each}
      </BoxComponent>
    {/if}
  </Image>
</div>

<Position x="middle" y="bottom">
  <div class="flex">
    <Panel
      styleActionable={page > 0}
      rounded="rounded-full"
      className="mx-2"
      on:click={left}
    >
      <ArrowUp
        className={classList(
          "p-2 w-10 h-10 -rotate-90 transition-all",
          page > 0 ? "" : "fill-slate-600"
        )}
      />
    </Panel>
    <Panel rounded="rounded-full" className="mx-2">
      <p class="w-10 h-10 centered text-slate-700 font-bold">{page + 1}</p>
    </Panel>
    <Panel
      styleActionable={page < piece.pages.length - 1}
      rounded="rounded-full"
      className="mx-2"
      on:click={right}
    >
      <ArrowUp
        className={classList(
          "p-2 w-10 h-10 rotate-90 transition-all",
          page < piece.pages.length - 1 ? "" : "fill-slate-600"
        )}
      />
    </Panel>
  </div>
</Position>
