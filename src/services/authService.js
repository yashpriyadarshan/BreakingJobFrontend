const API_URL = '/api/v1/auth';

export const login = async (email, password) => {
  const payload = { email, password };
  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.message || 'Login failed. Check your credentials.');
  }

  return response.json();
};

export const signup = async (firstName, lastName, email, password, role) => {
  const payload = { firstName, lastName, email, password, role };
  const response = await fetch(`${API_URL}/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.message || 'Registration failed.');
  }
};
