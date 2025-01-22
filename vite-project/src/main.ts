import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import 'element-plus/theme-chalk/dark/css-vars.css';

import { createPinia } from "pinia";
import piniaPersistedState from "pinia-plugin-persistedstate";


const app = createApp(App);
const pinia = createPinia();
pinia.use(piniaPersistedState);
app.use(router);
app.use(pinia);
app.use(ElementPlus);
app.mount("#app");
