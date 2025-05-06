import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  timeout: 10000,
});

export async function updateAssistantToken(tokenValue: string) {
  const accessToken = localStorage.getItem("access_token");

  try {
    const response = await api.post(`/profile/update-assistant-token`, null, {
      params: {
        token: tokenValue
      },
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      }
    });

    return response.data;
  } catch (error) {
    console.error("Assistant token update failed:", error);
    throw error;
  }
}