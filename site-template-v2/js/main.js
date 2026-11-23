/* ==========================================================================
   site-template-v2 — Shared behavior
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

  /* ---------- Lead webhook ---------- */
  var LEAD_WEBHOOK_URL = 'https://landoneast.app.n8n.cloud/webhook/site-lead';

  function getBusinessName() {
    var brand = document.querySelector('.site-header .brand-mark');
    return brand ? brand.textContent.trim() : '';
  }

  function getContractorPhone() {
    var hidden = document.getElementById('contractor-phone');
    return hidden ? hidden.value : '';
  }

  function sendLead(data) {
    return fetch(LEAD_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).catch(function (err) {
      console.error('Lead webhook error:', err);
    });
  }

  /* ---------- Quote / contact forms ---------- */
  document.querySelectorAll('form[data-lead-form]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var nameInput = form.querySelector('input[type="text"]');
      var phoneInput = form.querySelector('input[type="tel"]');
      var emailInput = form.querySelector('input[type="email"]');
      var msgInput = form.querySelector('textarea');
      sendLead({
        business_name: getBusinessName(),
        name: nameInput ? nameInput.value : '',
        phone: phoneInput ? phoneInput.value : '',
        email: emailInput ? emailInput.value : '',
        message: msgInput ? msgInput.value : '',
        contractor_phone: getContractorPhone()
      });
      var confirm = form.parentElement.querySelector('.form-confirm');
      form.style.display = 'none';
      if (confirm) confirm.style.display = 'block';
    });
  });
});
