<script setup>
// Les notes de version de tous les outils, filtrables par outil (?outil=tafl).
import { computed, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { OUTILS, outil } from '../data/outils.js';
import { etat } from '../data/releases.js';
import NoteVersion from '../components/NoteVersion.vue';

const route = useRoute();
const router = useRouter();
const PAR_PAGE = 30;
const montrees = ref(PAR_PAGE);

const filtre = computed(() => (outil(route.query.outil) ? route.query.outil : ''));
const liste = computed(() => {
  const o = outil(filtre.value);
  return o ? etat.releases.filter((r) => r.tag.startsWith(o.prefixe)) : etat.releases;
});

// Regroupées par mois, pour se repérer dans une longue liste.
const FORMAT_MOIS = new Intl.DateTimeFormat('fr-FR', { month: 'long', year: 'numeric' });
const mois = computed(() => {
  const groupes = [];
  for (const r of liste.value.slice(0, montrees.value)) {
    const nom = FORMAT_MOIS.format(new Date(r.date));
    if (groupes.at(-1)?.nom !== nom) groupes.push({ nom, releases: [] });
    groupes.at(-1).releases.push(r);
  }
  return groupes;
});

watch(filtre, () => (montrees.value = PAR_PAGE));

function choisir(id) {
  router.replace({ query: id ? { outil: id } : {} });
}
</script>

<template>
  <main class="page">
    <section class="tete">
      <span class="surtitre">Journal des versions</span>
      <h1>Nouveautés</h1>
      <p class="chapeau">Toutes les versions des outils de l'Atelier, telles que publiées sur GitHub.</p>
    </section>

    <div class="filtres" role="group" aria-label="Filtrer par outil">
      <button class="puce" :aria-pressed="!filtre" @click="choisir('')">Tous</button>
      <button v-for="o in OUTILS" :key="o.id" class="puce" :aria-pressed="filtre === o.id" @click="choisir(o.id)">
        <img :src="`/icones/${o.id}.svg`" alt="" width="18" height="18" />
        {{ o.nom }}
      </button>
    </div>

    <p v-if="!etat.pret" class="chapeau">Chargement…</p>
    <p v-else-if="!liste.length" class="chapeau">
      {{ etat.erreur ? `Les versions n'ont pas pu être chargées (${etat.erreur}).` : 'Aucune version pour le moment.' }}
    </p>

    <section v-for="m in mois" :key="m.nom" class="mois">
      <h2>{{ m.nom }}</h2>
      <div class="liste">
        <NoteVersion v-for="r in m.releases" :key="r.tag" :release="r" />
      </div>
    </section>

    <div v-if="liste.length > montrees" class="plus">
      <button class="bouton" @click="montrees += PAR_PAGE">Voir les versions plus anciennes</button>
    </div>
  </main>
</template>

<style scoped>
.tete {
  padding: clamp(32px, 8vh, 80px) 0 24px;
}

.filtres {
  position: sticky;
  top: 76px;
  z-index: 5;
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding: 10px 0;
  margin-bottom: 8px;
  scrollbar-width: thin;
}

.filtres .puce {
  backdrop-filter: blur(12px);
  background: rgba(20, 21, 30, 0.7);
}

.filtres .puce[aria-pressed='true'] {
  background: rgba(60, 62, 80, 0.85);
}

.mois h2 {
  font-size: 1rem;
  font-weight: 600;
  text-transform: capitalize;
  color: var(--discret);
  margin: 32px 0 12px;
}

.liste {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.plus {
  display: flex;
  justify-content: center;
  margin-top: 32px;
}
</style>
