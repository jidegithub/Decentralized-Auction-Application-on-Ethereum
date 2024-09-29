import { ethers } from 'ethers';
import Web3 from 'web3';

// Ethers.js setup
export class web3Provider {
  constructor() {
    this.provider = null;
    this.signer = null;
    this.contract = null;
  }
  initializeEthers = async () => {
    // Check if MetaMask is available
    if (!window.ethereum) {
      throw new Error("No crypto wallet found. Please install MetaMask.");
    }

    // Request account access
    await window.ethereum.request({ method: "eth_requestAccounts" });

    this.provider = new ethers.providers.Web3Provider(window.ethereum);
    this.signer = this.provider.getSigner();
    return { provider: this.provider, signer: this.signer };
  }
  getWeb3 = async() => {
    try {
      // Await the initialization
      const { provider, signer } = await this.initializeEthers();
      console.log('Ethers initialized', provider, signer);
    } catch (error) {
      console.error('Initialization error:', error);
    }
  }
  getAccounts = async() => {
    // Ensure signer is initialized
    if (!this.signer) {
      console.error("Signer is undefined. Make sure initializeEthers() is called first.");
      return null;
    }

    // Return the account address
    return [await this.signer.getAddress()];
  }
  getCurrentBlock = async() => {
    // Ensure provider is initialized
    if (!this.provider) {
      console.error("Provider is undefined. Make sure initializeEthers() is called first.");
      return null;
    }

    return await this.provider.getBlockNumber();
  }
  createContractInstance = async(abi, address) => {
    if (!this.signer) {
      throw new Error("Signer is not initialized.");
    }
    this.contract = new ethers.Contract(address, abi, this.signer);
    return this.contract;
  }
  toWei(value, unit) {
    return ethers.utils.parseUnits(value.toString(), unit);
  }
};

// Web3.js setup
export class web3Library {
  constructor() {
    this.web3 = null;
  }
  initializeWeb3 = async() => {
    this.web3 = new Web3(window.ethereum);
  }
  getWeb3 = async() => {
    await this.initializeWeb3();
    return this.web3;
  }
  getAccounts = async() => {
    return await web3.eth.getAccounts();
  }
  getCurrentBlock = async() => {
    return await web3.eth.getBlockNumber();
  }
  createContractInstance = async(abi, address) => {
    return new web3.eth.Contract(abi, address);
  }
  toWei = (value, unit) => {
    return web3.utils.toWei(value.toString(), unit);
  }
};
