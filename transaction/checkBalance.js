var fs = require("fs");
const { Web3 } = require("web3");
const web3 = new Web3("http://13.212.180.250:8545/");

var jsonFile = "abi.json";
var parsed = JSON.parse(fs.readFileSync(jsonFile));
var abi = parsed.abi;
const signer = web3.eth.accounts.privateKeyToAccount('0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d');
web3.eth.accounts.wallet.add(signer);
var contract = new web3.eth.Contract(
  parsed,
  "0x8464135c8F25Da09e49BC8782676a84730C318bC",
  { from: signer.address }
);


async function balance(address) {
    contract.methods.balanceOf(address).call().then(console.log).catch(console.error);
}


balance(signer.address)