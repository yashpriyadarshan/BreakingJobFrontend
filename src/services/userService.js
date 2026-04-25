const API_URL = 'http://localhost:8081/api/v1/user';

// Helper to get auth header
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

// --- User Profile Endpoints ---

export const createUserProfile = async (userData) => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify(userData),
  });
  if (!response.ok) throw new Error('Failed to create user profile');
  return response.json();
};

export const updateUserProfile = async (id, userData) => {
  // userData should match UpdateUserProfileRequest exactly:
  // { FirstName, LastName, bio, profilePicture, resumeUrl, location, phone }
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify(userData),
  });
  if (!response.ok) throw new Error('Failed to update user profile');
  return response.json();
};

export const getUserById = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'GET',
    headers: { ...getAuthHeaders() },
  });
  if (!response.ok) throw new Error('Failed to fetch user');
  console.log(response);
  return response.json();
};

export const getUserProfile = async () => {
  console.log("getting user profile");
  const response = await fetch(API_URL, {
    method: 'GET',
    headers: { ...getAuthHeaders() },
  });
  console.log(response)
  console.log("user profile respinse" + response);
  if (!response.ok) throw new Error('Failed to fetch user profile');
  return response.json();
};

export const deleteUserProfile = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
    headers: { ...getAuthHeaders() },
  });
  if (!response.ok) throw new Error('Failed to delete user profile');
  // 204 No Content typically doesn't return JSON
};

// --- Skill Endpoints ---

export const addSkill = async (id, skillRequest) => {
  // skillRequest should be { name: "" }
  const response = await fetch(`${API_URL}/${id}/skills`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify(skillRequest),
  });
  if (!response.ok) throw new Error('Failed to add skill');
  return response.json();
};

export const deleteSkill = async (id, skillId) => {
  const response = await fetch(`${API_URL}/${id}/skills/${skillId}`, {
    method: 'DELETE',
    headers: { ...getAuthHeaders() },
  });
  if (!response.ok) throw new Error('Failed to delete skill');
};

// --- Experience Endpoints ---

export const addExperience = async (id, experienceRequest) => {
  // experienceRequest should be { company, role, description, startDate, endDate }
  const response = await fetch(`${API_URL}/${id}/experience`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify(experienceRequest),
  });
  if (!response.ok) throw new Error('Failed to add experience');
  return response.json();
};

export const deleteExperience = async (id, experienceId) => {
  const response = await fetch(`${API_URL}/${id}/experience/${experienceId}`, {
    method: 'DELETE',
    headers: { ...getAuthHeaders() },
  });
  if (!response.ok) throw new Error('Failed to delete experience');
};

// --- Project Endpoints ---

export const addProject = async (id, projectRequest) => {
  // projectRequest should be { title, description, githubLink, liveLink }
  const response = await fetch(`${API_URL}/${id}/projects`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify(projectRequest),
  });
  if (!response.ok) throw new Error('Failed to add project');
  return response.json();
};

export const deleteProject = async (id, projectId) => {
  const response = await fetch(`${API_URL}/${id}/projects/${projectId}`, {
    method: 'DELETE',
    headers: { ...getAuthHeaders() },
  });
  if (!response.ok) throw new Error('Failed to delete project');
};

// --- File Uploads ---

export const uploadProfilePicture = async (id, file) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_URL}/${id}/profile-picture`, {
    method: 'POST',
    headers: {
      ...getAuthHeaders(),
      // Do NOT set Content-Type here; browser will automatically set it to multipart/form-data
    },
    body: formData,
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to upload profile picture');
  }
  return response.json();
};

export const uploadResume = async (id, file) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_URL}/${id}/resume`, {
    method: 'POST',
    headers: {
      ...getAuthHeaders(),
    },
    body: formData,
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to upload resume');
  }
  return response.json();
};
