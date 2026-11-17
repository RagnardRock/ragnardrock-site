<script setup>
// Les captures d'un outil : une grande, les autres à côté, et un clic les ouvre en plein écran.
import { ref } from 'vue';

const props = defineProps({ outil: { type: Object, required: true } });
const boite = ref(null);
const ouverte = ref(0);

const src = (c) => `/captures/${props.outil.id}/${c.fichier}`;

function ouvrir(i) {
  ouverte.value = i;
  boite.value.showModal();
}

function suivante(pas) {
  const n = props.outil.captures.length;
  ouverte.value = (ouverte.value + pas + n) % n;
}

function touche(e) {
  if (e.key === 'ArrowRight') suivante(1);
  if (e.key === 'ArrowLeft') suivante(-1);
}

function clicFond(e) {
  if (e.target === boite.value) boite.value.close();
}
</script>

<template>
  <div class="galerie" :class="{ seule: outil.captures.length === 1 }">
    <button v-for="(c, i) in outil.captures" :key="c.fichier" class="vignette verre" :class="{ premiere: i === 0 }" @click="ouvrir(i)">
      <img :src="src(c)" :alt="c.legende" :loading="i === 0 ? 'eager' : 'lazy'" />
      <span class="legende">{{ c.legende }}</span>
    </button>
  </div>

  <dialog ref="boite" class="boite" @keydown="touche" @click="clicFond">
    <figure>
      <img :src="src(outil.captures[ouverte])" :alt="outil.captures[ouverte].legende" />
      <figcaption>
        <button v-if="outil.captures.length > 1" class="puce" aria-label="Précédente" @click="suivante(-1)">←</button>
        <span>{{ outil.captures[ouverte].legende }}</span>
        <button v-if="outil.captures.length > 1" class="puce" aria-label="Suivante" @click="suivante(1)">→</button>
        <button class="puce fermer" aria-label="Fermer" @click="boite.close()">✕</button>
      </figcaption>
    </figure>
  </dialog>
</template>

<style scoped>
.galerie {
  display: grid;
  grid-template-columns: 2fr 1fr;
  grid-auto-rows: auto;
  gap: 14px;
}

.galerie.seule {
  grid-template-columns: 1fr;
}

.vignette {
  position: relative;
  padding: 0;
  overflow: hidden;
  cursor: zoom-in;
  font: inherit;
  color: inherit;
  text-align: left;
}

.vignette.premiere {
  grid-row: span 2;
}

.vignette img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top left;
  aspect-ratio: 16 / 10;
  transition: transform 0.4s;
}

.vignette:hover img {
  transform: scale(1.02);
}

.legende {
  position: absolute;
  left: 10px;
  bottom: 10px;
  padding: 4px 10px;
  border-radius: 999px;
  background: rgba(10, 11, 16, 0.75);
  backdrop-filter: blur(8px);
  font-size: 0.8rem;
  color: var(--texte-fort);
}

@media (max-width: 760px) {
  .galerie {
    grid-template-columns: 1fr;
  }
  .vignette.premiere {
    grid-row: auto;
  }
}

.boite {
  max-width: min(96vw, 1800px);
  max-height: 94vh;
  padding: 0;
  border: 1px solid var(--bord-fort);
  border-radius: var(--rayon);
  background: #0e0f16;
  color: var(--texte);
}

.boite::backdrop {
  background: rgba(5, 6, 10, 0.8);
  backdrop-filter: blur(6px);
}

figure {
  margin: 0;
}

figure img {
  max-height: calc(94vh - 60px);
  width: auto;
  margin: 0 auto;
}

figcaption {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  font-size: 0.9rem;
}

.fermer {
  margin-left: auto;
}
</style>
