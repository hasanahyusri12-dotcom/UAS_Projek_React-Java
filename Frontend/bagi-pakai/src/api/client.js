
const API_BASE_URL = import.meta.env.VITE_API_URL || '';

export const getStoredToken = () => {
  return localStorage.getItem('bagipakai_token');
};

export const setStoredToken = (token) => {
  if (token) {
    localStorage.setItem('bagipakai_token', token);
  } else {
    localStorage.removeItem('bagipakai_token');
  }
};

export const getStoredUser = () => {
  try {
    const raw = localStorage.getItem('bagipakai_user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const setStoredUser = (user) => {
  if (user) {
    localStorage.setItem('bagipakai_user', JSON.stringify(user));
  } else {
    localStorage.removeItem('bagipakai_user');
  }
};

export async function request(endpoint, options = {}) {
  const token = getStoredToken();
  const headers = { ...options.headers };

  // If body is NOT FormData, set JSON Content-Type
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  // If unauthenticated or token expired
  if (response.status === 401) {
    // Only clear and redirect if we had a token
    if (token && !endpoint.includes('/auth/login')) {
      setStoredToken(null);
      setStoredUser(null);
      window.dispatchEvent(new Event('bagipakai_auth_expired'));
    }
  }

  // Parse response
let data;
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    data = await response.json();
  } else {
    const text = await response.text();
    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      data = text;
    }
  }

  if (!response.ok) {
    let errorMessage = 'Terjadi kesalahan sistem';
    if (data && typeof data === 'object') {
      errorMessage = data.error || data.message || (typeof data === 'string' ? data : JSON.stringify(data));
    } else if (typeof data === 'string' && data.length > 0) {
      errorMessage = data;
    }
    const error = new Error(errorMessage);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

export const api = {
  get: (url, options) => request(url, { ...options, method: 'GET' }),
  post: (url, body, options) =>
    request(url, {
      ...options,
      method: 'POST',
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),
  put: (url, body, options) =>
    request(url, {
      ...options,
      method: 'PUT',
      body: body ? (body instanceof FormData ? body : JSON.stringify(body)) : undefined,
    }),
  delete: (url, options) => request(url, { ...options, method: 'DELETE' }),
};
