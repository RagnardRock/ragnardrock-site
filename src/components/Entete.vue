<script setup>
const liens = [
  { to: '/atelier', texte: 'Atelier' },
  { to: '/nouveautes', texte: 'Nouveautés' },
  { to: '/ansuz', texte: 'Ansuz' },
];
</script>

<template>
  <header class="entete">
    <nav class="barre verre" aria-label="Navigation principale">
      <RouterLink to="/" class="marque" aria-label="Accueil">
        <span class="rune logo">ᚱ</span>
        <span class="nom">RagnardRock</span>
      </RouterLink>
      <div class="liens">
        <RouterLink v-for="l in liens" :key="l.to" :to="l.to" class="lien">{{ l.texte }}</RouterLink>
        <a href="https://github.com/RagnardRock" class="lien" target="_blank" rel="noopener" aria-label="GitHub">
          <svg viewBox="0 0 16 16" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/></svg>
        </a>
      </div>
    </nav>
  </header>
</template>

<style scoped>
.entete {
  position: sticky;
  top: 0;
  z-index: 10;
  padding: 14px var(--gouttiere);
}

.barre {
  max-width: var(--largeur-large);
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 8px 10px 8px 16px;
  border-radius: 999px;
  background: rgba(14, 15, 22, 0.6);
}

.marque {
  display: flex;
  /* Runes et lettres latines n'ont pas les mêmes proportions : on les cale sur la même ligne de base. */
  align-items: baseline;
  gap: 10px;
  color: var(--texte-fort);
  font-weight: 650;
  text-decoration: none;
}

.logo {
  font-size: 1.2rem;
  background: linear-gradient(135deg, #b9a8ff, #5ec8ff);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.liens {
  display: flex;
  align-items: center;
  gap: 2px;
}

.lien {
  display: flex;
  align-items: center;
  padding: 7px 14px;
  border-radius: 999px;
  color: var(--texte);
  font-size: 0.93rem;
  font-weight: 500;
  text-decoration: none;
  transition: background 0.2s, color 0.2s;
}

.lien:hover {
  background: var(--verre-fort);
  color: var(--texte-fort);
}

.lien.router-link-active {
  background: var(--verre-fort);
  color: var(--texte-fort);
}

/* Sur mobile, la barre est presque opaque pour rester lisible pendant le défilement. */
@media (max-width: 760px) {
  .barre {
    background: rgba(14, 15, 22, 0.94);
    backdrop-filter: blur(22px) saturate(140%);
    -webkit-backdrop-filter: blur(22px) saturate(140%);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);
  }
}

@media (max-width: 560px) {
  .nom {
    display: none;
  }
  .lien {
    padding: 7px 10px;
    font-size: 0.88rem;
  }
}
</style>
