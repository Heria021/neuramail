import axios from "axios";

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  timeout: 10000,
});

export async function update_req_types(reqTypes: string[]) {
  const token = localStorage.getItem("access_token");

  try {
    const response = await api.post(
      "/profile/update-req-types",
      reqTypes,
      {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Failed to update request types:", error);
    throw error;
  }
}