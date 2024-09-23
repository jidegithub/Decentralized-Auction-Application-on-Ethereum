import DeedRepository from './contracts/DeedRepository.json'
import AuctionRepository from './contracts/AuctionRepository.json'


const config = {
    JSONRPC_ENDPOINT: 'http://52.59.238.144:8545',
    JSONRPC_WS_ENDPOINT: 'ws://52.59.238.144:8546', //'ws://52.59.238.144:8546',
    BZZ_ENDPOINT: 'http://52.59.238.144:8500',
    SHH_ENDPOINT: 'ws://52.59.238.144:8546',

    DEEDREPOSITORY_ADDRESS: '0xfc35c45cd57661197d0bb19399c9d3ede1c50dcc',
    AUCTIONREPOSITORY_ADDRESS: '0xefbebbf64a570f7b94f168430f45ecbb87546f06',

    DEEDREPOSITORY_ABI: DeedRepository.abi,
    AUCTIONREPOSITORY_ABI: AuctionRepository.abi,

    GAS_AMOUNT: 500000,

    //whisper settings
    WHISPER_SHARED_KEY: '0x8bda3abeb454847b515fa9b404cede50b1cc63cfdeddd4999d074284b4c21e15'
};

export default config;