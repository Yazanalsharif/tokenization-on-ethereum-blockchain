var myToken = artifacts.require("./myToken.sol");

var myTokenSale = artifacts.require("./myTokenSale.sol");

var myKycContract = artifacts.require("./KycContract.sol");

require("dotenv").config({path: "../totalSupply.env"});

module.exports = async function(deployer) {
   const accounts = await web3.eth.getAccounts();
   await deployer.deploy(myToken, process.env.INITIAL_TOKENS);
   await deployer.deploy(myKycContract);
   console.log(accounts[0]);
   await deployer.deploy(myTokenSale, 1, accounts[0], myToken.address, myKycContract.address);
   const instanceToken = await myToken.deployed();
   instanceToken.transfer(myTokenSale.address, process.env.INITIAL_TOKENS);
}