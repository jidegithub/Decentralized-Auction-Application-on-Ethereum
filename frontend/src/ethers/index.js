// web3ProviderEthers.js
import { ethers, BigNumber } from "ethers";

const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();

const isAddress = (address) => {
  return ethers.utils.isAddress(address)
}

// const [deployer, acc1, acc2] = await ethers.getSigners();

export {provider, signer, isAddress, BigNumber}
