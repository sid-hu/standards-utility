<script lang="ts">
  import { fly } from "svelte/transition";

  import Add from "../icons/Add.svelte";
  import Uploader from "../utility/Uploader.svelte";
  import type { Piece } from "../proto/local/data_pb";
  import { imageFromBytes } from "../common/general";
  import Panel from "../components/Panel.svelte";
  import Remove from "../icons/Remove.svelte";

  export let piece: Piece | null = null;

  let pages: string[] =
    piece?.getPagesList().map((p) => imageFromBytes(p.getImage_asU8())) ?? [];
  const uploadHandler = async (files: File[]) => {
    pages = [
      ...pages,
      ...(await Promise.all(
        files.map(async (f) => {
          return imageFromBytes(new Uint8Array(await f.arrayBuffer()));
        })
      )),
    ];
  };
</script>

<Uploader
  filter={(f) => f.type.split("/")[0] === "image"}
  handler={uploadHandler}
/>

<div class="flex h-full">
  {#each pages as image, i}
    <div class="h-full relative">
      <img
        transition:fly={{ x: -20 }}
        class="p-10 h-full object-contain"
        src={image}
        alt={`page ${i + 1}`}
      />
      <Panel
        rounded="rounded-full"
        className={[
          "absolute bottom-16 left-1/2 translate-x-[-50%]",
          "hover:cursor-pointer hover:bg-opacity-30 transition-all",
        ].join(" ")}
        onclick={() => {
          pages = [...pages.slice(0, i), ...pages.slice(i + 1)];
        }}
        let:hovered
      >
        {#if hovered}
          <div in:fly={{ duration: 300, y: -5 }}>
            <Remove expand={false} className="w-10 h-10 p-2 fill-slate-900" />
          </div>
        {:else}
          <p
            in:fly={{ duration: 300, y: 5 }}
            class="w-10 h-10 centered text-slate-600 font-bold"
          >
            {i + 1}
          </p>
        {/if}
      </Panel>
    </div>
  {/each}
</div>

<Panel rounded="rounded-lg" className="fixed top-8 left-8 px-5 py-3">
  <div class="flex justify-between">
    <h4 class="text-lg text-slate-900 font-bold mr-5">Title</h4>
    <input type="text" placeholder="title" />
  </div>
  <div class="flex justify-between">
    <h4 class="text-lg text-slate-900 font-bold mr-5">Author</h4>
    <input type="text" placeholder="composer" />
  </div>
</Panel>

<label
  for="file-input"
  class={[
    "fixed bottom-16 right-16 w-16 h-16",
    "border-4 border-transparent rounded-full hover:border-slate-900",
    "transition-all hover:scale-110 hover:cursor-pointer",
  ].join(" ")}
>
  <Add className="fill-slate-900" />
</label>
