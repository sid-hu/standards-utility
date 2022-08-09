<script lang="ts">
  import { between, inRange, intersects } from "~/common/math";
  import { withoutElement } from "~/common/general";
  import { derived } from "svelte/store";
  import { mode, editing, sections, sectionState, sectionMap, selectedSection } from "./state";

  import Measure from "~/components/rendering/Measure.svelte";
  import SectionRenderer from "~/components/practice/Section.svelte";

  export let measure: number;

  let hoveredMeasure: number | undefined

  const editedSection = derived(
    [sections, editing],
    ([$sections, $editing]) => $editing !== undefined ?
      $sections[$editing] :
      undefined
  )
</script>

{#if $mode === "editing"}
  {@const inbetween =
    !!$sectionState.from &&
    !!$sectionState.to &&
    between(measure, $sectionState.from, $sectionState.to)}
  {@const hide =
    $sections.filter(
      (s) =>
        inRange(measure, s.from, s.to) &&
        !(
          $editedSection &&
          inRange(measure, $editedSection.from, $editedSection.to)
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
            for (const s of $sections) {
              if (
                intersects(s.from, s.to, section.from, section.to) &&
                !(
                  $editedSection &&
                  intersects(
                    s.from,
                    s.to,
                    $editedSection.from,
                    $editedSection.to
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
{:else if $mode === "practicing"}
  {#if $sectionMap[measure]}
    {@const sectionNumber = $sectionMap[measure].section}
    <SectionRenderer
      {sectionNumber}
      section={$sections[sectionNumber]}
      type={$sectionMap[measure].type}
      hovered={hoveredMeasure === measure}
      selected={$selectedSection === sectionNumber}
      on:hover={(e) => {
        if ($selectedSection === sectionNumber) return;
        hoveredMeasure = e.detail ? measure : undefined;
      }}
      on:select={(s) => {
        hoveredMeasure = undefined
        $selectedSection = s.detail;
      }}
      on:edit={(s) => {
        hoveredMeasure = undefined
        $editing = s.detail;
        $mode = "editing";
      }}
      on:delete={(s) => {
        hoveredMeasure = undefined
        $sections = withoutElement($sections, s.detail);
      }}
    />
  {/if}
{/if}
