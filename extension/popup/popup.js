// MyReply Chrome Extension - Popup Script

const API_BASE = 'https://myreply.vercel.app';

// DOM Elements
const authSection = document.getElementById('auth-section');
const mainSection = document.getElementById('main-section');
const paywallSection = document.getElementById('paywall-section');
const usageCounter = document.getElementById('usage-counter');
const usageText = document.getElementById('usage-text');
const reviewText = document.getElementById('review-text');
const contextInput = document.getElementById('context');
const generateBtn = document.getElementById('generate-btn');
const resultsDiv = document.getElementById('results');
const responsesList = document.getElementById('responses-list');

// State
let selectedMode = 'all';
let isLoading = false;
let authToken = null;
let subscription = null;

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
  await checkAuth();
  setupModeSelector();
  setupGenerateButton();
  
  // Check if we have review text from content script
  const stored = await chrome.storage.local.get(['pendingReview']);
  if (stored.pendingReview) {
    reviewText.value = stored.pendingReview;
    await chrome.storage.local.remove(['pendingReview']);
  }
});

// Check authentication
async function checkAuth() {
  try {
    // Get token from storage
    const stored = await chrome.storage.local.get(['authToken']);
    
    if (stored.authToken) {
      authToken = stored.authToken;
      await loadSubscription();
      showMainSection();
    } else {
      showAuthSection();
    }
  } catch (error) {
    console.error('Auth check error:', error);
    showAuthSection();
  }
}

// Load subscription info
async function loadSubscription() {
  try {
    const response = await fetch(`${API_BASE}/api/subscription`, {
      headers: {
        'Authorization': `Bearer ${authToken}`,
      },
    });
    
    if (response.ok) {
      const data = await response.json();
      subscription = data.subscription;
      updateUsageCounter();
    }
  } catch (error) {
    console.error('Subscription load error:', error);
  }
}

// Update usage counter
function updateUsageCounter() {
  if (!subscription) return;
  
  const { usage_count, usage_limit, plan } = subscription;
  usageCounter.classList.remove('hidden');
  usageText.textContent = `${usage_count}/${usage_limit}`;
  
  // Color coding
  const usagePercent = usage_count / usage_limit;
  usageCounter.classList.remove('warning', 'danger');
  
  if (usagePercent >= 0.9) {
    usageCounter.classList.add('danger');
  } else if (usagePercent >= 0.7) {
    usageCounter.classList.add('warning');
  }
  
  // Check if limit reached
  if (usage_count >= usage_limit) {
    showPaywallSection();
  }
}

// Setup mode selector
function setupModeSelector() {
  const modeButtons = document.querySelectorAll('.mode-btn');
  
  modeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      modeButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedMode = btn.dataset.mode;
    });
  });
}

// Setup generate button
function setupGenerateButton() {
  generateBtn.addEventListener('click', handleGenerate);
}

// Handle generate
async function handleGenerate() {
  const text = reviewText.value.trim();
  const context = contextInput.value.trim();
  
  if (!text) {
    showError('Введите текст отзыва');
    return;
  }
  
  if (isLoading) return;
  
  setLoading(true);
  hideError();
  
  try {
    const includeHardcore = selectedMode === 'all' || selectedMode === 'hardcore';
    
    const response = await fetch(`${API_BASE}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        reviewText: text,
        context: context || undefined,
        includeHardcore,
      }),
    });
    
    if (!response.ok) {
      const data = await response.json();
      
      if (response.status === 403 && data.limitReached) {
        showPaywallSection();
        return;
      }
      
      throw new Error(data.error || 'Ошибка генерации');
    }
    
    const data = await response.json();
    displayResponses(data.responses);
    
    // Increment local usage
    if (subscription) {
      subscription.usage_count++;
      updateUsageCounter();
    }
  } catch (error) {
    showError(error.message);
  } finally {
    setLoading(false);
  }
}

// Display responses
function displayResponses(responses) {
  // Filter by selected mode if not 'all'
  let filtered = responses;
  if (selectedMode !== 'all') {
    const modeMap = {
      'neutral': 'neutral',
      'empathetic': 'empathetic',
      'solution': 'solution-focused',
      'passive': 'passive-aggressive',
      'hardcore': 'hardcore',
    };
    filtered = responses.filter(r => r.accent === modeMap[selectedMode]);
  }
  
  responsesList.innerHTML = filtered.map(response => `
    <div class="response-card">
      <div class="response-header">
        <span class="response-accent ${response.accent}">${getAccentLabel(response.accent)}</span>
      </div>
      <p class="response-text">${response.text}</p>
      <div class="response-actions">
        <button class="btn-copy" data-text="${escapeHtml(response.text)}">
          📋 Скопировать
        </button>
      </div>
      ${response.accent === 'hardcore' ? `
        <div class="hardcore-warning">
          🔥 Только для развлечения! Не публикуйте.
        </div>
      ` : ''}
    </div>
  `).join('');
  
  resultsDiv.classList.remove('hidden');
  
  // Setup copy buttons
  document.querySelectorAll('.btn-copy').forEach(btn => {
    btn.addEventListener('click', async () => {
      const text = btn.dataset.text;
      await navigator.clipboard.writeText(text);
      btn.textContent = '✓ Скопировано';
      btn.classList.add('copied');
      setTimeout(() => {
        btn.textContent = '📋 Скопировать';
        btn.classList.remove('copied');
      }, 2000);
    });
  });
}

// Get accent label
function getAccentLabel(accent) {
  const labels = {
    'neutral': 'Нейтральный',
    'empathetic': 'Эмпатичный',
    'solution-focused': 'С решением',
    'passive-aggressive': '🧊 Холодный',
    'hardcore': '🔥 Дерзкий',
  };
  return labels[accent] || accent;
}

// Show/hide sections
function showAuthSection() {
  authSection.classList.remove('hidden');
  mainSection.classList.add('hidden');
  paywallSection.classList.add('hidden');
}

function showMainSection() {
  authSection.classList.add('hidden');
  mainSection.classList.remove('hidden');
  paywallSection.classList.add('hidden');
}

function showPaywallSection() {
  authSection.classList.add('hidden');
  mainSection.classList.add('hidden');
  paywallSection.classList.remove('hidden');
}

// Loading state
function setLoading(loading) {
  isLoading = loading;
  generateBtn.disabled = loading;
  
  const btnText = generateBtn.querySelector('.btn-text');
  const btnLoader = generateBtn.querySelector('.btn-loader');
  
  if (loading) {
    btnText.classList.add('hidden');
    btnLoader.classList.remove('hidden');
  } else {
    btnText.classList.remove('hidden');
    btnLoader.classList.add('hidden');
  }
}

// Error handling
function showError(message) {
  let errorDiv = document.querySelector('.error-message');
  if (!errorDiv) {
    errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    mainSection.insertBefore(errorDiv, generateBtn);
  }
  errorDiv.textContent = message;
  errorDiv.classList.remove('hidden');
}

function hideError() {
  const errorDiv = document.querySelector('.error-message');
  if (errorDiv) {
    errorDiv.classList.add('hidden');
  }
}

// Utility
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML.replace(/"/g, '&quot;');
}

// Listen for auth messages from website
chrome.runtime.onMessage.addListener((message) => {
  if (message.type === 'AUTH_TOKEN') {
    authToken = message.token;
    chrome.storage.local.set({ authToken: message.token });
    checkAuth();
  }
});
