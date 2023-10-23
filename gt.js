import ed25519 from 'bip32-ed25519'
import createHash from 'create-hash'
import bech32 from 'bech32'
import * as crypto from './crypto.js'
import Transaction from './transaction.js';
export const NORMAL_SINGLE_SIG_ADDRESS_PREFIX = 'gt1';
export const NORMAL_MULTI_SIG_ADDRESS_PREFIX = 'gt2';
export const VAULT_SINGLE_SIG_ADDRESS_PREFIX = 'vault1';
export const VAULT_MULTI_SIG_ADDRESS_PREFIX = 'vault2';
const PUBLIC_KEY_PREFIX = 'gt1pub';



const genAddress = (publicKey, prefix) => {
    return genSingleSigAddress(publicKey, prefix);
};

function genSingleSigAddress(publicKey, prefix) {
    if (typeof publicKey === 'string') {
        publicKey = Buffer.from(publicKey, 'hex');
    }

    prefix = prefix || NORMAL_SINGLE_SIG_ADDRESS_PREFIX;
    let sha512res = crypto.sha512(publicKey);
    let ripemd320res = crypto.ripemd320(sha512res);

    let words = bech32.toWords(Buffer.from(ripemd320res, 'hex'));
    return bech32.encode(prefix, words);
};

const getPublicKey = privateKey => {
    if (typeof privateKey === 'string') {
        privateKey = Buffer.from(privateKey, 'hex');
    }
    return ed25519.toPublic(privateKey);
};

const genPubKeyBech32 = (publicKey) => {
    if (typeof publicKey === 'string') {
        publicKey = Buffer.from(publicKey, 'hex');
    }

    let buffer = Buffer.concat([Buffer.from('e1e1a0fa', 'hex'), Buffer.from([publicKey.length]), publicKey]);
    console.log(buffer.length);
    console.log("words:", bech32.toWords(buffer).length)
    return bech32.encode(PUBLIC_KEY_PREFIX, bech32.toWords(buffer), 900);
};


// var publickKey = getPublicKey("59c2274b40a8ada8124d4be613394986bfb83452de550bfd508fca5f6d49e7554d4e6c574ce63e1947dd02ab0cbf27a4d35b69e38cd184c38aa2d8aac3cbb26c5da8ad3314")
// console.log("pub", publickKey.length);
var pub = genPubKeyBech32("E63E1947DD02AB0CBF27A4D35B69E38CD184C38AA2D8AAC3CBB26C5DA8AD3314");
console.log("encode pub", pub);
var addr = genSingleSigAddress("E63E1947DD02AB0CBF27A4D35B69E38CD184C38AA2D8AAC3CBB26C5DA8AD3314")
console.log("addr", addr);
var res = crypto.sign("", "");
console.log(res.toString('hex'));
var data = { "chainId": "meteora", 
"msg":[{"type":"MsgSend","value":{"from_address":"gt11682wlempvh6q5hnxnuf70zaqqylv2ted0zt7njmnzz0lqyx07erxav957qtw6azxmhtzvq","to_address":"gt11tcez3g9yrzx8q669mc0raue4xe2u06qhld854f9lvwvwueldsrxv9jcsdl3623eacydn2t","amount":[{"denom":"NANOGT","amount":"2"}]}}],
"fee": { "amount": [{ "denom": "NANOGT", "amount": "5000" }], "gas": "200000" }, 
"nonces": [null], 
"signatures": [{
    pub_key: {
      type: 'gatechain/PubKeyEd25519',
      value: '5j4ZR90Cqwy/J6TTW2njjNGEw4qi2KrDy7JsXaitMxSSeyVaMnZxeOEediyfO2OXv7VJWfBlY4sDZRNwdmeGFQ=='
    },
    signature: 'aLNKZsiggDBvtRsPgP5B8kg7oQa75Ht4xdPX1ZLP0ZVNOmw0y11QIekQ9pDUDy3t9bIY7YQpzJc1Y3wih2nvDQ=='
  }],
 "memo": "", 
 "validHeight": ["2801147","2801347"] };

var data2 = {"chainId": "meteora", "msg":[{"type":"MsgSend","value":{"from_address":"gt11m8a0a98lz4f8n6uj7jy42yrdls8f7mlmuwyqr6g9ncf3nat86ytxl30sfpefsjvrk2zkgy","to_address":"gt11tcez3g9yrzx8q669mc0raue4xe2u06qhld854f9lvwvwueldsrxv9jcsdl3623eacydn2t","amount":[{"denom":"NANOGT","amount":"2"}]}}],"fee":{"amount":[{"denom":"NANOGT","amount":"5000"}],"gas":"200000"},"nonces":[null],"signatures":null,"memo":"",
"validHeight":["2801158","2801358"]}

var tx = new Transaction(data2);

function sign(privateKey, set = true) {
    if (typeof privateKey === 'string') {
        privateKey = Buffer.from(privateKey, 'hex');
    }
    const signBytes = Buffer.from("你好");
    const data = crypto.sha256(signBytes);
    console.log("data", data.toString('hex'))
    const signature = crypto.sign(privateKey, data);
    return signature;
}

var signed = sign("")

console.log("signed", signed.toString('hex'))


