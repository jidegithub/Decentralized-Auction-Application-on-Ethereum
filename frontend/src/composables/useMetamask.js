// composables/useMetamask.js
import { ref, onMounted } from 'vue';

export function useMetamask() {
  const metamaskInstalled = ref(false);
  const web3DefaultAccount = ref('');
  const networkId = ref('');

  const detectMetamask = () => {
    if (typeof window.ethereum !== 'undefined') {
      metamaskInstalled.value = true;
      window.ethereum.request({ method: 'eth_accounts' })
        .then(accounts => {
          if (accounts.length > 0) {
            web3DefaultAccount.value = accounts[0];
          }
        });

      window.ethereum.request({ method: 'net_version' })
        .then(id => {
          networkId.value = id;
        });
    } else {
      metamaskInstalled.value = false;
    }
  };

  onMounted(() => {
    detectMetamask();
    // Optionally, listen for account or network changes
    window.ethereum?.on('accountsChanged', (accounts) => {
      if (accounts.length > 0) {
        web3DefaultAccount.value = accounts[0];
      }
    });
    window.ethereum?.on('chainChanged', (netId) => {
      networkId.value = netId;
    });
  });

  return {
    metamaskInstalled,
    web3DefaultAccount,
    networkId,
  };
}
