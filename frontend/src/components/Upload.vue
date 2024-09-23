<template>
  <v-container>
    <v-file-input
      label="Select a file"
      v-model="selectedFile"
      accept="image/*,application/pdf"
      prepend-icon="mdi-paperclip"
      @change="onFileSelected"
    ></v-file-input>

    <v-btn
      color="primary"
      :disabled="!selectedFile"
      @click="uploadFile"
    >
      Upload to IPFS
    </v-btn>

    <v-progress-linear
      v-if="isUploading"
      :value="uploadProgress"
      height="10"
      color="blue"
      indeterminate
    ></v-progress-linear>

    <v-alert
      v-if="uploadMessage"
      type="success"
      dismissible
    >
      {{ uploadMessage }}
    </v-alert>

    <v-alert
      v-if="ipfsHash"
      type="info"
      dismissible
    >
      File successfully uploaded to IPFS. Hash: {{ ipfsHash }}
    </v-alert>
  </v-container>
</template>

<script>
import { uploadFileToIpfs } from '@/ipfs';

export default {
  data() {
    return {
      selectedFile: null,
      uploadProgress: 0,
      isUploading: false,
      uploadMessage: '',
      ipfsHash: '',
    };
  },
  methods: {
    onFileSelected(event) {
      // Vuetify returns the selected file or list of files as an array
      //but we are only uploading one file for now
      this.selectedFile = event.target.files[0];

      this.uploadMessage = ''; // Clear previous message
      this.ipfsHash = ''; // Clear the IPFS hash from the previous upload
    },
    async uploadFile() {
      if (!this.selectedFile) return;

      this.isUploading = true;
      this.uploadProgress = 0;

      try {
        // Upload the file to IPFS
        const fileBuffer = await this.fileToBuffer(this.selectedFile);
        const ipfsResponse = await uploadFileToIpfs(fileBuffer);

        this.isUploading = false;
        this.uploadMessage = 'File uploaded successfully to IPFS!';
        this.ipfsHash = ipfsResponse.path; // Get the IPFS hash
      } catch (error) {
        this.isUploading = false;
        console.error('File upload failed:', error);
        this.uploadMessage = 'File upload failed.';
      }
    },
    fileToBuffer(file) {
      // Convert file to buffer for IPFS upload
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const fileBuffer = reader.result;
          resolve(fileBuffer);
        };
        reader.onerror = reject;
        reader.readAsArrayBuffer(file);
      });
    }

  },
};
</script>

<style scoped>
.v-progress-linear {
  margin-top: 20px;
}
</style>
