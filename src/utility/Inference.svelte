<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import type { Tensor } from "@tensorflow/tfjs";

  import { measureModelPB } from "~/store/models";
  import { imageStore } from "~/store/image";

  import type { Box } from "~/proto/local/data";
  import { tfjs } from "~/globals";

  export let image: Uint8Array;

  const dispatcher = createEventDispatcher<{
    finish: {
      box: Box;
      score: number;
    }[];
  }>();

  let element: HTMLImageElement;

  const infer = async () => {
    const { browser } = await tfjs;

    const img = browser.fromPixels(element).toInt();

    const expanded = img.transpose([0, 1, 2]).expandDims();
    const result = (await $measureModelPB.executeAsync(expanded)) as Tensor[];

    const boxes = ((await result[0].array()) as number[][][])[0];
    const scores = ((await result[5].array()) as number[][])[0];

    const results: { box: Box; score: number }[] = [];

    for (let i = 0; i < scores.length; i++) {
      results.push({
        box: {
          y1: boxes[i][0],
          x1: boxes[i][1],
          y2: boxes[i][2],
          x2: boxes[i][3],
        },
        score: scores[i],
      });
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
