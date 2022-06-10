<script lang="ts">
  import Checkbox from "../form/Checkbox.svelte";
  import Label from "../form/Label.svelte";

  import type { TaskState } from "../proto/local/data";

  type StateID = "HT" | "RH" | "LH" | "E" | "M";

  export let taskState: TaskState;
  export let label: StateID;

  const mapping = (
    taskState: TaskState,
    label: StateID,
    value?: boolean
  ): boolean => {
    switch (label) {
      case "HT":
        if (taskState.hands.oneofKind !== "handsTogether") {
          throw new Error("label does not exist on taskState");
        }
        if (value !== undefined) {
          taskState.hands.handsTogether.completed = value;
        }
        return taskState.hands.handsTogether.completed;
      case "LH":
        if (taskState.hands.oneofKind !== "handsSeparate") {
          throw new Error("label does not exist on taskState");
        }
        if (value !== undefined) {
          taskState.hands.handsSeparate.left = value;
        }
        return taskState.hands.handsSeparate.left;
      case "RH":
        if (taskState.hands.oneofKind !== "handsSeparate") {
          throw new Error("label does not exist on taskState");
        }
        if (value !== undefined) {
          taskState.hands.handsSeparate.right = value;
        }
        return taskState.hands.handsSeparate.right;
      case "E":
        if (!taskState.eyesClosed) {
          throw new Error("label does not exist on taskState");
        }
        if (value !== undefined) {
          taskState.eyesClosed.completed = value;
        }
        return taskState.eyesClosed.completed;
      case "M":
        if (!taskState.memorized) {
          throw new Error("label does not exist on taskState");
        }
        if (value !== undefined) {
          taskState.memorized.completed = value;
        }
        return taskState.memorized.completed;
    }
  };

  let lastTaskState = taskState
  let checked = mapping(taskState, label)

  $: {
    if (lastTaskState !== taskState) {
      checked = mapping(taskState, label);
    }
  }
</script>

<div class="flex items-center">
  <Label className="mb-1" preset="h3">{label}</Label>
  <Checkbox
    {checked}
    on:change={(c) => (checked = mapping(taskState, label, c.detail))}
  />
</div>
