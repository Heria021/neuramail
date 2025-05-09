import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  timeout: 10000,
});



export async function getAllEmailQueries() {
  try {
    const accessToken = localStorage.getItem('access_token');
    const response = await api.get('/email/get-all-queries', {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      }
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Axios error:', error.response?.data);
    } else {
      console.error('Unexpected error:', error);
    }
  }
}
