<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { useKey } from "../common/events";
  import { classList } from "../common/general";
  import type { Piece } from "../proto/local/data_pb";

  import Page from "../components/Page.svelte";
  import Panel from "../components/Panel.svelte";
  import ArrowUp from "../icons/ArrowUp.svelte";
  import Position from "../wrappers/Position.svelte";

  const dispatcher = createEventDispatcher<{ page: number }>();

  export let piece: Piece;
  export let page = 0;

  const left = () => {
    if (page > 0) page--;
    dispatcher("page", page);
  };
  const right = () => {
    if (page < piece.getPagesList().length - 1) page++;
    dispatcher("page", page);
  };

  useKey("ArrowLeft", left);
  useKey("ArrowRight", right);
</script>

<Page page={piece.getPagesList()[page]} alt={`page ${page + 1}`}>
  <slot />
</Page>

<Position x="middle" y="bottom">
  <div class="flex">
    <Panel
      styleHover={page > 0}
      rounded="rounded-full"
      className="mx-2"
      on:click={left}
    >
      <ArrowUp
        className={classList(
          "p-2 w-10 h-10 -rotate-90",
          page > 0 ? "" : "fill-slate-600"
        )}
      />
    </Panel>
    <Panel rounded="rounded-full" className="mx-2">
      <p class="w-10 h-10 centered text-slate-700 font-bold">{page + 1}</p>
    </Panel>
    <Panel
      styleHover={page < piece.getPagesList().length - 1}
      rounded="rounded-full"
      className="mx-2"
      on:click={right}
    >
      <ArrowUp
        className={classList(
          "p-2 w-10 h-10 rotate-90",
          page < piece.getPagesList().length - 1 ? "" : "fill-slate-600"
        )}
      />
    </Panel>
  </div>
</Position>
