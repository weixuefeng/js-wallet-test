import { AptosClient, AptosAccount, TokenClient,CoinClient } from 'aptos'
var account = new AptosAccount(Buffer.from("637e3fb21f6432ede96d62e348661452671d0720bb09c66cab9561dcdfaaf867", "hex"), "");
var receiver = new AptosAccount(Buffer.from("7a694f405ee11861d992748d8f68207242cd9432a27b20ba32e2ba5ead37d170", "hex"), "0xfa7e6351d39cb31496b52c5373d61e4d7dbaf9dbbf94cb83b52f549eb4ed167e")
var client = new AptosClient("https://go.getblock.io/bbe2fc2e8da64f8db13fa32703a18225");
var tokenClient = new TokenClient(client);
const collectionName = "PonyCollectionName";

async function test()  {
    
    // console.log(account.pubKey());
    // const payload = {
    //     type: "entry_function_payload",
    //     function: "0x1::aptos_account::transfer",
    //     type_arguments: [],
    //     arguments: [account.address().hex(), 10000],
    //   };
      // const txnRequest = await client.generateTransaction(account.address(), payload);
    //   const signedTx = await client.signTransaction(account, txnRequest)
    //   const pendingTx = await client.submitTransaction(signedTx)
    //   console.log(`hash: ${pendingTx.hash}`)
    //   await this._sdk.client.waitForTransaction(pendingTx.hash);
  
      // or
      // var res = await client.simulateTransaction(account, txnRequest)
      // console.log(res);
      
      // var coinClient = new CoinClient(client);
      // var balance = await coinClient.checkBalance("0xd007da7792f479708be6ebbb16a421c1ba3504a465494e4d11e522437e90bb44", {coinType: "0x3::token::TokenStore"});
      // console.log("balance", balance);

      // const aliceBalance1 = await tokenClient.getToken(
      //   "0xd007da7792f479708be6ebbb16a421c1ba3504a465494e4d11e522437e90bb44",
      //   "Game Coins",
      //   "Silver Coin",
      //   "0",
      // );

     

      // console.log(`Alice's token balance: ${aliceBalance1["amount"]}`); 
}

// first create collection
async function createCollectionTest() {
  const collectionName = "PonyCollectionName";
  const collectionDesc = "PonyCollectionDesc";
  const txnHash1 = await tokenClient.createCollection(
    account,
    collectionName,
    collectionDesc,
    "https://weixuefeng.github.io",
  );
  console.log(txnHash1);
}

// second, cliam nft
async function createToken() {
  const collectionName = "PonyCollectionName";
  const tokenName = "PonyFistTokenName";
  const tokenDesc = "PonyFirstTokenDescription"
  const txnHash2 = await tokenClient.createToken(
    account,
    collectionName,
    tokenName,
    tokenDesc,
    1,
    "https://aptos.dev/img/nyan.jpeg",
  );
  console.log(txnHash2);
}

// get nft balance test
async function getTokenBalanceTest() {
  const collectionName = "PonyCollectionName";
  const tokenName = "PonyFistTokenName";
  const aliceBalance1 = await tokenClient.getTokenForAccount(
    receiver.address(),
    {
      creator: "0xd007da7792f479708be6ebbb16a421c1ba3504a465494e4d11e522437e90bb44",
      collection: collectionName,
      name: tokenName
    }
    // `${tokenPropertyVersion}`,
  );
  console.log(aliceBalance1);
}

// transfer nft
async function transferNFTTest() {
  const tokenName = "PonyFistTokenName";
  let txnHash5 = await tokenClient.directTransferToken(
    account,
    receiver,
    account.address(),
    collectionName,
    tokenName,
    1,
    // tokenPropertyVersion,
  );
  console.log(txnHash5);
}

// offer nft

try {
  getTokenBalanceTest()
} catch(e) {
    console.log("error", e);
}