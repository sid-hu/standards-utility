import type * as pb from "../proto/local/generic"

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
