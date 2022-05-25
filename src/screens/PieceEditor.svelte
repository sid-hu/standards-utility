<script lang="ts">
  import { v4 } from "uuid";
  import { fade, fly } from "svelte/transition";

  import { createEventDispatcher, onDestroy } from "svelte";
  import { form, field } from "svelte-forms";
  import { required } from "svelte-forms/validators";

  import { Page, Piece } from "../proto/local/data_pb";
  import { imageStore } from "../store/image";

  import Uploader from "../utility/Uploader.svelte";
  import Panel from "../components/Panel.svelte";

  import Remove from "../icons/Remove.svelte";
  import PlaylistAdd from "../icons/PlaylistAdd.svelte";

  import Button from "../form/Button.svelte";
  import TextInput from "../form/TextInput.svelte";
  import Expandable from "../form/Expandable.svelte";
  import Range from "../form/Range.svelte";

  import LinkButton from "../form/LinkButton.svelte";
  import AddButton from "../components/AddButton.svelte";

  export let piece: Piece;
  export let title: string;

  const dispatcher = createEventDispatcher<{ submit: Piece | null }>();

  const config = { validateOnChange: true };

  const name = field("name", piece.getName(), [required()], config);
  const author = field("author", piece.getAuthor(), [required()], config);
  const pages = field(
    "pages",
    piece.getPagesList(),
    [
      (value: []) => ({
        valid: value.length > 0,
        name: "required",
      }),
    ],
    config
  );
  pages.validate();

  const pieceForm = form(name, author, pages);

  piece.setId(v4());

  const uploadHandler = async (files: File[]) => {
    name.validate();
    author.validate();

    pages.set([
      ...$pages.value,
      ...(await Promise.all(
        files.map(async (f) => {
          const page = new Page();
          page.setImage(new Uint8Array(await f.arrayBuffer()));
          return page;
        })
      )),
    ]);
  };

  onDestroy(() => {
    for (const p of $pages.value) {
      imageStore.release(p.getImage_asU8());
    }
  });
</script>

<Uploader
  filter={(f) => f.type.split("/")[0] === "image"}
  handler={uploadHandler}
/>

<div class="flex h-full">
  {#each $pages.value as page, i}
    <div class="h-full relative">
      <img
        transition:fly|local={{ x: -20 }}
        class="p-10 h-full object-contain"
        src={imageStore.fetch(page.getImage_asU8())}
        alt={`page ${i + 1}`}
      />
      <div class="bottom-16 p-centered-x" transition:fly|local={{ y: 10 }}>
        <Panel
          styleHover
          rounded="rounded-full"
          on:click={() => {
            pages.set([
              ...$pages.value.slice(0, i),
              ...$pages.value.slice(i + 1),
            ]);
            imageStore.release(page.getImage_asU8());
          }}
          let:hovered
        >
          {#if hovered}
            <div in:fade|local={{ duration: 300 }}>
              <Remove className="w-10 h-10 p-2" />
            </div>
          {:else}
            <p
              in:fade|local={{ duration: 300 }}
              class="w-10 h-10 centered text-slate-600 font-bold"
            >
              {i + 1}
            </p>
          {/if}
        </Panel>
      </div>
    </div>
  {/each}
  {#if $pages.value.length === 0}
    <div class="m-auto centered flex-col">
      <PlaylistAdd className="w-12 h-12 mb-5" />
      <p class="font-semibold max-w-xs text-center">
        use the plus at the bottom right to add a page!
      </p>
    </div>
  {/if}
</div>

<Panel rounded="rounded-lg" className="fixed top-8 left-8 px-5 py-3">
  <h2 class="text-xl font-bold mb-3">{title}</h2>
  <div class="mb-3">
    <div class="flex items-start justify-between mb-1">
      <h4 class="text-md font-semibold mr-5">Title</h4>
      <TextInput
        bind:value={$name.value}
        error={!$name.valid ? "required" : null}
        className="italic"
        placeholder="title"
      />
    </div>
    <div class="flex items-start justify-between mb-1">
      <h4 class="text-md font-semibold mr-5">Author</h4>
      <TextInput
        bind:value={$author.value}
        error={!$author.valid ? "required" : null}
        className="italic"
        placeholder="composer"
      />
    </div>
  </div>
  <Expandable label="measure detection" className="mb-3">
    <h4 class="text-sm font-semibold my-1">Threshold</h4>
    <Range className="w-52 pb-2" min={0} max={1} step={0.1} />
  </Expandable>
  <div class="flex justify-between">
    <Button
      disabled={!$pieceForm.valid}
      on:click={() => {
        piece.setName($name.value);
        piece.setAuthor($author.value);
        piece.setPagesList($pages.value);
        dispatcher("submit", piece);
      }}
    >
      Done
    </Button>
    <LinkButton text="cancel" on:click={() => dispatcher("submit", null)} />
  </div>
</Panel>

<AddButton labelFor="file-input" />
