const API_URL = '/api/v1/company';

// Helper to get auth header
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

export const createCompany = async (companyData) => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify(companyData),
  });
  if (!response.ok) {
    throw new Error('Failed to create company');
  }
  return response.json();
};

export const getCompanyById = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'GET',
    headers: {
      ...getAuthHeaders(),
    },
  });
  if (!response.ok) {
    throw new Error('Failed to fetch company details');
  }
  return response.json();
};

export const getCompany = async () => {
  const response = await fetch(API_URL, {
    method: 'GET',
    headers: {
      ...getAuthHeaders(),
    },
  });
  if (!response.ok) {
    throw new Error('Failed to fetch company');
  }
  return response.json();
};

export const updateCompany = async (companyData) => {
  const response = await fetch(API_URL, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify(companyData),
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to update company: ${errorText}`);
  }
  return response.json();
};

export const deleteCompany = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
    headers: {
      ...getAuthHeaders(),
    },
  });
  if (!response.ok) {
    throw new Error('Failed to delete company');
  }
};

export const uploadLogo = async (id, file) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_URL}/${id}/logo`, {
    method: 'POST',
    headers: {
      ...getAuthHeaders(),
      // Do NOT set Content-Type here; the browser will automatically set it to multipart/form-data with the correct boundary
    },
    body: formData,
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to upload logo');
  }
  return response.json();
};
