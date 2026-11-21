<script setup>
const groupes = [
  {
    titre: 'Pour le client',
    points: [
      'Il modifie son site en cliquant sur un texte ou une photo',
      'Son espace « Mon site » : messages du formulaire, équipe, réglages',
      'Double authentification, avec codes de secours',
    ],
  },
  {
    titre: 'Pour le développeur',
    points: [
      'Les zones modifiables se marquent dans le HTML, sans schéma',
      'Mode dev visuel : des sections à glisser depuis une bibliothèque de blocs',
      'Gestion des clients : fiches, contrats, pause, export, corbeille',
      'Lié à Rune : vérifier les marqueurs, récupérer les modifs du client, envoyer en ligne',
    ],
  },
  {
    titre: 'Pour tout le monde',
    points: ['Des pages statiques, rapides et bien référencées', 'Historique et retour à une version précédente'],
  },
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
      <div v-for="g in groupes" :key="g.titre" class="groupe">
        <h2>{{ g.titre }}</h2>
        <ul class="points">
          <li v-for="p in g.points" :key="p">{{ p }}</li>
        </ul>
      </div>
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

.groupe h2 {
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--discret);
  margin: 24px 0 4px;
}

.groupe:last-of-type {
  margin-bottom: 28px;
}

.points {
  list-style: none;
  padding: 0;
  margin: 0;
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
