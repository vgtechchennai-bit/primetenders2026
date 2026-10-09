// Mobile navigation toggle
const menuBtn = document.getElementById('menuBtn');
const mobileMenu = document.getElementById('mobileMenu');

menuBtn?.addEventListener('click', () => mobileMenu.classList.toggle('hidden'));
document.querySelectorAll('#mobileMenu a').forEach(link => {
  link.addEventListener('click', () => mobileMenu.classList.add('hidden'));
});

// Persist the user's colour theme (Tailwind "dark" class on <html>).
const themeToggles = document.querySelectorAll('#themeToggle, #mobileThemeToggle');
const updateThemeToggle = () => {
  const isDark = document.documentElement.classList.contains('dark');
  themeToggles.forEach(toggle => {
    toggle.setAttribute('aria-pressed', String(isDark));
    toggle.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
    toggle.querySelector('.theme-toggle-icon').textContent = isDark ? '☀' : '☾';
    toggle.querySelector('.theme-toggle-label').textContent = isDark ? 'Light mode' : 'Dark mode';
  });
};

themeToggles.forEach(toggle => {
  toggle.addEventListener('click', () => {
    const isDark = document.documentElement.classList.toggle('dark');
    try { localStorage.setItem('primetenders-theme', isDark ? 'dark' : 'light'); } catch (e) {}
    updateThemeToggle();
  });
});
updateThemeToggle();

// Dynamic year in footer
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Service dropdown + quick-select buttons
const DEFAULT_SERVICE = 'Tender & GeM Services';
const serviceSelect = document.getElementById('serviceSelect');
const serviceSelectButton = document.getElementById('serviceSelectButton');
const serviceSelectWrap = serviceSelectButton?.parentElement;
const serviceSelectLabel = document.getElementById('serviceSelectLabel');
const serviceSelectMenu = document.getElementById('serviceSelectMenu');

const serviceLabels = {
  'Tender & GeM Services': 'Tender Management & GeM Bidding',
  'Custom Web Apps': 'Web Application Development',
  'Digital Signature Certificate (DSC)': 'Digital Signature Certificate (DSC - Class 3)',
  'Google Sheets & Apps Script': 'Google Sheets & Apps Script Automation',
  'MS Excel & VBA': 'MS Excel & VBA Macro Solutions',
  'Web Design & UI Development': 'Web Design & UI Development',
  Other: 'Other Custom Inquiry'
};

function setSelectedService(value) {
  if (!serviceSelect || !serviceLabels[value]) return;
  serviceSelect.value = value;
  if (serviceSelectLabel) serviceSelectLabel.textContent = serviceLabels[value];
  serviceSelectMenu?.querySelectorAll('.service-option').forEach(option => {
    option.setAttribute('aria-selected', String(option.dataset.value === value));
  });
}

serviceSelectButton?.addEventListener('click', () => {
  const isOpen = serviceSelectWrap.classList.toggle('is-open');
  serviceSelectButton.setAttribute('aria-expanded', String(isOpen));
});

serviceSelectMenu?.querySelectorAll('.service-option').forEach(option => {
  option.addEventListener('click', () => {
    setSelectedService(option.dataset.value);
    serviceSelectWrap.classList.remove('is-open');
    serviceSelectButton.setAttribute('aria-expanded', 'false');
  });
});

document.addEventListener('click', event => {
  if (serviceSelectWrap && !serviceSelectWrap.contains(event.target)) {
    serviceSelectWrap.classList.remove('is-open');
    serviceSelectButton?.setAttribute('aria-expanded', 'false');
  }
});

document.querySelectorAll('[data-service]').forEach(btn => {
  btn.addEventListener('click', () => {
    const selectedService = btn.getAttribute('data-service');
    if (selectedService && serviceSelect) setSelectedService(selectedService);
  });
});

// Interactive desk challenge (priority order: tender, web app, DSC).
const quizQuestions = [
  {
    question: 'What brings you here today?',
    options: [
      { label: 'I need tender / GeM help', value: 'tender' },
      { label: 'I want a web app', value: 'webapp' },
      { label: 'I need a DSC', value: 'dsc' }
    ]
  },
  {
    question: 'What is slowing you down most?',
    options: [
      { label: 'Finding & preparing bids', value: 'tender' },
      { label: 'Manual spreadsheet work', value: 'webapp' },
      { label: 'Signing & portal login', value: 'dsc' }
    ]
  },
  {
    question: 'Which outcome would help most?',
    options: [
      { label: 'Win more bids', value: 'tender' },
      { label: 'A tool for my team', value: 'webapp' },
      { label: 'A ready-to-sign certificate', value: 'dsc' }
    ]
  }
];

const quizPriority = ['tender', 'webapp', 'dsc'];
const quizResults = {
  tender: {
    title: 'Start with tender & GeM readiness.',
    text: 'A quick portal, catalogue and document review helps you bid with fewer last-minute surprises.',
    service: 'Tender & GeM Services'
  },
  webapp: {
    title: 'Start with a smarter workflow.',
    text: 'A focused web app or Sheets-based tool can remove repetitive work and give you live dashboards.',
    service: 'Custom Web Apps'
  },
  dsc: {
    title: 'Start with a Class 3 DSC.',
    text: 'You are closest to a verified digital identity with USB token and video verification guidance.',
    service: 'Digital Signature Certificate (DSC)'
  }
};

const quizAnswers = [];
const quizStep = document.getElementById('quizStep');
const quizBar = document.getElementById('quizBar');
const quizQuestion = document.getElementById('quizQuestion');
const quizOptions = document.getElementById('quizOptions');
const quizPanel = document.getElementById('quizPanel');
const quizResult = document.getElementById('quizResult');
const quizResultTitle = document.getElementById('quizResultTitle');
const quizResultText = document.getElementById('quizResultText');
const quizResultAction = document.getElementById('quizResultAction');
const quizRestart = document.getElementById('quizRestart');

const quizOptionClass = 'flex min-h-[76px] items-center justify-between gap-3 rounded-[0.9rem] border border-[#dbe4e2] bg-[#f8faf9] p-4 text-left text-sm font-bold text-slate-900 transition hover:-translate-y-0.5 hover:border-teal hover:bg-emerald-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal dark:border-violet-800 dark:bg-[#211932] dark:text-slate-100 dark:hover:border-violet-400 dark:hover:bg-[#302052]';

function showQuizQuestion() {
  const questionIndex = quizAnswers.length;
  const question = quizQuestions[questionIndex];
  quizStep.textContent = `QUESTION ${questionIndex + 1} / ${quizQuestions.length}`;
  quizBar.style.width = `${(questionIndex / quizQuestions.length) * 100}%`;
  quizQuestion.textContent = question.question;
  quizOptions.innerHTML = question.options.map(option => `
    <button type="button" class="${quizOptionClass}" data-quiz-value="${option.value}">${option.label}<span class="text-lg text-accent">→</span></button>
  `).join('');
  quizOptions.querySelectorAll('[data-quiz-value]').forEach(option => {
    option.addEventListener('click', () => {
      quizAnswers.push(option.dataset.quizValue);
      if (quizAnswers.length < quizQuestions.length) showQuizQuestion();
      else showQuizResult();
    });
  });
}

function showQuizResult() {
  const counts = quizAnswers.reduce((result, answer) => {
    result[answer] = (result[answer] || 0) + 1;
    return result;
  }, {});
  // Highest count wins; ties follow the business priority order.
  const recommendation = quizPriority.slice().sort((a, b) => (counts[b] || 0) - (counts[a] || 0))[0];
  const result = quizResults[recommendation];
  quizStep.textContent = 'CHALLENGE COMPLETE';
  quizBar.style.width = '100%';
  quizPanel.classList.add('hidden');
  quizResult.classList.remove('hidden');
  quizRestart.classList.remove('hidden');
  quizResultTitle.textContent = result.title;
  quizResultText.textContent = result.text;
  quizResultAction.dataset.service = result.service;
}

if (quizOptions) {
  showQuizQuestion();
  quizRestart.addEventListener('click', () => {
    quizAnswers.length = 0;
    quizPanel.classList.remove('hidden');
    quizResult.classList.add('hidden');
    quizRestart.classList.add('hidden');
    showQuizQuestion();
  });
  quizResultAction.addEventListener('click', () => setSelectedService(quizResultAction.dataset.service));
}

document.querySelectorAll('.readiness-item').forEach(item => {
  item.addEventListener('change', () => {
    const items = document.querySelectorAll('.readiness-item');
    const completed = document.querySelectorAll('.readiness-item:checked').length;
    const percentage = Math.round((completed / items.length) * 100);
    document.getElementById('readinessScore').textContent = `${percentage}%`;
    document.getElementById('readinessBar').style.width = `${percentage}%`;
  });
});

// Enquiry form -> Google Apps Script
const form = document.getElementById('enquiryForm');
const status = document.getElementById('formStatus');
const submitBtn = document.getElementById('submitBtn');
const statusBase = 'mt-3 min-h-[1.25rem] text-center text-xs font-bold';

form?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const endpoint = window.PRIMETENDER_CONFIG?.APPS_SCRIPT_URL;
  const data = Object.fromEntries(new FormData(form).entries());

  status.textContent = '';
  status.className = statusBase;

  if (!data.mobile.trim()) {
    status.textContent = 'Mobile / WhatsApp number is required.';
    status.className = `${statusBase} text-red-600`;
    return;
  }

  if (!endpoint || endpoint.includes('PASTE_YOUR_APPS_SCRIPT')) {
    status.textContent = 'Please update config.js with your deployed Google Apps Script URL.';
    status.className = `${statusBase} text-amber-600`;
    return;
  }

  submitBtn.disabled = true;
  submitBtn.innerHTML = '<span class="mr-2 inline-block animate-spin">⟳</span> Submitting...';

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(data)
    });

    const responseText = await response.text();
    let result;
    try {
      result = JSON.parse(responseText);
    } catch {
      throw new Error('The enquiry service returned an invalid response. Redeploy Code.gs as a web app and set access to Anyone, then update config.js with the new /exec URL.');
    }

    if (!response.ok) throw new Error(result.message || `The enquiry service returned HTTP ${response.status}.`);
    if (!result.success) throw new Error(result.message || 'Unable to save enquiry.');

    form.reset();
    setSelectedService(DEFAULT_SERVICE);
    status.textContent = '✓ Thank you! Your enquiry has been received. We will contact you shortly.';
    status.className = `${statusBase} text-emerald-600`;
  } catch (error) {
    status.textContent = error.message || 'Network error. Please try again or reach out on WhatsApp.';
    status.className = `${statusBase} text-red-600`;
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML = 'Send Enquiry <span class="ml-1">→</span>';
  }
});
