import { derived, Readable, writable } from "svelte/store";
import type { Piece } from "~/proto/local/data";
import { createSectionState } from "./common";

type Stores = Readable<any> | [Readable<any>, ...Array<Readable<any>>] | Array<Readable<any>>;
type StoresValues<T> = T extends Readable<infer U> ? U : {
    [K in keyof T]: T[K] extends Readable<infer U> ? U : never;
};

export const derivedWritable = <S extends Stores, T>(stores: S, callback: (values: StoresValues<S>) => T) => {
  let setDerived: (value: T) => void
  let lastAccessed: T
  const store = derived<S, T>(stores, (values, set) => {
    setDerived = set
    lastAccessed = callback(values)
  })
  return {
    ...store,
    set: (value: T) => {
      setDerived(value)
    },
    update: (callback: (value: T) => T) => {
      lastAccessed = callback(lastAccessed)
      setDerived(lastAccessed)
    }
  }
}

export const root = writable<Piece>()

export const mode = writable<"practicing" | "editing">("practicing")
export const page = writable(0)
export const selectedSection = writable<number | undefined>()
export const sectionState = createSectionState()

export const sections = derivedWritable(
  [root, page],
  ([$root, $page]) => $root.pages[$page].sections
)

export const section = derivedWritable(
  [sections, selectedSection],
  ([$sections, $selectedSection]) => {
    if ($selectedSection === undefined) {
      return undefined
    }
    return $sections[$selectedSection];
  }
)

export const hasSections = derived(
  sections,
  ($sections) => $sections.length > 0
)

export const sectionMap = derived(
  sections,
  $sections => {
    const map: {
      [key: number]: {
        type: "left" | "right" | "inbetween";
        section: number;
      };
    } = {};
    for (let i = 0; i < $sections.length; i++) {
      const s = $sections[i];
      map[s.from] = {
        type: "left",
        section: i,
      };
      map[s.to] = {
        type: "right",
        section: i,
      };
      for (let m = s.from + 1; m < s.to; m++) {
        map[m] = {
          type: "inbetween",
          section: i,
        };
      }
    }
    return map
  }
)

export const editing = writable<number | undefined>()
