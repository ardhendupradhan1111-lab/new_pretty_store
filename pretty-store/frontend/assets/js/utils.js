// ===== Pretty Store – Shared Utilities =====

const API_BASE = window.location.hostname === 'localhost'
  ? 'http://localhost:5000/api'
  : '/api';

// ===== API Helper =====
const api = {
  async request(method, path, data = null, isFormData = false) {
    const token = localStorage.getItem('ps_token');
    const headers = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;
    if (!isFormData) headers['Content-Type'] = 'application/json';

    const options = { method, headers };
    if (data) options.body = isFormData ? data : JSON.stringify(data);

    try {
      const res = await fetch(API_BASE + path, options);
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Request failed');
      return json;
    } catch (err) {
      throw err;
    }
  },
  get:    (path)        => api.request('GET', path),
  post:   (path, data)  => api.request('POST', path, data),
  put:    (path, data)  => api.request('PUT', path, data),
  delete: (path)        => api.request('DELETE', path),
  postForm: (path, fd)  => api.request('POST', path, fd, true),
  putForm:  (path, fd)  => api.request('PUT', path, fd, true)
};

// ===== Auth Helpers =====
const auth = {
  setToken(token) { localStorage.setItem('ps_token', token); },
  getToken()      { return localStorage.getItem('ps_token'); },
  removeToken()   { localStorage.removeItem('ps_token'); },
  setUser(user)   { localStorage.setItem('ps_user', JSON.stringify(user)); },
  getUser()       { const u = localStorage.getItem('ps_user'); return u ? JSON.parse(u) : null; },
  removeUser()    { localStorage.removeItem('ps_user'); },
  logout()        { this.removeToken(); this.removeUser(); },
  isLoggedIn()    { return !!this.getToken(); }
};

// ===== Admin Auth =====
const adminAuth = {
  setToken(token) { localStorage.setItem('ps_admin_token', token); },
  getToken()      { return localStorage.getItem('ps_admin_token'); },
  removeToken()   { localStorage.removeItem('ps_admin_token'); },
  setAdmin(admin) { localStorage.setItem('ps_admin', JSON.stringify(admin)); },
  getAdmin()      { const a = localStorage.getItem('ps_admin'); return a ? JSON.parse(a) : null; },
  logout()        { this.removeToken(); localStorage.removeItem('ps_admin'); },
  isLoggedIn()    { return !!this.getToken(); }
};

// Admin API helper
const adminApi = {
  async request(method, path, data = null, isFormData = false) {
    const token = adminAuth.getToken();
    const headers = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;
    if (!isFormData) headers['Content-Type'] = 'application/json';

    const options = { method, headers };
    if (data) options.body = isFormData ? data : JSON.stringify(data);

    const res = await fetch(API_BASE + path, options);
    const json = await res.json();
    if (res.status === 401) { adminAuth.logout(); window.location.href = '/frontend/admin/login.html'; return; }
    if (!res.ok) throw new Error(json.message || 'Request failed');
    return json;
  },
  get:    (path)        => adminApi.request('GET', path),
  post:   (path, data)  => adminApi.request('POST', path, data),
  put:    (path, data)  => adminApi.request('PUT', path, data),
  delete: (path)        => adminApi.request('DELETE', path),
  postForm: (path, fd)  => adminApi.request('POST', path, fd, true),
  putForm:  (path, fd)  => adminApi.request('PUT', path, fd, true)
};

// ===== Toast =====
function showToast(message, type = 'success', duration = 3000) {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }
  const icons = { success: '✅', error: '❌', info: 'ℹ️', warning: '⚠️' };
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span>${icons[type] || ''}</span><span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), duration);
}

// ===== Loading Overlay =====
function showLoading(msg = 'Please wait...') {
  let el = document.getElementById('loading-overlay');
  if (!el) {
    el = document.createElement('div');
    el.id = 'loading-overlay';
    el.className = 'loading-overlay';
    el.innerHTML = `<div class="spinner"></div><p>${msg}</p>`;
    document.body.appendChild(el);
  }
  el.style.display = 'flex';
}
function hideLoading() {
  const el = document.getElementById('loading-overlay');
  if (el) el.style.display = 'none';
}

// ===== Format Helpers =====
function formatPrice(p)  { return '₹' + Number(p).toLocaleString('en-IN'); }
function formatDate(d)   { return new Date(d).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' }); }
function formatDateTime(d) { return new Date(d).toLocaleString('en-IN', { day:'2-digit', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' }); }
function getDiscount(orig, curr) {
  if (!orig || orig <= curr) return 0;
  return Math.round(((orig - curr) / orig) * 100);
}

function starsHTML(avg, count) {
  const full = Math.floor(avg);
  const half = avg - full >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  return `<span class="stars">${'★'.repeat(full)}${'½'.repeat(half)}${'☆'.repeat(empty)}</span><span class="stars-count">(${count})</span>`;
}

// ===== Form Validation =====
function validateForm(formEl) {
  let isValid = true;
  formEl.querySelectorAll('[required]').forEach(input => {
    const errEl = formEl.querySelector(`[data-error="${input.name}"]`);
    if (!input.value.trim()) {
      input.classList.add('error');
      if (errEl) errEl.textContent = 'This field is required';
      isValid = false;
    } else {
      input.classList.remove('error');
      if (errEl) errEl.textContent = '';
    }
  });
  return isValid;
}

// ===== Cart count badge =====
function updateCartBadge(count) {
  document.querySelectorAll('.cart-count').forEach(el => {
    el.textContent = count;
    el.style.display = count > 0 ? 'flex' : 'none';
  });
}
async function refreshCartCount() {
  if (!auth.isLoggedIn()) return;
  try {
    const data = await api.get('/cart');
    const count = data.cart?.items?.length || 0;
    updateCartBadge(count);
  } catch {}
}

// ===== Status badge color =====
function orderStatusBadge(status) {
  const map = {
    'Placed':     'info',
    'Confirmed':  'purple',
    'Processing': 'warning',
    'Shipped':    'warning',
    'Delivered':  'success',
    'Cancelled':  'error',
    'Returned':   'error'
  };
  return `<span class="badge badge-${map[status] || 'info'}">${status}</span>`;
}

function paymentStatusBadge(status) {
  const map = { 'Pending': 'warning', 'Paid': 'success', 'Failed': 'error', 'Refunded': 'purple' };
  return `<span class="badge badge-${map[status] || 'info'}">${status}</span>`;
}

// ===== Debounce =====
function debounce(fn, delay = 300) {
  let t;
  return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), delay); };
}

// ===== OTP Input behaviour =====
function initOTPInputs(containerId) {
  const inputs = document.querySelectorAll(`#${containerId} .otp-input`);
  inputs.forEach((input, i) => {
    input.addEventListener('input', e => {
      const val = e.target.value.replace(/\D/g, '');
      e.target.value = val.slice(-1);
      if (val && i < inputs.length - 1) inputs[i + 1].focus();
    });
    input.addEventListener('keydown', e => {
      if (e.key === 'Backspace' && !e.target.value && i > 0) inputs[i - 1].focus();
    });
    input.addEventListener('paste', e => {
      e.preventDefault();
      const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, inputs.length);
      pasted.split('').forEach((c, j) => { if (inputs[i + j]) inputs[i + j].value = c; });
      const last = Math.min(i + pasted.length, inputs.length - 1);
      inputs[last].focus();
    });
  });
}

function getOTPValue(containerId) {
  return [...document.querySelectorAll(`#${containerId} .otp-input`)].map(i => i.value).join('');
}

// ===== Image fallback =====
function imgFallback(img) {
  img.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Crect fill='%23f3e5f5' width='200' height='200'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%239c27b0' font-size='40'%3E🛍️%3C/text%3E%3C/svg%3E`;
}

// ===== Expose globally =====
window.api = api;
window.adminApi = adminApi;
window.auth = auth;
window.adminAuth = adminAuth;
window.showToast = showToast;
window.showLoading = showLoading;
window.hideLoading = hideLoading;
window.formatPrice = formatPrice;
window.formatDate = formatDate;
window.formatDateTime = formatDateTime;
window.getDiscount = getDiscount;
window.starsHTML = starsHTML;
window.validateForm = validateForm;
window.updateCartBadge = updateCartBadge;
window.refreshCartCount = refreshCartCount;
window.orderStatusBadge = orderStatusBadge;
window.paymentStatusBadge = paymentStatusBadge;
window.debounce = debounce;
window.initOTPInputs = initOTPInputs;
window.getOTPValue = getOTPValue;
window.imgFallback = imgFallback;
