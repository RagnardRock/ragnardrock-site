<template>
  <footer class="pied">
    <div class="interieur">
      <span class="rune runes" aria-hidden="true">ᚱᚨᚷᚾᚨᚱ</span>
      <span>Fait main, avec Vue.</span>
      <a href="https://github.com/RagnardRock/atelier" target="_blank" rel="noopener">Le code de l'Atelier</a>
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
  align-items: center;
}

.runes {
  letter-spacing: 0.3em;
  opacity: 0.6;
}
</style>
