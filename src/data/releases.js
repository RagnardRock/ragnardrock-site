// Les versions des outils, tirées des Releases GitHub du dépôt atelier.
//
// 1. /releases.json : la copie faite à la construction du site (toujours là).
// 2. Puis, en direct, la première page de l'API GitHub pour les versions sorties
//    depuis. Le résultat est gardé 30 minutes dans le navigateur : l'API sans compte
//    n'accepte que 60 appels par heure et par visiteur.

import { reactive } from 'vue';
import { DEPOT, outilDeTag } from './outils.js';
import { publiees } from './format-release.js';

const CLE_CACHE = 'releases-direct';
const DUREE_CACHE = 30 * 60 * 1000;

export const etat = reactive({
  releases: [],
  pret: false,
  erreur: null,
});

let lancement = null;

export function chargerReleases() {
  if (!lancement) lancement = charger();
  return lancement;
}

async function charger() {
  try {
    const rep = await fetch('/releases.json', { cache: 'no-cache' });
    if (rep.ok) fusionner((await rep.json()).releases || []);
  } catch {
    // Pas de copie : on compte sur le direct.
  }
  etat.pret = true;
  try {
    fusionner(await direct());
  } catch (e) {
    if (!etat.releases.length) etat.erreur = e.message;
  }
}

async function direct() {
  const cache = lireCache();
  if (cache) return cache;
  const rep = await fetch(`https://api.github.com/repos/${DEPOT}/releases?per_page=40`, {
    headers: { Accept: 'application/vnd.github.html+json' },
  });
  if (!rep.ok) throw new Error(`GitHub a répondu ${rep.status}`);
  const liste = publiees(await rep.json());
  try {
    localStorage.setItem(CLE_CACHE, JSON.stringify({ le: Date.now(), liste }));
  } catch {
    // Stockage refusé (navigation privée…) : tant pis, on rappellera l'API.
  }
  return liste;
}

function lireCache() {
  try {
    const c = JSON.parse(localStorage.getItem(CLE_CACHE));
    if (c && Date.now() - c.le < DUREE_CACHE) return c.liste;
  } catch {
    // Rien de lisible.
  }
  return null;
}

function fusionner(liste) {
  const parTag = new Map(etat.releases.map((r) => [r.tag, r]));
  for (const r of liste) parTag.set(r.tag, r);
  etat.releases = [...parTag.values()]
    .filter((r) => outilDeTag(r.tag))
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function releasesDe(o) {
  return etat.releases.filter((r) => r.tag.startsWith(o.prefixe));
}

export function derniere(o) {
  return releasesDe(o)[0] || null;
}

export function versionDe(r) {
  return r.tag.replace(/^.*-v/, '');
}

// L'installeur Windows d'une version (« Tafl-Setup-1.42.0.exe »).
export function installeur(r) {
  return r?.fichiers.find((f) => /-Setup-.*\.exe$/i.test(f.nom)) || null;
}

const FORMAT_DATE = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });

export function dateLisible(iso) {
  return FORMAT_DATE.format(new Date(iso));
}

export function tailleLisible(octets) {
  return `${Math.round(octets / 1024 / 1024)} Mo`;
}
