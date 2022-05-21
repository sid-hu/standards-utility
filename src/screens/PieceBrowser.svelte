<script lang="ts">
  import { flip } from "svelte/animate";
  import { fly } from "svelte/transition";

  import { imageStore } from "../store/image";
  import { classList } from "../common/general";
  import type { Piece } from "../proto/local/data_pb";

  import Panel from "../components/Panel.svelte";
  import Edit from "../icons/Edit.svelte";
  import Remove from "../icons/Remove.svelte";
  import { createEventDispatcher, onDestroy } from "svelte";

  export let pieces: Piece[];

  const dispatcher = createEventDispatcher<{
    choose: Piece;
    edit: Piece;
    delete: Piece;
  }>();

  onDestroy(() => {
    for (const p of pieces) {
      imageStore.release(p.getPagesList()[0].getImage_asU8());
    }
  });
</script>

<div class="flex flex-wrap items-start justify-center h-full sm:justify-start">
  {#each pieces as p (p.getId())}
    <div
      transition:fly|local={{ x: -10 }}
      animate:flip={{ duration: 400 }}
      class="m-10 centered flex-col transition-all"
    >
      <Panel
        bare
        className="relative w-fit h-fit"
        let:hovered
        on:click={() => dispatcher("choose", p)}
      >
        <img
          class={classList(
            "object-contain mb-4 transition-all ease-in-out",
            hovered ? "blur-sm" : "",
            "shadow-lg hover:cursor-pointer",
            "max-h-[400px] sm:max-h-80"
          )}
          src={imageStore.fetch(p.getPagesList()[0].getImage_asU8())}
          alt={`${p.getName()} cover`}
        />
        {#if hovered}
          <div class="p-centered">
            <div
              transition:fly|local={{ y: 5 }}
              on:click={(e) => {
                e.stopPropagation();
                dispatcher("delete", p);
              }}
            >
              <Panel rounded="rounded-full" className="p-1 my-1" styleHover>
                <Remove />
              </Panel>
            </div>
            <div
              transition:fly|local={{ y: -5 }}
              on:click={(e) => {
                e.stopPropagation();
                dispatcher("edit", p);
              }}
            >
              <Panel rounded="rounded-full" className="p-1 my-1" styleHover>
                <Edit />
              </Panel>
            </div>
          </div>
        {/if}
      </Panel>
      <h3 class="font-semibold text-2xl sm:text-xl">
        {p.getName()}
      </h3>
      <h4>{p.getAuthor()}</h4>
    </div>
  {/each}
  {#if pieces.length === 0}
    <h4 class="m-auto font-semibold">
      there are no pieces to practice at the moment
    </h4>
  {/if}
</div>
