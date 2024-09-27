import { reactive } from 'vue';
import uniqid from 'uniqid';

const store = reactive({
  metamask: {
    web3DefaultAccount: '',
    metamaskInstalled: false,
    networkId: '',
  },
  // local web3 instance(not metamask)
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

  // getRandomInt(prefix) {
  //   if(prefix) return uniqid(`${prefix}-`);
  //   return uniqid()
  // }
  getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }
});

export default store;