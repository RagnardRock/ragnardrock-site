<script setup>
const points = [
  'Le client modifie son site en cliquant directement sur un texte ou une photo',
  'Le développeur marque les zones modifiables dans son HTML, sans schéma à écrire',
  'La publication réécrit des pages statiques : rapides et bien référencées',
  'Comptes par personne, rôles, historique et retour à une version précédente',
];
</script>

<template>
  <main class="page bifrost">
    <section class="tete">
      <span class="rune grande" aria-hidden="true">ᛒ</span>
      <span class="surtitre">CMS · en bêta</span>
      <h1 class="titre">Bifrost</h1>
      <p class="devise">Le pont entre le développeur et ses clients.</p>
      <p class="chapeau">
        Je fais le site, mes clients le tiennent à jour eux-mêmes : actualités, photos, horaires. Bifrost est en bêta avec
        mes premiers sites clients.
      </p>
      <ul class="points">
        <li v-for="p in points" :key="p">{{ p }}</li>
      </ul>
      <a href="https://bifrost.ragnardrock.fr/" class="bouton plein" target="_blank" rel="noopener">Ouvrir Bifrost →</a>
    </section>
  </main>
</template>

<style scoped>
.bifrost {
  --degrade: linear-gradient(135deg, #8b5cf6, #e07a4a);
}

.tete {
  position: relative;
  padding: clamp(40px, 12vh, 140px) 0 40px;
  max-width: 720px;
}

.grande {
  position: absolute;
  right: -60px;
  top: 20px;
  font-size: 300px;
  background: var(--degrade);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  opacity: 0.14;
  pointer-events: none;
}

.titre {
  background: var(--degrade);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  width: fit-content;
  margin-bottom: 4px;
}

.devise {
  color: #d9ccff;
  font-size: 1.15rem;
}

.points {
  list-style: none;
  padding: 0;
  margin: 8px 0 28px;
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

@media (max-width: 760px) {
  .grande {
    font-size: 180px;
    right: 0;
  }
}
</style>
