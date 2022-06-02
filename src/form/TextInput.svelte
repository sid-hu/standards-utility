<script lang="ts">
  import { slide } from "svelte/transition";

  import { classList } from "../common/general";
  import Information from "../icons/Information.svelte";

  export let value = "";
  export let className = "";
  export let placeholder: string | null = null;
  export let error: string | null = null;
</script>

<div>
  <input
    type="text"
    {placeholder}
    bind:value
    on:input
    class={classList("bg-transparent rounded-sm text-slate-900", className)}
  />

  {#if error}
    <div transition:slide|local class="flex items-center">
      <Information className="w-4 h-4 fill-red-500 mr-1" />
      <p class="text-red-500 mb-1">{error}</p>
    </div>
  {/if}
</div>

<style>
  input {
    outline: none;
  }
</style>
