<script setup>
// Le terminal caché : touche ² (ou `), ou cinq touchers sur les runes du pied de page.
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { OUTILS, outil } from '../data/outils.js';
import { derniere, versionDe, dateLisible } from '../data/releases.js';
import { enRunes, oeufs } from './oeufs.js';

const router = useRouter();
const saisie = ref('');
const champ = ref(null);
const sortie = ref(null);
const lignes = ref([
  { t: 'ᚱᚨᚷᚾᚨᚱᛞᚱᛟᚲᚲ', c: 'runes' },
  { t: 'Terminal de ragnardrock.fr. Tape « aide » pour voir les commandes.', c: 'discret' },
]);
const historique = [];
let position = 0;

const PAGES = { '~': '/', accueil: '/', atelier: '/atelier', nouveautes: '/nouveautes', ansuz: '/ansuz' };

const COMMANDES = {
  aide: {
    resume: 'liste les commandes',
    faire() {
      for (const [nom, c] of Object.entries(COMMANDES)) if (c.resume) dire(`${nom.padEnd(10)} ${c.resume}`);
    },
  },
  ls: {
    resume: 'les pages du site',
    faire: () => dire(Object.keys(PAGES).filter((p) => p !== '~').join('  ')),
  },
  cd: {
    resume: 'aller sur une page (cd atelier, cd tafl…)',
    faire(arg) {
      const cle = (arg || '~').replace(/^\/+|\/+$/g, '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
      if (cle === '..' || cle === '') return aller('/');
      if (PAGES[cle]) return aller(PAGES[cle]);
      if (outil(cle)) return aller(`/atelier/${cle}`);
      dire(`cd : ${arg} : page introuvable`, 'erreur');
    },
  },
  outils: {
    resume: 'les outils de l\'Atelier et leur version',
    faire() {
      for (const o of OUTILS) {
        const r = derniere(o);
        dire(`${o.glyphe}  ${o.nom.padEnd(9)} ${r ? versionDe(r) : '—'}`);
      }
    },
  },
  version: {
    resume: 'dernière version d\'un outil (version tafl)',
    faire(arg) {
      const o = outil((arg || '').toLowerCase());
      if (!o) return dire('Usage : version <outil>, par exemple version tafl', 'erreur');
      const r = derniere(o);
      dire(r ? `${o.nom} ${versionDe(r)}, sortie le ${dateLisible(r.date)}` : `${o.nom} : pas encore de version`);
    },
  },
  runes: {
    resume: 'écrire un texte en runes (runes bonjour)',
    faire: (arg) => (arg ? dire(enRunes(arg), 'runes') : dire('Usage : runes <texte>', 'erreur')),
  },
  jeu: {
    resume: 'lancer la Pluie de runes',
    faire() {
      oeufs.terminal = false;
      oeufs.jeu = true;
    },
  },
  pixel: {
    resume: 'activer ou couper le mode pixel',
    faire() {
      oeufs.pixel = !oeufs.pixel;
      dire(oeufs.pixel ? 'Mode pixel activé.' : 'Mode pixel coupé.');
    },
  },
  github: {
    resume: 'ouvrir le GitHub',
    faire: () => ouvrir('https://github.com/RagnardRock'),
  },
  date: { resume: 'la date et l\'heure', faire: () => dire(new Date().toLocaleString('fr-FR', { dateStyle: 'full', timeStyle: 'short' })) },
  clear: { resume: 'vider l\'écran', faire: () => (lignes.value = []) },
  exit: { resume: 'fermer le terminal', faire: () => (oeufs.terminal = false) },
  // Commandes cachées : pas dans « aide ».
  help: { faire: () => COMMANDES.aide.faire() },
  whoami: { faire: () => dire('invité') },
  echo: { faire: (arg) => dire(arg || '') },
  sudo: { faire: () => dire('Bien essayé.', 'erreur') },
  rm: { faire: () => dire('Les runes sont gravées dans la pierre. Rien n\'a été effacé.', 'erreur') },
  odin: { faire: () => dire('ᚨ Ansuz, la rune d\'Odin, celle de la parole et de la sagesse.', 'runes') },
  oracle: { faire: oracle },
  tirage: { faire: oracle },
  ragnarok: { faire: ragnarok },
};

// Le tirage d'une rune, comme on consultait les runes : une rune, son nom, ce qu'elle annonce.
const ORACLE = [
  ['ᚠ', 'Fehu', 'le bétail, la richesse. Ce que tu bâtis aujourd\'hui te nourrira demain.'],
  ['ᚢ', 'Uruz', 'l\'aurochs, la force brute. Tu as plus d\'énergie que tu ne le crois.'],
  ['ᚦ', 'Thurisaz', 'le géant, l\'épine. Un obstacle se dresse : contourne-le, ne le frappe pas.'],
  ['ᚨ', 'Ansuz', 'le dieu, la parole. Un message important va arriver.'],
  ['ᚱ', 'Raido', 'le voyage. Le chemin compte plus que l\'arrivée.'],
  ['ᚲ', 'Kaunan', 'la torche. Une idée va éclairer ce qui restait obscur.'],
  ['ᚷ', 'Gebo', 'le don. Ce que tu donnes te reviendra.'],
  ['ᚹ', 'Wunjo', 'la joie. Savoure ce qui fonctionne.'],
  ['ᚺ', 'Hagalaz', 'la grêle. Une tempête passe, elle laissera le sol plus fertile.'],
  ['ᚾ', 'Naudiz', 'le besoin. La contrainte forge l\'ingéniosité.'],
  ['ᛁ', 'Isa', 'la glace. Le moment est à l\'attente, pas à l\'action.'],
  ['ᛃ', 'Jera', 'l\'année, la récolte. Les efforts patients portent leurs fruits.'],
  ['ᛇ', 'Eihwaz', 'l\'if. Tiens bon, tes racines sont profondes.'],
  ['ᛈ', 'Perthro', 'le cornet à dés. Le hasard a son mot à dire.'],
  ['ᛉ', 'Algiz', 'l\'élan, la protection. Tu es plus à l\'abri que tu ne le penses.'],
  ['ᛊ', 'Sowilo', 'le soleil. La réussite est proche.'],
  ['ᛏ', 'Tiwaz', 'le dieu Tyr. Le courage et la justice guident ta main.'],
  ['ᛒ', 'Berkanan', 'le bouleau. Quelque chose de nouveau commence à pousser.'],
  ['ᛖ', 'Ehwaz', 'le cheval. Avance avec un allié de confiance.'],
  ['ᛗ', 'Mannaz', 'l\'homme. Les autres sont ta force.'],
  ['ᛚ', 'Laguz', 'l\'eau. Suis ton intuition.'],
  ['ᛜ', 'Ingwaz', 'la graine. Ce qui germe en silence va éclore.'],
  ['ᛞ', 'Dagaz', 'le jour. Après la nuit, la percée.'],
  ['ᛟ', 'Othala', 'l\'héritage. Ce que tu construis restera.'],
];

function oracle() {
  const [rune, nom, sens] = ORACLE[Math.floor(Math.random() * ORACLE.length)];
  dire('Les runes tombent sur le tissu…', 'discret');
  plusTard(700, () => {
    dire(rune, 'runes grande');
    dire(`${nom} : ${sens}`);
  });
}

// La fin du monde, en version courte.
let enCours = false;
function ragnarok() {
  if (enCours) return dire('Patience, le monde n\'a pas fini de brûler.', 'erreur');
  enCours = true;
  const etapes = [
    [0, 'Le cor Gjallarhorn retentit…', 'erreur'],
    [900, 'Fenrir brise sa chaîne.', 'erreur'],
    [1700, 'Le serpent du monde sort des eaux.', 'erreur'],
    [2500, 'ᚱᚨᚷᚾᚨᚱᛟᚲ', 'runes grande'],
  ];
  for (const [t, texte, c] of etapes) plusTard(t, () => dire(texte, c));
  plusTard(2500, () => document.documentElement.classList.add('ragnarok'));
  plusTard(5000, () => {
    document.documentElement.classList.remove('ragnarok');
    dire('… et le monde renaît, vert et neuf. Le site aussi.', 'discret');
    enCours = false;
  });
}

const minuteurs = new Set();
function plusTard(ms, f) {
  const id = setTimeout(async () => {
    minuteurs.delete(id);
    f();
    await nextTick();
    if (sortie.value) sortie.value.scrollTop = sortie.value.scrollHeight;
  }, ms);
  minuteurs.add(id);
}

function dire(t, c = '') {
  lignes.value.push({ t, c });
}

function aller(chemin) {
  router.push(chemin);
  dire(`→ ${chemin}`, 'discret');
}

function ouvrir(url) {
  window.open(url, '_blank', 'noopener');
  dire(`→ ${url}`, 'discret');
}

async function valider() {
  const ligne = saisie.value.trim();
  saisie.value = '';
  dire(ligne, 'commande');
  if (ligne) {
    historique.push(ligne);
    position = historique.length;
    const [nom, ...reste] = ligne.split(/\s+/);
    const c = COMMANDES[nom.toLowerCase()];
    if (c) c.faire(reste.join(' '));
    else dire(`${nom} : commande inconnue. Tape « aide ».`, 'erreur');
  }
  await nextTick();
  if (sortie.value) sortie.value.scrollTop = sortie.value.scrollHeight;
}

function touche(e) {
  if (e.key === 'Escape') {
    oeufs.terminal = false;
  } else if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
    e.preventDefault();
    position = Math.min(Math.max(position + (e.key === 'ArrowUp' ? -1 : 1), 0), historique.length);
    saisie.value = historique[position] || '';
  } else if (e.key === 'Tab') {
    e.preventDefault();
    const [debut, ...reste] = saisie.value.split(' ');
    if (reste.length) return;
    const choix = Object.keys(COMMANDES).filter((n) => COMMANDES[n].resume && n.startsWith(debut.toLowerCase()));
    if (choix.length === 1) saisie.value = `${choix[0]} `;
    else if (choix.length > 1) dire(choix.join('  '), 'discret');
  }
}

let avant = null;
onMounted(() => {
  avant = document.activeElement;
  champ.value?.focus();
});
onBeforeUnmount(() => {
  // Le terminal se ferme : les effets en cours s'arrêtent avec lui.
  for (const id of minuteurs) clearTimeout(id);
  document.documentElement.classList.remove('ragnarok');
  enCours = false;
  avant?.focus?.();
});
</script>

<template>
  <div class="fond-terminal" @click.self="oeufs.terminal = false">
    <section class="terminal" role="dialog" aria-modal="true" aria-label="Terminal" @click="champ?.focus()">
      <header class="barre-titre">
        <span class="points" aria-hidden="true"><i></i><i></i><i></i></span>
        <span>invité@ragnardrock : ~</span>
        <button class="fermer" aria-label="Fermer le terminal" @click.stop="oeufs.terminal = false">✕</button>
      </header>
      <div ref="sortie" class="sortie" aria-live="polite">
        <p v-for="(l, i) in lignes" :key="i" :class="l.c">{{ l.t }}</p>
      </div>
      <form class="invite" @submit.prevent="valider">
        <span aria-hidden="true">ᚱ ›</span>
        <input
          ref="champ"
          v-model="saisie"
          aria-label="Commande"
          autocomplete="off"
          autocapitalize="off"
          autocorrect="off"
          spellcheck="false"
          enterkeyhint="send"
          @keydown="touche"
        />
      </form>
    </section>
  </div>
</template>

<style scoped>
.fond-terminal {
  position: fixed;
  inset: 0;
  z-index: 90;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding: 16px;
  background: rgba(5, 6, 10, 0.35);
}

.terminal {
  width: min(760px, 100%);
  height: min(440px, 70vh);
  display: flex;
  flex-direction: column;
  border: 1px solid var(--bord-fort);
  border-radius: var(--rayon);
  background: rgba(10, 11, 17, 0.92);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  box-shadow: var(--ombre);
  font-family: ui-monospace, 'Cascadia Code', Consolas, 'Courier New', monospace;
  font-size: 0.88rem;
  overflow: hidden;
}

.barre-titre {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 10px 8px 14px;
  border-bottom: 1px solid var(--bord);
  color: var(--discret);
  font-size: 0.8rem;
}

.points {
  display: flex;
  gap: 6px;
}

.points i {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--bord-fort);
}

.fermer {
  margin-left: auto;
  border: 0;
  background: none;
  color: var(--discret);
  cursor: pointer;
  font-size: 0.9rem;
}

.sortie {
  flex: 1;
  overflow-y: auto;
  padding: 12px 14px;
}

.sortie p {
  margin: 0;
  white-space: pre-wrap;
  word-break: break-word;
  line-height: 1.55;
}

.sortie .commande::before {
  content: 'ᚱ › ';
  color: var(--accent);
}

.sortie .commande {
  color: var(--texte-fort);
  margin-top: 6px;
}

.sortie .discret {
  color: var(--discret);
}

.sortie .erreur {
  color: #ff8a95;
}

.sortie .runes {
  font-family: var(--police-runes);
  color: var(--accent-2);
  font-size: 1.1rem;
  letter-spacing: 0.15em;
}

.sortie .grande {
  font-size: 2.6rem;
  line-height: 1.3;
  margin: 6px 0;
  text-shadow: 0 0 18px var(--accent-2);
}

.invite {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  border-top: 1px solid var(--bord);
  color: var(--accent);
}

.invite input {
  flex: 1;
  min-width: 0;
  border: 0;
  outline: 0;
  background: none;
  color: var(--texte-fort);
  font: inherit;
  font-size: 16px; /* 16 px minimum : iOS ne zoome pas sur le champ */
}
</style>
