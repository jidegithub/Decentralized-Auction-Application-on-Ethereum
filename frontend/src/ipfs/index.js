import { create } from 'ipfs-http-client';
import uniqid from 'uniqid';
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

// Function to convert file to ArrayBuffer using FileReader
function fileToArrayBuffer(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsArrayBuffer(file); // Read file as ArrayBuffer for binary files
  });
}

// Function to handle non-file data (like strings) by converting it to Uint8Array
function stringToUint8Array(str) {
  const encoder = new TextEncoder();
  return encoder.encode(str);
}

// Upload multiple files to IPFS
async function uploadToIPFSInDirectory(formData, directoryName = null) {
  try {
    // Use provided directory name, or generate a random one
    const dirName = directoryName || uniqid("");
    
    const files = [];
    
    // Iterate over formData entries
    for (const [name, value] of formData.entries()) {
      try {
        let content;
        if (value instanceof Blob) {
          // If the value is a file (Blob), read it as ArrayBuffer
          const arrayBuffer = await fileToArrayBuffer(value);
          content = new Uint8Array(arrayBuffer); // Convert ArrayBuffer to Uint8Array
        } else {
          // If it's not a file (e.g., a string), encode it
          content = stringToUint8Array(value.toString()); // Convert string to Uint8Array
        }

        files.push({
          path: `${dirName}/${name}`, // Store file or data under directory
          content: content // Use Uint8Array as file or data content
        });
      } catch (fileError) {
        console.error(`Error reading file or value "${name}":`, fileError);
        throw new Error(`Failed to process the file or value "${name}".`);
      }
    }

    // Check if there are files to upload
    if (files.length === 0) {
      throw new Error('No files or data to upload.');
    }

    // Upload files to IPFS
    const results = [];
    try {
      for await (const result of ipfs.addAll(files, { wrapWithDirectory: true })) {
        results.push(result);
      }
    } catch (ipfsError) {
      console.error('Error uploading to IPFS:', ipfsError);
      throw new Error('Failed to upload files or data to IPFS.');
    }

    const directoryCID = results[results.length - 1].cid.toString();

    return {
      directoryCID,
      directoryName: dirName,
      results
    };

  } catch (error) {
    // Handle and log general errors
    console.error('Error in uploadToIPFSInDirectory:', error.message);
    throw new Error(`Upload failed: ${error.message}`);
  }
}

// Retrieve a file from IPFS using its CID
async function fetchFileFromIpfs(cid) {
  for await (const file of ipfs.cat(cid)) {
    return file.toString();
  }
}

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

async function checkIfMFSDirectoryExist(directoryName){
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

export {uploadFileToIpfs, fetchAllFilesFromIpfsMFS, fetchFileFromIpfs, uploadFileToIpfsMFS, uploadToIPFSInDirectory};








































































































































































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



// async function uploadToIPFSInDirectory(formData, directoryName = null) {
//   try {
//     // Use provided directory name, or generate a random one
//     const dirName = directoryName || uniqid("data-");
    
//     const files = [];
    
//     // Iterate over formData entries
//     for (const [name, file] of formData.entries()) {
//       try {
//         const buffer = await file.arrayBuffer(); // Attempt to read file as ArrayBuffer
//         files.push({
//           path: `${dirName}/${name}`, // Store file under directory
//           content: Buffer.from(buffer) // Convert ArrayBuffer to Buffer
//         });
//       } catch (fileError) {
//         console.error(`Error reading file "${name}":`, fileError);
//         throw new Error(`Failed to read the file "${name}".`);
//       }
//     }

//     // Check if there are files to upload
//     if (files.length === 0) {
//       throw new Error('No files to upload.');
//     }

//     // Upload files to IPFS
//     const results = [];
//     try {
//       for await (const result of ipfs.addAll(files, { wrapWithDirectory: true })) {
//         results.push(result);
//       }
//     } catch (ipfsError) {
//       console.error('Error uploading to IPFS:', ipfsError);
//       throw new Error('Failed to upload files to IPFS.');
//     }

//     return {
//       directoryName: dirName,
//       results
//     };

//   } catch (error) {
//     // Handle and log general errors
//     console.error('Error in uploadToIPFSInDirectory:', error.message);
//     throw new Error(`Upload failed: ${error.message}`);
//   }
// }
