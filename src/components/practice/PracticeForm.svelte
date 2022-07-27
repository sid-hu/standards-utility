<script lang="ts">
  import { createEventDispatcher } from "svelte";

  import type { Section } from "~/proto/local/data";
  import { toolNames } from "~/types/generic";

  import FormPanel from "~/form/FormPanel.svelte";
  import Label from "~/form/Label.svelte";
  import Link from "~/icons/Link.svelte";
  import TaskState from "./TaskState.svelte";
  import LinkButton from "~/form/LinkButton.svelte";

  const dispatcher = createEventDispatcher<{ exit: void }>();

  export let section: Section;
  $: { console.log("rerendered", section) }
</script>

<FormPanel>
  <Label preset="h2">
    Measures {section.from} - {section.to}
  </Label>
  {#each section.tasks as task}
    <div class="mb-3">
      {#key task.tools}
        {#if task.tools.length === 1}
          <Label className="mb-1" preset="h3">{toolNames[task.tools[0]]}</Label>
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
      {/key}
      <div class="flex flex-wrap">
        {#key task.state}
          {#if task.state?.hands.oneofKind === "handsTogether"}
            <TaskState className="mr-3" taskState={task.state} label="HT" />
          {:else if task.state?.hands.oneofKind === "handsSeparate"}
            <TaskState className="mr-3" taskState={task.state} label="LH" />
            <TaskState className="mr-3" taskState={task.state} label="RH" />
          {/if}
          {#if task.state?.eyesClosed}
            <TaskState className="mr-3" taskState={task.state} label="E" />
          {/if}
          {#if task.state?.memorized}
            <TaskState className="mr-3" taskState={task.state} label="M" />
          {/if}
        {/key}
      </div>
    </div>
  {/each}
  <LinkButton className="mx-0" on:click={() => {
    console.log('exited')
    dispatcher("exit")
  }}>
    exit
  </LinkButton>
</FormPanel>
