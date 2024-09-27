import Web3 from 'web3';

const web3 = new Web3(window.ethereum);

export const toBigInteger  = web3.utils.toBigInt;

export default web3;