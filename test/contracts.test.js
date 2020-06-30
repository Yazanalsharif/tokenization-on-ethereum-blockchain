const token = artifacts.require("./myToken.sol");
const chai = require("./setupChai");

const BN = web3.utils.BN;

const expect = chai.expect;



beforeEach(async () => {
    this.myToken = await token.new(1000);
})


contract("Token Test", async accounts => {
    const [ initialHolder, recipient, anotherAccount ] = accounts;
    it("All tokens should be in my account", async () => {
        let instance = this.myToken;
        let totalSupply = await instance.totalSupply();
        return expect(await instance.balanceOf(initialHolder)).to.be.bignumber.equal(totalSupply);
    });

    it("you can send token from account 1 to account 2", async () => {
        const sendToken = 1;
        let instance = this.myToken;
        let totalSupply = await instance.totalSupply();
        expect(await instance.balanceOf(initialHolder)).to.be.bignumber.equal(totalSupply);
        expect(instance.transfer(recipient, new BN(sendToken))).to.eventually.be.fulfilled;
        expect(await instance.balanceOf(recipient)).to.be.bignumber.equal(new BN(sendToken));
       return expect(await instance.balanceOf(initialHolder)).to.be.bignumber.equal(totalSupply.sub(new BN(sendToken)));
    });

    it("its not possible to send token more than you have", async () => {
        let instance = this.myToken;
        let balanceOf = await instance.balanceOf(initialHolder);
        let balance = new BN(balanceOf + 1);
        expect(instance.transfer(recipient, balance)).to.eventually.be.rejected;// it's rejected 
        return expect(await instance.balanceOf(initialHolder)).to.be.bignumber.equal(balanceOf);
    });
    
    });
