<script lang="ts">
  export let promise: Promise<any>;
  let value: any = null;
  promise.then((v) => value = v);
</script>

<slot loaded={value !== null} {value} />
