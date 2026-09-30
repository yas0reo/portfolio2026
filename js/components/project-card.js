function createProjectCard(project) {
  // Certains projets n'ont pas encore d'image d'aperçu.
  const preview = project.apercu
    ? ` data-preview="${project.apercu}"`
    : "";

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
