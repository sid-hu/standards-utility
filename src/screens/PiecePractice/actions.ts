import { editing, mode, selectedSection } from "./state"

// export const changepage = (direction: "left" | "right", max: number) => {
//   switch (direction) {
//     case "left":
//       return (page: number) => {
//         if (page > 0) {
//           return page - 1
//         }
//         return page
//       }
//     case "right":
//       return (page: number) => {
//         if (page < max - 1) {
//           return page + 1
//         }
//         return page
//       }
//   }
// }

export const exit = (context: "practicing" | "editing") => {
  switch (context) {
    case "practicing":
      selectedSection.set(undefined)
      break
    case "editing":
      editing.set(undefined)
      mode.set("practicing")
      break
  }
}
