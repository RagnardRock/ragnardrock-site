<script setup>
import { oeufs } from '../oeufs/oeufs.js';

// Cinq touchers rapides sur les runes ouvrent le terminal (pour les téléphones, sans touche ²).
let touchers = [];
function toucher() {
  const maintenant = Date.now();
  touchers = [...touchers.filter((t) => maintenant - t < 2000), maintenant];
  if (touchers.length >= 5) {
    touchers = [];
    oeufs.terminal = true;
  }
}
</script>

<template>
  <footer class="pied">
    <div class="interieur">
      <span class="rune runes" aria-hidden="true" @click="toucher">ᚱᚨᚷᚾᚨᚱᛞᚱᛟᚲᚲ</span>
      <span>© {{ new Date().getFullYear() }} RagnardRock</span>
    </div>
  </footer>
</template>

<style scoped>
.pied {
  position: relative;
  z-index: 1;
  border-top: 1px solid var(--bord);
  padding: 28px var(--gouttiere);
  color: var(--discret);
  font-size: 0.9rem;
}

.interieur {
  max-width: var(--largeur-large);
  margin: 0 auto;
  display: flex;
  flex-wrap: wrap;
  gap: 8px 24px;
  /* Runes et lettres latines n'ont pas les mêmes proportions : on les cale sur la même ligne de base. */
  align-items: baseline;
}

.runes {
  letter-spacing: 0.3em;
  -webkit-tap-highlight-color: transparent;
  user-select: none;
  opacity: 0.6;
}
</style>
