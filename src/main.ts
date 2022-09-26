import { createApp } from 'vue';
import App from './App.vue';
import vuetify from './plugins/vuetify';
import router from './plugins/router';
import store from './stores';

const app = createApp(App);

app.use(router).use(store).use(vuetify);

router.isReady().then(() => {
  app.mount('#app');
});
