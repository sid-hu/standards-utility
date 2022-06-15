<script lang="ts">
  export let numerator: number
  export let denominator: number
</script>

<div>
  <p class="block text-center">{numerator}</p>
  <div class="w-4 h-[2px] bg-slate-900"></div>
  <p class="block text-center" style="line-height: 20px">{denominator}</p>
</div>