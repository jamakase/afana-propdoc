const API_BASE_URL = 'http://localhost:5000'; 

export const api = {
    async createConversation() {
        const response = await fetch(`${API_BASE_URL}/conversation/create`, {
            method: 'POST',
        });
        return response.json();
    },

    async sendMessage(conversationId: number, message: string) {
        const response = await fetch(`${API_BASE_URL}/message`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ conversation_id: conversationId, message }),
        });
        return response.json();
    },

    async checkTaskResult(taskId: string) {
        const response = await fetch(`${API_BASE_URL}/task/${taskId}`, {
            method: 'GET',
        });
        return response.json();
    },
};