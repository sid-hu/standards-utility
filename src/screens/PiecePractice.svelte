<script lang="ts">
  import { cloneDeep } from "lodash";

  import { fly, slide } from "svelte/transition";
  import { between, inRange, intersects } from "../common/math";
  import { propertyOnSize } from "../common/actions";
  import { createEventDispatcher } from "svelte";
  import { useClose } from "../common/hooks";

  import { presets, toolNames } from "../types/generic";
  import type { Section, Piece, Task } from "../proto/local/data";
  import { withoutElement } from "../common/general";

  import PieceViewer from "../components/PieceViewer.svelte";
  import Edit from "../icons/Edit.svelte";
  import Position from "../wrappers/Position.svelte";
  import WithBack from "../wrappers/WithBack.svelte";
  import Play from "../icons/Play.svelte";
  import PanelIcon from "../components/PanelIcon.svelte";
  import Measure from "../components/Measure.svelte";
  import Label from "../form/Label.svelte";
  import FormPanel from "../form/FormPanel.svelte";
  import Submission from "../form/Submission.svelte";
  import Labeled from "../form/Labeled.svelte";
  import TextInput from "../form/TextInput.svelte";
  import TaskCard from "../components/TaskCard.svelte";
  import ListInput from "../components/ListInput.svelte";
  import SectionRenderer from "../components/Section.svelte";
  import TaskState from "../components/TaskState.svelte";
  import LinkButton from "../form/LinkButton.svelte";
  import Link from "../icons/Link.svelte";

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
  $: {
    if (sections !== piece.pages[page].sections) {
      piece.pages[page].sections = sections;
    }
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
    from &&
    to;

  const newElement = () => {
    return {
      tools: [],
      state: {
        hands: {
          oneofKind: "handsSeparate",
          handsSeparate: {
            left: false,
            right: false,
          },
        },
      },
    } as any;
  };
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
              sections = withoutElement(sections, s.detail);
            }}
          />
        {/if}
      {/if}
    </PieceViewer>
  </div>
</WithBack>

<!-- section practice form -->
{#if selectedSection !== undefined && mode === Mode.PRACTICING}
  {@const section = sections[selectedSection]}
  {#if section}
    <Position x="right" y="top">
      <div in:fly|local={{ y: -20 }} out:fly|local={{ y: 10 }}>
        <FormPanel>
          <Label preset="h2">Measures {section.from} - {section.to}</Label>
          {#each section.tasks as task}
            <div class="mb-3">
              {#if task.tools.length === 1}
                <Label className="mb-1" preset="h3"
                  >{toolNames[task.tools[0]]}</Label
                >
              {:else if task.tools.length > 1}
                <div class="flex justify-between items-center mb-1">
                  <div>
                    {#each task.tools as t}
                      <Label preset="h3">{toolNames[t]}</Label>
                    {/each}
                  </div>
                  <Link className="w-5 h-5 mt-1 ml-2" />
                </div>
              {/if}
              <div class="flex flex-wrap max-w-[200px]">
                {#if task.state?.hands.oneofKind === "handsTogether"}
                  <TaskState
                    className="mr-3"
                    taskState={task.state}
                    label="HT"
                  />
                {:else if task.state?.hands.oneofKind === "handsSeparate"}
                  <TaskState
                    className="mr-3"
                    taskState={task.state}
                    label="LH"
                  />
                  <TaskState
                    className="mr-3"
                    taskState={task.state}
                    label="RH"
                  />
                {/if}
                {#if task.state?.eyesClosed}
                  <TaskState
                    className="mr-3"
                    taskState={task.state}
                    label="E"
                  />
                {/if}
                {#if task.state?.memorized}
                  <TaskState
                    className="mr-3"
                    taskState={task.state}
                    label="M"
                  />
                {/if}
              </div>
            </div>
          {/each}
          <LinkButton
            className="mx-0"
            on:click={() => (selectedSection = undefined)}
          >
            exit
          </LinkButton>
        </FormPanel>
      </div>
    </Position>
  {/if}
{/if}

<!-- section creation form -->
{#if mode === Mode.EDITING}
  <Position x="left" y="bottom">
    <div
      class="max-h-[85vh]"
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
      <FormPanel>
        <Label preset="h2">{editing ? "Edit" : "Create"} a section</Label>
        <div class="mb-3">
          <Labeled label="From">
            <TextInput
              className="italic"
              placeholder="from"
              limitNumbers
              value={from?.toString()}
            />
          </Labeled>
          <Labeled label="To">
            <TextInput
              className="italic"
              placeholder="to"
              limitNumbers
              value={to?.toString()}
            />
          </Labeled>
        </div>
        {#if from && to}
          <div class="mb-4" transition:slide|local>
            <Label preset="h3">Tasks</Label>
            <ListInput
              {presets}
              elements={tasks}
              {newElement}
              on:update={(t) => (tasks = t.detail)}
              let:e
              let:i
            >
              <TaskCard on:update={(t) => (tasks[i] = t.detail)} task={e} />
            </ListInput>
          </div>
        {/if}
        <Submission
          disabled={!ok}
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
              sections = [...sections, { from, to, tasks }];
            }
            resetSection();
            mode = Mode.PRACTICING;
          }}
        />
      </FormPanel>
    </div>
  </Position>
{/if}

<!-- mode switcher -->
<Position x="right" y="bottom">
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
