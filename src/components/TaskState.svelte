<script lang="ts">
  import { classList } from "../common/general";
  import { clickOutside } from "../common/actions";
  import { fly } from "svelte/transition";

  import type { TaskState } from "../proto/local/data";

  import Label from "../form/Label.svelte";
  import LinkButton from "../form/LinkButton.svelte";
  import TaskStateRegion from "./TaskStateRegion.svelte";
  import Panel from "./Panel.svelte";
  import Fraction from "./Fraction.svelte";

  type StateID = "HT" | "RH" | "LH" | "E" | "M";

  export let taskState: TaskState;
  export let label: StateID;
  export let className = "";

  const mapping = (
    taskState: TaskState,
    label: StateID,
    setter?: (list: boolean[], max: number) => boolean[]
  ): {
    completed: boolean[];
    number: number;
  } => {
    if (["HT", "RH", "LH"].includes(label)) {
      switch (taskState.hands.oneofKind) {
        case "handsTogether":
          const together = taskState.hands.handsTogether;
          if (setter !== undefined) {
            together.completed = setter(together.completed, together.number);
          }
          return {
            completed: together.completed,
            number: together.number,
          };
        case "handsSeparate":
          const separate = taskState.hands.handsSeparate;
          switch (label) {
            case "LH":
              if (setter !== undefined) {
                separate.left = setter(separate.left, separate.number);
              }
              return {
                completed: separate.left,
                number: separate.number,
              };
            case "RH":
              if (setter !== undefined) {
                separate.right = setter(separate.right, separate.number);
              }
              return {
                completed: separate.right,
                number: separate.number,
              };
          }
      }
    }

    switch (label) {
      case "E":
        if (!taskState.eyesClosed) throw new Error("bad state");
        const eyes = taskState.eyesClosed;
        if (setter !== undefined) {
          eyes.completed = setter(eyes.completed, eyes.number);
        }
        return { completed: eyes.completed, number: eyes.number };
      case "M":
        if (!taskState.memorized) throw new Error("bad state");
        const memorized = taskState.memorized;
        if (setter !== undefined) {
          memorized.completed = setter(memorized.completed, memorized.number);
        }
        return {
          completed: memorized.completed,
          number: memorized.number,
        };
    }

    throw new Error("given label is not part of the possible labels");
  };

  let stats = mapping(taskState, label);

  let dragging = false;
  let showStats = false;
</script>

<div class={classList("flex relative items-center", className)}>
  <Label className="mb-[2px]" preset="h3">{label}</Label>
  <div
    class={classList(
      "rounded-md w-5 h-5 border-2 border-slate-900",
      "transition-all mx-1 hover:cursor-pointer"
    )}
  >
    <div
      class={classList(
        "centered w-full h-full transition-all",
        dragging ? "opacity-0" : ""
      )}
      draggable="true"
      on:dragstart={() => (dragging = true)}
      on:dragend={() => (dragging = false)}
    >
      <div class="w-2 h-2 rounded-full bg-slate-900" />
    </div>
  </div>
  <div class="relative">
    <LinkButton
      className="mx-0 mb-[2px]"
      on:click={() => (showStats = !showStats)}
    >
      <Fraction numerator={stats.completed.length} denominator={stats.number} />
    </LinkButton>
    {#if showStats}
      <div
        class="absolute bottom-0 translate-y-full"
        in:fly|local={{ y: -10 }}
        out:fly|local={{ y: 5 }}
        use:clickOutside={{ callback: () => (showStats = false) }}
      >
        <Panel className="flex p-1">
          {#each Array(stats.number) as _, i}
            <div
              class={classList(
                "w-4 h-4 bg-opacity-50 rounded-sm mx-[0.125rem]",
                stats.completed[i]
                  ? "bg-green-500"
                  : stats.completed[i] === false
                  ? "bg-red-500"
                  : "border-2 border-slate-700 border-opacity-50"
              )}
            />
          {/each}
        </Panel>
      </div>
    {/if}
  </div>

  {#if dragging}
    {#if stats.completed.length < stats.number}
      <TaskStateRegion
        mode="up"
        on:drop={() => (stats = mapping(taskState, label, (l) => [...l, true]))}
      />
      <TaskStateRegion
        mode="down"
        on:drop={() =>
          (stats = mapping(taskState, label, (l) => [...l, false]))}
      />
    {:else}
      <TaskStateRegion
        mode="reset-up"
        on:drop={() => (stats = mapping(taskState, label, () => []))}
      />
      <TaskStateRegion
        mode="reset-down"
        on:drop={() => (stats = mapping(taskState, label, () => []))}
      />
    {/if}
  {/if}
</div>
