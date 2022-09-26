import {
  createRouter,
  createWebHashHistory,
  type Router,
  type NavigationGuardNext,
  type RouteLocationNormalized,
  type RouteRecordRaw,
} from 'vue-router';
import { nextTick } from 'vue';
import { useUserSettingsStore } from '../stores/UserSettings';
import { ipcRenderer } from 'electron-better-ipc';

// Pinia Store
import GlobalStore from '../stores/GlobalStore';
import store from '../stores';

import Home from '../views/Home.vue';
import UserSettingsSetup from '../views/UserSettingsSetup.vue';
import type { IUserSettings } from '../../interfaces/UserSettings.interface';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/setup',
    name: 'UserSettingsSetup',
    component: UserSettingsSetup,
  },
];

const router: Router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.beforeEach(async (to, __) => {
  if (to.name === 'UserSettingsSetup') {
    return true;
  }

  const userSettingsStore = useUserSettingsStore();

  if (!userSettingsStore.settings || userSettingsStore.settings.userName) {
    const icpUserSettings: IUserSettings = await ipcRenderer.callMain(
      'get-config',
      'userSettings'
    );

    if (!icpUserSettings || !icpUserSettings.userName) {
      return { name: 'UserSettingsSetup' };
    }

    userSettingsStore.setSettings(icpUserSettings);
  }

  return true;
});

/** passing Pinia instance directly */
const globalStore = GlobalStore(store);

router.beforeEach(
  async (
    _to: RouteLocationNormalized,
    _from: RouteLocationNormalized,
    next: NavigationGuardNext
  ) => {
    // Show Loading
    globalStore.setLoading(true);
    await nextTick();

    next();
  }
);

router.afterEach(() => {
  // Hide Loading
  globalStore.setLoading(false);
});

export default router;
