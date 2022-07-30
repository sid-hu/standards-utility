<script lang="ts">
  import Label from "~/form/Label.svelte";
</script>

<div class="border-2 border-slate-900 rounded-md">
  <Label className="mb-[2px] px-2" preset="h3">
    <slot />
  </Label>
</div>
