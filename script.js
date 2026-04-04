/* ============================================================
   NAVBAR — scroll effect + mobile toggle
============================================================ */
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  if (window.scrollY > 40) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navLinks.classList.toggle('open');
});

// Close mobile nav on link click
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navLinks.classList.remove('open');
  });
});

/* ============================================================
   TYPING EFFECT — hero headline
============================================================ */
const phrases = [
  'AI Chatbots',
  'Automation Agents',
  'RAG Systems',
  'AI Employees',
  'Intelligent Tools',
];

let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typingEl = document.getElementById('typingText');

function type() {
  if (!typingEl) return;

  const current = phrases[phraseIndex];

  if (!isDeleting) {
    typingEl.textContent = current.slice(0, charIndex + 1);
    charIndex++;
    if (charIndex === current.length) {
      isDeleting = true;
      setTimeout(type, 2200);
      return;
    }
  } else {
    typingEl.textContent = current.slice(0, charIndex - 1);
    charIndex--;
    if (charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
    }
  }

  const speed = isDeleting ? 60 : 95;
  setTimeout(type, speed);
}

// Start after short delay
setTimeout(type, 800);

/* ============================================================
   FADE-IN ON SCROLL — IntersectionObserver
============================================================ */
const fadeEls = document.querySelectorAll('.fade-in');

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);

fadeEls.forEach(el => observer.observe(el));

/* ============================================================
   COUNTER ANIMATION — stat numbers
============================================================ */
function animateCounter(el, target, duration = 1600) {
  let start = 0;
  const step = target / (duration / 16);

  const update = () => {
    start += step;
    if (start < target) {
      el.textContent = Math.floor(start);
      requestAnimationFrame(update);
    } else {
      el.textContent = target;
    }
  };
  requestAnimationFrame(update);
}

const statsObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.target, 10);
        animateCounter(el, target);
        statsObserver.unobserve(el);
      }
    });
  },
  { threshold: 0.5 }
);

document.querySelectorAll('.stat-number[data-target]').forEach(el => {
  statsObserver.observe(el);
});

/* ============================================================
   ACTIVE NAV LINK — highlight on scroll
============================================================ */
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navAnchors.forEach(a => {
          a.style.color = '';
          if (a.getAttribute('href') === `#${id}`) {
            if (!a.classList.contains('nav-cta')) {
              a.style.color = 'var(--cyan)';
            }
          }
        });
      }
    });
  },
  { threshold: 0.4 }
);

sections.forEach(s => sectionObserver.observe(s));

/* ============================================================
   COPY LINKEDIN TAGLINE
============================================================ */
function copyTagline(btn) {
  const taglineEl = document.querySelector('.tagline-text');
  if (!taglineEl) return;

  const text = taglineEl.textContent.trim().replace(/["""]/g, '"');
  navigator.clipboard.writeText(text).then(() => {
    btn.classList.add('copied');
    const original = btn.innerHTML;
    btn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg> Copied!`;
    setTimeout(() => {
      btn.classList.remove('copied');
      btn.innerHTML = original;
    }, 2000);
  });
}

/* ============================================================
   CONTACT FORM SUBMIT
============================================================ */
async function handleSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const btn = form.querySelector('button[type="submit"]');
  const originalHTML = btn.innerHTML;

  btn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> Sending...`;
  btn.disabled = true;

  const payload = {
    name: form.name.value.trim(),
    email: form.email.value.trim(),
    service: form.service.value,
    message: form.message.value.trim(),
  };

  try {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || 'Something went wrong.');
    }

    btn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg> Message Sent!`;
    btn.style.background = 'linear-gradient(135deg, #059669, #10b981)';
    form.reset();

    setTimeout(() => {
      btn.innerHTML = originalHTML;
      btn.style.background = '';
      btn.disabled = false;
    }, 3000);

  } catch (err) {
    btn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg> ${err.message}`;
    btn.style.background = 'linear-gradient(135deg, #dc2626, #ef4444)';

    setTimeout(() => {
      btn.innerHTML = originalHTML;
      btn.style.background = '';
      btn.disabled = false;
    }, 4000);
  }
}

/* ============================================================
   SMOOTH SCROLL for all # links
============================================================ */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = parseInt(getComputedStyle(document.documentElement)
        .getPropertyValue('--nav-h')) || 72;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ============================================================
   SERVICE CARD — subtle tilt on mouse move
============================================================ */
document.querySelectorAll('.service-card, .project-card, .why-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `translateY(-4px) rotateX(${-y * 4}deg) rotateY(${x * 4}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

/* ============================================================
   PARTICLE BACKGROUND (lightweight canvas)
============================================================ */
(function () {
  const canvas = document.createElement('canvas');
  canvas.style.cssText = `
    position: absolute; top: 0; left: 0; width: 100%; height: 100%;
    pointer-events: none; z-index: 0; opacity: 0.45;
  `;
  const heroSection = document.getElementById('home');
  if (!heroSection) return;
  heroSection.style.position = 'relative';
  heroSection.insertBefore(canvas, heroSection.firstChild);

  const ctx = canvas.getContext('2d');
  let W, H, particles;

  function resize() {
    W = canvas.width = heroSection.offsetWidth;
    H = canvas.height = heroSection.offsetHeight;
  }

  function createParticles() {
    particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.5 + 0.3,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      alpha: Math.random() * 0.5 + 0.1,
      color: Math.random() > 0.5 ? '124,58,237' : '6,182,212',
    }));
  }

  let animating = true;

  function draw() {
    if (!animating) return;
    ctx.clearRect(0, 0, W, H);

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(124,58,237,${0.08 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0) p.x = W;
      if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H;
      if (p.y > H) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.color},${p.alpha})`;
      ctx.fill();
    });

    requestAnimationFrame(draw);
  }

  const heroObserver = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        if (!animating) { animating = true; draw(); }
      } else {
        animating = false;
      }
    },
    { threshold: 0 }
  );
  heroObserver.observe(heroSection);

  resize();
  createParticles();
  draw();
  window.addEventListener('resize', () => { resize(); createParticles(); });
})();

/* ============================================================
   YOUTUBE THUMBNAIL — click to load iframe
============================================================ */
function loadYT(wrapper, videoId) {
  const iframe = document.createElement('iframe');
  iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
  iframe.allow = 'autoplay; encrypted-media';
  iframe.allowFullscreen = true;
  iframe.style.cssText = 'width:100%;height:100%;border:0;display:block;';
  wrapper.innerHTML = '';
  wrapper.appendChild(iframe);
}

/* ============================================================
   VIDEO DEMO — hover to preview, click to play full
============================================================ */
function playDemoVideo(id) {
  const thumb = document.getElementById(id + '-thumb');
  const video = document.getElementById(id + '-video');
  if (!thumb || !video) return;
  thumb.style.display = 'none';
  video.style.display = 'block';
  video.play();
}

function hoverPlayVideo(id) {
  const thumbVideo = document.getElementById(id + '-thumb-video');
  const playIcon = document.getElementById(id + '-play-icon');
  if (!thumbVideo) return;
  thumbVideo.play();
  if (playIcon) playIcon.style.opacity = '0';
}

function hoverPauseVideo(id) {
  const thumbVideo = document.getElementById(id + '-thumb-video');
  const playIcon = document.getElementById(id + '-play-icon');
  if (!thumbVideo) return;
  thumbVideo.pause();
  thumbVideo.currentTime = 0;
  if (playIcon) playIcon.style.opacity = '1';
}
