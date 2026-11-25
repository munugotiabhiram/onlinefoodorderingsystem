const express = require('express');
const router = express.Router();
const { OAuth2Client } = require('google-auth-library');
const { users } = require('../db/database');
const { generateToken, authenticateToken } = require('../middleware/auth');

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || '';
const GOOGLE_CALLBACK_URL = process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5000/api/auth/google/callback';

let googleClient = null;
if (GOOGLE_CLIENT_ID) {
  googleClient = new OAuth2Client(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_CALLBACK_URL);
}

// Helper to set cookie
function setAuthCookie(res, token) {
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });
}

/**
 * 1. Demo Account Login
 * POST /api/auth/demo-login
 * Body: { role: 'customer' | 'admin' }
 */
router.post('/demo-login', (req, res) => {
  const role = req.body.role === 'admin' ? 'admin' : 'customer';
  const targetEmail = role === 'admin' ? 'admin@foodie.com' : 'demo@foodie.com';

  let user = users.findByEmail(targetEmail);
  if (!user) {
    // If not found, create standard demo user
    user = users.create({
      id: role === 'admin' ? 'usr_demo_admin' : 'usr_demo_customer',
      name: role === 'admin' ? 'Chef Marcus Vance (Admin)' : 'Alex Rivera (Demo Customer)',
      email: targetEmail,
      role: role,
      isDemo: true,
      avatar: role === 'admin' 
        ? 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=400&q=80'
        : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      phone: '+1 (555) 382-9912'
    });
  }

  const token = generateToken(user);
  setAuthCookie(res, token);

  return res.json({
    success: true,
    message: `Logged in successfully as Demo ${role.toUpperCase()}`,
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      isDemo: true
    }
  });
});

/**
 * 2. Get Google OAuth 2.0 Auth URL (Redirect Flow)
 * GET /api/auth/google/url
 */
router.get('/google/url', (req, res) => {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (!clientId || clientId.includes('your_google_client_id')) {
    return res.status(400).json({
      success: false,
      message: 'Google OAuth Client ID is not configured in .env file. Please add your GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET to enable Google sign-in.'
    });
  }

  const client = new OAuth2Client(clientId, process.env.GOOGLE_CLIENT_SECRET, GOOGLE_CALLBACK_URL);
  const authorizeUrl = client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email'],
    prompt: 'select_account consent'
  });

  return res.json({ success: true, url: authorizeUrl });
});

/**
 * 3. Continue with Google - Token Verification (Google One-Tap / GIS Credential Response)
 * POST /api/auth/google
 * Body: { credential } or { code }
 */
router.post('/google', async (req, res) => {
  const { credential, code } = req.body;
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientId || clientId.includes('your_google_client_id')) {
    return res.status(400).json({
      success: false,
      isConfigMissing: true,
      message: 'Google OAuth is not configured on the server. Please supply GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in the .env file. For immediate testing, you can use the "Login with Demo Account" button.'
    });
  }

  try {
    const client = new OAuth2Client(clientId, clientSecret, GOOGLE_CALLBACK_URL);
    let googleUser = null;

    // Case A: ID Token Credential from Google Identity Services button / One-Tap
    if (credential) {
      const ticket = await client.verifyIdToken({
        idToken: credential,
        audience: clientId
      });
      const payload = ticket.getPayload();
      googleUser = {
        email: payload.email,
        name: payload.name || payload.given_name || 'Google User',
        avatar: payload.picture,
        sub: payload.sub
      };
    } 
    // Case B: Authorization code from popup/redirect
    else if (code) {
      const { tokens } = await client.getToken(code);
      client.setCredentials(tokens);
      const ticket = await client.verifyIdToken({
        idToken: tokens.id_token,
        audience: clientId
      });
      const payload = ticket.getPayload();
      googleUser = {
        email: payload.email,
        name: payload.name || payload.given_name || 'Google User',
        avatar: payload.picture,
        sub: payload.sub
      };
    } else {
      return res.status(400).json({ success: false, message: 'Missing Google authentication payload.' });
    }

    if (!googleUser || !googleUser.email) {
      return res.status(400).json({ success: false, message: 'Unable to extract profile details from Google.' });
    }

    // Find or Auto-Create User Account
    let user = users.findByEmail(googleUser.email);
    if (!user) {
      user = users.create({
        name: googleUser.name,
        email: googleUser.email,
        avatar: googleUser.avatar,
        role: 'customer',
        isDemo: false,
        addresses: [],
        favorites: []
      });
    } else {
      // Sync latest avatar/name from Google
      user = users.update(user.id, {
        name: googleUser.name || user.name,
        avatar: googleUser.avatar || user.avatar
      });
    }

    const token = generateToken(user);
    setAuthCookie(res, token);

    return res.json({
      success: true,
      message: 'Signed in with Google successfully!',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        isDemo: false
      }
    });

  } catch (err) {
    console.error('Google Auth Error:', err);
    return res.status(401).json({
      success: false,
      message: 'Google authentication failed: ' + (err.message || 'Invalid Google Token')
    });
  }
});

/**
 * 4. Google OAuth 2.0 Callback (Standard browser redirect)
 * GET /api/auth/google/callback?code=...
 */
router.get('/google/callback', async (req, res) => {
  const { code, error } = req.query;

  if (error) {
    return res.redirect(`/?auth_error=${encodeURIComponent(error)}`);
  }

  if (!code) {
    return res.redirect('/?auth_error=No+authorization+code+received');
  }

  try {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const client = new OAuth2Client(clientId, clientSecret, GOOGLE_CALLBACK_URL);

    const { tokens } = await client.getToken(code);
    const ticket = await client.verifyIdToken({
      idToken: tokens.id_token,
      audience: clientId
    });
    const payload = ticket.getPayload();

    let user = users.findByEmail(payload.email);
    if (!user) {
      user = users.create({
        name: payload.name || 'Google User',
        email: payload.email,
        avatar: payload.picture,
        role: 'customer',
        isDemo: false,
        addresses: [],
        favorites: []
      });
    } else {
      user = users.update(user.id, {
        name: payload.name || user.name,
        avatar: payload.picture || user.avatar
      });
    }

    const token = generateToken(user);
    setAuthCookie(res, token);

    // Redirect to customer dashboard
    return res.redirect(`/dashboard.html?auth=success&token=${encodeURIComponent(token)}`);
  } catch (err) {
    console.error('Google Callback Error:', err);
    return res.redirect(`/?auth_error=${encodeURIComponent(err.message || 'Authentication failed')}`);
  }
});

/**
 * 5. Get Current Authenticated User Profile
 * GET /api/auth/me
 */
router.get('/me', authenticateToken, (req, res) => {
  return res.json({
    success: true,
    user: {
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      phone: req.user.phone,
      role: req.user.role,
      avatar: req.user.avatar,
      isDemo: req.user.isDemo,
      addresses: req.user.addresses || [],
      favorites: req.user.favorites || [],
      createdAt: req.user.createdAt
    }
  });
});

/**
 * 6. Logout
 * POST /api/auth/logout
 */
router.post('/logout', (req, res) => {
  res.clearCookie('token');
  return res.json({ success: true, message: 'Logged out successfully.' });
});

/**
 * 7. Config status endpoint (helps frontend show Google button status or client ID)
 * GET /api/auth/config
 */
router.get('/config', (req, res) => {
  const clientId = process.env.GOOGLE_CLIENT_ID || '';
  const isGoogleConfigured = Boolean(clientId && !clientId.includes('your_google_client_id'));
  return res.json({
    googleClientId: isGoogleConfigured ? clientId : null,
    isGoogleConfigured
  });
});

module.exports = router;
