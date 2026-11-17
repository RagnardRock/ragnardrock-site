<script setup>
import { OUTILS, CATEGORIES, outil, degrade } from '../data/outils.js';
import CarteOutil from '../components/CarteOutil.vue';
import IconeOutil from '../components/IconeOutil.vue';
import Telecharger from '../components/Telecharger.vue';

const hub = outil('atelier');
const rayons = CATEGORIES.map((c) => ({ ...c, outils: OUTILS.filter((o) => o.categorie === c.id) }));
</script>

<template>
  <main class="page large">
    <section class="tete">
      <span class="surtitre">Suite d'outils · Windows · en français</span>
      <h1>Atelier</h1>
      <p class="chapeau">
        Des outils faits main pour le travail de tous les jours et pour créer des jeux. Ils partagent le même style,
        les mêmes réglages en menus, et le même assistant, Loki, qui peut agir dans chaque outil avec ta permission.
      </p>
    </section>

    <section class="hub verre" :style="{ '--degrade': degrade(hub) }">
      <IconeOutil :outil="hub" :taille="84" />
      <div class="hub-texte">
        <h2>Commence par Atelier</h2>
        <p>{{ hub.description }}</p>
        <div class="actions">
          <Telecharger :outil="hub" />
          <RouterLink to="/atelier/atelier" class="bouton">En savoir plus</RouterLink>
        </div>
      </div>
    </section>

    <div class="rayons">
      <section v-for="r in rayons" :key="r.id" class="rayon" :style="{ flex: `${r.outils.length} 1 ${r.outils.length * 270}px` }">
        <h2>{{ r.nom }}</h2>
        <div class="grille">
          <CarteOutil v-for="o in r.outils" :key="o.id" :outil="o" />
        </div>
      </section>
    </div>

    <p class="note-signature">
      Les installeurs ne sont pas signés par un certificat payant. Si Windows affiche « Windows a protégé votre ordinateur »,
      clique sur <em>Informations complémentaires</em>, puis <em>Exécuter quand même</em>.
    </p>
  </main>
</template>

<style scoped>
.tete {
  padding: clamp(32px, 8vh, 80px) 0 32px;
}

.hub {
  position: relative;
  display: flex;
  align-items: center;
  gap: clamp(18px, 3vw, 36px);
  padding: clamp(22px, 3vw, 36px);
  overflow: hidden;
}

.hub::after {
  content: '';
  position: absolute;
  inset: auto -10% -60% 40%;
  height: 120%;
  background: var(--degrade);
  filter: blur(80px);
  opacity: 0.14;
  pointer-events: none;
}

.hub-texte {
  position: relative;
  z-index: 1;
}

.hub h2 {
  margin-bottom: 8px;
}

.hub p {
  max-width: 70ch;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.rayon h2 {
  font-size: 1.25rem;
  color: var(--discret);
  font-weight: 600;
  margin-bottom: 16px;
}

.rayons {
  display: flex;
  flex-wrap: wrap;
  gap: 40px 24px;
  margin-top: 48px;
}

.rayon {
  min-width: 0;
}

.grille {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 250px), 1fr));
  gap: 14px;
}

.note-signature {
  margin-top: 56px;
  font-size: 0.88rem;
  color: var(--discret);
  max-width: 80ch;
}

@media (max-width: 640px) {
  .hub {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
