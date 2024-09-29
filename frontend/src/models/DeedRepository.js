import Config from '../config'
import { ref } from 'vue';
import { web3Provider } from '@/services/web-provider'
import { isAddress } from '@/ethers'

const newWeb3Provider = new web3Provider()
const { getWeb3, getAccounts, getCurrentBlock, createContractInstance } = newWeb3Provider;

export class DeedRepository {

  web3 = null
  account = ref('')
  contractInstance = null
  gas = 4476768

  constructor() {
    this.gas = Config.GAS_AMOUNT
  }

  initializeWeb3 = async() => {
    this.web3 = await getWeb3()
    this.account.value = await getAccounts()
    this.contractInstance = await createContractInstance(
      Config.DEEDREPOSITORY_ABI, 
      Config.DEEDREPOSITORY_ADDRESS
    )
  }

  getCurrentBlock() {
    return getCurrentBlock()
  }

  async onDeedRegistered(cb) {
    try {
      const currentBlock = await this.getCurrentBlock();
  
      // Listen for the DeedRegistered event from the current block onwards
      this.contractInstance.on("DeedRegistered", (deedId, deedURI, event) => {
        console.log("DeedRegistered event:", { deedId, deedURI, event });
  
        // Callback to handle the event
        cb({ deedId, deedURI, event });
      });
  
      console.log(`Listening for DeedRegistered events from block ${currentBlock}`);
    } catch (error) {
      console.error('Error in onDeedRegistered:', error);
    }
  }
  
  async onDeedTransfer(cb) {
    try {
      const currentBlock = await this.getCurrentBlock();
  
      // Listen for future Transfer events
      this.contractInstance.on("Transfer", (from, to, deedId, event) => {
        console.log("New Transfer event:", { from, to, deedId, event });
        cb({ from, to, deedId, event });
      });
  
      console.log(`Listening for Transfer events from block ${currentBlock}`);
    } catch (error) {
      console.error('Error in watchIfDeedTransferred:', error);
    }
  }
  

  // async exists(deedId) {
  //   return await this.contractInstance.functions.exists(deedId)
  //     .call({ from: this.account.value, gas: this.gas })
  // }
  async exists(deedId) {
    try {
      const exists = await this.contractInstance.exists(deedId); // Directly call the function
      console.log(`Deed exists: ${exists}`);
      return exists;
    } catch (error) {
      console.error("Error checking deed existence:", error);
      throw error;
    }
  }

  async _approveTransfer(to, deedId) {
    try {
      // Approve the contract to transfer the deed
      const tx = await this.contractInstance.approve(to, deedId, {
        gasLimit: this.gas // Set gas limit if needed
      });
  
      console.log('Approval transaction hash:', tx.hash);
  
      // Wait for the approval transaction to be mined
      const receipt = await tx.wait();
      console.log('Approval mined in block', receipt.blockNumber);
      return receipt;
    } catch (error) {
      console.error('Error in approving deed transfer:', error);
      throw error;
    }
  }

  async transferTo(to, deedId) {
    console.log('address -to',to)
    console.log('address -this account value',this.account.value)
    try {
      const acountAddress = this.account.value[0]
      // Ensure that both `to` and `this.account.value` are valid addresses
      if (!isAddress(to) || !isAddress(acountAddress)) {
        throw new Error("Invalid Ethereum address");
      }

      // Approve the transfer
      const approvalReceipt = await this._approveTransfer(to, deedId);
      console.log('Approval receipt:', approvalReceipt);

      // Perform the transfer after approval
      const tx = await this.contractInstance.transferFrom(acountAddress, to, deedId, {
        gasLimit: this.gas // Set gas limit for the transaction if needed
      });

      console.log('Transaction hash:', tx.hash);
  
      // Wait for the transaction to be mined
      const receipt = await tx.wait();
      console.log('Transaction mined in block', receipt.blockNumber);
      
      return receipt;
    } catch (error) {
      console.error("Error transferring deed:", error);
      throw error;
    }
  }
  

  async create(deedId, deedURI) {
    console.log('contractInstance', this.contractInstance);
    
    try {
      // Call the contract method directly and pass transaction options
      const tx = await this.contractInstance.registerDeed(deedId, deedURI, {
        gasLimit: this.gas // Ethers.js uses gasLimit instead of gas
        // The 'from' field is not needed as Ethers.js automatically uses the signer's address
      });
      
      // console.log('Transaction hash:', tx.hash);
  
      // Wait for the transaction to be mined
      const receipt = await tx.wait();
      console.log('Transaction mined in block', receipt.blockNumber);
      
      return receipt;
    } catch (error) {
      console.error("Error sending transaction:", error);
      throw error;
    }
  }
}















































































































































































































































































// import Config from '../config'
// // import web3 from '@/web3'

// export class DeedRepository {

//   web3 = null
//   account = ''
//   contractInstance = null
//   gas = 4476768

//   constructor(){
//     this.gas = Config.GAS_AMOUNT
//   }
//   setWeb3(web3) {
//     this.web3 = web3
//     this.contractInstance = new this.web3.eth.Contract(
//       Config.DEEDREPOSITORY_ABI,
//       Config.DEEDREPOSITORY_ADDRESS
//     )
//   }
  
//   getWeb3() {
//     return this.web3
//   }

//   setAccount(account){
//     this.account = account
//   }

//   getCurrentBlock() {
//     return this.web3.eth.getBlockNumber()
//   }

//   getAccounts() {
//     return this.web3.eth.getAccounts()
//   }

//   async watchIfCreated(cb) {
//     try {
//       const currentBlock = await this.getCurrentBlock();
//       this.contractInstance.events.DeedRegistered({
//         fromBlock: currentBlock - 1,
//         toBlock: 'latest'
//       })
//       .on('data', cb)
//       .on('error', console.error);
//     } catch (error) {
//       console.error('Error in watchIfCreated:', error);
//     }
//   }

//   async watchIfDeedTransferred(cb) {
//     const currentBlock = await this.getCurrentBlock()
//     this.contractInstance.events.Transfer({
//       fromBlock: currentBlock - 1,
//       toBlock: 'latest'
//     })
//     .on('data', cb)
//     .on('error', console.error)
//   }

//   exists(deedId) {
//     return this.contractInstance.methods.exists(deedId)
//       .call({ from: this.account, gas: this.gas })
//   }

//   transferTo(to, deedId) {
//     return this.contractInstance.methods.transferFrom(this.account, to, deedId)
//       .send({ from: this.account, gas: this.gas })
//   }

//   create(deedId, deedURI) {
//     console.log('contractInstance', this.contractInstance)
//     return this.contractInstance.methods.registerDeed(deedId, deedURI)
//       .send({ from: this.account, gas: this.gas })
//   }
// }




