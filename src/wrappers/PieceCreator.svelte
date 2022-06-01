<script lang="ts">
  import { createEventDispatcher } from "svelte";

  import { constructMeasures, NormalizationControls } from "../common/boxes";
  import Message from "../components/Message.svelte";
  import { Piece } from "../proto/local/data_pb";

  import PieceEditor from "../screens/PieceEditor.svelte";
  import Inference from "../utility/Inference.svelte";

  const dispatcher = createEventDispatcher<{ submit: Piece | null }>();
  const piece = new Piece();

  let controls: NormalizationControls;
  let inferring = -1;

  $: {
    if (inferring === piece.getPagesList().length) {
      inferring = -1;
      dispatcher("submit", piece);
    }
  }
</script>

{#if inferring >= 0}
  <Inference
    image={piece.getPagesList()[inferring].getImage_asU8()}
    on:finish={(e) => {
      piece
        .getPagesList()
        [inferring].setMeasures(constructMeasures(e.detail, controls));
      inferring++;
    }}
  />
  <Message>detecting measures...</Message>
{:else}
  <PieceEditor
    {piece}
    title="Add a piece"
    measureControls
    on:submit={(r) => {
      if (!r.detail?.piece) {
        dispatcher("submit", null);
        return;
      }
      inferring = 0;
      controls = r.detail?.controls ?? {
        threshold: 0.5,
        lineMargin: 0.02,
      };
    }}
  />
{/if}
