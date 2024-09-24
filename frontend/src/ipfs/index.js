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

// Retrieve all files from IPFS using rootCid
const id = '12D3KooWKqbQxmxU6TbAgbyeEvnCzPeujXZWGSk1mm9WQSGFxnpx'
async function fetchAllFilesFromIpfs(rootCid) {
  try {
    // Resolve the CID and list all files
    const files = [];
    for await (const file of ipfs.ls(rootCid)) {
      if (file.type === 'file') {
        const content = [];
        for await (const chunk of ipfs.cat(file.cid)) {
          content.push(chunk);
        }
        files.push({
          path: file.path,
          content: new TextDecoder().decode(Buffer.concat(content)),
        });
      }
    }
    return files;
  } catch (error) {
    console.error('Error fetching files from IPFS:', error);
    throw error;
  }
}

export {uploadFileToIpfs, fetchFileFromIpfs, fetchAllFilesFromIpfs};
