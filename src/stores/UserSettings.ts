import { defineStore } from "pinia";
import { ref } from "vue";

import { IUserSettings } from "../../interfaces";

export const useUserSettingsStore = defineStore("userSettings", () => {
  const settings = ref<IUserSettings>();

  const setSettings = (incomingSettings: IUserSettings) => {
    settings.value = incomingSettings;
  };

  return { settings, setSettings };
});
