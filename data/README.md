# Les données des projets

`projects.json` contient la liste des projets du portfolio.

Le format JSON ne permet pas d'écrire des commentaires. Ce document explique donc
les mots utilisés dans chaque projet :

- `id` : identifiant unique utilisé dans l'adresse Web.
- `title` : nom affiché du projet.
- `lien` : adresse de la page de détail.
- `couleur` : thème visuel du projet.
- `hero` et `apercu` : image de couverture.
- `presentation`, `galerie` et `carrousel` : listes de chemins vers les images.
- `description`, `demande` et `realisation` : textes affichés dans la page.
- `palette` : cinq couleurs en code hexadécimal, par exemple `#ffffff`.

Pour ajouter un projet, copier un objet existant, changer son `id`, puis ajouter
ses textes et les chemins de ses images.
