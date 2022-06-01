<script lang="ts">
  type T = $$Generic;

  export let promise: Promise<T>;

  let value: T;
  let loaded = false;

  promise.then((v) => {
    value = v;
    loaded = true;
  });
</script>

<slot {loaded} {value} />
