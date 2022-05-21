<script lang="ts">
  import { classList } from "../common/general";
  import Add from "../icons/Add.svelte";

  export let labelFor: string
</script>

<label
  for={labelFor}
  class={classList(
    "fixed bottom-10 right-10 w-16 h-16",
    "border-4 border-transparent rounded-full transition-all",
    "hover:border-slate-900 hover:scale-110 hover:cursor-pointer",
    "active:translate-y-1"
  )}
  on:click
>
  <Add className="w-full h-full" />
</label>
