const TronWeb = require('tronweb')
// const HttpProvider = TronWeb.providers.HttpProvider;
// const fullNode = new HttpProvider("https://trx.getblock.io/ade6e741-1549-43dd-a6ce-6b2f97ad199f/mainnet");

async function test()  {

    const tronWeb = new TronWeb({
        fullNode: 'https://trx.getblock.io/ade6e741-1549-43dd-a6ce-6b2f97ad199f/mainnet',
        solidityNode: 'https://some-other-node.tld',
        eventServer: 'https://some-event-server.tld',
        privateKey: ''
    }
    );
    console.log(TronWeb.TransactionBuilder);
    // var wallet = TronWeb.fromMnemonic(mnemonic);
    // console.log(wallet);
    var to = "41a1985b7694791ad4354ecb48678adccdcaf54fb6";
    var amount = 1000;
    var from = "4171031c2a932588b6629d4f041e052c9a1ecde3e6";
    var res = await tronWeb.transactionBuilder.sendTrx(to, amount, from)
    console.log("transaction", res);
    var signed = await tronWeb.trx.sign(res, "");
    console.log("signed", signed);
    // hexTransaction = signed['signature'][0];
    var send = await tronWeb.trx.sendRawTransaction(signed);
    console.log("send", send);
    // var sendHex = await tronWeb.trx.sendHexTransaction(signed);
    // console.log("sendHex", sendHex);

}

test();