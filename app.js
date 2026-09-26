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

// Interactive DSC desk challenge.
const quizQuestions = [
  {
    question: 'What brings you here today?',
    options: [
      { label: 'I need a DSC', value: 'dsc' },
      { label: 'I need tender help', value: 'tender' },
      { label: 'I want to automate', value: 'automation' }
    ]
  },
  {
    question: 'What is your next important deadline?',
    options: [
      { label: 'A bid or filing', value: 'deadline' },
      { label: 'This month', value: 'month' },
      { label: 'I am planning ahead', value: 'planning' }
    ]
  },
  {
    question: 'Which support would make life easier?',
    options: [
      { label: 'Video KYC + token', value: 'dsc' },
      { label: 'Portal submission', value: 'tender' },
      { label: 'Sheets or Excel tools', value: 'automation' }
    ]
  }
];

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

const quizResults = {
  dsc: {
    title: 'Start with a Class 3 DSC.',
    text: 'You are closest to a verified digital identity with USB token and video verification guidance.',
    service: 'Digital Signature Certificate (DSC)'
  },
  tender: {
    title: 'Start with tender readiness.',
    text: 'A quick portal and document review can help you submit with fewer bid-day surprises.',
    service: 'Tender & GeM Services'
  },
  automation: {
    title: 'Start with a smarter workflow.',
    text: 'A focused Sheets, Apps Script or Excel tool can remove repetitive work from your desk.',
    service: 'Google Sheets & Apps Script'
  }
};

function showQuizQuestion() {
  const questionIndex = quizAnswers.length;
  const question = quizQuestions[questionIndex];
  quizStep.textContent = `QUESTION ${questionIndex + 1} / ${quizQuestions.length}`;
  quizBar.style.width = `${(questionIndex / quizQuestions.length) * 100}%`;
  quizQuestion.textContent = question.question;
  quizOptions.innerHTML = question.options.map(option => `
    <button type="button" class="prime-quiz-option" data-quiz-value="${option.value}">${option.label}<span>→</span></button>
  `).join('');
  quizOptions.querySelectorAll('[data-quiz-value]').forEach(option => {
    option.addEventListener('click', () => {
      quizAnswers.push(option.dataset.quizValue);
      if (quizAnswers.length < quizQuestions.length) {
        showQuizQuestion();
      } else {
        showQuizResult();
      }
    });
  });
}

function showQuizResult() {
  const counts = quizAnswers.reduce((result, answer) => {
    result[answer] = (result[answer] || 0) + 1;
    return result;
  }, {});
  const recommendation = Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
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
    
    const responseText = await response.text();
    let result;

    try {
      result = JSON.parse(responseText);
    } catch {
      throw new Error(
        'The enquiry service returned an invalid response. Redeploy Code.gs as a web app and set access to Anyone, then update config.js with the new /exec URL.'
      );
    }

    if (!response.ok) {
      throw new Error(result.message || `The enquiry service returned HTTP ${response.status}.`);
    }

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
