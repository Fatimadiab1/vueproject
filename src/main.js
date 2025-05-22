import { createApp } from 'vue';
import App from "./App.vue";
import router from "./router";
import '@/assets/css/chat.css';


const app = createApp(App);
app.use(router); // On ajoute le router après la création de l'app
app.mount("#app");
