import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000/api',
    timeout: 60000, // 1 minute
});

export const sendAutomatedReply = async () => {
    try {
        const accessToken = localStorage.getItem('access_token');
        if (!accessToken) throw new Error("Access token not found in localStorage");

        const response = await api.post(
            'auto/response/automated-response/reply-to-email',
            {},
            {
                headers: {
                    'accept': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                },
            }
        );

        console.log(response.data);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Axios error:', error.response?.data || error.message);
        } else {
            console.error('Unexpected error:', error);
        }
        throw error;
    }
};