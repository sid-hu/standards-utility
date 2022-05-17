<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { classList } from "../common/general";

  export let value = "";
  export let className = "";
  export let placeholder: string | null = null;

  let _value = value;
  const dispatcher = createEventDispatcher<{ change: string }>();
</script>

<input
  type="text"
  {placeholder}
  bind:value={_value}
  on:input={() => dispatcher("change", _value)}
  class={classList("bg-transparent rounded-sm text-slate-900", className)}
/>

<style>
  input {
    outline: none;
  }
</style>
