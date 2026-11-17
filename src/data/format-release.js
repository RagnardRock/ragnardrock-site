// Mise en forme d'une Release GitHub, partagée par scripts/releases.mjs (à la construction)
// et par src/data/releases.js (en direct dans le navigateur).

// Ne garde que ce dont le site a besoin, pour un fichier léger.
export function alleger(r) {
  return {
    tag: r.tag_name,
    nom: r.name || r.tag_name,
    date: r.published_at,
    html: nettoyer(r.body_html || ''),
    url: r.html_url,
    fichiers: (r.assets || [])
      .filter((a) => /\.(exe|zip|html)$/i.test(a.name))
      .map((a) => ({ nom: a.name, url: a.browser_download_url, taille: a.size })),
  };
}

// GitHub renvoie un HTML déjà nettoyé (balises sûres seulement) ; on retire ses attributs
// data-* et ses classes, qui pèsent lourd, et les liens s'ouvrent dans un nouvel onglet.
function nettoyer(html) {
  return html
    .replace(/\s(?:data-[\w-]+|class)="[^"]*"/g, '')
    .replace(/<a /g, '<a target="_blank" rel="noopener" ');
}

export function publiees(liste) {
  return liste
    .filter((r) => !r.draft && r.published_at)
    .map(alleger)
    .sort((a, b) => b.date.localeCompare(a.date));
}
