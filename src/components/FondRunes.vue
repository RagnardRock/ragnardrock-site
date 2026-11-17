<script setup>
// Le fond du site : des runes à peine visibles, qui s'éclairent et s'écartent
// autour de la souris. Rien ne bouge si le visiteur a demandé moins d'animations.
import { onMounted, onBeforeUnmount, ref } from 'vue';

const toile = ref(null);
const FUTHARK = 'ᚠᚢᚦᚨᚱᚲᚷᚹᚺᚾᛁᛃᛇᛈᛉᛊᛏᛒᛖᛗᛚᛜᛞᛟ';
const PAS = 46; // écart entre deux runes, en pixels
const RAYON = 220; // portée de la souris

let ctx;
let runes = [];
let souris = { x: -9999, y: -9999 };
let cible = { x: -9999, y: -9999 };
let image = 0;
let calme = false;

function placer() {
  const c = toile.value;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  c.width = innerWidth * dpr;
  c.height = innerHeight * dpr;
  ctx = c.getContext('2d');
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  runes = [];
  // Une grille décalée une ligne sur deux, avec un peu de hasard (toujours le même).
  let graine = 7;
  const hasard = () => ((graine = (graine * 16807) % 2147483647) / 2147483647);
  for (let y = PAS / 2, l = 0; y < innerHeight + PAS; y += PAS, l++) {
    for (let x = (l % 2) * (PAS / 2); x < innerWidth + PAS; x += PAS) {
      runes.push({
        x: x + (hasard() - 0.5) * 10,
        y: y + (hasard() - 0.5) * 10,
        g: FUTHARK[Math.floor(hasard() * FUTHARK.length)],
        a: 0.035 + hasard() * 0.04,
      });
    }
  }
  dessiner();
}

function dessiner() {
  ctx.clearRect(0, 0, innerWidth, innerHeight);
  ctx.font = '600 15px "Noto Sans Runic", "Segoe UI Historic", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  for (const r of runes) {
    const dx = r.x - souris.x;
    const dy = r.y - souris.y;
    const d = Math.hypot(dx, dy);
    const p = d < RAYON ? 1 - d / RAYON : 0;
    const force = p * p;
    const ox = d ? (dx / d) * force * 12 : 0;
    const oy = d ? (dy / d) * force * 12 : 0;
    if (force > 0.01) {
      ctx.fillStyle = `rgba(${Math.round(150 - 55 * force)}, ${Math.round(200 + 12 * force)}, ${Math.round(190 - 22 * force)}, ${r.a + force * 0.55})`;
    } else {
      ctx.fillStyle = `rgba(200, 205, 225, ${r.a})`;
    }
    ctx.fillText(r.g, r.x + ox, r.y + oy);
  }
}

function boucle() {
  // La lueur suit la souris avec un léger retard, puis la boucle s'arrête d'elle-même.
  souris.x += (cible.x - souris.x) * 0.18;
  souris.y += (cible.y - souris.y) * 0.18;
  dessiner();
  if (Math.abs(cible.x - souris.x) > 0.5 || Math.abs(cible.y - souris.y) > 0.5) {
    image = requestAnimationFrame(boucle);
  } else {
    image = 0;
  }
}

function bouger(e) {
  if (souris.x < -1000) {
    souris.x = e.clientX;
    souris.y = e.clientY;
  }
  cible = { x: e.clientX, y: e.clientY };
  if (calme) {
    souris = { ...cible };
    dessiner();
  } else if (!image) {
    image = requestAnimationFrame(boucle);
  }
}

function sortir() {
  cible = { x: -9999, y: -9999 };
  souris = { ...cible };
  dessiner();
}

onMounted(async () => {
  calme = matchMedia('(prefers-reduced-motion: reduce)').matches;
  try {
    await document.fonts.load('600 15px "Noto Sans Runic"', 'ᚱ');
  } catch {
    // Police indisponible : celle du système fera l'affaire.
  }
  placer();
  addEventListener('resize', placer);
  addEventListener('pointermove', bouger, { passive: true });
  document.documentElement.addEventListener('pointerleave', sortir);
});

onBeforeUnmount(() => {
  removeEventListener('resize', placer);
  removeEventListener('pointermove', bouger);
  document.documentElement.removeEventListener('pointerleave', sortir);
  cancelAnimationFrame(image);
});
</script>

<template>
  <div class="fond" aria-hidden="true">
    <div class="lueur l1" />
    <div class="lueur l2" />
    <canvas ref="toile" />
  </div>
</template>

<style scoped>
.fond {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  overflow: hidden;
}

canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.lueur {
  position: absolute;
  border-radius: 50%;
  filter: blur(90px);
  opacity: 0.35;
}

.l1 {
  width: 46vw;
  height: 46vw;
  left: -12vw;
  top: -18vw;
  background: radial-gradient(circle, #3fc6d0 0%, transparent 65%);
}

.l2 {
  width: 50vw;
  height: 50vw;
  right: -16vw;
  bottom: -24vw;
  background: radial-gradient(circle, #8b6bff 0%, transparent 65%);
  opacity: 0.25;
}
</style>
