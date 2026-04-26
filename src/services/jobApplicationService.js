/**
 * Job Application Service
 * Maps to: com.breakingjob.jobservicems.controller.JobApplicationController
 * Base path: /v1/job-applications
 *
 * DTOs:
 *   - UpdateApplicationStatusRequest: { status: ApplicationStatus }
 *   - JobApplicationResponse: { applicationId, jobId, userId, status, appliedAt }
 *   - ApplicationStatus enum: PENDING, REVIEWING, INTERVIEWING, ACCEPTED, REJECTED
 */

const API_URL = 'https://job-service.politecoast-483f3a34.centralindia.azurecontainerapps.io/api/v1/job-applications';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');  
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

/**
 * POST /v1/job-applications/{jobId}
 * Apply to a job. Requires Authorization header.
 * Returns: String message
 */
export const applyToJob = async (jobId) => {
  const response = await fetch(`${API_URL}/${jobId}`, {
    method: 'POST',
    headers: { ...getAuthHeaders() },
  });
  if (!response.ok) {
    const err = await response.text().catch(() => `${response.status}`);
    throw new Error(`Failed to apply: ${err}`);
  }
  return response.text();
};

/**
 * GET /v1/job-applications/job/{jobId}
 * Get all applicants for a specific job. Requires Authorization header.
 * Returns: List<JobApplicationResponse>
 */
export const getApplicantsByJobId = async (jobId) => {
  const response = await fetch(`${API_URL}/job/${jobId}`, {
    headers: { ...getAuthHeaders() },
  });
  if (!response.ok) {
    const err = await response.text().catch(() => `${response.status}`);
    throw new Error(`Failed to fetch applicants: ${err}`);
  }
  return response.json();
};

/**
 * GET /v1/job-applications/me
 * Get all applications for the current user. Requires Authorization header.
 * Returns: List<JobApplicationResponse>
 */
export const getMyApplications = async () => {
  const response = await fetch(`${API_URL}/me`, {
    headers: { ...getAuthHeaders() },
  });
  if (!response.ok) {
    const err = await response.text().catch(() => `${response.status}`);
    throw new Error(`Failed to fetch applications: ${err}`);
  }
  return response.json();
};

/**
 * PATCH /v1/job-applications/{applicationId}/status
 * Update application status. Requires Authorization header.
 * Body: UpdateApplicationStatusRequest { status: ApplicationStatus }
 * ApplicationStatus: PENDING | REVIEWING | INTERVIEWING | ACCEPTED | REJECTED
 * Returns: String "Application status updated"
 */
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
    const err = await response.text().catch(() => `${response.status}`);
    throw new Error(`Failed to update status: ${err}`);
  }
  return response.text();
};
