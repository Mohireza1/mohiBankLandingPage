'use strict';

// DOM Elements
const readMore = document.querySelector('.head__link--read-more');
const features = document.querySelector('.features');

const operationeTitles = document.querySelectorAll('.operation-title');
const operationeTitlesContainer = document.querySelector('.operation-titles');
const operations = document.querySelectorAll('.operation-content');

const navLinkContainer = document.querySelector('.menu--wide');
const navLinks = document.querySelectorAll('.menu--wide__button');

const mobileMenuOpen = document.querySelector('.menu--mobile__open');
const mobileMenuClose = document.querySelector('.menu--mobile__close');
const menuOverlay = document.querySelector('.menu__overlay');
const mobileMenu = document.querySelector('.menu--mobile');

const sections = document.querySelectorAll('section');

const lazyImg = document.querySelectorAll('.lazy-img');

const slides = document.querySelectorAll('.slide');
const arrowLeft = document.querySelector('.arrow--left');
const arrowRight = document.querySelector('.arrow--right');

const dots = document.querySelector('.dots');
let allDots;

////////////////////////////////////////////
// Event Listeners

// Scroll readmore to features
readMore.addEventListener('click', () => {
  features.scrollIntoView({ behavior: 'smooth' });
});

// Tabs

// My way

// operationeTitles.forEach(t =>
//   t.addEventListener('click', () => {
//     const titleIndex = [...operationeTitles].indexOf(t);
//     operationeTitles.forEach(op => {
//       if (op !== t) {
//         op.classList.remove('operation-title--active');
//       }
//     });
//     t.classList.add('operation-title--active');
//     operations.forEach(o => {
//       const operationIndex = [...operations].indexOf(o);
//       if (operationIndex !== titleIndex) {
//         operations[operationIndex].classList.remove(
//           'operation-content--active'
//         );
//       }
//     });
//     operations[titleIndex].classList.add('operation-content--active');
//   })
// );

// Jonas' way
operationeTitlesContainer.addEventListener('click', e => {
  const target = e.target.closest('.operation-title');

  // Guard clause
  if (!target) return;

  operationeTitles.forEach(t => t.classList.remove('operation-title--active'));
  target.classList.add('operation-title--active');

  operations.forEach(o => o.classList.remove('operation-content--active'));
  document
    .querySelector(`.operation-content--${target.dataset.tab}`)
    .classList.add('operation-content--active');
});

// Navbar gray out other links when hover on one
const linkOpaSet = opa => navLinks.forEach(l => (l.style.opacity = opa));

navLinkContainer.addEventListener('mouseover', e => {
  const target = e.target;

  if (target.classList.contains('menu--wide__button')) {
    linkOpaSet('50%');
    target.style.opacity = '100%';
  }
});

// Navbar back to normal when mouse is out
navLinkContainer.addEventListener('mouseout', () => linkOpaSet('100%'));

// Mobile menu
mobileMenuOpen.addEventListener('click', () => {
  menuOverlay.classList.remove('hidden');
  mobileMenu.classList.remove('hidden');
});
const mobileCloser = () => {
  menuOverlay.classList.add('hidden');
  mobileMenu.classList.add('hidden');
};
mobileMenuClose.addEventListener('click', () => {
  mobileCloser();
});
menuOverlay.addEventListener('click', () => {
  mobileCloser();
});

// Loading sections on scroll
const sectionLoad = (ents, obv) => {
  const [ent] = ents;
  if (!ent.isIntersecting) return;
  ent.target.classList.remove('jump-in');
  obv.unobserve(ent.target);
};

const sectionObserver = new IntersectionObserver(sectionLoad, {
  root: null,
  threshold: 0.1,
});

sections.forEach(sec => sectionObserver.observe(sec));

// Load images on scroll
const loadMainImg = (ents, obv) => {
  const [ent] = ents;
  if (!ent.isIntersecting) return;
  ent.target.src = ent.target.dataset.src;
  ent.target.addEventListener('load', () => {
    ent.target.style.filter = 'none';
  });
  obv.unobserve(ent.target);
};
const imageLoadObserver = new IntersectionObserver(loadMainImg, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
});
lazyImg.forEach(img => imageLoadObserver.observe(img));

// Dynamic slide translateX
slides.forEach((slide, i) => {
  slide.style.transform = `translateX(${i * 150}%)`;
});

// Timeout
let timeout;

// TranslateX changer (dynamic)
let currSlide = 0;
const slideRight = () => {
  currSlide++;
  slides.forEach((slide, i) => {
    slide.style.transform = `translateX(${(i - currSlide) * 150}%)`;
  });
  if (currSlide === slides.length) {
    currSlide = 0;
    slides.forEach((slide, i) => {
      slide.style.transform = `translateX(${i * 150}%)`;
    });
  }
  dotChange();
};
const slideLeft = () => {
  if (timeout) clearTimeout(timeout);
  clearInterval(autoSlide);
  currSlide--;
  slides.forEach((slide, i) => {
    slide.style.transform = `translateX(${(i - currSlide) * 150}%)`;
  });
  if (currSlide === -1) {
    currSlide = slides.length - 1;
    slides.forEach((slide, i) => {
      slide.style.transform = `translateX(${(i - slides.length + 1) * 150}%)`;
    });
  }
  timeout = setTimeout(() => {
    autoSlide = setInterval(() => {
      slideRight();
    }, 4000);
  }, 5000);
  dotChange();
};

arrowLeft.addEventListener('click', slideLeft);
arrowRight.addEventListener('click', () => {
  if (timeout) clearTimeout(timeout);
  clearInterval(autoSlide);
  slideRight();
  timeout = setTimeout(() => {
    autoSlide = setInterval(() => {
      slideRight();
    }, 4000);
  }, 5000);
});

// Auto slider
let autoSlide = setInterval(() => {
  slideRight();
}, 4000);

// Dot creator
slides.forEach((_, i) => {
  dots.insertAdjacentHTML(
    'beforeend',
    `<button class="dots__dot" data-dot=${i}></button>`
  );
  allDots = document.querySelectorAll('.dots__dot');
});

// Dot changer
const dotChange = () => {
  allDots.forEach(dot => {
    dot.style.opacity = '50%';
  });
  const active = document.querySelector(`.dots__dot[data-dot="${currSlide}"]`);
  active.style.opacity = '100%';
};
dotChange();

// Dot change with click
dots.addEventListener('click', e => {
  if (timeout) clearTimeout(timeout);
  clearInterval(autoSlide);
  if (!e.target.classList.contains('dots__dot')) return;
  allDots.forEach(dot => (dot.style.opacity = '50%'));
  e.target.style.opacity = '100%';
  currSlide = e.target.dataset.dot;
  slides.forEach((slide, i) => {
    slide.style.transform = `translateX(${(i - currSlide) * 150}%)`;
  });
  timeout = setTimeout(() => {
    autoSlide = setInterval(() => {
      slideRight();
    }, 4000);
  }, 5000);
});

////////////////////////////////////////////
