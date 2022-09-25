<script setup lang="ts">
import { reactive } from "vue";
import { IUserSettings, ISetStoreData } from '../../interfaces';

const form = reactive({
    userName: "",
    password: "",
    dataDirectory: ""
});

const submitUserData = () => {
  const userData: ISetStoreData<IUserSettings> = {
    configName: ''
    userName : form.adminUsername
  };

  // save password to keystore
  // submit data to store
  // route to homepage
  console.log("clicked");
  console.log(userData);
  this.$router.push('/');
}
</script>

<template>
  <h1>Application Setup</h1>

  <v-text-field label="Admin Username" required name="adminUsername" v-model="form.userName"></v-text-field>

  <v-button @click="submitUserData()">Submit</v-button>
</template>
