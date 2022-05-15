import { Box } from "../../types/generic"

export class Layer {
    parent?: Layer
    box: Box
    children: Layer[]

    constructor(box: Box, parent?: Layer) {
        this.parent = parent
        this.box = box
        this.children = []
    }
}

// export class Root extends Layer {
//     element: HTMLElement

//     constructor(e: HTMLElement, children: Layer[]) {
//         super(pbFromObject<Box, Box.AsObject>(Box, {
//             x1: 0,
//             y1: 0,
//             x2: e.clientWidth,
//             y2: e.clientHeight
//         }))
//         const observer = new ResizeObserver(() => {
//             this.box.setX2(e.clientWidth)
//             this.box.setY2(e.clientHeight)
//         })
//         observer.observe(e)
//         this.element = e
//         this.children = children
//     }
// }

export class Centered extends Layer {
    constructor(parent: Layer, child: Layer) {
        const halfWidth = child.box.width / 2
        const halfHeight = child.box.height / 2
        super(new Box({
            x1: 0.5 - halfWidth,
            y1: 0.5 - halfHeight,
            x2: 0.5 + halfWidth,
            y2: 0.5 + halfHeight,
        }), parent)
    }
}
