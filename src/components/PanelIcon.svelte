<script lang="ts">
  import type { SvelteComponent } from "svelte";
  import { classList } from "../common/general";

  import Panel from "./Panel.svelte";

  export let icon: typeof SvelteComponent;

  export let className = "";
  export let bare = false;
  export let styleActionable = false;
</script>

<Panel
  {bare}
  {styleActionable}
  rounded="rounded-full"
  className={classList("w-fit h-fit centered mx-1", className)}
  on:click
>
  <svelte:component this={icon} className="m-2" />
</Panel>
