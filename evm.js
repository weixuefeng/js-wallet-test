import * as ethers from "ethers";
import { ledgerService } from '@ledgerhq/hw-app-eth'
const l1Url = 'https://eth.llamarpc.com'
const bridgeABI = [{ "inputs": [{ "internalType": "address", "name": "_l1Token", "type": "address" }, { "internalType": "address", "name": "_l2Token", "type": "address" }, { "internalType": "uint256", "name": "_amount", "type": "uint256" }, { "internalType": "uint32", "name": "_minGasLimit", "type": "uint32" }, { "internalType": "bytes", "name": "_extraData", "type": "bytes" }], "name": "depositERC20", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [{ "internalType": "uint32", "name": "_minGasLimit", "type": "uint32" }, { "internalType": "bytes", "name": "_extraData", "type": "bytes" }], "name": "depositETH", "outputs": [], "stateMutability": "payable", "type": "function" }]
const bridgeAddr = '0x99C9fc46f92E8a1c0deC1b1747d010903E884bE1'

var extra = ethers.AbiCoder.defaultAbiCoder().encode(['uint256'], [1696670135791])
console.log(extra)
const l1RpcProvider = new ethers.JsonRpcProvider("https://evm.gatenode.cc")
var res = await l1RpcProvider.estimateGas({
  from: "0xbc76c785cadfa1b09c6b397fc08b66277952986a",
  to: "0xf04c414d736c4bb4b7fc32843c6d35f9a9a8b216",
  data: "0x39281e6700000000000000000000000000000000000000000000000000000000000000c8000000000000000000000000000000000000000000000000000000000000003200000000000000000000000000000000000000000000000000000000000000a0000000000000000000000000bc76c785cadfa1b09c6b397fc08b66277952986a000000000000000000000000000000000000000000000000000000006529004700000000000000000000000000000000000000000000000000000000000000020000000000000000000000004151ab5072198d0843cd2999590ef292f49d6c66000000000000000000000000672f30407a71fa8737a3a14474ff37e09c7fc44a"
})
console.log("gas", res);

const privateKey = ''
const l1Signer = new ethers.Wallet(privateKey, l1RpcProvider)

const l1BridgeContract = new ethers.Contract(bridgeAddr, bridgeABI, l1Signer)

const _minGasLimit = ethers.toBigInt('200000');


var tx = new ethers.Transaction();
tx.to = "0x6BD5a1F893A7e8891f79dd0FA6CE6d286dF410c1";
tx.gasPrice = 7237096376;
tx.gasLimit = 21000;
tx.value = 1;
tx.chainId = 1;
tx.nonce = 0;
console.log(tx.unsignedSerialized);


