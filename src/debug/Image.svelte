<script lang="ts">
  import { Page, Piece } from "../proto/local/data_pb";
  import Image from "../components/Image.svelte"
  import Loader from "../Loader.svelte"

  const pb = new Piece();
  const page = new Page()

  const imagePromise = (async () => {
    const r = await window.fetch(`${window.location.origin}/examples/1.png`)
    page.setImage(new Uint8Array(await r.arrayBuffer()))
    pb.addPages(page)
  })()
</script>

<Loader promise={imagePromise} let:loaded>
  {#if loaded}
    <Image bytes={page.getImage_asU8()} alt="test image here" />
  {:else}
    <div style="m-auto">Loading image...</div>
  {/if}
</Loader>
