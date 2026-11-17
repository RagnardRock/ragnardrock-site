<script setup>
// Commande cachée « ragnarok » : la prophétie s'accomplit sur le site.
// Le cor sonne, Fenrir s'éveille, le serpent sort des eaux, Surtr embrase tout :
// les blocs de la page tombent dans le feu, puis le monde renaît et tout remonte à sa place.
// Échap (ou « Passer ») arrête tout et remet la page en ordre.
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { journal, oeufs } from './oeufs.js';

const toile = ref(null);
const texte = ref('');
const classeTexte = ref('');

const PROPHETIE = [
  [0, 'Le cor Gjallarhorn retentit.'],
  [1.4, 'Fenrir brise sa chaîne.'],
  [2.8, 'Le serpent du monde sort des eaux.'],
  [4.2, 'Surtr embrase le monde.'],
  [7.35, 'ᚱᚨᚷᚾᚨᚱᛟᚲ', 'runes'],
  [8.5, 'Tout s\'achève.'],
  [9.4, 'Le monde renaît, vert et neuf.', 'renouveau'],
  [11.2, ''],
];
const CHOCS = [0, 1.4, 2.8, 4.2];
const CHUTE = 4.2;
const ECLAIR = 7;
const RENOUVEAU = 9.4;
const FIN = 12;

const calme = matchMedia('(prefers-reduced-motion: reduce)').matches;
let ctx, l, h, dpr, image, debut, dernier;
let morceaux = [];
let braises = [];
let meteores = [];
let pousses = [];
let etape = 0;
let tombes = false;
let releves = false;
let fini = false;

function dimensionner() {
  const c = toile.value;
  dpr = Math.min(devicePixelRatio || 1, 2);
  l = innerWidth;
  h = innerHeight;
  c.width = l * dpr;
  c.height = h * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

const entre = (t, a, b) => Math.min(1, Math.max(0, (t - a) / (b - a)));
const hasard = (a, b) => a + Math.random() * (b - a);

// --- La page elle-même ---

function preparerPage() {
  morceaux = [...document.querySelectorAll('.entete, #app main > *, .pied, .fond')];
  document.body.style.overflow = 'hidden';
  for (const m of morceaux) {
    if (m.classList.contains('fond')) continue;
    m.style.transition = 'filter 4s ease-in';
    m.style.filter = 'sepia(0.9) hue-rotate(-40deg) saturate(3.5) brightness(0.7)';
  }
}

function fairetomber() {
  tombes = true;
  if (calme) return;
  for (const m of morceaux) {
    if (m.classList.contains('fond')) continue;
    const delai = hasard(0, 1.8);
    const angle = hasard(6, 32) * (Math.random() < 0.5 ? -1 : 1);
    m.style.transition = `transform 1.5s cubic-bezier(.55,0,1,.45) ${delai}s, filter 2s`;
    m.style.transform = `translateY(${Math.round(h * 1.3)}px) rotate(${angle.toFixed(1)}deg)`;
  }
}

function releverPage() {
  releves = true;
  morceaux.forEach((m, i) => {
    m.style.translate = '';
    if (m.classList.contains('fond')) return;
    m.style.transition = `transform 1.3s cubic-bezier(.2,.9,.25,1.05) ${i * 0.07}s, filter 2s ease-out`;
    m.style.transform = '';
    m.style.filter = '';
  });
}

function nettoyerPage() {
  for (const m of morceaux) {
    m.style.transition = '';
    m.style.transform = '';
    m.style.filter = '';
    m.style.translate = '';
  }
  document.body.style.overflow = '';
}

// Les secousses passent par « translate », pour ne pas gêner « transform » qui fait tomber les blocs.
function secouer(force) {
  if (calme) return;
  for (const m of morceaux) {
    m.style.translate = force > 0.3 ? `${hasard(-force, force).toFixed(1)}px ${hasard(-force, force).toFixed(1)}px` : '';
  }
}

// --- Le dessin ---

function feu(t) {
  if (t < 2.8) return 0;
  if (t < CHUTE) return 0.15 * entre(t, 2.8, CHUTE);
  if (t < ECLAIR) return 0.15 + 0.65 * entre(t, CHUTE, ECLAIR);
  return 0;
}

function dessiner(t, dt) {
  ctx.clearRect(0, 0, l, h);

  // L'ombre rouge qui gagne l'écran.
  const sombre = t < ECLAIR ? 0.25 + 0.4 * entre(t, 0, ECLAIR) : 0;
  if (sombre) {
    const v = ctx.createRadialGradient(l / 2, h / 2, Math.min(l, h) * 0.2, l / 2, h / 2, Math.max(l, h) * 0.75);
    v.addColorStop(0, `rgba(40, 0, 0, ${sombre * 0.4})`);
    v.addColorStop(1, `rgba(60, 0, 0, ${sombre})`);
    ctx.fillStyle = v;
    ctx.fillRect(0, 0, l, h);
  }

  // Les ondes du cor et des grands coups.
  for (const c of CHOCS) {
    const age = t - c;
    if (age < 0 || age > 1.3) continue;
    const r = age * Math.max(l, h) * 0.9;
    ctx.strokeStyle = `rgba(255, 170, 120, ${0.5 * (1 - age / 1.3)})`;
    ctx.lineWidth = 3 + 20 * (1 - age / 1.3);
    ctx.beginPath();
    ctx.arc(l / 2, h / 2, r, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Les yeux de Fenrir, dans le noir.
  const yeux = entre(t, 1.5, 2.1) * (1 - entre(t, 3.6, 4.2));
  if (yeux > 0) {
    const clignement = Math.abs(Math.sin(t * 1.7)) > 0.97 ? 0.15 : 1;
    ctx.save();
    ctx.shadowColor = '#ff2a2a';
    ctx.shadowBlur = 40;
    ctx.fillStyle = `rgba(255, 60, 40, ${yeux})`;
    for (const cote of [-1, 1]) {
      ctx.beginPath();
      ctx.ellipse(l / 2 + cote * 70, h * 0.22, 26, 9 * clignement, cote * -0.25, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  // Le serpent du monde : une longue ondulation qui sort du bas de l'écran.
  const serpent = entre(t, 2.8, 3.8) * (1 - entre(t, 5, 6));
  if (serpent > 0) {
    ctx.save();
    ctx.lineCap = 'round';
    const base = h + 40 - serpent * h * 0.3;
    for (const [largeur, couleur] of [[46, '#0d2a26'], [30, '#1d5a4c'], [6, 'rgba(120, 255, 210, 0.35)']]) {
      ctx.lineWidth = largeur;
      ctx.strokeStyle = couleur;
      ctx.beginPath();
      for (let x = -60; x <= l + 60; x += 12) {
        const y = base + Math.sin(x / 120 - t * 3) * 60 + Math.sin(x / 47 + t) * 10;
        x === -60 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
    ctx.restore();
  }

  // Le feu de Surtr.
  const f = feu(t);
  if (f > 0) {
    const haut = h * f;
    const g = ctx.createLinearGradient(0, h, 0, h - haut * 1.3);
    g.addColorStop(0, 'rgba(255, 220, 120, 0.95)');
    g.addColorStop(0.25, 'rgba(255, 110, 30, 0.85)');
    g.addColorStop(0.6, 'rgba(180, 30, 10, 0.5)');
    g.addColorStop(1, 'rgba(80, 0, 0, 0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.moveTo(0, h);
    for (let x = 0; x <= l; x += 16) {
      const y = h - haut + Math.sin(x / 40 + t * 9) * 18 * f + Math.sin(x / 13 - t * 14) * 9 * f;
      ctx.lineTo(x, y);
    }
    ctx.lineTo(l, h);
    ctx.fill();
  }

  // Les braises qui montent.
  if (f > 0 && !calme) {
    for (let i = 0; i < f * 14; i++) {
      braises.push({ x: hasard(0, l), y: h - hasard(0, h * f), vx: hasard(-30, 30), vy: hasard(-260, -80), t: hasard(0.8, 2), s: hasard(1, 3.5) });
    }
  }
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  for (const b of braises) {
    b.t -= dt;
    b.x += (b.vx + Math.sin(b.y / 30) * 30) * dt;
    b.y += b.vy * dt;
    ctx.fillStyle = `rgba(255, ${Math.round(120 + 100 * Math.min(1, b.t))}, 40, ${Math.min(1, b.t)})`;
    ctx.fillRect(b.x, b.y, b.s, b.s);
  }
  ctx.restore();
  braises = braises.filter((b) => b.t > 0 && b.y > -10);

  // Les runes en feu qui tombent du ciel.
  if (t > CHUTE && t < ECLAIR && !calme && Math.random() < dt * 9) {
    const g = 'ᚠᚢᚦᚨᚱᚲᚷᚹᚺᚾᛁᛃᛇᛈᛉᛊᛏᛒᛖᛗᛚᛜᛞᛟ'[Math.floor(Math.random() * 24)];
    meteores.push({ g, x: hasard(-0.1, 1.1) * l, y: -40, vx: hasard(-160, 160), vy: hasard(500, 850), taille: hasard(22, 54) });
  }
  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  for (const m of meteores) {
    m.x += m.vx * dt;
    m.y += m.vy * dt;
    const trainee = ctx.createLinearGradient(m.x, m.y, m.x - m.vx * 0.25, m.y - m.vy * 0.25);
    trainee.addColorStop(0, 'rgba(255, 160, 60, 0.7)');
    trainee.addColorStop(1, 'rgba(255, 60, 0, 0)');
    ctx.strokeStyle = trainee;
    ctx.lineWidth = m.taille * 0.35;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(m.x, m.y);
    ctx.lineTo(m.x - m.vx * 0.25, m.y - m.vy * 0.25);
    ctx.stroke();
    ctx.shadowColor = '#ff7a1a';
    ctx.shadowBlur = 20;
    ctx.fillStyle = '#ffe2b0';
    ctx.font = `700 ${m.taille}px "Noto Sans Runic", sans-serif`;
    ctx.fillText(m.g, m.x, m.y);
    ctx.shadowBlur = 0;
  }
  ctx.restore();
  meteores = meteores.filter((m) => m.y < h + 80);

  // L'éclair blanc, puis le noir complet, puis le jour qui revient.
  if (t >= ECLAIR) {
    const blanc = 1 - entre(t, ECLAIR + 0.15, ECLAIR + 0.8);
    const noir = 1 - entre(t, RENOUVEAU, RENOUVEAU + 1.6);
    ctx.fillStyle = `rgba(4, 4, 8, ${noir})`;
    ctx.fillRect(0, 0, l, h);
    if (blanc > 0) {
      ctx.fillStyle = `rgba(255, 245, 230, ${blanc})`;
      ctx.fillRect(0, 0, l, h);
    }
  }

  // Le renouveau : une lueur verte et des pousses qui montent.
  if (t >= RENOUVEAU) {
    const vert = entre(t, RENOUVEAU, RENOUVEAU + 0.8) * (1 - entre(t, FIN - 1.5, FIN));
    const g = ctx.createRadialGradient(l / 2, h * 0.6, 0, l / 2, h * 0.6, Math.max(l, h) * 0.7);
    g.addColorStop(0, `rgba(120, 255, 170, ${0.22 * vert})`);
    g.addColorStop(1, 'rgba(60, 200, 160, 0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, l, h);
    if (t < FIN - 1.5 && !calme) {
      for (let i = 0; i < 3; i++) pousses.push({ x: hasard(0, l), y: h + 10, vy: hasard(-140, -60), t: hasard(1.5, 3), s: hasard(2, 4) });
    }
  }
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  for (const p of pousses) {
    p.t -= dt;
    p.y += p.vy * dt;
    p.x += Math.sin(p.y / 25) * 0.6;
    ctx.fillStyle = `rgba(150, 255, 180, ${Math.min(0.8, p.t / 2)})`;
    ctx.beginPath();
    ctx.ellipse(p.x, p.y, p.s, p.s * 1.8, 0.6, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
  pousses = pousses.filter((p) => p.t > 0);
}

// Intensité des secousses : un à-coup à chaque grand moment, puis le grondement de l'incendie.
function force(t) {
  let s = 0;
  for (const c of CHOCS) if (t >= c) s = Math.max(s, (6 + c * 2) * Math.exp(-(t - c) * 3));
  if (t > CHUTE && t < ECLAIR) s = Math.max(s, 6 + 10 * entre(t, CHUTE, ECLAIR));
  return s;
}

function boucle(maintenant) {
  image = requestAnimationFrame(boucle);
  debut ??= maintenant;
  const t = (maintenant - debut) / 1000;
  const dt = Math.min(0.05, (maintenant - (dernier ?? maintenant)) / 1000);
  dernier = maintenant;

  while (etape < PROPHETIE.length && t >= PROPHETIE[etape][0]) {
    const [, phrase, classe = ''] = PROPHETIE[etape++];
    texte.value = phrase;
    classeTexte.value = classe;
  }
  if (!tombes && t >= CHUTE) fairetomber();
  if (!releves && t >= RENOUVEAU) releverPage();
  if (!releves) secouer(force(t));

  dessiner(t, dt);
  if (t >= FIN) terminer();
}

function terminer() {
  if (fini) return;
  fini = true;
  cancelAnimationFrame(image);
  nettoyerPage();
  journal.value.push({ t: '… et le monde renaît, vert et neuf. Le site aussi.', c: 'discret' });
  oeufs.ragnarok = false;
  oeufs.terminal = true;
}

function clavier(e) {
  if (e.key === 'Escape') terminer();
}

onMounted(() => {
  ctx = toile.value.getContext('2d');
  dimensionner();
  preparerPage();
  addEventListener('resize', dimensionner);
  addEventListener('keydown', clavier);
  image = requestAnimationFrame(boucle);
});

onBeforeUnmount(() => {
  cancelAnimationFrame(image);
  removeEventListener('resize', dimensionner);
  removeEventListener('keydown', clavier);
  if (!fini) nettoyerPage();
});
</script>

<template>
  <div class="ragnarok" role="dialog" aria-modal="true" aria-label="Ragnarök">
    <canvas ref="toile" class="toile" aria-hidden="true"></canvas>
    <Transition name="phrase" mode="out-in">
      <p v-if="texte" :key="texte" class="phrase" :class="classeTexte" aria-live="assertive">{{ texte }}</p>
    </Transition>
    <button class="passer" @click="terminer">Passer</button>
  </div>
</template>

<style scoped>
.ragnarok {
  position: fixed;
  inset: 0;
  z-index: 95;
  pointer-events: none;
}

.toile {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.phrase {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  margin: -1em 0 0;
  padding: 0.6em var(--gouttiere);
  /* Un voile sombre derrière la phrase, pour qu'elle reste lisible par-dessus la page. */
  background: radial-gradient(ellipse 50% 100% at center, rgba(0, 0, 0, 0.55), transparent 75%);
  text-align: center;
  font-size: clamp(1.4rem, 4vw, 2.6rem);
  font-weight: 700;
  letter-spacing: -0.01em;
  color: #ffe9d6;
  text-shadow: 0 0 24px rgba(255, 90, 30, 0.9), 0 2px 4px rgba(0, 0, 0, 0.8);
}

.phrase.runes {
  font-family: var(--police-runes);
  font-size: clamp(2.4rem, 9vw, 6rem);
  letter-spacing: 0.08em;
  color: #ffd9b0;
  text-shadow: 0 0 40px rgba(255, 120, 40, 1);
}

.phrase.renouveau {
  color: #e8fff0;
  text-shadow: 0 0 28px rgba(110, 255, 170, 0.9), 0 2px 4px rgba(0, 0, 0, 0.6);
}

.phrase-enter-active,
.phrase-leave-active {
  transition: opacity 0.35s, transform 0.35s, filter 0.35s;
}

.phrase-enter-from {
  opacity: 0;
  transform: scale(1.15);
  filter: blur(8px);
}

.phrase-leave-to {
  opacity: 0;
  transform: scale(0.95);
  filter: blur(6px);
}

.passer {
  position: absolute;
  right: var(--gouttiere);
  bottom: 20px;
  pointer-events: auto;
  padding: 6px 14px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(0, 0, 0, 0.4);
  color: rgba(255, 255, 255, 0.75);
  font: inherit;
  font-size: 0.85rem;
  cursor: pointer;
}
</style>
