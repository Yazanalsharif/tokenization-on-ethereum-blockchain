const tokenSale = artifacts.require("myTokenSale");
const token = artifacts.require("myToken");
const kycContract = artifacts.require("KycContract");

const chai = require("./setupChai");
const expect = chai.expect;
const BN = web3.utils.BN;
require("dotenv").config({path: "../totalSupply.env"});

contract("test myTokensale contract", async accounts => {
    const [deployerAccount, recepiantAccount, thirdAccount] = accounts;

    it("there shoud't be any token in myAccount", async() => {
        const instance = await token.deployed();
       return expect(await instance.balanceOf(deployerAccount)).to.be.bignumber.equal(new BN(0));
    });

    it("all token must in the token Sale SmartContract by default", async () => {
        const instanceToken = await token.deployed();
        const totalSupply = await instanceToken.totalSupply();
       return expect(await instanceToken.balanceOf(tokenSale.address)).to.be.bignumber.equal(new BN(totalSupply));
    })

    it("should be possiable buy token from TokenSaleSmartContract", async() => {
        const instanceTokenSale = await tokenSale.deployed();
        const instanceToken = await token.deployed();
        const balanceInTokenSaleSmartContract = await instanceToken.balanceOf(tokenSale.address);// the totalSupply
        const balanceBefor = await instanceToken.balanceOf(thirdAccount);// zero
        expect(instanceTokenSale.sendTransaction({from:thirdAccount, value:web3.utils.toWei("1", "wei")})).to.eventually.be.rejected;//buy one token
        const instanceKyc = await kycContract.deployed();
        await instanceKyc.setKycCompleted(thirdAccount);
        expect(instanceTokenSale.sendTransaction({from:thirdAccount, value:web3.utils.toWei("1", "wei")})).to.eventually.be.fulfilled;
        expect(await instanceToken.balanceOf(tokenSale.address)).to.be.bignumber.equal(balanceInTokenSaleSmartContract.sub(new BN(1)));
        return expect(await instanceToken.balanceOf(thirdAccount)).to.be.bignumber.equal(balanceBefor.add(new BN(1)));//third account must have 1 token
    })
    
})

