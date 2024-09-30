import Config from '../config';
import { ref } from 'vue';
import { web3Provider } from '@/services/web-provider';

const newWeb3Provider = new web3Provider()
const { getWeb3, getAccounts, getCurrentBlock, createContractInstance, toWei } = newWeb3Provider;

export class AuctionRepository {

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
      Config.AUCTIONREPOSITORY_ABI,
      Config.AUCTIONREPOSITORY_ADDRESS
    )
  }

  // Get current block number
  getCurrentBlock = async () => {
    return getCurrentBlock()
  };

  // Event listener for AuctionCreated
  onAuctionCreated = async (cb) => {
    try {
      const currentBlock = await this.getCurrentBlock();
      this.contractInstance.on('AuctionCreated', (event) => cb(event));
    } catch (error) {
      console.error('Error in onAuctionCreated:', error);
    }
  };

  // Event listener for BidSuccess
  onBidSuccess = async (cb) => {
    try {
      const currentBlock = await this.getCurrentBlock();
      this.contractInstance.on('BidSuccess', (event) => cb(event));
    } catch (error) {
      console.error('Error in onBidSuccess:', error);
    }
  };

  // Event listener for AuctionCanceled
  onAuctionCanceled = async (cb) => {
    try {
      const currentBlock = await this.getCurrentBlock();
      this.contractInstance.on('AuctionCanceled', (event) => cb(event));
    } catch (error) {
      console.error('Error in onAuctionCanceled:', error);
    }
  };

  // Event listener for AuctionFinalized
  onAuctionFinalized = async (cb) => {
    try {
      const currentBlock = await this.getCurrentBlock();
      this.contractInstance.on('AuctionFinalized', (event) => cb(event));
    } catch (error) {
      console.error('Error in onAuctionFinalized:', error);
    }
  };

  // Get the current bid for an auction
  getCurrentBid = async (auctionId) => {
    try {
      return await this.contractInstance.getCurrentBid(auctionId);
    } catch (error) {
      console.error('Error getting current bid:', error);
    }
  };

  // Get the bid count for an auction
  getBidCount = async (auctionId) => {
    try {
      return await this.contractInstance.getBidsCount(auctionId);
    } catch (error) {
      console.error('Error getting bid count:', error);
    }
  };

  // Get the total auction count
  getCount = async () => {
    try {
      return await this.contractInstance.getCount();
    } catch (error) {
      console.error('Error getting auction count:', error);
    }
  };

  // Place a bid on an auction
  bid = async (auctionId, price) => {
    try {
      const priceInWei = await toWei(price, 'ether');
      return await this.contractInstance.bidOnAuction(auctionId, {
        value: priceInWei,
        gasLimit: this.gas
      });
    } catch (error) {
      console.error('Error placing bid:', error);
    }
  };

  // Create a new auction
  create = async (deedId, auctionTitle, metadata, startingPrice, endTime) => {
    try {
      const priceInWei = await toWei(startingPrice, 'ether');
      return await this.contractInstance.createAuction(
        Config.DEEDREPOSITORY_ADDRESS,
        deedId,
        auctionTitle,
        metadata,
        priceInWei,
        endTime,
        { gasLimit: this.gas }
      );
    } catch (error) {
      console.error('Error creating auction:', error);
    }
  };

  // Cancel an auction
  cancel = async (auctionId) => {
    try {
      return await this.contractInstance.cancelAuction(auctionId, { gasLimit: this.gas });
    } catch (error) {
      console.error('Error canceling auction:', error);
    }
  };

  // Finalize an auction
  finalize = async (auctionId) => {
    try {
      return await this.contractInstance.finalizeAuction(auctionId, { gasLimit: this.gas });
    } catch (error) {
      console.error('Error finalizing auction:', error);
    }
  };

  // Find auction by ID
  findById = async (auctionId) => {
    try {
      return await this.contractInstance.getAuctionById(auctionId);
    } catch (error) {
      console.error('Error finding auction by ID:', error);
    }
  };
}















































































































































































































































































// import Config from '../config'
// import { ref } from 'vue';

// export class AuctionRepository {

//   web3 = null
//   account = ref('')
//   contractInstance = null
//   gas = 4476768

//   constructor(){
//     this.gas = Config.GAS_AMOUNT
//   }

//   setWeb3(web3) {
//     this.web3 = web3
//     // Use new web3.eth.Contract to create the contract instance
//     this.contractInstance = new this.web3.eth.Contract(
//       Config.AUCTIONREPOSITORY_ABI,
//       Config.AUCTIONREPOSITORY_ADDRESS
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

//   async watchIfCreated(cb) {
//     const currentBlock = await this.getCurrentBlock()
//     this.contractInstance.events.AuctionCreated({
//       fromBlock: currentBlock - 1,
//       toBlock: 'latest'
//     })
//     .on('data', cb)
//     .on('error', console.error)
//   }

//   async watchIfBidSuccess(cb) {
//     const currentBlock = await this.getCurrentBlock()
//     this.contractInstance.events.BidSuccess({
//       fromBlock: currentBlock - 1,
//       toBlock: 'latest'
//     })
//     .on('data', cb)
//     .on('error', console.error)
//   }

//   async watchIfCanceled(cb) {
//     const currentBlock = await this.getCurrentBlock()
//     this.contractInstance.events.AuctionCanceled({
//       fromBlock: currentBlock - 1,
//       toBlock: 'latest'
//     })
//     .on('data', cb)
//     .on('error', console.error)
//   }

//   async watchIfFinalized(cb) {
//     const currentBlock = await this.getCurrentBlock()
//     this.contractInstance.events.AuctionFinalized({
//       fromBlock: currentBlock - 1,
//       toBlock: 'latest'
//     })
//     .on('data', cb)
//     .on('error', console.error)
//   }

//   getCurrentBid(auctionId) {
//     return this.contractInstance.methods.getCurrentBid(auctionId)
//       .call({ from: this.account, gas: this.gas })
//   }

//   getBidCount(auctionId) {
//     return this.contractInstance.methods.getBidsCount(auctionId)
//       .call({ from: this.account, gas: this.gas })
//   }

//   getCount() {
//     // console.log(this.account)
//     // return this.contractInstance.methods.getCount()
//     //   .call({ from: this.account, gas: this.gas })
//     return new Promise(async (resolve, reject) => {
//       try {
//         this.contractInstance.methods.getCount({from: this.account, gas: this.gas }, (err, transaction) => {
//           if(!err) resolve(transaction)
//           reject(err)
//         })
//       } catch(e) {
//         reject(e)
//       }
//     })
//   }

//   bid(auctionId, price) {
//     return this.contractInstance.methods.bidOnAuction(auctionId)
//       .send({ from: this.account, gas: this.gas, value: this.web3.utils.toWei(price, 'ether') })
//   }

//   create(deedId, auctionTitle, metadata, startingPrice, endTime) {
//     return this.contractInstance.methods.createAuction(
//       Config.DEEDREPOSITORY_ADDRESS, 
//       deedId, 
//       auctionTitle, 
//       metadata, 
//       this.web3.utils.toWei(startingPrice, 'ether'), 
//       endTime
//     ).send({ from: this.account, gas: this.gas })
//   }

//   cancel(auctionId) {
//     return this.contractInstance.methods.cancelAuction(auctionId)
//       .send({ from: this.account, gas: this.gas })
//   }

//   finalize(auctionId) {
//     return this.contractInstance.methods.finalizeAuction(auctionId)
//       .send({ from: this.account, gas: this.gas })
//   }

//   findById(auctionId) {
//     return this.contractInstance.methods.getAuctionById(auctionId)
//       .call({ from: this.account, gas: this.gas })
//   }
// }