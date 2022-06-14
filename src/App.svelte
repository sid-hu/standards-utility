<script lang="ts">
  import Home from "./Home.svelte";
  import Loading from "./wrappers/Loading.svelte";
  import Message from "./wrappers/Message.svelte";
</script>

<main>
  <Message>
    <Loading>
      <Home />
    </Loading>
  </Message>
</main>
