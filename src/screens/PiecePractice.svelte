<script lang="ts">
  import _ from "lodash";

  import { fly, slide } from "svelte/transition";
  import { between } from "../common/math";
  import { propertyOnSize } from "../common/actions";
  import { createEventDispatcher } from "svelte";
  import { useClose } from "../common/hooks";

  import { toolNames } from "../types/generic";
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
  let selectedSection: number | undefined;

  //section creation state
  let tasks: Task[];
  let from: number | undefined;
  let to: number | undefined;

  let editing: Section | undefined;

  $: {
    if (mode !== Mode.EDITING && editing) {
      tasks = [];
      from = undefined;
      to = undefined;
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
  on:close={() => {
    if (selectedSection === undefined) {
      dispatcher("close");
    }
  }}
>
  <div class="h-full pb-20">
    <PieceViewer {piece} let:measure bind:page>
      {#if mode === Mode.EDITING}
        {@const inbetween = !!from && !!to && between(measure, from, to)}
        <Measure
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
        <SectionRenderer
          {measure}
          sections={piece.pages[page].sections}
          selected={selectedSection}
          on:select={(s) => (selectedSection = s.detail)}
          on:edit={(s) => {
            editing = s.detail;

            tasks = _.cloneDeep(editing.tasks);
            from = editing.from;
            to = editing.to;

            mode = Mode.EDITING;
          }}
          on:delete={(s) => {
            piece.pages[page].sections = withoutElement(
              piece.pages[page].sections,
              s.detail
            );
          }}
        />
      {/if}
    </PieceViewer>
  </div>
</WithBack>

<!-- section practice form -->
{#if selectedSection !== undefined && mode === Mode.PRACTICING}
  {@const section = piece.pages[page].sections[selectedSection]}
  <Position x="right" y="top">
    <div in:fly|local={{ y: -20 }} out:fly|local={{ y: 10 }}>
      <FormPanel>
        <Label preset="h2">Measures {section.from} - {section.to}</Label>
        {#each section.tasks as task}
          <div class="mb-3">
            {#if task.tools.length === 1}
              <Label preset="h3">{toolNames[task.tools[0]]}</Label>
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
            <div class="flex flex-wrap max-w-[150px]">
              {#if task.state?.hands.oneofKind === "handsTogether"}
                <TaskState taskState={task.state} label="HT" />
              {:else if task.state?.hands.oneofKind === "handsSeparate"}
                <TaskState taskState={task.state} label="RH" />
                <TaskState taskState={task.state} label="LH" />
              {/if}
              {#if task.state?.eyesClosed}
                <TaskState taskState={task.state} label="E" />
              {/if}
              {#if task.state?.memorized}
                <TaskState taskState={task.state} label="M" />
              {/if}
            </div>
          </div>
        {/each}
        <LinkButton
          className="mx-0"
          text="exit"
          on:click={() => (selectedSection = undefined)}
        />
      </FormPanel>
    </div>
  </Position>
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
        <Label preset="h2">{editing ? "Editing" : "Create"} a section</Label>
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
              from = undefined;
              to = undefined;
              tasks = [];
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
              piece.pages[page].sections = [
                ...piece.pages[page].sections,
                { from, to, tasks },
              ];
            }

            from = undefined;
            to = undefined;
            tasks = [];

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
