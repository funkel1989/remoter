import { createRouter, createWebHashHistory } from "vue-router";
import { useUserSettingsStore } from "../stores/UserSettings";

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

router.beforeEach((to, from) => {
  const userSettingsStore = useUserSettingsStore();

  if (!userSettingsStore.settings || !userSettingsStore.settings.userName) {
    if (to.name !== 'UserSettingsSetup') {
      return { name: 'UserSettingsSetup'};
    }
  }

  return true;
});

export default router;
