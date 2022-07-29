<script lang="ts">
  import { fly } from "svelte/transition";

  import { getContext } from "svelte";
  import { contextID, Context } from "./common";
  import { propertyOnSize } from "~/common/actions";
  import { cloneDeep } from "lodash";

  import Adaptive from "~/components/common/Adaptive.svelte";
  import SectionForm from "~/components/editing/SectionForm.svelte";
  import Expandable from "~/form/Expandable.svelte";
  import ConditionalWrap from "~/wrappers/ConditionalWrap.svelte";
  import Position from "~/wrappers/Position.svelte";

  const { state, sectionState, currentPage, hasSections, editing } =
    getContext<Context>(contextID);

  let ok = false;
  sectionState.subscribe(($section) => {
    ok =
      $section.tasks?.length > 0 &&
      $section.tasks.filter((t) => t.tools.length === 0).length === 0 &&
      $section.from !== undefined &&
      $section.to !== undefined;
  });

  hasSections.subscribe(($hasSections) => {
    if (!$hasSections) {
      sectionState.reset();
    }
  });

  editing.subscribe((editing) => {
    if (editing) {
      sectionState.use($currentPage.sections[editing]);
    }
  });
</script>

{#if $state.mode === "editing"}
  <Adaptive
    stops={[
      {
        position: 1050,
        value: "small",
      },
      {
        position: 1400,
        value: "large",
      },
    ]}
    let:triggered
  >
    <Position
      margin={triggered === "small" ? "90px" : undefined}
      x={triggered !== "small" ? "left" : "middle"}
      y="bottom"
    >
      <ConditionalWrap
        component={Expandable}
        props={{ label: "section info", spring: false }}
        wrap={triggered === "small"}
      >
        <div
          class={triggered !== "small"
            ? "max-h-[85vh]"
            : "overflow-y-scroll max-h-[65vh]"}
          transition:fly|local={{ y: 20 }}
          use:propertyOnSize={{
            overflowY: {
              axis: "y",
              compare: "greater",
              value: "auto",
              threshold: () => window.innerHeight * 0.8,
            },
          }}
        >
          <SectionForm
            {ok}
            from={$sectionState.from}
            to={$sectionState.to}
            tasks={$sectionState.tasks}
            title={`${$editing ? "Edit" : "Create"} a section`}
            cancelable={$hasSections}
            on:cancel={() => {
              if ($hasSections) {
                sectionState.reset();
              }
              $state.mode = "practicing";
              $editing = undefined;
            }}
            on:submit={() => {
              if (
                $sectionState.from === undefined ||
                $sectionState.to === undefined ||
                $sectionState.tasks.length === 0
              )
                return;
              if ($editing) {
                $currentPage.sections[$editing] = {
                  from: $sectionState.from,
                  to: $sectionState.to,
                  tasks: cloneDeep($sectionState.tasks),
                }
              } else {
                $currentPage.sections = [...$currentPage.sections, {
                  from: $sectionState.from,
                  to: $sectionState.to,
                  tasks: cloneDeep($sectionState.tasks),
                }]
              }
              $state.mode = "practicing";
              $editing = undefined;
              sectionState.reset()
              return
            }}
          />
        </div>
      </ConditionalWrap>
    </Position>
  </Adaptive>
{/if}
