<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" sm="8" md="6">
        <Upload />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Upload from '@/components/Upload.vue';

export default {
  components: {
    Upload,
  },
};
</script>
