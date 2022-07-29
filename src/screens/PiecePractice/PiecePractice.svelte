<script lang="ts">
  import { createEventDispatcher, setContext } from "svelte";
  import { useClose } from "~/common/hooks";

  import {
    makeSectionState,
    makeState,
    SectionMap,
    contextID,
    Context,
  } from "./common";
  import { derived, writable } from "svelte/store";
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

  //state
  const pieceStore = writable(piece);
  $: $pieceStore = piece;

  const state = makeState(piece.pages[0].sections.length === 0);

  const page = derived(state, $state => $state.page)
  const currentPage = writable(piece.pages[0]);
  page.subscribe(($page) => {
    currentPage.set($pieceStore.pages[$page]);
  });

  const hasSections = derived(
    currentPage,
    ($currentPage) => $currentPage.sections.length !== 0
  );

  const sectionMap = writable<SectionMap>({});
  currentPage.subscribe((p) => {
    const map: {
      [key: number]: {
        type: "left" | "right" | "inbetween";
        section: number;
      };
    } = {};
    for (let i = 0; i < p.sections.length; i++) {
      const s = p.sections[i];
      map[s.from] = {
        type: "left",
        section: i,
      };
      map[s.to] = {
        type: "right",
        section: i,
      };
      for (let m = s.from + 1; m < s.to; m++) {
        map[m] = {
          type: "inbetween",
          section: i,
        };
      }
    }
    sectionMap.set(map)
  });

  setContext<Context>(contextID, {
    currentPage,
    state,
    hasSections,
    sectionMap,
    sectionState: makeSectionState(),
    editing: writable(undefined),
  });

  //back handling
  useClose((e) => {
    if ($state.selectedSection !== undefined) {
      e.stopImmediatePropagation();
      $state.selectedSection = undefined;
    }
    if ($state.mode === "editing" && $hasSections) {
      e.stopImmediatePropagation();
      $state.mode = "practicing";
    }
  });
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
      <MeasureRender {measure} />
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
