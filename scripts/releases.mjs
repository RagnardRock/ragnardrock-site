// Récupère toutes les Releases du dépôt atelier et les range dans public/releases.json.
// Lancé avant chaque construction du site (npm run build) : le site a donc toujours
// une copie des versions, même si l'API de GitHub ne répond pas chez le visiteur.
// Le site la complète ensuite en direct (src/data/releases.js).
//
// Avec la variable GITHUB_TOKEN (fournie par GitHub Actions), la limite de l'API
// passe de 60 à 1000 requêtes par heure. Sans, ça marche aussi pour un essai local.
// RELEASES_FICHIER=<fichier.json> lit une liste déjà téléchargée au lieu d'appeler GitHub.

import { writeFile, readFile, mkdir } from 'node:fs/promises';
import { publiees } from '../src/data/format-release.js';

const DEPOT = 'RagnardRock/atelier';
const SORTIE = new URL('../public/releases.json', import.meta.url);

async function toutes() {
  // Pour un essai hors ligne : RELEASES_FICHIER=chemin/vers/releases-brutes.json
  if (process.env.RELEASES_FICHIER) return JSON.parse(await readFile(process.env.RELEASES_FICHIER, 'utf8'));
  const entetes = { Accept: 'application/vnd.github.html+json', 'User-Agent': 'ragnardrock-site' };
  if (process.env.GITHUB_TOKEN) entetes.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  const liste = [];
  for (let page = 1; page <= 30; page++) {
    const rep = await fetch(`https://api.github.com/repos/${DEPOT}/releases?per_page=100&page=${page}`, { headers: entetes });
    if (!rep.ok) throw new Error(`GitHub a répondu ${rep.status}`);
    const lot = await rep.json();
    liste.push(...lot);
    if (lot.length < 100) break;
  }
  return liste;
}

try {
  const brutes = await toutes();
  const releases = publiees(brutes);
  await mkdir(new URL('.', SORTIE), { recursive: true });
  await writeFile(SORTIE, JSON.stringify({ le: new Date().toISOString(), releases }));
  console.log(`${releases.length} versions enregistrées dans public/releases.json`);
} catch (e) {
  // Pas de réseau : on construit quand même, le site chargera les versions en direct.
  console.warn(`Versions non récupérées (${e.message}) : le site les chargera en direct.`);
  await mkdir(new URL('.', SORTIE), { recursive: true });
  await writeFile(SORTIE, JSON.stringify({ le: null, releases: [] }));
}
