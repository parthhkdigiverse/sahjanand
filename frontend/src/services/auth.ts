export const STORAGE_KEY = 'maison_aurum_admin_token';

export const authService = {
  getToken: () => typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null,
  setToken: (token: string) => typeof window !== 'undefined' && localStorage.setItem(STORAGE_KEY, token),
  logout: () => typeof window !== 'undefined' && localStorage.removeItem(STORAGE_KEY),
  isAuthenticated: () => typeof window !== 'undefined' ? !!localStorage.getItem(STORAGE_KEY) : false,
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
