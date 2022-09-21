import { createApp } from "vue";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import router from "./plugins/router";
import { createPinia } from "pinia";

const app = createApp(App);

app.use(vuetify).use(createPinia()).use(router);

router.isReady().then(() =>
  app.mount("#app", true).$nextTick(() => {
    postMessage({ payload: "removeLoading" }, "*");
  })
);
