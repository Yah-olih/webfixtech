/* =========================
       HEADER SCROLL
    ========================== */

const header = document.getElementById("header");

window.addEventListener("scroll", () => {

  if (window.scrollY > 30) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }

});


/* =========================
   FAQ ACCORDION
========================== */

const faqItems = document.querySelectorAll(".faq-item");

faqItems.forEach(item => {

  const question = item.querySelector(".faq-question");
  const answer = item.querySelector(".faq-answer");

  question.addEventListener("click", () => {

    const isActive = item.classList.contains("active");

    faqItems.forEach(other => {

      other.classList.remove("active");

      const otherAnswer =
        other.querySelector(".faq-answer");

      otherAnswer.style.maxHeight = null;

    });

    if (!isActive) {

      item.classList.add("active");

      answer.style.maxHeight =
        answer.scrollHeight + "px";

    }

  });

});


/* =========================
   WHATSAPP POR SERVIÇO
========================== */

const whatsappNumber = "5511918621446";

document.querySelectorAll(".service-card").forEach(card => {
  card.style.cursor = "pointer";

  card.addEventListener("click", () => {
    const service = card.dataset.service || "serviço";
    const message = `Olá! Gostaria de solicitar um orçamento para ${service}.`;
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

    window.open(url, "_blank");
  });
});


/* =========================
   REVEAL ON SCROLL
========================== */

const revealElements = document.querySelectorAll(".reveal:not(.process-item)");

const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.12
  }
);

revealElements.forEach(element => {
  observer.observe(element);
});

/* =========================
   MOBILE MENU
========================== */

const mobileMenu = document.querySelector(".mobile-menu");
const navLinks = document.querySelector(".nav-links");

// 1. Abrir ou fechar ao clicar no botão hambúrguer
mobileMenu.addEventListener("click", (event) => {
  event.stopPropagation(); // Evita que o clique feche o menu imediatamente
  navLinks.classList.toggle("mobile-open");
});

// 2. Fechar o menu ao rolar a página (para cima ou para baixo)
window.addEventListener("scroll", () => {
  if (navLinks.classList.contains("mobile-open")) {
    navLinks.classList.remove("mobile-open");
  }
});

// 3. Fechar o menu ao clicar em qualquer lugar fora dele
document.addEventListener("click", (event) => {
  if (
    navLinks.classList.contains("mobile-open") &&
    !navLinks.contains(event.target) &&
    !mobileMenu.contains(event.target)
  ) {
    navLinks.classList.remove("mobile-open");
  }
});

// 4. Fechar o menu ao clicar em qualquer opção (link)
document.querySelectorAll(".nav-links a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("mobile-open");
  });
});

/* =========================================================
   DESFOCAR INSTAGRAM AO CLICAR (EVITA FICAR PRESO NO MOBILE)
   ========================================================= */
document.querySelectorAll(".social-icon").forEach((icon) => {
  icon.addEventListener("click", function () {
    this.blur();
  });
});


/* =========================================================
   CARROSSEL MOBILE: DETECTA CARD CENTRAL E APLICA BLUR
   ========================================================= */

function setupMobileCarousels() {
  const grids = document.querySelectorAll('.services-grid, .process-grid');

  grids.forEach(grid => {
    const cards = grid.querySelectorAll('.service-card, .process-item');

    const updateActiveCard = () => {
      if (window.innerWidth > 600) {
        cards.forEach(card => card.classList.remove('active-card'));
        return;
      }

      const gridCenter = grid.getBoundingClientRect().left + grid.offsetWidth / 2;

      let closestCard = null;
      let minDistance = Infinity;

      cards.forEach(card => {
        const cardBox = card.getBoundingClientRect();
        const cardCenter = cardBox.left + cardBox.width / 2;
        const distance = Math.abs(gridCenter - cardCenter);

        if (distance < minDistance) {
          minDistance = distance;
          closestCard = card;
        }
      });

      cards.forEach(card => {
        if (card === closestCard) {
          card.classList.add('active-card');
        } else {
          card.classList.remove('active-card');
        }
      });
    };

    grid.addEventListener('scroll', updateActiveCard);
    window.addEventListener('resize', updateActiveCard);

    updateActiveCard();
  });
}

// Inicializa o controle do carrossel
document.addEventListener('DOMContentLoaded', setupMobileCarousels);

function setupMobileServicesCarousel() {
  const grid = document.querySelector('.services-grid');
  if (!grid) return;

  const cards = grid.querySelectorAll('.service-card');

  const updateActiveCard = () => {
    if (window.innerWidth > 600) {
      cards.forEach(card => card.classList.remove('active-card'));
      return;
    }

    const gridCenter = grid.getBoundingClientRect().left + grid.offsetWidth / 2;
    let closestCard = null;
    let minDistance = Infinity;

    cards.forEach(card => {
      const cardBox = card.getBoundingClientRect();
      const cardCenter = cardBox.left + cardBox.width / 2;
      const distance = Math.abs(gridCenter - cardCenter);

      if (distance < minDistance) {
        minDistance = distance;
        closestCard = card;
      }
    });

    cards.forEach(card => {
      if (card === closestCard) {
        card.classList.add('active-card');
      } else {
        card.classList.remove('active-card');
      }
    });
  };

  grid.addEventListener('scroll', updateActiveCard);
  window.addEventListener('resize', updateActiveCard);
  updateActiveCard();
}

document.addEventListener('DOMContentLoaded', setupMobileServicesCarousel);

/* =========================================================
   PULL-TO-REFRESH (ARRASTAR PARA BAIXO PARA ATUALIZAR)
   ========================================================= */

let startY = 0;
let currentY = 0;
let isPulling = false;

const loader = document.getElementById("pull-refresh-loader");
const spinner = loader ? loader.querySelector(".spinner") : null;

window.addEventListener("touchstart", (e) => {
  if (window.scrollY === 0) {
    startY = e.touches[0].clientY;
    isPulling = true;
  }
}, { passive: true });

window.addEventListener("touchmove", (e) => {
  if (!isPulling || !loader) return;
  currentY = e.touches[0].clientY;
  const distance = currentY - startY;

  // Se estiver puxando para baixo no topo da tela
  if (distance > 0 && window.scrollY === 0) {
    const pullDistance = Math.min(distance * 0.5, 90); // Efeito de resistência ao puxar

    loader.style.opacity = Math.min(pullDistance / 60, 1);
    loader.style.transform = `translate(-50%, ${pullDistance}px)`;

    // Gira o elemento conforme a força do puxão
    if (spinner) {
      spinner.style.transform = `rotate(${distance * 2}deg)`;
    }
  }
}, { passive: true });

window.addEventListener("touchend", () => {
  if (!isPulling || !loader) return;

  const distance = currentY - startY;

  // Se o puxão passou de 120px
  if (distance > 120 && window.scrollY === 0) {
    loader.style.transform = `translate(-50%, 80px)`;
    loader.classList.add("refreshing");

    // Aguarda uma breve animação antes de recarregar a página
    setTimeout(() => {
      window.location.reload();
    }, 400);
  } else {
    // Esconde o loader caso não tenha puxado o suficiente
    loader.style.opacity = "0";
    loader.style.transform = "translate(-50%, 0px)";
  }

  startY = 0;
  currentY = 0;
  isPulling = false;
});