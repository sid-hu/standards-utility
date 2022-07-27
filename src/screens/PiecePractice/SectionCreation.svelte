<script lang="ts">
  import { fly } from "svelte/transition";

  import { getContext } from "svelte";
  import {
    stateID,
    sectionStateID,
    SectionStateStore,
    StateStore,
    CurrentPageStore,
    currentPageID,
  } from "./common";
  import { propertyOnSize } from "~/common/actions";

  import Adaptive from "~/components/common/Adaptive.svelte";
  import SectionForm from "~/components/editing/SectionForm.svelte";
  import Expandable from "~/form/Expandable.svelte";
  import ConditionalWrap from "~/wrappers/ConditionalWrap.svelte";
  import Position from "~/wrappers/Position.svelte";

  const state = getContext<StateStore>(stateID);
  const sectionState = getContext<SectionStateStore>(sectionStateID);
  const currentPage = getContext<CurrentPageStore>(currentPageID);

  $: ok =
    $sectionState.tasks?.length > 0 &&
    $sectionState.tasks.filter((t) => t.tools.length === 0).length === 0 &&
    $sectionState.from !== undefined &&
    $sectionState.to !== undefined;
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
            title={`${$sectionState.editing ? "Edit" : "Create"} a section`}
            cancelable={$state.hasSections}
            on:cancel={() => {
              if ($state.hasSections) {
                sectionState.reset();
              }
              $state.mode = "practicing";
            }}
            on:submit={() => {
              sectionState.update((s) => {
                if (
                  s.from === undefined ||
                  s.to === undefined ||
                  s.tasks.length === 0
                )
                  return s;
                if (s.editing) {
                  s.editing.from = s.from;
                  s.editing.to = s.to;
                  s.editing.tasks = s.tasks;
                } else {
                  $currentPage.sections.push({
                    from: s.from,
                    to: s.to,
                    tasks: s.tasks,
                  });
                }
                sectionState.reset();
                $state.mode = "practicing";
                return s;
              });
            }}
          />
        </div>
      </ConditionalWrap>
    </Position>
  </Adaptive>
{/if}
