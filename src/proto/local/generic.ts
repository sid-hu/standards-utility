// @generated by protobuf-ts 2.6.0
// @generated from protobuf file "local/generic.proto" (syntax proto3)
// tslint:disable
import { WireType } from "@protobuf-ts/runtime";
import type { BinaryWriteOptions } from "@protobuf-ts/runtime";
import type { IBinaryWriter } from "@protobuf-ts/runtime";
import { UnknownFieldHandler } from "@protobuf-ts/runtime";
import type { BinaryReadOptions } from "@protobuf-ts/runtime";
import type { IBinaryReader } from "@protobuf-ts/runtime";
import type { PartialMessage } from "@protobuf-ts/runtime";
import { reflectionMergePartial } from "@protobuf-ts/runtime";
import { MESSAGE_TYPE } from "@protobuf-ts/runtime";
import { MessageType } from "@protobuf-ts/runtime";
/**
 * @generated from protobuf message Empty
 */
export interface Empty {
}
/**
 * @generated from protobuf message Box
 */
export interface Box {
    /**
     * @generated from protobuf field: double x1 = 1;
     */
    x1: number;
    /**
     * @generated from protobuf field: double y1 = 2;
     */
    y1: number;
    /**
     * @generated from protobuf field: double x2 = 3;
     */
    x2: number;
    /**
     * @generated from protobuf field: double y2 = 4;
     */
    y2: number;
}
/**
 * @generated from protobuf enum Tool
 */
export enum Tool {
    /**
     * @generated from protobuf enum value: ANALYSIS = 0;
     */
    ANALYSIS = 0,
    /**
     * @generated from protobuf enum value: BACKWARDS = 1;
     */
    BACKWARDS = 1,
    /**
     * @generated from protobuf enum value: CLAPPING = 2;
     */
    CLAPPING = 2,
    /**
     * @generated from protobuf enum value: CLAPPING_MEMORIZED = 3;
     */
    CLAPPING_MEMORIZED = 3,
    /**
     * @generated from protobuf enum value: CONDUCT = 4;
     */
    CONDUCT = 4,
    /**
     * @generated from protobuf enum value: COUNT_OUT_LOUD = 5;
     */
    COUNT_OUT_LOUD = 5,
    /**
     * @generated from protobuf enum value: GHOSTING = 6;
     */
    GHOSTING = 6,
    /**
     * @generated from protobuf enum value: LOOP = 7;
     */
    LOOP = 7,
    /**
     * @generated from protobuf enum value: METRONOME = 8;
     */
    METRONOME = 8,
    /**
     * @generated from protobuf enum value: RADIO = 9;
     */
    RADIO = 9,
    /**
     * @generated from protobuf enum value: RHYTHMS = 10;
     */
    RHYTHMS = 10,
    /**
     * @generated from protobuf enum value: SING = 11;
     */
    SING = 11,
    /**
     * @generated from protobuf enum value: SLOW = 12;
     */
    SLOW = 12,
    /**
     * @generated from protobuf enum value: TAPPING = 13;
     */
    TAPPING = 13,
    /**
     * @generated from protobuf enum value: TRANSPOSITION = 14;
     */
    TRANSPOSITION = 14
}
// @generated message type with reflection information, may provide speed optimized methods
class Empty$Type extends MessageType<Empty> {
    constructor() {
        super("Empty", []);
    }
    create(value?: PartialMessage<Empty>): Empty {
        const message = {};
        globalThis.Object.defineProperty(message, MESSAGE_TYPE, { enumerable: false, value: this });
        if (value !== undefined)
            reflectionMergePartial<Empty>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: Empty): Empty {
        return target ?? this.create();
    }
    internalBinaryWrite(message: Empty, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message Empty
 */
export const Empty = new Empty$Type();
// @generated message type with reflection information, may provide speed optimized methods
class Box$Type extends MessageType<Box> {
    constructor() {
        super("Box", [
            { no: 1, name: "x1", kind: "scalar", T: 1 /*ScalarType.DOUBLE*/ },
            { no: 2, name: "y1", kind: "scalar", T: 1 /*ScalarType.DOUBLE*/ },
            { no: 3, name: "x2", kind: "scalar", T: 1 /*ScalarType.DOUBLE*/ },
            { no: 4, name: "y2", kind: "scalar", T: 1 /*ScalarType.DOUBLE*/ }
        ]);
    }
    create(value?: PartialMessage<Box>): Box {
        const message = { x1: 0, y1: 0, x2: 0, y2: 0 };
        globalThis.Object.defineProperty(message, MESSAGE_TYPE, { enumerable: false, value: this });
        if (value !== undefined)
            reflectionMergePartial<Box>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: Box): Box {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* double x1 */ 1:
                    message.x1 = reader.double();
                    break;
                case /* double y1 */ 2:
                    message.y1 = reader.double();
                    break;
                case /* double x2 */ 3:
                    message.x2 = reader.double();
                    break;
                case /* double y2 */ 4:
                    message.y2 = reader.double();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    internalBinaryWrite(message: Box, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        /* double x1 = 1; */
        if (message.x1 !== 0)
            writer.tag(1, WireType.Bit64).double(message.x1);
        /* double y1 = 2; */
        if (message.y1 !== 0)
            writer.tag(2, WireType.Bit64).double(message.y1);
        /* double x2 = 3; */
        if (message.x2 !== 0)
            writer.tag(3, WireType.Bit64).double(message.x2);
        /* double y2 = 4; */
        if (message.y2 !== 0)
            writer.tag(4, WireType.Bit64).double(message.y2);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message Box
 */
export const Box = new Box$Type();
