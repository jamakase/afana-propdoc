export const api = {
    async createConversation(api_url: string) {
        const response = await fetch(`${api_url}/conversation/create`, {
            method: 'POST',
            credentials: "include",
        });
        return response.json();
    },

    async sendMessage(api_url: string, conversationId: number, message: string) {
        const response = await fetch(`${api_url}/message`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ conversation_id: conversationId, message:message }),
        });
        return response.json();
    },

    async checkTaskResult(api_url: string, taskId: string) {
        const response = await fetch(`${api_url}/task/${taskId}`, {
            method: 'GET',
        });
        return response.json();
    },

    async get_messages__user_id_(api_url: string) {
        const response = await fetch(`${api_url}/conversations/get`, {
            method: 'POST',
            credentials: "include"
        });
        const data = await response.json();
        console.log(data);
        return data;
    },

    async deleteConversation(api_url: string, conversationId: number) {
        const response = await fetch(`${api_url}/conversation/delete/${conversationId}`, {
            method: 'DELETE',
        });
        return response.json();
    },

    async getMessages(api_url: string, conversationId: number) {
        const response = await fetch(`${api_url}/messages/${conversationId}`, {
            method: 'GET',
            credentials: "include"
        });
        return response.json();
    },
};