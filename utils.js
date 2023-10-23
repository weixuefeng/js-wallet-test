import bech32 from 'bech32'
// import * as amino from '@tendermint/amino-js'
import * as crypto from './crypto.js'
import * as cdc from './encoder/index.js'

const PUBLIC_KEY_PREFIX = 'gt1pub';

export const compareBuffer = (buffer1, buffer2) => {
    if (buffer1.length > buffer2.length) {
        return 1;
    }
    else if (buffer1.length < buffer2.length) {
        return -1;
    }

    for (let i = 0; i < buffer1.length; i++) {
        if (buffer1[i] > buffer2[i]) {
            return 1;
        }
        else if (buffer1[i] < buffer2[i]) {
            return -1;
        }
    }

    return 0;
};

export const encodeMultiSigPubKey = (pubKeys, threshold) => {
    let obj = {
        K: parseInt(threshold),
        PubKeys: pubKeys
            .sort((pk1, pk2) => {
                if (typeof pk1 === 'string') {
                    pk1 = Buffer.from(pk1, 'hex');
                }
                let hash1 = crypto.hash160(pk1);

                if (typeof pk2 === 'string') {
                    pk2 = Buffer.from(pk2, 'hex');
                }
                let hash2 = crypto.hash160(pk2);

                return compareBuffer(hash1, hash2);
            })
            .map((pk) => {
                if (typeof pk === 'string') {
                    pk = Buffer.from(pk, 'hex');
                }
                return Buffer.concat([Buffer.from('e1e1a0fa', 'hex'), Buffer.from([pk.length]), pk])
            })
    };

    return '38149471' + cdc.marshalBinaryBare(obj);
    // return Buffer.from(amino.marshalPubKeyMultisigThreshold(obj)).toString('hex')
};

export const genMultiSigPubKeyBech32 = (pubKeys, threshold) => {
    let buffer = Buffer.from(encodeMultiSigPubKey(pubKeys, threshold), 'hex');
    return bech32.encode(PUBLIC_KEY_PREFIX, bech32.toWords(buffer), 900);
};

export const genPubKeyBech32 = (publicKey) => {
    if (typeof publicKey === 'string') {
        publicKey = Buffer.from(publicKey, 'hex');
    }
    let buffer = Buffer.concat([Buffer.from('e1e1a0fa', 'hex'), Buffer.from([publicKey.length]), publicKey]);
    return bech32.encode(PUBLIC_KEY_PREFIX, bech32.toWords(buffer), 900);
};
