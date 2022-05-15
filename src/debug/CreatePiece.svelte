<script lang="ts">
  import { Piece } from "../proto/local/data_pb";
  import PieceEditor from "../screens/PieceEditor.svelte";

  const piece = new Piece();
</script>

<PieceEditor
  {piece}
  title="Create a piece"
  on:submit={() => {
    console.log(piece);
  }}
/>
