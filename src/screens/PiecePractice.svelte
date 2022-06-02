<script lang="ts">
  import type { Piece } from "../proto/local/data";

  import PieceViewer from "../components/PieceViewer.svelte";
  import Edit from "../icons/Edit.svelte";
  import Position from "../wrappers/Position.svelte";
  import WithBack from "../wrappers/WithBack.svelte";
  import Play from "../icons/Play.svelte";
  import PanelIcon from "../components/PanelIcon.svelte";
  import Measure from "../components/Measure.svelte";

  enum Mode {
    PRACTICING,
    EDITING,
  }

  export let piece: Piece;

  let mode =
    piece.pages[0].sections.length === 0 ? Mode.EDITING : Mode.PRACTICING;
</script>

<WithBack on:close>
  <PieceViewer {piece}>
    {#if mode === Mode.EDITING}
      <Measure styleActionable />
    {/if}
  </PieceViewer>
</WithBack>

<Position x="right" y="bottom">
  <div class="flex">
    <PanelIcon
      styleActionable={mode !== Mode.PRACTICING}
      bare={mode !== Mode.PRACTICING}
      icon={Play}
      on:click={() => (mode = Mode.PRACTICING)}
    />
    <PanelIcon
      styleActionable={mode !== Mode.EDITING}
      bare={mode !== Mode.EDITING}
      icon={Edit}
      on:click={() => (mode = Mode.EDITING)}
    />
  </div>
</Position>
