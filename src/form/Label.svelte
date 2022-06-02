<script lang="ts">
  type LabelPreset = "h2" | "h4" | "p"
  export let preset: LabelPreset;
</script>

{#if preset === "h2"}
  <h2 class="text-xl font-bold mb-3"><slot /></h2>
{:else if preset === "h4"}
  <h4 class="text-sm font-semibold my-1"><slot /></h4>
{:else if preset === "p"}
  <p class="text-sm"><slot /></p>
{/if}
