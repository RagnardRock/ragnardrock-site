<script setup>
import { computed } from 'vue';
import IconeOutil from './IconeOutil.vue';
import { derniere, versionDe } from '../data/releases.js';
import { degrade } from '../data/outils.js';

const props = defineProps({ outil: { type: Object, required: true } });
const r = computed(() => derniere(props.outil));
</script>

<template>
  <RouterLink :to="`/atelier/${outil.id}`" class="carte verre" :style="{ '--degrade': degrade(outil) }">
    <div class="haut">
      <IconeOutil :outil="outil" :taille="52" />
      <span v-if="r" class="version">{{ versionDe(r) }}</span>
    </div>
    <h3>{{ outil.nom }}</h3>
    <p>{{ outil.accroche }}</p>
    <span class="rune filigrane" aria-hidden="true">{{ outil.glyphe }}</span>
  </RouterLink>
</template>

<style scoped>
.carte {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 20px;
  color: var(--texte);
  text-decoration: none;
  overflow: hidden;
  transition: transform 0.25s, border-color 0.25s, background 0.25s;
}

.carte::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  padding: 1px;
  background: var(--degrade);
  -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  opacity: 0;
  transition: opacity 0.25s;
}

.carte:hover {
  transform: translateY(-3px);
  background: var(--verre-fort);
  text-decoration: none;
}

.carte:hover::before {
  opacity: 0.8;
}

.haut {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 10px;
}

h3 {
  margin: 0;
}

p {
  margin: 0;
  font-size: 0.93rem;
  color: var(--discret);
}

.filigrane {
  position: absolute;
  right: -6px;
  bottom: -18px;
  font-size: 110px;
  background: var(--degrade);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  opacity: 0.07;
  pointer-events: none;
  transition: opacity 0.25s;
}

.carte:hover .filigrane {
  opacity: 0.16;
}
</style>
