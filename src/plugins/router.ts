import { IUserSettings } from '../../interfaces';
import { createRouter, createWebHashHistory } from "vue-router";
import { useUserSettingsStore } from "../stores/UserSettings";
import { ipcRenderer } from 'electron-better-ipc';

import Home from "../views/Home.vue";
import UserSettingsSetup from "../views/UserSettingsSetup.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/setup",
    name: "UserSettingsSetup",
    component: UserSettingsSetup,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.beforeEach(async (to, from) => {
  if (to.name === "UserSettingsSetup") {
    return true;
  }

  const userSettingsStore = useUserSettingsStore();

  if (!userSettingsStore.settings || userSettingsStore.settings.userName) {
    const icpUserSettings: IUserSettings = await ipcRenderer.callMain('get-config', 'userSettings');

    if (!icpUserSettings || !icpUserSettings.userName) {
      return { name: 'UserSettingsSetup'};
    }

    userSettingsStore.setSettings(icpUserSettings);
  }

  return true;
});

export default router;
