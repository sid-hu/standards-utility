import { setWasmPath } from "@tensorflow/tfjs-tflite";
import { setBackend } from "@tensorflow/tfjs-core";
import "@tensorflow/tfjs-backend-webgl";

import {
  tensor,
  reshape,
  mul,
  image as tfimage,
  NamedTensorMap,
  Tensor,
} from "@tensorflow/tfjs-core";
import { loadTFLiteModel } from "@tensorflow/tfjs-tflite";
import { Box } from "../proto/local/generic_pb";

export type InferenceParameters = {
  image: Tensor
  threshold: number
}

const infer = async (p: InferenceParameters) => {
  setWasmPath(`${window.location.origin}/wasm/`);
  await setBackend("webgl");

  const model = await loadTFLiteModel(
    `${self.location.origin}/models/model.tflite`
  );

  const resized = tfimage.resizeBilinear(await p.image.array(), [320, 320]);
  const reshaped = reshape(mul(resized, 255), [1, 320, 320, 3]);

  const out = model.predict(
    tensor(reshaped.arraySync(), [1, 320, 320, 3], "int32")
  ) as NamedTensorMap;

  const results = [];

  const scores = (
    (await out["StatefulPartitionedCall:1"].array()) as number[][]
  )[0];
  const boxes = (
    (await out["StatefulPartitionedCall:3"].array()) as number[][][]
  )[0];

  for (let i = 0; i < scores.length; i++) {
    if (scores[i] > p.threshold) {
      const box = new Box();

      box.setY1(boxes[i][0]);
      box.setX1(boxes[i][1]);
      box.setY2(boxes[i][2]);
      box.setX2(boxes[i][3]);

      results.push(box.toObject());
    }
  }

  postMessage(results)
};

self.onmessage = (e) => infer(e.data)
