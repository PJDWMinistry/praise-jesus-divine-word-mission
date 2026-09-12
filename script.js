/* ==========================================================================
   PRAISE JESUS DIVINE WORD MISSION — SCRIPT
   Contents:
     1. DOM Initialization
     2. Splash Screen
     3. Navigation
     4. Scroll Reveal
     5. Prayer Form
     6. Current Year
     7. Other UI Interactions
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function () {
  initSplashScreen();
  initNavigation();
  initScrollReveal();
  initPrayerForm();
  initCurrentYear();
  initSermonPlaceholders();
  initSupportPlaceholder();
});

/* ==========================================================================
   1. DOM INITIALIZATION (see DOMContentLoaded listener above)
   ========================================================================== */

/* ==========================================================================
   2. SPLASH SCREEN
   ========================================================================== */
function initSplashScreen() {
  var splash = document.getElementById('splash');
  if (!splash) return;

  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var holdTime = reducedMotion ? 200 : 1500;

  function hideSplash() {
    splash.classList.add('splash-hidden');
    // Prevent the splash from blocking interaction/screen readers once hidden.
    window.setTimeout(function () {
      splash.setAttribute('hidden', '');
    }, 850);
  }

  window.setTimeout(hideSplash, holdTime);

  // Failsafe: never let the splash block the site for more than a few seconds,
  // even if something above goes wrong.
  window.setTimeout(hideSplash, 4000);
}

/* ==========================================================================
   3. NAVIGATION
   ========================================================================== */
function initNavigation() {
  var header = document.getElementById('site-header');
  var toggle = document.getElementById('menu-toggle');
  var nav = document.getElementById('primary-nav');
  var scrim = document.getElementById('nav-scrim');

  // Sticky header background changes after scrolling past the hero fold.
  function onScroll() {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (!toggle || !nav || !scrim) return;

  function closeMenu() {
    nav.classList.remove('open');
    scrim.classList.remove('active');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  function openMenu() {
    nav.classList.add('open');
    scrim.classList.add('active');
    toggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  toggle.addEventListener('click', function () {
    var isOpen = nav.classList.contains('open');
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  scrim.addEventListener('click', closeMenu);

  // Close the mobile menu whenever a nav link is used.
  nav.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  // Close on Escape for keyboard users.
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeMenu();
  });
}

/* ==========================================================================
   4. SCROLL REVEAL
   ========================================================================== */
function initScrollReveal() {
  var revealEls = document.querySelectorAll('.reveal');
  if (!revealEls.length) return;

  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion || !('IntersectionObserver' in window)) {
    revealEls.forEach(function (el) { el.classList.add('visible'); });
    return;
  }

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
  );

  revealEls.forEach(function (el) { observer.observe(el); });
}

/* ==========================================================================
   5. PRAYER FORM
   ========================================================================== */
function initPrayerForm() {
  var form = document.getElementById('prayer-form');
  if (!form) return;

  var statusEl = document.getElementById('prayer-status');
  var submitBtn = document.getElementById('prayer-submit');

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    var payload = {
      name: form.name.value.trim(),
      email: form.email.value.trim(),
      message: form.message.value.trim(),
      submittedAt: new Date().toISOString()
    };

    /*
     * FUTURE BACKEND INTEGRATION POINT
     * ---------------------------------
     * Replace the block below with a real request once a backend/API is
     * available, e.g.:
     *
     *   fetch('/api/prayer-requests', {
     *     method: 'POST',
     *     headers: { 'Content-Type': 'application/json' },
     *     body: JSON.stringify(payload)
     *   })
     *   .then(function (res) { ... })
     *   .catch(function (err) { ... });
     *
     * No network calls are made in Version 1 — this is a front-end-only demo.
     */
    submitPrayerRequestPlaceholder(payload);

    var originalLabel = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';

    window.setTimeout(function () {
      submitBtn.disabled = false;
      submitBtn.textContent = originalLabel;
      statusEl.textContent = 'Thank you. Your prayer request has been received.';
      showToast('Thank you. Your prayer request has been received.');
      form.reset();

      window.setTimeout(function () {
        statusEl.textContent = '';
      }, 6000);
    }, 700);
  });
}

function submitPrayerRequestPlaceholder(payload) {
  // Placeholder handler for Version 1. Intentionally does not send data
  // anywhere. Kept as a named function so it is easy to locate and replace.
  console.log('Prayer request captured (not yet sent to a backend):', payload);
}

/* ==========================================================================
   6. CURRENT YEAR
   ========================================================================== */
function initCurrentYear() {
  var yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}

/* ==========================================================================
   7. OTHER UI INTERACTIONS
   ========================================================================== */

/* Sermon play buttons — placeholder behavior until real video links are
   added. Each sermon card/item carries a data-video attribute intended to
   hold a YouTube (or other) URL in a future version. */
function initSermonPlaceholders() {
  var playButtons = document.querySelectorAll('.play-btn, .sermon-play');
  playButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var card = btn.closest('[data-video]');
      var videoUrl = card ? card.getAttribute('data-video') : '';

      if (videoUrl) {
        window.open(videoUrl, '_blank', 'noopener');
      } else {
        showToast('Video coming soon. Check back for this message.');
      }
    });
  });
}

/* "Support the Mission" placeholder — no payment gateway in Version 1. */
function initSupportPlaceholder() {
  var supportBtn = document.getElementById('support-btn');
  if (!supportBtn) return;

  supportBtn.addEventListener('click', function (e) {
    // The button already links to #contact so people can reach the ministry.
    // This toast simply sets expectations until online giving is connected.
    showToast('Online giving is coming soon. Please reach out via the contact details below.');
  });
}

/* Shared toast helper used by the prayer form and other placeholder actions. */
var toastTimeout;
function showToast(message) {
  var toast = document.getElementById('toast');
  if (!toast) return;

  clearTimeout(toastTimeout);
  toast.textContent = message;
  toast.classList.add('show');

  toastTimeout = window.setTimeout(function () {
    toast.classList.remove('show');
  }, 4000);
}
