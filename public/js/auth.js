/**
 * Authentication Handler for OFOS
 * Manages Demo Login and genuine Google OAuth 2.0 Integration
 */
document.addEventListener('DOMContentLoaded', async () => {
  let selectedRole = 'customer'; // 'customer' or 'admin'
  let isGoogleConfigured = false;
  let googleClientId = null;

  const btnDemoLogin = document.getElementById('btn-demo-login');
  const btnGoogleLogin = document.getElementById('btn-google-login');
  const toggleCustomerBtn = document.getElementById('toggle-customer-btn');
  const toggleAdminBtn = document.getElementById('toggle-admin-btn');
  const evalRoleBadge = document.getElementById('eval-role-badge');
  const evalEmailVal = document.getElementById('eval-email-val');
  const evalRoleVal = document.getElementById('eval-role-val');
  const googleStatusDot = document.getElementById('google-status-dot');
  const googleStatusText = document.getElementById('google-status-text');
  const btnOauthInfo = document.getElementById('btn-oauth-info');
  const oauthModal = document.getElementById('oauth-modal');
  const closeOauthModal = document.getElementById('close-oauth-modal');
  const btnModalUnderstand = document.getElementById('btn-modal-understand');

  // Check URL params for error messages from Google redirect
  const urlParams = new URLSearchParams(window.location.search);
  const authError = urlParams.get('auth_error');
  if (authError) {
    Toast.error('Google Sign-in failed: ' + decodeURIComponent(authError));
  }
  if (urlParams.get('session_expired')) {
    Toast.info('Your session has expired. Please log in again.');
  }

  // 1. Role Toggle Handler
  function updateRoleUI(role) {
    selectedRole = role;
    if (role === 'admin') {
      toggleAdminBtn.classList.add('active');
      toggleCustomerBtn.classList.remove('active');
      evalRoleBadge.textContent = 'Admin Demo';
      evalRoleBadge.className = 'badge badge-warning';
      evalEmailVal.textContent = 'admin@foodie.com';
      evalRoleVal.textContent = 'Store Administrator';
      btnDemoLogin.querySelector('span').textContent = 'Login with Demo Admin Account';
    } else {
      toggleCustomerBtn.classList.add('active');
      toggleAdminBtn.classList.remove('active');
      evalRoleBadge.textContent = 'Customer Demo';
      evalRoleBadge.className = 'badge badge-demo';
      evalEmailVal.textContent = 'demo@foodie.com';
      evalRoleVal.textContent = 'Customer Dashboard';
      btnDemoLogin.querySelector('span').textContent = 'Login with Demo Account';
    }
  }

  toggleCustomerBtn.addEventListener('click', () => updateRoleUI('customer'));
  toggleAdminBtn.addEventListener('click', () => updateRoleUI('admin'));

  // 2. Demo Account Login Handler
  btnDemoLogin.addEventListener('click', async () => {
    btnDemoLogin.disabled = true;
    const originalText = btnDemoLogin.innerHTML;
    btnDemoLogin.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Authenticating...';

    try {
      const res = await API.loginDemo(selectedRole);
      Toast.success(res.message || 'Login successful!');
      setTimeout(() => {
        if (selectedRole === 'admin') {
          window.location.href = '/admin.html';
        } else {
          window.location.href = '/dashboard.html';
        }
      }, 700);
    } catch (err) {
      Toast.error(err.message || 'Login failed');
      btnDemoLogin.disabled = false;
      btnDemoLogin.innerHTML = originalText;
    }
  });

  // 3. Inspect Google OAuth Configuration on Server
  try {
    const configRes = await API.getAuthConfig();
    isGoogleConfigured = configRes.isGoogleConfigured;
    googleClientId = configRes.googleClientId;

    if (isGoogleConfigured && googleClientId) {
      googleStatusDot.className = 'status-indicator';
      googleStatusText.textContent = 'Google OAuth 2.0 Ready';
      
      // Initialize Google Identity Services (GIS)
      if (window.google && window.google.accounts && window.google.accounts.id) {
        window.google.accounts.id.initialize({
          client_id: googleClientId,
          callback: handleGoogleCredentialResponse,
          auto_select: false
        });
      }
    } else {
      googleStatusDot.className = 'status-indicator not-configured';
      googleStatusText.textContent = 'Google OAuth: Needs .env Credentials';
    }
  } catch (err) {
    console.warn('Could not verify Google config:', err);
    googleStatusDot.className = 'status-indicator not-configured';
    googleStatusText.textContent = 'Google OAuth offline';
  }

  // 4. Handle Google Identity Services Credential Response (One-Tap / Button)
  async function handleGoogleCredentialResponse(response) {
    if (!response.credential) {
      Toast.error('No credential received from Google.');
      return;
    }

    try {
      Toast.info('Verifying Google credentials with backend...');
      const res = await API.loginWithGoogleToken(response.credential);
      Toast.success(res.message || 'Signed in with Google!');
      setTimeout(() => {
        window.location.href = '/dashboard.html';
      }, 800);
    } catch (err) {
      Toast.error(err.message || 'Google authentication error');
    }
  }

  // 5. "Continue with Google" Click Handler
  btnGoogleLogin.addEventListener('click', async () => {
    if (!isGoogleConfigured) {
      // Show instructions modal explaining exact steps to add Client ID & Secret
      oauthModal.classList.add('active');
      return;
    }

    // Try Google Identity Services prompt first
    if (window.google && window.google.accounts && window.google.accounts.id) {
      window.google.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          // Fallback to direct OAuth redirect URL
          launchGoogleRedirectFlow();
        }
      });
    } else {
      launchGoogleRedirectFlow();
    }
  });

  async function launchGoogleRedirectFlow() {
    try {
      const res = await API.getGoogleAuthUrl();
      if (res.url) {
        window.location.href = res.url;
      } else {
        oauthModal.classList.add('active');
      }
    } catch (err) {
      oauthModal.classList.add('active');
    }
  }

  // 6. OAuth Info Modal Controls
  btnOauthInfo.addEventListener('click', () => oauthModal.classList.add('active'));
  closeOauthModal.addEventListener('click', () => oauthModal.classList.remove('active'));
  btnModalUnderstand.addEventListener('click', () => oauthModal.classList.remove('active'));
  oauthModal.addEventListener('click', (e) => {
    if (e.target === oauthModal) oauthModal.classList.remove('active');
  });

  // Check if user is already authenticated
  const token = API.getToken();
  if (token) {
    try {
      const me = await API.getCurrentUser();
      if (me.user) {
        // Subtle banner offering quick jump to dashboard
        const resumePill = document.createElement('div');
        resumePill.style.cssText = `
          position: fixed; top: 20px; right: 20px; z-index: 100;
          background: rgba(16, 185, 129, 0.2); border: 1px solid #10B981;
          color: #34D399; padding: 10px 18px; border-radius: 9999px;
          font-size: 13px; font-weight: 700; cursor: pointer;
          backdrop-filter: blur(10px); display: flex; align-items: center; gap: 8px;
          box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
        `;
        resumePill.innerHTML = `
          <img src="${me.user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb'}" style="width: 22px; height: 22px; border-radius: 50%; object-fit: cover;">
          <span>Resume as ${me.user.name} &rarr;</span>
        `;
        resumePill.addEventListener('click', () => {
          window.location.href = me.user.role === 'admin' ? '/admin.html' : '/dashboard.html';
        });
        document.body.appendChild(resumePill);
      }
    } catch (e) {
      API.clearSession();
    }
  }
});
