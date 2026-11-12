/*
  Reçoit UN projet provenant de projects.json et retourne son lien HTML.
  Cette fonction ne place rien elle-même dans la page : main.js s'en charge.
*/
function createProjectCard(project) {
  // data-preview est une information cachée que main.js lira au survol.
  const preview = project.apercu ? ` data-preview="${project.apercu}"` : "";
  const etiquette = project.enCours ? "À suivre…" : project.etiquette;
  const statut = etiquette ? `<span class="projets__statut">${etiquette}</span>` : "";

  // Les accents graves permettent d'écrire du HTML sur plusieurs lignes.
  return `
    <a
      class="projets__lien projets__lien--${project.couleur}"
      href="${project.lien}"
      data-projet="${project.id}"
      data-preview-alt="Aperçu du projet ${project.title}"${preview}
    >
      ${project.title}
      ${statut}
    </a>
  `;
}

// La carte mobile montre directement l'image et le titre : il n'y a pas de survol.
function createMobileProjectCard(project) {
  // Si le projet n'a pas encore d'image, on affiche un espace temporaire.
  const visuel = project.apercu
    ? `<img src="${project.apercu}" alt="Aperçu du projet ${project.title}" />`
    : '<span class="projets__carte-mobile-visuel" aria-hidden="true">Visuel à venir</span>';
  const etiquette = project.enCours ? "À suivre…" : project.etiquette;
  return `
    <a class="projets__carte-mobile" href="${project.lien}">
      ${visuel}
      <span class="projets__carte-mobile-titre">${project.title}${etiquette ? `<span class="projets__statut">${etiquette}</span>` : ""}</span>
    </a>
  `;
}
