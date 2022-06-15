<script lang="ts">
  import { defaults } from "~/types/generic"
  import { createEventDispatcher } from "svelte";
  import { classList } from "~/common/general";

  import type { Task } from "~/proto/local/data";
  import { toolNames } from "~/types/generic";
  import type { Tool } from "~/proto/local/data";

  import Select from "svelte-select";
  import Expandable from "~/form/Expandable.svelte";
  import Labeled from "~/form/Labeled.svelte";
  import Radio from "~/form/Radio.svelte";
  import Checkbox from "~/form/Checkbox.svelte";

  const dispatcher = createEventDispatcher<{ update: Task }>();

  export let className = "";
  export let task: Task = {
    tools: [],
    state: {
      hands: {
        oneofKind: "handsSeparate",
        handsSeparate: {
          left: [],
          right: [],
          number: defaults.timesInARow,
        },
      },
    },
  };

  const generateSelectItem = (t: string) => {
    return {
      value: t,
      label: toolNames[parseInt(t) as Tool],
    };
  };
  const items = Object.keys(toolNames).map(generateSelectItem);
  const onSelect = (list: { value: string; label: string }[] | null) => {
    if (!list) {
      task.tools = [];
      return;
    }
    task.tools = list.map((o) => parseInt(o.value));
    dispatcher("update", task);
  };
</script>

<div class={classList("max-h-80 w-full select-theme", className)}>
  <Select
    value={task.tools.length === 0
      ? null
      : task.tools.map((t) => generateSelectItem(t.toString()))}
    {items}
    containerClasses="select-container transition-all max-w-[210px]"
    isSearchable
    isMulti
    on:select={(e) => onSelect(e.detail)}
  />
  <Expandable label="task details" grow>
    <Labeled label="Hands">
      <Radio
        selected={task.state?.hands.oneofKind === "handsSeparate"
          ? "separate"
          : "together"}
        options={{
          separate: () => {
            if (!task.state) throw new Error("bad state");
            task.state.hands = {
              oneofKind: "handsSeparate",
              handsSeparate: {
                left: [],
                right: [],
                number: defaults.timesInARow,
              },
            };
            dispatcher("update", task);
          },
          together: () => {
            if (!task.state) throw new Error("bad state");
            task.state.hands = {
              oneofKind: "handsTogether",
              handsTogether: {
                completed: [],
                number: defaults.timesInARow,
              },
            };
            dispatcher("update", task);
          },
        }}
      />
    </Labeled>
    <Labeled label="Eyes closed">
      <Checkbox
        checked={!!task.state?.eyesClosed}
        on:change={(c) => {
          if (!task.state) throw new Error("bad state");
          task.state.eyesClosed = c.detail
            ? {
                completed: [],
                number: defaults.timesInARow,
              }
            : undefined;
          dispatcher("update", task);
        }}
      />
    </Labeled>
    <Labeled label="Memorized">
      <Checkbox
        checked={!!task.state?.memorized}
        on:change={(c) => {
          if (!task.state) throw new Error("bad state");
          task.state.memorized = c.detail
            ? {
                completed: [],
                number: defaults.timesInARow,
              }
            : undefined;
          dispatcher("update", task);
        }}
      />
    </Labeled>
  </Expandable>
</div>

<style>
  :global(.select-container) {
    border: none !important;
    padding: 0 !important;
  }

  :global(.selectContainer > input[type="text"]) {
    flex-basis: 0 !important;
    cursor: text !important;
  }

  :global(.multiSelectItem_clear > svg) {
    cursor: pointer !important;
  }

  :global(.multiSelectItem_label) {
    cursor: text !important;
    @apply text-base text-slate-900;
  }

  :global(.clearSelect) {
    display: none;
  }

  :global(.listContainer) {
    /* background: transparent !important; */
    /* backdrop-filter: blur(5px); */

    /* double backdrop-filter breaks on chromium */
    background: white !important;
  }

  :global(.listItem > div) {
    cursor: pointer !important;
    transition: 100ms ease-in-out all;
    color: rgb(15 23 42) !important;
  }

  :global(.listItem > div:not(.active)) {
    background: rgba(20, 20, 20, 0.1);
  }

  :global(.listItem > .hover) {
    background: rgba(20, 20, 20, 0.1) !important;
    font-weight: bold;
  }

  .select-theme {
    --background: transparent;

    --borderRadius: 10px;
    --borderFocusColor: gray;

    --multiItemBG: transparent;
    --multiItemActiveBG: transparent;
    --multiItemActiveColor: black;

    --multiLabelMargin: 2px 2px 0px 0px;

    --multiItemPadding: 0px;
    --multiItemMargin: 5px 5px 0px 5px;
    --multiItemHeight: 28px;
    --multiSelectPadding: 0px 35px 0px 12px;

    --multiClearBG: transparent;
    --multiClearHoverBG: transparent;
    --multiClearFill: gray;
    --multiClearHoverFill: rgb(15 23 42);
  }
</style>
