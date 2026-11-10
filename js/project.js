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
const modaleVideo = document.querySelector("#video-modal");
const lecteurVideo = document.querySelector("#video-modal-lecteur");
const fermerVideo = document.querySelector("#video-modal-fermer");
const titrePresentation = document.querySelector(".projet-presentation > h2");
const titreImagePresentation = document.querySelector(
  ".presentation-image__texte h3"
);
const texteImagePresentation = document.querySelector(
  ".presentation-image__texte p"
);
const texteRole = document.querySelector("#projet-role");
const texteLogiciels = document.querySelector("#projet-logiciels");
const titreProcessus = document.querySelector(".details-description h2");
const texteProcessus = document.querySelector(".details-description p");
const sectionProcessusLogiciels = document.querySelector("#processus-logiciels");
const titreProcessusLogiciels = document.querySelector("#processus-logiciels-titre");
const descriptionProcessusLogiciels = document.querySelector("#processus-logiciels-description");
const listeProcessusLogiciels = document.querySelector("#processus-logiciels-liste");
const imagesProcessusLogiciels = document.querySelector("#processus-logiciels-images");
const titreGalerie = document.querySelector(".autres-projets-description h3");
const texteGalerie = document.querySelector(".autres-projets-description p");
const texteCredits = document.querySelector("#projet-credits");
const imagePresentation = document.querySelector(".presentation-image img");
const imageDescription = document.querySelector(
  ".presentation-description > img"
);
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

// Transforme une adresse YouTube en adresse lisible dans un lecteur intégré.
function creerLienIntegreYouTube(video) {
  const url = new URL(video);
  const identifiant =
    url.hostname === "youtu.be"
      ? url.pathname.slice(1)
      : url.searchParams.get("v");

  return identifiant
    ? `https://www.youtube-nocookie.com/embed/${identifiant}?autoplay=1&rel=0`
    : "";
}

// Le bouton Play est visible seulement quand un lien YouTube existe.
function definirLienVideo(video, titre) {
  if (!lienVideo) return;

  if (!video) {
    lienVideo.hidden = true;
    delete lienVideo.dataset.video;
    return;
  }

  lienVideo.dataset.video = creerLienIntegreYouTube(video);
  lienVideo.setAttribute("aria-label", `Lire la vidéo du projet ${titre}`);
  lienVideo.hidden = false;
}

// Ouvre le lecteur dans la page au clic et recharge une source vide à la fermeture.
function preparerLecteurVideo() {
  if (!lienVideo || !modaleVideo || !lecteurVideo || !fermerVideo) return;

  lienVideo.addEventListener("click", () => {
    if (!lienVideo.dataset.video) return;
    lecteurVideo.src = lienVideo.dataset.video;
    modaleVideo.showModal();
  });

  fermerVideo.addEventListener("click", () => modaleVideo.close());

  modaleVideo.addEventListener("close", () => {
    lecteurVideo.removeAttribute("src");
  });
}

// Affiche le code hexadécimal (#0000) sous chaque cercle de la palette.
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
  // Le texte change lorsque c'est d'un projet individuel.
  if (!texteCredits) return;

  if (projet.equipe === "Projet individuel") {
    texteCredits.textContent = `Projet individuel réalisé dans le cadre du cours ${projet.cours}.`;
    return;
  }

  texteCredits.textContent = `Projet réalisé dans le cadre du cours ${projet.cours}. Merci à ${projet.equipe}.`;
}

// Affiche les étapes du projet si elles sont présentes dans le JSON.
function afficherProcessusLogiciels(projet) {
  const etapes = projet.etapes;
  if (!sectionProcessusLogiciels || !titreProcessusLogiciels || !descriptionProcessusLogiciels || !listeProcessusLogiciels || !imagesProcessusLogiciels) return;
  if (!etapes) {
    sectionProcessusLogiciels.hidden = true;
    return;
  }

  sectionProcessusLogiciels.hidden = false;
  titreProcessusLogiciels.textContent = etapes.titre || "Étapes et logiciels";
  descriptionProcessusLogiciels.textContent = etapes.description || "";
  listeProcessusLogiciels.replaceChildren(
    ...(etapes.logiciels || []).map((logiciel) => {
      const item = document.createElement("li");
      item.textContent = logiciel;
      return item;
    })
  );
  imagesProcessusLogiciels.replaceChildren(
    ...(etapes.images || []).map((image) => {
      const figure = document.createElement("figure");
      const elementImage = document.createElement("img");
      const legende = document.createElement("figcaption");
      definirImage(elementImage, image.source, image.alt || "Étape de création");
      legende.textContent = image.legende || "";
      figure.append(elementImage, legende);
      return figure;
    })
  );
}

function afficherGalerie(images, titre) {
  if (!galerie) return;

  // les images sont dan JSON galerie donc Map() va aller les chercer et les afficher dans la galerie.
  galerie.replaceChildren(
    ...images.map((source, index) => {
      const figure = document.createElement("figure");
      const image = document.createElement("img");

      if (index === 0) figure.className = "image-principale";
      definirImage(image, source, `${titre} — image ${index + 1}`);
      figure.append(image);
      return figure;
    })
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
      `${titre} — image ${indexActuel + 1}`
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
    })
  );

  precedent.disabled = suivant.disabled = images.length < 2;
  precedent.addEventListener("click", () => afficherImage(indexActuel - 1));
  suivant.addEventListener("click", () => afficherImage(indexActuel + 1));
  afficherImage(0);
}

// Lance une animation douce quand une section arrive dans la fenêtre.
function preparerAnimationsPage() {
  const sections = document.querySelectorAll(
    ".projet-presentation, .projet-palette, .projet-details, .autres-projets, .credits"
  );
  // Si cette fonction n'est pas prise en charge, le contenu apparaît tout de suite.
  if (!window.IntersectionObserver) {
    sections.forEach((section) => section.classList.add("est-visible"));
    return;
  }

  const observateur = new IntersectionObserver(
    (entrees, observer) => {
      // Plusieurs sections peuvent arriver en même temps : on les vérifie toutes.
      entrees.forEach((entree) => {
        if (!entree.isIntersecting) return;

        entree.target.classList.add("est-visible");
        observer.unobserve(entree.target);
      });
    },
    { threshold: 0.12 }
  );

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

  // Un projet en cours peut être présenté même si ses images ne sont pas prêtes.
  if (projet.enCours || projet.social) {
    document.body.classList.add("projet-en-preparation");
    const section = document.querySelector("#projet-en-cours");
    const description = document.querySelector("#projet-en-cours-description");
    section.hidden = false;
    description.textContent = projet.description || "";
    // Les comptes sont des liens directs vers les contenus de médias sociaux.
    if (projet.social) {
      section.classList.add("projet-en-cours--social");
      section.querySelector("h2").textContent = "Vidéos et publications d’activités";
      section.querySelector(".projet-en-cours__statut").textContent = "Création de contenu · Instagram";
      description.nextElementSibling.hidden = true;
      const visuel = section.querySelector(".projet-en-cours__visuel");
      visuel.replaceChildren();
      visuel.removeAttribute("aria-label");
      visuel.hidden = true;
      // Les médias et leurs descriptions viennent du même JSON que les projets.
      const galerieSociale = document.createElement("section");
      galerieSociale.className = "reseaux-sociaux";
      galerieSociale.setAttribute("aria-label", "Vidéos et publications réalisées");
      // Un compte = une section. Ajouter un compte dans le JSON permet d’en créer une autre.
      projet.comptes.forEach((compte) => {
        const groupe = document.createElement("section");
        groupe.className = "reseaux-sociaux__groupe";
        const entete = document.createElement("header");
        const nom = document.createElement("h2");
        nom.textContent = compte.titre || compte.nom;
        const identite = document.createElement("div");
        identite.className = "reseaux-sociaux__identite";
        const avatar = document.createElement(compte.avatar ? "img" : "span");
        avatar.className = "reseaux-sociaux__avatar";
        avatar.setAttribute("aria-hidden", "true");
        if (compte.avatar) {
          avatar.src = compte.avatar;
          avatar.alt = "";
        } else {
          avatar.textContent = compte.id === "cafe1025" ? "☕" : "A";
        }
        identite.append(avatar, nom);
        const lien = document.createElement("a");
        lien.href = compte.url;
        lien.target = "_blank";
        lien.rel = "noopener noreferrer";
        lien.textContent = `Instagram · ${compte.nom} ↗`;
        const introduction = document.createElement("p");
        introduction.textContent = compte.description;
        const profil = document.createElement("div");
        profil.append(identite, lien, introduction);
        const detailsCompte = document.createElement("div");
        detailsCompte.className = "reseaux-sociaux__details";
        if (compte.statistiques) {
          const statistiques = document.createElement("dl");
          statistiques.className = "reseaux-sociaux__stats";
          Object.entries(compte.statistiques).forEach(([libelle, nombre]) => {
            const item = document.createElement("div");
            const terme = document.createElement("dt");
            terme.textContent = libelle;
            const valeur = document.createElement("dd");
            valeur.textContent = nombre;
            item.append(terme, valeur);
            statistiques.append(item);
          });
          detailsCompte.append(statistiques);
        }
        const bio = document.createElement("p");
        bio.className = "reseaux-sociaux__bio";
        bio.textContent = compte.bio || "";
        detailsCompte.append(bio);
        entete.append(profil, detailsCompte);
        const grille = document.createElement("div");
        grille.className = "medias-sociaux";
        groupe.append(entete, grille);
        galerieSociale.append(groupe);
        (projet.medias || []).filter(media => media.compte === compte.id).forEach((media, indexMedia) => {
        const carte = document.createElement("article");
        carte.style.setProperty("--delai-carte", `${(indexMedia % 4) * 110}ms`);
        const titre = document.createElement("h3");
        titre.textContent = media.titre;
        const contenu = document.createElement(media.type === "video" ? "video" : "img");
        contenu.src = media.source;
        if (media.type === "video") {
          contenu.controls = true;
          contenu.loop = true;
          contenu.playsInline = true;
          contenu.preload = "none";
          contenu.setAttribute("aria-label", media.titre);
        } else {
          contenu.alt = media.titre;
          contenu.loading = "lazy";
        }
        const figure = document.createElement("figure");
        const texte = document.createElement("figcaption");
        texte.textContent = media.description;
        figure.append(contenu, texte);
        carte.append(titre, figure);
        // Le lien du post est prioritaire; sans ce lien, on indique clairement le profil.
        const publication = document.createElement("a");
        publication.className = "reseaux-sociaux__publication";
        publication.href = media.url || compte.url;
        publication.target = "_blank";
        publication.rel = "noopener noreferrer";
        publication.textContent = media.url ? "Voir la publication ↗" : `Voir ${compte.nom} ↗`;
        carte.append(publication);
        grille.append(carte);
        });
        if (compte.id === "cafe1025") {
          // Regroupe les cartes par quatre; seule la page courante reste visible.
          const cartes = [...grille.children];
          const diapositives = [];
          grille.classList.add("cafe-carrousel");
          for (let index = 0; index < cartes.length; index += 4) {
            const diapositive = document.createElement("div");
            diapositive.className = "cafe-carrousel__slide";
            diapositive.append(...cartes.slice(index, index + 4));
            grille.append(diapositive);
            diapositives.push(diapositive);
          }
          let page = 0;
          const commandes = document.createElement("div");
          commandes.className = "cafe-carrousel__commandes";
          const precedent = document.createElement("button");
          precedent.type = "button";
          precedent.textContent = "←";
          precedent.setAttribute("aria-label", "Publications précédentes");
          const suivant = document.createElement("button");
          suivant.type = "button";
          suivant.textContent = "→";
          suivant.setAttribute("aria-label", "Publications suivantes");
          const compteur = document.createElement("span");
          compteur.setAttribute("aria-live", "polite");
          function afficherSlide() {
            diapositives.forEach((slide, index) => { slide.hidden = index !== page; });
            compteur.textContent = `${page + 1} / ${diapositives.length}`;
            precedent.disabled = page === 0;
            suivant.disabled = page === diapositives.length - 1;
          }
          precedent.addEventListener("click", () => { page--; afficherSlide(); });
          suivant.addEventListener("click", () => { page++; afficherSlide(); });
          commandes.append(precedent, compteur, suivant);
          groupe.append(commandes);
          if (diapositives.length) afficherSlide();
        }
      });
      section.after(galerieSociale);
      // Chaque groupe entre une seule fois lorsqu’il arrive dans l’écran.
      const groupes = galerieSociale.querySelectorAll(".reseaux-sociaux__groupe");
      if ("IntersectionObserver" in window) {
        const apparition = new IntersectionObserver((entrees) => {
          entrees.forEach((entree) => {
            if (!entree.isIntersecting) return;
            entree.target.classList.add("social-visible");
            apparition.unobserve(entree.target);
          });
        }, { threshold: 0.06 });
        groupes.forEach((groupe) => {
          groupe.classList.add("social-animation");
          apparition.observe(groupe);
        });
      }
    }
    definirFondHero(projet.hero || projet.apercu);
    definirLienVideo(projet.video, projet.title);
    message.textContent = "";
    return;
  }

  titrePresentation.textContent = projet.descriptionCourte || projet.title;
  titreImagePresentation.textContent = "Description";
  texteImagePresentation.textContent = projet.description;
  texteRole.textContent = projet.role;
  texteLogiciels.textContent = projet.logiciels;
  titreProcessus.textContent = "Processus";
  texteProcessus.textContent = projet.demande;
  afficherProcessusLogiciels(projet);
  titreGalerie.textContent = projet.categorie;
  texteGalerie.textContent = projet.realisation;
  afficherCredits(projet);
  if (projet.document) {
    const guide = document.createElement("a");
    guide.href = projet.document;
    guide.textContent = "Consulter le guide des normes graphiques (PDF) ↗";
    guide.className = "reseaux-sociaux__publication";
    guide.target = "_blank";
    guide.rel = "noopener noreferrer";
    texteCredits.after(guide);
  }

  definirFondHero(projet.hero || projet.apercu);
  definirLienVideo(projet.video, projet.title);
  afficherPalette(projet.palette || []);
  definirImage(
    imagePresentation,
    imagesPresentation[0],
    `${projet.title} — aperçu`
  );
  definirImage(
    imageDescription,
    imagesPresentation[1],
    `${projet.title} — détail`
  );
  afficherGalerie(images, projet.title);
  afficherCarrousel(imagesCarrousel, projet.title);
  message.textContent = "";
}

async function init() {
  // URLSearchParams lit le texte après le ? dans une adresse Web. -- il va chercher le id de la page et chercher le projet correspondant dans le fichier JSON.
  // Exemple : projet.html?projet=mati-r donne l'identifiant "mati-r".
  const identifiant = new URLSearchParams(window.location.search).get("projet");
  preparerLecteurVideo();

  try {
    const projets = await loadProjects();
    // find retourne le premier projet dont l'id correspond à l'adresse.
    const projet = projets.find((element) => element.id === identifiant);

    if (!projet) throw new Error("Projet introuvable.");
    afficherProjet(projet);
    document.dispatchEvent(new Event("projets-charges"));
    preparerAnimationsPage();
  } catch (erreur) {
    message.textContent = "Ce projet est indisponible pour le moment.";
    console.error(erreur);
  }
}

init();
