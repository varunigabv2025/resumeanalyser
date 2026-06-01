import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

export const analyzeResume = async (file, jobDescription) => {
  const formData = new FormData();
  formData.append('resume_file', file);
  formData.append('job_description', jobDescription);
  
  const response = await api.post('/api/analyze', formData);
  return response.data;
};

export const getHistory = async () => {
  const response = await axios.get(`${API_BASE_URL}/api/history`);
  return response.data;
};

export const getAnalysis = async (id) => {
  const response = await axios.get(`${API_BASE_URL}/api/history/${id}`);
  return response.data;
};
