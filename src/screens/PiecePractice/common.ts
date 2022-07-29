import { cloneDeep } from "lodash";
import { Readable, Writable, writable } from "svelte/store";
import type { Page, Section, Task } from "~/proto/local/data";
import { presets } from "~/types/generic";

export type SectionMap = {
  [key: number]: {
    type: "left" | "right" | "inbetween"
    section: number
  }
}

export type State = {
  mode: "practicing" | "editing"
  page: number
  hoveredMeasure?: number
  selectedSection?: number
}
export const makeState = (initial: boolean) => writable<State>({
  mode: initial ? "editing" : "practicing",
  page: 0,
})

export type SectionState = {
  tasks: Task[]
  from?: number
  to?: number
}
export const makeSectionState = () => {
  const { set, subscribe, update } = writable<SectionState>({
    tasks: presets.standard,
  })
  const empty = (): SectionState => { return { tasks: presets.standard } }
  return {
    set, subscribe, update, empty,
    reset: () => set(empty()),
    use: (section: Section) => set(cloneDeep(section)),
  }
}

export type Context = {
  sectionMap: Writable<SectionMap>,
  hasSections: Readable<boolean>
  currentPage: Writable<Page>
  state: Writable<State>
  sectionState: ReturnType<typeof makeSectionState>
  editing: Writable<Section | undefined>
}
export const contextID = Symbol()
