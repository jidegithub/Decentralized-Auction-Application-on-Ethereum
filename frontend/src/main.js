import { createApp } from 'vue'
import App from './App.vue'
import Config from './config'

//import store
import store from '@/store'
// Import Vuetify and Router
import vuetify from './plugins/vuetify' // Path to your Vuetify setup
// Import Vuetify CSS (if needed for Vuetify)
import 'vuetify/dist/vuetify.min.css'

import router from './router' // Path to your Router setup


// Import models
// import { ChatRoom } from '../src/models/ChatRoom'
import { DeedRepository } from '../src/models/DeedRepository'
import { AuctionRepository } from '../src/models/AuctionRepository'

import { web3Provider, web3Library } from '@/services/web-provider';


const app = createApp(App)


// Create instances of repositories
const deedRepositoryInstance = new DeedRepository();
const auctionRepositoryInstance = new AuctionRepository();
// const chatRoomInstance = new chatRoom();
const web3ProviderInstance = new web3Provider();
const web3LibraryInstance = new web3Library();


// Set up web3 and configurations for chatroom
// chatRoomInstance.setWeb3(new Web3(Config.SHH_ENDPOINT))

// one instance of web3 available to all components
if (typeof web3 !== 'undefined') {
  auctionRepositoryInstance.initializeWeb3();;
  deedRepositoryInstance.initializeWeb3();
}

// Initialize the desired library here
const useEthers = true;
if (useEthers) {
  web3ProviderInstance.initializeEthers();
} else {
  web3LibraryInstance.initializeWeb3();
}

// Make instances globally available via config.globalProperties
app.config.globalProperties.$auctionRepositoryInstance = auctionRepositoryInstance;
app.config.globalProperties.$deedRepositoryInstance = deedRepositoryInstance;
app.config.globalProperties.$web3ProviderInstance = web3ProviderInstance;
app.config.globalProperties.$web3LibraryInstance = web3LibraryInstance;
app.config.globalProperties.$config = Config;


// Use Vuetify and Vue Router in the app
app.use(vuetify)
app.use(router)

// Provide the global state
app.provide('store', store)

app.mount('#app');

