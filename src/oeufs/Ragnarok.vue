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
  [1.3, 'Fenrir brise sa chaîne.'],
  [3.0, 'Jörmungandr sort des eaux.'],
  [4.8, 'Surtr embrase le monde.'],
  [7.75, 'ᚱᚨᚷᚾᚨᚱᛟᚲ', 'runes'],
  [8.9, 'Tout s\'achève.'],
  [9.8, 'Le monde renaît, vert et neuf.', 'renouveau'],
  [11.9, ''],
];
const RUPTURE = 2.5; // Gleipnir cède
const SERPENT = 3.0;
const DUREE_SERPENT = 3.2;
const CHOCS = [0, RUPTURE, 4.8];
const CHUTE = 4.8;
const ECLAIR = 7.4;
const RENOUVEAU = 9.8;
const FONDU = 12.2; // le voile s'efface en douceur avant de rendre la page
const FIN = 13.6;

const calme = matchMedia('(prefers-reduced-motion: reduce)').matches;
let ctx, l, h, dpr, image, debut, dernier;
let morceaux = [];
let braises = [];
let meteores = [];
let pousses = [];
let gouttes = [];
let maillons = null; // les morceaux de Gleipnir après la rupture
const sortie = ref(false);
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
  if (t < SERPENT) return 0;
  if (t < CHUTE) return 0.15 * entre(t, SERPENT, CHUTE);
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

  // Les yeux de Fenrir s'ouvrent dans l'ombre, au-dessus de la chaîne.
  if (t >= 1.1 && t < 4.4) yeux(t);

  // Gleipnir, la chaîne de Fenrir : elle se tend, vibre, puis se rompt en son milieu.
  if (t >= 0.9 && t < 4.4) chaine(t, dt);

  // Jörmungandr, le serpent du monde, jaillit des eaux et traverse l'écran.
  if (t >= SERPENT && t < SERPENT + DUREE_SERPENT + 0.5) serpent(t, dt);
  dessinerGouttes(dt);

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

// --- Fenrir ---

function yeux(t) {
  const cx = l / 2;
  const cy = h * 0.14;
  const ecart = Math.min(150, l * 0.11);
  const taille = Math.min(70, l * 0.05);
  const presence = entre(t, 1.1, 1.9) * (1 - entre(t, 3.6, 4.4));
  // Les paupières s'ouvrent lentement, se plissent quand la chaîne cède.
  const ouverture = entre(t, 1.4, 2.2) * (t > RUPTURE ? 0.55 + 0.45 * entre(t, RUPTURE + 0.4, RUPTURE + 1) : 1);
  const colere = entre(t, RUPTURE, RUPTURE + 0.3);

  // L'ombre de la bête : une masse sombre d'où sortent les yeux.
  const ombre = ctx.createRadialGradient(cx, cy, 0, cx, cy, ecart * 3);
  ombre.addColorStop(0, `rgba(0, 0, 0, ${0.75 * presence})`);
  ombre.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = ombre;
  ctx.fillRect(cx - ecart * 3, cy - ecart * 3, ecart * 6, ecart * 6);

  for (const cote of [-1, 1]) {
    const x = cx + cote * ecart;
    ctx.save();
    ctx.translate(x, cy);
    ctx.rotate(cote * -0.22); // en amande, coin intérieur plus bas : un regard menaçant
    ctx.globalAlpha = presence;
    // Le halo.
    const halo = ctx.createRadialGradient(0, 0, 0, 0, 0, taille * 2.2);
    halo.addColorStop(0, `rgba(255, ${Math.round(170 - 110 * colere)}, 40, 0.35)`);
    halo.addColorStop(1, 'rgba(255, 80, 0, 0)');
    ctx.fillStyle = halo;
    ctx.fillRect(-taille * 2.2, -taille * 2.2, taille * 4.4, taille * 4.4);
    // L'amande de l'œil, découpée par les paupières.
    const hauteur = taille * 0.42 * ouverture;
    if (hauteur > 0.5) {
      ctx.beginPath();
      ctx.moveTo(-taille, 0);
      ctx.quadraticCurveTo(0, -hauteur * 2, taille, 0);
      ctx.quadraticCurveTo(0, hauteur * 2, -taille, 0);
      ctx.save();
      ctx.clip();
      const iris = ctx.createRadialGradient(0, 0, 0, 0, 0, taille);
      iris.addColorStop(0, '#fff3c4');
      iris.addColorStop(0.35, `rgb(255, ${Math.round(190 - 120 * colere)}, 40)`);
      iris.addColorStop(1, `rgb(${Math.round(150 + 60 * colere)}, 40, 10)`);
      ctx.fillStyle = iris;
      ctx.fillRect(-taille, -taille, taille * 2, taille * 2);
      // La pupille fendue, qui se resserre de colère.
      ctx.fillStyle = '#0a0300';
      ctx.beginPath();
      ctx.ellipse(0, 0, taille * (0.14 - 0.07 * colere), taille * 0.6, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
    ctx.restore();
  }
}

// --- Gleipnir ---

const ESPACE_MAILLON = 30;

function dessinerMaillon(x, y, angle, face, alpha) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.globalAlpha = alpha;
  ctx.lineCap = 'round';
  for (const [largeur, couleur] of [[9, '#16181f'], [5, '#8d93a6'], [1.6, '#e6e9f2']]) {
    ctx.lineWidth = largeur;
    ctx.strokeStyle = couleur;
    ctx.beginPath();
    if (face) ctx.ellipse(0, 0, 19, 9, 0, 0, Math.PI * 2);
    else {
      ctx.moveTo(-19, 0);
      ctx.lineTo(19, 0);
    }
    ctx.stroke();
  }
  ctx.restore();
}

function chaine(t, dt) {
  const y0 = h * 0.27;
  const n = Math.ceil((l + 80) / ESPACE_MAILLON);
  const milieu = n / 2;
  const apparition = entre(t, 0.9, 1.3);
  const disparition = 1 - entre(t, 3.6, 4.4);
  const alpha = apparition * disparition;

  if (t < RUPTURE) {
    // La chaîne se tend : elle vibre de plus en plus vite, de plus en plus fort.
    const tension = entre(t, 1.3, RUPTURE);
    for (let i = 0; i <= n; i++) {
      const x = -40 + i * ESPACE_MAILLON;
      const pres = 1 - Math.abs(i - milieu) / milieu;
      const y = y0 + Math.sin(i * 0.9 + t * (20 + 50 * tension)) * tension * 5 * pres + (1 - tension) * 40 * Math.sin((i / n) * Math.PI);
      dessinerMaillon(x, y, 0, i % 2 === 0, alpha);
    }
    return;
  }

  // Rupture : les maillons du milieu volent en éclats, les deux moitiés retombent en fouettant.
  if (!maillons) {
    maillons = [];
    for (let i = Math.floor(milieu) - 2; i <= Math.floor(milieu) + 2; i++) {
      maillons.push({ x: -40 + i * ESPACE_MAILLON, y: y0, vx: hasard(-500, 500), vy: hasard(-600, -150), a: 0, va: hasard(-14, 14), face: i % 2 === 0 });
    }
  }
  const chute = 1 - Math.pow(1 - entre(t, RUPTURE, RUPTURE + 1.1), 3);
  const fouet = Math.sin(entre(t, RUPTURE, RUPTURE + 1.1) * Math.PI) * 0.35;
  const moitie = Math.floor(milieu) - 3;
  const longueur = moitie * ESPACE_MAILLON;
  for (const cote of [-1, 1]) {
    const ax = cote < 0 ? -40 : l + 40;
    for (let k = 0; k <= moitie; k++) {
      const d = k * ESPACE_MAILLON;
      const a = (chute * 1.35 + fouet * (d / longueur)) * (0.55 + 0.45 * (d / longueur));
      const dx = Math.cos(a) * d * -cote;
      const dy = Math.sin(a) * d;
      dessinerMaillon(ax + dx, y0 + dy, cote < 0 ? a : -a, k % 2 === 0, alpha);
    }
  }
  for (const m of maillons) {
    m.vy += 900 * dt;
    m.x += m.vx * dt;
    m.y += m.vy * dt;
    m.a += m.va * dt;
    dessinerMaillon(m.x, m.y, m.a, m.face, alpha);
  }
  // L'étincelle de la rupture.
  const eclat = 1 - entre(t, RUPTURE, RUPTURE + 0.5);
  if (eclat > 0) {
    const g = ctx.createRadialGradient(l / 2, y0, 0, l / 2, y0, 220);
    g.addColorStop(0, `rgba(255, 240, 210, ${eclat})`);
    g.addColorStop(1, 'rgba(255, 120, 40, 0)');
    ctx.fillStyle = g;
    ctx.fillRect(l / 2 - 220, y0 - 220, 440, 440);
  }
}

// --- Jörmungandr ---

function trajet(s, R) {
  // Un grand bond hors de l'eau, de gauche à droite, avec une lente ondulation.
  const u = Math.min(1, Math.max(0, s));
  return {
    x: -R * 4 + s * (l + R * 8),
    y: h + R * 2.4 - Math.sin(u * Math.PI) * h * 0.6 + Math.sin(s * 9) * R * 0.5,
  };
}

function serpent(t, dt) {
  const R = Math.min(64, Math.max(28, h * 0.065));
  const tete = (t - SERPENT) / DUREE_SERPENT;
  const N = 140;
  const pas = 0.0055;

  // L'échine, de la queue vers la tête, avec l'épaisseur et la direction du « ciel » à chaque point.
  const echine = [];
  for (let k = N; k >= 0; k--) echine.push({ ...trajet(tete - k * pas, R), u: k / N });
  for (let i = 0; i < echine.length; i++) {
    const a = echine[Math.max(0, i - 1)];
    const b = echine[Math.min(echine.length - 1, i + 1)];
    const dir = Math.atan2(b.y - a.y, b.x - a.x);
    let nx = Math.sin(dir);
    let ny = -Math.cos(dir);
    if (ny > 0) {
      nx = -nx;
      ny = -ny;
    }
    const p = echine[i];
    p.dir = dir;
    p.nx = nx;
    p.ny = ny;
    // Même épaisseur sur tout le corps, puis une queue qui s'effile sur le dernier tiers.
    p.r = Math.max(2, R * Math.pow(Math.min(1, (1 - p.u) / 0.4), 0.85));
  }

  const trait = (decalage, largeur, couleur) => {
    ctx.strokeStyle = couleur;
    ctx.lineCap = 'round';
    for (let i = 1; i < echine.length; i++) {
      const a = echine[i - 1];
      const b = echine[i];
      ctx.lineWidth = largeur(b);
      ctx.beginPath();
      ctx.moveTo(a.x + a.nx * decalage(a), a.y + a.ny * decalage(a));
      ctx.lineTo(b.x + b.nx * decalage(b), b.y + b.ny * decalage(b));
      ctx.stroke();
    }
  };

  // Les nageoires du dos, derrière le corps.
  ctx.fillStyle = '#0b2e29';
  for (let i = 4; i < echine.length - 6; i += 5) {
    const p = echine[i];
    if (p.r < 6) continue;
    const cx = Math.cos(p.dir);
    const cy = Math.sin(p.dir);
    ctx.beginPath();
    ctx.moveTo(p.x + p.nx * p.r * 0.6 - cx * p.r * 0.5, p.y + p.ny * p.r * 0.6 - cy * p.r * 0.5);
    ctx.lineTo(p.x + p.nx * p.r * 1.55 + cx * p.r * 0.25, p.y + p.ny * p.r * 1.55 + cy * p.r * 0.25);
    ctx.lineTo(p.x + p.nx * p.r * 0.6 + cx * p.r * 0.5, p.y + p.ny * p.r * 0.6 + cy * p.r * 0.5);
    ctx.fill();
  }

  // La tête, dessinée avant le corps : le bout arrondi du cou la recouvre et la raccorde sans couture.
  const b = echine[echine.length - 1];
  const haut = Math.cos(b.dir) >= 0 ? 1 : -1; // garde le dessus de la tête vers le ciel
  const gueule = 0.28 + 0.18 * Math.sin(t * 6);
  ctx.save();
  ctx.translate(b.x + Math.cos(b.dir) * R * 0.4, b.y + Math.sin(b.dir) * R * 0.4);
  ctx.rotate(b.dir);
  ctx.scale(1.3, 1.3 * haut); // une tête plus large que le cou, comme un vrai serpent
  ctx.lineJoin = 'round';
  // Cornes vers l'arrière.
  ctx.fillStyle = '#0b2e29';
  for (const [x0, lg, ht] of [[R * 0.1, R * 1.3, R * 1.15], [R * 0.55, R * 0.9, R * 0.95]]) {
    ctx.beginPath();
    ctx.moveTo(x0, -R * 0.6);
    ctx.quadraticCurveTo(x0 - lg * 0.5, -ht, x0 - lg, -ht * 1.05);
    ctx.lineTo(x0 + R * 0.3, -R * 0.45);
    ctx.fill();
  }
  // Mâchoire inférieure, qui s'ouvre et se referme.
  ctx.save();
  ctx.translate(R * 0.5, R * 0.25);
  ctx.rotate(gueule);
  ctx.fillStyle = '#041513';
  ctx.beginPath();
  ctx.moveTo(-R * 0.7, -R * 0.05);
  ctx.quadraticCurveTo(R * 0.6, R * 0.55, R * 1.9, R * 0.02);
  ctx.lineTo(-R * 0.7, -R * 0.3);
  ctx.fill();
  ctx.fillStyle = '#b0cd96';
  ctx.beginPath();
  ctx.moveTo(-R * 0.6, R * 0.02);
  ctx.quadraticCurveTo(R * 0.6, R * 0.42, R * 1.75, R * 0.0);
  ctx.lineTo(R * 1.6, -R * 0.06);
  ctx.lineTo(-R * 0.6, -R * 0.12);
  ctx.fill();
  ctx.fillStyle = '#f2ead8';
  for (let i = 0; i < 4; i++) {
    const fx = R * (0.1 + i * 0.38);
    ctx.beginPath();
    ctx.moveTo(fx, -R * 0.08);
    ctx.lineTo(fx + R * 0.09, -R * (i === 0 ? 0.42 : 0.26));
    ctx.lineTo(fx + R * 0.18, -R * 0.08);
    ctx.fill();
  }
  ctx.restore();
  // Crâne et mâchoire supérieure : même hauteur que le cou à l'arrière, puis le museau qui s'affine.
  const crane = () => {
    ctx.beginPath();
    ctx.moveTo(-R * 0.7, -R * 0.9);
    ctx.quadraticCurveTo(R * 0.3, -R * 1.0, R * 1.05, -R * 0.66);
    ctx.quadraticCurveTo(R * 1.85, -R * 0.36, R * 2.4, R * 0.02);
    ctx.quadraticCurveTo(R * 1.5, R * 0.3, R * 0.6, R * 0.36);
    ctx.quadraticCurveTo(R * 0.0, R * 0.45, -R * 0.7, R * 0.9);
    ctx.closePath();
  };
  ctx.strokeStyle = '#041513';
  ctx.lineWidth = 5;
  crane();
  ctx.stroke();
  const g = ctx.createLinearGradient(0, -R, 0, R * 0.5);
  g.addColorStop(0, '#3a9f84');
  g.addColorStop(0.5, '#1b5f51');
  g.addColorStop(1, '#14493f');
  ctx.fillStyle = g;
  crane();
  ctx.fill();
  // Arcade sourcilière au-dessus de l'œil, et narine.
  ctx.strokeStyle = 'rgba(4, 30, 26, 0.7)';
  ctx.lineWidth = R * 0.08;
  ctx.beginPath();
  ctx.moveTo(R * 0.25, -R * 0.62);
  ctx.quadraticCurveTo(R * 0.75, -R * 0.78, R * 1.15, -R * 0.5);
  ctx.stroke();
  ctx.fillStyle = '#041513';
  ctx.beginPath();
  ctx.ellipse(R * 2.05, -R * 0.12, R * 0.07, R * 0.04, 0.3, 0, Math.PI * 2);
  ctx.fill();
  // Dents du haut.
  ctx.fillStyle = '#f2ead8';
  for (let i = 0; i < 5; i++) {
    const fx = R * (0.7 + i * 0.32);
    const lg = i === 0 ? 0.42 : 0.24;
    ctx.beginPath();
    ctx.moveTo(fx, R * 0.26 - i * R * 0.04);
    ctx.lineTo(fx + R * 0.08, R * (0.26 + lg) - i * R * 0.04);
    ctx.lineTo(fx + R * 0.17, R * 0.24 - i * R * 0.04);
    ctx.fill();
  }
  // L'œil, fendu, qui luit.
  ctx.shadowColor = '#ffd23a';
  ctx.shadowBlur = 18;
  ctx.fillStyle = '#ffd23a';
  ctx.beginPath();
  ctx.ellipse(R * 0.75, -R * 0.38, R * 0.2, R * 0.12, -0.15, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.fillStyle = '#1a0d00';
  ctx.beginPath();
  ctx.ellipse(R * 0.75, -R * 0.38, R * 0.045, R * 0.11, -0.15, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Le corps : contour, teinte de base, ventre clair, reflet sur le dos.
  trait(() => 0, (p) => p.r * 2 + 5, '#041513');
  trait(() => 0, (p) => p.r * 2, '#1b5f51');
  trait((p) => -p.r * 0.58, (p) => p.r * 0.55, 'rgba(160, 190, 140, 0.45)');
  trait((p) => p.r * 0.38, (p) => p.r * 0.5, 'rgba(84, 205, 165, 0.35)');

  // Les écailles : des chevrons sombres le long du corps.
  ctx.strokeStyle = 'rgba(4, 30, 26, 0.3)';
  for (let i = 3; i < echine.length - 2; i += 3) {
    const p = echine[i];
    if (p.r < 5) continue;
    ctx.lineWidth = Math.max(1, p.r * 0.07);
    const cx = Math.cos(p.dir) * p.r * 0.3;
    const cy = Math.sin(p.dir) * p.r * 0.3;
    ctx.beginPath();
    ctx.moveTo(p.x + p.nx * p.r * 0.8 - cx, p.y + p.ny * p.r * 0.8 - cy);
    ctx.lineTo(p.x + p.nx * p.r * 0.1, p.y + p.ny * p.r * 0.1);
    ctx.lineTo(p.x - p.nx * p.r * 0.6 - cx, p.y - p.ny * p.r * 0.6 - cy);
    ctx.stroke();
  }

  // Les gerbes d'eau là où le corps traverse la surface.
  if (!calme) {
    for (let i = 0; i < echine.length; i += 6) {
      const p = echine[i];
      if (Math.abs(p.y - h) < p.r && Math.random() < dt * 20) {
        for (let j = 0; j < 4; j++) gouttes.push({ x: p.x + hasard(-p.r, p.r), y: h, vx: hasard(-120, 120), vy: hasard(-520, -220), t: hasard(0.6, 1.1) });
      }
    }
  }

}

function dessinerGouttes(dt) {
  ctx.fillStyle = 'rgba(190, 235, 255, 0.8)';
  for (const g of gouttes) {
    g.t -= dt;
    g.vy += 1100 * dt;
    g.x += g.vx * dt;
    g.y += g.vy * dt;
    ctx.globalAlpha = Math.min(1, g.t * 2);
    ctx.beginPath();
    ctx.arc(g.x, g.y, 2.5, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
  gouttes = gouttes.filter((g) => g.t > 0 && g.y < h + 20);
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
  if (t >= FONDU) sortie.value = true;

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
  <div class="ragnarok" :class="{ sortie }" role="dialog" aria-modal="true" aria-label="Ragnarök">
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

.ragnarok.sortie {
  opacity: 0;
  transition: opacity 1.4s ease;
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
