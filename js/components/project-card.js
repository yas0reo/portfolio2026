/*
  Reçoit UN projet provenant de projects.json et retourne son lien HTML.
  Cette fonction ne place rien elle-même dans la page : main.js s'en charge.
*/
function createProjectCard(project) {
  // data-preview est une information cachée que main.js lira au survol.
  const preview = project.apercu ? ` data-preview="${project.apercu}"` : "";

  // Les accents graves permettent d'écrire du HTML sur plusieurs lignes.
  return `
    <a
      class="projets__lien projets__lien--${project.couleur}"
      href="${project.lien}"
      data-preview-alt="Aperçu du projet ${project.title}"${preview}
    >
      ${project.title}
    </a>
  `;
}

// La carte mobile montre directement l'image et le titre : il n'y a pas de survol.
function createMobileProjectCard(project) {
  return `
    <a class="projets__carte-mobile" href="${project.lien}">
      <img src="${project.apercu}" alt="Aperçu du projet ${project.title}" />
      <span class="projets__carte-mobile-titre">${project.title}</span>
    </a>
  `;
}
