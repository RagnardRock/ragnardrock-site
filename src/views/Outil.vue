<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { outil, degrade } from '../data/outils.js';
import { releasesDe, derniere, dateLisible, etat } from '../data/releases.js';
import IconeOutil from '../components/IconeOutil.vue';
import Telecharger from '../components/Telecharger.vue';
import Galerie from '../components/Galerie.vue';
import NoteVersion from '../components/NoteVersion.vue';
import Introuvable from './Introuvable.vue';

const route = useRoute();
const o = computed(() => outil(route.params.id));
const versions = computed(() => (o.value ? releasesDe(o.value) : []));
const r = computed(() => (o.value ? derniere(o.value) : null));
</script>

<template>
  <Introuvable v-if="!o" />
  <main v-else class="page large" :style="{ '--degrade': degrade(o) }">
    <RouterLink to="/atelier" class="retour">← Tous les outils</RouterLink>

    <section class="tete">
      <div class="identite">
        <IconeOutil :outil="o" :taille="112" />
        <div>
          <h1>{{ o.nom }} <span class="rune glyphe">{{ o.glyphe }}</span></h1>
          <p class="chapeau">{{ o.accroche }}</p>
        </div>
      </div>
      <div class="actions">
        <Telecharger :outil="o" />
        <span v-if="r" class="date">Sortie le {{ dateLisible(r.date) }}</span>
      </div>
    </section>

    <section class="corps">
      <div class="texte">
        <p>{{ o.description }}</p>
        <ul class="points">
          <li v-for="p in o.points" :key="p">{{ p }}</li>
        </ul>
        <p v-if="o.id !== 'atelier'" class="discret">
          Il s'installe aussi depuis <RouterLink to="/atelier/atelier">Atelier</RouterLink>, qui le tient à jour.
        </p>
      </div>
      <Galerie :outil="o" />
    </section>

    <section class="section">
      <div class="titre-section">
        <h2>Dernières versions</h2>
        <RouterLink :to="{ path: '/nouveautes', query: { outil: o.id } }">Toutes ({{ versions.length }}) →</RouterLink>
      </div>
      <div v-if="versions.length" class="versions">
        <NoteVersion v-for="v in versions.slice(0, 6)" :key="v.tag" :release="v" :icone="false" />
      </div>
      <p v-else-if="!etat.pret" class="discret">Chargement…</p>
      <p v-else class="discret">Pas encore de version publiée.</p>
    </section>
  </main>
</template>

<style scoped>
.retour {
  display: inline-block;
  margin-top: 16px;
  color: var(--discret);
  font-size: 0.9rem;
}

.tete {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: 24px;
  padding: 32px 0 40px;
}

.identite {
  display: flex;
  align-items: center;
  gap: clamp(16px, 3vw, 32px);
}

h1 {
  margin-bottom: 6px;
}

.glyphe {
  font-size: 0.8em;
  background: var(--degrade);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  margin-left: 6px;
}

.chapeau {
  margin: 0;
}

.actions {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
}

.date {
  font-size: 0.85rem;
  color: var(--discret);
}

.corps {
  display: grid;
  grid-template-columns: minmax(260px, 1fr) minmax(0, 2.4fr);
  gap: clamp(24px, 4vw, 56px);
  align-items: start;
}

.points {
  list-style: none;
  padding: 0;
  margin: 0 0 1.2em;
}

.points li {
  position: relative;
  padding: 8px 0 8px 22px;
  border-bottom: 1px solid var(--bord);
  color: var(--texte-fort);
  font-size: 0.95rem;
}

.points li::before {
  content: '';
  position: absolute;
  left: 2px;
  top: 17px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--degrade);
}

.discret {
  color: var(--discret);
  font-size: 0.9rem;
}

.titre-section {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: space-between;
  gap: 8px 20px;
  margin-bottom: 20px;
}

.titre-section h2 {
  margin: 0;
}

.versions {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 420px), 1fr));
  gap: 14px;
}

@media (max-width: 900px) {
  .corps {
    grid-template-columns: 1fr;
  }
  .actions {
    align-items: flex-start;
  }
}

@media (max-width: 520px) {
  .identite {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
