// composables/useMetamask.js
import { ref, onMounted } from 'vue';
import web3 from '@/web3'
import store from '@/store'
import Web3 from 'web3';

export function useMetamask() {
  const metaMaskInstalled = ref(false);
  const web3DefaultAccount = ref('');
  const networkId = ref('');

  const detectMetamask = () => {
    if (typeof window.ethereum !== 'undefined') {
      metaMaskInstalled.value = true;
      store.setMetamaskInstalled()
      //popup will appear to select account to use
      window.ethereum.request({ method: 'eth_requestAccounts' })
        .then(accounts => {
          if (accounts.length > 0) {
            const account = accounts[0];
            // console.log("Connected MetaMask Account:", account);
            web3DefaultAccount.value = account;
            store.setWeb3DefaultAccount(account);
          }
        })
        .catch((error) => {
          console.error("Error connecting to MetaMask account", error);
        });

      window.ethereum.request({ method: 'net_version' })
        .then(id => {
          networkId.value = id;
          store.setNetworkId(id)
        })
        .catch((error) => {
          console.error("couldn't get network id", error);
        });
    } else {
      metaMaskInstalled.value = false;
      let web3Instance;
      // Fallback to local Ganache
      try {
        const provider = new Web3.providers.HttpProvider("http://127.0.0.1:7545");
        web3Instance = new Web3(provider);
        console.log("Connected to local Ganache");
      } catch (error) {
        console.error("Failed to connect to Ganache:", error);
      }
      
      // Fetch Ganache accounts
      web3.eth.getAccounts()
        .then(accounts => {
          if (accounts.length > 0) {
            const account = accounts[0];
            console.log("Ganache Account:", accounts[0]);
            web3DefaultAccount.value = account;
            store.setWeb3DefaultAccount(account)
          } else {
            console.log("No accounts found on Ganache");
          }
        })
        .catch(error => {
          console.error("Error fetching Ganache accounts:", error);
        });
    }
  };
  
  onMounted(() => {
    detectMetamask();
    // Optionally, listen for account or network changes
    window.ethereum?.on('accountsChanged', (accounts) => {
      if (accounts.length > 0) {
        metaMaskInstalled.value = true;
        store.setMetamaskInstalled()
        const account = accounts[0];
        web3DefaultAccount.value = account;
        store.setWeb3DefaultAccount(account)
      }
    });
    window.ethereum?.on('chainChanged', (netId) => {
      networkId.value = netId;
      store.setNetworkId(id)
    });
  });

  return {
    metaMaskInstalled,
    web3DefaultAccount,
    networkId,
  };
}
