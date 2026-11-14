/* ==========================================================
   SITE SETTINGS - edit these values, nothing else needs to change
   ========================================================== */
const SITE = {
  email: 'abeera.devhub@gmail.com',
  githubUrl: 'https://github.com/abeera-devhub',
  linkedinUrl: 'https://www.linkedin.com/in/abeera-mustafa-87b50b41a', // LinkedIn links are hidden if this is empty

  // Contact form: get a free access key at https://web3forms.com (enter your email, the key is emailed to you).
  // While this is empty the form checks the fields, then asks visitors to email you instead. It never fakes a success.
  web3formsAccessKey: '31a9037f-5469-4886-8daa-23aa25147afc',
};

const FORM_ENDPOINT = 'https://api.web3forms.com/submit';

document.addEventListener('DOMContentLoaded', () => {
  applySiteLinks();
  setupMobileMenu();
  setupActiveNav();
  setupContactForm();
  setupGallery();
  setupTypewriter();
});

/* ---------- Social & email links ---------- */
function applySiteLinks() {
  const urls = {
    github: SITE.githubUrl,
    linkedin: SITE.linkedinUrl,
    email: SITE.email ? `mailto:${SITE.email}` : '',
  };

  document.querySelectorAll('[data-link]').forEach((link) => {
    const url = urls[link.dataset.link];
    link.hidden = !url; // no URL yet = no broken link on the page
    if (url) link.href = url;
  });

  // Wrapper text such as " and LinkedIn" only shows when that link exists
  document.querySelectorAll('[data-link-wrap]').forEach((wrap) => {
    wrap.hidden = !urls[wrap.dataset.linkWrap];
  });

  document.querySelectorAll('[data-email-text]').forEach((el) => {
    el.textContent = SITE.email;
  });
}

/* ---------- Mobile menu ---------- */
function setupMobileMenu() {
  const toggle = document.querySelector('.menu-toggle');
  const menu = document.getElementById('mobile-menu');
  if (!toggle || !menu) return;

  const desktopQuery = window.matchMedia('(min-width: 1024px)');

  function openMenu() {
    menu.hidden = false;
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Close menu');
    document.documentElement.style.overflow = 'hidden'; // stop the page scrolling behind the menu
    menu.querySelector('a')?.focus();
  }

  function closeMenu({ returnFocus = false } = {}) {
    if (menu.hidden) return;
    menu.hidden = true;
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open menu');
    document.documentElement.style.overflow = '';
    if (returnFocus) toggle.focus();
  }

  toggle.addEventListener('click', () => {
    if (menu.hidden) openMenu();
    else closeMenu({ returnFocus: true });
  });

  // Close before the browser jumps to the section, so scrolling is unlocked
  menu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => closeMenu());
  });

  document.addEventListener('keydown', (event) => {
    if (menu.hidden) return;

    if (event.key === 'Escape') {
      closeMenu({ returnFocus: true });
      return;
    }

    // Keep Tab inside the menu button + menu links while open
    if (event.key === 'Tab') {
      const focusable = [toggle, ...menu.querySelectorAll('a')];
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });

  // If the screen grows to desktop size, the mobile menu is no longer needed
  desktopQuery.addEventListener('change', (event) => {
    if (event.matches) closeMenu();
  });
}

/* ---------- Highlight the nav link for the section on screen ---------- */
function setupActiveNav() {
  const links = [...document.querySelectorAll('.nav-link[href^="#"]')];
  const sectionIds = [...new Set(links.map((link) => link.getAttribute('href').slice(1)))];
  const sections = sectionIds.map((id) => document.getElementById(id)).filter(Boolean);
  if (!sections.length) return;

  let currentId;
  let ticking = false;

  function updateActiveLink() {
    ticking = false;
    const line = window.scrollY + 140; // just below the fixed header
    const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;

    let activeId = null; // nothing highlighted while you're in the hero
    if (atBottom) {
      activeId = sections[sections.length - 1].id;
    } else {
      sections.forEach((section) => {
        if (section.getBoundingClientRect().top + window.scrollY <= line) activeId = section.id;
      });
    }

    if (activeId === currentId) return;
    currentId = activeId;
    links.forEach((link) => {
      if (link.getAttribute('href') === `#${activeId}`) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    });
  }

  function onScroll() {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(updateActiveLink);
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  updateActiveLink();
}

/* ---------- Contact form ---------- */
function setupContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const status = document.getElementById('form-status');
  const submitButton = form.querySelector('button[type="submit"]');
  const submitLabel = form.querySelector('[data-submit-label]');
  const isConnected = Boolean(SITE.web3formsAccessKey);

  const fields = {
    name: form.elements.name,
    email: form.elements.email,
    subject: form.elements.subject,
    message: form.elements.message,
  };

  const rules = {
    name: (value) => (value ? '' : 'Enter your name.'),
    email: (value) => {
      if (!value) return 'Enter your email address.';
      // Simple check: something@something.something, no spaces
      return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value) ? '' : 'Enter a valid email address, like name@example.com.';
    },
    subject: (value) => (value ? '' : 'Add a subject.'),
    message: (value) => {
      if (!value) return 'Write a message.';
      return value.length < 10 ? 'Add a few more details (at least 10 characters).' : '';
    },
  };

  function validateField(name) {
    const input = fields[name];
    const error = rules[name](input.value.trim());
    const errorEl = document.getElementById(`${input.id}-error`);
    errorEl.textContent = error;
    errorEl.hidden = !error;
    if (error) input.setAttribute('aria-invalid', 'true');
    else input.removeAttribute('aria-invalid');
    return !error;
  }

  // Re-check a field once its error is showing, so the message clears as it's fixed
  Object.keys(fields).forEach((name) => {
    fields[name].addEventListener('blur', () => {
      if (fields[name].value.trim()) validateField(name);
    });
    fields[name].addEventListener('input', () => {
      if (fields[name].hasAttribute('aria-invalid')) validateField(name);
    });
  });

  function showStatus(type, title, text, linkEmail = false) {
    status.dataset.type = type;
    status.querySelector('[data-status-title]').textContent = title;
    const textEl = status.querySelector('[data-status-text]');
    textEl.textContent = text;
    if (linkEmail) {
      const link = document.createElement('a');
      link.href = `mailto:${SITE.email}`;
      link.textContent = SITE.email;
      textEl.append(' ', link, '.');
    }
    status.hidden = false;
    status.focus({ preventScroll: true });
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    status.hidden = true;

    const results = Object.keys(fields).map(validateField);
    if (results.includes(false)) {
      Object.values(fields).find((input) => input.hasAttribute('aria-invalid')).focus();
      return;
    }

    if (!isConnected) {
      showStatus('error', 'Message not sent.', 'The form isn\u2019t connected yet. Please email me directly at', true);
      return;
    }

    const data = new FormData(form);
    data.append('access_key', SITE.web3formsAccessKey);
    data.append('from_name', 'Portfolio contact form');

    submitButton.disabled = true;
    submitLabel.textContent = 'Sending…';

    try {
      const response = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: data,
      });
      const result = await response.json().catch(() => ({}));

      if (!response.ok || result.success === false) {
        throw new Error(result.message || `Request failed (${response.status})`);
      }
      form.reset();
      showStatus('success', 'Message sent.', 'Thanks for getting in touch. I’ll reply to the email address you gave.');
    } catch (error) {
      // The exact reason (e.g. "Invalid access key") shows in the browser console: press F12 > Console
      console.error('Contact form error:', error.message);
      showStatus('error', 'Message not sent.', 'Something went wrong on the way. Try again in a moment, or email me directly at', true);
    } finally {
      submitButton.disabled = false;
      submitLabel.textContent = 'Send Message';
    }
  });
}

/* ---------- Project screenshot gallery ---------- */
function setupGallery() {
  const dialog = document.getElementById('gallery-dialog');
  if (!dialog || typeof dialog.showModal !== 'function') return; // very old browsers: thumbnails just stay as images

  const image = document.getElementById('gallery-image');
  const caption = document.getElementById('gallery-caption');
  const count = document.getElementById('gallery-count');
  let items = [];
  let current = 0;
  let opener = null;

  function show(index) {
    current = (index + items.length) % items.length; // wrap around at both ends
    const item = items[current];
    image.src = item.dataset.full;
    image.alt = item.dataset.caption;
    caption.textContent = item.dataset.caption;
    count.textContent = `${current + 1} / ${items.length}`;
  }

  document.querySelectorAll('[data-gallery]').forEach((gallery) => {
    const thumbs = [...gallery.querySelectorAll('.gallery-thumb')];
    gallery.querySelectorAll('[data-gallery-index]').forEach((button) => {
      button.addEventListener('click', () => {
        items = thumbs;
        opener = button;
        show(Number(button.dataset.galleryIndex));
        dialog.showModal();
        document.documentElement.style.overflow = 'hidden';
      });
    });
  });

  dialog.querySelector('.gallery-prev').addEventListener('click', () => show(current - 1));
  dialog.querySelector('.gallery-next').addEventListener('click', () => show(current + 1));
  dialog.querySelector('.gallery-close').addEventListener('click', () => dialog.close());

  // Clicking the dark area outside the picture closes the viewer
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });

  dialog.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') show(current - 1);
    if (event.key === 'ArrowRight') show(current + 1);
  });

  // Escape closes the dialog natively; this runs for every way of closing
  dialog.addEventListener('close', () => {
    document.documentElement.style.overflow = '';
    opener?.focus();
  });
}

/* ---------- Hero role: typed out one letter at a time ---------- */
function setupTypewriter() {
  const target = document.querySelector('[data-typewriter]');
  if (!target) return;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) return; // the full text is already in the page

  const text = target.textContent;
  target.textContent = '';
  let index = 0;

  function typeNext() {
    index += 1;
    target.textContent = text.slice(0, index);
    if (index < text.length) window.setTimeout(typeNext, 55);
    else target.classList.add('is-done');
  }
  window.setTimeout(typeNext, 400);
}
