// Mobile navigation toggle[cite: 2]
const menuBtn = document.getElementById('menuBtn');
const mobileMenu = document.getElementById('mobileMenu');

menuBtn.addEventListener('click', () => {
  mobileMenu.classList.toggle('hidden');
});

document.querySelectorAll('#mobileMenu a').forEach(link => {
  link.addEventListener('click', () => mobileMenu.classList.add('hidden'));
});

// Persist the user's colour theme across visits.
const themeToggles = document.querySelectorAll('#themeToggle, #mobileThemeToggle');
const updateThemeToggle = () => {
  const isDark = document.documentElement.classList.contains('dark-theme');
  themeToggles.forEach(toggle => {
    toggle.setAttribute('aria-pressed', String(isDark));
    toggle.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
    toggle.querySelector('.theme-toggle-icon').textContent = isDark ? '☀' : '☾';
    toggle.querySelector('.theme-toggle-label').textContent = isDark ? 'Light mode' : 'Dark mode';
  });
};

themeToggles.forEach(toggle => {
  toggle.addEventListener('click', () => {
    const isDark = document.documentElement.classList.toggle('dark-theme');
    localStorage.setItem('primetenders-theme', isDark ? 'dark' : 'light');
    updateThemeToggle();
  });
});
updateThemeToggle();

// Dynamic year in footer[cite: 2]
document.getElementById('year').textContent = new Date().getFullYear();

// Quick-select preset service on dropdown / button click
const serviceSelect = document.getElementById('serviceSelect');
document.querySelectorAll('[data-service]').forEach(btn => {
  btn.addEventListener('click', (e) => {
    const selectedService = btn.getAttribute('data-service');
    if (selectedService && serviceSelect) {
      serviceSelect.value = selectedService;
    }
  });
});

// Enquiry Form Handling with Google Apps Script[cite: 2]
const form = document.getElementById('enquiryForm');
const status = document.getElementById('formStatus');
const submitBtn = document.getElementById('submitBtn');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const endpoint = window.PRIMETENDER_CONFIG?.APPS_SCRIPT_URL;
  const data = Object.fromEntries(new FormData(form).entries());

  status.textContent = '';
  status.className = 'mt-3 min-h-[1.25rem] text-center text-xs font-bold';

  if (!data.mobile.trim()) {
    status.textContent = 'Mobile / WhatsApp number is required.';
    status.classList.add('text-red-600');
    return;
  }

  if (!endpoint || endpoint.includes('PASTE_YOUR_APPS_SCRIPT')) {
    status.textContent = 'Please update config.js with your deployed Google Apps Script URL.';
    status.classList.add('text-amber-600');
    return;
  }

  submitBtn.disabled = true;
  submitBtn.innerHTML = '<span class="inline-block animate-spin mr-2">⟳</span> Submitting...';

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(data)
    });
    
    const result = await response.json();
    if (!result.success) throw new Error(result.message || 'Unable to save enquiry.');

    form.reset();
    status.textContent = '✓ Thank you! Your enquiry has been received. We will contact you shortly.';
    status.classList.add('text-emerald-600');
  } catch (error) {
    status.textContent = error.message || 'Network error. Please try again or reach out on WhatsApp.';
    status.classList.add('text-red-600');
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML = 'Send Enquiry <span class="ml-1">→</span>';
  }
});
