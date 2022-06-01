import type { GraphModel } from "@tensorflow/tfjs";
import type { TFLiteModel } from "@tensorflow/tfjs-tflite";
import { writable } from "svelte/store";

export const measureModel = writable<TFLiteModel>()
export const measureModelPB = writable<GraphModel>()
