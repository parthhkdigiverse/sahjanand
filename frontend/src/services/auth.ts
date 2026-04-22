export const STORAGE_KEY = 'maison_aurum_admin_token';

export const authService = {
  getToken: () => localStorage.getItem(STORAGE_KEY),
  setToken: (token: string) => localStorage.setItem(STORAGE_KEY, token),
  logout: () => localStorage.removeItem(STORAGE_KEY),
  isAuthenticated: () => !!localStorage.getItem(STORAGE_KEY),
};

export async function authenticatedFetch(url: string, options: RequestInit = {}) {
  const token = authService.getToken();
  
  const headers = {
    ...options.headers,
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
  };

  const response = await fetch(url, { ...options, headers });
  
  if (response.status === 401) {
    authService.logout();
    window.location.href = '/admin/login';
  }
  
  return response;
}
