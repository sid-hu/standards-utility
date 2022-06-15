<script lang="ts">
  import Loader from ".Loader.svelte";
  import PageComponent from "~/components/Page.svelte";

  import type { Piece } from "~/proto/local/data";
  import { Wrap } from "~/types/generic";

  const piece: Piece = {
    author: "",
    id: "",
    name: "",
    pages: [],
  };

  const imagePromise = (async () => {
    const r1 = await window.fetch(`${window.location.origin}/examples/1.png`);
    const r2 = await window.fetch(`${window.location.origin}/examples/2.png`);

    const bounds = Wrap.Box({
      x1: 0.03728,
      y1: 0.2194,
      x2: 0.94,
      y2: 0.9374,
    });

    piece.pages.push({
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

    piece.pages.push({
      image: new Uint8Array(await r2.arrayBuffer()),
      sections: [],
    });
  })();
</script>

<Loader promise={imagePromise} let:loaded>
  {#if loaded}
    <div class="flex h-full">
      {#each piece.pages as p, i}
        <PageComponent page={p} alt={`page ${i + 1}`} />
      {/each}
    </div>
  {:else}
    <p>Loading image...</p>
  {/if}
</Loader>
