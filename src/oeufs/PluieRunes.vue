<script setup>
// Pluie de runes : des runes tombent, il faut attraper celles du nom dans l'ordre (ᚱ, ᚨ, ᚷ…).
// Une mauvaise rune coûte une vie ; une bonne rune manquée n'est pas grave, elle reviendra.
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { NOM, oeufs } from './oeufs.js';

const CLE_RECORD = 'pluie-runes-record';
const RUNES = 'ᚠᚢᚦᚨᚱᚲᚷᚹᚺᚾᛁᛃᛇᛈᛉᛊᛏᛒᛖᛗᛚᛜᛞᛟ';
const COULEURS = ['#b4f5a2', '#5fd4a8', '#3fc6d0', '#5ec8ff', '#b9a8ff', '#9b6bff'];

const toile = ref(null);
const hud = ref(null);
const phase = ref('accueil'); // accueil | jeu | fin
const score = ref(0);
const vies = ref(3);
const tour = ref(1);
const indice = ref(0);
const record = ref(lireRecord());
const annonce = ref('');

let ctx, l, h, dpr;
let joueur, cible, gauche, droite, prochaine, secousse, dernier, image, enPause;
let runes = [];
let eclats = [];

function lireRecord() {
  try {
    return Number(localStorage.getItem(CLE_RECORD)) || 0;
  } catch {
    return 0;
  }
}

function dimensionner() {
  const c = toile.value;
  dpr = Math.min(devicePixelRatio || 1, 2);
  l = c.clientWidth;
  h = c.clientHeight;
  c.width = l * dpr;
  c.height = h * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  if (joueur) {
    joueur.y = h - 56;
    joueur.x = Math.min(Math.max(joueur.x, joueur.l / 2), l - joueur.l / 2);
  }
}

function demarrer() {
  joueur = { x: l / 2, y: h - 56, l: Math.min(130, l * 0.28) };
  cible = joueur.x;
  runes = [];
  eclats = [];
  score.value = 0;
  vies.value = 3;
  tour.value = 1;
  indice.value = 0;
  prochaine = 0.6;
  secousse = 0;
  phase.value = 'jeu';
  dire('Attrape ᚱ');
}

function dire(texte) {
  annonce.value = texte;
  clearTimeout(dire.minuteur);
  dire.minuteur = setTimeout(() => (annonce.value = ''), 1400);
}

function vitesse() {
  return 150 + (tour.value - 1) * 70 + indice.value * 8;
}

function intervalle() {
  return Math.max(0.32, 0.85 - (tour.value - 1) * 0.12 - indice.value * 0.015);
}

function lacher() {
  const attendue = NOM[indice.value].rune;
  const g = Math.random() < 0.34 ? attendue : RUNES[Math.floor(Math.random() * RUNES.length)];
  runes.push({
    g,
    x: 24 + Math.random() * (l - 48),
    y: (hud.value?.offsetHeight || 0) - 10, // elles naissent sous le bandeau du haut
    v: vitesse() * (0.85 + Math.random() * 0.3),
    c: COULEURS[Math.floor(Math.random() * COULEURS.length)],
    r: (Math.random() - 0.5) * 0.6,
  });
}

function eclater(x, y, couleur, n) {
  for (let i = 0; i < n; i++) {
    const a = Math.random() * Math.PI * 2;
    const v = 60 + Math.random() * 220;
    eclats.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 80, t: 0.6 + Math.random() * 0.4, c: couleur });
  }
}

function attraper(r) {
  if (r.g === NOM[indice.value].rune) {
    score.value += 10 * tour.value;
    eclater(r.x, joueur.y, r.c, 18);
    indice.value++;
    if (indice.value === NOM.length) {
      score.value += 100 * tour.value;
      tour.value++;
      indice.value = 0;
      dire(`RagnardRock ! Tour ${tour.value}`);
    }
  } else {
    vies.value--;
    secousse = 0.35;
    eclater(r.x, joueur.y, '#ff6b7a', 10);
    if (vies.value <= 0) finir();
    else dire(`Pas ${r.g} : il faut ${NOM[indice.value].rune}`);
  }
}

function finir() {
  phase.value = 'fin';
  if (score.value > record.value) {
    record.value = score.value;
    try {
      localStorage.setItem(CLE_RECORD, String(score.value));
    } catch {
      // Pas de stockage : le record ne sera pas gardé.
    }
  }
}

function avancer(dt) {
  const dir = (droite ? 1 : 0) - (gauche ? 1 : 0);
  if (dir) cible = joueur.x + dir * 700 * dt;
  cible = Math.min(Math.max(cible, joueur.l / 2), l - joueur.l / 2);
  joueur.x += (cible - joueur.x) * Math.min(1, dt * 18);

  prochaine -= dt;
  if (prochaine <= 0) {
    lacher();
    prochaine = intervalle();
  }

  for (const r of runes) {
    const avant = r.y;
    r.y += r.v * dt;
    if (avant < joueur.y - 14 && r.y >= joueur.y - 14 && Math.abs(r.x - joueur.x) < joueur.l / 2 + 10) {
      r.prise = true;
      attraper(r);
      if (phase.value !== 'jeu') break;
    }
  }
  runes = runes.filter((r) => !r.prise && r.y < h + 40);
  secousse = Math.max(0, secousse - dt);
}

function dessiner(dt) {
  ctx.clearRect(0, 0, l, h);
  ctx.save();
  if (secousse > 0) ctx.translate((Math.random() - 0.5) * 12 * secousse, (Math.random() - 0.5) * 12 * secousse);

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = `700 34px "Noto Sans Runic", "Segoe UI Historic", sans-serif`;
  for (const r of runes) {
    ctx.save();
    ctx.translate(r.x, r.y);
    ctx.rotate(r.r * Math.sin(r.y / 60));
    ctx.shadowColor = r.c;
    ctx.shadowBlur = 14;
    ctx.fillStyle = r.c;
    ctx.fillText(r.g, 0, 0);
    ctx.restore();
  }

  for (const e of eclats) {
    e.t -= dt;
    e.vy += 420 * dt;
    e.x += e.vx * dt;
    e.y += e.vy * dt;
    ctx.globalAlpha = Math.max(0, e.t);
    ctx.fillStyle = e.c;
    ctx.fillRect(e.x - 2, e.y - 2, 4, 4);
  }
  ctx.globalAlpha = 1;
  eclats = eclats.filter((e) => e.t > 0);

  if (joueur && phase.value === 'jeu') {
    const { x, y, l: lj } = joueur;
    const grad = ctx.createLinearGradient(x - lj / 2, 0, x + lj / 2, 0);
    grad.addColorStop(0, '#b4f5a2');
    grad.addColorStop(0.5, '#3fc6d0');
    grad.addColorStop(1, '#9b6bff');
    ctx.shadowColor = '#3fc6d0';
    ctx.shadowBlur = 24;
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.roundRect(x - lj / 2, y - 7, lj, 14, 7);
    ctx.fill();
    ctx.shadowBlur = 0;
  }
  ctx.restore();
}

function boucle(t) {
  image = requestAnimationFrame(boucle);
  const dt = Math.min(0.05, (t - (dernier ?? t)) / 1000);
  dernier = t;
  if (enPause) return;
  if (phase.value === 'jeu') avancer(dt);
  dessiner(dt);
}

function fermer() {
  oeufs.jeu = false;
}

function clavier(e) {
  const k = e.key.toLowerCase();
  if (k === 'escape') return fermer();
  if (phase.value !== 'jeu' && (k === ' ' || k === 'enter')) {
    e.preventDefault();
    return demarrer();
  }
  if (k === 'arrowleft' || k === 'q' || k === 'a') gauche = e.type === 'keydown';
  else if (k === 'arrowright' || k === 'd') droite = e.type === 'keydown';
  else return;
  e.preventDefault();
}

function pointeur(e) {
  if (joueur) cible = e.clientX - toile.value.getBoundingClientRect().left;
}

function toucher(e) {
  if (phase.value !== 'jeu') demarrer();
  pointeur(e);
}

function visibilite() {
  enPause = document.hidden;
  gauche = droite = false;
}

onMounted(async () => {
  ctx = toile.value.getContext('2d');
  dimensionner();
  try {
    await document.fonts.load('700 34px "Noto Sans Runic"', 'ᚱ');
  } catch {
    // La police du système fera l'affaire.
  }
  addEventListener('resize', dimensionner);
  addEventListener('keydown', clavier);
  addEventListener('keyup', clavier);
  document.addEventListener('visibilitychange', visibilite);
  document.body.style.overflow = 'hidden';
  image = requestAnimationFrame(boucle);
});

onBeforeUnmount(() => {
  cancelAnimationFrame(image);
  clearTimeout(dire.minuteur);
  removeEventListener('resize', dimensionner);
  removeEventListener('keydown', clavier);
  removeEventListener('keyup', clavier);
  document.removeEventListener('visibilitychange', visibilite);
  document.body.style.overflow = '';
});
</script>

<template>
  <div class="pluie" role="dialog" aria-modal="true" aria-label="Pluie de runes">
    <canvas ref="toile" class="toile" @pointermove="pointeur" @pointerdown="toucher"></canvas>

    <div ref="hud" class="hud">
      <div class="nom" aria-hidden="true">
        <span
          v-for="(n, i) in NOM"
          :key="i"
          class="rune"
          :class="{ prise: phase === 'jeu' && i < indice, attendue: phase === 'jeu' && i === indice }"
          >{{ n.rune }}</span
        >
      </div>
      <div class="compteurs">
        <span>Score <b>{{ score }}</b></span>
        <span>Tour <b>{{ tour }}</b></span>
        <span class="vies" :aria-label="`${vies} vies`">
          <i v-for="v in 3" :key="v" :class="{ perdue: v > vies }"></i>
        </span>
      </div>
      <button class="fermer" aria-label="Fermer le jeu" @click="fermer">✕</button>
    </div>

    <p v-if="annonce && phase === 'jeu'" class="annonce">{{ annonce }}</p>

    <div v-if="phase !== 'jeu'" class="panneau verre">
      <template v-if="phase === 'accueil'">
        <span class="surtitre">Code Konami</span>
        <h2>Pluie de runes</h2>
        <p>
          Attrape les runes du nom dans l'ordre : <span class="rune">ᚱ ᚨ ᚷ ᚾ…</span> La prochaine est en surbrillance en
          haut. Une mauvaise rune coûte une vie.
        </p>
        <p class="aide">← → ou la souris pour bouger · Échap pour quitter</p>
      </template>
      <template v-else>
        <span class="surtitre">Partie terminée</span>
        <h2>{{ score }} points</h2>
        <p v-if="score && score >= record">Nouveau record !</p>
        <p v-else>Record : {{ record }}</p>
      </template>
      <button class="bouton plein" @click="demarrer">{{ phase === 'accueil' ? 'Jouer' : 'Rejouer' }}</button>
    </div>
  </div>
</template>

<style scoped>
.pluie {
  position: fixed;
  inset: 0;
  z-index: 100;
  background: rgba(8, 9, 14, 0.9);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  touch-action: none;
  user-select: none;
}

.toile {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  cursor: none;
}

.hud {
  position: absolute;
  inset: 0 0 auto;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 8px 20px;
  padding: 14px var(--gouttiere);
  pointer-events: none;
}

.nom {
  display: flex;
  gap: 6px;
  font-size: 1.5rem;
}

.nom .rune {
  color: rgba(255, 255, 255, 0.18);
  transition: color 0.2s, transform 0.2s;
}

.nom .prise {
  color: #5fd4a8;
}

.nom .attendue {
  color: #f4f5fa;
  transform: scale(1.35);
  text-shadow: 0 0 14px #3fc6d0;
}

.compteurs {
  display: flex;
  gap: 18px;
  align-items: center;
  color: var(--discret);
  font-size: 0.9rem;
}

.compteurs b {
  color: var(--texte-fort);
}

.vies {
  display: flex;
  gap: 5px;
}

.vies i {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #3fc6d0;
  box-shadow: 0 0 8px #3fc6d0;
}

.vies i.perdue {
  background: rgba(255, 255, 255, 0.15);
  box-shadow: none;
}

.fermer {
  pointer-events: auto;
  border: 1px solid var(--bord);
  background: var(--verre);
  color: var(--texte);
  border-radius: 999px;
  width: 34px;
  height: 34px;
  cursor: pointer;
}

.annonce {
  position: absolute;
  top: 30%;
  left: 0;
  right: 0;
  text-align: center;
  font-size: clamp(1.2rem, 3vw, 1.8rem);
  font-weight: 650;
  color: var(--texte-fort);
  pointer-events: none;
}

.panneau {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: min(440px, calc(100% - 32px));
  padding: 28px;
  text-align: center;
}

.panneau h2 {
  margin-bottom: 12px;
}

.aide {
  font-size: 0.85rem;
  color: var(--discret);
}
</style>
