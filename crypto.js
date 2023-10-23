import { Buffer } from 'safe-buffer'
import createHash from 'create-hash'
import ed25519 from 'bip32-ed25519'
import * as Ripemd from './crypto_api/ripemd.js'
import {toHex} from "./crypto_api/hex.js";
import {fromArrayBuffer} from "./crypto_api/array-buffer.js";


export const sha1 = (buffer) => {
    return createHash('sha1').update(buffer).digest();
};

export const ripemd160 = (buffer) => {
    return createHash('rmd160').update(buffer).digest();
};

export const ripemd320 = (buffer) => {
    let hasher = new Ripemd.default({length: 320});
    hasher.update(fromArrayBuffer(buffer));
    return toHex(hasher.finalize());
};

export const sha256 = (buffer) => {
    return createHash('sha256').update(buffer).digest();
};

export const sha512 = (buffer) => {
    return createHash('sha512').update(buffer).digest();
};

export const hash160 = (buffer) => {
    return ripemd160(sha256(buffer));
};

export const hash256 = (buffer) => {
    return sha256(sha256(buffer));
};

export const getPublicKey = privateKey => {
    if (typeof privateKey === 'string') {
        privateKey = Buffer.from(privateKey, 'hex');
    }
    return ed25519.toPublic(privateKey);
};

export const sign = (privateKey, message) => {
    if (typeof privateKey === 'string') {
        privateKey = Buffer.from(privateKey, 'hex');
    }

    if (typeof message === 'string') {
        message = Buffer.from(message, 'hex');
    }

    return Buffer.from(ed25519.sign(message, privateKey));
};

export const verify = (publicKey, message, signature) => {
    if (typeof message === 'string') {
        message = Buffer.from(message, 'hex');
    }

    return ed25519.verify(message, signature, publicKey);
};