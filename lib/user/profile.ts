import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api",
  timeout: 10000,
});

// Define response types
interface ProfileResponseData {
  profile_name: string;
  profile_email: string;
  auto_reply: boolean;
  assistant_id?: string;
  assistant_token?: string | null;
  phone?: string;
}

interface CheckProfileResponse {
  status: "success" | "error";
  hasProfile: boolean;
  profileData?: ProfileResponseData;
  message?: string;
}

interface ProfileData {
  name: string;
  email: string;
  phone: string;
  auto_reply: boolean;
}

export async function createProfile(profileData: any) {
  try {
    const token = localStorage.getItem("access_token");

    const formattedData = {
      name: profileData.name,
      email: profileData.email,
      phone: profileData.phone,
      auto_reply: profileData.auto_reply,
    };

    const response = await api.post('/profile/create-profile', formattedData, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Axios error:', error.response?.data || error.message);
      return {
        status: "error",
        message: error.response?.data?.detail || 'Failed to create profile'
      };
    } else {
      console.error('Unexpected error:', error);
      return {
        status: "error",
        message: 'An unexpected error occurred'
      };
    }
  }
}


export async function updateProfile(data: ProfileData) {
  const token = localStorage.getItem("access_token");

  try {
    const response = await api.post('/profile/update-profile', data, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    return response.data;
  } catch (error) {
    console.error("Profile update failed:", error);
    throw error;
  }
}


export async function checkUserProfile(token: string): Promise<CheckProfileResponse> {
  try {
    const response = await api.get('/profile/get-profile', {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.status === 200 && response.data.status === "success") {
      return {
        status: "success",
        hasProfile: true,
        profileData: response.data.data,
        message: response.data.message
      };
    } else {
      return {
        status: "success",
        hasProfile: false,
        message: response.data.message || 'No profile found'
      };
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        return {
          status: "success",
          hasProfile: false,
          message: 'Profile not found'
        };
      }

      console.error('Axios error:', error.response?.data);
      return {
        status: "error",
        hasProfile: false,
        message: error.response?.data?.detail || 'Failed to check profile'
      };
    } else {
      console.error('Unexpected error:', error);
      return {
        status: "error",
        hasProfile: false,
        message: 'An unexpected error occurred'
      };
    }
  }
}