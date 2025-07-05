// DOM elementit
const themeToggle = document.getElementById('theme-toggle');
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
const backToTopBtn = document.getElementById('backToTop');
const heroSection = document.querySelector('.hero-section');
const modal = document.getElementById('modal');
const contactForm = document.getElementById('contact-form');

// Teemanvaihtaja
function toggleTheme() {
  document.body.classList.toggle('dark-mode');
  const isDarkMode = document.body.classList.contains('dark-mode');
  
  // Tallenna teema localStorageen
  localStorage.setItem('darkMode', isDarkMode);
  
  // Vaihda ikoni
  themeToggle.textContent = isDarkMode ? '☀️' : '🌙';
}

// Lataa tallennettu teema
function loadTheme() {
  const savedTheme = localStorage.getItem('darkMode');
  if (savedTheme === 'true') {
    document.body.classList.add('dark-mode');
    themeToggle.textContent = '☀️';
  }
}

// Mobiilivalikko
function toggleMobileMenu() {
  navLinks.classList.toggle('open');
  menuToggle.classList.toggle('active');
}

// Sulje mobiilivalikko kun linkkiä klikataan
function closeMobileMenu() {
  if (navLinks.classList.contains('open')) {
    navLinks.classList.remove('open');
    menuToggle.classList.remove('active');
  }
}

// Takaisin ylös -painike
function handleBackToTopButton() {
  if (window.scrollY > 300) {
    backToTopBtn.classList.add('show');
  } else {
    backToTopBtn.classList.remove('show');
  }
}

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}

// Modaali-ikkuna
function openModal(clickedCard) {
  const title = clickedCard.dataset.title;
  const description = clickedCard.dataset.description;
  
  const modalBody = document.getElementById('modal-body');
  modalBody.innerHTML = `
    <h3>${title}</h3>
    <p>${description}</p>
    <div class="modal-actions">
      <button class="modal-btn primary">Katso demo</button>
      <button class="modal-btn secondary">GitHub</button>
    </div>
  `;
  
  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden'; // Estä sivun vieritys
}

function closeModal() {
  modal.classList.add('hidden');
  document.body.style.overflow = 'auto'; // Palauta sivun vieritys
}

// Sulje modaali kun klikataan taustaa
function handleModalClick(event) {
  if (event.target === modal) {
    closeModal();
  }
}

// Sulje modaali ESC-näppäimellä
function handleKeyPress(event) {
  if (event.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
}

// Yhteydenottolomake
function handleFormSubmit(event) {
  event.preventDefault();
  
  const formData = new FormData(contactForm);
  const name = formData.get('name');
  const email = formData.get('email');
  const message = formData.get('message');
  
  // Simuloi lomakkeen lähetys
  const submitBtn = contactForm.querySelector('button[type="submit"]');
  const originalText = submitBtn.textContent;
  
  submitBtn.textContent = 'Lähetetään...';
  submitBtn.disabled = true;
  
  setTimeout(() => {
    alert(`Kiitos viestistäsi, ${name}! Otan yhteyttä pian.`);
    contactForm.reset();
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
  }, 1500);
}

// Sujuva vieritys navigaatiolinkeille
function handleNavClick(event) {
  const href = event.target.getAttribute('href');
  
  // Tarkista onko sisäinen linkki
  if (href && href.startsWith('#')) {
    event.preventDefault();
    const targetId = href.substring(1);
    const targetElement = document.getElementById(targetId);
    
    if (targetElement) {
      const offsetTop = targetElement.offsetTop - 70; // Huomioi kiinteä navigaatio
      
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
      
      // Sulje mobiilivalikko jos auki
      closeMobileMenu();
    }
  }
}

// Parallax-efekti hero-osiolle
function handleParallax() {
  const scrolled = window.scrollY;
  
  if (heroSection) {
    const rate = scrolled * -0.5;
    heroSection.style.transform = `translateY(${rate}px)`;
  }
}

// Animaatiot kun elementit tulevat näkyviin
function handleIntersection(entries, observer) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      // Lopeta elementin tarkkailu, kun animaatio on suoritettu
      observer.unobserve(entry.target);
    }
  });
}

// Yhdistetty skrollauksen käsittelijä
function handleScrollEvents() {
  handleBackToTopButton();
  handleParallax();
}

// Alusta Intersection Observer
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver(handleIntersection, observerOptions);
  
  // Lisää animaatiot elementeille
  const animatedElements = document.querySelectorAll('.card, .about-text, .skills');
  animatedElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });
}

// Event listenerit
function initEventListeners() {
  // Teemanvaihtaja
  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
  }
  
  // Mobiilivalikko
  if (menuToggle) {
    menuToggle.addEventListener('click', toggleMobileMenu);
  }
  
  // Navigaatiolinkit
  if (navLinks) {
    navLinks.addEventListener('click', handleNavClick);
  }
  
  // Takaisin ylös
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', scrollToTop);
  }
  
  // Scroll-tapahtumat
  window.addEventListener('scroll', handleScrollEvents);
  
  // Modaali
  if (modal) {
    modal.addEventListener('click', handleModalClick);
  }
  
  // Näppäimistö
  document.addEventListener('keydown', handleKeyPress);
  
  // Yhteydenottolomake
  if (contactForm) {
    contactForm.addEventListener('submit', handleFormSubmit);
  }
  
  // Sulje mobiilivalikko kun ikkunan kokoa muutetaan
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
      closeMobileMenu();
    }
  });
}

// Alusta sovellus kun DOM on ladattu
document.addEventListener('DOMContentLoaded', () => {
  loadTheme();
  initEventListeners();
  initScrollAnimations();
});

// Globaalit funktiot modaalille (tarvitaan HTML:ssä)
window.openModal = openModal;
window.closeModal = closeModal;
