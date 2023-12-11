import { GearKeyring } from '@gear-js/api';
import { Keyring } from '@polkadot/keyring';
import { GearApi } from '@gear-js/api';

const gearApi = await GearApi.create({
    providerAddress: 'wss://testnet-archive.vara-network.io',
});
const chain = await gearApi.chain();
const nodeName = await gearApi.nodeName();
const nodeVersion = await gearApi.nodeVersion();
const genesis = gearApi.genesisHash.toHex();


async function balanceTest() {
    createWalletTest();
    var addr = "kGgthXsCtKWDv5und5owaCPmpS8AqDgDGtLz3U3AK3TgZ9tQu";
    var res = await gearApi.query.system.account(addr);
    console.log("balance", res.data.free);
}

function createWalletTest() {
    const mnemonic = 'swift firm smile curtain inquiry rebuild curve hunt liberty job push east';
    const keyring = new Keyring();
    const pair = keyring.addFromMnemonic(mnemonic);
    console.log(pair)
    keyring.setSS58Format(137);
    console.log('vara', pair.address);
}


async function transferTest() {
  const mnemonic = 'swift firm smile curtain inquiry rebuild curve hunt liberty job push east';
  const keyring = new Keyring({ type: 'ed25519' });
  const pair = keyring.addFromMnemonic(mnemonic);
  console.log(pair.address)
  // var res = await gearApi.query.system.account(pair.address);
  // console.log("balance", res.data.free.toHuman());
  var toAddress = "kGkMY2yNtcB4ws7nACUwsT3aLKoUsuhjhNWxxkMw8soxcktWh";
  var response1 = await gearApi.tx.balances.transfer(toAddress, 1)
  .paymentInfo(pair);
  console.log(JSON.stringify(response1))

  var response = await gearApi.tx.balances.transfer(toAddress, 1)
  .signAndSend(pair);
  console.log(JSON.stringify(response))
}



function main() {
  transferTest()
}

main()