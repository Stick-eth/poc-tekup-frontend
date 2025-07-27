// src/services/profile.ts
import axios from 'axios';

const API_URL = 'http://localhost:3000';

export async function fetchProfile() {
  const res = await axios.get(`${API_URL}/profile`);
  return res.data; 
}
