import React, { Component } from "react";
import myTokenContract from "./contracts/myToken.json";
import myTokenSaleContract from "./contracts/MyTokenSale.json";
import kycContract from "./contracts/KycContract.json";
import getWeb3 from "./getWeb3";

import "./App.css";

class App extends Component {
  state = { loaded:false, kycAddress:"0x123...", myTokenSaleAddress: " ", userAmount:0};

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
       this.web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      this.accounts = await this.web3.eth.getAccounts();

      // Get the contract instance.
      this.networkId = await this.web3.eth.net.getId();// give 3 its does not work rightnow
      
     //const deployedNetwork = myToken.networks[networkId];
     console.log(this.networkId);
     console.log(this.accounts[0]);
     

     //make instance from myToken to use their methods 
      this.myTokenInstance = new this.web3.eth.Contract(
        myTokenContract.abi,
        myTokenContract.networks[this.networkId] && myTokenContract.networks[this.networkId].address,
      )
       //make instance from KycInstance to use their methods 
      this.kycInstance = new this.web3.eth.Contract(
        kycContract.abi, 
        kycContract.networks[this.networkId] && kycContract.networks[this.networkId].address,
      )
      //make instance from myTokenSale to use their methods 
      this.myTokenSaleInstance = new this.web3.eth.Contract(
        myTokenSaleContract.abi,
        myTokenSaleContract.networks[this.networkId] && myTokenSaleContract.networks[this.networkId].address,
      )
      this.listenToTokenTransfer();

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({loaded:true, myTokenSaleAddress: myTokenSaleContract.networks[this.networkId].address}, this.updateUserToken);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };
  handleInputChange = (event) => {
     let target = event.target;
     let value = target === "checkbox" ? target.checkBox : target.value;
     let name = target.name;

     this.setState({
       [name]: value
     })
  }
  handleKycAddress = async () => {
    let { kycAddress } = this.state;
    
    await this.kycInstance.methods.setKycCompleted(kycAddress).send({from:this.accounts[0]});
    console.log(kycAddress);
    //web3.eth.sendTransaction({from:"0x2002904E74F85A5A2D339cac6aA9db3794186365", to:"0x493f1524512dEFB43078EDC380d100cD1c68e07C", value:this.web3.utils.toWei("1", "ether")});
    alert("the address => " + kycAddress + "is completed");
  }
  handleBuyOneToken = async () => {
    try{
      await this.myTokenSaleInstance.methods.buyTokens(this.accounts[0]).send({from: this.accounts[0], value: 1});
    } catch(error){
      console.error(error);
    };
  }
  listenToTokenTransfer = async () => {
    await this.myTokenInstance.events.Transfer({to:this.accounts[0]}).on("data", this.updateUserToken);
  }
  updateUserToken = async () => {
    let amount = await this.myTokenInstance.methods.balanceOf(this.accounts[0]).call();
    this.setState({userAmount:amount});
  }


  render() {
    if (!this.state.loaded) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>miqyry token (miq)</h1>
        <p>miq token sale</p>
        <h2> completed your kyc</h2>
        <p>
         allow: <input type="text" name="kycAddress"  value={this.state.kycAddress} onChange={this.handleInputChange}/>
         <button type="button" onClick={this.handleKycAddress}>add your address to whiteliss</button>
        </p>
        <h2>purchase token</h2>

       <p>purchase token via contract "{this.state.myTokenSaleAddress}" </p>

       <p>the account has {this.state.userAmount} miq_token</p>
       <h2> buy one miq_token</h2>
       <button type="button" onClick={this.handleBuyOneToken}>buyToken</button>
      </div>
    );
  }
}

export default App;
