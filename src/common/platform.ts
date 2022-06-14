export const enum Platform {
  WEB = "web",
  DESKTOP = "desktop",
  MOBILE = "mobile",
}

export const target = "kPlatform" as Platform

export function isTouch() {
  return ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
}
