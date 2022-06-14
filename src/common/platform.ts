export const enum Platform {
  WEB = "web",
  DESKTOP = "desktop",
  MOBILE = "mobile",
}

export const target = "kPlatform" as Platform

export function isTouch() {
  return window.matchMedia("(pointer: course)").matches
}
