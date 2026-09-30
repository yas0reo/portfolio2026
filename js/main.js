// Les éléments de la page que JavaScript doit modifier.
const listeProjets = document.querySelector(".projets__liste");
const imageApercu = document.querySelector(".projets__apercu-image");
const texteApercu = document.querySelector(".projets__apercu-texte");

// Ajoute une classe quand une section arrive à l'écran.
function lancerAnimation(section, classe, seuil) {
  if (!section) return;

  const preferePeuDeMouvement = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  if (preferePeuDeMouvement || !window.IntersectionObserver) {
    section.classList.add("is-visible");
    return;
  }

  section.classList.add(classe);

  const observateur = new IntersectionObserver(([entree]) => {
    if (!entree.isIntersecting) return;

    section.classList.add("is-visible");
    observateur.unobserve(section);
  }, { threshold: seuil });

  observateur.observe(section);
}

// Affiche le nom et l'image du projet survolé.
function montrerApercu(lien) {
  if (!imageApercu || !texteApercu) return;

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

// Attend que l'image soit prête avant de l'afficher.
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

async function init() {
  lancerAnimation(document.querySelector(".hero"), "hero--anime", 0.15);
  lancerAnimation(document.querySelector(".skills"), "skills--anime", 0.25);
  preparerImageApercu();

  if (!listeProjets) return;

  try {
    const projets = await loadProjects();

    // Vérification demandée pour le cours : le premier titre arrive bien du JSON.
    console.log(projets[0].title);
    listeProjets.innerHTML = projets.map(createProjectCard).join("");
    preparerLiensProjets();
  } catch (erreur) {
    listeProjets.innerHTML =
      '<p class="projets__message">Les projets sont indisponibles pour le moment.</p>';
    console.error(erreur);
  }
}

init();
