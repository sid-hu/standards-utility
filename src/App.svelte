<script lang="ts">
  import Home from "./Home.svelte";
  import Loading from "./wrappers/Loading.svelte";
  import Message from "./wrappers/Message.svelte";

  import D_TaskCard from "./debug/D_TaskCard.svelte";
  import D_TaskState from "./debug/D_TaskState.svelte";
</script>

<main>
  <Message>
    <Loading>
      <Home />
      <!-- <D_TaskCard /> -->
      <!-- <D_TaskState /> -->
    </Loading>
  </Message>
</main>
