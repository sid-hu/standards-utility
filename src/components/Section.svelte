<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { fly } from "svelte/transition";
  import { classList } from "../common/general";
  import { isTouch } from "../common/platform";

  import type { Section } from "../proto/local/data";
  import { Wrap } from "../types/generic";

  import Edit from "../icons/Edit.svelte";
  import Remove from "../icons/Remove.svelte";
  import PanelIcon from "./PanelIcon.svelte";

  export let section: Section;
  export let sectionNumber: number;
  export let type: "left" | "right" | "inbetween";

  export let selected: boolean;
  export let hovered: boolean;

  const dispatcher = createEventDispatcher<{
    hover: boolean;
    select: number;
    edit: Section;
    delete: number;
  }>();

  const onfocus = (value: boolean) => {
    return () => {
      if (!isTouch()) {
        dispatcher("hover", value)
      }
    }
  }
</script>

<div
  transition:fly|local={{ y: 10 }}
  class={classList(
    "flex h-full",
    type === "left" ? "justify-start" : "",
    type === "right" ? "justify-end" : ""
  )}
>
  <div
    on:click={() => {
      if (isTouch() && !hovered) {
        dispatcher("hover", true);
        return;
      }
      if (selected) return;
      dispatcher("hover", false);
      dispatcher("select", sectionNumber);
    }}
    on:focus={onfocus(true)}
    on:mouseover={onfocus(true)}
    on:blur={onfocus(false)}
    on:mouseleave={onfocus(false)}
    class={classList(
      "flex items-center justify-center h-full",
      "border-slate-900 transition-all duration-500",
      selected ? "" : "hover:cursor-pointer",
      selected ? "" : "bg-slate-800 bg-opacity-20",
      selected && type === "inbetween" ? "" : "border-t-2 border-b-2",
      selected && (type === "left" || type === "right") ? "w-3" : "w-full",
      type === "left" ? "rounded-l-md" : type === "right" ? "rounded-r-md" : "",
      type === "left" ? "border-l-2" : type === "right" ? "border-r-2" : "",
      hovered ? "scale-105 backdrop-blur-[1px]" : ""
    )}
  >
    {#if hovered}
      {@const stats = Wrap.Section(section).completion()}
      <div transition:fly|local={{ y: -10 }}>
        <h2 class="font-bold">
          {section.from} - {section.to}
        </h2>
        <h3 class="block text-center italic text-xs font-semibold">
          {Math.round((stats.completed / stats.max) * 100)}%
        </h3>
      </div>
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
              dispatcher("delete", sectionNumber);
            }}
          />
        </div>
      </div>
    {/if}
  </div>
</div>
