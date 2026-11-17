<script setup>
import { computed, ref } from 'vue';
import { OUTILS, outil, degrade } from '../data/outils.js';
import { etat } from '../data/releases.js';
import NoteVersion from '../components/NoteVersion.vue';
import IconeOutil from '../components/IconeOutil.vue';

const recentes = computed(() => etat.releases.slice(0, 6));
const atelier = outil('atelier');
const icones = OUTILS.filter((o) => o.id !== 'atelier');

// Le nom en runes, lettre par lettre : au survol (ou au toucher), chaque rune devient sa lettre.
const NOM = [
  ['ᚱ', 'R'], ['ᚨ', 'a'], ['ᚷ', 'g'], ['ᚾ', 'n'], ['ᚨ', 'a'], ['ᚱ', 'r'], ['ᛞ', 'd'],
  ['ᚱ', 'R'], ['ᛟ', 'o'], ['ᚲ', 'c'], ['ᚲ', 'k'],
];
const traduit = ref(false);

// Une couleur unie par signe, prise le long du dégradé vert → turquoise → violet.
// (Un vrai dégradé sur le texte, avec background-clip, ignore la transparence des lettres
// dans certains navigateurs : les deux mots restaient visibles en même temps.)
const ETAPES = [
  [0, [180, 245, 162]],
  [0.45, [63, 198, 208]],
  [1, [155, 107, 255]],
];
function couleur(i) {
  const t = i / (NOM.length - 1);
  const k = t <= ETAPES[1][0] ? 0 : 1;
  const [t0, a] = ETAPES[k];
  const [t1, b] = ETAPES[k + 1];
  const u = (t - t0) / (t1 - t0);
  return `rgb(${a.map((v, j) => Math.round(v + (b[j] - v) * u)).join(', ')})`;
}
</script>

<template>
  <main class="page large">
    <section class="accroche">
      <span class="surtitre">Développeur web</span>
      <h1
        class="nom"
        :class="{ traduit }"
        aria-label="RagnardRock"
        @mouseenter="traduit = true"
        @mouseleave="traduit = false"
        @click="traduit = !traduit"
      >
        <span class="ligne runes-nom" aria-hidden="true">
          <span v-for="([r], i) in NOM" :key="i" class="rune" :style="{ '--i': i, color: couleur(i) }">{{ r }}</span>
        </span>
        <span class="ligne latin" aria-hidden="true">
          <span v-for="([, l], i) in NOM" :key="i" :style="{ '--i': i, color: couleur(i) }">{{ l }}</span>
        </span>
      </h1>
      <p class="chapeau">
        Mes projets, au même endroit. L'Atelier rassemble mes outils de création, du code au jeu vidéo. Ansuz garde la
        trace de tout ce qu'on lit, regarde, écoute et joue.
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

.nom {
  font-size: clamp(3rem, 9vw, 6.5rem);
  letter-spacing: 0;
  cursor: default;
  user-select: none;
  width: fit-content;
  max-width: 100%;
}

/* Le nom en runes et le nom en lettres sont superposés ; chaque signe passe de l'un à l'autre
   avec un petit décalage, de gauche à droite. */
.nom {
  display: grid;
  /* Les deux polices (runes et latin) n'ont pas les mêmes proportions : alignées par le haut,
     les runes flottaient plus haut. On cale les deux lignes sur la même ligne de base. */
  align-items: baseline;
}

.ligne {
  grid-area: 1 / 1;
  display: flex;
  align-items: baseline;
}

.ligne > span {
  display: inline-block;
  transition: opacity 0.2s, transform 0.2s, filter 0.2s;
}

/* Les signes qui partent s'effacent d'abord ; ceux qui arrivent attendent qu'ils aient disparu,
   pour que les deux mots (de largeurs différentes) ne se chevauchent pas. */
.runes-nom > span {
  transition-delay: calc(360ms + var(--i) * 15ms);
}

.latin > span {
  transition-delay: calc(var(--i) * 15ms);
}

.traduit .runes-nom > span {
  transition-delay: calc(var(--i) * 15ms);
}

.traduit .latin > span {
  transition-delay: calc(360ms + var(--i) * 15ms);
}

/* Les runes s'étalent sur toute la largeur du mot latin, pour que les deux occupent la même place. */
.ligne.runes-nom {
  justify-content: space-between;
}

.ligne.runes-nom > span {
  font-weight: 700;
}

/* Les runes ᚱ et ᚲ ont des marges internes plus larges que R et k : on les compense aux deux bouts. */
.ligne.runes-nom > span:first-child {
  margin-left: -0.02em;
}

.ligne.runes-nom > span:last-child {
  margin-right: -0.1em;
}

.ligne.latin {
  font-weight: 750;
  letter-spacing: -0.03em;
}

.ligne.latin > span {
  opacity: 0;
  transform: translateY(0.25em);
  filter: blur(6px);
}

.traduit .runes-nom > span {
  opacity: 0;
  transform: translateY(-0.25em);
  filter: blur(6px);
}

.traduit .latin > span {
  opacity: 1;
  transform: none;
  filter: none;
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
