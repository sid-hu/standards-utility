<script lang="ts">
  import Loader from "../Loader.svelte";
  import PageComponent from "../components/Page.svelte";

  import { Measures, Page, Piece, Row } from "../proto/local/data_pb";
  import { Box } from "../common/types";

  const piece = new Piece();

  const imagePromise = (async () => {
    const r1 = await window.fetch(`${window.location.origin}/examples/1.png`);
    const r2 = await window.fetch(`${window.location.origin}/examples/2.png`);

    const page1 = new Page();
    page1.setImage(new Uint8Array(await r1.arrayBuffer()));

    const measures = new Measures();
    const bounds = new Box({
      x1: 0.03728,
      y1: 0.2194,
      x2: 0.94,
      y2: 0.9374,
    });
    measures.setBounds(bounds);

    const row1 = new Row();
    row1.setOffset(0);
    row1.setThickness(0.0937 / bounds.height);
    row1.addLines(0.10386 / bounds.width - bounds.getX1());
    row1.addLines(0.2544 / bounds.width - bounds.getX1());
    row1.addLines(0.3635 / bounds.width - bounds.getX1());

    const row2 = new Row();
    row2.setOffset((0.371 - bounds.getY1()) / bounds.height);
    row2.setThickness(0.0937 / bounds.height);
    row2.addLines(0);
    row2.addLines(0.218 / bounds.width - bounds.getX1());

    measures.addRows(row1);
    measures.addRows(row2);

    page1.setMeasures(measures);

    const page2 = new Page();
    page2.setImage(new Uint8Array(await r2.arrayBuffer()));

    piece.addPages(page1);
    piece.addPages(page2);
  })();
</script>

<Loader promise={imagePromise} let:loaded>
  {#if loaded}
    <div class="flex h-full">
      {#each piece.getPagesList() as p, i}
        <PageComponent page={p} alt={`page ${i + 1}`} />
      {/each}
    </div>
  {:else}
    <p>Loading image...</p>
  {/if}
</Loader>
