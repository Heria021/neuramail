import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  timeout: 600000,  // 10 minutes
});

export async function fetchEmails(keyword?: string) {
  try {
    const accessToken = localStorage.getItem('access_token');
    const response = await api.get('/email/emails', {
      params: keyword ? { keyword } : {},
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      }
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Axios error:', error.response?.data || error.message);
    } else {
      console.error('Unexpected error:', error);
    }
  }
}
