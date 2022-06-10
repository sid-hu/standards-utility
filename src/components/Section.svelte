<script lang="ts">
  import { createEventDispatcher } from "svelte";

  import type { Section } from "../proto/local/data";

  import { fly } from "svelte/transition";
  import { classList } from "../common/general";

  import Edit from "../icons/Edit.svelte";
  import Remove from "../icons/Remove.svelte";
  import PanelIcon from "./PanelIcon.svelte";

  export let sections: Section[];
  export let measure: number;
  export let selected: number | undefined = undefined;

  const dispatcher = createEventDispatcher<{
    select: number;
    edit: Section;
    delete: number;
  }>();

  let hovered: number | undefined

  $: sectionMap = function() {
    const result: {
      [key: number]: {
        type: "left" | "right" | "inbetween",
        section: number,
      }
    } = {}
    for (let i = 0; i < sections.length; i++) {
      const s = sections[i];
      result[s.from] = {
        type: "left",
        section: i,
      };
      result[s.to] = {
        type: "right",
        section: i,
      };
      for (let m = s.from + 1; m < s.to; m++) {
        result[m] = {
          type: "inbetween",
          section: i,
        };
      }
    }
    return result
  }()
</script>

{#if sectionMap[measure]}
  {@const section = sections[sectionMap[measure].section]}
  {@const isSelected =
    selected !== undefined && sectionMap[measure].section === selected}
  {@const isHovered = measure === hovered && !isSelected}
  <div
    transition:fly|local={{ y: 10 }}
    class={classList(
      "flex h-full",
      sectionMap[measure].type === "left"
        ? "justify-start"
        : "",
      sectionMap[measure].type === "right"
        ? "justify-end"
        : ""
    )}
  >
    <div
      on:click={() => {
        if (isSelected) return;
        hovered = undefined
        dispatcher("select", sectionMap[measure].section);
      }}
      on:focus={() => hovered = measure}
      on:mouseover={() => hovered = measure}
      on:blur={() => hovered = undefined}
      on:mouseleave={() => hovered = undefined}
      class={classList(
        "flex items-center justify-center h-full",
        "border-slate-900 transition-all duration-500",
        isSelected ? "" : "hover:cursor-pointer",
        isSelected ? "" : "bg-slate-800 bg-opacity-20",
        isSelected && sectionMap[measure].type === "inbetween"
          ? ""
          : "border-t-2 border-b-2",
        isSelected &&
          (sectionMap[measure].type === "left" ||
            sectionMap[measure].type === "right")
          ? "w-3"
          : "w-full",
        sectionMap[measure].type === "left"
          ? "rounded-l-md"
          : sectionMap[measure].type === "right"
          ? "rounded-r-md"
          : "",
        sectionMap[measure].type === "left"
          ? "border-l-2"
          : sectionMap[measure].type === "right"
          ? "border-r-2"
          : "",
        isHovered ? "scale-105 backdrop-blur-[1px]" : ""
      )}
    >
      {#if isHovered}
        <h4 class="font-bold text-slate-900" transition:fly|local={{ y: -10 }}>
          {section.from} - {section.to}
        </h4>
        <div
          class={classList(
            "absolute top-[100%] h-fit w-full",
            "flex justify-center hover:cursor-default"
          )}
        >
          <div class="my-2" transition:fly|local={{ y: 10, duration: 300 }}>
            <PanelIcon
              className="w-4 h-4 m-1"
              icon={Edit}
              styleActionable
              on:click={(e) => {
                e.stopPropagation();
                dispatcher("edit", section);
              }}
            />
          </div>
          <div class="my-2" transition:fly|local={{ y: 15, duration: 600 }}>
            <PanelIcon
              className="w-4 h-4 m-1"
              icon={Remove}
              styleActionable
              on:click={(e) => {
                e.stopPropagation();
                dispatcher("delete", sectionMap[measure].section);
              }}
            />
          </div>
        </div>
      {/if}
    </div>
  </div>
{/if}
