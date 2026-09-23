const API_BASE = (
  import.meta.env.VITE_API_URL ||
  'https://narveka-ecommerce.onrender.com/api'
).replace(/\/$/, '');

export const getAccessToken = () =>
  localStorage.getItem('narveka_access_token');

export const getRefreshToken = () =>
  localStorage.getItem('narveka_refresh_token');

export async function api<T = any>(
  endpoint: string,
  options: RequestInit = {},
  auth = false
): Promise<T> {
  const headers = new Headers(options.headers || {});

  if (
    !headers.has('Content-Type') &&
    options.body &&
    !(options.body instanceof FormData)
  ) {
    headers.set('Content-Type', 'application/json');
  }

  const token = getAccessToken();

  if (auth && token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(
    `${API_BASE}${endpoint}`,
    {
      ...options,
      headers,
    }
  );

  const text = await response.text();

  let data: any = {};

  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { detail: text };
  }

  if (!response.ok) {
    throw new Error(
      data.detail ||
      data.message ||
      `Request failed (${response.status})`
    );
  }

  return data as T;
}

export async function login(
  email: string,
  password: string
) {
  const data = await api<{
    access: string;
    refresh: string;
  }>('/auth/login/', {
    method: 'POST',
    body: JSON.stringify({
      username: email,
      password,
    }),
  });

  localStorage.setItem(
    'narveka_access_token',
    data.access
  );

  localStorage.setItem(
    'narveka_refresh_token',
    data.refresh
  );

  return api('/auth/me/', {}, true);
}

export async function register(
  name: string,
  email: string,
  password: string,
  phone: string
) {
  const data = await api<{
    access: string;
    refresh: string;
  }>('/auth/register/', {
    method: 'POST',
    body: JSON.stringify({
      name,
      email,
      password,
      phone,
    }),
  });

  localStorage.setItem(
    'narveka_access_token',
    data.access
  );

  localStorage.setItem(
    'narveka_refresh_token',
    data.refresh
  );

  return api('/auth/me/', {}, true);
}

export function logoutApi() {
  localStorage.removeItem(
    'narveka_access_token'
  );

  localStorage.removeItem(
    'narveka_refresh_token'
  );
}