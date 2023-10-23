/**
 * @module amino
 */

import vstruct from 'varstruct'
import { Buffer } from 'safe-buffer'
import is from 'is_js'

import * as BN from 'bn.js'


const a = (signed)=> {
    function decode () {
        throw Error('not implemented')
    }

    function encode (n, buffer = Buffer.alloc(encodingLength(n)), offset = 0) {
        if(n < 0) {
            throw Error('varint value is out of bounds')
        }

        // n = safeParseInt(n)
        n = n.toString();
        let bn = new BN(n, 10);

        // amino signed varint is multiplied by 2
        if (signed) {
            bn = bn.muln(2)
        }

        let i = 0;
        while (bn.gten(0x80)) {
            buffer[offset + i] = bn.andln(0xff) | 0x80;
            bn = bn.shrn(7);
            i++
        }

        buffer[offset + i] = bn.andln(0xff);
        encode.bytes = i + 1;
        return buffer
    }

    function encodingLength (n) {
        if (signed) n *= 2;
        if (n < 0) {
            throw Error('varint value is out of bounds')
        }
        let bits = Math.log2(n + 1);
        return Math.ceil(bits / 7) || 1
    }

    return { encode, decode, encodingLength }
};


const VarInt = a(true)
const UVarInt = a(false);
const VarString = vstruct.VarString(UVarInt);

/**
 * encode number
 * @param num
 */
export const encodeNumber = (num) => UVarInt.encode(num);

/**
 * encode bool
 * @param b
 */
export const encodeBool = (b) => b ? VarInt.encode(1): VarInt.encode(0);

/**
 * encode string
 * @param str
 */
export const encodeString = (str) => VarString.encode(str);

/**
 * encode time
 * @param value
 */
export const encodeTime = (value) => {
    const millis = new Date(value).getTime();
    const seconds = Math.floor(millis / 1000);
    const nanos = Number(seconds.toString().padEnd(9, '0'));

    const buffer = Buffer.alloc(14);

    buffer[0] = (1 << 3) | 1; // field 1, typ3 1
    buffer.writeUInt32LE(seconds, 1);

    buffer[9] = (2 << 3) | 5; // field 2, typ3 5
    buffer.writeUInt32LE(nanos, 10);

    return buffer
};

/**
 * js amino MarshalBinary
 * @param {Object} obj
 *  */
export const marshalBinary = (obj) => {
    if (!is.object(obj))
        throw new TypeError('data must be an object')

    return encodeBinary(obj, null, true).toString('hex')
};

/**
 * js amino MarshalBinaryBare
 * @param {Object} obj
 *  */
export const marshalBinaryBare = (obj) => {
    if (!is.object(obj))
        throw new TypeError('data must be an object');

    return encodeBinary(obj).toString('hex')
};

/**
 * This is the main entrypoint for encoding all types in binary form.
 * @param {*} val data type (not null, not undefined)
 * @param {Number} field index of object
 * @param {Boolean} isByteLenPrefix
 * @return {Buffer} binary of object.
 */
export const encodeBinary = (val, field, isByteLenPrefix) => {
    if (val === null || val === undefined)
        throw new TypeError('unsupported type');

    if(Buffer.isBuffer(val)) {
        if(isByteLenPrefix){
            return Buffer.concat([UVarInt.encode(val.length), val])
        }
        return val
    }

    if(is.array(val)){
        return encodeArrayBinary(field, val, isByteLenPrefix)
    }

    if(is.number(val)){
        return encodeNumber(val)
    }

    if(is.boolean(val)){
        return encodeBool(val)
    }

    if(is.string(val)){
        return encodeString(val)
    }

    if(is.object(val)){
        return encodeObjectBinary(val, isByteLenPrefix)
    }
};

/**
 * prefixed with bytes length
 * @param {Buffer} bytes
 * @return {Buffer} with bytes length prefixed
 */
export const encodeBinaryByteArray = (bytes) => {
    const lenPrefix = bytes.length;
    return Buffer.concat([UVarInt.encode(lenPrefix), bytes])
};

/**
 *
 * @param {Object} obj
 * @param {Boolean} isByteLenPrefix
 * @return {Buffer} with bytes length prefixed
 */
export const encodeObjectBinary = (obj, isByteLenPrefix) => {
    const bufferArr = [];

    Object.keys(obj).forEach((key, index) => {
        if (key === 'msgType' || key === 'version') return;

        if (isDefaultValue(obj[key])) return;

        if (is.array(obj[key]) && obj[key].length > 0) {
            bufferArr.push(encodeArrayBinary(index, obj[key]));
        }
        else {
            bufferArr.push(encodeTypeAndField(index, obj[key]));
            bufferArr.push(encodeBinary(obj[key], index, true));
        }
    });

    let bytes = Buffer.concat(bufferArr);

    // Write byte-length prefixed.
    if (isByteLenPrefix) {
        const lenBytes = UVarInt.encode(bytes.length);
        bytes = Buffer.concat([lenBytes, bytes])
    }

    return bytes
};

/**
 * @param {Number} fieldNum object field index
 * @param {Array} arr
 * @param {Boolean} isByteLenPrefix
 * @return {Buffer} bytes of array
 */
export const encodeArrayBinary = (fieldNum, arr, isByteLenPrefix) => {
    const result = [];

    arr.forEach((item) => {
        result.push(encodeTypeAndField(fieldNum, item));

        if (isDefaultValue(item)) {
            result.push(Buffer.from([0]));
            return
        }

        result.push(encodeBinary(item, fieldNum, true))
    });

    //encode length
    if (isByteLenPrefix) {
        const length = result.reduce((prev, item) => (prev + item.length), 0)
        result.unshift(UVarInt.encode(length))
    }

    return Buffer.concat(result)
};

// Write field key.
const encodeTypeAndField = (index, field) => {
    const value = (index + 1) << 3 | typeToTyp3(field);
    return UVarInt.encode(value);
};

// typeToTyp3
//amino type convert
const typeToTyp3 = (type) => {
    if(is.boolean(type)){
        return 0
    }

    if(is.number(type)){
        if(is.integer(type)){
            return 0
        }else{
            return 1
        }
    }

    if(is.string(type) || is.array(type) || is.object(type)){
        return 2
    }
};

const isDefaultValue = (obj) => {
    if(obj === null) return false;

    return (is.number(obj) && obj === 0)
        || (is.string(obj) && obj === '')
        || (is.array(obj) && obj.length === 0)
};
