import { createRouter, createWebHistory } from 'vue-router';
import Accueil from './views/Accueil.vue';

const NOM = 'RagnardRock';

const routes = [
  { path: '/', component: Accueil, meta: { titre: NOM } },
  { path: '/atelier', component: () => import('./views/Atelier.vue'), meta: { titre: `Atelier · ${NOM}` } },
  { path: '/atelier/:id', component: () => import('./views/Outil.vue') },
  { path: '/nouveautes', component: () => import('./views/Nouveautes.vue'), meta: { titre: `Nouveautés · ${NOM}` } },
  { path: '/ansuz', component: () => import('./views/Ansuz.vue'), meta: { titre: `Ansuz · ${NOM}` } },
  { path: '/:chemin(.*)*', component: () => import('./views/Introuvable.vue'), meta: { titre: `Introuvable · ${NOM}` } },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, position) {
    if (position) return position;
    if (to.path === from.path) return false; // un filtre change : on reste où on est
    return { top: 0 };
  },
});

router.afterEach((to) => {
  document.title = to.meta.titre || NOM;
});
