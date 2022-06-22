<script lang="ts">
  import { cloneDeep } from "lodash";
  import { fly } from "svelte/transition";
  import { between, inRange, intersects } from "~/common/math";
  import { propertyOnSize } from "~/common/actions";
  import { createEventDispatcher } from "svelte";
  import { useClose } from "~/common/hooks";
  import { classList, withoutElement } from "~/common/general";

  import { presets } from "~/types/generic";
  import type { Section, Piece, Task } from "~/proto/local/data";

  import PieceViewer from "~/components/rendering/PieceViewer.svelte";
  import Edit from "~/icons/Edit.svelte";
  import Position from "~/wrappers/Position.svelte";
  import WithBack from "~/wrappers/WithBack.svelte";
  import Play from "~/icons/Play.svelte";
  import PanelIcon from "~/components/common/PanelIcon.svelte";
  import Measure from "~/components/rendering/Measure.svelte";
  import SectionRenderer from "~/components/practice/Section.svelte";
  import Adaptive from "~/components/common/Adaptive.svelte";
  import PracticeForm from "~/components/practice/PracticeForm.svelte";
  import SectionForm from "~/components/editing/SectionForm.svelte";
  import ConditionalWrap from "~/wrappers/ConditionalWrap.svelte";
  import Expandable from "~/form/Expandable.svelte";

  const enum Mode {
    PRACTICING,
    EDITING,
  }

  export let piece: Piece;

  const dispatcher = createEventDispatcher<{ close: void }>();

  useClose((e) => {
    if (selectedSection !== undefined) {
      e.stopImmediatePropagation();
      selectedSection = undefined;
    }
    if (mode === Mode.EDITING && hasSections) {
      e.stopImmediatePropagation();
      mode = Mode.PRACTICING;
    }
  });

  $: hasSections = piece.pages[0].sections.length !== 0;
  let mode =
    piece.pages[0].sections.length === 0 ? Mode.EDITING : Mode.PRACTICING;
  let page = 0;

  //practice state
  let sections = piece.pages[page].sections;
  const updateSections = (s: Section[]) => {
    sections = s
    piece.pages[page].sections = s;
    console.log(piece.pages[page])
  }

  let hoveredMeasure: number | undefined;
  let selectedSection: number | undefined;

  $: sectionMap = (function () {
    const result: {
      [key: number]: {
        type: "left" | "right" | "inbetween";
        section: number;
      };
    } = {};
    for (let i = 0; i < sections.length; i++) {
      const s = sections[i];
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

  //section creation state
  let tasks: Task[] = presets.standard;
  let from: number | undefined;
  let to: number | undefined;

  const resetSection = () => {
    tasks = presets.standard;
    from = undefined;
    to = undefined;
  };

  let editing: Section | undefined;

  $: {
    if (mode !== Mode.EDITING && editing) {
      resetSection();
      editing = undefined;
    }
  }

  $: ok =
    tasks?.length > 0 &&
    tasks.filter((t) => t.tools.length === 0).length === 0 &&
    !!from &&
    !!to;
</script>

<!-- main content -->
<WithBack
  on:close={(e) => {
    if (selectedSection === undefined || e.detail.clicked) {
      dispatcher("close");
    }
  }}
>
  <div class="h-full pb-20">
    <PieceViewer
      {piece}
      let:measure
      on:page={(p) => {
        if (selectedSection !== undefined) {
          selectedSection = undefined;
        }
        page = p.detail;
        sections = piece.pages[page].sections;
      }}
    >
      {#if mode === Mode.EDITING}
        {@const inbetween = !!from && !!to && between(measure, from, to)}
        {@const hide =
          sections.filter(
            (s) =>
              inRange(measure, s.from, s.to) &&
              !(editing && inRange(measure, editing.from, editing.to))
          ).length > 0}
        <Measure
          hidden={hide}
          displayEmpty={inbetween}
          measure={measure === from || measure === to
            ? measure
            : inbetween
            ? measure
            : undefined}
          styleActionable
          on:click={() => {
            if (from && measure !== from) {
              to = to !== measure ? measure : undefined;
              if (to && to < from) {
                const less = to;
                to = from;
                from = less;
              }
              if (to) {
                //check for gaps taken up by sections
                for (const s of sections) {
                  if (
                    intersects(s.from, s.to, from, to) &&
                    !(
                      editing &&
                      intersects(s.from, s.to, editing.from, editing.to)
                    )
                  ) {
                    to = undefined;
                    break;
                  }
                }
              }
              return;
            }
            if (from === measure) {
              from = to;
              to = undefined;
              return;
            }
            from = measure;
          }}
        />
      {:else if mode === Mode.PRACTICING}
        {#if sectionMap[measure]}
          {@const sectionNumber = sectionMap[measure].section}
          <SectionRenderer
            {sectionNumber}
            section={sections[sectionNumber]}
            type={sectionMap[measure].type}
            hovered={hoveredMeasure === measure}
            selected={selectedSection === sectionNumber}
            on:hover={(e) => {
              if (selectedSection === sectionNumber) return;
              hoveredMeasure = e.detail ? measure : undefined;
            }}
            on:select={(s) => {
              hoveredMeasure = undefined;
              selectedSection = s.detail;
            }}
            on:edit={(s) => {
              hoveredMeasure = undefined;
              editing = s.detail;

              tasks = cloneDeep(editing.tasks);
              from = editing.from;
              to = editing.to;

              mode = Mode.EDITING;
            }}
            on:delete={(s) => {
              updateSections(withoutElement(sections, s.detail))
            }}
          />
        {/if}
      {/if}
    </PieceViewer>
  </div>
</WithBack>

<!-- section practice form -->
{#if selectedSection !== undefined && mode === Mode.PRACTICING}
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
      fit={triggered !== "small"}
      className={classList(
        triggered === "small" ? "px-10 flex justify-center w-full" : ""
      )}
      margin={triggered === "small" ? "90px" : undefined}
      x={triggered !== "small" ? "right" : "middle"}
      y={triggered !== "small" ? "top" : "bottom"}
    >
      <div
        class={triggered !== "small" ? "max-w-[240px]" : ""}
        in:fly|local={{ y: -20 }}
        out:fly|local={{ y: 10 }}
      >
        <ConditionalWrap
          component={Expandable}
          props={{ label: "practice notes", spring: false }}
          wrap={triggered === "small"}
        >
          <PracticeForm
            section={sections[selectedSection]}
            on:exit={() => (selectedSection = undefined)}
          />
        </ConditionalWrap>
      </div>
    </Position>
  </Adaptive>
{/if}

<!-- section creation form -->
{#if mode === Mode.EDITING}
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
            {tasks}
            {from}
            {to}
            title={`${editing ? "Edit" : "Create"} a section`}
            cancelable={hasSections}
            on:cancel={() => {
              if (hasSections) {
                resetSection();
              }
              mode = Mode.PRACTICING;
            }}
            on:submit={() => {
              if (!from || !to || tasks.length === 0) return;
              if (editing) {
                editing.from = from;
                editing.to = to;
                editing.tasks = tasks;
                editing = undefined;
              } else {
                updateSections([...sections, { from, to, tasks }])
              }
              resetSection();
              mode = Mode.PRACTICING;
            }}
          />
        </div>
      </ConditionalWrap>
    </Position>
  </Adaptive>
{/if}

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
      <PanelIcon
        styleActionable={mode !== Mode.PRACTICING}
        bare={mode !== Mode.PRACTICING}
        icon={Play}
        on:click={() => (mode = Mode.PRACTICING)}
      />
      <PanelIcon
        styleActionable={mode !== Mode.EDITING}
        bare={mode !== Mode.EDITING}
        icon={Edit}
        on:click={() => (mode = Mode.EDITING)}
      />
    </div>
  </Position>
</Adaptive>
