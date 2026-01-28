// State
let prompts = [];
let filteredPrompts = [];

// DOM Elements
const searchInput = document.getElementById('search');
const filterType = document.getElementById('filter-type');
const filterCategory = document.getElementById('filter-category');
const filterPersona = document.getElementById('filter-persona');

const clearFiltersBtn = document.getElementById('clear-filters');
const featuredSection = document.getElementById('featured-section');
const featuredGrid = document.getElementById('featured-grid');
const promptsGrid = document.getElementById('prompts-grid');
const resultsCount = document.getElementById('results-count');
const toast = document.getElementById('toast');

// Icons for types
const typeIcons = {
  prompt: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>`,
  skill: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"></path></svg>`,
  tool: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg>`
};

// Icons for categories
const categoryIcons = {
  'code-development': `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>`,
  'code-review': `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>`,
  'debugging': `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m8 2 1.88 1.88"></path><path d="M14.12 3.88 16 2"></path><path d="M9 7.13v-1a3.003 3.003 0 1 1 6 0v1"></path><path d="M12 20c-3.3 0-6-2.7-6-6v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v3c0 3.3-2.7 6-6 6"></path><path d="M12 20v-9"></path><path d="M6.53 9C4.6 8.8 3 7.1 3 5"></path><path d="M6 13H2"></path><path d="M3 21c0-2.1 1.7-3.9 3.8-4"></path><path d="M20.97 5c0 2.1-1.6 3.8-3.5 4"></path><path d="M22 13h-4"></path><path d="M17.2 17c2.1.1 3.8 1.9 3.8 4"></path></svg>`,
  'project-management': `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>`,
  'documentation': `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>`,
  'migrations': `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="17 1 21 5 17 9"></polyline><path d="M3 11V9a4 4 0 0 1 4-4h14"></path><polyline points="7 23 3 19 7 15"></polyline><path d="M21 13v2a4 4 0 0 1-4 4H3"></path></svg>`,
  'cve-remediation': `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>`,
  'automations': `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v4"></path><path d="m6.8 15-3.5 2"></path><path d="m20.7 7-3.5 2"></path><path d="M6.8 9 3.3 7"></path><path d="m20.7 17-3.5-2"></path><path d="m9 22 3-8 3 8"></path><path d="M8 22h8"></path><path d="M12 2a4 4 0 0 0-4 4c0 1.5.8 2.8 2 3.4"></path><path d="M12 2a4 4 0 0 1 4 4c0 1.5-.8 2.8-2 3.4"></path></svg>`
};

// Initialize
async function init() {
  try {
    const response = await fetch('prompts.json');
    prompts = await response.json();
    
    // Read URL params and set filters
    loadFiltersFromURL();
    
    // Apply filters and render
    applyFilters();
    
    // Set up event listeners
    setupEventListeners();
  } catch (error) {
    console.error('Failed to load prompts:', error);
    promptsGrid.innerHTML = '<div class="empty-state"><h3>Failed to load prompts</h3><p>Please try refreshing the page.</p></div>';
  }
}

// Load filters from URL
function loadFiltersFromURL() {
  const params = new URLSearchParams(window.location.search);
  
  if (params.get('search')) searchInput.value = params.get('search');
  if (params.get('type')) filterType.value = params.get('type');
  if (params.get('category')) filterCategory.value = params.get('category');
  if (params.get('persona')) filterPersona.value = params.get('persona');

}

// Update URL with current filters
function updateURL() {
  const params = new URLSearchParams();
  
  if (searchInput.value) params.set('search', searchInput.value);
  if (filterType.value) params.set('type', filterType.value);
  if (filterCategory.value) params.set('category', filterCategory.value);
  if (filterPersona.value) params.set('persona', filterPersona.value);

  
  const newURL = params.toString() 
    ? `${window.location.pathname}?${params.toString()}`
    : window.location.pathname;
  
  window.history.replaceState({}, '', newURL);
}

// Setup event listeners
function setupEventListeners() {
  searchInput.addEventListener('input', debounce(applyFilters, 200));
  filterType.addEventListener('change', applyFilters);
  filterCategory.addEventListener('change', applyFilters);
  filterPersona.addEventListener('change', applyFilters);

  clearFiltersBtn.addEventListener('click', clearFilters);
}

// Debounce helper
function debounce(fn, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), delay);
  };
}

// Apply filters
function applyFilters() {
  const search = searchInput.value.toLowerCase().trim();
  const type = filterType.value;
  const category = filterCategory.value;
  const persona = filterPersona.value;

  
  filteredPrompts = prompts.filter(prompt => {
    // Search filter
    if (search) {
      const searchableText = `${prompt.title} ${prompt.description} ${prompt.content}`.toLowerCase();
      if (!searchableText.includes(search)) return false;
    }
    
    // Type filter
    if (type && prompt.type !== type) return false;
    
    // Category filter
    if (category && prompt.tags.category !== category) return false;
    
    // Persona filter
    if (persona && !prompt.tags.persona.includes(persona)) return false;
    
    return true;
  });
  
  updateURL();
  render();
}

// Clear filters
function clearFilters() {
  searchInput.value = '';
  filterType.value = '';
  filterCategory.value = '';
  filterPersona.value = '';

  applyFilters();
}

// Render
function render() {
  const hasActiveFilters = searchInput.value || filterType.value || filterCategory.value || filterPersona.value;
  
  // Featured section - hide when filters are active
  if (hasActiveFilters) {
    featuredSection.classList.add('hidden');
  } else {
    featuredSection.classList.remove('hidden');
    const featuredPrompts = prompts.filter(p => p.featured);
    featuredGrid.innerHTML = featuredPrompts.map(p => createCard(p)).join('');
  }
  
  // Results count
  resultsCount.textContent = `Showing ${filteredPrompts.length} of ${prompts.length} items`;
  
  // Prompts grid
  if (filteredPrompts.length === 0) {
    promptsGrid.innerHTML = `
      <div class="empty-state">
        <h3>No results found</h3>
        <p>Try adjusting your filters or search terms.</p>
      </div>
    `;
  } else {
    promptsGrid.innerHTML = filteredPrompts.map(p => createCard(p)).join('');
  }
  
  // Attach event listeners to cards
  attachCardListeners();
}

// Create card HTML
function createCard(prompt) {
  const categoryLabel = formatLabel(prompt.tags.category);
  
  return `
    <article class="card" data-id="${prompt.id}">
      <div class="card-content">
        <div class="card-header">
          <h3 class="card-title">${escapeHtml(prompt.title)}</h3>
          <div class="card-badges">
            <span class="card-badge badge-category">${categoryIcons[prompt.tags.category] || ''}${categoryLabel}</span>
            <span class="card-badge badge-${prompt.type}">
              ${typeIcons[prompt.type]}
              ${prompt.type}
            </span>
          </div>
        </div>
        
        <p class="card-description">${escapeHtml(prompt.description)}</p>
        
        <div class="card-preview">
          <code>${escapeHtml(prompt.content)}</code>
        </div>
      </div>
      
      <div class="card-actions">
        <button class="btn btn-copy" data-content="${escapeAttr(prompt.content)}">
          Copy
        </button>
        <button class="btn btn-expand">
          Expand
        </button>
      </div>
      
      <div class="card-expanded">
        <div class="expanded-section">
          <div class="expanded-label">Full Content</div>
          <div class="expanded-content">
            <code>${escapeHtml(prompt.content)}</code>
          </div>
        </div>
        
        ${prompt.requirements && prompt.requirements.length > 0 ? `
          <div class="expanded-section">
            <div class="expanded-label">Requirements</div>
            <ul class="requirements-list">
              ${prompt.requirements.map(r => `<li>${escapeHtml(r)}</li>`).join('')}
            </ul>
          </div>
        ` : ''}
        
        ${prompt.exampleOutput ? `
          <div class="expanded-section">
            <div class="expanded-label">Example Output</div>
            <div class="expanded-content">${escapeHtml(prompt.exampleOutput)}</div>
          </div>
        ` : ''}
        
        <div class="expanded-section">
          <div class="expanded-label">Personas</div>
          <div class="card-tags">
            ${prompt.tags.persona.map(p => `<span class="tag">${formatLabel(p)}</span>`).join('')}
          </div>
        </div>
      </div>
    </article>
  `;
}

// Attach event listeners to cards
function attachCardListeners() {
  // Copy buttons
  document.querySelectorAll('.btn-copy').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const content = btn.dataset.content;
      copyToClipboard(content);
    });
  });
  
  // Expand buttons
  document.querySelectorAll('.btn-expand').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const card = btn.closest('.card');
      card.classList.toggle('is-expanded');
      btn.textContent = card.classList.contains('is-expanded') ? 'Collapse' : 'Expand';
    });
  });
}

// Copy to clipboard
async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    showToast('Copied to clipboard!');
  } catch (err) {
    // Fallback for older browsers
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    showToast('Copied to clipboard!');
  }
}

// Show toast notification
function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 2000);
}

// Helper: Format label
function formatLabel(str) {
  return str
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Helper: Escape HTML
function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// Helper: Escape attribute
function escapeAttr(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// Start the app
init();
