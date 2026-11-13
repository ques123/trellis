/* ============================
   TRELLIS — Application Logic
   ============================ */

// ===== ICONS =====
const ICONS = {
  plus: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>',
  close: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>',
  edit: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>',
  trash: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>',
  more: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>',
  star: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
  starFill: '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
  back: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>',
  clock: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15 14"/></svg>',
  calendar: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',
  tag: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>',
  check: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>',
  checkSquare: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>',
  comment: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>',
  attach: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48"/></svg>',
  user: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
  users: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>',
  bell: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"/></svg>',
  filter: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>',
  move: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="5 9 2 12 5 15"/><polyline points="9 5 12 2 15 5"/><polyline points="15 19 12 22 9 19"/><polyline points="19 9 22 12 19 15"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="12" y1="2" x2="12" y2="22"/></svg>',
  copy: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>',
  link: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>',
  desc: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="17" y1="10" x2="3" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="17" y1="18" x2="3" y2="18"/></svg>',
  menu: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>',
  board: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="18" rx="1"/><rect x="14" y="3" width="7" height="10" rx="1"/></svg>',
  chevron: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>',
  folder: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/></svg>',
  grip: '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><circle cx="9" cy="6" r="1.6"/><circle cx="15" cy="6" r="1.6"/><circle cx="9" cy="12" r="1.6"/><circle cx="15" cy="12" r="1.6"/><circle cx="9" cy="18" r="1.6"/><circle cx="15" cy="18" r="1.6"/></svg>'
};

// ===== LABEL DEFINITIONS =====
const LABEL_COLORS = [
  { id: 'green', color: '#16a34a', bg: 'rgba(22,163,74,0.12)', name: 'Green' },
  { id: 'yellow', color: '#ca8a04', bg: 'rgba(202,138,4,0.12)', name: 'Yellow' },
  { id: 'orange', color: '#ea580c', bg: 'rgba(234,88,12,0.12)', name: 'Orange' },
  { id: 'red', color: '#dc2626', bg: 'rgba(220,38,38,0.12)', name: 'Red' },
  { id: 'purple', color: '#7c3aed', bg: 'rgba(124,58,237,0.12)', name: 'Purple' },
  { id: 'blue', color: '#2563eb', bg: 'rgba(37,99,235,0.12)', name: 'Blue' },
  { id: 'pink', color: '#db2777', bg: 'rgba(219,39,119,0.12)', name: 'Pink' },
  { id: 'teal', color: '#0d9488', bg: 'rgba(13,148,136,0.12)', name: 'Teal' }
];

const BOARD_BACKGROUNDS = [
  { id: 'ocean', gradient: 'linear-gradient(135deg, #38bdf8, #0ea5e9, #0284c7)', name: 'Ocean' },
  { id: 'sunset', gradient: 'linear-gradient(135deg, #fb923c, #f97316, #ea580c)', name: 'Sunset' },
  { id: 'aurora', gradient: 'linear-gradient(135deg, #818cf8, #6366f1, #4f46e5)', name: 'Aurora' },
  { id: 'forest', gradient: 'linear-gradient(135deg, #4ade80, #22c55e, #16a34a)', name: 'Forest' },
  { id: 'berry', gradient: 'linear-gradient(135deg, #f472b6, #ec4899, #db2777)', name: 'Berry' },
  { id: 'ember', gradient: 'linear-gradient(135deg, #fbbf24, #f59e0b, #d97706)', name: 'Ember' },
  { id: 'midnight', gradient: 'linear-gradient(135deg, #94a3b8, #64748b, #475569)', name: 'Midnight' },
  { id: 'slate', gradient: 'linear-gradient(135deg, #67e8f9, #22d3ee, #06b6d4)', name: 'Slate' }
];

const AVATAR_COLORS = ['#d97b1e', '#2563eb', '#16a34a', '#dc2626', '#7c3aed', '#db2777', '#0d9488', '#ea580c'];

// ===== SAMPLE DATA =====
function generateId() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }

const SAMPLE_USERS = [
  { id: 'u2', name: 'Sarah Chen', email: 'sarah@trellis.io', color: AVATAR_COLORS[1] },
  { id: 'u3', name: 'Marcus Johnson', email: 'marcus@trellis.io', color: AVATAR_COLORS[2] },
  { id: 'u4', name: 'Elena Popov', email: 'elena@trellis.io', color: AVATAR_COLORS[3] },
  { id: 'u5', name: 'James Wilson', email: 'james@trellis.io', color: AVATAR_COLORS[4] }
];
// The board's owner (the one browser user). Name and optional photo come from
// OWNER_NAME / OWNER_AVATAR_URL in the server's .env, via /config.js.
const TRELLIS_CONFIG = window.TRELLIS_CONFIG || {};
const CURRENT_USER = { id: 'u1', name: TRELLIS_CONFIG.ownerName || 'Me', email: '', color: AVATAR_COLORS[0] };
const OWNER_AVATAR = TRELLIS_CONFIG.ownerAvatar || '';
// Agent users — cards/comments/notifications from an agent (via the agent API)
// are stamped with that agent's id and render its logo. id + token are paired
// server-side in routes/trellis-agent.js (AGENTS).
const AGENT_USERS = [
  { id: 'claude', name: 'Claude', email: 'claude@trellis', color: '#D97757', avatar: '/icons/claude.svg' },
  { id: 'codex', name: 'Codex', email: 'codex@trellis', color: '#10a37f', avatar: '/icons/codex.svg' },
];

function createSampleData() {
  return {
    currentUser: CURRENT_USER,
    users: [...SAMPLE_USERS, ...AGENT_USERS],
    projects: [
      { id: 'p1', name: 'Product Launch', color: AVATAR_COLORS[1] },
      { id: 'p2', name: 'Engineering', color: AVATAR_COLORS[4] }
    ],
    collapsedProjects: [],
    boards: [
      {
        id: 'b1', title: 'Product Launch Q2', background: 'ocean', starred: true, projectId: 'p1',
        members: ['u2', 'u3', 'u4'],
        lists: [
          {
            id: 'l1', title: 'Backlog', position: 0,
            cards: [
              { id: 'c1', title: 'Define launch timeline and milestones', description: 'Create a comprehensive timeline for the Q2 product launch including all key milestones and deliverables.', position: 0, labels: ['blue', 'green'], dueDate: null, dueDone: false, members: [], checklists: [], comments: [{ id: 'cm1', userId: 'u2', text: 'Should we include the beta testing phase in this timeline?', timestamp: Date.now() - 86400000 }], attachments: [], createdAt: Date.now() - 604800000 },
              { id: 'c2', title: 'Competitive analysis report', description: '', position: 1, labels: ['purple'], dueDate: Date.now() + 604800000, dueDone: false, members: ['u3'], checklists: [{ id: 'cl1', title: 'Research Tasks', items: [{ id: 'cli1', text: 'Identify top 5 competitors', checked: true }, { id: 'cli2', text: 'Analyze pricing models', checked: true }, { id: 'cli3', text: 'Feature comparison matrix', checked: false }, { id: 'cli4', text: 'SWOT analysis', checked: false }] }], comments: [], attachments: [], createdAt: Date.now() - 432000000 },
              { id: 'c3', title: 'Set up analytics dashboard', description: 'Configure tracking for key metrics: DAU, conversion rate, retention.', position: 2, labels: ['teal'], dueDate: null, dueDone: false, members: [], checklists: [], comments: [], attachments: [], createdAt: Date.now() - 259200000 }
            ]
          },
          {
            id: 'l2', title: 'In Progress', position: 1,
            cards: [
              { id: 'c4', title: 'Design landing page mockups', description: 'Create high-fidelity mockups for the launch landing page. Must include hero section, features overview, pricing, and CTA.', position: 0, labels: ['orange', 'blue'], dueDate: Date.now() + 172800000, dueDone: false, members: ['u2', 'u4'], checklists: [{ id: 'cl2', title: 'Page Sections', items: [{ id: 'cli5', text: 'Hero section with animation', checked: true }, { id: 'cli6', text: 'Features grid', checked: true }, { id: 'cli7', text: 'Pricing table', checked: false }, { id: 'cli8', text: 'Testimonials carousel', checked: false }, { id: 'cli9', text: 'Footer with newsletter signup', checked: false }] }], comments: [{ id: 'cm2', userId: 'u4', text: 'I\'ve uploaded the initial wireframes. Let me know what you think!', timestamp: Date.now() - 43200000 }], attachments: [{ id: 'a1', name: 'wireframes-v1.fig', type: 'figma', size: '2.4 MB', timestamp: Date.now() - 43200000 }], createdAt: Date.now() - 345600000 },
              { id: 'c5', title: 'Write API documentation', description: '', position: 1, labels: ['green'], dueDate: Date.now() + 432000000, dueDone: false, members: [], checklists: [], comments: [], attachments: [], createdAt: Date.now() - 172800000 }
            ]
          },
          {
            id: 'l3', title: 'Review', position: 2,
            cards: [
              { id: 'c6', title: 'Email campaign copy review', description: 'Review and approve the email sequences for launch week.', position: 0, labels: ['yellow', 'pink'], dueDate: Date.now() - 86400000, dueDone: false, members: ['u3'], checklists: [], comments: [{ id: 'cm4', userId: 'u3', text: 'Draft is ready for review. Please check subject lines.', timestamp: Date.now() - 172800000 }], attachments: [], createdAt: Date.now() - 518400000 }
            ]
          },
          {
            id: 'l4', title: 'Done', position: 3,
            cards: [
              { id: 'c7', title: 'Set up CI/CD pipeline', description: 'Automated deployment pipeline for staging and production.', position: 0, labels: ['teal', 'green'], dueDate: Date.now() - 259200000, dueDone: true, members: [], checklists: [{ id: 'cl3', title: 'Setup Steps', items: [{ id: 'cli10', text: 'Configure GitHub Actions', checked: true }, { id: 'cli11', text: 'Set up staging environment', checked: true }, { id: 'cli12', text: 'Add deployment scripts', checked: true }] }], comments: [], attachments: [], createdAt: Date.now() - 864000000 },
              { id: 'c8', title: 'Brand guidelines document', description: 'Comprehensive brand guide including logos, colors, typography, and usage rules.', position: 1, labels: ['purple', 'orange'], dueDate: Date.now() - 432000000, dueDone: true, members: ['u4'], checklists: [], comments: [], attachments: [{ id: 'a2', name: 'brand-guide-v2.pdf', type: 'pdf', size: '8.1 MB', timestamp: Date.now() - 604800000 }], createdAt: Date.now() - 1209600000 }
            ]
          }
        ],
        createdAt: Date.now() - 2592000000
      },
      {
        id: 'b2', title: 'Engineering Sprint 14', background: 'aurora', starred: false, projectId: 'p2',
        members: ['u2', 'u5'],
        lists: [
          { id: 'l5', title: 'To Do', position: 0, cards: [
            { id: 'c9', title: 'Fix authentication timeout bug', description: 'Users are being logged out after 5 minutes instead of 30.', position: 0, labels: ['red'], dueDate: Date.now() + 86400000, dueDone: false, members: ['u5'], checklists: [], comments: [], attachments: [], createdAt: Date.now() - 86400000 },
            { id: 'c10', title: 'Implement dark mode toggle', description: '', position: 1, labels: ['blue'], dueDate: null, dueDone: false, members: [], checklists: [], comments: [], attachments: [], createdAt: Date.now() - 43200000 }
          ]},
          { id: 'l6', title: 'In Progress', position: 1, cards: [
            { id: 'c11', title: 'Database migration to PostgreSQL 16', description: 'Migrate from PG14 to PG16 for improved performance.', position: 0, labels: ['orange', 'teal'], dueDate: Date.now() + 259200000, dueDone: false, members: ['u5'], checklists: [], comments: [], attachments: [], createdAt: Date.now() - 172800000 }
          ]},
          { id: 'l7', title: 'Done', position: 2, cards: [] }
        ],
        createdAt: Date.now() - 1209600000
      },
      {
        id: 'b3', title: 'Marketing Ideas', background: 'berry', starred: false, projectId: 'p1',
        members: ['u3', 'u4'],
        lists: [
          { id: 'l8', title: 'Ideas', position: 0, cards: [
            { id: 'c12', title: 'Influencer partnership program', description: '', position: 0, labels: ['pink'], dueDate: null, dueDone: false, members: ['u3'], checklists: [], comments: [], attachments: [], createdAt: Date.now() - 604800000 },
            { id: 'c13', title: 'Product hunt launch strategy', description: '', position: 1, labels: ['yellow', 'orange'], dueDate: null, dueDone: false, members: [], checklists: [], comments: [], attachments: [], createdAt: Date.now() - 518400000 }
          ]},
          { id: 'l9', title: 'In Review', position: 1, cards: [] },
          { id: 'l10', title: 'Approved', position: 2, cards: [] }
        ],
        createdAt: Date.now() - 1814400000
      }
    ],
    currentBoardId: null,
    view: 'dashboard',
    notifications: [],
    activeFilters: { labels: [], members: [] },
    showNotifPanel: false,
    expandedLabels: false
  };
}

// ===== STATE MANAGEMENT =====
let state = {};
let _saveTimer = null;  // debounce timer id while a save is pending (null = none)
let _saving = false;    // true while a PUT is in flight (incl. 409 retries)
let _stateVersion = 0; // optimistic-concurrency version of the loaded state

// ===== OFFLINE =====
// The last-known state lives in IndexedDB (shared/offline.js), so the board
// opens and stays editable with no network. `_shadow` is the JSON of the last
// state known to be on the server; edits the server hasn't accepted yet are
// flagged `_offlineDirty` and, once it's reachable again, three-way merged
// (shared/trellis-merge.js) with whatever the server has by then.
const OFFLINE_KEY = 'trellis';
let _shadow = null;        // JSON string of the last server-confirmed state
let _offline = false;      // last server contact failed
let _offlineDirty = false; // local edits not yet accepted by the server
let _noBaseline = false;   // opened offline with nothing cached: read-only until reload
const hasOffline = () => typeof PBOffline !== 'undefined';

function persistLocal(json, dirty) {
  if (!hasOffline()) return;
  PBOffline.set(OFFLINE_KEY, { state: json, shadow: dirty ? _shadow : json, version: _stateVersion, dirty: !!dirty, savedAt: Date.now() });
}
function setOffline(kind) {
  _offline = true;
  if (!hasOffline()) return;
  if (kind === 'auth') PBOffline.status('error', 'Signed out: changes kept on this device, sign in to sync');
  else if (_noBaseline) PBOffline.status('offline', 'Offline: no saved copy on this device yet');
  else PBOffline.status('offline', _offlineDirty ? 'Offline: changes saved on this device' : 'Offline');
}
function setOnline() {
  const was = _offline;
  _offline = false;
  if (was && hasOffline()) PBOffline.status('synced', 'Back online, synced');
}

function normalizeLoadedState() {
  if (!state.activeFilters) state.activeFilters = { labels: [], members: [] };
  if (!state.notifications) state.notifications = [];
  if (!state.expandedLabels) state.expandedLabels = false;
  state.users = [...SAMPLE_USERS, ...AGENT_USERS];
  state.currentUser = CURRENT_USER;
  if (!state.projects) state.projects = [];
  if (!state.collapsedProjects) state.collapsedProjects = [];
  state.boards.forEach(b => {
    if (b.projectId === undefined) b.projectId = null;
    b.members = (b.members || []).filter(id => id !== 'u1');
    (b.lists || []).forEach(l => (l.cards || []).forEach(c => {
      c.members = (c.members || []).filter(id => id !== 'u1');
    }));
  });
}

async function loadState() {
  let snap = null;
  try { snap = hasOffline() ? await PBOffline.get(OFFLINE_KEY) : null; } catch { snap = null; }
  let server = null, failure = null;
  try {
    const res = await fetch('/api/trellis/state');
    if (res.status === 401) failure = 'auth';
    else if (!res.ok) failure = 'offline';
    else {
      _stateVersion = Number(res.headers.get('X-State-Version')) || 0;
      server = await res.json();
    }
  } catch { failure = 'offline'; }

  if (failure) {
    // No server: open the cached copy and keep working on it. Never fall back
    // to sample data here: the first save would write it over the real board.
    if (snap && snap.state) {
      state = JSON.parse(snap.state);
      _shadow = snap.shadow;
      _stateVersion = snap.version || 0;
      _offlineDirty = !!snap.dirty;
      normalizeLoadedState();
    } else {
      state = { boards: [], projects: [], collapsedProjects: [], notifications: [], currentBoardId: null, view: 'dashboard', activeFilters: { labels: [], members: [] } };
      normalizeLoadedState();
      _noBaseline = true;
    }
    setOffline(failure);
    return;
  }

  if (server && server.boards) {
    const serverJson = JSON.stringify(server);
    if (snap && snap.dirty && snap.state && typeof mergeTrellis === 'function') {
      // Edits left over from an offline session (or a tab closed mid-save):
      // fold them into the current server state and save.
      try {
        state = mergeTrellis(snap.shadow ? JSON.parse(snap.shadow) : null, JSON.parse(snap.state), server);
        _offlineDirty = true;
      } catch (err) {
        console.warn('offline merge failed, using server state', err);
        state = server;
      }
    } else {
      state = server;
    }
    _shadow = serverJson;
    normalizeLoadedState();
    if (_offlineDirty) setTimeout(() => pushState(), 0);
    else persistLocal(JSON.stringify(state), false);
  } else {
    state = createSampleData();
    // Fresh install (the server has never stored a board): save the starter
    // boards so the agent API has something to work with straight away.
    if (server === null) setTimeout(() => pushState(), 0);
  }
}

// Reconnect: push pending edits, or just catch up when there are none.
let _syncing = false;
async function syncNow() {
  if (_syncing || _saving || _saveTimer) return;
  _syncing = true;
  try {
    if (_noBaseline) {
      const r = await fetch('/api/trellis/version');
      if (r.ok) location.reload();
      return;
    }
    if (_offlineDirty) { await pushState(); return; }
    const r = await fetch('/api/trellis/version');
    if (r.ok) { setOnline(); await pollForUpdates(); }
  } catch { /* still offline */ }
  finally { _syncing = false; }
}

// Additively reconcile server-only items into local `state`. The agent API can
// only ADD cards (no delete), so on a save conflict we pull in any boards/lists/
// cards the server has that we don't — preserving both the agent's additions and
// the local edit we're about to save.
function mergeServerAdditions(server) {
  if (!server || !Array.isArray(server.boards)) return;
  const clone = x => JSON.parse(JSON.stringify(x));
  state.boards = state.boards || [];
  for (const sb of server.boards) {
    const lb = state.boards.find(b => b.id === sb.id);
    if (!lb) { state.boards.push(clone(sb)); continue; }
    lb.lists = lb.lists || [];
    // A server card counts as "new" only when its id is absent from the ENTIRE
    // local board — not just the target list. Checking per-list duplicated any
    // card that had MOVED lists on the server (e.g. an agent moving doing->done):
    // it got appended to its new list while its old copy still sat in the old
    // list, and a later whole-blob save then persisted the duplicate.
    const present = new Set();
    for (const l of lb.lists) for (const c of (l.cards || [])) present.add(c.id);
    for (const sl of sb.lists || []) {
      const ll = lb.lists.find(l => l.id === sl.id);
      if (!ll) {
        const nl = clone(sl);
        nl.cards = (nl.cards || []).filter(c => !present.has(c.id));
        nl.cards.forEach(c => present.add(c.id));
        lb.lists.push(nl);
        continue;
      }
      ll.cards = ll.cards || [];
      for (const sc of sl.cards || []) {
        if (!present.has(sc.id)) { ll.cards.push(clone(sc)); present.add(sc.id); }
      }
    }
  }
  // Merge notifications too (so an agent action lights the bell live). Additive
  // union by id — never overwrites a local `read` flag, so "mark all read" sticks
  // and only genuinely-new agent notifications (read:false) arrive unread.
  if (Array.isArray(server.notifications)) {
    state.notifications = state.notifications || [];
    const have = new Set(state.notifications.map(n => n.id));
    for (const sn of server.notifications) if (!have.has(sn.id)) state.notifications.push(clone(sn));
    state.notifications.sort((a, b) => b.timestamp - a.timestamp);
    if (state.notifications.length > 50) state.notifications.length = 50;
  }
}

// Adopt the server's AUTHORITATIVE card set so agent MOVES, edits and deletes
// show live — not just adds (that's what mergeServerAdditions does). Used only by
// the idle poller, which runs solely when the user has nothing unsaved (no pending
// or in-flight save, not dragging, not typing) — so the server is the source of
// truth for every card and a wholesale card replace can't clobber a local edit.
// Local-only view state (currentBoardId, view, filters, the open modal) lives in
// separate keys and is deliberately left untouched.
function reconcileFromServer(server) {
  if (!server || !Array.isArray(server.boards)) return;
  const clone = x => JSON.parse(JSON.stringify(x));
  state.boards = state.boards || [];
  for (const sb of server.boards) {
    const lb = state.boards.find(b => b.id === sb.id);
    if (!lb) { state.boards.push(clone(sb)); continue; }
    lb.title = sb.title;
    // Which project folder the board is filed in. Without this, a tab that
    // missed a move made elsewhere would save its stale folder back over it.
    lb.projectId = sb.projectId || null;
    lb.lists = lb.lists || [];
    for (const sl of sb.lists || []) {
      const ll = lb.lists.find(l => l.id === sl.id);
      if (!ll) { lb.lists.push(clone(sl)); continue; }
      ll.title = sl.title;
      ll.position = sl.position;
      ll.cards = (sl.cards || []).map(clone); // reflects move/edit/delete/add + order
    }
  }
  adoptProjects(server);
  mergeNotifications(server.notifications);
}

// The project folders and which of them are collapsed are shared state too, so
// take the server's copy when it carries one (a write patch only includes them
// when they changed).
function adoptProjects(src) {
  if (Array.isArray(src.projects)) state.projects = JSON.parse(JSON.stringify(src.projects));
  if (Array.isArray(src.collapsedProjects)) state.collapsedProjects = src.collapsedProjects.slice();
}

// Additive union by id — never overwrites a local `read` flag, so "mark all read"
// sticks and only genuinely-new agent notifications (read:false) arrive unread.
function mergeNotifications(incoming) {
  if (!Array.isArray(incoming)) return;
  const clone = x => JSON.parse(JSON.stringify(x));
  state.notifications = state.notifications || [];
  const have = new Set(state.notifications.map(n => n.id));
  for (const sn of incoming) if (!have.has(sn.id)) state.notifications.push(clone(sn));
  state.notifications.sort((a, b) => b.timestamp - a.timestamp);
  if (state.notifications.length > 50) state.notifications.length = 50;
}

// Apply a server patch describing exactly what changed. Returns false if
// anything looks off — an unknown board, a card id we can't resolve — and the
// caller then refetches the whole state rather than guessing.
function applyPatch(patch) {
  if (!patch || !Array.isArray(patch.boards)) return false;
  const clone = x => JSON.parse(JSON.stringify(x));
  state.boards = state.boards || [];

  for (const pb of patch.boards) {
    if (pb.full) {
      const i = state.boards.findIndex(b => b.id === pb.id);
      if (i === -1) state.boards.push(clone(pb.full)); else state.boards[i] = clone(pb.full);
      continue;
    }
    const lb = state.boards.find(b => b.id === pb.id);
    if (!lb) return false;
    // Index every card on the board, so one that moved lists is still resolvable.
    const known = new Map();
    for (const l of lb.lists || []) for (const c of l.cards || []) known.set(c.id, c);

    const { lists, ...boardFields } = pb;
    Object.assign(lb, boardFields);
    const rebuilt = [];
    for (const pl of lists || []) {
      const existing = (lb.lists || []).find(l => l.id === pl.id);
      const cards = [];
      for (const id of pl.cardIds || []) {
        const card = pl.cards[id] ? clone(pl.cards[id]) : known.get(id);
        if (!card) return false; // never seen this card — fall back to a refetch
        cards.push(card);
      }
      rebuilt.push(Object.assign(existing || {}, { id: pl.id, title: pl.title, position: pl.position, cards }));
    }
    lb.lists = rebuilt; // covers list add, remove and reorder
  }

  for (const id of patch.removedBoards || []) state.boards = state.boards.filter(b => b.id !== id);
  adoptProjects(patch);
  if (patch.notifications) mergeNotifications(patch.notifications);
  return true;
}

async function pushState(attempt) {
  attempt = attempt || 0;
  if (_noBaseline) return; // opened offline with no cached board: nothing safe to save
  if (attempt === 0) _saving = true; // suppress the poller until the save settles
  const body = JSON.stringify(state);
  persistLocal(body, true); // survives a closed tab or a dropped connection
  const ctrl = typeof AbortController !== 'undefined' ? new AbortController() : null;
  const timeout = ctrl ? setTimeout(() => ctrl.abort(), 20000) : null;
  try {
    const res = await fetch('/api/trellis/state', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'X-State-Version': String(_stateVersion) },
      body,
      signal: ctrl ? ctrl.signal : undefined
    });
    if (res.status === 409) {
      // Someone wrote since we loaded (e.g. an agent card). Merge their changes
      // with our pending edit, adopt their version, and retry the save. After an
      // offline stretch that can be a lot, so use the full three-way merge;
      // online, the window is one debounce, so additions are all that matter.
      const resBody = await res.json().catch(() => null);
      if (resBody && resBody.state) {
        if (_offlineDirty && _shadow && typeof mergeTrellis === 'function') {
          state = mergeTrellis(JSON.parse(_shadow), state, resBody.state);
          normalizeLoadedState();
        } else {
          mergeServerAdditions(resBody.state);
        }
        _shadow = JSON.stringify(resBody.state);
        _stateVersion = Number(resBody.version) || _stateVersion;
      }
      if (attempt < 3) { await pushState(attempt + 1); return; }
      console.warn('save: gave up after repeated version conflicts');
      return;
    }
    if (res.status === 401) { _offlineDirty = true; setOffline('auth'); return; }
    if (!res.ok) {
      if (hasOffline() && PBOffline.isOfflineResponse(res)) { _offlineDirty = true; setOffline('offline'); return; }
      console.warn('Failed to save state:', res.status);
      return;
    }
    const v = res.headers.get('X-State-Version');
    if (v != null) _stateVersion = Number(v);
    _shadow = body;
    // Only mark clean if nothing changed while the PUT was in flight.
    const changedMeanwhile = _saveTimer || JSON.stringify(state) !== body;
    if (!changedMeanwhile) { _offlineDirty = false; persistLocal(body, false); }
    setOnline();
    // If a conflict merge pulled in changes, show them (but never re-render
    // mid-drag: that would break an in-progress drag).
    if (attempt > 0 && typeof renderBoard === 'function'
        && !(typeof dragActive === 'function' && dragActive())) {
      render();
      if (currentModalCard) {
        if (getCard(currentModalCard.boardId, currentModalCard.cardId)) renderCardModal();
        else closeModal();
      }
    }
  } catch (err) {
    // Network down (or timed out): the edit is already in IndexedDB.
    _offlineDirty = true;
    setOffline('offline');
  } finally {
    if (timeout) clearTimeout(timeout);
    if (attempt === 0) _saving = false; // runs after all retries settle
  }
}

function saveState() {
  if (_saveTimer) clearTimeout(_saveTimer);
  // Null the id when the debounce fires so `_saveTimer` means "save pending" and
  // doesn't stay truthy forever — otherwise the poller's guard would disable
  // live updates after the user's first edit.
  _saveTimer = setTimeout(() => { _saveTimer = null; pushState(); }, _offline ? 1500 : 500);
}

// ===== LIVE UPDATES =====
// A Server-Sent Events stream pushes the new version the instant anyone writes
// (another tab, or Claude via the agent API), and we pull + reconcile straight
// away — so a card Claude moves lands on screen in well under a second, no
// refresh. Polling stays as the fallback for when the stream can't connect, and
// as a slow safety net in case a proxy leaves a dead stream open.
let _live = null;              // EventSource, when connected
let _liveOpen = false;
let _pendingVersion = 0;       // newest version announced but not yet applied
let _applyTimer = null;
let _applying = false;

// Never reconcile mid-interaction: a wholesale card replace would clobber an
// in-flight edit, and re-rendering mid-drag would break the drag. When busy we
// keep the announced version and apply it the moment the user is idle, so an
// update is delayed, never dropped.
function liveUpdatesBusy() {
  if (document.hidden || _saveTimer || _saving || _offlineDirty || _noBaseline) return true;
  if (typeof dragActive === 'function' && dragActive()) return true;
  // The global search box is exempt: it lives in the sidebar, outside
  // #view-container, so a board re-render never touches it. Parking focus there
  // (a very common case) must NOT freeze live updates.
  const ae = document.activeElement;
  return !!(ae && ae.id !== 'global-search'
    && (ae.isContentEditable || ae.tagName === 'INPUT' || ae.tagName === 'TEXTAREA'));
}

// Pull the authoritative state and show it. Safe only when idle — see above.
async function applyServerState(announced) {
  if (_applying) return;
  _applying = true;
  try {
    const sres = await fetch('/api/trellis/state');
    if (!sres.ok) return;
    const newVer = Number(sres.headers.get('X-State-Version')) || announced || 0;
    const server = await sres.json();
    if (!server || !Array.isArray(server.boards)) return;
    if (newVer <= _stateVersion) return; // already current
    reconcileFromServer(server);
    _stateVersion = newVer;
    _shadow = JSON.stringify(server);
    persistLocal(JSON.stringify(state), false);
    setOnline();
    if (_pendingVersion <= newVer) _pendingVersion = 0;
    render();
    // The open card may have moved, changed, or been deleted out from under us.
    if (currentModalCard) {
      if (getCard(currentModalCard.boardId, currentModalCard.cardId)) renderCardModal();
      else closeModal();
    }
  } catch { /* offline / transient — the next event or poll retries */ }
  finally { _applying = false; }
}

// Apply the newest announced version as soon as it's safe, retrying while busy.
function scheduleApply() {
  if (_applyTimer || !_pendingVersion || _pendingVersion <= _stateVersion) return;
  const run = async () => {
    _applyTimer = null;
    if (!_pendingVersion || _pendingVersion <= _stateVersion) return;
    if (liveUpdatesBusy()) {
      // While hidden, stop retrying entirely — background timers are throttled
      // to about once a second anyway, and the visibilitychange handler picks
      // this up the instant the tab is shown.
      if (!document.hidden) _applyTimer = setTimeout(run, 250);
      return;
    }
    await applyServerState(_pendingVersion);
    if (_pendingVersion > _stateVersion) _applyTimer = setTimeout(run, 250);
  };
  _applyTimer = setTimeout(run, 0);
}

function connectLiveUpdates() {
  if (!window.EventSource || _live) return;
  try {
    _live = new EventSource('/api/trellis/events');
  } catch { _live = null; return; }
  _live.addEventListener('open', () => { _liveOpen = true; });
  _live.addEventListener('version', e => {
    let msg;
    try { msg = JSON.parse(e.data); } catch { return; }
    const version = Number(msg.version) || 0;
    if (version <= _stateVersion) return;
    // Fast path: the event carried the change itself and it stacks exactly on
    // the version we hold, so there is nothing to fetch — apply and paint.
    if (msg.patch && msg.base === _stateVersion && !liveUpdatesBusy() && !_applying) {
      if (applyPatch(msg.patch)) {
        _stateVersion = version;
        _shadow = JSON.stringify(state);
        persistLocal(_shadow, false);
        render();
        if (currentModalCard) {
          if (getCard(currentModalCard.boardId, currentModalCard.cardId)) renderCardModal();
          else closeModal();
        }
        return;
      }
      // Patch didn't fit what we hold — fall through and refetch.
    }
    if (version > _pendingVersion) _pendingVersion = version;
    scheduleApply();
  });
  _live.addEventListener('error', () => {
    // EventSource retries by itself on a dropped connection; flag it closed so
    // the fallback poll covers the gap meanwhile. A CLOSED readyState means it
    // gave up for good (a non-2xx response, say), and only we can restart it.
    _liveOpen = false;
    if (_live && _live.readyState === 2) {
      _live = null;
      setTimeout(connectLiveUpdates, 5000);
    }
  });
}

// Fallback path: ask /version whether we're behind. Runs on a timer only while
// the stream is down, plus a slow tick regardless to catch a silently-dead
// stream, and on tab focus.
async function pollForUpdates() {
  if (liveUpdatesBusy()) return;
  try {
    const vres = await fetch('/api/trellis/version');
    if (!vres.ok) return;
    const { version } = await vres.json();
    if (typeof version !== 'number' || version <= _stateVersion) return;
    if (version > _pendingVersion) _pendingVersion = version;
    await applyServerState(version);
  } catch { /* offline / transient — try again next tick */ }
}

// ===== UTILITY FUNCTIONS =====
function getBoard(boardId) { return state.boards.find(b => b.id === boardId); }
function getCurrentBoard() { return getBoard(state.currentBoardId); }
function getList(boardId, listId) {
  const board = getBoard(boardId);
  return board ? board.lists.find(l => l.id === listId) : null;
}
function getCard(boardId, cardId) {
  const board = getBoard(boardId);
  if (!board) return null;
  for (const list of board.lists) {
    const card = list.cards.find(c => c.id === cardId);
    if (card) return { card, list };
  }
  return null;
}
function getUser(userId) { return state.users.find(u => u.id === userId); }
function getInitials(name) { return name.split(' ').map(n => n[0]).join('').slice(0, 2); }
function avatarHtml(user, size = '') {
  const cls = size ? `avatar ${size}` : 'avatar';
  if (user.avatar) {
    return `<div class="${cls}" style="background:#fff;overflow:hidden" title="${user.name}"><img src="${user.avatar}" alt="" style="width:100%;height:100%;object-fit:contain"></div>`;
  }
  return `<div class="${cls}" style="background:${user.color}" title="${user.name}">${getInitials(user.name)}</div>`;
}
function formatDate(ts) {
  const d = new Date(ts);
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return `${months[d.getMonth()]} ${d.getDate()}`;
}
function formatDateFull(ts) {
  const d = new Date(ts);
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
}
// Creation stamps on cards and comments: "Oct 28, 14:05", with the year only
// when it isn't this year. formatDateTimeFull is the hover/modal version.
function formatDateTime(ts) {
  const d = new Date(ts);
  const time = d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  const year = d.getFullYear() === new Date().getFullYear() ? '' : ` ${d.getFullYear()}`;
  return `${formatDate(ts)}${year}, ${time}`;
}
function formatDateTimeFull(ts) {
  const d = new Date(ts);
  return `${formatDateFull(ts)}, ${d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}`;
}
// Who made a card. Agent cards have always stored createdBy; UI cards only do
// since Oct 2026, and the UI is single-user, so a missing createdBy is the owner.
function cardCreator(card) {
  return (card.createdBy && getUser(card.createdBy)) || CURRENT_USER;
}
// Card-tile age in calendar days: Today, 1 Day … 7 Day, then the date (Oct 24).
function cardAge(ts) {
  const midnight = t => new Date(t).setHours(0, 0, 0, 0);
  const days = Math.round((midnight(Date.now()) - midnight(ts)) / 86400000);
  if (days <= 0) return 'Today';
  if (days <= 7) return `${days} Day`;
  return formatDate(ts);
}
function timeAgo(ts) {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return formatDate(ts);
}
function dueDateStatus(dueDate, dueDone) {
  if (dueDone) return 'complete';
  const now = Date.now();
  if (dueDate < now) return 'overdue';
  if (dueDate - now < 86400000) return 'due-soon';
  return '';
}
function getLabelDef(labelId) { return LABEL_COLORS.find(l => l.id === labelId); }
function getBgGradient(bgId) {
  const bg = BOARD_BACKGROUNDS.find(b => b.id === bgId);
  return bg ? bg.gradient : BOARD_BACKGROUNDS[0].gradient;
}
function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// ===== MARKDOWN =====
// Comments and descriptions are written in markdown (agents especially write
// bullets, bold and code spans), so plain escapeHtml flattened them into one
// unreadable blob. renderRichText() is a small self-contained subset renderer:
// it escapes FIRST and only ever adds tags of its own, so no author-supplied
// markup can survive — never feed it anything but user text.
const RICH_SAFE_URL = /^(https?:\/\/|mailto:|\/)/i;
const RICH_LINK_ATTRS = 'target="_blank" rel="noopener noreferrer" onclick="event.stopPropagation()"';
// Images load without a click, so only https or our own paths (uploaded
// attachments) — never `//host` or plain http.
const RICH_IMG_URL = /^(https:\/\/|\/(?!\/))/i;

// Inline spans, applied to already-escaped text one block at a time.
function renderRichInline(escaped) {
  const codes = [];
  let s = escaped.replace(/`([^`\n]+)`/g, (m, code) => `\u0000C${codes.push(code) - 1}\u0000`);

  // ![alt](url) — dropped/pasted screenshots in comments. Stashed like code
  // spans so the emphasis rules below can't reach into the src/alt.
  const imgs = [];
  s = s.replace(/!\[([^\]\n]*)\]\(([^)\s]+)\)/g, (m, alt, url) =>
    RICH_IMG_URL.test(url.replace(/&amp;/g, '&'))
      ? `\u0000I${imgs.push(`<a class="rich-img" href="${url}" ${RICH_LINK_ATTRS}><img src="${url}" alt="${alt}" loading="lazy"></a>`) - 1}\u0000`
      : m);

  s = s.replace(/\[([^\]\n]+)\]\(([^)\s]+)\)/g, (m, text, url) =>
    RICH_SAFE_URL.test(url.replace(/&amp;/g, '&'))
      ? `<a href="${url}" ${RICH_LINK_ATTRS}>${text}</a>`
      : m);
  // Bare URLs. The preceding-char guard keeps this off URLs the rule above
  // already wrapped (those sit after `"` or `>`, never after space/paren).
  s = s.replace(/(^|[\s(])(https?:\/\/[^\s<>()]+[^\s<>().,;:!?])/g,
    (m, pre, url) => `${pre}<a href="${url}" ${RICH_LINK_ATTRS}>${url}</a>`);

  // Emphasis delimiters must hug their text (CommonMark's flanking rule), so
  // `*.js`, `5 * 3` and snake_case_names stay literal.
  s = s.replace(/\*\*(?![\s*])([^\n]*?[^\s*])\*\*/g, '<strong>$1</strong>');
  s = s.replace(/__(?![\s_])([^\n]*?[^\s_])__/g, '<strong>$1</strong>');
  s = s.replace(/(^|[^*\w])\*(?![\s*])([^*\n]*[^\s*])\*(?!\*)/g, '$1<em>$2</em>');
  s = s.replace(/(^|[^_\w])_(?![\s_])([^_\n]*[^\s_])_(?![\w_])/g, '$1<em>$2</em>');
  s = s.replace(/~~([^~\n]+)~~/g, '<del>$1</del>');

  return s.replace(/\u0000C(\d+)\u0000/g, (m, i) => `<code>${codes[i]}</code>`)
    .replace(/\u0000I(\d+)\u0000/g, (m, i) => imgs[i]);
}

function renderRichText(str) {
  if (str === null || str === undefined || str === '') return '';
  const lines = escapeHtml(String(str)).replace(/\r\n?/g, '\n').split('\n');
  const out = [];
  let para = [];        // pending paragraph lines
  let list = null;      // { tag, items: [text] }
  let quote = [];       // pending blockquote lines
  let fence = null;     // pending fenced-code lines

  const block = html => { flushPara(); flushList(); flushQuote(); out.push(html); };
  function flushPara() {
    if (!para.length) return;
    out.push(`<p>${renderRichInline(para.join('\n')).replace(/\n/g, '<br>')}</p>`);
    para = [];
  }
  function flushList() {
    if (!list) return;
    const items = list.items.map(i => `<li>${renderRichInline(i).replace(/\n/g, '<br>')}</li>`).join('');
    out.push(`<${list.tag}>${items}</${list.tag}>`);
    list = null;
  }
  function flushQuote() {
    if (!quote.length) return;
    out.push(`<blockquote>${renderRichInline(quote.join('\n')).replace(/\n/g, '<br>')}</blockquote>`);
    quote = [];
  }
  const isTableRow = l => /\|/.test(l) && /^\s*\|?[^|]*\|/.test(l);
  const cells = l => l.trim().replace(/^\|/, '').replace(/\|\s*$/, '').split('|').map(c => c.trim());

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Fenced code — verbatim until the closing fence (or end of text).
    if (fence !== null) {
      if (/^\s*```/.test(line)) { block(`<pre><code>${fence.join('\n')}</code></pre>`); fence = null; }
      else fence.push(line);
      continue;
    }
    if (/^\s*```/.test(line)) { flushPara(); flushList(); flushQuote(); fence = []; continue; }

    if (!line.trim()) { flushPara(); flushList(); flushQuote(); continue; }

    // Horizontal rule (before list parsing, so `---` isn't read as a bullet).
    if (/^\s*(?:([-*_])\s*)(?:\1\s*){2,}$/.test(line)) { block('<hr>'); continue; }

    const heading = line.match(/^\s*(#{1,6})\s+(.+?)\s*#*$/);
    if (heading) {
      const level = Math.min(6, heading[1].length + 2); // # is a section head, not a page title
      block(`<h${level}>${renderRichInline(heading[2])}</h${level}>`);
      continue;
    }

    const quoted = line.match(/^\s*&gt;\s?(.*)$/);
    if (quoted) { flushPara(); flushList(); quote.push(quoted[1]); continue; }
    flushQuote();

    // Pipe table — needs a `---|---` separator on the next line.
    if (isTableRow(line) && lines[i + 1] && /^\s*\|?[\s:-]*-[\s:|-]*$/.test(lines[i + 1]) && isTableRow(lines[i + 1])) {
      const head = cells(line);
      const rows = [];
      let j = i + 2;
      for (; j < lines.length && lines[j].trim() && isTableRow(lines[j]); j++) rows.push(cells(lines[j]));
      block(`<table><thead><tr>${head.map(c => `<th>${renderRichInline(c)}</th>`).join('')}</tr></thead>`
        + `<tbody>${rows.map(r => `<tr>${r.map(c => `<td>${renderRichInline(c)}</td>`).join('')}</tr>`).join('')}</tbody></table>`);
      i = j - 1;
      continue;
    }

    // Lists — `•` included because agents like typographic bullets.
    const bullet = line.match(/^\s*[-*+•]\s+(.+)$/);
    const numbered = line.match(/^\s*\d+[.)]\s+(.+)$/);
    if (bullet || numbered) {
      const tag = bullet ? 'ul' : 'ol';
      flushPara();
      if (list && list.tag !== tag) flushList();
      if (!list) list = { tag, items: [] };
      list.items.push((bullet || numbered)[1]);
      continue;
    }
    // A plain line right under a bullet continues that bullet.
    if (list) { list.items[list.items.length - 1] += '\n' + line.trim(); continue; }

    para.push(line);
  }
  if (fence !== null) out.push(`<pre><code>${fence.join('\n')}</code></pre>`);
  flushPara(); flushList(); flushQuote();
  return out.join('');
}

// ===== DATA OPERATIONS =====
function createBoard(title, background = 'ocean', projectId = null) {
  const board = {
    id: generateId(), title, background, starred: false, projectId,
    members: [state.currentUser.id],
    lists: [], createdAt: Date.now()
  };
  state.boards.unshift(board);
  saveState();
  showToast('Board created', 'success');
  return board;
}

function deleteBoard(boardId) {
  state.boards = state.boards.filter(b => b.id !== boardId);
  if (state.currentBoardId === boardId) {
    state.currentBoardId = null;
    state.view = 'dashboard';
  }
  saveState();
  showToast('Board deleted', 'info');
}

function renameBoard(boardId, title) {
  const board = getBoard(boardId);
  if (board) { board.title = title; saveState(); }
}

function toggleBoardStar(boardId) {
  const board = getBoard(boardId);
  if (board) { board.starred = !board.starred; saveState(); }
}

function createList(boardId, title) {
  const board = getBoard(boardId);
  if (!board) return;
  const list = {
    id: generateId(), title,
    position: board.lists.length,
    cards: []
  };
  board.lists.push(list);
  saveState();
  return list;
}

function deleteList(boardId, listId) {
  const board = getBoard(boardId);
  if (!board) return;
  board.lists = board.lists.filter(l => l.id !== listId);
  board.lists.forEach((l, i) => l.position = i);
  saveState();
  showToast('List deleted', 'info');
}

function renameList(boardId, listId, title) {
  const list = getList(boardId, listId);
  if (list) { list.title = title; saveState(); }
}

function createCard(boardId, listId, title) {
  const list = getList(boardId, listId);
  if (!list) return;
  const card = {
    id: generateId(), title, description: '',
    position: list.cards.length,
    labels: [], dueDate: null, dueDone: false,
    members: [], checklists: [], comments: [],
    attachments: [], createdAt: Date.now(), createdBy: state.currentUser.id
  };
  list.cards.push(card);
  saveState();
  addNotification('create', boardId, card.id, title, 'added');
  return card;
}

let _lastDeleted = null; // { boardId, listId, index, card } — for one-step undo

function deleteCard(boardId, cardId) {
  const board = getBoard(boardId);
  if (!board) return;
  let title = null;
  for (const list of board.lists) {
    const idx = list.cards.findIndex(c => c.id === cardId);
    if (idx !== -1) {
      title = list.cards[idx].title;
      _lastDeleted = { boardId, listId: list.id, index: idx, card: list.cards[idx] };
      list.cards.splice(idx, 1);
      list.cards.forEach((c, i) => c.position = i);
      break;
    }
  }
  saveState();
  if (title !== null) {
    addNotification('delete', boardId, cardId, title, 'deleted');
    showToast('Card deleted', 'info', { label: 'Undo', onClick: 'undoDelete()' });
  }
}

// Restore the most recently deleted card to its original list and position.
function undoDelete() {
  if (!_lastDeleted) return;
  const { boardId, listId, index, card } = _lastDeleted;
  _lastDeleted = null;
  const board = getBoard(boardId);
  const list = board && board.lists.find(l => l.id === listId);
  if (!list) { showToast('Could not undo — list no longer exists', 'error'); return; }
  const pos = Math.max(0, Math.min(index, list.cards.length));
  list.cards.splice(pos, 0, card);
  list.cards.forEach((c, i) => c.position = i);
  saveState();
  // remove the lingering "Card deleted" toast, then render + confirm
  document.querySelectorAll('#toast-container .toast').forEach(t => t.remove());
  if (state.view === 'board' && state.currentBoardId === boardId) renderBoard();
  showToast('Card restored', 'success');
}

function moveCard(boardId, cardId, toListId, toPosition) {
  const board = getBoard(boardId);
  if (!board) return;
  let card = null;
  for (const list of board.lists) {
    const idx = list.cards.findIndex(c => c.id === cardId);
    if (idx !== -1) {
      card = list.cards.splice(idx, 1)[0];
      list.cards.forEach((c, i) => c.position = i);
      break;
    }
  }
  if (!card) return;
  const targetList = board.lists.find(l => l.id === toListId);
  if (!targetList) return;
  targetList.cards.splice(toPosition, 0, card);
  targetList.cards.forEach((c, i) => c.position = i);
  saveState();
  addNotification('move', boardId, cardId, card.title, 'moved', ' to ' + targetList.title);
}

function moveList(boardId, listId, toPosition) {
  const board = getBoard(boardId);
  if (!board) return;
  board.lists.sort((a, b) => a.position - b.position);
  const idx = board.lists.findIndex(l => l.id === listId);
  if (idx === -1) return;
  const [list] = board.lists.splice(idx, 1);
  const pos = Math.max(0, Math.min(toPosition, board.lists.length));
  board.lists.splice(pos, 0, list);
  board.lists.forEach((l, i) => l.position = i);
  saveState();
}

function updateCard(boardId, cardId, updates) {
  const result = getCard(boardId, cardId);
  if (!result) return;
  Object.assign(result.card, updates);
  saveState();
}

function addComment(boardId, cardId, text) {
  const result = getCard(boardId, cardId);
  if (!result) return;
  result.card.comments.unshift({
    id: generateId(),
    userId: state.currentUser.id,
    text,
    timestamp: Date.now()
  });
  saveState();
  addNotification('comment', boardId, result.card.id, result.card.title, 'commented on');
}

function deleteComment(boardId, cardId, commentId) {
  const result = getCard(boardId, cardId);
  if (!result) return;
  result.card.comments = result.card.comments.filter(c => c.id !== commentId);
  saveState();
}

function updateComment(boardId, cardId, commentId, text) {
  const result = getCard(boardId, cardId);
  if (!result) return;
  const comment = (result.card.comments || []).find(c => c.id === commentId);
  if (!comment || comment.text === text) return;
  comment.text = text;
  comment.editedAt = Date.now();
  saveState();
}

function addChecklist(boardId, cardId, title) {
  const result = getCard(boardId, cardId);
  if (!result) return;
  result.card.checklists.push({ id: generateId(), title, items: [] });
  saveState();
}

function deleteChecklist(boardId, cardId, checklistId) {
  const result = getCard(boardId, cardId);
  if (!result) return;
  result.card.checklists = result.card.checklists.filter(c => c.id !== checklistId);
  saveState();
}

function addChecklistItem(boardId, cardId, checklistId, text) {
  const result = getCard(boardId, cardId);
  if (!result) return;
  const cl = result.card.checklists.find(c => c.id === checklistId);
  if (cl) { cl.items.push({ id: generateId(), text, checked: false }); saveState(); }
}

function toggleChecklistItem(boardId, cardId, checklistId, itemId) {
  const result = getCard(boardId, cardId);
  if (!result) return;
  const cl = result.card.checklists.find(c => c.id === checklistId);
  if (cl) {
    const item = cl.items.find(i => i.id === itemId);
    if (item) { item.checked = !item.checked; saveState(); }
  }
}

function deleteChecklistItem(boardId, cardId, checklistId, itemId) {
  const result = getCard(boardId, cardId);
  if (!result) return;
  const cl = result.card.checklists.find(c => c.id === checklistId);
  if (cl) { cl.items = cl.items.filter(i => i.id !== itemId); saveState(); }
}

function toggleCardLabel(boardId, cardId, labelId) {
  const result = getCard(boardId, cardId);
  if (!result) return;
  const idx = result.card.labels.indexOf(labelId);
  if (idx === -1) result.card.labels.push(labelId);
  else result.card.labels.splice(idx, 1);
  saveState();
}

function toggleCardMember(boardId, cardId, userId) {
  const result = getCard(boardId, cardId);
  if (!result) return;
  const idx = result.card.members.indexOf(userId);
  if (idx === -1) result.card.members.push(userId);
  else result.card.members.splice(idx, 1);
  saveState();
  addNotification('assign', boardId, cardId, result.card.title,
    idx === -1 ? 'assigned a member to' : 'removed a member from');
}

// ===== PROJECT OPERATIONS =====
function createProject(name) {
  const usedColors = state.projects.map(p => p.color);
  const available = AVATAR_COLORS.filter(c => !usedColors.includes(c));
  const color = available.length ? available[0] : AVATAR_COLORS[state.projects.length % AVATAR_COLORS.length];
  const project = { id: generateId(), name, color };
  state.projects.push(project);
  saveState();
  showToast('Project created', 'success');
  return project;
}

function renameProject(projectId, name) {
  const project = state.projects.find(p => p.id === projectId);
  if (project) { project.name = name; saveState(); }
}

function deleteProject(projectId) {
  state.projects = state.projects.filter(p => p.id !== projectId);
  state.boards.forEach(b => { if (b.projectId === projectId) b.projectId = null; });
  state.collapsedProjects = state.collapsedProjects.filter(id => id !== projectId);
  saveState();
  showToast('Project deleted', 'info');
}

function setBoardProject(boardId, projectId) {
  const board = getBoard(boardId);
  if (board) { board.projectId = projectId; saveState(); }
}

function toggleProjectCollapsed(projectId) {
  const idx = state.collapsedProjects.indexOf(projectId);
  if (idx === -1) state.collapsedProjects.push(projectId);
  else state.collapsedProjects.splice(idx, 1);
  saveState();
  render();
}

// ===== NOTIFICATIONS =====
// User-side notifications default to read:true — the bell's unread badge is meant
// to surface things the user DIDN'T do (i.e. agent activity), not their own clicks.
// `cardId` enables click-to-open; `suffix` lets a move read "moved <card> to <list>".
function addNotification(type, boardId, cardId, cardTitle, text, suffix = '', read = true) {
  state.notifications.unshift({
    id: generateId(), type, userId: state.currentUser.id,
    boardId, cardId, cardTitle, text, suffix,
    timestamp: Date.now(), read
  });
  if (state.notifications.length > 50) state.notifications = state.notifications.slice(0, 50);
  saveState();
}

function markAllNotifsRead() {
  state.notifications.forEach(n => n.read = true);
  saveState();
}

// action (optional): { label, onClick } renders a button (e.g. Undo) in the toast.
function showToast(message, type = 'info', action = null) {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = 'toast';
  const iconMap = { success: ICONS.check, error: ICONS.close, info: ICONS.bell };
  let html = `<span class="toast-icon ${type}">${iconMap[type] || iconMap.info}</span><span>${escapeHtml(message)}</span>`;
  if (action) html += `<button class="toast-undo" onclick="${action.onClick}">${escapeHtml(action.label)}</button>`;
  toast.innerHTML = html;
  container.appendChild(toast);
  // Give an actionable toast longer to live so there's time to click Undo.
  setTimeout(() => { toast.classList.add('leaving'); setTimeout(() => toast.remove(), 300); }, action ? 6000 : 3000);
  return toast;
}

// ===== RENDERING =====
function render() {
  renderSidebar();
  renderTopbar();
  if (state.view === 'dashboard') renderDashboard();
  else if (state.view === 'board') renderBoard();
}

function renderSidebar() {
  const nav = document.getElementById('sidebar-nav');
  const footer = document.getElementById('sidebar-footer');
  const starred = state.boards.filter(b => b.starred);

  let html = '';

  // Starred section
  if (starred.length) {
    html += `<div class="sidebar-section-title">Starred</div>`;
    starred.forEach(b => { html += sidebarBoardItem(b); });
  }

  // Uncategorised first, project folders below it: the folders are where
  // finished or parked boards get filed away (collapsed), so they sit out of
  // the way. Every section with data-drop-project is a drop target for a board
  // dragged from anywhere in the sidebar ('' = take it out of its project).
  const uncategorised = state.boards.filter(b => !sidebarProjectOf(b));
  const hasProjects = state.projects.length > 0;
  const sectionGap = starred.length ? 'margin-top:12px' : '';
  html += `<div class="sidebar-drop-zone" data-drop-project="">`;
  if (uncategorised.length || hasProjects) {
    html += `<div class="sidebar-section-title" style="${sectionGap}">Uncategorised</div>`;
  }
  uncategorised.forEach(b => { html += sidebarBoardItem(b); });
  if (!uncategorised.length && hasProjects) {
    html += `<div class="sidebar-drop-empty">Drag boards here from a project</div>`;
  }
  html += `<div class="sidebar-add-board" onclick="promptCreateBoard()">${ICONS.plus} <span>Create new board</span></div>`;
  html += `</div>`;

  // Projects header with + button
  html += `<div class="sidebar-section-title sidebar-projects-title">
    <span>Projects</span>
    <button class="sidebar-section-action" onclick="event.stopPropagation();promptCreateProject()" title="Create project">${ICONS.plus}</button>
  </div>`;

  // One folder per project; collapsed ones show just their header, and still
  // take drops, so a board can be filed straight into a folder that stays shut.
  state.projects.forEach(project => {
    const projectBoards = state.boards.filter(b => b.projectId === project.id);
    const isCollapsed = state.collapsedProjects.includes(project.id);
    html += `<div class="sidebar-drop-zone" data-drop-project="${project.id}">`;
    html += `<div class="sidebar-project-header ${isCollapsed ? 'collapsed' : ''}" onclick="toggleProjectCollapsed('${project.id}')">
      <span class="project-color-dot" style="background:${project.color}"></span>
      <span class="chevron-icon">${ICONS.chevron}</span>
      <span class="truncate project-name">${escapeHtml(project.name)}</span>
      <span class="project-board-count">${projectBoards.length}</span>
      <button class="project-menu-btn" onclick="event.stopPropagation();showProjectMenu(this,'${project.id}')" title="Project options">${ICONS.more}</button>
    </div>`;
    if (!isCollapsed) {
      projectBoards.forEach(b => { html += sidebarBoardItem(b); });
    }
    html += `</div>`;
  });

  nav.innerHTML = html;

  footer.innerHTML = '';
}

function promptCreateProject() {
  const name = prompt('Project name:');
  if (!name || !name.trim()) return;
  createProject(name.trim());
  render();
}

function showProjectMenu(btn, projectId) {
  const project = state.projects.find(p => p.id === projectId);
  if (!project) return;
  const html = `
    <div class="dropdown-header">Project: ${escapeHtml(project.name)}</div>
    <div class="dropdown-item" onclick="closeDropdown();promptRenameProject('${projectId}')">${ICONS.edit} Rename</div>
    <div class="dropdown-divider"></div>
    <div class="dropdown-item danger" onclick="closeDropdown();if(confirm('Delete this project? Boards will become uncategorised.')){deleteProject('${projectId}');render()}">${ICONS.trash} Delete project</div>`;
  showDropdown(btn, html);
}

function promptRenameProject(projectId) {
  const project = state.projects.find(p => p.id === projectId);
  if (!project) return;
  const name = prompt('Rename project:', project.name);
  if (!name || !name.trim()) return;
  renameProject(projectId, name.trim());
  render();
}

// The project a board is filed in, or null. A board pointing at a project that
// no longer exists counts as uncategorised, so it can't vanish from the sidebar.
function sidebarProjectOf(board) {
  return board.projectId ? state.projects.find(p => p.id === board.projectId) || null : null;
}

function sidebarBoardItem(board) {
  const active = state.currentBoardId === board.id && state.view === 'board' ? 'active' : '';
  const bg = getBgGradient(board.background);
  // Draggable onto a project folder (see SIDEBAR BOARD DRAG) once one exists.
  const drag = state.projects.length
    ? ` draggable="true" ondragstart="onSidebarBoardDragStart(event,'${board.id}')" ondragend="onSidebarBoardDragEnd()"`
    : '';
  return `<div class="sidebar-item ${active}" data-board-id="${board.id}"${drag} onclick="openBoard('${board.id}')">
    <span class="board-dot" style="background:${bg}"></span>
    <span class="truncate">${escapeHtml(board.title)}</span>
    <button class="star-btn ${board.starred ? 'starred' : ''}" onclick="event.stopPropagation();toggleBoardStar('${board.id}');render()">
      ${board.starred ? ICONS.starFill : ICONS.star}
    </button>
  </div>`;
}

function renderTopbar() {
  const topbar = document.getElementById('topbar');
  if (state.view === 'dashboard') {
    const unread = state.notifications.filter(n => !n.read).length;
    topbar.innerHTML = `
      <button class="topbar-open-sidebar" onclick="toggleSidebar()">${ICONS.menu}</button>
      <div class="topbar-left">
        <span class="topbar-board-title" style="cursor:default">Dashboard</span>
      </div>
      <div class="topbar-right">
        <button class="topbar-icon-btn" onclick="toggleNotifPanel()" title="Notifications">
          ${ICONS.bell}${unread ? `<span class="notif-badge">${unread > 9 ? '9+' : unread}</span>` : ''}
        </button>
      </div>`;
  } else {
    const board = getCurrentBoard();
    if (!board) return;
    const unread = state.notifications.filter(n => !n.read).length;
    const membersHtml = board.members.slice(0, 4).map(uid => {
      const u = getUser(uid);
      return u ? avatarHtml(u, 'sm') : '';
    }).join('');
    topbar.innerHTML = `
      <button class="topbar-open-sidebar" onclick="toggleSidebar()">${ICONS.menu}</button>
      <div class="topbar-left">
        <div class="topbar-back" onclick="goToDashboard()">${ICONS.back} Boards</div>
        <div class="topbar-divider"></div>
        <span class="topbar-board-title" onclick="startEditBoardTitle()" id="board-title-display">${escapeHtml(board.title)}</span>
        <button class="topbar-star ${board.starred ? 'starred' : ''}" onclick="toggleBoardStar('${board.id}');render()">
          ${board.starred ? ICONS.starFill : ICONS.star}
        </button>
        <div class="topbar-divider"></div>
        <div class="topbar-members">${membersHtml}</div>
      </div>
      <div class="topbar-right">
        <button class="topbar-btn" onclick="toggleFilterDropdown(this)">${ICONS.filter} Filter</button>
        <button class="topbar-icon-btn" onclick="toggleNotifPanel()" title="Notifications">
          ${ICONS.bell}${unread ? `<span class="notif-badge">${unread > 9 ? '9+' : unread}</span>` : ''}
        </button>
        <button class="topbar-icon-btn" onclick="showBoardMenu(this)" title="Board menu">
          ${ICONS.more}
        </button>
      </div>`;
  }
}

function renderDashboard() {
  const container = document.getElementById('view-container');
  const starred = state.boards.filter(b => b.starred);

  let html = '<div class="dashboard">';
  html += `<h1 class="dashboard-title">Welcome back, ${escapeHtml(state.currentUser.name.split(' ')[0])}</h1>`;
  html += `<p class="dashboard-subtitle">Here are your project boards</p>`;

  // Starred section
  if (starred.length) {
    html += `<div class="section-title">${ICONS.starFill} Starred Boards</div>`;
    html += '<div class="boards-grid">';
    starred.forEach(b => { html += boardCardHtml(b); });
    html += '</div>';
  }

  // Per-project sections
  state.projects.forEach(project => {
    const projectBoards = state.boards.filter(b => b.projectId === project.id);
    if (!projectBoards.length) return;
    html += `<div class="dashboard-project-section">`;
    html += `<div class="section-title"><span class="project-color-dot" style="background:${project.color}"></span> ${escapeHtml(project.name)}</div>`;
    html += '<div class="boards-grid">';
    projectBoards.forEach(b => { html += boardCardHtml(b); });
    html += `<div class="board-card-new" onclick="promptCreateBoard('${project.id}')">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>
      Create new board
    </div>`;
    html += '</div></div>';
  });

  // Uncategorised section
  const uncategorised = state.boards.filter(b => !b.projectId);
  if (uncategorised.length) {
    html += `<div class="dashboard-project-section">`;
    html += `<div class="section-title">${ICONS.board} Uncategorised</div>`;
    html += '<div class="boards-grid">';
    uncategorised.forEach(b => { html += boardCardHtml(b); });
    html += `<div class="board-card-new" onclick="promptCreateBoard()">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>
      Create new board
    </div>`;
    html += '</div></div>';
  }

  // If no boards at all, show create button
  if (!state.boards.length) {
    html += '<div class="boards-grid">';
    html += `<div class="board-card-new" onclick="promptCreateBoard()">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>
      Create new board
    </div>`;
    html += '</div>';
  }

  html += '</div>';
  container.innerHTML = html;
}

function boardCardHtml(board) {
  const bg = getBgGradient(board.background);
  const listCount = board.lists.length;
  const cardCount = board.lists.reduce((sum, l) => sum + l.cards.length, 0);
  return `<div class="board-card" style="background:${bg}" onclick="openBoard('${board.id}')">
    <button class="board-card-star ${board.starred ? 'starred' : ''}" onclick="event.stopPropagation();toggleBoardStar('${board.id}');render()">
      ${board.starred ? ICONS.starFill : ICONS.star}
    </button>
    <div class="board-card-title">${escapeHtml(board.title)}</div>
    <div class="board-card-meta">${listCount} lists &middot; ${cardCount} cards</div>
  </div>`;
}

let lastRenderedBoardId = null;

function renderBoard() {
  const board = getCurrentBoard();
  if (!board) return;
  const container = document.getElementById('view-container');
  const bg = getBgGradient(board.background);

  // Preserve horizontal scroll across re-renders of the same board so that
  // reordering/editing a card doesn't jump the view back to the far left.
  // Switching to a different board (or reopening one) starts at the left.
  const prevWrapper = document.getElementById('lists-wrapper');
  const sameBoard = prevWrapper && lastRenderedBoardId === board.id;
  const keepScroll = sameBoard ? prevWrapper.scrollLeft : 0;
  // Each list scrolls vertically on its own; keep those too, or closing a card
  // opened far down a long list snaps that list back to the top.
  const keepListScroll = {};
  if (sameBoard) {
    prevWrapper.querySelectorAll('.list-cards').forEach(el => {
      if (el.scrollTop) keepListScroll[el.dataset.listId] = el.scrollTop;
    });
  }

  let filtersHtml = '';
  if (state.activeFilters.labels.length || state.activeFilters.members.length) {
    filtersHtml = '<div class="filter-bar">';
    state.activeFilters.labels.forEach(lid => {
      const lbl = getLabelDef(lid);
      if (lbl) filtersHtml += `<span class="filter-chip active" style="background:${lbl.bg};color:${lbl.color}">${lbl.name} <span class="remove-filter" onclick="removeFilter('label','${lid}')">&times;</span></span>`;
    });
    state.activeFilters.members.forEach(uid => {
      const u = getUser(uid);
      if (u) filtersHtml += `<span class="filter-chip active">${u.name} <span class="remove-filter" onclick="removeFilter('member','${uid}')">&times;</span></span>`;
    });
    filtersHtml += `<button class="btn btn-ghost btn-sm" onclick="clearFilters()">Clear all</button>`;
    filtersHtml += '</div>';
  }

  let listsHtml = '';
  board.lists.sort((a, b) => a.position - b.position).forEach(list => {
    listsHtml += renderListHtml(board.id, list);
  });

  container.innerHTML = `
    <div class="board-view">
      <div class="board-view-bg" style="background:${bg}"></div>
      ${filtersHtml}
      <div class="lists-wrapper" id="lists-wrapper">
        ${listsHtml}
        <div class="add-list" id="add-list-wrapper">
          <button class="add-list-btn" onclick="showAddListForm()" id="add-list-btn">${ICONS.plus} Add another list</button>
        </div>
      </div>
    </div>`;

  if (keepScroll) {
    const w = document.getElementById('lists-wrapper');
    if (w) {
      // Restore instantly (override the CSS smooth-scroll so it doesn't animate).
      w.style.scrollBehavior = 'auto';
      w.scrollLeft = keepScroll;
      w.style.scrollBehavior = '';
    }
  }
  for (const [listId, top] of Object.entries(keepListScroll)) {
    const el = document.getElementById(`cards-${listId}`);
    if (el) el.scrollTop = top;
  }
  lastRenderedBoardId = board.id;
}

function renderListHtml(boardId, list) {
  const cards = filterCardsForDisplay(list.cards);
  let cardsHtml = '';
  cards.forEach(card => { cardsHtml += renderCardHtml(boardId, card); });

  return `<div class="list" data-list-id="${list.id}" id="list-${list.id}">
    <div class="list-header">
      <span class="list-drag-handle" draggable="true" title="Drag to reorder list" ondragstart="onListDragStart(event,'${list.id}')" ondragend="onListDragEnd(event)">${ICONS.grip}</span>
      <span class="list-title" id="list-title-${list.id}" onclick="startEditListTitle('${boardId}','${list.id}')">${escapeHtml(list.title)}</span>
      <span class="list-count">${list.cards.length}</span>
      <button class="list-menu-btn" onclick="showListMenu(this,'${boardId}','${list.id}')">${ICONS.more}</button>
    </div>
    <div class="list-cards" data-list-id="${list.id}" id="cards-${list.id}">
      ${cardsHtml}
    </div>
    <div class="list-footer">
      <button class="add-card-btn" onclick="showAddCardForm('${list.id}')" id="add-card-btn-${list.id}">
        ${ICONS.plus} Add a card
      </button>
    </div>
  </div>`;
}

function renderCardHtml(boardId, card) {
  const labelsHtml = card.labels.map(lid => {
    const lbl = getLabelDef(lid);
    if (!lbl) return '';
    if (state.expandedLabels) return `<span class="card-label expanded" style="background:${lbl.bg};color:${lbl.color}">${lbl.name}</span>`;
    return `<span class="card-label" style="background:${lbl.color}"></span>`;
  }).join('');

  let badges = [];
  if (card.dueDate) {
    const status = dueDateStatus(card.dueDate, card.dueDone);
    badges.push(`<span class="card-badge ${status}">${ICONS.calendar} ${formatDate(card.dueDate)}</span>`);
  }
  if (card.description) badges.push(`<span class="card-badge">${ICONS.desc}</span>`);
  if (card.comments.length) badges.push(`<span class="card-badge">${ICONS.comment} ${card.comments.length}</span>`);
  if (card.attachments.length) badges.push(`<span class="card-badge">${ICONS.attach} ${card.attachments.length}</span>`);
  card.checklists.forEach(cl => {
    const done = cl.items.filter(i => i.checked).length;
    const total = cl.items.length;
    if (total) badges.push(`<span class="card-badge ${done === total ? 'complete' : ''}">${ICONS.checkSquare} ${done}/${total}</span>`);
  });

  // Who made the card leads the badge row: the owner's photo (or initials) for
  // their own cards, a 🤖
  // for an agent's (Claude or Codex).
  const creator = cardCreator(card);
  const createdTitle = `Created by ${escapeHtml(creator.name)}${card.createdAt ? ', ' + formatDateTimeFull(card.createdAt) : ''}`;
  badges.unshift(creator.id === CURRENT_USER.id
    ? `<span class="card-badge creator" title="${createdTitle}">${OWNER_AVATAR
        ? `<img src="${escapeHtml(OWNER_AVATAR)}" alt="">`
        : `<span class="creator-initials" style="background:${CURRENT_USER.color}">${getInitials(CURRENT_USER.name)}</span>`}</span>`
    : `<span class="card-badge bot" title="${createdTitle}">🤖</span>`);
  if (card.createdAt) {
    badges.push(`<span class="card-badge created" title="${createdTitle}">${ICONS.clock} ${cardAge(card.createdAt)}</span>`);
  }

  const membersHtml = card.members.slice(0, 3).map(uid => {
    const u = getUser(uid);
    return u ? avatarHtml(u, 'sm') : '';
  }).join('');

  return `<div class="card" data-card-id="${card.id}" draggable="true"
    ondragstart="onDragStart(event)" ondragend="onDragEnd(event)"
    onclick="openCardModal('${boardId}','${card.id}')">
    <button class="card-delete-btn" title="Delete card" onclick="event.stopPropagation();deleteCard('${boardId}','${card.id}');renderBoard()">${ICONS.trash}</button>
    ${labelsHtml ? `<div class="card-labels" onclick="event.stopPropagation();state.expandedLabels=!state.expandedLabels;renderBoard()">${labelsHtml}</div>` : ''}
    <div class="card-title">${escapeHtml(card.title)}</div>
    ${badges.length || card.members.length ? `<div class="card-badges">
      ${badges.join('')}
      ${membersHtml ? `<div class="card-members">${membersHtml}</div>` : ''}
    </div>` : ''}
  </div>`;
}

function filterCardsForDisplay(cards) {
  const f = state.activeFilters;
  if (!f.labels.length && !f.members.length) return cards;
  return cards.filter(c => {
    if (f.labels.length && !f.labels.some(l => c.labels.includes(l))) return false;
    if (f.members.length && !f.members.some(m => c.members.includes(m))) return false;
    return true;
  });
}

// ===== CARD MODAL =====
let currentModalCard = null;
let editingCommentId = null;
let commentDraft = { cardId: null, text: '' }; // unsent comment, kept across re-renders

// Find a card by id across all boards. Deep links carry only the card id (the
// agent API resolves a card the same way server-side), so the boardId is looked
// up here. Returns {boardId, listId} or null.
function findCardLocal(cardId) {
  for (const b of state.boards || []) {
    for (const l of b.lists || []) {
      if ((l.cards || []).some(c => c.id === cardId)) return { boardId: b.id, listId: l.id };
    }
  }
  return null;
}

// Copy a shareable deep link to this card. Pasting it to Claude lets it act on
// the exact card (it pulls the id and hits /cards/<id>) with no board/list/title
// guessing; visiting it in a browser opens the card (see ?card handling in init).
function copyCardLink(cardId) {
  const url = `${location.origin}/?card=${cardId}`;
  navigator.clipboard.writeText(url)
    .then(() => showToast('Card link copied', 'success'))
    .catch(() => showToast('Could not copy link', 'error'));
}

function openCardModal(boardId, cardId) {
  const result = getCard(boardId, cardId);
  if (!result) return;
  currentModalCard = { boardId, cardId };
  editingCommentId = null;
  renderCardModal();
  document.getElementById('modal-overlay').classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('modal-overlay').classList.add('hidden');
  document.body.style.overflow = '';
  currentModalCard = null;
  editingCommentId = null;
  closeDropdown();
  if (state.view === 'board') renderBoard();
}

function renderCardModal() {
  if (!currentModalCard) return;
  const { boardId, cardId } = currentModalCard;
  const result = getCard(boardId, cardId);
  if (!result) return;
  const { card, list } = result;
  const body = document.getElementById('modal-body');

  const labelsHtml = card.labels.map(lid => {
    const lbl = getLabelDef(lid);
    return lbl ? `<span class="modal-label" style="background:${lbl.bg};color:${lbl.color}">${lbl.name}</span>` : '';
  }).join('');

  const membersHtml = card.members.map(uid => {
    const u = getUser(uid);
    return u ? `<div class="modal-member">${avatarHtml(u, 'sm')} <span>${escapeHtml(u.name)}</span></div>` : '';
  }).join('');

  let dueDateHtml = '';
  if (card.dueDate) {
    const status = dueDateStatus(card.dueDate, card.dueDone);
    const statusText = status === 'overdue' ? ' (overdue)' : status === 'due-soon' ? ' (due soon)' : status === 'complete' ? ' (complete)' : '';
    dueDateHtml = `<div class="modal-section">
      <div class="modal-section-title">${ICONS.calendar} Due Date</div>
      <div class="modal-due ${status}">
        <input type="checkbox" ${card.dueDone ? 'checked' : ''} onchange="updateCard('${boardId}','${cardId}',{dueDone:this.checked});renderCardModal()">
        <span class="due-date-text" onclick="showDatePicker(this,'${boardId}','${cardId}')">${formatDateFull(card.dueDate)}${statusText}</span>
        <button class="btn btn-ghost btn-sm" onclick="updateCard('${boardId}','${cardId}',{dueDate:null,dueDone:false});renderCardModal()" title="Remove">&times;</button>
      </div>
    </div>`;
  }

  const descDisplay = card.description
    ? `<div class="modal-description-display rich-text" onclick="startEditDescription(this,'${boardId}','${cardId}')">${renderRichText(card.description)}</div>`
    : `<div class="modal-description-display placeholder" onclick="startEditDescription(this,'${boardId}','${cardId}')">Add a more detailed description...</div>`;

  let checklistsHtml = '';
  card.checklists.forEach(cl => {
    const done = cl.items.filter(i => i.checked).length;
    const total = cl.items.length;
    const pct = total ? Math.round((done / total) * 100) : 0;
    let itemsHtml = cl.items.map(item => `
      <div class="checklist-item ${item.checked ? 'checked' : ''}">
        <input type="checkbox" ${item.checked ? 'checked' : ''} onchange="toggleChecklistItem('${boardId}','${cardId}','${cl.id}','${item.id}');renderCardModal()">
        <span class="checklist-item-text">${escapeHtml(item.text)}</span>
        <button class="delete-item btn btn-ghost btn-sm" onclick="deleteChecklistItem('${boardId}','${cardId}','${cl.id}','${item.id}');renderCardModal()">&times;</button>
      </div>`).join('');
    checklistsHtml += `
      <div class="checklist">
        <div class="checklist-header">
          <span class="checklist-title">${ICONS.checkSquare} ${escapeHtml(cl.title)}</span>
          <span style="font-size:11px;color:var(--text-muted)">${pct}%</span>
          <button class="btn btn-ghost btn-sm" style="margin-left:auto" onclick="deleteChecklist('${boardId}','${cardId}','${cl.id}');renderCardModal()">Delete</button>
        </div>
        <div class="checklist-progress"><div class="checklist-progress-bar ${pct === 100 ? 'complete' : ''}" style="width:${pct}%"></div></div>
        <div class="checklist-items">${itemsHtml}</div>
        <div class="checklist-add-item">
          <input type="text" placeholder="Add an item..." onkeydown="if(event.key==='Enter'&&this.value.trim()){addChecklistItem('${boardId}','${cardId}','${cl.id}',this.value.trim());renderCardModal()}">
        </div>
      </div>`;
  });

  let commentsHtml = '';
  // The draft survives re-renders (an upload landing, a live update), which
  // rebuild this whole modal — before, any re-render wiped a half-typed comment.
  const draft = commentDraft.cardId === cardId ? commentDraft.text : '';
  commentsHtml += `<div class="comment-input-wrapper">
    ${avatarHtml(state.currentUser)}
    <textarea id="comment-input" placeholder="Write a comment... (drop or paste images and files here)" rows="${draft ? 3 : 1}" oninput="commentDraft={cardId:'${cardId}',text:this.value}">${escapeHtml(draft)}</textarea>
    <button class="btn btn-primary btn-sm" onclick="submitComment('${boardId}','${cardId}')">Save</button>
  </div>`;
  // Newest first. The browser prepends new comments but the agent API appends
  // them, so sort rather than trust array order.
  [...card.comments].sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0)).forEach(c => {
    const user = getUser(c.userId) || state.currentUser;
    const meta = `<div class="comment-meta">
          <span class="comment-author">${escapeHtml(user.name)}</span>
          <span class="comment-time" title="${c.timestamp ? formatDateTimeFull(c.timestamp) : ''}">${c.timestamp ? `${formatDateTime(c.timestamp)} &middot; ${timeAgo(c.timestamp)}` : ''}</span>
          ${c.editedAt ? `<span class="comment-time" title="Edited ${formatDateTimeFull(c.editedAt)}">(edited)</span>` : ''}
        </div>`;
    // Anyone can edit or delete any comment — agents leave comments here too,
    // and their author "user" never comes back to clean up after itself.
    const body = c.id === editingCommentId
      ? `<div class="comment-edit">
          <textarea id="comment-edit" onkeydown="if(event.key==='Escape')cancelEditComment()">${escapeHtml(c.text)}</textarea>
          <div style="display:flex;gap:6px;margin-top:6px">
            <button class="btn btn-primary btn-sm" onclick="saveEditedComment('${boardId}','${cardId}','${c.id}')">Save</button>
            <button class="btn btn-ghost btn-sm" onclick="cancelEditComment()">Cancel</button>
          </div>
        </div>`
      : `<div class="comment-text rich-text">${renderRichText(c.text)}</div>
        <div class="comment-actions">
          <button onclick="startEditComment('${boardId}','${cardId}','${c.id}')">Edit</button>
          <button onclick="deleteComment('${boardId}','${cardId}','${c.id}');renderCardModal()">Delete</button>
        </div>`;
    commentsHtml += `<div class="comment" style="margin-top:14px">
      ${avatarHtml(user)}
      <div class="comment-body">
        ${meta}
        ${body}
      </div>
    </div>`;
  });

  body.innerHTML = `
    <div class="modal-card-header">
      <div class="modal-card-title" id="modal-card-title" onclick="startEditCardTitle(this,'${boardId}','${cardId}')">${escapeHtml(card.title)}</div>
      <div class="modal-card-subtitle">in list <strong>${escapeHtml(list.title)}</strong>${card.createdAt ? ` &middot; created ${formatDateTimeFull(card.createdAt)}` : ''} by <strong>${escapeHtml(cardCreator(card).name)}</strong></div>
    </div>
    <div class="modal-layout">
      <div class="modal-main">
        ${labelsHtml ? `<div class="modal-section"><div class="modal-section-title">${ICONS.tag} Labels</div><div class="modal-labels">${labelsHtml}</div></div>` : ''}
        ${membersHtml ? `<div class="modal-section"><div class="modal-section-title">${ICONS.users} Members</div><div class="modal-members">${membersHtml}</div></div>` : ''}
        ${dueDateHtml}
        <div class="modal-section">
          <div class="modal-section-title">${ICONS.desc} Description</div>
          <div class="modal-description">${descDisplay}</div>
        </div>
        ${checklistsHtml ? `<div class="modal-section"><div class="modal-section-title">${ICONS.checkSquare} Checklists</div>${checklistsHtml}</div>` : ''}
        <div id="modal-attachments">${attachmentsSectionHtml(boardId, cardId, card)}</div>
        <div class="modal-section">
          <div class="modal-section-title">${ICONS.comment} Comments</div>
          ${commentsHtml}
        </div>
      </div>
      <div class="modal-sidebar-actions">
        <div class="section-label">Add to card</div>
        <button class="modal-action-btn" onclick="showLabelPicker(this,'${boardId}','${cardId}')">${ICONS.tag} Labels</button>
        <button class="modal-action-btn" onclick="showMemberPicker(this,'${boardId}','${cardId}')">${ICONS.user} Members</button>
        <button class="modal-action-btn" onclick="showDatePicker(this,'${boardId}','${cardId}')">${ICONS.calendar} Due Date</button>
        <button class="modal-action-btn" onclick="promptAddChecklist('${boardId}','${cardId}')">${ICONS.checkSquare} Checklist</button>
        <button class="modal-action-btn" onclick="pickAttachments('${boardId}','${cardId}')" title="Or drop / paste files anywhere on the card">${ICONS.attach} Attachment</button>
        <div class="section-label">Actions</div>
        <button class="modal-action-btn" onclick="showMoveCardPicker(this,'${boardId}','${cardId}')">${ICONS.move} Move</button>
        <button class="modal-action-btn" onclick="copyCard('${boardId}','${cardId}')">${ICONS.copy} Copy</button>
        <button class="modal-action-btn" onclick="copyCardLink('${cardId}')">${ICONS.link} Link</button>
        <button class="modal-action-btn danger" onclick="deleteCard('${boardId}','${cardId}');closeModal()">${ICONS.trash} Delete</button>
      </div>
    </div>`;
}

function submitComment(boardId, cardId) {
  const input = document.getElementById('comment-input');
  if (!input || !input.value.trim()) return;
  addComment(boardId, cardId, input.value.trim());
  commentDraft = { cardId: null, text: '' };
  renderCardModal();
}

function startEditComment(boardId, cardId, commentId) {
  editingCommentId = commentId;
  renderCardModal();
  const ta = document.getElementById('comment-edit');
  if (ta) { ta.focus(); ta.setSelectionRange(ta.value.length, ta.value.length); }
}

function cancelEditComment() {
  editingCommentId = null;
  renderCardModal();
}

function saveEditedComment(boardId, cardId, commentId) {
  const ta = document.getElementById('comment-edit');
  const text = ta ? ta.value.trim() : '';
  editingCommentId = null;
  if (text) updateComment(boardId, cardId, commentId, text);
  renderCardModal();
}

function startEditCardTitle(el, boardId, cardId) {
  // Already editing: the click that landed here bubbled up from the textarea
  // itself (the wrapping div keeps its onclick). Rebuilding now would
  // blur+destroy the focused editor and revert to display mode — so clicking to
  // place the cursor would kick you out of editing. Bail and keep its focus.
  if (el.querySelector('textarea')) return;
  const result = getCard(boardId, cardId);
  if (!result) return;
  // A textarea, not an input: long titles wrap like the display does instead of
  // becoming one horizontally-scrolling line. Enter still commits.
  el.innerHTML = `<textarea rows="1" onblur="finishEditCardTitle(this,'${boardId}','${cardId}')" oninput="this.style.height='auto';this.style.height=this.scrollHeight+'px'" onkeydown="if(event.key==='Enter'){event.preventDefault();this.blur()}else if(event.key==='Escape'){this.dataset.cancel='1';this.blur()}">${escapeHtml(result.card.title)}</textarea>`;
  const ta = el.querySelector('textarea');
  ta.style.height = ta.scrollHeight + 'px';
  ta.focus();
  ta.select();
}

function finishEditCardTitle(input, boardId, cardId) {
  if (input.dataset.cancel) return renderCardModal();
  const val = input.value.replace(/\n/g, ' ').trim();
  if (val) updateCard(boardId, cardId, { title: val });
  renderCardModal();
}

function startEditDescription(el, boardId, cardId) {
  const result = getCard(boardId, cardId);
  if (!result) return;
  const section = el.parentElement;
  section.innerHTML = `
    <textarea id="desc-edit" autofocus>${escapeHtml(result.card.description)}</textarea>
    <div style="display:flex;gap:6px;margin-top:8px">
      <button class="btn btn-primary btn-sm" onclick="saveDescription('${boardId}','${cardId}')">Save</button>
      <button class="btn btn-ghost btn-sm" onclick="renderCardModal()">Cancel</button>
    </div>`;
  const ta = section.querySelector('textarea');
  ta.focus();
  ta.setSelectionRange(ta.value.length, ta.value.length);
}

function saveDescription(boardId, cardId) {
  const ta = document.getElementById('desc-edit');
  if (ta) updateCard(boardId, cardId, { description: ta.value });
  renderCardModal();
}

function promptAddChecklist(boardId, cardId) {
  const title = prompt('Checklist title:', 'Checklist');
  if (title && title.trim()) {
    addChecklist(boardId, cardId, title.trim());
    renderCardModal();
  }
}

// ===== ATTACHMENTS =====
// Files upload to /api/trellis/attachments (stored on disk server-side); the card
// keeps only a small reference to each, never the bytes — the trellis blob ships
// to every open board on every write. Files get in three ways: the Attachment
// button, dropping onto the open card (or a card tile on the board), and pasting.
// Dropping/pasting into a comment or description editor instead inserts a
// markdown link (an inline image for pictures) at the cursor.
const ATTACH_MAX_BYTES = 15 * 1024 * 1024; // = nginx client_max_body_size (see README)
const INLINE_IMAGE_TYPES = /^image\/(png|jpe?g|gif|webp|avif|bmp|svg\+xml)$/;
const pendingUploads = []; // { key, cardId, name, loaded, total }

function formatBytes(n) {
  if (typeof n !== 'number') return n || ''; // legacy attachments stored a string
  if (n < 1024) return n + ' B';
  if (n < 1024 * 1024) return Math.round(n / 1024) + ' KB';
  return (n / (1024 * 1024)).toFixed(1) + ' MB';
}

function fileExt(name) {
  const m = /\.([a-z0-9]{1,6})$/i.exec(name || '');
  return m ? m[1].toLowerCase() : 'file';
}

// Clipboard screenshots all arrive as "image.png"; give them a findable name.
function namePastedFile(file) {
  if (!/^image\.\w+$/i.test(file.name || '')) return file;
  const d = new Date();
  const p = n => String(n).padStart(2, '0');
  const stamp = `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}.${p(d.getMinutes())}.${p(d.getSeconds())}`;
  return new File([file], `Screenshot ${stamp}.${fileExt(file.name)}`, { type: file.type });
}

// POST the raw bytes. Always application/octet-stream so the server's global
// JSON parser never swallows a .json upload; the real type rides in a header.
function uploadFile(file, onProgress) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/trellis/attachments');
    xhr.setRequestHeader('Content-Type', 'application/octet-stream');
    xhr.setRequestHeader('X-Filename', encodeURIComponent(file.name || 'file'));
    xhr.setRequestHeader('X-File-Type', file.type || 'application/octet-stream');
    xhr.upload.onprogress = e => { if (e.lengthComputable && onProgress) onProgress(e.loaded, e.total); };
    xhr.onload = () => {
      let body = null;
      try { body = JSON.parse(xhr.responseText); } catch { /* nginx error pages are HTML */ }
      if (xhr.status === 201 && body && body.url) return resolve(body);
      if (xhr.status === 413) return reject(new Error('too large (max 15 MB)'));
      reject(new Error((body && body.error) || `upload failed (${xhr.status})`));
    };
    xhr.onerror = () => reject(new Error('network error'));
    xhr.send(file);
  });
}

function attachmentFromUpload(meta) {
  return {
    id: meta.id, name: meta.name, url: meta.url, mime: meta.mime, size: meta.size,
    type: fileExt(meta.name), userId: state.currentUser.id, timestamp: Date.now()
  };
}

function isInlineImage(a) { return !!(a && a.url && INLINE_IMAGE_TYPES.test(a.mime || '')); }

function rejectOversized(files) {
  const ok = [];
  for (const f of files) {
    if (f.size > ATTACH_MAX_BYTES) showToast(`${f.name} is too large (max 15 MB)`, 'error');
    else if (!f.size) showToast(`${f.name} is empty`, 'error');
    else ok.push(f);
  }
  return ok;
}

function attachmentsSectionHtml(boardId, cardId, card) {
  const pending = pendingUploads.filter(u => u.cardId === cardId);
  const atts = [...(card.attachments || [])].sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
  if (!atts.length && !pending.length) return '';

  const rows = pending.map(u => `
    <div class="attachment uploading">
      <div class="attachment-thumb"><span class="attachment-ext">${escapeHtml(fileExt(u.name))}</span></div>
      <div class="attachment-info">
        <div class="attachment-name truncate">${escapeHtml(u.name)}</div>
        <div class="attachment-progress"><div id="upload-bar-${u.key}" style="width:${u.total ? Math.round(100 * u.loaded / u.total) : 0}%"></div></div>
      </div>
    </div>`).join('') + atts.map(a => {
    const url = a.url ? escapeHtml(a.url) : '';
    const thumb = isInlineImage(a)
      ? `<img src="${url}" alt="" loading="lazy">`
      : `<span class="attachment-ext">${escapeHtml(a.type || fileExt(a.name))}</span>`;
    const open = inner => url ? `<a href="${url}" target="_blank" rel="noopener">${inner}</a>` : inner;
    return `
    <div class="attachment">
      <div class="attachment-thumb">${open(thumb)}</div>
      <div class="attachment-info">
        <div class="attachment-name truncate">${open(escapeHtml(a.name))}</div>
        <div class="attachment-meta">
          <span>${escapeHtml(formatBytes(a.size))}${a.timestamp ? ' &middot; ' + timeAgo(a.timestamp) : ''}</span>
          ${url ? `<a href="${url}" download="${escapeHtml(a.name)}">Download</a>` : ''}
          <button onclick="removeAttachment('${boardId}','${cardId}','${a.id}')">Delete</button>
        </div>
      </div>
    </div>`;
  }).join('');

  return `<div class="modal-section">
    <div class="modal-section-title">${ICONS.attach} Attachments
      <button class="btn btn-ghost btn-sm" style="margin-left:auto" onclick="pickAttachments('${boardId}','${cardId}')">Add</button>
    </div>
    <div class="attachments">${rows}</div>
  </div>`;
}

// Redraw just the attachments block, so an upload finishing never rebuilds the
// modal under a comment or description that's being typed.
function refreshModalAttachments(cardId) {
  if (!currentModalCard || currentModalCard.cardId !== cardId) return;
  const el = document.getElementById('modal-attachments');
  const result = getCard(currentModalCard.boardId, cardId);
  if (el && result) el.innerHTML = attachmentsSectionHtml(currentModalCard.boardId, cardId, result.card);
}

function pickAttachments(boardId, cardId) {
  const input = document.createElement('input');
  input.type = 'file';
  input.multiple = true;
  input.onchange = () => attachFiles(boardId, cardId, [...input.files]);
  input.click();
}

// Upload files and add them to the card's attachment list.
function attachFiles(boardId, cardId, files) {
  files = rejectOversized(files);
  if (!files.length) return;
  for (const file of files) {
    const job = { key: generateId(), cardId, name: file.name, loaded: 0, total: file.size };
    pendingUploads.push(job);
    const tile = document.querySelector(`.card[data-card-id="${cardId}"]`);
    if (tile) tile.classList.add('uploading');
    uploadFile(file, (loaded, total) => {
      job.loaded = loaded; job.total = total;
      const bar = document.getElementById('upload-bar-' + job.key);
      if (bar) bar.style.width = Math.round(100 * loaded / total) + '%';
    }).then(meta => {
      const result = getCard(boardId, cardId);
      if (!result) { showToast(`Card is gone; ${file.name} not attached`, 'error'); return; }
      result.card.attachments = result.card.attachments || [];
      result.card.attachments.push(attachmentFromUpload(meta));
      saveState();
      if (!currentModalCard || currentModalCard.cardId !== cardId) {
        showToast(`Attached ${meta.name} to "${result.card.title}"`, 'success');
      }
    }).catch(err => {
      showToast(`${file.name}: ${err.message}`, 'error');
    }).finally(() => {
      pendingUploads.splice(pendingUploads.indexOf(job), 1);
      refreshModalAttachments(cardId);
      // Board tile badge count (and drop the uploading pulse) once its last
      // upload settles — but never re-render mid-drag or under a half-typed
      // new card; the next render picks the count up instead.
      const ae = document.activeElement;
      const typing = ae && !document.getElementById('modal-dialog').contains(ae)
        && (ae.isContentEditable || ae.tagName === 'INPUT' || ae.tagName === 'TEXTAREA');
      if (!pendingUploads.some(u => u.cardId === cardId) && state.view === 'board' && !typing
          && !(typeof dragActive === 'function' && dragActive())) renderBoard();
    });
  }
  refreshModalAttachments(cardId);
}

let _lastRemovedAttachment = null; // { boardId, cardId, index, attachment } — one-step undo

function removeAttachment(boardId, cardId, attachmentId) {
  const result = getCard(boardId, cardId);
  if (!result) return;
  const index = result.card.attachments.findIndex(a => a.id === attachmentId);
  if (index === -1) return;
  // Only the reference goes; the file stays on disk, so Undo, card copies and
  // comments that link it keep working.
  const [attachment] = result.card.attachments.splice(index, 1);
  _lastRemovedAttachment = { boardId, cardId, index, attachment };
  saveState();
  refreshModalAttachments(cardId);
  showToast('Attachment deleted', 'info', { label: 'Undo', onClick: 'undoRemoveAttachment()' });
}

function undoRemoveAttachment() {
  if (!_lastRemovedAttachment) return;
  const { boardId, cardId, index, attachment } = _lastRemovedAttachment;
  _lastRemovedAttachment = null;
  const result = getCard(boardId, cardId);
  if (!result) return;
  result.card.attachments.splice(Math.min(index, result.card.attachments.length), 0, attachment);
  saveState();
  refreshModalAttachments(cardId);
}

// ----- Into a comment / description: markdown at the cursor -----
function markdownForUpload(meta) {
  const label = meta.name.replace(/[\[\]]/g, '');
  return INLINE_IMAGE_TYPES.test(meta.mime) ? `![${label}](${meta.url})` : `[${label}](${meta.url})`;
}

function insertIntoTextarea(ta, text) {
  const start = ta.selectionStart ?? ta.value.length;
  const end = ta.selectionEnd ?? start;
  const before = ta.value.slice(0, start);
  const after = ta.value.slice(end);
  const pre = before && !before.endsWith('\n') ? '\n' : '';
  const post = after.startsWith('\n') ? '' : '\n';
  ta.value = before + pre + text + post + after;
  const caret = (before + pre + text + post).length;
  ta.setSelectionRange(caret, caret);
  ta.dispatchEvent(new Event('input')); // keeps commentDraft in step
  if (ta.rows < 3) ta.rows = 3;
}

// Swap an upload's placeholder for its final text wherever it now lives: still
// in an editor, in the stashed comment draft, or already saved into a comment
// or the description (sent before the upload finished).
function replaceUploadPlaceholder(boardId, cardId, placeholder, text) {
  for (const id of ['comment-input', 'comment-edit', 'desc-edit']) {
    const ta = document.getElementById(id);
    if (ta && ta.value.includes(placeholder)) {
      ta.value = ta.value.replace(placeholder, text);
      if (id === 'comment-input') ta.dispatchEvent(new Event('input'));
      return;
    }
  }
  if (commentDraft.cardId === cardId && commentDraft.text.includes(placeholder)) {
    commentDraft.text = commentDraft.text.replace(placeholder, text);
    return;
  }
  const result = getCard(boardId, cardId);
  if (!result) return;
  const c = result.card.comments.find(c => (c.text || '').includes(placeholder));
  if (c) c.text = c.text.replace(placeholder, text);
  else if ((result.card.description || '').includes(placeholder)) result.card.description = result.card.description.replace(placeholder, text);
  else return; // the placeholder was deleted by hand: leave the text alone
  saveState();
  if (currentModalCard && currentModalCard.cardId === cardId && !liveUpdatesBusy()) renderCardModal();
}

function insertFilesIntoText(ta, boardId, cardId, files) {
  files = rejectOversized(files);
  for (const file of files) {
    const placeholder = `![Uploading ${file.name.replace(/[\[\]]/g, '')}…]()`;
    insertIntoTextarea(ta, placeholder);
    uploadFile(file)
      .then(meta => replaceUploadPlaceholder(boardId, cardId, placeholder, markdownForUpload(meta)))
      .catch(err => {
        showToast(`${file.name}: ${err.message}`, 'error');
        replaceUploadPlaceholder(boardId, cardId, placeholder, '');
      });
  }
  ta.focus();
}

// ----- Drag & drop / paste wiring -----
const TEXT_DROP_IDS = ['comment-input', 'comment-edit', 'desc-edit'];

function fileDragTarget(target) {
  const modalOpen = !document.getElementById('modal-overlay').classList.contains('hidden');
  if (modalOpen && currentModalCard) {
    const ta = target.closest && target.closest('textarea');
    if (ta && TEXT_DROP_IDS.includes(ta.id)) return { kind: 'text', el: ta };
    return { kind: 'modal', el: document.getElementById('modal-dialog') };
  }
  const tile = state.view === 'board' && target.closest && target.closest('.card[data-card-id]');
  if (tile) return { kind: 'tile', el: tile };
  return null;
}

let _fileDropEl = null;
function setFileDropHighlight(el) {
  if (_fileDropEl === el) return;
  if (_fileDropEl) _fileDropEl.classList.remove('file-drop-over');
  _fileDropEl = el;
  if (!el) return;
  el.classList.add('file-drop-over');
  // A long card scrolls, so put the "Drop files" label in the visible middle
  // of the dialog rather than the middle of its full height.
  if (el.id === 'modal-dialog') {
    const r = el.getBoundingClientRect();
    const mid = window.innerHeight / 2 - r.top;
    el.style.setProperty('--drop-label-top', Math.max(40, Math.min(r.height - 40, mid)) + 'px');
  }
}

function initFileDrops() {
  const isFileDrag = e => e.dataTransfer && [...(e.dataTransfer.types || [])].includes('Files');

  // Gate on 'Files' so the card/list drag handlers in initDragDrop keep sole
  // ownership of internal drags. preventDefault on every file drag so a drop that
  // misses a target doesn't navigate the tab away to the file.
  document.addEventListener('dragover', e => {
    if (!isFileDrag(e)) return;
    e.preventDefault();
    const t = fileDragTarget(e.target);
    e.dataTransfer.dropEffect = t ? 'copy' : 'none';
    setFileDropHighlight(t ? t.el : null);
  });
  document.addEventListener('dragleave', e => {
    if (isFileDrag(e) && !e.relatedTarget) setFileDropHighlight(null); // left the window
  });
  document.addEventListener('drop', e => {
    if (!isFileDrag(e)) return;
    e.preventDefault();
    setFileDropHighlight(null);
    const files = [...(e.dataTransfer.files || [])];
    const t = fileDragTarget(e.target);
    if (!t || !files.length) return;
    if (t.kind === 'text') {
      insertFilesIntoText(t.el, currentModalCard.boardId, currentModalCard.cardId, files);
    } else if (t.kind === 'modal') {
      attachFiles(currentModalCard.boardId, currentModalCard.cardId, files);
    } else {
      attachFiles(state.currentBoardId, t.el.dataset.cardId, files);
    }
  });

  // Paste with the card open: into a comment/description editor → inline link;
  // anywhere else that isn't a text field → attachment. A paste that also carries
  // text (cells from a spreadsheet come with a picture of themselves) stays a
  // normal text paste.
  document.addEventListener('paste', e => {
    if (!currentModalCard || document.getElementById('modal-overlay').classList.contains('hidden')) return;
    const raw = [...(e.clipboardData && e.clipboardData.files || [])];
    // Finder-copied files come with their own name as the text; that's not a
    // real text paste.
    const text = e.clipboardData.getData('text/plain').trim();
    if (!raw.length || (text && !raw.some(f => f.name === text))) return;
    const files = raw.map(namePastedFile);
    const ae = document.activeElement;
    const { boardId, cardId } = currentModalCard;
    if (ae && TEXT_DROP_IDS.includes(ae.id)) {
      e.preventDefault();
      insertFilesIntoText(ae, boardId, cardId, files);
    } else if (!(ae && (ae.isContentEditable || ae.tagName === 'INPUT' || ae.tagName === 'TEXTAREA'))) {
      e.preventDefault();
      attachFiles(boardId, cardId, files);
    }
  });
}

function copyCard(boardId, cardId) {
  const result = getCard(boardId, cardId);
  if (!result) return;
  const copy = JSON.parse(JSON.stringify(result.card));
  copy.id = generateId();
  copy.title = copy.title + ' (copy)';
  copy.createdAt = Date.now();
  // The copy is yours, even of an agent's card: the agent API lets an agent
  // delete only cards it created, and a copy isn't an auto-logged ship.
  copy.createdBy = state.currentUser.id;
  copy.origin = null;
  result.list.cards.push(copy);
  saveState();
  renderBoard();
  showToast('Card copied', 'success');
}

function showMoveCardPicker(btn, boardId, cardId) {
  const board = getBoard(boardId);
  if (!board) return;
  let items = board.lists.map(l => `<div class="dropdown-item" onclick="moveCard('${boardId}','${cardId}','${l.id}',0);closeDropdown();renderCardModal()">${escapeHtml(l.title)}</div>`).join('');
  showDropdown(btn, `<div class="dropdown-header">Move to list</div>${items}`);
}

// ===== DROPDOWNS / PICKERS =====
let activeDropdown = null;

function showDropdown(anchor, html, width) {
  closeDropdown();
  const rect = anchor.getBoundingClientRect();
  const dropdown = document.createElement('div');
  dropdown.className = 'dropdown';
  dropdown.innerHTML = html;
  if (width) dropdown.style.width = width + 'px';
  const root = document.getElementById('dropdown-root');
  root.appendChild(dropdown);

  let left = rect.left;
  let top = rect.bottom + 6;
  if (left + dropdown.offsetWidth > window.innerWidth - 10) left = window.innerWidth - dropdown.offsetWidth - 10;
  if (top + dropdown.offsetHeight > window.innerHeight - 10) top = rect.top - dropdown.offsetHeight - 6;
  dropdown.style.left = Math.max(10, left) + 'px';
  dropdown.style.top = top + 'px';
  activeDropdown = dropdown;

  setTimeout(() => {
    document.addEventListener('click', closeDropdownOnOutsideClick);
  }, 10);
}

function closeDropdown() {
  if (activeDropdown) { activeDropdown.remove(); activeDropdown = null; }
  document.removeEventListener('click', closeDropdownOnOutsideClick);
}

function closeDropdownOnOutsideClick(e) {
  if (activeDropdown && !activeDropdown.contains(e.target)) closeDropdown();
}

function showListMenu(btn, boardId, listId) {
  const html = `
    <div class="dropdown-header">List Actions</div>
    <div class="dropdown-item" onclick="closeDropdown();startEditListTitle('${boardId}','${listId}')">${ICONS.edit} Rename</div>
    <div class="dropdown-divider"></div>
    <div class="dropdown-item danger" onclick="closeDropdown();if(confirm('Delete this list and all its cards?'))deleteList('${boardId}','${listId}');renderBoard()">${ICONS.trash} Delete list</div>`;
  showDropdown(btn, html);
}

function showBoardMenu(btn) {
  const board = getCurrentBoard();
  if (!board) return;
  let bgHtml = BOARD_BACKGROUNDS.map(bg =>
    `<div class="dropdown-item" onclick="getCurrentBoard().background='${bg.id}';saveState();renderBoard();closeDropdown()">
      <span style="width:18px;height:18px;border-radius:4px;background:${bg.gradient};display:inline-block"></span> ${bg.name}
    </div>`).join('');

  // Move to project submenu
  let projectHtml = '';
  if (state.projects.length) {
    projectHtml += `<div class="dropdown-divider"></div>`;
    projectHtml += `<div style="padding:4px 10px;font-size:11px;color:var(--text-muted);font-weight:600">MOVE TO PROJECT</div>`;
    projectHtml += `<div class="dropdown-item ${!board.projectId ? 'active-check' : ''}" onclick="setBoardProject('${board.id}',null);closeDropdown();render()">
      ${ICONS.close} None (Uncategorised) ${!board.projectId ? ICONS.check : ''}
    </div>`;
    state.projects.forEach(p => {
      const isActive = board.projectId === p.id;
      projectHtml += `<div class="dropdown-item ${isActive ? 'active-check' : ''}" onclick="setBoardProject('${board.id}','${p.id}');closeDropdown();render()">
        <span class="project-color-dot" style="background:${p.color}"></span> ${escapeHtml(p.name)} ${isActive ? ICONS.check : ''}
      </div>`;
    });
  }

  const html = `
    <div class="dropdown-header">Board Menu</div>
    <div class="dropdown-item" onclick="closeDropdown();startEditBoardTitle()">${ICONS.edit} Rename board</div>
    ${projectHtml}
    <div class="dropdown-divider"></div>
    <div style="padding:4px 10px;font-size:11px;color:var(--text-muted);font-weight:600">BACKGROUND</div>
    ${bgHtml}
    <div class="dropdown-divider"></div>
    <div class="dropdown-item danger" onclick="closeDropdown();if(confirm('Delete this board?')){deleteBoard('${board.id}');render()}">${ICONS.trash} Delete board</div>`;
  showDropdown(btn, html, 220);
}

function showLabelPicker(btn, boardId, cardId) {
  const result = getCard(boardId, cardId);
  if (!result) return;
  let items = LABEL_COLORS.map(lbl => {
    const active = result.card.labels.includes(lbl.id);
    return `<div class="label-picker-item" onclick="toggleCardLabel('${boardId}','${cardId}','${lbl.id}');refreshLabelPicker('${boardId}','${cardId}')">
      <div class="label-picker-color" style="background:${lbl.bg};color:${lbl.color}">${lbl.name}</div>
      <span class="label-picker-check">${active ? ICONS.check : ''}</span>
    </div>`;
  }).join('');
  showDropdown(btn, `<div class="dropdown-header">Labels</div><div id="label-picker-items">${items}</div>`, 240);
}

function refreshLabelPicker(boardId, cardId) {
  const result = getCard(boardId, cardId);
  if (!result || !activeDropdown) return;
  const items = activeDropdown.querySelector('#label-picker-items');
  if (!items) return;
  items.innerHTML = LABEL_COLORS.map(lbl => {
    const active = result.card.labels.includes(lbl.id);
    return `<div class="label-picker-item" onclick="toggleCardLabel('${boardId}','${cardId}','${lbl.id}');refreshLabelPicker('${boardId}','${cardId}')">
      <div class="label-picker-color" style="background:${lbl.bg};color:${lbl.color}">${lbl.name}</div>
      <span class="label-picker-check">${active ? ICONS.check : ''}</span>
    </div>`;
  }).join('');
  renderCardModal();
}

// Members assignable on a card. The agent helpers (Claude/Codex) are assignable
// on EVERY board regardless of board.members, so the user can hand any card to an
// agent — assigning Claude to a card is how you queue work for it (Claude finds
// its cards via the agent API's GET /assigned). Agents render with their logo.
function assignableMembers(board) {
  const ids = (board.members || []).slice();
  for (const a of AGENT_USERS) if (!ids.includes(a.id)) ids.push(a.id);
  return ids;
}

function memberPickerItemsHtml(board, card) {
  return assignableMembers(board).map(uid => {
    const u = getUser(uid);
    if (!u) return '';
    const active = card.members.includes(uid);
    return `<div class="member-picker-item" onclick="toggleCardMember('${board.id}','${card.id}','${uid}');refreshMemberPicker('${board.id}','${card.id}')">
      ${avatarHtml(u, 'sm')} <span class="name">${escapeHtml(u.name)}</span>
      <span class="label-picker-check">${active ? ICONS.check : ''}</span>
    </div>`;
  }).join('');
}

function showMemberPicker(btn, boardId, cardId) {
  const board = getBoard(boardId);
  const result = getCard(boardId, cardId);
  if (!board || !result) return;
  const items = memberPickerItemsHtml(board, result.card);
  showDropdown(btn, `<div class="dropdown-header">Members</div><div id="member-picker-items">${items}</div>`, 240);
}

function refreshMemberPicker(boardId, cardId) {
  const board = getBoard(boardId);
  const result = getCard(boardId, cardId);
  if (!board || !result || !activeDropdown) return;
  const items = activeDropdown.querySelector('#member-picker-items');
  if (!items) return;
  items.innerHTML = memberPickerItemsHtml(board, result.card);
  renderCardModal();
}

function showDatePicker(btn, boardId, cardId) {
  const result = getCard(boardId, cardId);
  if (!result) return;
  const current = result.card.dueDate ? new Date(result.card.dueDate).toISOString().slice(0, 10) : '';
  showDropdown(btn, `
    <div class="dropdown-header">Due Date</div>
    <div class="date-picker-content">
      <input type="date" id="date-picker-input" value="${current}">
      <div style="display:flex;gap:6px">
        <button class="btn btn-primary btn-sm" style="flex:1" onclick="setDueDate('${boardId}','${cardId}')">Save</button>
        <button class="btn btn-secondary btn-sm" onclick="updateCard('${boardId}','${cardId}',{dueDate:null,dueDone:false});closeDropdown();renderCardModal()">Remove</button>
      </div>
    </div>`, 240);
}

function setDueDate(boardId, cardId) {
  const input = document.getElementById('date-picker-input');
  if (input && input.value) {
    updateCard(boardId, cardId, { dueDate: new Date(input.value).getTime() });
    const result = getCard(boardId, cardId);
    if (result) addNotification('due', boardId, cardId, result.card.title, 'set a due date on');
    closeDropdown();
    renderCardModal();
  }
}

function toggleFilterDropdown(btn) {
  const board = getCurrentBoard();
  if (!board) return;
  let labelsHtml = LABEL_COLORS.map(lbl => {
    const active = state.activeFilters.labels.includes(lbl.id);
    return `<div class="label-picker-item" onclick="toggleFilterLabel('${lbl.id}')">
      <div class="label-picker-color" style="background:${lbl.bg};color:${lbl.color}">${lbl.name}</div>
      <span class="label-picker-check">${active ? ICONS.check : ''}</span>
    </div>`;
  }).join('');
  let membersHtml = assignableMembers(board).map(uid => {
    const u = getUser(uid);
    if (!u) return '';
    const active = state.activeFilters.members.includes(uid);
    return `<div class="member-picker-item" onclick="toggleFilterMember('${uid}')">
      ${avatarHtml(u, 'sm')} <span class="name">${escapeHtml(u.name)}</span>
      <span class="label-picker-check">${active ? ICONS.check : ''}</span>
    </div>`;
  }).join('');
  showDropdown(btn, `
    <div class="dropdown-header">Filter Cards</div>
    <div style="padding:4px 10px;font-size:11px;color:var(--text-muted);font-weight:600">LABELS</div>
    ${labelsHtml}
    <div class="dropdown-divider"></div>
    <div style="padding:4px 10px;font-size:11px;color:var(--text-muted);font-weight:600">MEMBERS</div>
    ${membersHtml}`, 240);
}

function toggleFilterLabel(labelId) {
  const idx = state.activeFilters.labels.indexOf(labelId);
  if (idx === -1) state.activeFilters.labels.push(labelId);
  else state.activeFilters.labels.splice(idx, 1);
  saveState();
  closeDropdown();
  renderBoard();
}

function toggleFilterMember(userId) {
  const idx = state.activeFilters.members.indexOf(userId);
  if (idx === -1) state.activeFilters.members.push(userId);
  else state.activeFilters.members.splice(idx, 1);
  saveState();
  closeDropdown();
  renderBoard();
}

function removeFilter(type, id) {
  if (type === 'label') state.activeFilters.labels = state.activeFilters.labels.filter(l => l !== id);
  else state.activeFilters.members = state.activeFilters.members.filter(m => m !== id);
  saveState();
  renderBoard();
}

function clearFilters() {
  state.activeFilters = { labels: [], members: [] };
  saveState();
  renderBoard();
}

// ===== NOTIFICATION PANEL =====
function toggleNotifPanel() {
  // Toggle off the actual DOM presence (robust against any state drift) so a
  // second click on the bell reliably closes the panel.
  if (document.getElementById('notif-panel')) { removeNotifPanel(); return; }
  state.showNotifPanel = true;
  renderNotifPanel(); // render first so this view still shows the unread highlights
  if (state.notifications.some(n => !n.read)) {
    state.notifications.forEach(n => n.read = true);
    saveState();
    renderTopbar(); // clear the bell badge now that they've been seen (panel stays as-is)
  }
}

// Click a notification → mark read, jump to its board, and open the card modal
// (falls back to just the board if the card was deleted / has no id).
function openNotification(id) {
  const n = state.notifications.find(x => x.id === id);
  if (!n) return;
  n.read = true;
  removeNotifPanel();
  state.showNotifPanel = false;
  if (n.boardId && n.boardId !== state.currentBoardId) openBoard(n.boardId);
  else render();
  if (n.cardId && getCard(n.boardId, n.cardId)) openCardModal(n.boardId, n.cardId);
  saveState();
}

function renderNotifPanel() {
  removeNotifPanel();
  const panel = document.createElement('div');
  panel.className = 'notif-panel';
  panel.id = 'notif-panel';
  let notifsHtml = '';
  if (state.notifications.length === 0) {
    notifsHtml = '<div class="notif-empty">No notifications yet</div>';
  } else {
    state.notifications.forEach(n => {
      const user = getUser(n.userId) || state.currentUser;
      notifsHtml += `<div class="notif-item ${n.read ? '' : 'unread'}" onclick="openNotification('${n.id}')">
        ${avatarHtml(user, 'sm')}
        <div>
          <div class="notif-text"><strong>${escapeHtml(user.name)}</strong> ${escapeHtml(n.text)} <strong>${escapeHtml(n.cardTitle)}</strong>${escapeHtml(n.suffix || '')}</div>
          <div class="notif-time">${timeAgo(n.timestamp)}</div>
        </div>
      </div>`;
    });
  }
  panel.innerHTML = `
    <div class="notif-panel-header">
      <span class="notif-panel-title">Notifications</span>
      <button class="btn btn-ghost btn-sm" onclick="markAllNotifsRead();renderNotifPanel();render()">Mark all read</button>
    </div>
    <div class="notif-list">${notifsHtml}</div>`;
  document.body.appendChild(panel);
  setTimeout(() => document.addEventListener('click', closeNotifOnOutside), 10);
}

function removeNotifPanel() {
  const panel = document.getElementById('notif-panel');
  if (panel) panel.remove();
  state.showNotifPanel = false;
  document.removeEventListener('click', closeNotifOnOutside);
}

function closeNotifOnOutside(e) {
  const panel = document.getElementById('notif-panel');
  if (panel && !panel.contains(e.target) && !e.target.closest('.topbar-icon-btn')) removeNotifPanel();
}

// ===== INLINE EDITING =====
function startEditBoardTitle() {
  const board = getCurrentBoard();
  if (!board) return;
  const el = document.getElementById('board-title-display');
  if (!el) return;
  const input = document.createElement('input');
  input.type = 'text';
  input.value = board.title;
  input.className = 'topbar-board-title';
  input.style.cssText = 'background:var(--bg-input);border:1px solid var(--accent);padding:4px 8px;border-radius:4px;width:240px;';
  input.onblur = function() {
    if (this.value.trim()) renameBoard(board.id, this.value.trim());
    render();
  };
  input.onkeydown = function(e) {
    if (e.key === 'Enter') this.blur();
    if (e.key === 'Escape') { this.value = board.title; this.blur(); }
  };
  el.replaceWith(input);
  input.focus();
  input.select();
}

function startEditListTitle(boardId, listId) {
  const el = document.getElementById(`list-title-${listId}`);
  if (!el) return;
  const list = getList(boardId, listId);
  if (!list) return;
  const input = document.createElement('input');
  input.type = 'text';
  input.value = list.title;
  input.className = 'list-title-input';
  input.onblur = function() {
    if (this.value.trim()) renameList(boardId, listId, this.value.trim());
    renderBoard();
  };
  input.onkeydown = function(e) {
    if (e.key === 'Enter') this.blur();
    if (e.key === 'Escape') { this.value = list.title; this.blur(); }
  };
  el.replaceWith(input);
  input.focus();
  input.select();
}

// ===== ADD CARD / LIST FORMS =====
function showAddCardForm(listId) {
  const btn = document.getElementById(`add-card-btn-${listId}`);
  if (!btn) return;
  const footer = btn.parentElement;
  footer.innerHTML = `<div class="add-card-form">
    <textarea id="new-card-input-${listId}" placeholder="Enter a title for this card..." autofocus></textarea>
    <div class="add-card-actions">
      <button class="btn btn-primary btn-sm" onclick="submitNewCard('${listId}')">Add Card</button>
      <button class="btn btn-ghost btn-sm" onclick="renderBoard()">Cancel</button>
    </div>
  </div>`;
  const ta = document.getElementById(`new-card-input-${listId}`);
  ta.focus();
  ta.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submitNewCard(listId); }
    if (e.key === 'Escape') renderBoard();
  });
}

function submitNewCard(listId) {
  const ta = document.getElementById(`new-card-input-${listId}`);
  if (!ta || !ta.value.trim()) return;
  createCard(state.currentBoardId, listId, ta.value.trim());
  renderBoard();
  setTimeout(() => showAddCardForm(listId), 50);
}

function showAddListForm() {
  const wrapper = document.getElementById('add-list-wrapper');
  wrapper.innerHTML = `<div class="add-list-form">
    <input type="text" id="new-list-input" placeholder="Enter list title..." autofocus>
    <div style="display:flex;gap:6px">
      <button class="btn btn-primary btn-sm" onclick="submitNewList()">Add List</button>
      <button class="btn btn-ghost btn-sm" onclick="renderBoard()">Cancel</button>
    </div>
  </div>`;
  const input = document.getElementById('new-list-input');
  input.focus();
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') submitNewList();
    if (e.key === 'Escape') renderBoard();
  });
}

function submitNewList() {
  const input = document.getElementById('new-list-input');
  if (!input || !input.value.trim()) return;
  createList(state.currentBoardId, input.value.trim());
  renderBoard();
  const wrapper = document.getElementById('lists-wrapper');
  if (wrapper) wrapper.scrollLeft = wrapper.scrollWidth;
}

let _pendingBoardCreate = null;

function promptCreateBoard(defaultProjectId) {
  const title = prompt('Board name:');
  if (!title || !title.trim()) return;
  const bgIdx = Math.floor(Math.random() * BOARD_BACKGROUNDS.length);
  const bg = BOARD_BACKGROUNDS[bgIdx].id;

  if (state.projects.length === 0) {
    const board = createBoard(title.trim(), bg, defaultProjectId || null);
    openBoard(board.id);
    return;
  }

  // Store pending data to avoid inline string escaping issues
  _pendingBoardCreate = { title: title.trim(), background: bg };

  const anchor = document.createElement('div');
  anchor.style.cssText = 'position:fixed;top:50%;left:50%;width:1px;height:1px;';
  document.body.appendChild(anchor);

  let items = `<div class="dropdown-item" onclick="closeDropdown();finishCreateBoard(null)">
    ${ICONS.close} None (Uncategorised)
  </div>`;
  state.projects.forEach(p => {
    const isDefault = p.id === defaultProjectId ? ' style="background:var(--accent-dim)"' : '';
    items += `<div class="dropdown-item"${isDefault} onclick="closeDropdown();finishCreateBoard('${p.id}')">
      <span class="project-color-dot" style="background:${p.color}"></span> ${escapeHtml(p.name)}
    </div>`;
  });

  showDropdown(anchor, `<div class="dropdown-header">Choose a project</div>${items}`, 220);
  anchor.remove();
}

function finishCreateBoard(projectId) {
  if (!_pendingBoardCreate) return;
  const { title, background } = _pendingBoardCreate;
  _pendingBoardCreate = null;
  const board = createBoard(title, background, projectId);
  openBoard(board.id);
}

// ===== NAVIGATION =====
function openBoard(boardId) {
  state.currentBoardId = boardId;
  state.view = 'board';
  state.activeFilters = { labels: [], members: [] };
  if (window.innerWidth <= 900) {
    document.getElementById('sidebar').classList.add('collapsed');
  }
  saveState();
  render();
}

function goToDashboard() {
  state.currentBoardId = null;
  state.view = 'dashboard';
  saveState();
  render();
}

function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('collapsed');
}

function closeSidebar() {
  document.getElementById('sidebar').classList.add('collapsed');
}

// Mobile menu parity with the task app: tap the backdrop or drag the panel
// left to close it. Both are close-only — opening stays on the hamburger — and
// only matter on phones, where the sidebar floats over the board as an overlay.
function initSidebarMobile() {
  // On a phone, start with the menu closed — the screen is barely one board
  // wide, so leaving it open over the content on load just gets in the way.
  if (window.innerWidth <= 900) closeSidebar();

  document.getElementById('sidebar-overlay').addEventListener('click', closeSidebar);

  // The panel follows the finger and settles on release (shared/drawer-drag.js).
  attachDrawerDrag({
    panel: '#sidebar',
    backdrop: '#sidebar-overlay',
    isActive: () => window.innerWidth <= 900 &&
      !document.getElementById('sidebar').classList.contains('collapsed'),
    close: closeSidebar,
  });
}

// ===== DRAG & DROP =====
let dragState = { cardId: null, fromListId: null, placeholder: null, lastListId: null, lastIndex: -1 };

function onDragStart(e) {
  const cardEl = e.target.closest('.card');
  if (!cardEl) return;
  dragState.cardId = cardEl.dataset.cardId;
  dragState.fromListId = cardEl.closest('.list-cards').dataset.listId;
  dragState.lastListId = null;
  dragState.lastIndex = -1;
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/plain', dragState.cardId);
  requestAnimationFrame(() => cardEl.classList.add('dragging'));
  autoScroll.x = e.clientX; autoScroll.y = e.clientY;
  startAutoScroll();
}

function onDragEnd(e) {
  stopAutoScroll();
  document.querySelectorAll('.card.dragging').forEach(c => c.classList.remove('dragging'));
  removePlaceholder();
  document.querySelectorAll('.list.drag-over').forEach(l => l.classList.remove('drag-over'));
  dragState = { cardId: null, fromListId: null, placeholder: null, lastListId: null, lastIndex: -1 };
}

function removePlaceholder() {
  if (dragState.placeholder) {
    dragState.placeholder.remove();
    dragState.placeholder = null;
  }
}

function getDropIndex(listCards, y) {
  const cards = [...listCards.querySelectorAll('.card:not(.dragging)')];
  for (let i = 0; i < cards.length; i++) {
    const rect = cards[i].getBoundingClientRect();
    if (y < rect.top + rect.height / 2) return i;
  }
  return cards.length;
}

function initDragDrop() {
  document.addEventListener('dragover', e => {
    if (!dragState.cardId) return;
    // Always preventDefault so the browser allows dropping
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    autoScroll.x = e.clientX; autoScroll.y = e.clientY;

    // Find the target list — match .list (not just .list-cards)
    // so drops on header/footer/padding areas still work
    const listEl = e.target.closest('.list');
    if (!listEl) return;
    const listCards = listEl.querySelector('.list-cards');
    if (!listCards) return;
    const listId = listCards.dataset.listId;

    document.querySelectorAll('.list.drag-over').forEach(l => {
      if (l !== listEl) l.classList.remove('drag-over');
    });
    listEl.classList.add('drag-over');

    // Calculate insertion index
    const dropIndex = getDropIndex(listCards, e.clientY);

    // Skip DOM work if position hasn't changed
    if (dragState.lastListId === listId && dragState.lastIndex === dropIndex) return;
    dragState.lastListId = listId;
    dragState.lastIndex = dropIndex;

    // Create or move placeholder
    if (!dragState.placeholder) {
      dragState.placeholder = document.createElement('div');
      dragState.placeholder.className = 'card-placeholder';
    }
    const cards = [...listCards.querySelectorAll('.card:not(.dragging)')];
    if (dropIndex < cards.length) {
      listCards.insertBefore(dragState.placeholder, cards[dropIndex]);
    } else {
      listCards.appendChild(dragState.placeholder);
    }
  });

  document.addEventListener('drop', e => {
    if (!dragState.cardId) return;
    e.preventDefault();

    // Match against .list so drops on header/footer work
    const listEl = e.target.closest('.list');
    if (!listEl) {
      cleanupDrag();
      return;
    }
    const listCards = listEl.querySelector('.list-cards');
    if (!listCards) {
      cleanupDrag();
      return;
    }
    const toListId = listCards.dataset.listId;
    const toPosition = getDropIndex(listCards, e.clientY);

    moveCard(state.currentBoardId, dragState.cardId, toListId, toPosition);
    cleanupDrag();
    renderBoard();
  });

  // List reordering — separate listeners gated on listDragState so they
  // never interfere with the card drag handlers above.
  document.addEventListener('dragover', e => {
    if (!listDragState.listId) return;
    handleListDragOver(e);
  });

  document.addEventListener('drop', e => {
    if (!listDragState.listId) return;
    handleListDrop(e);
  });

  // Sidebar board → project folder, gated the same way.
  document.addEventListener('dragover', e => {
    if (!sidebarDrag.boardId) return;
    handleSidebarDragOver(e);
  });

  document.addEventListener('drop', e => {
    if (!sidebarDrag.boardId) return;
    handleSidebarDrop(e);
  });

  // Safety net: a fresh press means any drag is over, even one whose dragend
  // never arrived. Otherwise dragActive() would hold live updates off for good.
  document.addEventListener('pointerdown', () => {
    if (sidebarDrag.boardId) cleanupSidebarDrag();
  }, true);
}

function cleanupDrag() {
  removePlaceholder();
  document.querySelectorAll('.list.drag-over').forEach(l => l.classList.remove('drag-over'));
  dragState = { cardId: null, fromListId: null, placeholder: null, lastListId: null, lastIndex: -1 };
}

// ----- List reordering (drag a list by its header handle) -----
let listDragState = { listId: null, placeholder: null, lastIndex: -1 };

function onListDragStart(e, listId) {
  const listEl = document.getElementById('list-' + listId);
  if (!listEl) return;
  e.stopPropagation();
  listDragState.listId = listId;
  listDragState.lastIndex = -1;
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/plain', listId);
  // Drag the whole list as the ghost image (not just the tiny handle),
  // offset to where the user grabbed it.
  const rect = listEl.getBoundingClientRect();
  try { e.dataTransfer.setDragImage(listEl, e.clientX - rect.left, e.clientY - rect.top); } catch (_) {}
  requestAnimationFrame(() => listEl.classList.add('list-dragging'));
  autoScroll.x = e.clientX; autoScroll.y = e.clientY;
  startAutoScroll();
}

function onListDragEnd() {
  stopAutoScroll();
  cleanupListDrag();
}

function getListDropIndex(wrapper, x) {
  const lists = [...wrapper.querySelectorAll('.list:not(.list-dragging)')];
  for (let i = 0; i < lists.length; i++) {
    const rect = lists[i].getBoundingClientRect();
    if (x < rect.left + rect.width / 2) return i;
  }
  return lists.length;
}

function handleListDragOver(e) {
  e.preventDefault();
  e.dataTransfer.dropEffect = 'move';
  autoScroll.x = e.clientX; autoScroll.y = e.clientY;
  const wrapper = document.getElementById('lists-wrapper');
  if (!wrapper) return;
  const dropIndex = getListDropIndex(wrapper, e.clientX);
  if (listDragState.lastIndex === dropIndex) return;
  listDragState.lastIndex = dropIndex;
  if (!listDragState.placeholder) {
    listDragState.placeholder = document.createElement('div');
    listDragState.placeholder.className = 'list-placeholder';
  }
  const lists = [...wrapper.querySelectorAll('.list:not(.list-dragging)')];
  if (dropIndex < lists.length) {
    wrapper.insertBefore(listDragState.placeholder, lists[dropIndex]);
  } else {
    // Keep the placeholder among the lists, before the "Add another list" tile.
    wrapper.insertBefore(listDragState.placeholder, document.getElementById('add-list-wrapper'));
  }
}

function handleListDrop(e) {
  e.preventDefault();
  const wrapper = document.getElementById('lists-wrapper');
  const listId = listDragState.listId;
  if (wrapper && listId) {
    const toPosition = getListDropIndex(wrapper, e.clientX);
    moveList(state.currentBoardId, listId, toPosition);
  }
  cleanupListDrag();
  renderBoard();
}

function cleanupListDrag() {
  if (listDragState.placeholder) listDragState.placeholder.remove();
  document.querySelectorAll('.list.list-dragging').forEach(l => l.classList.remove('list-dragging'));
  listDragState = { listId: null, placeholder: null, lastIndex: -1 };
}

// ----- SIDEBAR BOARD DRAG: file a board into a project folder -----
// Drag any board in the sidebar onto a project folder (its header, or the boards
// under it when it's open) to file it there, or onto Uncategorised to take it
// back out. Collapsed folders take drops and stay shut, which is how old
// projects get tidied away. The board menu's "Move to project" does the same.
let sidebarDrag = { boardId: null, zone: null, x: 0, y: 0, raf: null };
let _lastBoardFiling = null; // { boardId, projectId } that Undo puts back

function onSidebarBoardDragStart(e, boardId) {
  const item = e.currentTarget;
  cleanupSidebarDrag(); // stop a previous drag's scroll loop if its dragend never came
  sidebarDrag.boardId = boardId;
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/plain', boardId); // Firefox won't start a drag without data
  // Restyle after the browser has taken the drag image, so the ghost isn't faded.
  requestAnimationFrame(() => {
    if (sidebarDrag.boardId === boardId) item.classList.add('dragging');
  });
  startSidebarAutoScroll();
}

function onSidebarBoardDragEnd() {
  cleanupSidebarDrag();
}

// The section a drop on `target` would file the board into, or null when it
// wouldn't move it: outside every section, or the section it's already in.
function sidebarDropZone(target) {
  const el = target && (target.nodeType === 1 ? target : target.parentElement);
  const zone = el && el.closest('#sidebar-nav [data-drop-project]');
  if (!zone) return null;
  const board = getBoard(sidebarDrag.boardId);
  if (!board || (board.projectId || '') === zone.dataset.dropProject) return null;
  return zone;
}

function setSidebarDropZone(zone) {
  if (sidebarDrag.zone === zone) return;
  if (sidebarDrag.zone) sidebarDrag.zone.classList.remove('drop-over');
  sidebarDrag.zone = zone;
  if (zone) zone.classList.add('drop-over');
}

function handleSidebarDragOver(e) {
  // Always cancel, so nothing else on the page (the search box, say) takes the
  // drop; dropEffect 'none' then refuses it anywhere that isn't a target.
  e.preventDefault();
  sidebarDrag.x = e.clientX;
  sidebarDrag.y = e.clientY;
  const zone = sidebarDropZone(e.target);
  e.dataTransfer.dropEffect = zone ? 'move' : 'none';
  setSidebarDropZone(zone);
}

function handleSidebarDrop(e) {
  e.preventDefault();
  const zone = sidebarDropZone(e.target);
  const boardId = sidebarDrag.boardId;
  cleanupSidebarDrag();
  if (zone) fileBoardInProject(boardId, zone.dataset.dropProject || null);
}

function cleanupSidebarDrag() {
  if (sidebarDrag.raf) cancelAnimationFrame(sidebarDrag.raf);
  if (sidebarDrag.zone) sidebarDrag.zone.classList.remove('drop-over');
  document.querySelectorAll('.sidebar-item.dragging').forEach(el => el.classList.remove('dragging'));
  sidebarDrag = { boardId: null, zone: null, x: 0, y: 0, raf: null };
}

// Scroll the sidebar while a dragged board is held near its top or bottom edge,
// so folders below the fold are reachable. Uses the last pointer position from
// dragover, which stops firing while the pointer holds still.
function startSidebarAutoScroll() {
  const EDGE = 48;      // px from the nav's top/bottom where scrolling kicks in
  const MAX_SPEED = 14; // px per frame at (or past) the very edge
  const step = () => {
    if (!sidebarDrag.boardId) { sidebarDrag.raf = null; return; }
    const nav = document.getElementById('sidebar-nav');
    const { x, y } = sidebarDrag;
    if (nav && (x || y)) {
      const r = nav.getBoundingClientRect();
      if (x >= r.left && x <= r.right) {
        let dy = 0;
        if (y < r.top + EDGE) dy = -MAX_SPEED * Math.min(1, (r.top + EDGE - y) / EDGE);
        else if (y > r.bottom - EDGE) dy = MAX_SPEED * Math.min(1, (y - (r.bottom - EDGE)) / EDGE);
        if (dy) nav.scrollTop += dy;
      }
    }
    sidebarDrag.raf = requestAnimationFrame(step);
  };
  sidebarDrag.raf = requestAnimationFrame(step);
}

function fileBoardInProject(boardId, projectId) {
  const board = getBoard(boardId);
  if (!board || (board.projectId || null) === projectId) return;
  _lastBoardFiling = { boardId, projectId: board.projectId || null };
  setBoardProject(boardId, projectId);
  refreshAfterFiling();
  const project = projectId && state.projects.find(p => p.id === projectId);
  showToast(`Moved "${board.title}" to ${project ? project.name : 'Uncategorised'}`, 'success',
    { label: 'Undo', onClick: 'undoBoardFiling()' });
}

function undoBoardFiling() {
  if (!_lastBoardFiling) return;
  const { boardId, projectId } = _lastBoardFiling;
  _lastBoardFiling = null;
  // If that project was deleted meanwhile, the board goes back to Uncategorised.
  setBoardProject(boardId, state.projects.some(p => p.id === projectId) ? projectId : null);
  document.querySelectorAll('#toast-container .toast').forEach(t => t.remove());
  refreshAfterFiling();
}

// Only the sidebar and the dashboard group boards by project, so an open board
// is left alone.
function refreshAfterFiling() {
  renderSidebar();
  if (state.view === 'dashboard') renderDashboard();
}

// ----- Edge auto-scroll while dragging a card or list -----
// HTML5 dragover only fires on pointer movement, so holding a dragged card
// against the edge wouldn't scroll. This rAF loop keeps scrolling the board
// toward off-screen lists, using the last known pointer position, for as
// long as a drag is active.
let autoScroll = { raf: null, x: 0, y: 0 };

function dragActive() {
  return !!(dragState.cardId || listDragState.listId || sidebarDrag.boardId);
}

function startAutoScroll() {
  if (autoScroll.raf) return;
  // Suspend scroll-snap for the duration of a drag: the per-frame scrollLeft nudges
  // below would otherwise be re-snapped each frame, stalling edge auto-scroll. Snap
  // (CSS mandatory) is restored in stopAutoScroll once the drag ends.
  const snapEl = document.getElementById('lists-wrapper');
  if (snapEl) snapEl.style.scrollSnapType = 'none';
  const EDGE = 90;       // px from an edge where auto-scroll kicks in
  const MAX_SPEED = 24;  // px per frame at the very edge
  const step = () => {
    if (!dragActive()) { autoScroll.raf = null; return; }
    const wrapper = document.getElementById('lists-wrapper');
    if (wrapper) {
      const r = wrapper.getBoundingClientRect();
      const { x, y } = autoScroll;
      if (x > 0 && y >= r.top && y <= r.bottom) {
        const distRight = r.right - x;
        const distLeft = x - r.left;
        let dx = 0;
        if (distRight < EDGE) dx = MAX_SPEED * (1 - Math.max(0, distRight) / EDGE);
        else if (distLeft < EDGE) dx = -MAX_SPEED * (1 - Math.max(0, distLeft) / EDGE);
        if (dx) {
          const sb = wrapper.style.scrollBehavior;
          wrapper.style.scrollBehavior = 'auto'; // don't animate per-frame nudges
          wrapper.scrollLeft += dx;
          wrapper.style.scrollBehavior = sb;
        }
      }
    }
    autoScroll.raf = requestAnimationFrame(step);
  };
  autoScroll.raf = requestAnimationFrame(step);
}

function stopAutoScroll() {
  if (autoScroll.raf) { cancelAnimationFrame(autoScroll.raf); autoScroll.raf = null; }
  autoScroll.x = 0; autoScroll.y = 0;
  // Restore CSS-defined snap (clearing the inline override).
  const snapEl = document.getElementById('lists-wrapper');
  if (snapEl) snapEl.style.scrollSnapType = '';
}

// ----- Drag-to-pan the board (grab empty background, drag left/right to scroll) -----
let panState = { active: false, startX: 0, scrollLeft: 0 };

function initBoardPan() {
  document.addEventListener('mousedown', e => {
    if (e.button !== 0) return; // left button only
    const wrapper = document.getElementById('lists-wrapper');
    if (!wrapper || !wrapper.contains(e.target)) return;
    // Only pan from empty background — never from a list, card, or control.
    if (e.target.closest('.list') || e.target.closest('button, input, textarea, select, a, .add-list-form')) return;
    panState.active = true;
    panState.startX = e.pageX;
    panState.scrollLeft = wrapper.scrollLeft;
    wrapper.classList.add('panning');
    e.preventDefault(); // avoid text/elem selection while dragging
  });

  document.addEventListener('mousemove', e => {
    if (!panState.active) return;
    const wrapper = document.getElementById('lists-wrapper');
    if (!wrapper) return;
    wrapper.scrollLeft = panState.scrollLeft - (e.pageX - panState.startX);
    e.preventDefault();
  });

  const endPan = () => {
    if (!panState.active) return;
    panState.active = false;
    const wrapper = document.getElementById('lists-wrapper');
    if (wrapper) wrapper.classList.remove('panning');
  };
  document.addEventListener('mouseup', endPan);
  document.addEventListener('mouseleave', endPan);
}

// ===== SEARCH =====
function initSearch() {
  const input = document.getElementById('global-search');
  let searchResults = null;

  input.addEventListener('input', () => {
    const query = input.value.trim().toLowerCase();
    if (!query) {
      if (searchResults) { searchResults.remove(); searchResults = null; }
      return;
    }
    const results = [];
    state.boards.forEach(board => {
      if (board.title.toLowerCase().includes(query)) {
        results.push({ type: 'board', title: board.title, boardId: board.id, context: `${board.lists.length} lists` });
      }
      board.lists.forEach(list => {
        list.cards.forEach(card => {
          if (card.title.toLowerCase().includes(query) || (card.description && card.description.toLowerCase().includes(query))) {
            results.push({ type: 'card', title: card.title, boardId: board.id, cardId: card.id, context: `${board.title} → ${list.title}` });
          }
        });
      });
    });

    if (!searchResults) {
      searchResults = document.createElement('div');
      searchResults.className = 'search-results';
      input.parentElement.style.position = 'relative';
      input.parentElement.appendChild(searchResults);
    }

    if (results.length === 0) {
      searchResults.innerHTML = '<div style="padding:16px;text-align:center;color:var(--text-muted);font-size:13px">No results found</div>';
    } else {
      searchResults.innerHTML = results.slice(0, 8).map(r => `
        <div class="search-result-item" onclick="handleSearchResult('${r.type}','${r.boardId}','${r.cardId || ''}')">
          <span class="result-type">${r.type}</span>
          <div>
            <div class="result-title">${escapeHtml(r.title)}</div>
            <div class="result-context">${escapeHtml(r.context)}</div>
          </div>
        </div>`).join('');
    }
  });

  input.addEventListener('blur', () => {
    setTimeout(() => { if (searchResults) { searchResults.remove(); searchResults = null; } }, 200);
  });

  input.addEventListener('keydown', e => {
    if (e.key === 'Escape') { input.value = ''; input.blur(); }
  });
}

function handleSearchResult(type, boardId, cardId) {
  if (type === 'board') openBoard(boardId);
  else if (type === 'card') {
    openBoard(boardId);
    setTimeout(() => openCardModal(boardId, cardId), 100);
  }
  document.getElementById('global-search').value = '';
}

// ===== KEYBOARD SHORTCUTS =====
function initKeyboard() {
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      if (!document.getElementById('modal-overlay').classList.contains('hidden')) {
        closeModal();
      } else {
        closeDropdown();
        removeNotifPanel();
      }
    }
  });
}

// ===== MODAL CLOSE ON OVERLAY CLICK =====
function initModalEvents() {
  document.getElementById('modal-overlay').addEventListener('click', e => {
    if (e.target === document.getElementById('modal-overlay')) closeModal();
  });
  document.getElementById('modal-close').addEventListener('click', closeModal);
}

// ===== MOBILE NAV =====
function initMobileNav() {
  document.querySelectorAll('.mobile-nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const view = btn.dataset.view;
      const action = btn.dataset.action;
      if (view === 'dashboard') goToDashboard();
      else if (action === 'notifs') toggleNotifPanel();
      else if (action === 'search-mobile') {
        toggleSidebar();
        setTimeout(() => document.getElementById('global-search').focus(), 400);
      }
    });
  });
}

// ===== INITIALIZATION =====
async function init() {
  await loadState();
  render();
  // Deep link: ?card=<id> opens that card over its board, then clears the param so
  // later reloads/in-app navigation behave normally (the shared link still works
  // fresh). Lets a copied card link open straight to the card.
  const deepCard = new URLSearchParams(location.search).get('card');
  if (deepCard) {
    const loc = findCardLocal(deepCard);
    if (loc) { openBoard(loc.boardId); openCardModal(loc.boardId, deepCard); }
    history.replaceState(null, '', location.pathname);
  }
  initDragDrop();
  initFileDrops();
  initBoardPan();
  initSearch();
  initKeyboard();
  initModalEvents();
  initMobileNav();
  initSidebarMobile();
  // Live updates: the SSE stream carries writes within a few hundred ms. Poll
  // every 2s only while that stream is down, and every 20s regardless as a
  // safety net against a stream a proxy is holding open but no longer feeding.
  connectLiveUpdates();
  setInterval(() => { if (!_liveOpen) pollForUpdates(); }, 2000);
  setInterval(pollForUpdates, 20000);
  // Background tabs throttle/freeze timers (and updates self-defer while hidden),
  // so a card added while you're away can sit invisible until the next tick — or
  // until a manual refresh. Catch up the instant the tab is shown or the window
  // refocuses, rather than waiting on the interval.
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) return;
    connectLiveUpdates();  // some browsers drop the stream in frozen tabs
    scheduleApply();       // anything announced while hidden lands now
    pollForUpdates();
  });
  window.addEventListener('focus', () => { scheduleApply(); pollForUpdates(); });
  if (hasOffline()) PBOffline.onReconnect(() => _offline || _offlineDirty || _noBaseline, syncNow, 5000);

  // Sidebar toggle
  document.getElementById('sidebar-toggle').addEventListener('click', toggleSidebar);
}

document.addEventListener('DOMContentLoaded', init);
