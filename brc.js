import * as gateLib from '@okxweb3/coin-bitcoin'
import { base } from '@okxweb3/crypto-lib';
import * as bitcoin from 'bitcoinjs-lib'
var network = gateLib.networks.bitcoin;

var privateKeyHex = "bd0003fcc25ac8c2dfaaa8413405156498114a9d1627486af8f5b27de35309f9";
var wifPriv = "L3Z6tQ2N2FLfRDZJmRgfAAZ3Tz1W5HmYEoD7jmttNASNzhRZbe9u";
var destination = "3Gksp1S41nfFER2gEKCBnDakfCv96D5aRf";
var dust = 546;

var mainTest = {
    /**
bip44: 13xrt1jE5mvCDaQJLBA9SAwaEvGZg4Ux58
bip49: 3Gksp1S41nfFER2gEKCBnDakfCv96D5aRf
bip84: bc1qyzqvgn8qcxkkneymz83kfdzcfr8nm2xvn3jr08
bip86: bc1prn9txsu3dvz409svqpgt4cu3mwfgz2y2qll8ra67yya4ynarkzfsggw5h8
     */
}

var regTest = {
    /**
bip44: miUpB4pCtoMSzgsv3k8XG69u6usGXhuPYi
bip49: 2N8K5skN5dFAbSCfDuSp4QAa1sZ8Jw2P77V
bip84: bcrt1qyzqvgn8qcxkkneymz83kfdzcfr8nm2xvm7sara
bip86: bcrt1prn9txsu3dvz409svqpgt4cu3mwfgz2y2qll8ra67yya4ynarkzfsjejacj
     */
}
var contentType = "text/plain;charset=utf-8";
var body = JSON.stringify({"p":"brc-20","op":"deploy","tick":"bc1p","amt":"1000"});

async function commitTest() {
    var destination = "D8r87EpywRHAyqA43Vo8fW7BmLfTj7e484";
    var wifPriv = "QVp1vYc5bfW7gMew2Fd7zpHt2Cun8KzSPtjYJTfsDHwoce8fS1XF";
    var request = {
        commitTxPrevOutputList: [
            {
                "txId": "be08db048dac093ccaf512e8b1cb12e364c5d66ac36ce7a35e2f24eaba9bb4fb",
                "vOut": 1,
                "amount": 485404862,
                "address": destination,
                "privateKey": wifPriv
            }
        ],
        commitFeeRate: 200,
        revealFeeRate: 200,
        inscriptionDataList: [
            {
                contentType: contentType,
                body: body,
                revealAddr: destination
            }
        ],
        revealOutValue: 1000000,
        changeAddress: destination,
    }
    console.log(request)
    var res = gateLib.inscribe(gateLib.dogeCoin, request);
    console.log(res);
}
import { BtcWallet } from "@okxweb3/coin-bitcoin";

async function createDummy() {
    let wallet = new BtcWallet()
    let btcTxParams = {
      inputs: [
        {
          txId: "728f2b82f9326e7689262403d56cdc9ec8e6bd407f110a0341ee9128054b40d1",
          vOut: 0,
          amount: 100000000
        },
      ],
      outputs: [
        {
          address: "bc1prn9txsu3dvz409svqpgt4cu3mwfgz2y2qll8ra67yya4ynarkzfsggw5h8",
          amount: 600
        },
        {
          address: "bc1prn9txsu3dvz409svqpgt4cu3mwfgz2y2qll8ra67yya4ynarkzfsggw5h8",
          amount: 600
        },
        {
            address: "bc1prn9txsu3dvz409svqpgt4cu3mwfgz2y2qll8ra67yya4ynarkzfsggw5h8",
            amount: 1200
          },
      ],
      address: "bc1qyzqvgn8qcxkkneymz83kfdzcfr8nm2xvn3jr08",
      feePerB: 2
    };
    
    let signParams = {
      privateKey: wifPriv,
      data: btcTxParams
    };
    let res = await wallet.signTransaction(signParams);
    console.log("res:", res);
}


createDummy();