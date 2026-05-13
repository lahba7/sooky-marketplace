// ============================================
// SOOKY - SYSTÈME D'AUTHENTIFICATION
// ============================================

class SookyAuth {
  constructor() {
    this.currentUser = null;
    this.loadUser();
  }

  // Connexion
  async signIn(email, password) {
    try {
      const response = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();
      
      if (data.access_token) {
        this.currentUser = data.user;
        localStorage.setItem('sooky_auth', JSON.stringify(data));
        this.updateUI();
        return { success: true, user: data.user };
      } else {
        return { success: false, error: data.error_description || 'Erreur de connexion' };
      }
    } catch (error) {
      return { success: false, error: 'Erreur réseau' };
    }
  }

  // Inscription
  async signUp(email, password, fullName) {
    try {
      const response = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          email, 
          password,
          data: { full_name: fullName }
        })
      });

      const data = await response.json();
      
      if (data.user) {
        return { success: true, message: 'Vérifiez votre email pour confirmer votre compte' };
      } else {
        return { success: false, error: data.error_description || 'Erreur d\'inscription' };
      }
    } catch (error) {
      return { success: false, error: 'Erreur réseau' };
    }
  }

  // Déconnexion
  signOut() {
    this.currentUser = null;
    localStorage.removeItem('sooky_auth');
    this.updateUI();
    window.location.href = '../index.html';
  }

  // Charger utilisateur depuis localStorage
  loadUser() {
    const saved = localStorage.getItem('sooky_auth');
    if (saved) {
      const data = JSON.parse(saved);
      this.currentUser = data.user;
      this.updateUI();
    }
  }

  // Vérifier si connecté
  isAuthenticated() {
    return this.currentUser !== null;
  }

  // Obtenir utilisateur actuel
  getUser() {
    return this.currentUser;
  }

  // Mettre à jour l'interface
  updateUI() {
    const authLinks = document.querySelectorAll('.auth-link');
    const userMenus = document.querySelectorAll('.user-menu');
    
    if (this.isAuthenticated()) {
      // Masquer liens connexion
      authLinks.forEach(link => {
        if (link.textContent.includes('Connexion')) {
          link.style.display = 'none';
        }
      });

      // Afficher menu utilisateur
      userMenus.forEach(menu => {
        menu.style.display = 'block';
        const userName = menu.querySelector('.user-name');
        if (userName) {
          userName.textContent = this.currentUser.user_metadata?.full_name || this.currentUser.email;
        }
      });

      // Créer menu utilisateur si n'existe pas
      this.createUserMenu();
    } else {
      // Afficher liens connexion
      authLinks.forEach(link => {
        if (link.textContent.includes('Connexion')) {
          link.style.display = 'flex';
        }
      });

      // Masquer menu utilisateur
      userMenus.forEach(menu => menu.style.display = 'none');
    }
  }

  // Créer menu utilisateur
  createUserMenu() {
    const navLinks = document.querySelector('.nav-links');
    if (!navLinks || document.querySelector('.user-dropdown')) return;

    const userDropdown = document.createElement('div');
    userDropdown.className = 'user-dropdown';
    userDropdown.style.cssText = 'position: relative; display: inline-block;';

    const userName = this.currentUser.user_metadata?.full_name || this.currentUser.email.split('@')[0];
    
    userDropdown.innerHTML = `
      <button class="user-btn" style="display: flex; align-items: center; gap: 8px; padding: 10px 16px; background: rgba(99, 102, 241, 0.1); border: 2px solid var(--primary); border-radius: 12px; color: var(--primary); font-weight: 600; cursor: pointer; transition: all 0.3s;">
        <div style="width: 32px; height: 32px; background: var(--gradient-primary); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: 700; font-size: 14px;">
          ${userName.charAt(0).toUpperCase()}
        </div>
        <span>${userName}</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </button>
      <div class="user-menu" style="position: absolute; top: calc(100% + 8px); right: 0; background: white; border-radius: 16px; box-shadow: var(--shadow-lg); border: 1px solid var(--border); min-width: 200px; z-index: 1000; display: none;">
        <a href="profil.html" style="display: flex; align-items: center; gap: 12px; padding: 16px 20px; text-decoration: none; color: var(--text-primary); font-weight: 600; transition: all 0.2s; border-bottom: 1px solid var(--border);">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
          Mon profil
        </a>
        <a href="dashboard-vendeur.html" style="display: flex; align-items: center; gap: 12px; padding: 16px 20px; text-decoration: none; color: var(--text-primary); font-weight: 600; transition: all 0.2s; border-bottom: 1px solid var(--border);">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="3" width="7" height="7"/>
            <rect x="14" y="3" width="7" height="7"/>
            <rect x="14" y="14" width="7" height="7"/>
            <rect x="3" y="14" width="7" height="7"/>
          </svg>
          Dashboard vendeur
        </a>
        <button onclick="auth.signOut()" style="display: flex; align-items: center; gap: 12px; padding: 16px 20px; background: none; border: none; color: var(--secondary); font-weight: 600; cursor: pointer; transition: all 0.2s; width: 100%; text-align: left;">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          Déconnexion
        </button>
      </div>
    `;

    // Insérer avant le bouton "Vendre sur Sooky"
    const sellBtn = navLinks.querySelector('a[href*="vendre.html"]');
    navLinks.insertBefore(userDropdown, sellBtn);

    // Toggle menu
    const userBtn = userDropdown.querySelector('.user-btn');
    const menu = userDropdown.querySelector('.user-menu');
    
    userBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
    });

    // Fermer menu en cliquant ailleurs
    document.addEventListener('click', () => {
      menu.style.display = 'none';
    });

    // Hover effects
    menu.querySelectorAll('a, button').forEach(item => {
      item.addEventListener('mouseenter', () => {
        item.style.background = 'var(--bg-secondary)';
      });
      item.addEventListener('mouseleave', () => {
        item.style.background = 'transparent';
      });
    });
  }
}

// Instance globale
const auth = new SookyAuth();

// Fonctions pour les formulaires
function handleSignIn(event) {
  event.preventDefault();
  const form = event.target;
  const email = form.email.value;
  const password = form.password.value;
  const submitBtn = form.querySelector('button[type="submit"]');
  const errorDiv = form.querySelector('.error-message');

  submitBtn.textContent = 'Connexion...';
  submitBtn.disabled = true;

  auth.signIn(email, password).then(result => {
    if (result.success) {
      window.location.href = '../index.html';
    } else {
      if (errorDiv) {
        errorDiv.textContent = result.error;
        errorDiv.style.display = 'block';
      } else {
        alert(result.error);
      }
    }
    submitBtn.textContent = 'Se connecter';
    submitBtn.disabled = false;
  });
}

function handleSignUp(event) {
  event.preventDefault();
  const form = event.target;
  const fullName = form.fullName.value;
  const email = form.email.value;
  const password = form.password.value;
  const confirmPassword = form.confirmPassword.value;
  const submitBtn = form.querySelector('button[type="submit"]');
  const errorDiv = form.querySelector('.error-message');

  if (password !== confirmPassword) {
    if (errorDiv) {
      errorDiv.textContent = 'Les mots de passe ne correspondent pas';
      errorDiv.style.display = 'block';
    }
    return;
  }

  submitBtn.textContent = 'Inscription...';
  submitBtn.disabled = true;

  auth.signUp(email, password, fullName).then(result => {
    if (result.success) {
      alert(result.message);
      // Basculer vers l'onglet connexion
      const loginTab = document.querySelector('[data-tab="login"]');
      if (loginTab) loginTab.click();
    } else {
      if (errorDiv) {
        errorDiv.textContent = result.error;
        errorDiv.style.display = 'block';
      } else {
        alert(result.error);
      }
    }
    submitBtn.textContent = 'S\'inscrire';
    submitBtn.disabled = false;
  });
}

// Protéger les pages qui nécessitent une authentification
function requireAuth() {
  if (!auth.isAuthenticated()) {
    window.location.href = 'connexion.html';
    return false;
  }
  return true;
}

// Export global
window.auth = auth;
window.handleSignIn = handleSignIn;
window.handleSignUp = handleSignUp;
window.requireAuth = requireAuth;