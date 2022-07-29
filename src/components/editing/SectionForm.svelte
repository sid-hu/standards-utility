<script lang="ts">
  import { slide } from "svelte/transition";

  import { presets } from "~/types/generic";
  import type { Task } from "~/proto/local/data";

  import FormPanel from "~/form/FormPanel.svelte";
  import Label from "~/form/Label.svelte";
  import Labeled from "~/form/Labeled.svelte";
  import ListInput from "~/form/ListInput.svelte";
  import Submission from "~/form/Submission.svelte";
  import TextInput from "~/form/TextInput.svelte";
  import TaskCard from "./TaskCard.svelte";

  export let title: string;
  export let ok: boolean;
  export let cancelable: boolean;
  export let from: number | undefined = undefined;
  export let to: number | undefined = undefined;
  export let tasks: Task[];

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

<FormPanel>
  <Label preset="h2">{title}</Label>
  <div class="mb-3">
    <Labeled label="From">
      <TextInput
        className="italic"
        placeholder="from"
        limitNumbers
        value={from?.toString()}
        disabled
      />
    </Labeled>
    <Labeled label="To">
      <TextInput
        className="italic"
        placeholder="to"
        limitNumbers
        value={to?.toString()}
        disabled
      />
    </Labeled>
  </div>
  {#if from && to}
    <div class="mb-4" transition:slide|local>
      <Label preset="h3">Tasks</Label>
      <ListInput
        {presets}
        {newElement}
        elements={tasks}
        on:update={(t) => (tasks = t.detail)}
        let:e
        let:i
      >
        <TaskCard on:update={(t) => (tasks[i] = t.detail)} task={e} />
      </ListInput>
    </div>
  {/if}
  <Submission disabled={!ok} {cancelable} on:cancel on:submit />
</FormPanel>
