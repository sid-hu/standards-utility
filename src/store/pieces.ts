import { db } from "~/store/db"

import { Writable, writable } from "svelte/store";
import { BufferedUpdater } from "~/common/store";

import type { Piece } from "~/proto/local/data"

function proxyPB<T extends object>(pb: T, handler: () => void) {
  const validator: ProxyHandler<any> = {
    getPrototypeOf(key) {
      return Proxy.prototype
    },
    get: (target, k) => {
      const value = target[k]
      if (
        typeof value === 'object' &&
        value !== null &&
        !ArrayBuffer.isView(value)
      ) {
        if (Object.getPrototypeOf(value) === Proxy.prototype) {
          return value
        }
        return new Proxy(value, validator)
      }
      return value
    },
    deleteProperty: (target, p) => {
      delete target[p]
      handler()
      return true
    },
    set: (target, p, v) => {
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
        db.set(piece)
        return [...pieces, constructPieceObject(piece)]
      })
    },
    remove: (piece: Piece) => {
      pieceStore.update(pieces => {
        db.remove(piece)
        return pieces.filter(v => v.id !== piece.id)
      })
    }
  }
}

function constructPieceObject(p: Piece) {
  const updater = new BufferedUpdater(() => {
    console.info("updated", p.id)
    db.set(p);
  });
  return proxyPB<Piece>(p, () => {
    updater.update();
  });
}

export const pieces = createPieceStore([])
