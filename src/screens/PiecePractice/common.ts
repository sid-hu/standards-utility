import { cloneDeep } from "lodash";
import { writable } from "svelte/store";
import type { Section, Task } from "~/proto/local/data";
import { presets } from "~/types/generic";

export type SectionMap = {
  [key: number]: {
    type: "left" | "right" | "inbetween"
    section: number
  }
}

export type SectionState = {
  tasks: Task[]
  from?: number
  to?: number
}

export const createSectionState = () => {
  const { set, subscribe, update } = writable<SectionState>()
  return {
    set, subscribe, update,
    reset: () => set({ tasks: cloneDeep(presets.standard) }),
    use: (section: Section) => set(cloneDeep(section)),
  }
}

// export type Context = {
//   sectionMap: Writable<SectionMap>,
//   hasSections: Readable<boolean>
//   currentPage: Writable<Page>
//   state: Writable<State>
//   sectionState: ReturnType<typeof createSectionState>
//   editing: Writable<number | undefined>
// }
// export const contextID = Symbol()
