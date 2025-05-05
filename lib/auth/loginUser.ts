import axios, { AxiosError } from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000/api',
    timeout: 10000,
});

interface SignInFormData {
    email: string;
    password: string;
}

interface LoginSuccessResponse {
    status: true;
    message: string;
    access_token: string;
    login_id: string;
}

interface LoginErrorResponse {
    status: false;
    message: string;
}

export type LoginResponse = LoginSuccessResponse | LoginErrorResponse;

export async function loginUser(data: SignInFormData): Promise<LoginResponse> {
    try {
        const response = await api.post<LoginResponse>("/auth/login", data);

        if (response.status === 200) {
            return response.data;
        } else {
            // This should not happen with proper API design, but just in case
            return {
                status: false,
                message: 'Unexpected response from server'
            };
        }
    } catch (error) {
        console.error('Error during login:', error);

        // Handle Axios errors
        if (axios.isAxiosError(error)) {
            const axiosError = error as AxiosError<{message?: string}>;

            // Handle network errors
            if (!axiosError.response) {
                return {
                    status: false,
                    message: 'Network error. Please check your connection.'
                };
            }

            // Handle API errors with response
            return {
                status: false,
                message: axiosError.response.data?.message ||
                         `Error (${axiosError.response.status}): ${axiosError.response.statusText}`
            };
        }

        // Handle other errors
        return {
            status: false,
            message: error instanceof Error ? error.message : 'An unknown error occurred'
        };
    }
}