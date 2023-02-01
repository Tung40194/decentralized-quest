require("dotenv").config()
require("@nomicfoundation/hardhat-toolbox");
require("@openzeppelin/hardhat-upgrades");
require("@nomiclabs/hardhat-web3");
require("@nomiclabs/hardhat-solhint");
require("hardhat-gas-reporter");
require("hardhat-contract-sizer");
require("@nomiclabs/hardhat-ethers");
require("@nomicfoundation/hardhat-chai-matchers");

const privKeys = (process.env.PRIVATE_KEYS) ? process.env.PRIVATE_KEYS.split(' ') : undefined;

module.exports = {
  solidity: {
    version: '0.8.17',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    local: {
      url: process.env.ETH_ENDPOINT || 'http://localhost:8545',
      accounts: privKeys,
      // accounts: {
      //   mnemonic: process.env.MNEMONIC,
      // }
    },
    goerli: {
      url: `https://goerli.infura.io/v3/a5a875cd248a493d852d7ebc0e706689`,
      accounts: [process.env.PRIVATE_KEY]
    },
    mumbai: {
      url: "https://polygon-testnet-rpc.allthatnode.com:8545",
      accounts: [process.env.PRIVATE_KEY]
    },
    matic: {
      url: "https://polygon-rpc.com/",
      accounts: [process.env.PRIVATE_KEY]
    },
    ethereum: {
      url: `https://mainnet.infura.io/v3/a5a875cd248a493d852d7ebc0e706689`,
      accounts: [process.env.PRIVATE_KEY]
    },
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS=== "true" ? true : false,
    currency: 'USD',
    gasPrice: process.env.GAS_PRICE? process.env.GAS_PRICE: 30,
    coinmarketcap: process.env.COINMARKETCAP_KEY
  },
  etherscan: {
    apiKey: process.env.POLYGONSCAN_API_KEY,
    //apiKey: process.env.ETHERSCAN_API_KEY
  },
  contractSizer: {
    alphaSort: true,
    disambiguatePaths: false,
    runOnCompile: true,
    strict: true,
    only: [],
  },
  gasReporter: {
    gasPrice: 21,
    token: 'ETHER',
  },
};
