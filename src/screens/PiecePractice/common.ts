import { Writable, writable } from "svelte/store";
import type { Page, Section, Task } from "~/proto/local/data";
import { presets } from "~/types/generic";

export type SectionMap = {
  [key: number]: {
    type: "left" | "right" | "inbetween"
    section: number
  }
}

export const currentPageID = Symbol()
export type CurrentPageStore = Writable<Page>

export type State = {
  mode: "practicing" | "editing"
  page: number
  hoveredMeasure?: number
  selectedSection?: number
  hasSections: boolean
}
export const stateID = Symbol()
export const makeState = (initial: boolean) => writable<State>({
  mode: initial ? "editing" : "practicing",
  page: 0,
  hasSections: initial,
})
export type StateStore = ReturnType<typeof makeState>

export type SectionState = {
  editing?: Section
  tasks: Task[]
  from?: number
  to?: number
}
export const sectionStateID = Symbol()
export const makeSectionState = () => {
  const { set, subscribe, update } = writable<SectionState>({
    tasks: presets.standard,
  })
  return {
    set, subscribe, update,
    reset: () => set({ tasks: presets.standard }),
  }
}
export type SectionStateStore = ReturnType<typeof makeSectionState>
