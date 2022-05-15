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

    get width() {
        return this.getX2() - this.getX1()
    }

    get height() {
        return this.getY2() - this.getY1()
    }

    normalized(): Box {
        const w = this.width
        const h = this.height
        const reference = w > h ? w : h
        return new Box({
            x1: 0,
            y1: 0,
            x2: w / reference,
            y2: h / reference,
        })
    }
}