const fittedTitle = document.querySelector('[data-fit-title]');

if (fittedTitle) {
  const wideLayout = window.matchMedia('(min-width: 96rem)');

  function fitTitle() {
    if (!wideLayout.matches) return;

    let smallest = 2;
    let largest = 6;
    for (let step = 0; step < 9; step++) {
      const size = (smallest + largest) / 2;
      fittedTitle.style.setProperty('--project-title-size', `${size}rem`);
      const lineHeight = parseFloat(getComputedStyle(fittedTitle).lineHeight);

      if (fittedTitle.getBoundingClientRect().height <= 2 * lineHeight + 0.1) {
        smallest = size;
      } else {
        largest = size;
      }
    }
    fittedTitle.style.setProperty('--project-title-size', `${smallest}rem`);
  }

  wideLayout.addEventListener('change', fitTitle);
  document.fonts.ready.then(fitTitle);
}

document.querySelectorAll('[data-project-animation]').forEach((figure) => {
  const image = figure.querySelector('img');
  const button = figure.querySelector('[data-animation-toggle]');
  const status = figure.querySelector('[data-animation-status]');
  const preview = image.src;
  let animation;
  let playingUrl;

  function showPreview() {
    image.src = preview;
    if (playingUrl) URL.revokeObjectURL(playingUrl);
    playingUrl = undefined;
    button.textContent = 'Play animation';
  }

  button.hidden = false;
  button.addEventListener('click', async () => {
    status.textContent = '';
    if (playingUrl) {
      showPreview();
      return;
    }

    button.disabled = true;
    status.classList.add('project-visually-hidden');
    status.textContent = 'Loading animation…';
    try {
      if (!animation) {
        const response = await fetch(figure.dataset.projectAnimation);
        if (!response.ok) throw new Error('Animation could not be loaded.');
        animation = await response.blob();
      }
      playingUrl = URL.createObjectURL(animation);
      image.src = playingUrl;
      await image.decode();
      button.textContent = 'Stop animation';
      status.textContent = '';
    } catch {
      animation = undefined;
      showPreview();
      status.textContent = 'Could not load the animation. Try again.';
    } finally {
      status.classList.remove('project-visually-hidden');
      button.disabled = false;
    }
  });
});

document.querySelectorAll('[data-project-gallery]').forEach((gallery) => {
  const slides = [...gallery.querySelectorAll('[data-slide]')];
  const controls = gallery.querySelector('.project-gallery-controls');
  const count = gallery.querySelector('[data-gallery-count]');
  let current = 0;

  function showSlide(index) {
    slides[current].querySelector('video')?.pause();
    current = (index + slides.length) % slides.length;
    slides.forEach((slide, position) => {
      slide.hidden = position !== current;
    });
    count.textContent = `${current + 1} / ${slides.length}`;
  }

  showSlide(0);
  if (slides.length > 1) {
    gallery.dataset.ready = '';
    controls.hidden = false;
    gallery.querySelector('[data-previous]').addEventListener('click', () => showSlide(current - 1));
    gallery.querySelector('[data-next]').addEventListener('click', () => showSlide(current + 1));
  }
});

document.querySelectorAll('[data-copy-bibtex]').forEach((button) => {
  const code = document.querySelector('#bibtex-code code');
  const status = document.querySelector('[data-copy-status]');
  let reset;

  button.hidden = false;
  button.addEventListener('click', async () => {
    clearTimeout(reset);

    try {
      await navigator.clipboard.writeText(code.textContent);
      button.textContent = 'Copied';
      status.textContent = 'BibTeX copied to clipboard.';
      reset = setTimeout(() => {
        button.textContent = 'Copy BibTeX';
        status.textContent = '';
      }, 2000);
    } catch {
      const citation = document.createRange();
      citation.selectNodeContents(code);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(citation);
      code.parentElement.focus();
      status.textContent = 'BibTeX selected. Use your browser’s copy command.';
    }
  });
});
