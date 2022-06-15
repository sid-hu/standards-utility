<script lang="ts">
  import type { Piece } from "~/proto/local/data";
  import PieceEditor from "~/screens/PieceEditor.svelte";

  const piece: Piece = {
    author: "",
    id: "",
    name: "",
    pages: [],
  };
</script>

<PieceEditor
  {piece}
  title="Create a piece"
  on:submit={() => {
    console.log(piece);
  }}
/>
