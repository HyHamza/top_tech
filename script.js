// --- Sticky Navbar ---
const navbar = document.getElementById('navbar');
if (navbar) {
  const stickyOffset = navbar.offsetTop + 100;
  function handleScroll() {
    if (window.pageYOffset > stickyOffset) {
      navbar.classList.add('sticky');
    } else {
      navbar.classList.remove('sticky');
    }
  }
  window.addEventListener('scroll', handleScroll);
}

// --- Cart Logic ---
let cart = JSON.parse(localStorage.getItem("cart")) || [];
const cartCount = document.querySelector(".cart-count");

function updateCartCount() {
  const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);
  if (cartCount) cartCount.textContent = totalQty;
}

// Show toast notification
function showToast() {
  const toastEl = document.getElementById("cartToast");
  if (toastEl) {
    const toast = new bootstrap.Toast(toastEl);
    toast.show();
  }
}

// DOM Ready
// document.addEventListener("DOMContentLoaded", () => {
//   updateCartCount();

//   const addToCartButtons = document.querySelectorAll(".add-to-cart");
//   addToCartButtons.forEach((button) => {
//     button.addEventListener("click", (e) => {
//       e.preventDefault();

//       const name = button.dataset.name;
//       const price = parseFloat(button.dataset.price);

//       const existingItem = cart.find((item) => item.name === name);
//       if (existingItem) {
//         existingItem.quantity += 1;
//       } else {
//         cart.push({ name, price, quantity: 1 });
//       }

//       localStorage.setItem("cart", JSON.stringify(cart));
//       updateCartCount();
//       showToast();
//     });
//   });
// });

// --- Testimonial Slider ---
const testimonials = [
  {
    img: 'https://images.unsplash.com/photo-1642364861013-2c33f2dcfbcf',
    quote: 'Amazing selection and fast shipping! Found exactly what I needed for my new setup.',
    author: 'Alex Johnson',
  },
  {
    img: 'https://images.unsplash.com/photo-1659353220441-9207b962a133',
    quote: 'The customer service was top-notch. They helped me choose the perfect laptop.',
    author: 'Maria Garcia',
  },
  {
    img: 'https://images.unsplash.com/photo-1733796941440-9935f13a1cec',
    quote: 'Great prices and the quality of the smartwatch exceeded my expectations. Highly recommend!',
    author: 'David Smith',
  },
  {
    img: 'https://images.unsplash.com/photo-1700832161143-de261675534b',
    quote: 'Top Tech is my go-to for tech gadgets. Always reliable and great deals.',
    author: 'Sam Lee',
  },
];

let currentSlide = 0;
const sliderContent = document.querySelector('.testimonial-slider .slider-content');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
let autoSlideInterval;

function renderSlider() {
  if (!sliderContent) return;
  sliderContent.innerHTML = '';
  testimonials.forEach((testimonial) => {
    const slideDiv = document.createElement('div');
    slideDiv.classList.add('testimonial-slide');
    slideDiv.innerHTML = `
      <img src="${testimonial.img}" alt="Customer ${testimonial.author}">
      <blockquote>"${testimonial.quote}"</blockquote>
      <p class="author">- ${testimonial.author}</p>
    `;
    sliderContent.appendChild(slideDiv);
  });
}

function showSlide(index) {
  if (!sliderContent) return;
  const slides = sliderContent.querySelectorAll('.testimonial-slide');
  if (slides.length === 0) return;

  currentSlide = (index + slides.length) % slides.length;
  slides.forEach((slide) => slide.classList.remove('active'));
  slides[currentSlide].classList.add('active');
}

function startAutoSlide() {
  stopAutoSlide();
  autoSlideInterval = setInterval(() => {
    showSlide(currentSlide + 1);
  }, 5000);
}

function stopAutoSlide() {
  clearInterval(autoSlideInterval);
}

if (nextBtn && prevBtn) {
  nextBtn.addEventListener('click', () => {
    showSlide(currentSlide + 1);
    stopAutoSlide();
  });

  prevBtn.addEventListener('click', () => {
    showSlide(currentSlide - 1);
    stopAutoSlide();
  });
}

renderSlider();
showSlide(currentSlide);
startAutoSlide();

// --- Footer Year ---
const currentYearSpan = document.getElementById('currentYear');
if (currentYearSpan) {
  currentYearSpan.textContent = new Date().getFullYear();
}

// --- Active Navbar Link on Scroll ---
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.navbar-nav .nav-link[href^="#"]');

function changeNavOnScroll() {
  if (!navLinks || navLinks.length === 0) return;

  let currentSection = '';
  const offset = navbar ? navbar.offsetHeight + 20 : 100;

  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    if (pageYOffset >= sectionTop - offset) {
      currentSection = section.getAttribute('id');
    }
  });

  if (window.innerHeight + window.pageYOffset >= document.body.offsetHeight - 50) {
    const lastSection = sections[sections.length - 1];
    if (lastSection) currentSection = lastSection.id;
  }

  navLinks.forEach((link) => {
    link.classList.remove('active');
    const linkHref = link.getAttribute('href');
    if (linkHref === `#${currentSection}`) {
      link.classList.add('active');
    }
  });

  if (pageYOffset < sections[0].offsetTop - offset) {
    navLinks.forEach((link) => link.classList.remove('active'));
    const homeLink = document.querySelector('.navbar-nav .nav-link[href="#hero"]');
    if (homeLink) homeLink.classList.add('active');
  }
}

window.addEventListener('scroll', changeNavOnScroll);
changeNavOnScroll();

// --- Smooth Scrolling ---
const smoothScrollLinks = document.querySelectorAll('.navbar-nav .nav-link[href^="#"]');
smoothScrollLinks.forEach((link) => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const targetId = link.getAttribute('href').substring(1);
    const targetSection = document.getElementById(targetId);
    if (targetSection) {
      const offset = navbar ? navbar.offsetHeight : 0;
      const targetPosition = targetSection.offsetTop - offset;
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth',
      });
    }
  });
});
