import * as pb from "../proto/local/generic_pb"

export class PB {
  [key: string]: any
  toObject(): object {
    throw new Error("cannot initialize abstract class")
  }
}

export class Box extends pb.Box {
  constructor(o: pb.Box.AsObject) {
    super()
    this.setX1(o.x1)
    this.setY1(o.y1)
    this.setX2(o.x2)
    this.setY2(o.y2)
  }

  get midpoint() {
    return [
      this.getX1() + this.width / 2,
      this.getY1() + this.height / 2,
    ]
  }

  get width() {
    return this.getX2() - this.getX1()
  }

  get height() {
    return this.getY2() - this.getY1()
  }
}