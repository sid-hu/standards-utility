<script lang="ts">
  import { createEventDispatcher } from "svelte";

  import Button from "./Button.svelte";
  import LinkButton from "./LinkButton.svelte";

  const dispatcher = createEventDispatcher<{ submit: void; cancel: void }>();

  export let disabled = false;
</script>

<div class="flex justify-between">
  <Button {disabled} on:click={() => dispatcher("submit")}>Done</Button>
  <LinkButton text="cancel" on:click={() => dispatcher("cancel")} />
</div>
