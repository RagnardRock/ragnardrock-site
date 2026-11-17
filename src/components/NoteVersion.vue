<script setup>
// Une version et ses notes, telles qu'écrites dans la Release GitHub.
import { computed } from 'vue';
import IconeOutil from './IconeOutil.vue';
import { outilDeTag } from '../data/outils.js';
import { versionDe, dateLisible } from '../data/releases.js';

const props = defineProps({ release: { type: Object, required: true }, icone: { type: Boolean, default: true } });
const o = computed(() => outilDeTag(props.release.tag));
</script>

<template>
  <article class="note verre">
    <header>
      <RouterLink v-if="icone && o" :to="`/atelier/${o.id}`" class="qui">
        <IconeOutil :outil="o" :taille="32" />
        <strong>{{ o.nom }}</strong>
      </RouterLink>
      <span class="version">{{ versionDe(release) }}</span>
      <time :datetime="release.date">{{ dateLisible(release.date) }}</time>
      <a :href="release.url" class="github" target="_blank" rel="noopener">GitHub</a>
    </header>
    <div class="notes" v-html="release.html" />
  </article>
</template>

<style scoped>
.note {
  padding: 16px 18px;
  min-width: 0;
}

header {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px 12px;
  margin-bottom: 10px;
}

.qui {
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--texte-fort);
  text-decoration: none;
}

time {
  color: var(--discret);
  font-size: 0.85rem;
}

.github {
  margin-left: auto;
  font-size: 0.82rem;
  color: var(--discret);
}

.notes {
  font-size: 0.93rem;
  overflow-wrap: anywhere;
}
</style>
