export const enum Platform {
  WEB = "web",
  DESKTOP = "desktop",
  MOBILE = "mobile",
}

export const target = "kPlatform" as Platform

let touch: boolean | undefined
export function isTouch() {
  if (!touch) {
    const mediaList = window.matchMedia("(pointer: coarse)")
    touch = mediaList.matches
    mediaList.onchange = (value) => {
      touch = value.matches
    }
  }
  return touch
}
