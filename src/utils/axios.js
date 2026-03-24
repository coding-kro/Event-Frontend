import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // send cookies automatically
  headers: {
    'Content-Type': 'application/json',
  },
});
