// Les outils de l'Atelier présentés sur le site.
// Pour ajouter un outil : une entrée de plus ici, son icône dans public/icones/
// et ses captures dans public/captures/<id>/.
//
// - prefixe : le début des étiquettes de ses Releases GitHub (« tafl-v1.42.0 » → « tafl-v »).
//   C'est ce qui relie l'outil à ses versions et à ses notes de version.
// - couleurs : le dégradé de son icône, repris partout sur sa page.

export const DEPOT = 'RagnardRock/atelier';

export const CATEGORIES = [
  { id: 'developpement', nom: 'Développement' },
  { id: 'graphisme', nom: 'Graphisme' },
  { id: 'jeu', nom: 'Jeu vidéo' },
  { id: 'bureautique', nom: 'Bureautique' },
];

export const OUTILS = [
  {
    id: 'atelier',
    nom: 'Atelier',
    glyphe: 'ᚨ',
    couleurs: ['#b4f5a2', '#3fc6d0'],
    categorie: 'hub',
    prefixe: 'atelier-v',
    accroche: 'Le hub qui installe, lance et met à jour tous les outils.',
    description:
      'Atelier est la porte d\'entrée : il installe chaque outil en un clic, prévient des mises à jour, et garde sous la main des widgets du quotidien (notes, projets récents, couleurs, minuteurs, calendrier, calculatrice).',
    points: [
      'Installe, met à jour et désinstalle les outils',
      'Widgets : notes, projets, presse-papiers, minuteurs, calendrier',
      'Page Nouveautés avec les notes de toutes les versions',
      'Loki, l\'assistant commun, avec Claude ou en local (Ollama)',
    ],
    captures: [
      { fichier: '1-accueil.webp', legende: 'Les outils, le calendrier et Loki' },
      { fichier: '2-nouveautes.webp', legende: 'Les nouveautés de tous les outils' },
    ],
  },
  {
    id: 'rune',
    nom: 'Rune',
    glyphe: 'ᚱ',
    couleurs: ['#b9a8ff', '#5ec8ff'],
    categorie: 'developpement',
    prefixe: 'rune-v',
    accroche: 'IDE : code, terminal, Git, serveurs et aperçu web.',
    description:
      'Un éditeur de code taillé pour le web : Monaco, Vue, Emmet et Prettier, un terminal et des connexions SSH aux serveurs, Git intégré, et un aperçu qui se met à jour pendant la frappe.',
    points: [
      'Monaco avec Vue, Emmet et Prettier',
      'Terminal, serveurs SSH et explorateur distant',
      'Git intégré et historique des fichiers',
      'Aperçu web en direct et Go Live',
    ],
    captures: [
      { fichier: '1-verre.webp', legende: 'Le thème verre, le terminal en bas' },
      { fichier: '2-apercu.webp', legende: 'L\'aperçu se met à jour pendant la frappe' },
      { fichier: '3-git.webp', legende: 'Les changements Git côte à côte' },
    ],
  },
  {
    id: 'skald',
    nom: 'Skald',
    glyphe: 'ᛋ',
    couleurs: ['#ffc561', '#ff6fa8'],
    categorie: 'graphisme',
    prefixe: 'skald-v',
    accroche: 'Retouche d\'images et de logos, compatible PSD.',
    description:
      'La retouche du quotidien sans quitter l\'Atelier : calques, sélections, retrait de fond, texte et transformations, avec ouverture et enregistrement des PSD.',
    points: [
      'Calques, calques de réglage, 17 modes de fusion',
      'Sélections rectangle, lasso, baguette magique',
      'Retrait de fond et recadrage',
      'Ouvre et enregistre les PSD',
    ],
    captures: [
      { fichier: '1-retirer-fond.webp', legende: 'Rendre une couleur transparente' },
      { fichier: '2-calques.webp', legende: 'Calques et calques de réglage' },
      { fichier: '3-accueil.webp', legende: 'L\'accueil' },
    ],
  },
  {
    id: 'brokk',
    nom: 'Brokk',
    glyphe: 'ᛒ',
    couleurs: ['#ffc35c', '#ff4d3d'],
    categorie: 'graphisme',
    prefixe: 'brokk-v',
    accroche: 'Export d\'images aux tailles et formats du web.',
    description:
      'Un PSD ou un logo entre, toutes les tailles d\'un projet web sortent : favicons, images responsives, Open Graph, en PNG, WebP, JPEG ou ICO.',
    points: [
      'Favicons et icônes d\'application',
      'Images responsives en plusieurs largeurs',
      'Images Open Graph pour les partages',
      'Export d\'un calque PSD en 1x, 2x, 3x',
    ],
    captures: [
      { fichier: '1-responsive.webp', legende: 'Une image en toutes les largeurs' },
      { fichier: '2-accueil.webp', legende: 'L\'accueil' },
    ],
  },
  {
    id: 'tafl',
    nom: 'Tafl',
    glyphe: 'ᛏ',
    couleurs: ['#c4f56a', '#3fb6ff'],
    categorie: 'jeu',
    prefixe: 'tafl-v',
    accroche: 'Éditeur de jeu : tuiles, cartes, événements et règles.',
    description:
      'Tafl décrit le jeu : les tuiles, les cartes, les événements, les données et les règles. Les règles vivent dans des packs remplaçables (aventure à la Pokémon, JRPG, jeu de rôle sur table, action en temps réel, survivor).',
    points: [
      'Tuiles animées, tampons et cartes du monde',
      'Événements en blocs avec aperçu des dialogues',
      'Packs de règles et scripts JS en bac à sable',
      'Test rapide du jeu dans Saga',
    ],
    captures: [
      { fichier: '1-cartes.webp', legende: 'L\'édition d\'une carte' },
      { fichier: '2-evenements.webp', legende: 'Les événements en blocs' },
      { fichier: '3-accueil.webp', legende: 'L\'accueil sur écran ultralarge' },
    ],
  },
  {
    id: 'saga',
    nom: 'Saga',
    glyphe: 'ᛃ',
    couleurs: ['#ffd36a', '#9b6bff'],
    categorie: 'jeu',
    prefixe: 'saga-v',
    accroche: 'Moteur de jeu : joue les jeux de Tafl, seul ou à plusieurs.',
    description:
      'Saga fait tourner les jeux créés dans Tafl. Il sert aussi de table virtuelle pour les parties de jeu de rôle, se joue à plusieurs depuis un navigateur, et exporte chaque jeu en page web ou en installeur Windows.',
    points: [
      'Combats au tour par tour, temps réel ou survivor',
      'Mode table JDR : jetons, brouillard, vue du MJ',
      'Multijoueur dans le navigateur avec un code à 4 lettres',
      'Export en page web ou en installeur Windows',
    ],
    captures: [
      { fichier: '1-table-mj.webp', legende: 'La table de jeu de rôle, vue du MJ' },
      { fichier: '2-survivor.webp', legende: 'Le mode survivor' },
      { fichier: '3-carte.webp', legende: 'La carte du monde en jeu' },
    ],
  },
  {
    id: 'mimir',
    nom: 'Mímir',
    glyphe: 'ᛗ',
    couleurs: ['#e4ebff', '#5b7cff'],
    categorie: 'bureautique',
    prefixe: 'mimir-v',
    accroche: 'Lecteur de documents : PDF à annoter et signer, EPUB, BD, Word.',
    description:
      'Un lecteur pour tout ce qu\'on reçoit : PDF à surligner, remplir et signer, EPUB, bandes dessinées en CBZ ou CBR, documents Word, images et textes.',
    points: [
      'Surligner, annoter et remplir les formulaires PDF',
      'Signature dessinée, tapée ou importée',
      'EPUB, CBZ, CBR, DOCX, images et textes',
    ],
    captures: [
      { fichier: '1-pdf.webp', legende: 'Un PDF et ses vignettes' },
      { fichier: '2-signature.webp', legende: 'Un formulaire rempli et signé' },
      { fichier: '3-epub.webp', legende: 'Un EPUB en deux colonnes' },
    ],
  },
  {
    id: 'kenning',
    nom: 'Kenning',
    glyphe: 'ᚲ',
    couleurs: ['#b9a3ff', '#6f6cff'],
    categorie: 'bureautique',
    prefixe: 'kenning-v',
    accroche: 'Liseuse d\'eBooks avec bibliothèque.',
    description:
      'Une bibliothèque de livres numériques avec couvertures, collections et progression, et une liseuse confortable avec surlignages et notes.',
    points: [
      'EPUB, MOBI, AZW3 et FB2',
      'Couvertures, collections et progression',
      'Surlignages et notes',
    ],
    captures: [
      { fichier: '1-bibliotheque.webp', legende: 'La bibliothèque' },
      { fichier: '2-lecture.webp', legende: 'La lecture' },
    ],
  },
  {
    id: 'reikna',
    nom: 'Reikna',
    glyphe: 'ᛞ',
    couleurs: ['#6ee7b7', '#059669'],
    categorie: 'bureautique',
    prefixe: 'reikna-v',
    accroche: 'Tableur compatible Excel et LibreOffice.',
    description:
      'Un tableur qui ouvre et enregistre xlsx, xls, ods et CSV, avec des formules en français, des graphiques et la mise en forme conditionnelle.',
    points: [
      'xlsx, xls, ods et CSV',
      'Formules en français',
      'Graphiques et mise en forme conditionnelle',
    ],
    captures: [
      { fichier: '1-graphiques.webp', legende: 'Graphiques et mise en forme conditionnelle' },
      { fichier: '2-formules.webp', legende: 'L\'aide des formules' },
    ],
  },
  {
    id: 'edda',
    nom: 'Edda',
    glyphe: 'ᛖ',
    couleurs: ['#7cc4ff', '#b18cff'],
    categorie: 'bureautique',
    prefixe: 'edda-v',
    accroche: 'Traitement de texte compatible Word et LibreOffice.',
    description:
      'Un traitement de texte qui lit et écrit docx, odt, RTF, Markdown et HTML, avec styles personnalisés, sommaire déroulant, images flottantes, vidéos et sons dans la page.',
    points: [
      'docx, odt, RTF, Markdown, HTML',
      'Styles personnalisés et palettes',
      'Sommaire avec sections déplaçables',
      'Images flottantes, vidéos et sons',
    ],
    captures: [
      { fichier: '1-styles.webp', legende: 'Les styles et leurs palettes' },
      { fichier: '2-sommaire.webp', legende: 'Le sommaire' },
    ],
  },
];

export function outil(id) {
  return OUTILS.find((o) => o.id === id);
}

// Retrouve l'outil d'une étiquette de Release (« saga-v1.49.0 » → Saga).
export function outilDeTag(tag) {
  return OUTILS.find((o) => tag.startsWith(o.prefixe));
}

export function degrade(o, angle = 135) {
  return `linear-gradient(${angle}deg, ${o.couleurs[0]}, ${o.couleurs[1]})`;
}
