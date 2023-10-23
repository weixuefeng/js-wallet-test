import { Buffer } from 'safe-buffer'
import bech32 from 'bech32'
import * as eip55 from 'eip55'
import * as crypto from './crypto'
import * as utils from './utils'

export const NORMAL_SINGLE_SIG_ADDRESS_PREFIX = 'gt1';
export const NORMAL_MULTI_SIG_ADDRESS_PREFIX = 'gt2';
export const VAULT_SINGLE_SIG_ADDRESS_PREFIX = 'vault1';
export const VAULT_MULTI_SIG_ADDRESS_PREFIX = 'vault2';

export const genAddress = (publicKey, prefix) => {
    return genSingleSigAddress(publicKey, prefix);
};

export const genSingleSigAddress = (publicKey, prefix) => {
    if (typeof publicKey === 'string') {
        publicKey = Buffer.from(publicKey, 'hex');
    }

    prefix = prefix || NORMAL_SINGLE_SIG_ADDRESS_PREFIX;
    let sha512 = crypto.sha512(publicKey);
    let ripemd320 = crypto.ripemd320(sha512);

    let words = bech32.toWords(Buffer.from(ripemd320, 'hex'));
    return bech32.encode(prefix, words);
};

export const genMultiSigAddress = (pubKeys, threshold, prefix) => {
    let bytes = utils.encodeMultiSigPubKey(pubKeys, threshold);
    bytes = Buffer.from(bytes, 'hex');

    let sha512 = crypto.sha512(bytes);
    let ripemd320 = crypto.ripemd320(sha512);

    prefix = prefix || NORMAL_MULTI_SIG_ADDRESS_PREFIX;
    let words = bech32.toWords(Buffer.from(ripemd320, 'hex'));
    return bech32.encode(prefix, words);
};

export const isEthAddress = (address) => {
    return /^0[xX][0-9a-fA-F]{40}$/.test(address)
};

export const checkEthChecksumAddress = (address) => {
    return isEthAddress(address) && eip55.verify(address);
};

export const checkAddress = (address) => {
    if (isEthAddress(address)) {
        return true
    }

    try {
        const decoded = bech32.decode(address);
        return decoded.prefix === NORMAL_SINGLE_SIG_ADDRESS_PREFIX ||
            decoded.prefix === NORMAL_MULTI_SIG_ADDRESS_PREFIX ||
            decoded.prefix === VAULT_SINGLE_SIG_ADDRESS_PREFIX ||
            decoded.prefix === VAULT_MULTI_SIG_ADDRESS_PREFIX;
    }
    catch(err) {
        return false;
    }
};

export const convertAddress = (address, prefix = NORMAL_SINGLE_SIG_ADDRESS_PREFIX) => {
    if (isEthAddress(address)) {
        return eip55.encode(address.toLowerCase())
    }

    const decoded = bech32.decode(address);
    if (decoded.prefix === prefix) {
        return address;
    }

    return bech32.encode(prefix, decoded.words);
};
