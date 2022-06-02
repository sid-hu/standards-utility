<script lang="ts">
  import { createEventDispatcher } from "svelte";

  import { Piece } from "../proto/local/data_pb";
  import type { Box } from "../proto/local/generic_pb";
  import { constructMeasures, NormalizationControls } from "../common/boxes";

  import Message from "../components/Message.svelte";
  import Range from "../form/Range.svelte";
  import PieceEditor from "../screens/PieceEditor.svelte";
  import PieceViewer from "../components/PieceViewer.svelte";
  import Inference from "../utility/Inference.svelte";
  import Label from "../form/Label.svelte";
  import Submission from "../form/Submission.svelte";
  import Route from "../components/Route.svelte";
  import Position from "../wrappers/Position.svelte";
  import FormPanel from "../form/FormPanel.svelte";
  import Page from "../components/Page.svelte";
  import { classList } from "../common/general";

  const dispatcher = createEventDispatcher<{ submit: Piece | null }>();
  let piece = new Piece();

  let measures: { box: Box; score: number }[][] = [];
  let controls: NormalizationControls[] = [];

  let inferring = -1;
  let filtering = -1;

  const updatePieceMeasures = () => {
    piece
      .getPagesList()
      [filtering].setMeasures(
        constructMeasures(measures[filtering], controls[filtering])
      );
    piece = piece;
  };
</script>

{#if filtering >= 0}
  <Route>
    <Position x="left" y="top">
      <FormPanel>
        <Label preset="h2">Configure measures</Label>
        <Label preset="h4">Threshold</Label>
        <Range
          className="w-52 pb-2"
          min={0}
          max={1}
          step={0.1}
          bind:value={controls[filtering].threshold}
          on:input={updatePieceMeasures}
        />
        <Label preset="h4">Line margin</Label>
        <Range
          className="w-52 pb-2"
          min={0}
          max={0.1}
          step={0.01}
          digits={2}
          bind:value={controls[filtering].lineMargin}
          on:input={updatePieceMeasures}
        />
        <Submission
          on:cancel={() => dispatcher("submit", null)}
          on:submit={() => dispatcher("submit", piece)}
        />
      </FormPanel>
    </Position>
    <PieceViewer
      {piece}
      on:page={(p) => {
        filtering = p.detail;
        updatePieceMeasures();
      }}
    >
      <div
        class={classList(
          "bg-red-800 bg-opacity-50",
          "border-[1px] border-red-600 h-full"
        )}
      />
    </PieceViewer>
  </Route>
{:else if inferring >= 0}
  <Inference
    image={piece.getPagesList()[inferring].getImage_asU8()}
    on:finish={(e) => {
      measures[inferring] = e.detail;
      controls[inferring] = {
        lineMargin: 0.02,
        threshold: 0.5,
      };
      inferring++;
      if (inferring === piece.getPagesList().length) {
        inferring = -1;
        filtering = 0;
        updatePieceMeasures();
      }
    }}
  />
  <Message>detecting measures...</Message>
{:else}
  <PieceEditor
    {piece}
    title="Add a piece"
    on:submit={(r) => {
      if (!r.detail) {
        dispatcher("submit", null);
        return;
      }
      inferring = 0;
    }}
  />
{/if}
