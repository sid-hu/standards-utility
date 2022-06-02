<script lang="ts">
  import type { Page, Piece } from "../proto/local/data";
  import Image from "../components/Image.svelte"
  import Loader from "../Loader.svelte"

  let piece: Piece = {
    author: "",
    id: "",
    name: "",
    pages: []
  }

  const imagePromise = (async () => {
    const r = await window.fetch(`${window.location.origin}/examples/1.png`)
    const page: Page = {
      sections: [],
      image: new Uint8Array(await r.arrayBuffer())
    }
    piece.pages.push(page)
  })()
</script>

<Loader promise={imagePromise} let:loaded>
  {#if loaded}
    <Image bytes={piece.pages[0].image} alt="test image here" />
  {:else}
    <div class="m-auto">Loading image...</div>
  {/if}
</Loader>
