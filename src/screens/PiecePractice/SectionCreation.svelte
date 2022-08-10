<script lang="ts">
  import { fly } from "svelte/transition";

  import { propertyOnSize } from "~/common/actions";
  import { requestContext } from "./state";

  import Adaptive from "~/components/common/Adaptive.svelte";
  import SectionForm from "~/components/editing/SectionForm.svelte";
  import Expandable from "~/form/Expandable.svelte";
  import ConditionalWrap from "~/wrappers/ConditionalWrap.svelte";
  import Position from "~/wrappers/Position.svelte";

  const { editing, sections, hasSections, sectionState, mode } =
    requestContext();

  $: ok =
    $sectionState.tasks?.length > 0 &&
    $sectionState.tasks.filter((t) => t.tools.length === 0).length === 0 &&
    $sectionState.from !== undefined &&
    $sectionState.to !== undefined;

  hasSections.subscribe(($hasSections) => {
    if (!$hasSections) {
      sectionState.reset();
    }
  });

  editing.subscribe((editing) => {
    if (editing !== undefined) {
      sectionState.use($sections[editing]);
    }
  });

  const exit = () => {
    editing.set(undefined);
    mode.set("practicing");
  };
</script>

{#if $mode === "editing"}
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
              if (!$hasSections) {
                sectionState.reset();
              }
              exit();
            }}
            on:submit={() => {
              sections.update(($sections) => {
                if (
                  $sectionState.from === undefined ||
                  $sectionState.to === undefined ||
                  $sectionState.tasks.length === 0
                )
                  return $sections;
                if ($editing) {
                  $sections[$editing] = {
                    from: $sectionState.from,
                    to: $sectionState.to,
                    tasks: $sectionState.tasks,
                  };
                } else {
                  $sections.push({
                    from: $sectionState.from,
                    to: $sectionState.to,
                    tasks: $sectionState.tasks,
                  });
                }
                return $sections;
              });
              sectionState.reset();
              exit();
            }}
          />
        </div>
      </ConditionalWrap>
    </Position>
  </Adaptive>
{/if}
