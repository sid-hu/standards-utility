<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { classList } from "../common/general";

  export let className = "";
  export let placeholder: string | null = null;

  let value = "";
  const dispatcher = createEventDispatcher<{ change: string }>();
</script>

<input
  type="text"
  {placeholder}
  bind:value
  on:change={() => dispatcher("change", value)}
  class={classList("bg-transparent rounded-sm text-slate-900", className)}
/>

<style>
  input {
    outline: none;
  }
</style>
