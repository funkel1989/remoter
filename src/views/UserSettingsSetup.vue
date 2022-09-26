<script setup lang="ts">
import type { IUserSettings } from '../../interfaces/UserSettings.interface';
import type { ISetStoreData } from '../../interfaces/SetStoreData.interface';
// import type { IFileData } from '../../interfaces/FilePathData.interface.ts';
import { reactive, ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { ipcRenderer } from 'electron-better-ipc';

// const path = ref(await ipcRenderer.callMain('get-appPath'));

// const files = computed(async () => {
//   const fileNames: string[] = await ipcRenderer.callMain(
//     'get-filesForPath',
//     path.value
//   );
//   return await Promise.all(
//     fileNames
//       .map(async (file: string) => {
//         return await ipcRenderer.callMain('get-filesStats', { path, file });
//       })
//       .sort((a: IFileData, b: IFileData) => {
//         if (a.directory === b.directory) {
//           return a.name.localeCompare(b.name);
//         }

//         return a.directory ? -1 : 1;
//       })
//   );
// });

// const open = async (folder: string) => {
//   path.value = await ipcRenderer.callMain('open-folder', {
//     folder,
//     path: path.value,
//   });
// };

// const back = async () => {
//   path.value = await ipcRenderer.callMain('back-folder', path.value);
// };

const router = useRouter();

// const searchString = ref('');
// const filteredFiles = computed(async () => {
//   return searchString.value
//     ? (await files.value).filter((s: IFileData) =>
//         s.name.startsWith(searchString.value)
//       )
//     : files.value;
// });

const form: IUserSettings = reactive({
  userName: '',
  password: '',
  dataDirectory: '',
});

async function submitUserData() {
  const userData: ISetStoreData<IUserSettings> = {
    configName: 'userSettings',
    data: form,
  };

  await ipcRenderer.callMain('set-userData', JSON.stringify(userData));
  console.log('clicked');
  router.push({ path: '/' });
}
</script>

<template>
  <h1>Application Setup</h1>

  <v-text-field
    label="Admin Username"
    required
    name="adminUsername"
    v-model="form.userName"
  ></v-text-field>

  <v-text-field
    label="Admin Password"
    required
    name="adminpassword"
    v-model="form.password"
  ></v-text-field>

  <v-btn block @click="submitUserData()">Submit</v-btn>
</template>
