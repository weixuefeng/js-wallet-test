// import pkg from '@cosmjs/stargate';
// const { IndexedTx, StargateClient, QueryClient, createProtobufRpcClient } = pkg;
// import { MsgSend } from "cosmjs-types/cosmos/bank/v1beta1/tx.js"
// import { Tx } from "cosmjs-types/cosmos/tx/v1beta1/tx.js"
import { getQueryClient, QueryDenomMetadataRequest } from '@sei-js/core';

// const rpc = "https://atom.getblock.io/ade6e741-1549-43dd-a6ce-6b2f97ad199f/mainnet/tendermint/"
const rpc = "http://127.0.0.1:1317";
const runAll = async () => {
    // const client = await StargateClient.connect(rpc)
    // console.log("With client, chain id:", await client.getChainId(), ", height:", await client.getHeight())
    // console.log(
    //     "Alice balances:",
    //     await client.getAllBalances("cosmos1kw0mtl3w39efpv4ycjk02mn656r8xxxuuvkev9")
    // )
    // const faucetTx = await client.getTx(
    //     "D0A1CA3F846B0B8284DF64FAD2C1287885365332AE8D293B9014735289D0E88B"
    // )
    
    // console.log("Faucet Tx:", faucetTx)
    // const decodedTx = Tx.decode(faucetTx.tx)
    // console.log("DecodedTx:", decodedTx)
    // console.log("Decoded messages:", decodedTx.body.messages)
    // const sendMessage = MsgSend.decode(decodedTx.body.messages[0].value)
    // console.log("Sent message:", sendMessage)
    // const faucet = sendMessage.fromAddress
    // console.log("Faucet balances:", await client.getAllBalances(faucet))

    // // Get the faucet address another way
    // {
    //     const rawLog = JSON.parse(faucetTx.rawLog)
    //     console.log("Raw log:", JSON.stringify(rawLog, null, 4))
    //     const faucet = rawLog[0].events
    //         .find((eventEl) => eventEl.type === "coin_spent")
    //         .attributes.find((attribute) => attribute.key === "spender").value
    //     console.log("Faucet address from raw log:", faucet)
    // }
  
   var queryClient = await getQueryClient("https://sei-rpc.polkachu.com/");
   var res = await queryClient.cosmos.bank.v1beta1.denomMetadata({denom: "factory/sei1jrcje2wuvf707jyy2l63maqlac5qfcp8vegwfr/gate"});
}

runAll()