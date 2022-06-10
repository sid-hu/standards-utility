import type { Task } from "../proto/local/data"
import type * as pb from "../proto/local/generic"
import { Tool } from "../proto/local/types"

export class Wrap {
  static Box(o: pb.Box) {
    return {
      ...o,
      width: function () {
        return this.x2 - this.x1
      },
      height: function () {
        return this.y2 - this.y1
      },
      midpoint: function () {
        return [
          this.x1 + this.width() / 2,
          this.y1 + this.height() / 2,
        ]
      }
    }
  }
}

export const toolNames: {
  [key in Tool]: string
} = {
  [Tool.ANALYSIS]: "analysis",
  [Tool.BACKWARDS]: "backwards",
  [Tool.CLAPPING]: "clapping",
  [Tool.CLAPPING_MEMORIZED]: "memorized clapping",
  [Tool.CONDUCT]: "conducting",
  [Tool.COUNT_OUT_LOUD]: "count out loud",
  [Tool.GHOSTING]: "ghosting",
  [Tool.LOOP]: "loop",
  [Tool.METRONOME]: "metronome",
  [Tool.RADIO]: "radio",
  [Tool.RHYTHMS]: "rhythms",
  [Tool.SING]: "sing",
  [Tool.SLOW]: "slow",
  [Tool.TAPPING]: "tapping",
  [Tool.TRANSPOSITION]: "transpose",
}

export const presets: { [key: string]: Task[] } = {
  standard: [
    {
      tools: [Tool.COUNT_OUT_LOUD],
      state: {
        hands: {
          oneofKind: "handsSeparate",
          handsSeparate: {
            left: false,
            right: false,

          }
        }
      }
    },
    {
      tools: [Tool.COUNT_OUT_LOUD, Tool.CONDUCT],
      state: {
        hands: {
          oneofKind: "handsSeparate",
          handsSeparate: {
            left: false,
            right: false,
          }
        }
      }
    },
    {
      tools: [Tool.COUNT_OUT_LOUD],
      state: {
        hands: {
          oneofKind: "handsTogether",
          handsTogether: { completed: false }
        }
      }
    },
  ],
  speed: [
    {
      tools: [Tool.CONDUCT, Tool.COUNT_OUT_LOUD],
      state: {
        hands: {
          oneofKind: "handsSeparate",
          handsSeparate: {
            left: false,
            right: false,
          }
        },
        eyesClosed: { completed: false }
      }
    },
    {
      tools: [Tool.METRONOME],
      state: {
        hands: {
          oneofKind: "handsTogether",
          handsTogether: { completed: false }
        }
      }
    },
  ],
}
