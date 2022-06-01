import type { GraphModel } from "@tensorflow/tfjs";
import { writable } from "svelte/store";

export const measureModelPB = writable<GraphModel>()
