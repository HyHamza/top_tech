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
function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

function addToCart(name, price) {
  const existing = cart.find((i) => i.name === name);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ name, price, quantity: 1 });
  }
  saveCart();
  updateCartCount();
  showToast('Product added to cart');
}

function loadCartItems() {
  const container = document.getElementById('cart-items');
  const totalEl = document.getElementById('cart-total');
  if (!container) return;
  container.innerHTML = '';
  if (cart.length === 0) {
    container.innerHTML = '<p>Your cart is empty.</p>';
    if (totalEl) totalEl.textContent = '0';
    return;
  }
  cart.forEach((item, idx) => {
    const row = document.createElement('div');
    row.className = 'row cart-item align-items-center mb-3';
    row.innerHTML = `
      <div class="col-md-4">${item.name}</div>
      <div class="col-md-2">$${item.price}</div>
      <div class="col-md-3 d-flex align-items-center">
        <button class="btn btn-sm btn-outline-secondary quantity-btn" data-action="decrease" data-index="${idx}">-</button>
        <span class="mx-2">${item.quantity}</span>
        <button class="btn btn-sm btn-outline-secondary quantity-btn" data-action="increase" data-index="${idx}">+</button>
      </div>
      <div class="col-md-2">$${(item.price * item.quantity).toFixed(2)}</div>
      <div class="col-md-1 text-end">
        <button class="btn btn-sm btn-danger remove-btn" data-index="${idx}">&times;</button>
      </div>`;
    container.appendChild(row);
  });
  const total = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
  if (totalEl) totalEl.textContent = total.toFixed(2);
}

function handleQuantityClick(e) {
  if (e.target.classList.contains('remove-btn')) {
    const idx = parseInt(e.target.dataset.index, 10);
    cart.splice(idx, 1);
  } else if (e.target.classList.contains('quantity-btn')) {
    const idx = parseInt(e.target.dataset.index, 10);
    const action = e.target.dataset.action;
    if (action === 'increase') {
      cart[idx].quantity += 1;
    } else if (action === 'decrease') {
      cart[idx].quantity -= 1;
      if (cart[idx].quantity <= 0) {
        cart.splice(idx, 1);
      }
    }
  } else {
    return;
  }
  saveCart();
  loadCartItems();
  updateCartCount();
}

document.addEventListener('click', handleQuantityClick);

function checkout() {
  if (cart.length === 0) {
    alert('Your cart is empty!');
    return;
  }
  alert('Order processed successfully!');
  cart = [];
  saveCart();
  loadCartItems();
  updateCartCount();
}
function showToast(message) {
  const toastEl = document.getElementById("cartToast");
  if (toastEl && bootstrap && bootstrap.Toast) {
    toastEl.querySelector(".toast-body")?.textContent = message;
    const toast = new bootstrap.Toast(toastEl);
    toast.show();
  } else {
    alert(message);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  updateCartCount();

  const productButtons = document.querySelectorAll('.product-card .btn-secondary');
  productButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const card = btn.closest('.product-card');
      const name = btn.dataset.name || card?.querySelector('.card-title')?.textContent;
      const priceText = btn.dataset.price || card?.querySelector('.price')?.textContent;
      const price = parseFloat(String(priceText).replace(/[^0-9.]/g, ''));
      if (name && !isNaN(price)) {
        e.preventDefault();
        addToCart(name, price);
        const href = btn.getAttribute('href');
        if (href && href !== '#' && !href.startsWith('javascript')) {
          window.location.href = href;
        }
      }
    });
  });

  loadCartItems();
  const checkoutBtn = document.getElementById('checkoutBtn');
  if (checkoutBtn) checkoutBtn.addEventListener('click', checkout);
});

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
