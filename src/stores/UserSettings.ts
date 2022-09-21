import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { ipcRenderer } from "electron";

import { IUserSettings } from "../../interfaces";

export const useUserSettingsStore = defineStore("userSettings", () => {
  const settings = ref<IUserSettings>();

  // const getSettings = computed(async () => {
  //   if (!settings.value) {
  //     const userSettings: string = await ipcRenderer.invoke("set-data", "userSettings");

  //     if (userSettings) {
  //       settings.value = JSON.parse(userSettings);
  //     }
  //   }

  //   return settings.value;
  // });

  const setSettings = (incomingSettings: IUserSettings) => {
    settings.value = incomingSettings;

    ipcRenderer.send(
      "set-data",
      "userSettings",
      JSON.stringify(incomingSettings)
    );
  };

  return { settings, setSettings };
});
