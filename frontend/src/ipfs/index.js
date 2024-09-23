import { create } from 'ipfs-http-client';
import config from '../config';

// const ipfs = create(config.IPFS_ENDPOINT);
const ipfs = create(config.IPFS_ENDPOINT)

// Upload a file to IPFS
async function uploadFileToIpfs(fileBuffer) {
  try {
    // Add file to IPFS
    const result = await ipfs.add(fileBuffer);
    return result; // Returns the IPFS hash and other details
  } catch (error) {
    console.error('Error uploading file to IPFS:', error);
    throw error;
  }

  // const { cid } = await ipfs.add(fileBuffer);
  // console.log('File uploaded to IPFS with CID:', cid.toString());
  // return cid.toString();  // Return the content identifier (CID)
}

// Retrieve a file from IPFS using its CID
async function fetchFileFromIpfs(cid) {
  for await (const file of ipfs.cat(cid)) {
    console.log('File content:', file.toString());
    return file.toString();
  }
}

export {uploadFileToIpfs, fetchFileFromIpfs};
