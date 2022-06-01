<script lang="ts">
  import Loader from "../Loader.svelte";
  import Inference from "../utility/Inference.svelte";
  // import * as tflite from "@tensorflow/tfjs-tflite";
  // import * as tf from "@tensorflow/tfjs-core";
  // import * as _ from "@tensorflow/tfjs-backend-webgl";

  let image: File | null = null;

  const imagePromise = new Promise<Uint8Array>(async (resolve) => {
    const r = await window.fetch(`${window.location.origin}/examples/1.png`);
    const bytes = new Uint8Array(await r.arrayBuffer());
    resolve(bytes);
  });
  // tflite.setWasmPath(`${window.location.origin}/wasm/`);
  // const modelPromise = Promise.all([
  //   tflite.loadTFLiteModel(`${window.location.origin}/models/model.tflite`),
  //   tf.setBackend("webgl"),
  // ]);
</script>

<Loader promise={imagePromise} let:loaded let:value>
  {#if loaded}
    <Inference
      image={value}
      on:finish={(results) => {
        console.log(
          results.detail.map((b) => {
            return { box: b.box.toObject(), score: b.score };
          })
        );
      }}
    />
  {/if}
</Loader>
