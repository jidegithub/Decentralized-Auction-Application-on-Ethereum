// store.js
import { reactive } from 'vue';
import Web3 from 'web3';

const store = reactive({
  metamask: {
    web3DefaultAccount: '',
    metamaskInstalled: false,
    networkId: '',
  },
  web3: null,

  // Utility methods to mimic Vue 2 store behavior
  networkReady() {
    return this.getNetworkId() !== '' && this.getMetamaskInstalled() && this.getWeb3DefaultAccount() !== '';
  },
  setNetworkId(networkId) {
    this.metamask.networkId = networkId;
  },
  getNetworkId() {
    return this.metamask.networkId;
  },

  setWeb3DefaultAccount(account) {
    this.metamask.web3DefaultAccount = account;
  },
  getWeb3DefaultAccount() {
    return this.metamask.web3DefaultAccount;
  },

  setMetamaskInstalled() {
    this.metamask.metamaskInstalled = true;
  },
  getMetamaskInstalled() {
    return this.metamask.metamaskInstalled;
  },

  getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }
});

export default store;