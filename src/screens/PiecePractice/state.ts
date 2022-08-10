import type { Piece } from "~/proto/local/data";
import { derived, get, writable } from "svelte/store";
import { createSectionState, writeDerived } from "./common";
import { getContext, setContext } from "svelte";

const key = Symbol()

export const makeContext = (init: Piece) => {
  const root = writable<Piece>(init)

  const mode = writable<"practicing" | "editing">("practicing")
  const page = writable(0)
  const selectedSection = writable<number | undefined>()
  const sectionState = createSectionState()

  const sections = writeDerived(
    [root, page],
    ([$root, $page]) => $root.pages[$page].sections,
    ([$root, $page], s) => $root.pages[$page].sections = s
  )

  const currentSection = writeDerived(
    [sections, selectedSection],
    ([$sections, $selectedSection]) => {
      if ($selectedSection === undefined) {
        return undefined
      }
      return $sections[$selectedSection];
    },
    ([$sections, $selectedSection], value) => {
      if ($selectedSection !== undefined && value) {
        $sections[$selectedSection] = value
      }
    }
  )

  const hasSections = derived(
    sections,
    ($sections) => $sections.length > 0
  )
  mode.set(!get(hasSections) ? "editing" : "practicing")

  const sectionMap = derived(
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

  const editing = writable<number | undefined>()

  const context = {
    root, mode, page, selectedSection, sections,
    sectionState, currentSection, hasSections,
    sectionMap, editing,
  }
  setContext(key, context)
  return context
}

export const requestContext = () => getContext<ReturnType<typeof makeContext>>(key)
