export async function sendToSentinal(message: string) {
    try {
        // const response = await api.post('/process', { message });
        // return response.data;

        // For now, we're just returning a test message
        // In a real implementation, we would send the message to the Sentinel API
        // and return the response
        const response = "This is a test response from the Sentinel API: " + message;
        return response;
    } catch (error) {
        // if (axios.isAxiosError(error)) {
        //   console.error('Axios error:', error.response?.data || error.message);
        //   throw error;
        // } else {
        //   console.error('Unexpected error:', error);
        //   throw error;
        // }
        return error;
    }
}