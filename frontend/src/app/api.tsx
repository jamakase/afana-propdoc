import { API_URL } from "../domain/config";

export const api = {
    async createConversation(userId: string) {
        const response = await fetch(`${API_URL}/conversation/create`, {
            method: 'POST',
            credentials: "include",
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

    async get_messages__user_id_(userId: string) {
        const response = await fetch(`${API_URL}//messages/${userId}`, {
            method: 'GET',
        });
        console.log(response);
        return response.json();
    },
};