<script lang="ts">
  import { fly } from "svelte/transition";

  import Loader from "../Loader.svelte";
  import PieceBrowser from "../screens/PieceBrowser.svelte";

  import { Measures, Piece } from "../proto/local/data_pb";
  import { Page, Row } from "../types/data";
  import PieceEditor from "../screens/PieceEditor.svelte";
  import PieceViewer from "../screens/PieceViewer.svelte";
  import { Box } from "../types/generic";

  const p1 = new Piece();
  p1.setName("Piece 1");
  p1.setAuthor("Author 1");

  const p2 = new Piece();
  p2.setName("Piece 2");
  p2.setAuthor("Author 2");

  let viewing: Piece | undefined;
  let editing: Piece | undefined;

  const imagePromise = (async () => {
    const r1 = await window.fetch(`${window.location.origin}/examples/1.png`);
    const r2 = await window.fetch(`${window.location.origin}/examples/2.png`);

    const measures = new Measures();
    const bounds = new Box({
      x1: 0.03728,
      y1: 0.2194,
      x2: 0.94,
      y2: 0.9374,
    });
    measures.setBounds(bounds);

    const row1 = new Row({
      offset: 0,
      thickness: 0.0937 / bounds.height,
      linesList: [
        0.10386 / bounds.width - bounds.getX1(),
        0.2544 / bounds.width - bounds.getX1(),
        0.3635 / bounds.width - bounds.getX1(),
      ],
    });

    const row2 = new Row({
      offset: (0.371 - bounds.getY1()) / bounds.height,
      thickness: 0.0937 / bounds.height,
      linesList: [0, 0.218 / bounds.width - bounds.getX1()],
    });

    measures.addRows(row1);
    measures.addRows(row2);

    p1.addPages(new Page({
      image: new Uint8Array(await r1.arrayBuffer()),
      sectionsList: [],
      measures: measures.toObject(),
    }));

    const r2Content = new Uint8Array(await r2.arrayBuffer())
    p1.addPages(new Page({
      image: r2Content,
      sectionsList: [],
      measures: new Measures().toObject(),
    }));

    p2.addPages(
      new Page({
        image: r2Content,
        sectionsList: [],
        measures: new Measures().toObject(),
      })
    );
  })();
</script>

<Loader promise={imagePromise} let:loaded>
  {#if viewing}
    <div class="h-full" in:fly={{ duration: 400, y: 10 }}>
      <PieceViewer piece={viewing} on:close={() => viewing = undefined} />
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
        pieces={[p1, p2]}
        on:choose={(p) => (viewing = p.detail)}
        on:edit={(p) => (editing = p.detail)}
        on:delete={(p) => console.log("deleted", p)}
      />
    </div>
  {:else}
    <div class="m-auto">Loading images...</div>
  {/if}
</Loader>
