<template>
  <main class="page introuvable">
    <span class="rune" aria-hidden="true">ᚾ</span>
    <h1>Page introuvable</h1>
    <p class="chapeau">Cette rune ne mène nulle part.</p>
    <RouterLink to="/" class="bouton">Retour à l'accueil</RouterLink>
  </main>
</template>

<style scoped>
.introuvable {
  padding-top: 15vh;
  text-align: center;
}

.introuvable .chapeau {
  margin: 0 auto 28px;
}

.rune {
  display: block;
  font-size: 120px;
  color: var(--discret);
  opacity: 0.4;
  margin-bottom: 16px;
}
</style>
