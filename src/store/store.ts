import { IDBPDatabase, openDB } from "idb"
import type { Piece } from "../proto/local/data_pb";
import { Platform, target } from "../common/platform"

export interface Store {
    load(): Promise<Piece[]>
    add(piece: Piece): Promise<void>
    remove(piece: Piece): Promise<void>
}

export class DummyStore implements Store {
    load(): Promise<Piece[]> {
        throw new Error("Method not implemented.");
    }
    add(piece: Piece): Promise<void> {
        throw new Error("Method not implemented.");
    }
    remove(piece: Piece): Promise<void> {
        throw new Error("Method not implemented.");
    }
}

export class IDBStore implements Store {
    name = "pieces"
    db?: IDBPDatabase<Piece>

    async load(): Promise<Piece[]> {
        this.db = await openDB("standards-utility", 1, {
            upgrade: (db, oldVersion, newVersion, transaction) => {
                db.createObjectStore(this.name, { keyPath: "id" })
            }
        })
        return await this.db.getAll(this.name)
    }

    async add(piece: Piece): Promise<void> {
        if (!this.db) {
            throw new Error("store has not been loaded yet! please call load() first")
        }
        const tx = this.db.transaction(this.name, "readwrite")
        tx.store.add(piece, piece.getId())
        await tx.done
    }

    async remove(piece: Piece): Promise<void> {
        if (!this.db) {
            throw new Error("store has not been loaded yet! please call load() first")
        }
        const tx = this.db.transaction(this.name, "readwrite")
        tx.store.delete(piece.getId())
        await tx.done
    }
}

export const store = target === Platform.WEB ?
    new IDBStore() :
    new DummyStore()
