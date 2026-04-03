// Admin shared utilities

function requireAdminAuth() {
  if (!adminAuth.isLoggedIn()) {
    window.location.href = 'login.html';
  }
}

// Sidebar toggle
document.addEventListener('DOMContentLoaded', () => {
  const sidebar  = document.getElementById('sidebar');
  const toggle   = document.getElementById('menu-toggle');
  const logoutBtn = document.getElementById('logout-btn');

  // Create overlay
  const overlay = document.createElement('div');
  overlay.className = 'sidebar-overlay';
  document.body.appendChild(overlay);

  if (toggle) {
    toggle.addEventListener('click', () => {
      sidebar.classList.toggle('open');
      overlay.classList.toggle('active');
    });
  }
  overlay.addEventListener('click', () => {
    sidebar.classList.remove('open');
    overlay.classList.remove('active');
  });

  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      adminAuth.logout();
      window.location.href = 'login.html';
    });
  }

  // Highlight active nav
  const path = window.location.pathname.split('/').pop();
  document.querySelectorAll('.nav-item').forEach(link => {
    const href = link.getAttribute('href');
    link.classList.toggle('active', href === path);
  });
});
