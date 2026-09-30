// Ce fichier a seulement une responsabilité : lire le fichier JSON.
async function loadProjects() {
  const response = await fetch("./data/projects.json");

  // On laisse main.js afficher le message d'erreur au visiteur.
  if (!response.ok) {
    throw new Error("Impossible de charger les projets.");
  }

  return response.json();
}
