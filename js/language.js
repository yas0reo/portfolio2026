// Retient la langue choisie et traduit les textes sans modifier les animations.
const traductions = {
  "Présentation du projet": "Project overview",
  "Chargement du projet…": "Loading project…",
  "Processus": "Process",
  "Palette de couleurs": "Colour palette",
  "Palette de couleur": "Colour palette",
  "Étapes de création et logiciels": "Creation process and software",
  "Crédits et remerciements": "Credits and acknowledgements",
  "Retour à l’accueil": "Back to home",
  "Retour à l'accueil": "Back to home",
  "Voir la publication ↗": "View post ↗",
  "Vidéos et publications d’activités": "Videos and activity posts",
  "Création de contenu · Instagram": "Content creation · Instagram",
  "Ce projet est indisponible pour le moment.": "This project is currently unavailable.",
  "Aller au contenu": "Skip to content",
  "À propos": "About",
  "Projets": "Projects",
  "À propos de moi": "About me",
  "C’est un miracle que nous ne nous soyons jamais rencontrés": "It’s a miracle we’ve never met",
  "Intérêts & thèmes": "Interests & themes",
  "JEUX": "GAMES",
  "PHOTO & VIDÉO": "PHOTO & VIDEO",
  "PHOTO VIDÉO": "PHOTO VIDEO",
  "RÉALITÉ VIRTUELLE": "VIRTUAL REALITY",
  "VOYAGES": "TRAVEL",
  "MUSIQUE": "MUSIC",
  "Compétence en application": "Software skills",
  "Quelques projets": "Selected projects",
  "Bien aimés": "Personal favourites",
  "Survole un projet pour voir son aperçu": "Hover over a project to preview it",
  "Chargement des projets…": "Loading projects…",
  "Me contacter": "Get in touch",
  "Retour en haut ↑": "Back to top ↑",
  "À suivre…": "Coming soon…",
  "Exploration": "Exploration",
  "Vidéo": "Video",
  "Narration": "Storytelling",
  "Visuel à venir": "Preview coming soon",
  "© 2026 Yasmine Onekeo · Création multimédia": "© 2026 Yasmine Onekeo · Multimedia creation",
  "Mon portfolio est un reflet de ma créativité : un mélange de chaos contrôlé et d'idées brillantes.": "My portfolio reflects my creativity: a mix of controlled chaos and bright ideas.",
  "Je souhaite évoluer dans un environnement créatif, en création de contenu, design graphique, médias sociaux et montage vidéo. Je recherche des projets qui me permettent de mélanger l'image, le storytelling et les nouvelles technologies.": "I want to grow in a creative environment through content creation, graphic design, social media and video editing. I seek projects that combine visuals, storytelling and new technologies.",
  "Née dans une petite ville où tout le monde se ressemble, je détonne de par mon héritage multi-culturel. Curieuse et dotée d'une grande ouverture sur le monde, ma soif de voyage est IMMENSE. Authentique, franche et discrète, il n'y a pas de faux-semblant avec moi. Vous aurez l'heure juste !": "Born in a small town where everyone seems alike, I stand out through my multicultural heritage. Curious and open to the world, I have an IMMENSE desire to travel. Authentic, honest and reserved, I am always straightforward with you!",
  "N'hésitez pas à me contacter pour toute demande de renseignements, collaboration ou opportunité professionnelle. Je suis toujours ouverte aux nouvelles idées et aux conversations stimulantes !": "Feel free to contact me with questions, collaborations or professional opportunities. I’m always open to new ideas and inspiring conversations!"
};
let langue = "fr";
try { langue = localStorage.getItem("portfolio-language") || "fr"; } catch {}
const textesOriginaux = new WeakMap();
const selecteur = document.createElement("nav");
selecteur.className = "langues";
selecteur.setAttribute("aria-label", "Language / Langue");
selecteur.innerHTML = '<button type="button" lang="fr">FR</button><span aria-hidden="true"> / </span><button type="button" lang="en">EN</button>';
document.body.append(selecteur);
function traduire() {
  document.documentElement.lang = langue;
  const parcours = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let texte;
  while ((texte = parcours.nextNode())) {
    if (texte.parentElement.closest("script, style, .langues")) continue;
    if (!textesOriginaux.has(texte)) textesOriginaux.set(texte, texte.textContent);
    const original = textesOriginaux.get(texte);
    const cle = original.trim().replace(/\s+/g, " ");
    const valeur = langue === "en" && traductions[cle] ? traductions[cle] : original;
    if (texte.textContent !== valeur) texte.textContent = valeur;
  }
  selecteur.querySelectorAll("button").forEach(b => b.setAttribute("aria-pressed", String(b.lang === langue)));
}
selecteur.addEventListener("click", e => {
  if (!e.target.matches("button")) return;
  langue = e.target.lang;
  try { localStorage.setItem("portfolio-language", langue); } catch {}
  traduire();
});
// Traduit les cartes une fois chargées, sans surveiller tous les changements de la page.
document.addEventListener("projets-charges", traduire);
traduire();
