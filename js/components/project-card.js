/*
  Reçoit UN projet provenant de projects.json et retourne son lien HTML.
  Cette fonction ne place rien elle-même dans la page : main.js s'en charge.
*/
function createProjectCard(project) {
  // Certains projets n'ont pas encore d'image d'aperçu.
  // data-preview est une information cachée que main.js lira au survol.
  const preview = project.apercu
    ? ` data-preview="${project.apercu}"`
    : "";

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
