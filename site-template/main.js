/* ==========================================================================
   Contractor Site Template — Shared behavior
   Covers: mobile nav toggle, persistent chat widget shell, and form
   submit handling. The chat widget and quote/contact forms are NOT wired
   to any backend yet — see the TODO markers below for where to connect
   an n8n webhook (or other endpoint) later.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function () {

  /* ---------- Mobile nav toggle ---------- */
  var navToggle = document.querySelector('.nav-toggle');
  if (navToggle) {
    navToggle.addEventListener('click', function () {
      document.body.classList.toggle('nav-open');
    });
    document.querySelectorAll('.main-nav a').forEach(function (link) {
      link.addEventListener('click', function () {
        document.body.classList.remove('nav-open');
      });
    });
  }

  /* ---------- Chat widget ---------- */
  var chatLauncher = document.querySelector('.chat-launcher');
  if (chatLauncher) {
    chatLauncher.addEventListener('click', function () {
      document.body.classList.toggle('chat-open');
    });
  }

  var chatClose = document.querySelector('.chat-close');
  if (chatClose) {
    chatClose.addEventListener('click', function () {
      document.body.classList.remove('chat-open');
    });
  }

  var chatForm = document.querySelector('.chat-form');
  if (chatForm) {
    chatForm.addEventListener('submit', function (e) {
      e.preventDefault();
      // TODO: once chat is automated, POST { name, phone } here to the
      // n8n webhook that kicks off the conversation, instead of just
      // showing a static confirmation.
      document.body.classList.add('chat-sent');
    });
  }

  /* ---------- Quote / contact forms ---------- */
  document.querySelectorAll('form[data-lead-form]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      // TODO: wire this to the real lead-intake endpoint (e.g. an n8n
      // webhook) so submissions actually reach the contractor.
      var confirm = form.parentElement.querySelector('.form-confirm');
      form.style.display = 'none';
      if (confirm) confirm.style.display = 'block';
    });
  });

});
