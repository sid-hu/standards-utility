<script lang="ts">
  import { classList, colorRamp, debounce } from "~/common/general";
  import { clickOutside } from "~/common/actions";
  import { fly } from "svelte/transition";

  import type { TaskState } from "~/proto/local/data";

  import Label from "~/form/Label.svelte";
  import LinkButton from "~/form/LinkButton.svelte";
  import TaskStateRegion from "~/components/practice/TaskStateRegion.svelte";
  import Panel from "~/components/common/Panel.svelte";
  import Fraction from "~/components/common/Fraction.svelte";

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

  const onclick = debounce(() => {
    active = !active;
  });

  const drophandler = (value?: boolean) => {
    return () => {
      stats = mapping(
        taskState,
        label,
        value !== undefined ? (l) => [...l, value] : () => []
      );
      active = false;
    };
  };

  let stats = mapping(taskState, label);

  let active = false;
  let showStats = false;
</script>

<div class={classList("flex items-center", className)}>
  <Label className="mb-[2px]" preset="h3">{label}</Label>
  <div
    class={classList(
      "relative rounded-md w-5 h-5 border-2 border-slate-900",
      "transition-all mx-1 hover:cursor-pointer"
    )}
  >
    <div
      class={classList("centered w-full h-full transition-all")}
      on:click={onclick}
    >
      <div
        class={classList(
          "w-2 h-2 rounded-full bg-slate-900",
          active ? "opacity-0" : ""
        )}
      />
    </div>
    {#if active}
      {#if stats.completed.length < stats.number}
        <TaskStateRegion mode="up" on:drop={drophandler(true)} />
        <TaskStateRegion mode="down" on:drop={drophandler(false)} />
      {:else}
        <TaskStateRegion mode="reset" on:drop={drophandler()} />
      {/if}
    {/if}
  </div>
  <div class="relative">
    <LinkButton
      className="mx-0 mb-[2px]"
      on:click={() => (showStats = !showStats)}
    >
      {#if stats.completed.length < stats.number}
        <Fraction
          numerator={stats.completed.length}
          denominator={stats.number}
        />
      {:else}
        {@const correct =
          stats.completed.filter((v) => v).length / stats.number}
        <Label
          className={classList(
            "bg-opacity-30",
            colorRamp(correct, [
              {
                position: 0.5,
                value: "bg-red-500",
              },
              {
                position: 0.75,
                value: "bg-yellow-500",
              },
              {
                position: 1,
                value: "bg-green-500",
              },
            ])
          )}
          preset="h3"
        >
          {Math.round(correct * 100)}%
        </Label>
      {/if}
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
</div>
