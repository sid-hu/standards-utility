<script lang="ts">
  import { fly } from "svelte/transition";

  import Loader from "../Loader.svelte";
  import PieceBrowser from "../screens/PieceBrowser.svelte";

  import { Measures, Piece } from "../proto/local/data_pb";
  import { Page } from "../types/data";
  import PieceEditor from "../screens/PieceEditor.svelte";

  const p1 = new Piece();
  p1.setName("Piece 1");
  p1.setAuthor("Author 1");

  const p2 = new Piece();
  p2.setName("Piece 2");
  p2.setAuthor("Author 2");

  let editing: Piece | undefined;

  const imagePromise = (async () => {
    const r1 = await window.fetch(`${window.location.origin}/examples/1.png`);
    const r2 = await window.fetch(`${window.location.origin}/examples/2.png`);
    p1.addPages(
      new Page({
        image: new Uint8Array(await r1.arrayBuffer()),
        sectionsList: [],
        measures: new Measures().toObject(),
      })
    );
    p2.addPages(
      new Page({
        image: new Uint8Array(await r2.arrayBuffer()),
        sectionsList: [],
        measures: new Measures().toObject(),
      })
    );
  })();
</script>

<Loader promise={imagePromise} let:loaded>
  {#if editing}
    <div class="h-full" in:fly={{ duration: 400, y: 10 }}>
      <PieceEditor
        piece={editing}
        title="Editing piece"
        on:submit={() => (editing = undefined)}
      />
    </div>
  {:else if loaded}
    <div class="h-full" in:fly={{ duration: 400, y: 10 }}>
      <PieceBrowser
        pieces={[p1, p2]}
        on:choose={(p) => console.log("chose", p)}
        on:edit={(p) => (editing = p.detail)}
        on:delete={(p) => console.log("deleted", p)}
      />
    </div>
  {:else}
    <div class="m-auto">Loading images...</div>
  {/if}
</Loader>
