const express = require('express');
const router = express.Router();
const { createMagicLink, verifyMagicLink, createSession, verifyPassword } = require('../db');

function setSessionCookie(res, sessionToken) {
  res.cookie('session', sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
  });
}

// The single account allowed to sign in. Set ALLOWED_EMAIL in .env.
const ALLOWED_EMAIL = (process.env.ALLOWED_EMAIL || '').toLowerCase();

router.post('/send', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email || email.toLowerCase() !== ALLOWED_EMAIL) {
      return res.status(403).json({ error: 'This email is not allowed to sign in.' });
    }

    const token = await createMagicLink(email.toLowerCase());
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const magicLinkUrl = `${baseUrl}/api/auth/verify?token=${token}`;

    if (process.env.RESEND_API_KEY) {
      const { Resend } = require('resend');
      const resend = new Resend(process.env.RESEND_API_KEY);
      const result = await resend.emails.send({
        from: process.env.RESEND_FROM || 'login@yourdomain.com',
        to: email.toLowerCase(),
        subject: 'Your Trellis sign-in link',
        html: `<p>Click the link below to sign in to Trellis:</p><p><a href="${magicLinkUrl}">Sign in to Trellis</a></p><p>This link expires in 10 minutes.</p>`
      });
    } else {
      console.log(`\n✉️  Magic link for ${email}:\n   ${magicLinkUrl}\n`);
    }

    res.json({ ok: true });
  } catch (err) {
    console.error('POST /api/auth/send error:', err);
    res.status(500).json({ error: 'Failed to send magic link.' });
  }
});

router.get('/verify', async (req, res) => {
  try {
    const { token } = req.query;
    if (!token) {
      return res.redirect('/auth/login.html');
    }

    const link = await verifyMagicLink(token);
    if (!link) {
      return res.redirect('/auth/login.html');
    }

    const sessionToken = await createSession(link.email);
    setSessionCookie(res, sessionToken);
    res.redirect('/');
  } catch (err) {
    console.error('GET /api/auth/verify error:', err);
    res.redirect('/auth/login.html');
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || email.toLowerCase() !== ALLOWED_EMAIL || !password) {
      await new Promise(r => setTimeout(r, 400));
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const ok = await verifyPassword(password);
    if (!ok) {
      await new Promise(r => setTimeout(r, 400));
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const sessionToken = await createSession(email.toLowerCase());
    setSessionCookie(res, sessionToken);
    res.json({ ok: true });
  } catch (err) {
    console.error('POST /api/auth/login error:', err);
    res.status(500).json({ error: 'Login failed.' });
  }
});

router.post('/logout', (req, res) => {
  res.clearCookie('session');
  res.redirect('/auth/login.html');
});

module.exports = router;
