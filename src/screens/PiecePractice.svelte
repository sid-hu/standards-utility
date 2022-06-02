<script lang="ts">
  import Panel from "../components/Panel.svelte";

  import type { Piece } from "../proto/local/data";

  import PieceViewer from "../components/PieceViewer.svelte";
  import Edit from "../icons/Edit.svelte";
  import Position from "../wrappers/Position.svelte";
  import WithBack from "../wrappers/WithBack.svelte";

  enum Mode {
    PRACTICING,
    EDITING,
  }

  type ModeContext = { mode: Mode.PRACTICING } | { mode: Mode.EDITING };

  export let piece: Piece;

  let mode =
    piece.pages[0].sections.length === 0 ? Mode.EDITING : Mode.PRACTICING;
</script>

<WithBack on:close>
  <PieceViewer {piece} />
</WithBack>

<Position x="right" y="bottom">
  <div class="flex">
    <Panel
      bare={mode === Mode.PRACTICING}
      rounded="rounded-full"
      className="w-5 h-5 p-5 centered mx-1">1</Panel
    >
    <Panel
      bare={mode === Mode.PRACTICING}
      rounded="rounded-full"
      className="w-fit h-fit centered mx-1"
    >
      <Edit className="m-2" />
    </Panel>
  </div>
</Position>
