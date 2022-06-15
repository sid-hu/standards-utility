import { IDBPDatabase, openDB } from "idb"
import { Platform, target } from "~/common/platform"
import { Piece } from "~/proto/local/data";

export interface DB {
    load(): Promise<Piece[]>
    set(piece: Piece): Promise<void>
    remove(piece: Piece): Promise<void>
}

export class DummyDB implements DB {
    load(): Promise<Piece[]> {
        throw new Error("Method not implemented.");
    }
    set(piece: Piece): Promise<void> {
        throw new Error("Method not implemented.");
    }
    remove(piece: Piece): Promise<void> {
        throw new Error("Method not implemented.");
    }
}

export class WebDB implements DB {
    name = "pieces"
    db?: IDBPDatabase<{ id: string, serialized: Uint8Array }>

    async load(): Promise<Piece[]> {
        this.db = await openDB("standards-utility", 1, {
            upgrade: (db, oldVersion, newVersion, transaction) => {
                db.createObjectStore(this.name, { keyPath: "id" })
            }
        })
        return (await this.db.getAll(this.name))
            .map(v => Piece.fromBinary(new Uint8Array(v.serialized)))
    }

    async set(piece: Piece): Promise<void> {
        if (!this.db) {
            throw new Error("store has not been loaded yet! please call load() first")
        }
        const tx = this.db.transaction(this.name, "readwrite")
        tx.store.put({
            id: piece.id,
            serialized: Piece.toBinary(piece).buffer
        })
        await tx.done
    }

    async remove(piece: Piece): Promise<void> {
        if (!this.db) {
            throw new Error("store has not been loaded yet! please call load() first")
        }
        const tx = this.db.transaction(this.name, "readwrite")
        tx.store.delete(piece.id)
        await tx.done
    }
}

export const db = target === Platform.WEB ?
    new WebDB() :
    new DummyDB()
