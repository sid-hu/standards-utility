<script lang="ts">
  import { loadGraphModel } from "@tensorflow/tfjs";
  import { GlobalWorkerOptions } from "pdfjs-dist";

  import { db } from "~/store/db";
  import { pieces } from "~/store/pieces";
  import { measureModelPB } from "~/store/models";
  import { key } from "~/wrappers/Message.svelte";
  import { getContext } from "svelte";

  const { showMessage } = getContext(key);
  let loaded = false;

  const load = async () => {
    GlobalWorkerOptions.workerSrc = "/workers/pdf.worker.js";

    showMessage("loading model...");
    const modelPB = await loadGraphModel(
      `${window.location.origin}/models/web_model/model.json`
    );
    measureModelPB.update(() => modelPB);

    showMessage("fetching pieces...");
    const p = await db.load();
    pieces.load(p);

    loaded = true;
    showMessage(undefined)
  };
  load();
</script>

{#if loaded}
  <slot />
{/if}
