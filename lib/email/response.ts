import axios from 'axios';
const api = axios.create({
    baseURL: 'http://localhost:8000/api',
    timeout: 10000,
});

interface ReplyToEmailPayload {
    ticket_id: string;
    to_email: string;
    body: string;
    message_id: string;
}

export async function replyToEmail(payload: ReplyToEmailPayload) {
    try {
        const response = await api.post('/response/reply-to-email', payload, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        console.log('Reply Success:', response.data);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Axios error:', error.response?.data);
        } else {
            console.error('Unexpected error:', error);
        }
    }
}

export async function getFullEmailThread(ticket_id: string) {
    try {
        const response = await api.get('/response/get-full-thread', {
            params: { ticket_id },
            headers: {
                Accept: 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching email thread:', error);
        throw error;
    }
}

export async function getLatestEmailThreads(ticket_id: string) {
    try {
        const response = await api.get('/response/get-latest-email-threads', {
            params: { ticket_id },
            headers: {
                Accept: 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching latest email threads:', error);
        throw error;
    }
}