<script lang="ts">
  import { fly, slide } from "svelte/transition";
  import { between } from "../common/math";
  import { propertyOnSize } from "../common/actions";

  import type { Piece, Task } from "../proto/local/data";

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

  const enum Mode {
    PRACTICING,
    EDITING,
  }

  export let piece: Piece;

  let mode =
    piece.pages[0].sections.length === 0 ? Mode.EDITING : Mode.PRACTICING;

  let page = 0;

  let tasks: Task[];
  let from: number | undefined;
  let to: number | undefined;
  $: ok =
    tasks?.length > 0 &&
    tasks.filter((t) => t.tools.length === 0).length === 0 &&
    from &&
    to;
</script>

<WithBack on:close>
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
      {/if}
    </PieceViewer>
  </div>
</WithBack>

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
        <Label preset="h2">Create a section</Label>
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
              newElement={() => {
                return {
                  tools: [],
                  state: {
                    hands: {
                      oneofKind: undefined,
                    },
                  },
                };
              }}
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
          cancelable={false}
          on:submit={() => {
            if (!from || !to || tasks.length === 0) return;
            piece.pages[page].sections = [
              ...piece.pages[page].sections,
              {
                from: from,
                to: to,
                tasks: tasks,
              },
            ];

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
