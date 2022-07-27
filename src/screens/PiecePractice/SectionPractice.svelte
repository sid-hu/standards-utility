<script lang="ts">
  import { fly } from "svelte/transition";
  import { classList } from "~/common/general";

  import Adaptive from "~/components/common/Adaptive.svelte";
  import ConditionalWrap from "~/wrappers/ConditionalWrap.svelte";
  import Position from "~/wrappers/Position.svelte";
  import Expandable from "~/form/Expandable.svelte";
  import PracticeForm from "~/components/practice/PracticeForm.svelte";
  import { getContext } from "svelte";
  import {
    currentPageID,
    CurrentPageStore,
    stateID,
    StateStore,
  } from "./common";

  const state = getContext<StateStore>(stateID);
  const currentPage = getContext<CurrentPageStore>(currentPageID);
</script>

{#if $state.selectedSection !== undefined && $state.mode === "practicing"}
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
    let:triggered
  >
    <Position
      fit={triggered !== "small"}
      className={classList(
        triggered === "small" ? "px-10 flex justify-center w-full" : ""
      )}
      margin={triggered === "small" ? "90px" : undefined}
      x={triggered !== "small" ? "right" : "middle"}
      y={triggered !== "small" ? "top" : "bottom"}
    >
      <div
        class={triggered !== "small" ? "max-w-[240px]" : ""}
        in:fly|local={{ y: -20 }}
        out:fly|local={{ y: 10 }}
      >
        <ConditionalWrap
          component={Expandable}
          props={{ label: "practice notes", spring: false }}
          wrap={triggered === "small"}
        >
          <PracticeForm
            section={$currentPage.sections[$state.selectedSection]}
            on:exit={() => ($state.selectedSection = undefined)}
          />
        </ConditionalWrap>
      </div>
    </Position>
  </Adaptive>
{/if}
