import axios from 'axios';

interface ReplyToEmailPayload {
    ticket_id: string;
    to_email: string;
    body: string;
    message_id: string;
}

async function replyToEmail(payload: ReplyToEmailPayload) {
    try {
        const response = await axios.post('/api/response/reply-to-email', payload, {
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
        const response = await axios.get('/api/response/get-full-thread', {
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
        const response = await axios.get('/api/response/get-latest-email-threads', {
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