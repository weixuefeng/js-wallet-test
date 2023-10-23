const { AptosClient, AptosAccount, TokenClient,CoinClient } = require("aptos");

async function test()  {
    var client = new AptosClient("https://fullnode.testnet.aptoslabs.com");
    var account = new AptosAccount(Buffer.from("", "hex"), "");
    // console.log(account.pubKey());
    const payload = {
        type: "entry_function_payload",
        function: "0x1::aptos_account::transfer",
        type_arguments: [],
        arguments: [account.address().hex(), 10000],
      };
      const txnRequest = await client.generateTransaction(account.address(), payload);
    //   const signedTx = await client.signTransaction(account, txnRequest)
    //   const pendingTx = await client.submitTransaction(signedTx)
    //   console.log(`hash: ${pendingTx.hash}`)
    //   await this._sdk.client.waitForTransaction(pendingTx.hash);
  
      // or
      var res = await client.simulateTransaction(account, txnRequest)
      // console.log(res);
      var tokenClient = new TokenClient(client);
      
      var coinClient = new CoinClient(client);
      // var balance = await coinClient.checkBalance("0xd007da7792f479708be6ebbb16a421c1ba3504a465494e4d11e522437e90bb44", {coinType: "0x3::token::TokenStore"});
      // console.log("balance", balance);

      const aliceBalance1 = await tokenClient.getToken(
        "0xd007da7792f479708be6ebbb16a421c1ba3504a465494e4d11e522437e90bb44",
        "Game Coins",
        "Silver Coin",
        "0",
      );

      tokenClient.directTransferToken()

      console.log(`Alice's token balance: ${aliceBalance1["amount"]}`); 
}
try {
    test()
} catch(e) {
    console.log("error", e);
}