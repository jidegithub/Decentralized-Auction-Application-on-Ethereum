import { create } from 'ipfs-http-client';
import config from '../config';

const ipfs = create(config.IPFS_ENDPOINT)

// Upload a file to IPFS
async function uploadFileToIpfs(fileBuffer) {
  try {
    // Add file to IPFS
    const { cid } = await ipfs.add(fileBuffer, { wrapWithDirectory: true });
    console.log('File uploaded to IPFS with CID:', cid.toString());
    return cid.toString();  // Return the content identifier (CID)
  } catch (error) {
    console.error('Error uploading file to IPFS:', error);
    throw error;
  }

  // result = items returned path key, size key and cid object key
}

// Retrieve a file from IPFS using its CID
async function fetchFileFromIpfs(cid) {
  for await (const file of ipfs.cat(cid)) {
    return file.toString();
  }
}

// // Retrieve all files from IPFS using rootCid
// async function fetchAllFilesFromIpfs(rootCid) {
//   try {
//     // Resolve the CID and list all files
//     const files = [];
//     for await (const file of ipfs.ls(rootCid)) {
//       if (file.type === 'file') {
//         const content = [];
//         for await (const chunk of ipfs.cat(file.cid)) {
//           content.push(chunk);
//         }
//         files.push({
//           path: file.path,
//           content: new TextDecoder().decode(Buffer.concat(content)),
//         });
//       }
//     }
//     return files;
//   } catch (error) {
//     console.error('Error fetching files from IPFS:', error);
//     throw error;
//   }
// }


// Retrieve all files from IPFS using rootCid
async function fetchAllFilesFromIpfs(rootCid) {
  try {
    // Resolve the CID and list all files
    const files = [];
    for await (const file of ipfs.ls(rootCid)) {
      if (file.type === 'file') {
        const contentChunks = [];
        let totalLength = 0;

        // Collect all chunks
        for await (const chunk of ipfs.cat(file.cid)) {
          contentChunks.push(chunk);
          totalLength += chunk.length;
        }

        // Concatenate all chunks into a single Uint8Array
        const content = new Uint8Array(totalLength);
        let offset = 0;
        for (const chunk of contentChunks) {
          content.set(chunk, offset);
          offset += chunk.length;
        }

        // Decode the content into a string
        files.push({
          path: file.path,
          content: new TextDecoder().decode(content),
        });
      }
    }
    return files;
  } catch (error) {
    console.error('Error fetching files from IPFS:', error);
    throw error;
  }
}

// Upload a file to IPFSMFS
async function uploadFileToIpfsMFS(fileBuffer, fileName) {
  try {
    const result = await ipfs.files.write(`/${fileName}`, fileBuffer, {create: true});
    console.log(result)
    return result; // Returns the IPFS hash and other details
  } catch (error) {
    console.error('Error uploading file to IPFS:', error);
    throw error;
  }
}

async function checkIfDirectoryExist(directoryName){
  // If you want to create a new directory nested under others that don't yet exist, you need to explicitly set the value of parents to true, like so:
  // await ipfs.files.mkdir('/example')
  // await ipfs.files.mkdir('/my/directory/example', { parents: true })
  try {
    const {cid,type} = await ipfs.files.stat(`/${directoryName}`)
    if (cid && typeof cid === "string" && type === "directory") {
      return true;
    }
  } catch (error) {
    console.error("Error directory doesn't exist:", error);
    throw error;
  }
}


// Retrieve all files from IPFSMFS
async function fetchAllFilesFromIpfsMFS() {
  try {
    // Resolve the CID and list all files
    const files = [];
    for await (const file of ipfs.files.ls('/')) {
      if (file.type === 'file') {
        const contentChunks = [];
        let totalLength = 0;

        // Collect all chunks
        for await (const chunk of ipfs.cat(file.cid)) {
          contentChunks.push(chunk);
          totalLength += chunk.length;
        }

        // Concatenate all chunks into a single Uint8Array
        const content = new Uint8Array(totalLength);
        let offset = 0;
        for (const chunk of contentChunks) {
          content.set(chunk, offset);
          offset += chunk.length;
        }

        // console.log(file)

        // Decode the content into a string
        files.push({
          name: file.name,
          cid: file.cid.toString(),
          content: new TextDecoder().decode(content),
        });
      }
    }
    return files;
  } catch (error) {
    console.error('Error fetching files from IPFS:', error);
    throw error;
  }
}

export {uploadFileToIpfs, fetchAllFilesFromIpfsMFS, fetchFileFromIpfs, uploadFileToIpfsMFS};
