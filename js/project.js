// Les éléments de la page détail à remplir avec les données du projet.
const message = document.querySelector("#projet-message");
const titrePage = document.querySelector(".projet-hero h1");
const imageHero = document.querySelector(".projet-hero-media img");
const titrePresentation = document.querySelector(".projet-presentation > h2");
const titreDescription = document.querySelector(".presentation-description h3");
const paragraphesDescription = document.querySelectorAll(
  ".presentation-description p",
);
const imagePresentation = document.querySelector(".presentation-image img");
const imageDescription = document.querySelector(".presentation-description > img");
const galerie = document.querySelector(".details-galerie");
const imageCarrousel = document.querySelector(".carrousel-image img");
const miniatures = document.querySelector(".carrousel-miniatures");
const precedent = document.querySelector(".carrousel-precedent");
const suivant = document.querySelector(".carrousel-suivant");

function definirImage(image, source, texteAlternatif) {
  if (!image) return;

  if (!source) {
    image.removeAttribute("src");
    image.alt = "";
    return;
  }

  image.src = source;
  image.alt = texteAlternatif;
}

function afficherGalerie(images, titre) {
  if (!galerie) return;

  galerie.replaceChildren(
    ...images.map((source, index) => {
      const figure = document.createElement("figure");
      const image = document.createElement("img");

      if (index === 0) figure.className = "image-principale";
      definirImage(image, source, `${titre} — image ${index + 1}`);
      figure.append(image);
      return figure;
    }),
  );
}

function afficherCarrousel(images, titre) {
  if (!miniatures || !imageCarrousel) return;

  if (!images.length) {
    miniatures.replaceChildren();
    definirImage(imageCarrousel);
    precedent.disabled = suivant.disabled = true;
    return;
  }

  let indexActuel = 0;

  // Le modulo permet de revenir à la première image après la dernière.
  function afficherImage(index) {
    indexActuel = (index + images.length) % images.length;
    definirImage(
      imageCarrousel,
      images[indexActuel],
      `${titre} — image ${indexActuel + 1}`,
    );
  }

  miniatures.replaceChildren(
    ...images.map((source, index) => {
      const bouton = document.createElement("button");
      const image = document.createElement("img");

      bouton.type = "button";
      bouton.setAttribute("aria-label", `Voir l'image ${index + 1}`);
      definirImage(image, source, "");
      bouton.addEventListener("click", () => afficherImage(index));
      bouton.append(image);
      return bouton;
    }),
  );

  precedent.disabled = suivant.disabled = images.length < 2;
  precedent.addEventListener("click", () => afficherImage(indexActuel - 1));
  suivant.addEventListener("click", () => afficherImage(indexActuel + 1));
  afficherImage(0);
}

function afficherProjet(projet) {
  const images = projet.galerie || [];
  const description =
    projet.description || "Les détails de ce projet seront ajoutés bientôt.";

  document.title = `${projet.title} | Portfolio`;
  titrePage.textContent = projet.title;
  titrePresentation.textContent = projet.title;
  titreDescription.textContent = projet.title;
  paragraphesDescription.forEach((paragraphe, index) => {
    paragraphe.textContent = index === 0 ? description : "";
  });

  definirImage(imageHero, projet.hero || projet.apercu, projet.title);
  definirImage(imagePresentation, images[0], `${projet.title} — aperçu`);
  definirImage(imageDescription, images[1], `${projet.title} — détail`);
  afficherGalerie(images, projet.title);
  afficherCarrousel(images, projet.title);
  message.textContent = "";
}

async function init() {
  // Exemple : projet.html?projet=mati-r donne l'identifiant "mati-r".
  const identifiant = new URLSearchParams(window.location.search).get("projet");

  try {
    const projets = await loadProjects();
    const projet = projets.find((element) => element.id === identifiant);

    if (!projet) throw new Error("Projet introuvable.");
    afficherProjet(projet);
  } catch (erreur) {
    message.textContent = "Ce projet est indisponible pour le moment.";
    console.error(erreur);
  }
}

init();
