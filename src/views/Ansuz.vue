<script setup>
const rayons = ['Livres', 'Mangas', 'Films', 'Séries', 'Musique', 'Jeux vidéo'];
</script>

<template>
  <main class="page ansuz">
    <section class="tete">
      <span class="rune grande" aria-hidden="true">ᚨ</span>
      <span class="surtitre">Application web</span>
      <h1 class="titre">Ansuz</h1>
      <p class="devise">Le carnet culturel partagé.</p>
      <p class="chapeau">
        Recense tes lectures, films, séries, musiques et jeux vidéo, donne ton avis, suis celui de tes amis et découvre de
        nouvelles œuvres. Une extension Chrome l'accompagne.
      </p>
      <div class="rayons">
        <span v-for="r in rayons" :key="r" class="etiquette">{{ r }}</span>
      </div>
      <a href="https://ansuz.media/" class="bouton plein" target="_blank" rel="noopener">Ouvrir ansuz.media →</a>
    </section>
  </main>
</template>

<style scoped>
.ansuz {
  --degrade: linear-gradient(135deg, #f0b44c, #b8641c);
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
  opacity: 0.12;
  pointer-events: none;
}

.titre {
  font-family: Georgia, 'Times New Roman', serif;
  font-style: italic;
  font-weight: 400;
  color: #f0b44c;
  margin-bottom: 4px;
}

.devise {
  font-style: italic;
  color: #e8cfa2;
  font-size: 1.15rem;
}

.rayons {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 8px 0 28px;
}

.etiquette {
  padding: 4px 12px;
  border-radius: 999px;
  border: 1px solid rgba(240, 180, 76, 0.5);
  color: #f0b44c;
  font-size: 0.85rem;
}

@media (max-width: 760px) {
  .grande {
    font-size: 180px;
    right: 0;
  }
}
</style>
