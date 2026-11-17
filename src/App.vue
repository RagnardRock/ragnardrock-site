<script setup>
import FondRunes from './components/FondRunes.vue';
import Entete from './components/Entete.vue';
import PiedPage from './components/PiedPage.vue';
</script>

<template>
  <FondRunes />
  <Entete />
  <RouterView />
  <PiedPage />
</template>
