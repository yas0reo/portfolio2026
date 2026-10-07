/*
  JavaScript de la page d'accueil.
  querySelector cherche le premier élément HTML qui possède cette classe.
  Ces variables permettent ensuite de modifier cet élément facilement.
*/
const listeProjets = document.querySelector(".projets__liste");
const imageApercu = document.querySelector(".projets__apercu-image");
const texteApercu = document.querySelector(".projets__apercu-texte");

// Ajoute une classe CSS quand une section arrive à l'écran pour lancer son animation.
function lancerAnimation(section, classe, seuil) {
  if (!section) return;

  // Certaines personnes demandent moins de mouvements dans les réglages du téléphone.
  const preferePeuDeMouvement = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  if (preferePeuDeMouvement || !window.IntersectionObserver) {
    section.classList.add("is-visible");
    return;
  }

  section.classList.add(classe);

  // IntersectionObserver surveille une section sans vérifier en permanence le défilement.
  const observateur = new IntersectionObserver(([entree]) => {
    if (!entree.isIntersecting) return;

    section.classList.add("is-visible");
    observateur.unobserve(section);
  }, { threshold: seuil });

  observateur.observe(section);
}

// Affiche le nom et l'image du projet survolé ou sélectionné au clavier.
function montrerApercu(lien) {
  if (!imageApercu || !texteApercu) return;

  // dataset lit les attributs HTML data-preview et data-preview-alt.
  const image = lien.dataset.preview;
  const texteImage = lien.dataset.previewAlt;

  texteApercu.textContent = lien.textContent.trim();
  texteApercu.classList.remove("is-hidden");
  imageApercu.classList.remove("is-visible");

  if (!image) {
    imageApercu.removeAttribute("src");
    imageApercu.alt = "";
    return;
  }

  imageApercu.src = image;
  imageApercu.alt = texteImage;
}

// Attend que l'image soit prête avant de l'afficher, pour éviter un cadre vide.
function preparerImageApercu() {
  if (!imageApercu || !texteApercu) return;

  imageApercu.addEventListener("load", () => {
    imageApercu.classList.add("is-visible");
    texteApercu.classList.add("is-hidden");
  });

  imageApercu.addEventListener("error", () => {
    imageApercu.removeAttribute("src");
    imageApercu.alt = "";
  });
}

// Ajoute le même comportement pour la souris et le clavier.
function preparerLiensProjets() {
  document.querySelectorAll(".projets__lien").forEach((lien) => {
    lien.addEventListener("mouseenter", () => montrerApercu(lien));
    lien.addEventListener("focus", () => montrerApercu(lien));
  });
}

// Sur un écran tactile, toucher une icône affiche son nom et arrête son mouvement.
function preparerIconesLogiciels() {
  const icones = document.querySelectorAll(".logiciel");

  icones.forEach((icone) => {
    icone.addEventListener("pointerup", (evenement) => {
      if (evenement.pointerType === "mouse") return;

      // Une seule icône reste ouverte à la fois.
      const etaitActive = icone.classList.contains("est-actif");
      icones.forEach((element) => element.classList.remove("est-actif"));
      if (!etaitActive) icone.classList.add("est-actif");
    });
  });
}

async function init() {
  // init est le point de départ : elle prépare les animations et les projets.
  lancerAnimation(document.querySelector(".hero"), "hero--anime", 0.15);
  lancerAnimation(document.querySelector(".skills"), "skills--anime", 0.25);
  preparerImageApercu();
  preparerIconesLogiciels();

  if (!listeProjets) return;

  try {
    // await attend la réponse de loadProjects avant de créer les liens.
    const projets = await loadProjects();

    // Vérification demandée pour le cours : le premier titre arrive bien du JSON.
    console.log(projets[0].title);
    listeProjets.innerHTML = projets.map(createProjectCard).join("");
    preparerLiensProjets();
  } catch (erreur) {
    // Si le JSON ne peut pas être lu, la page reste compréhensible pour le visiteur.
    listeProjets.innerHTML =
      '<p class="projets__message">Les projets sont indisponibles pour le moment.</p>';
    console.error(erreur);
  }
}

init();
