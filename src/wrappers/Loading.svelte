<script lang="ts">
  import "@tensorflow/tfjs-backend-webgl";
  import { setWasmPath } from "@tensorflow/tfjs-tflite";
  import { setBackend } from "@tensorflow/tfjs-core";
  // import { loadTFLiteModel } from "@tensorflow/tfjs-tflite";
  import { loadGraphModel } from "@tensorflow/tfjs";

  import { db } from "../data/store";
  import { pieces } from "../store/pieces";
  import { measureModelPB } from "../store/models";

  import Message from "../components/Message.svelte";

  let message = "";
  let loaded = false;

  const load = async () => {
    message = "initializing model backend...";
    setWasmPath(`${window.location.origin}/wasm/`);
    await setBackend("webgl");

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
