<script setup>
import { computed } from 'vue';
import { OUTILS, outil, degrade } from '../data/outils.js';
import { etat } from '../data/releases.js';
import NoteVersion from '../components/NoteVersion.vue';
import IconeOutil from '../components/IconeOutil.vue';

const recentes = computed(() => etat.releases.slice(0, 6));
const atelier = outil('atelier');
const icones = OUTILS.filter((o) => o.id !== 'atelier');
</script>

<template>
  <main class="page large">
    <section class="accroche">
      <span class="surtitre">Développeur web</span>
      <h1>
        Je fabrique mes propres outils,<br />
        <span class="degrade">et des jeux avec.</span>
      </h1>
      <p class="chapeau">
        Un IDE, de la retouche d'images, un éditeur de jeu, un tableur… tous faits main, en français, en mode sombre.
        Et Ansuz, le carnet culturel partagé.
      </p>
    </section>

    <section class="projets">
      <RouterLink to="/atelier" class="projet verre" :style="{ '--degrade': degrade(atelier) }">
        <div class="projet-haut">
          <IconeOutil :outil="atelier" :taille="64" />
          <div>
            <span class="surtitre">Suite d'outils · Windows</span>
            <h2>Atelier</h2>
          </div>
        </div>
        <p>Dix outils pour le web, le graphisme, la bureautique et le jeu vidéo, avec un assistant commun, Loki.</p>
        <div class="mini-icones">
          <img v-for="o in icones" :key="o.id" :src="`/icones/${o.id}.svg`" :alt="o.nom" :title="o.nom" width="34" height="34" />
        </div>
        <span class="rune filigrane" aria-hidden="true">ᚨ</span>
      </RouterLink>

      <RouterLink to="/ansuz" class="projet verre ansuz">
        <div class="projet-haut">
          <span class="rune pastille" aria-hidden="true">ᚨ</span>
          <div>
            <span class="surtitre">Application web</span>
            <h2>Ansuz</h2>
          </div>
        </div>
        <p>Le carnet culturel partagé : livres, mangas, films, séries, musique et jeux vidéo, notés et commentés entre amis.</p>
        <span class="lien-flèche">ansuz.media →</span>
        <span class="rune filigrane" aria-hidden="true">ᚨ</span>
      </RouterLink>
    </section>

    <section class="section">
      <div class="titre-section">
        <h2>Dernières versions</h2>
        <RouterLink to="/nouveautes">Toutes les nouveautés →</RouterLink>
      </div>
      <div v-if="recentes.length" class="recentes">
        <NoteVersion v-for="r in recentes" :key="r.tag" :release="r" />
      </div>
      <p v-else-if="etat.erreur" class="chapeau">Les versions n'ont pas pu être chargées ({{ etat.erreur }}).</p>
      <p v-else class="chapeau">Chargement…</p>
    </section>
  </main>
</template>

<style scoped>
.accroche {
  padding: clamp(40px, 10vh, 120px) 0 clamp(32px, 6vh, 64px);
}

.degrade {
  background: linear-gradient(120deg, #b4f5a2, #3fc6d0 45%, #9b6bff);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.projets {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 420px), 1fr));
  gap: 20px;
}

.projet {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: clamp(22px, 3vw, 34px);
  min-height: 260px;
  color: var(--texte);
  text-decoration: none;
  overflow: hidden;
  transition: transform 0.25s, background 0.25s;
}

.projet:hover {
  transform: translateY(-3px);
  background: var(--verre-fort);
  text-decoration: none;
}

.projet p {
  margin: 0;
  max-width: 46ch;
}

.projet h2 {
  margin: 0;
}

.projet .surtitre {
  margin-bottom: 4px;
}

.projet-haut {
  display: flex;
  align-items: center;
  gap: 16px;
}

.mini-icones {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: auto;
}

.pastille {
  display: grid;
  place-items: center;
  width: 64px;
  height: 64px;
  border-radius: 16px;
  font-size: 34px;
  color: #fff;
  background: linear-gradient(135deg, #f0b44c, #b8641c);
  box-shadow: 0 8px 18px rgba(0, 0, 0, 0.4);
}

.ansuz {
  --degrade: linear-gradient(135deg, #f0b44c, #b8641c);
}

.lien-flèche {
  margin-top: auto;
  color: #f0b44c;
  font-weight: 600;
}

.filigrane {
  position: absolute;
  right: 10px;
  bottom: -40px;
  font-size: 220px;
  background: var(--degrade);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  opacity: 0.08;
  pointer-events: none;
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

.recentes {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 380px), 1fr));
  gap: 14px;
}
</style>
