<script lang="ts">
  import { classList } from "../common/general";
</script>

<button
  on:click
  class={classList(
    "rounded-full border-2 border-slate-900",
    "px-3 py-1 text-slate-900 font-semibold",
    "transition-all ease-in-out hover:shadow-lg",
    "hover:bg-slate-900 hover:text-slate-100",
    "active:scale-95"
  )}
>
  <slot />
</button>
