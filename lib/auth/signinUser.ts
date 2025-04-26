import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000/api',
    timeout: 10000,
});

interface SignInFormData {
    email: string;
    password: string;
}

export async function signUpUser(data: SignInFormData) {
    try {
        const response = await api.post("/auth/sign-up", data);

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

export async function confirmSignUp(email: string, confirmationCode: string) {
    try {
        const response = await api.post("/auth/confirm-sign-up", {
            email,
            confirmation_code: confirmationCode,
        });

        return response.data; 
    } catch (error) {
        console.error("Error confirming sign up:", error);
        throw error;
    }
}