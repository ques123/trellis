require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');
const { initDb, getSession, startStateListener } = require('./db');
const authRoutes = require('./routes/auth');
const trellisRoutes = require('./routes/trellis');
const trellisAgentRoutes = require('./routes/trellis-agent');
const trellisAttachmentRoutes = require('./routes/trellis-attachments');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());

// Auth routes (before middleware so login endpoints are accessible)
app.use('/api/auth', authRoutes);

// Trellis agent API (before auth middleware — uses its own bearer-token guard
// instead of the session cookie, so programmatic clients like Claude can reach it)
app.use('/api/trellis/agent', trellisAgentRoutes);

// Auth middleware
app.use(async (req, res, next) => {
  // Allow login page and its assets through
  if (req.path.startsWith('/auth/')) return next();

  const sessionToken = req.cookies?.session;
  if (sessionToken) {
    const session = await getSession(sessionToken);
    if (session) return next();
  }

  // Not authenticated — redirect HTML requests, 401 for API
  if (req.path.startsWith('/api/')) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  res.redirect('/auth/login.html');
});

// API routes
app.use('/api/trellis/attachments', trellisAttachmentRoutes);
app.use('/api/trellis', trellisRoutes);

// Owner shown on cards made in the browser (name + optional photo URL).
app.get('/config.js', (req, res) => {
  res.type('application/javascript').set('Cache-Control', 'no-cache');
  res.send('window.TRELLIS_CONFIG = ' + JSON.stringify({
    ownerName: process.env.OWNER_NAME || 'Me',
    ownerAvatar: process.env.OWNER_AVATAR_URL || ''
  }) + ';');
});

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Start server after DB is ready
initDb()
  .then(() => {
    // Long-lived LISTEN connection that feeds the live-update SSE streams.
    startStateListener();
    app.listen(PORT, () => {
      console.log(`Trellis running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Failed to initialize database:', err);
    process.exit(1);
  });
