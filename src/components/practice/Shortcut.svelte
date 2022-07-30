<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { useKey } from "~/common/hooks";

  import FormPanel from "~/form/FormPanel.svelte";
  import Panel from "../common/Panel.svelte";
  import ThumbsUp from "~/icons/ThumbsUp.svelte";
  import ThumbsDown from "~/icons/ThumbsDown.svelte";
  import Reset from "~/icons/Reset.svelte";

  const dispatcher = createEventDispatcher<{
    increment: boolean;
    reset: boolean;
  }>();

  useKey(",", () => dispatcher("increment", true));
  useKey(".", () => dispatcher("increment", false));
  useKey("Delete", () => dispatcher("reset"));
</script>

<div class="flex justify-center mt-4 mb-2">
  <FormPanel>
    <div class="flex gap-4">
      <Panel
        className="hover:-translate-y-1 active:translate-y-0"
        styleActionable
        bare
        on:click={() => dispatcher("increment", true)}
      >
        <ThumbsUp />
      </Panel>
      <Panel
        className="hover:-translate-y-1 active:translate-y-0"
        styleActionable
        bare
        on:click={() => dispatcher("increment", false)}
      >
        <ThumbsDown />
      </Panel>
      <Panel
        className="hover:-translate-y-1 active:translate-y-0"
        styleActionable
        bare
        on:click={() => dispatcher("reset")}
      >
        <Reset />
      </Panel>
    </div>
  </FormPanel>
</div>
