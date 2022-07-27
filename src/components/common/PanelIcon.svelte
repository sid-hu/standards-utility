<script lang="ts">
  import type { SvelteComponent } from "svelte";
  import { classList } from "~/common/general";

  import Panel from "~/components/common/Panel.svelte";

  export let icon: typeof SvelteComponent;

  export let containerName = "";
  export let className = "";

  export let bare = false;
  export let styleActionable = false;
</script>

<Panel
  {bare}
  {styleActionable}
  rounded="rounded-full"
  className={classList("w-fit h-fit centered mx-1", containerName)}
>
  <svelte:component this={icon} className={classList("m-2", className)} />
</Panel>
