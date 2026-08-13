const carousel = document.getElementById("servicesCarousel");
const cards = [...carousel.querySelectorAll(".service-card")];
const prev = document.querySelector(".carousel-btn.prev");
const next = document.querySelector(".carousel-btn.next");
const dotsWrap = document.getElementById("carouselDots");

function getMode() {
  if (window.innerWidth <= 700) return "mobile";
  if (window.innerWidth <= 1000) return "tablet";
  return "desktop";
}

function isCarouselControlsVisible() {
  return getMode() !== "desktop";
}

function getPageStarts() {
  const mode = getMode();

  if (mode === "desktop") return [];
  if (mode === "tablet") return [0, 2].filter(i => i < cards.length);

  return cards.map((_, i) => i);
}

/*
  Tablet:
  - 2 cards formam uma página.
  - A rolagem começa exatamente no primeiro card do grupo.
  Isso garante que o 3º e o 4º cards apareçam juntos na segunda página.

  Mobile:
  - 1 card por página.
  - O card fica centralizado.
*/
function goToCard(index) {
  if (!cards[index]) return;

  const mode = getMode();
  const card = cards[index];

  if (mode === "tablet") {
    const target = card.offsetLeft;
    const maxScroll = Math.max(0, carousel.scrollWidth - carousel.clientWidth);

    carousel.scrollTo({
      left: Math.min(target, maxScroll),
      behavior: "smooth"
    });
    return;
  }

  const target = card.offsetLeft - (carousel.clientWidth - card.offsetWidth) / 2;
  const maxScroll = Math.max(0, carousel.scrollWidth - carousel.clientWidth);

  carousel.scrollTo({
    left: Math.max(0, Math.min(target, maxScroll)),
    behavior: "smooth"
  });
}

function getActivePage() {
  const starts = getPageStarts();
  if (!starts.length) return 0;

  const mode = getMode();

  if (mode === "tablet") {
    // Como cada página começa exatamente no card 1 ou 3,
    // usamos a posição dos inícios das páginas.
    let closest = 0;
    let distance = Infinity;

    starts.forEach((cardIndex, pageIndex) => {
      const position = cards[cardIndex].offsetLeft;
      const d = Math.abs(carousel.scrollLeft - position);

      if (d < distance) {
        distance = d;
        closest = pageIndex;
      }
    });

    return closest;
  }

  const viewportCenter = carousel.scrollLeft + carousel.clientWidth / 2;
  let closest = 0;
  let distance = Infinity;

  starts.forEach((cardIndex, pageIndex) => {
    const card = cards[cardIndex];
    const cardCenter = card.offsetLeft + card.offsetWidth / 2;
    const d = Math.abs(cardCenter - viewportCenter);

    if (d < distance) {
      distance = d;
      closest = pageIndex;
    }
  });

  return closest;
}

function createDots() {
  dotsWrap.innerHTML = "";

  if (!isCarouselControlsVisible()) {
    dotsWrap.hidden = true;
    return;
  }

  dotsWrap.hidden = false;

  const starts = getPageStarts();

  starts.forEach((cardIndex, pageIndex) => {
    const button = document.createElement("button");
    button.type = "button";

    if (getMode() === "tablet") {
      button.setAttribute("aria-label", `Ir para grupo ${pageIndex + 1}`);
    } else {
      button.setAttribute("aria-label", `Ir para serviço ${cardIndex + 1}`);
    }

    button.addEventListener("click", () => goToCard(cardIndex));
    dotsWrap.appendChild(button);
  });

  updateDots();
}

function updateDots() {
  if (!isCarouselControlsVisible()) {
    dotsWrap.hidden = true;
    return;
  }

  dotsWrap.hidden = false;

  const activePage = getActivePage();

  [...dotsWrap.children].forEach((dot, index) => {
    dot.classList.toggle("active", index === activePage);
  });
}

function goToPage(direction) {
  const starts = getPageStarts();
  if (!starts.length) return;

  const current = getActivePage();
  const target = Math.max(0, Math.min(starts.length - 1, current + direction));

  goToCard(starts[target]);
}

if (prev) prev.addEventListener("click", () => goToPage(-1));
if (next) next.addEventListener("click", () => goToPage(1));

carousel.addEventListener("scroll", () => requestAnimationFrame(updateDots));

window.addEventListener("resize", () => {
  const mode = getMode();

  createDots();

  if (mode === "desktop") {
    carousel.scrollTo({ left: 0, behavior: "auto" });
    return;
  }

  const starts = getPageStarts();
  const page = Math.min(getActivePage(), starts.length - 1);

  if (starts[page] !== undefined) {
    goToCard(starts[page]);
  }
});

createDots();
