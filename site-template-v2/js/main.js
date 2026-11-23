/* ==========================================================================
   site-template-v2 — Shared behavior
   Covers: mobile nav toggle, lead/contact form submission, and
   leave-a-review.
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

  function getBusinessName() {
    var brand = document.querySelector('.site-header .brand-mark');
    return brand ? brand.textContent.trim() : '';
  }

  function getContractorPhone() {
    var hidden = document.getElementById('contractor-phone');
    return hidden ? hidden.value : '';
  }

  function getGoogleReviewUrl() {
    var hidden = document.getElementById('contractor-google-review');
    var url = hidden ? hidden.value.trim() : '';
    return /^https?:\/\//i.test(url) ? url : '';
  }

  /* ---------- Lead webhook ---------- */
  var LEAD_WEBHOOK_URL = 'https://landoneast.app.n8n.cloud/webhook/site-lead';

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

  /* ---------- Leave a review ---------- */
  var REVIEW_WEBHOOK_URL = 'https://landoneast.app.n8n.cloud/webhook/review-submitted';
  var reviewPanel = document.querySelector('.review-panel');

  if (reviewPanel) {
    var selectedRating = 0;
    var starButtons = reviewPanel.querySelectorAll('[data-star-picker] .star');
    var reviewSubmitBtn = reviewPanel.querySelector('[data-review-submit]');
    var reviewNameField = document.getElementById('review-name');
    var reviewEmailField = document.getElementById('review-email');
    var reviewMessageField = document.getElementById('review-message');
    var reviewGoogleLinkBtn = reviewPanel.querySelector('[data-review-google-link]');

    function setStarDisplay(rating) {
      starButtons.forEach(function (btn) {
        var val = parseInt(btn.getAttribute('data-star-value'), 10);
        btn.classList.toggle('is-selected', val <= rating);
      });
    }

    function showReviewStep(stepName) {
      reviewPanel.querySelectorAll('[data-review-step]').forEach(function (stepEl) {
        stepEl.style.display = stepEl.getAttribute('data-review-step') === stepName ? 'block' : 'none';
      });
    }

    function resetReviewPanel() {
      selectedRating = 0;
      setStarDisplay(0);
      if (reviewNameField) reviewNameField.value = '';
      if (reviewEmailField) reviewEmailField.value = '';
      if (reviewMessageField) reviewMessageField.value = '';
      showReviewStep('rating');
    }

    function sendReview(rating, extra) {
      var payload = {
        business_name: getBusinessName(),
        domain: window.location.hostname,
        contractor_phone: getContractorPhone(),
        rating: rating
      };
      for (var key in extra) payload[key] = extra[key];

      return fetch(REVIEW_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        keepalive: true
      }).catch(function (err) {
        console.error('Review webhook error:', err);
      });
    }

    document.querySelectorAll('[data-review-trigger]').forEach(function (trigger) {
      trigger.addEventListener('click', function () {
        resetReviewPanel();
        document.body.classList.add('review-open');
      });
    });

    var reviewClose = reviewPanel.querySelector('.review-close');
    if (reviewClose) {
      reviewClose.addEventListener('click', function () {
        document.body.classList.remove('review-open');
      });
    }

    starButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        selectedRating = parseInt(btn.getAttribute('data-star-value'), 10);
        setStarDisplay(selectedRating);

        if (selectedRating >= 4) {
          sendReview(selectedRating, {});
          var googleUrl = getGoogleReviewUrl();
          if (googleUrl) {
            window.location.href = googleUrl;
          } else {
            showReviewStep('thanks-public');
          }
          return;
        }

        showReviewStep('low-rating-form');
      });
    });

    if (reviewSubmitBtn) {
      reviewSubmitBtn.addEventListener('click', function () {
        sendReview(selectedRating, {
          name: reviewNameField ? reviewNameField.value : '',
          email: reviewEmailField ? reviewEmailField.value : '',
          feedback: reviewMessageField ? reviewMessageField.value : ''
        });

        var googleUrl = getGoogleReviewUrl();
        if (reviewGoogleLinkBtn) {
          if (googleUrl) {
            reviewGoogleLinkBtn.style.display = '';
            reviewGoogleLinkBtn.onclick = function () {
              window.open(googleUrl, '_blank', 'noopener');
            };
          } else {
            reviewGoogleLinkBtn.style.display = 'none';
          }
        }

        showReviewStep('thanks-private');
      });
    }
  }
});
