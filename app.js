// State
let prompts = [];
let automations = [];
let commands = [];
let skills = []; // Combined prompts + commands
let filteredItems = [];
let currentView = 'automations';
let selectedAutomation = null;

// DOM Elements
const searchInput = document.getElementById('search');
const filterType = document.getElementById('filter-type');
const filterCategory = document.getElementById('filter-category');
const clearFiltersBtn = document.getElementById('clear-filters');

// Automations filters
const filterAutoCategory = document.getElementById('filter-auto-category');
const filterAutoTrigger = document.getElementById('filter-auto-trigger');
const filterAutoScope = document.getElementById('filter-auto-scope');
const clearAutoFiltersBtn = document.getElementById('clear-auto-filters');

// Filter containers
const skillsFilters = document.getElementById('skills-filters');
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
  command: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 17 10 11 4 5"></polyline><line x1="12" y1="19" x2="20" y2="19"></line></svg>`,
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

// Icons for automation types
const automationIcons = {
  'ci': `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>`,
  'migration': `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="17 1 21 5 17 9"></polyline><path d="M3 11V9a4 4 0 0 1 4-4h14"></path><polyline points="7 23 3 19 7 15"></polyline><path d="M21 13v2a4 4 0 0 1-4 4H3"></path></svg>`,
  'docs': `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>`,
  'review': `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>`,
  'security': `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>`
};

// Icons for workflow step types
const stepTypeIcons = {
  'trigger': `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="10 8 16 12 10 16 10 8"></polyline></svg>`,
  'prompt': `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>`,
  'shell': `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 17 10 11 4 5"></polyline><line x1="12" y1="19" x2="20" y2="19"></line></svg>`,
  'pr': `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="18" r="3"></circle><circle cx="6" cy="6" r="3"></circle><path d="M13 6h3a2 2 0 0 1 2 2v7"></path><line x1="6" y1="9" x2="6" y2="21"></line></svg>`
};

// Step type labels
const stepTypeLabels = {
  'trigger': 'Trigger',
  'prompt': 'Prompt',
  'shell': 'Shell Script',
  'pr': 'Pull Request'
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
    
    // Combine commands and skills only (filter out prompts and tools)
    const filteredPrompts = prompts.filter(p => p.type === 'skill');
    skills = [...commands, ...filteredPrompts];
    
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
  if (view === 'automations' || view === 'skills') {
    currentView = view;
    switchView(view);
  }
  
  // Check for automation detail view
  const automationId = params.get('automation');
  if (automationId && (view === 'automations' || !view)) {
    selectedAutomation = automations.find(a => a.id === automationId);
  }
  
  if (params.get('search')) searchInput.value = params.get('search');
  
  // Skills filters
  if (params.get('type')) filterType.value = params.get('type');
  if (params.get('category')) filterCategory.value = params.get('category');
  
  // Automations filters
  if (params.get('autoCategory')) filterAutoCategory.value = params.get('autoCategory');
  if (params.get('trigger')) filterAutoTrigger.value = params.get('trigger');
  if (params.get('scope')) filterAutoScope.value = params.get('scope');
}

// Update URL with current filters
function updateURL() {
  const params = new URLSearchParams();
  
  if (currentView !== 'automations') params.set('view', currentView);
  if (selectedAutomation) params.set('automation', selectedAutomation.id);
  if (searchInput.value) params.set('search', searchInput.value);
  
  if (currentView === 'skills') {
    if (filterType.value) params.set('type', filterType.value);
    if (filterCategory.value) params.set('category', filterCategory.value);
  } else if (currentView === 'automations') {
    if (filterAutoCategory.value) params.set('autoCategory', filterAutoCategory.value);
    if (filterAutoTrigger.value) params.set('trigger', filterAutoTrigger.value);
    if (filterAutoScope.value) params.set('scope', filterAutoScope.value);
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
  
  // Skills filters
  filterType.addEventListener('change', applyFilters);
  filterCategory.addEventListener('change', applyFilters);
  clearFiltersBtn.addEventListener('click', clearFilters);
  
  // Automations filters
  filterAutoCategory.addEventListener('change', applyFilters);
  filterAutoTrigger.addEventListener('change', applyFilters);
  filterAutoScope.addEventListener('change', applyFilters);
  clearAutoFiltersBtn.addEventListener('click', clearAutoFilters);
  
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
  
  // Clear selected automation when switching views
  selectedAutomation = null;
  const detailContainer = document.getElementById('automation-detail');
  if (detailContainer) detailContainer.classList.add('hidden');
  
  // Show normal sections
  document.querySelector('.hero h1').classList.remove('hidden');
  document.querySelector('.hero .hero-subtitle').classList.remove('hidden');
  document.querySelector('.controls').classList.remove('hidden');
  document.querySelector('.all-prompts-section').classList.remove('hidden');
  
  // Update toggle buttons
  toggleBtns.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.view === view);
  });
  
  // Update intro and filters visibility
  const skillsIntro = document.getElementById('skills-intro');
  if (skillsIntro) skillsIntro.classList.toggle('hidden', view !== 'skills');
  if (skillsFilters) skillsFilters.classList.toggle('hidden', view !== 'skills');
  
  const automationsIntro = document.getElementById('automations-intro');
  if (automationsIntro) automationsIntro.classList.toggle('hidden', view !== 'automations' || selectedAutomation !== null);
  automationsFilters.classList.toggle('hidden', view !== 'automations' || selectedAutomation !== null);
  
  // Update search placeholder
  if (view === 'skills') {
    searchInput.placeholder = 'Search commands and skills...';
  } else {
    searchInput.placeholder = 'Search automations...';
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
  
  if (currentView === 'skills') {
    const type = filterType.value;
    const category = filterCategory.value;
    
    filteredItems = skills.filter(item => {
      if (search) {
        const searchableText = `${item.title} ${item.description} ${item.content} ${item.command || ''}`.toLowerCase();
        if (!searchableText.includes(search)) return false;
      }
      if (type && item.type !== type) return false;
      if (category && item.tags.category !== category) return false;
      return true;
    });
  } else if (currentView === 'automations') {
    const category = filterAutoCategory.value;
    
    filteredItems = automations.filter(auto => {
      if (search) {
        const searchableText = `${auto.title} ${auto.description}`.toLowerCase();
        if (!searchableText.includes(search)) return false;
      }
      if (category && auto.category !== category) return false;
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
  applyFilters();
}

// Render
function render() {
  // Handle automation detail view
  if (currentView === 'automations' && selectedAutomation) {
    renderAutomationDetail();
    return;
  }
  
  let dataSource;
  if (currentView === 'skills') dataSource = skills;
  else dataSource = automations;
  
  const hasActiveFilters = currentView === 'skills'
    ? (searchInput.value || filterType.value || filterCategory.value)
    : (searchInput.value || filterAutoCategory.value);
  
  // Featured section - hide when filters are active or on automations view
  if (hasActiveFilters || currentView === 'automations') {
    featuredSection.classList.add('hidden');
  } else {
    featuredSection.classList.remove('hidden');
    const featuredItems = dataSource.filter(p => p.featured).slice(0, 3);
    featuredGrid.innerHTML = featuredItems.map(p => createSkillCard(p)).join('');
    
    // Update featured section title
    const featuredTitle = featuredSection.querySelector('.section-title');
    if (featuredTitle) {
      featuredTitle.textContent = 'Featured';
    }
  }
  
  // Results count and section title
  let itemType = 'items';
  let sectionTitle = 'All commands & skills';
  if (currentView === 'automations') {
    itemType = 'automations';
    sectionTitle = 'All automations';
  }
  resultsCount.textContent = `Showing ${filteredItems.length} of ${dataSource.length} ${itemType}`;
  
  const allItemsTitle = document.getElementById('all-items-title');
  if (allItemsTitle) allItemsTitle.textContent = sectionTitle;
  
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
      if (currentView === 'automations') return createAutomationCard(p);
      return createSkillCard(p);
    }).join('');
  }
  
  // Attach event listeners to cards
  attachCardListeners();
}

// Create unified skill card HTML (handles commands, prompts, skills, tools)
function createSkillCard(item) {
  const categoryLabel = formatLabel(item.tags.category);
  const isCommand = item.type === 'command';
  const allCategoryIcons = { ...categoryIcons, ...commandCategoryIcons };
  
  return `
    <article class="card ${isCommand ? 'card-command' : ''}" data-id="${item.id}">
      <div class="card-content">
        <div class="card-header">
          <h3 class="card-title">${escapeHtml(item.title)}</h3>
          <div class="card-badges">
            <span class="card-badge badge-category clickable" data-category="${item.tags.category}">${allCategoryIcons[item.tags.category] || ''}${categoryLabel}</span>
            <span class="card-badge badge-${item.type} clickable-type" data-type="${item.type}">
              ${typeIcons[item.type] || ''}
              ${item.type}
            </span>
          </div>
        </div>
        
        <p class="card-description">${escapeHtml(item.description)}</p>
        
        <div class="card-preview">
          <code>${escapeHtml(item.content)}</code>
        </div>
      </div>
      
      <div class="card-actions">
        <button class="btn btn-copy" data-content="${escapeAttr(item.content)}">
          Copy
        </button>
        <button class="btn btn-expand">
          Expand
        </button>
      </div>
      
      <div class="card-expanded">
        ${item.requirements && item.requirements.length > 0 ? `
          <div class="expanded-section">
            <div class="expanded-label">Requirements</div>
            <ul class="requirements-list">
              ${item.requirements.map(r => `<li>${escapeHtml(r)}</li>`).join('')}
            </ul>
          </div>
        ` : ''}
        
        ${item.exampleOutput ? `
          <div class="expanded-section">
            <div class="expanded-label">Example output</div>
            <div class="expanded-content">${escapeHtml(item.exampleOutput)}</div>
          </div>
        ` : ''}
        
        ${isCommand ? `
          <div class="expanded-section">
            <div class="expanded-label">Usage</div>
            <div class="expanded-content"><code>/${item.command}</code> - Type this in Ona to run the command</div>
          </div>
        ` : ''}
        
        ${item.tags.persona && item.tags.persona.length > 0 ? `
          <div class="expanded-section">
            <div class="expanded-label">Personas</div>
            <div class="card-tags">
              ${item.tags.persona.map(p => `<span class="tag">${formatLabel(p)}</span>`).join('')}
            </div>
          </div>
        ` : ''}
      </div>
    </article>
  `;
}

// Create automation card HTML (Tembo-style)
function createAutomationCard(auto) {
  return `
    <article class="automation-card" data-id="${auto.id}">
      <span class="card-badge badge-auto-category clickable-auto-category" data-category="${escapeAttr(auto.category || '')}">${autoCategoryIcons[auto.category] || ''}${escapeHtml(formatCategory(auto.category || ''))}</span>
      <div class="automation-card-icon">
        ${automationIcons[auto.icon] || automationIcons['ci']}
      </div>
      <p class="automation-card-title">${escapeHtml(auto.title)}</p>
      <p class="automation-card-description">${escapeHtml(auto.shortDescription || '')}</p>
      <button class="btn btn-use-template" data-id="${auto.id}">
        View template
      </button>
    </article>
  `;
}

// Render automation detail view
function renderAutomationDetail() {
  const auto = selectedAutomation;
  if (!auto) return;
  
  // Hide normal sections but keep tab toggle visible
  document.querySelector('.hero h1').classList.add('hidden');
  document.querySelector('.hero .hero-subtitle').classList.add('hidden');
  featuredSection.classList.add('hidden');
  document.querySelector('.controls').classList.add('hidden');
  document.querySelector('.all-prompts-section').classList.add('hidden');
  
  // Show detail view
  let detailContainer = document.getElementById('automation-detail');
  if (!detailContainer) {
    detailContainer = document.createElement('div');
    detailContainer.id = 'automation-detail';
    document.querySelector('.main').appendChild(detailContainer);
  }
  detailContainer.classList.remove('hidden');
  
  detailContainer.innerHTML = `
    <div class="automation-detail">
      <button class="btn-back" id="back-to-automations">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        Back to automations
      </button>
      
      <div class="automation-detail-header-row">
        <div class="automation-detail-header">
          <div class="automation-detail-header-top">
            <div class="automation-detail-icon">
              ${automationIcons[auto.icon] || automationIcons['ci']}
            </div>
            <h1 class="automation-detail-title">${escapeHtml(auto.title)}</h1>
          </div>
          <p class="automation-detail-description">${escapeHtml(auto.description)}</p>
          <div class="automation-detail-actions">
            <a href="${auto.templateUrl}" target="_blank" class="btn btn-primary btn-use-template-large">
              Use this template
            </a>
            ${auto.exampleRepoUrl ? `
            <a href="${auto.exampleRepoUrl}" target="_blank" class="btn btn-secondary btn-example-repo">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
              Try with example repo
            </a>
            ` : ''}
          </div>
        </div>
        
        <div class="automation-how-to-use">
          <h3>How to use this template</h3>
          <ol class="how-to-list">
            <li>Set your trigger (manual, scheduled, or event-based)</li>
            <li>Click "Use this template" or create a new automation in Ona</li>
            <li>Copy each step below into the automation builder</li>
            <li>Customize the prompts for your specific use case</li>
          </ol>
        </div>
      </div>
      
      <div class="automation-detail-content">
        <div class="automation-main-content">
          <div class="automation-benefits">
            <h3>What this does</h3>
            <ul class="benefits-list">
              ${auto.benefits.map((b, i) => `
                <li>
                  <span class="benefit-number">${i + 1}</span>
                  <span class="benefit-text">${escapeHtml(b)}</span>
                </li>
              `).join('')}
            </ul>
          </div>
          
          <div class="automation-workflow">
            <h3>Workflow</h3>
            <div class="workflow-steps">
              ${auto.steps.map((step, i) => `
                <div class="workflow-step">
                  <div class="step-connector ${i === 0 ? 'first' : ''} ${i === auto.steps.length - 1 ? 'last' : ''}">
                    <div class="step-dot"></div>
                    ${i < auto.steps.length - 1 ? '<div class="step-line"></div>' : ''}
                  </div>
                  <div class="step-content">
                    <div class="step-header">
                      <div class="step-type step-type-${step.type}">
                        ${stepTypeIcons[step.type] || ''}
                        <span>${stepTypeLabels[step.type] || step.type}</span>
                      </div>
                      ${step.type !== 'trigger' ? `
                      <button class="btn btn-copy-step" data-step-content="${escapeAttr(step.content)}" title="Copy step">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                        Copy
                      </button>
                      ` : ''}
                    </div>
                    <h4 class="step-title">${escapeHtml(step.title)}</h4>
                    <p class="step-description">${escapeHtml(step.content)}</p>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
  
  // Add back button listener
  document.getElementById('back-to-automations').addEventListener('click', () => {
    selectedAutomation = null;
    detailContainer.classList.add('hidden');
    document.querySelector('.hero h1').classList.remove('hidden');
    document.querySelector('.hero .hero-subtitle').classList.remove('hidden');
    document.querySelector('.controls').classList.remove('hidden');
    document.querySelector('.all-prompts-section').classList.remove('hidden');
    updateURL();
    render();
  });
  
  // Add copy step button listeners
  document.querySelectorAll('.btn-copy-step').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const content = btn.dataset.stepContent;
      copyToClipboard(content);
    });
  });
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
  
  // Automation cards - click to view detail
  document.querySelectorAll('.automation-card').forEach(card => {
    card.addEventListener('click', (e) => {
      const id = card.dataset.id;
      selectedAutomation = automations.find(a => a.id === id);
      updateURL();
      render();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });
  
  // Use template buttons on automation cards
  document.querySelectorAll('.automation-card .btn-use-template').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.dataset.id;
      selectedAutomation = automations.find(a => a.id === id);
      updateURL();
      render();
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

// Helper: Format category for display
function formatCategory(category) {
  if (!category) return '';
  return category
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
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
