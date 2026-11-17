<script setup>
import { defineAsyncComponent } from 'vue';
import FondRunes from './components/FondRunes.vue';
import Entete from './components/Entete.vue';
import PiedPage from './components/PiedPage.vue';
import { oeufs } from './oeufs/oeufs.js';

// Chargés seulement quand quelqu'un les découvre.
const Terminal = defineAsyncComponent(() => import('./oeufs/Terminal.vue'));
const PluieRunes = defineAsyncComponent(() => import('./oeufs/PluieRunes.vue'));
</script>

<template>
  <FondRunes />
  <Entete />
  <RouterView />
  <PiedPage />
  <Terminal v-if="oeufs.terminal" />
  <PluieRunes v-if="oeufs.jeu" />
</template>
