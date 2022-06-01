<script lang="ts">
  import { browser as tfbrowser, Tensor } from "@tensorflow/tfjs";

  import { measureModelPB } from "../store/models";
  import { createEventDispatcher } from "svelte";
  import { imageStore } from "../store/image";
  import { Box } from "../proto/local/generic_pb";

  export let image: Uint8Array;

  const dispatcher = createEventDispatcher<{
    finish: {
      box: Box;
      score: number;
    }[];
  }>();

  let element: HTMLImageElement;

  const infer = async () => {
    const img = tfbrowser.fromPixels(element).toInt();

    const expanded = img.transpose([0, 1, 2]).expandDims();
    const result = (await $measureModelPB.executeAsync(expanded)) as Tensor[];

    const boxes = ((await result[0].array()) as number[][][])[0];
    const scores = ((await result[5].array()) as number[][])[0];

    const results = [];

    for (let i = 0; i < scores.length; i++) {
      const box = new Box();

      box.setY1(boxes[i][0]);
      box.setX1(boxes[i][1]);
      box.setY2(boxes[i][2]);
      box.setX2(boxes[i][3]);

      results.push({ box, score: scores[i] });
    }

    dispatcher("finish", results);
  };
</script>

<img
  bind:this={element}
  on:load={infer}
  class="fixed top-[100vh] left-[100vw]"
  src={imageStore.fetch(image)}
  alt="inference"
/>
