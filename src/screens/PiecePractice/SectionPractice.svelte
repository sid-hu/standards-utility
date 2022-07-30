<script lang="ts">
  import { fly } from "svelte/transition";
  import { classList } from "~/common/general";
  import { getContext } from "svelte";
  import { contextID, Context } from "./common";
  import { Wrap } from "~/types/generic";
  import { writable } from "svelte/store";
  import type { Section } from "~/proto/local/data";

  import Adaptive from "~/components/common/Adaptive.svelte";
  import ConditionalWrap from "~/wrappers/ConditionalWrap.svelte";
  import Position from "~/wrappers/Position.svelte";
  import Expandable from "~/form/Expandable.svelte";
  import PracticeForm from "~/components/practice/PracticeForm.svelte";
  import Shortcut from "~/components/practice/Shortcut.svelte";

  const { state, currentPage } = getContext<Context>(contextID);

  const section = writable<Section | undefined>();
  state.subscribe(s => {
    if (s.selectedSection === undefined) {
      $section = undefined
      return
    }
    $section = $currentPage.sections[s.selectedSection]
  })

  const reset = () => {
    if ($state.selectedSection === undefined) return;
    const s = Wrap.Section($currentPage.sections[$state.selectedSection]);
    s.reset();
    $section = s;
  };

  const increment = (s: CustomEvent<boolean>) => {
    if (!$section) return;
    const tasks = $section.tasks;

    for (const task of tasks) {
      if (!task.state) continue;

      const taskState = Wrap.TaskState(task.state);
      const completion = taskState.completion();

      if (completion.completed < completion.max) {
        if (taskState.increment(s.detail)) {
          $section.tasks = tasks;
          return;
        }
      }
    }
  };
</script>

{#if $section !== undefined && $state.mode === "practicing"}
  <Adaptive
    stops={[
      {
        position: 1050,
        value: "small",
      },
      {
        position: 1400,
        value: "large",
      },
    ]}
    let:triggered={size}
  >
    <Position
      fit={size !== "small"}
      className={classList(
        size === "small" ? "px-10 flex justify-center w-full" : ""
      )}
      margin={size === "small" ? "90px" : undefined}
      x={size !== "small" ? "right" : "middle"}
      y={size !== "small" ? "top" : "bottom"}
    >
      <div
        class={size !== "small" ? "max-w-[240px]" : ""}
        in:fly|local={{ y: -20 }}
        out:fly|local={{ y: 10 }}
      >
        {#if size === "small"}
          <Shortcut on:reset={reset} on:increment={increment} />
        {/if}
        <ConditionalWrap
          component={Expandable}
          props={{ label: "practice notes", spring: false }}
          wrap={size === "small"}
        >
          <PracticeForm
            section={$section}
            on:exit={() => ($state.selectedSection = undefined)}
          />
          {#if size === "large"}
            <Shortcut on:reset={reset} on:increment={increment} />
          {/if}
        </ConditionalWrap>
      </div>
    </Position>
  </Adaptive>
{/if}
