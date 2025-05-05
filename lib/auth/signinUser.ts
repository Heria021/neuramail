import axios, { AxiosError } from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000/api',
    timeout: 10000,
});

interface SignUpFormData {
    email: string;
    password: string;
}

interface SignUpSuccessResponse {
    status: "success";
    message: string;
}

interface SignUpErrorResponse {
    status: "error";
    message: string;
}

export type SignUpResponse = SignUpSuccessResponse | SignUpErrorResponse;

interface ConfirmSignUpSuccessResponse {
    status: "success";
    message: string;
}

interface ConfirmSignUpErrorResponse {
    status: "error";
    detail?: string;
    message?: string;
}

export type ConfirmSignUpResponse = ConfirmSignUpSuccessResponse | ConfirmSignUpErrorResponse;

export async function signUpUser(data: SignUpFormData): Promise<SignUpResponse> {
    try {
        const response = await api.post<SignUpResponse>("/auth/sign-up", data);

        if (response.status === 200) {
            return response.data;
        } else {
            // This should not happen with proper API design, but just in case
            return {
                status: "error",
                message: 'Unexpected response from server'
            };
        }
    } catch (error) {
        console.error('Error during sign up:', error);

        // Handle Axios errors
        if (axios.isAxiosError(error)) {
            const axiosError = error as AxiosError<{message?: string}>;

            // Handle network errors
            if (!axiosError.response) {
                return {
                    status: "error",
                    message: 'Network error. Please check your connection.'
                };
            }

            // Handle API errors with response
            return {
                status: "error",
                message: axiosError.response.data?.message ||
                         `Error (${axiosError.response.status}): ${axiosError.response.statusText}`
            };
        }

        // Handle other errors
        return {
            status: "error",
            message: error instanceof Error ? error.message : 'An unknown error occurred'
        };
    }
}

export async function confirmSignUp(email: string, confirmationCode: string): Promise<ConfirmSignUpResponse> {
    try {
        const response = await api.post<ConfirmSignUpResponse>("/auth/confirm-sign-up", {
            email,
            confirmation_code: confirmationCode,
        });

        return response.data;
    } catch (error) {
        console.error("Error confirming sign up:", error);

        // Handle Axios errors
        if (axios.isAxiosError(error)) {
            const axiosError = error as AxiosError<{detail?: string, message?: string}>;

            // Handle network errors
            if (!axiosError.response) {
                return {
                    status: "error",
                    detail: 'Network error. Please check your connection.'
                };
            }

            // Handle API errors with response
            return {
                status: "error",
                detail: axiosError.response.data?.detail ||
                        axiosError.response.data?.message ||
                        `Error (${axiosError.response.status}): ${axiosError.response.statusText}`
            };
        }

        // Handle other errors
        return {
            status: "error",
            detail: error instanceof Error ? error.message : 'An unknown error occurred'
        };
    }
}