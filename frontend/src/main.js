import { createApp } from 'vue'
import App from './App.vue'
import Config from './config'

// rename to avoid conflict between metamask
// will be used for whisper v5/6
import { Web3 as Web3_1 } from 'web3'

// Import models
// import { ChatRoom } from './models/ChatRoom'
// import { DeedRepository } from './models/DeedRepository'
// import { AuctionRepository } from './models/AuctionRepository'

// Import Vuetify and Router
import vuetify from './plugins/vuetify' // Path to your Vuetify setup
import router from './router' // Path to your Router setup

// state management
const store = {
  debug: true,
  state: {
    // metamask state variable
    metamask: {
      web3DefaultAccount: '',
      metamaskInstalled: false,
      networkId: '',
    },

    // local web3 instance(not metamask)
    web3 : null,
  },
  networkReady() {
    return this.getNetworkId() !== '' && this.getMetamaskInstalled() && this.getWeb3DefaultAccount() !== ''
  },
  setNetworkId(networkId) {
    this.state.metamask.networkId = networkId
  },
  getNetworkId() {
    return this.state.metamask.networkId
  },

  setWeb3DefaultAccount(account) {
    this.state.metamask.web3DefaultAccount = account
  },
  getWeb3DefaultAccount() {
    return this.state.metamask.web3DefaultAccount
  },

  setMetamaskInstalled(){
    this.state.metamask.metamaskInstalled = true
  },
  getMetamaskInstalled(){
    return this.state.metamask.metamaskInstalled
  },

  getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }
}

const app = createApp(App)

// Global mixin equivalent using provide/inject or directly in setup
app.mixin({
  setup() {
    // Create instances of the repositories and models
    const chatroomInstance = new ChatRoom()
    const deedRepositoryInstance = new DeedRepository()
    const auctionRepositoryInstance = new AuctionRepository()

    // Set up web3 and configurations
    chatroomInstance.setWeb3(new Web3_1(Config.SHH_ENDPOINT))

    if (typeof web3 !== 'undefined') {
      web3 = new Web3(web3.currentProvider)
      auctionRepositoryInstance.setWeb3(web3)
      deedRepositoryInstance.setWeb3(web3)

      store.setMetamaskInstalled()
      web3.version.getNetwork((err, netId) => {
        store.setNetworkId(netId)
      })

      // Pull accounts every 2 seconds
      setInterval(() => {
        web3.eth.getAccounts((err, data) => {
          if(data.length > 0) store.setWeb3DefaultAccount(data[0])
        })
      }, 2000)
    }

    return {
      chatroomInstance,
      deedRepositoryInstance,
      auctionRepositoryInstance,
      config: Config
    }
  }
})

// Use Vuetify and Vue Router in the app
app.use(vuetify)
app.use(router)

// Provide the global state
app.provide('store', store)

app.mount('#app');
