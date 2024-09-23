import DeedRepository from './contracts/DeedRepository.json'
import AuctionRepository from './contracts/AuctionRepository.json'


const config = {
    JSONRPC_ENDPOINT: 'http://127.0.0.1:8545',
    JSONRPC_WS_ENDPOINT: 'ws://127.0.0.1:8545',
    IPFS_ENDPOINT: 'http://localhost:5001',
    // SHH_ENDPOINT: 'ws://52.59.238.144:8546',

    DEEDREPOSITORY_ADDRESS: DeedRepository.networks['5777'].address,  // 5777 is Ganache default network ID,
    AUCTIONREPOSITORY_ADDRESS: AuctionRepository.networks['5777'].address,

    DEEDREPOSITORY_ABI: DeedRepository.abi,
    AUCTIONREPOSITORY_ABI: AuctionRepository.abi,

    GAS_AMOUNT: 500000,

    //whisper settings
    WHISPER_SHARED_KEY: '0x8bda3abeb454847b515fa9b404cede50b1cc63cfdeddd4999d074284b4c21e15'
};

export default config;