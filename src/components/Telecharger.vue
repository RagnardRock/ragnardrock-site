<script setup>
// Le bouton « Télécharger » d'un outil : l'installeur Windows de sa dernière version.
import { computed } from 'vue';
import { derniere, installeur, versionDe, tailleLisible, etat } from '../data/releases.js';
import { degrade } from '../data/outils.js';

const props = defineProps({ outil: { type: Object, required: true } });
const r = computed(() => derniere(props.outil));
const f = computed(() => installeur(r.value));
</script>

<template>
  <a v-if="f" :href="f.url" class="bouton plein" :style="{ '--degrade': degrade(outil) }">
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" d="M12 4v11m0 0l-4.5-4.5M12 15l4.5-4.5M5 20h14"/></svg>
    Télécharger {{ versionDe(r) }}
    <small>Windows · {{ tailleLisible(f.taille) }}</small>
  </a>
  <span v-else-if="!etat.pret" class="bouton attente">Recherche de la dernière version…</span>
  <a v-else :href="`https://github.com/RagnardRock/atelier/releases`" class="bouton" target="_blank" rel="noopener">Voir les versions sur GitHub</a>
</template>

<style scoped>
.attente {
  opacity: 0.6;
  cursor: default;
}

.attente:hover {
  transform: none;
}
</style>
