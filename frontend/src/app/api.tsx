import { API_URL } from "../domain/config";

export const api = {
    async createConversation(userId: string) {
        const response = await fetch(`${API_URL}/conversation/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ user_id: userId }),
        });
        return response.json();
    },

    async sendMessage(conversationId: number, message: string) {
        const response = await fetch(`${API_URL}/message`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ conversation_id: conversationId, message:message }),
        });
        return response.json();
    },

    async checkTaskResult(taskId: string) {
        const response = await fetch(`${API_URL}/task/${taskId}`, {
            method: 'GET',
        });
        return response.json();
    },

    async getUserConversations(userId: string) {
        const response = await fetch(`${API_URL}/conversation/user/${userId}`, {
            method: 'GET',
        });
        return response.json();
    },
};