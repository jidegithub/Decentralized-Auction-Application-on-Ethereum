import { createApp } from 'vue'
import App from './App.vue'
import Config from './config'

// will be used for whisper v5/6
import Web3 from 'web3'

// Import models
// import { ChatRoom } from '../src/models/ChatRoom'
import { DeedRepository } from '../src/models/DeedRepository'
import { AuctionRepository } from '../src/models/AuctionRepository'

// Import Vuetify and Router
import vuetify from './plugins/vuetify' // Path to your Vuetify setup
import router from './router' // Path to your Router setup

// Import Vuetify CSS (if needed for Vuetify)
import 'vuetify/dist/vuetify.min.css'

//import store
import store from '@/store'

const app = createApp(App)

// Create instances of repositories
const deedRepositoryInstance = new DeedRepository();
const auctionRepositoryInstance = new AuctionRepository();
// const chatRoomInstance = new chatRoom();

// Set up web3 and configurations
const web3 = new Web3(Config.SHH_ENDPOINT);

// Set up web3 and configurations for chatroom
// chatRoomInstance.setWeb3(new Web3(Config.SHH_ENDPOINT))

// Set Web3 for repositories if MetaMask is available
if (typeof web3 !== 'undefined') {
  const metamaskWeb3 = new Web3(web3.currentProvider);
  auctionRepositoryInstance.setWeb3(metamaskWeb3);
  deedRepositoryInstance.setWeb3(metamaskWeb3);

  // Update store state for MetaMask installation and network
  store.setMetamaskInstalled();
  metamaskWeb3.eth.net.getId().then((netId) => {
    store.setNetworkId(netId);
  });

  // Pull accounts every 2 seconds
  setInterval(() => {
    metamaskWeb3.eth.getAccounts((err, data) => {
      if (data.length > 0) store.setWeb3DefaultAccount(data[0]);
    });
  }, 2000);
}

// Make instances globally available via config.globalProperties
app.config.globalProperties.$auctionRepositoryInstance = auctionRepositoryInstance;
app.config.globalProperties.$deedRepositoryInstance = deedRepositoryInstance;
app.config.globalProperties.$web3 = web3;
app.config.globalProperties.$config = Config;

// Use Vuetify and Vue Router in the app
app.use(vuetify)
app.use(router)

// Provide the global state
app.provide('store', store)

app.mount('#app');

