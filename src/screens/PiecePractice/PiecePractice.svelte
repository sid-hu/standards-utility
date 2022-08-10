<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { useClose } from "~/common/hooks";

  import type { Piece } from "~/proto/local/data";
  import { makeContext } from "./state";

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

  const { hasSections, mode, page, selectedSection } = makeContext(piece);

  //state
  // const page = derived(state, $state => $state.page)
  // const currentPage = writable(piece.pages[0]);
  // page.subscribe(($page) => {
  //   currentPage.set($pieceStore.pages[$page]);
  // });

  // const hasSections = derived(
  //   currentPage,
  //   ($currentPage) => $currentPage.sections.length !== 0
  // );

  // setContext<Context>(contextID, {
  //   currentPage,
  //   state,
  //   hasSections,
  //   sectionMap,
  //   sectionState: makeSectionState(),
  //   editing: writable(undefined),
  // });

  //back handling
  useClose((e) => {
    if ($selectedSection !== undefined) {
      e.stopImmediatePropagation();
      $selectedSection = undefined;
    }
    if ($mode === "editing" && $hasSections) {
      e.stopImmediatePropagation();
      $mode = "practicing";
    }
  });
</script>

<!-- main content -->
<WithBack
  on:close={(e) => {
    if ($selectedSection === undefined || e.detail.clicked) {
      dispatcher("close");
    }
  }}
>
  <div class="h-full pb-20">
    <PieceViewer
      {piece}
      let:measure
      on:page={(p) => {
        if ($selectedSection !== undefined) {
          $selectedSection = undefined;
        }
        $page = p.detail;
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
      <Actionable on:click={() => ($mode = "practicing")}>
        <PanelIcon
          styleActionable={$mode !== "practicing"}
          bare={$mode !== "practicing"}
          icon={Play}
        />
      </Actionable>
      <Actionable on:click={() => ($mode = "editing")}>
        <PanelIcon
          styleActionable={$mode !== "editing"}
          bare={$mode !== "editing"}
          icon={Edit}
        />
      </Actionable>
    </div>
  </Position>
</Adaptive>
