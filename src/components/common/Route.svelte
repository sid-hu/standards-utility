<script lang="ts">
  import { fly } from "svelte/transition";
</script>

<div class="h-full" in:fly={{ y: 10 }}>
  <slot />
</div>
