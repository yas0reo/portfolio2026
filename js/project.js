/*
  JavaScript de projet.html.
  Cette page est réutilisée pour tous les projets. Elle lit l'identifiant dans
  l'adresse (par exemple ?projet=paysage), puis remplit le HTML avec le bon
  objet trouvé dans projects.json.
*/
const message = document.querySelector("#projet-message");
const hero = document.querySelector(".projet-hero");
const titrePage = document.querySelector(".projet-hero h1");
const lienVideo = document.querySelector("#projet-video");
const titrePresentation = document.querySelector(".projet-presentation > h2");
const titreImagePresentation = document.querySelector(
  ".presentation-image__texte h3",
);
const texteImagePresentation = document.querySelector(
  ".presentation-image__texte p",
);
const texteRole = document.querySelector("#projet-role");
const texteLogiciels = document.querySelector("#projet-logiciels");
const titreProcessus = document.querySelector(".details-description h2");
const texteProcessus = document.querySelector(".details-description p");
const titreGalerie = document.querySelector(".autres-projets-description h3");
const texteGalerie = document.querySelector(".autres-projets-description p");
const texteCredits = document.querySelector("#projet-credits");
const imagePresentation = document.querySelector(".presentation-image img");
const imageDescription = document.querySelector(".presentation-description > img");
const galerie = document.querySelector(".details-galerie");
const imageCarrousel = document.querySelector(".carrousel-image img");
const miniatures = document.querySelector(".carrousel-miniatures");
const precedent = document.querySelector(".carrousel-precedent");
const suivant = document.querySelector(".carrousel-suivant");
const couleursPalette = document.querySelectorAll(".palette-couleurs .couleur");

function definirImage(image, source, texteAlternatif) {
  // Une fonction commune évite de répéter ce code pour chaque image.
  if (!image) return;

  if (!source) {
    image.removeAttribute("src");
    image.alt = "";
    return;
  }

  image.src = source;
  image.alt = texteAlternatif;
}

// L'image principale devient le fond de la première section.
function definirFondHero(source) {
  if (!hero) return;

  hero.style.backgroundImage = source ? `url("${source}")` : "none";
}

// Le bouton Play est visible seulement quand un lien YouTube existe.
function definirLienVideo(video, titre) {
  if (!lienVideo) return;

  if (!video) {
    lienVideo.hidden = true;
    return;
  }

  lienVideo.href = video;
  lienVideo.setAttribute("aria-label", `Voir la vidéo du projet ${titre}`);
  lienVideo.hidden = false;
}

// Affiche le code hexadécimal sous chaque cercle de la palette.
function afficherPalette(palette) {
  couleursPalette.forEach((couleur, index) => {
    const hex = palette[index];
    const cercle = couleur.querySelector(".couleur-apercu");
    const nom = couleur.querySelector("p");

    if (!hex || !cercle || !nom) return;

    cercle.style.backgroundColor = hex;
    nom.textContent = hex;
  });
}

function afficherCredits(projet) {
  // Le texte change légèrement lorsqu'il s'agit d'un projet individuel.
  if (!texteCredits) return;

  if (projet.equipe === "Projet individuel") {
    texteCredits.textContent = `Projet individuel réalisé dans le cadre du cours ${projet.cours}.`;
    return;
  }

  texteCredits.textContent = `Projet réalisé dans le cadre du cours ${projet.cours}. Merci à ${projet.equipe}.`;
}

function afficherGalerie(images, titre) {
  if (!galerie) return;

  // map crée une figure HTML pour chaque chemin d'image dans le tableau.
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

  // indexActuel mémorise le numéro de l'image actuellement affichée.
  let indexActuel = 0;

  // Le modulo (%) permet de revenir à la première image après la dernière.
  function afficherImage(index) {
    indexActuel = (index + images.length) % images.length;
    definirImage(
      imageCarrousel,
      images[indexActuel],
      `${titre} — image ${indexActuel + 1}`,
    );
  }

  miniatures.replaceChildren(
    ...images.slice(0, 3).map((source, index) => {
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

// Lance une animation douce quand une section arrive dans la fenêtre.
function preparerAnimationsPage() {
  const sections = document.querySelectorAll(
    ".projet-presentation, .projet-palette, .projet-details, .autres-projets, .credits",
  );
  // Si cette fonction n'est pas prise en charge, le contenu apparaît tout de suite.
  if (!window.IntersectionObserver) {
    sections.forEach((section) => section.classList.add("est-visible"));
    return;
  }

  const observateur = new IntersectionObserver(([entree], observer) => {
    if (!entree.isIntersecting) return;

    entree.target.classList.add("est-visible");
    observer.unobserve(entree.target);
  }, { threshold: 0.12 });

  sections.forEach((section) => {
    section.classList.add("section-projet--anime");
    observateur.observe(section);
  });
}

function afficherProjet(projet) {
  // || [] veut dire : utiliser un tableau vide si une liste d'images manque.
  const images = projet.galerie || [];
  const imagesPresentation = projet.presentation || [];
  const imagesCarrousel = projet.carrousel || [];

  document.title = `${projet.title} | Portfolio`;
  document.body.dataset.couleur = projet.couleur;
  titrePage.textContent = projet.title;
  titrePresentation.textContent = projet.descriptionCourte || projet.title;
  titreImagePresentation.textContent = "Description";
  texteImagePresentation.textContent = projet.description;
  texteRole.textContent = projet.role;
  texteLogiciels.textContent = projet.logiciels;
  titreProcessus.textContent = "Processus";
  texteProcessus.textContent = projet.demande;
  titreGalerie.textContent = projet.categorie;
  texteGalerie.textContent = projet.realisation;
  afficherCredits(projet);

  definirFondHero(projet.hero || projet.apercu);
  definirLienVideo(projet.video, projet.title);
  afficherPalette(projet.palette || []);
  definirImage(
    imagePresentation,
    imagesPresentation[0],
    `${projet.title} — aperçu`,
  );
  definirImage(
    imageDescription,
    imagesPresentation[1],
    `${projet.title} — détail`,
  );
  afficherGalerie(images, projet.title);
  afficherCarrousel(imagesCarrousel, projet.title);
  message.textContent = "";
}

async function init() {
  // URLSearchParams lit le texte après le ? dans une adresse Web.
  // Exemple : projet.html?projet=mati-r donne l'identifiant "mati-r".
  const identifiant = new URLSearchParams(window.location.search).get("projet");
  preparerAnimationsPage();

  try {
    const projets = await loadProjects();
    // find retourne le premier projet dont l'id correspond à l'adresse.
    const projet = projets.find((element) => element.id === identifiant);

    if (!projet) throw new Error("Projet introuvable.");
    afficherProjet(projet);
  } catch (erreur) {
    // Une erreur est aussi écrite dans la console pour faciliter le dépannage.
    message.textContent = "Ce projet est indisponible pour le moment.";
    console.error(erreur);
  }
}

init();
