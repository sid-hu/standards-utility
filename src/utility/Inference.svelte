<script lang="ts">
  import * as tf from "@tensorflow/tfjs-core";
  import type { TFLiteModel } from "@tensorflow/tfjs-tflite";
  import type { NamedTensorMap } from "@tensorflow/tfjs-core";

  import { Box } from "../proto/local/generic_pb";

  export let model: TFLiteModel;
  export let image: File;
  export let threshold = 0.2;
  export let onFinish: (results: Box[]) => void;

  let element: HTMLImageElement;

  const infer = async () => {
    const img = tf.browser.fromPixels(element);

    const resized = tf.image.resizeBilinear(await img.array(), [320, 320]);
    const reshaped = tf.reshape(tf.mul(resized, 255), [1, 320, 320, 3]);

    const out = model.predict(
      tf.tensor(reshaped.arraySync(), [1, 320, 320, 3], "int32")
    ) as NamedTensorMap;

    const results = [];

    const scores = (
      (await out["StatefulPartitionedCall:1"].array()) as number[][]
    )[0];
    const boxes = (
      (await out["StatefulPartitionedCall:3"].array()) as number[][][]
    )[0];

    for (let i = 0; i < scores.length; i++) {
      if (scores[i] > threshold) {
        const box = new Box();

        box.setY1(boxes[i][0]);
        box.setX1(boxes[i][1]);
        box.setY2(boxes[i][2]);
        box.setX2(boxes[i][3]);

        results.push(box);
      }
    }

    onFinish(results);
  };
</script>

<img
  bind:this={element}
  on:load={infer}
  class="fixed top-[100vh] left-[100vw]"
  src={URL.createObjectURL(image)}
  alt="inference"
/>
