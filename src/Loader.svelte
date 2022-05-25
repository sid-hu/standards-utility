<script lang="ts">
  type T = $$Generic

  export let promise: Promise<T>;
  let value: T;

  promise.then((v) => (value = v));
</script>

<slot loaded={value !== null} {value} />
