# Auction DApp Integration steps

## Create and Initialize a vuejs project directory(i used vite for bundling)
## Create vue components and routes
## added metamask composable
## added configuration for ganache ui
## setup ipfs for decentralize storage
## added models that references contract command(everything to a T)
## added bash and python script that compiles and migrate contracts and run vue in development mode
## steps to take before deploying script
  ### start ipfs daemon
  ### start ganache ui
  ### attempted to use docker for swarm(fullnode, light node and ultralight node) gas payment for light and full
  ### ipfs has 2 file system mutable file system(mfs) and ipfs content addressed storage(ipfs itself)
  ### mfs shows up on the ipfs webui
  ### you can add files to mfs by importing the file/directory from local or by importing the ipfs cid of the item

  ### string is best for storing human-readable data like alphanumeric strings. It's more intuitive but slightly more expensive in terms of gas.

  ### approve and approve for all
  

  ipfs files ls -list mfs files
  ipfs pin ls - list ipfs files

## added upload component for upload to ipfs(ran into cors issue here)
## connect your frontend dApp to your local blockchain using MetaMask and Ganache

