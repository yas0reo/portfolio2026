const liensProjets = document.querySelectorAll('.projets__lien');
const imageApercu = document.querySelector('.projets__apercu-image');
const texteApercu = document.querySelector('.projets__apercu-texte');

function afficherApercu(lien) {
  const { preview, previewAlt } = lien.dataset;

  texteApercu.textContent = lien.textContent.trim();
  texteApercu.classList.remove('is-hidden');
  imageApercu.classList.remove('is-visible');

  if (!preview) return;

  imageApercu.src = preview;
  imageApercu.alt = previewAlt;
}

imageApercu.addEventListener('load', () => {
  imageApercu.classList.add('is-visible');
  texteApercu.classList.add('is-hidden');
});

imageApercu.addEventListener('error', () => {
  imageApercu.removeAttribute('src');
  imageApercu.alt = '';
});

liensProjets.forEach((lien) => {
  lien.addEventListener('mouseenter', () => afficherApercu(lien));
  lien.addEventListener('focus', () => afficherApercu(lien));
});
