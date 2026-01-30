// State
let prompts = [];
let automations = [];
let commands = [];
let filteredItems = [];
let currentView = 'prompts';

// DOM Elements
const searchInput = document.getElementById('search');
const filterType = document.getElementById('filter-type');
const filterCategory = document.getElementById('filter-category');
const filterPersona = document.getElementById('filter-persona');
const clearFiltersBtn = document.getElementById('clear-filters');

// Automations filters
const filterAutoCategory = document.getElementById('filter-auto-category');
const filterAutoTrigger = document.getElementById('filter-auto-trigger');
const filterAutoScope = document.getElementById('filter-auto-scope');
const clearAutoFiltersBtn = document.getElementById('clear-auto-filters');

// Filter containers
const promptsFilters = document.getElementById('prompts-filters');
const automationsFilters = document.getElementById('automations-filters');

// Toggle buttons
const toggleBtns = document.querySelectorAll('.toggle-btn');

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

// Icons for automation categories
const autoCategoryIcons = {
  'security': `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>`,
  'documentation': `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>`,
  'dev-environment': `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>`,
  'code-review': `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>`,
  'testing': `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline><path d="m9 15 2 2 4-4"></path></svg>`,
  'maintenance': `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg>`,
  'migrations': `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="17 1 21 5 17 9"></polyline><path d="M3 11V9a4 4 0 0 1 4-4h14"></path><polyline points="7 23 3 19 7 15"></polyline><path d="M21 13v2a4 4 0 0 1-4 4H3"></path></svg>`,
  'code-quality': `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>`,
  'api-management': `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 20V10"></path><path d="M12 20V4"></path><path d="M6 20v-6"></path></svg>`,
  'incident-response': `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`
};

// Icons for triggers
const triggerIcons = {
  'event': `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"></path></svg>`,
  'pull-request': `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="18" r="3"></circle><circle cx="6" cy="6" r="3"></circle><path d="M13 6h3a2 2 0 0 1 2 2v7"></path><line x1="6" y1="9" x2="6" y2="21"></line></svg>`,
  'scheduled': `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>`,
  'manual': `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1"></path><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path><line x1="6" y1="1" x2="6" y2="4"></line><line x1="10" y1="1" x2="10" y2="4"></line><line x1="14" y1="1" x2="14" y2="4"></line></svg>`
};

// Icons for command categories
const commandCategoryIcons = {
  'code-review': `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>`,
  'testing': `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline><path d="m9 15 2 2 4-4"></path></svg>`,
  'documentation': `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>`,
  'debugging': `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m8 2 1.88 1.88"></path><path d="M14.12 3.88 16 2"></path><path d="M9 7.13v-1a3.003 3.003 0 1 1 6 0v1"></path><path d="M12 20c-3.3 0-6-2.7-6-6v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v3c0 3.3-2.7 6-6 6"></path><path d="M12 20v-9"></path></svg>`,
  'deployment': `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"></path><path d="M2 17l10 5 10-5"></path><path d="M2 12l10 5 10-5"></path></svg>`,
  'code-development': `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>`
};

// Initialize
async function init() {
  try {
    const [promptsResponse, automationsResponse, commandsResponse] = await Promise.all([
      fetch('prompts.json'),
      fetch('automations.json'),
      fetch('commands.json')
    ]);
    prompts = await promptsResponse.json();
    automations = await automationsResponse.json();
    commands = await commandsResponse.json();
    
    // Read URL params and set filters/view
    loadFiltersFromURL();
    
    // Apply filters and render
    applyFilters();
    
    // Set up event listeners
    setupEventListeners();
  } catch (error) {
    console.error('Failed to load data:', error);
    promptsGrid.innerHTML = '<div class="empty-state"><h3>Failed to load data</h3><p>Please try refreshing the page.</p></div>';
  }
}

// Load filters from URL
function loadFiltersFromURL() {
  const params = new URLSearchParams(window.location.search);
  
  // Set view
  const view = params.get('view');
  if (view === 'automations' || view === 'commands') {
    currentView = view;
    switchView(view);
  }
  
  if (params.get('search')) searchInput.value = params.get('search');
  
  // Prompts filters
  if (params.get('type')) filterType.value = params.get('type');
  if (params.get('category')) filterCategory.value = params.get('category');
  if (params.get('persona')) filterPersona.value = params.get('persona');
  
  // Automations filters
  if (params.get('autoCategory')) filterAutoCategory.value = params.get('autoCategory');
  if (params.get('trigger')) filterAutoTrigger.value = params.get('trigger');
  if (params.get('scope')) filterAutoScope.value = params.get('scope');
  
  // Commands filters
  if (params.get('cmdCategory')) {
    const cmdCategoryFilter = document.getElementById('filter-cmd-category');
    if (cmdCategoryFilter) cmdCategoryFilter.value = params.get('cmdCategory');
  }
}

// Update URL with current filters
function updateURL() {
  const params = new URLSearchParams();
  
  if (currentView !== 'prompts') params.set('view', currentView);
  if (searchInput.value) params.set('search', searchInput.value);
  
  if (currentView === 'prompts') {
    if (filterType.value) params.set('type', filterType.value);
    if (filterCategory.value) params.set('category', filterCategory.value);
    if (filterPersona.value) params.set('persona', filterPersona.value);
  } else if (currentView === 'automations') {
    if (filterAutoCategory.value) params.set('autoCategory', filterAutoCategory.value);
    if (filterAutoTrigger.value) params.set('trigger', filterAutoTrigger.value);
    if (filterAutoScope.value) params.set('scope', filterAutoScope.value);
  } else if (currentView === 'commands') {
    const cmdCategoryFilter = document.getElementById('filter-cmd-category');
    if (cmdCategoryFilter && cmdCategoryFilter.value) params.set('cmdCategory', cmdCategoryFilter.value);
  }
  
  const newURL = params.toString() 
    ? `${window.location.pathname}?${params.toString()}`
    : window.location.pathname;
  
  window.history.replaceState({}, '', newURL);
}

// Setup event listeners
function setupEventListeners() {
  // Search
  searchInput.addEventListener('input', debounce(applyFilters, 200));
  
  // Prompts filters
  filterType.addEventListener('change', applyFilters);
  filterCategory.addEventListener('change', applyFilters);
  filterPersona.addEventListener('change', applyFilters);
  clearFiltersBtn.addEventListener('click', clearFilters);
  
  // Automations filters
  filterAutoCategory.addEventListener('change', applyFilters);
  filterAutoTrigger.addEventListener('change', applyFilters);
  filterAutoScope.addEventListener('change', applyFilters);
  clearAutoFiltersBtn.addEventListener('click', clearAutoFilters);
  
  // Commands filters
  const filterCmdCategory = document.getElementById('filter-cmd-category');
  const clearCmdFiltersBtn = document.getElementById('clear-cmd-filters');
  if (filterCmdCategory) filterCmdCategory.addEventListener('change', applyFilters);
  if (clearCmdFiltersBtn) clearCmdFiltersBtn.addEventListener('click', clearCmdFilters);
  
  // View toggle
  toggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const view = btn.dataset.view;
      switchView(view);
      applyFilters();
    });
  });
}

// Switch view
function switchView(view) {
  currentView = view;
  
  // Update toggle buttons
  toggleBtns.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.view === view);
  });
  
  // Update filters visibility
  promptsFilters.classList.toggle('hidden', view !== 'prompts');
  automationsFilters.classList.toggle('hidden', view !== 'automations');
  const commandsFilters = document.getElementById('commands-filters');
  if (commandsFilters) commandsFilters.classList.toggle('hidden', view !== 'commands');
  
  // Update search placeholder
  if (view === 'prompts') {
    searchInput.placeholder = 'Search prompts, skills, and tools...';
  } else if (view === 'automations') {
    searchInput.placeholder = 'Search automations...';
  } else {
    searchInput.placeholder = 'Search commands...';
  }
  
  // Clear search when switching views
  searchInput.value = '';
}

// Clear automations filters
function clearAutoFilters() {
  filterAutoCategory.value = '';
  filterAutoTrigger.value = '';
  filterAutoScope.value = '';
  searchInput.value = '';
  applyFilters();
}

// Clear commands filters
function clearCmdFilters() {
  const filterCmdCategory = document.getElementById('filter-cmd-category');
  if (filterCmdCategory) filterCmdCategory.value = '';
  searchInput.value = '';
  applyFilters();
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
  
  if (currentView === 'prompts') {
    const type = filterType.value;
    const category = filterCategory.value;
    const persona = filterPersona.value;
    
    filteredItems = prompts.filter(prompt => {
      if (search) {
        const searchableText = `${prompt.title} ${prompt.description} ${prompt.content}`.toLowerCase();
        if (!searchableText.includes(search)) return false;
      }
      if (type && prompt.type !== type) return false;
      if (category && prompt.tags.category !== category) return false;
      if (persona && !prompt.tags.persona.includes(persona)) return false;
      return true;
    });
  } else if (currentView === 'automations') {
    const category = filterAutoCategory.value;
    const trigger = filterAutoTrigger.value;
    const scope = filterAutoScope.value;
    
    filteredItems = automations.filter(auto => {
      if (search) {
        const searchableText = `${auto.title} ${auto.description} ${auto.content}`.toLowerCase();
        if (!searchableText.includes(search)) return false;
      }
      if (category && auto.tags.category !== category) return false;
      if (trigger && auto.tags.trigger !== trigger) return false;
      if (scope && auto.tags.scope !== scope) return false;
      return true;
    });
  } else if (currentView === 'commands') {
    const cmdCategoryFilter = document.getElementById('filter-cmd-category');
    const category = cmdCategoryFilter ? cmdCategoryFilter.value : '';
    
    filteredItems = commands.filter(cmd => {
      if (search) {
        const searchableText = `${cmd.title} ${cmd.command} ${cmd.description} ${cmd.content}`.toLowerCase();
        if (!searchableText.includes(search)) return false;
      }
      if (category && cmd.tags.category !== category) return false;
      return true;
    });
  }
  
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
  let dataSource;
  if (currentView === 'prompts') dataSource = prompts;
  else if (currentView === 'automations') dataSource = automations;
  else dataSource = commands;
  
  const cmdCategoryFilter = document.getElementById('filter-cmd-category');
  const hasActiveFilters = currentView === 'prompts'
    ? (searchInput.value || filterType.value || filterCategory.value || filterPersona.value)
    : currentView === 'automations'
    ? (searchInput.value || filterAutoCategory.value || filterAutoTrigger.value || filterAutoScope.value)
    : (searchInput.value || (cmdCategoryFilter && cmdCategoryFilter.value));
  
  // Featured section - hide when filters are active
  if (hasActiveFilters) {
    featuredSection.classList.add('hidden');
  } else {
    featuredSection.classList.remove('hidden');
    const featuredItems = dataSource.filter(p => p.featured).slice(0, 3);
    featuredGrid.innerHTML = featuredItems.map(p => {
      if (currentView === 'prompts') return createCard(p);
      if (currentView === 'automations') return createAutomationCard(p);
      return createCommandCard(p);
    }).join('');
    
    // Update featured section title
    const featuredTitle = featuredSection.querySelector('.section-title');
    if (featuredTitle) {
      if (currentView === 'prompts') featuredTitle.textContent = 'Top prompts';
      else if (currentView === 'automations') featuredTitle.textContent = 'Top automations';
      else featuredTitle.textContent = 'Top commands';
    }
  }
  
  // Results count
  let itemType = 'items';
  if (currentView === 'automations') itemType = 'automations';
  else if (currentView === 'commands') itemType = 'commands';
  resultsCount.textContent = `Showing ${filteredItems.length} of ${dataSource.length} ${itemType}`;
  
  // Grid
  if (filteredItems.length === 0) {
    promptsGrid.innerHTML = `
      <div class="empty-state">
        <h3>No results found</h3>
        <p>Try adjusting your filters or search terms.</p>
      </div>
    `;
  } else {
    promptsGrid.innerHTML = filteredItems.map(p => {
      if (currentView === 'prompts') return createCard(p);
      if (currentView === 'automations') return createAutomationCard(p);
      return createCommandCard(p);
    }).join('');
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
            <span class="card-badge badge-category clickable" data-category="${prompt.tags.category}">${categoryIcons[prompt.tags.category] || ''}${categoryLabel}</span>
            <span class="card-badge badge-${prompt.type} clickable-type" data-type="${prompt.type}">
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
            <div class="expanded-label">Example output</div>
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

// Create automation card HTML
function createAutomationCard(auto) {
  const categoryLabel = formatLabel(auto.tags.category);
  const triggerLabel = formatLabel(auto.tags.trigger);
  const scopeLabel = formatLabel(auto.tags.scope);
  
  return `
    <article class="card card-automation" data-id="${auto.id}">
      <div class="card-content">
        <div class="card-header">
          <h3 class="card-title">${escapeHtml(auto.title)}</h3>
          <div class="card-badges">
            <span class="card-badge badge-auto-category clickable-auto-category" data-category="${auto.tags.category}">${autoCategoryIcons[auto.tags.category] || ''}${categoryLabel}</span>
            <span class="card-badge badge-trigger clickable-trigger" data-trigger="${auto.tags.trigger}">
              ${triggerIcons[auto.tags.trigger] || ''}
              ${triggerLabel}
            </span>
          </div>
        </div>
        
        <p class="card-description">${escapeHtml(auto.description)}</p>
        
        <div class="card-preview">
          <code>${escapeHtml(auto.content)}</code>
        </div>
      </div>
      
      <div class="card-actions">
        <button class="btn btn-copy" data-content="${escapeAttr(auto.content)}">
          Copy
        </button>
        <button class="btn btn-expand">
          Expand
        </button>
      </div>
      
      <div class="card-expanded">
        ${auto.requirements && auto.requirements.length > 0 ? `
          <div class="expanded-section">
            <div class="expanded-label">Requirements</div>
            <ul class="requirements-list">
              ${auto.requirements.map(r => `<li>${escapeHtml(r)}</li>`).join('')}
            </ul>
          </div>
        ` : ''}
        
        ${auto.exampleOutput ? `
          <div class="expanded-section">
            <div class="expanded-label">Example output</div>
            <div class="expanded-content">${escapeHtml(auto.exampleOutput)}</div>
          </div>
        ` : ''}
        
        <div class="expanded-section">
          <div class="expanded-label">Scope</div>
          <div class="card-tags">
            <span class="tag">${scopeLabel}</span>
          </div>
        </div>
      </div>
    </article>
  `;
}

// Create command card HTML
function createCommandCard(cmd) {
  const categoryLabel = formatLabel(cmd.tags.category);
  
  return `
    <article class="card card-command" data-id="${cmd.id}">
      <div class="card-content">
        <div class="card-header">
          <h3 class="card-title">${escapeHtml(cmd.title)}</h3>
          <div class="card-badges">
            <span class="card-badge badge-cmd-category clickable-cmd-category" data-category="${cmd.tags.category}">${commandCategoryIcons[cmd.tags.category] || ''}${categoryLabel}</span>
          </div>
        </div>
        
        <p class="card-description">${escapeHtml(cmd.description)}</p>
        
        <div class="card-preview">
          <code>${escapeHtml(cmd.content)}</code>
        </div>
      </div>
      
      <div class="card-actions">
        <button class="btn btn-copy" data-content="${escapeAttr(cmd.content)}">
          Copy
        </button>
        <button class="btn btn-expand">
          Expand
        </button>
      </div>
      
      <div class="card-expanded">
        ${cmd.exampleOutput ? `
          <div class="expanded-section">
            <div class="expanded-label">Example output</div>
            <div class="expanded-content">${escapeHtml(cmd.exampleOutput)}</div>
          </div>
        ` : ''}
        
        <div class="expanded-section">
          <div class="expanded-label">Usage</div>
          <div class="expanded-content"><code>/${cmd.command}</code> - Type this in Ona to run the command</div>
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
  
  // Category badges - click to filter
  document.querySelectorAll('.badge-category.clickable').forEach(badge => {
    badge.addEventListener('click', (e) => {
      e.stopPropagation();
      const category = badge.dataset.category;
      filterCategory.value = category;
      applyFilters();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });
  
  // Type badges - click to filter
  document.querySelectorAll('.clickable-type').forEach(badge => {
    badge.addEventListener('click', (e) => {
      e.stopPropagation();
      const type = badge.dataset.type;
      filterType.value = type;
      applyFilters();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });
  
  // Automation category badges - click to filter
  document.querySelectorAll('.clickable-auto-category').forEach(badge => {
    badge.addEventListener('click', (e) => {
      e.stopPropagation();
      const category = badge.dataset.category;
      filterAutoCategory.value = category;
      applyFilters();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });
  
  // Trigger badges - click to filter
  document.querySelectorAll('.clickable-trigger').forEach(badge => {
    badge.addEventListener('click', (e) => {
      e.stopPropagation();
      const trigger = badge.dataset.trigger;
      filterAutoTrigger.value = trigger;
      applyFilters();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });
  
  // Command category badges - click to filter
  document.querySelectorAll('.clickable-cmd-category').forEach(badge => {
    badge.addEventListener('click', (e) => {
      e.stopPropagation();
      const category = badge.dataset.category;
      const cmdCategoryFilter = document.getElementById('filter-cmd-category');
      if (cmdCategoryFilter) {
        cmdCategoryFilter.value = category;
        applyFilters();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
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
    .map(word => {
      // Keep acronyms uppercase
      if (word.toLowerCase() === 'cve' || word.toLowerCase() === 'api' || word.toLowerCase() === 'ci' || word.toLowerCase() === 'cd') {
        return word.toUpperCase();
      }
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
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
