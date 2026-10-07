/*
  Ce fichier a seulement une responsabilité : lire le fichier projects.json.
  async signifie que le navigateur attend le fichier sans bloquer le reste de
  la page. La fonction retourne ensuite la liste des projets à main.js.
*/
async function loadProjects() {
  // fetch demande un fichier au serveur local ou au site en ligne.
  const response = await fetch("./data/projects.json");

  // Si le fichier n'est pas trouvé, on arrête ici. main.js affichera le message.
  if (!response.ok) {
    throw new Error("Impossible de charger les projets.");
  }

  // Transforme le texte JSON en tableau JavaScript utilisable.
  return response.json();
}
