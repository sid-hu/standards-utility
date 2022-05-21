<script lang="ts">
  import Loader from "../Loader.svelte";
  import Inference from "../utility/Inference.svelte";
  import * as tflite from "@tensorflow/tfjs-tflite";
  import * as tf from "@tensorflow/tfjs-core";
  import * as _ from "@tensorflow/tfjs-backend-webgl";

  let image: File | null = null;

  tflite.setWasmPath(`${window.location.origin}/wasm/`);
  const modelPromise = Promise.all([
    tflite.loadTFLiteModel(`${window.location.origin}/models/model.tflite`),
    tf.setBackend("webgl"),
  ]);
</script>

<Loader promise={modelPromise} let:value>
  {#if image}
    <Inference
      {image}
      model={value[0]}
      on:finish={(results) => {
        console.log(results);
      }}
    />
  {/if}
  <input
    type="file"
    on:change={(e) => {
      if (!e.currentTarget.files) return;
      image = e.currentTarget.files[0];
    }}
  />
</Loader>
