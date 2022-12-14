<script lang="ts">
  import { messageKey } from "~/globals";
  import { createEventDispatcher, getContext } from "svelte";

  import type { Piece } from "~/proto/local/data";
  import type { Box } from "~/proto/local/data";
  import { constructMeasures, NormalizationControls } from "~/common/boxes";

  import Range from "~/form/Range.svelte";
  import PieceEditor from "~/screens/PieceEditor.svelte";
  import PieceViewer from "~/components/rendering/PieceViewer.svelte";
  import Inference from "~/utility/Inference.svelte";
  import Label from "~/form/Label.svelte";
  import Submission from "~/form/Submission.svelte";
  import Route from "~/components/common/Route.svelte";
  import Position from "~/wrappers/Position.svelte";
  import FormPanel from "~/form/FormPanel.svelte";
  import Measure from "~/components/rendering/Measure.svelte";

  const { showMessage } = getContext(messageKey);

  const dispatcher = createEventDispatcher<{ submit: Piece | null }>();
  let piece: Piece = {
    id: "",
    author: "",
    name: "",
    pages: [],
  };

  let measures: { box: Box; score: number }[][] = [];
  let controls: NormalizationControls[] = [];

  let inferring = -1;
  let filtering = -1;

  const updatePieceMeasures = (page: number) => {
    piece.pages[page].measures = constructMeasures(
      measures[page],
      controls[page]
    );
    piece = piece;
  };
</script>

{#if filtering >= 0}
  <Route>
    <PieceViewer
      {piece}
      on:page={(p) => {
        filtering = p.detail;
        updatePieceMeasures(filtering);
      }}
      let:measure
    >
      <Measure {measure} />
    </PieceViewer>
    <Position x="left" y="top">
      <FormPanel>
        <Label preset="h2">Configure measures</Label>
        <Label preset="h4">Threshold</Label>
        <Range
          className="w-52 pb-2"
          min={0}
          max={1}
          digits={2}
          step={0.01}
          bind:value={controls[filtering].threshold}
          on:input={() => updatePieceMeasures(filtering)}
        />
        <Label preset="h4">Line margin</Label>
        <Range
          className="w-52 pb-2"
          min={0}
          max={0.1}
          step={0.01}
          digits={2}
          bind:value={controls[filtering].lineMargin}
          on:input={() => updatePieceMeasures(filtering)}
        />
        <Submission
          on:cancel={() => dispatcher("submit", null)}
          on:submit={() => dispatcher("submit", piece)}
        />
      </FormPanel>
    </Position>
  </Route>
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
      showMessage("detecting measures...");
    }}
  />
  {#if inferring >= 0}
    <Inference
      image={piece.pages[inferring].image}
      on:finish={(e) => {
        measures[inferring] = e.detail;
        controls[inferring] = {
          lineMargin: 0.02,
          threshold: 0.5,
        };
        inferring++;
        console.log(`done ${inferring} / ${piece.pages.length}`);
        if (inferring === piece.pages.length) {
          for (let i = 0; i < piece.pages.length; i++) {
            updatePieceMeasures(i);
          }
          showMessage(undefined);
          inferring = -1;
          filtering = 0;
        }
      }}
    />
  {/if}
{/if}
