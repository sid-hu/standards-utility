<script lang="ts">
  import { fly } from "svelte/transition";

  import { pieces } from "../store/pieces";
  import { Wrap } from "../types/generic";
  import type { Piece } from "../proto/local/data";

  import Loader from "../Loader.svelte";
  import PieceBrowser from "../screens/PieceBrowser.svelte";

  import PieceEditor from "../screens/PieceEditor.svelte";
  import PieceViewer from "../screens/PiecePractice.svelte";

  const p1: Piece = {
    name: "Piece 1",
    author: "Author 1",
    id: "0",
    pages: [],
  };

  const p2: Piece = {
    name: "Piece 2",
    author: "Author 2",
    id: "0",
    pages: [],
  };

  let viewing: Piece | undefined;
  let editing: Piece | undefined;

  const imagePromise = (async () => {
    const r1 = await window.fetch(`${window.location.origin}/examples/1.png`);
    const r2 = await window.fetch(`${window.location.origin}/examples/2.png`);

    const bounds = Wrap.Box({
      x1: 0.03728,
      y1: 0.2194,
      x2: 0.94,
      y2: 0.9374,
    });

    p1.pages.push({
      image: new Uint8Array(await r1.arrayBuffer()),
      measures: {
        bounds: bounds,
        rows: [
          {
            offset: 0,
            thickness: 0.0937 / bounds.height(),
            lines: [
              0.10386 / bounds.width() - bounds.x1,
              0.2544 / bounds.width() - bounds.x1,
              0.3635 / bounds.width() - bounds.x1,
            ],
          },
          {
            offset: (0.371 - bounds.y1) / bounds.height(),
            thickness: 0.0937 / bounds.height(),
            lines: [0, 0.218 / bounds.width() - bounds.x1],
          },
        ],
      },
      sections: [],
    });

    p1.pages.push({
      image: new Uint8Array(await r1.arrayBuffer()),
      sections: [],
    });

    p2.pages.push({
      image: new Uint8Array(await r2.arrayBuffer()),
      sections: [],
    });

    pieces.load([p1, p2]);
  })();
</script>

<Loader promise={imagePromise} let:loaded>
  {#if viewing}
    <div class="h-full" in:fly={{ duration: 400, y: 10 }}>
      <PieceViewer piece={viewing} on:close={() => (viewing = undefined)} />
    </div>
  {:else if editing}
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
        on:choose={(p) => (viewing = p.detail)}
        on:edit={(p) => (editing = p.detail)}
        on:delete={(p) => console.log("deleted", p)}
      />
    </div>
  {:else}
    <div class="m-auto">Loading images...</div>
  {/if}
</Loader>
