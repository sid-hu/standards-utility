<script lang="ts">
  import { fly } from "svelte/transition";

  import { Page, Piece } from "../proto/local/data_pb";
  import { classList, imageFromBytes } from "../common/general";

  import Uploader from "../utility/Uploader.svelte";
  import Panel from "../components/Panel.svelte";

  import Add from "../icons/Add.svelte";
  import Remove from "../icons/Remove.svelte";
  import PlaylistAdd from "../icons/PlaylistAdd.svelte";

  import Button from "../form/Button.svelte";
  import TextInput from "../form/TextInput.svelte";
  import Expandable from "../form/Expandable.svelte";
  import Range from "../form/Range.svelte";
  import { createEventDispatcher } from "svelte";

  export let piece: Piece;
  export let title: string;

  const dispatcher = createEventDispatcher<{ submit: void }>();

  let pages: Page[] = piece?.getPagesList() ?? [];
  const uploadHandler = async (files: File[]) => {
    pages = [
      ...pages,
      ...(await Promise.all(
        files.map(async (f) => {
          const page = new Page();
          page.setImage(new Uint8Array(await f.arrayBuffer()));
          return page;
        })
      )),
    ];
    piece.setPagesList(pages);
  };
</script>

<Uploader
  filter={(f) => f.type.split("/")[0] === "image"}
  handler={uploadHandler}
/>

<div class="flex h-full">
  {#if pages.length === 0}
    <div class="m-auto centered flex-col">
      <PlaylistAdd className="w-12 h-12 mb-5 fill-slate-900" />
      <p class="font-semibold max-w-xs text-center">
        use the plus at the bottom right to add a page!
      </p>
    </div>
  {/if}
  {#each pages as image, i}
    <div class="h-full relative">
      <img
        transition:fly={{ x: -20 }}
        class="p-10 h-full object-contain"
        src={imageFromBytes(image.getImage_asU8())}
        alt={`page ${i + 1}`}
      />
      <Panel
        rounded="rounded-full"
        className={[
          "absolute bottom-16 left-1/2 translate-x-[-50%]",
          "hover:cursor-pointer hover:bg-opacity-30 transition-all",
        ].join(" ")}
        on:click={() => {
          pages = [...pages.slice(0, i), ...pages.slice(i + 1)];
          piece.setPagesList(pages);
        }}
        let:hovered
      >
        {#if hovered}
          <div in:fly={{ duration: 300, y: -5 }}>
            <Remove className="w-10 h-10 p-2 fill-slate-900" />
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
  <h2 class="text-xl font-bold mb-3">{title}</h2>
  <div class="mb-3">
    <div class="flex justify-between mb-1">
      <h4 class="text-md font-semibold mr-5">Title</h4>
      <TextInput
        on:change={(s) => piece.setName(s.detail)}
        className="italic"
        placeholder="title"
      />
    </div>
    <div class="flex justify-between mb-1">
      <h4 class="text-md font-semibold mr-5">Author</h4>
      <TextInput
        on:change={(s) => piece.setAuthor(s.detail)}
        className="italic"
        placeholder="composer"
      />
    </div>
  </div>
  <Expandable label="measure detection" className="mb-3">
    <h4 class="text-sm font-semibold my-1">Threshold</h4>
    <Range className="w-52 pb-2" min={0} max={1} step={0.1} />
  </Expandable>
  <Button on:click={() => dispatcher("submit")}>Done</Button>
</Panel>

<label
  for="file-input"
  class={classList(
    "fixed bottom-10 right-10 w-16 h-16",
    "border-4 border-transparent rounded-full transition-all",
    "hover:border-slate-900 hover:scale-110 hover:cursor-pointer",
    "active:translate-y-1"
  )}
>
  <Add className="w-full h-full fill-slate-900" />
</label>
