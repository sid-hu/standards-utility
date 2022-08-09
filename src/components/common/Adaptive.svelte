<script lang="ts">
  import { onDestroy } from "svelte";
  import { ramp, Stop } from "~/common/general";

  export let stops: Stop[];
  export let axis: "x" | "y" = "x";

  const onresize = () => {
    const value = axis === "x" ? window.innerWidth : window.innerHeight;
    triggered = ramp(value, stops);
  };

  let triggered: string;
  onresize();

  window.addEventListener("resize", onresize);
  onDestroy(() => {
    window.removeEventListener("resize", onresize);
  });
</script>

<slot {triggered} />
