<script lang="ts">
  import { classList } from "../common/general";
  import type { Piece } from "../proto/local/data_pb";

  import Page from "../components/Page.svelte";
  import Panel from "../components/Panel.svelte";
  import ArrowUp from "../icons/ArrowUp.svelte";
  import Back from "../icons/Back.svelte";
  import { createEventDispatcher } from "svelte";
  import { useClose, useKey } from "../common/events";

  const dispatcher = createEventDispatcher<{ close: void }>();

  export let piece: Piece;

  let page = 0;
  const left = () => {
    if (page > 0) page--
  }
  const right = () => {
    if (page < piece.getPagesList().length - 1) page++
  }

  useClose(() => dispatcher("close"));

  useKey("ArrowLeft", left)
  useKey("ArrowRight", right)
</script>

<div
  on:click={() => dispatcher("close")}
  class={classList(
    "absolute top-8 left-8 w-16 h-16 transition-all",
    "hover:scale-110 hover:cursor-pointer"
  )}
>
  <Back className="w-full h-full fill-slate-900" />
</div>

<Page page={piece.getPagesList()[page]} alt={`page ${page + 1}`} />

<div class="flex bottom-16 p-centered-x">
  <Panel
    styleHover={page > 0}
    rounded="rounded-full"
    className="mx-2"
    on:click={left}
  >
    <ArrowUp
      className={classList(
        "p-2 w-10 h-10 -rotate-90",
        page > 0 ? "fill-slate-900" : "fill-slate-600"
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
        page < piece.getPagesList().length - 1
          ? "fill-slate-900"
          : "fill-slate-600"
      )}
    />
  </Panel>
</div>
