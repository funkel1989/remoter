import { defineStore } from 'pinia';
import { ref } from 'vue';
import { ipcRenderer } from 'electron-better-ipc';
import type { IUserSettings } from '../../interfaces/UserSettings.interface';

export const useUserSettingsStore = defineStore('userSettings', () => {
  const settings = ref<IUserSettings>();

  const setSettings = async (incomingSettings: IUserSettings) => {
    settings.value = incomingSettings;

    await ipcRenderer.callMain('set-userData', incomingSettings);
  };

  return { settings, setSettings };
});
