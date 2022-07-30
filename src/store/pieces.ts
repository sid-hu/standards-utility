import { db } from "~/store/db"

import { Writable, writable } from "svelte/store";
import { BufferedUpdater } from "~/common/store";

import type { Piece } from "~/proto/local/data"

/* eslint-disable */
function proxyPB<T extends object>(pb: T, handler: () => void) {
  //@ts-ignore
  pb.__proxied = true
  const validator: ProxyHandler<T> = {
    get: (target, k) => {
      //@ts-ignore
      const value = target[k]
      if (
        typeof value === 'object' &&
        value !== null &&
        !ArrayBuffer.isView(value) &&
        //@ts-ignore
        !value.__proxied
      ) {
        return new Proxy(value, validator)
      }
      return value
    },
    deleteProperty: (target, p) => {
      //@ts-ignore
      delete target[p]
      handler()
      return true
    },
    set: (target, p, v: unknown) => {
      //@ts-ignore
      target[p] = v
      handler()
      return true
    }
  }
  return new Proxy(pb, validator)
}

function createPieceStore(initial: Piece[]): Writable<Piece[]> & {
  load: (p: Piece[]) => void
  add: (p: Piece) => void
  remove: (p: Piece) => void
} {
  const pieceStore = writable<Piece[]>(initial.map(
    (p) => constructPieceObject(p)
  ))
  return {
    ...pieceStore,
    load: (pieces: Piece[]) => {
      pieceStore.update(() => pieces.map(p => constructPieceObject(p)))
    },
    add: (piece: Piece) => {
      pieceStore.update(pieces => {
        db.set(piece).catch(e => { throw e })
        return [...pieces, constructPieceObject(piece)]
      })
    },
    remove: (piece: Piece) => {
      pieceStore.update(pieces => {
        db.remove(piece).catch(e => { throw e })
        return pieces.filter(v => v.id !== piece.id)
      })
    }
  }
}

function constructPieceObject(p: Piece) {
  const updater = new BufferedUpdater(() => {
    console.info("updated", p.id)
    db.set(p).catch(e => { throw e });
  });
  return proxyPB<Piece>(p, () => {
    updater.update();
  });
}

export const pieces = createPieceStore([])
