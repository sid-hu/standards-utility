<script lang="ts">
  import { between, inRange, intersects } from "~/common/math";
  import { cloneDeep } from "lodash";
  import { withoutElement } from "~/common/general";

  import { getContext } from "svelte";
  import {
    currentPageID,
    CurrentPageStore,
    SectionMap,
    sectionStateID,
    SectionStateStore,
    stateID,
    StateStore,
  } from "./common";

  import Measure from "~/components/rendering/Measure.svelte";
  import SectionRenderer from "~/components/practice/Section.svelte";

  export let measure: number;
  export let sectionMap: SectionMap;

  const state = getContext<StateStore>(stateID);
  const sectionState = getContext<SectionStateStore>(sectionStateID);
  const currentPage = getContext<CurrentPageStore>(currentPageID);
</script>

{#if $state.mode === "editing"}
  {@const inbetween =
    !!$sectionState.from &&
    !!$sectionState.to &&
    between(measure, $sectionState.from, $sectionState.to)}
  {@const hide =
    $currentPage.sections.filter(
      (s) =>
        inRange(measure, s.from, s.to) &&
        !(
          $sectionState.editing &&
          inRange(measure, $sectionState.editing.from, $sectionState.editing.to)
        )
    ).length > 0}
  <Measure
    hidden={hide}
    displayEmpty={inbetween}
    measure={measure === $sectionState.from || measure === $sectionState.to
      ? measure
      : inbetween
      ? measure
      : undefined}
    styleActionable
    on:click={() => {
      if ($sectionState.from && measure !== $sectionState.from) {
        $sectionState.to = $sectionState.to !== measure ? measure : undefined;
        if ($sectionState.to && $sectionState.to < $sectionState.from) {
          const less = $sectionState.to;
          $sectionState.to = $sectionState.from;
          $sectionState.from = less;
        }
        if ($sectionState.to) {
          //check for gaps taken up by sections
          for (const s of $currentPage.sections) {
            if (
              intersects(s.from, s.to, $sectionState.from, $sectionState.to) &&
              !(
                $sectionState.editing &&
                intersects(
                  s.from,
                  s.to,
                  $sectionState.editing.from,
                  $sectionState.editing.to
                )
              )
            ) {
              $sectionState.to = undefined;
              break;
            }
          }
        }
        return;
      }
      if ($sectionState.from === measure) {
        $sectionState.from = $sectionState.to;
        $sectionState.to = undefined;
        return;
      }
      $sectionState.from = measure;
    }}
  />
{:else if $state.mode === "practicing"}
  {#if sectionMap[measure]}
    {@const sectionNumber = sectionMap[measure].section}
    <SectionRenderer
      {sectionNumber}
      section={$currentPage.sections[sectionNumber]}
      type={sectionMap[measure].type}
      hovered={$state.hoveredMeasure === measure}
      selected={$state.selectedSection === sectionNumber}
      on:hover={(e) => {
        if ($state.selectedSection === sectionNumber) return;
        $state.hoveredMeasure = e.detail ? measure : undefined;
      }}
      on:select={(s) => {
        $state.hoveredMeasure = undefined;
        $state.selectedSection = s.detail;
      }}
      on:edit={(s) => {
        $state.hoveredMeasure = undefined;
        $sectionState.editing = s.detail;

        $sectionState.tasks = cloneDeep($sectionState.editing.tasks);
        $sectionState.from = $sectionState.editing.from;
        $sectionState.to = $sectionState.editing.to;

        $state.mode = "editing";
      }}
      on:delete={(s) => {
        $state.hoveredMeasure = undefined;
        $currentPage.sections = withoutElement($currentPage.sections, s.detail)
      }}
    />
  {/if}
{/if}
