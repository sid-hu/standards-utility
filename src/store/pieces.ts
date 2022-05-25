import { db } from "../data/store"

import { Writable, writable } from "svelte/store";
import { BufferedUpdater } from "../common/store";
import { proxyPB } from "./state";

import type { Piece } from "../proto/local/data_pb"

function createPieceStore(initial: Piece[]): Writable<Piece[]> & {
    add: (p: Piece) => void
    remove: (p: Piece) => void
} {
    const pieceStore = writable<Piece[]>(initial.map(
        (p) => constructPieceObject(p)
    ))
    return {
        ...pieceStore,
        add: (piece: Piece) => {
            pieceStore.update(pieces => {
                db.set(piece)
                return [...pieces, constructPieceObject(piece)]
            })
        },
        remove: (piece: Piece) => {
            pieceStore.update(pieces => {
                db.remove(piece)
                return pieces.filter(v => v.getId() !== piece.getId())
            })
        }
    }
}

function constructPieceObject(p: Piece) {
    const updater = new BufferedUpdater(() => {
        db.set(p);
    });
    return proxyPB<Piece>(p, () => {
        updater.update();
    });
}

export const pieces = createPieceStore([])
