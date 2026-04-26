const API_URL = 'http://localhost:8000/reports';

export const getTranscript = async (userId) => {
  const response = await fetch(`${API_URL}/${userId}/transcript`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });
  if (!response.ok) throw new Error('Failed to fetch transcript');
  return response.json();
};

export const getCandidateFeedback = async (userId) => {
  const response = await fetch(`${API_URL}/${userId}/candidate-feedback`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });
  if (!response.ok) throw new Error('Failed to fetch candidate feedback');
  return response.json();
};

export const getRecruiterEvaluation = async (userId) => {
  const response = await fetch(`${API_URL}/${userId}/recruiter-evaluation`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });
  if (!response.ok) throw new Error('Failed to fetch recruiter evaluation');
  return response.json();
};
