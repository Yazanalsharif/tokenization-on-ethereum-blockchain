const path = require("path");
const HDWalletProvider = require("@truffle/hdwallet-provider");
const accountIndex = 0;
require("dotenv").config({path: "./totalSupply.env"});

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    development: {
      port: 7545,
      host: "127.0.0.1",
      network_id: "5777"
    },
    ganache_local: {
      provider: function() {
        return new HDWalletProvider(process.env.MNOMINIC, "http://127.0.0.1:7545", accountIndex);
      },
      network_id:"5777"
    },
    goerli_infura: {
      provider: function() {
        return new HDWalletProvider(process.env.MNOMINIC, "https://goerli.infura.io/v3/83f7879b6c5d4faab20f7dc1d221af1c", accountIndex);
      },
      network_id:"5"
    }
  },
   compilers:{
    solc:{
      version:"0.6.4"
    }
  }
};
