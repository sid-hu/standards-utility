<script lang="ts">
  export let className = "";
  export let rounded = "rounded-md";

  export let onclick = () => {}

  let hovered = false;
</script>

<div
  class={[
    "bg-slate-800 bg-opacity-20",
    "border-[1px] border-slate-800 border-opacity-10",
    `backdrop-blur-sm ${rounded} ${className}`,
  ].join(" ")}
  on:click={onclick}
  on:mouseenter={() => (hovered = true)}
  on:mouseleave={() => (hovered = false)}
>
  <slot {hovered} />
</div>
