import { Buffer } from 'safe-buffer'
// const randomBuffer = require('random-buffer');
import * as randomBuffer from 'random-buffer'
import * as crypto from './crypto.js'
import * as utils from './utils.js'
import * as cdc from './encoder/index.js'

export const PubKeyType = {
    PubKeySecp256k1: 'gatechain/PubKeySecp256k1',
    PubKeyEd25519: 'gatechain/PubKeyEd25519',
    PubKeyMultisigThreshold: 'gatechain/PubKeyMultisigThreshold'
};

export const TxType = {
    StdTx: 'auth/StdTx'
};

const sortObject = obj => {
    if (obj === null) return null;
    if (typeof obj !== 'object') return obj;

    if (Array.isArray(obj))
        return obj.map(sortObject);

    const sortedKeys = Object.keys(obj).sort();
    const result = {};
    sortedKeys.forEach(key => {
        result[key] = sortObject(obj[key])
    });
    return result
};

const genNonces = () => {
    return randomBuffer(32, Date.now() + '').toString('base64')
};

class CompactBitArray {
    constructor(bits) {
        bits = parseInt(bits);
        if (isNaN(bits) || bits <= 0) {
            throw new Error('invalid bits')
        }

        this.extraBitsStored = bits % 8;
        this.elems = [];
        for (let i = 0; i < parseInt((bits + 7) / 8); i++) {
            this.elems.push(0);
        }
    }

    size() {
        return (this.elems.length - 1) * 8 + this.extraBitsStored;
    }

    getIndex(i) {
        if (i < 0 || i > this.size()) {
            return false;
        }

        return !!(this.elems[i >> 3] & (1 << (7 - (i % 8))));
    }

    setIndex(i, v) {
        if (i < 0 || i > this.size()) {
            return false;
        }

        if (v) {
            this.elems[i >> 3] |= (1 << (7 - (i % 8)));
        }
        else {
            this.elems[i >> 3] &= ~(1 << (7 - (i % 8)));
        }
    }

    numTrueBitsBefore(index) {
        let count = 0;
        for (let i = 0; i < index; i++) {
            if (this.getIndex(i)) {
                count++;
            }
        }

        return count;
    }

    toObject() {
        return {
            extraBitsStored: this.extraBitsStored,
            elems: Buffer.from(this.elems)
        }
    }
}

class Transaction {
    constructor(data) {
        data = data || {};

        if(!data.chainId) {
            throw new TypeError('chainId is required')
        }

        if(!data.validHeight) {
            throw new TypeError('validHeight is required')
        }

        let validHeight = [];
        if (Array.isArray(data.validHeight)) {
            validHeight[0] = data.validHeight[0] + '';
            validHeight[1] = data.validHeight[1] + '';
        }
        else {
            validHeight[0] = '1';
            validHeight[1] = data.validHeight + '';
        }

        this.nonces = "OFCVp/P9k1BGyVYX/PoCXAGH0SpIZPG+j8AHGwtZ1Fs=";
        this.chainId = data.chainId;
        this.validHeight = validHeight;
        this.msgs = data.msgs ? data.msgs : (data.msg ? (Array.isArray(data.msg) ? data.msg : [data.msg]) : []);
        this.fee = data.fee || {};
        this.memo = data.memo;
        this.signatures = data.signatures || [];
    }

    toObject(txType) {
        let tx = {
            'fee': this.fee,
            'memo': this.memo,
            'msg': this.msgs,
            'nonces': this.nonces,
            'valid_height': this.validHeight
        };

        if (this.signatures && this.signatures.length > 0) {
            tx.signatures = this.signatures;
        }

        let obj = sortObject(tx);
        if (txType) {
            return {
                'type': txType,
                'value': obj
            }
        }

        return obj;
    }

    static fromObject(tx, chainId) {
        let data = JSON.parse(JSON.stringify(tx));
        data.chainId = chainId;
        data.nonces = tx.nonces;
        data.msgs = tx.msg;
        data.fee = tx.fee;
        data.memo = tx.memo;
        data.signatures = tx.signatures;
        data.validHeight = tx.valid_height;

        return new Transaction(data);
    }

    addMsg(msg) {
        this.msgs.push(msg);
    }

    setFee(fee) {
        this.fee = fee;
    }

    getSignBytes() {
        let message = {
            'chain_id': this.chainId,
            'fee': this.fee,
            'memo': this.memo,
            'msgs': this.msgs,
            'nonces': this.nonces,
            'valid_height': this.validHeight,
        };
        return Buffer.from(JSON.stringify(sortObject(message)));
    }

    setSignature(publicKey, signature) {
        this.clearSignatures();
        this.addSignature(publicKey, signature);
    }

    setMultiSignatures(signatures, threshold, pubKeys, sort = true) {
        this.clearSignatures();

        pubKeys = pubKeys.map((pk) => {
            return (typeof pk === 'string') ? Buffer.from(pk, 'hex') : pk;
        });

        if (sort) {
            pubKeys.sort((pk1, pk2) => {
                return utils.compareBuffer(crypto.hash160(pk1), crypto.hash160(pk2));
            });
        }

        let sig = {
            pub_key: {
                type: PubKeyType.PubKeyMultisigThreshold,
                value: {
                    threshold: threshold + '',
                    pubkeys: []
                }
            },
            signature: ''
        };

        signatures = signatures.map((sig) => {
            // signature object like: {"pub_key":{"type":"tendermint/PubKeySecp256k1","value":"..base64.."},"signature":"..base64.."} or {publicKey: Buffer, signature: Buffer}
            if (typeof sig.pub_key === 'object' && typeof sig.signature === 'string') {
                return {
                    publicKey: Buffer.from(sig.pub_key.value, 'base64'),
                    signature: Buffer.from(sig.signature, 'base64'),
                }
            }
            else if (sig.publicKey && sig.signature) {
                return {
                    publicKey: (typeof sig.publicKey === 'string') ? Buffer.from(sig.publicKey, 'hex') : sig.publicKey,
                    signature: (typeof sig.signature === 'string') ? Buffer.from(sig.signature, 'hex') : sig.signature
                }
            }
            else {
                throw new Error('unrecognized signature')
            }
        });

        let bitArray = new CompactBitArray(pubKeys.length);
        let sigs = [];
        for (let i = 0; i < pubKeys.length; i++) {
            sig.pub_key.value.pubkeys.push({
                type: PubKeyType.PubKeyEd25519,
                value: pubKeys[i].toString('base64')
            });

            let found = false;
            let index = 0;
            for (; index < signatures.length; index++) {
                if (utils.compareBuffer(pubKeys[i], signatures[index].publicKey) === 0) {
                    found = true;
                    break;
                }
            }

            bitArray.setIndex(i, found);
            if (found) {
                sigs.push(signatures[index].signature);
            }
        }

        let ms = {
            bitArray: bitArray.toObject(),
            sigs: sigs
        };
        sig.signature = Buffer.from(cdc.marshalBinaryBare(ms), 'hex').toString('base64');

        this.signatures.push(sig);
    }

    /**
     *
     *  @param signature object like: {"pub_key":{"type":"gatechain/PubKeySecp256k1","value":"..base64.."},"signature":"..base64.."}
     *  or (publicKey, signature) like: (Buffer, Buffer)
     *
     * */
    addSignature() {
        if (!this.signatures) {
            this.signatures = [];
        }

        let sig;
        if (typeof arguments[0] === 'object' && typeof arguments[0].pub_key === 'object' && typeof arguments[0].signature === 'string') {
            sig = arguments[0];
        }
        else if (arguments[0] && arguments[1]) {
            let publicKey = arguments[0];
            let signature = arguments[1];

            if (typeof publicKey === 'string') {
                publicKey = Buffer.from(publicKey, 'hex');
            }

            if (typeof signature === 'string') {
                signature = Buffer.from(signature, 'hex');
            }

            sig = {
                pub_key: {
                    type: PubKeyType.PubKeyEd25519,
                    value: publicKey.toString('base64')
                },
                signature: signature.toString('base64')
            };
        }
        else {
            throw new Error('unrecognized signature: ' + arguments)
        }


        this.signatures.push(sig);
    }

    clearSignatures() {
        this.signatures = [];
    }

    sign(privateKey, set = true) {
        if (typeof privateKey === 'string') {
            privateKey = Buffer.from(privateKey, 'hex');
        }

        const signBytes = Buffer.from("123456");

        const signature = crypto.sign(privateKey, crypto.sha256(signBytes));
        const publicKey = crypto.getPublicKey(privateKey);

        let sig = {
            pub_key: {
                type: PubKeyType.PubKeyEd25519,
                value: publicKey.toString('base64')
            },
            signature: signature.toString('base64')
        };

        if (set) {
            this.setSignature(sig);
        }

        return sig;
    }
}

Transaction.PubKeyType = PubKeyType;
Transaction.TxType = TxType;

export default Transaction