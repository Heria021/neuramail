import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000/api',
    timeout: 10000,
});

interface SignInFormData {
    email: string;
    password: string;
}

export async function loginUser(data: SignInFormData) {
    try {
        const response = await api.post("/auth/login", data);

        if (response.status === 200) {
            return response.data;
        } else {
            throw new Error('Failed to log in');
        }
    } catch (error) {
        console.error('Error during login:', error);
        throw new Error(error.response?.data?.message || 'Failed to log in');
    }
}