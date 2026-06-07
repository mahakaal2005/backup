const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

class ApiClient {
    async request(endpoint, options = {}) {
        const url = `${API_BASE_URL}${endpoint}`;
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers,
        };

        const config = {
            ...options,
            headers,
            credentials: 'include' // Important for CORS sessions
        };

        try {
            console.log(`[API] ${options.method || 'GET'} ${url}`); // Debug Log
            const response = await fetch(url, config);

            if (!response.ok) {
                console.error(`[API] Error ${response.status}: ${response.statusText}`);
                throw new Error(`API Error: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('API Request Failed:', error);
            throw error;
        }
    }

    get(endpoint) {
        return this.request(endpoint, { method: 'GET' });
    }

    post(endpoint, data) {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    // Video APIs
    fetchVideo(url) {
        return this.post('/video/fetch', { videoUrl: url });
    }

    // Generation APIs
    generatePosts(data) {
        return this.post('/generate', data);
    }

    // History APIs
    getHistory(filters) {
        return this.get('/history');
    }

    saveHistory(data) {
        return this.post('/history', data);
    }

    deleteHistory(id) {
        return this.request(`/history/${id}`, { method: 'DELETE' });
    }

    // Template APIs
    getTemplates() {
        return this.get('/templates');
    }

    createTemplate(data) {
        return this.post('/templates', data);
    }

    deleteTemplate(id) {
        return this.request(`/templates/${id}`, { method: 'DELETE' });
    }

    // Config APIs
    getConfig() {
        return this.get('/config');
    }

    saveConfig(key, value) {
        return this.post('/config', { key, value });
    }

    // Auth & LinkedIn APIs
    getAuthStatus() {
        return this.get('/auth/status');
    }

    logout() {
        return this.get('/auth/logout');
    }

    shareToLinkedIn(data) {
        return this.post('/linkedin/share', data);
    }
}

export const api = new ApiClient();
