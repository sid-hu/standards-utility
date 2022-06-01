<script lang="ts">
  import { loadGraphModel } from "@tensorflow/tfjs";

  import { db } from "../data/store";
  import { pieces } from "../store/pieces";
  import { measureModelPB } from "../store/models";

  import Message from "../components/Message.svelte";

  let message = "";
  let loaded = false;

  const load = async () => {
    message = "loading model...";
    const modelPB = await loadGraphModel(
      `${window.location.origin}/models/web_model/model.json`
    );
    measureModelPB.update(() => modelPB);

    message = "fetching pieces...";
    const p = await db.load();
    pieces.load(p);

    loaded = true;
  };
  load();
</script>

{#if loaded}
  <slot />
{:else}
  <Message>{message}</Message>
{/if}
