import { base64StringToArrayBuffer } from "@tensorflow/tfjs-core/dist/io/io_utils"
import { createHash } from "sha1-uint8array"
import { imageFromBytes } from "../common/general"

export class ImageStore {
  store: {
    [key: string]: {
      url: string,
      references: number,
      timeout?: NodeJS.Timeout
    }
  } = {}

  fetch(data: Uint8Array): string {
    const hash = createHash().update(data).digest("hex")
    if (!this.store[hash]) {
      const url = imageFromBytes(data)
      this.store[hash] = {
        url: url,
        references: 0,
      }
    }

    this.store[hash].references++
    return this.store[hash].url
  }

  release(data: Uint8Array) {
    const hash = createHash().update(data).digest("hex")
    this.store[hash].references--
    if (this.store[hash].timeout) {
      clearTimeout(this.store[hash].timeout!)
    }
    this.store[hash].timeout = setTimeout(() => {
      if (this.store[hash].references === 0) {
        URL.revokeObjectURL(this.store[hash].url)
        delete this.store[hash]
      }
    }, 30000)
  }
}

export const imageStore = new ImageStore()
