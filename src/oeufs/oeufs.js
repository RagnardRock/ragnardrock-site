// Les surprises cachées du site :
// - le code Konami (↑ ↑ ↓ ↓ ← → ← → B A) lance la Pluie de runes, un petit jeu ;
// - la touche ² (en haut à gauche du clavier) ouvre un terminal ;
// - la commande « pixel » du terminal passe le site en mode pixel.
// Sur mobile, toucher cinq fois les runes du pied de page ouvre le terminal.
import { reactive, watch } from 'vue';

const CLE_PIXEL = 'mode-pixel';

function lire(cle) {
  try {
    return localStorage.getItem(cle);
  } catch {
    return null;
  }
}

function ecrire(cle, valeur) {
  try {
    if (valeur === null) localStorage.removeItem(cle);
    else localStorage.setItem(cle, valeur);
  } catch {
    // Stockage bloqué (navigation privée…) : le réglage ne survivra pas au rechargement.
  }
}

export const oeufs = reactive({
  jeu: false,
  terminal: false,
  pixel: lire(CLE_PIXEL) === '1',
});

// La police pixel n'est chargée que si quelqu'un en a besoin.
let policePixel = null;
function appliquerPixel(actif) {
  if (actif && !policePixel) policePixel = import('@fontsource/pixelify-sans/index.css');
  document.documentElement.classList.toggle('pixel', actif);
  ecrire(CLE_PIXEL, actif ? '1' : null);
}

const KONAMI = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let pas = 0;

function dansUnChamp(cible) {
  return cible instanceof HTMLElement && (cible.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(cible.tagName));
}

function touche(e) {
  if (e.ctrlKey || e.metaKey || e.altKey) return;

  // ² sur un clavier AZERTY, ` sur un QWERTY : c'est la même touche physique.
  if (e.code === 'Backquote' && !oeufs.jeu) {
    if (dansUnChamp(e.target) && !oeufs.terminal) return;
    e.preventDefault();
    oeufs.terminal = !oeufs.terminal;
    return;
  }

  if (oeufs.jeu || oeufs.terminal || dansUnChamp(e.target)) return;
  const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
  pas = k === KONAMI[pas] ? pas + 1 : k === KONAMI[0] ? 1 : 0;
  if (pas === KONAMI.length) {
    pas = 0;
    oeufs.jeu = true;
  }
}

export function installerOeufs() {
  appliquerPixel(oeufs.pixel);
  watch(() => oeufs.pixel, appliquerPixel);
  addEventListener('keydown', touche);
  console.log(
    '%cᚱᚨᚷᚾᚨᚱᛞᚱᛟᚲᚲ%c\nCurieux ? Appuie sur la touche ² (ou `) pour ouvrir le terminal.',
    'font-size: 20px; color: #3fc6d0',
    'color: inherit',
  );
}

// Transcription en Futhark ancien, lettre à lettre (comme le nom sur l'accueil).
const FUTHARK = {
  a: 'ᚨ', b: 'ᛒ', c: 'ᚲ', d: 'ᛞ', e: 'ᛖ', f: 'ᚠ', g: 'ᚷ', h: 'ᚺ', i: 'ᛁ', j: 'ᛃ', k: 'ᚲ', l: 'ᛚ', m: 'ᛗ',
  n: 'ᚾ', o: 'ᛟ', p: 'ᛈ', q: 'ᚲ', r: 'ᚱ', s: 'ᛊ', t: 'ᛏ', u: 'ᚢ', v: 'ᚹ', w: 'ᚹ', x: 'ᚲᛊ', y: 'ᛁ', z: 'ᛉ',
};

export function enRunes(texte) {
  return texte
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/th/g, 'ᚦ')
    .replace(/[a-z]/g, (l) => FUTHARK[l]);
}

export const NOM = [...'RagnardRock'].map((l) => ({ lettre: l, rune: FUTHARK[l.toLowerCase()] }));
