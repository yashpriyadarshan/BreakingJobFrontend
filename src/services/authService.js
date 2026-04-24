const API_URL = 'https://auth-service.politecoast-483f3a34.centralindia.azurecontainerapps.io/api/v1/auth';
// const API_URL = 'http://localhost:8080/api/v1/auth';

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

  // No specific JSON return needed for signup based on current implementation
};
