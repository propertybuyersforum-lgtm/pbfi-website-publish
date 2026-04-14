// ── NAVBAR ACTIVE STATE ──
document.addEventListener('DOMContentLoaded', () => {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.navbar-links a').forEach(link => {
    if (link.getAttribute('href') === currentPage) link.classList.add('active');
  });

  // Scroll-based navbar shadow
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.style.boxShadow = '0 2px 20px rgba(0,0,0,0.3)';
    } else {
      navbar.style.boxShadow = 'none';
    }
  });
});

// ── CONTACT FORM ──
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    document.getElementById('formContent').style.display = 'none';
    document.getElementById('formSuccess').style.display = 'block';
  });
}

// ── MEMBERSHIP FORM ──
function initMembershipForm() {
  const form = document.getElementById('membershipForm');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    document.getElementById('memberFormContent').style.display = 'none';
    document.getElementById('memberFormSuccess').style.display = 'block';
  });
}

// ── RESOURCE FILTER ──
function initResourceFilter() {
  const btns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.res-card');
  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      cards.forEach(card => {
        card.style.display = (filter === 'all' || card.dataset.type === filter) ? 'block' : 'none';
      });
    });
  });
}

// ── SMOOTH SCROLL ──
function smoothScrollTo(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}

// ── INIT ALL ──
document.addEventListener('DOMContentLoaded', () => {
  initContactForm();
  initMembershipForm();
  initResourceFilter();
});
