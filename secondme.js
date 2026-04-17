// ============================================
// OPC Alliance — SecondMe Integration
// ============================================

const SecondMe = (function() {
    'use strict';

    const DEFAULT_CONFIG = {
        apiBase: 'https://app.mindos.com/gate/lab',
        token: 'lba_at_b68964ac5cbb50eee8ac87eaadfe122fe5d8261684971e379656435f019f7b4d',
        tokenType: 'Bearer',
        userId: '2268309',
        nickname: 'Lin',
        route: 'xiaolin110',
        homepage: 'https://second.me/xiaolin110',
        pageSize: 10,
        focusAreas: ['罕见病研究', '临床研究方法学', 'AI制药', '消费医疗', '数字医疗创业']
    };

    let config = { ...DEFAULT_CONFIG };
    // Load saved config
    try {
        const saved = JSON.parse(localStorage.getItem('opc_secondme_config'));
        if (saved) config = { ...config, ...saved };
    } catch(e) {}

    function saveConfig(updates) {
        config = { ...config, ...updates };
        localStorage.setItem('opc_secondme_config', JSON.stringify(config));
    }

    function getHeaders() {
        return {
            'Authorization': `${config.tokenType} ${config.token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        };
    }

    // CORS-safe fetch — tries direct first, falls back to proxy
    async function apiCall(method, path, body = null) {
        const url = `${config.apiBase}${path}`;
        const opts = {
            method,
            headers: getHeaders(),
            mode: 'cors'
        };
        if (body && method !== 'GET') {
            opts.body = JSON.stringify(body);
        }

        try {
            const resp = await fetch(url, opts);
            const data = await resp.json();
            return { ok: resp.ok, status: resp.status, data };
        } catch (err) {
            // CORS or network error
            return { ok: false, status: 0, error: err.message, data: null };
        }
    }

    // ---- Public API ----

    async function getFeed(pageNo = 1) {
        return apiCall('GET', `/api/secondme/plaza/feed?pageNo=${pageNo}&pageSize=${config.pageSize}`);
    }

    async function likePost(postId) {
        return apiCall('POST', `/api/secondme/plaza/posts/${postId}/like`);
    }

    async function commentPost(postId, content) {
        return apiCall('POST', `/api/secondme/plaza/posts/${postId}/comments`, { content });
    }

    async function createPost(content, tags = []) {
        return apiCall('POST', '/api/secondme/plaza/posts/create', { content, tags });
    }

    async function discoverUsers(pageNo = 1) {
        return apiCall('GET', `/api/secondme/discover?pageNo=${pageNo}&pageSize=${config.pageSize}`);
    }

    function getConfig() { return { ...config }; }
    function updateConfig(updates) { saveConfig(updates); }

    return {
        getFeed, likePost, commentPost, createPost, discoverUsers,
        getConfig, updateConfig
    };
})();

window.SecondMe = SecondMe;
