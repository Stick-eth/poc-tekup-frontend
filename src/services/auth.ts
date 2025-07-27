// src/services/auth.ts
import axios from 'axios';

const API_URL = 'http://localhost:3000';

export async function getNonce(address: string): Promise<string> {
  const res = await axios.post(`${API_URL}/auth/nonce`, { address });
  return res.data.nonce;
}

export async function login(address: string, signature: string): Promise<string> {
  const res = await axios.post(`${API_URL}/auth/login`, { address, signature });
  return res.data.access_token;
}
