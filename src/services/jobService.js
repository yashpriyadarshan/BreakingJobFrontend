const API_URL = 'http://localhost:8083/api/v1/jobs';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

// --- Public / Candidate endpoints ---
// NOTE: always send auth headers — Spring Security may require them even on "public" routes

export const getAllOpenJobs = async (page = 0, size = 10) => {
  const response = await fetch(`${API_URL}?page=${page}&size=${size}`, {
    headers: { ...getAuthHeaders() },
  });
  if (!response.ok) {
    const err = await response.text().catch(() => response.status);
    throw new Error(`Failed to fetch jobs (${response.status}): ${err}`);
  }
  return response.json();
};

export const getJobById = async (jobId) => {
  const response = await fetch(`${API_URL}/${jobId}`, {
    headers: { ...getAuthHeaders() },
  });
  if (!response.ok) throw new Error('Failed to fetch job');
  return response.json();
};

export const searchJobs = async (params = {}) => {
  const query = new URLSearchParams();
  if (params.keyword) query.set('keyword', params.keyword);
  if (params.location) query.set('location', params.location);
  if (params.skills?.length) params.skills.forEach(s => query.append('skills', s));
  if (params.employmentType) query.set('employmentType', params.employmentType);
  if (params.jobType) query.set('jobType', params.jobType);
  if (params.minExperience != null) query.set('minExperience', params.minExperience);
  if (params.maxExperience != null) query.set('maxExperience', params.maxExperience);
  if (params.minSalary != null) query.set('minSalary', params.minSalary);
  if (params.maxSalary != null) query.set('maxSalary', params.maxSalary);
  if (params.sortBy) query.set('sortBy', params.sortBy);
  if (params.sortDirection) query.set('sortDirection', params.sortDirection);
  query.set('page', params.page ?? 0);
  query.set('size', params.size ?? 10);

  const response = await fetch(`${API_URL}/search?${query.toString()}`, {
    headers: { ...getAuthHeaders() },
  });
  if (!response.ok) {
    const err = await response.text().catch(() => response.status);
    throw new Error(`Failed to search jobs (${response.status}): ${err}`);
  }
  return response.json();
};

export const incrementViewCount = async (jobId) => {
  await fetch(`${API_URL}/${jobId}/view`, {
    method: 'POST',
    headers: { ...getAuthHeaders() },
  });
};

// --- Recruiter endpoints ---

export const createJob = async (jobData) => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify(jobData),
  });
  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Failed to create job: ${err}`);
  }
  return response.json();
};

export const updateJob = async (jobId, jobData) => {
  const response = await fetch(`${API_URL}/${jobId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify(jobData),
  });
  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Failed to update job: ${err}`);
  }
  return response.json();
};

export const deleteJob = async (jobId) => {
  const response = await fetch(`${API_URL}/${jobId}`, {
    method: 'DELETE',
    headers: { ...getAuthHeaders() },
  });
  if (!response.ok) throw new Error('Failed to delete job');
};

export const updateJobStatus = async (jobId, status) => {
  const response = await fetch(`${API_URL}/${jobId}/status?status=${status}`, {
    method: 'PATCH',
    headers: { ...getAuthHeaders() },
  });
  if (!response.ok) throw new Error('Failed to update job status');
  return response.json();
};

export const getCompanyJobs = async (companyId, page = 0, size = 10) => {
  const response = await fetch(`${API_URL}/company?companyId=${companyId}&page=${page}&size=${size}`, {
    headers: { ...getAuthHeaders() },
  });
  if (!response.ok) {
    const err = await response.text().catch(() => response.status);
    throw new Error(`Failed to fetch company jobs (${response.status}): ${err}`);
  }
  return response.json();
};
