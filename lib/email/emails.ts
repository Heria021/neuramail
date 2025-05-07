import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  timeout: 180000, // 3 minutes
});

export async function fetchEmails(keyword?: string) {
  try {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
      throw new Error("Access token missing");
    }

    const response = await api.get('/email/emails', {
      params: keyword ? { keyword } : {},
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      }
    });

    return { success: true, data: response.data };
  } catch (error) {
    const errorMsg = axios.isAxiosError(error)
      ? error.response?.data || error.message
      : error;
    console.error("fetchEmails error:", errorMsg);
    return { success: false, error: errorMsg };
  }
}