/* ==========================================================================
   Contractor Site Template — Shared behavior
   Covers: mobile nav toggle, persistent chat widget shell, form
   submit handling, and missed-call text-back. Chat widget, quote/contact
   forms, and Call Now clicks all notify the contractor (and Mr. East) by SMS
   via n8n webhooks.
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

  /* ---------- Chat widget open/close ---------- */
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

  /* ---------- Chat widget form ---------- */
  var chatForm = document.querySelector('.chat-form');
  if (chatForm) {
    chatForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var nameField = document.getElementById('chat-name');
      var phoneField = document.getElementById('chat-phone');
      var msgField = document.getElementById('chat-message');
      sendLead({
        business_name: getBusinessName(),
        name: nameField ? nameField.value : '',
        phone: phoneField ? phoneField.value : '',
        message: msgField ? msgField.value : '',
        contractor_phone: getContractorPhone()
      });
      document.body.classList.add('chat-sent');
    });
  }

  /* ---------- Quote / contact forms ---------- */
  document.querySelectorAll('form[data-lead-form]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var nameInput = form.querySelector('input[type="text"]');
      var phoneInput = form.querySelector('input[type="tel"]');
      var msgInput = form.querySelector('textarea');
      sendLead({
        business_name: getBusinessName(),
        name: nameInput ? nameInput.value : '',
        phone: phoneInput ? phoneInput.value : '',
        message: msgInput ? msgInput.value : '',
        contractor_phone: getContractorPhone()
      });
      var confirm = form.parentElement.querySelector('.form-confirm');
      form.style.display = 'none';
      if (confirm) confirm.style.display = 'block';
    });
  });

  /* ---------- Missed-call text-back ---------- */
  var CALL_WEBHOOK_URL = 'https://landoneast.app.n8n.cloud/webhook/call-now-click';

  document.addEventListener('click', function (e) {
    var link = e.target.closest('a[href^="tel:"]');
    if (!link) return;

    var contractorPhone = getContractorPhone();
    if (!contractorPhone) return;

    fetch(CALL_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        business_name: getBusinessName(),
        contractor_phone: contractorPhone
      }),
      keepalive: true
    }).catch(function (err) {
      console.error('Call webhook error:', err);
    });
  });
});
