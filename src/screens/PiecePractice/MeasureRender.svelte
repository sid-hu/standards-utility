<script lang="ts">
  import { between, inRange, intersects } from "~/common/math";
  import { cloneDeep } from "lodash";
  import { withoutElement } from "~/common/general";

  import { getContext } from "svelte";
  import { contextID, Context } from "./common";

  import Measure from "~/components/rendering/Measure.svelte";
  import SectionRenderer from "~/components/practice/Section.svelte";

  export let measure: number;

  const { state, sectionState, currentPage, sectionMap, editing } = getContext<Context>(contextID);
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
          $editing &&
          inRange(measure, $editing.from, $editing.to)
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
      sectionState.update(section => {
        if (section.from && measure !== section.from) {
          section.to = section.to !== measure ? measure : undefined;
          if (section.to && section.to < section.from) {
            const less = section.to;
            section.to = section.from;
            section.from = less;
          }
          if (section.to) {
            //check for gaps taken up by sections
            for (const s of $currentPage.sections) {
              if (
                intersects(s.from, s.to, section.from, section.to) &&
                !(
                  $editing &&
                  intersects(
                    s.from,
                    s.to,
                    $editing.from,
                    $editing.to
                  )
                )
              ) {
                section.to = undefined;
                break;
              }
            }
          }
          return section;
        }
        if (section.from === measure) {
          section.from = section.to
          section.to = undefined
          return section;
        }
        section.from = measure;
        return section
      })
    }}
  />
{:else if $state.mode === "practicing"}
  {#if $sectionMap[measure]}
    {@const sectionNumber = $sectionMap[measure].section}
    <SectionRenderer
      {sectionNumber}
      section={$currentPage.sections[sectionNumber]}
      type={$sectionMap[measure].type}
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
        $editing = s.detail;

        $sectionState.tasks = cloneDeep($editing.tasks);
        $sectionState.from = $editing.from;
        $sectionState.to = $editing.to;

        $state.mode = "editing";
      }}
      on:delete={(s) => {
        $state.hoveredMeasure = undefined;
        $currentPage.sections = withoutElement($currentPage.sections, s.detail);
      }}
    />
  {/if}
{/if}
