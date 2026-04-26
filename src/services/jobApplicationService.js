const API_URL = 'http://localhost:8083/api/v1/job-applications';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

export const applyToJob = async (jobId) => {
  const response = await fetch(`${API_URL}/${jobId}`, {
    method: 'POST',
    headers: { ...getAuthHeaders() },
  });
  if (!response.ok) {
    const err = await response.text().catch(() => response.status);
    throw new Error(`Failed to apply to job: ${err}`);
  }
  return response.text();
};

export const getApplicantsByJobId = async (jobId) => {
  const response = await fetch(`${API_URL}/job/${jobId}`, {
    headers: { ...getAuthHeaders() },
  });
  if (!response.ok) {
    throw new Error('Failed to fetch applicants');
  }
  return response.json();
};

export const getMyApplications = async () => {
  const response = await fetch(`${API_URL}/me`, {
    headers: { ...getAuthHeaders() },
  });
  if (!response.ok) {
    throw new Error('Failed to fetch applications');
  }
  return response.json();
};

export const updateApplicationStatus = async (applicationId, status) => {
  const response = await fetch(`${API_URL}/${applicationId}/status`, {
    method: 'PATCH',
    headers: { 
      'Content-Type': 'application/json',
      ...getAuthHeaders() 
    },
    body: JSON.stringify({ status })
  });
  if (!response.ok) {
    const err = await response.text().catch(() => response.status);
    throw new Error(`Failed to update application status: ${err}`);
  }
  return response.text();
};
