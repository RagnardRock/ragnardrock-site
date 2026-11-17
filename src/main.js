import { createApp } from 'vue';
import '@fontsource-variable/inter';
import '@fontsource/noto-sans-runic';
import './styles/global.css';
import App from './App.vue';
import { router } from './router.js';
import { chargerReleases } from './data/releases.js';

chargerReleases();
createApp(App).use(router).mount('#app');
