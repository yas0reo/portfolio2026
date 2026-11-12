/*
  JavaScript de la page d'accueil.
  querySelector cherche le premier élément HTML qui possède cette classe.
  = modifier élément facilement.
*/
const listeProjets = document.querySelector(".projets__liste");
const listeProjetsMobile = document.querySelector(".projets__liste-mobile");
// Ajoute une classe CSS quand une section arrive à l'écran pour lancer son animation.
function lancerAnimation(section, classe, seuil) {
  if (!section) return;

  // Si le navigateur ne connaît pas IntersectionObserver, le contenu reste visible.
  if (!window.IntersectionObserver) {
    section.classList.add("is-visible");
    return;
  }

  section.classList.add(classe);

  // IntersectionObserver surveille une section sans vérifier en permanence le défilement.
  const observateur = new IntersectionObserver(
    ([entree]) => {
      if (!entree.isIntersecting) return;

      section.classList.add("is-visible");
      observateur.unobserve(section);
    },
    { threshold: seuil }
  );

  observateur.observe(section);
}

// Chaque groupe possède son propre panneau d’aperçu.
function preparerLiensProjets() {
  document.querySelectorAll(".projets__groupe").forEach((groupe) => {
    const image = groupe.querySelector(".projets__apercu-image");
    const texte = groupe.querySelector(".projets__apercu-texte");
    let actif;
    function actualiser() {
      const lien = groupe.querySelector(".projets__lien:hover") ||
        groupe.querySelector(".projets__lien:focus");
      if (lien === actif) return;
      actif = lien;
      texte.textContent = lien?.querySelector(".projets__statut")?.textContent || "";
      image.classList.remove("is-visible");
      if (lien?.dataset.preview) {
        image.src = lien.dataset.preview;
        if (image.complete && image.naturalWidth) image.classList.add("is-visible");
      } else {
        image.removeAttribute("src");
      }
    }
    image.addEventListener("load", () => image.classList.add("is-visible"));
    groupe.addEventListener("pointerover", actualiser);
    groupe.addEventListener("pointerout", () => requestAnimationFrame(actualiser));
    groupe.addEventListener("focusin", actualiser);
    groupe.addEventListener("focusout", () => requestAnimationFrame(actualiser));
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
  lancerAnimation(
    document.querySelector(".apropos"),
    "accueil-section--anime",
    0.12
  );
  lancerAnimation(
    document.querySelector(".interets"),
    "accueil-section--anime",
    0.12
  );
  lancerAnimation(
    document.querySelector(".projets"),
    "accueil-section--anime",
    0.12
  );
  lancerAnimation(
    document.querySelector(".contact"),
    "accueil-section--anime",
    0.12
  );
  preparerIconesLogiciels();

  if (!listeProjets || !listeProjetsMobile) return;

  try {
    // await attend la réponse de loadProjects avant de créer les liens.
    const projets = await loadProjects();


    console.log(projets[0].title);
    const groupes = [
      ["mati-r", "montage-rouge", "corps"],
      ["paysage", "space-in-betweenn", "ouii-wee"],
      ["medias-sociaux"],
    ];
    listeProjets.innerHTML = groupes.map((ids, index) => `
      <div class="projets__groupe">
        <div class="projets__noms">
          ${ids.map(id => projets.find(projet => projet.id === id)).filter(Boolean).map(createProjectCard).join("")}
          ${index === 2 ? '<span class="projets__a-venir">À venir</span>' : ""}
        </div>
        <div class="projets__apercu">
          <img class="projets__apercu-image" alt="" />
          <p class="projets__apercu-texte"></p>
        </div>
      </div>
    `).join("");
    listeProjetsMobile.innerHTML = projets
      .map(createMobileProjectCard)
      .join("");
    preparerLiensProjets();
    document.dispatchEvent(new Event("projets-charges"));
  } catch (erreur) {
    // Si le JSON ne peut pas être lu, la page reste compréhensible pour le visiteur.
    listeProjets.innerHTML =
      '<p class="projets__message">Les projets sont indisponibles pour le moment.</p>';
    listeProjetsMobile.innerHTML =
      '<p class="projets__message">Les projets sont indisponibles pour le moment.</p>';
    console.error(erreur);
  }
}

init();
