import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const analyzeResume = async (file, jobDescription) => {
  console.log('[DEBUG client.js] Preparing FormData for /api/analyze...');
  const formData = new FormData();
  formData.append('resume_file', file);
  formData.append('job_description', jobDescription);

  console.log(`[DEBUG client.js] Executing POST request to ${API_BASE_URL}/api/analyze...`);
  const response = await api.post('/api/analyze', formData);
  console.log('[DEBUG client.js] Response received from server:', response.data);
  return response.data;
};

export const analyzeGithub = async (githubUrl) => {
  console.log(`[DEBUG client.js] Analyzing GitHub Profile: ${githubUrl}...`);
  const response = await api.post('/api/github/analyze', { github_url: githubUrl });
  return response.data;
};

export const getHistory = async () => {
  console.log(`[DEBUG client.js] Fetching history from ${API_BASE_URL}/api/history...`);
  const response = await api.get('/api/history');
  return response.data;
};

export const getAnalysis = async (id) => {
  console.log(`[DEBUG client.js] Fetching analysis #${id} from ${API_BASE_URL}/api/history/${id}...`);
  const response = await api.get(`/api/history/${id}`);
  return response.data;
};
