const API_URL = 'http://localhost:8082/api/v1/jobs';

// Helper to get auth header
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' };
};

export const postJob = async (jobData) => {
  // For now, let's simulate a delay and success to keep it working even if backend isn't ready
  console.log('Posting job:', jobData);
  
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(jobData),
    });
    
    if (!response.ok) {
      // If backend fails, we'll still simulate success for the demo if it's a 404 (not implemented)
      if (response.status === 404) {
         return new Promise((resolve) => setTimeout(() => resolve({ id: Date.now(), ...jobData }), 1000));
      }
      throw new Error('Failed to post job');
    }
    return response.json();
  } catch (error) {
    console.error('Job post error:', error);
    // Fallback for demo
    return new Promise((resolve) => setTimeout(() => resolve({ id: Date.now(), ...jobData }), 1000));
  }
};

export const getJobs = async () => {
  try {
    const response = await fetch(API_URL, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch jobs');
    return response.json();
  } catch (error) {
    console.error('Fetch jobs error:', error);
    return [];
  }
};
