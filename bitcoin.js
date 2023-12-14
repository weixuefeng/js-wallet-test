import {ECPairFactory} from 'ecpair';
import * as ecc from 'tiny-secp256k1';
import * as bitcoin from 'bitcoinjs-lib'

bitcoin.initEccLib(ecc);
const ECPair = ECPairFactory(ecc);
const toXOnly = pubKey => (pubKey.length === 32 ? pubKey : pubKey.slice(1, 33));

const DUMMY_UTXO_AMOUNT = 600;

async function create2Dummy() {
  var privateKeyHex = "d2dc8880c72520d61554cf3d90dcd54c98c0e04329c11c3c5b48e9a976ff4e29";
  const keyPair = ECPair.fromPrivateKey(Buffer.from(privateKeyHex, 'hex'))

  const hash = "317e15646d248b6b65c3c0b8d8cd57290fc8f4f3a109ea94041b9180ffc186ef";
  const index = 1;
  const psbt = new bitcoin.Psbt({ network: bitcoin.networks.regtest });
  var destination = "n1EmAHAzvCgQYaKkGLm1e5taFauCiuNzHK"
  psbt.addInput({
    hash: hash,
    index: index,
    sequence: 0xFFFFFFFF,
    nonWitnessUtxo: Buffer.from("02000000000101be95e4042141c85a78ff6a21e6a4cdd3c265bb96b8b914575dcb51f3f5a6132a0100000000fdffffff029051c82000000000160014b3915c2989105bc33ea59fbbee0535a5146db43100e1f505000000001976a914d85290e927b8e20b1e48dbfeac9d8ea4c9a9955088ac0247304402203b2f9c96116589f202414348f4e4b21635ee68316e9bce7ce9187ea4b231510e02205ca910339a55cc29b2a9a7d8c374a51cb92cb05ba6e6071529a4934b9034c812012103b1124c21936e3bc27064b1116d470bbdda01fee06ee734b804e1df2fee95ff1ace010000", "hex")
  });
  // two dummy
  psbt.addOutput({
    script: bitcoin.address.toOutputScript(
      destination,
      bitcoin.networks.regtest
    ),
    value: DUMMY_UTXO_AMOUNT,
  });
  psbt.addOutput({
    script: bitcoin.address.toOutputScript(
      destination,
      bitcoin.networks.regtest
    ),
    value: DUMMY_UTXO_AMOUNT,
  });
  // change output
  psbt.addOutput({
    script: bitcoin.address.toOutputScript(
      destination,
      bitcoin.networks.regtest
    ),
    value: 99998500,
  });

  psbt.signInput(0, keyPair);
  psbt.finalizeAllInputs();
  console.log(psbt.extractTransaction().toHex())
  // http://localhost:4200/tx/d47b5484ee5ba72e1be0f90fdffdc9c9abd5406de1d1189c43f31428bcce2066
  // hash: d47b5484ee5ba72e1be0f90fdffdc9c9abd5406de1d1189c43f31428bcce2066
  // 
}

// utxo info
var nftHash = "484e1b8c1c6776f935de2ed31c44b5c475998827879cbabe4394be8740b8c25b";
var nftIndex = 0;
var nftPrice = 5000000;
var nftNonwitnessUtxo = "0200000000010137f3c97d1d1f88a1b86c790ae5d9839a5a28b0cc8274f23e07ac3865b889aef00000000000fdffffff0122020000000000001976a9142080c44ce0c1ad69e49b11e364b45848cf3da8cc88ac0340c2d210b32c74a88059fdf72171bd450e36cb93809655ad893e4d61feeb4a15e24413af9c2ee847c7b914d77a700024d6bea6758ecedd34d393fe2a5c1598a7bf590063036f7264010118746578742f706c61696e3b636861727365743d7574662d3800357b2270223a226272632d3230222c226f70223a226d696e74222c227469636b223a22706f6e31222c22616d74223a2231303030227d6821c0406cd7e5d61e4c27c7eddcb22af0019bd46c9250bd571bd750075678a84b337800000000"

// buyer hash
var dummyHash = "42beee00514b86770b9c31288d7d644fbf7e8b0db755ca83150ae76553ac546c";
var dummyTx = "0200000004d8e88ce08403f506df3e9c830f3876601242699359c357ce9caf48ce211ee61c030000006a47304402207af3a3ec940cd97ab77d972e9cdaf5e21be3e5d3db53da8fc64fb024ddd08dc602205b4032ff69ba33d6b75069827a4ebc5708f51bc3e8ecf8869f9103457845d2ba012103b48aee4a6dec95c0e98e5dc31737bdd46b220b79f804a96d93eb06c1b71270effdffffffd8e88ce08403f506df3e9c830f3876601242699359c357ce9caf48ce211ee61c040000006a473044022078123f26bff396782f2ad2fa3d7c370fef136f496e8f3a0dbde168d6d02248d5022061b3cf9009eae2eef479ff77536cc257aad216dd52bc8815899a29b2741b5eed012103b48aee4a6dec95c0e98e5dc31737bdd46b220b79f804a96d93eb06c1b71270effdffffffc29ad10355ab4b816dfdb62039497d9cd76b1a548991fa31d37d868109d3f334000000006a47304402205fe2c06774f47716be161b3035ab4eec0c550798d8a303b3dc5547a0263e47d4022033321ee766594c76055cb23638660c312a219012a6e8d77542771c08ac30b211832102406cd7e5d61e4c27c7eddcb22af0019bd46c9250bd571bd750075678a84b3378fdffffffd8e88ce08403f506df3e9c830f3876601242699359c357ce9caf48ce211ee61c050000006b483045022100d59286514eb9f7e45c81e127e172fd049bc9cc5202e72604b418aef34ab5b9d1022036f9f68506c8c281a3101f3e8ec9ea795a0580a7015ff3998d11cb9a6c98f326012103b48aee4a6dec95c0e98e5dc31737bdd46b220b79f804a96d93eb06c1b71270effdffffff06b0040000000000001976a914d85290e927b8e20b1e48dbfeac9d8ea4c9a9955088ac22020000000000001976a914d85290e927b8e20b1e48dbfeac9d8ea4c9a9955088ac404b4c00000000001976a9142080c44ce0c1ad69e49b11e364b45848cf3da8cc88ac58020000000000001976a914d85290e927b8e20b1e48dbfeac9d8ea4c9a9955088ac58020000000000001976a914d85290e927b8e20b1e48dbfeac9d8ea4c9a9955088ac00c63e05000000001976a914d85290e927b8e20b1e48dbfeac9d8ea4c9a9955088ac00000000";
 // buyer utxo, spend
 // buyer address
 var buyerAddress = "n1EmAHAzvCgQYaKkGLm1e5taFauCiuNzHK"
 var sellerAddress = "miUpB4pCtoMSzgsv3k8XG69u6usGXhuPYi"

async function sellerListingOrder() {
  // seller info
  var privateKeyHex = "bd0003fcc25ac8c2dfaaa8413405156498114a9d1627486af8f5b27de35309f9";
  var destination = "miUpB4pCtoMSzgsv3k8XG69u6usGXhuPYi";
  const seller = ECPair.fromPrivateKey(Buffer.from(privateKeyHex, 'hex'))
    const psbt = new bitcoin.Psbt({ network: bitcoin.networks.regtest });
    psbt.addInput({
      hash: nftHash,
      index: 1,
    });
    psbt.addInput({
      hash: nftHash,
      index: 2,
    });
    // seller action ---------->
    // brc20 inscription.
    psbt.addInput({
        hash: nftHash,
        index: nftIndex,
        nonWitnessUtxo: Buffer.from(nftNonwitnessUtxo, "hex"),
        sighashType: bitcoin.Transaction.SIGHASH_SINGLE | bitcoin.Transaction.SIGHASH_ANYONECANPAY,
      });
    // seller receive btc
    psbt.addOutput({
      script: bitcoin.address.toOutputScript(
        destination,
        bitcoin.networks.regtest
      ),
      value: nftPrice,
    });
    psbt.addOutput({
      script: bitcoin.address.toOutputScript(
        destination,
        bitcoin.networks.regtest
      ),
      value: 1,
    });
    psbt.addOutput({
      script: bitcoin.address.toOutputScript(
        destination,
        bitcoin.networks.regtest
      ),
      value: nftPrice,
    });
    psbt.signInput(2, seller, [bitcoin.Transaction.SIGHASH_SINGLE | bitcoin.Transaction.SIGHASH_ANYONECANPAY]);
    var firstInfo = psbt.toBase64();
    return firstInfo;
    // console.log("-----end psbt---\r\n", firstInfo);
    //  cHNidP8BAFUCAAAAAQL1VzCj3WZmtdADWjrL2d5MZJEIYVmqGrB5PfzpkVsoAAAAAAD/////AUBLTAAAAAAAGXapFCCAxEzgwa1p5JsR42S0WEjPPajMiKwAAAAAAAEA/RcBAgAAAAABAbwuiCSh7ak1IZRc8Aiij7nbPrMR9Xg4/xSWeSazdzpIAAAAAAD/////ASICAAAAAAAAGXapFCCAxEzgwa1p5JsR42S0WEjPPajMiKwDQBXBZoTy8MM+Wa9HAFlmrq0hMwcPoIJQ76FRUlyBt4T0DHzMJJMAds1dNkCPO/RdrmevXrId34Vs8BxmhHNtMq1bAGMDb3JkAQEYdGV4dC9wbGFpbjtjaGFyc2V0PXV0Zi04ADd7InAiOiJicmMtMjAiLCJvcCI6InRyYW5zZmVyIiwidGljayI6InBvbjEiLCJhbXQiOiIxMCJ9aCHBQGzX5dYeTCfH7dyyKvABm9RsklC9VxvXUAdWeKhLM3gAAAAAAQdrSDBFAiEAukCezkYcZRkgDbSuyLwCpxZEbbKNR9TgOmYgARfVaDMCIBeq9ijYd2IKni5Ai3Kq2lBGkEcL3fqwlhc2Kz6hv1m+ASECQGzX5dYeTCfH7dyyKvABm9RsklC9VxvXUAdWeKhLM3gAAA==
}

async function buyerOffer() {
  var privateKeyHex = "d2dc8880c72520d61554cf3d90dcd54c98c0e04329c11c3c5b48e9a976ff4e29";
  const buyer = ECPair.fromPrivateKey(Buffer.from(privateKeyHex, 'hex'))
  
  const psbt = new bitcoin.Psbt({ network: bitcoin.networks.regtest });
   // first dummy
   psbt.addInput({
     hash: dummyHash,
     index: 3,
     nonWitnessUtxo: Buffer.from(dummyTx, "hex")
   });
   psbt.addInput({
    hash: dummyHash,
    index: 4,
    nonWitnessUtxo: Buffer.from(dummyTx, "hex")
  });
   // buyer receive inscription
   psbt.addOutput({
     script: bitcoin.address.toOutputScript(
       buyerAddress,
       bitcoin.networks.regtest
     ),
     value: DUMMY_UTXO_AMOUNT + DUMMY_UTXO_AMOUNT + 0,
   })
   // receive nft
   psbt.addOutput({
    script: bitcoin.address.toOutputScript(
      buyerAddress,
      bitcoin.networks.regtest
    ),
    value: 546,
  })
  // append seller input & output
  psbt.addInput({
    hash: nftHash,
    index: nftIndex,
    nonWitnessUtxo: Buffer.from(nftNonwitnessUtxo, "hex"),
    sighashType: bitcoin.Transaction.SIGHASH_SINGLE | bitcoin.Transaction.SIGHASH_ANYONECANPAY,
  });
  // seller receive btc
  psbt.addOutput({
    script: bitcoin.address.toOutputScript(
      sellerAddress,
      bitcoin.networks.regtest
    ),
    value: nftPrice,
  });
  // -------------------------
  // add buyer payment utxo
  psbt.addInput({
    hash: dummyHash,
    index: 5,
    nonWitnessUtxo: Buffer.from(dummyTx, "hex")
  });
  // todo:// skip platform fee
  
  // new duumy utxo
  psbt.addOutput({
    script: bitcoin.address.toOutputScript(
      buyerAddress,
      bitcoin.networks.regtest
    ),
    value: DUMMY_UTXO_AMOUNT,
  })
  psbt.addOutput({
    script: bitcoin.address.toOutputScript(
      buyerAddress,
      bitcoin.networks.regtest
    ),
    value: DUMMY_UTXO_AMOUNT,
  })
  // change amount
  psbt.addOutput({
    script: bitcoin.address.toOutputScript(
      buyerAddress,
      bitcoin.networks.regtest
    ),
    value: 82990000,
  })
  
  const toSignInputs = [];
  psbt.data.inputs.forEach((v,index) => {
    let script = null;
    let value = 0;
    if(v.nonWitnessUtxo) {
      const tx = bitcoin.Transaction.fromBuffer(v.nonWitnessUtxo);
      const output = tx.outs[psbt.txInputs[index].index];
      script = output.script;
      value = output.value;
    }
    const isSigned = v.finalScriptSig || v.finalScriptWitness;
      if (script && !isSigned) {
        const address = bitcoin.address.fromOutputScript(script, bitcoin.networks.regtest);
        if (bitcoin.payments.p2pkh({ pubkey: buyer.publicKey, network: bitcoin.networks.regtest }).address === address) {
          toSignInputs.push({
            index,
            publicKey: buyer.publicKey,
          });
        }
      }
  })
  toSignInputs.forEach((input)=> {
    console.log(`sign index:${input.index}`);
    psbt.signInput(input.index, buyer,[bitcoin.Transaction.SIGHASH_ALL, bitcoin.Transaction.SIGHASH_SINGLE | bitcoin.Transaction.SIGHASH_ANYONECANPAY,bitcoin.Transaction.SIGHASH_DEFAULT]);
  })
  return psbt.toBase64()
  // buyer psbt: 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
}

async function mergeSignBuyinngPSBT() {
  var sellPsbt = await sellerListingOrder();
  var buyerPsbt = await buyerOffer();
  const sellerSignedPsbt = bitcoin.Psbt.fromBase64(sellPsbt);
  const buyerSignedPsbt = bitcoin.Psbt.fromBase64(buyerPsbt);
  console.log("sellerSignedPsbt", JSON.stringify(sellerSignedPsbt));
  console.log("buyerSignedPsbt", JSON.stringify(buyerSignedPsbt));
  (buyerSignedPsbt.data.globalMap.unsignedTx).tx.ins[2] = (sellerSignedPsbt.data.globalMap.unsignedTx).tx.ins[2];
  (buyerSignedPsbt.data.globalMap.unsignedTx).tx.outs[2] = (sellerSignedPsbt.data.globalMap.unsignedTx).tx.outs[2];
  buyerSignedPsbt.data.outputs[2] = sellerSignedPsbt.data.outputs[2];
  buyerSignedPsbt.data.inputs[2] = sellerSignedPsbt.data.inputs[2];
  buyerSignedPsbt.finalizeAllInputs()
  var res = buyerSignedPsbt.extractTransaction().toHex()
  console.log(res);
  // return buyerSignedPsbt.toBase64();
}    


async function mergeTest() {
  var sellerPriv = "bd0003fcc25ac8c2dfaaa8413405156498114a9d1627486af8f5b27de35309f9"
  var buyerPriv = "d2dc8880c72520d61554cf3d90dcd54c98c0e04329c11c3c5b48e9a976ff4e29"
  var seller = ECPair.fromPrivateKey(Buffer.from(sellerPriv, 'hex'))
  var sAddr = "miUpB4pCtoMSzgsv3k8XG69u6usGXhuPYi";
  var buyer = ECPair.fromPrivateKey(Buffer.from(buyerPriv, 'hex'))
  var bAddr = "n1EmAHAzvCgQYaKkGLm1e5taFauCiuNzHK";
  var to = "mgmKCSG1Qb8RQdwPY8ThhLeLCsaaqMJLZi";

  const psbt = new bitcoin.Psbt({ network: bitcoin.networks.regtest });
  // buyer input
  psbt.addInput({
    hash: "59bda28f45c2b213fa8cf8a9208da14ddf3f7b319e7ad21577e3193fcec73684",
    index: 0,
    sequence: 0xfffffffd,
    sighashType: bitcoin.Transaction.SIGHASH_SINGLE | bitcoin.Transaction.SIGHASH_ANYONECANPAY,
    nonWitnessUtxo : Buffer.from("0200000000010161b6c00208c8a05bfccf08a89b9d5d9570022e7e6b99c31a87d784db87db05a90000000000fdffffff0200e1f505000000001976a914d85290e927b8e20b1e48dbfeac9d8ea4c9a9955088ace0ace60e000000001600142bcb0abf291799babcfcd17d2efe01e3122d9bcd0247304402200620a497b89e873807e849d86982a85ca8357db891a02c87e5caaa3bb2679582022038f901c707f50c5d6f52c64cf19d6e888c6aa8c7d54b51ba60693cbddc61bc70012102a2823a238d15620d4d984965ad3275c2312122b3a2968a42ce28f7be52a4aaf5ac010000", "hex")
  })
  // seller input
  psbt.addInput({
    hash: "3b64c500a703bf2da2f165e6925ab1f3fe7e410fd11cc659a6a1ec48081f9d8f",
    index: 1,
    sequence: 0xfffffffd,
    sighashType: bitcoin.Transaction.SIGHASH_ALL,
    nonWitnessUtxo : Buffer.from("0200000000010134bea89ebb59ef328f6ae6a39307d6e40e6400f7a2ce64c6d542a89a74f38ef20100000000fdffffff0260b9953e000000001600147f573207473b5c53daa99322eadae816c01d99f900e1f505000000001976a9142080c44ce0c1ad69e49b11e364b45848cf3da8cc88ac0247304402205e54b65027d51bfd914aea297c0e8dfd30695451334502d065f8bff9600a5d3402200e5e17630ed057f9de084c68a42a55e9e0e48b4665ea82960e7449eecb6fe282012102f7d02a3d8d1261647b7e88ed61ae787d8c3fbc6a6c4217850f87737f0fb8ec97d7010000", "hex")
  })

  psbt.addOutput({
    script: bitcoin.address.toOutputScript(
      to,
      bitcoin.networks.regtest
    ),
    value: 199970000,
  })

  psbt.signInput(0, buyer, [bitcoin.Transaction.SIGHASH_SINGLE | bitcoin.Transaction.SIGHASH_ANYONECANPAY])
  psbt.signInput(1, seller, [bitcoin.Transaction.SIGHASH_ALL])
  psbt.finalizeAllInputs()
  console.log(psbt.extractTransaction().toHex())
}

async function sigleTransactionTest() {
  var buyerPriv = "d2dc8880c72520d61554cf3d90dcd54c98c0e04329c11c3c5b48e9a976ff4e29"
  var sellerPriv = "bd0003fcc25ac8c2dfaaa8413405156498114a9d1627486af8f5b27de35309f9"

  var seller = ECPair.fromPrivateKey(Buffer.from(sellerPriv, 'hex'))
  var buyerAddress = "n1EmAHAzvCgQYaKkGLm1e5taFauCiuNzHK";
  var buyer = ECPair.fromPrivateKey(Buffer.from(buyerPriv, 'hex'))
  var sellAddress = "miUpB4pCtoMSzgsv3k8XG69u6usGXhuPYi";

  // buyer
  const psbt = new bitcoin.Psbt({ network: bitcoin.networks.regtest });
  const sequence = 0xfffffffd;
   // first dummy
   psbt.addInput({
     hash: "1ce61e21ce48af9cce57c359936942126076380f839c3edf06f50384e08ce8d8",
     index: 3,
     sequence: sequence,
     sighashType: bitcoin.Transaction.SIGHASH_ALL,
     nonWitnessUtxo: Buffer.from("02000000046620cebc2814f3439c18d1e16d40d5abc9c9fddf0ff9e01b2ea75bee84547bd4000000006a47304402207f12a5882214abbacd5037494204094d67cde6aade644f8b3214cb64fd6d009d02204235515647a86c0904393cece98a3ae36190115be36c0fda444115648ee268e2012103b48aee4a6dec95c0e98e5dc31737bdd46b220b79f804a96d93eb06c1b71270effdffffff6620cebc2814f3439c18d1e16d40d5abc9c9fddf0ff9e01b2ea75bee84547bd4010000006b483045022100e73aa21a28217a580838c4ceb98ef73b6f51e85085eaf1d1fbd97cb51a97176b02203514668538ca5da8d8ef5b6938dfdf39719903b35bddca47691143d0f92cf255012103b48aee4a6dec95c0e98e5dc31737bdd46b220b79f804a96d93eb06c1b71270effdffffff02f55730a3dd6666b5d0035a3acbd9de4c6491086159aa1ab0793dfce9915b28000000006a47304402207835124ad8f85730fa8e11dcb80db616cef7a6efe508d85425cffcef0e92a4b9022060201b3eee52c47f482d09f502ad598928c69be643e20f5ba607db9f13501b08832102406cd7e5d61e4c27c7eddcb22af0019bd46c9250bd571bd750075678a84b3378fdffffff6620cebc2814f3439c18d1e16d40d5abc9c9fddf0ff9e01b2ea75bee84547bd4020000006b4830450221008d4dd48aa41d6c12f7927de691ca1e6d94756c7ed8ff1359d5a2ca17a24ace0702200d2855d7180a2a1ceb0625cd872290ea364b71b970d2a5f34a9705552be2801b012103b48aee4a6dec95c0e98e5dc31737bdd46b220b79f804a96d93eb06c1b71270effdffffff06b0040000000000001976a914d85290e927b8e20b1e48dbfeac9d8ea4c9a9955088ac22020000000000001976a914d85290e927b8e20b1e48dbfeac9d8ea4c9a9955088ac404b4c00000000001976a9142080c44ce0c1ad69e49b11e364b45848cf3da8cc88ac58020000000000001976a914d85290e927b8e20b1e48dbfeac9d8ea4c9a9955088ac58020000000000001976a914d85290e927b8e20b1e48dbfeac9d8ea4c9a9955088ac4c329a05000000001976a914d85290e927b8e20b1e48dbfeac9d8ea4c9a9955088ac00000000", "hex")
   });
   psbt.addInput({
    hash: "1ce61e21ce48af9cce57c359936942126076380f839c3edf06f50384e08ce8d8",
    index: 4,
    sequence: sequence,
    sighashType: bitcoin.Transaction.SIGHASH_ALL,
    nonWitnessUtxo: Buffer.from("02000000046620cebc2814f3439c18d1e16d40d5abc9c9fddf0ff9e01b2ea75bee84547bd4000000006a47304402207f12a5882214abbacd5037494204094d67cde6aade644f8b3214cb64fd6d009d02204235515647a86c0904393cece98a3ae36190115be36c0fda444115648ee268e2012103b48aee4a6dec95c0e98e5dc31737bdd46b220b79f804a96d93eb06c1b71270effdffffff6620cebc2814f3439c18d1e16d40d5abc9c9fddf0ff9e01b2ea75bee84547bd4010000006b483045022100e73aa21a28217a580838c4ceb98ef73b6f51e85085eaf1d1fbd97cb51a97176b02203514668538ca5da8d8ef5b6938dfdf39719903b35bddca47691143d0f92cf255012103b48aee4a6dec95c0e98e5dc31737bdd46b220b79f804a96d93eb06c1b71270effdffffff02f55730a3dd6666b5d0035a3acbd9de4c6491086159aa1ab0793dfce9915b28000000006a47304402207835124ad8f85730fa8e11dcb80db616cef7a6efe508d85425cffcef0e92a4b9022060201b3eee52c47f482d09f502ad598928c69be643e20f5ba607db9f13501b08832102406cd7e5d61e4c27c7eddcb22af0019bd46c9250bd571bd750075678a84b3378fdffffff6620cebc2814f3439c18d1e16d40d5abc9c9fddf0ff9e01b2ea75bee84547bd4020000006b4830450221008d4dd48aa41d6c12f7927de691ca1e6d94756c7ed8ff1359d5a2ca17a24ace0702200d2855d7180a2a1ceb0625cd872290ea364b71b970d2a5f34a9705552be2801b012103b48aee4a6dec95c0e98e5dc31737bdd46b220b79f804a96d93eb06c1b71270effdffffff06b0040000000000001976a914d85290e927b8e20b1e48dbfeac9d8ea4c9a9955088ac22020000000000001976a914d85290e927b8e20b1e48dbfeac9d8ea4c9a9955088ac404b4c00000000001976a9142080c44ce0c1ad69e49b11e364b45848cf3da8cc88ac58020000000000001976a914d85290e927b8e20b1e48dbfeac9d8ea4c9a9955088ac58020000000000001976a914d85290e927b8e20b1e48dbfeac9d8ea4c9a9955088ac4c329a05000000001976a914d85290e927b8e20b1e48dbfeac9d8ea4c9a9955088ac00000000", "hex")
  });
   // buyer receive dummy
   psbt.addOutput({
     script: bitcoin.address.toOutputScript(
       buyerAddress,
       bitcoin.networks.regtest
     ),
     value: DUMMY_UTXO_AMOUNT + DUMMY_UTXO_AMOUNT + 0,
   })
   // receive nft
   psbt.addOutput({
    script: bitcoin.address.toOutputScript(
      buyerAddress,
      bitcoin.networks.regtest
    ),
    value: 546,
    })
    // append seller input & output
    psbt.addInput({
      hash: "34f3d30981867dd331fa9189541a6bd79c7d493920b6fd6d814bab5503d19ac2",
      index: 0,
      sequence: sequence,
      sighashType: bitcoin.Transaction.SIGHASH_SINGLE | bitcoin.Transaction.SIGHASH_ANYONECANPAY,
      nonWitnessUtxo: Buffer.from("02000000000101900aa15c302425cd175fde300579fa715b3d1326294cfd4887da2fe206314df40200000000ffffffff0122020000000000001976a9142080c44ce0c1ad69e49b11e364b45848cf3da8cc88ac034017b5d4cf552470285c5abf3486e447c63c021bcaf0b6d2b88bef2655925cc6b325ca531e2df4eb42bb532002b98f4e0d1fe3d705e8032ecf2753e825614747692d0063036f7264010118746578742f706c61696e3b636861727365743d7574662d38000968656c6c6f706f6e796821c1406cd7e5d61e4c27c7eddcb22af0019bd46c9250bd571bd750075678a84b337800000000", "hex"),
    });
    psbt.addOutput({
      script: bitcoin.address.toOutputScript(
        sellAddress,
        bitcoin.networks.regtest
      ),
      value: 5000000,
    });
    // -------------------------
    // add buyer payment utxo
    psbt.addInput({
      hash: "1ce61e21ce48af9cce57c359936942126076380f839c3edf06f50384e08ce8d8",
      index: 5,
      sequence: sequence,
      sighashType: bitcoin.Transaction.SIGHASH_ALL,
      nonWitnessUtxo: Buffer.from("02000000046620cebc2814f3439c18d1e16d40d5abc9c9fddf0ff9e01b2ea75bee84547bd4000000006a47304402207f12a5882214abbacd5037494204094d67cde6aade644f8b3214cb64fd6d009d02204235515647a86c0904393cece98a3ae36190115be36c0fda444115648ee268e2012103b48aee4a6dec95c0e98e5dc31737bdd46b220b79f804a96d93eb06c1b71270effdffffff6620cebc2814f3439c18d1e16d40d5abc9c9fddf0ff9e01b2ea75bee84547bd4010000006b483045022100e73aa21a28217a580838c4ceb98ef73b6f51e85085eaf1d1fbd97cb51a97176b02203514668538ca5da8d8ef5b6938dfdf39719903b35bddca47691143d0f92cf255012103b48aee4a6dec95c0e98e5dc31737bdd46b220b79f804a96d93eb06c1b71270effdffffff02f55730a3dd6666b5d0035a3acbd9de4c6491086159aa1ab0793dfce9915b28000000006a47304402207835124ad8f85730fa8e11dcb80db616cef7a6efe508d85425cffcef0e92a4b9022060201b3eee52c47f482d09f502ad598928c69be643e20f5ba607db9f13501b08832102406cd7e5d61e4c27c7eddcb22af0019bd46c9250bd571bd750075678a84b3378fdffffff6620cebc2814f3439c18d1e16d40d5abc9c9fddf0ff9e01b2ea75bee84547bd4020000006b4830450221008d4dd48aa41d6c12f7927de691ca1e6d94756c7ed8ff1359d5a2ca17a24ace0702200d2855d7180a2a1ceb0625cd872290ea364b71b970d2a5f34a9705552be2801b012103b48aee4a6dec95c0e98e5dc31737bdd46b220b79f804a96d93eb06c1b71270effdffffff06b0040000000000001976a914d85290e927b8e20b1e48dbfeac9d8ea4c9a9955088ac22020000000000001976a914d85290e927b8e20b1e48dbfeac9d8ea4c9a9955088ac404b4c00000000001976a9142080c44ce0c1ad69e49b11e364b45848cf3da8cc88ac58020000000000001976a914d85290e927b8e20b1e48dbfeac9d8ea4c9a9955088ac58020000000000001976a914d85290e927b8e20b1e48dbfeac9d8ea4c9a9955088ac4c329a05000000001976a914d85290e927b8e20b1e48dbfeac9d8ea4c9a9955088ac00000000", "hex")
    });
    // todo:// skip platform fee
    
    // new duumy utxo
    psbt.addOutput({
      script: bitcoin.address.toOutputScript(
        buyerAddress,
        bitcoin.networks.regtest
      ),
      value: DUMMY_UTXO_AMOUNT,
    })
    psbt.addOutput({
      script: bitcoin.address.toOutputScript(
        buyerAddress,
        bitcoin.networks.regtest
      ),
      value: DUMMY_UTXO_AMOUNT,
    })
    // change amount
    psbt.addOutput({
      script: bitcoin.address.toOutputScript(
        buyerAddress,
        bitcoin.networks.regtest
      ),
      value: 88000000,
    })
  
  const toSignInputs = [];
  psbt.data.inputs.forEach((v,index) => {
    let script = null;
    let value = 0;
    if(v.nonWitnessUtxo) {
      const tx = bitcoin.Transaction.fromBuffer(v.nonWitnessUtxo);
      const output = tx.outs[psbt.txInputs[index].index];
      script = output.script;
      value = output.value;
    }
    const isSigned = v.finalScriptSig || v.finalScriptWitness;
      if (script && !isSigned) {
        const address = bitcoin.address.fromOutputScript(script, bitcoin.networks.regtest);
        if (bitcoin.payments.p2pkh({ pubkey: buyer.publicKey, network: bitcoin.networks.regtest }).address === address) {
          toSignInputs.push({
            index,
            publicKey: buyer.publicKey,
            sighashTypes: [bitcoin.Transaction.SIGHASH_ALL]
          });
        }
      }
  })
  psbt.signInput(2, seller, [bitcoin.Transaction.SIGHASH_SINGLE | bitcoin.Transaction.SIGHASH_ANYONECANPAY])

  toSignInputs.forEach((input)=> {
    psbt.signInput(input.index, buyer,[bitcoin.Transaction.SIGHASH_ALL]);
    // psbt.finalizeInput(input.index)
  })
  // console.log("psbt info:", JSON.stringify(psbt.inpu))
  
  // create seller 
  const sellerPsbt = new bitcoin.Psbt({ network: bitcoin.networks.regtest });
  
  sellerPsbt.addInput({
    hash: "34f3d30981867dd331fa9189541a6bd79c7d493920b6fd6d814bab5503d19ac2",
    index: 0,
    sequence: sequence,
    sighashType: bitcoin.Transaction.SIGHASH_SINGLE | bitcoin.Transaction.SIGHASH_ANYONECANPAY,
    nonWitnessUtxo: Buffer.from("02000000000101900aa15c302425cd175fde300579fa715b3d1326294cfd4887da2fe206314df40200000000ffffffff0122020000000000001976a9142080c44ce0c1ad69e49b11e364b45848cf3da8cc88ac034017b5d4cf552470285c5abf3486e447c63c021bcaf0b6d2b88bef2655925cc6b325ca531e2df4eb42bb532002b98f4e0d1fe3d705e8032ecf2753e825614747692d0063036f7264010118746578742f706c61696e3b636861727365743d7574662d38000968656c6c6f706f6e796821c1406cd7e5d61e4c27c7eddcb22af0019bd46c9250bd571bd750075678a84b337800000000", "hex"),
  });
  sellerPsbt.addOutput({
    script: bitcoin.address.toOutputScript(
      sellAddress,
      bitcoin.networks.regtest
    ),
    value: 5000000,
  });

  sellerPsbt.signInput(0, seller, [bitcoin.Transaction.SIGHASH_SINGLE | bitcoin.Transaction.SIGHASH_ANYONECANPAY])


  console.log("sellpsbt:", sellerPsbt.toBase64())
  console.log("buyerpsbt:", psbt.toBase64())
  // psbt.data.inputs[2] = sellerPsbt.data.inputs[0]

  psbt.finalizeAllInputs()
  var res = psbt.extractTransaction().toHex()
  console.log(res);
}

// 0200000004d8e88ce08403f506df3e9c830f3876601242699359c357ce9caf48ce211ee61c030000006a47304402207af3a3ec940cd97ab77d972e9cdaf5e21be3e5d3db53da8fc64fb024ddd08dc602205b4032ff69ba33d6b75069827a4ebc5708f51bc3e8ecf8869f9103457845d2ba012103b48aee4a6dec95c0e98e5dc31737bdd46b220b79f804a96d93eb06c1b71270effdffffffd8e88ce08403f506df3e9c830f3876601242699359c357ce9caf48ce211ee61c040000006a473044022078123f26bff396782f2ad2fa3d7c370fef136f496e8f3a0dbde168d6d02248d5022061b3cf9009eae2eef479ff77536cc257aad216dd52bc8815899a29b2741b5eed012103b48aee4a6dec95c0e98e5dc31737bdd46b220b79f804a96d93eb06c1b71270effdffffffc29ad10355ab4b816dfdb62039497d9cd76b1a548991fa31d37d868109d3f334000000006a47304402205fe2c06774f47716be161b3035ab4eec0c550798d8a303b3dc5547a0263e47d4022033321ee766594c76055cb23638660c312a219012a6e8d77542771c08ac30b211832102406cd7e5d61e4c27c7eddcb22af0019bd46c9250bd571bd750075678a84b3378fdffffffd8e88ce08403f506df3e9c830f3876601242699359c357ce9caf48ce211ee61c050000006b483045022100d59286514eb9f7e45c81e127e172fd049bc9cc5202e72604b418aef34ab5b9d1022036f9f68506c8c281a3101f3e8ec9ea795a0580a7015ff3998d11cb9a6c98f326012103b48aee4a6dec95c0e98e5dc31737bdd46b220b79f804a96d93eb06c1b71270effdffffff06b0040000000000001976a914d85290e927b8e20b1e48dbfeac9d8ea4c9a9955088ac22020000000000001976a914d85290e927b8e20b1e48dbfeac9d8ea4c9a9955088ac404b4c00000000001976a9142080c44ce0c1ad69e49b11e364b45848cf3da8cc88ac58020000000000001976a914d85290e927b8e20b1e48dbfeac9d8ea4c9a9955088ac58020000000000001976a914d85290e927b8e20b1e48dbfeac9d8ea4c9a9955088ac00c63e05000000001976a914d85290e927b8e20b1e48dbfeac9d8ea4c9a9955088ac00000000

export function psbtSign(psbtBase64, privateKey, network) {
  const psbt = bitcoin.Psbt.fromBase64(psbtBase64, { network });
  psbtSignImpl(psbt, privateKey, network)
  return psbt.toBase64();
}

export function psbtSignImpl(psbt, privateKey, network) {
  network = network || bitcoin.networks.regtest
  const privKeyHex = privateKeyFromWIF(privateKey, network);
  const signer = {
      publicKey: Buffer.alloc(0),
      sign(hash) {
          return sign(hash, privKeyHex);
      },
      signSchnorr(hash) {
          const tweakedPrivKey = taproot.taprootTweakPrivKey(base.fromHex(privKeyHex));
          return Buffer.from(schnorr.sign(hash, tweakedPrivKey, base.randomBytes(32)));
      },
  };

  const allowedSighashTypes = [
      Transaction.SIGHASH_SINGLE|Transaction.SIGHASH_ANYONECANPAY,
      Transaction.SIGHASH_ALL,
      Transaction.SIGHASH_DEFAULT
  ];

  for (let i = 0; i < psbt.inputCount; i++) {
      if (isTaprootInput(psbt.data.inputs[i])) {
          signer.publicKey = Buffer.from(taproot.taprootTweakPubkey(toXOnly(wif2Public(privateKey, network)))[0]);
      } else {
          signer.publicKey = wif2Public(privateKey, network);
      }
      try {
          psbt.signInput(i, signer, allowedSighashTypes);
      } catch (e) {}
  }
}

function generateAddress() {
  var privateKeyHex = "";
  const buyer = ECPair.fromPrivateKey(Buffer.from(privateKeyHex, 'hex'))
  
  var bip44 = bitcoin.payments.p2pkh({ pubkey: buyer.publicKey, network: bitcoin.networks.regtest }).address
  var bip49 = bitcoin.payments.p2sh({ pubkey: buyer.publicKey, network: bitcoin.networks.regtest }).address
  // var bip84 = bitcoin.payments.p2tr({ pubkey: buyer.publicKey, network: bitcoin.networks.regtest }).address
  // console.log(buyer.publicKey)
  var bip86 = bitcoin.payments.p2tr({ internalPubkey: toXOnly(buyer.publicKey), network: bitcoin.networks.bitcoin }).address
  // console.log("bip44:", bip44);
  // console.log("bip49:", bip49);
  // console.log("bip86:", bip86);
  console.log("bip49:", bip49);
}

async function main() {
  // create2Dummy()
  // sellerListingOrder()
  // buyerOffer()
  generateAddress()
  // generateAddress()
}



main()
