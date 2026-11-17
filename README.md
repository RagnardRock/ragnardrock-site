# ragnardrock.fr

Le site personnel de RagnardRock : les outils de l'[Atelier](https://github.com/RagnardRock/atelier), Ansuz, et la suite.

Vue 3 + Vite, site statique, hébergé sur un VPS.

## Pages

| Adresse | Contenu |
|---|---|
| `/` | Accueil : Atelier, Ansuz et les dernières versions |
| `/atelier` | Tous les outils, rangés par catégorie |
| `/atelier/<outil>` | Une page par outil : captures, points forts, téléchargement de la dernière version, notes de version |
| `/nouveautes` | Les notes de version de tous les outils (`?outil=tafl` pour un seul) |
| `/ansuz` | Ansuz, le carnet culturel partagé |

## Les versions viennent de GitHub

Rien à mettre à jour à la main : les versions, les boutons de téléchargement et les notes
viennent des Releases du dépôt `atelier`.

- À la construction, `scripts/releases.mjs` range toutes les Releases dans `public/releases.json`.
- Dans le navigateur, `src/data/releases.js` lit cette copie puis demande à GitHub les toutes dernières
  (gardées 30 minutes chez le visiteur).

## Ajouter un outil

Dans `src/data/outils.js`, une entrée de plus (nom, rune, couleurs, préfixe de ses Releases, textes),
son icône dans `public/icones/<id>.svg` et ses captures dans `public/captures/<id>/` (WebP, 1600 px de large au plus).

## Développer

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # le site construit dans dist/
```

## Mise en ligne

Chaque modification de `main` construit le site et l'envoie sur le VPS (`.github/workflows/deployer.yml`),
et il se reconstruit toutes les 6 heures pour reprendre les nouvelles versions des outils.
La préparation du VPS (nginx, HTTPS, clé SSH, secrets) est décrite dans [deploy/LISEZMOI.md](deploy/LISEZMOI.md).
