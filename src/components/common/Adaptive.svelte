<script lang="ts">
  import { onDestroy } from "svelte";
  import { colorRamp, Stop } from "~/common/general";

  export let stops: Stop<string>[];
  export let axis: "x" | "y" = "x";

  const onresize = () => {
    const value = axis === "x" ? window.innerWidth : window.innerHeight;
    triggered = colorRamp<string>(value, stops);
  };

  let triggered = "";
  onresize();

  window.addEventListener("resize", onresize);
  onDestroy(() => {
    window.removeEventListener("resize", onresize);
  });
</script>

<slot {triggered} />
