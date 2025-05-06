import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000/api',
    timeout: 600000,  // 10 minutes
});

const sendAutomatedReply = async () => {
    try {
        const accessToken = localStorage.getItem('access_token');
        const response = await api.post(
            'auto/response/automated-response/reply-to-email',
            {},
            {
                headers: {
                    'accept': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                },
                timeout: 600000,
            }
        );

        console.log(response.data);
    } catch (error) {
        console.error('Error sending automated reply:', error);
    }
};