import { createApp } from 'vue'
import App from './App.vue'
import Config from './config'
import web3 from './web3'

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


// Set up web3 and configurations for chatroom
// chatRoomInstance.setWeb3(new Web3(Config.SHH_ENDPOINT))

// one instance of web3 available to all components
if (typeof web3 !== 'undefined') {
  auctionRepositoryInstance.setWeb3(web3);
  deedRepositoryInstance.setWeb3(web3);

  auctionRepositoryInstance.setAccount(store.metamask.web3DefaultAccount);
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

