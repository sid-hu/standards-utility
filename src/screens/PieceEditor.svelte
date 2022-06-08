<script lang="ts">
  import { v4 } from "uuid";
  import { getDocument } from "pdfjs-dist";
  import { key } from "../wrappers/Message.svelte";

  import { fade, fly } from "svelte/transition";

  import { createEventDispatcher, getContext, onDestroy } from "svelte";
  import { form, field } from "svelte-forms";
  import { required } from "svelte-forms/validators";
  import { arrayRequired } from "../common/validators";

  import type { Page, Piece } from "../proto/local/data";
  import { imageStore } from "../store/image";

  import Uploader from "../utility/Uploader.svelte";
  import Panel from "../components/Panel.svelte";
  import Remove from "../icons/Remove.svelte";
  import PlaylistAdd from "../icons/PlaylistAdd.svelte";
  import TextInput from "../form/TextInput.svelte";
  import AddButton from "../components/AddButton.svelte";
  import Submission from "../form/Submission.svelte";
  import Position from "../wrappers/Position.svelte";
  import FormPanel from "../form/FormPanel.svelte";
  import Labeled from "../form/Labeled.svelte";

  export let piece: Piece;
  export let title: string;

  const dispatcher = createEventDispatcher<{
    submit: Piece | null;
  }>();

  const { showMessage } = getContext(key);
  const config = { validateOnChange: true };

  const name = field("name", piece.name, [required()], config);
  const author = field("author", piece.author, [required()], config);
  const pages = field("pages", piece.pages, [arrayRequired()], config);
  pages.validate();

  const pieceForm = form(name, author, pages);

  const uploadHandler = async (files: File[]) => {
    name.validate();
    author.validate();

    pages.set([
      ...$pages.value,
      ...(
        await Promise.all(
          files.map(async (f): Promise<Page[]> => {
            const bytes = new Uint8Array(await f.arrayBuffer());
            if (f.type === "application/pdf") {
              const pages: Page[] = [];

              showMessage("loading pdf...");
              const doc = await getDocument(bytes).promise;
              for (let i = 1; i < doc.numPages + 1; i++) {
                const page = await doc.getPage(i);
                const scale = 1080 / page.getViewport({ scale: 1 }).width;
                const viewport = page.getViewport({ scale: scale });

                const canvas = document.createElement("canvas");
                canvas.width = viewport.width;
                canvas.height = viewport.height;

                const context = canvas.getContext("2d")!;
                await page.render({
                  canvasContext: context,
                  viewport: viewport,
                }).promise;

                const blob = await new Promise<Blob>((r) =>
                  canvas.toBlob((b) => r(b!), "image/png")
                );

                pages.push({
                  image: new Uint8Array(await blob.arrayBuffer()),
                  sections: [],
                });
              }

              showMessage(undefined);
              return pages;
            } else {
              return [
                {
                  image: bytes,
                  sections: [],
                },
              ];
            }
          })
        )
      ).flat(),
    ]);
  };

  onDestroy(() => {
    for (const p of $pages.value) {
      imageStore.release(p.image);
    }
  });
</script>

<Uploader filter={["image/*", "application/pdf"]} handler={uploadHandler} />

<div class="flex h-full">
  {#each $pages.value as page, i}
    <div class="min-w-[360px] sm:min-w-[500px] h-full relative">
      <img
        transition:fly|local={{ x: -20 }}
        class="p-10 h-full object-contain"
        src={imageStore.fetch(page.image)}
        alt={`page ${i + 1}`}
      />
      <div
        class="bottom-16 absolute p-centered-x"
        transition:fly|local={{ y: 10 }}
      >
        <Panel
          styleActionable
          rounded="rounded-full"
          on:click={() => {
            pages.set([
              ...$pages.value.slice(0, i),
              ...$pages.value.slice(i + 1),
            ]);
            imageStore.release(page.image);
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

<Position x="left" y="top">
  <FormPanel>
    <h2 class="text-xl font-bold mb-3">{title}</h2>
    <div class="mb-4">
      <Labeled label="Title">
        <TextInput
          className="italic"
          placeholder="title"
          error={!$name.valid ? "required" : null}
          bind:value={$name.value}
        />
      </Labeled>
      <Labeled label="Author">
        <TextInput
          className="italic"
          placeholder="composer"
          error={!$author.valid ? "required" : null}
          bind:value={$author.value}
        />
      </Labeled>
    </div>
    <Submission
      disabled={!$pieceForm.valid}
      on:cancel={() => dispatcher("submit", null)}
      on:submit={() => {
        if (!piece.id) {
          piece.id = v4();
        }
        piece.name = $name.value;
        piece.author = $author.value;
        piece.pages = $pages.value;
        dispatcher("submit", piece);
      }}
    />
  </FormPanel>
</Position>

<Position x="right" y="bottom" margin="40px">
  <AddButton labelFor="file-input" />
</Position>
