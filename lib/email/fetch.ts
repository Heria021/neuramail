import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  timeout: 10000,
});

export async function fetchEmails(keyword?: string) {
  try {
    const response = await api.get('/email/emails', {
      params: keyword ? { keyword } : {},
      headers: {
        'Accept': 'application/json'
      }
    });
    console.log('Emails:', response.data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Axios error:', error.response?.data || error.message);
    } else {
      console.error('Unexpected error:', error);
    }
  }
}

export async function getAllEmailQueries() {
  try {
    const response = await api.get('/email/get-all-queries', {
      headers: {
        'Accept': 'application/json'
      }
    });
    console.log('All Queries:', response.data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Axios error:', error.response?.data);
    } else {
      console.error('Unexpected error:', error);
    }
  }
}