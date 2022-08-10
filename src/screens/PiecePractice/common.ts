import { cloneDeep } from "lodash";
import { derived, get, Readable, writable } from "svelte/store";
import type { Section, Task } from "~/proto/local/data";
import { presets } from "~/types/generic";

type Stores = Readable<unknown> | [Readable<unknown>, ...Array<Readable<unknown>>] | Array<Readable<unknown>>;
type StoresValues<T> = T extends Readable<infer U> ? U :
    { [K in keyof T]: T[K] extends Readable<infer U> ? U : never };

export const writeDerived = <S extends Stores, T>(
  stores: S, callback: (values: StoresValues<S>) => T,
  write: (values: StoresValues<S>, value: T) => void
) => {
  let currentStoreValues: StoresValues<S> | undefined
  const updater = derived<S, T>(stores, (values) => {
    currentStoreValues = values
    return callback(values);
  })
  const writer = writable(get(updater))
  writer.subscribe(v => {
    if (currentStoreValues !== undefined) {
      write(currentStoreValues, v)
    }
  })
  updater.subscribe(v => {
    writer.set(v);
  })
  return writer
}

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
  const { set, subscribe, update } = writable<SectionState>({
    tasks: cloneDeep(presets.standard),
  })
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
