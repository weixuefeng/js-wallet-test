
import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";

import { getQueryClient } from '@sei-js/core';
import { getSigningClient } from '@sei-js/core';
import { calculateFee } from '@cosmjs/stargate';
import  * as ethers  from 'ethers'
import { StargateClient } from "@cosmjs/stargate"
const DESTINATION_ADDRESS = "sei1jrcje2wuvf707jyy2l63maqlac5qfcp8vegwfr";

  const REST_RPC_URL = "https://rest.atlantic-2.seinetwork.io/"
  const RPC_URL = "https://rpc.atlantic-2.seinetwork.io/"
 

// const RPC_URL = "https://rpc.sentry-01.theta-testnet.polypore.xyz"
const SEND_AMOUNT = "1000";
const TOKEN_DENOM = "usei";

function buf2hex(buffer) { // buffer is an ArrayBuffer
  return [...new Uint8Array(buffer)]
      .map(x => x.toString(16).padStart(2, '0'))
      .join('');
}

async function test()  {

    const client = await StargateClient.connect(RPC_URL)
    // file:///Users/weixuefeng/temp/node_modules/@cosmjs/stargate/build/stargateclient.js
    // create wallet
    const wallet = await DirectSecp256k1HdWallet.fromMnemonic("", {
        prefix: "sei"
    });
    
    const [firstAccount] = await wallet.getAccounts();
    console.log("account", firstAccount.address);
    
    // query balance
    const queryClient = await getQueryClient(REST_RPC_URL);
    var balance = await queryClient.cosmos.bank.v1beta1.allBalances({
        address: firstAccount.address
    });
    console.log(balance);

    var SENDER_ADDRESS = firstAccount.address;
    var signer = wallet;
    const signingClient = await getSigningClient(RPC_URL, signer);

    const SEND_AMOUNT = "1000";
    const amount = { amount: SEND_AMOUNT, denom: "usei" };

    const sendMsg = {
        typeUrl: "/cosmos.bank.v1beta1.MsgSend",
        value: {
          fromAddress: SENDER_ADDRESS,
          toAddress: DESTINATION_ADDRESS,
          amount: [amount],
        },
      };
      

    var res = await signingClient.sign(SENDER_ADDRESS,[],{ amount: [ { amount: '8411', denom: 'usei' } ], gas: '84103' });
    console.log("res", res);

    // const sendResponse = await signingClient.sendTokens(SENDER_ADDRESS, DESTINATION_ADDRESS, [amount], { amount: [ { amount: '8411', denom: 'usei' } ], gas: '84103' });
    // console.log(sendResponse.transactionHash);
}

function encodeTest() {
  const _data = ethers.utils.defaultAbiCoder.encode(['uint256', 'bytes'], [ethers.utils.parseEther('0.0003'), '0x'])
}
test();
