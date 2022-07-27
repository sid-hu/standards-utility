<script lang="ts">
  import { createEventDispatcher, setContext } from "svelte";
  import { useClose } from "~/common/hooks";

  import {
    currentPageID,
    makeSectionState,
    makeState,
    SectionMap,
    sectionStateID,
    stateID,
  } from "./common";
  import { writable } from "svelte/store";
  import type { Piece } from "~/proto/local/data";

  import PieceViewer from "~/components/rendering/PieceViewer.svelte";
  import Edit from "~/icons/Edit.svelte";
  import Position from "~/wrappers/Position.svelte";
  import WithBack from "~/wrappers/WithBack.svelte";
  import Play from "~/icons/Play.svelte";
  import PanelIcon from "~/components/common/PanelIcon.svelte";
  import Adaptive from "~/components/common/Adaptive.svelte";
  import SectionCreation from "./SectionCreation.svelte";
  import MeasureRender from "./MeasureRender.svelte";
  import SectionPractice from "./SectionPractice.svelte";
  import Actionable from "~/components/common/Actionable.svelte";

  const dispatcher = createEventDispatcher<{ close: void }>();

  export let piece: Piece;

  useClose((e) => {
    if ($state.selectedSection !== undefined) {
      e.stopImmediatePropagation();
      $state.selectedSection = undefined;
    }
    if ($state.mode === "editing" && $state.hasSections) {
      e.stopImmediatePropagation();
      $state.mode = "practicing";
    }
  });

  const state = makeState(piece.pages[0].sections.length === 0);
  setContext(stateID, state);
  $: $state.hasSections = piece.pages[0].sections.length === 0;

  const currentPage = writable(piece.pages[0]);
  setContext(currentPageID, currentPage);
  $: $currentPage = piece.pages[$state.page];

  //section creation state
  const sectionState = makeSectionState();
  setContext(sectionStateID, sectionState);

  $: sectionMap = (function (): SectionMap {
    const result: {
      [key: number]: {
        type: "left" | "right" | "inbetween";
        section: number;
      };
    } = {};
    for (let i = 0; i < $currentPage.sections.length; i++) {
      const s = $currentPage.sections[i];
      result[s.from] = {
        type: "left",
        section: i,
      };
      result[s.to] = {
        type: "right",
        section: i,
      };
      for (let m = s.from + 1; m < s.to; m++) {
        result[m] = {
          type: "inbetween",
          section: i,
        };
      }
    }
    return result;
  })();
</script>

<!-- main content -->
<WithBack
  on:close={(e) => {
    if ($state.selectedSection === undefined || e.detail.clicked) {
      dispatcher("close");
    }
  }}
>
  <div class="h-full pb-20">
    <PieceViewer
      {piece}
      let:measure
      on:page={(p) => {
        if ($state.selectedSection !== undefined) {
          $state.selectedSection = undefined;
        }
        $state.page = p.detail;
      }}
    >
      <MeasureRender {measure} {sectionMap} />
    </PieceViewer>
  </div>
</WithBack>

<SectionPractice />
<SectionCreation />

<!-- mode switcher -->
<Adaptive
  stops={[
    {
      position: 450,
      value: "small",
    },
    {
      position: 1000,
      value: "large",
    },
  ]}
  let:triggered
>
  <Position
    x="right"
    y={triggered === "small" ? "top" : "bottom"}
    margin={triggered === "small" ? "45px" : undefined}
    marginAxis="y"
  >
    <div class="flex">
      <Actionable on:click={() => ($state.mode = "practicing")}>
        <PanelIcon
          styleActionable={$state.mode !== "practicing"}
          bare={$state.mode !== "practicing"}
          icon={Play}
        />
      </Actionable>
      <Actionable on:click={() => ($state.mode = "editing")}>
        <PanelIcon
          styleActionable={$state.mode !== "editing"}
          bare={$state.mode !== "editing"}
          icon={Edit}
        />
      </Actionable>
    </div>
  </Position>
</Adaptive>
