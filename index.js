
import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";

import { getQueryClient } from '@sei-js/core';
import { getSigningClient } from '@sei-js/core';
import { calculateFee } from '@cosmjs/stargate';
import { StargateClient } from "@cosmjs/stargate"
import { SeiWalletProvider } from '@sei-js/react';
const DESTINATION_ADDRESS = "sei1jrcje2wuvf707jyy2l63maqlac5qfcp8vegwfr";
//const REST_RPC_URL = "http://52.199.0.230:1317"
//const RPC_URL = "http://52.199.0.230:26657"

// const REST_RPC_URL = "http://127.0.0.1:1317"
// const RPC_URL = "http://127.0.0.1:26657"

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
    console.log("With client, chain id:", await client.getChainId(), ", height:", await client.getHeight())
    // create wallet
    const wallet = await DirectSecp256k1HdWallet.fromMnemonic("", {
        prefix: "gt1"
    });

    const [firstAccount] = await wallet.getAccounts();
    console.log("account", buf2hex(firstAccount.pubkey));
    
    // query balance
    const queryClient = await getQueryClient(REST_RPC_URL);
    var balance = await queryClient.cosmos.bank.v1beta1.allBalances({
        address: firstAccount.address
    });
    console.log(balance);

    var SENDER_ADDRESS = firstAccount.address;

    var accountInfo = await queryClient.cosmos.auth.v1beta1.account({"address": SENDER_ADDRESS})
    console.log("accountInfo:", accountInfo);
    
    // send transaction
    var signer = wallet;
    
    const signingClient = await getSigningClient(RPC_URL, signer);
    try {
        // calculate fee
        const fee = calculateFee(120000, "0.1usei");
        const amount = { amount: SEND_AMOUNT, denom: "usei" };

        const sendMsg = {
            typeUrl: "/cosmos.bank.v1beta1.MsgSend",
            value: {
              fromAddress: firstAccount.address,
              toAddress: DESTINATION_ADDRESS,
              amount: [amount],
            },
          };
          
          
        const gasEstimation = await signingClient.simulate(firstAccount.address, [sendMsg], "");
        console.log("gasEstimation", gasEstimation * 13 / 10);
        var res = parseInt((gasEstimation * 12 / 10).toString())
        console.log("res", res);

        var calculate = calculateFee(res, "0.1usei")
        console.log("calculate", calculate);

//        const sendResponse = await signingClient.sendTokens(SENDER_ADDRESS, DESTINATION_ADDRESS, [amount], calculate);
        // console.log(sendResponse);
    } catch(e) {
        console.log("error", e);
    }


}
test();
