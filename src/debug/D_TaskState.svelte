<script lang="ts">
  import TaskStateComponent from "~/components/practice/TaskState.svelte";
  import type { TaskState } from "~/proto/local/data";

  const taskState: TaskState = {
    hands: {
      oneofKind: "handsTogether",
      handsTogether: { completed: [], number: 4 }
    }
  };
</script>

<div class="w-full h-full centered">
  <TaskStateComponent {taskState} label="HT" />
</div>
