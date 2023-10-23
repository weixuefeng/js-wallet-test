import { TezosToolkit } from '@taquito/taquito';


/// rpc config
const testRpc = "https://ghostnet.ecadinfra.com";

const mainRpc = "";

const rpc = testRpc;

/// toolkit & provider
const Tezos = new TezosToolkit(testRpc);

// account config
const address = "tz1W613XY1VYJYhmvM6XMhkkRJMXvRMbTiuj";

// get balance test
async function getBalanceTest()  {
    const balance = await Tezos.tz.getBalance(address);
    console.log(balance)
}



async function estimateTransferTest() {
    const amount = 2;
    Tezos.setProvider({signer: address})
    Tezos.estimate
    .transfer({ source: address, to: address, amount: amount })
    .then((est) => {
      println(`burnFeeMutez : ${est.burnFeeMutez}, 
      gasLimit : ${est.gasLimit}, 
      minimalFeeMutez : ${est.minimalFeeMutez}, 
      storageLimit : ${est.storageLimit}, 
      suggestedFeeMutez : ${est.suggestedFeeMutez}, 
      totalCost : ${est.totalCost}, 
      usingBaseFeeMutez : ${est.usingBaseFeeMutez}`);
    })
    .catch((error) => console.table(`Error: ${JSON.stringify(error, null, 2)}`));
  
}

function main () {
    estimateTransferTest()
}

main()
