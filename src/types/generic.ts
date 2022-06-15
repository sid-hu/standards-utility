import { TaskState, Section, Box, Task, Tool } from "~/proto/local/data"

export class Wrap {
  static Box(o: Box) {
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
  static Section(o: Section) {
    return {
      ...o,
      completion: function() {
        let completed = 0
        let max = 0
        for (const t of this.tasks) {
          if (t.state) {
            const stats = Wrap.TaskState(t.state).completion()
            completed += stats.completed
            max += stats.max
          }
        }
        return { completed, max }
      }
    }
  }
  static TaskState(o: TaskState) {
    return {
      ...o,
      completion: function () {
        let completed = 0
        let max = 0

        if (this.hands.oneofKind === "handsSeparate") {
          max += this.hands.handsSeparate.number * 2
          completed += this.hands.handsSeparate.left.length +
            this.hands.handsSeparate.right.length
        } else if (this.hands.oneofKind === "handsTogether") {
          max += this.hands.handsTogether.number
          completed += this.hands.handsTogether.completed.length
        }

        max += this.eyesClosed?.number ?? 0
        completed += this.eyesClosed?.completed.length ?? 0

        max += this.memorized?.number ?? 0
        completed += this.memorized?.completed.length ?? 0

        return { completed, max }
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

export const defaults: {
  timesInARow: number
} = {
  timesInARow: 4
}

export const presets: { [key: string]: Task[] } = {
  empty: [],
  standard: [
    {
      tools: [Tool.COUNT_OUT_LOUD],
      state: {
        hands: {
          oneofKind: "handsSeparate",
          handsSeparate: {
            left: [],
            right: [],
            number: defaults.timesInARow,
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
            left: [],
            right: [],
            number: defaults.timesInARow,
          }
        }
      }
    },
    {
      tools: [Tool.COUNT_OUT_LOUD],
      state: {
        hands: {
          oneofKind: "handsTogether",
          handsTogether: { completed: [], number: defaults.timesInARow }
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
            left: [],
            right: [],
            number: defaults.timesInARow,
          }
        },
        eyesClosed: { completed: [], number: defaults.timesInARow }
      }
    },
    {
      tools: [Tool.METRONOME],
      state: {
        hands: {
          oneofKind: "handsTogether",
          handsTogether: { completed: [], number: defaults.timesInARow }
        }
      }
    },
  ],
}
