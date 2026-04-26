const API_URL = 'https://auth-service.politecoast-483f3a34.centralindia.azurecontainerapps.io/api/v1/auth';

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
  if (!role) {
    console.error('Signup attempted with empty role');
    throw new Error('Role is required for signup.');
  }
  const payload = { firstName, lastName, email, password, role };
  console.log('Signup payload:', payload);
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
