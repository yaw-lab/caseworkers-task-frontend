
import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_BASE_URL;

export const getCases = () => axios.get(`${API_BASE}/cases`);
export const createCase = (newCase) => axios.post(`${API_BASE}/cases`, newCase);
export const deleteCase = (id) => axios.delete(`${API_BASE}/cases/${id}`);
export const updateCaseStatus = (id, updateCase) =>
  axios.patch(`${API_BASE}/cases/${id}/status`, updateCase); 
