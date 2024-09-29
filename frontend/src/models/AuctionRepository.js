import Config from '../config';
import { ref } from 'vue';
import { web3Provider } from '@/services/web-provider';

const newWeb3Provider = new web3Provider()
const { getWeb3, getAccounts, getCurrentBlock, createContractInstance } = newWeb3Provider;

export class AuctionRepository {

  web3 = null
  account = ref('')
  contractInstance = null
  gas = 4476768

  constructor() {
    this.gas = Config.GAS_AMOUNT
  }

  initializeWeb3 = async() => {
    this.web3 = await getWeb3().then(async(result) => {
      this.account.value = (await getAccounts())[0]
    }).catch((error) => {
      console.error('Error initializing web3 or getting accounts:', error);
    });
    
    this.contractInstance = await createContractInstance(
      Config.AUCTIONREPOSITORY_ABI,
      Config.AUCTIONREPOSITORY_ADDRESS
    )
  }

  async getCurrentBlock() {
    return await getCurrentBlock()
  }

  async watchIfCreated(cb) {
    try {
      const currentBlock = await this.getCurrentBlock()
      this.contractInstance.on("AuctionCreated", { fromBlock: currentBlock - 1, toBlock: 'latest' })
        .on('data', cb)
        .on('error', console.error)
    } catch (error) {
      console.error('Error in watchIfCreated:', error)
    }
  }

  async watchIfBidSuccess(cb) {
    try {
      const currentBlock = await this.getCurrentBlock()
      this.contractInstance.on("BidSuccess", { fromBlock: currentBlock - 1, toBlock: 'latest' })
        .on('data', cb)
        .on('error', console.error)
    } catch (error) {
      console.error('Error in watchIfBidSuccess:', error)
    }
  }

  async watchIfCanceled(cb) {
    try {
      const currentBlock = await this.getCurrentBlock()
      this.contractInstance.on("AuctionCanceled", { fromBlock: currentBlock - 1, toBlock: 'latest' })
        .on('data', cb)
        .on('error', console.error)
    } catch (error) {
      console.error('Error in watchIfCanceled:', error)
    }
  }

  async watchIfFinalized(cb) {
    try {
      const currentBlock = await this.getCurrentBlock()
      this.contractInstance.on("AuctionFinalized", { fromBlock: currentBlock - 1, toBlock: 'latest' })
        .on('data', cb)
        .on('error', console.error)
    } catch (error) {
      console.error('Error in watchIfFinalized:', error)
    }
  }

  async getCurrentBid(auctionId) {
    return await this.contractInstance.methods.getCurrentBid(auctionId)
      .call({ from: this.account.value, gas: this.gas })
  }

  async getBidCount(auctionId) {
    return await this.contractInstance.methods.getBidsCount(auctionId)
      .call({ from: this.account.value, gas: this.gas })
  }

  async getCount() {
    return new Promise(async (resolve, reject) => {
      try {
        this.contractInstance.methods.getCount({ from: this.account.value, gas: this.gas }, (err, transaction) => {
          if (!err) resolve(transaction)
          else reject(err)
        })
      } catch (e) {
        reject(e)
      }
    })
  }

  async bid(auctionId, price) {
    const priceInWei = await toWei(price, 'ether')
    return await this.contractInstance.methods.bidOnAuction(auctionId)
      .send({ from: this.account.value, gas: this.gas, value: priceInWei })
  }

  async create(deedId, auctionTitle, metadata, startingPrice, endTime) {
    const priceInWei = await toWei(startingPrice, 'ether')
    return await this.contractInstance.methods.createAuction(
      Config.DEEDREPOSITORY_ADDRESS,
      deedId,
      auctionTitle,
      metadata,
      priceInWei,
      endTime
    ).send({ from: this.account.value, gas: this.gas })
  }

  async cancel(auctionId) {
    return await this.contractInstance.methods.cancelAuction(auctionId)
      .send({ from: this.account.value, gas: this.gas })
  }

  async finalize(auctionId) {
    return await this.contractInstance.methods.finalizeAuction(auctionId)
      .send({ from: this.account.value, gas: this.gas })
  }

  async findById(auctionId) {
    return await this.contractInstance.methods.getAuctionById(auctionId)
      .call({ from: this.account.value, gas: this.gas })
  }
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