
import { RpcClient } from '@taquito/rpc';

const client = new RpcClient('https://ghostnet.ecadinfra.com', 'main');

const balance = await client.getBalance('tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb');
console.log('-- Balance:', balance.toNumber());

// gets contract storage
const storage = await client.getStorage(contractExample);
console.log('-- Contract storage:', storage);