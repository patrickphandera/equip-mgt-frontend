<template>
    
        <v-btn variant="flat" icon="mdi-playlist-minus" @click="dialogVisible=!dialogVisible"> </v-btn>
    <v-dialog v-model="dialogVisible" max-width="400">
      <v-card>
        <v-card-title class="headline">Received ID</v-card-title>
  
        <v-card-text>
          <p>The ID received from the parent is: {{ id }}</p>
        </v-card-text>
  
        <v-card-actions>
          <v-spacer />
          <v-btn @click="dialogVisible = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
   
  </template>
  
  <script setup>
  import { defineProps, ref } from "vue";
  
  // Define the prop to receive the ID from the parent
  const props = defineProps({
    id: {
      type: String,
      required: true
    }
  });
  
  const dialogVisible = ref(false);
  </script>
  