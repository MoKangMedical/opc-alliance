// ============================================
// OPC Alliance — SecondMe API Proxy (Cloudflare Worker)
// 
// 部署步骤:
// 1. 打开 https://dash.cloudflare.com
// 2. Workers & Pages → Create Worker
// 3. 粘贴此代码 → Deploy
// 4. 记下 Worker URL (如 https://opc-proxy.xxx.workers.dev)
// 5. 更新 opc-alliance secondme.js 的 proxyUrl
// ============================================

const TARGET = 'https://app.mindos.com/gate/lab';
const TOKEN = 'lba_at_b68964ac5cbb50eee8ac87eaadfe122fe5d8261684971e379656435f019f7b4d';

// Allowed origins (restrict in production)
const ALLOWED_ORIGINS = [
    'https://mokangmedical.github.io',
    'http://localhost:8080',
    'http://127.0.0.1:8080',
    'http://localhost:3000'
];

export default {
    async fetch(request, env, ctx) {
        const url = new URL(request.url);
        const origin = request.headers.get('Origin') || '';

        // CORS preflight
        if (request.method === 'OPTIONS') {
            return new Response(null, {
                headers: {
                    'Access-Control-Allow-Origin': ALLOWED_ORIGINS.includes(origin) ? origin : '*',
                    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                    'Access-Control-Max-Age': '86400',
                }
            });
        }

        // Health check
        if (url.pathname === '/' || url.pathname === '/health') {
            return new Response(JSON.stringify({
                status: 'ok',
                service: 'OPC Alliance — SecondMe Proxy',
                target: TARGET,
                time: new Date().toISOString()
            }), {
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                }
            });
        }

        // Proxy: /proxy?path=/api/secondme/plaza/feed&pageNo=1&pageSize=10
        const apiPath = url.searchParams.get('path');
        if (!apiPath) {
            return new Response(JSON.stringify({
                error: 'Missing ?path= parameter',
                usage: '/proxy?path=/api/secondme/plaza/feed&pageNo=1&pageSize=10'
            }), {
                status: 400,
                headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
            });
        }

        // Build target URL (exclude 'path' param, pass the rest)
        const targetUrl = new URL(TARGET + apiPath);
        url.searchParams.forEach((value, key) => {
            if (key !== 'path') {
                targetUrl.searchParams.set(key, value);
            }
        });

        try {
            const fetchOpts = {
                method: request.method,
                headers: {
                    'Authorization': `Bearer ${TOKEN}`,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
            };

            if (request.method !== 'GET' && request.method !== 'HEAD') {
                const body = await request.text();
                if (body) fetchOpts.body = body;
            }

            const resp = await fetch(targetUrl.toString(), fetchOpts);
            const data = await resp.text();

            return new Response(data, {
                status: resp.status,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': ALLOWED_ORIGINS.includes(origin) ? origin : '*',
                    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                    'Cache-Control': 'no-cache',
                }
            });
        } catch (err) {
            return new Response(JSON.stringify({
                code: 502,
                message: `Proxy error: ${err.message}`,
                target: targetUrl.toString()
            }), {
                status: 502,
                headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
            });
        }
    }
};
